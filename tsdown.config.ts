import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'tsdown'
import { transform } from 'lightningcss'

const PACKAGE_ID = '@nath-vikky/dsh-codekin'
const CSS_PREFIX = '\0tracewild-css:'
const CSS_SUFFIX = '.mjs'
const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url))
const CSS_FILES = new Map<string, string>()
const HOST_EXTERNALS = new Set([
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-host-webserver',
  '@deepseek-ai/dsh-session',
])
const CLIENT_EXTERNALS = new Set([
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-settings/client',
  '@deepseek-ai/dsh-client-ui-primitives',
])

function sourceAssetPath(source: string, importer: string): string {
  const emitted = resolve(dirname(importer), source)
  if (existsSync(emitted)) return emitted
  const marker = `${sep}lib${sep}types${sep}`
  const boundary = emitted.indexOf(marker)
  if (boundary < 0) return emitted
  const sourceRelative = emitted.slice(boundary + marker.length)
  return resolve(emitted.slice(0, boundary), sourceRelative)
}

const host: UserConfig = {
  name: PACKAGE_ID,
  entry: {
    index: 'lib/types/src/index.js',
    engine: 'lib/types/src/core-runtime.js',
    content: 'lib/types/packages/content-sdk/src/index.js',
    'content-core': 'lib/types/content-packs/core/src/index.js',
  },
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  sourcemap: true,
  clean: false,
  deps: {
    neverBundle: specifier => HOST_EXTERNALS.has(specifier),
  },
}

const client: UserConfig = {
  name: `${PACKAGE_ID}/client`,
  entry: { client: 'lib/types/packages/renderer-react/src/index.js' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  target: 'es2024',
  dts: false,
  sourcemap: true,
  clean: false,
  deps: {
    neverBundle: specifier => CLIENT_EXTERNALS.has(specifier),
    alwaysBundle: specifier => !CLIENT_EXTERNALS.has(specifier),
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  plugins: [{
    name: 'tracewild-client-bundle-purity',
    resolveId(source: string) {
      if (!source.startsWith('@deepseek-ai/')) return null
      if (CLIENT_EXTERNALS.has(source)) return null
      throw new Error(
        `client bundle purity: ${source} is neither a requested module nor an inline-safe contract`,
      )
    },
  }, {
    name: 'tracewild-css-modules-inline',
    resolveId(source: string, importer: string | undefined) {
      if (!source.endsWith('.module.css')) return null
      const file = importer === undefined ? source : sourceAssetPath(source, importer)
      const logicalId = relative(PROJECT_ROOT, file).split(sep).join('/')
      const virtualId = CSS_PREFIX + logicalId + CSS_SUFFIX
      CSS_FILES.set(virtualId, file)
      return virtualId
    },
    async load(virtualId: string) {
      if (!virtualId.startsWith(CSS_PREFIX)) return null
      const file = CSS_FILES.get(virtualId)
      if (file === undefined) throw new Error(`missing CSS source for ${virtualId}`)
      const logicalId = virtualId.slice(CSS_PREFIX.length, -CSS_SUFFIX.length)
      this.addWatchFile(file)
      const result = transform({
        // lightningcss includes the filename in CSS-module hashes. Keep it
        // repository-relative so committed GitHub-install artifacts are
        // reproducible across checkout paths and operating systems.
        filename: logicalId,
        code: await readFile(file),
        cssModules: { pattern: '[hash]_[local]' },
        minify: true,
      })
      const classes: Record<string, string> = {}
      for (const [local, value] of Object.entries(result.exports ?? {})
        .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)) {
        classes[local] = value.name
      }
      const tagId = `${PACKAGE_ID}/${basename(file)}`
      return [
        `const css=${JSON.stringify(result.code.toString())};`,
        `const tagId=${JSON.stringify(tagId)};`,
        'export {tagId as styleId,css as styleText};',
        `export default ${JSON.stringify(classes)};`,
      ].join('\n')
    },
  }],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PACKAGE_ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [host, client]
