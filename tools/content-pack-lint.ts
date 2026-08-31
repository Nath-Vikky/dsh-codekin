import { readFile, stat, writeFile } from 'node:fs/promises'
import { extname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import {
  ContentPackValidationError,
  contentPackIssues,
  createContentRegistry,
} from '../packages/content-sdk/src/index.ts'
import type {
  CodekinContentPack,
  ContentValidationIssue,
} from '../packages/content-sdk/src/types.ts'
import { CODEKIN_ENGINE_VERSION } from '../packages/engine/src/content.ts'
import { mechanicsContractIssues } from '../packages/engine/src/mechanics-contract.ts'

export const CONTENT_PACK_LINT_FORMAT = 'codekin-pack-lint-v1' as const
const DEFAULT_MAX_ASSET_BYTES = 4 * 1024 * 1024
const DEFAULT_MAX_PACK_ASSET_BYTES = 32 * 1024 * 1024

export interface ContentPackLintInput {
  pack: unknown
  source: string
  assetRoot?: string | URL
}

export interface ContentPackLintOptions {
  engineVersion?: string
  maxAssetBytes?: number
  maxPackAssetBytes?: number
}

export interface ContentPackLintIssue extends ContentValidationIssue {
  source: string
}

export interface ContentPackLintPackSummary {
  id: string
  version: string
  creatures: number
  mechanics: number
  assets: number
  assetBytes: number
}

export interface ContentPackLintReport {
  format: typeof CONTENT_PACK_LINT_FORMAT
  ok: boolean
  engineVersion: string
  packs: readonly ContentPackLintPackSummary[]
  issues: readonly ContentPackLintIssue[]
}

function addIssues(
  output: ContentPackLintIssue[],
  source: string,
  issues: readonly ContentValidationIssue[],
): void {
  output.push(...issues.map(issue => ({ ...issue, source })))
}

function isWithin(root: string, candidate: string): boolean {
  const path = relative(root, candidate)
  return path === '' || (!path.startsWith('..') && !isAbsolute(path))
}

function expectedExtension(mime: CodekinContentPack['assets'][number]['mime']): string {
  return mime === 'image/png' ? '.png' : '.webp'
}

function hasExpectedSignature(bytes: Uint8Array, mime: CodekinContentPack['assets'][number]['mime']): boolean {
  if (mime === 'image/png') {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    return png.every((byte, index) => bytes[index] === byte)
  }
  return bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
}

async function lintAssets(
  input: ContentPackLintInput & { pack: CodekinContentPack },
  issues: ContentPackLintIssue[],
  maximumAssetBytes: number,
  maximumPackAssetBytes: number,
): Promise<number> {
  if (input.pack.assets.length === 0) return 0
  if (input.assetRoot === undefined) {
    issues.push({ source: input.source, path: '/assets', message: 'asset root is required to verify files' })
    return 0
  }
  const assetRoot = input.assetRoot instanceof URL
    ? resolve(fileURLToPath(input.assetRoot))
    : resolve(input.assetRoot)
  let totalBytes = 0
  for (const asset of input.pack.assets) {
    const path = resolve(assetRoot, asset.path)
    const issuePath = `/assets/${asset.key}`
    if (!isWithin(assetRoot, path)) {
      issues.push({ source: input.source, path: issuePath, message: 'asset path escapes the configured root' })
      continue
    }
    if (extname(path).toLowerCase() !== expectedExtension(asset.mime)) {
      issues.push({ source: input.source, path: issuePath, message: `extension does not match ${asset.mime}` })
    }
    try {
      const metadata = await stat(path)
      if (!metadata.isFile()) {
        issues.push({ source: input.source, path: issuePath, message: `asset is not a file: ${asset.path}` })
        continue
      }
      totalBytes += metadata.size
      if (metadata.size > maximumAssetBytes) {
        issues.push({ source: input.source, path: issuePath, message: `asset exceeds ${maximumAssetBytes} bytes` })
      }
      const signature = await readFile(path).then(bytes => bytes.subarray(0, 12))
      if (!hasExpectedSignature(signature, asset.mime)) {
        issues.push({ source: input.source, path: issuePath, message: `file signature does not match ${asset.mime}` })
      }
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'unknown'
      issues.push({ source: input.source, path: issuePath, message: `asset cannot be read (${code}): ${asset.path}` })
    }
  }
  if (totalBytes > maximumPackAssetBytes) {
    issues.push({
      source: input.source,
      path: '/assets',
      message: `pack assets total ${totalBytes} bytes, exceeding ${maximumPackAssetBytes}`,
    })
  }
  return totalBytes
}

export async function lintContentPacks(
  inputs: readonly ContentPackLintInput[],
  options: ContentPackLintOptions = {},
): Promise<ContentPackLintReport> {
  const engineVersion = options.engineVersion ?? CODEKIN_ENGINE_VERSION
  const maximumAssetBytes = options.maxAssetBytes ?? DEFAULT_MAX_ASSET_BYTES
  const maximumPackAssetBytes = options.maxPackAssetBytes ?? DEFAULT_MAX_PACK_ASSET_BYTES
  const issues: ContentPackLintIssue[] = []
  const valid: (ContentPackLintInput & { pack: CodekinContentPack })[] = []
  for (const input of inputs) {
    const schemaIssues = contentPackIssues(input.pack)
    addIssues(issues, input.source, schemaIssues)
    if (schemaIssues.length === 0) valid.push(input as ContentPackLintInput & { pack: CodekinContentPack })
  }
  if (valid.length === inputs.length) {
    try {
      createContentRegistry(valid.map(input => input.pack), { engineVersion })
    } catch (error) {
      if (error instanceof ContentPackValidationError) addIssues(issues, 'registry', error.issues)
      else throw error
    }
  }
  for (const input of valid) addIssues(issues, input.source, mechanicsContractIssues(input.pack.mechanics))
  const assetTotals = await Promise.all(valid.map(input => lintAssets(
    input,
    issues,
    maximumAssetBytes,
    maximumPackAssetBytes,
  )))
  const packs = valid.map((input, index) => Object.freeze({
    id: input.pack.manifest.id,
    version: input.pack.manifest.version,
    creatures: input.pack.creatures.length,
    mechanics: input.pack.mechanics.length,
    assets: input.pack.assets.length,
    assetBytes: assetTotals[index] ?? 0,
  }))
  issues.sort((left, right) => left.source.localeCompare(right.source) || left.path.localeCompare(right.path)
    || left.message.localeCompare(right.message))
  return Object.freeze({
    format: CONTENT_PACK_LINT_FORMAT,
    ok: issues.length === 0,
    engineVersion,
    packs: Object.freeze(packs),
    issues: Object.freeze(issues),
  })
}

interface CliOptions {
  engineVersion: string
  json: boolean
  output?: string
  specs: string[]
  assetRoots: Map<string, string>
}

function nextArgument(argv: readonly string[], index: number, option: string): string {
  const value = argv[index + 1]
  if (value === undefined) throw new TypeError(`${option} requires a value`)
  return value
}

function parseCli(argv: readonly string[]): CliOptions | undefined {
  const options: CliOptions = {
    engineVersion: CODEKIN_ENGINE_VERSION,
    json: false,
    specs: [],
    assetRoots: new Map(),
  }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!
    if (argument === '--engine-version') options.engineVersion = nextArgument(argv, index++, argument)
    else if (argument === '--asset-root') {
      const value = nextArgument(argv, index++, argument)
      const separator = value.indexOf('=')
      if (separator <= 0 || separator === value.length - 1) {
        throw new TypeError('--asset-root must use <pack-id>=<directory>')
      }
      options.assetRoots.set(value.slice(0, separator), value.slice(separator + 1))
    } else if (argument === '--output') options.output = nextArgument(argv, index++, argument)
    else if (argument === '--json') options.json = true
    else if (argument === '--help' || argument === '-h') return undefined
    else if (argument.startsWith('-')) throw new TypeError(`unknown option ${argument}`)
    else options.specs.push(argument)
  }
  return options
}

