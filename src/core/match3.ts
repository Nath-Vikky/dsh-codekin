import { TRACE_ECOLOGIES } from './catalog.ts'
import type { MatchCascadeFrame, MatchTile, RandomSource, TileSpecial, TraceEcology } from './types.ts'

export const MATCH_BOARD_SIZE = 7
export const MATCH_BOARD_CELLS = MATCH_BOARD_SIZE * MATCH_BOARD_SIZE
export const MAX_MATCH_CASCADES = 12

interface MatchGroup {
  ecology: TraceEcology
  indexes: number[]
  direction: 'row' | 'column'
}

export interface MatchResolutionStep {
  chain: number
  counts: Readonly<Record<TraceEcology, number>>
  maxGroup: number
  specialCount: number
}

export interface MatchResolution {
  board: MatchTile[]
  steps: MatchResolutionStep[]
  frames: MatchCascadeFrame[]
}

export interface MatchSwap {
  from: number
  to: number
}

function boundedRandom(random: RandomSource): number {
  const value = random()
  if (!Number.isFinite(value)) return 0
  return Math.min(0.999999999, Math.max(0, value))
}

function rowOf(index: number): number {
  return Math.floor(index / MATCH_BOARD_SIZE)
}

function columnOf(index: number): number {
  return index % MATCH_BOARD_SIZE
}

export function areAdjacentTiles(first: number, second: number): boolean {
  if (!Number.isInteger(first) || !Number.isInteger(second)
    || first < 0 || second < 0 || first >= MATCH_BOARD_CELLS || second >= MATCH_BOARD_CELLS) return false
  return Math.abs(rowOf(first) - rowOf(second)) + Math.abs(columnOf(first) - columnOf(second)) === 1
}

function emptyCounts(): Record<TraceEcology, number> {
  return { lumen: 0, forge: 0, relay: 0, aegis: 0, glitch: 0 }
}

function chooseEcology(random: RandomSource, allowed: (ecology: TraceEcology) => boolean): TraceEcology {
  const start = Math.floor(boundedRandom(random) * TRACE_ECOLOGIES.length)
  for (let offset = 0; offset < TRACE_ECOLOGIES.length; offset += 1) {
    const ecology = TRACE_ECOLOGIES[(start + offset) % TRACE_ECOLOGIES.length]!
    if (allowed(ecology)) return ecology
  }
  return TRACE_ECOLOGIES[start]!
}

function tile(ecology: TraceEcology, special: TileSpecial = 'none', lockedActions = 0, hazardActions = 0): MatchTile {
  return {
    ecology,
    special,
    ...(lockedActions > 0 ? { lockedActions } : {}),
    ...(hazardActions > 0 ? { hazardActions } : {}),
  }
}

function cloneBoard(board: readonly MatchTile[]): MatchTile[] {
  return board.map(item => tile(item.ecology, item.special, item.lockedActions, item.hazardActions))
}

function groupsInBoard(board: readonly MatchTile[]): MatchGroup[] {
  const groups: MatchGroup[] = []
  for (let row = 0; row < MATCH_BOARD_SIZE; row += 1) {
    let start = 0
    while (start < MATCH_BOARD_SIZE) {
      const ecology = board[row * MATCH_BOARD_SIZE + start]!.ecology
      let end = start + 1
      while (end < MATCH_BOARD_SIZE && board[row * MATCH_BOARD_SIZE + end]!.ecology === ecology) end += 1
      if (end - start >= 3) {
        groups.push({
          ecology,
          direction: 'row',
          indexes: Array.from({ length: end - start }, (_, offset) => row * MATCH_BOARD_SIZE + start + offset),
        })
      }
      start = end
    }
  }
  for (let column = 0; column < MATCH_BOARD_SIZE; column += 1) {
    let start = 0
    while (start < MATCH_BOARD_SIZE) {
      const ecology = board[start * MATCH_BOARD_SIZE + column]!.ecology
      let end = start + 1
      while (end < MATCH_BOARD_SIZE && board[end * MATCH_BOARD_SIZE + column]!.ecology === ecology) end += 1
      if (end - start >= 3) {
        groups.push({
          ecology,
          direction: 'column',
          indexes: Array.from({ length: end - start }, (_, offset) => (start + offset) * MATCH_BOARD_SIZE + column),
        })
      }
      start = end
    }
  }
  return groups
}

function rawSwap(board: MatchTile[], first: number, second: number): void {
  const value = board[first]!
  board[first] = board[second]!
  board[second] = value
}

