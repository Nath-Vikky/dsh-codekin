import { createHash } from 'node:crypto'
import { strict as assert } from 'node:assert'
import { spawn, spawnSync } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { request } from 'node:http'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'
import type { Page } from 'playwright-core'

export const DSH_LIFECYCLE_FORMAT = 'codekin-dsh-lifecycle-v1' as const
const DEFAULT_DSH_VERSION = '0.1.2-rc.1'
const PACKAGE_NAME = '@nath-vikky/dsh-codekin'
const API_PREFIX = '/api/tracewild'
const PROCESS_TIMEOUT_MS = 180_000
const SERVER_TIMEOUT_MS = 90_000
const BROWSER_URL_TIMEOUT_MS = 30_000

interface CommandResult {
  stdout: string
  stderr: string
}

interface HttpResult {
  status: number
  body: string
}

export interface DshLifecycleReport {
  format: typeof DSH_LIFECYCLE_FORMAT
  dshVersion: string
  source: string
  packageMode: 'tarball' | 'explicit'
  routesReady: boolean
  disabledSurvivedRestart: boolean
  progressSurvivedRestart: boolean
  saveSurvivedUninstall: boolean
  progressSurvivedReinstall: boolean
  browserSmoke: boolean
  browserChannel: string
  saveSha256: string
}

function appendLimited(current: string, chunk: string, maximum = 2 * 1024 * 1024): string {
  const next = current + chunk
  return next.length <= maximum ? next : next.slice(next.length - maximum)
}

function stripAnsi(value: string): string {
  return value.replace(/\u001B(?:\[[0-?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\u001B\\))/g, '')
}

export function redactLifecycleOutput(value: string): string {
  return stripAnsi(value).replace(/([?&]token=)[^&#\s)'"<>]+/gi, '$1[REDACTED]')
}

export function browserLaunchUrl(port: number, output: CommandResult): string | undefined {
  const logs = stripAnsi(`${output.stdout}\n${output.stderr}`)
  const announcements = logs.matchAll(/(?:^|\r?\n)dsh web:\s+(https?:\/\/[^\s(]+)/g)
  for (const announcement of announcements) {
    const candidate = announcement[1]
    if (candidate === undefined) continue
    try {
      const url = new URL(candidate)
      const loopback = url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '[::1]'
      if (loopback
        && Number(url.port) === port
        && url.pathname === '/'
        && url.searchParams.getAll('token').length === 1
        && url.searchParams.get('token') !== '') return candidate
    } catch {
      // Ignore unrelated or incomplete URL-shaped log fragments.
    }
  }
  return undefined
}

function spawnCommand(
  command: string,
  args: readonly string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): { child: ChildProcess; output: () => CommandResult } {
  let stdout = ''
  let stderr = ''
  const child = spawn(command, [...args], {
    cwd: options.cwd,
    env: options.env,
    windowsHide: true,
    shell: process.platform === 'win32',
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout?.setEncoding('utf8')
  child.stderr?.setEncoding('utf8')
  child.stdout?.on('data', (chunk: string) => { stdout = appendLimited(stdout, chunk) })
  child.stderr?.on('data', (chunk: string) => { stderr = appendLimited(stderr, chunk) })
  return { child, output: () => ({ stdout, stderr }) }
}

async function runCommand(
  command: string,
  args: readonly string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; timeoutMs?: number } = {},
): Promise<CommandResult> {
  const running = spawnCommand(command, args, options)
  const timeoutMs = options.timeoutMs ?? PROCESS_TIMEOUT_MS
  return await new Promise((resolvePromise, reject) => {
    const timeout = setTimeout(() => {
      void stopProcess(running.child).finally(() => {
        reject(new Error(`${command} timed out after ${timeoutMs} ms`))
      })
    }, timeoutMs)
    running.child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    running.child.once('exit', (code, signal) => {
      clearTimeout(timeout)
      const output = running.output()
      if (code === 0) resolvePromise(output)
      else reject(new Error([
        `${command} exited with ${code ?? signal ?? 'unknown'}`,
        output.stdout,
        output.stderr,
      ].filter(Boolean).join('\n')))
    })
  })
}

async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.pid === undefined) return
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      windowsHide: true,
      stdio: 'ignore',
    })
  } else {
    try { process.kill(-child.pid, 'SIGTERM') } catch { child.kill('SIGTERM') }
    await new Promise(resolvePromise => setTimeout(resolvePromise, 750))
    if (child.exitCode === null) {
      try { process.kill(-child.pid, 'SIGKILL') } catch { child.kill('SIGKILL') }
    }
  }
  await new Promise<void>((resolvePromise) => {
    if (child.exitCode !== null) resolvePromise()
    else {
      const timeout = setTimeout(resolvePromise, 5_000)
      child.once('exit', () => {
        clearTimeout(timeout)
        resolvePromise()
      })
    }
  })
}

