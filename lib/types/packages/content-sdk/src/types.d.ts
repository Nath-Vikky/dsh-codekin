export declare const CONTENT_API_VERSION: 1;
export type TraceEcology = 'lumen' | 'forge' | 'relay' | 'aegis' | 'glitch';
export type TraceRarity = 'common' | 'uncommon' | 'rare' | 'apex';
export type CaptureCoreQuality = 'pebble' | 'pulse' | 'prism' | 'nova' | 'origin';
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
export interface ContentAssetDefinition {
    key: string;
    path: string;
    mime: 'image/png' | 'image/webp';
    kind: 'launcher' | 'creature';
}
export interface CodekinContentPack {
    manifest: ContentPackManifest;
    ecologies: readonly ContentEcologyDefinition[];
    qualities: readonly ContentQualityDefinition[];
    creatures: readonly ContentCreatureDefinition[];
    skills: readonly ContentSkillDefinition[];
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
    readonly assets: readonly ContentAssetDefinition[];
    resolveId(id: string): string;
    creature(id: string): ContentCreatureDefinition | undefined;
    skill(creatureId: string): ContentSkillDefinition | undefined;
    asset(key: string): ContentAssetDefinition | undefined;
}
export interface ContentValidationIssue {
    path: string;
    message: string;
}
//# sourceMappingURL=types.d.ts.map