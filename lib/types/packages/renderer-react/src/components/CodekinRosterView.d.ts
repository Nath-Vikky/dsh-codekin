import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { CapturedCreature, CreatureDefinition, TraceWildAction, TraceWildActionResponse, TraceWildSnapshot } from '../../../engine/src/types.ts';
type TraceWildTranslate = PropsLocale<'tracewild'>['t'];
export declare function CodekinView(props: {
    state: TraceWildSnapshot['state'];
    t: TraceWildTranslate;
    zh: boolean;
    draft: string[];
    setDraft: (value: string[]) => void;
    busy: boolean;
    save: () => Promise<boolean>;
    inspect: (instanceId: string) => void;
    onEditingChange?: (editing: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function CodekinDetailModal(props: {
    captured: CapturedCreature;
    creature: CreatureDefinition;
    state: TraceWildSnapshot['state'];
    t: TraceWildTranslate;
    zh: boolean;
    busy: boolean;
    reducedMotion?: boolean;
    act: (action: TraceWildAction) => Promise<TraceWildActionResponse | undefined>;
    dismiss: () => void;
    release: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CodekinRosterView.d.ts.map