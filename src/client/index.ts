/** Codekin browser plugin. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { TraceWildOverlay } from './components/TraceWildOverlay.tsx'
import { TraceWildSettings } from './components/TraceWildSettings.tsx'
import { en, NS, zh } from './locales.ts'

// rc.5 re-exports the owner type but does not retain its SlotMap augmentation
// in every standalone consumer declaration build, so keep the exact contract
// local as well. It is identical to the canonical settings-domain entry.
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'settings.section': { kind: 'list'; scope: 'root'; owner: SettingsSectionOwnerProps }
  }
}

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
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
