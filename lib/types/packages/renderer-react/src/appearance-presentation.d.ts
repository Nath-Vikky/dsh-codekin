import type { CapturedCreature, CreatureAppearance } from '../../engine/src/types.ts';
export type CreatureLook = Pick<CapturedCreature, 'level' | 'appearance'> & {
    instanceId?: string | undefined;
};
export declare const APPEARANCE_MOTION: {
    readonly evolution: 1400;
    readonly change: 380;
};
export declare function resolveCreatureSprite(creatureId: string, look?: CreatureLook): {
    source: string | undefined;
    fallback: string | undefined;
    appearance: CreatureAppearance;
};
export interface PresentedAppearance {
    identity: string;
    level: number;
    source: string | undefined;
    appearance: CreatureAppearance;
}
export declare function appearanceTransition(previous: PresentedAppearance, next: PresentedAppearance): 'none' | 'change' | 'evolution';
/** Decode before swapping a visible portrait, retaining the old image on failure. */
export declare function decodeCreatureImage(source: string): Promise<boolean>;
//# sourceMappingURL=appearance-presentation.d.ts.map