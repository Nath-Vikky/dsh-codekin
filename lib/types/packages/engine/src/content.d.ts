import type { CaptureCoreQuality, ContentPackIdentity, ContentCreatureMechanicsDefinition, ContentRegistry, CreatureDefinition, CreatureSkillDefinition, TraceEcology } from '../../content-sdk/src/types.ts';
export interface CodekinEngineContent {
    readonly id: string;
    readonly packs: readonly ContentPackIdentity[];
    readonly creatures: readonly CreatureDefinition[];
    readonly skills: readonly CreatureSkillDefinition[];
    readonly mechanics: readonly ContentCreatureMechanicsDefinition[];
    readonly starterCreatureIds: readonly string[];
    readonly towerRotation: readonly string[];
    creature(id: string): CreatureDefinition | undefined;
    creaturesInEcology(ecology: TraceEcology): readonly CreatureDefinition[];
    skill(creatureId: string): CreatureSkillDefinition | undefined;
    creatureMechanics(creatureId: string): ContentCreatureMechanicsDefinition | undefined;
    encounterVariantCreatureId(variant: string): string | undefined;
}
export declare const CODEKIN_ENGINE_VERSION: "0.3.6-alpha.2";
export declare class EngineContentError extends TypeError {
    readonly issues: readonly string[];
    constructor(issues: readonly string[]);
}
export declare const QUALITY_SKILL_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>>;
export declare function createEngineContent(registry: ContentRegistry): CodekinEngineContent;
export declare function currentEngineContent(): CodekinEngineContent;
/** Runs one synchronous engine operation against an immutable content set. */
export declare function withEngineContent<Result>(content: CodekinEngineContent, operation: () => Result): Result;
//# sourceMappingURL=content.d.ts.map