async function loadPack(spec: string): Promise<{ pack: unknown; source: string }> {
  const fragment = spec.lastIndexOf('#')
  const modulePath = fragment < 0 ? spec : spec.slice(0, fragment)
  const exportName = fragment < 0 ? undefined : spec.slice(fragment + 1)
  const absolute = resolve(modulePath)
  if (modulePath.endsWith('.json')) {
    if (exportName !== undefined) throw new TypeError('JSON pack specs cannot select an export')
    return { pack: JSON.parse(await readFile(absolute, 'utf8')) as unknown, source: spec }
  }
  const module = await import(pathToFileURL(absolute).href) as Record<string, unknown>
  if (exportName !== undefined) {
    if (!(exportName in module)) throw new TypeError(`${spec} does not export ${exportName}`)
    return { pack: module[exportName], source: spec }
  }
  if (module.default !== undefined) return { pack: module.default, source: spec }
  const candidates = Object.values(module).filter(value => {
    const row = typeof value === 'object' && value !== null ? value as Record<string, unknown> : undefined
    return row !== undefined && row.manifest !== undefined && Array.isArray(row.creatures)
  })
  if (candidates.length !== 1) throw new TypeError(`${spec} must have a default export or one unambiguous content-pack export`)
  return { pack: candidates[0], source: spec }
}

export async function contentPackLintCli(argv: readonly string[]): Promise<number> {
  const options = parseCli(argv)
  if (options === undefined) {
    console.log([
      'Usage: node tools/content-pack-lint.ts [options] [module[#export] ...]',
      '  --engine-version <version>',
      '  --asset-root <pack-id>=<directory>',
      '  --json',
      '  --output <report.json>',
      'With no module arguments, the bundled core pack and assets are checked.',
    ].join('\n'))
    return 0
  }
  let inputs: ContentPackLintInput[]
  if (options.specs.length === 0) {
    inputs = [{ pack: CORE_CONTENT_PACK, source: 'core', assetRoot: resolve('assets/creatures') }]
  } else {
    const loaded = await Promise.all(options.specs.map(loadPack))
    inputs = loaded.map(row => {
      const pack = typeof row.pack === 'object' && row.pack !== null
        ? row.pack as Partial<CodekinContentPack>
        : undefined
      const id = pack?.manifest?.id
      const assetRoot = id === undefined ? undefined : options.assetRoots.get(id)
      return { ...row, ...(assetRoot === undefined ? {} : { assetRoot }) }
    })
  }
  const report = await lintContentPacks(inputs, { engineVersion: options.engineVersion })
  if (options.output !== undefined) await writeFile(resolve(options.output), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  if (options.json) console.log(JSON.stringify(report, null, 2))
  else if (report.ok) {
    const totals = report.packs.reduce((sum, pack) => sum + pack.assetBytes, 0)
    console.log(`Content packs OK: ${report.packs.length} pack(s), ${report.packs.reduce((sum, pack) => sum + pack.creatures, 0)} creatures, ${totals} asset bytes`)
  } else {
    for (const issue of report.issues) console.error(`${issue.source}${issue.path}: ${issue.message}`)
  }
  return report.ok ? 0 : 1
}

const isMain = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  contentPackLintCli(process.argv.slice(2)).then(code => {
    process.exitCode = code
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