export function findFirstLegalBattleSwap(board: readonly MatchTile[]): MatchSwap | undefined {
  if (board.length !== MATCH_BOARD_CELLS) return undefined
  const candidate = cloneBoard(board)
  for (let index = 0; index < MATCH_BOARD_CELLS; index += 1) {
    for (const next of [index + 1, index + MATCH_BOARD_SIZE]) {
      if (!areAdjacentTiles(index, next)) continue
      if ((candidate[index]!.lockedActions ?? 0) > 0 || (candidate[next]!.lockedActions ?? 0) > 0) continue
      if (candidate[index]!.special === 'origin' || candidate[next]!.special === 'origin') {
        return { from: index, to: next }
      }
      rawSwap(candidate, index, next)
      const valid = groupsInBoard(candidate).length > 0
      rawSwap(candidate, index, next)
      if (valid) return { from: index, to: next }
    }
  }
  return undefined
}

interface RankedBattleSwap {
  swap: MatchSwap
  score: number
  weight: number
}

function rankedBattleSwaps(board: readonly MatchTile[], preferredEcology: TraceEcology): RankedBattleSwap[] {
  if (board.length !== MATCH_BOARD_CELLS) return []
  const candidate = cloneBoard(board)
  const ranked: RankedBattleSwap[] = []
  for (let index = 0; index < MATCH_BOARD_CELLS; index += 1) {
    for (const next of [index + 1, index + MATCH_BOARD_SIZE]) {
      if (!areAdjacentTiles(index, next)) continue
      const first = candidate[index]!
      const second = candidate[next]!
      if ((first.lockedActions ?? 0) > 0 || (second.lockedActions ?? 0) > 0) continue
      if (first.special === 'origin' || second.special === 'origin') {
        const preferred = first.ecology === preferredEcology || second.ecology === preferredEcology ? 50 : 0
        const score = (first.special === 'origin' && second.special === 'origin' ? 20_000 : 10_000) + preferred
        ranked.push({ swap: { from: index, to: next }, score, weight: first.special === 'origin' && second.special === 'origin' ? 10 : 7 })
        continue
      }
      rawSwap(candidate, index, next)
      const groups = groupsInBoard(candidate)
      rawSwap(candidate, index, next)
      if (groups.length === 0) continue
      const maximum = groups.reduce((value, group) => Math.max(value, group.indexes.length), 0)
      const preferred = groups
        .filter(group => group.ecology === preferredEcology)
        .reduce((value, group) => value + group.indexes.length, 0)
      const total = groups.reduce((value, group) => value + group.indexes.length, 0)
      const score = maximum * 100 + preferred * 4 + total
      ranked.push({
        swap: { from: index, to: next },
        score,
        weight: 1 + preferred * 0.35 + Math.max(0, maximum - 3) * 1.5,
      })
    }
  }
  return ranked
}

export function findBestBattleSwap(board: readonly MatchTile[], preferredEcology: TraceEcology): MatchSwap | undefined {
  return rankedBattleSwaps(board, preferredEcology)
    .sort((left, right) => right.score - left.score)[0]?.swap
}

export function chooseBossBattleSwap(
  board: readonly MatchTile[],
  preferredEcology: TraceEcology,
  random: RandomSource,
): MatchSwap | undefined {
  const ranked = rankedBattleSwaps(board, preferredEcology)
  const total = ranked.reduce((sum, row) => sum + row.weight, 0)
  if (total <= 0) return undefined
  let cursor = boundedRandom(random) * total
  for (const row of ranked) {
    cursor -= row.weight
    if (cursor < 0) return row.swap
  }
  return ranked.at(-1)?.swap
}

export function hasBattleMatches(board: readonly MatchTile[]): boolean {
  return board.length === MATCH_BOARD_CELLS && groupsInBoard(board).length > 0
}

export function createMatchBoard(random: RandomSource): MatchTile[] {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const board: MatchTile[] = []
    for (let index = 0; index < MATCH_BOARD_CELLS; index += 1) {
      const row = rowOf(index)
      const column = columnOf(index)
      const ecology = chooseEcology(random, candidate => !(
        (column >= 2 && board[index - 1]?.ecology === candidate && board[index - 2]?.ecology === candidate)
        || (row >= 2 && board[index - MATCH_BOARD_SIZE]?.ecology === candidate
          && board[index - MATCH_BOARD_SIZE * 2]?.ecology === candidate)
      ))
      board.push(tile(ecology))
    }
    if (findFirstLegalBattleSwap(board) !== undefined) return board
  }

  // A deterministic fallback keeps even adversarial RandomSource implementations playable.
  const board = Array.from({ length: MATCH_BOARD_CELLS }, (_, index) => (
    tile(TRACE_ECOLOGIES[(rowOf(index) * 2 + columnOf(index)) % TRACE_ECOLOGIES.length]!)
  ))
  board[0] = tile('lumen')
  board[1] = tile('forge')
  board[2] = tile('lumen')
  board[MATCH_BOARD_SIZE + 1] = tile('lumen')
  return board
}

