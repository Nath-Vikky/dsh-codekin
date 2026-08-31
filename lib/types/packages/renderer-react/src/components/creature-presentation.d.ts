import type { CaptureCoreQuality, CreatureDefinition, TraceEcology } from '../../../engine/src/types.ts';
import type { TraceWildLocaleKey } from '../locales.ts';
export declare const ECOLOGY_KEYS: Record<TraceEcology, TraceWildLocaleKey>;
export declare const CORE_KEYS: Record<CaptureCoreQuality, TraceWildLocaleKey>;
export declare const RARITY_KEYS: {
    readonly common: "rarityCommon";
    readonly uncommon: "rarityUncommon";
    readonly rare: "rarityRare";
    readonly apex: "rarityApex";
};
export declare const CreatureSprite: import("react").MemoExoticComponent<(props: {
    creature: CreatureDefinition;
    size?: "tiny" | "small" | "medium" | "large";
    unknown?: boolean;
    eager?: boolean;
}) => import("react/jsx-runtime").JSX.Element>;
export declare function creatureName(creature: CreatureDefinition, zh: boolean): string;
//# sourceMappingURL=creature-presentation.d.ts.map