function pnpmCommand(): string {
  return process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
}

function npmCommand(): string {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

async function freePort(): Promise<number> {
  return await new Promise((resolvePromise, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (address === null || typeof address === 'string') {
        server.close()
        reject(new Error('could not allocate a loopback port'))
        return
      }
      server.close(error => {
        if (error) reject(error)
        else resolvePromise(address.port)
      })
    })
  })
}

async function http(
  port: number,
  path: string,
  method = 'GET',
  value?: unknown,
): Promise<HttpResult> {
  const body = value === undefined ? undefined : JSON.stringify(value)
  return await new Promise((resolvePromise, reject) => {
    const req = request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        host: `127.0.0.1:${port}`,
        origin: `http://127.0.0.1:${port}`,
        'sec-fetch-site': 'same-origin',
        ...(body === undefined ? {} : {
          'content-type': 'application/json',
          'content-length': String(Buffer.byteLength(body)),
        }),
      },
    }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => { chunks.push(chunk) })
      res.on('end', () => {
        resolvePromise({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8') })
      })
    })
    req.once('error', reject)
    req.setTimeout(5_000, () => { req.destroy(new Error('request timeout')) })
    if (body !== undefined) req.write(body)
    req.end()
  })
}

async function waitForCodekin(port: number, child: ChildProcess, output: () => CommandResult): Promise<void> {
  const deadline = Date.now() + SERVER_TIMEOUT_MS
  let lastError: unknown
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      const logs = output()
      throw new Error(redactLifecycleOutput(`DSH exited before Codekin was ready\n${logs.stdout}\n${logs.stderr}`))
    }
    try {
      const response = await http(port, `${API_PREFIX}/state`)
      if (response.status === 200) return
      lastError = new Error(`state route returned ${response.status}: ${response.body}`)
    } catch (error) {
      lastError = error
    }
    await new Promise(resolvePromise => setTimeout(resolvePromise, 250))
  }
  const logs = output()
  throw new Error(redactLifecycleOutput(`Codekin did not become ready: ${String(lastError)}\n${logs.stdout}\n${logs.stderr}`))
}

async function waitForBrowserUrl(port: number, child: ChildProcess, output: () => CommandResult): Promise<string> {
  const deadline = Date.now() + BROWSER_URL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const browserUrl = browserLaunchUrl(port, output())
    if (browserUrl !== undefined) return browserUrl
    if (child.exitCode !== null) {
      const logs = output()
      throw new Error(redactLifecycleOutput(`DSH exited before announcing its authenticated browser URL\n${logs.stdout}\n${logs.stderr}`))
    }
    await new Promise(resolvePromise => setTimeout(resolvePromise, 100))
  }
  throw new Error('DSH did not announce an authenticated loopback browser URL')
}

