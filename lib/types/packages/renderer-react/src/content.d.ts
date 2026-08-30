import type { CaptureCoreQuality, CreatureDefinition, CreatureSkillDefinition } from '../../content-sdk/src/types.ts';
import type { CodekinContentView } from '../../content-sdk/src/view.ts';
/** Treats Host content as untrusted JSON before it reaches React or asset URLs. */
export declare function parseCodekinContentView(value: unknown): CodekinContentView;
export declare function activateCodekinContent(value: CodekinContentView): void;
export declare function creatureCatalog(): readonly CreatureDefinition[];
export declare function creatureById(id: string): CreatureDefinition | undefined;
export declare function skillByCreatureId(id: string): CreatureSkillDefinition | undefined;
export declare function starterCreatureIds(): readonly string[];
export declare function contentAssetUrl(key: string): string | undefined;
export declare const MAX_CONTENT_TOWER_FLOOR = 999999;
export declare function contentTowerFloorProfile(floorValue: number): {
    floor: number;
    creatureId: string;
    level: number;
    quality: CaptureCoreQuality;
    skillTier: 1 | 2 | 3 | 4 | 5;
    baseMaterialDrops: number;
    milestoneMaterial: boolean;
};
//# sourceMappingURL=content.d.ts.map