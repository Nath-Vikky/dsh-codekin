import type { CaptureCoreQuality, CreatureDefinition, TraceEcology } from './types.ts';
export declare const TRACE_ECOLOGIES: readonly TraceEcology[];
export declare const CAPTURE_CORE_QUALITIES: readonly CaptureCoreQuality[];
export declare const CORE_DROP_WEIGHTS: Readonly<Record<CaptureCoreQuality, number>>;
export declare const CORE_CAPTURE_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>>;
export declare const CREATURE_CATALOG: readonly CreatureDefinition[];
export declare function creatureById(id: string): CreatureDefinition | undefined;
export declare function creaturesInEcology(ecology: TraceEcology): readonly CreatureDefinition[];
export declare const STARTER_CREATURE_IDS: readonly ["lumen-indeximp", "forge-sparkmite", "aegis-veribud"];
//# sourceMappingURL=catalog.d.ts.map