async function startDsh(dshVersion: string, env: NodeJS.ProcessEnv): Promise<{
  child: ChildProcess
  port: number
  browserUrl: string
  output: () => CommandResult
}> {
  const port = await freePort()
  const running = spawnCommand(pnpmCommand(), [
    'dlx', `@deepseek-ai/dsh@${dshVersion}`,
    'web', '--no-open', '--host', '127.0.0.1', '--port', String(port),
  ], { env })
  await waitForCodekin(port, running.child, running.output)
  const browserUrl = await waitForBrowserUrl(port, running.child, running.output)
  return { child: running.child, port, browserUrl, output: running.output }
}

async function visibleDialogSummaries(page: Page): Promise<unknown[]> {
  return await page.locator('[role="dialog"]:visible').evaluateAll(elements => elements.map(element => ({
    label: element.getAttribute('aria-label') ?? element.getAttribute('aria-labelledby') ?? '',
    text: (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 500),
    buttons: [...element.querySelectorAll('button')].map(button => (
      button.getAttribute('aria-label') ?? button.getAttribute('title') ?? button.textContent ?? ''
    )).map(value => value.replace(/\s+/g, ' ').trim()).filter(Boolean),
  })))
}

async function dismissDshStartupDialogs(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const dialog = page.locator('[role="dialog"]:visible').first()
    try {
      await dialog.waitFor({ state: 'visible', timeout: 10_000 })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Timeout')) return
      throw error
    }

    const acknowledgement = dialog.getByRole('button', { name: /^(继续|Continue)$/i })
    const configureLater = dialog.getByRole('button', { name: /^(稍后配置|Configure later)$/i })
    if (await acknowledgement.count() > 0 && await acknowledgement.first().isVisible()) {
      await acknowledgement.first().click()
      await acknowledgement.first().waitFor({ state: 'hidden', timeout: 5_000 })
      continue
    }
    if (await configureLater.count() > 0 && await configureLater.first().isVisible()) {
      await configureLater.first().click()
      await configureLater.first().waitFor({ state: 'hidden', timeout: 5_000 })
      return
    }
    throw new Error(`unsupported DSH startup dialog: ${JSON.stringify(await visibleDialogSummaries(page))}`)
  }
  const remaining = await visibleDialogSummaries(page)
  if (remaining.length > 0) throw new Error(`too many DSH startup dialogs: ${JSON.stringify(remaining)}`)
}