function plannedSpecials(groups: readonly MatchGroup[], preferred: readonly number[]): Map<number, TileSpecial> {
  const appearances = new Map<number, number>()
  for (const group of groups) {
    for (const index of group.indexes) appearances.set(index, (appearances.get(index) ?? 0) + 1)
  }
  const plans = new Map<number, TileSpecial>()
  for (const group of groups) {
    const intersection = group.indexes.find(index => (appearances.get(index) ?? 0) > 1)
    const chosen = preferred.find(index => group.indexes.includes(index))
      ?? intersection
      ?? group.indexes[Math.floor(group.indexes.length / 2)]!
    const special: TileSpecial = intersection !== undefined
      ? 'burst'
      : group.indexes.length >= 5
        ? 'origin'
        : group.indexes.length === 4
          ? group.direction
          : 'none'
    if (special !== 'none') {
      const current = plans.get(chosen)
      if (current === undefined || current === 'row' || current === 'column') plans.set(chosen, special)
    }
  }
  return plans
}

function expandSpecials(board: readonly MatchTile[], initial: ReadonlySet<number>): { indexes: Set<number>; count: number } {
  const indexes = new Set(initial)
  const queue = [...initial]
  const triggered = new Set<number>()
  while (queue.length > 0) {
    const index = queue.shift()!
    const current = board[index]
    if (current === undefined || current.special === 'none' || triggered.has(index)) continue
    triggered.add(index)
    const add = (candidate: number): void => {
      if (candidate < 0 || candidate >= MATCH_BOARD_CELLS || indexes.has(candidate)) return
      indexes.add(candidate)
      queue.push(candidate)
    }
    if (current.special === 'row') {
      const start = rowOf(index) * MATCH_BOARD_SIZE
      for (let offset = 0; offset < MATCH_BOARD_SIZE; offset += 1) add(start + offset)
    } else if (current.special === 'column') {
      const column = columnOf(index)
      for (let row = 0; row < MATCH_BOARD_SIZE; row += 1) add(row * MATCH_BOARD_SIZE + column)
    } else if (current.special === 'burst') {
      const centerRow = rowOf(index)
      const centerColumn = columnOf(index)
      for (let row = centerRow - 1; row <= centerRow + 1; row += 1) {
        for (let column = centerColumn - 1; column <= centerColumn + 1; column += 1) {
          if (row >= 0 && row < MATCH_BOARD_SIZE && column >= 0 && column < MATCH_BOARD_SIZE) {
            add(row * MATCH_BOARD_SIZE + column)
          }
        }
      }
    } else {
      for (let candidate = 0; candidate < board.length; candidate += 1) {
        if (board[candidate]!.ecology === current.ecology) add(candidate)
      }
    }
  }
  return { indexes, count: triggered.size }
}

function collapseAndFill(
  board: MatchTile[],
  removed: ReadonlySet<number>,
  plans: ReadonlyMap<number, TileSpecial>,
  random: RandomSource,
): number[] {
  const survivors: ({ tile: MatchTile; source: number } | undefined)[] = board.map((current, index) => {
    const planned = plans.get(index)
    if (removed.has(index)) return undefined
    return {
      tile: planned === undefined
        ? current
        : tile(current.ecology, planned, current.lockedActions, current.hazardActions),
      source: index,
    }
  })
  const fallRows = Array.from({ length: MATCH_BOARD_CELLS }, () => 0)
  for (let column = 0; column < MATCH_BOARD_SIZE; column += 1) {
    const kept: { tile: MatchTile; source: number }[] = []
    for (let row = MATCH_BOARD_SIZE - 1; row >= 0; row -= 1) {
      const current = survivors[row * MATCH_BOARD_SIZE + column]
      if (current !== undefined) kept.push(current)
    }
    const spawnedRows = MATCH_BOARD_SIZE - kept.length
    for (let row = MATCH_BOARD_SIZE - 1, cursor = 0; row >= 0; row -= 1, cursor += 1) {
      const destination = row * MATCH_BOARD_SIZE + column
      const current = kept[cursor]
      if (current !== undefined) {
        board[destination] = current.tile
        fallRows[destination] = row - rowOf(current.source)
      } else {
        board[destination] = tile(chooseEcology(random, () => true))
        fallRows[destination] = spawnedRows
      }
    }
  }
  return fallRows
}

