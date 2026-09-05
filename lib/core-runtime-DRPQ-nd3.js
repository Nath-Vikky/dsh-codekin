import { a as createContentRegistry, i as TRACE_ECOLOGIES, n as CAPTURE_CORE_QUALITIES, t as createContentView } from "./src-ByrL1b1w.js";
import { CORE_CONTENT_PACK } from "./content-core.js";
//#region lib/types/packages/engine/src/mechanics-contract.js
function contract(trigger, required = {}, optional = {}) {
	return {
		trigger,
		required,
		optional
	};
}
const CODEKIN_MECHANIC_CONTRACTS = Object.freeze({
	"energy.store-overflow": contract("energy:overflow", { maximum: "number" }),
	"damage.combo-per-cascade": contract("damage:modify", { amount: "number" }),
	"damage.first-match-floor": contract("damage:modify", {
		minimum: "number",
		chain: "number",
		once: "string"
	}),
	"damage.low-runtime-multiplier": contract("damage:modify", {
		belowRatio: "number",
		multiplier: "number"
	}),
	"damage.round-parity-multiplier": contract("damage:modify", {
		parity: "string",
		multiplier: "number"
	}),
	"match.add-mark": contract("match:after", {
		ecology: "string",
		minCount: "number",
		once: "string",
		amount: "number",
		maximum: "number"
	}),
	"match.heal": contract("match:after", {
		ecology: "string",
		minCount: "number",
		basis: "string",
		ratio: "number"
	}, { once: "string" }),
	"match.grant-energy-on-cascade": contract("match:after", {
		minChain: "number",
		amount: "number",
		once: "string"
	}),
	"match.echo-damage": contract("match:after", {
		minChain: "number",
		factor: "number",
		once: "string"
	}),
	"match.consume-first-match": contract("match:after", {
		chain: "number",
		once: "string"
	}),
	"match.raw-hit": contract("match:after", {
		ecology: "string",
		minCount: "number",
		power: "number"
	}),
	"match.consume-counter": contract("match:after", { ecology: "string" }),
	"match.add-burn-mixed": contract("match:after", {
		ecology: "string",
		maximum: "number"
	}),
	"match.break-armor": contract("match:after", {
		ecology: "string",
		minCount: "number",
		amount: "number"
	}),
	"match.add-burn-cascade": contract("match:after", {
		ecology: "string",
		minChain: "number",
		amount: "number",
		maximum: "number"
	}),
	"match.grant-energy-round-parity": contract("match:after", {
		ecology: "string",
		parity: "string",
		amount: "number"
	}),
	"match.convert-one": contract("match:after", { ecology: "string" }, {
		minCount: "number",
		minChain: "number",
		once: "string"
	}),
	"match.shield-on-special": contract("match:after", {
		basis: "string",
		ratio: "number"
	}),
	"match.shield-on-resisted": contract("match:after", { ratio: "number" }),
	"match.erode-protection": contract("match:after", {
		ecology: "string",
		armor: "number",
		shieldAttackRatio: "number"
	}),
	"energy.share": contract("energy:after-distribute", {
		ecology: "string",
		ratio: "number",
		maximumSource: "number",
		excludeEcology: "boolean"
	}),
	"stage.grant-energy": contract("stage:enter", { amount: "number" }),
	"stage.shield": contract("stage:enter", {
		basis: "string",
		ratio: "number"
	}),
	"defeat.prevent": contract("defeat:before", {
		hp: "number",
		shieldRatio: "number",
		once: "string"
	}),
	"runtime.delay-enemy": contract("runtime:threshold", {
		belowRatio: "number",
		actions: "number",
		once: "string"
	}),
	"damage.arm-counter": contract("damage:taken", { power: "number" }),
	"skill.consume-overflow": contract("skill:before", { multiplierPerPoint: "number" }),
	"damage.raw-hit": contract("skill:cast", { power: "number" }, { hits: "number" }),
	"damage.replay": contract("skill:cast", {
		factor: "number",
		minimum: "string"
	}),
	"mark.add": contract("skill:cast", {
		amount: "number",
		maximum: "number"
	}),
	"tiles.convert": contract("skill:cast", {
		ecology: "string",
		count: "number",
		resolve: "boolean"
	}),
	"tiles.resolve": contract("skill:cast"),
	"heal.party": contract("skill:cast", {
		basis: "string",
		ratio: "number"
	}),
	"shield.party": contract("skill:cast", {
		basis: "string",
		ratio: "number"
	}),
	"affinity.floor": contract("skill:cast", { actions: "number" }),
	"counter.arm": contract("skill:cast", { power: "number" }),
	"burn.add": contract("skill:cast", {
		amount: "number",
		scaled: "boolean",
		maximum: "number"
	}),
	"armor.break": contract("skill:cast", { amount: "number" }),
	"tiles.clear": contract("skill:cast", {
		ecology: "string",
		count: "number",
		resolve: "boolean"
	}),
	"tiles.guaranteed-match": contract("skill:cast", {
		ecology: "string",
		resolve: "boolean"
	}),
	"tiles.reshuffle": contract("skill:cast"),
	"repeat.arm": contract("skill:cast", {
		power: "number",
		scaled: "boolean",
		maximum: "number"
	}),
	"energy.party": contract("skill:cast", {
		amount: "number",
		scaled: "boolean"
	}),
	"enemy.delay": contract("skill:cast", { actions: "number" }),
	"board.lock": contract("skill:cast", { actions: "number" }),
	"shield.enemy-clear": contract("skill:cast"),
	"runtime.self-damage": contract("skill:cast", {
		basis: "string",
		ratio: "number",
		minimumRemaining: "number"
	})
});
const CODEKIN_MECHANIC_OPCODES = Object.freeze(Object.keys(CODEKIN_MECHANIC_CONTRACTS));
function parameterKind(value) {
	if (typeof value === "string") return "string";
	if (typeof value === "number") return "number";
	return "boolean";
}
function mechanicsContractIssues(definitions) {
	const issues = [];
	for (const definition of definitions) definition.bindings.forEach((binding, index) => {
		const path = `/mechanics/${definition.creatureId}/bindings/${index}`;
		const opcodeContract = CODEKIN_MECHANIC_CONTRACTS[binding.opcode];
		if (opcodeContract === void 0) {
			issues.push({
				path: `${path}/opcode`,
				message: `unsupported opcode ${binding.opcode}`
			});
			return;
		}
		if (binding.trigger !== opcodeContract.trigger) issues.push({
			path: `${path}/trigger`,
			message: `opcode ${binding.opcode} requires trigger ${opcodeContract.trigger}`
		});
		const params = binding.params ?? {};
		for (const [key, kind] of Object.entries(opcodeContract.required)) {
			const value = params[key];
			if (value === void 0) issues.push({
				path: `${path}/params/${key}`,
				message: "missing required parameter"
			});
			else if (parameterKind(value) !== kind) issues.push({
				path: `${path}/params/${key}`,
				message: `expected ${kind}`
			});
		}
		for (const [key, value] of Object.entries(params)) {
			const kind = opcodeContract.required[key] ?? opcodeContract.optional[key];
			if (kind === void 0) issues.push({
				path: `${path}/params/${key}`,
				message: "unknown parameter"
			});
			else if (parameterKind(value) !== kind) issues.push({
				path: `${path}/params/${key}`,
				message: `expected ${kind}`
			});
		}
		if (binding.opcode === "match.convert-one" && params.minCount === void 0 && params.minChain === void 0) issues.push({
			path: `${path}/params`,
			message: "minCount or minChain is required"
		});
	});
	return Object.freeze(issues);
}
var MechanicsContractError = class extends TypeError {
	issues;
	constructor(issues) {
		super(`incompatible Codekin mechanics: ${issues.map((issue) => `${issue.path} ${issue.message}`).join("; ")}`);
		this.name = "MechanicsContractError";
		this.issues = Object.freeze([...issues]);
	}
};
function assertMechanicsContract(definitions) {
	const issues = mechanicsContractIssues(definitions);
	if (issues.length > 0) throw new MechanicsContractError(issues);
}
//#endregion
//#region lib/types/packages/engine/src/content.js
const CODEKIN_ENGINE_VERSION = "0.3.6-rc.1";
var EngineContentError = class extends TypeError {
	issues;
	constructor(issues) {
		super(`incompatible Codekin engine content: ${issues.join("; ")}`);
		this.name = "EngineContentError";
		this.issues = issues;
	}
};
const QUALITY_SKILL_MULTIPLIERS = Object.freeze({
	pebble: .86,
	pulse: .93,
	prism: 1,
	nova: 1.1,
	origin: 1.22
});
function legacyCreature(row) {
	if (!TRACE_ECOLOGIES.includes(row.ecology)) throw new EngineContentError([`creature ${row.id} uses unsupported ecology ${row.ecology}`]);
	return Object.freeze({
		number: row.number,
		id: row.id,
		nameZh: row.name.zhCN,
		nameEn: row.name.en,
		ecology: row.ecology,
		rarity: row.rarity,
		combatRole: row.combatRole,
		baseCaptureRate: row.baseCaptureRate,
		signatureProtocol: row.signatureProtocol,
		spriteIndex: (row.number - 1) % TRACE_ECOLOGIES.length,
		stats: Object.freeze({ ...row.stats })
	});
}
function legacySkill(row) {
	return Object.freeze({
		creatureId: row.creatureId,
		energyCost: row.energyCost,
		passiveNameZh: row.passive.name.zhCN,
		passiveNameEn: row.passive.name.en,
		passiveDescriptionZh: row.passive.description.zhCN,
		passiveDescriptionEn: row.passive.description.en,
		activeNameZh: row.active.name.zhCN,
		activeNameEn: row.active.name.en,
		activeDescriptionZh: row.active.description.zhCN,
		activeDescriptionEn: row.active.description.en
	});
}
function createEngineContent(registry) {
	const issues = [];
	const ecologyIds = new Set(registry.ecologies.map((row) => row.id));
	const qualityIds = new Set(registry.qualities.map((row) => row.id));
	for (const ecology of TRACE_ECOLOGIES) if (!ecologyIds.has(ecology)) issues.push(`missing engine ecology ${ecology}`);
	for (const quality of CAPTURE_CORE_QUALITIES) if (!qualityIds.has(quality)) issues.push(`missing engine quality ${quality}`);
	for (const ecology of registry.ecologies) if (!TRACE_ECOLOGIES.includes(ecology.id)) issues.push(`unsupported engine ecology ${ecology.id}`);
	for (const quality of registry.qualities) if (!CAPTURE_CORE_QUALITIES.includes(quality.id)) issues.push(`unsupported engine quality ${quality.id}`);
	if (issues.length > 0) throw new EngineContentError(Object.freeze(issues));
	assertMechanicsContract(registry.mechanics);
	const creatures = Object.freeze(registry.creatures.map(legacyCreature));
	const skills = Object.freeze(registry.skills.map(legacySkill));
	const creatureMap = new Map(creatures.map((row) => [row.id, row]));
	const skillMap = new Map(skills.map((row) => [row.creatureId, row]));
	const mechanicsMap = new Map(registry.mechanics.map((row) => [row.creatureId, row]));
	const byEcology = new Map(TRACE_ECOLOGIES.map((ecology) => [ecology, Object.freeze(creatures.filter((creature) => creature.ecology === ecology))]));
	const starterCreatureIds = Object.freeze([...new Set(registry.packs.flatMap((pack) => pack.starters))]);
	const towerRotation = Object.freeze(registry.packs.flatMap((pack) => pack.tower.rotation));
	if (starterCreatureIds.length === 0) throw new EngineContentError(["at least one starter is required"]);
	if (towerRotation.length === 0) throw new EngineContentError(["at least one tower creature is required"]);
	const packs = Object.freeze(registry.packs.map((pack) => Object.freeze({
		id: pack.manifest.id,
		version: pack.manifest.version
	})));
	const id = packs.map((pack) => `${pack.id}@${pack.version}`).join("+");
	return Object.freeze({
		id,
		packs,
		creatures,
		skills,
		mechanics: Object.freeze([...registry.mechanics]),
		starterCreatureIds,
		towerRotation,
		creature: (creatureId) => creatureMap.get(registry.resolveId(creatureId)),
		creaturesInEcology: (ecology) => byEcology.get(ecology) ?? [],
		skill: (creatureId) => skillMap.get(registry.resolveId(creatureId)),
		creatureMechanics: (creatureId) => mechanicsMap.get(registry.resolveId(creatureId)),
		encounterVariantCreatureId: (variant) => registry.encounterCreature(variant)?.id
	});
}
const CONTENT_STACK = [];
function currentEngineContent() {
	const content = CONTENT_STACK[CONTENT_STACK.length - 1];
	if (content === void 0) throw new EngineContentError(["no content is bound to this engine call"]);
	return content;
}
/** Runs one synchronous engine operation against an immutable content set. */
function withEngineContent(content, operation) {
	CONTENT_STACK.push(content);
	try {
		return operation();
	} finally {
		CONTENT_STACK.pop();
	}
}
//#endregion
//#region lib/types/packages/engine/src/balance.js
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
	nova: 1.11,
	origin: 1.24
});
const PLAYER_QUALITY_GROWTH_BONUSES = Object.freeze({
	pebble: .72,
	pulse: .86,
	prism: 1.02,
	nova: 1.2,
	origin: 1.42
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
	pulse: 1.12,
	prism: 1.28,
	nova: 1.48,
	origin: 1.75
});
const WILD_ATTACK_QUALITY = Object.freeze({
	pebble: 1,
	pulse: 1.04,
	prism: 1.09,
	nova: 1.15,
	origin: 1.23
});
const WILD_DEFENSE_QUALITY = Object.freeze({
	pebble: 1,
	pulse: 1.04,
	prism: 1.09,
	nova: 1.15,
	origin: 1.23
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
	hp: 1380,
	attack: 192,
	defense: 124,
	speed: 112
});
function playerLevelProgress(levelValue) {
	return Math.pow((Math.min(100, Math.max(1, Math.round(levelValue))) - 1) / 99, .86);
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
	const progress = growth / 99;
	const partyBossFactor = .95 + .95 * (partySize - 1);
	const hpLevelFactor = 1 + 1.45 * progress + .45 * progress * progress;
	const attackLevelFactor = 1 + 1.05 * progress + .25 * progress * progress;
	const defenseLevelFactor = 1 + .9 * progress + .2 * progress * progress;
	const hpGapPressure = 1 + Math.min(.18, levelGap * .006);
	const attackGapPressure = 1 + Math.min(.1, levelGap * .003);
	const defenseGapPressure = 1 + Math.min(.1, levelGap * .003);
	return {
		hp: Math.max(1, Math.round(definition.stats.hp * 1.55 * hpLevelFactor * WILD_HP_QUALITY[quality] * partyBossFactor * hpGapPressure)),
		attack: Math.max(1, Math.round(definition.stats.attack * .45 * attackLevelFactor * WILD_ATTACK_QUALITY[quality] * attackGapPressure)),
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
//#region lib/types/packages/engine/src/match3.js
const MATCH_BOARD_SIZE = 8;
const MATCH_BOARD_CELLS = 64;
const MAX_MATCH_CASCADES = 12;
function boundedRandom$1(random) {
	const value = random();
	if (!Number.isFinite(value)) return 0;
	return Math.min(.999999999, Math.max(0, value));
}
function rowOf(index) {
	return Math.floor(index / 8);
}
function columnOf(index) {
	return index % 8;
}
function areAdjacentTiles(first, second) {
	if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || second < 0 || first >= 64 || second >= 64) return false;
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
	for (let row = 0; row < 8; row += 1) {
		let start = 0;
		while (start < 8) {
			const ecology = board[row * 8 + start].ecology;
			let end = start + 1;
			while (end < 8 && board[row * 8 + end].ecology === ecology) end += 1;
			if (end - start >= 3) groups.push({
				ecology,
				direction: "row",
				indexes: Array.from({ length: end - start }, (_, offset) => row * 8 + start + offset)
			});
			start = end;
		}
	}
	for (let column = 0; column < 8; column += 1) {
		let start = 0;
		while (start < 8) {
			const ecology = board[start * 8 + column].ecology;
			let end = start + 1;
			while (end < 8 && board[end * 8 + column].ecology === ecology) end += 1;
			if (end - start >= 3) groups.push({
				ecology,
				direction: "column",
				indexes: Array.from({ length: end - start }, (_, offset) => (start + offset) * 8 + column)
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
	if (board.length !== 64) return void 0;
	const candidate = cloneBoard(board);
	for (let index = 0; index < 64; index += 1) for (const next of [index + 1, index + 8]) {
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
	if (board.length !== 64) return [];
	const candidate = cloneBoard(board);
	const ranked = [];
	for (let index = 0; index < 64; index += 1) for (const next of [index + 1, index + 8]) {
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
	return board.length === 64 && groupsInBoard(board).length > 0;
}
function createMatchBoard(random) {
	for (let attempt = 0; attempt < 24; attempt += 1) {
		const board = [];
		for (let index = 0; index < 64; index += 1) {
			const row = rowOf(index);
			const column = columnOf(index);
			const ecology = chooseEcology(random, (candidate) => !(column >= 2 && board[index - 1]?.ecology === candidate && board[index - 2]?.ecology === candidate || row >= 2 && board[index - 8]?.ecology === candidate && board[index - 16]?.ecology === candidate));
			board.push(tile(ecology));
		}
		if (findFirstLegalBattleSwap(board) !== void 0) return board;
	}
	const board = Array.from({ length: 64 }, (_, index) => tile(TRACE_ECOLOGIES[(rowOf(index) * 2 + columnOf(index)) % TRACE_ECOLOGIES.length]));
	board[0] = tile("lumen");
	board[1] = tile("forge");
	board[2] = tile("lumen");
	board[9] = tile("lumen");
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
			if (candidate < 0 || candidate >= 64 || indexes.has(candidate)) return;
			indexes.add(candidate);
			queue.push(candidate);
		};
		if (current.special === "row") {
			const start = rowOf(index) * 8;
			for (let offset = 0; offset < 8; offset += 1) add(start + offset);
		} else if (current.special === "column") {
			const column = columnOf(index);
			for (let row = 0; row < 8; row += 1) add(row * 8 + column);
		} else if (current.special === "burst") {
			const centerRow = rowOf(index);
			const centerColumn = columnOf(index);
			for (let row = centerRow - 1; row <= centerRow + 1; row += 1) for (let column = centerColumn - 1; column <= centerColumn + 1; column += 1) if (row >= 0 && row < 8 && column >= 0 && column < 8) add(row * 8 + column);
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
	const fallRows = Array.from({ length: 64 }, () => 0);
	for (let column = 0; column < 8; column += 1) {
		const kept = [];
		for (let row = 7; row >= 0; row -= 1) {
			const current = survivors[row * 8 + column];
			if (current !== void 0) kept.push(current);
		}
		const spawnedRows = 8 - kept.length;
		for (let row = 7, cursor = 0; row >= 0; row -= 1, cursor += 1) {
			const destination = row * 8 + column;
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
	if (boardValue.length !== 64 || !areAdjacentTiles(from, to)) return void 0;
	const board = cloneBoard(boardValue);
	const first = board[from];
	const second = board[to];
	if ((first.lockedActions ?? 0) > 0 || (second.lockedActions ?? 0) > 0) return void 0;
	rawSwap(board, from, to);
	if (first.special === "origin" || second.special === "origin") {
		const clear = /* @__PURE__ */ new Set([from, to]);
		if (first.special === "origin" && second.special === "origin") for (let index = 0; index < 64; index += 1) clear.add(index);
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
	const bounded = new Set(indexes.filter((index) => Number.isInteger(index) && index >= 0 && index < 64));
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
//#region lib/types/packages/engine/src/tower.js
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
function towerFloorProfile$1(floorValue) {
	const floor = boundedTowerFloor(floorValue);
	const skillTier = towerSkillTierForFloor(floor);
	const rotation = currentEngineContent().towerRotation;
	const creatureId = rotation[(floor - 1) % rotation.length];
	return Object.freeze({
		floor,
		creatureId,
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
const MAX_IDLE_ELAPSED_MS = 432e5;
function emptyQualityCounts() {
	return {
		pebble: 0,
		pulse: 0,
		prism: 0,
		nova: 0,
		origin: 0
	};
}
function createInitialTraceWildState$1(now = Date.now()) {
	return {
		schemaVersion: 3,
		revision: 0,
		createdAt: now,
		updatedAt: now,
		enabled: true,
		starterChosen: false,
		cores: emptyQualityCounts(),
		materials: emptyQualityCounts(),
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
	state.log = state.log.slice(0, 40);
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
function purgeExpiredEncounters(state, now) {
	const activeEncounter = state.battle?.mode === "tower" ? void 0 : state.battle?.encounterId;
	state.encounters = state.encounters.filter((encounter) => encounter.id === activeEncounter || now < encounter.expiresAt);
	if (activeEncounter !== void 0 && !state.encounters.some((row) => row.id === activeEncounter)) delete state.battle;
}
//#endregion
//#region lib/types/packages/engine/src/world.js
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
function settleTraceWildIdleRewards$1(current, now, random) {
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
	const materials = emptyQualityCounts();
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
	const content = currentEngineContent();
	if (ecology === "glitch" && signal.variant !== void 0 && boundedRandom(random) < .78) {
		const variantCreatureId = content.encounterVariantCreatureId(signal.variant);
		if (variantCreatureId !== void 0) return variantCreatureId;
	}
	const intensity = Math.min(5, Math.max(0, signal.intensity));
	const candidates = content.creaturesInEcology(ecology);
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
/** Removes elapsed map encounters without disturbing an encounter in an active wild battle. */
function expireTraceWildEncounters$1(current, now) {
	if (!Number.isSafeInteger(now) || now < 0) return current;
	const activeEncounter = current.battle?.mode === "tower" ? void 0 : current.battle?.encounterId;
	if (!current.encounters.some((encounter) => encounter.id !== activeEncounter && now >= encounter.expiresAt)) return current;
	const next = structuredClone(current);
	purgeExpiredEncounters(next, now);
	return commit(next, now);
}
function applyTraceSignal$1(current, signal, random) {
	if (!current.enabled) return current;
	const settled = settleTraceWildIdleRewards$1(current, signal.at, random);
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
//#endregion
//#region lib/types/packages/engine/src/appearance.js
const CREATURE_EVOLUTION_LEVEL = 30;
/** Appearance never participates in combat stats, growth, or rewards. */
function resolveCreatureAppearance(creature) {
	return creature.level >= 30 && creature.appearance !== "original" ? "evolved" : "original";
}
//#endregion
//#region lib/types/packages/engine/src/restore.js
const creatureById$1 = (id) => currentEngineContent().creature(id);
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
	const materials = emptyQualityCounts();
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
	if (!Array.isArray(value) || value.length !== 64) return void 0;
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
function sameAmplifier$1(left, right) {
	return left.signal === right.signal && left.stat === right.stat && left.scope === right.scope && left.targetInstanceId === right.targetInstanceId;
}
function restoreAmplifiers(value, side, party) {
	if (!Array.isArray(value)) return [];
	const restored = [];
	for (const raw of value.slice(0, 8)) {
		const row = record(raw);
		if (row === void 0 || row.signal !== "sync" && row.signal !== "overclock" && row.signal !== "breach" || !isEcology(row.ecology) || row.stat !== "attack" && row.stat !== "penetration" || row.scope !== "team" && row.scope !== "member" && row.scope !== "self" && row.scope !== "opponent") continue;
		if (side === "player" && row.scope !== "team" && row.scope !== "member" && row.scope !== "opponent") continue;
		if (side === "boss" && row.scope !== "self" && row.scope !== "opponent") continue;
		const targetInstanceId = typeof row.targetInstanceId === "string" ? row.targetInstanceId : void 0;
		if (row.scope === "member" && (targetInstanceId === void 0 || !party.some((member) => member.instanceId === targetInstanceId))) continue;
		if (row.scope !== "member" && targetInstanceId !== void 0) continue;
		const amplifier = {
			signal: row.signal,
			ecology: row.ecology,
			stat: row.stat,
			scope: row.scope,
			valuePermille: Math.max(10, safeInt(row.valuePermille, 10, 500)),
			remainingRounds: Math.max(1, safeInt(row.remainingRounds, 1, 3)),
			...targetInstanceId === void 0 ? {} : { targetInstanceId }
		};
		if (!restored.some((value) => sameAmplifier$1(value, amplifier))) restored.push(amplifier);
	}
	return restored;
}
function capturedStats(creature) {
	const definition = creatureById$1(creature.creatureId);
	return definition === void 0 ? void 0 : playerStats(definition.stats, creature.level, creature.quality);
}
function bossSkillTierForThreat$1(threat) {
	if (threat >= 105) return 5;
	if (threat >= 75) return 4;
	if (threat >= 45) return 3;
	if (threat >= 20) return 2;
	return 1;
}
function enemyTargetFor$1(battle, intent) {
	if (intent === "guard") return { scope: "self" };
	if (intent === "strike") return { scope: "team" };
	if (intent === "freeze" || intent === "mark") return {
		scope: "member",
		index: battle.activeIndex
	};
	return { scope: "board" };
}
function syncLegacyPartyHealth$1(battle) {
	const ratio = battle.partyMaxHp <= 0 ? 0 : battle.partyHp / battle.partyMaxHp;
	for (const member of battle.party) {
		member.hp = battle.partyHp <= 0 ? 0 : Math.max(1, Math.min(member.maxHp, Math.round(member.maxHp * ratio)));
		member.shield = 0;
	}
}
function restoreBattle(root, state) {
	const raw = record(root.battle);
	if (raw === void 0) return void 0;
	const mode = raw.mode === "tower" ? "tower" : "wild";
	const encounterId = typeof raw.encounterId === "string" ? raw.encounterId : "";
	const encounter = mode === "wild" ? state.encounters.find((row) => row.id === encounterId) : void 0;
	const towerFloor = mode === "tower" ? safeInt(raw.towerFloor, 0, MAX_TOWER_FLOOR) : 0;
	if (mode === "tower" && (towerFloor < 1 || towerFloor !== state.tower.highestClearedFloor + 1 || encounterId !== `tower_${towerFloor}`)) return void 0;
	const towerProfile = mode === "tower" ? towerFloorProfile$1(towerFloor) : void 0;
	const wild = creatureById$1(encounter?.creatureId ?? towerProfile?.creatureId ?? "");
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
		const stats = capturedStats(captured);
		if (stats === void 0) return void 0;
		party.push({
			instanceId,
			creatureId: captured.creatureId,
			quality: captured.quality,
			level: captured.level,
			hp: Math.min(stats.hp, safeInt(row.hp, stats.hp, stats.hp)),
			maxHp: stats.hp,
			shield: safeInt(row.shield, 0, stats.hp),
			energy: safeInt(row.energy, 0, 12),
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
	const defaultTarget = enemyTargetFor$1({ activeIndex }, enemyIntent);
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
		bossSkillTier: towerProfile?.skillTier ?? bossSkillTierForThreat$1(threatPoints(battleLevel, battleQuality)),
		board,
		party,
		partyHp,
		partyMaxHp,
		partyShield: safeInt(raw.partyShield, party.reduce((sum, member) => sum + member.shield, 0), partyMaxHp),
		pendingPartyHealing: turnOwner === "player" ? safeInt(raw.pendingPartyHealing, 0, partyMaxHp - partyHp) : 0,
		pendingPartyShielding: turnOwner === "player" ? safeInt(raw.pendingPartyShielding, 0, partyMaxHp) : 0,
		partyAmplifiers: restoreAmplifiers(raw.partyAmplifiers, "player", party),
		turnOwner,
		activeIndex,
		actionsRemaining,
		bossActionsRemaining: turnOwner === "boss" ? Math.max(1, safeInt(raw.bossActionsRemaining, 3, 5)) : 0,
		bossActionsTaken: turnOwner === "boss" ? safeInt(raw.bossActionsTaken, 0, 6) : 0,
		bossEnergy: safeInt(raw.bossEnergy, 0, 24),
		bossAttackCharge: safeNumber(raw.bossAttackCharge, 0, 0, 32),
		pendingBossDamage: 0,
		bossDamageScale: Math.max(900, safeInt(raw.bossDamageScale, 1e3, 1100)),
		bossBonusActionsGranted: safeInt(raw.bossBonusActionsGranted, 0, 2),
		bossSkillArmed: raw.bossSkillArmed === true,
		lastBossAttack: safeInt(raw.lastBossAttack, 0, 9999999),
		lastBossMatch: safeInt(raw.lastBossMatch, 0, 64),
		stage: Math.max(1, safeInt(raw.stage, 1, 999999)),
		round: Math.max(1, safeInt(raw.round, 1, 999999)),
		wildHp: Math.max(1, safeInt(raw.wildHp, wildMaxHp, wildMaxHp)),
		wildMaxHp,
		wildArmor: safeInt(raw.wildArmor, encounter?.armor ?? towerProfile.armor, 12),
		wildShield: safeInt(raw.wildShield, 0, wildMaxHp),
		pendingWildHealing: turnOwner === "boss" ? safeInt(raw.pendingWildHealing, 0, wildMaxHp) : 0,
		pendingWildShielding: turnOwner === "boss" ? safeInt(raw.pendingWildShielding, 0, wildMaxHp) : 0,
		bossAmplifiers: restoreAmplifiers(raw.bossAmplifiers, "boss", party),
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
	restored.pendingBossDamage = turnOwner === "boss" ? safeInt(raw.pendingBossDamage, 0, partyHp + restored.partyShield) : 0;
	restored.pendingPartyHealing = Math.min(restored.pendingPartyHealing, Math.max(0, restored.partyMaxHp - restored.partyHp));
	restored.pendingPartyShielding = Math.min(restored.pendingPartyShielding, Math.max(0, Math.round(restored.partyMaxHp * .6) - restored.partyShield));
	restored.pendingWildHealing = Math.min(restored.pendingWildHealing, Math.max(0, restored.wildMaxHp - restored.wildHp));
	restored.pendingWildShielding = Math.min(restored.pendingWildShielding, Math.max(0, Math.round(restored.wildMaxHp * .4) - restored.wildShield));
	syncLegacyPartyHealth$1(restored);
	return restored;
}
/** Tolerant, bounded loader with schema-v1/v2 migration. Invalid or future data starts a fresh profile. */
function restoreTraceWildState$1(value, now = Date.now()) {
	const root = record(value);
	if (root?.schemaVersion !== 1 && root?.schemaVersion !== 2 && root?.schemaVersion !== 3) return createInitialTraceWildState$1(now);
	const next = createInitialTraceWildState$1(now);
	next.enabled = root.enabled !== false;
	next.revision = safeInt(root.revision, 0);
	next.createdAt = safeInt(root.createdAt, now);
	next.updatedAt = safeInt(root.updatedAt, next.createdAt);
	const cores = record(root.cores);
	for (const quality of CAPTURE_CORE_QUALITIES) next.cores[quality] = safeInt(cores?.[quality], 0, 9999);
	const materials = record(root.materials);
	for (const quality of CAPTURE_CORE_QUALITIES) next.materials[quality] = safeInt(materials?.[quality], 0, 9999);
	const rawCreatures = Array.isArray(root.creatures) ? root.creatures.slice(0, 240) : [];
	const instanceIds = /* @__PURE__ */ new Set();
	for (const raw of rawCreatures) {
		const row = record(raw);
		if (row === void 0) continue;
		const instanceId = typeof row.instanceId === "string" ? row.instanceId : "";
		const creatureId = typeof row.creatureId === "string" ? row.creatureId : "";
		const definition = creatureById$1(creatureId);
		if (!/^pet_[a-z0-9_]{8,64}$/.test(instanceId) || instanceIds.has(instanceId) || definition === void 0) continue;
		instanceIds.add(instanceId);
		const savedLevel = Math.max(1, safeInt(row.level, 1, root.schemaVersion === 3 ? 100 : 30));
		const quality = isCoreQuality(row.quality) ? row.quality : "prism";
		const levelFloorXp = totalXpForLevel(savedLevel, quality);
		const savedXp = root.schemaVersion === 3 ? Math.max(levelFloorXp, safeInt(row.xp, levelFloorXp, totalXpForLevel(100, quality))) : levelFloorXp;
		const level = levelForXp(savedXp, quality);
		const appearance = savedLevel < 30 && level >= 30 ? "evolved" : row.appearance === "original" || row.appearance === "evolved" && level >= 30 ? row.appearance : void 0;
		next.creatures.push({
			instanceId,
			creatureId,
			quality,
			level,
			...appearance === void 0 ? {} : { appearance },
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
	const rawDex = Array.isArray(root.dex) ? root.dex.slice(0, currentEngineContent().creatures.length) : [];
	for (const raw of rawDex) {
		const row = record(raw);
		if (row === void 0) continue;
		const creatureId = typeof row.creatureId === "string" ? row.creatureId : "";
		if (creatureById$1(creatureId) === void 0 || next.dex.some((item) => item.creatureId === creatureId)) continue;
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
		const definition = creatureById$1(creatureId);
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
//#region lib/types/packages/engine/src/engine.js
const AMPLIFIER_DURATION_ROUNDS = 2;
const creatureById = (id) => currentEngineContent().creature(id);
const skillByCreatureId = (creatureId) => currentEngineContent().skill(creatureId);
const mechanicsByCreatureId = (creatureId) => currentEngineContent().creatureMechanics(creatureId);
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
function mechanicBindings(creatureId, trigger) {
	return (mechanicsByCreatureId(creatureId)?.bindings ?? []).map((binding, index) => ({
		binding,
		index
	})).filter((row) => row.binding.trigger === trigger).sort((left, right) => (left.binding.priority ?? 0) - (right.binding.priority ?? 0) || left.index - right.index).map((row) => row.binding);
}
function runMechanics(creatureId, trigger, handlers, context) {
	for (const binding of mechanicBindings(creatureId, trigger)) {
		const handler = handlers[binding.opcode];
		if (handler === void 0) throw new TraceWildRuleError("conflict");
		handler(binding, context);
	}
}
function mechanicNumber(binding, key) {
	const value = binding.params?.[key];
	if (typeof value !== "number" || !Number.isFinite(value)) throw new TraceWildRuleError("conflict");
	return value;
}
function mechanicString(binding, key) {
	const value = binding.params?.[key];
	if (typeof value !== "string") throw new TraceWildRuleError("conflict");
	return value;
}
function mechanicBoolean(binding, key, fallback = false) {
	const value = binding.params?.[key];
	if (value === void 0) return fallback;
	if (typeof value !== "boolean") throw new TraceWildRuleError("conflict");
	return value;
}
function mechanicEcology(binding, key = "ecology") {
	const value = mechanicString(binding, key);
	if (!TRACE_ECOLOGIES.includes(value)) throw new TraceWildRuleError("conflict");
	return value;
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
	return Math.min(1.16, Math.max(.55, Math.pow(2, levelDelta / 50)));
}
function playerDefenseFactor(defense) {
	return 1400 / (1400 + Math.max(0, defense) * 2.4);
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
function queuePartyHealing(battle, amount) {
	const available = Math.max(0, battle.partyMaxHp - battle.partyHp - battle.pendingPartyHealing);
	const queued = Math.min(available, Math.max(0, Math.round(amount)));
	battle.pendingPartyHealing += queued;
	return queued;
}
function queuePartyShielding(battle, amount) {
	const limit = Math.round(battle.partyMaxHp * .6);
	const available = Math.max(0, limit - battle.partyShield - battle.pendingPartyShielding);
	const queued = Math.min(available, Math.max(0, Math.round(amount)));
	battle.pendingPartyShielding += queued;
	return queued;
}
function healWild(battle, amount) {
	const before = battle.wildHp;
	battle.wildHp = Math.min(battle.wildMaxHp, battle.wildHp + Math.max(0, Math.round(amount)));
	return battle.wildHp - before;
}
function shieldWild(battle, amount) {
	const limit = Math.round(battle.wildMaxHp * .4);
	const before = battle.wildShield;
	battle.wildShield = Math.min(limit, battle.wildShield + Math.max(0, Math.round(amount)));
	return battle.wildShield - before;
}
function queueWildHealing(battle, amount) {
	const available = Math.max(0, battle.wildMaxHp - battle.wildHp - battle.pendingWildHealing);
	const queued = Math.min(available, Math.max(0, Math.round(amount)));
	battle.pendingWildHealing += queued;
	return queued;
}
function queueWildShielding(battle, amount) {
	const limit = Math.round(battle.wildMaxHp * .4);
	const available = Math.max(0, limit - battle.wildShield - battle.pendingWildShielding);
	const queued = Math.min(available, Math.max(0, Math.round(amount)));
	battle.pendingWildShielding += queued;
	return queued;
}
function settlePartyRecovery(battle) {
	const targetHpBefore = battle.partyHp;
	const targetShieldBefore = battle.partyShield;
	const healing = healParty(battle, battle.pendingPartyHealing);
	const shielding = shieldParty(battle, battle.pendingPartyShielding);
	battle.pendingPartyHealing = 0;
	battle.pendingPartyShielding = 0;
	if (healing > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "heal",
		amount: healing
	});
	if (shielding > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "shield",
		amount: shielding
	});
	if (healing <= 0 && shielding <= 0) return void 0;
	return {
		actor: "player",
		healing,
		shielding,
		targetHpBefore,
		targetHpAfter: battle.partyHp,
		targetMaxHp: battle.partyMaxHp,
		targetShieldBefore,
		targetShieldAfter: battle.partyShield
	};
}
function settleWildRecovery(battle) {
	const targetHpBefore = battle.wildHp;
	const targetShieldBefore = battle.wildShield;
	const healing = healWild(battle, battle.pendingWildHealing);
	const shielding = shieldWild(battle, battle.pendingWildShielding);
	battle.pendingWildHealing = 0;
	battle.pendingWildShielding = 0;
	if (shielding > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "enemy-shield",
		amount: battle.wildShield
	});
	if (healing <= 0 && shielding <= 0) return void 0;
	return {
		actor: "boss",
		healing,
		shielding,
		targetHpBefore,
		targetHpAfter: battle.wildHp,
		targetMaxHp: battle.wildMaxHp,
		targetShieldBefore,
		targetShieldAfter: battle.wildShield
	};
}
function sameAmplifier(left, right) {
	return left.signal === right.signal && left.stat === right.stat && left.scope === right.scope && left.targetInstanceId === right.targetInstanceId;
}
function upsertAmplifier(target, next) {
	const current = target.find((value) => sameAmplifier(value, next));
	if (current !== void 0) {
		current.valuePermille = Math.max(current.valuePermille, next.valuePermille);
		current.remainingRounds = Math.max(current.remainingRounds, next.remainingRounds);
		current.ecology = next.ecology;
		return;
	}
	if (target.length >= 8) target.shift();
	target.push(next);
}
function activatePlayerAmplifier(battle, effect) {
	const member = activeMember(battle);
	if (effect.kind === "sync") upsertAmplifier(battle.partyAmplifiers, {
		signal: "sync",
		ecology: effect.ecology,
		stat: "attack",
		scope: "team",
		valuePermille: 30,
		remainingRounds: AMPLIFIER_DURATION_ROUNDS
	});
	else if (effect.kind === "overclock") upsertAmplifier(battle.partyAmplifiers, {
		signal: "overclock",
		ecology: effect.ecology,
		stat: "attack",
		scope: "member",
		valuePermille: 50,
		remainingRounds: AMPLIFIER_DURATION_ROUNDS,
		targetInstanceId: member.instanceId
	});
	else if (effect.kind === "breach") upsertAmplifier(battle.partyAmplifiers, {
		signal: "breach",
		ecology: effect.ecology,
		stat: "penetration",
		scope: "opponent",
		valuePermille: 40,
		remainingRounds: AMPLIFIER_DURATION_ROUNDS
	});
}
function activateBossAmplifier(battle, effect) {
	if (effect.kind === "sync") upsertAmplifier(battle.bossAmplifiers, {
		signal: "sync",
		ecology: effect.ecology,
		stat: "attack",
		scope: "self",
		valuePermille: 80,
		remainingRounds: AMPLIFIER_DURATION_ROUNDS
	});
	else if (effect.kind === "overclock") upsertAmplifier(battle.bossAmplifiers, {
		signal: "overclock",
		ecology: effect.ecology,
		stat: "attack",
		scope: "self",
		valuePermille: 110,
		remainingRounds: AMPLIFIER_DURATION_ROUNDS
	});
	else if (effect.kind === "breach") upsertAmplifier(battle.bossAmplifiers, {
		signal: "breach",
		ecology: effect.ecology,
		stat: "penetration",
		scope: "opponent",
		valuePermille: 90,
		remainingRounds: AMPLIFIER_DURATION_ROUNDS
	});
}
function playerAttackAmplifier(battle, member) {
	return battle.partyAmplifiers.reduce((sum, value) => value.stat === "attack" && (value.scope === "team" || value.scope === "member" && value.targetInstanceId === member.instanceId) ? sum + value.valuePermille : sum, 0);
}
function playerPenetrationAmplifier(battle) {
	return battle.partyAmplifiers.reduce((sum, value) => value.stat === "penetration" && value.scope === "opponent" ? sum + value.valuePermille : sum, 0);
}
function bossAttackAmplifier(battle) {
	return battle.bossAmplifiers.reduce((sum, value) => value.stat === "attack" && value.scope === "self" ? sum + value.valuePermille : sum, 0);
}
function bossPenetrationAmplifier(battle) {
	return battle.bossAmplifiers.reduce((sum, value) => value.stat === "penetration" && value.scope === "opponent" ? sum + value.valuePermille : sum, 0);
}
function ageAmplifiers(battle) {
	const age = (values) => values.map((value) => ({
		...value,
		remainingRounds: value.remainingRounds - 1
	})).filter((value) => value.remainingRounds > 0);
	battle.partyAmplifiers = age(battle.partyAmplifiers);
	battle.bossAmplifiers = age(battle.bossAmplifiers);
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
const ENERGY_OVERFLOW_HANDLERS = { "energy.store-overflow": (binding, { member, overflow }) => {
	member.overcharge = Math.min(mechanicNumber(binding, "maximum"), member.overcharge + overflow);
} };
function grantEnergy(member, amount) {
	const whole = Math.max(0, Math.floor(amount));
	const available = Math.max(0, 12 - member.energy);
	member.energy += Math.min(available, whole);
	const overflow = whole - available;
	if (overflow > 0) runMechanics(member.creatureId, "energy:overflow", ENERGY_OVERFLOW_HANDLERS, {
		member,
		overflow
	});
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
	return applyWildDamage(battle, memberStats(member).attack * power * playerOffenseLevelFactor(member, battle) * playerDefenseFactor(battle.wildDefense), member);
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
const DAMAGE_MODIFIER_HANDLERS = {
	"damage.combo-per-cascade": (binding, context) => {
		if (context.appliedAuras.has(binding.opcode)) return;
		context.appliedAuras.add(binding.opcode);
		context.combo += mechanicNumber(binding, "amount") * Math.max(0, context.chain - 1);
	},
	"damage.first-match-floor": (binding, context) => {
		if (context.appliedAuras.has(binding.opcode)) return;
		if (context.chain !== mechanicNumber(binding, "chain") || context.owner.passiveRound === context.battle.round) return;
		context.appliedAuras.add(binding.opcode);
		context.combo = Math.max(context.combo, mechanicNumber(binding, "minimum"));
	},
	"damage.low-runtime-multiplier": (binding, context) => {
		if (context.owner.instanceId !== context.acting.instanceId) return;
		if (context.battle.partyHp < context.battle.partyMaxHp * mechanicNumber(binding, "belowRatio")) context.multiplier *= mechanicNumber(binding, "multiplier");
	},
	"damage.round-parity-multiplier": (binding, context) => {
		if (context.owner.instanceId !== context.acting.instanceId) return;
		if (mechanicString(binding, "parity") === "odd" ? context.battle.round % 2 === 1 : context.battle.round % 2 === 0) context.multiplier *= mechanicNumber(binding, "multiplier");
	}
};
function damageForStep(battle, member, counts, chain) {
	const wild = creatureById(battleEncounterCreatureId(battle));
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	const stats = memberStats(member);
	const activeEcology = creatureById(member.creatureId)?.ecology;
	if (activeEcology === void 0) throw new TraceWildRuleError("conflict");
	const attackMultiplier = 1 + Math.min(500, playerAttackAmplifier(battle, member)) / 1e3;
	const penetratedDefense = battle.wildDefense * (1 - Math.min(500, playerPenetrationAmplifier(battle)) / 1e3);
	const modifierContext = {
		battle,
		owner: member,
		acting: member,
		chain,
		combo: 1 + .25 * (chain - 1),
		multiplier: 1,
		appliedAuras: /* @__PURE__ */ new Set()
	};
	for (const owner of livingMembers(battle)) {
		modifierContext.owner = owner;
		runMechanics(owner.creatureId, "damage:modify", DAMAGE_MODIFIER_HANDLERS, modifierContext);
	}
	const combo = Math.min(2.25, modifierContext.combo);
	let total = 0;
	let signalEffect;
	const effectivenessDamage = {
		advantage: 0,
		neutral: 0,
		resisted: 0
	};
	for (const ecology of TRACE_ECOLOGIES) {
		const count = counts[ecology];
		if (count <= 0) continue;
		const element = battle.affinityFloorActions > 0 ? Math.max(1.2, affinity(ecology, wild.ecology)) : affinity(ecology, wild.ecology);
		const baseContribution = stats.attack * (count / 3) * combo * element * attackMultiplier * playerOffenseLevelFactor(member, battle) * playerDefenseFactor(penetratedDefense);
		let contribution = baseContribution;
		if (ecology === activeEcology) {
			if (ecology === "aegis") {
				contribution = 0;
				signalEffect = {
					kind: "repair",
					ecology,
					amount: Math.min(Math.round(battle.partyMaxHp * .045), Math.max(1, Math.round(stats.defense * (count / 3) * combo * (.26 + Math.max(0, count - 3) * .02))))
				};
			} else if (ecology === "relay") {
				contribution = 0;
				signalEffect = {
					kind: "guard",
					ecology,
					amount: Math.min(Math.round(battle.partyMaxHp * .045), Math.max(1, Math.round(stats.speed * (count / 3) * combo * (.28 + Math.max(0, count - 3) * .02))))
				};
			} else if (ecology === "lumen") {
				contribution *= 1.18;
				signalEffect = {
					kind: "sync",
					ecology,
					amount: Math.max(1, Math.round(contribution - baseContribution))
				};
			} else if (ecology === "forge") {
				contribution *= Math.min(1.32, 1.12 + Math.max(0, count - 3) * .035 + Math.max(0, chain - 1) * .025);
				signalEffect = {
					kind: "overclock",
					ecology,
					amount: Math.max(1, Math.round(contribution - baseContribution))
				};
			} else {
				contribution = stats.attack * (count / 3) * combo * element * attackMultiplier * playerOffenseLevelFactor(member, battle) * playerDefenseFactor(penetratedDefense * .4) * 1.03;
				signalEffect = {
					kind: "breach",
					ecology,
					amount: Math.max(1, Math.round(contribution - baseContribution))
				};
			}
		}
		total += contribution;
		if (contribution <= 0) continue;
		const effectiveness = element > 1 ? "advantage" : element < 1 ? "resisted" : "neutral";
		effectivenessDamage[effectiveness] += contribution;
	}
	total *= modifierContext.multiplier;
	const effectiveness = total <= 0 ? "neutral" : Object.entries(effectivenessDamage).sort((left, right) => right[1] - left[1] || [
		"advantage",
		"neutral",
		"resisted"
	].indexOf(left[0]) - [
		"advantage",
		"neutral",
		"resisted"
	].indexOf(right[0]))[0]?.[0] ?? "neutral";
	return {
		total: Math.max(0, Math.round(total)),
		effectiveness,
		...signalEffect === void 0 ? {} : { signalEffect }
	};
}
function applyPlayerSignalEffect(battle, effect) {
	if (effect.kind === "repair") return {
		...effect,
		amount: queuePartyHealing(battle, effect.amount)
	};
	if (effect.kind === "guard") return {
		...effect,
		amount: queuePartyShielding(battle, effect.amount)
	};
	activatePlayerAmplifier(battle, effect);
	return effect;
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
	for (let row = 0; row < 8; row += 1) for (let column = 0; column <= 5; column += 1) {
		const start = row * 8 + column;
		const indexes = [
			start,
			start + 1,
			start + 2
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
function mechanicScopeUsed(binding, member, battle) {
	const scope = binding.params?.once;
	if (scope === void 0) return false;
	if (scope === "round") return member.passiveRound === battle.round;
	if (scope === "stage") return member.passiveStage === battle.stage;
	throw new TraceWildRuleError("conflict");
}
function consumeMechanicScope(binding, member, battle) {
	const scope = binding.params?.once;
	if (scope === void 0) return;
	if (scope === "round") member.passiveRound = battle.round;
	else if (scope === "stage") member.passiveStage = battle.stage;
	else throw new TraceWildRuleError("conflict");
}
function mechanicHpBasis(binding, context) {
	switch (mechanicString(binding, "basis")) {
		case "member-max-hp": return context.member.maxHp;
		case "active-max-hp": return context.active.maxHp;
		case "party-max-hp": return context.battle.partyMaxHp;
		default: throw new TraceWildRuleError("conflict");
	}
}
const MATCH_MECHANIC_HANDLERS = {
	"match.add-mark": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] < mechanicNumber(binding, "minCount") || mechanicScopeUsed(binding, context.member, context.battle)) return;
		context.battle.enemyMarks = Math.min(mechanicNumber(binding, "maximum"), context.battle.enemyMarks + mechanicNumber(binding, "amount"));
		consumeMechanicScope(binding, context.member, context.battle);
	},
	"match.heal": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] < mechanicNumber(binding, "minCount") || mechanicScopeUsed(binding, context.member, context.battle)) return;
		queuePartyHealing(context.battle, mechanicHpBasis(binding, context) * mechanicNumber(binding, "ratio") * context.scale);
		consumeMechanicScope(binding, context.member, context.battle);
	},
	"match.grant-energy-on-cascade": (binding, context) => {
		if (context.chain < mechanicNumber(binding, "minChain") || mechanicScopeUsed(binding, context.member, context.battle)) return;
		grantEnergy(context.member, mechanicNumber(binding, "amount"));
		consumeMechanicScope(binding, context.member, context.battle);
	},
	"match.echo-damage": (binding, context) => {
		if (context.chain < mechanicNumber(binding, "minChain") || mechanicScopeUsed(binding, context.member, context.battle)) return;
		context.bonusDamage += applyWildDamage(context.battle, context.stepDamage * mechanicNumber(binding, "factor") * context.scale);
		consumeMechanicScope(binding, context.member, context.battle);
	},
	"match.consume-first-match": (binding, context) => {
		if (context.chain !== mechanicNumber(binding, "chain")) return;
		consumeMechanicScope(binding, context.member, context.battle);
	},
	"match.raw-hit": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] < mechanicNumber(binding, "minCount")) return;
		context.bonusDamage += applyRawHit(context.battle, context.member, mechanicNumber(binding, "power") * context.scale);
	},
	"match.consume-counter": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] <= 0 || context.member.counterPower <= 0) return;
		context.bonusDamage += applyRawHit(context.battle, context.member, context.member.counterPower);
		context.member.counterPower = 0;
	},
	"match.add-burn-mixed": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] <= 0 || context.colors <= 1) return;
		context.battle.enemyBurn = Math.min(mechanicNumber(binding, "maximum"), context.battle.enemyBurn + context.scale);
	},
	"match.break-armor": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] >= mechanicNumber(binding, "minCount") && context.battle.wildArmor > 0) context.battle.wildArmor = Math.max(0, context.battle.wildArmor - mechanicNumber(binding, "amount"));
	},
	"match.add-burn-cascade": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] <= 0 || context.chain < mechanicNumber(binding, "minChain")) return;
		context.battle.enemyBurn = Math.min(mechanicNumber(binding, "maximum"), context.battle.enemyBurn + mechanicNumber(binding, "amount") * context.scale);
	},
	"match.grant-energy-round-parity": (binding, context) => {
		const ecology = mechanicEcology(binding);
		const matches = mechanicString(binding, "parity") === "odd" ? context.battle.round % 2 === 1 : context.battle.round % 2 === 0;
		if (context.counts[ecology] > 0 && matches) grantEnergy(context.member, mechanicNumber(binding, "amount"));
	},
	"match.convert-one": (binding, context) => {
		const ecology = mechanicEcology(binding);
		const minimumCount = binding.params?.minCount;
		const minimumChain = binding.params?.minChain;
		if (minimumCount !== void 0 && (typeof minimumCount !== "number" || context.counts[ecology] < minimumCount)) return;
		if (minimumChain !== void 0 && (typeof minimumChain !== "number" || context.chain < minimumChain)) return;
		if (minimumCount === void 0 && minimumChain === void 0) throw new TraceWildRuleError("conflict");
		if (mechanicScopeUsed(binding, context.member, context.battle)) return;
		context.battle.board = convertOnePassiveTile(context.battle.board, ecology, context.random);
		consumeMechanicScope(binding, context.member, context.battle);
	},
	"match.shield-on-special": (binding, context) => {
		if (context.specialCount <= 0) return;
		queuePartyShielding(context.battle, mechanicHpBasis(binding, context) * mechanicNumber(binding, "ratio") * context.scale);
	},
	"match.shield-on-resisted": (binding, context) => {
		const wild = creatureById(battleEncounterCreatureId(context.battle));
		if (wild === void 0 || context.counts[ECOLOGY_ADVANTAGE[wild.ecology]] <= 0) return;
		queuePartyShielding(context.battle, context.stepDamage * mechanicNumber(binding, "ratio") * context.scale);
	},
	"match.erode-protection": (binding, context) => {
		const ecology = mechanicEcology(binding);
		if (context.counts[ecology] <= 0) return;
		if (context.battle.wildArmor > 0) context.battle.wildArmor = Math.max(0, context.battle.wildArmor - mechanicNumber(binding, "armor"));
		else context.battle.wildShield = Math.max(0, context.battle.wildShield - Math.round(memberStats(context.member).attack * mechanicNumber(binding, "shieldAttackRatio") * context.scale));
	}
};
function applyMatchPassives(battle, counts, chain, maxGroup, specialCount, stepDamage, random) {
	const active = activeMember(battle);
	const context = {
		battle,
		member: active,
		active,
		counts,
		chain,
		specialCount,
		stepDamage,
		colors: TRACE_ECOLOGIES.filter((ecology) => counts[ecology] > 0).length,
		scale: 1,
		random,
		bonusDamage: 0
	};
	for (const member of livingMembers(battle)) {
		context.member = member;
		context.scale = qualityMultiplier(member);
		runMechanics(member.creatureId, "match:after", MATCH_MECHANIC_HANDLERS, context);
	}
	if (maxGroup >= 5 && battle.wildArmor > 0) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "armor-break"
	});
	return context.bonusDamage;
}
const ENERGY_DISTRIBUTION_HANDLERS = { "energy.share": (binding, context) => {
	if (context.appliedAuras.has(binding.opcode)) return;
	const ecology = mechanicEcology(binding);
	if (context.totals[ecology] <= 0) return;
	context.appliedAuras.add(binding.opcode);
	const shared = Math.floor(Math.min(mechanicNumber(binding, "maximumSource"), context.totals[ecology]) * mechanicNumber(binding, "ratio"));
	if (shared <= 0) return;
	for (const member of livingMembers(context.battle)) {
		const memberEcology = creatureById(member.creatureId)?.ecology;
		if (!mechanicBoolean(binding, "excludeEcology") || memberEcology !== ecology) grantEnergy(member, shared);
	}
} };
function distributeEnergy(battle, totals) {
	for (const member of livingMembers(battle)) {
		const ecology = creatureById(member.creatureId)?.ecology;
		if (ecology === void 0) continue;
		grantEnergy(member, Math.min(8, totals[ecology]));
	}
	const context = {
		battle,
		totals,
		appliedAuras: /* @__PURE__ */ new Set()
	};
	for (const member of livingMembers(battle)) runMechanics(member.creatureId, "energy:after-distribute", ENERGY_DISTRIBUTION_HANDLERS, context);
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
		const damage = stepDamage.total > 0 ? applyWildDamage(battle, stepDamage.total) : 0;
		const rawSignalEffect = stepDamage.signalEffect;
		const scaledSignalEffect = rawSignalEffect === void 0 || rawSignalEffect.kind === "repair" || rawSignalEffect.kind === "guard" ? rawSignalEffect : {
			...rawSignalEffect,
			amount: stepDamage.total <= 0 ? 0 : Math.round(rawSignalEffect.amount * damage / stepDamage.total)
		};
		const signalEffect = scaledSignalEffect === void 0 ? void 0 : applyPlayerSignalEffect(battle, scaledSignalEffect);
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
			if (signalEffect !== void 0) frame.signalEffect = signalEffect;
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
const STAGE_ENTRY_HANDLERS = {
	"stage.grant-energy": (binding, context) => {
		grantEnergy(context.member, mechanicNumber(binding, "amount"));
	},
	"stage.shield": (binding, context) => {
		const basis = mechanicString(binding, "basis");
		const amount = basis === "member-max-hp" ? context.member.maxHp : basis === "party-max-hp" ? context.battle.partyMaxHp : void 0;
		if (amount === void 0) throw new TraceWildRuleError("conflict");
		queuePartyShielding(context.battle, amount * mechanicNumber(binding, "ratio") * context.scale);
	}
};
function applyStageEntryPassives(battle) {
	const member = activeMember(battle);
	member.skillUsedStage = false;
	const scale = qualityMultiplier(member);
	runMechanics(member.creatureId, "stage:enter", STAGE_ENTRY_HANDLERS, {
		battle,
		member,
		scale
	});
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
const DEFEAT_HANDLERS = { "defeat.prevent": (binding, context) => {
	if (context.prevented || context.member.reviveUsed) return;
	context.member.reviveUsed = true;
	context.battle.partyHp = mechanicNumber(binding, "hp");
	syncLegacyPartyHealth(context.battle);
	shieldParty(context.battle, context.battle.partyMaxHp * mechanicNumber(binding, "shieldRatio") * qualityMultiplier(context.member));
	context.prevented = true;
} };
function maybePreventDefeat(battle) {
	if (battle.partyHp > 0) return true;
	const context = {
		battle,
		member: battle.party[0],
		prevented: false
	};
	for (const member of battle.party) {
		context.member = member;
		runMechanics(member.creatureId, "defeat:before", DEFEAT_HANDLERS, context);
		if (context.prevented) break;
	}
	return context.prevented;
}
const RUNTIME_THRESHOLD_HANDLERS = { "runtime.delay-enemy": (binding, context) => {
	if (context.applied || context.member.passiveBattleUsed) return;
	if (context.battle.partyHp < context.battle.partyMaxHp * mechanicNumber(binding, "belowRatio")) {
		context.member.passiveBattleUsed = true;
		context.battle.enemyDelayed = Math.max(context.battle.enemyDelayed, mechanicNumber(binding, "actions"));
		context.applied = true;
	}
} };
function maybeApplyRuntimeThresholdMechanics(battle) {
	const context = {
		battle,
		member: battle.party[0],
		applied: false
	};
	for (const member of battle.party) {
		context.member = member;
		runMechanics(member.creatureId, "runtime:threshold", RUNTIME_THRESHOLD_HANDLERS, context);
		if (context.applied) break;
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
function bossPhaseDamageCap(battle) {
	const partyAverageLevel = battle.party.reduce((sum, member) => sum + member.level, 0) / battle.party.length;
	const levelPressure = Math.min(.08, Math.max(0, battle.wildLevel - partyAverageLevel) * .004);
	const qualityPressure = qualityIndex(battle.wildQuality) * .035;
	const skillPressure = (battle.bossSkillTier - 1) * .01;
	const amplifier = 1 + Math.min(500, bossAttackAmplifier(battle)) / 1e3;
	return Math.max(1, Math.round(battle.partyMaxHp * Math.min(.68, (.34 + qualityPressure + skillPressure + levelPressure) * amplifier)));
}
function enemyDamageForStep(battle, wildEcology, counts, chain) {
	if (battle.partyHp <= 0) return {
		total: 0,
		effectiveness: "neutral"
	};
	const combo = Math.min(2.25, 1 + .25 * Math.max(0, chain - 1));
	const partyPressure = .42 + .42 * Math.max(0, battle.party.length - 1);
	const defense = partyDefense(battle) * (1 - Math.min(500, bossPenetrationAmplifier(battle)) / 1e3);
	const attackMultiplier = 1 + Math.min(500, bossAttackAmplifier(battle)) / 1e3;
	let total = 0;
	let signalEffect;
	const effectivenessDamage = {
		advantage: 0,
		neutral: 0,
		resisted: 0
	};
	for (const ecology of TRACE_ECOLOGIES) {
		const count = counts[ecology];
		if (count <= 0) continue;
		const element = partyAffinity(battle, ecology);
		const tilePower = Math.pow(count / 3, .9);
		const baseContribution = battle.wildAttack * tilePower * combo * (battle.bossDamageScale / 1e3) * attackMultiplier * partyPressure * element * (1400 / (1400 + Math.max(0, defense) * 2.2));
		let contribution = baseContribution;
		if (ecology === wildEcology) {
			if (ecology === "aegis") {
				contribution *= .5;
				signalEffect = {
					kind: "repair",
					ecology,
					amount: Math.max(1, Math.round(battle.wildMaxHp * Math.min(.06, .012 * (count / 3) * combo)))
				};
			} else if (ecology === "relay") {
				contribution *= .5;
				signalEffect = {
					kind: "guard",
					ecology,
					amount: Math.max(1, Math.round(battle.wildMaxHp * Math.min(.05, .01 * (count / 3) * combo)))
				};
			} else if (ecology === "lumen") {
				contribution *= 1.25;
				signalEffect = {
					kind: "sync",
					ecology,
					amount: Math.max(1, Math.round(contribution - baseContribution))
				};
			} else if (ecology === "forge") {
				contribution *= Math.min(1.4, 1.16 + Math.max(0, count - 3) * .04 + Math.max(0, chain - 1) * .03);
				signalEffect = {
					kind: "overclock",
					ecology,
					amount: Math.max(1, Math.round(contribution - baseContribution))
				};
			} else {
				contribution = battle.wildAttack * tilePower * combo * (battle.bossDamageScale / 1e3) * attackMultiplier * partyPressure * element * (1400 / (1400 + Math.max(0, defense * .35) * 2.2)) * 1.05;
				signalEffect = {
					kind: "breach",
					ecology,
					amount: Math.max(1, Math.round(contribution - baseContribution))
				};
			}
		}
		total += contribution;
		if (contribution <= 0) continue;
		const effectiveness = element > 1.05 ? "advantage" : element < .95 ? "resisted" : "neutral";
		effectivenessDamage[effectiveness] += contribution;
	}
	const effectiveness = total <= 0 ? "neutral" : Object.entries(effectivenessDamage).sort((left, right) => right[1] - left[1] || [
		"advantage",
		"neutral",
		"resisted"
	].indexOf(left[0]) - [
		"advantage",
		"neutral",
		"resisted"
	].indexOf(right[0]))[0]?.[0] ?? "neutral";
	return {
		total: Math.max(0, Math.round(total)),
		effectiveness,
		...signalEffect === void 0 ? {} : { signalEffect }
	};
}
function applyBossSignalEffect(battle, effect) {
	if (effect.kind === "repair") return {
		...effect,
		amount: queueWildHealing(battle, effect.amount)
	};
	if (effect.kind === "guard") return {
		...effect,
		amount: queueWildShielding(battle, effect.amount)
	};
	activateBossAmplifier(battle, effect);
	return effect;
}
function projectedBossActionsAfterSwap(battle, beforeActions, directMaxGroup) {
	if (directMaxGroup >= 5 && battle.bossBonusActionsGranted < 2) return Math.min(5, beforeActions + 1);
	if (directMaxGroup >= 4) return beforeActions;
	return Math.max(0, beforeActions - 1);
}
function allocateBossStepDamage(rawValues, budgetValue) {
	const positiveCount = rawValues.filter((value) => value > 0).length;
	const rawTotal = rawValues.reduce((sum, value) => sum + Math.max(0, value), 0);
	if (rawTotal <= 0 || positiveCount === 0 || budgetValue <= 0) return rawValues.map(() => 0);
	const target = Math.min(rawTotal, Math.floor(budgetValue));
	if (target < positiveCount) {
		const selected = new Set(rawValues.map((value, index) => ({
			value,
			index
		})).filter((row) => row.value > 0).sort((left, right) => right.value - left.value || left.index - right.index).slice(0, target).map((row) => row.index));
		return rawValues.map((_, index) => selected.has(index) ? 1 : 0);
	}
	if (target >= rawTotal) return rawValues.map((value) => Math.max(0, value));
	let remainingTarget = target;
	let remainingWeight = rawTotal;
	let remainingPositive = positiveCount;
	return rawValues.map((rawValue) => {
		const value = Math.max(0, rawValue);
		if (value <= 0) return 0;
		remainingPositive -= 1;
		const upper = remainingTarget - remainingPositive;
		const allocated = remainingPositive === 0 ? remainingTarget : Math.max(1, Math.min(upper, Math.round(remainingTarget * value / remainingWeight)));
		remainingTarget -= allocated;
		remainingWeight -= value;
		return allocated;
	});
}
const DAMAGE_TAKEN_HANDLERS = { "damage.arm-counter": (binding, context) => {
	if (context.damage <= 0) return;
	context.member.counterPower = mechanicNumber(binding, "power") * qualityMultiplier(context.member);
} };
function applyEnemyTeamHit(battle, amount) {
	if (amount <= 0) return 0;
	const damage = damageParty(battle, amount);
	if (damage > 0) for (const member of battle.party) runMechanics(member.creatureId, "damage:taken", DAMAGE_TAKEN_HANDLERS, {
		battle,
		member,
		damage
	});
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
	const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex];
	const totalDamage = applyEnemyTeamHit(battle, battle.pendingBossDamage);
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
				queueWildShielding(battle, battle.wildMaxHp * .1);
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
	if (next.wrapped) {
		battle.round += 1;
		ageAmplifiers(battle);
	}
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
		pendingPartyHealing: 0,
		pendingPartyShielding: 0,
		partyAmplifiers: [],
		turnOwner: "player",
		activeIndex: 0,
		actionsRemaining: 3,
		bossActionsRemaining: 0,
		bossActionsTaken: 0,
		bossEnergy: input.startingBossEnergy,
		bossAttackCharge: 0,
		pendingBossDamage: 0,
		bossDamageScale: 1e3,
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
		pendingWildHealing: 0,
		pendingWildShielding: 0,
		bossAmplifiers: [],
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
	const profile = towerFloorProfile$1(floor);
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
	maybeApplyRuntimeThresholdMechanics(battle);
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
	battle.pendingBossDamage = 0;
	battle.bossDamageScale = 930 + Math.floor(boundedRandom(random) * 141);
	battle.bossBonusActionsGranted = 0;
	battle.lastBossMatch = 0;
	return "none";
}
function finishBossPhase(battle, random) {
	const targetHpBefore = battle.partyHp;
	const defeated = performBossSettlement(battle, random);
	const recovery = settleWildRecovery(battle);
	const strike = battle.lastBossAttack > 0 ? {
		actor: "boss",
		damage: battle.lastBossAttack,
		targetHpBefore,
		targetHpAfter: battle.partyHp,
		targetMaxHp: battle.partyMaxHp
	} : void 0;
	if (defeated) return {
		outcome: "battle-lost",
		...strike === void 0 ? {} : { strike },
		...recovery === void 0 ? {} : { recovery }
	};
	battle.turnOwner = "player";
	battle.bossActionsRemaining = 0;
	battle.bossActionsTaken = 0;
	battle.bossAttackCharge = 0;
	battle.pendingBossDamage = 0;
	battle.bossDamageScale = 1e3;
	battle.bossBonusActionsGranted = 0;
	if (advanceBattleStage(battle)) return {
		outcome: "battle-lost",
		...strike === void 0 ? {} : { strike },
		...recovery === void 0 ? {} : { recovery }
	};
	prepareBossIntent(battle, random);
	return {
		outcome: "none",
		...strike === void 0 ? {} : { strike },
		...recovery === void 0 ? {} : { recovery }
	};
}
function completeBattleStage(battle, random) {
	if (nextLivingIndex(battle)?.wrapped === true) {
		const recovery = settlePartyRecovery(battle);
		const targetHpBefore = battle.wildHp;
		const defeated = settleTeamStrike(battle);
		const strike = battle.lastTeamStrike > 0 ? {
			actor: "player",
			damage: battle.lastTeamDamageApplied,
			targetHpBefore,
			targetHpAfter: battle.wildHp,
			targetMaxHp: battle.wildMaxHp
		} : void 0;
		if (defeated) return {
			outcome: "wild-defeated",
			...strike === void 0 ? {} : { strike },
			...recovery === void 0 ? {} : { recovery }
		};
		if (isCaptureWindowAvailable(battle)) {
			battle.captureWindow = true;
			return {
				outcome: "none",
				...strike === void 0 ? {} : { strike },
				...recovery === void 0 ? {} : { recovery }
			};
		}
		return {
			outcome: beginBossPhase(battle, random),
			...strike === void 0 ? {} : { strike },
			...recovery === void 0 ? {} : { recovery }
		};
	}
	return { outcome: advanceBattleStage(battle) ? "battle-lost" : "none" };
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
	const completion = battle.partyHp <= 0 ? { outcome: "battle-lost" } : battle.actionsRemaining === 0 ? completeBattleStage(battle, random) : { outcome: "none" };
	if (completion.strike !== void 0) animation.strike = completion.strike;
	if (completion.recovery !== void 0) animation.recovery = completion.recovery;
	return {
		outcome: completion.outcome,
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
	const beforeActions = battle.bossActionsRemaining;
	const directMaxGroup = resolution.steps[0]?.maxGroup ?? 0;
	const projectedActions = projectedBossActionsAfterSwap(battle, beforeActions, directMaxGroup);
	const futureSwapCapacity = Math.max(0, 7 - battle.bossActionsTaken - 1);
	const expectedActionSlots = 1 + Math.min(projectedActions, futureSwapCapacity);
	const remainingPhaseBudget = Math.max(0, bossPhaseDamageCap(battle) - battle.pendingBossDamage);
	const actionBudget = Math.ceil(remainingPhaseBudget / Math.max(1, expectedActionSlots));
	const rawStepDamage = resolution.steps.map((step) => enemyDamageForStep(battle, wild.ecology, step.counts, step.chain));
	const allocatedStepDamage = allocateBossStepDamage(rawStepDamage.map((step) => step.total), actionBudget);
	let matched = 0;
	let ownColor = 0;
	for (let index = 0; index < resolution.steps.length; index += 1) {
		const step = resolution.steps[index];
		const count = TRACE_ECOLOGIES.reduce((sum, ecology) => sum + step.counts[ecology], 0);
		const combo = Math.min(2.4, 1 + .25 * (step.chain - 1));
		matched += count;
		ownColor += step.counts[wild.ecology];
		const chargeGain = count / 3 * combo;
		battle.bossAttackCharge = Math.min(32, battle.bossAttackCharge + chargeGain);
		const stepDamage = allocatedStepDamage[index] ?? 0;
		battle.pendingBossDamage = Math.min(9999999, battle.pendingBossDamage + stepDamage);
		const frame = resolution.frames[index];
		if (frame !== void 0) {
			frame.damage = stepDamage;
			frame.totalDamage = battle.pendingBossDamage;
			frame.effectiveness = rawStepDamage[index]?.effectiveness ?? "neutral";
			const rawDamage = rawStepDamage[index];
			const signalEffect = rawDamage?.signalEffect;
			if (rawDamage !== void 0 && signalEffect !== void 0) frame.signalEffect = applyBossSignalEffect(battle, signalEffect.kind === "repair" || signalEffect.kind === "guard" ? signalEffect : {
				...signalEffect,
				amount: rawDamage.total <= 0 ? 0 : Math.round(signalEffect.amount * stepDamage / rawDamage.total)
			});
		}
	}
	battle.lastBossMatch = matched;
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
	battle.bossActionsTaken += 1;
	battle.bossActionsRemaining = projectedActions;
	if (directMaxGroup >= 5 && battle.bossBonusActionsGranted < 2) {
		if (battle.bossActionsRemaining > beforeActions) battle.bossBonusActionsGranted += 1;
		appendBattleLog(battle, {
			turn: battle.turn,
			kind: "boss-action-bonus",
			amount: battle.bossActionsRemaining - beforeActions
		});
	} else if (directMaxGroup >= 4) appendBattleLog(battle, {
		turn: battle.turn,
		kind: "boss-action-refund",
		amount: beforeActions
	});
	if (battle.bossActionsTaken >= 7) battle.bossActionsRemaining = 0;
	const completion = battle.bossActionsRemaining === 0 ? finishBossPhase(battle, random) : { outcome: "none" };
	return {
		outcome: completion.outcome,
		animation: {
			kind: "match",
			battleId: battle.id,
			actor: "boss",
			swap: {
				from: swap.from,
				to: swap.to
			},
			frames: resolution.frames,
			...completion.strike === void 0 ? {} : { strike: completion.strike },
			...completion.recovery === void 0 ? {} : { recovery: completion.recovery }
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
	const completion = completeBattleStage(battle, random);
	return {
		outcome: completion.outcome,
		...completion.strike === void 0 && completion.recovery === void 0 ? {} : { animation: {
			kind: "match",
			battleId: battle.id,
			actor: "player",
			frames: [],
			...completion.strike === void 0 ? {} : { strike: completion.strike },
			...completion.recovery === void 0 ? {} : { recovery: completion.recovery }
		} }
	};
}
function skipPlayerStage(battle, random) {
	const active = battle.party[battle.activeIndex];
	if (battle.turnOwner !== "player" || battle.captureWindow || battle.actionsRemaining <= 0 || active === void 0 || battle.partyHp <= 0) throw new TraceWildRuleError("conflict");
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
function optionalMechanicNumber(binding, key, fallback) {
	const value = binding.params?.[key];
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isFinite(value)) throw new TraceWildRuleError("conflict");
	return value;
}
function skillHpBasis(binding, context) {
	switch (mechanicString(binding, "basis")) {
		case "party-max-hp": return context.battle.partyMaxHp;
		case "member-max-hp": return context.member.maxHp;
		case "member-hp": return context.member.hp;
		default: throw new TraceWildRuleError("conflict");
	}
}
function skillTargetEcology(binding, context) {
	if (mechanicString(binding, "ecology") !== "counter") return mechanicEcology(binding);
	const wild = creatureById(battleEncounterCreatureId(context.battle));
	if (wild === void 0) throw new TraceWildRuleError("conflict");
	return ecologyThatCounters(wild.ecology);
}
function resolveSkillBoard(context) {
	context.animationFrames.push(...resolveConvertedBoard(context.battle, context.random));
}
const SKILL_BEFORE_HANDLERS = { "skill.consume-overflow": (binding, context) => {
	context.scale *= 1 + context.member.overcharge * mechanicNumber(binding, "multiplierPerPoint");
	context.member.overcharge = 0;
} };
const SKILL_CAST_HANDLERS = {
	"damage.raw-hit": (binding, context) => {
		const hits = Math.max(1, Math.floor(optionalMechanicNumber(binding, "hits", 1)));
		for (let hit = 0; hit < hits; hit += 1) context.damage += applyRawHit(context.battle, context.member, mechanicNumber(binding, "power") * context.scale);
	},
	"damage.replay": (binding, context) => {
		if (mechanicString(binding, "minimum") !== "member-attack") throw new TraceWildRuleError("conflict");
		context.damage += applyWildDamage(context.battle, Math.max(memberStats(context.member).attack, context.battle.lastPlayerDamage) * mechanicNumber(binding, "factor") * context.scale);
	},
	"mark.add": (binding, context) => {
		context.battle.enemyMarks = Math.min(mechanicNumber(binding, "maximum"), context.battle.enemyMarks + mechanicNumber(binding, "amount"));
	},
	"tiles.convert": (binding, context) => {
		context.battle.board = convertRandomBattleTiles(context.battle.board, skillTargetEcology(binding, context), mechanicNumber(binding, "count"), context.random);
		if (mechanicBoolean(binding, "resolve")) resolveSkillBoard(context);
	},
	"tiles.resolve": (_binding, context) => {
		resolveSkillBoard(context);
	},
	"heal.party": (binding, context) => {
		queuePartyHealing(context.battle, skillHpBasis(binding, context) * mechanicNumber(binding, "ratio") * context.scale);
	},
	"shield.party": (binding, context) => {
		queuePartyShielding(context.battle, skillHpBasis(binding, context) * mechanicNumber(binding, "ratio") * context.scale);
	},
	"affinity.floor": (binding, context) => {
		context.battle.affinityFloorActions = Math.max(context.battle.affinityFloorActions, mechanicNumber(binding, "actions"));
	},
	"counter.arm": (binding, context) => {
		context.member.counterPower = mechanicNumber(binding, "power") * context.scale;
	},
	"burn.add": (binding, context) => {
		const amount = mechanicNumber(binding, "amount") * (mechanicBoolean(binding, "scaled") ? context.scale : 1);
		context.battle.enemyBurn = Math.min(mechanicNumber(binding, "maximum"), context.battle.enemyBurn + amount);
	},
	"armor.break": (binding, context) => {
		context.battle.wildArmor = Math.max(0, context.battle.wildArmor - mechanicNumber(binding, "amount"));
	},
	"tiles.clear": (binding, context) => {
		const resolution = resolveForcedTiles(context.battle.board, selectedIndexes(context.battle.board, mechanicEcology(binding), mechanicNumber(binding, "count")), context.random);
		context.damage += applyResolution(context.battle, resolution, context.random, false);
		context.animationFrames.push(...resolution.frames);
	},
	"tiles.guaranteed-match": (binding, context) => {
		context.battle.board = createGuaranteedMatch(context.battle.board, mechanicEcology(binding));
		if (mechanicBoolean(binding, "resolve")) resolveSkillBoard(context);
	},
	"tiles.reshuffle": (_binding, context) => {
		context.battle.board = reshuffleBattleBoard(context.battle.board, context.random);
	},
	"repeat.arm": (binding, context) => {
		const power = mechanicNumber(binding, "power") * (mechanicBoolean(binding, "scaled") ? context.scale : 1);
		context.battle.repeatPower = Math.max(context.battle.repeatPower, Math.min(mechanicNumber(binding, "maximum"), power));
	},
	"energy.party": (binding, context) => {
		const amount = mechanicNumber(binding, "amount") * (mechanicBoolean(binding, "scaled") ? context.scale : 1);
		for (const ally of livingMembers(context.battle)) grantEnergy(ally, Math.round(amount));
	},
	"enemy.delay": (binding, context) => {
		context.battle.enemyDelayed = Math.max(context.battle.enemyDelayed, mechanicNumber(binding, "actions"));
	},
	"board.lock": (binding, context) => {
		context.battle.boardLockActions = Math.max(context.battle.boardLockActions, mechanicNumber(binding, "actions"));
	},
	"shield.enemy-clear": (_binding, context) => {
		context.battle.wildShield = 0;
	},
	"runtime.self-damage": (binding, context) => {
		const amount = Math.max(1, Math.round(skillHpBasis(binding, context) * mechanicNumber(binding, "ratio")));
		context.battle.partyHp = Math.max(mechanicNumber(binding, "minimumRemaining"), context.battle.partyHp - amount);
		syncLegacyPartyHealth(context.battle);
	}
};
function castActiveSkill(state, creatureInstanceId, random) {
	const battle = state.battle;
	if (battle === void 0 || battle.turnOwner !== "player" || battle.captureWindow || battle.actionsRemaining <= 0) throw new TraceWildRuleError("conflict");
	const member = activeMember(battle);
	if (member.instanceId !== creatureInstanceId || member.skillUsedStage || member.skillSealedStages > 0) throw new TraceWildRuleError("conflict");
	const definition = skillByCreatureId(member.creatureId);
	if (definition === void 0 || member.energy < definition.energyCost) throw new TraceWildRuleError("invalid-action");
	member.energy -= definition.energyCost;
	member.skillUsedStage = true;
	const context = {
		state,
		battle,
		member,
		random,
		scale: qualityMultiplier(member),
		damage: 0,
		animationFrames: []
	};
	runMechanics(member.creatureId, "skill:before", SKILL_BEFORE_HANDLERS, context);
	runMechanics(member.creatureId, "skill:cast", SKILL_CAST_HANDLERS, context);
	battle.lastPlayerDamage = Math.max(battle.lastPlayerDamage, context.damage);
	appendBattleLog(battle, {
		turn: battle.turn,
		kind: "skill",
		amount: context.damage,
		creatureId: member.creatureId
	});
	return context.animationFrames;
}
function addCapturedCreature(state, creatureId, ecology, quality, level, now, random) {
	if (state.creatures.length >= 240) throw new TraceWildRuleError("conflict");
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
function captureChanceForBattle$1(state, quality) {
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
	const chance = captureChanceForBattle$1(state, quality);
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
	const profile = towerFloorProfile$1(battle.towerFloor);
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
function applyTraceWildAction$1(current, action, random, now = Date.now()) {
	if (action.type === "set-enabled") {
		if (current.enabled === action.enabled) return { state: current };
		const next = structuredClone(current);
		next.enabled = action.enabled;
		next.idle.lastSettlementAt = now;
		return { state: commit(next, now) };
	}
	if (!current.enabled) throw new TraceWildRuleError("conflict");
	if (action.type === "set-creature-appearance") {
		if (current.battle !== void 0) throw new TraceWildRuleError("conflict");
		const creature = current.creatures.find((row) => row.instanceId === action.creatureInstanceId);
		if (creature === void 0 || action.appearance !== "original" && action.appearance !== "evolved" || action.appearance === "evolved" && creature.level < 30) throw new TraceWildRuleError("invalid-action");
		const next = structuredClone(current);
		next.creatures.find((row) => row.instanceId === action.creatureInstanceId).appearance = action.appearance;
		return { state: commit(next, now) };
	}
	const settled = settleTraceWildIdleRewards$1(current, now, random);
	const next = structuredClone(settled);
	purgeExpiredEncounters(next, now);
	let notice;
	let animation;
	switch (action.type) {
		case "choose-starter": {
			if (next.starterChosen || !currentEngineContent().starterCreatureIds.includes(action.creatureId)) throw new TraceWildRuleError("conflict");
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
			const battleId = next.battle.id;
			const result = skipPlayerStage(next.battle, random);
			if (result.strike !== void 0 || result.recovery !== void 0) animation = {
				kind: "match",
				battleId,
				actor: "player",
				frames: [],
				...result.strike === void 0 ? {} : { strike: result.strike },
				...result.recovery === void 0 ? {} : { recovery: result.recovery }
			};
			if (result.outcome === "battle-lost") {
				logBattleDefeat(next, now, random);
				delete next.battle;
				notice = "battle-lost";
			} else if (result.outcome === "wild-defeated") notice = settleBattleVictory(next, now, random);
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
			const previousLevel = creature.level;
			creature.xp = Math.min(totalXpForLevel(100, creature.quality), creature.xp + MATERIAL_XP[action.quality] * action.count);
			creature.level = levelForXp(creature.xp, creature.quality);
			if (previousLevel < 30 && creature.level >= 30) creature.appearance = "evolved";
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
//#endregion
//#region lib/types/packages/engine/src/runtime.js
function createCodekinRuntime(content) {
	const run = (operation) => withEngineContent(content, operation);
	return Object.freeze({
		engineVersion: CODEKIN_ENGINE_VERSION,
		content,
		createInitialTraceWildState: (...args) => run(() => createInitialTraceWildState$1(...args)),
		settleTraceWildIdleRewards: (...args) => run(() => settleTraceWildIdleRewards$1(...args)),
		expireTraceWildEncounters: (...args) => run(() => expireTraceWildEncounters$1(...args)),
		applyTraceSignal: (...args) => run(() => applyTraceSignal$1(...args)),
		applyTraceWildAction: (...args) => run(() => applyTraceWildAction$1(...args)),
		captureChanceForBattle: (...args) => run(() => captureChanceForBattle$1(...args)),
		restoreTraceWildState: (...args) => run(() => restoreTraceWildState$1(...args)),
		towerFloorProfile: (...args) => run(() => towerFloorProfile$1(...args))
	});
}
//#endregion
//#region lib/types/src/composition.js
/** Builds one immutable engine/content generation for a host adapter and its renderer. */
function createCodekinComposition(packs) {
	const registry = createContentRegistry(packs, { engineVersion: CODEKIN_ENGINE_VERSION });
	const view = createContentView(registry);
	const engineContent = createEngineContent(registry);
	const runtime = createCodekinRuntime(engineContent);
	return Object.freeze({
		registry,
		view,
		engineContent,
		runtime
	});
}
//#endregion
//#region lib/types/packages/engine/src/protocol.js
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
	if (!Number.isSafeInteger(value) || value < 0 || value >= 64) throw new TypeError("invalid action");
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
		case "set-creature-appearance":
			exactKeys(row, [
				"type",
				"creatureInstanceId",
				"appearance"
			]);
			if (row.appearance !== "original" && row.appearance !== "evolved") throw new TypeError("invalid action");
			return {
				type: "set-creature-appearance",
				creatureInstanceId: safeId(row.creatureInstanceId, "pet_"),
				appearance: row.appearance
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
//#region lib/types/src/core-runtime.js
const CORE_CODEKIN_COMPOSITION = createCodekinComposition([CORE_CONTENT_PACK]);
const CORE_CONTENT_REGISTRY = CORE_CODEKIN_COMPOSITION.registry;
const CORE_CONTENT_VIEW = CORE_CODEKIN_COMPOSITION.view;
const CORE_ENGINE_CONTENT = CORE_CODEKIN_COMPOSITION.engineContent;
const CORE_CODEKIN_RUNTIME = CORE_CODEKIN_COMPOSITION.runtime;
const createInitialTraceWildState = CORE_CODEKIN_RUNTIME.createInitialTraceWildState;
const settleTraceWildIdleRewards = CORE_CODEKIN_RUNTIME.settleTraceWildIdleRewards;
const expireTraceWildEncounters = CORE_CODEKIN_RUNTIME.expireTraceWildEncounters;
const applyTraceSignal = CORE_CODEKIN_RUNTIME.applyTraceSignal;
const applyTraceWildAction = CORE_CODEKIN_RUNTIME.applyTraceWildAction;
const captureChanceForBattle = CORE_CODEKIN_RUNTIME.captureChanceForBattle;
const restoreTraceWildState = CORE_CODEKIN_RUNTIME.restoreTraceWildState;
const towerFloorProfile = CORE_CODEKIN_RUNTIME.towerFloorProfile;
//#endregion
export { MAX_CAPTURE_ATTEMPTS as $, chooseBossBattleSwap as A, currentEngineContent as At, BASE_ACTIONS_PER_CREATURE as B, towerBossStats as C, wildQualityWeights as Ct, MATCH_BOARD_SIZE as D, EngineContentError as Dt, MATCH_BOARD_CELLS as E, CODEKIN_ENGINE_VERSION as Et, hasBattleMatches as F, assertMechanicsContract as Ft, CORE_CAPTURE_POWER as G, BOSS_SKILL_ENERGY_COST as H, reshuffleBattleBoard as I, mechanicsContractIssues as It, MAX_ACTIONS_PER_CREATURE as J, MATERIAL_DROP_WEIGHTS as K, resolveBattleSwap as L, createMatchBoard as M, CODEKIN_MECHANIC_CONTRACTS as Mt, findBestBattleSwap as N, CODEKIN_MECHANIC_OPCODES as Nt, MAX_MATCH_CASCADES as O, QUALITY_SKILL_MULTIPLIERS as Ot, findFirstLegalBattleSwap as P, MechanicsContractError as Pt, MAX_BOSS_SWAPS_PER_PHASE as Q, resolveExistingBattleMatches as R, emptyTowerMaterialReward as S, wildLevelForRoster as St, towerSkillTierForFloor as T, xpToNextLevel as Tt, BOSS_SKILL_ENERGY_LIMIT as U, BASE_BOSS_ACTIONS as V, CAPTURE_HEALTH_RATIO as W, MAX_BOSS_ACTIONS as X, MAX_BONUS_ACTIONS_PER_STAGE as Y, MAX_BOSS_BONUS_ACTIONS as Z, ECOLOGY_ADVANTAGE as _, qualityIndex as _t, CORE_ENGINE_CONTENT as a, QUALITY_ORDER as at, resolveCreatureAppearance as b, totalXpForLevel as bt, captureChanceForBattle as c, activeMinuteBand as ct, restoreTraceWildState as d, effectivePartyLevel as dt, MAX_MAP_ENCOUNTERS as et, settleTraceWildIdleRewards as f, encounterLifetimeMs as ft, createCodekinRuntime as g, playerStats as gt, createCodekinComposition as h, playerLevelFactor as ht, CORE_CONTENT_VIEW as i, PLAYER_QUALITY_MULTIPLIERS as it, convertRandomBattleTiles as j, withEngineContent as jt, areAdjacentTiles as k, createEngineContent as kt, createInitialTraceWildState as l, captureChance as lt, normalizeTraceWildAction as m, levelForXp as mt, CORE_CODEKIN_RUNTIME as n, PLAYER_QUALITY_BASE_MULTIPLIERS as nt, applyTraceSignal as o, WILD_QUALITY_RESISTANCE as ot, towerFloorProfile as p, idleRewardTier as pt, MATERIAL_XP as q, CORE_CONTENT_REGISTRY as r, PLAYER_QUALITY_GROWTH_BONUSES as rt, applyTraceWildAction as s, XP_QUALITY_MULTIPLIERS as st, CORE_CODEKIN_COMPOSITION as t, MAX_PLAYER_LEVEL as tt, expireTraceWildEncounters as u, coreQualityWeights as ut, TraceWildRuleError as v, sessionLevel as vt, towerQualityForFloor as w, wildStats as wt, MAX_TOWER_FLOOR as x, wildLevelFor as xt, CREATURE_EVOLUTION_LEVEL as y, threatPoints as yt, resolveForcedTiles as z };

//# sourceMappingURL=core-runtime-DRPQ-nd3.js.map