async function runBrowserSmoke(browserUrl: string): Promise<string> {
  const preferred = process.env.CODEKIN_BROWSER_CHANNEL
  const channels = [...new Set([preferred, 'chrome', 'msedge'].filter((value): value is string => value !== undefined))]
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
  let channel = ''
  const failures: string[] = []
  for (const candidate of channels) {
    try {
      browser = await chromium.launch({ headless: true, channel: candidate })
      channel = candidate
      break
    } catch (error) {
      failures.push(`${candidate}: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`)
    }
  }
  if (browser === undefined) {
    try {
      browser = await chromium.launch({ headless: true })
      channel = 'bundled-chromium'
    } catch (error) {
      failures.push(`bundled-chromium: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`)
      throw new Error(`no Playwright browser is available; install Chrome/Edge or run playwright install chromium\n${failures.join('\n')}`)
    }
  }

  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  try {
    const context = await browser.newContext({ locale: 'zh-CN', reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } })
    const page = await context.newPage()
    page.on('pageerror', error => { pageErrors.push(error.message) })
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    await page.goto(browserUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    const launcher = page.getByRole('button', { name: /打开码灵|Open Codekin/i })
    await launcher.waitFor({ state: 'visible', timeout: 30_000 })
    await dismissDshStartupDialogs(page)
    await launcher.click()
    const app = page.getByRole('region', { name: /^(码灵|Codekin)$/i })
    await app.waitFor({ state: 'visible', timeout: 10_000 })
    await app.getByRole('navigation').getByRole('button', { name: /^(码灵|Codekin)$/i }).click()

    const card = page.locator("main article button[aria-label*='码灵详情'], main article button[aria-label*='Codekin details']").first()
    await card.waitFor({ state: 'visible', timeout: 10_000 })
    const cardLabel = await card.getAttribute('aria-label')
    await card.click()
    const dialog = page.getByRole('dialog').filter({ has: page.locator('#codekin-detail-title') })
    await dialog.waitFor({ state: 'visible', timeout: 10_000 })
    const close = dialog.getByRole('button', { name: /关闭码灵详情|Close Codekin details/i })
    assert.equal(await close.evaluate(element => element === document.activeElement), true, 'detail close button should receive initial focus')
    const focusable = dialog.locator([
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(','))
    const lastControl = focusable.last()
    assert.ok(await focusable.count() > 0, 'detail dialog requires at least one focusable control')
    await close.press('Shift+Tab')
    assert.equal(await lastControl.evaluate(element => element === document.activeElement), true, 'Shift+Tab should wrap to the last enabled dialog control')
    await lastControl.press('Tab')
    assert.equal(await close.evaluate(element => element === document.activeElement), true, 'Tab should wrap to the first dialog control')
    await dialog.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 5_000 })
    assert.equal(await card.evaluate(element => element === document.activeElement), true, 'closing the detail should restore card focus')

    await app.getByRole('button', { name: /^(分类|Classify)$/i }).click()
    const descending = app.getByRole('button', { name: /等级降序|Level descending/i })
    await descending.click()
    assert.equal(await descending.getAttribute('aria-pressed'), 'true', 'descending sort should expose its pressed state')
    await app.getByRole('button', { name: /调整编队|Edit squad/i }).click()
    const cancel = app.getByRole('button', { name: /^(取消|Cancel)$/i })
    await cancel.waitFor({ state: 'visible', timeout: 5_000 })
    assert.equal(await app.locator("main article button[aria-pressed='true']").count(), 1, 'starter should occupy one editable squad slot')
    await cancel.click()
    const search = app.getByRole('searchbox', { name: /搜索名称或图鉴编号|Search name or index number/i })
    await search.fill('no-codekin-with-this-name')
    assert.equal(await app.locator('main article').count(), 0, 'search should filter the roster')
    await app.getByRole('button', { name: /^(重置|Reset)$/i }).click()
    assert.equal(await app.locator('main article').count(), 1, 'reset should restore the starter card')
    const navigation = app.getByRole('navigation')
    await navigation.locator('[aria-current="page"]').focus()
    await page.keyboard.press('ArrowRight')
    assert.equal(await navigation.locator('[data-tab="dex"]').getAttribute('aria-current'), 'page', 'arrow navigation should select the next page')
    assert.equal(await navigation.locator('button[tabindex="0"]').count(), 1, 'navigation has one tab stop')
    assert.equal(await app.getAttribute('data-motion'), 'reduce', 'system reduced motion should be respected')
    const motionToggle = app.getByRole('button', { name: /^(减少动态效果|Reduce motion)$/i })
    await motionToggle.click()
    assert.equal(await app.getAttribute('data-motion'), 'full', 'the player can explicitly enable full motion even when the OS reduces it')
    assert.equal(await motionToggle.getAttribute('aria-pressed'), 'false')
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('codekin.ui.v1') ?? '{}').reducedMotion), false,
      'the full motion choice should survive reloads')
    await app.getByRole('button', { name: /^(关闭|Close)$/i }).click()
    await launcher.waitFor({ state: 'visible', timeout: 5_000 })
    await page.waitForFunction(() => Boolean(document.activeElement?.getAttribute('aria-label')?.match(/打开码灵|Open Codekin/i)))
    assert.equal(await launcher.evaluate(element => element === document.activeElement), true, 'closing the window should restore launcher focus')

    assert.equal(pageErrors.length, 0, `page errors: ${pageErrors.join('; ')}`)
    assert.equal(consoleErrors.length, 0, `console errors: ${consoleErrors.join('; ')}`)
    assert.ok(cardLabel !== null && cardLabel.length > 0, 'Codekin card requires an accessible name')
    await context.close()
    return channel
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const redacted = redactLifecycleOutput(message)
    if (error instanceof Error && redacted === message) throw error
    throw new Error(redacted)
  } finally {
    await browser.close()
  }
}

