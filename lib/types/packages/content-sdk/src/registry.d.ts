import type { ContentAssetDefinition, ContentCreatureDefinition, ContentCreatureMechanicsDefinition, ContentEcologyDefinition, ContentQualityDefinition, ContentRegistry, ContentSkillDefinition } from './types.ts';
export interface ContentRegistryOptions {
    engineVersion?: string;
}
export declare function createContentRegistry(values: readonly unknown[], options?: ContentRegistryOptions): ContentRegistry;
export type { ContentAssetDefinition, ContentCreatureDefinition, ContentCreatureMechanicsDefinition, ContentEcologyDefinition, ContentQualityDefinition, ContentSkillDefinition, };
//# sourceMappingURL=registry.d.ts.map