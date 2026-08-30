/** Codekin browser plugin. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client';
import type { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/client';
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client';
declare module '@deepseek-ai/cordis' {
    interface Context {
        locale: LocaleRuntime;
        slots: SlotRegistry;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        'settings.section': {
            kind: 'list';
            scope: 'root';
            owner: SettingsSectionOwnerProps;
        };
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map