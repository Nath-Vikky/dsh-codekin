import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { createHash, randomInt } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
//#region lib/types/core/catalog.js
const TRACE_ECOLOGIES = Object.freeze([
	"lumen",
	"forge",
	"relay",
	"aegis",
	"glitch"
]);
const CAPTURE_CORE_QUALITIES = Object.freeze([
	"pebble",
	"pulse",
	"prism",
	"nova",
	"origin"
]);
const CORE_DROP_WEIGHTS = Object.freeze({
	pebble: 55,
	pulse: 25,
	prism: 12,
	nova: 6,
	origin: 2
});
const CORE_CAPTURE_MULTIPLIERS = Object.freeze({
	pebble: .85,
	pulse: 1.05,
	prism: 1.3,
	nova: 1.65,
	origin: 2.1
});
const RARITY_STATS = Object.freeze({
	common: Object.freeze({
		hp: 36,
		attack: 7,
		defense: 5,
		speed: 10
	}),
	uncommon: Object.freeze({
		hp: 39,
		attack: 8,
		defense: 6,
		speed: 11
	}),
	rare: Object.freeze({
		hp: 42,
		attack: 9,
		defense: 7,
		speed: 12
	}),
	apex: Object.freeze({
		hp: 46,
		attack: 10,
		defense: 8,
		speed: 13
	})
});
const ROWS$1 = Object.freeze([
	[
		1,
		"lumen-indeximp",
		"索引团",
		"Indeximp",
		"lumen",
		"common",
		"marker",
		.55,
		"index-flash"
	],
	[
		2,
		"lumen-foliomoth",
		"页翼蛾",
		"Foliomoth",
		"lumen",
		"common",
		"support",
		.55,
		"page-veil"
	],
	[
		3,
		"lumen-lensel",
		"镜尾鼬",
		"Lensel",
		"lumen",
		"uncommon",
		"scout",
		.42,
		"prism-trace"
	],
	[
		4,
		"lumen-echocoil",
		"回声螺",
		"Echocoil",
		"lumen",
		"rare",
		"echo-support",
		.28,
		"echo-archive"
	],
	[
		5,
		"lumen-atlashart",
		"星图鹿",
		"Atlashart",
		"lumen",
		"apex",
		"lumen-leader",
		.16,
		"atlas-field"
	],
	[
		6,
		"forge-sparkmite",
		"火花螨",
		"Sparkmite",
		"forge",
		"common",
		"multi-hit",
		.55,
		"spark-hop"
	],
	[
		7,
		"forge-rivetclaw",
		"铆钉蟹",
		"Rivetclaw",
		"forge",
		"common",
		"counter-tank",
		.55,
		"rivet-rebound"
	],
	[
		8,
		"forge-solderling",
		"熔线蜥",
		"Solderling",
		"forge",
		"uncommon",
		"damage-link",
		.42,
		"solder-bridge"
	],
	[
		9,
		"forge-anvilback",
		"砧背兽",
		"Anvilback",
		"forge",
		"rare",
		"shield-breaker",
		.28,
		"falling-anvil"
	],
	[
		10,
		"forge-kiln-colossus",
		"炉心巨像",
		"Kiln Colossus",
		"forge",
		"apex",
		"forge-leader",
		.16,
		"kiln-overload"
	],
	[
		11,
		"relay-pingfly",
		"信标萤",
		"Pingfly",
		"relay",
		"common",
		"initiative",
		.55,
		"beacon-handshake"
	],
	[
		12,
		"relay-duplex-hare",
		"双相兔",
		"Duplex Hare",
		"relay",
		"common",
		"stance-switch",
		.55,
		"duplex-switch"
	],
	[
		13,
		"relay-routeray",
		"路由鳐",
		"Routeray",
		"relay",
		"uncommon",
		"position-control",
		.42,
		"soft-route"
	],
	[
		14,
		"relay-forktail",
		"分岔貂",
		"Forktail",
		"relay",
		"rare",
		"combo",
		.28,
		"fork-return"
	],
	[
		15,
		"relay-mesh-jelly",
		"群星水母",
		"Mesh Jelly",
		"relay",
		"apex",
		"relay-leader",
		.16,
		"mesh-resonance"
	],
	[
		16,
		"aegis-veribud",
		"校验芽",
		"Veribud",
		"aegis",
		"common",
		"cleanse-heal",
		.55,
		"verify-dew"
	],
	[
		17,
		"aegis-loop-tortoise",
		"环盾龟",
		"Loop Tortoise",
		"aegis",
		"common",
		"protector",
		.55,
		"loop-guard"
	],
	[
		18,
		"aegis-anchorbee",
		"定锚蜂",
		"Anchorbee",
		"aegis",
		"uncommon",
		"field-lock",
		.42,
		"anchor-field"
	],
	[
		19,
		"aegis-steady-ram",
		"稳态羊",
		"Steady Ram",
		"aegis",
		"rare",
		"debuff-converter",
		.28,
		"steady-rebound"
	],
	[
		20,
		"aegis-dawnguard",
		"曙光狮",
		"Dawnguard",
		"aegis",
		"apex",
		"aegis-leader",
		.16,
		"dawn-restart"
	],
	[
		21,
		"glitch-null-nibbler",
		"空值虫",
		"Null Nibbler",
		"glitch",
		"common",
		"buff-eater",
		.55,
		"null-bite"
	],
	[
		22,
		"glitch-stack-weaver",
		"栈裂蛛",
		"Stack Weaver",
		"glitch",
		"common",
		"corruption-control",
		.55,
		"broken-stack-web"
	],
	[
		23,
		"glitch-lagtoad",
		"超时蛙",
		"Lagtoad",
		"glitch",
		"uncommon",
		"delay-counter",
		.42,
		"delayed-payback"
	],
	[
		24,
		"glitch-crashfox",
		"红屏狐",
		"Crashfox",
		"glitch",
		"rare",
		"glass-cannon",
		.28,
		"crash-flare"
	],
	[
		25,
		"glitch-overflow-maw",
		"溢流巨兽",
		"Overflow Maw",
		"glitch",
		"apex",
		"glitch-leader",
		.16,
		"boundary-overflow"
	]
]);
const CREATURE_CATALOG = Object.freeze(ROWS$1.map((row) => {
	const [number, id, nameZh, nameEn, ecology, rarity, combatRole, baseCaptureRate, signatureProtocol] = row;
	const base = RARITY_STATS[rarity];
	const ecologyOffset = TRACE_ECOLOGIES.indexOf(ecology);
	return Object.freeze({
		number,
		id,
		nameZh,
		nameEn,
		ecology,
		rarity,
		combatRole,
		baseCaptureRate,
		signatureProtocol,
		spriteIndex: (number - 1) % 5,
		stats: Object.freeze({
			hp: base.hp + ecologyOffset * 2,
			attack: base.attack + number % 3,
			defense: base.defense + number % 2,
			speed: base.speed + (number + 1) % 3
		})
	});
}));
const BY_ID = new Map(CREATURE_CATALOG.map((creature) => [creature.id, creature]));
function creatureById(id) {
	return BY_ID.get(id);
}
function creaturesInEcology(ecology) {
	return CREATURE_CATALOG.filter((creature) => creature.ecology === ecology);
}
const STARTER_CREATURE_IDS = Object.freeze([
	"lumen-indeximp",
	"forge-sparkmite",
	"aegis-veribud"
]);
//#endregion
//#region lib/types/core/match3.js
const MATCH_BOARD_SIZE = 7;
const MATCH_BOARD_CELLS = 49;
const MAX_MATCH_CASCADES = 12;
function boundedRandom$1(random) {
	const value = random();
	if (!Number.isFinite(value)) return 0;
	return Math.min(.999999999, Math.max(0, value));
}
function rowOf(index) {
	return Math.floor(index / 7);
}
function columnOf(index) {
	return index % 7;
}
function areAdjacentTiles(first, second) {
	if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || second < 0 || first >= 49 || second >= 49) return false;
	return Math.abs(rowOf(first) - rowOf(second)) + Math.abs(columnOf(first) - columnOf(second)) === 1;
}
function emptyCounts() {
	return {
		lumen: 0,
		forge: 0,
		relay: 0,
		aegis: 0,
		glitch: 0
	};
}
function chooseEcology(random, allowed) {
	const start = Math.floor(boundedRandom$1(random) * TRACE_ECOLOGIES.length);
	for (let offset = 0; offset < TRACE_ECOLOGIES.length; offset += 1) {
		const ecology = TRACE_ECOLOGIES[(start + offset) % TRACE_ECOLOGIES.length];
		if (allowed(ecology)) return ecology;
	}
	return TRACE_ECOLOGIES[start];
}
function tile(ecology, special = "none", lockedActions = 0, hazardActions = 0) {
	return {
		ecology,
		special,
		...lockedActions > 0 ? { lockedActions } : {},
		...hazardActions > 0 ? { hazardActions } : {}
	};
}
function cloneBoard(board) {
	return board.map((item) => tile(item.ecology, item.special, item.lockedActions, item.hazardActions));
}
function groupsInBoard(board) {
	const groups = [];
	for (let row = 0; row < 7; row += 1) {
		let start = 0;
		while (start < 7) {
			const ecology = board[row * 7 + start].ecology;
			let end = start + 1;
			while (end < 7 && board[row * 7 + end].ecology === ecology) end += 1;
			if (end - start >= 3) groups.push({
				ecology,
				direction: "row",
				indexes: Array.from({ length: end - start }, (_, offset) => row * 7 + start + offset)
			});
			start = end;
		}
	}
	for (let column = 0; column < 7; column += 1) {
		let start = 0;
		while (start < 7) {
			const ecology = board[start * 7 + column].ecology;
			let end = start + 1;
			while (end < 7 && board[end * 7 + column].ecology === ecology) end += 1;
			if (end - start >= 3) groups.push({
				ecology,
				direction: "column",
				indexes: Array.from({ length: end - start }, (_, offset) => (start + offset) * 7 + column)
			});
			start = end;
		}
	}
	return groups;
}
function rawSwap(board, first, second) {
	const value = board[first];
	board[first] = board[second];
	board[second] = value;
}
function findFirstLegalBattleSwap(board) {
	if (board.length !== 49) return void 0;
	const candidate = cloneBoard(board);
	for (let index = 0; index < 49; index += 1) for (const next of [index + 1, index + 7]) {
		if (!areAdjacentTiles(index, next)) continue;
		if ((candidate[index].lockedActions ?? 0) > 0 || (candidate[next].lockedActions ?? 0) > 0) continue;
		if (candidate[index].special === "origin" || candidate[next].special === "origin") return {
			from: index,
			to: next
		};
		rawSwap(candidate, index, next);
		const valid = groupsInBoard(candidate).length > 0;
		rawSwap(candidate, index, next);
		if (valid) return {
			from: index,
			to: next
		};
	}
}
function rankedBattleSwaps(board, preferredEcology) {
	if (board.length !== 49) return [];
	const candidate = cloneBoard(board);
	const ranked = [];
	for (let index = 0; index < 49; index += 1) for (const next of [index + 1, index + 7]) {
		if (!areAdjacentTiles(index, next)) continue;
		const first = candidate[index];
		const second = candidate[next];
		if ((first.lockedActions ?? 0) > 0 || (second.lockedActions ?? 0) > 0) continue;
		if (first.special === "origin" || second.special === "origin") {
			const preferred = first.ecology === preferredEcology || second.ecology === preferredEcology ? 50 : 0;
			const score = (first.special === "origin" && second.special === "origin" ? 2e4 : 1e4) + preferred;
			ranked.push({
				swap: {
					from: index,
					to: next
				},
				score,
				weight: first.special === "origin" && second.special === "origin" ? 10 : 7
			});
			continue;
		}
		rawSwap(candidate, index, next);
		const groups = groupsInBoard(candidate);
		rawSwap(candidate, index, next);
		if (groups.length === 0) continue;
		const maximum = groups.reduce((value, group) => Math.max(value, group.indexes.length), 0);
		const preferred = groups.filter((group) => group.ecology === preferredEcology).reduce((value, group) => value + group.indexes.length, 0);
		const total = groups.reduce((value, group) => value + group.indexes.length, 0);
		const score = maximum * 100 + preferred * 4 + total;
		ranked.push({
			swap: {
				from: index,
				to: next
			},
			score,
			weight: 1 + preferred * .35 + Math.max(0, maximum - 3) * 1.5
		});
	}
	return ranked;
}
function findBestBattleSwap(board, preferredEcology) {
	return rankedBattleSwaps(board, preferredEcology).sort((left, right) => right.score - left.score)[0]?.swap;
}
function chooseBossBattleSwap(board, preferredEcology, random) {
	const ranked = rankedBattleSwaps(board, preferredEcology);
	const total = ranked.reduce((sum, row) => sum + row.weight, 0);
	if (total <= 0) return void 0;
	let cursor = boundedRandom$1(random) * total;
	for (const row of ranked) {
		cursor -= row.weight;
		if (cursor < 0) return row.swap;
	}
	return ranked.at(-1)?.swap;
}
function hasBattleMatches(board) {
	return board.length === 49 && groupsInBoard(board).length > 0;
}
function createMatchBoard(random) {
	for (let attempt = 0; attempt < 24; attempt += 1) {
		const board = [];
		for (let index = 0; index < 49; index += 1) {
			const row = rowOf(index);
			const column = columnOf(index);
			const ecology = chooseEcology(random, (candidate) => !(column >= 2 && board[index - 1]?.ecology === candidate && board[index - 2]?.ecology === candidate || row >= 2 && board[index - 7]?.ecology === candidate && board[index - 14]?.ecology === candidate));
			board.push(tile(ecology));
		}
		if (findFirstLegalBattleSwap(board) !== void 0) return board;
	}
	const board = Array.from({ length: 49 }, (_, index) => tile(TRACE_ECOLOGIES[(rowOf(index) * 2 + columnOf(index)) % TRACE_ECOLOGIES.length]));
	board[0] = tile("lumen");
	board[1] = tile("forge");
	board[2] = tile("lumen");
	board[8] = tile("lumen");
	return board;
}
function plannedSpecials(groups, preferred) {
	const appearances = /* @__PURE__ */ new Map();
	for (const group of groups) for (const index of group.indexes) appearances.set(index, (appearances.get(index) ?? 0) + 1);
	const plans = /* @__PURE__ */ new Map();
	for (const group of groups) {
		const intersection = group.indexes.find((index) => (appearances.get(index) ?? 0) > 1);
		const chosen = preferred.find((index) => group.indexes.includes(index)) ?? intersection ?? group.indexes[Math.floor(group.indexes.length / 2)];
		const special = intersection !== void 0 ? "burst" : group.indexes.length >= 5 ? "origin" : group.indexes.length === 4 ? group.direction : "none";
		if (special !== "none") {
			const current = plans.get(chosen);
			if (current === void 0 || current === "row" || current === "column") plans.set(chosen, special);
		}
	}
	return plans;
}
function expandSpecials(board, initial) {
	const indexes = new Set(initial);
	const queue = [...initial];
	const triggered = /* @__PURE__ */ new Set();
	while (queue.length > 0) {
		const index = queue.shift();
		const current = board[index];
		if (current === void 0 || current.special === "none" || triggered.has(index)) continue;
		triggered.add(index);
		const add = (candidate) => {
			if (candidate < 0 || candidate >= 49 || indexes.has(candidate)) return;
			indexes.add(candidate);
			queue.push(candidate);
		};
		if (current.special === "row") {
			const start = rowOf(index) * 7;
			for (let offset = 0; offset < 7; offset += 1) add(start + offset);
		} else if (current.special === "column") {
			const column = columnOf(index);
			for (let row = 0; row < 7; row += 1) add(row * 7 + column);
		} else if (current.special === "burst") {
			const centerRow = rowOf(index);
			const centerColumn = columnOf(index);
			for (let row = centerRow - 1; row <= centerRow + 1; row += 1) for (let column = centerColumn - 1; column <= centerColumn + 1; column += 1) if (row >= 0 && row < 7 && column >= 0 && column < 7) add(row * 7 + column);
		} else for (let candidate = 0; candidate < board.length; candidate += 1) if (board[candidate].ecology === current.ecology) add(candidate);
	}
	return {
		indexes,
		count: triggered.size
	};
}
function collapseAndFill(board, removed, plans, random) {
	const survivors = board.map((current, index) => {
		const planned = plans.get(index);
		if (removed.has(index)) return void 0;
		return {
			tile: planned === void 0 ? current : tile(current.ecology, planned, current.lockedActions, current.hazardActions),
			source: index
		};
	});
	const fallRows = Array.from({ length: 49 }, () => 0);
	for (let column = 0; column < 7; column += 1) {
		const kept = [];
		for (let row = 6; row >= 0; row -= 1) {
			const current = survivors[row * 7 + column];
			if (current !== void 0) kept.push(current);
		}
		const spawnedRows = 7 - kept.length;
		for (let row = 6, cursor = 0; row >= 0; row -= 1, cursor += 1) {
			const destination = row * 7 + column;
			const current = kept[cursor];
			if (current !== void 0) {
				board[destination] = current.tile;
				fallRows[destination] = row - rowOf(current.source);
			} else {
				board[destination] = tile(chooseEcology(random, () => true));
				fallRows[destination] = spawnedRows;
			}
		}
	}
	return fallRows;
}
function resolveFrom(boardValue, random, firstIndexes, preferred) {
	let board = cloneBoard(boardValue);
	const steps = [];
	const frames = [];
	let initial = firstIndexes;
	for (let chain = 1; chain <= 12; chain += 1) {
		const groups = initial === void 0 ? groupsInBoard(board) : [];
		if (initial === void 0 && groups.length === 0) break;
		const plans = initial === void 0 ? plannedSpecials(groups, chain === 1 ? preferred : []) : /* @__PURE__ */ new Map();
		const seeds = new Set(initial ?? groups.flatMap((group) => group.indexes));
		initial = void 0;
		for (const anchor of plans.keys()) seeds.delete(anchor);
		const expanded = expandSpecials(board, seeds);
		const counts = emptyCounts();
		for (const index of expanded.indexes) counts[board[index].ecology] += 1;
		const before = cloneBoard(board);
		for (const [index, special] of plans) before[index] = tile(before[index].ecology, special, before[index].lockedActions, before[index].hazardActions);
		const fallRows = collapseAndFill(board, expanded.indexes, plans, random);
		frames.push({
			chain,
			before,
			after: cloneBoard(board),
			removed: [...expanded.indexes].sort((left, right) => left - right),
			fallRows
		});
		steps.push(Object.freeze({
			chain,
			counts: Object.freeze(counts),
			maxGroup: groups.reduce((max, group) => Math.max(max, group.indexes.length), 0),
			specialCount: expanded.count
		}));
	}
	if (groupsInBoard(board).length > 0 || findFirstLegalBattleSwap(board) === void 0) board = createMatchBoard(random);
	return {
		board,
		steps,
		frames
	};
}
function resolveBattleSwap(boardValue, from, to, random) {
	if (boardValue.length !== 49 || !areAdjacentTiles(from, to)) return void 0;
	const board = cloneBoard(boardValue);
	const first = board[from];
	const second = board[to];
	if ((first.lockedActions ?? 0) > 0 || (second.lockedActions ?? 0) > 0) return void 0;
	rawSwap(board, from, to);
	if (first.special === "origin" || second.special === "origin") {
		const clear = /* @__PURE__ */ new Set([from, to]);
		if (first.special === "origin" && second.special === "origin") for (let index = 0; index < 49; index += 1) clear.add(index);
		else {
			const ecology = first.special === "origin" ? second.ecology : first.ecology;
			for (let index = 0; index < board.length; index += 1) if (board[index].ecology === ecology) clear.add(index);
		}
		return resolveFrom(board, random, clear, [to, from]);
	}
	if (groupsInBoard(board).length === 0) return void 0;
	return resolveFrom(board, random, void 0, [to, from]);
}
function resolveForcedTiles(board, indexes, random) {
	const bounded = new Set(indexes.filter((index) => Number.isInteger(index) && index >= 0 && index < 49));
	return bounded.size === 0 ? {
		board: cloneBoard(board),
		steps: [],
		frames: []
	} : resolveFrom(board, random, bounded, []);
}
function resolveExistingBattleMatches(board, random) {
	return groupsInBoard(board).length === 0 ? {
		board: cloneBoard(board),
		steps: [],
		frames: []
	} : resolveFrom(board, random, void 0, []);
}
function convertRandomBattleTiles(boardValue, ecology, count, random) {
	const board = cloneBoard(boardValue);
	const candidates = board.map((current, index) => current.special === "none" && (current.lockedActions ?? 0) === 0 && (current.hazardActions ?? 0) === 0 && current.ecology !== ecology ? index : -1).filter((index) => index >= 0);
	const limit = Math.min(Math.max(0, Math.floor(count)), candidates.length);
	for (let converted = 0; converted < limit; converted += 1) {
		const cursor = Math.floor(boundedRandom$1(random) * candidates.length);
		const index = candidates.splice(cursor, 1)[0];
		board[index] = tile(ecology);
	}
	return board;
}
function reshuffleBattleBoard(boardValue, random) {
	const specials = boardValue.filter((current) => current.special !== "none").map((current) => current.special);
	const board = createMatchBoard(random);
	for (let cursor = 0; cursor < specials.length && cursor < board.length; cursor += 1) board[cursor] = tile(board[cursor].ecology, specials[cursor]);
	return board;
}
//#endregion
//#region lib/types/core/protocol.js
function plainRecord(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError("invalid action");
	return value;
}
function exactKeys(record, keys) {
	const actual = Object.keys(record);
	if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) throw new TypeError("invalid action");
}
function safeId(value, prefix) {
	if (typeof value !== "string" || value.length < 3 || value.length > 96 || !/^[a-z0-9_-]+$/.test(value) || prefix !== void 0 && !value.startsWith(prefix)) throw new TypeError("invalid action");
	return value;
}
function boardIndex(value) {
	if (!Number.isSafeInteger(value) || value < 0 || value >= 49) throw new TypeError("invalid action");
	return value;
}
function normalizeTraceWildAction(value) {
	const row = plainRecord(value);
	switch (row.type) {
		case "choose-starter":
			exactKeys(row, ["type", "creatureId"]);
			return {
				type: "choose-starter",
				creatureId: safeId(row.creatureId)
			};
		case "start-battle":
			exactKeys(row, ["type", "encounterId"]);
			return {
				type: "start-battle",
				encounterId: safeId(row.encounterId, "wild_")
			};
		case "start-tower":
			exactKeys(row, ["type"]);
			return { type: "start-tower" };
		case "battle-swap":
			exactKeys(row, [
				"type",
				"from",
				"to"
			]);
			return {
				type: "battle-swap",
				from: boardIndex(row.from),
				to: boardIndex(row.to)
			};
		case "battle-cast":
			exactKeys(row, ["type", "creatureInstanceId"]);
			return {
				type: "battle-cast",
				creatureInstanceId: safeId(row.creatureInstanceId, "pet_")
			};
		case "battle-skip-stage":
			exactKeys(row, ["type"]);
			return { type: "battle-skip-stage" };
		case "battle-continue":
			exactKeys(row, ["type"]);
			return { type: "battle-continue" };
		case "capture":
			exactKeys(row, ["type", "quality"]);
			if (!CAPTURE_CORE_QUALITIES.includes(row.quality)) throw new TypeError("invalid action");
			return {
				type: "capture",
				quality: row.quality
			};
		case "claim-idle-reward":
			exactKeys(row, ["type"]);
			return { type: "claim-idle-reward" };
		case "feed-material":
			exactKeys(row, [
				"type",
				"creatureInstanceId",
				"quality",
				"count"
			]);
			if (!CAPTURE_CORE_QUALITIES.includes(row.quality) || !Number.isSafeInteger(row.count) || row.count < 1 || row.count > 99) throw new TypeError("invalid action");
			return {
				type: "feed-material",
				creatureInstanceId: safeId(row.creatureInstanceId, "pet_"),
				quality: row.quality,
				count: row.count
			};
		case "release-creature":
			exactKeys(row, ["type", "creatureInstanceId"]);
			return {
				type: "release-creature",
				creatureInstanceId: safeId(row.creatureInstanceId, "pet_")
			};
		case "flee":
			exactKeys(row, ["type"]);
			return { type: "flee" };
		case "set-squad":
			exactKeys(row, ["type", "instanceIds"]);
			if (!Array.isArray(row.instanceIds) || row.instanceIds.length < 1 || row.instanceIds.length > 3) throw new TypeError("invalid action");
			return {
				type: "set-squad",
				instanceIds: row.instanceIds.map((id) => safeId(id, "pet_"))
			};
		case "set-enabled":
			exactKeys(row, ["type", "enabled"]);
			if (typeof row.enabled !== "boolean") throw new TypeError("invalid action");
			return {
				type: "set-enabled",
				enabled: row.enabled
			};
		default: throw new TypeError("invalid action");
	}
}
//#endregion
//#region lib/types/core/balance.js
const MAX_PLAYER_LEVEL = 100;
const BASE_ACTIONS_PER_CREATURE = 3;
const MAX_ACTIONS_PER_CREATURE = 5;
const MAX_BONUS_ACTIONS_PER_STAGE = 2;
const BASE_BOSS_ACTIONS = 3;
const MAX_BOSS_ACTIONS = 5;
const MAX_BOSS_BONUS_ACTIONS = 2;
const MAX_BOSS_SWAPS_PER_PHASE = 7;
const BOSS_SKILL_ENERGY_COST = 12;
const BOSS_SKILL_ENERGY_LIMIT = 24;
const CAPTURE_HEALTH_RATIO = .5;
const MAX_CAPTURE_ATTEMPTS = 999999;
const MAX_MAP_ENCOUNTERS = 7;
const MINUTE_MS = 6e4;
const ENCOUNTER_LIFETIME_MINUTES = Object.freeze({
	pebble: Object.freeze({
		lowLevel: 1440,
		highLevel: 720
	}),
	pulse: Object.freeze({
		lowLevel: 720,
		highLevel: 360
	}),
	prism: Object.freeze({
		lowLevel: 360,
		highLevel: 120
	}),
	nova: Object.freeze({
		lowLevel: 90,
		highLevel: 40
	}),
	origin: Object.freeze({
		lowLevel: 60,
		highLevel: 30
	})
});
const QUALITY_ORDER = Object.freeze([
	"pebble",
	"pulse",
	"prism",
	"nova",
	"origin"
]);
const PLAYER_QUALITY_BASE_MULTIPLIERS = Object.freeze({
	pebble: .82,
	pulse: .91,
	prism: 1,
	nova: 1.1,
	origin: 1.22
});
const PLAYER_QUALITY_GROWTH_BONUSES = Object.freeze({
	pebble: .48,
	pulse: .6,
	prism: .74,
	nova: .91,
	origin: 1.1
});
/** @deprecated Use PLAYER_QUALITY_BASE_MULTIPLIERS for new balance work. */
const PLAYER_QUALITY_MULTIPLIERS = PLAYER_QUALITY_BASE_MULTIPLIERS;
const XP_QUALITY_MULTIPLIERS = Object.freeze({
	pebble: .72,
	pulse: .86,
	prism: 1,
	nova: 1.28,
	origin: 1.65
});
const CORE_CAPTURE_POWER = Object.freeze({
	pebble: .72,
	pulse: 1,
	prism: 1.38,
	nova: 1.9,
	origin: 2.6
});
const WILD_QUALITY_RESISTANCE = Object.freeze({
	pebble: 1,
	pulse: .92,
	prism: .82,
	nova: .7,
	origin: .56
});
const MATERIAL_XP = Object.freeze({
	pebble: 40,
	pulse: 100,
	prism: 250,
	nova: 650,
	origin: 1600
});
const WILD_QUALITY_WEIGHTS = Object.freeze([
	Object.freeze({
		pebble: 78,
		pulse: 19,
		prism: 3,
		nova: 0,
		origin: 0
	}),
	Object.freeze({
		pebble: 64,
		pulse: 27,
		prism: 8,
		nova: 1,
		origin: 0
	}),
	Object.freeze({
		pebble: 50,
		pulse: 32,
		prism: 14,
		nova: 4,
		origin: 0
	}),
	Object.freeze({
		pebble: 38,
		pulse: 34,
		prism: 20,
		nova: 7,
		origin: 1
	}),
	Object.freeze({
		pebble: 28,
		pulse: 32,
		prism: 25,
		nova: 12,
		origin: 3
	}),
	Object.freeze({
		pebble: 20,
		pulse: 29,
		prism: 29,
		nova: 17,
		origin: 5
	})
]);
const CORE_QUALITY_WEIGHTS = Object.freeze([
	Object.freeze({
		pebble: 70,
		pulse: 23,
		prism: 6,
		nova: 1,
		origin: 0
	}),
	Object.freeze({
		pebble: 58,
		pulse: 28,
		prism: 11,
		nova: 3,
		origin: 0
	}),
	Object.freeze({
		pebble: 46,
		pulse: 31,
		prism: 17,
		nova: 5,
		origin: 1
	}),
	Object.freeze({
		pebble: 35,
		pulse: 32,
		prism: 23,
		nova: 8,
		origin: 2
	}),
	Object.freeze({
		pebble: 27,
		pulse: 31,
		prism: 27,
		nova: 12,
		origin: 3
	}),
	Object.freeze({
		pebble: 22,
		pulse: 29,
		prism: 28,
		nova: 16,
		origin: 5
	})
]);
const MATERIAL_DROP_WEIGHTS = Object.freeze({
	pebble: Object.freeze({
		pebble: 82,
		pulse: 17,
		prism: 1,
		nova: 0,
		origin: 0
	}),
	pulse: Object.freeze({
		pebble: 30,
		pulse: 60,
		prism: 10,
		nova: 0,
		origin: 0
	}),
	prism: Object.freeze({
		pebble: 8,
		pulse: 27,
		prism: 58,
		nova: 7,
		origin: 0
	}),
	nova: Object.freeze({
		pebble: 2,
		pulse: 8,
		prism: 28,
		nova: 57,
		origin: 5
	}),
	origin: Object.freeze({
		pebble: 0,
		pulse: 3,
		prism: 12,
		nova: 35,
		origin: 50
	})
});
const IDLE_QUALITY_WEIGHTS = Object.freeze([
	Object.freeze({
		pebble: 80,
		pulse: 18,
		prism: 2,
		nova: 0,
		origin: 0
	}),
	Object.freeze({
		pebble: 65,
		pulse: 27,
		prism: 7,
		nova: 1,
		origin: 0
	}),
	Object.freeze({
		pebble: 50,
		pulse: 31,
		prism: 15,
		nova: 4,
		origin: 0
	}),
	Object.freeze({
		pebble: 45,
		pulse: 31,
		prism: 18,
		nova: 6,
		origin: 0
	})
]);
const WILD_HP_QUALITY = Object.freeze({
	pebble: 1,
	pulse: 1.15,
	prism: 1.35,
	nova: 1.6,
	origin: 1.95
});
const WILD_ATTACK_QUALITY = Object.freeze({
	pebble: 1,
	pulse: 1.07,
	prism: 1.16,
	nova: 1.28,
	origin: 1.42
});
const WILD_DEFENSE_QUALITY = Object.freeze({
	pebble: 1,
	pulse: 1.04,
	prism: 1.09,
	nova: 1.15,
	origin: 1.22
});
const WILD_BASE_HP = Object.freeze({
	common: 48,
	uncommon: 52,
	rare: 57,
	apex: 63
});
const SPECIES_CAPTURE_CAP = Object.freeze({
	common: .95,
	uncommon: .9,
	rare: .82,
	apex: .72
});
const QUALITY_LEVEL_BONUS = Object.freeze([
	0,
	1,
	3,
	6,
	10
]);
const QUALITY_LEVEL_CAP = Object.freeze([
	6,
	8,
	11,
	14,
	18
]);
function boundedMinutes(value) {
	return Number.isFinite(value) ? Math.min(180, Math.max(0, value)) : 0;
}
function qualityIndex(quality) {
	return QUALITY_ORDER.indexOf(quality);
}
/**
* Host-authoritative time for a wild encounter to remain on the map.
* Level pressure reaches its cap at level 50 so genuinely threatening Nova
* and Origin encounters settle near the requested 30-minute window, while
* low-quality encounters remain available for many hours.
*/
function encounterLifetimeMs(quality, levelValue) {
	const pressure = Math.min(1, ((Number.isFinite(levelValue) ? Math.min(100, Math.max(1, Math.round(levelValue))) : 1) - 1) / 49);
	const profile = ENCOUNTER_LIFETIME_MINUTES[quality];
	return Math.round(profile.lowLevel + (profile.highLevel - profile.lowLevel) * pressure) * MINUTE_MS;
}
function activeMinuteBand(activeMinutes) {
	const minutes = boundedMinutes(activeMinutes);
	if (minutes < 5) return 0;
	if (minutes < 15) return 1;
	if (minutes < 30) return 2;
	if (minutes < 60) return 3;
	if (minutes < 120) return 4;
	return 5;
}
function wildQualityWeights(activeMinutes) {
	return WILD_QUALITY_WEIGHTS[activeMinuteBand(activeMinutes)];
}
function coreQualityWeights(activeMinutes) {
	return CORE_QUALITY_WEIGHTS[activeMinuteBand(activeMinutes)];
}
function idleRewardTier(elapsedMinutesValue) {
	const elapsedMinutes = Number.isFinite(elapsedMinutesValue) ? Math.max(0, elapsedMinutesValue) : 0;
	if (elapsedMinutes < 60) return {
		materialCount: 0,
		coreCount: 0
	};
	if (elapsedMinutes < 180) return {
		materialCount: 1,
		coreCount: 1,
		weights: IDLE_QUALITY_WEIGHTS[0]
	};
	if (elapsedMinutes < 360) return {
		materialCount: 2,
		coreCount: 1,
		weights: IDLE_QUALITY_WEIGHTS[1]
	};
	if (elapsedMinutes < 720) return {
		materialCount: 3,
		coreCount: 1,
		weights: IDLE_QUALITY_WEIGHTS[2]
	};
	return {
		materialCount: 4,
		coreCount: 1,
		weights: IDLE_QUALITY_WEIGHTS[3]
	};
}
const PLAYER_STAT_REFERENCES = Object.freeze({
	hp: 42,
	attack: 9,
	defense: 7,
	speed: 12
});
function playerLevelProgress(levelValue) {
	return Math.pow((Math.min(100, Math.max(1, Math.round(levelValue))) - 1) / 99, 1.08);
}
function playerStatAptitude(baseValue, referenceValue) {
	const ratio = Math.max(.1, baseValue) / referenceValue;
	return Math.min(1.18, Math.max(.82, 1 + .38 * (ratio - 1)));
}
function playerLevelFactor(levelValue, quality = "prism") {
	return 1 + PLAYER_QUALITY_GROWTH_BONUSES[quality] * playerLevelProgress(levelValue);
}
function scaledPlayerStat(baseValue, referenceValue, level, quality) {
	const baseFactor = PLAYER_QUALITY_BASE_MULTIPLIERS[quality];
	const growth = PLAYER_QUALITY_GROWTH_BONUSES[quality] * playerLevelProgress(level) * playerStatAptitude(baseValue, referenceValue);
	return Math.max(1, Math.round(baseValue * baseFactor * (1 + growth)));
}
function playerStats(base, level, quality) {
	return {
		hp: scaledPlayerStat(base.hp, PLAYER_STAT_REFERENCES.hp, level, quality),
		attack: scaledPlayerStat(base.attack, PLAYER_STAT_REFERENCES.attack, level, quality),
		defense: scaledPlayerStat(base.defense, PLAYER_STAT_REFERENCES.defense, level, quality),
		speed: scaledPlayerStat(base.speed, PLAYER_STAT_REFERENCES.speed, level, quality)
	};
}
function xpToNextLevel(levelValue, quality = "prism") {
	const level = Math.min(99, Math.max(1, Math.round(levelValue)));
	return Math.max(1, Math.round((16 + 3 * level + .09 * level * level) * XP_QUALITY_MULTIPLIERS[quality]));
}
function totalXpForLevel(levelValue, quality = "prism") {
	const target = Math.min(100, Math.max(1, Math.round(levelValue)));
	let total = 0;
	for (let level = 1; level < target; level += 1) total += xpToNextLevel(level, quality);
	return total;
}
function levelForXp(xpValue, quality = "prism") {
	const xp = Number.isSafeInteger(xpValue) ? Math.max(0, xpValue) : 0;
	let level = 1;
	let threshold = 0;
	while (level < 100) {
		const next = xpToNextLevel(level, quality);
		if (threshold + next > xp) break;
		threshold += next;
		level += 1;
	}
	return level;
}
function sessionLevel(activeMinutes) {
	return Math.round(1 + 99 * (1 - Math.exp(-boundedMinutes(activeMinutes) / 90)));
}
function effectivePartyLevel(party) {
	if (party.length === 0) return 1;
	const total = party.reduce((sum, creature) => sum + creature.level + QUALITY_LEVEL_BONUS[qualityIndex(creature.quality)], 0);
	return Math.min(100, Math.max(1, Math.round(total / party.length)));
}
function wildLevelFor(partyLevelValue, activeMinutes, quality, jitterValue) {
	const partyLevel = Math.min(100, Math.max(1, Math.round(partyLevelValue)));
	const index = qualityIndex(quality);
	const jitter = Math.min(2, Math.max(-2, Math.round(jitterValue)));
	const raw = Math.round(.65 * partyLevel + .35 * sessionLevel(activeMinutes) + QUALITY_LEVEL_BONUS[index] + jitter);
	const minimum = Math.max(1, partyLevel - 5);
	const maximum = Math.min(100, partyLevel + QUALITY_LEVEL_CAP[index]);
	return Math.min(maximum, Math.max(minimum, raw));
}
/**
* Chooses a wild level from the complete captured roster rather than only the
* active squad. Ordinary qualities stay inside the roster's observed level
* range. Their center is the arithmetic mean, so owning more high-level
* Codekin naturally pulls new encounters toward the roster maximum.
*
* Nova and Origin are exceptional encounters. They are always above the
* roster maximum while the level cap leaves room, with effective session time
* increasing the extra threat.
*/
function wildLevelForRoster(roster, activeMinutes, quality, rollValue) {
	const levels = roster.map((creature) => Math.min(100, Math.max(1, Math.round(creature.level))));
	if (levels.length === 0) return 1;
	const minimum = Math.min(...levels);
	const maximum = Math.max(...levels);
	const roll = Number.isFinite(rollValue) ? Math.min(.999999, Math.max(0, rollValue)) : .5;
	if (quality === "nova" || quality === "origin") {
		if (maximum >= 100) return 100;
		const activityLevel = sessionLevel(activeMinutes);
		const baseBonus = quality === "nova" ? 2 : 4;
		const activityBonus = quality === "nova" ? Math.floor(activityLevel / 25) : Math.floor(activityLevel / 17);
		const randomBonus = Math.floor(roll * 3);
		return Math.min(100, maximum + baseBonus + activityBonus + randomBonus);
	}
	if (minimum === maximum) return minimum;
	const average = levels.reduce((sum, level) => sum + level, 0) / levels.length;
	const span = maximum - minimum;
	const qualityShift = quality === "pebble" ? -.06 * span : quality === "prism" ? .06 * span : 0;
	const jitter = (roll - .5) * .16 * span;
	return Math.min(maximum, Math.max(minimum, Math.round(average + qualityShift + jitter)));
}
function wildStats(definition, levelValue, quality, partySizeValue, partyAverageLevelValue = levelValue) {
	const level = Math.min(100, Math.max(1, Math.round(levelValue)));
	const growth = level - 1;
	const partySize = Math.min(3, Math.max(1, Math.round(partySizeValue)));
	const levelGap = Math.max(0, level - Math.min(100, Math.max(1, Math.round(partyAverageLevelValue))));
	const qualityThreat = qualityIndex(quality);
	const partyBossFactor = 1 + .7 * (partySize - 1);
	const hpLevelFactor = 1 + .018 * growth + 6e-5 * growth * growth;
	const attackLevelFactor = 1 + .012 * growth + 35e-6 * growth * growth;
	const defenseLevelFactor = 1 + .008 * growth + 25e-6 * growth * growth;
	const hpGapPressure = 1 + Math.min(.55, levelGap * (.009 + .00225 * qualityThreat));
	const attackGapPressure = 1 + Math.min(.4, levelGap * (.006 + .00175 * qualityThreat));
	const defenseGapPressure = 1 + Math.min(.28, levelGap * (.004 + .00125 * qualityThreat));
	return {
		hp: Math.max(1, Math.round(WILD_BASE_HP[definition.rarity] * hpLevelFactor * WILD_HP_QUALITY[quality] * partyBossFactor * hpGapPressure)),
		attack: Math.max(1, Math.round(definition.stats.attack * attackLevelFactor * WILD_ATTACK_QUALITY[quality] * attackGapPressure)),
		defense: Math.max(1, Math.round(definition.stats.defense * defenseLevelFactor * WILD_DEFENSE_QUALITY[quality] * defenseGapPressure)),
		speed: Math.max(1, Math.round(definition.stats.speed * attackLevelFactor))
	};
}
function threatPoints(level, quality) {
	return Math.min(160, Math.max(1, Math.round(level))) + qualityIndex(quality) * 15;
}
function captureChance(input) {
	const ratio = Number.isFinite(input.healthRatio) ? Math.min(1, Math.max(0, input.healthRatio)) : 1;
	const hpPressure = .3 + 1.7 * Math.pow(1 - ratio, 1.65);
	const delta = Math.min(100, Math.max(-100, input.partyAverageLevel - input.wildLevel));
	const levelBalance = Math.min(1.15, Math.max(.72, Math.exp(delta / 65)));
	const mercy = Math.min(1.24, 1 + .12 * Math.min(2, Math.max(0, Math.floor(input.priorFailures))));
	const score = Math.max(0, input.baseCaptureRate) * hpPressure * CORE_CAPTURE_POWER[input.coreQuality] * WILD_QUALITY_RESISTANCE[input.wildQuality] * levelBalance * mercy;
	return Math.min(SPECIES_CAPTURE_CAP[input.rarity], Math.max(.02, 1 - Math.exp(-score)));
}
//#endregion
//#region lib/types/core/skills.js
const QUALITY_SKILL_MULTIPLIERS = Object.freeze({
	pebble: .86,
	pulse: .93,
	prism: 1,
	nova: 1.1,
	origin: 1.22
});
const ROWS = Object.freeze([
	[
		"lumen-indeximp",
		"索引标记",
		"Index Mark",
		"每轮首次智算消除施加标记。",
		"The first Compute match each round applies Mark.",
		"索引闪光",
		"Index Flash",
		"造成伤害，将 3 格转为智算。",
		"Deals damage and converts 3 tiles to Compute."
	],
	[
		"lumen-foliomoth",
		"页翼抚慰",
		"Page Comfort",
		"四连智算会修复队伍共享运行值。",
		"A 4+ Compute match repairs shared squad runtime.",
		"页幕",
		"Page Veil",
		"修复共享运行值并提供防护层。",
		"Repairs shared runtime and adds a guard layer."
	],
	[
		"lumen-lensel",
		"连锁洞察",
		"Chain Insight",
		"每阶段首次二层连锁额外获得指令值。",
		"The first 2+ cascade each stage grants extra command points.",
		"棱镜追踪",
		"Prism Trace",
		"将 4 格转为克制敌方的属性。",
		"Converts 4 tiles to the attribute that counters the enemy."
	],
	[
		"lumen-echocoil",
		"回声余韵",
		"Echo Residue",
		"每轮首次二层连锁追加一次回声伤害。",
		"The first 2+ cascade each round echoes part of its damage.",
		"回声档案",
		"Echo Archive",
		"重放上一次有效交换的伤害。",
		"Replays damage from the previous valid swap."
	],
	[
		"lumen-atlashart",
		"星图起点",
		"Atlas Opening",
		"每轮首次消除拥有更高连锁倍率。",
		"The first match each round starts with a higher combo multiplier.",
		"星图领域",
		"Atlas Field",
		"接下来两步的属性倍率最低为克制。",
		"The next two moves use at least the advantaged multiplier."
	],
	[
		"forge-sparkmite",
		"火花追击",
		"Spark Follow-up",
		"四连编译追加一次小型打击。",
		"A 4+ Compile match adds a small follow-up hit.",
		"火花跃迁",
		"Spark Hop",
		"连续造成三次伤害。",
		"Deals three consecutive hits."
	],
	[
		"forge-rivetclaw",
		"铆钉蓄势",
		"Rivet Charge",
		"受击后强化下一次编译伤害。",
		"Taking damage strengthens the next Compile hit.",
		"铆钉回弹",
		"Rivet Rebound",
		"获得防护层并准备一次反击。",
		"Gains a guard layer and prepares a counterattack."
	],
	[
		"forge-solderling",
		"熔线共燃",
		"Solder Burn",
		"编译与其他颜色连锁时施加灼烧。",
		"Compile chained with another color applies Burn.",
		"熔线桥",
		"Solder Bridge",
		"将 4 格转为编译并施加灼烧。",
		"Converts 4 tiles to Compile and applies Burn."
	],
	[
		"forge-anvilback",
		"重砧破层",
		"Anvil Break",
		"五连编译额外破除防火墙。",
		"A 5+ Compile match breaks extra firewall.",
		"落砧",
		"Falling Anvil",
		"重击并破除最多 3 层防火墙。",
		"Strikes heavily and breaks up to 3 firewall layers."
	],
	[
		"forge-kiln-colossus",
		"炉温递增",
		"Rising Heat",
		"编译连锁会强化灼烧。",
		"Compile cascades increase Burn pressure.",
		"炉心过载",
		"Kiln Overload",
		"清除全部编译色块并造成伤害。",
		"Clears every Compile tile and deals damage."
	],
	[
		"relay-pingfly",
		"抢先握手",
		"Early Handshake",
		"进入行动位时获得 2 指令值。",
		"Gains 2 command points when entering the active slot.",
		"信标握手",
		"Beacon Handshake",
		"自动生成并结算一个网络三连。",
		"Creates and resolves a Network match."
	],
	[
		"relay-duplex-hare",
		"双相节拍",
		"Duplex Rhythm",
		"奇数轮强化伤害，偶数轮强化指令值。",
		"Odd rounds boost damage; even rounds boost command points.",
		"双相切换",
		"Duplex Switch",
		"下一次消除的首段伤害重复一次。",
		"Repeats the first damage segment of the next move."
	],
	[
		"relay-routeray",
		"软路由",
		"Soft Route",
		"每阶段首次网络消除会整理一行色块。",
		"The first Network match each stage tidies one row.",
		"路径重排",
		"Route Reroute",
		"重新布置棋盘并保留特殊色块。",
		"Rearranges the board while preserving special tiles."
	],
	[
		"relay-forktail",
		"分岔连击",
		"Fork Combo",
		"连锁获得额外倍率。",
		"Cascades gain additional combo power.",
		"分岔回返",
		"Fork Return",
		"下一次消除会追加一次回返伤害。",
		"The next match adds a returning hit."
	],
	[
		"relay-mesh-jelly",
		"群网供能",
		"Mesh Supply",
		"网络充能时也为其他队员提供少量指令值。",
		"Network charging also supplies other allies.",
		"群网共振",
		"Mesh Resonance",
		"全队获得指令值并将 3 格转为网络。",
		"Grants squad command points and converts 3 tiles to Network."
	],
	[
		"aegis-veribud",
		"校验露珠",
		"Verify Dew",
		"每阶段首次防护消除修复共享运行值。",
		"The first Guard match each stage repairs shared runtime.",
		"完整校验",
		"Full Verify",
		"净化并修复队伍共享运行值。",
		"Cleanses effects and repairs shared squad runtime."
	],
	[
		"aegis-loop-tortoise",
		"环路甲壳",
		"Loop Shell",
		"进入行动位时为队伍提供防护层。",
		"Entering the active slot adds a squad guard layer.",
		"环路守护",
		"Loop Guard",
		"为队伍共享运行值提供防护层。",
		"Guards the shared squad runtime pool."
	],
	[
		"aegis-anchorbee",
		"特殊锚点",
		"Special Anchor",
		"触发特殊色块时为队伍提供防护层。",
		"Triggering a special tile adds a squad guard layer.",
		"定锚力场",
		"Anchor Field",
		"延迟敌方并保护棋盘一阶段。",
		"Delays the enemy and protects the board for one stage."
	],
	[
		"aegis-steady-ram",
		"逆势稳态",
		"Resisted Steady",
		"抵抗色块造成伤害时生成防护层。",
		"Resisted tile damage creates a guard layer.",
		"稳态反弹",
		"Steady Rebound",
		"获得防护层并造成伤害。",
		"Gains a guard layer and deals damage."
	],
	[
		"aegis-dawnguard",
		"曙光保全",
		"Dawn Safeguard",
		"每场战斗首次共享运行值归零时会被保全。",
		"Prevents the first shared-runtime knockout each battle.",
		"曙光重启",
		"Dawn Restart",
		"修复并保护队伍共享运行值。",
		"Repairs and shields shared squad runtime."
	],
	[
		"glitch-null-nibbler",
		"空值侵蚀",
		"Null Erosion",
		"异常消除会额外破除防火墙或防护层。",
		"Glitch matches erode extra firewall or guard layers.",
		"空值啃噬",
		"Null Bite",
		"移除防护并造成伤害。",
		"Removes protection and deals damage."
	],
	[
		"glitch-stack-weaver",
		"栈裂增殖",
		"Stack Growth",
		"二层连锁后生成一个异常色块。",
		"A 2+ cascade creates a Glitch tile.",
		"断栈蛛网",
		"Broken Stack Web",
		"将 5 格转为异常并施加标记。",
		"Converts 5 tiles to Glitch and applies Mark."
	],
	[
		"glitch-lagtoad",
		"超时缓冲",
		"Timeout Buffer",
		"共享运行值首次低于一半时延迟敌方。",
		"Delays the enemy the first time shared runtime drops below half.",
		"延迟回击",
		"Delayed Payback",
		"造成伤害并延迟敌方。",
		"Deals damage and delays the enemy."
	],
	[
		"glitch-crashfox",
		"红线爆发",
		"Redline Burst",
		"共享运行值较低时显著提高伤害。",
		"Deals substantially more damage at low shared runtime.",
		"崩溃闪焰",
		"Crash Flare",
		"造成高额伤害并损失少量共享运行值。",
		"Deals heavy damage at a small shared-runtime cost."
	],
	[
		"glitch-overflow-maw",
		"指令溢流",
		"Command Overflow",
		"满指令值后的少量溢出强化主动技能。",
		"Limited command overflow strengthens the active skill.",
		"边界溢流",
		"Boundary Overflow",
		"吞噬异常色块并转化为伤害。",
		"Consumes Glitch tiles and converts them into damage."
	]
]);
const CREATURE_SKILLS = Object.freeze(ROWS.map((row) => Object.freeze({
	creatureId: row[0],
	energyCost: 12,
	passiveNameZh: row[1],
	passiveNameEn: row[2],
	passiveDescriptionZh: row[3],
	passiveDescriptionEn: row[4],
	activeNameZh: row[5],
	activeNameEn: row[6],
	activeDescriptionZh: row[7],
	activeDescriptionEn: row[8]
})));
const BY_CREATURE_ID = new Map(CREATURE_SKILLS.map((skill) => [skill.creatureId, skill]));
function skillByCreatureId(creatureId) {
	return BY_CREATURE_ID.get(creatureId);
}
//#endregion
//#region lib/types/core/tower.js
const MAX_TOWER_FLOOR = 999999;
function boundedTowerFloor(value) {
	if (!Number.isSafeInteger(value) || value < 1 || value > 999999) throw new TypeError("invalid tower floor");
	return value;
}
function towerSkillTierForFloor(floorValue) {
	const floor = boundedTowerFloor(floorValue);
	if (floor >= 80) return 5;
	if (floor >= 50) return 4;
	if (floor >= 25) return 3;
	if (floor >= 10) return 2;
	return 1;
}
function towerQualityForFloor(floorValue) {
	return QUALITY_ORDER[towerSkillTierForFloor(floorValue) - 1];
}
function towerFloorProfile(floorValue) {
	const floor = boundedTowerFloor(floorValue);
	const skillTier = towerSkillTierForFloor(floor);
	const creature = CREATURE_CATALOG[(floor - 1) % CREATURE_CATALOG.length];
	return Object.freeze({
		floor,
		creatureId: creature.id,
		level: Math.min(9999, floor + 1),
		quality: towerQualityForFloor(floor),
		skillTier,
		startingBossEnergy: (skillTier - 1) * 3,
		armor: skillTier - 1,
		baseMaterialDrops: Math.min(8, skillTier + Math.floor((floor - 1) / 100)),
		milestoneMaterial: floor % 10 === 0
	});
}
function clampStat(value, maximum) {
	return Math.min(maximum, Math.max(1, Math.round(value)));
}
/**
* Player creatures remain capped at level 100. The tower keeps climbing by
* applying a separate, bounded ascension curve after the normal wild formula.
*/
function towerBossStats(definition, profile, partySize, partyAverageLevel) {
	const base = wildStats(definition, Math.min(100, profile.level), profile.quality, partySize, partyAverageLevel);
	const progress = profile.floor - 1;
	const over = Math.max(0, profile.floor - 99);
	const hpScale = 1 + .025 * progress + .01 * Math.pow(over, 1.08);
	const attackScale = 1 + .012 * progress + .006 * Math.pow(over, 1.05);
	const defenseScale = 1 + .009 * progress + .004 * Math.pow(over, 1.04);
	return Object.freeze({
		hp: clampStat(base.hp * hpScale, 9999999),
		attack: clampStat(base.attack * attackScale, 999999),
		defense: clampStat(base.defense * defenseScale, 999999),
		speed: clampStat(base.speed * attackScale, 999999)
	});
}
function emptyTowerMaterialReward() {
	return {
		pebble: 0,
		pulse: 0,
		prism: 0,
		nova: 0,
		origin: 0
	};
}
//#endregion
//#region lib/types/core/engine.js
const MAX_CREATURES = 240;
const MAX_LOG_ENTRIES = 40;
const ENERGY_LIMIT = 12;
const MAX_IDLE_ELAPSED_MS = 432e5;
const ECOLOGY_ADVANTAGE = Object.freeze({
	lumen: "glitch",
	glitch: "relay",
	relay: "forge",
	forge: "aegis",
	aegis: "lumen"
});
var TraceWildRuleError = class extends Error {
	code;
	constructor(code) {
		super(code);
		this.code = code;
	}
};
function emptyCores() {
	return {
		pebble: 0,
		pulse: 0,
		prism: 0,
		nova: 0,
		origin: 0
	};
}
function createInitialTraceWildState(now = Date.now()) {
	return {
		schemaVersion: 3,
		revision: 0,
		createdAt: now,
		updatedAt: now,
		enabled: true,
		starterChosen: false,
		cores: emptyCores(),
		materials: emptyCores(),
		creatures: [],
		squad: [],
		dex: [],
		encounters: [],
		stats: {
			completedTurns: 0,
			failedTurns: 0,
			successfulCaptures: 0,
			failedCaptures: 0,
			battlesStarted: 0,
			wildDefeats: 0,
			materialsEarned: 0,
			currentSuccessStreak: 0,
			longestSuccessStreak: 0
		},
		rewardPity: {
			wildHighQualityMisses: 0,
			coreHighQualityMisses: 0
		},
		idle: { lastSettlementAt: now },
		tower: {
			highestClearedFloor: 0,
			attempts: 0,
			clears: 0
		},
		processedSignals: [],
		log: []
	};
}
function boundedRandom(random) {
	const value = random();
	if (!Number.isFinite(value)) return 0;
	return Math.min(.999999999, Math.max(0, value));
}
function randomId(prefix, now, random) {
	const first = Math.floor(boundedRandom(random) * 4294967296).toString(36).padStart(7, "0");
	const second = Math.floor(boundedRandom(random) * 4294967296).toString(36).padStart(7, "0");
	return `${prefix}_${now.toString(36)}_${first}${second}`;
}
function chooseWeighted(weights, random) {
	const entries = Object.entries(weights);
	const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
	let cursor = boundedRandom(random) * total;
	for (const [key, weight] of entries) {
		cursor -= weight;
		if (cursor < 0) return key;
	}
	return entries[entries.length - 1][0];
}
function logEntry(state, entry, random) {
	state.log.unshift({
		...entry,
		id: randomId("log", entry.at, random)
	});
	state.log = state.log.slice(0, MAX_LOG_ENTRIES);
}
function appendBattleLog(battle, row) {
	battle.log.push(row);
	battle.log = battle.log.slice(-14);
}
function commit(state, now) {
	state.revision += 1;
	state.updatedAt = now;
	return state;
}
function isHighQuality(quality) {
	return qualityIndex(quality) >= qualityIndex("prism");
}
function chooseWildQuality(state, activeMinutes, random) {
	const eligibleForPity = activeMinutes >= 15;
	const quality = eligibleForPity && state.rewardPity.wildHighQualityMisses >= 12 ? "prism" : chooseWeighted(wildQualityWeights(activeMinutes), random);
	if (eligibleForPity) state.rewardPity.wildHighQualityMisses = isHighQuality(quality) ? 0 : Math.min(12, state.rewardPity.wildHighQualityMisses + 1);
	return quality;
}
function chooseCoreQuality(state, activeMinutes, random) {
	const quality = state.rewardPity.coreHighQualityMisses >= 20 ? "prism" : chooseWeighted(coreQualityWeights(activeMinutes), random);
	state.rewardPity.coreHighQualityMisses = isHighQuality(quality) ? 0 : Math.min(20, state.rewardPity.coreHighQualityMisses + 1);
	return quality;
}
function settleTraceWildIdleRewards(current, now, random) {
	if (!current.enabled) return current;
	if (!Number.isSafeInteger(now) || now < 0) return current;
	const last = current.idle.lastSettlementAt;
	if (!Number.isSafeInteger(last) || last < 0) {
		const next = structuredClone(current);
		next.idle = { lastSettlementAt: now };
		return commit(next, now);
	}
	if (current.idle.pendingReward !== void 0) return current;
	if (now < last) return current;
	const elapsedMs = Math.min(MAX_IDLE_ELAPSED_MS, now - last);
	const tier = idleRewardTier(elapsedMs / 6e4);
	if (tier.coreCount === 0 || tier.weights === void 0) return current;
	const next = structuredClone(current);
	const materials = emptyCores();
	for (let index = 0; index < tier.materialCount; index += 1) {
		const quality = chooseWeighted(tier.weights, random);
		materials[quality] += 1;
	}
	const coreQuality = chooseWeighted(tier.weights, random);
	next.idle = {
		...next.idle,
		lastSettlementAt: now,
		pendingReward: {
			settledAt: now,
			elapsedMinutes: Math.floor(elapsedMs / 6e4),
			coreQuality,
			materials
		}
	};
	return commit(next, now);
}
function updateDex(state, creatureId, at, captured) {
	const existing = state.dex.find((row) => row.creatureId === creatureId);
	if (existing === void 0) {
		state.dex.push({
			creatureId,
			seen: 1,
			captured: captured ? 1 : 0,
			firstSeenAt: at,
			lastSeenAt: at
		});
		return;
	}
	existing.seen += 1;
	existing.captured += captured ? 1 : 0;
	existing.lastSeenAt = at;
}
function mapPoint(ecology, random) {
	const [centerX, centerY] = {
		lumen: [19, 27],
		forge: [80, 27],
		relay: [50, 16],
		aegis: [25, 76],
		glitch: [76, 76]
	}[ecology];
	return {
		mapX: Math.round(Math.min(92, Math.max(8, centerX + (boundedRandom(random) - .5) * 19))),
		mapY: Math.round(Math.min(90, Math.max(10, centerY + (boundedRandom(random) - .5) * 17)))
	};
}
function pickCreature(signal, ecology, random) {
	if (ecology === "glitch" && signal.variant !== void 0 && boundedRandom(random) < .78) return {
		missing: "glitch-null-nibbler",
		stack: "glitch-stack-weaver",
		timeout: "glitch-lagtoad",
		crash: "glitch-crashfox",
		overflow: "glitch-overflow-maw"
	}[signal.variant];
	const intensity = Math.min(5, Math.max(0, signal.intensity));
	const candidates = creaturesInEcology(ecology);
	const weights = candidates.map((creature) => {
		switch (creature.rarity) {
			case "common": return 38;
			case "uncommon": return 18 + intensity * 2.5;
			case "rare": return 7 + intensity * 1.8;
			case "apex": return 1 + intensity * .7;
		}
	});
	let cursor = boundedRandom(random) * weights.reduce((sum, weight) => sum + weight, 0);
	for (let index = 0; index < candidates.length; index += 1) {
		cursor -= weights[index];
		if (cursor < 0) return candidates[index].id;
	}
	return candidates[0].id;
}
const REGION_DIVERSITY_THRESHOLD = 5;
function chooseEncounterEcology(encounters, signal, random) {
	const counts = Object.fromEntries(TRACE_ECOLOGIES.map((ecology) => [ecology, 0]));
	for (const encounter of encounters) counts[encounter.ecology] += 1;
	const candidates = Array.from(new Set((signal.ecologyCandidates ?? [signal.ecology]).filter((ecology) => TRACE_ECOLOGIES.includes(ecology))));
	if (candidates.length === 0) candidates.push(signal.ecology);
	let pool;
	if (candidates.length > 1) pool = candidates;
	else if (counts[candidates[0]] > REGION_DIVERSITY_THRESHOLD) pool = TRACE_ECOLOGIES.filter((ecology) => ecology !== candidates[0]);
	else return candidates[0];
	const leastResidents = Math.min(...pool.map((ecology) => counts[ecology]));
	const tied = pool.filter((ecology) => counts[ecology] === leastResidents);
	return tied[Math.floor(boundedRandom(random) * tied.length)] ?? tied[0];
}
function purgeExpiredEncounters(state, now) {
	const activeEncounter = state.battle?.mode === "tower" ? void 0 : state.battle?.encounterId;
	state.encounters = state.encounters.filter((encounter) => encounter.id === activeEncounter || now < encounter.expiresAt);
	if (activeEncounter !== void 0 && !state.encounters.some((row) => row.id === activeEncounter)) delete state.battle;
}
/** Removes elapsed map encounters without disturbing an encounter in an active wild battle. */
function expireTraceWildEncounters(current, now) {
	if (!Number.isSafeInteger(now) || now < 0) return current;
	const activeEncounter = current.battle?.mode === "tower" ? void 0 : current.battle?.encounterId;
	if (!current.encounters.some((encounter) => encounter.id !== activeEncounter && now >= encounter.expiresAt)) return current;
	const next = structuredClone(current);
	purgeExpiredEncounters(next, now);
	return commit(next, now);
}
function applyTraceSignal(current, signal, random) {
	if (!current.enabled) return current;
	const settled = settleTraceWildIdleRewards(current, signal.at, random);
	if (settled.processedSignals.includes(signal.id)) return settled;
	const next = structuredClone(settled);
	purgeExpiredEncounters(next, signal.at);
	next.processedSignals.push(signal.id);
	next.processedSignals = next.processedSignals.slice(-256);
	if (signal.outcome === "completed") {
		next.stats.completedTurns += 1;
		next.stats.currentSuccessStreak += 1;
		next.stats.longestSuccessStreak = Math.max(next.stats.longestSuccessStreak, next.stats.currentSuccessStreak);
		const quality = chooseCoreQuality(next, signal.activeMinutes, random);
		next.cores[quality] += 1;
		logEntry(next, {
			at: signal.at,
			kind: "core-drop",
			quality,
			ecology: signal.ecology
		}, random);
	} else {
		next.stats.failedTurns += 1;
		next.stats.currentSuccessStreak = 0;
	}
	if (next.encounters.length < 7) {
		const encounterEcology = chooseEncounterEcology(next.encounters, signal, random);
		const creatureId = pickCreature(signal, encounterEcology, random);
		const quality = chooseWildQuality(next, signal.activeMinutes, random);
		const level = wildLevelForRoster(next.creatures, signal.activeMinutes, quality, boundedRandom(random));
		const point = mapPoint(encounterEcology, random);
		next.encounters.push({
			id: randomId("wild", signal.at, random),
			creatureId,
			ecology: encounterEcology,
			quality,
			level,
			captureAttempts: 0,
			spawnedAt: signal.at,
			expiresAt: signal.at + encounterLifetimeMs(quality, level),
			enhanced: signal.enhanced,
			armor: signal.enhanced ? 2 : 0,
			...point
		});
		updateDex(next, creatureId, signal.at, false);
		logEntry(next, {
			at: signal.at,
			kind: "encounter",
			creatureId,
			ecology: encounterEcology,
			quality
		}, random);
	} else {
		next.materials.pebble += 1;
		next.stats.materialsEarned += 1;
		logEntry(next, {
			at: signal.at,
			kind: "material-drop",
			quality: "pebble",
			ecology: signal.ecology
		}, random);
	}
	return commit(next, signal.at);
}
function levelStats(creature) {
	const definition = creatureById(creature.creatureId);
	if (definition === void 0) throw new TraceWildRuleError("conflict");
	return playerStats(definition.stats, creature.level, creature.quality);
}
function memberStats(member) {
	const definition = creatureById(member.creatureId);
	if (definition === void 0) throw new TraceWildRuleError("conflict");
	return playerStats(definition.stats, member.level, member.quality);
}
function affinity(attacker, defender) {
	if (ECOLOGY_ADVANTAGE[attacker] === defender) return 1.2;
	if (ECOLOGY_ADVANTAGE[defender] === attacker) return .8;
	return 1;
}
function ecologyThatCounters(defender) {
	return TRACE_ECOLOGIES.find((ecology) => ECOLOGY_ADVANTAGE[ecology] === defender) ?? "lumen";
}
function activeMember(battle) {
	const member = battle.party[battle.activeIndex];
	if (member === void 0 || battle.partyHp <= 0) throw new TraceWildRuleError("conflict");
	return member;
}
function livingMembers(battle) {
	return battle.partyHp > 0 ? battle.party : [];
}
function qualityMultiplier(member) {
	return QUALITY_SKILL_MULTIPLIERS[member.quality];
}
function playerOffenseLevelFactor(member, battle) {
	const levelDelta = member.level - battle.wildLevel;
	if (levelDelta < 0) return Math.max(.45, Math.exp(levelDelta / 34));
	return Math.min(1.15, 1 + levelDelta * .003);
}
function syncLegacyPartyHealth(battle) {
	const ratio = battle.partyMaxHp <= 0 ? 0 : battle.partyHp / battle.partyMaxHp;
	for (const member of battle.party) {
		member.hp = battle.partyHp <= 0 ? 0 : Math.max(1, Math.min(member.maxHp, Math.round(member.maxHp * ratio)));
		member.shield = 0;
	}
}
function healParty(battle, amount) {
	const before = battle.partyHp;
	battle.partyHp = Math.min(battle.partyMaxHp, battle.partyHp + Math.max(0, Math.round(amount)));
	syncLegacyPartyHealth(battle);
	return battle.partyHp - before;
}
function shieldParty(battle, amount) {
	const limit = Math.round(battle.partyMaxHp * .6);
	const before = battle.partyShield;
	battle.partyShield = Math.min(limit, battle.partyShield + Math.max(0, Math.round(amount)));
	return battle.partyShield - before;
}
function damageParty(battle, amountValue) {
	let amount = Math.max(1, Math.round(amountValue));
	const absorbed = Math.min(battle.partyShield, amount);
	battle.partyShield -= absorbed;
	amount -= absorbed;
	const before = battle.partyHp;
	battle.partyHp = Math.max(0, battle.partyHp - amount);
	syncLegacyPartyHealth(battle);
	return absorbed + before - battle.partyHp;
}
function grantEnergy(member, amount) {
	const whole = Math.max(0, Math.floor(amount));
	const available = Math.max(0, ENERGY_LIMIT - member.energy);
	member.energy += Math.min(available, whole);
	const overflow = whole - available;
	if (overflow > 0 && member.creatureId === "glitch-overflow-maw") member.overcharge = Math.min(5, member.overcharge + overflow);
}
function applyWildDamage(battle, rawAmount, contributor) {
	let amount = Math.max(1, Math.round(rawAmount));
	if (battle.enemyMarks > 0) {
		amount = Math.round(amount * (1 + battle.enemyMarks * .1));
		battle.enemyMarks = 0;
	}
	if (battle.wildArmor > 0) amount = Math.max(1, Math.round(amount * .35));
	battle.pendingTeamDamage = Math.min(9999999, battle.pendingTeamDamage + amount);
	const owner = contributor ?? battle.party[battle.activeIndex];
	if (owner !== void 0) owner.stageDamage = Math.min(9999999, owner.stageDamage + amount);
	return amount;
}
function applyRawHit(battle, member, power) {
	return applyWildDamage(battle, memberStats(member).attack * power * playerOffenseLevelFactor(member, battle) * 100 / (100 + battle.wildDefense), member);
}
function settleTeamStrike(battle) {
	const pending = Math.max(0, Math.round(battle.pendingTeamDamage));
	const contributions = battle.party.filter((member) => member.stageDamage > 0).map((member) => ({
		instanceId: member.instanceId,
		amount: Math.round(member.stageDamage)
	}));
	let remaining = pending;
	const absorbed = Math.min(battle.wildShield, remaining);
	battle.wildShield -= absorbed;
	remaining -= absorbed;
	const before = battle.wildHp;
	battle.wildHp = Math.max(0, battle.wildHp - remaining);
	const applied = absorbed + before - battle.wildHp;
	battle.lastTeamStrike = pending;
	battle.lastTeamDamageApplied = applied;
	battle.lastTeamContributions = contributions;
	battle.lastPlayerDamage = pending;
	battle.pendingTeamDamage = 0;
	for (const member of battle.party) member.stageDamage = 0;
	if (pending > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "team-strike",
		amount: applied
	});
	if (battle.wildHp > 0 && battle.enemyPhase === 1 && battle.wildHp * 2 <= battle.wildMaxHp && battle.bossSkillTier >= 5) {
		battle.enemyPhase = 2;
		battle.wildShield = Math.min(Math.round(battle.wildMaxHp * .4), battle.wildShield + Math.round(battle.wildMaxHp * .12));
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "phase-shift",
			amount: battle.wildShield
		});
	}
	return battle.wildHp <= 0;
}
function damageForStep(battle, member, counts, chain) {
	const wild = creatureById(battleEncounterCreatureId(battle));
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const stats = memberStats(member);
	const hasForktail = livingMembers(battle).some((row) => row.creatureId === "relay-forktail");
	const hasAtlas = livingMembers(battle).some((row) => row.creatureId === "lumen-atlashart");
	let combo = Math.min(2, 1 + .2 * (chain - 1) + (hasForktail ? .05 * (chain - 1) : 0));
	if (hasAtlas && chain === 1 && battle.party.some((row) => row.creatureId === "lumen-atlashart" && row.passiveRound !== battle.round)) combo = Math.max(combo, 1.15);
	let total = 0;
	const effectivenessDamage = {
		advantage: 0,
		neutral: 0,
		resisted: 0
	};
	for (const ecology of TRACE_ECOLOGIES) {
		const count = counts[ecology];
		if (count <= 0) continue;
		const element = battle.affinityFloorActions > 0 ? Math.max(1.2, affinity(ecology, wild.ecology)) : affinity(ecology, wild.ecology);
		const contribution = stats.attack * (count / 3) * combo * element * playerOffenseLevelFactor(member, battle) * 100 / (100 + battle.wildDefense);
		total += contribution;
		const effectiveness = element > 1 ? "advantage" : element < 1 ? "resisted" : "neutral";
		effectivenessDamage[effectiveness] += contribution;
	}
	if (member.creatureId === "glitch-crashfox" && battle.partyHp * 2 < battle.partyMaxHp) total *= 1.25;
	if (member.creatureId === "relay-duplex-hare" && battle.round % 2 === 1) total *= 1.1;
	const effectiveness = Object.entries(effectivenessDamage).sort((left, right) => right[1] - left[1] || [
		"advantage",
		"neutral",
		"resisted"
	].indexOf(left[0]) - [
		"advantage",
		"neutral",
		"resisted"
	].indexOf(right[0]))[0]?.[0] ?? "neutral";
	return {
		total: Math.max(1, Math.round(total)),
		effectiveness
	};
}
function battleEncounterCreatureId(battle) {
	return battle.wildCreatureId;
}
function convertOnePassiveTile(boardValue, ecology, random) {
	const board = boardValue.map((current) => ({ ...current }));
	const start = Math.floor(boundedRandom(random) * board.length);
	for (let offset = 0; offset < board.length; offset += 1) {
		const index = (start + offset) % board.length;
		const current = board[index];
		if (current.special !== "none" || (current.hazardActions ?? 0) > 0 || current.ecology === ecology) continue;
		board[index] = {
			ecology,
			special: "none"
		};
		if (!hasBattleMatches(board)) return board;
		board[index] = current;
	}
	return board;
}
function createGuaranteedMatch(boardValue, ecology) {
	const board = boardValue.map((current) => ({ ...current }));
	for (let row = 0; row < 7; row += 1) for (let column = 0; column <= 4; column += 1) {
		const indexes = [
			row * 7 + column,
			row * 7 + column + 1,
			row * 7 + column + 2
		];
		if (indexes.every((index) => board[index].special === "none" && (board[index].hazardActions ?? 0) === 0)) {
			for (const index of indexes) board[index] = {
				ecology,
				special: "none"
			};
			return board;
		}
	}
	return board;
}
function applyMatchPassives(battle, counts, chain, maxGroup, specialCount, stepDamage, random) {
	let bonusDamage = 0;
	const active = activeMember(battle);
	const colors = TRACE_ECOLOGIES.filter((ecology) => counts[ecology] > 0).length;
	for (const member of livingMembers(battle)) {
		const scale = qualityMultiplier(member);
		switch (member.creatureId) {
			case "lumen-indeximp":
				if (counts.lumen > 0 && member.passiveRound !== battle.round) {
					battle.enemyMarks = Math.min(3, battle.enemyMarks + 1);
					member.passiveRound = battle.round;
				}
				break;
			case "lumen-foliomoth":
				if (counts.lumen >= 4) healParty(battle, member.maxHp * .03 * scale);
				break;
			case "lumen-lensel":
				if (chain >= 2 && member.passiveStage !== battle.stage) {
					grantEnergy(member, 2);
					member.passiveStage = battle.stage;
				}
				break;
			case "lumen-echocoil":
				if (chain >= 2 && member.passiveRound !== battle.round) {
					bonusDamage += applyWildDamage(battle, stepDamage * .3 * scale);
					member.passiveRound = battle.round;
				}
				break;
			case "lumen-atlashart":
				if (chain === 1) member.passiveRound = battle.round;
				break;
			case "forge-sparkmite":
				if (counts.forge >= 4) bonusDamage += applyRawHit(battle, member, .25 * scale);
				break;
			case "forge-rivetclaw":
				if (counts.forge > 0 && member.counterPower > 0) {
					bonusDamage += applyRawHit(battle, member, member.counterPower);
					member.counterPower = 0;
				}
				break;
			case "forge-solderling":
				if (counts.forge > 0 && colors > 1) battle.enemyBurn = Math.min(4.2, battle.enemyBurn + scale);
				break;
			case "forge-anvilback":
				if (counts.forge >= 5 && battle.wildArmor > 0) battle.wildArmor -= 1;
				break;
			case "forge-kiln-colossus":
				if (counts.forge > 0 && chain >= 2) battle.enemyBurn = Math.min(4.2, battle.enemyBurn + .25 * scale);
				break;
			case "relay-duplex-hare":
				if (counts.relay > 0 && battle.round % 2 === 0) grantEnergy(member, 1);
				break;
			case "relay-routeray":
				if (counts.relay > 0 && member.passiveStage !== battle.stage) {
					battle.board = convertOnePassiveTile(battle.board, "relay", random);
					member.passiveStage = battle.stage;
				}
				break;
			case "aegis-veribud":
				if (counts.aegis > 0 && member.passiveStage !== battle.stage) {
					healParty(battle, active.maxHp * .02 * scale);
					member.passiveStage = battle.stage;
				}
				break;
			case "aegis-anchorbee":
				if (specialCount > 0) shieldParty(battle, active.maxHp * .04 * scale);
				break;
			case "aegis-steady-ram": {
				const wild = creatureById(battleEncounterCreatureId(battle));
				if (counts[ECOLOGY_ADVANTAGE[wild.ecology]] > 0) shieldParty(battle, stepDamage * .2 * scale);
				break;
			}
			case "glitch-null-nibbler":
				if (counts.glitch > 0) {
					if (battle.wildArmor > 0) battle.wildArmor -= 1;
					else battle.wildShield = Math.max(0, battle.wildShield - Math.round(memberStats(member).attack * scale));
				}
				break;
			case "glitch-stack-weaver": if (chain >= 2) battle.board = convertOnePassiveTile(battle.board, "glitch", random);
		}
	}
	if (maxGroup >= 5 && battle.wildArmor > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "armor-break"
	});
	return bonusDamage;
}
function distributeEnergy(battle, totals) {
	for (const member of livingMembers(battle)) {
		const ecology = creatureById(member.creatureId)?.ecology;
		if (ecology === void 0) continue;
		grantEnergy(member, Math.min(8, totals[ecology]));
	}
	if (totals.relay > 0 && livingMembers(battle).some((member) => member.creatureId === "relay-mesh-jelly")) {
		const shared = Math.floor(Math.min(8, totals.relay) * .25);
		if (shared > 0) {
			for (const member of livingMembers(battle)) if (creatureById(member.creatureId)?.ecology !== "relay") grantEnergy(member, shared);
		}
	}
}
function applyResolution(battle, resolution, random, consumeRepeat) {
	battle.board = resolution.board;
	const totals = {
		lumen: 0,
		forge: 0,
		relay: 0,
		aegis: 0,
		glitch: 0
	};
	const active = activeMember(battle);
	let totalDamage = 0;
	const armorBefore = battle.wildArmor;
	for (let index = 0; index < resolution.steps.length; index += 1) {
		const step = resolution.steps[index];
		const frame = resolution.frames[index];
		const pendingBefore = battle.pendingTeamDamage;
		for (const ecology of TRACE_ECOLOGIES) totals[ecology] += step.counts[ecology];
		const stepDamage = damageForStep(battle, active, step.counts, step.chain);
		const damage = applyWildDamage(battle, stepDamage.total);
		totalDamage += damage;
		totalDamage += applyMatchPassives(battle, step.counts, step.chain, step.maxGroup, step.specialCount, damage, random);
		if (frame !== void 0) {
			const hazardCount = frame.removed.reduce((count, tileIndex) => count + ((frame.before[tileIndex]?.hazardActions ?? 0) > 0 ? 1 : 0), 0);
			const partyBeforeHazard = battle.partyHp;
			if (hazardCount > 0 && battle.partyHp > 0) {
				const hazardDamage = damageParty(battle, Math.min(battle.partyMaxHp * .16, battle.partyMaxHp * (.018 + battle.bossSkillTier * .002) * hazardCount));
				if (hazardDamage > 0) appendBattleLog(battle, {
					turn: battle.turn,
					kind: "hazard-damage",
					amount: hazardDamage
				});
			}
			frame.damage = Math.max(0, battle.pendingTeamDamage - pendingBefore);
			frame.totalDamage = battle.pendingTeamDamage;
			frame.effectiveness = stepDamage.effectiveness;
			const hazardDamage = Math.max(0, partyBeforeHazard - battle.partyHp);
			if (hazardDamage > 0) frame.hazardDamage = hazardDamage;
		}
	}
	if (resolution.steps.length > 0 && armorBefore > 0 && battle.wildArmor === armorBefore) {
		battle.wildArmor -= 1;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "armor-break"
		});
	}
	distributeEnergy(battle, totals);
	if (consumeRepeat && battle.repeatPower > 0 && totalDamage > 0) {
		const repeated = applyWildDamage(battle, totalDamage * battle.repeatPower);
		totalDamage += repeated;
		const lastFrame = resolution.frames.at(-1);
		if (lastFrame !== void 0) {
			lastFrame.damage = Math.min(9999999, (lastFrame.damage ?? 0) + repeated);
			lastFrame.totalDamage = battle.pendingTeamDamage;
		}
		battle.repeatPower = 0;
	}
	battle.lastPlayerDamage = totalDamage;
	if (totalDamage > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "match",
		amount: totalDamage
	});
	if (resolution.steps.length > 1) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "combo",
		amount: resolution.steps.length
	});
	return totalDamage;
}
function applyStageEntryPassives(battle) {
	const member = activeMember(battle);
	member.skillUsedStage = false;
	const scale = qualityMultiplier(member);
	if (member.creatureId === "relay-pingfly") grantEnergy(member, 2);
	if (member.creatureId === "aegis-loop-tortoise") shieldParty(battle, member.maxHp * .08 * scale);
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "switch",
		creatureId: member.creatureId
	});
}
function nextLivingIndex(battle) {
	if (battle.partyHp <= 0) return void 0;
	for (let offset = 1; offset <= battle.party.length; offset += 1) {
		const index = (battle.activeIndex + offset) % battle.party.length;
		if (battle.party[index] !== void 0) return {
			index,
			wrapped: index <= battle.activeIndex
		};
	}
}
function maybePreventDefeat(battle) {
	if (battle.partyHp > 0) return true;
	const guardian = battle.party.find((member) => member.creatureId === "aegis-dawnguard" && !member.reviveUsed);
	if (guardian === void 0) return false;
	guardian.reviveUsed = true;
	battle.partyHp = 1;
	syncLegacyPartyHealth(battle);
	shieldParty(battle, battle.partyMaxHp * .1 * qualityMultiplier(guardian));
	return true;
}
function maybeDelayForLagtoad(battle) {
	const lagtoad = battle.party.find((member) => member.creatureId === "glitch-lagtoad" && !member.passiveBattleUsed);
	if (lagtoad !== void 0 && battle.partyHp * 2 < battle.partyMaxHp) {
		lagtoad.passiveBattleUsed = true;
		battle.enemyDelayed = Math.max(1, battle.enemyDelayed);
	}
}
function mutateBoardForEnemy(battle, ecology, random) {
	if (battle.boardLockActions > 0) return;
	if (ecology === "relay") battle.board = reshuffleBattleBoard(battle.board, random);
	if (ecology === "glitch") battle.board = convertRandomBattleTiles(battle.board, "glitch", 2, random);
}
function baseEnemyIntent(ecology) {
	switch (ecology) {
		case "lumen": return "mark";
		case "forge": return "corrupt";
		case "relay": return "disrupt";
		case "aegis": return "guard";
		case "glitch": return "corrupt";
	}
}
function bossSkillTierForThreat(threat) {
	if (threat >= 105) return 5;
	if (threat >= 75) return 4;
	if (threat >= 45) return 3;
	if (threat >= 20) return 2;
	return 1;
}
function enemyTargetFor(battle, intent) {
	if (intent === "guard") return { scope: "self" };
	if (intent === "strike") return { scope: "team" };
	if (intent === "freeze" || intent === "mark") return {
		scope: "member",
		index: battle.activeIndex
	};
	return { scope: "board" };
}
function prepareBossIntent(battle, random) {
	const wild = creatureById(battleEncounterCreatureId(battle));
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const tier = battle.bossSkillTier;
	const roll = boundedRandom(random);
	battle.bossSkillArmed = battle.bossEnergy >= 12;
	let intent;
	if (!battle.bossSkillArmed) intent = "strike";
	else {
		intent = baseEnemyIntent(wild.ecology);
		if (tier >= 4 && battle.enemyHardControlCooldown === 0 && roll < .1 + tier * .02) intent = wild.ecology === "lumen" || wild.ecology === "relay" ? "lock" : "freeze";
		else if (tier >= 3 && roll < .42 + tier * .02 && (wild.ecology === "lumen" || wild.ecology === "glitch")) intent = "lock";
	}
	const target = enemyTargetFor(battle, intent);
	battle.enemyIntent = intent;
	battle.enemyTargetScope = target.scope;
	if (target.index === void 0) delete battle.enemyTargetIndex;
	else battle.enemyTargetIndex = target.index;
}
function partyDefense(battle) {
	return battle.party.reduce((sum, member) => sum + memberStats(member).defense, 0) / battle.party.length;
}
function partyAffinity(battle, wildEcology) {
	return battle.party.reduce((sum, member) => {
		const definition = creatureById(member.creatureId);
		return sum + (definition === void 0 ? 1 : affinity(wildEcology, definition.ecology));
	}, 0) / battle.party.length;
}
function applyEnemyTeamHit(battle, wildEcology, power, maximumHealthRatio, random) {
	const partyPressure = 1 + .55 * Math.max(0, battle.party.length - 1);
	const roll = battle.wildAttack * power * (.88 + boundedRandom(random) * .24) * partyPressure * partyAffinity(battle, wildEcology) * 100 / (100 + partyDefense(battle));
	const damage = damageParty(battle, Math.min(roll, battle.partyMaxHp * maximumHealthRatio));
	if (damage > 0) {
		for (const member of battle.party) if (member.creatureId === "forge-rivetclaw") member.counterPower = .8 * qualityMultiplier(member);
	}
	maybePreventDefeat(battle);
	return damage;
}
function installHazardTiles(battle, random) {
	const countLimit = Math.min(6, 2 + battle.bossSkillTier);
	const candidates = battle.board.map((tile, index) => tile.special === "none" && (tile.lockedActions ?? 0) === 0 && (tile.hazardActions ?? 0) === 0 ? index : -1).filter((index) => index >= 0);
	let count = 0;
	while (candidates.length > 0 && count < countLimit) {
		const cursor = Math.floor(boundedRandom(random) * candidates.length);
		const index = candidates.splice(cursor, 1)[0];
		battle.board[index] = {
			...battle.board[index],
			hazardActions: 3
		};
		count += 1;
	}
	return count;
}
function lockEnemyTiles(battle, random) {
	const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex];
	const ecology = (target === void 0 ? void 0 : creatureById(target.creatureId))?.ecology ?? "lumen";
	const maximum = Math.min(5, Math.max(3, battle.bossSkillTier));
	const candidates = battle.board.map((tile, index) => tile.ecology === ecology && tile.special === "none" && (tile.lockedActions ?? 0) === 0 ? index : -1).filter((index) => index >= 0);
	let count = 0;
	while (candidates.length > 0 && count < maximum) {
		const cursor = Math.floor(boundedRandom(random) * candidates.length);
		const index = candidates.splice(cursor, 1)[0];
		battle.board[index] = {
			...battle.board[index],
			lockedActions: 2
		};
		count += 1;
	}
	return count;
}
function performBossSettlement(battle, random) {
	const wild = creatureById(battleEncounterCreatureId(battle));
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	if (battle.enemyBurn > 0) {
		applyWildDamage(battle, battle.wildMaxHp * .025 * battle.enemyBurn, void 0);
		battle.enemyBurn = Math.max(0, battle.enemyBurn - .5);
	}
	const finalPower = Math.min(1.55, Math.max(.55, .35 + .22 * battle.bossAttackCharge));
	const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex];
	const totalDamage = applyEnemyTeamHit(battle, wild.ecology, finalPower, .3, random);
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "enemy",
		amount: totalDamage
	});
	battle.lastBossAttack = totalDamage;
	if (battle.partyHp <= 0) return true;
	if (battle.bossSkillArmed) {
		battle.bossEnergy = Math.max(0, battle.bossEnergy - 12);
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "boss-skill",
			creatureId: wild.id
		});
		switch (battle.enemyIntent) {
			case "guard":
				battle.wildShield = Math.min(Math.round(battle.wildMaxHp * .4), battle.wildShield + Math.round(battle.wildMaxHp * .1));
				appendBattleLog(battle, {
					turn: battle.turn,
					kind: "enemy-shield",
					amount: battle.wildShield
				});
				break;
			case "freeze":
				if (target !== void 0) {
					target.frozenStages = Math.max(target.frozenStages, 1);
					battle.enemyHardControlCooldown = 3;
					appendBattleLog(battle, {
						turn: battle.turn,
						kind: "enemy-freeze",
						amount: 1,
						creatureId: target.creatureId
					});
				}
				break;
			case "lock": {
				const count = lockEnemyTiles(battle, random);
				battle.enemyHardControlCooldown = Math.max(battle.enemyHardControlCooldown, 2);
				appendBattleLog(battle, {
					turn: battle.turn,
					kind: "enemy-lock",
					amount: count
				});
				break;
			}
			case "disrupt":
				mutateBoardForEnemy(battle, "relay", random);
				break;
			case "corrupt":
				appendBattleLog(battle, {
					turn: battle.turn,
					kind: "enemy-hazard",
					amount: installHazardTiles(battle, random)
				});
				break;
			case "mark": if (target !== void 0) {
				target.energy = Math.max(0, target.energy - 2);
				target.skillSealedStages = Math.max(target.skillSealedStages, 1);
				appendBattleLog(battle, {
					turn: battle.turn,
					kind: "enemy-seal",
					amount: 1,
					creatureId: target.creatureId
				});
			}
		}
	} else mutateBoardForEnemy(battle, wild.ecology, random);
	if (battle.enemyHardControlCooldown > 0 && battle.enemyIntent !== "freeze" && battle.enemyIntent !== "lock") battle.enemyHardControlCooldown -= 1;
	return battle.partyHp <= 0;
}
function advanceBattleStage(battle) {
	if (battle.partyHp <= 0) return true;
	const leaving = battle.party[battle.activeIndex];
	if (leaving !== void 0 && leaving.skillSealedStages > 0) leaving.skillSealedStages -= 1;
	const next = nextLivingIndex(battle);
	if (next === void 0) return true;
	battle.activeIndex = next.index;
	if (next.wrapped) battle.round += 1;
	battle.stage += 1;
	battle.actionsRemaining = battle.party[next.index].frozenStages > 0 ? 0 : 3;
	battle.bonusActionsGranted = 0;
	battle.turn += 1;
	if (battle.actionsRemaining > 0) applyStageEntryPassives(battle);
	return false;
}
function createBattleParty(state) {
	const selected = state.squad.map((id) => state.creatures.find((row) => row.instanceId === id)).filter((row) => row !== void 0).slice(0, 3);
	if (selected.length === 0) throw new TraceWildRuleError("conflict");
	return selected.map((captured) => {
		const stats = levelStats(captured);
		return {
			instanceId: captured.instanceId,
			creatureId: captured.creatureId,
			quality: captured.quality,
			level: captured.level,
			hp: stats.hp,
			maxHp: stats.hp,
			shield: 0,
			energy: 0,
			skillUsedStage: false,
			passiveRound: 0,
			passiveStage: 0,
			passiveBattleUsed: false,
			reviveUsed: false,
			counterPower: 0,
			overcharge: 0,
			stageDamage: 0,
			frozenStages: 0,
			skillSealedStages: 0
		};
	});
}
function installBattle(state, input, party, now, random) {
	const wild = creatureById(input.wildCreatureId);
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const wildMaxHp = input.stats.hp;
	const partyMaxHp = party.reduce((sum, member) => sum + member.maxHp, 0);
	const battle = {
		id: randomId("battle", now, random),
		encounterId: input.encounterId,
		wildCreatureId: wild.id,
		mode: input.mode,
		...input.towerFloor === void 0 ? {} : { towerFloor: input.towerFloor },
		bossSkillTier: input.bossSkillTier,
		board: createMatchBoard(random),
		party,
		partyHp: partyMaxHp,
		partyMaxHp,
		partyShield: 0,
		turnOwner: "player",
		activeIndex: 0,
		actionsRemaining: 3,
		bossActionsRemaining: 0,
		bossActionsTaken: 0,
		bossEnergy: input.startingBossEnergy,
		bossAttackCharge: 0,
		bossBonusActionsGranted: 0,
		bossSkillArmed: false,
		lastBossAttack: 0,
		lastBossMatch: 0,
		stage: 1,
		round: 1,
		wildHp: wildMaxHp,
		wildMaxHp,
		wildArmor: input.armor,
		wildShield: 0,
		wildDefense: input.stats.defense,
		wildAttack: input.stats.attack,
		wildLevel: input.level,
		wildQuality: input.quality,
		enemyIntent: "strike",
		enemyTargetScope: "team",
		enemyMarks: 0,
		enemyBurn: 0,
		enemyDelayed: 0,
		affinityFloorActions: 0,
		boardLockActions: 0,
		repeatPower: 0,
		lastPlayerDamage: 0,
		pendingTeamDamage: 0,
		lastTeamStrike: 0,
		lastTeamDamageApplied: 0,
		lastTeamContributions: [],
		bonusActionsGranted: 0,
		captureWindow: false,
		captureAttempts: 0,
		enemyHardControlCooldown: 0,
		enemyPhase: 1,
		turn: 1,
		log: [{
			turn: 0,
			kind: "start",
			creatureId: wild.id,
			ecology: wild.ecology
		}]
	};
	state.battle = battle;
	prepareBossIntent(battle, random);
	applyStageEntryPassives(battle);
	state.stats.battlesStarted += 1;
}
function startBattle(state, encounterId, now, random) {
	if (!state.starterChosen || state.battle !== void 0) throw new TraceWildRuleError("conflict");
	const encounter = state.encounters.find((row) => row.id === encounterId);
	if (encounter === void 0) throw new TraceWildRuleError("invalid-action");
	const wild = creatureById(encounter.creatureId);
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const party = createBattleParty(state);
	const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length;
	const rawStats = wildStats(wild, encounter.level, encounter.quality, party.length, partyAverageLevel);
	const stats = encounter.enhanced ? {
		...rawStats,
		hp: Math.round(rawStats.hp * 1.12)
	} : rawStats;
	installBattle(state, {
		encounterId,
		wildCreatureId: wild.id,
		level: encounter.level,
		quality: encounter.quality,
		armor: encounter.armor,
		stats,
		mode: "wild",
		bossSkillTier: bossSkillTierForThreat(threatPoints(encounter.level, encounter.quality)),
		startingBossEnergy: 0
	}, party, now, random);
	state.battle.captureAttempts = encounter.captureAttempts;
}
function startTowerBattle(state, now, random) {
	if (!state.starterChosen || state.battle !== void 0) throw new TraceWildRuleError("conflict");
	const floor = state.tower.highestClearedFloor + 1;
	if (floor > 999999) throw new TraceWildRuleError("conflict");
	const profile = towerFloorProfile(floor);
	const wild = creatureById(profile.creatureId);
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const party = createBattleParty(state);
	const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length;
	const stats = towerBossStats(wild, profile, party.length, partyAverageLevel);
	installBattle(state, {
		encounterId: `tower_${floor}`,
		wildCreatureId: wild.id,
		level: profile.level,
		quality: profile.quality,
		armor: profile.armor,
		stats,
		mode: "tower",
		bossSkillTier: profile.skillTier,
		startingBossEnergy: profile.startingBossEnergy,
		towerFloor: floor
	}, party, now, random);
	state.tower.attempts = Math.min(999999999, state.tower.attempts + 1);
}
function isCaptureWindowAvailable(battle) {
	return battle.mode === "wild" && battle.wildArmor === 0 && battle.wildHp > 0 && battle.wildHp / battle.wildMaxHp <= .5;
}
function ageTileLocks(battle) {
	battle.board = battle.board.map((tile) => {
		const lockedActions = Math.max(0, (tile.lockedActions ?? 0) - 1);
		const hazardActions = Math.max(0, (tile.hazardActions ?? 0) - 1);
		return {
			ecology: tile.ecology,
			special: tile.special,
			...lockedActions > 0 ? { lockedActions } : {},
			...hazardActions > 0 ? { hazardActions } : {}
		};
	});
}
function beginBossPhase(battle, random) {
	maybeDelayForLagtoad(battle);
	if (battle.enemyDelayed > 0) {
		battle.enemyDelayed -= 1;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "enemy-delay"
		});
		battle.turnOwner = "player";
		if (advanceBattleStage(battle)) return "battle-lost";
		prepareBossIntent(battle, random);
		return "none";
	}
	battle.turnOwner = "boss";
	battle.bossActionsRemaining = 3;
	battle.bossActionsTaken = 0;
	battle.bossAttackCharge = 0;
	battle.bossBonusActionsGranted = 0;
	battle.lastBossMatch = 0;
	return "none";
}
function finishBossPhase(battle, random) {
	if (performBossSettlement(battle, random)) return "battle-lost";
	battle.turnOwner = "player";
	battle.bossActionsRemaining = 0;
	battle.bossActionsTaken = 0;
	battle.bossAttackCharge = 0;
	battle.bossBonusActionsGranted = 0;
	if (advanceBattleStage(battle)) return "battle-lost";
	prepareBossIntent(battle, random);
	return "none";
}
function completeBattleStage(battle, random) {
	const wrapped = nextLivingIndex(battle)?.wrapped === true;
	if (wrapped && settleTeamStrike(battle)) return "wild-defeated";
	if (wrapped && isCaptureWindowAvailable(battle)) {
		battle.captureWindow = true;
		return "none";
	}
	if (wrapped) return beginBossPhase(battle, random);
	return advanceBattleStage(battle) ? "battle-lost" : "none";
}
function performBattleSwap(state, from, to, random) {
	const battle = state.battle;
	if (battle === void 0 || battle.turnOwner !== "player" || battle.captureWindow || battle.actionsRemaining <= 0) throw new TraceWildRuleError("conflict");
	const resolution = resolveBattleSwap(battle.board, from, to, random);
	if (resolution === void 0) throw new TraceWildRuleError("invalid-action");
	const animation = {
		kind: "match",
		battleId: battle.id,
		actor: "player",
		swap: {
			from,
			to
		},
		frames: resolution.frames
	};
	applyResolution(battle, resolution, random, true);
	const beforeActions = battle.actionsRemaining;
	const directMaxGroup = resolution.steps[0]?.maxGroup ?? 0;
	if (directMaxGroup >= 5 && battle.bonusActionsGranted < 2) {
		battle.actionsRemaining = Math.min(5, beforeActions + 1);
		if (battle.actionsRemaining > beforeActions) battle.bonusActionsGranted += 1;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "action-bonus",
			amount: battle.actionsRemaining - beforeActions
		});
	} else if (directMaxGroup >= 4) {
		battle.actionsRemaining = beforeActions;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "action-refund",
			amount: battle.actionsRemaining
		});
	} else battle.actionsRemaining = Math.max(0, beforeActions - 1);
	ageTileLocks(battle);
	if (battle.affinityFloorActions > 0) battle.affinityFloorActions -= 1;
	if (battle.boardLockActions > 0) battle.boardLockActions -= 1;
	return {
		outcome: battle.partyHp <= 0 ? "battle-lost" : battle.actionsRemaining === 0 ? completeBattleStage(battle, random) : "none",
		animation
	};
}
function performBossBoardAction(battle, random) {
	if (battle.turnOwner !== "boss" || battle.bossActionsRemaining <= 0) throw new TraceWildRuleError("conflict");
	const wild = creatureById(battleEncounterCreatureId(battle));
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const swap = chooseBossBattleSwap(battle.board, wild.ecology, random);
	if (swap === void 0) throw new TraceWildRuleError("conflict");
	const resolution = resolveBattleSwap(battle.board, swap.from, swap.to, random);
	if (resolution === void 0) throw new TraceWildRuleError("conflict");
	battle.board = resolution.board;
	let matched = 0;
	let ownColor = 0;
	let charge = 0;
	for (const step of resolution.steps) {
		const count = TRACE_ECOLOGIES.reduce((sum, ecology) => sum + step.counts[ecology], 0);
		const combo = Math.min(2, 1 + .2 * (step.chain - 1));
		matched += count;
		ownColor += step.counts[wild.ecology];
		charge += count / 3 * combo;
	}
	battle.lastBossMatch = matched;
	battle.bossAttackCharge = Math.min(32, battle.bossAttackCharge + charge);
	const energyGain = Math.min(8, ownColor);
	if (energyGain > 0) {
		battle.bossEnergy = Math.min(24, battle.bossEnergy + energyGain);
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "boss-energy",
			amount: energyGain,
			ecology: wild.ecology
		});
	}
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "boss-match",
		amount: matched,
		ecology: wild.ecology
	});
	if (resolution.steps.length > 1) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "boss-combo",
		amount: resolution.steps.length
	});
	const beforeActions = battle.bossActionsRemaining;
	battle.bossActionsTaken += 1;
	const directMaxGroup = resolution.steps[0]?.maxGroup ?? 0;
	if (directMaxGroup >= 5 && battle.bossBonusActionsGranted < 2) {
		battle.bossActionsRemaining = Math.min(5, beforeActions + 1);
		if (battle.bossActionsRemaining > beforeActions) battle.bossBonusActionsGranted += 1;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "boss-action-bonus",
			amount: battle.bossActionsRemaining - beforeActions
		});
	} else if (directMaxGroup >= 4) {
		battle.bossActionsRemaining = beforeActions;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "boss-action-refund",
			amount: beforeActions
		});
	} else battle.bossActionsRemaining = Math.max(0, beforeActions - 1);
	if (battle.bossActionsTaken >= 7) battle.bossActionsRemaining = 0;
	return {
		outcome: battle.bossActionsRemaining === 0 ? finishBossPhase(battle, random) : "none",
		animation: {
			kind: "match",
			battleId: battle.id,
			actor: "boss",
			swap: {
				from: swap.from,
				to: swap.to
			},
			frames: resolution.frames
		}
	};
}
function continueBattle(battle, random) {
	if (battle.captureWindow) {
		battle.captureWindow = false;
		return { outcome: beginBossPhase(battle, random) };
	}
	if (battle.turnOwner === "boss") return performBossBoardAction(battle, random);
	const active = battle.party[battle.activeIndex];
	if (battle.turnOwner !== "player" || battle.actionsRemaining !== 0 || active === void 0 || active.frozenStages <= 0) throw new TraceWildRuleError("conflict");
	active.frozenStages -= 1;
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "frozen-skip",
		creatureId: active.creatureId
	});
	return { outcome: completeBattleStage(battle, random) };
}
function skipPlayerStage(battle, random) {
	const active = battle.party[battle.activeIndex];
	if (battle.mode !== "wild" || battle.turnOwner !== "player" || battle.captureWindow || battle.actionsRemaining <= 0 || active === void 0 || battle.partyHp <= 0) throw new TraceWildRuleError("conflict");
	battle.actionsRemaining = 0;
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "stage-skip",
		creatureId: active.creatureId
	});
	return completeBattleStage(battle, random);
}
function selectedIndexes(board, ecology, maximum) {
	return board.map((current, index) => current.ecology === ecology ? index : -1).filter((index) => index >= 0).slice(0, maximum);
}
function resolveConvertedBoard(battle, random) {
	const resolution = resolveExistingBattleMatches(battle.board, random);
	if (resolution.steps.length > 0) applyResolution(battle, resolution, random, false);
	return resolution.frames;
}
function castActiveSkill(state, creatureInstanceId, random) {
	const battle = state.battle;
	if (battle === void 0 || battle.turnOwner !== "player" || battle.captureWindow || battle.actionsRemaining <= 0) throw new TraceWildRuleError("conflict");
	const member = activeMember(battle);
	if (member.instanceId !== creatureInstanceId || member.skillUsedStage || member.skillSealedStages > 0) throw new TraceWildRuleError("conflict");
	const definition = skillByCreatureId(member.creatureId);
	if (definition === void 0 || member.energy < definition.energyCost) throw new TraceWildRuleError("invalid-action");
	member.energy -= definition.energyCost;
	member.skillUsedStage = true;
	let scale = qualityMultiplier(member);
	if (member.creatureId === "glitch-overflow-maw") {
		scale *= 1 + member.overcharge * .03;
		member.overcharge = 0;
	}
	let damage = 0;
	const animationFrames = [];
	switch (member.creatureId) {
		case "lumen-indeximp":
			damage += applyRawHit(battle, member, .8 * scale);
			battle.enemyMarks = Math.min(3, battle.enemyMarks + 1);
			battle.board = convertRandomBattleTiles(battle.board, "lumen", 3, random);
			animationFrames.push(...resolveConvertedBoard(battle, random));
			break;
		case "lumen-foliomoth":
			healParty(battle, battle.partyMaxHp * .08 * scale);
			shieldParty(battle, member.maxHp * .1 * scale);
			break;
		case "lumen-lensel": {
			const wild = creatureById(battleEncounterCreatureId(battle));
			battle.board = convertRandomBattleTiles(battle.board, ecologyThatCounters(wild.ecology), 4, random);
			animationFrames.push(...resolveConvertedBoard(battle, random));
			break;
		}
		case "lumen-echocoil":
			damage += applyWildDamage(battle, Math.max(memberStats(member).attack, battle.lastPlayerDamage) * .75 * scale);
			break;
		case "lumen-atlashart":
			battle.affinityFloorActions = Math.max(battle.affinityFloorActions, 2);
			break;
		case "forge-sparkmite":
			for (let hit = 0; hit < 3; hit += 1) damage += applyRawHit(battle, member, .55 * scale);
			break;
		case "forge-rivetclaw":
			shieldParty(battle, member.maxHp * .18 * scale);
			member.counterPower = .8 * scale;
			break;
		case "forge-solderling":
			battle.board = convertRandomBattleTiles(battle.board, "forge", 4, random);
			battle.enemyBurn = Math.min(4.2, battle.enemyBurn + scale);
			animationFrames.push(...resolveConvertedBoard(battle, random));
			break;
		case "forge-anvilback":
			damage += applyRawHit(battle, member, 1.8 * scale);
			battle.wildArmor = Math.max(0, battle.wildArmor - 3);
			break;
		case "forge-kiln-colossus": {
			const resolution = resolveForcedTiles(battle.board, selectedIndexes(battle.board, "forge", 49), random);
			damage += applyResolution(battle, resolution, random, false);
			animationFrames.push(...resolution.frames);
			break;
		}
		case "relay-pingfly":
			battle.board = createGuaranteedMatch(battle.board, "relay");
			animationFrames.push(...resolveConvertedBoard(battle, random));
			break;
		case "relay-duplex-hare":
			battle.repeatPower = Math.max(battle.repeatPower, Math.min(.9, .6 * scale));
			break;
		case "relay-routeray":
			battle.board = reshuffleBattleBoard(battle.board, random);
			break;
		case "relay-forktail":
			battle.repeatPower = Math.max(battle.repeatPower, Math.min(.95, .7 * scale));
			break;
		case "relay-mesh-jelly":
			for (const ally of livingMembers(battle)) grantEnergy(ally, Math.round(2 * scale));
			battle.board = convertRandomBattleTiles(battle.board, "relay", 3, random);
			animationFrames.push(...resolveConvertedBoard(battle, random));
			break;
		case "aegis-veribud":
			healParty(battle, battle.partyMaxHp * .1 * scale);
			break;
		case "aegis-loop-tortoise":
			shieldParty(battle, battle.partyMaxHp * .2 * scale);
			break;
		case "aegis-anchorbee":
			battle.enemyDelayed = Math.max(1, battle.enemyDelayed);
			battle.boardLockActions = Math.max(3, battle.boardLockActions);
			break;
		case "aegis-steady-ram":
			shieldParty(battle, member.maxHp * .1 * scale);
			damage += applyRawHit(battle, member, 1.4 * scale);
			break;
		case "aegis-dawnguard":
			healParty(battle, battle.partyMaxHp * .16 * scale);
			shieldParty(battle, battle.partyMaxHp * .08 * scale);
			break;
		case "glitch-null-nibbler":
			battle.wildShield = 0;
			battle.wildArmor = Math.max(0, battle.wildArmor - 2);
			damage += applyRawHit(battle, member, scale);
			break;
		case "glitch-stack-weaver":
			battle.board = convertRandomBattleTiles(battle.board, "glitch", 5, random);
			battle.enemyMarks = Math.min(3, battle.enemyMarks + 1);
			animationFrames.push(...resolveConvertedBoard(battle, random));
			break;
		case "glitch-lagtoad":
			damage += applyRawHit(battle, member, 1.1 * scale);
			battle.enemyDelayed = Math.max(1, battle.enemyDelayed);
			break;
		case "glitch-crashfox":
			damage += applyRawHit(battle, member, 2.2 * scale);
			battle.partyHp = Math.max(1, battle.partyHp - Math.max(1, Math.round(member.hp * .08)));
			syncLegacyPartyHealth(battle);
			break;
		case "glitch-overflow-maw": {
			const resolution = resolveForcedTiles(battle.board, selectedIndexes(battle.board, "glitch", 12), random);
			damage += applyResolution(battle, resolution, random, false);
			animationFrames.push(...resolution.frames);
			break;
		}
	}
	battle.lastPlayerDamage = Math.max(battle.lastPlayerDamage, damage);
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "skill",
		amount: damage,
		creatureId: member.creatureId
	});
	return animationFrames;
}
function addCapturedCreature(state, creatureId, ecology, quality, level, now, random) {
	if (state.creatures.length >= MAX_CREATURES) throw new TraceWildRuleError("conflict");
	const captured = {
		instanceId: randomId("pet", now, random),
		creatureId,
		quality,
		level: Math.min(100, Math.max(1, Math.round(level))),
		xp: totalXpForLevel(level, quality),
		wins: 0,
		caughtAt: now,
		firstSignal: ecology
	};
	state.creatures.push(captured);
	if (state.squad.length < 3) state.squad.push(captured.instanceId);
	updateDex(state, creatureId, now, true);
	return captured;
}
function rosterMedianLevel(state) {
	if (state.creatures.length === 0) return 1;
	const levels = state.creatures.map((creature) => creature.level).sort((left, right) => left - right);
	return levels[Math.floor((levels.length - 1) / 2)] ?? 1;
}
function captureChanceForBattle(state, quality) {
	const battle = state.battle;
	if (battle === void 0 || battle.mode !== "wild") return 0;
	const encounter = state.encounters.find((row) => row.id === battle.encounterId);
	const wild = encounter === void 0 ? void 0 : creatureById(encounter.creatureId);
	if (encounter === void 0 || wild === void 0) return 0;
	const partyAverageLevel = battle.party.length === 0 ? 1 : battle.party.reduce((sum, member) => sum + member.level, 0) / battle.party.length;
	return captureChance({
		rarity: wild.rarity,
		baseCaptureRate: wild.baseCaptureRate,
		wildQuality: encounter.quality,
		coreQuality: quality,
		healthRatio: battle.wildHp / battle.wildMaxHp,
		partyAverageLevel,
		wildLevel: encounter.level,
		priorFailures: encounter.captureAttempts
	});
}
function attemptCapture(state, quality, now, random) {
	const battle = state.battle;
	if (battle === void 0 || battle.mode !== "wild" || !battle.captureWindow) throw new TraceWildRuleError("conflict");
	if (state.cores[quality] <= 0) throw new TraceWildRuleError("invalid-action");
	const encounter = state.encounters.find((row) => row.id === battle.encounterId);
	const wild = encounter === void 0 ? void 0 : creatureById(encounter.creatureId);
	if (encounter === void 0 || wild === void 0) throw new TraceWildRuleError("conflict");
	state.cores[quality] -= 1;
	const chance = captureChanceForBattle(state, quality);
	if (boundedRandom(random) < chance) {
		const capturedLevel = Math.min(encounter.level, rosterMedianLevel(state) + 5);
		addCapturedCreature(state, wild.id, encounter.ecology, encounter.quality, capturedLevel, now, random);
		const excessLevels = Math.max(0, encounter.level - capturedLevel);
		const bonusMaterials = Math.min(3, Math.floor(excessLevels / 5));
		for (let index = 0; index < bonusMaterials; index += 1) {
			state.materials[encounter.quality] += 1;
			state.stats.materialsEarned += 1;
		}
		state.encounters = state.encounters.filter((row) => row.id !== encounter.id);
		state.stats.successfulCaptures += 1;
		logEntry(state, {
			at: now,
			kind: "capture",
			creatureId: wild.id,
			ecology: wild.ecology,
			quality: encounter.quality
		}, random);
		delete state.battle;
		return "capture-success";
	}
	encounter.captureAttempts = Math.min(MAX_CAPTURE_ATTEMPTS, encounter.captureAttempts + 1);
	battle.captureAttempts = encounter.captureAttempts;
	state.stats.failedCaptures += 1;
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "capture-failed"
	});
	if (CAPTURE_CORE_QUALITIES.reduce((sum, current) => sum + state.cores[current], 0) > 0) {
		battle.captureWindow = true;
		return "capture-failed";
	}
	battle.captureWindow = false;
	if (beginBossPhase(battle, random) !== "battle-lost") return "capture-failed";
	logEntry(state, {
		at: now,
		kind: "defeat",
		creatureId: wild.id,
		ecology: wild.ecology
	}, random);
	delete state.battle;
	return "battle-lost";
}
function awardWildDefeat(state, now, random) {
	const battle = state.battle;
	const encounter = battle === void 0 ? void 0 : state.encounters.find((row) => row.id === battle.encounterId);
	if (battle === void 0 || encounter === void 0) throw new TraceWildRuleError("conflict");
	const drops = 1 + (encounter.quality === "origin" ? boundedRandom(random) < .5 ? 1 : 0 : encounter.quality === "nova" && boundedRandom(random) < .25 ? 1 : 0);
	for (let index = 0; index < drops; index += 1) {
		const quality = chooseWeighted(MATERIAL_DROP_WEIGHTS[encounter.quality], random);
		state.materials[quality] += 1;
		state.stats.materialsEarned += 1;
		logEntry(state, {
			at: now,
			kind: "material-drop",
			quality,
			ecology: encounter.ecology
		}, random);
	}
	for (const member of battle.party) {
		const captured = state.creatures.find((creature) => creature.instanceId === member.instanceId);
		if (captured !== void 0) captured.wins += 1;
	}
	state.stats.wildDefeats += 1;
	logEntry(state, {
		at: now,
		kind: "wild-defeat",
		creatureId: encounter.creatureId,
		ecology: encounter.ecology,
		quality: encounter.quality
	}, random);
	state.encounters = state.encounters.filter((row) => row.id !== encounter.id);
	delete state.battle;
}
function awardTowerClear(state, now, random) {
	const battle = state.battle;
	if (battle?.mode !== "tower" || battle.towerFloor === void 0 || battle.towerFloor !== state.tower.highestClearedFloor + 1) throw new TraceWildRuleError("conflict");
	const profile = towerFloorProfile(battle.towerFloor);
	if (profile.creatureId !== battle.wildCreatureId || profile.quality !== battle.wildQuality || profile.level !== battle.wildLevel || profile.skillTier !== battle.bossSkillTier) throw new TraceWildRuleError("conflict");
	const wild = creatureById(profile.creatureId);
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const materials = emptyTowerMaterialReward();
	for (let index = 0; index < profile.baseMaterialDrops; index += 1) {
		const quality = chooseWeighted(MATERIAL_DROP_WEIGHTS[profile.quality], random);
		materials[quality] += 1;
	}
	if (profile.milestoneMaterial) materials[profile.quality] += 1;
	for (const quality of CAPTURE_CORE_QUALITIES) {
		const count = materials[quality];
		if (count <= 0) continue;
		state.materials[quality] += count;
		state.stats.materialsEarned += count;
		for (let index = 0; index < count; index += 1) logEntry(state, {
			at: now,
			kind: "material-drop",
			quality,
			ecology: wild.ecology
		}, random);
	}
	for (const member of battle.party) {
		const captured = state.creatures.find((creature) => creature.instanceId === member.instanceId);
		if (captured !== void 0) captured.wins += 1;
	}
	state.tower.highestClearedFloor = profile.floor;
	state.tower.clears = Math.min(999999999, state.tower.clears + 1);
	state.tower.lastReward = {
		floor: profile.floor,
		materials,
		awardedAt: now
	};
	logEntry(state, {
		at: now,
		kind: "tower-clear",
		creatureId: wild.id,
		ecology: wild.ecology,
		quality: profile.quality
	}, random);
	delete state.battle;
}
function settleBattleVictory(state, now, random) {
	if (state.battle?.mode === "tower") {
		awardTowerClear(state, now, random);
		return "tower-cleared";
	}
	awardWildDefeat(state, now, random);
	return "wild-defeated";
}
function logBattleDefeat(state, now, random) {
	const battle = state.battle;
	if (battle === void 0) return;
	const encounter = battle.mode === "wild" ? state.encounters.find((row) => row.id === battle.encounterId) : void 0;
	const wild = creatureById(battle.wildCreatureId);
	const creatureId = encounter?.creatureId ?? wild?.id;
	const ecology = encounter?.ecology ?? wild?.ecology;
	logEntry(state, {
		at: now,
		kind: "defeat",
		...creatureId === void 0 ? {} : { creatureId },
		...ecology === void 0 ? {} : { ecology }
	}, random);
}
function applyTraceWildAction(current, action, random, now = Date.now()) {
	if (action.type === "set-enabled") {
		if (current.enabled === action.enabled) return { state: current };
		const next = structuredClone(current);
		next.enabled = action.enabled;
		next.idle.lastSettlementAt = now;
		return { state: commit(next, now) };
	}
	if (!current.enabled) throw new TraceWildRuleError("conflict");
	const settled = settleTraceWildIdleRewards(current, now, random);
	const next = structuredClone(settled);
	purgeExpiredEncounters(next, now);
	let notice;
	let animation;
	switch (action.type) {
		case "choose-starter": {
			if (next.starterChosen || !STARTER_CREATURE_IDS.includes(action.creatureId)) throw new TraceWildRuleError("conflict");
			const definition = creatureById(action.creatureId);
			if (definition === void 0) throw new TraceWildRuleError("invalid-action");
			addCapturedCreature(next, definition.id, definition.ecology, "prism", 1, now, random);
			next.starterChosen = true;
			next.cores.pebble += 2;
			logEntry(next, {
				at: now,
				kind: "starter",
				creatureId: definition.id,
				ecology: definition.ecology
			}, random);
			break;
		}
		case "start-battle":
			startBattle(next, action.encounterId, now, random);
			break;
		case "start-tower":
			startTowerBattle(next, now, random);
			break;
		case "battle-swap": {
			const result = performBattleSwap(next, action.from, action.to, random);
			animation = result.animation;
			if (result.outcome === "battle-lost") {
				logBattleDefeat(next, now, random);
				delete next.battle;
				notice = "battle-lost";
			} else if (result.outcome === "wild-defeated") notice = settleBattleVictory(next, now, random);
			break;
		}
		case "battle-cast": {
			const battleId = next.battle?.id;
			const frames = castActiveSkill(next, action.creatureInstanceId, random);
			if (battleId !== void 0 && frames.length > 0) animation = {
				kind: "match",
				battleId,
				actor: "player",
				frames
			};
			if (next.battle?.partyHp === 0) {
				logBattleDefeat(next, now, random);
				delete next.battle;
				notice = "battle-lost";
			} else notice = "skill-cast";
			break;
		}
		case "battle-skip-stage": {
			if (next.battle === void 0) throw new TraceWildRuleError("conflict");
			const outcome = skipPlayerStage(next.battle, random);
			if (outcome === "battle-lost") {
				logBattleDefeat(next, now, random);
				delete next.battle;
				notice = "battle-lost";
			} else if (outcome === "wild-defeated") notice = settleBattleVictory(next, now, random);
			break;
		}
		case "battle-continue": {
			if (next.battle === void 0) throw new TraceWildRuleError("conflict");
			const result = continueBattle(next.battle, random);
			animation = result.animation;
			const { outcome } = result;
			if (outcome === "battle-lost") {
				logBattleDefeat(next, now, random);
				delete next.battle;
				notice = "battle-lost";
			} else if (outcome === "wild-defeated") notice = settleBattleVictory(next, now, random);
			break;
		}
		case "capture":
			notice = attemptCapture(next, action.quality, now, random);
			break;
		case "claim-idle-reward": {
			const reward = next.idle.pendingReward;
			if (reward === void 0) throw new TraceWildRuleError("invalid-action");
			if (reward.coreQuality !== void 0) next.cores[reward.coreQuality] += 1;
			for (const quality of CAPTURE_CORE_QUALITIES) {
				const count = reward.materials[quality];
				next.materials[quality] += count;
				next.stats.materialsEarned += count;
			}
			next.idle = {
				lastSettlementAt: next.idle.lastSettlementAt,
				lastReward: structuredClone(reward)
			};
			logEntry(next, {
				at: now,
				kind: "idle-reward",
				...reward.coreQuality === void 0 ? {} : { quality: reward.coreQuality }
			}, random);
			notice = "idle-claimed";
			break;
		}
		case "flee":
			if (next.battle === void 0) throw new TraceWildRuleError("conflict");
			delete next.battle;
			break;
		case "feed-material": {
			if (next.battle !== void 0 || !Number.isSafeInteger(action.count) || action.count < 1 || action.count > 99) throw new TraceWildRuleError("invalid-action");
			const creature = next.creatures.find((row) => row.instanceId === action.creatureInstanceId);
			if (creature === void 0 || creature.level >= 100 || next.materials[action.quality] < action.count) throw new TraceWildRuleError("invalid-action");
			next.materials[action.quality] -= action.count;
			creature.xp = Math.min(totalXpForLevel(100, creature.quality), creature.xp + MATERIAL_XP[action.quality] * action.count);
			creature.level = levelForXp(creature.xp, creature.quality);
			notice = "material-used";
			break;
		}
		case "release-creature": {
			if (next.battle !== void 0 || next.creatures.length <= 1) throw new TraceWildRuleError("conflict");
			const creatureIndex = next.creatures.findIndex((row) => row.instanceId === action.creatureInstanceId);
			const released = next.creatures[creatureIndex];
			if (creatureIndex < 0 || released === void 0 || next.materials[released.quality] >= 9999) throw new TraceWildRuleError("invalid-action");
			next.creatures.splice(creatureIndex, 1);
			next.squad = next.squad.filter((id) => id !== released.instanceId);
			if (next.squad.length === 0) next.squad = [next.creatures[0].instanceId];
			next.materials[released.quality] += 1;
			next.stats.materialsEarned += 1;
			logEntry(next, {
				at: now,
				kind: "release",
				creatureId: released.creatureId,
				ecology: released.firstSignal,
				quality: released.quality
			}, random);
			notice = "creature-released";
			break;
		}
		case "set-squad": {
			if (action.instanceIds.length === 0 || action.instanceIds.length > 3) throw new TraceWildRuleError("invalid-action");
			const unique = [...new Set(action.instanceIds)];
			if (unique.length !== action.instanceIds.length || unique.some((id) => !next.creatures.some((row) => row.instanceId === id))) throw new TraceWildRuleError("invalid-action");
			next.squad = unique;
			break;
		}
	}
	purgeExpiredEncounters(next, now);
	return {
		state: commit(next, now),
		...notice === void 0 ? {} : { notice },
		...animation === void 0 ? {} : { animation }
	};
}
function record(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function safeInt(value, fallback, max = Number.MAX_SAFE_INTEGER) {
	return Number.isSafeInteger(value) && value >= 0 ? Math.min(value, max) : fallback;
}
function safeNumber(value, fallback, minimum, maximum) {
	return typeof value === "number" && Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, value)) : fallback;
}
function isCoreQuality(value) {
	return typeof value === "string" && CAPTURE_CORE_QUALITIES.includes(value);
}
function restoreIdleReward(value, now) {
	const row = record(value);
	if (row === void 0) return void 0;
	const settledAt = safeInt(row.settledAt, now + 1);
	const elapsedMinutes = safeInt(row.elapsedMinutes, 0, MAX_IDLE_ELAPSED_MS / 6e4);
	if (settledAt > now || elapsedMinutes < 60) return void 0;
	const rawMaterials = record(row.materials);
	const materials = emptyCores();
	for (const quality of CAPTURE_CORE_QUALITIES) materials[quality] = safeInt(rawMaterials?.[quality], 0, 4);
	const materialCount = CAPTURE_CORE_QUALITIES.reduce((sum, quality) => sum + materials[quality], 0);
	if (materialCount > 4) return void 0;
	const coreQuality = isCoreQuality(row.coreQuality) ? row.coreQuality : void 0;
	if (coreQuality === void 0 && materialCount === 0) return void 0;
	return {
		settledAt,
		elapsedMinutes,
		...coreQuality === void 0 ? {} : { coreQuality },
		materials
	};
}
function isEcology(value) {
	return typeof value === "string" && TRACE_ECOLOGIES.includes(value);
}
function isSpecial(value) {
	return value === "none" || value === "row" || value === "column" || value === "burst" || value === "origin";
}
function restoreBoard(value) {
	if (!Array.isArray(value) || value.length !== 49) return void 0;
	const board = [];
	for (const raw of value) {
		const row = record(raw);
		if (row === void 0 || !isEcology(row.ecology) || !isSpecial(row.special)) return void 0;
		const lockedActions = safeInt(row.lockedActions, 0, 2);
		const hazardActions = safeInt(row.hazardActions, 0, 3);
		board.push({
			ecology: row.ecology,
			special: row.special,
			...lockedActions > 0 ? { lockedActions } : {},
			...hazardActions > 0 ? { hazardActions } : {}
		});
	}
	return findFirstLegalBattleSwap(board) === void 0 ? void 0 : board;
}
function restoreBattle(root, state) {
	const raw = record(root.battle);
	if (raw === void 0) return void 0;
	const mode = raw.mode === "tower" ? "tower" : "wild";
	const encounterId = typeof raw.encounterId === "string" ? raw.encounterId : "";
	const encounter = mode === "wild" ? state.encounters.find((row) => row.id === encounterId) : void 0;
	const towerFloor = mode === "tower" ? safeInt(raw.towerFloor, 0, MAX_TOWER_FLOOR) : 0;
	if (mode === "tower" && (towerFloor < 1 || towerFloor !== state.tower.highestClearedFloor + 1 || encounterId !== `tower_${towerFloor}`)) return void 0;
	const towerProfile = mode === "tower" ? towerFloorProfile(towerFloor) : void 0;
	const wild = creatureById(encounter?.creatureId ?? towerProfile?.creatureId ?? "");
	const board = restoreBoard(raw.board);
	if (mode === "wild" && encounter === void 0 || wild === void 0 || board === void 0) return void 0;
	const rawParty = Array.isArray(raw.party) ? raw.party : [];
	if (rawParty.length < 1 || rawParty.length > 3) return void 0;
	const party = [];
	for (const rawMember of rawParty) {
		const row = record(rawMember);
		const instanceId = typeof row?.instanceId === "string" ? row.instanceId : "";
		const captured = state.creatures.find((item) => item.instanceId === instanceId);
		if (row === void 0 || captured === void 0 || party.some((item) => item.instanceId === instanceId)) return void 0;
		const stats = levelStats(captured);
		party.push({
			instanceId,
			creatureId: captured.creatureId,
			quality: captured.quality,
			level: captured.level,
			hp: Math.min(stats.hp, safeInt(row.hp, stats.hp, stats.hp)),
			maxHp: stats.hp,
			shield: safeInt(row.shield, 0, stats.hp),
			energy: safeInt(row.energy, 0, ENERGY_LIMIT),
			skillUsedStage: row.skillUsedStage === true,
			passiveRound: safeInt(row.passiveRound, 0, 999999),
			passiveStage: safeInt(row.passiveStage, 0, 999999),
			passiveBattleUsed: row.passiveBattleUsed === true,
			reviveUsed: row.reviveUsed === true,
			counterPower: safeNumber(row.counterPower, 0, 0, 2),
			overcharge: safeInt(row.overcharge, 0, 5),
			stageDamage: safeInt(row.stageDamage, 0, 9999999),
			frozenStages: safeInt(row.frozenStages, 0, 1),
			skillSealedStages: safeInt(row.skillSealedStages, 0, 1)
		});
	}
	const activeIndex = safeInt(raw.activeIndex, 0, party.length - 1);
	const partyMaxHp = party.reduce((sum, member) => sum + member.maxHp, 0);
	const legacyPartyHp = party.reduce((sum, member) => sum + member.hp, 0);
	const partyHp = Math.min(partyMaxHp, safeInt(raw.partyHp, legacyPartyHp, partyMaxHp));
	if (partyHp <= 0) return void 0;
	const id = typeof raw.id === "string" && /^battle_[a-z0-9_]{8,64}$/.test(raw.id) ? raw.id : "";
	if (id === "") return void 0;
	const rawEnemyIntent = raw.enemyIntent === "sweep" ? "strike" : raw.enemyIntent;
	if (rawEnemyIntent !== "strike" && rawEnemyIntent !== "guard" && rawEnemyIntent !== "disrupt" && rawEnemyIntent !== "corrupt" && rawEnemyIntent !== "mark" && rawEnemyIntent !== "lock" && rawEnemyIntent !== "freeze") return void 0;
	const enemyIntent = rawEnemyIntent;
	const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length;
	const battleLevel = encounter?.level ?? towerProfile.level;
	const battleQuality = encounter?.quality ?? towerProfile.quality;
	const fallbackWildStats = towerProfile === void 0 ? wildStats(wild, battleLevel, battleQuality, party.length, partyAverageLevel) : towerBossStats(wild, towerProfile, party.length, partyAverageLevel);
	const wildMaxHp = towerProfile === void 0 ? Math.max(1, safeInt(raw.wildMaxHp, fallbackWildStats.hp, 9999999)) : fallbackWildStats.hp;
	const defaultTarget = enemyTargetFor({ activeIndex }, enemyIntent);
	const persistedTargetIndex = Number.isSafeInteger(raw.enemyTargetIndex) && raw.enemyTargetIndex >= 0 && raw.enemyTargetIndex < party.length ? raw.enemyTargetIndex : void 0;
	const restoredTarget = defaultTarget.scope === "member" && persistedTargetIndex !== void 0 ? {
		scope: defaultTarget.scope,
		index: persistedTargetIndex
	} : defaultTarget;
	const lastTeamContributions = (Array.isArray(raw.lastTeamContributions) ? raw.lastTeamContributions.slice(0, 3) : []).flatMap((value) => {
		const row = record(value);
		const instanceId = typeof row?.instanceId === "string" ? row.instanceId : "";
		if (!party.some((member) => member.instanceId === instanceId)) return [];
		return [{
			instanceId,
			amount: safeInt(row?.amount, 0, 9999999)
		}];
	});
	const captureWindow = mode === "wild" && raw.captureWindow === true;
	const actionsRemaining = safeInt(raw.actionsRemaining, 3, 5);
	const turnOwner = !captureWindow && raw.turnOwner === "boss" ? "boss" : "player";
	const restored = {
		id,
		encounterId,
		wildCreatureId: wild.id,
		mode,
		...towerProfile === void 0 ? {} : { towerFloor: towerProfile.floor },
		bossSkillTier: towerProfile?.skillTier ?? bossSkillTierForThreat(threatPoints(battleLevel, battleQuality)),
		board,
		party,
		partyHp,
		partyMaxHp,
		partyShield: safeInt(raw.partyShield, party.reduce((sum, member) => sum + member.shield, 0), partyMaxHp),
		turnOwner,
		activeIndex,
		actionsRemaining,
		bossActionsRemaining: turnOwner === "boss" ? Math.max(1, safeInt(raw.bossActionsRemaining, 3, 5)) : 0,
		bossActionsTaken: turnOwner === "boss" ? safeInt(raw.bossActionsTaken, 0, 6) : 0,
		bossEnergy: safeInt(raw.bossEnergy, 0, 24),
		bossAttackCharge: safeNumber(raw.bossAttackCharge, 0, 0, 32),
		bossBonusActionsGranted: safeInt(raw.bossBonusActionsGranted, 0, 2),
		bossSkillArmed: raw.bossSkillArmed === true,
		lastBossAttack: safeInt(raw.lastBossAttack, 0, 9999999),
		lastBossMatch: safeInt(raw.lastBossMatch, 0, 49),
		stage: Math.max(1, safeInt(raw.stage, 1, 999999)),
		round: Math.max(1, safeInt(raw.round, 1, 999999)),
		wildHp: Math.max(1, safeInt(raw.wildHp, wildMaxHp, wildMaxHp)),
		wildMaxHp,
		wildArmor: safeInt(raw.wildArmor, encounter?.armor ?? towerProfile.armor, 12),
		wildShield: safeInt(raw.wildShield, 0, wildMaxHp),
		wildDefense: towerProfile === void 0 ? safeInt(raw.wildDefense, fallbackWildStats.defense, 999999) : fallbackWildStats.defense,
		wildAttack: towerProfile === void 0 ? safeInt(raw.wildAttack, fallbackWildStats.attack, 999999) : fallbackWildStats.attack,
		wildLevel: battleLevel,
		wildQuality: battleQuality,
		enemyIntent,
		enemyTargetScope: restoredTarget.scope,
		...restoredTarget.index === void 0 ? {} : { enemyTargetIndex: restoredTarget.index },
		enemyMarks: safeInt(raw.enemyMarks, 0, 3),
		enemyBurn: safeNumber(raw.enemyBurn, 0, 0, 4.2),
		enemyDelayed: safeInt(raw.enemyDelayed, 0, 1),
		affinityFloorActions: safeInt(raw.affinityFloorActions, 0, 2),
		boardLockActions: safeInt(raw.boardLockActions, 0, 3),
		repeatPower: safeNumber(raw.repeatPower, 0, 0, .95),
		lastPlayerDamage: safeInt(raw.lastPlayerDamage, 0, 999999),
		pendingTeamDamage: safeInt(raw.pendingTeamDamage, 0, 9999999),
		lastTeamStrike: safeInt(raw.lastTeamStrike, 0, 9999999),
		lastTeamDamageApplied: safeInt(raw.lastTeamDamageApplied, 0, 9999999),
		lastTeamContributions,
		bonusActionsGranted: safeInt(raw.bonusActionsGranted, 0, 2),
		captureWindow,
		captureAttempts: encounter?.captureAttempts ?? 0,
		enemyHardControlCooldown: safeInt(raw.enemyHardControlCooldown, 0, 3),
		enemyPhase: Math.max(1, safeInt(raw.enemyPhase, 1, 2)),
		turn: Math.max(1, safeInt(raw.turn, 1, 999999)),
		log: [{
			turn: 0,
			kind: "start",
			creatureId: wild.id,
			ecology: wild.ecology
		}]
	};
	syncLegacyPartyHealth(restored);
	return restored;
}
/** Tolerant, bounded loader with schema-v1/v2 migration. Invalid or future data starts a fresh profile. */
function restoreTraceWildState(value, now = Date.now()) {
	const root = record(value);
	if (root?.schemaVersion !== 1 && root?.schemaVersion !== 2 && root?.schemaVersion !== 3) return createInitialTraceWildState(now);
	const next = createInitialTraceWildState(now);
	next.enabled = root.enabled !== false;
	next.revision = safeInt(root.revision, 0);
	next.createdAt = safeInt(root.createdAt, now);
	next.updatedAt = safeInt(root.updatedAt, next.createdAt);
	const cores = record(root.cores);
	for (const quality of CAPTURE_CORE_QUALITIES) next.cores[quality] = safeInt(cores?.[quality], 0, 9999);
	const materials = record(root.materials);
	for (const quality of CAPTURE_CORE_QUALITIES) next.materials[quality] = safeInt(materials?.[quality], 0, 9999);
	const rawCreatures = Array.isArray(root.creatures) ? root.creatures.slice(0, MAX_CREATURES) : [];
	const instanceIds = /* @__PURE__ */ new Set();
	for (const raw of rawCreatures) {
		const row = record(raw);
		if (row === void 0) continue;
		const instanceId = typeof row.instanceId === "string" ? row.instanceId : "";
		const creatureId = typeof row.creatureId === "string" ? row.creatureId : "";
		const definition = creatureById(creatureId);
		if (!/^pet_[a-z0-9_]{8,64}$/.test(instanceId) || instanceIds.has(instanceId) || definition === void 0) continue;
		instanceIds.add(instanceId);
		const savedLevel = Math.max(1, safeInt(row.level, 1, root.schemaVersion === 3 ? 100 : 30));
		const quality = isCoreQuality(row.quality) ? row.quality : "prism";
		const levelFloorXp = totalXpForLevel(savedLevel, quality);
		const savedXp = root.schemaVersion === 3 ? Math.max(levelFloorXp, safeInt(row.xp, levelFloorXp, totalXpForLevel(100, quality))) : levelFloorXp;
		next.creatures.push({
			instanceId,
			creatureId,
			quality,
			level: levelForXp(savedXp, quality),
			xp: savedXp,
			wins: safeInt(row.wins, 0, 999999),
			caughtAt: safeInt(row.caughtAt, next.createdAt),
			firstSignal: definition.ecology
		});
	}
	next.starterChosen = root.starterChosen === true && next.creatures.length > 0;
	const rawSquad = Array.isArray(root.squad) ? root.squad : [];
	next.squad = [...new Set(rawSquad.filter((id) => typeof id === "string" && instanceIds.has(id)))].slice(0, 3);
	if (next.squad.length === 0 && next.creatures[0] !== void 0) next.squad = [next.creatures[0].instanceId];
	const migratedPartyLevel = effectivePartyLevel(next.squad.map((id) => next.creatures.find((creature) => creature.instanceId === id)).filter((creature) => creature !== void 0));
	const rawDex = Array.isArray(root.dex) ? root.dex.slice(0, 25) : [];
	for (const raw of rawDex) {
		const row = record(raw);
		if (row === void 0) continue;
		const creatureId = typeof row.creatureId === "string" ? row.creatureId : "";
		if (creatureById(creatureId) === void 0 || next.dex.some((item) => item.creatureId === creatureId)) continue;
		next.dex.push({
			creatureId,
			seen: Math.max(1, safeInt(row.seen, 1, 999999)),
			captured: safeInt(row.captured, 0, 999999),
			firstSeenAt: safeInt(row.firstSeenAt, next.createdAt),
			lastSeenAt: safeInt(row.lastSeenAt, next.updatedAt)
		});
	}
	for (const creature of next.creatures) if (!next.dex.some((row) => row.creatureId === creature.creatureId)) next.dex.push({
		creatureId: creature.creatureId,
		seen: 1,
		captured: 1,
		firstSeenAt: creature.caughtAt,
		lastSeenAt: creature.caughtAt
	});
	const rawEncounters = Array.isArray(root.encounters) ? root.encounters.slice(0, 7) : [];
	const persistedBattle = record(root.battle);
	const persistedActiveEncounterId = persistedBattle?.mode === "tower" || typeof persistedBattle?.encounterId !== "string" ? void 0 : persistedBattle.encounterId;
	const encounterIds = /* @__PURE__ */ new Set();
	for (const raw of rawEncounters) {
		const row = record(raw);
		if (row === void 0) continue;
		const id = typeof row.id === "string" ? row.id : "";
		const creatureId = typeof row.creatureId === "string" ? row.creatureId : "";
		const definition = creatureById(creatureId);
		if (!/^wild_[a-z0-9_]{8,64}$/.test(id) || encounterIds.has(id) || definition === void 0) continue;
		const spawnedAt = safeInt(row.spawnedAt, now);
		const quality = root.schemaVersion === 3 && isCoreQuality(row.quality) ? row.quality : "pebble";
		const level = root.schemaVersion === 3 ? Math.max(1, safeInt(row.level, migratedPartyLevel, 100)) : migratedPartyLevel;
		const expiresAt = Math.min(Number.MAX_SAFE_INTEGER, spawnedAt + encounterLifetimeMs(quality, level));
		if (now >= expiresAt && id !== persistedActiveEncounterId) continue;
		encounterIds.add(id);
		next.encounters.push({
			id,
			creatureId,
			ecology: definition.ecology,
			quality,
			level,
			captureAttempts: root.schemaVersion === 3 ? safeInt(row.captureAttempts, 0, MAX_CAPTURE_ATTEMPTS) : 0,
			spawnedAt,
			expiresAt,
			enhanced: row.enhanced === true,
			armor: safeInt(row.armor, row.enhanced === true ? 2 : 0, 2),
			mapX: Math.min(92, Math.max(8, safeInt(row.mapX, 50, 100))),
			mapY: Math.min(90, Math.max(10, safeInt(row.mapY, 50, 100)))
		});
	}
	const stats = record(root.stats);
	for (const key of Object.keys(next.stats)) next.stats[key] = safeInt(stats?.[key], 0, 999999999);
	const rewardPity = record(root.rewardPity);
	next.rewardPity = {
		wildHighQualityMisses: safeInt(rewardPity?.wildHighQualityMisses, 0, 12),
		coreHighQualityMisses: safeInt(rewardPity?.coreHighQualityMisses, 0, 20)
	};
	const idle = record(root.idle);
	const lastSettlementAt = safeInt(idle?.lastSettlementAt, next.updatedAt);
	next.idle = { lastSettlementAt: Math.min(now, lastSettlementAt) };
	const pendingReward = restoreIdleReward(idle?.pendingReward, now);
	if (pendingReward !== void 0) next.idle.pendingReward = pendingReward;
	const lastReward = restoreIdleReward(idle?.lastReward, now);
	if (lastReward !== void 0) next.idle.lastReward = lastReward;
	const tower = record(root.tower);
	const highestClearedFloor = safeInt(tower?.highestClearedFloor, 0, MAX_TOWER_FLOOR);
	const clears = Math.max(highestClearedFloor, safeInt(tower?.clears, highestClearedFloor, 999999999));
	next.tower = {
		highestClearedFloor,
		clears,
		attempts: Math.max(clears, safeInt(tower?.attempts, clears, 999999999))
	};
	const rawTowerReward = record(tower?.lastReward);
	const rewardFloor = safeInt(rawTowerReward?.floor, 0, highestClearedFloor);
	const rewardMaterials = record(rawTowerReward?.materials);
	const towerMaterials = emptyTowerMaterialReward();
	for (const quality of CAPTURE_CORE_QUALITIES) towerMaterials[quality] = safeInt(rewardMaterials?.[quality], 0, 9);
	const towerRewardCount = CAPTURE_CORE_QUALITIES.reduce((sum, quality) => sum + towerMaterials[quality], 0);
	const awardedAt = safeInt(rawTowerReward?.awardedAt, now + 1);
	if (rewardFloor > 0 && rewardFloor <= highestClearedFloor && towerRewardCount > 0 && towerRewardCount <= 9 && awardedAt <= now) next.tower.lastReward = {
		floor: rewardFloor,
		materials: towerMaterials,
		awardedAt
	};
	next.processedSignals = Array.isArray(root.processedSignals) ? root.processedSignals.filter((id) => typeof id === "string" && /^[a-f0-9]{24}$/.test(id)).slice(-256) : [];
	next.log = [];
	if (root.schemaVersion === 3) {
		const restoredBattle = restoreBattle(root, next);
		if (restoredBattle !== void 0) next.battle = restoredBattle;
	}
	purgeExpiredEncounters(next, now);
	return next;
}
//#endregion
//#region lib/types/host/routes.js
const TRACEWILD_API_PREFIX = "/api/tracewild";
const MAX_ACTION_BODY_BYTES = 4096;
const HEARTBEAT_MS = 15e3;
var TraceWildRoutesClosedError = class extends Error {};
var TraceWildRouteLifecycle = class {
	controller = new AbortController();
	streams = /* @__PURE__ */ new Map();
	get signal() {
		return this.controller.signal;
	}
	trackStream(res, cleanup) {
		if (this.signal.aborted) {
			cleanup();
			if (!res.writableEnded && !res.destroyed) res.end();
			return;
		}
		this.streams.set(res, cleanup);
	}
	releaseStream(res) {
		this.streams.delete(res);
	}
	close() {
		if (this.signal.aborted) return;
		this.controller.abort();
		for (const [res, cleanup] of [...this.streams]) {
			cleanup();
			if (!res.writableEnded && !res.destroyed) res.end();
		}
		this.streams.clear();
	}
};
const ASSET_FILES = /* @__PURE__ */ new Set(["sprites/codekin-launcher-v1.webp", ...CREATURE_CATALOG.map((creature) => `sprites/${creature.id}.webp`)]);
function securityHeaders() {
	return {
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
		"referrer-policy": "no-referrer",
		"cross-origin-resource-policy": "same-origin"
	};
}
function sendJson(res, status, value) {
	res.writeHead(status, {
		...securityHeaders(),
		"content-type": "application/json; charset=utf-8"
	});
	res.end(JSON.stringify(value));
}
function failure(res, status, error) {
	sendJson(res, status, {
		ok: false,
		error
	});
}
function rejectUntrusted(req, res, requestRejection) {
	const status = requestRejection(req);
	if (status === void 0) return false;
	res.writeHead(status, securityHeaders());
	res.end(status === 401 ? "unauthorized" : "forbidden");
	return true;
}
function sameOrigin(req) {
	const host = req.headers.host;
	if (typeof host !== "string" || host.length === 0 || host.length > 255) return false;
	const site = req.headers["sec-fetch-site"];
	if (site !== void 0 && site !== "same-origin" && site !== "none") return false;
	const origin = req.headers.origin;
	if (origin === void 0) return site === "same-origin" || site === "none";
	if (typeof origin !== "string" || origin.length > 512) return false;
	try {
		const parsed = new URL(origin);
		return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.host === host;
	} catch {
		return false;
	}
}
function readBody(req, signal) {
	return new Promise((resolve, reject) => {
		let size = 0;
		let settled = false;
		const chunks = [];
		const cleanup = () => {
			req.off("data", onData);
			req.off("end", onEnd);
			req.off("error", onError);
			signal.removeEventListener("abort", onAbort);
		};
		const finish = (callback) => {
			if (settled) return;
			settled = true;
			cleanup();
			callback();
		};
		const onData = (chunk) => {
			if (settled) return;
			size += chunk.byteLength;
			if (size > MAX_ACTION_BODY_BYTES) {
				finish(() => {
					reject(/* @__PURE__ */ new TypeError("body too large"));
				});
				queueMicrotask(() => req.destroy());
				return;
			}
			chunks.push(chunk);
		};
		const onEnd = () => {
			finish(() => {
				try {
					resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
				} catch {
					reject(/* @__PURE__ */ new TypeError("invalid json"));
				}
			});
		};
		const onError = () => {
			finish(() => {
				reject(/* @__PURE__ */ new TypeError("request error"));
			});
		};
		const onAbort = () => {
			finish(() => {
				reject(new TraceWildRoutesClosedError());
			});
		};
		if (signal.aborted) {
			onAbort();
			return;
		}
		req.on("data", onData);
		req.on("end", onEnd);
		req.on("error", onError);
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
function stateRoute(service, lifecycle, requestRejection) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/state`,
		handler(req, res) {
			if (rejectUntrusted(req, res, requestRejection)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			sendJson(res, 200, service.snapshot());
		}
	};
}
function actionRoute(service, lifecycle, requestRejection) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/action`,
		async handler(req, res) {
			if (rejectUntrusted(req, res, requestRejection)) return;
			if (req.method !== "POST") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (!sameOrigin(req) || !/^application\/json(?:\s*;|$)/i.test(String(req.headers["content-type"] ?? ""))) {
				failure(res, 403, "invalid-action");
				return;
			}
			try {
				const action = normalizeTraceWildAction(await readBody(req, lifecycle.signal));
				if (lifecycle.signal.aborted) throw new TraceWildRoutesClosedError();
				sendJson(res, 200, service.act(action));
			} catch (error) {
				if (error instanceof TraceWildRoutesClosedError || lifecycle.signal.aborted) {
					failure(res, 503, "unavailable");
					return;
				}
				if (error instanceof TraceWildRuleError) {
					failure(res, error.code === "conflict" ? 409 : 400, error.code);
					return;
				}
				if (error instanceof TypeError) {
					failure(res, 400, "invalid-action");
					return;
				}
				failure(res, 500, "unavailable");
			}
		}
	};
}
function eventsRoute(service, lifecycle, requestRejection) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/events`,
		handler(req, res) {
			if (rejectUntrusted(req, res, requestRejection)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			res.writeHead(200, {
				...securityHeaders(),
				"cache-control": "no-cache, no-transform",
				"content-type": "text/event-stream; charset=utf-8",
				"connection": "keep-alive",
				"x-accel-buffering": "no"
			});
			res.flushHeaders?.();
			let closed = false;
			let unsubscribe;
			const heartbeat = setInterval(() => {
				if (!closed) res.write(": tracewild\n\n");
			}, HEARTBEAT_MS);
			heartbeat.unref?.();
			const close = () => {
				if (closed) return;
				closed = true;
				clearInterval(heartbeat);
				req.off("close", close);
				res.off("close", close);
				lifecycle.releaseStream(res);
				unsubscribe?.();
			};
			req.once("close", close);
			res.once("close", close);
			lifecycle.trackStream(res, close);
			unsubscribe = service.subscribe((snapshot) => {
				if (closed) return;
				try {
					res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
				} catch {
					close();
				}
			});
			if (closed) unsubscribe();
		}
	};
}
function assetRoute(assetDirectory, lifecycle, requestRejection) {
	return {
		kind: "prefix",
		path: `${TRACEWILD_API_PREFIX}/assets`,
		async handler(req, res) {
			if (rejectUntrusted(req, res, requestRejection)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			const filename = new URL(req.url ?? "/", "http://tracewild.invalid").pathname.slice(`${TRACEWILD_API_PREFIX}/assets/`.length);
			if (!ASSET_FILES.has(filename)) {
				res.writeHead(404, securityHeaders());
				res.end();
				return;
			}
			try {
				const body = await readFile(join(assetDirectory, filename));
				if (lifecycle.signal.aborted) {
					failure(res, 503, "unavailable");
					return;
				}
				res.writeHead(200, {
					...securityHeaders(),
					"cache-control": "public, max-age=86400, immutable",
					"content-type": "image/webp",
					"content-length": String(body.byteLength)
				});
				res.end(body);
			} catch {
				res.writeHead(404, securityHeaders());
				res.end();
			}
		}
	};
}
function createTraceWildRoutes(service, assetDirectory, requestRejection) {
	const lifecycle = new TraceWildRouteLifecycle();
	return {
		routes: [
			stateRoute(service, lifecycle, requestRejection),
			actionRoute(service, lifecycle, requestRejection),
			eventsRoute(service, lifecycle, requestRejection),
			assetRoute(assetDirectory, lifecycle, requestRejection)
		],
		close: () => {
			lifecycle.close();
		}
	};
}
//#endregion
//#region lib/types/host/classifier.js
function fresh(turn) {
	return {
		turn,
		lumen: 0,
		forge: 0,
		relay: 0,
		aegis: 0,
		failedTools: 0,
		toolCount: 0,
		callEcology: /* @__PURE__ */ new Map()
	};
}
function classifyTool(name) {
	const value = name.toLowerCase();
	if (/(subagent|agent|delegate|send.message|followup|fork|handoff|interrupt)/.test(value)) return "relay";
	if (/(read|search|grep|glob|find|list|web|browser|resource|inspect|query)/.test(value)) return "lumen";
	if (/(exec|command|bash|pwsh|terminal|write|edit|patch|build|test|run|apply|create|delete|move|copy)/.test(value)) return "forge";
	return "aegis";
}
function signalId(session, event) {
	return createHash("sha256").update(`${String(session.id)}\0${String(event.data.turn)}\0${String(event.seq)}`).digest("hex").slice(0, 24);
}
function failureVariant(reason) {
	if (reason.kind === "max-tokens") return "overflow";
	if (reason.kind === "interrupted") return "crash";
	if (reason.kind === "blocked") return "stack";
	if (reason.kind !== "error") return void 0;
	const code = reason.error.code.toUpperCase();
	if (/(ENOENT|NOT.?FOUND|MISSING)/.test(code)) return "missing";
	if (/(TIMEOUT|TIMEDOUT|DEADLINE)/.test(code)) return "timeout";
	if (/(STACK|RECURS|LOOP)/.test(code)) return "stack";
	if (/(ENOSPC|OOM|MEMORY|OVERFLOW|LIMIT)/.test(code)) return "overflow";
	return "crash";
}
var TraceWildEventClassifier = class {
	traces = /* @__PURE__ */ new WeakMap();
	activity = /* @__PURE__ */ new WeakMap();
	observe(session, event) {
		const activeMinutes = this.observeActivity(session, event.time);
		switch (event.type) {
			case "turn/start":
				this.traces.set(session, fresh(event.data.turn));
				return;
			case "tool/call": {
				const trace = this.trace(session, event.data.turn);
				const ecology = classifyTool(event.data.name);
				trace.callEcology.set(String(event.data.callId), ecology);
				trace.toolCount += 1;
				if (ecology === "lumen") trace.lumen += 1;
				if (ecology === "forge") trace.forge += 1;
				if (ecology === "relay") trace.relay += 1;
				if (ecology === "aegis") trace.aegis += 1;
				return;
			}
			case "tool/result": {
				const trace = this.trace(session, event.data.turn);
				const firstBlock = event.data.message.content[0];
				if (event.data.error !== void 0 || firstBlock?.isError === true) trace.failedTools += 1;
				return;
			}
			case "turn/end": {
				const trace = this.trace(session, event.data.turn);
				this.traces.delete(session);
				if (event.data.reason.kind === "aborted") return void 0;
				if (event.data.reason.kind !== "completed") {
					const variant = failureVariant(event.data.reason);
					return {
						id: signalId(session, event),
						at: event.time,
						ecology: "glitch",
						ecologyCandidates: ["glitch"],
						outcome: "failed",
						intensity: Math.min(5, 1 + Math.floor(trace.toolCount / 2) + trace.failedTools),
						activeMinutes,
						enhanced: true,
						...variant === void 0 ? {} : { variant }
					};
				}
				const ecology = this.completedEcology(trace);
				return {
					id: signalId(session, event),
					at: event.time,
					ecology,
					ecologyCandidates: this.completedEcologyCandidates(trace),
					outcome: "completed",
					intensity: Math.min(5, 1 + Math.floor(trace.toolCount / 3) + (trace.failedTools > 0 ? 2 : 0)),
					activeMinutes,
					enhanced: false
				};
			}
			default: return;
		}
	}
	/** Fold child activity into its live top-level turn without ever minting a child reward. */
	observeRelatedActivity(session, event) {
		this.observeActivity(session, event.time);
		const trace = this.traces.get(session);
		if (trace === void 0) return;
		if (event.type === "tool/call") {
			const ecology = classifyTool(event.data.name);
			trace.callEcology.set(String(event.data.callId), ecology);
			trace.toolCount += 1;
			if (ecology === "lumen") trace.lumen += 1;
			if (ecology === "forge") trace.forge += 1;
			if (ecology === "relay") trace.relay += 1;
			if (ecology === "aegis") trace.aegis += 1;
			return;
		}
		if (event.type === "tool/result") {
			const firstBlock = event.data.message.content[0];
			if (event.data.error !== void 0 || firstBlock?.isError === true) trace.failedTools += 1;
		}
	}
	disposeSession(session) {
		this.traces.delete(session);
		this.activity.delete(session);
	}
	observeActivity(session, at) {
		const current = this.activity.get(session);
		if (current === void 0 || !Number.isFinite(at) || at < current.lastEventAt) {
			this.activity.set(session, {
				lastEventAt: Number.isFinite(at) ? at : 0,
				activeMs: 0
			});
			return 0;
		}
		const gap = at - current.lastEventAt;
		if (gap > 0 && gap <= 12e4) current.activeMs = Math.min(108e5, current.activeMs + gap);
		current.lastEventAt = at;
		return current.activeMs / 6e4;
	}
	trace(session, turn) {
		const current = this.traces.get(session);
		if (current !== void 0 && current.turn === turn) return current;
		const next = fresh(turn);
		this.traces.set(session, next);
		return next;
	}
	completedEcology(trace) {
		if (trace.failedTools > 0) return "aegis";
		if (trace.relay > 0 && trace.relay >= trace.forge && trace.relay >= trace.lumen) return "relay";
		if (trace.forge > 0 && trace.forge >= trace.lumen) return "forge";
		if (trace.lumen > 0) return "lumen";
		return "aegis";
	}
	completedEcologyCandidates(trace) {
		const candidates = [];
		if (trace.lumen > 0) candidates.push("lumen");
		if (trace.forge > 0) candidates.push("forge");
		if (trace.relay > 0) candidates.push("relay");
		if (trace.aegis > 0 || trace.failedTools > 0) candidates.push("aegis");
		return candidates.length > 0 ? candidates : ["aegis"];
	}
};
//#endregion
//#region lib/types/host/persistence.js
const MAX_STATE_BYTES = 2097152;
function traceWildHome() {
	const configured = process.env.DSH_HOME;
	if (configured === void 0 || configured.trim() === "") return join(homedir(), ".dsh");
	const expanded = configured === "~" ? homedir() : configured.startsWith("~/") || configured.startsWith("~\\") ? join(homedir(), configured.slice(2)) : configured;
	return isAbsolute(expanded) ? resolve(expanded) : resolve(process.cwd(), expanded);
}
function traceWildStatePath() {
	return join(traceWildHome(), "tracewild", "state.json");
}
var TraceWildPersistence = class {
	filename;
	constructor(filename = traceWildStatePath()) {
		this.filename = filename;
	}
	load(now = Date.now()) {
		try {
			if (statSync(this.filename).size > MAX_STATE_BYTES) return createInitialTraceWildState(now);
			return restoreTraceWildState(JSON.parse(readFileSync(this.filename, "utf8")), now);
		} catch {
			return createInitialTraceWildState(now);
		}
	}
	save(state) {
		mkdirSync(dirname(this.filename), {
			recursive: true,
			mode: 448
		});
		const temporary = `${this.filename}.tmp`;
		const body = JSON.stringify(state);
		if (Buffer.byteLength(body, "utf8") > MAX_STATE_BYTES) throw new Error("TraceWild state is too large");
		writeFileSync(temporary, body, {
			encoding: "utf8",
			mode: 384
		});
		renameSync(temporary, this.filename);
	}
};
//#endregion
//#region lib/types/host/service.js
const cryptoRandom = () => randomInt(0, 4294967296) / 4294967296;
var TraceWildService = class {
	ctx;
	stateValue;
	listeners = /* @__PURE__ */ new Set();
	classifier = new TraceWildEventClassifier();
	persistence;
	random;
	now;
	constructor(ctx, options = {}) {
		this.ctx = ctx;
		this.persistence = options.persistence ?? new TraceWildPersistence();
		this.random = options.random ?? cryptoRandom;
		this.now = options.now ?? Date.now;
		this.stateValue = this.persistence.load(this.now());
		const settled = settleTraceWildIdleRewards(this.stateValue, this.now(), this.random);
		if (settled !== this.stateValue) {
			this.persistence.save(settled);
			this.stateValue = settled;
		}
	}
	snapshot() {
		const serverTime = this.now();
		const settled = settleTraceWildIdleRewards(expireTraceWildEncounters(this.stateValue, serverTime), serverTime, this.random);
		if (settled !== this.stateValue) {
			this.persistence.save(settled);
			this.stateValue = settled;
		}
		return {
			schemaVersion: 3,
			state: structuredClone(this.stateValue),
			serverTime
		};
	}
	subscribe(listener) {
		this.listeners.add(listener);
		listener(this.snapshot());
		return () => {
			this.listeners.delete(listener);
		};
	}
	observe(session, event) {
		if (!this.stateValue.enabled) return;
		if (session.header.parentSession !== void 0 || session.header.origin === "subagent") {
			const root = this.rootSession(session);
			if (root !== void 0) this.classifier.observeRelatedActivity(root, event);
			return;
		}
		const signal = this.classifier.observe(session, event);
		if (signal === void 0) return;
		try {
			const next = applyTraceSignal(this.stateValue, signal, this.random);
			if (next === this.stateValue) return;
			this.persistence.save(next);
			this.stateValue = next;
			this.publish();
		} catch (error) {
			this.ctx.logger.warn("tracewild: event reward could not be committed");
			this.ctx.logger.warn(error);
		}
	}
	rootSession(session) {
		let current = session;
		const visited = /* @__PURE__ */ new Set();
		for (let depth = 0; depth < 16 && current.header.parentSession !== void 0; depth += 1) {
			const id = String(current.id);
			if (visited.has(id)) return void 0;
			visited.add(id);
			const parent = this.ctx.sessions.get(current.header.parentSession);
			if (parent === void 0) return void 0;
			current = parent;
		}
		return current.header.parentSession === void 0 && current.header.origin !== "subagent" ? current : void 0;
	}
	disposeSession(session) {
		this.classifier.disposeSession(session);
	}
	act(action) {
		const previousEnabled = this.stateValue.enabled;
		const result = applyTraceWildAction(this.stateValue, action, this.random, this.now());
		this.persistence.save(result.state);
		this.stateValue = result.state;
		if (result.state.enabled !== previousEnabled) this.classifier = new TraceWildEventClassifier();
		const snapshot = this.snapshot();
		this.publish(snapshot);
		return {
			ok: true,
			...snapshot,
			...result.notice === void 0 ? {} : { notice: result.notice },
			...result.animation === void 0 ? {} : { animation: result.animation }
		};
	}
	publish(snapshot = this.snapshot()) {
		for (const listener of [...this.listeners]) try {
			listener(snapshot);
		} catch {}
	}
};
//#endregion
//#region lib/types/index.js
/** Codekin Host plugin. */
const name = "dsh-codekin";
const inject = [
	"sessions",
	"webServer",
	"connection"
];
function apply(ctx) {
	const service = new TraceWildService(ctx);
	const assetDirectory = fileURLToPath(new URL("../assets/creatures/", import.meta.url));
	ctx.effect(() => {
		const routeGroup = createTraceWildRoutes(service, assetDirectory, (request) => ctx.connection.requestRejection(request));
		const disposers = [];
		try {
			for (const route of routeGroup.routes) disposers.push(ctx.webServer.register(route));
			disposers.push(ctx.on("session/event", (session, event) => {
				service.observe(session, event);
			}));
			disposers.push(ctx.on("session/disposed", (session) => {
				service.disposeSession(session);
			}));
		} catch (error) {
			routeGroup.close();
			for (const dispose of disposers.reverse()) try {
				dispose();
			} catch {}
			throw error;
		}
		return () => {
			routeGroup.close();
			for (const dispose of disposers.reverse()) try {
				dispose();
			} catch {}
		};
	}, "tracewild: events and web routes");
}
//#endregion
export { BASE_ACTIONS_PER_CREATURE, BASE_BOSS_ACTIONS, BOSS_SKILL_ENERGY_COST, BOSS_SKILL_ENERGY_LIMIT, CAPTURE_CORE_QUALITIES, CAPTURE_HEALTH_RATIO, CORE_CAPTURE_MULTIPLIERS, CORE_CAPTURE_POWER, CORE_DROP_WEIGHTS, CREATURE_CATALOG, CREATURE_SKILLS, ECOLOGY_ADVANTAGE, MATCH_BOARD_CELLS, MATCH_BOARD_SIZE, MATERIAL_DROP_WEIGHTS, MATERIAL_XP, MAX_ACTIONS_PER_CREATURE, MAX_BONUS_ACTIONS_PER_STAGE, MAX_BOSS_ACTIONS, MAX_BOSS_BONUS_ACTIONS, MAX_BOSS_SWAPS_PER_PHASE, MAX_CAPTURE_ATTEMPTS, MAX_MAP_ENCOUNTERS, MAX_MATCH_CASCADES, MAX_PLAYER_LEVEL, MAX_TOWER_FLOOR, PLAYER_QUALITY_BASE_MULTIPLIERS, PLAYER_QUALITY_GROWTH_BONUSES, PLAYER_QUALITY_MULTIPLIERS, QUALITY_ORDER, QUALITY_SKILL_MULTIPLIERS, STARTER_CREATURE_IDS, TRACE_ECOLOGIES, TraceWildRuleError, TraceWildService, WILD_QUALITY_RESISTANCE, XP_QUALITY_MULTIPLIERS, activeMinuteBand, apply, applyTraceSignal, applyTraceWildAction, areAdjacentTiles, captureChance, captureChanceForBattle, chooseBossBattleSwap, convertRandomBattleTiles, coreQualityWeights, createInitialTraceWildState, createMatchBoard, creatureById, creaturesInEcology, effectivePartyLevel, emptyTowerMaterialReward, encounterLifetimeMs, expireTraceWildEncounters, findBestBattleSwap, findFirstLegalBattleSwap, hasBattleMatches, idleRewardTier, inject, levelForXp, name, normalizeTraceWildAction, playerLevelFactor, playerStats, qualityIndex, reshuffleBattleBoard, resolveBattleSwap, resolveExistingBattleMatches, resolveForcedTiles, restoreTraceWildState, sessionLevel, settleTraceWildIdleRewards, skillByCreatureId, threatPoints, totalXpForLevel, towerBossStats, towerFloorProfile, towerQualityForFloor, towerSkillTierForFloor, wildLevelFor, wildLevelForRoster, wildQualityWeights, wildStats, xpToNextLevel };

//# sourceMappingURL=index.js.map