function resolveFrom(
  boardValue: readonly MatchTile[],
  random: RandomSource,
  firstIndexes: ReadonlySet<number> | undefined,
  preferred: readonly number[],
): MatchResolution {
  let board = cloneBoard(boardValue)
  const steps: MatchResolutionStep[] = []
  const frames: MatchCascadeFrame[] = []
  let initial = firstIndexes
  for (let chain = 1; chain <= MAX_MATCH_CASCADES; chain += 1) {
    const groups = initial === undefined ? groupsInBoard(board) : []
    if (initial === undefined && groups.length === 0) break
    const plans = initial === undefined ? plannedSpecials(groups, chain === 1 ? preferred : []) : new Map<number, TileSpecial>()
    const seeds = new Set(initial ?? groups.flatMap(group => group.indexes))
    initial = undefined
    for (const anchor of plans.keys()) seeds.delete(anchor)
    const expanded = expandSpecials(board, seeds)
    const counts = emptyCounts()
    for (const index of expanded.indexes) counts[board[index]!.ecology] += 1
    const before = cloneBoard(board)
    for (const [index, special] of plans) {
      before[index] = tile(
        before[index]!.ecology,
        special,
        before[index]!.lockedActions,
        before[index]!.hazardActions,
      )
    }
    const fallRows = collapseAndFill(board, expanded.indexes, plans, random)
    frames.push({
      chain,
      before,
      after: cloneBoard(board),
      removed: [...expanded.indexes].sort((left, right) => left - right),
      fallRows,
    })
    steps.push(Object.freeze({
      chain,
      counts: Object.freeze(counts),
      maxGroup: groups.reduce((max, group) => Math.max(max, group.indexes.length), 0),
      specialCount: expanded.count,
    }))
  }
  if (groupsInBoard(board).length > 0 || findFirstLegalBattleSwap(board) === undefined) {
    board = createMatchBoard(random)
  }
  return { board, steps, frames }
}

export function resolveBattleSwap(
  boardValue: readonly MatchTile[],
  from: number,
  to: number,
  random: RandomSource,
): MatchResolution | undefined {
  if (boardValue.length !== MATCH_BOARD_CELLS || !areAdjacentTiles(from, to)) return undefined
  const board = cloneBoard(boardValue)
  const first = board[from]!
  const second = board[to]!
  if ((first.lockedActions ?? 0) > 0 || (second.lockedActions ?? 0) > 0) return undefined
  rawSwap(board, from, to)
  if (first.special === 'origin' || second.special === 'origin') {
    const clear = new Set<number>([from, to])
    if (first.special === 'origin' && second.special === 'origin') {
      for (let index = 0; index < MATCH_BOARD_CELLS; index += 1) clear.add(index)
    } else {
      const ecology = first.special === 'origin' ? second.ecology : first.ecology
      for (let index = 0; index < board.length; index += 1) {
        if (board[index]!.ecology === ecology) clear.add(index)
      }
    }
    return resolveFrom(board, random, clear, [to, from])
  }
  if (groupsInBoard(board).length === 0) return undefined
  return resolveFrom(board, random, undefined, [to, from])
}

export function resolveForcedTiles(
  board: readonly MatchTile[],
  indexes: readonly number[],
  random: RandomSource,
): MatchResolution {
  const bounded = new Set(indexes.filter(index => Number.isInteger(index) && index >= 0 && index < MATCH_BOARD_CELLS))
  return bounded.size === 0
    ? { board: cloneBoard(board), steps: [], frames: [] }
    : resolveFrom(board, random, bounded, [])
}

export function resolveExistingBattleMatches(
  board: readonly MatchTile[],
  random: RandomSource,
): MatchResolution {
  return groupsInBoard(board).length === 0
    ? { board: cloneBoard(board), steps: [], frames: [] }
    : resolveFrom(board, random, undefined, [])
}

export function convertRandomBattleTiles(
  boardValue: readonly MatchTile[],
  ecology: TraceEcology,
  count: number,
  random: RandomSource,
): MatchTile[] {
  const board = cloneBoard(boardValue)
  const candidates = board.map((current, index) => (
    current.special === 'none' && (current.lockedActions ?? 0) === 0 && (current.hazardActions ?? 0) === 0
      && current.ecology !== ecology ? index : -1
  ))
    .filter(index => index >= 0)
  const limit = Math.min(Math.max(0, Math.floor(count)), candidates.length)
  for (let converted = 0; converted < limit; converted += 1) {
    const cursor = Math.floor(boundedRandom(random) * candidates.length)
    const index = candidates.splice(cursor, 1)[0]!
    board[index] = tile(ecology)
  }
  return board
}

export function reshuffleBattleBoard(boardValue: readonly MatchTile[], random: RandomSource): MatchTile[] {
  const specials = boardValue.filter(current => current.special !== 'none').map(current => current.special)
  const board = createMatchBoard(random)
  for (let cursor = 0; cursor < specials.length && cursor < board.length; cursor += 1) {
    board[cursor] = tile(board[cursor]!.ecology, specials[cursor]!)
  }
  return board
}
