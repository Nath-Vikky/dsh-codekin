import { describe, expect, it } from 'vitest'
import { CREATURE_CATALOG } from '../src/core/catalog.ts'
import {
  MAX_MAP_ENCOUNTERS,
  encounterLifetimeMs,
  playerStats,
  totalXpForLevel,
  wildLevelForRoster,
  wildStats,
  xpToNextLevel,
} from '../src/core/balance.ts'
import {
  applyTraceSignal,
  applyTraceWildAction,
  createInitialTraceWildState,
  expireTraceWildEncounters,
  restoreTraceWildState,
  settleTraceWildIdleRewards,
} from '../src/core/engine.ts'
import { findFirstLegalBattleSwap, MATCH_BOARD_CELLS } from '../src/core/match3.ts'
import { CREATURE_SKILLS } from '../src/core/skills.ts'
import { towerFloorProfile } from '../src/core/tower.ts'
import type { TraceWildState } from '../src/core/types.ts'

const low = (): number => 0

function seededRandom(seedValue: number): () => number {
  let seed = seedValue >>> 0
  return () => {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    return seed / 0x1_0000_0000
  }
}

function battleState(): TraceWildState {
  let state = applyTraceWildAction(
    createInitialTraceWildState(100),
    { type: 'choose-starter', creatureId: 'aegis-veribud' },
    low,
    150,
  ).state
  state = applyTraceSignal(state, {
    id: 'turn-3', at: 200, ecology: 'glitch', outcome: 'failed', intensity: 5,
    activeMinutes: 0, enhanced: true, variant: 'missing',
  }, low)
  return applyTraceWildAction(state, { type: 'start-battle', encounterId: state.encounters[0]!.id }, low, 210).state
}

