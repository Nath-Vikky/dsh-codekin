import type { ContentAssetDefinition, ContentCreatureDefinition, ContentEcologyDefinition, ContentQualityDefinition, ContentRegistry, ContentSkillDefinition } from './types.ts';
import { CONTENT_API_VERSION } from './types.ts';
export interface ContentViewPack {
    id: string;
    version: string;
}
/** Client-safe content data. Mechanics, aliases, and dependency internals are intentionally omitted. */
export interface CodekinContentView {
    contentApi: typeof CONTENT_API_VERSION;
    id: string;
    packs: readonly ContentViewPack[];
    ecologies: readonly ContentEcologyDefinition[];
    qualities: readonly ContentQualityDefinition[];
    creatures: readonly ContentCreatureDefinition[];
    skills: readonly ContentSkillDefinition[];
    starters: readonly string[];
    towerRotation: readonly string[];
    assets: readonly ContentAssetDefinition[];
}
export declare function createContentView(registry: ContentRegistry): CodekinContentView;
//# sourceMappingURL=view.d.ts.map