async function jsonRequest(port: number, path: string, method = 'GET', value?: unknown): Promise<Record<string, unknown>> {
  const response = await http(port, path, method, value)
  if (response.status !== 200) throw new Error(`${method} ${path} returned ${response.status}: ${response.body}`)
  return JSON.parse(response.body) as Record<string, unknown>
}

function stateFrom(snapshot: Record<string, unknown>): Record<string, unknown> {
  const state = snapshot.state
  if (typeof state !== 'object' || state === null || Array.isArray(state)) throw new Error('state route returned an invalid snapshot')
  return state as Record<string, unknown>
}

function assertPersistedState(snapshot: Record<string, unknown>): void {
  const state = stateFrom(snapshot)
  const creatures = state.creatures
  if (state.enabled !== false || !Array.isArray(creatures)
    || (creatures[0] as Record<string, unknown> | undefined)?.creatureId !== 'lumen-indeximp') {
    throw new Error('disabled starter progress did not survive the lifecycle transition')
  }
}

async function sha256(filename: string): Promise<string> {
  return createHash('sha256').update(await readFile(filename)).digest('hex')
}

async function packTarball(root: string): Promise<string> {
  const output = await runCommand(npmCommand(), [
    'pack', '--ignore-scripts', '--json', '--pack-destination', root,
  ], { cwd: process.cwd() })
  const parsed = JSON.parse(output.stdout) as { filename?: string }[]
  const filename = parsed[0]?.filename
  if (filename === undefined) throw new Error(`npm pack did not report a filename: ${output.stdout}`)
  return resolve(root, filename)
}

async function pluginCommand(
  dshVersion: string,
  env: NodeJS.ProcessEnv,
  command: 'add' | 'remove',
  value: string,
): Promise<void> {
  const args = [
    'dlx', `@deepseek-ai/dsh@${dshVersion}`,
    'plugin', '--profile', 'web', command,
    ...(command === 'add' ? ['--ignore-scripts'] : []),
    value,
  ]
  await runCommand(pnpmCommand(), args, { env })
}

async function verifyDumpConfig(dshVersion: string, env: NodeJS.ProcessEnv): Promise<void> {
  const result = await runCommand(pnpmCommand(), [
    'dlx', `@deepseek-ai/dsh@${dshVersion}`,
    '--profile', 'web', '--dump-config',
  ], { env })
  if (!result.stdout.includes('dsh-codekin')) throw new Error('composed DSH profile does not contain dsh-codekin')
}

