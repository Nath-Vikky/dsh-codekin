export declare const CONTENT_API_VERSION: 1;
export declare const TRACE_ECOLOGIES: readonly ["lumen", "forge", "relay", "aegis", "glitch"];
export declare const CAPTURE_CORE_QUALITIES: readonly ["pebble", "pulse", "prism", "nova", "origin"];
export type TraceEcology = typeof TRACE_ECOLOGIES[number];
export type TraceRarity = 'common' | 'uncommon' | 'rare' | 'apex';
export type CaptureCoreQuality = typeof CAPTURE_CORE_QUALITIES[number];
export type IndividualQuality = CaptureCoreQuality;
export type GrowthMaterialQuality = CaptureCoreQuality;
export interface CreatureStats {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
}
export interface CreatureDefinition {
    number: number;
    id: string;
    nameZh: string;
    nameEn: string;
    ecology: TraceEcology;
    rarity: TraceRarity;
    combatRole: string;
    baseCaptureRate: number;
    signatureProtocol: string;
    spriteIndex: number;
    stats: CreatureStats;
}
export interface CreatureSkillDefinition {
    creatureId: string;
    energyCost: number;
    passiveNameZh: string;
    passiveNameEn: string;
    passiveDescriptionZh: string;
    passiveDescriptionEn: string;
    activeNameZh: string;
    activeNameEn: string;
    activeDescriptionZh: string;
    activeDescriptionEn: string;
}
export interface LocalizedContentText {
    zhCN: string;
    en: string;
}
export interface ContentPackManifest {
    id: string;
    version: string;
    engine: string;
    contentApi: typeof CONTENT_API_VERSION;
    dependencies?: Readonly<Record<string, string>>;
    conflicts?: readonly string[];
    priority?: number;
}
export interface ContentPackIdentity {
    id: string;
    version: string;
}
export interface ContentEcologyDefinition {
    id: string;
    order: number;
    name: LocalizedContentText;
    tileRole: 'sync' | 'overclock' | 'guard' | 'repair' | 'breach';
}
export interface ContentQualityDefinition {
    id: string;
    order: number;
    name: LocalizedContentText;
}
export interface ContentCreatureStats {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
}
export interface ContentCreatureDefinition {
    number: number;
    id: string;
    name: LocalizedContentText;
    ecology: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'apex';
    combatRole: string;
    baseCaptureRate: number;
    signatureProtocol: string;
    sprite: string;
    stats: ContentCreatureStats;
}
export interface ContentSkillDefinition {
    creatureId: string;
    energyCost: number;
    passive: {
        name: LocalizedContentText;
        description: LocalizedContentText;
    };
    active: {
        name: LocalizedContentText;
        description: LocalizedContentText;
    };
}
export type ContentMechanicTrigger = 'energy:overflow' | 'damage:modify' | 'match:after' | 'energy:after-distribute' | 'stage:enter' | 'defeat:before' | 'runtime:threshold' | 'damage:taken' | 'skill:before' | 'skill:cast';
export type ContentMechanicParameter = string | number | boolean;
/**
 * A bounded data instruction. The engine owns and validates each opcode;
 * content packs never provide executable JavaScript.
 */
export interface ContentMechanicBinding {
    trigger: ContentMechanicTrigger;
    opcode: string;
    priority?: number;
    params?: Readonly<Record<string, ContentMechanicParameter>>;
}
export interface ContentCreatureMechanicsDefinition {
    creatureId: string;
    bindings: readonly ContentMechanicBinding[];
}
export interface ContentAssetDefinition {
    key: string;
    path: string;
    mime: 'image/png' | 'image/webp';
    kind: 'launcher' | 'creature';
}
export interface ContentEncounterDefinition {
    variants: Readonly<Record<string, string>>;
}
export interface CodekinContentPack {
    manifest: ContentPackManifest;
    ecologies: readonly ContentEcologyDefinition[];
    qualities: readonly ContentQualityDefinition[];
    creatures: readonly ContentCreatureDefinition[];
    skills: readonly ContentSkillDefinition[];
    mechanics: readonly ContentCreatureMechanicsDefinition[];
    encounters: ContentEncounterDefinition;
    starters: readonly string[];
    tower: {
        rotation: readonly string[];
    };
    assets: readonly ContentAssetDefinition[];
    aliases?: Readonly<Record<string, string>>;
}
export interface ContentRegistry {
    readonly packs: readonly CodekinContentPack[];
    readonly ecologies: readonly ContentEcologyDefinition[];
    readonly qualities: readonly ContentQualityDefinition[];
    readonly creatures: readonly ContentCreatureDefinition[];
    readonly skills: readonly ContentSkillDefinition[];
    readonly mechanics: readonly ContentCreatureMechanicsDefinition[];
    readonly encounterVariants: Readonly<Record<string, string>>;
    readonly assets: readonly ContentAssetDefinition[];
    resolveId(id: string): string;
    creature(id: string): ContentCreatureDefinition | undefined;
    skill(creatureId: string): ContentSkillDefinition | undefined;
    creatureMechanics(creatureId: string): ContentCreatureMechanicsDefinition | undefined;
    encounterCreature(variant: string): ContentCreatureDefinition | undefined;
    asset(key: string): ContentAssetDefinition | undefined;
}
export interface ContentValidationIssue {
    path: string;
    message: string;
}
//# sourceMappingURL=types.d.ts.map