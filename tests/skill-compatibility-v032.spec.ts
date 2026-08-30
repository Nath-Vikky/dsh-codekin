import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { totalXpForLevel } from '../packages/engine/src/balance.ts'
import { CREATURE_CATALOG } from '../content-packs/core/src/catalog.ts'
import {
  applyTraceWildAction,
  createInitialTraceWildState,
} from '../src/core-runtime.ts'
import type { RandomSource } from '../packages/engine/src/types.ts'

// Captured from the immutable 0.3.2 release tarball whose SHA-256 is
// 1F991CA62102D55B8A51CE8473B53BD1AF3AA00D6415BF5057AB70513AE944B3.
const ACTIVE_SKILL_FINGERPRINTS_V032: Readonly<Record<string, string>> = Object.freeze({
  'lumen-indeximp': 'ed8a4896803e1a3d5b6d6d617b3abcdd356b08fc8e8a6d86ed946b4fd101d63c',
  'lumen-foliomoth': '4333cd4ccab79fde00ca2fa60f76f0ff7e71f3e77ce65b66dc80f490b8cdd7d1',
  'lumen-lensel': '87e00542e86f9dbcc150b7622f8880ed1f1668baccbdb42557615c6fe550cc38',
  'lumen-echocoil': 'caf2836cd36838e1542f47d47104aaf7cbed476c2f81193d8afb78d82273845d',
  'lumen-atlashart': 'e3f5ad9e6ebb59533bdc14ba6d8021e03aefe670804bcc978491a17e978807ea',
  'forge-sparkmite': '7e75be392fcd8da21f37c26b22663cc83ddca81bf33ee0fc7fe331e104c929f5',
  'forge-rivetclaw': '93c2a63a480d880b345568b680555ca3f05ff3871c77677f62fdc3abc69f84ba',
  'forge-solderling': 'cc7205d4f3ac879907f15f78e69fda4deed0afe608979bb7ec533ae6871121d8',
  'forge-anvilback': 'a08171abfd00f767360d91a6618d7395bdb8204b2b4b3441687431cf73699b99',
  'forge-kiln-colossus': '61a07352d6dde03237ba23c23c0294a66cb777463078fba12957952952407935',
  'relay-pingfly': '846840bfe62642386423074c45a57eacc8b6a841c3e5cb9deb54f801a66836d4',
  'relay-duplex-hare': 'dcf542be9158423fac5f2163c8e1c55a9cd1c43346c53ea8678e99d3f23a4a71',
  'relay-routeray': '181291ddbccd97df279554baec1022890a71c7cb972355194ba30b6e58d1e9af',
  'relay-forktail': 'f6fa8277d852c185725deeabcd2921aee497afcc610ea4a5ab4b6003ba7d5295',
  'relay-mesh-jelly': 'd15662515d531ab5150e5616596b3c4e87b39f055aef806f0cde57822b281367',
  'aegis-veribud': '7b6ad9b337956a6b4ba3588aedc66b316ab1a55fe2a195e9dfb0ffd22b0faade',
  'aegis-loop-tortoise': '924b7204918d00be10ac9d7d85fce44eb56abf6f854c2b8fd574bda2f30b2305',
  'aegis-anchorbee': '84db346e0802f5d5e534e747825b6a2ce4ccce2749fabcd57c0971cb821750f4',
  'aegis-steady-ram': '431c453d818b6c102fa24c9c46ff3ec88e106df82fbf873bfdfeb6ffa9da5013',
  'aegis-dawnguard': '7445e3e0af66812e508f49551ab72df909d696f09fe0b712ea3a8c4289f9eec8',
  'glitch-null-nibbler': '6a9a6b69c27625c03ae185b24b4c0a2fe869c7fdc7a1fd8021c5dfb429b73e38',
  'glitch-stack-weaver': '22d2d8ab60bf1a169368b67099e179948070af4ea7afeb31f1f6e78b0bdaa15a',
  'glitch-lagtoad': '2a2b90c7346e9833c7856ee90817551d45267cb1d20e665b2fad4a3c52a21628',
  'glitch-crashfox': 'bcadcd74f144658521a026bf394f681cd883a111431c6193c2d5d1b6ef808e65',
  'glitch-overflow-maw': '244fa733751c9181d2af8b86f9116787b884bdc05d81a12935f6b1c048ccd9c0',
})

function seededRandom(seedValue: number): RandomSource {
  let seed = seedValue >>> 0
  return () => {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    return seed / 0x1_0000_0000
  }
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stable(child)]))
  }
  return value
}

function fingerprint(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(stable(value))).digest('hex')
}

function activeSkillFingerprint(creatureIndex: number): string {
  const creature = CREATURE_CATALOG[creatureIndex]!
  const now = 1_700_000_000_000 + creatureIndex * 10_000
  const random = seededRandom(0x5eed0000 + creatureIndex)
  let state = createInitialTraceWildState(now)
  state.starterChosen = true
  state.creatures = [{
    instanceId: `fixture-${creature.id}`,
    creatureId: creature.id,
    quality: 'prism',
    level: 20,
    xp: totalXpForLevel(20, 'prism'),
    wins: 0,
    caughtAt: now,
    firstSignal: creature.ecology,
  }]
  state.squad = [state.creatures[0]!.instanceId]
  const wild = CREATURE_CATALOG[(creatureIndex + 8) % CREATURE_CATALOG.length]!
  state.encounters = [{
    id: `encounter-${creatureIndex}`,
    creatureId: wild.id,
    ecology: wild.ecology,
    quality: 'prism',
    level: 20,
    captureAttempts: 0,
    spawnedAt: now,
    expiresAt: now + 1_000_000,
    enhanced: false,
    armor: 2,
    mapX: 50,
    mapY: 50,
  }]
  state = applyTraceWildAction(
    state,
    { type: 'start-battle', encounterId: state.encounters[0]!.id },
    random,
    now + 1,
  ).state
  const member = state.battle!.party[0]!
  member.energy = 12
  member.overcharge = 4
  state.battle!.lastPlayerDamage = 321
  state.battle!.wildShield = 77
  state.battle!.wildArmor = 3
  return fingerprint(applyTraceWildAction(
    state,
    { type: 'battle-cast', creatureInstanceId: member.instanceId },
    random,
    now + 2,
  ))
}

describe('0.3.2 active-skill compatibility', () => {
  it('reproduces the authoritative result for all 25 core active skills', () => {
    const actual = Object.fromEntries(CREATURE_CATALOG.map((creature, index) => [
      creature.id,
      activeSkillFingerprint(index),
    ]))
    expect(actual).toEqual(ACTIVE_SKILL_FINGERPRINTS_V032)
  })
})