export async function runDshLifecycle(options: {
  dshVersion?: string
  source?: string
  keep?: boolean
  browser?: boolean
} = {}): Promise<{ report: DshLifecycleReport; temporaryRoot?: string }> {
  const dshVersion = options.dshVersion ?? DEFAULT_DSH_VERSION
  const root = await mkdtemp(join(tmpdir(), 'codekin-dsh-lifecycle-'))
  const home = join(root, 'home')
  const env = { ...process.env, DSH_HOME: home, BROWSER: 'none' }
  let source = options.source
  let active: ChildProcess | undefined
  let succeeded = false
  try {
    if (source === undefined) source = await packTarball(root)
    await pluginCommand(dshVersion, env, 'add', source)
    await verifyDumpConfig(dshVersion, env)

    let server = await startDsh(dshVersion, env)
    active = server.child
    const initial = await jsonRequest(server.port, `${API_PREFIX}/state`)
    const initialState = stateFrom(initial)
    if (initialState.starterChosen !== true) {
      await jsonRequest(server.port, `${API_PREFIX}/action`, 'POST', {
        type: 'choose-starter', creatureId: 'lumen-indeximp',
      })
    }
    const browserChannel = options.browser === false ? 'skipped' : await runBrowserSmoke(server.browserUrl)
    await jsonRequest(server.port, `${API_PREFIX}/action`, 'POST', { type: 'set-enabled', enabled: false })
    const disabled = await jsonRequest(server.port, `${API_PREFIX}/state`)
    assertPersistedState(disabled)
    await stopProcess(server.child)
    active = undefined

    const save = join(home, 'codekinsave', 'state.json')
    if (!existsSync(save)) throw new Error('Codekin did not create codekinsave/state.json')
    const savedDigest = await sha256(save)

    server = await startDsh(dshVersion, env)
    active = server.child
    assertPersistedState(await jsonRequest(server.port, `${API_PREFIX}/state`))
    await stopProcess(server.child)
    active = undefined

    await pluginCommand(dshVersion, env, 'remove', PACKAGE_NAME)
    if (!existsSync(save) || await sha256(save) !== savedDigest) {
      throw new Error('plugin uninstall removed or modified the Codekin save')
    }

    await pluginCommand(dshVersion, env, 'add', source)
    await verifyDumpConfig(dshVersion, env)
    server = await startDsh(dshVersion, env)
    active = server.child
    assertPersistedState(await jsonRequest(server.port, `${API_PREFIX}/state`))
    await stopProcess(server.child)
    active = undefined

    const report: DshLifecycleReport = Object.freeze({
      format: DSH_LIFECYCLE_FORMAT,
      dshVersion,
      source,
      packageMode: options.source === undefined ? 'tarball' : 'explicit',
      routesReady: true,
      disabledSurvivedRestart: true,
      progressSurvivedRestart: true,
      saveSurvivedUninstall: true,
      progressSurvivedReinstall: true,
      browserSmoke: options.browser !== false,
      browserChannel,
      saveSha256: savedDigest,
    })
    succeeded = true
    return { report, ...(options.keep ? { temporaryRoot: root } : {}) }
  } finally {
    if (active !== undefined) await stopProcess(active)
    if (succeeded && options.keep !== true) await rm(root, { recursive: true, force: true })
    else if (!succeeded) console.error(`Lifecycle workspace retained for diagnostics: ${root}`)
  }
}

export async function dshLifecycleCli(argv: readonly string[]): Promise<number> {
  let dshVersion = DEFAULT_DSH_VERSION
  let source: string | undefined
  let output: string | undefined
  let keep = false
  let json = false
  let browser = true
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!
    const value = (): string => {
      const next = argv[++index]
      if (next === undefined) throw new TypeError(`${argument} requires a value`)
      return next
    }
    if (argument === '--dsh-version') dshVersion = value()
    else if (argument === '--source') source = value()
    else if (argument === '--output') output = resolve(value())
    else if (argument === '--keep') keep = true
    else if (argument === '--skip-browser') browser = false
    else if (argument === '--json') json = true
    else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node tools/dsh-lifecycle.ts [--dsh-version 0.1.2-rc.1] [--source package-spec] [--skip-browser] [--keep] [--json] [--output report.json]')
      return 0
    } else throw new TypeError(`unknown option ${argument}`)
  }
  const result = await runDshLifecycle({ dshVersion, ...(source === undefined ? {} : { source }), keep, browser })
  if (output !== undefined) await writeFile(output, `${JSON.stringify(result.report, null, 2)}\n`, 'utf8')
  if (json) console.log(JSON.stringify(result.report, null, 2))
  else console.log(`DSH lifecycle OK: ${result.report.packageMode}, save ${result.report.saveSha256}${result.temporaryRoot === undefined ? '' : `, kept at ${result.temporaryRoot}`}`)
  return 0
}

const isMain = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  dshLifecycleCli(process.argv.slice(2)).then(code => {
    process.exitCode = code
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error))
    process.exitCode = 1
  })
}