describe('TraceWild match battle', () => {
  it('ships 25 creatures with exactly one passive and active definition each', () => {
    expect(CREATURE_CATALOG).toHaveLength(25)
    expect(CREATURE_SKILLS).toHaveLength(25)
    expect(new Set(CREATURE_CATALOG.map(row => row.id))).toHaveProperty('size', 25)
    expect(new Set(CREATURE_SKILLS.map(row => row.creatureId))).toHaveProperty('size', 25)
    expect(new Set(CREATURE_CATALOG.map(row => row.ecology))).toHaveProperty('size', 5)
  })

  it('drops one core, spawns one encounter, and applies a signal idempotently', () => {
    const initial = createInitialTraceWildState(100)
    const signal = {
      id: 'turn-1', at: 200, ecology: 'lumen', outcome: 'completed', intensity: 2, activeMinutes: 0, enhanced: false,
    } as const
    const next = applyTraceSignal(initial, signal, low)
    expect(next.schemaVersion).toBe(3)
    expect(next.cores.pebble).toBe(1)
    expect(next.encounters).toHaveLength(1)
    expect(next.encounters[0]).toMatchObject({
      quality: 'pebble', level: 1, captureAttempts: 0,
      expiresAt: 200 + encounterLifetimeMs('pebble', 1),
    })
    expect(applyTraceSignal(next, signal, low)).toBe(next)
  })

  it('caps the ecology map at seven residents and expires them by quality and level', () => {
    expect(MAX_MAP_ENCOUNTERS).toBe(7)
    expect(encounterLifetimeMs('pebble', 1)).toBe(24 * 60 * 60 * 1000)
    expect(encounterLifetimeMs('origin', 100)).toBe(30 * 60 * 1000)
    expect(encounterLifetimeMs('nova', 100)).toBe(40 * 60 * 1000)

    let state = createInitialTraceWildState(100)
    for (let index = 0; index < MAX_MAP_ENCOUNTERS + 1; index += 1) {
      state = applyTraceSignal(state, {
        id: `map-cap-${index}`, at: 200 + index, ecology: 'lumen', outcome: 'completed',
        intensity: 1, activeMinutes: 0, enhanced: false,
      }, low)
    }
    expect(state.encounters).toHaveLength(MAX_MAP_ENCOUNTERS)
    expect(state.encounters.filter(encounter => encounter.ecology === 'lumen')).toHaveLength(6)
    expect(state.encounters.some(encounter => encounter.ecology !== 'lumen')).toBe(true)
    expect(state.materials.pebble).toBe(1)

    const lastExpiry = Math.max(...state.encounters.map(encounter => encounter.expiresAt))
    const expired = expireTraceWildEncounters(state, lastExpiry)
    expect(expired.encounters).toHaveLength(0)
  })

  it('balances mixed turns toward the scarcer observed ecology and randomizes exact ties', () => {
    let state = createInitialTraceWildState(100)
    for (let index = 0; index < 2; index += 1) {
      state = applyTraceSignal(state, {
        id: `forge-seed-${index}`, at: 200 + index, ecology: 'forge', outcome: 'completed',
        intensity: 1, activeMinutes: 0, enhanced: false,
      }, low)
    }
    state = applyTraceSignal(state, {
      id: 'lumen-seed', at: 210, ecology: 'lumen', outcome: 'completed',
      intensity: 1, activeMinutes: 0, enhanced: false,
    }, low)

    state = applyTraceSignal(state, {
      id: 'mixed-minority', at: 220, ecology: 'forge', ecologyCandidates: ['lumen', 'forge'],
      outcome: 'completed', intensity: 2, activeMinutes: 0, enhanced: false,
    }, low)
    expect(state.encounters.at(-1)?.ecology).toBe('lumen')

    state = applyTraceSignal(state, {
      id: 'mixed-tie', at: 230, ecology: 'forge', ecologyCandidates: ['lumen', 'forge'],
      outcome: 'completed', intensity: 2, activeMinutes: 0, enhanced: false,
    }, () => 0.999)
    expect(state.encounters.at(-1)?.ecology).toBe('forge')
  })

  it('derives ordinary wild levels from the whole roster and raises special qualities above its maximum', () => {
    const lowHeavy = [{ level: 10 }, { level: 10 }, { level: 40 }]
    const highHeavy = [{ level: 10 }, { level: 40 }, { level: 40 }]
    const lowWeighted = wildLevelForRoster(lowHeavy, 0, 'pulse', 0.5)
    const highWeighted = wildLevelForRoster(highHeavy, 0, 'pulse', 0.5)
    expect(lowWeighted).toBeGreaterThanOrEqual(10)
    expect(highWeighted).toBeLessThanOrEqual(40)
    expect(highWeighted).toBeGreaterThan(lowWeighted)
    expect(wildLevelForRoster(highHeavy, 30, 'nova', 0)).toBeGreaterThan(40)
    expect(wildLevelForRoster(highHeavy, 30, 'origin', 0)).toBeGreaterThan(
      wildLevelForRoster(highHeavy, 30, 'nova', 0),
    )
  })

  it('protects an elapsed encounter only while its battle remains active', () => {
    let state = applyTraceSignal(createInitialTraceWildState(100), {
      id: 'timed-battle', at: 200, ecology: 'lumen', outcome: 'completed',
      intensity: 1, activeMinutes: 0, enhanced: false,
    }, low)
    const expiresAt = state.encounters[0]!.expiresAt
    state = applyTraceWildAction(
      state,
      { type: 'choose-starter', creatureId: 'aegis-veribud' },
      low,
      210,
    ).state
    state = applyTraceWildAction(state, { type: 'start-battle', encounterId: state.encounters[0]!.id }, low, 220).state
    expect(expireTraceWildEncounters(state, expiresAt).encounters).toHaveLength(1)
    expect(restoreTraceWildState(state, expiresAt)).toMatchObject({
      encounters: [{ id: state.encounters[0]!.id }],
      battle: { encounterId: state.encounters[0]!.id },
    })

    const fled = applyTraceWildAction(state, { type: 'flee' }, low, expiresAt + 1).state
    expect(fled.battle).toBeUndefined()
    expect(fled.encounters).toHaveLength(0)
  })

  it('keeps idle supplies pending until the player explicitly claims them', () => {
    const pending = settleTraceWildIdleRewards(createInitialTraceWildState(100), 3_600_100, low)
    expect(pending.cores.pebble).toBe(0)
    expect(pending.materials.pebble).toBe(0)
    expect(pending.idle.pendingReward).toMatchObject({
      elapsedMinutes: 60,
      coreQuality: 'pebble',
      materials: { pebble: 1 },
    })

    const claimed = applyTraceWildAction(pending, { type: 'claim-idle-reward' }, low, 3_600_200)
    expect(claimed.notice).toBe('idle-claimed')
    expect(claimed.state.cores.pebble).toBe(1)
    expect(claimed.state.materials.pebble).toBe(1)
    expect(claimed.state.idle.pendingReward).toBeUndefined()
    expect(claimed.state.idle.lastReward?.elapsedMinutes).toBe(60)
  })

  it('advances the endless tower one Host-derived floor and settles materials once', () => {
    let state = applyTraceWildAction(
      createInitialTraceWildState(100),
      { type: 'choose-starter', creatureId: 'aegis-veribud' },
      low,
      150,
    ).state
    state = applyTraceWildAction(state, { type: 'start-tower' }, low, 200).state
    expect(state.battle).toMatchObject({
      mode: 'tower', towerFloor: 1, wildLevel: 2, wildQuality: 'pebble', bossSkillTier: 1,
      captureWindow: false,
    })
    expect(restoreTraceWildState(state, 205).battle).toMatchObject({ mode: 'tower', towerFloor: 1 })
    state.battle!.wildArmor = 0
    state.battle!.wildHp = 1
    let cleared: ReturnType<typeof applyTraceWildAction> | undefined
    for (let move = 0; move < 8 && state.battle !== undefined; move += 1) {
      const swap = findFirstLegalBattleSwap(state.battle.board)!
      const result = applyTraceWildAction(state, { type: 'battle-swap', ...swap }, low, 210 + move)
      state = result.state
      if (result.notice === 'tower-cleared') cleared = result
    }
    expect(cleared).toBeDefined()
    if (cleared === undefined) throw new Error('tower did not settle')
    expect(cleared.notice).toBe('tower-cleared')
    expect(cleared.state.battle).toBeUndefined()
    expect(cleared.state.tower).toMatchObject({ highestClearedFloor: 1, attempts: 1, clears: 1 })
    expect(Object.values(cleared.state.tower.lastReward!.materials).reduce((sum, count) => sum + count, 0)).toBe(1)
    expect(Object.values(cleared.state.materials).reduce((sum, count) => sum + count, 0)).toBe(1)
    expect(towerFloorProfile(10)).toMatchObject({ quality: 'pulse', skillTier: 2, milestoneMaterial: true })
    expect(towerFloorProfile(80)).toMatchObject({ quality: 'origin', skillTier: 5, startingBossEnergy: 12 })
  })

  it('creates a playable 8x8 board and gives every Boss cascade non-zero cumulative damage', () => {
    let state = battleState()
    expect(state.battle?.board).toHaveLength(MATCH_BOARD_CELLS)
    state.battle!.party[0]!.maxHp = 1_000
    state.battle!.party[0]!.hp = 1_000
    state.battle!.partyMaxHp = 1_000
    state.battle!.partyHp = 1_000
    state.battle!.wildHp = 9999
    state.battle!.wildMaxHp = 9999
    let moves = 0
    while (state.battle?.stage === 1 && state.battle.turnOwner === 'player' && moves < 20) {
      const swap = findFirstLegalBattleSwap(state.battle!.board)
      expect(swap).toBeDefined()
      const result = applyTraceWildAction(state, { type: 'battle-swap', ...swap! }, low, 220 + moves)
      expect(result.animation?.frames[0]).toMatchObject({ chain: 1 })
      expect(result.animation?.frames[0]?.removed.length).toBeGreaterThanOrEqual(3)
      expect(result.animation?.frames[0]?.fallRows).toHaveLength(MATCH_BOARD_CELLS)
      expect(Math.max(...(result.animation?.frames[0]?.fallRows ?? []))).toBeGreaterThan(0)
      expect(result.animation?.frames[0]).toMatchObject({
        damage: expect.any(Number),
        totalDamage: expect.any(Number),
        effectiveness: expect.stringMatching(/^(advantage|neutral|resisted)$/),
      })
      state = result.state
      moves += 1
    }
    expect(moves).toBeGreaterThanOrEqual(3)
    expect(state.battle?.turnOwner).toBe('boss')
    expect(state.battle?.bossActionsRemaining).toBe(3)
    let bossMoves = 0
    let bossDamageTotal = 0
    const bossRandom = seededRandom(0xc0de_0088)
    while (state.battle?.turnOwner === 'boss' && bossMoves < 10) {
      const result = applyTraceWildAction(state, { type: 'battle-continue' }, bossRandom, 260 + bossMoves)
      expect(result.animation?.frames.length).toBeGreaterThan(0)
      for (const frame of result.animation?.frames ?? []) {
        expect(frame).toMatchObject({
          damage: expect.any(Number),
          totalDamage: expect.any(Number),
          effectiveness: expect.stringMatching(/^(advantage|neutral|resisted)$/),
        })
        expect(frame.damage).toBeGreaterThan(0)
        expect(frame.totalDamage).toBeGreaterThan(bossDamageTotal)
        bossDamageTotal = frame.totalDamage ?? bossDamageTotal
      }
      state = result.state
      bossMoves += 1
    }
    expect(bossMoves).toBeGreaterThanOrEqual(3)
    expect(bossMoves).toBeLessThanOrEqual(7)
    expect(state.battle?.actionsRemaining).toBe(3)
    expect(state.battle?.stage).toBe(2)
    expect(state.battle?.round).toBe(2)
    expect(state.battle?.lastTeamStrike).toBeGreaterThan(0)
    expect(state.battle?.lastBossAttack).toBeGreaterThan(0)
    expect(state.battle?.lastBossAttack).toBe(bossDamageTotal)
    expect(state.battle?.log.some(row => row.kind === 'boss-match')).toBe(true)
  })

  it('lets a player end a wild Codekin stage without dealing more damage', () => {
    const state = battleState()
    state.battle!.wildArmor = 0
    state.battle!.wildMaxHp = 100
    state.battle!.wildHp = 40
    state.battle!.pendingTeamDamage = 0
    const result = applyTraceWildAction(state, { type: 'battle-skip-stage' }, low, 225)
    expect(result.state.battle).toMatchObject({ captureWindow: true, wildHp: 40, actionsRemaining: 0 })
    expect(result.state.battle?.log.at(-1)).toMatchObject({ kind: 'stage-skip' })
  })

  it('uses the same turn skip during an endless-tower battle', () => {
    let state = applyTraceWildAction(
      createInitialTraceWildState(100),
      { type: 'choose-starter', creatureId: 'aegis-veribud' },
      low,
      150,
    ).state
    state = applyTraceWildAction(state, { type: 'start-tower' }, low, 200).state
    const result = applyTraceWildAction(state, { type: 'battle-skip-stage' }, low, 210)
    expect(result.state.battle).toMatchObject({ mode: 'tower', turnOwner: 'boss', actionsRemaining: 0 })
    expect(result.state.battle?.log.some(row => row.kind === 'stage-skip')).toBe(true)
  })

  it('charges and casts the active creature skill without consuming a swap', () => {
    const state = battleState()
    state.battle!.party[0]!.energy = 12
    const beforeActions = state.battle!.actionsRemaining
    const result = applyTraceWildAction(state, {
      type: 'battle-cast', creatureInstanceId: state.battle!.party[0]!.instanceId,
    }, low, 230)
    expect(result.notice).toBe('skill-cast')
    expect(result.state.battle?.party[0]).toMatchObject({ energy: 0, skillUsedStage: true })
    expect(result.state.battle?.actionsRemaining).toBe(beforeActions)
  })

  it('captures a weakened creature and records the core as individual quality', () => {
    const state = battleState()
    state.battle!.wildArmor = 0
    state.battle!.wildHp = 1
    state.battle!.captureWindow = true
    state.cores.origin = 1
    const result = applyTraceWildAction(state, { type: 'capture', quality: 'origin' }, low, 240)
    expect(result.notice).toBe('capture-success')
    expect(result.state.battle).toBeUndefined()
    expect(result.state.creatures.at(-1)?.quality).toBe('pebble')
  })

  it('keeps capture open after a failed core until the player abandons or runs out', () => {
    const high = (): number => 0.999_999
    const state = battleState()
    state.battle!.wildArmor = 0
    state.battle!.wildHp = 1
    state.battle!.captureWindow = true
    state.cores.pebble = 2

    const first = applyTraceWildAction(state, { type: 'capture', quality: 'pebble' }, high, 241)
    expect(first.notice).toBe('capture-failed')
    expect(first.state.battle).toMatchObject({ captureWindow: true, captureAttempts: 1 })
    expect(first.state.cores.pebble).toBe(1)

    const last = applyTraceWildAction(first.state, { type: 'capture', quality: 'pebble' }, high, 242)
    expect(last.notice).toBe('capture-failed')
    expect(last.state.cores.pebble).toBe(0)
    expect(last.state.battle).toMatchObject({ captureWindow: false, turnOwner: 'boss' })
  })

  it('uses one combined runtime pool for the full squad and one Boss settlement', () => {
    let state = battleState()
    const first = state.battle!.party[0]!
    state.battle!.party.push(
      { ...first, instanceId: 'pet_test_sweep_00000001' },
      { ...first, instanceId: 'pet_test_sweep_00000002' },
    )
    for (const member of state.battle!.party) {
      member.maxHp = 1_000
      member.hp = 1_000
    }
    state.battle!.partyMaxHp = state.battle!.party.reduce((sum, member) => sum + member.maxHp, 0)
    state.battle!.partyHp = state.battle!.partyMaxHp
    state.battle!.enemyIntent = 'strike'
    state.battle!.enemyTargetScope = 'team'
    delete state.battle!.enemyTargetIndex
    state.battle!.captureWindow = true
    state.battle!.wildAttack = 20
    const before = state.battle!.partyHp
    state = applyTraceWildAction(state, { type: 'battle-continue' }, low, 245).state
    let bossMoves = 0
    const bossRandom = seededRandom(0xc0de_0099)
    while (state.battle?.turnOwner === 'boss' && bossMoves < 10) {
      state = applyTraceWildAction(state, { type: 'battle-continue' }, bossRandom, 246 + bossMoves).state
      bossMoves += 1
    }
    expect(state.battle?.partyHp).toBeLessThan(before)
    expect(state.battle?.partyMaxHp).toBe(state.battle!.party.reduce((sum, member) => sum + member.maxHp, 0))
    expect(state.battle?.party.every(member => member.hp > 0)).toBe(true)
    expect(state.battle?.log.some(row => row.kind === 'enemy')).toBe(true)
    expect(state.battle?.log.some(row => row.kind === 'enemy-sweep')).toBe(false)
  })

  it('migrates schema-v1 creatures to Prism quality and drops the legacy battle', () => {
    const current = battleState()
    const legacy = structuredClone(current) as unknown as Record<string, unknown>
    legacy.schemaVersion = 1
    const creatures = legacy.creatures as Array<Record<string, unknown>>
    for (const creature of creatures) delete creature.quality
    const restored = restoreTraceWildState(legacy, 500)
    expect(restored.schemaVersion).toBe(3)
    expect(restored.creatures.every(creature => creature.quality === 'prism')).toBe(true)
    expect(restored.battle).toBeUndefined()
  })

  it('makes quality affect base stats, growth, training cost, and over-level boss pressure', () => {
    const creature = CREATURE_CATALOG.find(row => row.id === 'glitch-overflow-maw')!
    const pebbleLevel1 = playerStats(creature.stats, 1, 'pebble')
    const prismLevel1 = playerStats(creature.stats, 1, 'prism')
    const originLevel1 = playerStats(creature.stats, 1, 'origin')
    const pebbleLevel100 = playerStats(creature.stats, 100, 'pebble')
    const originLevel100 = playerStats(creature.stats, 100, 'origin')
    expect(pebbleLevel1.attack).toBeLessThan(prismLevel1.attack)
    expect(prismLevel1.attack).toBeLessThan(originLevel1.attack)
    expect(originLevel100.attack - originLevel1.attack).toBeGreaterThan(pebbleLevel100.attack - pebbleLevel1.attack)
    expect(xpToNextLevel(50, 'origin')).toBeGreaterThan(xpToNextLevel(50, 'prism'))
    expect(totalXpForLevel(100, 'origin')).toBeGreaterThan(totalXpForLevel(100, 'nova'))

    const equalLevelBoss = wildStats(creature, 22, 'origin', 1, 22)
    const overLevelBoss = wildStats(creature, 22, 'origin', 1, 1)
    expect(overLevelBoss.hp).toBeGreaterThan(equalLevelBoss.hp * 1.3)
    expect(overLevelBoss.attack).toBeGreaterThan(equalLevelBoss.attack)

    const common = CREATURE_CATALOG.find(row => row.id === 'aegis-veribud')!
    const levelOnePartyHp = playerStats(common.stats, 1, 'pebble').hp * 3
    const levelTwelveBoss = wildStats(common, 12, 'pebble', 3, 1)
    expect(levelTwelveBoss.hp).toBeGreaterThan(levelOnePartyHp * 2.5)
    expect(levelTwelveBoss.attack).toBeGreaterThan(playerStats(common.stats, 1, 'pebble').attack)

    const saved = createInitialTraceWildState(600)
    saved.schemaVersion = 3
    saved.creatures.push({
      instanceId: 'pet_restore_origin_00000001', creatureId: creature.id, quality: 'origin',
      level: 22, xp: 0, wins: 0, caughtAt: 600, firstSignal: creature.ecology,
    })
    saved.starterChosen = true
    saved.squad = [saved.creatures[0]!.instanceId]
    const restored = restoreTraceWildState(saved, 700)
    expect(restored.creatures[0]?.level).toBe(22)
    expect(restored.creatures[0]?.xp).toBe(totalXpForLevel(22, 'origin'))
  })

  it('pauses event rewards while disabled and resumes from a fresh idle watermark', () => {
    const initial = createInitialTraceWildState(100)
    const disabled = applyTraceWildAction(initial, { type: 'set-enabled', enabled: false }, low, 200).state
    expect(disabled).toMatchObject({ enabled: false, idle: { lastSettlementAt: 200 } })
    expect(applyTraceSignal(disabled, {
      id: 'turn-disabled', at: 3_600_200, ecology: 'lumen', outcome: 'completed', intensity: 5,
      activeMinutes: 60, enhanced: true,
    }, low)).toBe(disabled)
    const enabled = applyTraceWildAction(disabled, { type: 'set-enabled', enabled: true }, low, 3_600_300).state
    expect(enabled).toMatchObject({ enabled: true, idle: { lastSettlementAt: 3_600_300 } })
    expect(enabled.cores.pebble).toBe(0)
  })

  it('releases a non-final Codekin for one same-quality material regardless of level', () => {
    let state = applyTraceWildAction(
      createInitialTraceWildState(100),
      { type: 'choose-starter', creatureId: 'aegis-veribud' },
      low,
      110,
    ).state
    state.creatures.push({
      instanceId: 'pet_release_nova_00000001', creatureId: 'glitch-crashfox', quality: 'nova',
      level: 100, xp: totalXpForLevel(100, 'nova'), wins: 999, caughtAt: 120, firstSignal: 'glitch',
    })
    state.squad.push('pet_release_nova_00000001')
    const released = applyTraceWildAction(
      state,
      { type: 'release-creature', creatureInstanceId: 'pet_release_nova_00000001' },
      low,
      130,
    )
    expect(released.notice).toBe('creature-released')
    expect(released.state.materials.nova).toBe(1)
    expect(released.state.creatures).toHaveLength(1)
    expect(released.state.squad).toEqual([released.state.creatures[0]!.instanceId])
    expect(released.state.log[0]).toMatchObject({ kind: 'release', quality: 'nova' })
    expect(() => applyTraceWildAction(
      released.state,
      { type: 'release-creature', creatureInstanceId: released.state.creatures[0]!.instanceId },
      low,
      140,
    )).toThrowError('conflict')
  })
})
