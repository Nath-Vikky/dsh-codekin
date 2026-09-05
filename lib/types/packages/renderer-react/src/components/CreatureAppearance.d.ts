import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { CapturedCreature, CreatureAppearance, CreatureDefinition } from '../../../engine/src/types.ts';
type Translate = PropsLocale<'tracewild'>['t'];
export declare function CreatureAppearancePortrait(props: {
    captured: CapturedCreature;
    creature: CreatureDefinition;
    reducedMotion: boolean;
    t: Translate;
    onChanging: (changing: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function CreatureAppearancePicker(props: {
    captured: CapturedCreature;
    creature: CreatureDefinition;
    t: Translate;
    busy: boolean;
    battleActive: boolean;
    onSelect: (appearance: CreatureAppearance) => void;
    onClose: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CreatureAppearance.d.ts.map