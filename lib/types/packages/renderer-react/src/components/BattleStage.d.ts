import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { BattleState, CapturedCreature } from '../../../engine/src/types.ts';
export interface BattleStageDamage {
    actor: 'player' | 'boss';
    total: number;
    current?: number;
    settled: boolean;
    key: number;
}
export interface BattleStageProps {
    battle: BattleState;
    creatures?: readonly CapturedCreature[];
    t: PropsLocale<'tracewild'>['t'];
    zh: boolean;
    locked: boolean;
    onCast: (instanceId: string) => void;
    displayedWildHp: number;
    displayedWildShield: number;
    displayedPartyHp: number;
    displayedPartyShield: number;
    damage?: BattleStageDamage | undefined;
    attack?: {
        actor: 'player' | 'boss';
        phase: 'flight' | 'impact';
        key: number;
    } | undefined;
    reducedMotion: boolean;
}
export declare function BattleStage(props: BattleStageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BattleStage.d.ts.map