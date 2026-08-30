import type {
  ContentCreatureMechanicsDefinition,
  ContentMechanicBinding,
  ContentMechanicParameter,
  ContentMechanicTrigger,
} from '../../../packages/content-sdk/src/types.ts'

type Params = Readonly<Record<string, ContentMechanicParameter>>

function mechanic(
  trigger: ContentMechanicTrigger,
  opcode: string,
  params?: Params,
): ContentMechanicBinding {
  return params === undefined ? { trigger, opcode } : { trigger, opcode, params }
}

function creature(
  creatureId: string,
  bindings: readonly ContentMechanicBinding[],
): ContentCreatureMechanicsDefinition {
  return { creatureId, bindings }
}

/** The declarative mechanics that reproduce the 0.3.2 core roster. */
export const CORE_CREATURE_MECHANICS: readonly ContentCreatureMechanicsDefinition[] = Object.freeze([
  creature('lumen-indeximp', [
    mechanic('match:after', 'match.add-mark', { ecology: 'lumen', minCount: 1, once: 'round', amount: 1, maximum: 3 }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 0.8 }),
    mechanic('skill:cast', 'mark.add', { amount: 1, maximum: 3 }),
    mechanic('skill:cast', 'tiles.convert', { ecology: 'lumen', count: 3, resolve: true }),
  ]),
  creature('lumen-foliomoth', [
    mechanic('match:after', 'match.heal', { ecology: 'lumen', minCount: 4, basis: 'member-max-hp', ratio: 0.03 }),
    mechanic('skill:cast', 'heal.party', { basis: 'party-max-hp', ratio: 0.08 }),
    mechanic('skill:cast', 'shield.party', { basis: 'member-max-hp', ratio: 0.1 }),
  ]),
  creature('lumen-lensel', [
    mechanic('match:after', 'match.grant-energy-on-cascade', { minChain: 2, amount: 2, once: 'stage' }),
    mechanic('skill:cast', 'tiles.convert', { ecology: 'counter', count: 4, resolve: true }),
  ]),
  creature('lumen-echocoil', [
    mechanic('match:after', 'match.echo-damage', { minChain: 2, factor: 0.3, once: 'round' }),
    mechanic('skill:cast', 'damage.replay', { factor: 0.75, minimum: 'member-attack' }),
  ]),
  creature('lumen-atlashart', [
    mechanic('damage:modify', 'damage.first-match-floor', { minimum: 1.15, chain: 1, once: 'round' }),
    mechanic('match:after', 'match.consume-first-match', { chain: 1, once: 'round' }),
    mechanic('skill:cast', 'affinity.floor', { actions: 2 }),
  ]),
  creature('forge-sparkmite', [
    mechanic('match:after', 'match.raw-hit', { ecology: 'forge', minCount: 4, power: 0.25 }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 0.55, hits: 3 }),
  ]),
  creature('forge-rivetclaw', [
    mechanic('match:after', 'match.consume-counter', { ecology: 'forge' }),
    mechanic('damage:taken', 'damage.arm-counter', { power: 0.8 }),
    mechanic('skill:cast', 'shield.party', { basis: 'member-max-hp', ratio: 0.18 }),
    mechanic('skill:cast', 'counter.arm', { power: 0.8 }),
  ]),
  creature('forge-solderling', [
    mechanic('match:after', 'match.add-burn-mixed', { ecology: 'forge', maximum: 4.2 }),
    mechanic('skill:cast', 'tiles.convert', { ecology: 'forge', count: 4, resolve: false }),
    mechanic('skill:cast', 'burn.add', { amount: 1, scaled: true, maximum: 4.2 }),
    mechanic('skill:cast', 'tiles.resolve'),
  ]),
  creature('forge-anvilback', [
    mechanic('match:after', 'match.break-armor', { ecology: 'forge', minCount: 5, amount: 1 }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 1.8 }),
    mechanic('skill:cast', 'armor.break', { amount: 3 }),
  ]),
  creature('forge-kiln-colossus', [
    mechanic('match:after', 'match.add-burn-cascade', { ecology: 'forge', minChain: 2, amount: 0.25, maximum: 4.2 }),
    mechanic('skill:cast', 'tiles.clear', { ecology: 'forge', count: 36, resolve: true }),
  ]),
  creature('relay-pingfly', [
    mechanic('stage:enter', 'stage.grant-energy', { amount: 2 }),
    mechanic('skill:cast', 'tiles.guaranteed-match', { ecology: 'relay', resolve: true }),
  ]),
  creature('relay-duplex-hare', [
    mechanic('damage:modify', 'damage.round-parity-multiplier', { parity: 'odd', multiplier: 1.1 }),
    mechanic('match:after', 'match.grant-energy-round-parity', { ecology: 'relay', parity: 'even', amount: 1 }),
    mechanic('skill:cast', 'repeat.arm', { power: 0.6, scaled: true, maximum: 0.9 }),
  ]),
  creature('relay-routeray', [
    mechanic('match:after', 'match.convert-one', { ecology: 'relay', minCount: 1, once: 'stage' }),
    mechanic('skill:cast', 'tiles.reshuffle'),
  ]),
  creature('relay-forktail', [
    mechanic('damage:modify', 'damage.combo-per-cascade', { amount: 0.04 }),
    mechanic('skill:cast', 'repeat.arm', { power: 0.7, scaled: true, maximum: 0.95 }),
  ]),
  creature('relay-mesh-jelly', [
    mechanic('energy:after-distribute', 'energy.share', { ecology: 'relay', ratio: 0.25, maximumSource: 8, excludeEcology: true }),
    mechanic('skill:cast', 'energy.party', { amount: 2, scaled: true }),
    mechanic('skill:cast', 'tiles.convert', { ecology: 'relay', count: 3, resolve: true }),
  ]),
  creature('aegis-veribud', [
    mechanic('match:after', 'match.heal', { ecology: 'aegis', minCount: 1, basis: 'active-max-hp', ratio: 0.02, once: 'stage' }),
    mechanic('skill:cast', 'heal.party', { basis: 'party-max-hp', ratio: 0.1 }),
  ]),
  creature('aegis-loop-tortoise', [
    mechanic('stage:enter', 'stage.shield', { basis: 'member-max-hp', ratio: 0.08 }),
    mechanic('skill:cast', 'shield.party', { basis: 'party-max-hp', ratio: 0.2 }),
  ]),
  creature('aegis-anchorbee', [
    mechanic('match:after', 'match.shield-on-special', { basis: 'active-max-hp', ratio: 0.04 }),
    mechanic('skill:cast', 'enemy.delay', { actions: 1 }),
    mechanic('skill:cast', 'board.lock', { actions: 3 }),
  ]),
  creature('aegis-steady-ram', [
    mechanic('match:after', 'match.shield-on-resisted', { ratio: 0.2 }),
    mechanic('skill:cast', 'shield.party', { basis: 'member-max-hp', ratio: 0.1 }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 1.4 }),
  ]),
  creature('aegis-dawnguard', [
    mechanic('defeat:before', 'defeat.prevent', { hp: 1, shieldRatio: 0.1, once: 'battle' }),
    mechanic('skill:cast', 'heal.party', { basis: 'party-max-hp', ratio: 0.16 }),
    mechanic('skill:cast', 'shield.party', { basis: 'party-max-hp', ratio: 0.08 }),
  ]),
  creature('glitch-null-nibbler', [
    mechanic('match:after', 'match.erode-protection', { ecology: 'glitch', armor: 1, shieldAttackRatio: 1 }),
    mechanic('skill:cast', 'shield.enemy-clear'),
    mechanic('skill:cast', 'armor.break', { amount: 2 }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 1 }),
  ]),
  creature('glitch-stack-weaver', [
    mechanic('match:after', 'match.convert-one', { ecology: 'glitch', minChain: 2 }),
    mechanic('skill:cast', 'tiles.convert', { ecology: 'glitch', count: 5, resolve: false }),
    mechanic('skill:cast', 'mark.add', { amount: 1, maximum: 3 }),
    mechanic('skill:cast', 'tiles.resolve'),
  ]),
  creature('glitch-lagtoad', [
    mechanic('runtime:threshold', 'runtime.delay-enemy', { belowRatio: 0.5, actions: 1, once: 'battle' }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 1.1 }),
    mechanic('skill:cast', 'enemy.delay', { actions: 1 }),
  ]),
  creature('glitch-crashfox', [
    mechanic('damage:modify', 'damage.low-runtime-multiplier', { belowRatio: 0.5, multiplier: 1.25 }),
    mechanic('skill:cast', 'damage.raw-hit', { power: 2.2 }),
    mechanic('skill:cast', 'runtime.self-damage', { basis: 'member-hp', ratio: 0.08, minimumRemaining: 1 }),
  ]),
  creature('glitch-overflow-maw', [
    mechanic('energy:overflow', 'energy.store-overflow', { maximum: 5 }),
    mechanic('skill:before', 'skill.consume-overflow', { multiplierPerPoint: 0.03 }),
    mechanic('skill:cast', 'tiles.clear', { ecology: 'glitch', count: 12, resolve: true }),
  ]),
])

const BY_CREATURE_ID = new Map(CORE_CREATURE_MECHANICS.map(row => [row.creatureId, row]))

export function mechanicsByCreatureId(creatureId: string): ContentCreatureMechanicsDefinition | undefined {
  return BY_CREATURE_ID.get(creatureId)
}
