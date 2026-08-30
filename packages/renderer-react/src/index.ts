/** Codekin browser plugin. */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { TraceWildOverlay } from './components/TraceWildOverlay.tsx'
import { TraceWildSettings } from './components/TraceWildSettings.tsx'
import { styleId, styleText } from './components/tracewild.module.css'
import { en, NS, zh } from './locales.ts'

// Standalone plugin declaration builds can resolve Cordis through a different
// workspace symlink than the Alpha client packages. Keep the exact public
// service and slot contracts local so the emitted plugin declarations remain
// deterministic outside the DSH monorepo.
declare module '@deepseek-ai/cordis' {
  interface Context {
    locale: LocaleRuntime
    slots: SlotRegistry
  }
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'settings.section': { kind: 'list'; scope: 'root'; owner: SettingsSectionOwnerProps }
  }
}

export const inject = ['slots', 'locale']

function installStyles(): () => void {
  if (typeof document === 'undefined') return () => undefined
  const existing = [...document.querySelectorAll<HTMLStyleElement>('style[data-plugin-css]')]
    .find(tag => tag.dataset.pluginCss === styleId)
  const tag = existing ?? document.createElement('style')
  tag.dataset.plugin = '@nath-vikky/dsh-codekin'
  tag.dataset.pluginCss = styleId
  tag.textContent = styleText
  if (existing === undefined) document.head.appendChild(tag)
  return () => {
    if (tag.dataset.pluginCss === styleId) tag.remove()
  }
}

export function apply(ctx: ClientContext): void {
  ctx.effect(installStyles, 'tracewild: styles')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'tracewild: dictionaries')
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'dsh-codekin',
    order: 80,
    locale: NS,
  }, TraceWildOverlay))
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-codekin',
    order: 150,
    label: () => ctx.locale.bind(NS)('settingsTitle'),
    locale: NS,
  }, TraceWildSettings))
}
