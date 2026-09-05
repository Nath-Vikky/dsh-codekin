window.__ModuleLoader__.load({
	id: "@nath-vikky/dsh-codekin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region lib/types/packages/content-sdk/src/types.js
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
		Object.freeze({
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
		Object.freeze([
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
		Object.freeze([
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
		Object.freeze([
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
		Object.freeze({
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
		Object.freeze([
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
		Object.freeze({
			pebble: 1,
			pulse: 1.12,
			prism: 1.28,
			nova: 1.48,
			origin: 1.75
		});
		Object.freeze({
			pebble: 1,
			pulse: 1.04,
			prism: 1.09,
			nova: 1.15,
			origin: 1.23
		});
		Object.freeze({
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
		Object.freeze([
			0,
			1,
			3,
			6,
			10
		]);
		Object.freeze([
			6,
			8,
			11,
			14,
			18
		]);
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
		function captureChance(input) {
			const ratio = Number.isFinite(input.healthRatio) ? Math.min(1, Math.max(0, input.healthRatio)) : 1;
			const hpPressure = .3 + 1.7 * Math.pow(1 - ratio, 1.65);
			const delta = Math.min(100, Math.max(-100, input.partyAverageLevel - input.wildLevel));
			const levelBalance = Math.min(1.15, Math.max(.72, Math.exp(delta / 65)));
			const mercy = Math.min(1.24, 1 + .12 * Math.min(2, Math.max(0, Math.floor(input.priorFailures))));
			const score = Math.max(0, input.baseCaptureRate) * hpPressure * CORE_CAPTURE_POWER[input.coreQuality] * WILD_QUALITY_RESISTANCE[input.wildQuality] * levelBalance * mercy;
			return Math.min(SPECIES_CAPTURE_CAP[input.rarity], Math.max(.02, 1 - Math.exp(-score)));
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
		//#endregion
		//#region lib/types/packages/renderer-react/src/content.js
		const CONTENT_API_PREFIX = "/api/tracewild";
		const SAFE_ASSET_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/u;
		const CONTENT_VIEW_FIELDS = Object.freeze([
			"contentApi",
			"id",
			"packs",
			"ecologies",
			"qualities",
			"creatures",
			"skills",
			"starters",
			"towerRotation",
			"assets"
		]);
		function record(value) {
			if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError("invalid content view");
			return value;
		}
		function text(value, maximum = 160) {
			if (typeof value !== "string" || value.length < 1 || value.length > maximum) throw new TypeError("invalid content view");
			return value;
		}
		function rows(value, maximum) {
			if (!Array.isArray(value) || value.length > maximum) throw new TypeError("invalid content view");
			return value;
		}
		function exactFields(value, fields) {
			if (Object.keys(value).length !== fields.length || fields.some((field) => !(field in value))) throw new TypeError("invalid content view");
		}
		function deepFreeze(value) {
			if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value;
			for (const child of Object.values(value)) deepFreeze(child);
			return Object.freeze(value);
		}
		/** Treats Host content as untrusted JSON before it reaches React or asset URLs. */
		function parseCodekinContentView(value) {
			const root = record(value);
			exactFields(root, CONTENT_VIEW_FIELDS);
			if (root.contentApi !== 1) throw new TypeError("unsupported content API");
			text(root.id, 512);
			const packs = rows(root.packs, 64);
			const ecologies = rows(root.ecologies, 32);
			const qualities = rows(root.qualities, 32);
			const creatures = rows(root.creatures, 2048);
			const skills = rows(root.skills, 2048);
			const starters = rows(root.starters, 64);
			const towerRotation = rows(root.towerRotation, 4096);
			const assets = rows(root.assets, 4096);
			const ecologyIds = /* @__PURE__ */ new Set();
			const qualityIds = /* @__PURE__ */ new Set();
			const creatureIds = /* @__PURE__ */ new Set();
			const packIds = /* @__PURE__ */ new Set();
			const creatureSprites = /* @__PURE__ */ new Map();
			for (const valuePack of packs) {
				const pack = record(valuePack);
				const id = text(pack.id, 128);
				if (packIds.has(id)) throw new TypeError("invalid content view");
				packIds.add(id);
				text(pack.version, 80);
			}
			for (const valueEcology of ecologies) {
				const ecology = record(valueEcology);
				const id = text(ecology.id, 128);
				if (!TRACE_ECOLOGIES.includes(id) || ecologyIds.has(id)) throw new TypeError("invalid content view");
				ecologyIds.add(id);
				const name = record(ecology.name);
				text(name.zhCN);
				text(name.en);
				if (!Number.isSafeInteger(ecology.order) || ![
					"sync",
					"overclock",
					"guard",
					"repair",
					"breach"
				].includes(String(ecology.tileRole))) throw new TypeError("invalid content view");
			}
			for (const valueQuality of qualities) {
				const quality = record(valueQuality);
				const id = text(quality.id, 128);
				if (!CAPTURE_CORE_QUALITIES.includes(id) || qualityIds.has(id)) throw new TypeError("invalid content view");
				qualityIds.add(id);
				const name = record(quality.name);
				text(name.zhCN);
				text(name.en);
				if (!Number.isSafeInteger(quality.order)) throw new TypeError("invalid content view");
			}
			for (const valueCreature of creatures) {
				const creature = record(valueCreature);
				const id = text(creature.id, 128);
				if (creatureIds.has(id) || !Number.isSafeInteger(creature.number)) throw new TypeError("invalid content view");
				creatureIds.add(id);
				const name = record(creature.name);
				text(name.zhCN);
				text(name.en);
				if (!ecologyIds.has(String(creature.ecology)) || ![
					"common",
					"uncommon",
					"rare",
					"apex"
				].includes(String(creature.rarity))) throw new TypeError("invalid content view");
				text(creature.combatRole, 80);
				text(creature.signatureProtocol, 128);
				creatureSprites.set(id, text(creature.sprite, 128));
				if (typeof creature.baseCaptureRate !== "number" || creature.baseCaptureRate <= 0 || creature.baseCaptureRate > 1) throw new TypeError("invalid content view");
				const stats = record(creature.stats);
				for (const key of [
					"hp",
					"attack",
					"defense",
					"speed"
				]) if (!Number.isSafeInteger(stats[key]) || stats[key] < 1 || stats[key] > 999999999) throw new TypeError("invalid content view");
			}
			const skillIds = /* @__PURE__ */ new Set();
			for (const valueSkill of skills) {
				const skill = record(valueSkill);
				const creatureId = text(skill.creatureId, 128);
				if (!creatureIds.has(creatureId) || skillIds.has(creatureId) || !Number.isSafeInteger(skill.energyCost) || skill.energyCost < 0) throw new TypeError("invalid content view");
				skillIds.add(creatureId);
				for (const side of [record(skill.passive), record(skill.active)]) for (const field of [record(side.name), record(side.description)]) {
					text(field.zhCN);
					text(field.en);
				}
			}
			if ([...creatureIds].some((id) => !skillIds.has(id))) throw new TypeError("invalid content view");
			for (const id of [...starters, ...towerRotation]) if (typeof id !== "string" || !creatureIds.has(id)) throw new TypeError("invalid content view");
			const assetKeys = /* @__PURE__ */ new Set();
			const assetKinds = /* @__PURE__ */ new Map();
			for (const valueAsset of assets) {
				const asset = record(valueAsset);
				const key = text(asset.key, 128);
				const path = text(asset.path, 240);
				if (assetKeys.has(key) || !SAFE_ASSET_PATH.test(path) || asset.mime !== "image/png" && asset.mime !== "image/webp" || asset.kind !== "launcher" && asset.kind !== "creature") throw new TypeError("invalid content view");
				assetKeys.add(key);
				assetKinds.set(key, String(asset.kind));
			}
			for (const sprite of creatureSprites.values()) if (assetKinds.get(sprite) !== "creature") throw new TypeError("invalid content view");
			return deepFreeze(structuredClone(root));
		}
		let activeView;
		let activeCreatures = [];
		let activeCreatureMap = /* @__PURE__ */ new Map();
		let activeSkillMap = /* @__PURE__ */ new Map();
		let activeAssetMap = /* @__PURE__ */ new Map();
		function activateCodekinContent(value) {
			const view = parseCodekinContentView(value);
			const creatures = view.creatures.map((row) => Object.freeze({
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
			}));
			const skills = view.skills.map((row) => Object.freeze({
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
			}));
			activeView = view;
			activeCreatures = Object.freeze(creatures);
			activeCreatureMap = new Map(creatures.map((row) => [row.id, row]));
			activeSkillMap = new Map(skills.map((row) => [row.creatureId, row]));
			activeAssetMap = new Map(view.assets.map((asset) => [asset.key, `${CONTENT_API_PREFIX}/assets/${asset.path.split("/").map(encodeURIComponent).join("/")}?content=${encodeURIComponent(view.id)}`]));
		}
		function creatureCatalog() {
			return activeCreatures;
		}
		function creatureById(id) {
			return activeCreatureMap.get(id);
		}
		function skillByCreatureId(id) {
			return activeSkillMap.get(id);
		}
		function starterCreatureIds() {
			return activeView?.starters ?? [];
		}
		function contentAssetUrl(key) {
			return activeAssetMap.get(key);
		}
		const MAX_CONTENT_TOWER_FLOOR = 999999;
		function contentTowerFloorProfile(floorValue) {
			if (!Number.isSafeInteger(floorValue) || floorValue < 1 || floorValue > 999999) throw new TypeError("invalid tower floor");
			const rotation = activeView?.towerRotation ?? [];
			const creatureId = rotation[(floorValue - 1) % rotation.length];
			if (creatureId === void 0) throw new TypeError("content unavailable");
			const skillTier = floorValue >= 80 ? 5 : floorValue >= 50 ? 4 : floorValue >= 25 ? 3 : floorValue >= 10 ? 2 : 1;
			return {
				floor: floorValue,
				creatureId,
				level: Math.min(9999, floorValue + 1),
				quality: CAPTURE_CORE_QUALITIES[skillTier - 1],
				skillTier,
				baseMaterialDrops: Math.min(8, skillTier + Math.floor((floorValue - 1) / 100)),
				milestoneMaterial: floorValue % 10 === 0
			};
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/bridge.js
		const API = "/api/tracewild";
		const TRACEWILD_SETTINGS_CHANGED_EVENT = "dsh-codekin:settings-changed";
		const TRACEWILD_SETTINGS_CHANNEL = "dsh-codekin-settings-v1";
		function notifyTraceWildSettingsChanged() {
			if (typeof window === "undefined") return;
			window.dispatchEvent(new Event(TRACEWILD_SETTINGS_CHANGED_EVENT));
			if (typeof BroadcastChannel === "undefined") return;
			const channel = new BroadcastChannel(TRACEWILD_SETTINGS_CHANNEL);
			channel.postMessage(null);
			channel.close();
		}
		function subscribeTraceWildSettingsChanged(listener) {
			if (typeof window === "undefined") return () => {};
			window.addEventListener(TRACEWILD_SETTINGS_CHANGED_EVENT, listener);
			const channel = typeof BroadcastChannel === "undefined" ? void 0 : new BroadcastChannel(TRACEWILD_SETTINGS_CHANNEL);
			channel?.addEventListener("message", listener);
			return () => {
				window.removeEventListener(TRACEWILD_SETTINGS_CHANGED_EVENT, listener);
				channel?.removeEventListener("message", listener);
				channel?.close();
			};
		}
		var TraceWildConnectionError = class extends Error {
			code;
			constructor(code) {
				super(code);
				this.code = code;
			}
		};
		const TILE_SPECIALS = [
			"none",
			"row",
			"column",
			"burst",
			"origin"
		];
		const MATCH_SIGNAL_EFFECTS = [
			"repair",
			"guard",
			"sync",
			"overclock",
			"breach"
		];
		function plainRecord(value) {
			if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError("invalid animation");
			return value;
		}
		function matchTile(value) {
			const row = plainRecord(value);
			const keys = Object.keys(row);
			if (keys.length < 2 || keys.length > 4 || !("ecology" in row) || !("special" in row) || keys.some((key) => key !== "ecology" && key !== "special" && key !== "lockedActions" && key !== "hazardActions") || !TRACE_ECOLOGIES.includes(row.ecology) || !TILE_SPECIALS.includes(row.special)) throw new TypeError("invalid animation");
			if (row.lockedActions !== void 0 && (!Number.isSafeInteger(row.lockedActions) || row.lockedActions < 1 || row.lockedActions > 2)) throw new TypeError("invalid animation");
			if (row.hazardActions !== void 0 && (!Number.isSafeInteger(row.hazardActions) || row.hazardActions < 1 || row.hazardActions > 3)) throw new TypeError("invalid animation");
			return {
				ecology: row.ecology,
				special: row.special,
				...row.lockedActions === void 0 ? {} : { lockedActions: row.lockedActions },
				...row.hazardActions === void 0 ? {} : { hazardActions: row.hazardActions }
			};
		}
		function matchBoard(value) {
			if (!Array.isArray(value) || value.length !== 64) throw new TypeError("invalid animation");
			return value.map(matchTile);
		}
		function battleAnimation(value) {
			const row = plainRecord(value);
			if (row.kind !== "match" || typeof row.battleId !== "string" || row.battleId.length < 3 || row.battleId.length > 96 || !Array.isArray(row.frames) || row.frames.length > 12 || row.frames.length === 0 && row.strike === void 0 && row.recovery === void 0) throw new TypeError("invalid animation");
			const frames = row.frames.map((value, frameIndex) => {
				const frame = plainRecord(value);
				if (frame.chain !== frameIndex + 1 || !Array.isArray(frame.removed) || frame.removed.length < 1 || frame.removed.length > 64 || !Array.isArray(frame.fallRows) || frame.fallRows.length !== 64) throw new TypeError("invalid animation");
				const removed = frame.removed.map((index) => {
					if (!Number.isSafeInteger(index) || index < 0 || index >= 64) throw new TypeError("invalid animation");
					return index;
				});
				if (new Set(removed).size !== removed.length) throw new TypeError("invalid animation");
				const fallRows = frame.fallRows.map((distance) => {
					if (!Number.isSafeInteger(distance) || distance < 0 || distance > 8) throw new TypeError("invalid animation");
					return distance;
				});
				const hasDamage = frame.damage !== void 0 || frame.totalDamage !== void 0 || frame.effectiveness !== void 0;
				if (hasDamage && (!Number.isSafeInteger(frame.damage) || frame.damage < 0 || frame.damage > 9999999 || !Number.isSafeInteger(frame.totalDamage) || frame.totalDamage < 0 || frame.totalDamage > 9999999 || frame.effectiveness !== "advantage" && frame.effectiveness !== "neutral" && frame.effectiveness !== "resisted")) throw new TypeError("invalid animation");
				if (frame.hazardDamage !== void 0 && (!Number.isSafeInteger(frame.hazardDamage) || frame.hazardDamage < 1 || frame.hazardDamage > 9999999)) throw new TypeError("invalid animation");
				let signalEffect;
				if (frame.signalEffect !== void 0) {
					const rawEffect = plainRecord(frame.signalEffect);
					const effectKeys = Object.keys(rawEffect);
					if (effectKeys.length !== 3 || effectKeys.some((key) => key !== "kind" && key !== "ecology" && key !== "amount") || !MATCH_SIGNAL_EFFECTS.includes(rawEffect.kind) || !TRACE_ECOLOGIES.includes(rawEffect.ecology) || !Number.isSafeInteger(rawEffect.amount) || rawEffect.amount < 0 || rawEffect.amount > 9999999) throw new TypeError("invalid animation");
					signalEffect = {
						kind: rawEffect.kind,
						ecology: rawEffect.ecology,
						amount: rawEffect.amount
					};
				}
				return {
					chain: frame.chain,
					before: matchBoard(frame.before),
					after: matchBoard(frame.after),
					removed,
					fallRows,
					...hasDamage ? {
						damage: frame.damage,
						totalDamage: frame.totalDamage,
						effectiveness: frame.effectiveness
					} : {},
					...signalEffect === void 0 ? {} : { signalEffect },
					...frame.hazardDamage === void 0 ? {} : { hazardDamage: frame.hazardDamage }
				};
			});
			if (row.actor !== void 0 && row.actor !== "player" && row.actor !== "boss") throw new TypeError("invalid animation");
			let strike;
			if (row.strike !== void 0) {
				const rawStrike = plainRecord(row.strike);
				const strikeKeys = Object.keys(rawStrike);
				if (strikeKeys.length !== 5 || strikeKeys.some((key) => key !== "actor" && key !== "damage" && key !== "targetHpBefore" && key !== "targetHpAfter" && key !== "targetMaxHp") || rawStrike.actor !== "player" && rawStrike.actor !== "boss" || row.actor !== void 0 && rawStrike.actor !== row.actor || !Number.isSafeInteger(rawStrike.damage) || rawStrike.damage < 1 || rawStrike.damage > 9999999 || !Number.isSafeInteger(rawStrike.targetMaxHp) || rawStrike.targetMaxHp < 1 || rawStrike.targetMaxHp > 9999999 || !Number.isSafeInteger(rawStrike.targetHpBefore) || rawStrike.targetHpBefore < 0 || rawStrike.targetHpBefore > rawStrike.targetMaxHp || !Number.isSafeInteger(rawStrike.targetHpAfter) || rawStrike.targetHpAfter < 0 || rawStrike.targetHpAfter > rawStrike.targetHpBefore) throw new TypeError("invalid animation");
				strike = {
					actor: rawStrike.actor,
					damage: rawStrike.damage,
					targetHpBefore: rawStrike.targetHpBefore,
					targetHpAfter: rawStrike.targetHpAfter,
					targetMaxHp: rawStrike.targetMaxHp
				};
			}
			let recovery;
			if (row.recovery !== void 0) {
				const rawRecovery = plainRecord(row.recovery);
				const recoveryKeys = Object.keys(rawRecovery);
				if (recoveryKeys.length !== 8 || recoveryKeys.some((key) => key !== "actor" && key !== "healing" && key !== "shielding" && key !== "targetHpBefore" && key !== "targetHpAfter" && key !== "targetMaxHp" && key !== "targetShieldBefore" && key !== "targetShieldAfter") || rawRecovery.actor !== "player" && rawRecovery.actor !== "boss" || row.actor !== void 0 && rawRecovery.actor !== row.actor || !Number.isSafeInteger(rawRecovery.healing) || rawRecovery.healing < 0 || rawRecovery.healing > 9999999 || !Number.isSafeInteger(rawRecovery.shielding) || rawRecovery.shielding < 0 || rawRecovery.shielding > 9999999 || rawRecovery.healing === 0 && rawRecovery.shielding === 0 || !Number.isSafeInteger(rawRecovery.targetMaxHp) || rawRecovery.targetMaxHp < 1 || rawRecovery.targetMaxHp > 9999999 || !Number.isSafeInteger(rawRecovery.targetHpBefore) || rawRecovery.targetHpBefore < 0 || !Number.isSafeInteger(rawRecovery.targetHpAfter) || rawRecovery.targetHpAfter < rawRecovery.targetHpBefore || rawRecovery.targetHpAfter > rawRecovery.targetMaxHp || !Number.isSafeInteger(rawRecovery.targetShieldBefore) || rawRecovery.targetShieldBefore < 0 || !Number.isSafeInteger(rawRecovery.targetShieldAfter) || rawRecovery.targetShieldAfter < rawRecovery.targetShieldBefore || rawRecovery.targetShieldAfter > 9999999) throw new TypeError("invalid animation");
				recovery = {
					actor: rawRecovery.actor,
					healing: rawRecovery.healing,
					shielding: rawRecovery.shielding,
					targetHpBefore: rawRecovery.targetHpBefore,
					targetHpAfter: rawRecovery.targetHpAfter,
					targetMaxHp: rawRecovery.targetMaxHp,
					targetShieldBefore: rawRecovery.targetShieldBefore,
					targetShieldAfter: rawRecovery.targetShieldAfter
				};
			}
			let swap;
			if (row.swap !== void 0) {
				const rawSwap = plainRecord(row.swap);
				if (!Number.isSafeInteger(rawSwap.from) || !Number.isSafeInteger(rawSwap.to) || !areAdjacentTiles(rawSwap.from, rawSwap.to)) throw new TypeError("invalid animation");
				swap = {
					from: rawSwap.from,
					to: rawSwap.to
				};
			}
			return {
				kind: "match",
				battleId: row.battleId,
				frames,
				...row.actor === void 0 ? {} : { actor: row.actor },
				...swap === void 0 ? {} : { swap },
				...strike === void 0 ? {} : { strike },
				...recovery === void 0 ? {} : { recovery }
			};
		}
		function snapshot(value) {
			if (typeof value !== "object" || value === null) throw new TypeError("invalid snapshot");
			const row = value;
			if (row.schemaVersion !== 3 || typeof row.serverTime !== "number" || typeof row.state !== "object" || row.state === null || row.state.schemaVersion !== 3 || typeof row.state.enabled !== "boolean" || !Array.isArray(row.state.creatures) || !Array.isArray(row.state.encounters) || !Array.isArray(row.state.dex) || !Array.isArray(row.state.squad)) throw new TypeError("invalid snapshot");
			if (row.state.battle !== void 0) matchBoard(row.state.battle.board);
			return structuredClone(row);
		}
		function createTraceWildConnection() {
			return {
				async loadContent(signal) {
					const response = await fetch(`${API}/content`, {
						method: "GET",
						credentials: "same-origin",
						cache: "no-store",
						...signal === void 0 ? {} : { signal }
					});
					if (!response.ok) throw new TraceWildConnectionError("unavailable");
					return parseCodekinContentView(await response.json());
				},
				async load(signal) {
					const response = await fetch(`${API}/state`, {
						method: "GET",
						credentials: "same-origin",
						cache: "no-store",
						...signal === void 0 ? {} : { signal }
					});
					if (!response.ok) throw new TraceWildConnectionError("unavailable");
					return snapshot(await response.json());
				},
				async act(action, signal) {
					const response = await fetch(`${API}/action`, {
						method: "POST",
						credentials: "same-origin",
						cache: "no-store",
						headers: { "content-type": "application/json" },
						body: JSON.stringify(action),
						...signal === void 0 ? {} : { signal }
					});
					if (!response.ok) {
						let code = response.status === 409 ? "conflict" : response.status >= 500 ? "unavailable" : "invalid-action";
						try {
							const failure = await response.json();
							if (failure.error === "invalid-action" || failure.error === "conflict" || failure.error === "unavailable") code = failure.error;
						} catch {}
						throw new TraceWildConnectionError(code);
					}
					const raw = await response.json();
					const parsed = snapshot(raw);
					const row = raw;
					if (row.ok !== true) throw new Error("action unavailable");
					return {
						ok: true,
						...parsed,
						...row.notice === void 0 ? {} : { notice: row.notice },
						...row.animation === void 0 ? {} : { animation: battleAnimation(row.animation) }
					};
				},
				async clearLocalData(signal) {
					const response = await fetch(`${API}/save`, {
						method: "DELETE",
						credentials: "same-origin",
						cache: "no-store",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ confirmation: "delete-codekin-save" }),
						...signal === void 0 ? {} : { signal }
					});
					if (!response.ok) throw new TraceWildConnectionError(response.status >= 500 ? "unavailable" : "invalid-action");
					const raw = await response.json();
					const parsed = snapshot(raw);
					if (raw.ok !== true) throw new TraceWildConnectionError("unavailable");
					return {
						ok: true,
						...parsed
					};
				},
				subscribe(onSnapshot, onStatus) {
					const source = new EventSource(`${API}/events`, { withCredentials: true });
					source.onopen = () => {
						onStatus(true);
					};
					source.onerror = () => {
						onStatus(false);
					};
					source.onmessage = (event) => {
						try {
							onSnapshot(snapshot(JSON.parse(event.data)));
							onStatus(true);
						} catch {
							onStatus(false);
						}
					};
					return () => {
						source.close();
					};
				}
			};
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/battle-motion.js
		/** Visual travel and reading time are separate: reduced motion keeps the latter. */
		const BATTLE_MOTION = {
			swap: 140,
			return: 200,
			clear: 300,
			fallBase: 220,
			fallPerRow: 54,
			fallStagger: 12,
			chainPause: 140,
			flight: 800,
			impact: 550,
			enemyPause: 1200,
			protocol: 1e3,
			handoff: 600
		};
		function tileFallTime(distance, column = 0) {
			return distance > 0 ? BATTLE_MOTION.fallBase + distance * BATTLE_MOTION.fallPerRow + column * BATTLE_MOTION.fallStagger : 0;
		}
		function cascadeFallTime(rows, boardSize) {
			return Math.max(0, ...rows.map((distance, index) => tileFallTime(distance, index % boardSize)));
		}
		/** Appearance never participates in combat stats, growth, or rewards. */
		function resolveCreatureAppearance(creature) {
			return creature.level >= 30 && creature.appearance !== "original" ? "evolved" : "original";
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/appearance-presentation.js
		const APPEARANCE_MOTION = {
			evolution: 1400,
			change: 380
		};
		function resolveCreatureSprite(creatureId, look = { level: 1 }) {
			const original = contentAssetUrl(`creature:${creatureId}:sprite`);
			const appearance = resolveCreatureAppearance(look);
			const evolved = appearance === "evolved" ? contentAssetUrl(`creature:${creatureId}:evolved`) : void 0;
			return {
				source: evolved ?? original,
				fallback: original,
				appearance: evolved === void 0 ? "original" : appearance
			};
		}
		function appearanceTransition(previous, next) {
			if (previous.identity !== next.identity || previous.source === next.source) return "none";
			return previous.level < 30 && next.level >= 30 && next.appearance === "evolved" ? "evolution" : "change";
		}
		/** Decode before swapping a visible portrait, retaining the old image on failure. */
		async function decodeCreatureImage(source) {
			const picture = new Image();
			picture.decoding = "async";
			const loaded = new Promise((resolve) => {
				picture.onload = () => {
					resolve(true);
				};
				picture.onerror = () => {
					resolve(false);
				};
			});
			picture.src = source;
			if (typeof picture.decode === "function") try {
				await picture.decode();
				return true;
			} catch {
				return false;
			}
			return loaded;
		}
		const tagId = "@nath-vikky/dsh-codekin/tracewild.module.css";
		var tracewild_module_css_default = {
			"actionDotActive": "dCfysG_actionDotActive",
			"actionDots": "dCfysG_actionDots",
			"ambientOrb": "dCfysG_ambientOrb",
			"badge": "dCfysG_badge",
			"battleBackdrop": "dCfysG_battleBackdrop",
			"battleHeader": "dCfysG_battleHeader",
			"battleHoverDetail": "dCfysG_battleHoverDetail",
			"battleHoverTrigger": "dCfysG_battleHoverTrigger",
			"battlePanel": "dCfysG_battlePanel",
			"battleResultIn": "dCfysG_battleResultIn",
			"battleTransition": "dCfysG_battleTransition",
			"battleTransitionCapture": "dCfysG_battleTransitionCapture",
			"battleTransitionFailed": "dCfysG_battleTransitionFailed",
			"battleWindowActions": "dCfysG_battleWindowActions",
			"bigCore": "dCfysG_bigCore",
			"boardColumn": "dCfysG_boardColumn",
			"boardHelp": "dCfysG_boardHelp",
			"boardRow": "dCfysG_boardRow",
			"boardStage": "dCfysG_boardStage",
			"brand": "dCfysG_brand",
			"captureBoardEnter": "dCfysG_captureBoardEnter",
			"captureBoardIntro": "dCfysG_captureBoardIntro",
			"captureBoardOverlay": "dCfysG_captureBoardOverlay",
			"captureCoreBreathe": "dCfysG_captureCoreBreathe",
			"captureCoreGrid": "dCfysG_captureCoreGrid",
			"captureTitlePulse": "dCfysG_captureTitlePulse",
			"cascadeIn": "dCfysG_cascadeIn",
			"cascadePill": "dCfysG_cascadePill",
			"centerMessage": "dCfysG_centerMessage",
			"codekinBasics": "dCfysG_codekinBasics",
			"codekinCard": "dCfysG_codekinCard",
			"codekinDeployed": "dCfysG_codekinDeployed",
			"codekinDeployment": "dCfysG_codekinDeployment",
			"codekinDetailBackdrop": "dCfysG_codekinDetailBackdrop",
			"codekinDetailClose": "dCfysG_codekinDetailClose",
			"codekinDetailFooter": "dCfysG_codekinDetailFooter",
			"codekinDetailHero": "dCfysG_codekinDetailHero",
			"codekinDetailModal": "dCfysG_codekinDetailModal",
			"codekinDetailSection": "dCfysG_codekinDetailSection",
			"codekinDetailStats": "dCfysG_codekinDetailStats",
			"codekinDetailTags": "dCfysG_codekinDetailTags",
			"codekinEditMode": "dCfysG_codekinEditMode",
			"codekinGrowth": "dCfysG_codekinGrowth",
			"codekinGrowthActions": "dCfysG_codekinGrowthActions",
			"codekinNumber": "dCfysG_codekinNumber",
			"codekinProtocols": "dCfysG_codekinProtocols",
			"codekinReleaseFromDetail": "dCfysG_codekinReleaseFromDetail",
			"codekinSelectionLocked": "dCfysG_codekinSelectionLocked",
			"combatModifierIcon": "dCfysG_combatModifierIcon",
			"confirmPanel": "dCfysG_confirmPanel",
			"connectionBanner": "dCfysG_connectionBanner",
			"content": "dCfysG_content",
			"coreCard": "dCfysG_coreCard",
			"coreGrid": "dCfysG_coreGrid",
			"core_nova": "dCfysG_core_nova",
			"core_origin": "dCfysG_core_origin",
			"core_pebble": "dCfysG_core_pebble",
			"core_prism": "dCfysG_core_prism",
			"core_pulse": "dCfysG_core_pulse",
			"creatureCard": "dCfysG_creatureCard",
			"creatureCards": "dCfysG_creatureCards",
			"creatureSelect": "dCfysG_creatureSelect",
			"creatureSelected": "dCfysG_creatureSelected",
			"creatureStats": "dCfysG_creatureStats",
			"damage_advantage": "dCfysG_damage_advantage",
			"damage_neutral": "dCfysG_damage_neutral",
			"damage_resisted": "dCfysG_damage_resisted",
			"dexCard": "dCfysG_dexCard",
			"dexCaught": "dCfysG_dexCaught",
			"dexGrid": "dCfysG_dexGrid",
			"dexNumber": "dCfysG_dexNumber",
			"dexSeen": "dCfysG_dexSeen",
			"discardButton": "dCfysG_discardButton",
			"dragHandle": "dCfysG_dragHandle",
			"ecologyPip": "dCfysG_ecologyPip",
			"exchangeBack": "dCfysG_exchangeBack",
			"exchangeOut": "dCfysG_exchangeOut",
			"flee": "dCfysG_flee",
			"footer": "dCfysG_footer",
			"growthXpTrack": "dCfysG_growthXpTrack",
			"hazardMark": "dCfysG_hazardMark",
			"hazardPulse": "dCfysG_hazardPulse",
			"header": "dCfysG_header",
			"headerStats": "dCfysG_headerStats",
			"healingBudgetIn": "dCfysG_healingBudgetIn",
			"healingValueIn": "dCfysG_healingValueIn",
			"hpBar": "dCfysG_hpBar",
			"hpHealingBudget": "dCfysG_hpHealingBudget",
			"hpHealingSettling": "dCfysG_hpHealingSettling",
			"hpHealingValue": "dCfysG_hpHealingValue",
			"hpShieldActive": "dCfysG_hpShieldActive",
			"hpShieldBar": "dCfysG_hpShieldBar",
			"hpShieldPulse": "dCfysG_hpShieldPulse",
			"hpTeam": "dCfysG_hpTeam",
			"idleClaimButton": "dCfysG_idleClaimButton",
			"idleClaimFloating": "dCfysG_idleClaimFloating",
			"idleClaimPulse": "dCfysG_idleClaimPulse",
			"idleClaimTooltip": "dCfysG_idleClaimTooltip",
			"idleFloat": "dCfysG_idleFloat",
			"idleReward": "dCfysG_idleReward",
			"inventoryLayout": "dCfysG_inventoryLayout",
			"inventoryPanel": "dCfysG_inventoryPanel",
			"itemInspectable": "dCfysG_itemInspectable",
			"itemTooltip": "dCfysG_itemTooltip",
			"launcher": "dCfysG_launcher",
			"launcherAvatar": "dCfysG_launcherAvatar",
			"launcherDragging": "dCfysG_launcherDragging",
			"launcherGift": "dCfysG_launcherGift",
			"launcherGiftBob": "dCfysG_launcherGiftBob",
			"launcherGiftGlow": "dCfysG_launcherGiftGlow",
			"launcherPulse": "dCfysG_launcherPulse",
			"launcherReward": "dCfysG_launcherReward",
			"levelPulse": "dCfysG_levelPulse",
			"loadingMark": "dCfysG_loadingMark",
			"logPanel": "dCfysG_logPanel",
			"logoCore": "dCfysG_logoCore",
			"matchBattleLayout": "dCfysG_matchBattleLayout",
			"matchBoard": "dCfysG_matchBoard",
			"matchTile": "dCfysG_matchTile",
			"matchTileClearing": "dCfysG_matchTileClearing",
			"matchTileDragging": "dCfysG_matchTileDragging",
			"matchTileFalling": "dCfysG_matchTileFalling",
			"matchTileHazard": "dCfysG_matchTileHazard",
			"matchTileLocked": "dCfysG_matchTileLocked",
			"matchTileSelected": "dCfysG_matchTileSelected",
			"matchTileSpecial": "dCfysG_matchTileSpecial",
			"materialCard": "dCfysG_materialCard",
			"materialShard": "dCfysG_materialShard",
			"materialXp": "dCfysG_materialXp",
			"miniCore": "dCfysG_miniCore",
			"modalBackdrop": "dCfysG_modalBackdrop",
			"modifierAttack": "dCfysG_modifierAttack",
			"modifierPierce": "dCfysG_modifierPierce",
			"motionParticle": "dCfysG_motionParticle",
			"motionToggle": "dCfysG_motionToggle",
			"offline": "dCfysG_offline",
			"online": "dCfysG_online",
			"overlay": "dCfysG_overlay",
			"overlayDockedRight": "dCfysG_overlayDockedRight",
			"overlayDragging": "dCfysG_overlayDragging",
			"pageHeading": "dCfysG_pageHeading",
			"panelPage": "dCfysG_panelPage",
			"particleLayer": "dCfysG_particleLayer",
			"partyColumn": "dCfysG_partyColumn",
			"partyIndex": "dCfysG_partyIndex",
			"pip_aegis": "dCfysG_pip_aegis",
			"pip_forge": "dCfysG_pip_forge",
			"pip_glitch": "dCfysG_pip_glitch",
			"pip_lumen": "dCfysG_pip_lumen",
			"pip_relay": "dCfysG_pip_relay",
			"playerModifierIcon": "dCfysG_playerModifierIcon",
			"playerModifierStrip": "dCfysG_playerModifierStrip",
			"protocolBanner": "dCfysG_protocolBanner",
			"protocolReveal": "dCfysG_protocolReveal",
			"releaseActions": "dCfysG_releaseActions",
			"releaseDanger": "dCfysG_releaseDanger",
			"releaseModal": "dCfysG_releaseModal",
			"releaseReward": "dCfysG_releaseReward",
			"reloadDialog": "dCfysG_reloadDialog",
			"reloadLevel": "dCfysG_reloadLevel",
			"reloadOrbit": "dCfysG_reloadOrbit",
			"reloadPage": "dCfysG_reloadPage",
			"reloadTileClear": "dCfysG_reloadTileClear",
			"reloadWindow": "dCfysG_reloadWindow",
			"resultRing": "dCfysG_resultRing",
			"resultSweep": "dCfysG_resultSweep",
			"rewardBackdrop": "dCfysG_rewardBackdrop",
			"rewardBackdropIn": "dCfysG_rewardBackdropIn",
			"rewardCrate": "dCfysG_rewardCrate",
			"rewardDismissButton": "dCfysG_rewardDismissButton",
			"rewardHalo": "dCfysG_rewardHalo",
			"rewardItem": "dCfysG_rewardItem",
			"rewardItemCompact": "dCfysG_rewardItemCompact",
			"rewardItems": "dCfysG_rewardItems",
			"rewardModal": "dCfysG_rewardModal",
			"rewardPulse": "dCfysG_rewardPulse",
			"rosterControlOptions": "dCfysG_rosterControlOptions",
			"rosterControlRow": "dCfysG_rosterControlRow",
			"rosterControlSummary": "dCfysG_rosterControlSummary",
			"rosterControls": "dCfysG_rosterControls",
			"rosterControlsIn": "dCfysG_rosterControlsIn",
			"rosterEmpty": "dCfysG_rosterEmpty",
			"rosterSearch": "dCfysG_rosterSearch",
			"sectionKicker": "dCfysG_sectionKicker",
			"settingsCard": "dCfysG_settingsCard",
			"settingsDeleteActions": "dCfysG_settingsDeleteActions",
			"settingsDeleteButton": "dCfysG_settingsDeleteButton",
			"settingsDeleteConfirm": "dCfysG_settingsDeleteConfirm",
			"settingsError": "dCfysG_settingsError",
			"settingsHero": "dCfysG_settingsHero",
			"settingsPage": "dCfysG_settingsPage",
			"settingsStatus": "dCfysG_settingsStatus",
			"settingsStorageCard": "dCfysG_settingsStorageCard",
			"settingsSwitch": "dCfysG_settingsSwitch",
			"settingsSwitchOn": "dCfysG_settingsSwitchOn",
			"sharedHpHeader": "dCfysG_sharedHpHeader",
			"sharedHpNumbers": "dCfysG_sharedHpNumbers",
			"sharedPartyVitals": "dCfysG_sharedPartyVitals",
			"signalRule": "dCfysG_signalRule",
			"signalRule_aegis": "dCfysG_signalRule_aegis",
			"signalRule_forge": "dCfysG_signalRule_forge",
			"signalRule_glitch": "dCfysG_signalRule_glitch",
			"signalRule_lumen": "dCfysG_signalRule_lumen",
			"signalRule_relay": "dCfysG_signalRule_relay",
			"sprite": "dCfysG_sprite",
			"spritePlaceholder": "dCfysG_spritePlaceholder",
			"spriteUnknown": "dCfysG_spriteUnknown",
			"sprite_large": "dCfysG_sprite_large",
			"sprite_medium": "dCfysG_sprite_medium",
			"sprite_small": "dCfysG_sprite_small",
			"sprite_tiny": "dCfysG_sprite_tiny",
			"squadActions": "dCfysG_squadActions",
			"squadCancel": "dCfysG_squadCancel",
			"squadFilterActive": "dCfysG_squadFilterActive",
			"squadFilterToggle": "dCfysG_squadFilterToggle",
			"squadSlots": "dCfysG_squadSlots",
			"starterGrid": "dCfysG_starterGrid",
			"starterModal": "dCfysG_starterModal",
			"statsGrid": "dCfysG_statsGrid",
			"tabActive": "dCfysG_tabActive",
			"tabs": "dCfysG_tabs",
			"teamDamageForecast": "dCfysG_teamDamageForecast",
			"tileFall": "dCfysG_tileFall",
			"tileReturning": "dCfysG_tileReturning",
			"tileSpecial": "dCfysG_tileSpecial",
			"tileSwapping": "dCfysG_tileSwapping",
			"tile_aegis": "dCfysG_tile_aegis",
			"tile_forge": "dCfysG_tile_forge",
			"tile_glitch": "dCfysG_tile_glitch",
			"tile_lumen": "dCfysG_tile_lumen",
			"tile_relay": "dCfysG_tile_relay",
			"toast": "dCfysG_toast",
			"towerBattleMark": "dCfysG_towerBattleMark",
			"towerBattleStatus": "dCfysG_towerBattleStatus",
			"towerBossCard": "dCfysG_towerBossCard",
			"towerBrief": "dCfysG_towerBrief",
			"towerGuardian": "dCfysG_towerGuardian",
			"towerHeading": "dCfysG_towerHeading",
			"towerHero": "dCfysG_towerHero",
			"towerMetrics": "dCfysG_towerMetrics",
			"towerMonument": "dCfysG_towerMonument",
			"towerPage": "dCfysG_towerPage",
			"towerRoute": "dCfysG_towerRoute",
			"towerRouteActive": "dCfysG_towerRouteActive",
			"towerRouteCleared": "dCfysG_towerRouteCleared",
			"turnSkipButton": "dCfysG_turnSkipButton",
			"turnSummary": "dCfysG_turnSummary",
			"turnSummaryBoss": "dCfysG_turnSummaryBoss",
			"windowClose": "dCfysG_windowClose",
			"windowTools": "dCfysG_windowTools"
		};
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/creature-presentation.js
		const ECOLOGY_KEYS = {
			lumen: "ecologyLumen",
			forge: "ecologyForge",
			relay: "ecologyRelay",
			aegis: "ecologyAegis",
			glitch: "ecologyGlitch"
		};
		const CORE_KEYS = {
			pebble: "corePebble",
			pulse: "corePulse",
			prism: "corePrism",
			nova: "coreNova",
			origin: "coreOrigin"
		};
		const RARITY_KEYS = {
			common: "rarityCommon",
			uncommon: "rarityUncommon",
			rare: "rarityRare",
			apex: "rarityApex"
		};
		const CreatureSprite = (0, react.memo)(function CreatureSprite(props) {
			const [failedSources, setFailedSources] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const look = props.captured ?? {
				level: props.level ?? 1,
				...props.appearance === void 0 ? {} : { appearance: props.appearance }
			};
			const resolved = resolveCreatureSprite(props.creature.id, look);
			const source = resolved.source !== void 0 && !failedSources.has(resolved.source) ? resolved.source : resolved.fallback !== void 0 && !failedSources.has(resolved.fallback) ? resolved.fallback : void 0;
			const className = `${tracewild_module_css_default.sprite} ${tracewild_module_css_default[`sprite_${props.size ?? "medium"}`]} ${props.unknown ? tracewild_module_css_default.spriteUnknown : ""}`;
			if (props.unknown) return (0, react_jsx_runtime.jsx)("span", {
				className: `${className} ${tracewild_module_css_default.spritePlaceholder}`,
				"aria-hidden": "true",
				children: "?"
			});
			if (source === void 0) return (0, react_jsx_runtime.jsx)("span", {
				className: `${className} ${tracewild_module_css_default.spritePlaceholder}`,
				"aria-hidden": "true",
				children: "?"
			});
			return (0, react_jsx_runtime.jsx)("img", {
				className,
				src: source,
				"data-creature-id": props.creature.id,
				"data-creature-instance": look.instanceId,
				"data-creature-appearance": source === resolved.source ? resolved.appearance : "original",
				"data-creature-level": look.level,
				alt: "",
				width: 384,
				height: 384,
				loading: props.eager ? "eager" : "lazy",
				decoding: "async",
				draggable: false,
				onError: () => {
					setFailedSources((previous) => /* @__PURE__ */ new Set([...previous, source]));
				}
			});
		});
		function creatureName(creature, zh) {
			return zh ? creature.nameZh : creature.nameEn;
		}
		//#endregion
		//#region \0tracewild-css:packages/renderer-react/src/components/codekin-map.module.css.mjs
		const css$2 = ".kFZmKq_map{color:#f5fbff;gap:12px;min-width:0;display:grid}.kFZmKq_heading{justify-content:space-between;align-items:center;gap:8px;padding:2px 3px 0;display:flex}.kFZmKq_heading>div{min-width:0}.kFZmKq_heading>div>span{color:#a4e9ff;letter-spacing:.16em;font:800 9px/1.2 ui-sans-serif,system-ui,sans-serif}.kFZmKq_heading h2{letter-spacing:-.04em;margin:6px 0 0;font-size:clamp(25px,6vw,33px);font-style:italic;font-weight:950;line-height:1}.kFZmKq_heading p{flex-shrink:0;align-items:center;gap:6px;margin:0;display:flex}.kFZmKq_heading p b{color:#a6f5ff;letter-spacing:-.08em;font:italic 900 38px/.9 ui-sans-serif,system-ui,sans-serif}.kFZmKq_heading p span{color:#badff5;font:700 9px/1.5 ui-sans-serif,system-ui,sans-serif}.kFZmKq_scene{isolation:isolate;aspect-ratio:600/620;background:#0a467c;border:1px solid #76e3ff8c;border-radius:2px 24px 2px 2px;position:relative;overflow:hidden;box-shadow:0 10px 28px #00133355}.kFZmKq_scene:after{content:\"\";z-index:1;pointer-events:none;background:linear-gradient(#030f4355,#0000 22% 78%,#00194a99);position:absolute;inset:0;box-shadow:inset 0 0 65px #09245266}.kFZmKq_city,.kFZmKq_leaders{pointer-events:none;width:100%;height:100%;display:block;position:absolute;inset:0}.kFZmKq_leaders{z-index:2;color:#c7fbff}.kFZmKq_coordinate{z-index:2;color:#d2f6ff;letter-spacing:.09em;align-items:center;gap:8px;font:700 8px/1.2 ui-monospace,monospace;display:flex;position:absolute;top:17px;left:16px}.kFZmKq_coordinate i{background:#b5ffff;border-radius:50%;width:4px;height:4px;box-shadow:0 0 7px #85ffff}.kFZmKq_marker{--signal:#9cf6ff;z-index:3;color:#fff;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;background:0 0;border:0;flex-direction:column;align-items:center;gap:2px;width:25%;padding:2px;font-family:inherit;display:flex;position:absolute;transform:translate(-50%,-50%)}.kFZmKq_marker:after{content:\"\";z-index:-1;border:1px solid #0000;border-radius:40px 40px 5px 5px;transition:background .25s,border-color .25s;position:absolute;inset:-3px -1px}.kFZmKq_marker:hover,.kFZmKq_marker:focus-visible{z-index:4;outline:none}.kFZmKq_marker:hover:after,.kFZmKq_marker:focus-visible:after{border-color:var(--signal);background:#052759e8;box-shadow:0 8px 20px #00153688}.kFZmKq_marker:focus-visible:after{outline-offset:2px;outline:2px solid #fff}.kFZmKq_marker:disabled{cursor:wait}.kFZmKq_marker:disabled .kFZmKq_portrait{filter:saturate(.5)}.kFZmKq_portrait{border:3px solid var(--signal);background:radial-gradient(circle at 35% 20%,#3b75b8,#102760 70%);border-radius:50%;flex-shrink:0;place-items:center;width:clamp(43px,12vw,59px);height:clamp(43px,12vw,59px);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .3s;display:grid;position:relative;box-shadow:0 0 0 2px #075197,0 0 0 4px #b1ebff5c,0 5px 9px #00134799}.kFZmKq_portrait:after{content:\"\";z-index:-1;border:2px solid var(--signal);background:#0d3975;border-top:0;border-left:0;width:12px;height:12px;position:absolute;bottom:-9px;left:calc(50% - 6px);transform:rotate(45deg)}.kFZmKq_portrait>img,.kFZmKq_portrait>span{object-fit:contain;filter:drop-shadow(0 3px 2px #00173b70);width:112%;max-width:none;height:112%;margin-top:-6%}.kFZmKq_portrait i{border:1px solid var(--signal);opacity:.45;pointer-events:none;border-radius:50%;position:absolute;inset:-9px}.kFZmKq_portrait,.kFZmKq_portrait i{corner-shape:round}.kFZmKq_portrait b{color:#fff1b1;text-shadow:0 1px 4px #2e2065;font-size:17px;position:absolute;top:-8px;right:-5px}.kFZmKq_marker[data-special] .kFZmKq_portrait i{animation:4s ease-in-out infinite kFZmKq_signalHalo;animation-delay:var(--delay)}.kFZmKq_marker[data-quality=nova] .kFZmKq_portrait{border-color:#f5abec}.kFZmKq_marker[data-quality=origin] .kFZmKq_portrait{border-color:#ffdf91}.kFZmKq_marker:hover .kFZmKq_portrait,.kFZmKq_marker:focus-visible .kFZmKq_portrait{transform:translateY(-4px)scale(1.06);box-shadow:0 0 0 2px #075197,0 0 0 5px #c9faff77,0 10px 20px #001344}.kFZmKq_marker strong{text-overflow:ellipsis;white-space:nowrap;color:#fff;border-left:2px solid var(--signal);background:#0b389bdd;min-width:0;max-width:100%;margin-top:5px;padding:3px 7px;font-size:12px;font-weight:850;line-height:1.2;display:block;overflow:hidden;box-shadow:0 2px 5px #00184950}.kFZmKq_marker small{color:#d7f7ff;white-space:nowrap;background:#052857e8;max-width:115%;padding:2px 4px;font:700 9px/1.2 ui-sans-serif,system-ui,sans-serif}.kFZmKq_legend{flex-wrap:wrap;justify-content:center;gap:7px 11px;padding:0 3px;display:flex}.kFZmKq_legend span{color:#d1e6fb;align-items:center;gap:5px;font-size:11px;display:inline-flex}.kFZmKq_legend i{border:1px solid var(--signal);background:color-mix(in srgb, var(--signal) 45%, transparent);border-radius:50%;width:7px;height:7px}.kFZmKq_hint{text-align:center;color:#afcbe8;margin:-4px 0 1px;font-size:11px;line-height:1.5}.kFZmKq_empty{z-index:3;background:#072861e8;border-left:3px solid #a3faff;align-items:center;gap:12px;padding:16px;display:flex;position:absolute;inset:34% 10% auto;box-shadow:0 8px 30px #001b5555}.kFZmKq_empty>span{color:#a3faff;font-size:34px}.kFZmKq_empty p{color:#e9faff;margin:0;font-size:13px;line-height:1.7}.kFZmKq_ferry{animation:12s ease-in-out infinite alternate kFZmKq_ferryDrift}@keyframes kFZmKq_signalHalo{0%,to{opacity:.25;transform:scale(1)}50%{opacity:.8;transform:scale(1.08)}}@keyframes kFZmKq_ferryDrift{to{transform:translate(13px,-4px)}}[data-motion=reduce] .kFZmKq_map *,[data-motion=reduce] .kFZmKq_map :after{transition:none!important;animation:none!important}@media (width<=390px){.kFZmKq_heading h2{font-size:26px}.kFZmKq_portrait{width:43px;height:43px}.kFZmKq_marker strong{padding:3px 4px;font-size:11px}.kFZmKq_marker small{font-size:8px}.kFZmKq_coordinate{font-size:7px;left:12px}.kFZmKq_caption{display:none}}";
		var codekin_map_module_css_default = {
			"caption": "kFZmKq_caption",
			"city": "kFZmKq_city",
			"coordinate": "kFZmKq_coordinate",
			"empty": "kFZmKq_empty",
			"ferry": "kFZmKq_ferry",
			"ferryDrift": "kFZmKq_ferryDrift",
			"heading": "kFZmKq_heading",
			"hint": "kFZmKq_hint",
			"leaders": "kFZmKq_leaders",
			"legend": "kFZmKq_legend",
			"map": "kFZmKq_map",
			"marker": "kFZmKq_marker",
			"portrait": "kFZmKq_portrait",
			"scene": "kFZmKq_scene",
			"signalHalo": "kFZmKq_signalHalo"
		};
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/CodekinMapView.js
		const WIDTH = 600;
		const HEIGHT = 620;
		const ecologyColors = {
			lumen: "#9bfbff",
			forge: "#ffd18a",
			relay: "#cdb9ff",
			aegis: "#a2ffd0",
			glitch: "#ffaae1"
		};
		const project = (x, y, z = 0) => [300 + (x - y) * .84, 145 + (x + y) * .64 - z];
		const points = (vertices) => vertices.map((point) => point.map((value) => Math.round(value * 10) / 10).join(",")).join(" ");
		const ground = (vertices, z = 0) => points(vertices.map(([x, y]) => project(x, y, z)));
		const BERTHS = [
			[161, 151],
			[389, 161],
			[86, 331],
			[294, 338],
			[510, 336],
			[187, 510],
			[420, 514]
		];
		const COAST = [
			[-25, 28],
			[28, -25],
			[215, -25],
			[292, 26],
			[310, 157],
			[283, 290],
			[139, 321],
			[0, 259],
			[-25, 149]
		];
		function markerBerths(anchors) {
			const memo = /* @__PURE__ */ new Map();
			function solve(index, mask) {
				if (index === anchors.length) return {
					cost: 0,
					slots: []
				};
				const key = `${index}:${mask}`;
				const cached = memo.get(key);
				if (cached !== void 0) return cached;
				let best = {
					cost: Infinity,
					slots: []
				};
				BERTHS.forEach(([x, y], slot) => {
					if ((mask & 1 << slot) !== 0) return;
					const next = solve(index + 1, mask | 1 << slot);
					const anchor = anchors[index];
					const cost = (x - anchor[0]) ** 2 + (y - anchor[1]) ** 2 + next.cost;
					if (cost < best.cost) best = {
						cost,
						slots: [slot, ...next.slots]
					};
				});
				memo.set(key, best);
				return best;
			}
			return solve(0, 0).slots;
		}
		function timeLabel(t, expiresAt, now) {
			if (!Number.isFinite(expiresAt) || !Number.isFinite(now)) return t("encounterResident");
			const minutes = Math.max(0, Math.ceil((expiresAt - now) / 6e4));
			if (minutes <= 1) return t("encounterLeavingSoon");
			if (minutes < 60) return t("encounterLeavesMinutes", { count: minutes });
			const hours = Math.ceil(minutes / 60);
			return hours < 24 ? t("encounterLeavesHours", { count: hours }) : t("encounterLeavesDays", { count: Math.ceil(hours / 24) });
		}
		const PALETTES = [
			[
				"#d9edfc",
				"#8baecd",
				"#4e779f"
			],
			[
				"#9de4ed",
				"#579fab",
				"#357184"
			],
			[
				"#fff0dc",
				"#d7b89e",
				"#966f6b"
			],
			[
				"#c4cffa",
				"#889bc7",
				"#525f95"
			]
		];
		const BLOCKS = [];
		for (let row = 0; row < 8; row++) for (let column = 0; column < 8; column++) {
			if (column < 3 && row > 4 || column > 2 && column < 5 && row > 2 && row < 5) continue;
			const seed = (row * 43 + column * 71) % 97;
			BLOCKS.push({
				x: column * 35 + 7,
				y: row * 35 + 7,
				w: 17 + seed % 8,
				d: 17 + seed % 6,
				h: 12 + seed % 41,
				color: seed % 4
			});
			if (seed % 3 === 0) BLOCKS.push({
				x: column * 35 + 9,
				y: row * 35 + 24,
				w: 10,
				d: 8,
				h: 8 + seed % 14,
				color: (seed + 1) % 4
			});
		}
		BLOCKS.sort((a, b) => a.x + a.y - b.x - b.y);
		function Building({ block }) {
			const { x, y, w, d, h, color } = block;
			const palette = PALETTES[color];
			const a = project(x, y, h), b = project(x + w, y, h), c = project(x + w, y + d, h), e = project(x, y + d, h);
			const baseB = project(x + w, y), baseC = project(x + w, y + d), baseE = project(x, y + d);
			return (0, react_jsx_runtime.jsxs)("g", { children: [
				(0, react_jsx_runtime.jsx)("polygon", {
					points: ground([
						[x, y + d],
						[x + w, y + d],
						[x + w + h * .65, y + d + h * .28],
						[x + h * .65, y + d + h * .28]
					]),
					fill: "#06275b",
					opacity: ".24"
				}),
				(0, react_jsx_runtime.jsx)("polygon", {
					points: points([
						e,
						c,
						baseC,
						baseE
					]),
					fill: palette[1]
				}),
				(0, react_jsx_runtime.jsx)("polygon", {
					points: points([
						b,
						c,
						baseC,
						baseB
					]),
					fill: palette[2]
				}),
				(0, react_jsx_runtime.jsx)("polygon", {
					points: points([
						a,
						b,
						c,
						e
					]),
					fill: palette[0],
					stroke: "#f1faff",
					strokeWidth: ".6"
				}),
				h > 30 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					(0, react_jsx_runtime.jsx)("polyline", {
						points: points([
							project(x + 2, y + d, h * .66),
							project(x + w, y + d, h * .66),
							project(x + w, y + 2, h * .66)
						]),
						stroke: "#deffff",
						strokeWidth: "1.4",
						fill: "none",
						opacity: ".65"
					}),
					(0, react_jsx_runtime.jsx)("polyline", {
						points: points([
							project(x + 2, y + d, h * .35),
							project(x + w, y + d, h * .35),
							project(x + w, y + 2, h * .35)
						]),
						stroke: "#deffff",
						strokeWidth: "1.2",
						fill: "none",
						opacity: ".45"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground([
							[x + 4, y + 4],
							[x + 10, y + 4],
							[x + 10, y + 9],
							[x + 4, y + 9]
						], h + 1),
						fill: palette[2],
						opacity: ".6"
					})
				] })
			] });
		}
		const City = (0, react.memo)(function City() {
			const tower = project(134, 131);
			return (0, react_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
				className: codekin_map_module_css_default.city,
				"aria-hidden": "true",
				focusable: "false",
				children: [
					(0, react_jsx_runtime.jsxs)("defs", { children: [
						(0, react_jsx_runtime.jsxs)("linearGradient", {
							id: "codekin-sea",
							x2: ".8",
							y2: "1",
							children: [(0, react_jsx_runtime.jsx)("stop", { stopColor: "#087eae" }), (0, react_jsx_runtime.jsx)("stop", {
								offset: "1",
								stopColor: "#071f61"
							})]
						}),
						(0, react_jsx_runtime.jsx)("pattern", {
							id: "codekin-water",
							width: "43",
							height: "31",
							patternUnits: "userSpaceOnUse",
							children: (0, react_jsx_runtime.jsx)("path", {
								d: "M3 16l18-4m6 10 12-3",
								stroke: "#adfaff",
								strokeWidth: ".7",
								opacity: ".23"
							})
						}),
						(0, react_jsx_runtime.jsxs)("linearGradient", {
							id: "codekin-beacon",
							x2: "0",
							y2: "1",
							children: [(0, react_jsx_runtime.jsx)("stop", {
								stopColor: "#bcffff",
								stopOpacity: "0"
							}), (0, react_jsx_runtime.jsx)("stop", {
								offset: "1",
								stopColor: "#bbffff",
								stopOpacity: ".4"
							})]
						})
					] }),
					(0, react_jsx_runtime.jsx)("rect", {
						width: WIDTH,
						height: HEIGHT,
						fill: "url(#codekin-sea)"
					}),
					(0, react_jsx_runtime.jsx)("rect", {
						width: WIDTH,
						height: HEIGHT,
						fill: "url(#codekin-water)"
					}),
					(0, react_jsx_runtime.jsx)("path", {
						d: "M-50 380Q270 245 652 428M-20 568Q320 429 640 557M-30 87Q273 12 661 117",
						fill: "none",
						stroke: "#66e2e9",
						strokeWidth: "1",
						opacity: ".21"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground(COAST, -22),
						fill: "#12335a",
						stroke: "#4fbbcf",
						strokeWidth: "12",
						strokeLinejoin: "round"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground(COAST, -10),
						fill: "#668ba4",
						stroke: "#a5dddb",
						strokeWidth: "5",
						strokeLinejoin: "round"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground(COAST),
						fill: "#7196a8",
						stroke: "#d5eee1",
						strokeWidth: "3",
						strokeLinejoin: "round"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground([
							[0, 166],
							[97, 166],
							[97, 275],
							[0, 259]
						]),
						fill: "#469d91"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground([
							[99, 99],
							[168, 99],
							[168, 171],
							[99, 171]
						]),
						fill: "#d1dcca"
					}),
					(0, react_jsx_runtime.jsx)("polygon", {
						points: ground([
							[214, 214],
							[279, 214],
							[279, 276],
							[214, 276]
						]),
						fill: "#bca8ae"
					}),
					[
						0,
						35,
						70,
						105,
						140,
						175,
						210,
						245,
						280
					].map((axis) => (0, react_jsx_runtime.jsxs)("g", { children: [
						(0, react_jsx_runtime.jsx)("polyline", {
							points: ground([[axis, 0], [axis, 280]]),
							fill: "none",
							stroke: "#244f72",
							strokeWidth: "5.5"
						}),
						(0, react_jsx_runtime.jsx)("polyline", {
							points: ground([[0, axis], [280, axis]]),
							fill: "none",
							stroke: "#244f72",
							strokeWidth: "5.5"
						}),
						(0, react_jsx_runtime.jsx)("polyline", {
							points: ground([[axis, 0], [axis, 280]]),
							fill: "none",
							stroke: "#bfd6d0",
							strokeWidth: ".55",
							strokeDasharray: "4 5"
						}),
						(0, react_jsx_runtime.jsx)("polyline", {
							points: ground([[0, axis], [280, axis]]),
							fill: "none",
							stroke: "#bfd6d0",
							strokeWidth: ".55",
							strokeDasharray: "4 5"
						})
					] }, axis)),
					(0, react_jsx_runtime.jsx)("polyline", {
						points: ground([
							[14, -27],
							[14, -95],
							[85, -142]
						]),
						fill: "none",
						stroke: "#99c4cc",
						strokeWidth: "15"
					}),
					(0, react_jsx_runtime.jsx)("polyline", {
						points: ground([
							[14, -27],
							[14, -95],
							[85, -142]
						]),
						fill: "none",
						stroke: "#2e5571",
						strokeWidth: "9"
					}),
					(0, react_jsx_runtime.jsx)("polyline", {
						points: ground([
							[14, -27],
							[14, -95],
							[85, -142]
						]),
						fill: "none",
						stroke: "#f2e9bb",
						strokeWidth: "1",
						strokeDasharray: "5 6"
					}),
					[
						90,
						125,
						160
					].map((axis) => (0, react_jsx_runtime.jsx)("polygon", {
						points: ground([
							[axis, 305],
							[axis + 12, 305],
							[axis + 12, 343],
							[axis, 343]
						], -5),
						fill: "#9cb1b8",
						stroke: "#d4d8c5",
						strokeWidth: "2"
					}, axis)),
					(0, react_jsx_runtime.jsx)("ellipse", {
						cx: tower[0],
						cy: tower[1],
						rx: "38",
						ry: "21",
						fill: "#32647e",
						stroke: "#c5ffff",
						strokeWidth: "2"
					}),
					(0, react_jsx_runtime.jsx)("ellipse", {
						cx: tower[0],
						cy: tower[1],
						rx: "27",
						ry: "15",
						fill: "none",
						stroke: "#aad2d3",
						strokeWidth: "1"
					}),
					BLOCKS.map((block, index) => (0, react_jsx_runtime.jsx)(Building, { block }, index)),
					Array.from({ length: 17 }, (_, index) => {
						const x = 13 + index * 29 % 74, y = 183 + index * 19 % 73;
						const [px, py] = project(x, y);
						return (0, react_jsx_runtime.jsxs)("g", { children: [
							(0, react_jsx_runtime.jsx)("ellipse", {
								cx: px + 3,
								cy: py + 2,
								rx: "7",
								ry: "3",
								fill: "#174c67",
								opacity: ".5"
							}),
							(0, react_jsx_runtime.jsx)("path", {
								d: `M${px} ${py}v-12`,
								stroke: "#507d74",
								strokeWidth: "2"
							}),
							(0, react_jsx_runtime.jsx)("ellipse", {
								cx: px,
								cy: py - 10,
								rx: "5",
								ry: "7",
								fill: index % 2 ? "#8ce8b5" : "#62c9b2"
							})
						] }, index);
					}),
					(0, react_jsx_runtime.jsxs)("g", {
						className: codekin_map_module_css_default.landmark,
						children: [
							(0, react_jsx_runtime.jsx)("path", {
								d: `M${tower[0] - 22} ${tower[1] - 36}l6-178h32l6 178Z`,
								fill: "url(#codekin-beacon)"
							}),
							(0, react_jsx_runtime.jsx)(Building, { block: {
								x: 122,
								y: 119,
								w: 26,
								d: 26,
								h: 58,
								color: 3
							} }),
							(0, react_jsx_runtime.jsx)(Building, { block: {
								x: 126,
								y: 123,
								w: 18,
								d: 18,
								h: 85,
								color: 0
							} }),
							(0, react_jsx_runtime.jsx)("path", {
								d: `M${tower[0]} ${tower[1] - 91}v-32`,
								stroke: "#c8ffff",
								strokeWidth: "2"
							}),
							(0, react_jsx_runtime.jsx)("circle", {
								cx: tower[0],
								cy: tower[1] - 126,
								r: "4",
								fill: "#b7ffff"
							}),
							(0, react_jsx_runtime.jsx)("ellipse", {
								cx: tower[0],
								cy: tower[1] - 93,
								rx: "20",
								ry: "7",
								fill: "none",
								stroke: "#b7ffff",
								strokeWidth: "1.5"
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("g", {
						className: codekin_map_module_css_default.ferry,
						children: [
							(0, react_jsx_runtime.jsx)("path", {
								d: "m92 534 36-8 18 8-35 9Z",
								fill: "#e8faff"
							}),
							(0, react_jsx_runtime.jsx)("path", {
								d: "m104 526 17-3 8 5-16 4Z",
								fill: "#74c6df"
							}),
							(0, react_jsx_runtime.jsx)("path", {
								d: "m65 542 19-5m-28 11 18-5",
								stroke: "#9cefff",
								opacity: ".5"
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("g", {
						transform: "translate(545 554)",
						fill: "#b7ecff",
						children: [(0, react_jsx_runtime.jsx)("path", { d: "m0-18 6 23-6-5-6 5Z" }), (0, react_jsx_runtime.jsx)("text", {
							y: "-26",
							textAnchor: "middle",
							fontSize: "12",
							fontFamily: "monospace",
							children: "N"
						})]
					})
				]
			});
		});
		function CodekinMapView(props) {
			const [clock, setClock] = (0, react.useState)(props.serverTime);
			(0, react.useEffect)(() => {
				const startedAt = Date.now();
				setClock(props.serverTime);
				const timer = window.setInterval(() => setClock(props.serverTime + Math.max(0, Date.now() - startedAt)), 3e4);
				return () => window.clearInterval(timer);
			}, [props.serverTime]);
			const markers = (0, react.useMemo)(() => {
				const encounters = props.state.encounters.slice(0, 7);
				const anchors = encounters.map((encounter) => project(encounter.mapX * 2.8, encounter.mapY * 2.8));
				const berths = markerBerths(anchors);
				return encounters.map((encounter, index) => ({
					encounter,
					anchor: anchors[index],
					berth: BERTHS[berths[index]]
				}));
			}, [props.state.encounters]);
			return (0, react_jsx_runtime.jsxs)("section", {
				className: codekin_map_module_css_default.map,
				"aria-labelledby": "codekin-map-title",
				children: [
					(0, react_jsx_runtime.jsx)("style", {
						"data-plugin-css": "codekin-city-map",
						dangerouslySetInnerHTML: { __html: css$2 }
					}),
					(0, react_jsx_runtime.jsxs)("header", {
						className: codekin_map_module_css_default.heading,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", { children: "CODEKIN / SIGNAL CITY" }), (0, react_jsx_runtime.jsx)("h2", {
							id: "codekin-map-title",
							children: props.t("map")
						})] }), (0, react_jsx_runtime.jsxs)("p", { children: [(0, react_jsx_runtime.jsx)("b", { children: String(props.state.encounters.length).padStart(2, "0") }), (0, react_jsx_runtime.jsxs)("span", { children: [
							"/ ",
							7,
							(0, react_jsx_runtime.jsx)("br", {}),
							props.zh ? "驻留信号" : "SIGNALS"
						] })] })]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: codekin_map_module_css_default.scene,
						children: [
							(0, react_jsx_runtime.jsx)(City, {}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: codekin_map_module_css_default.coordinate,
								"aria-hidden": "true",
								children: [
									"SECTOR 01 ",
									(0, react_jsx_runtime.jsx)("i", {}),
									" LIVE SIGNAL"
								]
							}),
							(0, react_jsx_runtime.jsx)("svg", {
								viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
								className: codekin_map_module_css_default.leaders,
								"aria-hidden": "true",
								focusable: "false",
								children: markers.map(({ encounter, anchor, berth }) => (0, react_jsx_runtime.jsxs)("g", {
									stroke: ecologyColors[creatureById(encounter.creatureId)?.ecology ?? "relay"],
									children: [
										(0, react_jsx_runtime.jsx)("path", {
											d: `M${berth[0]} ${berth[1] + 38} L${anchor[0]} ${anchor[1]}`,
											fill: "none",
											strokeWidth: "1.7",
											strokeDasharray: "3 3",
											opacity: ".8"
										}),
										(0, react_jsx_runtime.jsx)("ellipse", {
											cx: anchor[0],
											cy: anchor[1],
											rx: "12",
											ry: "6",
											fill: "#092557",
											strokeWidth: "2"
										}),
										(0, react_jsx_runtime.jsx)("ellipse", {
											cx: anchor[0],
											cy: anchor[1],
											rx: "5",
											ry: "2.5",
											fill: "currentColor",
											strokeWidth: "0"
										})
									]
								}, encounter.id))
							}),
							markers.map(({ encounter, berth }, index) => {
								const creature = creatureById(encounter.creatureId);
								if (creature === void 0) return null;
								const name = creatureName(creature, props.zh);
								const remaining = timeLabel(props.t, encounter.expiresAt, clock);
								const special = encounter.enhanced || creature.rarity === "rare" || creature.rarity === "apex" || encounter.quality === "nova" || encounter.quality === "origin";
								return (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: codekin_map_module_css_default.marker,
									style: {
										left: `${berth[0] / WIDTH * 100}%`,
										top: `${berth[1] / HEIGHT * 100}%`,
										"--signal": ecologyColors[creature.ecology],
										"--delay": `${index * -.6}s`
									},
									"data-special": special || void 0,
									"data-quality": encounter.quality,
									disabled: props.busy || !props.state.starterChosen,
									"aria-label": `${name} · Lv.${encounter.level} · ${props.t(CORE_KEYS[encounter.quality])} · ${remaining}${encounter.enhanced ? ` · ${props.t("enhanced")}` : ""}`,
									title: `${name} · ${props.t(ECOLOGY_KEYS[creature.ecology])} · ${props.t(CORE_KEYS[encounter.quality])} · ${remaining}`,
									onClick: () => props.start(encounter.id),
									children: [
										(0, react_jsx_runtime.jsxs)("span", {
											className: codekin_map_module_css_default.portrait,
											children: [
												(0, react_jsx_runtime.jsx)(CreatureSprite, {
													creature,
													level: encounter.level,
													size: "small"
												}),
												(0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
												special && (0, react_jsx_runtime.jsx)("b", {
													"aria-hidden": "true",
													children: "✦"
												})
											]
										}),
										(0, react_jsx_runtime.jsx)("strong", { children: name }),
										(0, react_jsx_runtime.jsxs)("small", { children: [
											"Lv.",
											encounter.level,
											" · ",
											remaining
										] })
									]
								}, encounter.id);
							}),
							props.state.encounters.length === 0 && (0, react_jsx_runtime.jsxs)("div", {
								className: codekin_map_module_css_default.empty,
								children: [(0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "◎"
								}), (0, react_jsx_runtime.jsx)("p", { children: props.t("mapEmpty") })]
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: codekin_map_module_css_default.legend,
						children: Object.keys(ECOLOGY_KEYS).map((ecology) => (0, react_jsx_runtime.jsxs)("span", {
							style: { "--signal": ecologyColors[ecology] },
							children: [(0, react_jsx_runtime.jsx)("i", {}), props.t(ECOLOGY_KEYS[ecology])]
						}, ecology))
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: codekin_map_module_css_default.hint,
						children: props.zh ? "选择头像，前往信号所在的街区。" : "Select a portrait to meet its signal."
					})
				]
			});
		}
		//#endregion
		//#region \0tracewild-css:packages/renderer-react/src/components/battle-stage.module.css.mjs
		const css$1 = ".R6dNhq_stage{--stage-height:300px;height:var(--stage-height);isolation:isolate;color:#effbff;background:linear-gradient(125deg,#196ddd 0 24%,#12488f 24% 48%,#082b64 48%);border:1px solid #4baee088;position:relative}.R6dNhq_stage:before{content:\"\";z-index:-1;pointer-events:none;background:repeating-linear-gradient(155deg,#0000 0 50px,#53d6ff12 51px 52px);position:absolute;inset:0}.R6dNhq_floor{background:radial-gradient(#45c1f437,#0000 70%);border:1px solid #91eaff60;border-radius:50%;width:45%;height:53px;position:absolute;top:111px;right:2%;transform:rotate(-14deg);box-shadow:0 0 0 9px #41c9ff0b,0 0 0 21px #41c9ff08}.R6dNhq_stageLabel{letter-spacing:-.04em;opacity:.9;font:italic 800 clamp(17px,4vw,24px)/1 system-ui,sans-serif;position:absolute;top:20px;left:17px;transform:rotate(-6deg)}.R6dNhq_stageLabel i{letter-spacing:.2em;color:#78defa;margin-top:7px;font:8px/1.3 system-ui,sans-serif;display:block}.R6dNhq_fighter{color:#fff}.R6dNhq_enemy,.R6dNhq_active{text-align:center}.R6dNhq_portraitButton{aspect-ratio:1;cursor:help;width:100%;color:inherit;background:0 0;border:0;padding:0;display:block;position:relative;overflow:visible}.R6dNhq_active .R6dNhq_portraitButton{background:radial-gradient(circle at 37% 25%,#fff,#cfedff 70%);border-radius:50%;box-shadow:0 5px 15px #0005}.R6dNhq_portraitButton:focus-visible{outline-offset:4px;border-radius:50%;outline:2px solid #fff}.R6dNhq_portraitButton[data-can-cast]{cursor:pointer;box-shadow:0 0 0 2px #abf8ff,0 0 20px #6ff4ff66}.R6dNhq_portraitButton[data-can-cast]:hover{box-shadow:0 0 0 2px #fff,0 0 27px #6ff4ffb3}.R6dNhq_portraitLayers,.R6dNhq_portraitLayers>span{pointer-events:none;place-items:center;display:grid;position:absolute;inset:0}.R6dNhq_portraitLayers{border-radius:inherit;overflow:hidden}.R6dNhq_portraitButton,.R6dNhq_portraitLayers,.R6dNhq_floor,.R6dNhq_impact{corner-shape:round}.R6dNhq_portraitLayers img{object-fit:contain;filter:drop-shadow(0 5px 3px #03153555);width:100%;max-width:none;height:100%;animation:none;transform:none}.R6dNhq_arriving{animation:R6dNhq_stagePortraitIn var(--portrait-duration,.6s) cubic-bezier(.22,.8,.25,1) both}.R6dNhq_departing{animation:R6dNhq_stagePortraitOut var(--portrait-duration,.6s) ease both}.R6dNhq_halo{fill:none;pointer-events:none;width:110%;height:110%;position:absolute;inset:-5%;overflow:visible;transform:rotate(-90deg)}.R6dNhq_halo circle{stroke:#fff8;stroke-width:2px}.R6dNhq_halo circle+circle{stroke:#64f3ff;stroke-width:3.5px;stroke-linecap:round;filter:drop-shadow(0 0 3px #32e0ff);transition:stroke-dashoffset .65s}.R6dNhq_ready .R6dNhq_halo{animation:2.8s ease-in-out infinite R6dNhq_stageReady}.R6dNhq_portraitName{white-space:nowrap;text-overflow:ellipsis;margin-top:7px;font-size:12px;line-height:18px;display:block;overflow:hidden}.R6dNhq_enemyMeters{gap:5px;width:100%;max-width:170px;margin:0 auto;display:grid}.R6dNhq_hp,.R6dNhq_energy,.R6dNhq_skillMeter{background:#020f39b3;display:block;position:relative;overflow:hidden}.R6dNhq_hp{border:1px solid #98edffa8;height:14px}.R6dNhq_hp i,.R6dNhq_energy i,.R6dNhq_skillMeter i{background:linear-gradient(90deg,#30bde9,#a3f9ff);height:100%;transition:width .7s cubic-bezier(.22,.7,.2,1);display:block}.R6dNhq_hp span{text-align:center;color:#031c49;text-shadow:0 0 4px #fff;font:700 9px/12px system-ui,sans-serif;position:absolute;inset:0}.R6dNhq_energy{height:4px}.R6dNhq_energy i{background:#c1a8ff}.R6dNhq_damageLane{pointer-events:none;grid-template-columns:1fr 1fr;gap:9px;height:44px;display:grid;position:absolute;bottom:99px;left:32%;right:10px}.R6dNhq_damage{background:linear-gradient(90deg,#031d485c,#0000);border-left:2px solid #65e9ff;grid-column:2;grid-template-rows:12px 30px;grid-template-columns:minmax(0,1fr) auto;min-width:0;padding:1px 0 1px 9px;display:grid;position:relative}.R6dNhq_damage small{color:#95eaff;white-space:nowrap;text-overflow:ellipsis;grid-area:1/1;font-size:9px;line-height:12px;overflow:hidden}.R6dNhq_damage strong{white-space:nowrap;text-overflow:ellipsis;letter-spacing:-.05em;grid-area:2/1/auto/-1;min-width:0;font:italic 850 clamp(20px,4.5vw,28px)/1.1 system-ui,sans-serif;animation:.45s ease-out both R6dNhq_stageDamage;overflow:hidden}.R6dNhq_damage em{color:#fff;grid-area:1/2;margin-left:3px;font:700 9px/12px system-ui,sans-serif}.R6dNhq_damage[data-actor=boss]{border-color:#ff9fba}.R6dNhq_damage[data-actor=boss] small,.R6dNhq_damage[data-actor=boss] strong{color:#ffb1c8}.R6dNhq_damage[data-settled] strong{text-shadow:0 0 13px #fff6}.R6dNhq_tray{grid-template-columns:minmax(0,1.5fr) repeat(2,minmax(0,1fr));gap:7px;height:76px;display:grid;position:absolute;bottom:10px;left:32%;right:10px}.R6dNhq_skill{color:#062451;text-align:left;cursor:pointer;background:#a9f3ff;border:1px solid #e1fcff;flex-direction:column;justify-content:center;gap:7px;min-width:0;padding:9px 8px;transition:background .3s,box-shadow .3s;display:flex}.R6dNhq_skill:disabled{color:#9dc5e9;cursor:default;background:#083067;border-color:#6ebbe366}.R6dNhq_skill:enabled:hover,.R6dNhq_skill:focus-visible{background:#fff;box-shadow:0 0 15px #8ef1ffa3}.R6dNhq_skill small{justify-content:space-between;gap:3px;font-size:9px;display:flex}.R6dNhq_skill strong{white-space:nowrap;text-overflow:ellipsis;font-size:12px;overflow:hidden}.R6dNhq_skillMeter{flex-shrink:0;height:3px}.R6dNhq_teammateSlot{background:#083067b3;border:1px solid #6ebbe366;align-items:center;min-width:0;display:grid}.R6dNhq_teammate .R6dNhq_portraitButton{background:#d5f6ff1c;border-radius:50%;width:48px;max-width:78%;margin:1px auto 0}.R6dNhq_teammate .R6dNhq_portraitName{text-align:center;margin:3px 2px 0;font-size:9px;line-height:14px}.R6dNhq_emptySlot{color:#98c6e180;text-align:center;font-size:28px}.R6dNhq_detail{max-height:calc(var(--stage-height) - 20px);z-index:20;visibility:hidden;opacity:0;text-align:left;color:#e8faff;pointer-events:none;background:#031e4af5;border:1px solid #b6f2ff;padding:14px 16px;transition:opacity .18s;position:absolute;top:10px;left:10px;right:10px;overflow:auto;box-shadow:0 8px 26px #0008}.R6dNhq_fighter[data-detail-open]>.R6dNhq_detail{visibility:visible;opacity:1;pointer-events:auto}.R6dNhq_detail:focus-visible{outline-offset:2px;outline:2px solid #fff}.R6dNhq_enemy>.R6dNhq_detail{right:42%}.R6dNhq_active>.R6dNhq_detail{left:32%}.R6dNhq_enemy>.R6dNhq_detail dl{grid-template-columns:1fr}.R6dNhq_enemy>.R6dNhq_portraitButton,.R6dNhq_enemy>.R6dNhq_enemyMeters{width:35%;position:absolute;right:3%}.R6dNhq_enemy>.R6dNhq_portraitButton{max-width:183px;height:123px;top:0}.R6dNhq_enemy>.R6dNhq_enemyMeters{top:125px}.R6dNhq_active>.R6dNhq_portraitButton{width:25%;max-width:132px;position:absolute;bottom:30px;left:12px}.R6dNhq_active>.R6dNhq_portraitName{width:27%;position:absolute;bottom:7px;left:9px}.R6dNhq_teammate .R6dNhq_detail{left:-45%;right:0;top:calc(96px - var(--stage-height));max-height:calc(var(--stage-height) - 106px)}.R6dNhq_detail>strong{margin-bottom:5px;font-size:18px;display:block}.R6dNhq_detail small{color:#9cddf3;font-size:11px;display:block}.R6dNhq_detail dl{grid-template-columns:1fr 1fr;gap:6px 18px;margin:12px 0;font-size:11px;display:grid}.R6dNhq_detail dl div{justify-content:space-between;gap:8px;display:flex}.R6dNhq_detail dt{color:#a0d1e6}.R6dNhq_detail dd{margin:0;font-weight:700}.R6dNhq_detail p{margin:10px 0;font-size:11px;line-height:1.5}.R6dNhq_detail p b{color:#7ae9ff;display:block}.R6dNhq_strike{z-index:4;pointer-events:none;position:absolute;inset:0}.R6dNhq_wave{width:56px;height:16px;left:var(--source-x);top:var(--source-y);filter:drop-shadow(0 0 8px #5cdfff);animation:R6dNhq_stageFlight var(--strike-flight,1s) cubic-bezier(.3,.05,.45,1) both;background:linear-gradient(90deg,#0000,#60edff 65%,#fff);border-radius:60% 30%;margin:-8px 0 0 -28px;position:absolute;transform:rotate(-23deg)}.R6dNhq_strike[data-actor=boss] .R6dNhq_wave{filter:drop-shadow(0 0 9px #ff729f);background:linear-gradient(90deg,#fff,#ff8ab6 40%,#0000)}.R6dNhq_impact{left:var(--target-x);top:var(--target-y);border:3px solid #eaffff;border-radius:50%;width:82px;height:82px;margin:-41px;display:none;position:absolute;box-shadow:0 0 20px #70eaff,inset 0 0 20px #70eaff}.R6dNhq_strike[data-phase=impact] .R6dNhq_wave{display:none}.R6dNhq_strike[data-phase=impact] .R6dNhq_impact{animation:R6dNhq_stageImpact var(--strike-impact,.55s) ease-out both;display:block}.R6dNhq_strike[data-actor=boss] .R6dNhq_impact{border-color:#ffe4ed;box-shadow:0 0 20px #ff77ad,inset 0 0 20px #ff77ad}@keyframes R6dNhq_stagePortraitIn{0%{opacity:0;transform:translate(12%)scale(.93)}to{opacity:1;transform:none}}@keyframes R6dNhq_stagePortraitOut{to{opacity:0;transform:translate(-12%)scale(.93)}}@keyframes R6dNhq_stageReady{0%,to{opacity:.65;filter:drop-shadow(0 0 2px #77f5ff)}50%{opacity:1;filter:drop-shadow(0 0 6px #77f5ff)}}@keyframes R6dNhq_stageDamage{0%{opacity:.4;transform:translateY(4px)}to{opacity:1;transform:none}}@keyframes R6dNhq_stageFlight{0%{left:var(--source-x);top:var(--source-y);opacity:0;scale:.5}12%{opacity:1}90%,to{left:var(--target-x);top:var(--target-y);opacity:1;scale:1.2}}@keyframes R6dNhq_stageImpact{0%{opacity:1;transform:scale(.3)}to{opacity:0;transform:scale(1.7)}}.R6dNhq_stage[data-reduced] .R6dNhq_arriving,.R6dNhq_stage[data-reduced] .R6dNhq_departing,.R6dNhq_stage[data-reduced] .R6dNhq_halo,.R6dNhq_stage[data-reduced] .R6dNhq_damage strong{animation:none}.R6dNhq_stage[data-reduced] .R6dNhq_departing,.R6dNhq_stage[data-reduced] .R6dNhq_wave{display:none}.R6dNhq_stage[data-reduced] .R6dNhq_halo circle,.R6dNhq_stage[data-reduced] .R6dNhq_hp i,.R6dNhq_stage[data-reduced] .R6dNhq_energy i,.R6dNhq_stage[data-reduced] .R6dNhq_skillMeter i{transition:none}.R6dNhq_stage[data-reduced] .R6dNhq_impact{opacity:.5;animation:none;transform:none}@media (width<=420px){.R6dNhq_stage{--stage-height:280px}.R6dNhq_stageLabel{font-size:18px;left:12px}.R6dNhq_tray{gap:4px;right:7px}.R6dNhq_skill{padding:7px 5px}.R6dNhq_skill strong{font-size:10px}.R6dNhq_skill small{flex-wrap:wrap;gap:1px;font-size:8px}.R6dNhq_damageLane{gap:5px;bottom:96px;right:7px}.R6dNhq_damage{padding-left:5px}.R6dNhq_damage em{font-size:8px}.R6dNhq_damage strong{font-size:22px}.R6dNhq_enemy>.R6dNhq_portraitButton{height:112px}.R6dNhq_enemy>.R6dNhq_enemyMeters{top:114px}.R6dNhq_teammate .R6dNhq_portraitName{font-size:8px}.R6dNhq_active>.R6dNhq_portraitName{font-size:10px}}";
		var battle_stage_module_css_default = {
			"active": "R6dNhq_active",
			"arriving": "R6dNhq_arriving",
			"damage": "R6dNhq_damage",
			"damageLane": "R6dNhq_damageLane",
			"departing": "R6dNhq_departing",
			"detail": "R6dNhq_detail",
			"emptySlot": "R6dNhq_emptySlot",
			"enemy": "R6dNhq_enemy",
			"enemyMeters": "R6dNhq_enemyMeters",
			"energy": "R6dNhq_energy",
			"fighter": "R6dNhq_fighter",
			"floor": "R6dNhq_floor",
			"halo": "R6dNhq_halo",
			"hp": "R6dNhq_hp",
			"impact": "R6dNhq_impact",
			"portraitButton": "R6dNhq_portraitButton",
			"portraitLayers": "R6dNhq_portraitLayers",
			"portraitName": "R6dNhq_portraitName",
			"ready": "R6dNhq_ready",
			"skill": "R6dNhq_skill",
			"skillMeter": "R6dNhq_skillMeter",
			"stage": "R6dNhq_stage",
			"stageDamage": "R6dNhq_stageDamage",
			"stageFlight": "R6dNhq_stageFlight",
			"stageImpact": "R6dNhq_stageImpact",
			"stageLabel": "R6dNhq_stageLabel",
			"stagePortraitIn": "R6dNhq_stagePortraitIn",
			"stagePortraitOut": "R6dNhq_stagePortraitOut",
			"stageReady": "R6dNhq_stageReady",
			"strike": "R6dNhq_strike",
			"teammate": "R6dNhq_teammate",
			"teammateSlot": "R6dNhq_teammateSlot",
			"tray": "R6dNhq_tray",
			"wave": "R6dNhq_wave"
		};
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/BattleStage.js
		const intentKeys = {
			strike: "intentStrike",
			guard: "intentGuard",
			disrupt: "intentDisrupt",
			corrupt: "intentCorrupt",
			mark: "intentMark",
			lock: "intentLock",
			freeze: "intentFreeze"
		};
		const intentDetails = {
			strike: "intentDetailStrike",
			guard: "intentDetailGuard",
			disrupt: "intentDetailDisrupt",
			corrupt: "intentDetailCorrupt",
			mark: "intentDetailMark",
			lock: "intentDetailLock",
			freeze: "intentDetailFreeze"
		};
		const ratio = (value, max) => Math.max(0, Math.min(1, value / Math.max(1, max)));
		/** Retain the departing portrait until its crossfade finishes, without remounting controls. */
		function Portrait(props) {
			const key = `${props.look.instanceId ?? props.creatureId}:${props.look.appearance ?? "auto"}:${props.look.level >= 30}`;
			const last = (0, react.useRef)({
				key,
				creatureId: props.creatureId,
				look: props.look
			});
			const [departing, setDeparting] = (0, react.useState)();
			(0, react.useEffect)(() => {
				if (props.reducedMotion) setDeparting(void 0);
				if (last.current.key === key) return;
				const previous = last.current;
				last.current = {
					key,
					creatureId: props.creatureId,
					look: props.look
				};
				if (props.reducedMotion) return;
				setDeparting(previous);
				const timer = window.setTimeout(() => {
					setDeparting(void 0);
				}, BATTLE_MOTION.handoff + 20);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				key,
				props.creatureId,
				props.reducedMotion
			]);
			const current = creatureById(props.creatureId);
			const previous = departing === void 0 ? void 0 : creatureById(departing.creatureId);
			return (0, react_jsx_runtime.jsxs)("span", {
				className: battle_stage_module_css_default.portraitLayers,
				"aria-hidden": "true",
				children: [previous !== void 0 && (0, react_jsx_runtime.jsx)("span", {
					className: battle_stage_module_css_default.departing,
					children: (0, react_jsx_runtime.jsx)(CreatureSprite, {
						creature: previous,
						captured: departing?.look,
						eager: true
					})
				}, `out-${departing?.key}`), current !== void 0 && (0, react_jsx_runtime.jsx)("span", {
					className: battle_stage_module_css_default.arriving,
					children: (0, react_jsx_runtime.jsx)(CreatureSprite, {
						creature: current,
						captured: props.look,
						eager: true
					})
				}, key)]
			});
		}
		function BattleStage(props) {
			const { battle, t, zh } = props;
			const [pinnedDetail, setPinnedDetail] = (0, react.useState)();
			const [hoveredDetail, setHoveredDetail] = (0, react.useState)();
			const detailTimer = (0, react.useRef)();
			const stageRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				window.clearTimeout(detailTimer.current);
				setPinnedDetail(void 0);
				setHoveredDetail(void 0);
			}, [battle.id]);
			(0, react.useEffect)(() => () => {
				window.clearTimeout(detailTimer.current);
			}, []);
			const openDetail = (id) => {
				window.clearTimeout(detailTimer.current);
				setHoveredDetail(id);
			};
			(0, react.useEffect)(() => {
				if (pinnedDetail === void 0) return;
				const outside = (event) => {
					if (event.target instanceof Node && !stageRef.current?.contains(event.target)) {
						setPinnedDetail(void 0);
						setHoveredDetail(void 0);
					}
				};
				document.addEventListener("pointerdown", outside);
				return () => {
					document.removeEventListener("pointerdown", outside);
				};
			}, [pinnedDetail]);
			const wild = creatureById(battle.wildCreatureId);
			const active = battle.party[battle.activeIndex];
			const activeSkill = active === void 0 ? void 0 : skillByCreatureId(active.creatureId);
			const activeReady = active !== void 0 && activeSkill !== void 0 && active.energy >= activeSkill.energyCost && !active.skillUsedStage && active.skillSealedStages === 0;
			const canCast = !props.locked && activeReady && battle.turnOwner === "player" && battle.partyHp > 0 && battle.actionsRemaining > 0 && !battle.captureWindow;
			const targetMember = battle.party[battle.enemyTargetIndex ?? battle.activeIndex];
			const targetCreature = targetMember === void 0 ? void 0 : creatureById(targetMember.creatureId);
			const target = battle.enemyTargetScope === "team" ? t("targetTeam") : battle.enemyTargetScope === "self" ? t("targetSelf") : battle.enemyTargetScope === "board" ? t("targetBoard") : targetCreature === void 0 ? t("targetMember") : creatureName(targetCreature, zh);
			const fighter = (member, small = false) => {
				const enemy = member === void 0;
				const creature = enemy ? wild : creatureById(member.creatureId);
				if (creature === void 0) return null;
				const skill = skillByCreatureId(creature.id);
				const id = enemy ? "enemy" : member.instanceId;
				const detailId = `combat-${battle.id}-${id}`;
				const stats = enemy ? void 0 : playerStats(creature.stats, member.level, member.quality);
				const energy = enemy ? battle.bossEnergy : member.energy;
				const maxEnergy = enemy ? 24 : skill?.energyCost ?? 12;
				const ready = enemy ? battle.bossSkillArmed : energy >= maxEnergy && !member.skillUsedStage && member.skillSealedStages === 0;
				const hp = enemy ? props.displayedWildHp : props.displayedPartyHp;
				const maxHp = enemy ? battle.wildMaxHp : battle.partyMaxHp;
				const shield = enemy ? props.displayedWildShield : props.displayedPartyShield;
				const modifiers = enemy ? battle.bossAmplifiers : battle.partyAmplifiers.filter((value) => value.targetInstanceId === void 0 || value.targetInstanceId === id);
				const detailOpen = (pinnedDetail ?? hoveredDetail) === id;
				const portraitCanCast = !enemy && !small && canCast && member.instanceId === active?.instanceId;
				const portraitAction = portraitCanCast ? `${t("castSkill")} · ${zh ? skill?.activeNameZh : skill?.activeNameEn}` : zh ? "战斗详情" : "Battle details";
				return (0, react_jsx_runtime.jsxs)("div", {
					className: `${battle_stage_module_css_default.fighter} ${enemy ? battle_stage_module_css_default.enemy : small ? battle_stage_module_css_default.teammate : battle_stage_module_css_default.active} ${ready ? battle_stage_module_css_default.ready : ""}`,
					"data-detail-open": detailOpen || void 0,
					onPointerEnter: (event) => {
						if (event.pointerType !== "touch") openDetail(id);
					},
					onPointerLeave: (event) => {
						if (event.currentTarget.contains(document.activeElement)) return;
						window.clearTimeout(detailTimer.current);
						detailTimer.current = window.setTimeout(() => {
							setHoveredDetail(void 0);
						}, 160);
					},
					onFocusCapture: () => {
						openDetail(id);
					},
					onBlurCapture: (event) => {
						if (!event.currentTarget.contains(event.relatedTarget)) {
							setPinnedDetail(void 0);
							setHoveredDetail(void 0);
						}
					},
					onKeyDown: (event) => {
						if (event.key === "Escape") {
							event.stopPropagation();
							event.currentTarget.querySelector("button")?.focus({ preventScroll: true });
							setPinnedDetail(void 0);
							setHoveredDetail(void 0);
						}
					},
					children: [
						(0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: battle_stage_module_css_default.portraitButton,
							"data-strike-target": enemy ? "boss" : small ? void 0 : "player",
							"data-can-cast": portraitCanCast || void 0,
							"aria-label": `${creatureName(creature, zh)} · ${portraitAction}`,
							title: portraitAction,
							"aria-describedby": detailId,
							"aria-expanded": detailOpen,
							onClick: () => {
								if (portraitCanCast) {
									window.clearTimeout(detailTimer.current);
									setPinnedDetail(void 0);
									setHoveredDetail(void 0);
									props.onCast(member.instanceId);
								} else {
									setPinnedDetail((value) => value === id ? void 0 : id);
									setHoveredDetail(void 0);
								}
							},
							children: [(0, react_jsx_runtime.jsx)(Portrait, {
								creatureId: creature.id,
								look: enemy ? { level: battle.wildLevel } : props.creatures?.find((value) => value.instanceId === member.instanceId) ?? member,
								reducedMotion: props.reducedMotion
							}), !enemy && (0, react_jsx_runtime.jsxs)("svg", {
								className: battle_stage_module_css_default.halo,
								viewBox: "0 0 100 100",
								"aria-hidden": "true",
								children: [(0, react_jsx_runtime.jsx)("circle", {
									cx: "50",
									cy: "50",
									r: "46"
								}), (0, react_jsx_runtime.jsx)("circle", {
									cx: "50",
									cy: "50",
									r: "46",
									strokeDasharray: "289.03",
									strokeDashoffset: 289.03 * (1 - ratio(energy, maxEnergy))
								})]
							})]
						}),
						enemy ? (0, react_jsx_runtime.jsxs)("div", {
							className: battle_stage_module_css_default.enemyMeters,
							children: [(0, react_jsx_runtime.jsxs)("div", {
								className: battle_stage_module_css_default.hp,
								role: "meter",
								"aria-label": t("health"),
								"aria-valuenow": hp,
								"aria-valuemin": 0,
								"aria-valuemax": maxHp,
								children: [(0, react_jsx_runtime.jsx)("i", { style: { width: `${ratio(hp, maxHp) * 100}%` } }), (0, react_jsx_runtime.jsxs)("span", { children: [
									hp.toLocaleString(),
									" / ",
									maxHp.toLocaleString()
								] })]
							}), (0, react_jsx_runtime.jsx)("div", {
								className: battle_stage_module_css_default.energy,
								role: "meter",
								"aria-label": t("bossEnergy"),
								"aria-valuenow": energy,
								"aria-valuemin": 0,
								"aria-valuemax": maxEnergy,
								children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${ratio(energy, maxEnergy) * 100}%` } })
							})]
						}) : (0, react_jsx_runtime.jsx)("strong", {
							className: battle_stage_module_css_default.portraitName,
							children: creatureName(creature, zh)
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							id: detailId,
							role: "tooltip",
							tabIndex: detailOpen ? 0 : -1,
							className: battle_stage_module_css_default.detail,
							children: [
								(0, react_jsx_runtime.jsx)("strong", { children: creatureName(creature, zh) }),
								(0, react_jsx_runtime.jsxs)("small", { children: [
									"Lv.",
									enemy ? battle.wildLevel : member.level,
									" · ",
									t(CORE_KEYS[enemy ? battle.wildQuality : member.quality]),
									" · ",
									t(ECOLOGY_KEYS[creature.ecology])
								] }),
								(0, react_jsx_runtime.jsxs)("dl", { children: [
									(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: enemy ? t("health") : t("teamRuntime") }), (0, react_jsx_runtime.jsxs)("dd", { children: [
										hp.toLocaleString(),
										" / ",
										maxHp.toLocaleString()
									] })] }),
									(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("energy") }), (0, react_jsx_runtime.jsxs)("dd", { children: [
										energy,
										" / ",
										maxEnergy
									] })] }),
									(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("statCompute") }), (0, react_jsx_runtime.jsx)("dd", { children: enemy ? battle.wildAttack : stats?.attack })] }),
									(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("statGuard") }), (0, react_jsx_runtime.jsx)("dd", { children: enemy ? battle.wildDefense : stats?.defense })] }),
									(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("shield") }), (0, react_jsx_runtime.jsx)("dd", { children: shield.toLocaleString() })] }),
									enemy ? (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("armor") }), (0, react_jsx_runtime.jsx)("dd", { children: battle.wildArmor })] }) : (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("statResponse") }), (0, react_jsx_runtime.jsx)("dd", { children: stats?.speed })] })
								] }),
								!enemy && (0, react_jsx_runtime.jsxs)("small", { children: [member.frozenStages > 0 ? `${t("frozen")} · ` : "", member.skillSealedStages > 0 ? t("skillSealed") : member.skillUsedStage ? t("skillSpent") : ready ? t("skillReady") : t("skillCharging")] }),
								skill !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("p", { children: [(0, react_jsx_runtime.jsxs)("b", { children: [
									t("passiveSkill"),
									" · ",
									zh ? skill.passiveNameZh : skill.passiveNameEn
								] }), zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn] }), (0, react_jsx_runtime.jsxs)("p", { children: [(0, react_jsx_runtime.jsxs)("b", { children: [
									t("activeSkill"),
									" · ",
									zh ? skill.activeNameZh : skill.activeNameEn
								] }), zh ? skill.activeDescriptionZh : skill.activeDescriptionEn] })] }),
								enemy && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("p", { children: [
									(0, react_jsx_runtime.jsxs)("b", { children: [
										t("enemyIntent"),
										" · ",
										t(intentKeys[battle.enemyIntent])
									] }),
									t("enemyIntentMeta", { target }),
									(0, react_jsx_runtime.jsx)("br", {}),
									t(intentDetails[battle.enemyIntent], { count: battle.enemyIntent === "corrupt" ? Math.min(6, 2 + battle.bossSkillTier) : Math.min(5, Math.max(3, battle.bossSkillTier)) })
								] }), (0, react_jsx_runtime.jsxs)("p", { children: [(0, react_jsx_runtime.jsxs)("b", { children: [
									t("towerSkillTier", { tier: battle.bossSkillTier }),
									" · ",
									battle.bossSkillArmed ? t("skillReady") : t("skillCharging")
								] }), t("bossSkillTierDetail", {
									tier: battle.bossSkillTier,
									hazards: Math.min(6, 2 + battle.bossSkillTier),
									locks: Math.min(5, Math.max(3, battle.bossSkillTier))
								})] })] }),
								modifiers.map((value) => (0, react_jsx_runtime.jsxs)("small", { children: [
									zh ? value.stat === "attack" ? "算力增幅" : "防御穿透" : value.stat === "attack" ? "Attack boost" : "Defense penetration",
									" +",
									value.valuePermille / 10,
									"% · ",
									value.remainingRounds,
									" ",
									zh ? "回合" : "rounds"
								] }, `${value.signal}-${value.stat}-${value.scope}`))
							]
						})
					]
				});
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				ref: stageRef,
				className: battle_stage_module_css_default.stage,
				"data-battle-stage": "diagonal",
				"data-reduced": props.reducedMotion || void 0,
				style: {
					"--strike-flight": `${BATTLE_MOTION.flight}ms`,
					"--strike-impact": `${BATTLE_MOTION.impact}ms`,
					"--portrait-duration": `${BATTLE_MOTION.handoff}ms`
				},
				children: [
					(0, react_jsx_runtime.jsx)("style", {
						"data-plugin-css": "codekin-battle-stage",
						children: css$1
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: battle_stage_module_css_default.floor,
						"aria-hidden": "true"
					}),
					(0, react_jsx_runtime.jsxs)("span", {
						className: battle_stage_module_css_default.stageLabel,
						"aria-hidden": "true",
						children: [battle.turnOwner === "boss" ? "ENEMY PHASE" : "YOUR MOVE", (0, react_jsx_runtime.jsx)("i", { children: "◆ CODEKIN" })]
					}),
					fighter(),
					active !== void 0 && fighter(active),
					(0, react_jsx_runtime.jsx)("div", {
						className: battle_stage_module_css_default.damageLane,
						"data-damage-lane": true,
						"aria-live": "polite",
						"aria-atomic": "true",
						children: props.damage !== void 0 && (0, react_jsx_runtime.jsxs)("div", {
							className: battle_stage_module_css_default.damage,
							"data-actor": props.damage.actor,
							"data-settled": props.damage.settled || void 0,
							children: [
								(0, react_jsx_runtime.jsx)("small", { children: t(props.damage.actor === "player" ? "totalDamage" : "enemyDamage") }),
								(0, react_jsx_runtime.jsx)("strong", {
									title: props.damage.total.toLocaleString(),
									children: props.damage.total.toLocaleString()
								}, props.damage.key),
								props.damage.current !== void 0 && !props.damage.settled && (0, react_jsx_runtime.jsxs)("em", { children: ["+", props.damage.current.toLocaleString()] })
							]
						})
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: battle_stage_module_css_default.tray,
						"data-party-tray": true,
						children: [(0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: battle_stage_module_css_default.skill,
							disabled: !canCast,
							onClick: () => {
								if (active !== void 0) props.onCast(active.instanceId);
							},
							title: activeSkill === void 0 ? "" : zh ? activeSkill.activeDescriptionZh : activeSkill.activeDescriptionEn,
							children: [
								(0, react_jsx_runtime.jsxs)("small", { children: [
									t(activeReady ? "castSkill" : "energy"),
									" ",
									(0, react_jsx_runtime.jsxs)("span", { children: [
										active?.energy ?? 0,
										"/",
										activeSkill?.energyCost ?? 12
									] })
								] }),
								(0, react_jsx_runtime.jsx)("strong", { children: activeSkill === void 0 ? "—" : zh ? activeSkill.activeNameZh : activeSkill.activeNameEn }),
								(0, react_jsx_runtime.jsx)("span", {
									className: battle_stage_module_css_default.skillMeter,
									children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${ratio(active?.energy ?? 0, activeSkill?.energyCost ?? 12) * 100}%` } })
								})
							]
						}), [0, 1].map((index) => {
							const member = battle.party.filter((value) => value.instanceId !== active?.instanceId)[index];
							return (0, react_jsx_runtime.jsx)("div", {
								className: battle_stage_module_css_default.teammateSlot,
								children: member === void 0 ? (0, react_jsx_runtime.jsx)("span", {
									className: battle_stage_module_css_default.emptySlot,
									children: "◇"
								}) : fighter(member, true)
							}, index);
						})]
					}),
					props.attack !== void 0 && (0, react_jsx_runtime.jsxs)("div", {
						className: battle_stage_module_css_default.strike,
						"data-actor": props.attack.actor,
						"data-phase": props.attack.phase,
						"aria-hidden": "true",
						style: {
							"--source-x": props.attack.actor === "player" ? "14%" : "79%",
							"--source-y": props.attack.actor === "player" ? "71%" : "22%",
							"--target-x": props.attack.actor === "player" ? "79%" : "14%",
							"--target-y": props.attack.actor === "player" ? "22%" : "71%"
						},
						children: [(0, react_jsx_runtime.jsx)("i", { className: battle_stage_module_css_default.wave }), (0, react_jsx_runtime.jsx)("i", { className: battle_stage_module_css_default.impact })]
					}, props.attack.key)
				]
			});
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/roster.js
		/**
		* Produces a display-only roster projection without mutating authoritative
		* creature or squad order. Equal-level rows retain their capture order.
		*/
		function arrangeCodekinRoster(entries, criteria) {
			const query = criteria.query?.trim().normalize("NFKC").toLocaleLowerCase().replace(/^#/, "") ?? "";
			const visible = entries.filter((entry) => (criteria.ecology === "all" || entry.creature.ecology === criteria.ecology) && (criteria.quality === "all" || entry.captured.quality === criteria.quality) && (query === "" || [
				entry.creature.nameZh,
				entry.creature.nameEn,
				entry.creature.id,
				String(entry.creature.number).padStart(2, "0")
			].some((value) => value.normalize("NFKC").toLocaleLowerCase().includes(query))));
			if (criteria.sort === "default") return visible;
			const direction = criteria.sort === "level-asc" ? 1 : -1;
			return visible.sort((left, right) => (left.captured.level - right.captured.level) * direction || left.sourceIndex - right.sourceIndex);
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/dialog-accessibility.js
		const FOCUSABLE_SELECTOR = [
			"button:not([disabled])",
			"[href]",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"[tabindex]:not([tabindex=\"-1\"])"
		].join(",");
		/** Keeps keyboard focus inside a dialog and restores the invoking control. */
		function useDialogAccessibility(dismiss, dismissalBlocked = false) {
			const dialogRef = (0, react.useRef)(null);
			const returnFocusRef = (0, react.useRef)(typeof document !== "undefined" && document.activeElement instanceof HTMLElement ? document.activeElement : null);
			(0, react.useEffect)(() => {
				const dialog = dialogRef.current;
				if (dialog !== null && !dialog.contains(document.activeElement)) (dialog.querySelector("[data-dialog-initial-focus]:not([disabled])") ?? dialog.querySelector("button:not([disabled]), [href], [tabindex]:not([tabindex=\"-1\"])"))?.focus();
				return () => {
					const target = returnFocusRef.current;
					queueMicrotask(() => {
						if (dialog?.isConnected === true || target?.isConnected !== true) return;
						target.focus();
					});
				};
			}, []);
			return {
				dialogRef,
				onDialogKeyDown: (0, react.useCallback)((event) => {
					if (event.key === "Escape" && dismiss !== void 0 && !dismissalBlocked) {
						event.preventDefault();
						event.stopPropagation();
						dismiss();
						return;
					}
					if (event.key !== "Tab") return;
					const dialog = dialogRef.current;
					if (dialog === null) return;
					const controls = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter((control) => control.tabIndex >= 0 && control.getAttribute("aria-hidden") !== "true" && control.closest("[inert]") === null && control.getClientRects().length > 0);
					if (controls.length === 0) {
						event.preventDefault();
						dialog.focus();
						return;
					}
					const first = controls[0];
					const last = controls.at(-1);
					const active = document.activeElement;
					if (event.shiftKey && (active === first || !dialog.contains(active))) {
						event.preventDefault();
						last.focus();
					} else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
						event.preventDefault();
						first.focus();
					}
				}, [dismiss, dismissalBlocked])
			};
		}
		var creature_appearance_module_css_default = {
			"appearanceIn": "_7wqhea_appearanceIn",
			"appearanceOut": "_7wqhea_appearanceOut",
			"current": "_7wqhea_current",
			"departing": "_7wqhea_departing",
			"evolutionGlow": "_7wqhea_evolutionGlow",
			"evolutionIn": "_7wqhea_evolutionIn",
			"evolutionLabel": "_7wqhea_evolutionLabel",
			"evolutionOut": "_7wqhea_evolutionOut",
			"hanger": "_7wqhea_hanger",
			"hero": "_7wqhea_hero",
			"options": "_7wqhea_options",
			"picker": "_7wqhea_picker",
			"placeholder": "_7wqhea_placeholder",
			"portrait": "_7wqhea_portrait"
		};
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/CreatureAppearance.js
		function CreatureAppearancePortrait(props) {
			const resolved = resolveCreatureSprite(props.creature.id, props.captured);
			const next = {
				identity: props.captured.instanceId,
				level: props.captured.level,
				source: resolved.source,
				appearance: resolved.appearance
			};
			const [visible, setVisible] = (0, react.useState)(next);
			const visibleRef = (0, react.useRef)(visible);
			const previous = (0, react.useRef)(next);
			const [departing, setDeparting] = (0, react.useState)();
			const [phase, setPhase] = (0, react.useState)("none");
			const evolutionEligible = next.level >= 30;
			(0, react.useEffect)(() => {
				let canceled = false;
				let timer;
				const observed = previous.current;
				previous.current = next;
				const mode = appearanceTransition({
					...observed,
					source: visibleRef.current.source
				}, next);
				const show = (appearance) => {
					visibleRef.current = appearance;
					setVisible(appearance);
				};
				if (mode === "none") {
					show(next);
					setDeparting(void 0);
					setPhase("none");
					props.onChanging(false);
					return;
				}
				setPhase("loading");
				props.onChanging(true);
				(async () => {
					let result = next;
					if (result.source !== void 0 && !await decodeCreatureImage(result.source)) {
						result = {
							...next,
							source: resolved.fallback,
							appearance: "original"
						};
						if (result.source !== void 0 && !await decodeCreatureImage(result.source)) result = {
							...result,
							source: void 0
						};
					}
					if (canceled) return;
					const old = visibleRef.current;
					show(result);
					if (props.reducedMotion || old.source === result.source) {
						setDeparting(void 0);
						setPhase("none");
						props.onChanging(false);
						return;
					}
					setDeparting(old);
					setPhase(mode);
					timer = window.setTimeout(() => {
						setDeparting(void 0);
						setPhase("none");
						props.onChanging(false);
					}, APPEARANCE_MOTION[mode] + 30);
				})();
				return () => {
					canceled = true;
					window.clearTimeout(timer);
					props.onChanging(false);
				};
			}, [
				next.identity,
				evolutionEligible,
				next.source,
				next.appearance,
				resolved.fallback,
				props.reducedMotion,
				props.onChanging
			]);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: creature_appearance_module_css_default.portrait,
				"data-appearance-transition": phase,
				"data-creature-instance": props.captured.instanceId,
				style: {
					"--appearance-change": `${APPEARANCE_MOTION.change}ms`,
					"--appearance-evolution": `${APPEARANCE_MOTION.evolution}ms`
				},
				"aria-busy": phase === "loading",
				children: [
					departing?.source !== void 0 && (0, react_jsx_runtime.jsx)("img", {
						className: creature_appearance_module_css_default.departing,
						src: departing.source,
						alt: "",
						draggable: false
					}),
					visible.source === void 0 ? (0, react_jsx_runtime.jsx)("span", {
						className: creature_appearance_module_css_default.placeholder,
						"aria-hidden": "true",
						children: "?"
					}) : (0, react_jsx_runtime.jsx)("img", {
						className: creature_appearance_module_css_default.current,
						src: visible.source,
						alt: "",
						"data-creature-id": props.creature.id,
						"data-creature-level": props.captured.level,
						"data-creature-appearance": visible.appearance,
						decoding: "async",
						draggable: false,
						onError: () => {
							const source = visible.source === resolved.fallback ? void 0 : resolved.fallback;
							const fallback = {
								...visible,
								source,
								appearance: "original"
							};
							visibleRef.current = fallback;
							setVisible(fallback);
						}
					}, `${visible.identity}-${visible.source}`),
					phase === "evolution" && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("i", {
						className: creature_appearance_module_css_default.evolutionGlow,
						"aria-hidden": "true"
					}), (0, react_jsx_runtime.jsx)("span", {
						className: creature_appearance_module_css_default.evolutionLabel,
						role: "status",
						children: props.t("evolutionUnlocked")
					})] })
				]
			});
		}
		function CreatureAppearancePicker(props) {
			const selected = resolveCreatureAppearance(props.captured);
			const selection = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				selection.current?.focus({ preventScroll: true });
			}, []);
			const evolvedAvailable = contentAssetUrl(`creature:${props.creature.id}:evolved`) !== void 0;
			return (0, react_jsx_runtime.jsxs)("section", {
				className: creature_appearance_module_css_default.picker,
				id: "codekin-appearance-picker",
				role: "region",
				"aria-label": props.t("appearanceTitle"),
				onKeyDown: (event) => {
					if (event.key === "Escape") {
						event.preventDefault();
						event.stopPropagation();
						props.onClose();
					}
				},
				children: [(0, react_jsx_runtime.jsxs)("header", { children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("appearanceTitle") }), (0, react_jsx_runtime.jsx)("small", { children: props.t(props.battleActive ? "appearanceBattleLocked" : "appearanceHint") })] }), (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: props.onClose,
					"aria-label": props.t("appearanceClose"),
					children: "×"
				})] }), (0, react_jsx_runtime.jsx)("div", {
					className: creature_appearance_module_css_default.options,
					children: ["original", "evolved"].map((appearance) => {
						const levelLocked = appearance === "evolved" && props.captured.level < 30;
						const missing = appearance === "evolved" && !evolvedAvailable;
						const chosen = selected === appearance;
						return (0, react_jsx_runtime.jsxs)("button", {
							ref: chosen ? selection : void 0,
							type: "button",
							"aria-pressed": chosen,
							"data-appearance-option": appearance,
							disabled: props.busy || props.battleActive || levelLocked || missing,
							onClick: () => {
								if (!chosen && !levelLocked && !missing && !props.busy && !props.battleActive) props.onSelect(appearance);
							},
							children: [
								(0, react_jsx_runtime.jsx)(CreatureSprite, {
									creature: props.creature,
									level: 30,
									appearance,
									size: "large",
									eager: true
								}),
								(0, react_jsx_runtime.jsx)("strong", { children: props.t(appearance === "original" ? "appearanceOriginal" : "appearanceEvolved") }),
								(0, react_jsx_runtime.jsx)("small", { children: levelLocked ? props.t("appearanceUnlockLevel", { level: 30 }) : missing ? props.t("appearanceUnavailable") : chosen ? props.t("appearanceSelected") : props.t("appearanceChoose") })
							]
						}, appearance);
					})
				})]
			});
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/CodekinRosterView.js
		const ROSTER_SORT_KEYS = {
			default: "rosterSortDefault",
			"level-asc": "rosterSortLevelAsc",
			"level-desc": "rosterSortLevelDesc"
		};
		const ROSTER_ECOLOGY_FILTERS = ["all", ...TRACE_ECOLOGIES];
		const ROSTER_QUALITY_FILTERS = ["all", ...CAPTURE_CORE_QUALITIES];
		const ROSTER_SORT_OPTIONS = [
			"default",
			"level-asc",
			"level-desc"
		];
		function materialItemName$1(t, quality) {
			return t("growthMaterialItem", { quality: t(CORE_KEYS[quality]) });
		}
		function CodekinView(props) {
			const [editing, setEditing] = (0, react.useState)(false);
			const [filtersOpen, setFiltersOpen] = (0, react.useState)(false);
			const [ecologyFilter, setEcologyFilter] = (0, react.useState)("all");
			const [qualityFilter, setQualityFilter] = (0, react.useState)("all");
			const [rosterSort, setRosterSort] = (0, react.useState)("default");
			const [query, setQuery] = (0, react.useState)("");
			(0, react.useEffect)(() => {
				props.onEditingChange?.(editing);
			}, [editing, props.onEditingChange]);
			const roster = (0, react.useMemo)(() => {
				const entries = [];
				props.state.creatures.forEach((captured, sourceIndex) => {
					const creature = creatureById(captured.creatureId);
					if (creature !== void 0) entries.push({
						captured,
						creature,
						sourceIndex
					});
				});
				return entries;
			}, [props.state.creatures]);
			const visibleRoster = (0, react.useMemo)(() => editing ? roster : arrangeCodekinRoster(roster, {
				ecology: ecologyFilter,
				quality: qualityFilter,
				sort: rosterSort,
				query
			}), [
				editing,
				ecologyFilter,
				qualityFilter,
				query,
				roster,
				rosterSort
			]);
			const activeFilterCount = Number(ecologyFilter !== "all") + Number(qualityFilter !== "all") + Number(rosterSort !== "default") + Number(query.trim().length > 0);
			const toggle = (instanceId) => {
				if (props.draft.includes(instanceId)) {
					if (props.draft.length > 1) props.setDraft(props.draft.filter((id) => id !== instanceId));
					return;
				}
				if (props.draft.length < 3) props.setDraft([...props.draft, instanceId]);
			};
			const beginEditing = () => {
				props.setDraft([...props.state.squad]);
				setFiltersOpen(false);
				setEditing(true);
			};
			const cancelEditing = () => {
				props.setDraft([...props.state.squad]);
				setEditing(false);
			};
			const save = async () => {
				if (await props.save()) setEditing(false);
			};
			const resetFilters = () => {
				setEcologyFilter("all");
				setQualityFilter("all");
				setRosterSort("default");
				setQuery("");
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: `${tracewild_module_css_default.panelPage} ${editing ? tracewild_module_css_default.codekinEditMode : ""}`,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: tracewild_module_css_default.pageHeading,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("span", {
								className: tracewild_module_css_default.sectionKicker,
								children: "YOUR COLLECTION"
							}),
							(0, react_jsx_runtime.jsx)("h2", { children: props.t("squad") }),
							(0, react_jsx_runtime.jsx)("p", { children: props.t(editing ? "squadEditHelp" : "squadHelp") })
						] }), (0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.squadActions,
							children: editing ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)("span", { children: props.t("squadSelection", { count: props.draft.length }) }),
								(0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: tracewild_module_css_default.squadCancel,
									disabled: props.busy,
									onClick: cancelEditing,
									children: props.t("cancelSquad")
								}),
								(0, react_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: props.busy || props.draft.length === 0,
									onClick: () => {
										save();
									},
									children: props.t("saveSquad")
								})
							] }) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `${tracewild_module_css_default.squadFilterToggle} ${activeFilterCount > 0 ? tracewild_module_css_default.squadFilterActive : ""}`,
								disabled: props.busy,
								"aria-expanded": filtersOpen,
								"aria-controls": "codekin-roster-controls",
								onClick: () => {
									setFiltersOpen((value) => !value);
								},
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "≡"
									}),
									props.t("rosterClassify"),
									activeFilterCount > 0 && (0, react_jsx_runtime.jsx)("b", { children: activeFilterCount })
								]
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: props.busy,
								onClick: beginEditing,
								children: props.t("editSquad")
							})] })
						})]
					}),
					editing ? (0, react_jsx_runtime.jsx)("div", {
						className: tracewild_module_css_default.squadSlots,
						"aria-label": props.t("squadSelection", { count: props.draft.length }),
						children: [
							0,
							1,
							2
						].map((index) => {
							const entry = roster.find((row) => row.captured.instanceId === props.draft[index]);
							return (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: props.busy || entry === void 0 || props.draft.length <= 1,
								"aria-label": props.t("squadSlot", {
									slot: index + 1,
									name: entry === void 0 ? props.t("emptySlot") : creatureName(entry.creature, props.zh)
								}),
								onClick: () => {
									if (entry !== void 0) toggle(entry.captured.instanceId);
								},
								children: [
									(0, react_jsx_runtime.jsxs)("b", { children: ["0", index + 1] }),
									entry === void 0 ? (0, react_jsx_runtime.jsx)("span", { children: "＋" }) : (0, react_jsx_runtime.jsx)(CreatureSprite, {
										creature: entry.creature,
										captured: entry.captured,
										size: "small"
									}),
									(0, react_jsx_runtime.jsx)("small", { children: entry === void 0 ? props.t("emptySlot") : creatureName(entry.creature, props.zh) })
								]
							}, index);
						})
					}) : (0, react_jsx_runtime.jsxs)("div", {
						className: tracewild_module_css_default.rosterSearch,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "⌕"
							}),
							(0, react_jsx_runtime.jsx)("input", {
								type: "search",
								maxLength: 80,
								value: query,
								"aria-label": props.t("searchCodekin"),
								placeholder: props.t("searchCodekin"),
								onChange: (event) => {
									setQuery(event.target.value);
								}
							}),
							(0, react_jsx_runtime.jsxs)("small", {
								"aria-live": "polite",
								children: [
									visibleRoster.length,
									" / ",
									roster.length
								]
							})
						]
					}),
					!editing && filtersOpen && (0, react_jsx_runtime.jsxs)("section", {
						id: "codekin-roster-controls",
						className: tracewild_module_css_default.rosterControls,
						"aria-label": props.t("rosterControls"),
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.rosterControlRow,
								children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("rosterAttribute") }), (0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.rosterControlOptions,
									role: "group",
									"aria-label": props.t("rosterAttribute"),
									children: ROSTER_ECOLOGY_FILTERS.map((ecology) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": ecologyFilter === ecology,
										onClick: () => {
											setEcologyFilter(ecology);
										},
										children: ecology === "all" ? props.t("rosterAll") : props.t(ECOLOGY_KEYS[ecology])
									}, ecology))
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.rosterControlRow,
								children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("quality") }), (0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.rosterControlOptions,
									role: "group",
									"aria-label": props.t("quality"),
									children: ROSTER_QUALITY_FILTERS.map((quality) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: quality === "all" ? void 0 : tracewild_module_css_default[`core_${quality}`],
										"aria-pressed": qualityFilter === quality,
										onClick: () => {
											setQualityFilter(quality);
										},
										children: quality === "all" ? props.t("rosterAll") : props.t(CORE_KEYS[quality])
									}, quality))
								})]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.rosterControlRow,
								children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("rosterSort") }), (0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.rosterControlOptions,
									role: "group",
									"aria-label": props.t("rosterSort"),
									children: ROSTER_SORT_OPTIONS.map((sort) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": rosterSort === sort,
										onClick: () => {
											setRosterSort(sort);
										},
										children: props.t(ROSTER_SORT_KEYS[sort])
									}, sort))
								})]
							}),
							(0, react_jsx_runtime.jsxs)("footer", {
								className: tracewild_module_css_default.rosterControlSummary,
								children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("rosterResults", { count: visibleRoster.length }) }), (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: activeFilterCount === 0,
									onClick: resetFilters,
									children: props.t("rosterReset")
								})]
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: tracewild_module_css_default.creatureCards,
						children: visibleRoster.map(({ captured, creature }) => {
							const draftPosition = props.draft.indexOf(captured.instanceId);
							const squadPosition = props.state.squad.indexOf(captured.instanceId);
							const deployed = squadPosition >= 0;
							const selectionLocked = editing && draftPosition < 0 && props.draft.length >= 3;
							return (0, react_jsx_runtime.jsxs)("article", {
								className: `${tracewild_module_css_default.creatureCard} ${tracewild_module_css_default.codekinCard} ${tracewild_module_css_default[`core_${captured.quality}`]} ${deployed ? tracewild_module_css_default.codekinDeployed : ""} ${editing && draftPosition >= 0 ? tracewild_module_css_default.creatureSelected : ""} ${selectionLocked ? tracewild_module_css_default.codekinSelectionLocked : ""}`,
								"data-quality": captured.quality,
								"data-deployed": deployed ? "true" : void 0,
								onPointerMove: (event) => {
									if (event.pointerType !== "mouse" || event.currentTarget.closest("[data-motion=\"reduce\"]") !== null) return;
									const rect = event.currentTarget.getBoundingClientRect();
									event.currentTarget.style.setProperty("--tilt-x", `${(.5 - (event.clientY - rect.top) / rect.height) * 5}deg`);
									event.currentTarget.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - .5) * 6}deg`);
								},
								onPointerLeave: (event) => {
									event.currentTarget.style.setProperty("--tilt-x", "0deg");
									event.currentTarget.style.setProperty("--tilt-y", "0deg");
								},
								children: [
									(0, react_jsx_runtime.jsxs)("span", {
										className: tracewild_module_css_default.codekinNumber,
										children: ["#", String(creature.number).padStart(2, "0")]
									}),
									editing && draftPosition >= 0 && (0, react_jsx_runtime.jsx)("span", {
										className: tracewild_module_css_default.partyIndex,
										children: draftPosition + 1
									}),
									!editing && deployed && (0, react_jsx_runtime.jsxs)("span", {
										className: tracewild_module_css_default.codekinDeployment,
										children: [
											(0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
											props.t("rosterDeployed"),
											(0, react_jsx_runtime.jsx)("b", { children: squadPosition + 1 })
										]
									}),
									(0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: tracewild_module_css_default.creatureSelect,
										disabled: props.busy || selectionLocked || editing && draftPosition >= 0 && props.draft.length === 1,
										"aria-pressed": editing ? draftPosition >= 0 : void 0,
										"aria-label": editing ? `${creatureName(creature, props.zh)} · ${props.t("squadSelection", { count: props.draft.length })}` : `${creatureName(creature, props.zh)} · ${props.t("level")} ${captured.level} · ${props.t(ECOLOGY_KEYS[creature.ecology])} · ${props.t(CORE_KEYS[captured.quality])}${deployed ? ` · ${props.t("rosterDeployed")} ${squadPosition + 1}` : ""} · ${props.t("codekinDetail")}`,
										onClick: () => {
											editing ? toggle(captured.instanceId) : props.inspect(captured.instanceId);
										},
										children: [
											(0, react_jsx_runtime.jsx)(CreatureSprite, {
												creature,
												captured,
												size: "medium"
											}),
											(0, react_jsx_runtime.jsx)("strong", { children: creatureName(creature, props.zh) }),
											(0, react_jsx_runtime.jsxs)("span", {
												className: tracewild_module_css_default.codekinBasics,
												children: [
													(0, react_jsx_runtime.jsxs)("b", { children: ["Lv.", captured.level] }),
													(0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
													(0, react_jsx_runtime.jsx)("span", { children: props.t(ECOLOGY_KEYS[creature.ecology]) })
												]
											}),
											(0, react_jsx_runtime.jsxs)("small", { children: [
												props.t(CORE_KEYS[captured.quality]),
												" · ",
												props.t(RARITY_KEYS[creature.rarity])
											] })
										]
									})
								]
							}, captured.instanceId);
						})
					}),
					!editing && visibleRoster.length === 0 && (0, react_jsx_runtime.jsxs)("div", {
						className: tracewild_module_css_default.rosterEmpty,
						children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("rosterNoMatches") }), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: resetFilters,
							children: props.t("rosterReset")
						})]
					})
				]
			});
		}
		function CodekinDetailModal(props) {
			const [appearanceOpen, setAppearanceOpen] = (0, react.useState)(false);
			const [appearanceChanging, setAppearanceChanging] = (0, react.useState)(false);
			const hanger = (0, react.useRef)(null);
			const closeAppearance = () => {
				setAppearanceOpen(false);
				hanger.current?.focus({ preventScroll: true });
			};
			const dialog = useDialogAccessibility(props.dismiss, props.busy);
			const stats = playerStats(props.creature.stats, props.captured.level, props.captured.quality);
			const skill = skillByCreatureId(props.creature.id);
			const levelBaseXp = totalXpForLevel(props.captured.level, props.captured.quality);
			const progress = Math.max(0, props.captured.xp - levelBaseXp);
			const needed = props.captured.level >= 100 ? 0 : xpToNextLevel(props.captured.level, props.captured.quality);
			const progressPercent = needed <= 0 ? 100 : Math.min(100, Math.round(progress / needed * 100));
			return (0, react_jsx_runtime.jsx)("div", {
				className: `${tracewild_module_css_default.modalBackdrop} ${tracewild_module_css_default.codekinDetailBackdrop}`,
				onClick: (event) => {
					if (event.target === event.currentTarget && !props.busy) props.dismiss();
				},
				children: (0, react_jsx_runtime.jsxs)("section", {
					ref: dialog.dialogRef,
					className: tracewild_module_css_default.codekinDetailModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "codekin-detail-title",
					tabIndex: -1,
					onKeyDown: (event) => {
						if (appearanceOpen && event.key === "Escape") {
							event.preventDefault();
							event.stopPropagation();
							closeAppearance();
						} else dialog.onDialogKeyDown(event);
					},
					onClick: (event) => {
						event.stopPropagation();
					},
					children: [
						(0, react_jsx_runtime.jsx)("button", {
							ref: hanger,
							type: "button",
							className: creature_appearance_module_css_default.hanger,
							disabled: props.busy,
							"aria-label": props.t("appearanceTitle"),
							title: props.t("appearanceTitle"),
							"aria-expanded": appearanceOpen,
							"aria-controls": "codekin-appearance-picker",
							onClick: () => {
								setAppearanceOpen((value) => !value);
							},
							children: (0, react_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								"aria-hidden": "true",
								children: (0, react_jsx_runtime.jsx)("path", { d: "M9 6a3 3 0 1 1 4.5 2.6c-1 .5-1.5 1-1.5 2.4v1M12 12 3 18v2h18v-2l-9-6Z" })
							})
						}),
						(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: tracewild_module_css_default.codekinDetailClose,
							disabled: props.busy,
							onClick: props.dismiss,
							title: props.t("closeCodekinDetail"),
							"aria-label": props.t("closeCodekinDetail"),
							"data-dialog-initial-focus": true,
							autoFocus: true,
							children: (0, react_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "×"
							})
						}),
						(0, react_jsx_runtime.jsxs)("header", {
							className: `${tracewild_module_css_default.codekinDetailHero} ${creature_appearance_module_css_default.hero}`,
							children: [(0, react_jsx_runtime.jsx)(CreatureAppearancePortrait, {
								captured: props.captured,
								creature: props.creature,
								t: props.t,
								reducedMotion: props.reducedMotion ?? false,
								onChanging: setAppearanceChanging
							}), (0, react_jsx_runtime.jsxs)("div", { children: [
								(0, react_jsx_runtime.jsxs)("p", { children: ["CODEKIN #", String(props.creature.number).padStart(2, "0")] }),
								(0, react_jsx_runtime.jsx)("h2", {
									id: "codekin-detail-title",
									children: creatureName(props.creature, props.zh)
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.codekinDetailTags,
									children: [
										(0, react_jsx_runtime.jsx)("span", { children: props.t(ECOLOGY_KEYS[props.creature.ecology]) }),
										(0, react_jsx_runtime.jsx)("span", { children: props.t(RARITY_KEYS[props.creature.rarity]) }),
										(0, react_jsx_runtime.jsx)("span", { children: props.t(CORE_KEYS[props.captured.quality]) })
									]
								}),
								(0, react_jsx_runtime.jsxs)("small", { children: [
									props.t("level"),
									" ",
									props.captured.level,
									" · ",
									props.t("wins"),
									" ",
									props.captured.wins
								] })
							] })]
						}),
						appearanceOpen && (0, react_jsx_runtime.jsx)(CreatureAppearancePicker, {
							captured: props.captured,
							creature: props.creature,
							t: props.t,
							busy: props.busy || appearanceChanging,
							battleActive: props.state.battle !== void 0,
							onClose: closeAppearance,
							onSelect: (appearance) => {
								if (props.busy || appearanceChanging || props.state.battle !== void 0) return;
								props.act({
									type: "set-creature-appearance",
									creatureInstanceId: props.captured.instanceId,
									appearance
								}).then((response) => {
									if (response !== void 0) closeAppearance();
								});
							}
						}),
						(0, react_jsx_runtime.jsxs)("section", {
							className: tracewild_module_css_default.codekinDetailSection,
							children: [(0, react_jsx_runtime.jsx)("h3", { children: props.t("codekinStats") }), (0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.codekinDetailStats,
								children: [
									(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.hp.toLocaleString() }), props.t("statRuntime")] }),
									(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.attack.toLocaleString() }), props.t("statCompute")] }),
									(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.defense.toLocaleString() }), props.t("statGuard")] }),
									(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.speed.toLocaleString() }), props.t("statResponse")] })
								]
							})]
						}),
						skill !== void 0 && (0, react_jsx_runtime.jsxs)("section", {
							className: tracewild_module_css_default.codekinDetailSection,
							children: [(0, react_jsx_runtime.jsx)("h3", { children: props.t("codekinProtocols") }), (0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.codekinProtocols,
								children: [(0, react_jsx_runtime.jsxs)("article", { children: [
									(0, react_jsx_runtime.jsx)("span", { children: props.t("passiveSkill") }),
									(0, react_jsx_runtime.jsx)("strong", { children: props.zh ? skill.passiveNameZh : skill.passiveNameEn }),
									(0, react_jsx_runtime.jsx)("p", { children: props.zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn })
								] }), (0, react_jsx_runtime.jsxs)("article", { children: [
									(0, react_jsx_runtime.jsxs)("span", { children: [
										props.t("activeSkill"),
										" · ",
										skill.energyCost,
										" ",
										props.t("energy")
									] }),
									(0, react_jsx_runtime.jsx)("strong", { children: props.zh ? skill.activeNameZh : skill.activeNameEn }),
									(0, react_jsx_runtime.jsx)("p", { children: props.zh ? skill.activeDescriptionZh : skill.activeDescriptionEn })
								] })]
							})]
						}),
						(0, react_jsx_runtime.jsxs)("section", {
							className: `${tracewild_module_css_default.codekinDetailSection} ${tracewild_module_css_default.codekinGrowth}`,
							children: [
								(0, react_jsx_runtime.jsxs)("header", { children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", { children: props.t("growth") }), (0, react_jsx_runtime.jsx)("small", { children: props.captured.level >= 100 ? props.t("levelCap") : `${props.t("xp")} ${progress}/${needed}` })] }), (0, react_jsx_runtime.jsxs)("b", {
									className: tracewild_module_css_default.levelPulse,
									children: ["Lv.", props.captured.level]
								}, props.captured.level)] }),
								(0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.growthXpTrack,
									"aria-hidden": "true",
									children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${progressPercent}%` } })
								}),
								(0, react_jsx_runtime.jsx)("p", { children: props.t("growthMaterialChoice") }),
								(0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.codekinGrowthActions,
									children: CAPTURE_CORE_QUALITIES.map((quality) => (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: tracewild_module_css_default[`core_${quality}`],
										disabled: props.busy || appearanceChanging || props.captured.level >= 100 || props.state.materials[quality] <= 0,
										onClick: () => {
											props.act({
												type: "feed-material",
												creatureInstanceId: props.captured.instanceId,
												quality,
												count: 1
											});
										},
										title: `${props.t("feed")} · ${materialItemName$1(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`,
										"aria-label": `${props.t("feed")} ${materialItemName$1(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`,
										children: [
											(0, react_jsx_runtime.jsx)("i", { className: tracewild_module_css_default.materialShard }),
											(0, react_jsx_runtime.jsx)("strong", { children: props.t(CORE_KEYS[quality]) }),
											(0, react_jsx_runtime.jsxs)("span", { children: ["+", MATERIAL_XP[quality]] }),
											(0, react_jsx_runtime.jsxs)("small", { children: ["×", props.state.materials[quality]] })
										]
									}, quality))
								})
							]
						}),
						(0, react_jsx_runtime.jsx)("footer", {
							className: tracewild_module_css_default.codekinDetailFooter,
							children: (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.codekinReleaseFromDetail,
								disabled: props.busy || props.state.creatures.length <= 1,
								title: props.state.creatures.length <= 1 ? props.t("releaseLastBlocked") : props.t("releaseCreature"),
								onClick: props.release,
								children: props.t("releaseCreature")
							})
						})
					]
				})
			});
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/motion.js
		function stepSpring(state, target, elapsed) {
			const position = { ...state.position };
			const velocity = { ...state.velocity };
			let remaining = Math.min(.05, Math.max(0, elapsed));
			while (remaining > 0) {
				const dt = Math.min(remaining, 1 / 120);
				for (const axis of ["x", "y"]) {
					velocity[axis] += ((target[axis] - position[axis]) * 320 - velocity[axis] * 29) * dt;
					position[axis] += velocity[axis] * dt;
				}
				remaining -= dt;
			}
			return {
				position,
				velocity
			};
		}
		function projectRelease(position, velocity) {
			return {
				x: position.x + Math.max(-76, Math.min(76, velocity.x * .11)),
				y: position.y + Math.max(-76, Math.min(76, velocity.y * .11))
			};
		}
		function boardNeighbour(index, key, size = 8) {
			const row = Math.floor(index / size);
			const column = index % size;
			if (key === "ArrowLeft") return row * size + Math.max(0, column - 1);
			if (key === "ArrowRight") return row * size + Math.min(size - 1, column + 1);
			if (key === "ArrowUp") return Math.max(0, row - 1) * size + column;
			if (key === "ArrowDown") return Math.min(size - 1, row + 1) * size + column;
			if (key === "Home") return row * size;
			if (key === "End") return row * size + size - 1;
			return index;
		}
		const PREFERENCES_KEY = "codekin.ui.v1";
		function readUiPreferences() {
			try {
				const raw = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? "{}");
				if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return {};
				const row = raw;
				const point = (value) => {
					if (value === null || typeof value !== "object") return void 0;
					const item = value;
					return typeof item.x === "number" && typeof item.y === "number" && Number.isFinite(item.x) && Number.isFinite(item.y) && Math.abs(item.x) < 1e5 && Math.abs(item.y) < 1e5 ? {
						x: item.x,
						y: item.y
					} : void 0;
				};
				return {
					...typeof row.reducedMotion === "boolean" ? { reducedMotion: row.reducedMotion } : {},
					...point(row.windowPosition) === void 0 ? {} : { windowPosition: point(row.windowPosition) },
					...point(row.launcherPosition) === void 0 ? {} : { launcherPosition: point(row.launcherPosition) }
				};
			} catch {
				return {};
			}
		}
		function saveUiPreferences(update) {
			try {
				localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
					...readUiPreferences(),
					...update
				}));
			} catch {}
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/use-motion.js
		function useReducedMotion(preference) {
			const [system, setSystem] = (0, react.useState)(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
			(0, react.useEffect)(() => {
				const media = window.matchMedia("(prefers-reduced-motion: reduce)");
				const update = () => {
					setSystem(media.matches);
				};
				update();
				media.addEventListener("change", update);
				return () => {
					media.removeEventListener("change", update);
				};
			}, []);
			return {
				reducedMotion: preference ?? system,
				systemReducedMotion: system
			};
		}
		/** One finite spring per surface; idle surfaces schedule no animation frames. */
		function useSpringAnimation(reducedMotion) {
			const frame = (0, react.useRef)();
			const finish = (0, react.useRef)();
			const stop = (0, react.useCallback)(() => {
				if (frame.current !== void 0) cancelAnimationFrame(frame.current);
				frame.current = void 0;
				finish.current = void 0;
			}, []);
			const animate = (0, react.useCallback)((from, target, velocity, paint, commit) => {
				stop();
				const complete = () => {
					stop();
					paint(target);
					commit(target);
				};
				if (reducedMotion || document.hidden) {
					complete();
					return;
				}
				finish.current = complete;
				let state = {
					position: from,
					velocity
				};
				let last = performance.now();
				const started = last;
				const tick = (now) => {
					state = stepSpring(state, target, (now - last) / 1e3);
					last = now;
					paint(state.position);
					if (now - started >= 900 || Math.hypot(state.position.x - target.x, state.position.y - target.y) < .2 && Math.hypot(state.velocity.x, state.velocity.y) < 3) {
						complete();
						return;
					}
					frame.current = requestAnimationFrame(tick);
				};
				frame.current = requestAnimationFrame(tick);
			}, [reducedMotion, stop]);
			(0, react.useEffect)(() => {
				const onVisibility = () => {
					if (document.hidden) finish.current?.();
				};
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					document.removeEventListener("visibilitychange", onVisibility);
					stop();
				};
			}, [stop]);
			(0, react.useEffect)(() => {
				if (reducedMotion) finish.current?.();
			}, [reducedMotion]);
			return {
				animate,
				stop
			};
		}
		/** Gravity-based fragments, owned by this layer and capped even during long cascades. */
		function useParticleField(reducedMotion, particleClass) {
			const layer = (0, react.useRef)(null);
			const animations = (0, react.useRef)(/* @__PURE__ */ new Set());
			const clear = (0, react.useCallback)(() => {
				for (const animation of animations.current) animation.cancel();
				animations.current.clear();
				layer.current?.replaceChildren();
			}, []);
			(0, react.useEffect)(() => {
				const hide = () => {
					if (document.hidden) clear();
				};
				document.addEventListener("visibilitychange", hide);
				return () => {
					document.removeEventListener("visibilitychange", hide);
					clear();
				};
			}, [clear]);
			(0, react.useEffect)(() => {
				if (reducedMotion) clear();
			}, [clear, reducedMotion]);
			return {
				layer,
				burst: (0, react.useCallback)((clientX, clientY, color, count = 9) => {
					const root = layer.current;
					if (reducedMotion || document.hidden || root === null || typeof root.animate !== "function") return;
					const rect = root.getBoundingClientRect();
					const available = Math.max(0, 72 - animations.current.size);
					const total = Math.min(count, available);
					for (let index = 0; index < total; index += 1) {
						const angle = index / Math.max(1, total) * Math.PI * 2 - Math.PI / 2;
						const speed = 55 + index * 37 % 85;
						const vx = Math.cos(angle) * speed;
						const vy = Math.sin(angle) * speed - 45;
						const duration = 440 + index % 4 * 45;
						const particle = document.createElement("i");
						particle.className = particleClass;
						particle.style.left = `${clientX - rect.left}px`;
						particle.style.top = `${clientY - rect.top}px`;
						particle.style.background = color;
						root.appendChild(particle);
						const keyframes = Array.from({ length: 9 }, (_, step) => {
							const progress = step / 8;
							const time = duration / 1e3 * progress;
							return {
								transform: `translate(${vx * time}px, ${vy * time + 210 * time * time}px) rotate(${progress * (index % 2 ? 210 : -180)}deg) scale(${1 - progress * .7})`,
								opacity: Math.min(1, (1 - progress) * 2.2)
							};
						});
						const animation = particle.animate(keyframes, {
							duration,
							easing: "linear",
							fill: "forwards"
						});
						animations.current.add(animation);
						const remove = () => {
							animations.current.delete(animation);
							particle.remove();
						};
						animation.onfinish = remove;
						animation.oncancel = remove;
					}
				}, [particleClass, reducedMotion])
			};
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/TraceWildOverlay.js
		function sampleDrag(drag, event) {
			const now = performance.now();
			const dt = Math.max(8, now - drag.lastTime) / 1e3;
			drag.velocity = {
				x: Math.max(-1500, Math.min(1500, (event.clientX - drag.lastX) / dt * .55 + drag.velocity.x * .45)),
				y: Math.max(-1500, Math.min(1500, (event.clientY - drag.lastY) / dt * .55 + drag.velocity.y * .45))
			};
			drag.lastX = event.clientX;
			drag.lastY = event.clientY;
			drag.lastTime = now;
		}
		const TAB_ICONS = {
			map: "◌",
			tower: "⌁",
			squad: "◇",
			dex: "⊞",
			inventory: "⋮"
		};
		function clampWindowPosition(x, y, width, height) {
			const margin = 8;
			const visibleGrabStrip = Math.min(104, width);
			const horizontalTravel = Math.max(0, (window.innerWidth + width) / 2 - visibleGrabStrip - margin);
			const verticalTravel = Math.max(0, (window.innerHeight - height) / 2 - margin);
			return {
				x: Math.max(-horizontalTravel, Math.min(horizontalTravel, x)),
				y: Math.max(-verticalTravel, Math.min(verticalTravel, y))
			};
		}
		function clampFloatingPosition(x, y, width, height) {
			const margin = 8;
			return {
				x: Math.max(margin, Math.min(window.innerWidth - width - margin, x)),
				y: Math.max(margin, Math.min(window.innerHeight - height - margin, y))
			};
		}
		function coreItemName(t, quality) {
			return t("captureCoreItem", { quality: t(CORE_KEYS[quality]) });
		}
		function materialItemName(t, quality) {
			return t("growthMaterialItem", { quality: t(CORE_KEYS[quality]) });
		}
		function acquiredItemsBetween(previous, current) {
			const items = [];
			for (const quality of CAPTURE_CORE_QUALITIES) {
				const cores = current.cores[quality] - previous.cores[quality];
				if (cores > 0) items.push({
					kind: "core",
					quality,
					quantity: cores
				});
				const materials = current.materials[quality] - previous.materials[quality];
				if (materials > 0) items.push({
					kind: "material",
					quality,
					quantity: materials
				});
			}
			const previousCreatures = new Set(previous.creatures.map((creature) => creature.instanceId));
			for (const creature of current.creatures) if (!previousCreatures.has(creature.instanceId)) items.push({
				kind: "creature",
				creatureId: creature.creatureId,
				quality: creature.quality,
				quantity: 1,
				captured: creature
			});
			return items;
		}
		function idleRewardItems(reward) {
			const items = [];
			if (reward.coreQuality !== void 0) items.push({
				kind: "core",
				quality: reward.coreQuality,
				quantity: 1
			});
			for (const quality of CAPTURE_CORE_QUALITIES) {
				const quantity = reward.materials[quality];
				if (quantity > 0) items.push({
					kind: "material",
					quality,
					quantity
				});
			}
			return items;
		}
		function RewardItemTile(props) {
			const creature = props.item.kind === "creature" ? creatureById(props.item.creatureId) : void 0;
			const name = props.item.kind === "core" ? coreItemName(props.t, props.item.quality) : props.item.kind === "material" ? materialItemName(props.t, props.item.quality) : creature === void 0 ? props.item.creatureId : creatureName(creature, props.zh);
			const description = props.item.kind === "core" ? props.t("captureCoreDescription", { power: CORE_CAPTURE_POWER[props.item.quality].toFixed(2) }) : props.item.kind === "material" ? props.t("growthMaterialDescription", { xp: MATERIAL_XP[props.item.quality] }) : props.t("creatureItemDescription", {
				quality: props.t(CORE_KEYS[props.item.quality]),
				ecology: creature === void 0 ? "—" : props.t(ECOLOGY_KEYS[creature.ecology])
			});
			return (0, react_jsx_runtime.jsxs)("span", {
				className: `${tracewild_module_css_default.rewardItem} ${props.compact ? tracewild_module_css_default.rewardItemCompact : ""} ${tracewild_module_css_default[`core_${props.item.quality}`]}`,
				...props.compact ? {} : { tabIndex: 0 },
				"aria-label": `${name} × ${props.item.quantity}. ${description}`,
				children: [
					props.item.kind === "core" && (0, react_jsx_runtime.jsx)("span", {
						className: `${tracewild_module_css_default.bigCore} ${tracewild_module_css_default[`core_${props.item.quality}`]}`,
						"aria-hidden": "true"
					}),
					props.item.kind === "material" && (0, react_jsx_runtime.jsx)("span", {
						className: tracewild_module_css_default.materialShard,
						"aria-hidden": "true"
					}),
					creature !== void 0 && (0, react_jsx_runtime.jsx)(CreatureSprite, {
						creature,
						captured: props.item.kind === "creature" ? props.item.captured : void 0,
						size: props.compact ? "tiny" : "small"
					}),
					(0, react_jsx_runtime.jsx)("strong", { children: name }),
					(0, react_jsx_runtime.jsxs)("b", { children: ["×", props.item.quantity] }),
					!props.compact && (0, react_jsx_runtime.jsxs)("span", {
						className: tracewild_module_css_default.itemTooltip,
						role: "tooltip",
						children: [(0, react_jsx_runtime.jsx)("strong", { children: name }), (0, react_jsx_runtime.jsx)("small", { children: description })]
					})
				]
			});
		}
		function IdleRewardButton(props) {
			return (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `${tracewild_module_css_default.idleClaimButton} ${props.floating ? tracewild_module_css_default.idleClaimFloating : ""}`,
				disabled: props.busy,
				onClick: props.claim,
				"aria-label": props.t("claimIdleReward"),
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: tracewild_module_css_default.rewardCrate,
						"aria-hidden": "true"
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: tracewild_module_css_default.idleClaimPulse,
						"aria-hidden": "true"
					}),
					(0, react_jsx_runtime.jsxs)("span", {
						className: tracewild_module_css_default.idleClaimTooltip,
						role: "tooltip",
						children: [
							(0, react_jsx_runtime.jsx)("strong", { children: props.t("idleRewardReady") }),
							(0, react_jsx_runtime.jsx)("small", { children: props.t("idleRewardMinutes", { minutes: props.reward.elapsedMinutes }) }),
							(0, react_jsx_runtime.jsx)("span", { children: idleRewardItems(props.reward).map((item, index) => (0, react_jsx_runtime.jsx)(RewardItemTile, {
								item,
								t: props.t,
								zh: props.zh,
								compact: true
							}, `${item.kind}-${item.quality}-${index}`)) })
						]
					})
				]
			});
		}
		function AcquiredItemsModal(props) {
			const dialog = useDialogAccessibility(props.dismiss);
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.rewardBackdrop,
				onClick: (event) => {
					if (event.target === event.currentTarget) props.dismiss();
				},
				children: (0, react_jsx_runtime.jsxs)("section", {
					ref: dialog.dialogRef,
					className: tracewild_module_css_default.rewardModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "tracewild-reward-title",
					tabIndex: -1,
					onKeyDown: dialog.onDialogKeyDown,
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: tracewild_module_css_default.rewardHalo,
							"aria-hidden": "true"
						}),
						(0, react_jsx_runtime.jsx)("p", { children: props.t("rewardKicker") }),
						(0, react_jsx_runtime.jsx)("h2", {
							id: "tracewild-reward-title",
							children: props.t("rewardTitle")
						}),
						(0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.rewardItems,
							children: props.items.map((item, index) => (0, react_jsx_runtime.jsx)(RewardItemTile, {
								item,
								t: props.t,
								zh: props.zh
							}, `${item.kind}-${item.quality}-${item.kind === "creature" ? item.creatureId : index}`))
						}),
						(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: tracewild_module_css_default.rewardDismissButton,
							"data-dialog-initial-focus": true,
							onClick: props.dismiss,
							children: props.t("rewardDismiss")
						})
					]
				})
			});
		}
		function ReleaseCreatureModal(props) {
			const dialog = useDialogAccessibility(props.dismiss, props.busy);
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.modalBackdrop,
				onMouseDown: (event) => {
					if (event.target === event.currentTarget && !props.busy) props.dismiss();
				},
				children: (0, react_jsx_runtime.jsxs)("section", {
					ref: dialog.dialogRef,
					className: tracewild_module_css_default.releaseModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "codekin-release-title",
					tabIndex: -1,
					onKeyDown: dialog.onDialogKeyDown,
					onMouseDown: (event) => {
						event.stopPropagation();
					},
					children: [
						(0, react_jsx_runtime.jsxs)("header", { children: [(0, react_jsx_runtime.jsx)(CreatureSprite, {
							creature: props.creature,
							captured: props.captured,
							size: "medium"
						}), (0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("p", { children: "RELEASE" }),
							(0, react_jsx_runtime.jsx)("h2", {
								id: "codekin-release-title",
								children: props.t("releaseConfirmTitle")
							}),
							(0, react_jsx_runtime.jsx)("strong", { children: creatureName(props.creature, props.zh) })
						] })] }),
						(0, react_jsx_runtime.jsx)("p", { children: props.t("releaseConfirmBody", { name: creatureName(props.creature, props.zh) }) }),
						(0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.releaseReward,
							children: [
								(0, react_jsx_runtime.jsx)("span", { children: props.t("releaseReward") }),
								(0, react_jsx_runtime.jsx)(RewardItemTile, {
									item: {
										kind: "material",
										quality: props.captured.quality,
										quantity: 1
									},
									t: props.t,
									zh: props.zh,
									compact: true
								}),
								(0, react_jsx_runtime.jsxs)("small", { children: [
									"+",
									MATERIAL_XP[props.captured.quality],
									" EXP"
								] })
							]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.releaseActions,
							children: [(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"data-dialog-initial-focus": true,
								disabled: props.busy,
								onClick: props.dismiss,
								children: props.t("releaseCancel")
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.releaseDanger,
								disabled: props.busy,
								onClick: props.confirm,
								children: props.t("releaseConfirm")
							})]
						})
					]
				})
			});
		}
		function percent(value, max) {
			return max <= 0 ? 0 : Math.max(0, Math.min(100, value / max * 100));
		}
		function visibleCaptureChance(state, quality) {
			const battle = state.battle;
			const encounter = battle === void 0 ? void 0 : state.encounters.find((row) => row.id === battle.encounterId);
			const wild = encounter === void 0 ? void 0 : creatureById(encounter.creatureId);
			if (battle === void 0 || encounter === void 0 || wild === void 0) return 0;
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
		function logText(entry, t, zh) {
			const key = entry.kind === "core-drop" ? "logCore" : entry.kind === "material-drop" ? "logMaterial" : entry.kind === "idle-reward" ? "logIdle" : entry.kind === "encounter" ? "logEncounter" : entry.kind === "capture" ? "logCapture" : entry.kind === "starter" ? "logStarter" : entry.kind === "wild-defeat" ? "wildDefeated" : entry.kind === "tower-clear" ? "towerLog" : entry.kind === "release" ? "logRelease" : "logDefeat";
			const creature = entry.creatureId === void 0 ? void 0 : creatureById(entry.creatureId);
			const suffix = creature === void 0 ? "" : ` · ${creatureName(creature, zh)}`;
			const quality = entry.quality === void 0 ? "" : ` · ${t(CORE_KEYS[entry.quality])}`;
			return `${t(key)}${suffix}${quality}`;
		}
		function TraceWildOverlay({ t }) {
			const connection = (0, react.useMemo)(() => createTraceWildConnection(), []);
			const [snapshot, setSnapshot] = (0, react.useState)();
			const [online, setOnline] = (0, react.useState)(true);
			const [open, setOpen] = (0, react.useState)(false);
			const [tab, setTab] = (0, react.useState)("map");
			const [busy, setBusy] = (0, react.useState)(false);
			const [notice, setNotice] = (0, react.useState)();
			const [pulse, setPulse] = (0, react.useState)(false);
			const [windowPosition, setWindowPosition] = (0, react.useState)(() => readUiPreferences().windowPosition ?? {
				x: 0,
				y: 0
			});
			const [draggingWindow, setDraggingWindow] = (0, react.useState)(false);
			const [launcherPosition, setLauncherPosition] = (0, react.useState)(() => readUiPreferences().launcherPosition);
			const [draggingLauncher, setDraggingLauncher] = (0, react.useState)(false);
			const [squadDraft, setSquadDraft] = (0, react.useState)([]);
			const [codekinDetail, setCodekinDetail] = (0, react.useState)();
			const [rewardQueue, setRewardQueue] = (0, react.useState)([]);
			const [releaseCandidate, setReleaseCandidate] = (0, react.useState)();
			const [battleTransition, setBattleTransition] = (0, react.useState)();
			const [motionPreference, setMotionPreference] = (0, react.useState)(() => readUiPreferences().reducedMotion);
			const { reducedMotion, systemReducedMotion } = useReducedMotion(motionPreference);
			const windowSpring = useSpringAnimation(reducedMotion);
			const launcherSpring = useSpringAnimation(reducedMotion);
			const effects = useParticleField(reducedMotion, tracewild_module_css_default.motionParticle);
			const [squadEditing, setSquadEditing] = (0, react.useState)(false);
			const [pendingNavigation, setPendingNavigation] = (0, react.useState)();
			const hasOpened = (0, react.useRef)(false);
			const latestSnapshot = (0, react.useRef)();
			const actionInFlight = (0, react.useRef)(false);
			const pendingSnapshot = (0, react.useRef)();
			const overlayElement = (0, react.useRef)(null);
			const windowDrag = (0, react.useRef)();
			const pendingWindowPosition = (0, react.useRef)();
			const launcherElement = (0, react.useRef)(null);
			const launcherDrag = (0, react.useRef)();
			const pendingLauncherPosition = (0, react.useRef)();
			const launcherWasDragged = (0, react.useRef)(false);
			const pulseTimer = (0, react.useRef)();
			const zh = t("title") === "码灵";
			const rewardVisible = rewardQueue[0] !== void 0 && snapshot?.state.starterChosen === true && snapshot.state.battle === void 0 && codekinDetail === void 0 && releaseCandidate === void 0 && pendingNavigation === void 0;
			const navigate = (0, react.useCallback)((target) => {
				setPendingNavigation(void 0);
				setSquadEditing(false);
				if (target === "close") setOpen(false);
				else setTab(target);
			}, []);
			const requestNavigation = (0, react.useCallback)((target) => {
				if (target === tab) return;
				if (squadEditing && squadDraft.join("|") !== latestSnapshot.current?.state.squad.join("|")) setPendingNavigation(target);
				else navigate(target);
			}, [
				navigate,
				squadDraft,
				squadEditing,
				tab
			]);
			const adoptSnapshot = (0, react.useCallback)((value, allowClockRefresh = false) => {
				const previous = latestSnapshot.current;
				const sameProfile = previous !== void 0 && value.state.createdAt === previous.state.createdAt;
				if (sameProfile && value.state.revision < previous.state.revision) return;
				if (sameProfile && value.state.revision === previous.state.revision) {
					if (!allowClockRefresh || value.serverTime <= previous.serverTime) return;
					latestSnapshot.current = value;
					setSnapshot(value);
					return;
				}
				if (previous !== void 0 && !sameProfile) setRewardQueue([]);
				if (sameProfile && value.state.revision > previous.state.revision) {
					const acquired = acquiredItemsBetween(previous.state, value.state);
					if (acquired.length > 0) setRewardQueue((queue) => [...queue, acquired].slice(-8));
					if (value.state.encounters.length > previous.state.encounters.length) {
						setPulse(true);
						if (pulseTimer.current !== void 0) window.clearTimeout(pulseTimer.current);
						pulseTimer.current = window.setTimeout(() => {
							pulseTimer.current = void 0;
							setPulse(false);
						}, 1800);
					}
				}
				latestSnapshot.current = value;
				setSnapshot(value);
			}, []);
			const receiveSnapshot = (0, react.useCallback)((value, allowClockRefresh = false) => {
				if (!actionInFlight.current) {
					adoptSnapshot(value, allowClockRefresh);
					return;
				}
				const pending = pendingSnapshot.current;
				if (pending !== void 0) {
					const sameProfile = value.state.createdAt === pending.state.createdAt;
					if (sameProfile && (value.state.revision < pending.state.revision || value.state.revision === pending.state.revision && value.serverTime <= pending.serverTime)) return;
					if (!sameProfile && value.serverTime < pending.serverTime) return;
				}
				pendingSnapshot.current = value;
			}, [adoptSnapshot]);
			const refresh = (0, react.useCallback)(async (signal) => {
				try {
					const [content, value] = await Promise.all([connection.loadContent(signal), connection.load(signal)]);
					activateCodekinContent(content);
					receiveSnapshot(value, true);
					setOnline(true);
				} catch {
					if (signal?.aborted !== true) setOnline(false);
				}
			}, [receiveSnapshot, connection]);
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				refresh(controller.signal);
				return () => {
					controller.abort();
				};
			}, [refresh]);
			(0, react.useEffect)(() => {
				if (snapshot?.state.enabled !== true) return;
				return connection.subscribe((value) => {
					receiveSnapshot(value);
				}, setOnline);
			}, [
				receiveSnapshot,
				connection,
				snapshot?.state.enabled
			]);
			(0, react.useEffect)(() => {
				const onSettingsChanged = () => {
					refresh();
				};
				return subscribeTraceWildSettingsChanged(onSettingsChanged);
			}, [refresh]);
			(0, react.useEffect)(() => () => {
				if (pulseTimer.current !== void 0) window.clearTimeout(pulseTimer.current);
			}, []);
			(0, react.useEffect)(() => {
				if (snapshot !== void 0 && !squadEditing) setSquadDraft([...snapshot.state.squad]);
			}, [snapshot?.state.revision, squadEditing]);
			(0, react.useEffect)(() => {
				if (codekinDetail === void 0) return;
				if (snapshot?.state.creatures.some((creature) => creature.instanceId === codekinDetail) !== true) setCodekinDetail(void 0);
			}, [codekinDetail, snapshot?.state.revision]);
			(0, react.useEffect)(() => {
				if (releaseCandidate === void 0) return;
				if (snapshot?.state.creatures.some((creature) => creature.instanceId === releaseCandidate) !== true) setReleaseCandidate(void 0);
			}, [releaseCandidate, snapshot?.state.revision]);
			(0, react.useEffect)(() => {
				if (notice === void 0) return;
				const timer = window.setTimeout(() => {
					setNotice(void 0);
				}, 4500);
				return () => {
					window.clearTimeout(timer);
				};
			}, [notice]);
			(0, react.useEffect)(() => {
				if (!open) return;
				refresh();
			}, [open, refresh]);
			(0, react.useEffect)(() => {
				if (snapshot === void 0 || snapshot.state.idle.pendingReward !== void 0) return;
				const eligibleAt = snapshot.state.idle.lastSettlementAt + 36e5;
				const delay = Math.max(1e3, eligibleAt - snapshot.serverTime);
				const timer = window.setTimeout(() => {
					refresh();
				}, delay);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				refresh,
				snapshot?.serverTime,
				snapshot?.state.idle.lastSettlementAt,
				snapshot?.state.idle.pendingReward
			]);
			(0, react.useEffect)(() => {
				if (!open || snapshot === void 0) return;
				const activeEncounterId = snapshot.state.battle?.mode === "wild" ? snapshot.state.battle.encounterId : void 0;
				const nextExpiry = snapshot.state.encounters.filter((encounter) => encounter.id !== activeEncounterId).reduce((earliest, encounter) => earliest === void 0 ? encounter.expiresAt : Math.min(earliest, encounter.expiresAt), void 0);
				if (nextExpiry === void 0) return;
				const delay = Math.max(250, nextExpiry - snapshot.serverTime + 100);
				const timer = window.setTimeout(() => {
					refresh();
				}, delay);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				open,
				refresh,
				snapshot?.serverTime,
				snapshot?.state.revision
			]);
			(0, react.useEffect)(() => {
				if (!open) return;
				const onKey = (event) => {
					if (event.key !== "Escape" || event.defaultPrevented || busy || event.target instanceof Element && event.target.closest("[role=\"dialog\"]") !== null) return;
					if (rewardVisible) setRewardQueue((queue) => queue.slice(1));
					else if (releaseCandidate !== void 0) setReleaseCandidate(void 0);
					else if (codekinDetail !== void 0) setCodekinDetail(void 0);
					else if (snapshot?.state.battle === void 0) requestNavigation("close");
				};
				window.addEventListener("keydown", onKey);
				return () => {
					window.removeEventListener("keydown", onKey);
				};
			}, [
				busy,
				codekinDetail,
				open,
				releaseCandidate,
				requestNavigation,
				rewardVisible,
				snapshot?.state.battle
			]);
			(0, react.useEffect)(() => {
				const frame = requestAnimationFrame(() => {
					const rect = overlayElement.current?.getBoundingClientRect();
					if (open && rect !== void 0) {
						setWindowPosition((value) => clampWindowPosition(value.x, value.y, rect.width, rect.height));
						if (overlayElement.current?.querySelector("[role=\"dialog\"]") === null) overlayElement.current.querySelector("nav button[aria-current=\"page\"]")?.focus();
						hasOpened.current = true;
					} else if (!open) {
						const launcherRect = launcherElement.current?.getBoundingClientRect();
						if (launcherRect !== void 0) setLauncherPosition((value) => value === void 0 ? void 0 : clampFloatingPosition(value.x, value.y, launcherRect.width, launcherRect.height));
						if (hasOpened.current) launcherElement.current?.focus();
					}
				});
				return () => {
					cancelAnimationFrame(frame);
				};
			}, [open]);
			(0, react.useEffect)(() => {
				const clampCurrentPosition = () => {
					const rect = overlayElement.current?.getBoundingClientRect();
					if (rect !== void 0) setWindowPosition((position) => clampWindowPosition(position.x, position.y, rect.width, rect.height));
					const launcherRect = launcherElement.current?.getBoundingClientRect();
					if (launcherRect !== void 0) setLauncherPosition((position) => position === void 0 ? void 0 : clampFloatingPosition(position.x, position.y, launcherRect.width, launcherRect.height));
				};
				window.addEventListener("resize", clampCurrentPosition);
				return () => {
					window.removeEventListener("resize", clampCurrentPosition);
				};
			}, []);
			const beginWindowDrag = (event) => {
				if (event.button !== 0 || event.target.closest("button") !== null) return;
				const rect = overlayElement.current?.getBoundingClientRect();
				if (rect === void 0) return;
				windowSpring.stop();
				event.preventDefault();
				event.currentTarget.setPointerCapture(event.pointerId);
				windowDrag.current = {
					pointerId: event.pointerId,
					startX: event.clientX,
					startY: event.clientY,
					x: pendingWindowPosition.current?.x ?? windowPosition.x,
					y: pendingWindowPosition.current?.y ?? windowPosition.y,
					width: rect.width,
					height: rect.height,
					velocity: {
						x: 0,
						y: 0
					},
					lastX: event.clientX,
					lastY: event.clientY,
					lastTime: performance.now()
				};
				pendingWindowPosition.current = {
					x: windowDrag.current.x,
					y: windowDrag.current.y
				};
				setDraggingWindow(true);
			};
			const moveWindowDrag = (event) => {
				const drag = windowDrag.current;
				if (drag === void 0 || drag.pointerId !== event.pointerId) return;
				sampleDrag(drag, event);
				event.preventDefault();
				const next = clampWindowPosition(drag.x + event.clientX - drag.startX, drag.y + event.clientY - drag.startY, drag.width, drag.height);
				pendingWindowPosition.current = next;
				overlayElement.current?.style.setProperty("--window-x", `${next.x}px`);
				overlayElement.current?.style.setProperty("--window-y", `${next.y}px`);
			};
			const finishWindowDrag = (event) => {
				if (windowDrag.current?.pointerId !== event.pointerId) return;
				const drag = windowDrag.current;
				windowDrag.current = void 0;
				const next = pendingWindowPosition.current;
				if (next !== void 0) {
					const velocity = event.type === "pointercancel" || performance.now() - drag.lastTime > 90 ? {
						x: 0,
						y: 0
					} : drag.velocity;
					const projected = reducedMotion ? next : projectRelease(next, velocity);
					const target = clampWindowPosition(projected.x, projected.y, drag.width, drag.height);
					windowSpring.animate(next, target, velocity, (point) => {
						const bounded = clampWindowPosition(point.x, point.y, drag.width, drag.height);
						pendingWindowPosition.current = bounded;
						overlayElement.current?.style.setProperty("--window-x", `${bounded.x}px`);
						overlayElement.current?.style.setProperty("--window-y", `${bounded.y}px`);
					}, (point) => {
						pendingWindowPosition.current = void 0;
						setWindowPosition(point);
						saveUiPreferences({ windowPosition: point });
					});
				}
				setDraggingWindow(false);
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
			};
			const beginLauncherDrag = (event) => {
				if (event.button !== 0) return;
				launcherSpring.stop();
				const rect = event.currentTarget.getBoundingClientRect();
				launcherWasDragged.current = false;
				event.currentTarget.setPointerCapture(event.pointerId);
				launcherDrag.current = {
					pointerId: event.pointerId,
					startX: event.clientX,
					startY: event.clientY,
					x: rect.left,
					y: rect.top,
					width: rect.width,
					height: rect.height,
					velocity: {
						x: 0,
						y: 0
					},
					lastX: event.clientX,
					lastY: event.clientY,
					lastTime: performance.now()
				};
				pendingLauncherPosition.current = {
					x: rect.left,
					y: rect.top
				};
				setDraggingLauncher(true);
			};
			const moveLauncherDrag = (event) => {
				const drag = launcherDrag.current;
				if (drag === void 0 || drag.pointerId !== event.pointerId) return;
				sampleDrag(drag, event);
				const deltaX = event.clientX - drag.startX;
				const deltaY = event.clientY - drag.startY;
				if (Math.hypot(deltaX, deltaY) > 4) launcherWasDragged.current = true;
				if (!launcherWasDragged.current) return;
				event.preventDefault();
				const next = clampFloatingPosition(drag.x + deltaX, drag.y + deltaY, drag.width, drag.height);
				pendingLauncherPosition.current = next;
				const element = launcherElement.current;
				if (element !== null) {
					element.style.left = `${next.x}px`;
					element.style.top = `${next.y}px`;
					element.style.right = "auto";
					element.style.bottom = "auto";
				}
			};
			const finishLauncherDrag = (event) => {
				if (launcherDrag.current?.pointerId !== event.pointerId) return;
				const drag = launcherDrag.current;
				launcherDrag.current = void 0;
				const next = pendingLauncherPosition.current;
				pendingLauncherPosition.current = void 0;
				if (next !== void 0 && launcherWasDragged.current) {
					const velocity = event.type === "pointercancel" || performance.now() - drag.lastTime > 90 ? {
						x: 0,
						y: 0
					} : drag.velocity;
					const projected = projectRelease(next, reducedMotion ? {
						x: 0,
						y: 0
					} : velocity);
					const target = clampFloatingPosition(projected.x + drag.width / 2 < window.innerWidth / 2 ? 12 : window.innerWidth - drag.width - 12, projected.y, drag.width, drag.height);
					launcherSpring.animate(next, target, velocity, (point) => {
						const element = launcherElement.current;
						if (element !== null) {
							element.style.left = `${point.x}px`;
							element.style.top = `${point.y}px`;
						}
					}, (point) => {
						setLauncherPosition(point);
						saveUiPreferences({ launcherPosition: point });
					});
				}
				setDraggingLauncher(false);
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
			};
			const act = (0, react.useCallback)(async (action, present) => {
				if (busy || actionInFlight.current) return void 0;
				actionInFlight.current = true;
				setBusy(true);
				setNotice(void 0);
				try {
					const response = await connection.act(action);
					const transitionKind = response.notice === "tower-cleared" || response.notice === "wild-defeated" || response.notice === "capture-success" || response.notice === "capture-failed" || response.notice === "battle-lost" ? response.notice : void 0;
					if (present !== void 0) await present(response);
					if (transitionKind !== void 0 && latestSnapshot.current?.state.battle !== void 0) {
						setBattleTransition({
							key: Date.now(),
							kind: transitionKind
						});
						await new Promise((resolve) => {
							window.setTimeout(resolve, transitionKind === "capture-failed" ? 900 : 1200);
						});
					}
					adoptSnapshot(response);
					setBattleTransition(void 0);
					setOnline(true);
					if (response.notice === "capture-success") setNotice(t("captured"));
					if (response.notice === "capture-failed") setNotice(t("captureFailed"));
					if (response.notice === "battle-lost") setNotice(t("battleLost"));
					if (response.notice === "wild-defeated") setNotice(t("wildDefeated"));
					if (response.notice === "tower-cleared") setNotice(t("towerCleared"));
					if (response.notice === "material-used") setNotice(t("materialUsed"));
					if (response.notice === "idle-claimed") setNotice(t("idleClaimed"));
					if (response.notice === "creature-released") setNotice(t("released"));
					return response;
				} catch (error) {
					setBattleTransition(void 0);
					const battleAction = action.type.startsWith("battle-") || action.type === "capture" || action.type === "flee" || action.type === "start-battle" || action.type === "start-tower";
					if (error instanceof TraceWildConnectionError && error.code === "invalid-action") {
						if (action.type !== "battle-swap") setNotice(action.type === "set-creature-appearance" ? t("appearanceFailed") : action.type === "claim-idle-reward" ? t("rewardUnavailable") : battleAction ? t("battleActionUnavailable") : t("invalidSwap"));
					} else {
						setNotice(action.type === "set-creature-appearance" ? t("appearanceFailed") : error instanceof TraceWildConnectionError && error.code === "conflict" ? battleAction ? t("battleActionUnavailable") : t("invalidSwap") : t("disconnected"));
						await refresh();
					}
				} finally {
					actionInFlight.current = false;
					const pending = pendingSnapshot.current;
					pendingSnapshot.current = void 0;
					if (pending !== void 0) adoptSnapshot(pending, true);
					setBusy(false);
				}
			}, [
				adoptSnapshot,
				busy,
				connection,
				reducedMotion,
				refresh,
				t
			]);
			const state = snapshot?.state;
			const uncaught = state?.encounters.length ?? 0;
			const pendingIdleReward = state?.idle.pendingReward;
			const modalOpen = state !== void 0 && (!state.starterChosen || state.battle !== void 0 || rewardVisible || codekinDetail !== void 0 || releaseCandidate !== void 0 || pendingNavigation !== void 0);
			const inertBackground = (element) => {
				if (element !== null) element.inert = modalOpen;
			};
			const claimIdleReward = () => {
				setOpen(true);
				act({ type: "claim-idle-reward" });
			};
			if (state?.enabled === false) return null;
			const launcher = (0, react_jsx_runtime.jsxs)("button", {
				ref: launcherElement,
				"data-motion": reducedMotion ? "reduce" : "full",
				type: "button",
				className: `${tracewild_module_css_default.launcher} ${pendingIdleReward !== void 0 ? tracewild_module_css_default.launcherReward : ""} ${draggingLauncher ? tracewild_module_css_default.launcherDragging : ""} ${pulse ? tracewild_module_css_default.launcherPulse : ""}`,
				style: launcherPosition === void 0 ? void 0 : {
					left: launcherPosition.x,
					top: launcherPosition.y,
					right: "auto",
					bottom: "auto"
				},
				onClick: () => {
					if (launcherWasDragged.current) {
						launcherWasDragged.current = false;
						return;
					}
					setOpen(true);
					setPulse(false);
				},
				onDragStart: (event) => {
					event.preventDefault();
				},
				onPointerDown: beginLauncherDrag,
				onPointerMove: moveLauncherDrag,
				onPointerUp: finishLauncherDrag,
				onPointerCancel: finishLauncherDrag,
				title: `${pendingIdleReward !== void 0 ? t("idleRewardReady") : t("open")} · ${t("dragLauncher")}`,
				"aria-label": pendingIdleReward !== void 0 ? `${t("open")} · ${t("idleRewardReady")}` : t("open"),
				"aria-expanded": false,
				children: [pendingIdleReward === void 0 ? (0, react_jsx_runtime.jsx)("img", {
					className: tracewild_module_css_default.launcherAvatar,
					src: contentAssetUrl("launcher:default") ?? "/api/tracewild/assets/sprites/codekin-launcher-v2.webp",
					alt: "",
					"aria-hidden": "true",
					width: 384,
					height: 384,
					loading: "eager",
					decoding: "async",
					draggable: false
				}) : (0, react_jsx_runtime.jsx)("span", {
					className: tracewild_module_css_default.launcherGift,
					"aria-hidden": "true",
					children: (0, react_jsx_runtime.jsx)("i", {})
				}), uncaught > 0 && (0, react_jsx_runtime.jsx)("span", {
					className: tracewild_module_css_default.badge,
					children: uncaught > 99 ? "99+" : uncaught
				})]
			});
			if (!open) return launcher;
			return (0, react_jsx_runtime.jsxs)("section", {
				ref: overlayElement,
				"data-codekin-ui": "reload",
				"data-motion": reducedMotion ? "reduce" : "full",
				onPointerDownCapture: (event) => {
					if (event.button === 0 && event.target instanceof Element && event.target.closest("button:not(:disabled):not([role=\"gridcell\"])") !== null) effects.burst(event.clientX, event.clientY, "#7ef5ff", 5);
				},
				className: `${tracewild_module_css_default.overlay} ${draggingWindow ? tracewild_module_css_default.overlayDragging : ""} ${windowPosition.x > 140 ? tracewild_module_css_default.overlayDockedRight : ""}`,
				style: {
					"--window-x": `${windowPosition.x}px`,
					"--window-y": `${windowPosition.y}px`
				},
				"aria-label": t("title"),
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						ref: inertBackground,
						className: tracewild_module_css_default.windowTools,
						children: [
							pendingIdleReward !== void 0 && (0, react_jsx_runtime.jsx)(IdleRewardButton, {
								reward: pendingIdleReward,
								t,
								zh,
								busy,
								claim: claimIdleReward
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.motionToggle,
								"aria-pressed": reducedMotion,
								title: t(systemReducedMotion && motionPreference === void 0 ? "systemMotion" : "reduceMotion"),
								"aria-label": t("reduceMotion"),
								onClick: () => {
									setMotionPreference(!reducedMotion);
									saveUiPreferences({ reducedMotion: !reducedMotion });
								},
								children: (0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: reducedMotion ? "◉" : "≈"
								})
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.windowReset,
								title: t("resetWindow"),
								"aria-label": t("resetWindow"),
								onClick: () => {
									windowSpring.stop();
									pendingWindowPosition.current = void 0;
									setWindowPosition({
										x: 0,
										y: 0
									});
									saveUiPreferences({ windowPosition: {
										x: 0,
										y: 0
									} });
								},
								children: "↙"
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.windowClose,
								onClick: () => {
									requestNavigation("close");
								},
								title: t("close"),
								"aria-label": t("close"),
								children: (0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "×"
								})
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("header", {
						ref: inertBackground,
						className: tracewild_module_css_default.header,
						title: t("dragWindow"),
						onDoubleClick: (event) => {
							if (event.target.closest("button") === null) {
								windowSpring.stop();
								pendingWindowPosition.current = void 0;
								setWindowPosition({
									x: 0,
									y: 0
								});
								saveUiPreferences({ windowPosition: {
									x: 0,
									y: 0
								} });
							}
						},
						onPointerDown: beginWindowDrag,
						onPointerMove: moveWindowDrag,
						onPointerUp: finishWindowDrag,
						onPointerCancel: finishWindowDrag,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.brand,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: tracewild_module_css_default.logoCore,
									"aria-hidden": "true"
								}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsxs)("h1", { children: [(0, react_jsx_runtime.jsx)("strong", { children: "CODEKIN" }), zh && (0, react_jsx_runtime.jsx)("span", { children: t("title") })] }), (0, react_jsx_runtime.jsx)("p", { children: "YOUR SIGNAL. YOUR WORLD." })] })]
							}),
							(0, react_jsx_runtime.jsxs)("span", {
								className: tracewild_module_css_default.dragHandle,
								"aria-hidden": "true",
								children: [
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {})
								]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.headerStats,
								children: [CAPTURE_CORE_QUALITIES.map((quality) => (0, react_jsx_runtime.jsx)("span", {
									className: `${tracewild_module_css_default.miniCore} ${tracewild_module_css_default[`core_${quality}`]}`,
									title: `${coreItemName(t, quality)} · ${t("captureCoreDescription", { power: CORE_CAPTURE_POWER[quality].toFixed(2) })}`,
									children: state?.cores[quality] ?? 0
								}, quality)), (0, react_jsx_runtime.jsx)("span", {
									className: online ? tracewild_module_css_default.online : tracewild_module_css_default.offline,
									children: online ? "LIVE" : "OFFLINE"
								})]
							})
						]
					}),
					state === void 0 ? (0, react_jsx_runtime.jsxs)("div", {
						className: tracewild_module_css_default.centerMessage,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								className: tracewild_module_css_default.loadingMark,
								"aria-hidden": "true",
								children: "◌"
							}),
							(0, react_jsx_runtime.jsx)("p", { children: online ? t("loading") : t("disconnected") }),
							!online && (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									refresh();
								},
								children: t("retry")
							})
						]
					}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						!state.starterChosen && (0, react_jsx_runtime.jsx)(StarterSelection, {
							t,
							zh,
							busy,
							choose: (creatureId) => act({
								type: "choose-starter",
								creatureId
							})
						}),
						(0, react_jsx_runtime.jsx)("nav", {
							ref: inertBackground,
							className: tracewild_module_css_default.tabs,
							"aria-label": t("title"),
							children: [
								"map",
								"tower",
								"squad",
								"dex",
								"inventory"
							].map((id, index) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-tab": id,
								"aria-current": tab === id ? "page" : void 0,
								"aria-controls": "codekin-page",
								tabIndex: tab === id ? 0 : -1,
								className: tab === id ? tracewild_module_css_default.tabActive : "",
								onClick: () => {
									requestNavigation(id);
								},
								onKeyDown: (event) => {
									const tabs = [
										"map",
										"tower",
										"squad",
										"dex",
										"inventory"
									];
									const next = event.key === "ArrowRight" ? (index + 1) % 5 : event.key === "ArrowLeft" ? (index + 4) % 5 : event.key === "Home" ? 0 : event.key === "End" ? 4 : -1;
									if (next < 0) return;
									event.preventDefault();
									requestNavigation(tabs[next]);
									event.currentTarget.parentElement?.querySelector(`[data-tab="${tabs[next]}"]`)?.focus();
								},
								children: [(0, react_jsx_runtime.jsxs)("span", {
									"aria-hidden": "true",
									children: [
										"0",
										index + 1,
										(0, react_jsx_runtime.jsx)("i", { children: TAB_ICONS[id] })
									]
								}), (0, react_jsx_runtime.jsx)("small", { children: id === "tower" ? t("towerTitle") : t(id) })]
							}, id))
						}),
						(0, react_jsx_runtime.jsxs)("main", {
							ref: inertBackground,
							id: "codekin-page",
							"data-page": tab,
							className: tracewild_module_css_default.content,
							children: [
								!online && (0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.connectionBanner,
									role: "status",
									children: [(0, react_jsx_runtime.jsx)("span", { children: t("disconnected") }), (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											refresh();
										},
										children: t("retry")
									})]
								}),
								tab === "map" && (0, react_jsx_runtime.jsx)(CodekinMapView, {
									state,
									serverTime: snapshot?.serverTime ?? state.updatedAt,
									t,
									zh,
									busy,
									start: (encounterId) => act({
										type: "start-battle",
										encounterId
									})
								}),
								tab === "tower" && (0, react_jsx_runtime.jsx)(TowerView, {
									state,
									t,
									zh,
									busy,
									start: () => act({ type: "start-tower" })
								}),
								tab === "squad" && (0, react_jsx_runtime.jsx)(CodekinView, {
									state,
									t,
									zh,
									draft: squadDraft,
									setDraft: setSquadDraft,
									busy,
									save: async () => await act({
										type: "set-squad",
										instanceIds: squadDraft
									}) !== void 0,
									inspect: setCodekinDetail,
									onEditingChange: setSquadEditing
								}),
								tab === "dex" && (0, react_jsx_runtime.jsx)(DexView, {
									state,
									t,
									zh
								}),
								tab === "inventory" && (0, react_jsx_runtime.jsx)(InventoryView, {
									state,
									t,
									zh
								})
							]
						}, tab),
						(0, react_jsx_runtime.jsxs)("footer", {
							ref: inertBackground,
							className: tracewild_module_css_default.footer,
							children: [(0, react_jsx_runtime.jsx)("span", { children: "LOCAL / PRIVATE" }), (0, react_jsx_runtime.jsx)("small", { children: t("privacy") })]
						}),
						state.battle !== void 0 && (0, react_jsx_runtime.jsx)(BattleView, {
							state,
							t,
							zh,
							busy,
							act,
							transition: battleTransition,
							reducedMotion,
							minimize: () => {
								navigate("close");
							}
						}),
						notice !== void 0 && (0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.toast,
							role: "status",
							children: [(0, react_jsx_runtime.jsx)("span", { children: notice }), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": t("dismissNotice"),
								onClick: () => {
									setNotice(void 0);
								},
								children: "×"
							})]
						}),
						pendingNavigation !== void 0 && (0, react_jsx_runtime.jsx)(UnsavedSquadModal, {
							t,
							busy,
							stay: () => {
								setPendingNavigation(void 0);
							},
							discard: () => {
								navigate(pendingNavigation);
							},
							save: () => {
								act({
									type: "set-squad",
									instanceIds: squadDraft
								}).then((response) => {
									if (response !== void 0) navigate(pendingNavigation);
								});
							}
						}),
						rewardVisible && rewardQueue[0] !== void 0 && (0, react_jsx_runtime.jsx)(AcquiredItemsModal, {
							items: rewardQueue[0],
							t,
							zh,
							dismiss: () => {
								setRewardQueue((queue) => queue.slice(1));
							}
						}),
						codekinDetail !== void 0 && (() => {
							const captured = state.creatures.find((row) => row.instanceId === codekinDetail);
							const creature = captured === void 0 ? void 0 : creatureById(captured.creatureId);
							if (captured === void 0 || creature === void 0) return null;
							return (0, react_jsx_runtime.jsx)(CodekinDetailModal, {
								captured,
								creature,
								state,
								t,
								zh,
								busy,
								reducedMotion,
								act,
								dismiss: () => {
									setCodekinDetail(void 0);
								},
								release: () => {
									setCodekinDetail(void 0);
									setReleaseCandidate(captured.instanceId);
								}
							}, captured.instanceId);
						})(),
						releaseCandidate !== void 0 && (() => {
							const captured = state.creatures.find((row) => row.instanceId === releaseCandidate);
							const creature = captured === void 0 ? void 0 : creatureById(captured.creatureId);
							if (captured === void 0 || creature === void 0) return null;
							return (0, react_jsx_runtime.jsx)(ReleaseCreatureModal, {
								captured,
								creature,
								t,
								zh,
								busy,
								dismiss: () => {
									setReleaseCandidate(void 0);
								},
								confirm: () => {
									act({
										type: "release-creature",
										creatureInstanceId: captured.instanceId
									}).then((response) => {
										if (response !== void 0) setReleaseCandidate(void 0);
									});
								}
							});
						})()
					] }),
					(0, react_jsx_runtime.jsx)("div", {
						ref: effects.layer,
						className: tracewild_module_css_default.particleLayer,
						"aria-hidden": "true"
					})
				]
			});
		}
		function UnsavedSquadModal(props) {
			const dialog = useDialogAccessibility(props.stay, props.busy);
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.modalBackdrop,
				children: (0, react_jsx_runtime.jsxs)("section", {
					ref: dialog.dialogRef,
					className: tracewild_module_css_default.confirmPanel,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "codekin-unsaved-title",
					tabIndex: -1,
					onKeyDown: dialog.onDialogKeyDown,
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: tracewild_module_css_default.sectionKicker,
							children: "SQUAD / UNSAVED"
						}),
						(0, react_jsx_runtime.jsx)("h2", {
							id: "codekin-unsaved-title",
							children: props.t("unsavedSquad")
						}),
						(0, react_jsx_runtime.jsx)("p", { children: props.t("unsavedSquadHint") }),
						(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"data-dialog-initial-focus": true,
							disabled: props.busy,
							onClick: props.stay,
							children: props.t("keepEditing")
						}),
						(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: props.busy,
							onClick: props.save,
							children: props.t("saveAndLeave")
						}),
						(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: tracewild_module_css_default.discardButton,
							disabled: props.busy,
							onClick: props.discard,
							children: props.t("discardAndLeave")
						})
					]
				})
			});
		}
		function StarterSelection(props) {
			const dialog = useDialogAccessibility();
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.modalBackdrop,
				children: (0, react_jsx_runtime.jsxs)("div", {
					ref: dialog.dialogRef,
					className: tracewild_module_css_default.starterModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "tracewild-starter-title",
					tabIndex: -1,
					onKeyDown: dialog.onDialogKeyDown,
					children: [
						(0, react_jsx_runtime.jsx)("h2", {
							id: "tracewild-starter-title",
							children: props.t("starterTitle")
						}),
						(0, react_jsx_runtime.jsx)("p", { children: props.t("starterBody") }),
						(0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.starterGrid,
							children: starterCreatureIds().map((id) => {
								const creature = creatureById(id);
								return (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-dialog-initial-focus": id === starterCreatureIds()[0] ? true : void 0,
									disabled: props.busy,
									onClick: () => {
										props.choose(id);
									},
									children: [
										(0, react_jsx_runtime.jsx)(CreatureSprite, {
											creature,
											size: "large",
											eager: true
										}),
										(0, react_jsx_runtime.jsx)("strong", { children: creatureName(creature, props.zh) }),
										(0, react_jsx_runtime.jsx)("span", { children: props.t(ECOLOGY_KEYS[creature.ecology]) }),
										(0, react_jsx_runtime.jsx)("small", { children: creature.signatureProtocol }),
										(0, react_jsx_runtime.jsx)("b", { children: props.t("choose") })
									]
								}, id);
							})
						})
					]
				})
			});
		}
		function TowerView(props) {
			const towerState = props.state.tower ?? {
				highestClearedFloor: 0,
				attempts: 0,
				clears: 0
			};
			const towerComplete = towerState.highestClearedFloor >= MAX_CONTENT_TOWER_FLOOR;
			const tower = contentTowerFloorProfile(Math.min(MAX_CONTENT_TOWER_FLOOR, towerState.highestClearedFloor + 1));
			const towerBoss = creatureById(tower.creatureId);
			const routeStart = Math.max(1, tower.floor - 2);
			const routeFloors = Array.from({ length: 5 }, (_, index) => Math.min(MAX_CONTENT_TOWER_FLOOR, routeStart + index)).filter((floor, index, rows) => rows.indexOf(floor) === index);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: `${tracewild_module_css_default.panelPage} ${tracewild_module_css_default.towerPage}`,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: tracewild_module_css_default.towerHeading,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("span", { children: props.t("towerKicker") }),
							(0, react_jsx_runtime.jsx)("h2", { children: props.t("towerTitle") }),
							(0, react_jsx_runtime.jsx)("p", { children: props.t("towerIntro") })
						] }), (0, react_jsx_runtime.jsx)("strong", { children: String(tower.floor).padStart(3, "0") })]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: tracewild_module_css_default.towerHero,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.towerMonument,
								"aria-hidden": "true",
								children: [
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("b", {})
								]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.towerBossCard,
								children: [
									(0, react_jsx_runtime.jsx)("span", { children: props.t("towerCurrentTarget") }),
									(0, react_jsx_runtime.jsx)(CreatureSprite, {
										creature: towerBoss,
										level: tower.level,
										size: "large",
										eager: true
									}),
									(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: creatureName(towerBoss, props.zh) }), (0, react_jsx_runtime.jsxs)("small", { children: [
										"Lv.",
										tower.level,
										" · ",
										props.t(CORE_KEYS[tower.quality])
									] })] })
								]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.towerBrief,
								children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("towerSkillTier", { tier: tower.skillTier }) }), (0, react_jsx_runtime.jsx)("span", { children: props.t("towerRewardPreview", {
									count: tower.baseMaterialDrops,
									bonus: tower.milestoneMaterial ? props.t("towerMilestoneReady") : props.t("towerMilestoneHint")
								}) })] }), (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: towerComplete || props.busy || !props.state.starterChosen || props.state.battle !== void 0,
									onClick: props.start,
									children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("towerChallenge") }), (0, react_jsx_runtime.jsx)("b", { children: "↗" })]
								})]
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: tracewild_module_css_default.towerMetrics,
						children: [
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("towerHighest") }), (0, react_jsx_runtime.jsx)("b", { children: towerState.highestClearedFloor })] }),
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("towerAttempts") }), (0, react_jsx_runtime.jsx)("b", { children: towerState.attempts })] }),
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("towerClears") }), (0, react_jsx_runtime.jsx)("b", { children: towerState.clears })] })
						]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: tracewild_module_css_default.towerRoute,
						children: [(0, react_jsx_runtime.jsxs)("header", { children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("towerPath") }), (0, react_jsx_runtime.jsx)("small", { children: "TRACE / ASCENSION" })] }), (0, react_jsx_runtime.jsx)("div", { children: routeFloors.map((floor) => {
							const profile = contentTowerFloorProfile(floor);
							const cleared = floor <= towerState.highestClearedFloor;
							const active = floor === tower.floor;
							return (0, react_jsx_runtime.jsxs)("article", {
								className: `${cleared ? tracewild_module_css_default.towerRouteCleared : ""} ${active ? tracewild_module_css_default.towerRouteActive : ""}`,
								children: [
									(0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
									(0, react_jsx_runtime.jsx)("b", { children: String(floor).padStart(2, "0") }),
									(0, react_jsx_runtime.jsx)("span", { children: props.t(CORE_KEYS[profile.quality]) })
								]
							}, floor);
						}) })]
					})
				]
			});
		}
		function DexView(props) {
			const dex = new Map(props.state.dex.map((row) => [row.creatureId, row]));
			return (0, react_jsx_runtime.jsxs)("div", {
				className: tracewild_module_css_default.panelPage,
				children: [(0, react_jsx_runtime.jsx)("div", {
					className: tracewild_module_css_default.pageHeading,
					children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: props.t("dex") }), (0, react_jsx_runtime.jsxs)("p", { children: [
						props.t("dexSeen"),
						" ",
						props.state.dex.length,
						"/25 · ",
						props.t("dexCaught"),
						" ",
						props.state.dex.filter((row) => row.captured > 0).length,
						"/25"
					] })] })
				}), (0, react_jsx_runtime.jsx)("div", {
					className: tracewild_module_css_default.dexGrid,
					children: creatureCatalog().map((creature) => {
						const record = dex.get(creature.id);
						const seen = record !== void 0;
						const caught = (record?.captured ?? 0) > 0;
						return (0, react_jsx_runtime.jsxs)("div", {
							className: `${tracewild_module_css_default.dexCard} ${caught ? tracewild_module_css_default.dexCaught : seen ? tracewild_module_css_default.dexSeen : ""}`,
							children: [
								(0, react_jsx_runtime.jsxs)("span", {
									className: tracewild_module_css_default.dexNumber,
									children: ["#", String(creature.number).padStart(2, "0")]
								}),
								(0, react_jsx_runtime.jsx)(CreatureSprite, {
									creature,
									size: "small",
									unknown: !seen
								}),
								(0, react_jsx_runtime.jsx)("strong", { children: seen ? creatureName(creature, props.zh) : props.t("undiscovered") }),
								(0, react_jsx_runtime.jsx)("small", { children: seen ? props.t(ECOLOGY_KEYS[creature.ecology]) : "???" }),
								record !== void 0 && (0, react_jsx_runtime.jsxs)("span", { children: [
									props.t("dexSeen"),
									" ×",
									record.seen,
									" · ",
									props.t("dexCaught"),
									" ×",
									record.captured
								] })
							]
						}, creature.id);
					})
				})]
			});
		}
		function InventoryView(props) {
			const stats = props.state.stats;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: tracewild_module_css_default.inventoryLayout,
				children: [(0, react_jsx_runtime.jsxs)("section", {
					className: tracewild_module_css_default.inventoryPanel,
					children: [
						(0, react_jsx_runtime.jsx)("h2", { children: props.t("coreInventory") }),
						(0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.coreGrid,
							children: CAPTURE_CORE_QUALITIES.map((quality) => (0, react_jsx_runtime.jsxs)("div", {
								className: `${tracewild_module_css_default.coreCard} ${tracewild_module_css_default.itemInspectable} ${tracewild_module_css_default[`core_${quality}`]}`,
								tabIndex: 0,
								"aria-label": `${coreItemName(props.t, quality)}. ${props.t("captureCoreDescription", { power: CORE_CAPTURE_POWER[quality].toFixed(2) })}`,
								children: [
									(0, react_jsx_runtime.jsx)("span", { className: `${tracewild_module_css_default.bigCore} ${tracewild_module_css_default[`core_${quality}`]}` }),
									(0, react_jsx_runtime.jsx)("strong", { children: coreItemName(props.t, quality) }),
									(0, react_jsx_runtime.jsxs)("b", { children: ["× ", props.state.cores[quality]] }),
									(0, react_jsx_runtime.jsxs)("span", {
										className: tracewild_module_css_default.itemTooltip,
										role: "tooltip",
										children: [(0, react_jsx_runtime.jsx)("strong", { children: coreItemName(props.t, quality) }), (0, react_jsx_runtime.jsx)("small", { children: props.t("captureCoreDescription", { power: CORE_CAPTURE_POWER[quality].toFixed(2) }) })]
									})
								]
							}, quality))
						}),
						(0, react_jsx_runtime.jsx)("h2", { children: props.t("materialInventory") }),
						(0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.coreGrid,
							children: CAPTURE_CORE_QUALITIES.map((quality) => (0, react_jsx_runtime.jsxs)("div", {
								className: `${tracewild_module_css_default.coreCard} ${tracewild_module_css_default.materialCard} ${tracewild_module_css_default.itemInspectable} ${tracewild_module_css_default[`core_${quality}`]}`,
								tabIndex: 0,
								"aria-label": `${materialItemName(props.t, quality)}. ${props.t("growthMaterialDescription", { xp: MATERIAL_XP[quality] })}`,
								children: [
									(0, react_jsx_runtime.jsx)("span", { className: `${tracewild_module_css_default.materialShard} ${tracewild_module_css_default[`core_${quality}`]}` }),
									(0, react_jsx_runtime.jsx)("strong", { children: materialItemName(props.t, quality) }),
									(0, react_jsx_runtime.jsxs)("small", {
										className: tracewild_module_css_default.materialXp,
										children: [
											"+",
											MATERIAL_XP[quality],
											" EXP"
										]
									}),
									(0, react_jsx_runtime.jsxs)("b", { children: ["× ", props.state.materials[quality]] }),
									(0, react_jsx_runtime.jsxs)("span", {
										className: tracewild_module_css_default.itemTooltip,
										role: "tooltip",
										children: [(0, react_jsx_runtime.jsx)("strong", { children: materialItemName(props.t, quality) }), (0, react_jsx_runtime.jsx)("small", { children: props.t("growthMaterialDescription", { xp: MATERIAL_XP[quality] }) })]
									})
								]
							}, quality))
						}),
						props.state.idle.lastReward !== void 0 && (0, react_jsx_runtime.jsx)("p", {
							className: tracewild_module_css_default.idleReward,
							children: props.t("idleReward", { minutes: props.state.idle.lastReward.elapsedMinutes })
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.statsGrid,
							children: [
								(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.completedTurns }), props.t("totalTurns")] }),
								(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.failedTurns }), props.t("failures")] }),
								(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.successfulCaptures }), props.t("captureCount")] }),
								(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.wildDefeats }), props.t("defeatCount")] }),
								(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.currentSuccessStreak }), props.t("streak")] })
							]
						})
					]
				}), (0, react_jsx_runtime.jsxs)("section", {
					className: tracewild_module_css_default.logPanel,
					children: [(0, react_jsx_runtime.jsx)("h2", { children: props.t("eventLog") }), props.state.log.length === 0 ? (0, react_jsx_runtime.jsx)("p", { children: props.t("emptyLog") }) : (0, react_jsx_runtime.jsx)("ol", { children: props.state.log.map((entry) => (0, react_jsx_runtime.jsxs)("li", { children: [(0, react_jsx_runtime.jsx)("time", { children: new Date(entry.at).toLocaleTimeString() }), (0, react_jsx_runtime.jsx)("span", { children: logText(entry, props.t, props.zh) })] }, entry.id)) })]
				})]
			});
		}
		const TILE_SYMBOLS = {
			lumen: "✦",
			forge: "◆",
			relay: "⇄",
			aegis: "⬢",
			glitch: "⌁"
		};
		const SPECIAL_KEYS = {
			row: "specialRow",
			column: "specialColumn",
			burst: "specialBurst",
			origin: "specialOrigin"
		};
		const SIGNAL_EFFECT_KEYS = {
			repair: "signalRepair",
			guard: "signalGuard",
			sync: "signalSync",
			overclock: "signalOverclock",
			breach: "signalBreach"
		};
		const SIGNAL_RULE_KEYS = {
			lumen: "signalRuleLumen",
			forge: "signalRuleForge",
			relay: "signalRuleRelay",
			aegis: "signalRuleAegis",
			glitch: "signalRuleGlitch"
		};
		function BattleHoverDetail(props) {
			return (0, react_jsx_runtime.jsxs)("span", {
				className: tracewild_module_css_default.battleHoverDetail,
				role: "tooltip",
				children: [
					(0, react_jsx_runtime.jsx)("b", { children: props.title }),
					(0, react_jsx_runtime.jsx)("small", { children: props.meta }),
					(0, react_jsx_runtime.jsx)("span", { children: props.body })
				]
			});
		}
		function tileLabel(tile, index, t) {
			return `${t(ECOLOGY_KEYS[tile.ecology])}${tile.special === "none" ? "" : ` · ${t(SPECIAL_KEYS[tile.special])}`}${(tile.lockedActions ?? 0) > 0 ? ` · ${t("lockedTile", { actions: tile.lockedActions ?? 0 })}` : ""}${(tile.hazardActions ?? 0) > 0 ? ` · ${t("hazardTile", { actions: tile.hazardActions ?? 0 })}` : ""} · ${Math.floor(index / 8) + 1},${index % 8 + 1}`;
		}
		function swipeTarget(index, deltaX, deltaY) {
			const row = Math.floor(index / 8);
			const column = index % 8;
			if (Math.abs(deltaX) >= Math.abs(deltaY)) {
				if (deltaX > 0 && column < 7) return index + 1;
				if (deltaX < 0 && column > 0) return index - 1;
				return;
			}
			if (deltaY > 0 && row < 7) return index + 8;
			if (deltaY < 0 && row > 0) return index - 8;
		}
		function BattleView(props) {
			const battle = props.state.battle;
			const dialog = useDialogAccessibility();
			const [selectedTile, setSelectedTile] = (0, react.useState)();
			const [focusedTile, setFocusedTile] = (0, react.useState)(0);
			const boardElement = (0, react.useRef)(null);
			const boardHadFocus = (0, react.useRef)(false);
			const battleEffects = useParticleField(props.reducedMotion, tracewild_module_css_default.motionParticle);
			const [gesture, setGesture] = (0, react.useState)();
			const [swapMotion, setSwapMotion] = (0, react.useState)();
			const [animating, setAnimating] = (0, react.useState)(false);
			const [visualBoard, setVisualBoard] = (0, react.useState)(() => battle.board.map((tile) => ({ ...tile })));
			const [clearingTiles, setClearingTiles] = (0, react.useState)();
			const [fallRows, setFallRows] = (0, react.useState)();
			const [activeChain, setActiveChain] = (0, react.useState)();
			const [damageReadout, setDamageReadout] = (0, react.useState)();
			const [signalReadout, setSignalReadout] = (0, react.useState)();
			const [recoveryReadout, setRecoveryReadout] = (0, react.useState)();
			const [captureIntro, setCaptureIntro] = (0, react.useState)(false);
			const [partyHitKey, setPartyHitKey] = (0, react.useState)(0);
			const [attackPresentation, setAttackPresentation] = (0, react.useState)();
			const [protocol, setProtocol] = (0, react.useState)();
			const mounted = (0, react.useRef)(true);
			const [handoff, setHandoff] = (0, react.useState)(false);
			const [pageVisible, setPageVisible] = (0, react.useState)(() => !document.hidden);
			const [displayedWildHp, setDisplayedWildHp] = (0, react.useState)(battle.wildHp);
			const [displayedPartyHp, setDisplayedPartyHp] = (0, react.useState)(battle.partyHp);
			const [displayedWildShield, setDisplayedWildShield] = (0, react.useState)(battle.wildShield);
			const [displayedPartyShield, setDisplayedPartyShield] = (0, react.useState)(battle.partyShield);
			const displayedWildHpRef = (0, react.useRef)(battle.wildHp);
			const displayedPartyHpRef = (0, react.useRef)(battle.partyHp);
			const displayedWildShieldRef = (0, react.useRef)(battle.wildShield);
			const displayedPartyShieldRef = (0, react.useRef)(battle.partyShield);
			const gestureRef = (0, react.useRef)();
			const draggedTileElement = (0, react.useRef)();
			const bossActionInFlight = (0, react.useRef)(false);
			const bossActionTimer = (0, react.useRef)();
			const motionTimers = (0, react.useRef)(/* @__PURE__ */ new Map());
			const animationEpoch = (0, react.useRef)(0);
			const suppressClick = (0, react.useRef)(false);
			const suppressClickTimer = (0, react.useRef)();
			const captureIntroTimer = (0, react.useRef)();
			const previousCaptureWindow = (0, react.useRef)(false);
			const previousBattle = (0, react.useRef)({
				id: battle.id,
				wildHp: battle.wildHp,
				partyHp: battle.partyHp
			});
			const encounter = props.state.encounters.find((row) => row.id === battle.encounterId);
			const wild = creatureById(battle.wildCreatureId);
			const active = battle.party[battle.activeIndex];
			const activeDefinition = active === void 0 ? void 0 : creatureById(active.creatureId);
			const locked = props.busy || animating || handoff;
			const boardLocked = locked || battle.turnOwner === "boss" || battle.captureWindow || battle.actionsRemaining <= 0;
			const keyboardTile = (visualBoard[focusedTile]?.lockedActions ?? 0) > 0 ? visualBoard.findIndex((tile) => (tile.lockedActions ?? 0) === 0) : focusedTile;
			(0, react.useEffect)(() => {
				if (!boardLocked && boardHadFocus.current) boardElement.current?.querySelector(`[data-cell="${keyboardTile}"]`)?.focus({ preventScroll: true });
			}, [boardLocked, keyboardTile]);
			const showWildHp = (0, react.useCallback)((value) => {
				displayedWildHpRef.current = value;
				setDisplayedWildHp(value);
			}, []);
			const showPartyHp = (0, react.useCallback)((value) => {
				displayedPartyHpRef.current = value;
				setDisplayedPartyHp(value);
			}, []);
			const showWildShield = (0, react.useCallback)((value) => {
				displayedWildShieldRef.current = value;
				setDisplayedWildShield(value);
			}, []);
			const showPartyShield = (0, react.useCallback)((value) => {
				displayedPartyShieldRef.current = value;
				setDisplayedPartyShield(value);
			}, []);
			const resetDraggedTile = (0, react.useCallback)((element = draggedTileElement.current) => {
				element?.style.setProperty("--drag-x", "0px");
				element?.style.setProperty("--drag-y", "0px");
			}, []);
			(0, react.useEffect)(() => {
				if (gesture !== void 0 || draggedTileElement.current === void 0) return;
				const element = draggedTileElement.current;
				resetDraggedTile(element);
				const frame = window.requestAnimationFrame(() => {
					resetDraggedTile(element);
					if (draggedTileElement.current === element) draggedTileElement.current = void 0;
				});
				return () => {
					window.cancelAnimationFrame(frame);
				};
			}, [gesture, resetDraggedTile]);
			(0, react.useEffect)(() => {
				setSelectedTile(void 0);
				gestureRef.current = void 0;
				setGesture(void 0);
			}, [
				battle.id,
				battle.turn,
				battle.turnOwner,
				battle.actionsRemaining,
				battle.bossActionsRemaining,
				battle.activeIndex
			]);
			(0, react.useEffect)(() => {
				const entered = battle.captureWindow && !previousCaptureWindow.current;
				previousCaptureWindow.current = battle.captureWindow;
				if (!entered) {
					if (!battle.captureWindow) setCaptureIntro(false);
					return;
				}
				setCaptureIntro(true);
				if (captureIntroTimer.current !== void 0) window.clearTimeout(captureIntroTimer.current);
				captureIntroTimer.current = window.setTimeout(() => {
					captureIntroTimer.current = void 0;
					setCaptureIntro(false);
				}, 760);
			}, [battle.captureWindow, battle.id]);
			(0, react.useEffect)(() => {
				animationEpoch.current += 1;
				setAnimating(false);
				setSwapMotion(void 0);
				setClearingTiles(void 0);
				setFallRows(void 0);
				setActiveChain(void 0);
				setSignalReadout(void 0);
				setRecoveryReadout(void 0);
				setVisualBoard(battle.board.map((tile) => ({ ...tile })));
				setAttackPresentation(void 0);
				setProtocol(void 0);
				showWildHp(battle.wildHp);
				showPartyHp(battle.partyHp);
				showWildShield(battle.wildShield);
				showPartyShield(battle.partyShield);
			}, [
				battle.id,
				showPartyHp,
				showPartyShield,
				showWildHp,
				showWildShield
			]);
			(0, react.useEffect)(() => {
				showWildHp(battle.wildHp);
			}, [
				battle.id,
				battle.wildHp,
				showWildHp
			]);
			(0, react.useEffect)(() => {
				showPartyHp(battle.partyHp);
			}, [
				battle.id,
				battle.partyHp,
				showPartyHp
			]);
			(0, react.useEffect)(() => {
				showWildShield(battle.wildShield);
			}, [
				battle.id,
				battle.wildShield,
				showWildShield
			]);
			(0, react.useEffect)(() => {
				showPartyShield(battle.partyShield);
			}, [
				battle.id,
				battle.partyShield,
				showPartyShield
			]);
			(0, react.useEffect)(() => {
				if (!animating) setVisualBoard(battle.board.map((tile) => ({ ...tile })));
			}, [animating, battle.board]);
			(0, react.useEffect)(() => {
				const previous = previousBattle.current;
				if (previous.id !== battle.id) {
					previousBattle.current = {
						id: battle.id,
						wildHp: battle.wildHp,
						partyHp: battle.partyHp
					};
					setDamageReadout(void 0);
					return;
				}
				if (previous.partyHp > battle.partyHp) setPartyHitKey((value) => value + 1);
				previousBattle.current = {
					id: battle.id,
					wildHp: battle.wildHp,
					partyHp: battle.partyHp
				};
				if (animating || props.busy) return;
				const actor = battle.turnOwner === "boss" ? "boss" : "player";
				const total = actor === "boss" ? battle.pendingBossDamage : battle.pendingTeamDamage;
				setDamageReadout((current) => total > 0 ? {
					key: current?.actor === actor ? current.key : Date.now(),
					actor,
					total,
					settled: false
				} : void 0);
			}, [
				animating,
				props.busy,
				battle.id,
				battle.turnOwner,
				battle.pendingTeamDamage,
				battle.pendingBossDamage,
				battle.wildHp,
				battle.partyHp
			]);
			(0, react.useEffect)(() => {
				const update = () => {
					setPageVisible(!document.hidden);
				};
				document.addEventListener("visibilitychange", update);
				return () => {
					document.removeEventListener("visibilitychange", update);
				};
			}, []);
			(0, react.useEffect)(() => {
				setHandoff(true);
				const timer = window.setTimeout(() => {
					setHandoff(false);
				}, BATTLE_MOTION.handoff);
				return () => {
					window.clearTimeout(timer);
				};
			}, [battle.activeIndex, battle.turnOwner]);
			(0, react.useEffect)(() => {
				mounted.current = true;
				return () => {
					mounted.current = false;
					animationEpoch.current += 1;
					if (bossActionTimer.current !== void 0) window.clearTimeout(bossActionTimer.current);
					if (suppressClickTimer.current !== void 0) window.clearTimeout(suppressClickTimer.current);
					if (captureIntroTimer.current !== void 0) window.clearTimeout(captureIntroTimer.current);
					for (const [timer, resolve] of motionTimers.current) {
						window.clearTimeout(timer);
						resolve();
					}
					motionTimers.current.clear();
				};
			}, []);
			const suppressNextClick = (duration) => {
				suppressClick.current = true;
				if (suppressClickTimer.current !== void 0) window.clearTimeout(suppressClickTimer.current);
				suppressClickTimer.current = window.setTimeout(() => {
					suppressClickTimer.current = void 0;
					suppressClick.current = false;
				}, duration);
			};
			const pause = (duration) => new Promise((resolve) => {
				const timer = window.setTimeout(() => {
					motionTimers.current.delete(timer);
					resolve();
				}, duration);
				motionTimers.current.set(timer, resolve);
			});
			const playCascade = async (animation, finalBattle, epoch) => {
				if (animation.battleId !== battle.id) return;
				const reducedMotion = props.reducedMotion;
				setSignalReadout(void 0);
				setRecoveryReadout(void 0);
				for (const frame of animation.frames) {
					if (animationEpoch.current !== epoch) return;
					const signalKey = Date.now() + frame.chain;
					const frameEffect = frame.signalEffect;
					if (frame.damage !== void 0 && frame.damage > 0 && frame.totalDamage !== void 0) setDamageReadout({
						key: Date.now() + frame.chain,
						actor: animation.actor === "boss" ? "boss" : "player",
						total: frame.totalDamage,
						current: frame.damage,
						effectiveness: frame.effectiveness ?? "neutral",
						settled: false
					});
					setSignalReadout(frameEffect === void 0 ? void 0 : {
						...frameEffect,
						key: signalKey,
						actor: animation.actor === "boss" ? "boss" : "player"
					});
					setFallRows(void 0);
					setVisualBoard(frame.before.map((tile) => ({ ...tile })));
					setClearingTiles(new Set(frame.removed));
					setActiveChain(frame.chain);
					const colors = {
						lumen: "#ffdc69",
						forge: "#ff897f",
						relay: "#72dcff",
						aegis: "#6cf0c1",
						glitch: "#d7a1ff"
					};
					for (const index of frame.removed.slice(0, 12)) {
						const rect = boardElement.current?.querySelector(`[data-cell="${index}"]`)?.getBoundingClientRect();
						if (rect !== void 0) battleEffects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, colors[frame.before[index].ecology], 4);
					}
					await pause(reducedMotion ? 220 : BATTLE_MOTION.clear + 40);
					if (animationEpoch.current !== epoch) return;
					setClearingTiles(void 0);
					setVisualBoard(frame.after.map((tile) => ({ ...tile })));
					setFallRows(frame.fallRows);
					const fallDuration = cascadeFallTime(frame.fallRows, 8);
					await pause(reducedMotion ? 240 : fallDuration + 40);
					if (animationEpoch.current !== epoch) return;
					setFallRows(void 0);
					await pause(BATTLE_MOTION.chainPause);
				}
				if (animationEpoch.current !== epoch) return;
				setActiveChain(void 0);
				setSignalReadout(void 0);
				setRecoveryReadout(void 0);
				const finalBoard = finalBattle?.board ?? animation.frames.at(-1)?.after ?? battle.board;
				setVisualBoard(finalBoard.map((tile) => ({ ...tile })));
				if (animation.strike !== void 0) {
					setDamageReadout({
						key: Date.now(),
						actor: animation.strike.actor,
						total: animation.strike.damage,
						settled: false
					});
					return;
				}
				if (finalBattle === void 0) return;
				const actor = finalBattle.turnOwner === "boss" ? "boss" : "player";
				const total = actor === "boss" ? finalBattle.pendingBossDamage : finalBattle.pendingTeamDamage;
				setDamageReadout(total > 0 ? {
					key: Date.now(),
					actor,
					total,
					settled: false
				} : void 0);
			};
			const playStrike = async (strike, finalBattle, epoch) => {
				const reducedMotion = props.reducedMotion;
				const key = Date.now();
				setAttackPresentation({
					...strike,
					key,
					phase: "flight"
				});
				setDamageReadout({
					key,
					actor: strike.actor,
					total: strike.damage,
					settled: false
				});
				await pause(reducedMotion ? 500 : BATTLE_MOTION.flight + 40);
				if (animationEpoch.current !== epoch) return;
				setAttackPresentation({
					...strike,
					key,
					phase: "impact"
				});
				const targetRect = dialog.dialogRef.current?.querySelector(`[data-strike-target="${strike.actor === "player" ? "boss" : "player"}"]`)?.getBoundingClientRect();
				if (targetRect !== void 0) battleEffects.burst(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2, strike.actor === "player" ? "#7ef5ff" : "#ff7c92", 22);
				if (strike.actor === "player") {
					showWildHp(strike.targetHpAfter);
					showWildShield(finalBattle?.wildShield ?? 0);
				} else {
					showPartyHp(strike.targetHpAfter);
					showPartyShield(finalBattle?.partyShield ?? 0);
					setPartyHitKey((value) => value + 1);
				}
				previousBattle.current = strike.actor === "player" ? {
					...previousBattle.current,
					wildHp: strike.targetHpAfter
				} : {
					...previousBattle.current,
					partyHp: strike.targetHpAfter
				};
				setDamageReadout({
					key: key + 1,
					actor: strike.actor,
					total: strike.damage,
					settled: true
				});
				await pause(BATTLE_MOTION.impact + 40);
				if (animationEpoch.current !== epoch) return;
				setAttackPresentation(void 0);
				setDamageReadout(void 0);
			};
			const playRecovery = async (recovery, epoch) => {
				const reducedMotion = props.reducedMotion;
				const key = Date.now();
				if (recovery.actor === "player") {
					showPartyHp(recovery.targetHpBefore);
					showPartyShield(recovery.targetShieldBefore);
				} else {
					showWildHp(recovery.targetHpBefore);
					showWildShield(recovery.targetShieldBefore);
				}
				setRecoveryReadout({
					key,
					actor: recovery.actor,
					from: recovery.targetHpBefore,
					to: recovery.targetHpAfter,
					shieldFrom: recovery.targetShieldBefore,
					shieldTo: recovery.targetShieldAfter,
					settling: false
				});
				await pause(reducedMotion ? 300 : 400);
				if (animationEpoch.current !== epoch) return;
				setRecoveryReadout((value) => value?.key === key ? {
					...value,
					settling: true
				} : value);
				if (recovery.actor === "player") {
					showPartyHp(recovery.targetHpAfter);
					showPartyShield(recovery.targetShieldAfter);
				} else {
					showWildHp(recovery.targetHpAfter);
					showWildShield(recovery.targetShieldAfter);
				}
				await pause(650);
				if (animationEpoch.current !== epoch) return;
				setRecoveryReadout((value) => value?.key === key ? void 0 : value);
			};
			const presentBattleResponse = async (response) => {
				const animation = response.animation;
				if (!mounted.current || animation === void 0 || animation.battleId !== battle.id) return;
				const epoch = ++animationEpoch.current;
				const finalBattle = response.state.battle?.id === battle.id ? response.state.battle : void 0;
				const motion = animation.swap;
				if (motion !== void 0 && animation.actor === "boss") {
					setSwapMotion(motion);
					await pause(props.reducedMotion ? 220 : BATTLE_MOTION.swap + 30);
					if (animationEpoch.current !== epoch) return;
					setSwapMotion(void 0);
				} else setSwapMotion(void 0);
				await playCascade(animation, finalBattle, epoch);
				if (animationEpoch.current !== epoch) return;
				if (animation.recovery !== void 0) await playRecovery(animation.recovery, epoch);
				if (animationEpoch.current !== epoch) return;
				if (animation.strike !== void 0) await playStrike(animation.strike, finalBattle, epoch);
			};
			const runBossAction = () => {
				if (battle.turnOwner !== "boss" || props.busy || animating || handoff || !pageVisible || bossActionInFlight.current) return;
				bossActionInFlight.current = true;
				setDamageReadout((current) => current?.actor === "boss" ? current : {
					key: Date.now(),
					actor: "boss",
					total: 0,
					settled: false
				});
				setAnimating(true);
				props.act({ type: "battle-continue" }, presentBattleResponse).finally(() => {
					bossActionInFlight.current = false;
					if (!mounted.current) return;
					setSwapMotion(void 0);
					setClearingTiles(void 0);
					setFallRows(void 0);
					setActiveChain(void 0);
					setSignalReadout(void 0);
					setRecoveryReadout(void 0);
					setAnimating(false);
				});
			};
			(0, react.useEffect)(() => {
				if (battle.turnOwner !== "boss" || props.busy || animating || handoff || !pageVisible || bossActionInFlight.current) return;
				bossActionTimer.current = window.setTimeout(() => {
					bossActionTimer.current = void 0;
					runBossAction();
				}, BATTLE_MOTION.enemyPause);
				return () => {
					if (bossActionTimer.current !== void 0) window.clearTimeout(bossActionTimer.current);
					bossActionTimer.current = void 0;
				};
			}, [
				battle.id,
				battle.turnOwner,
				battle.bossActionsRemaining,
				props.busy,
				animating,
				handoff,
				pageVisible
			]);
			if (battle.mode === "wild" && encounter === void 0 || wild === void 0 || active === void 0 || activeDefinition === void 0) return null;
			const availableCores = CAPTURE_CORE_QUALITIES.filter((quality) => props.state.cores[quality] > 0);
			const captureReady = battle.mode === "wild" && battle.captureWindow;
			const bossStrikeLanded = attackPresentation?.actor === "boss" && attackPresentation.phase === "impact" || displayedPartyHp < battle.partyHp;
			const bossDamageForecast = damageReadout?.actor === "boss" && !damageReadout.settled ? Math.max(battle.pendingBossDamage, damageReadout.total) : battle.pendingBossDamage;
			const predictedPartyHp = bossStrikeLanded ? displayedPartyHp : Math.max(0, displayedPartyHp - Math.max(0, bossDamageForecast - displayedPartyShield));
			const partyDamagePreview = Math.max(0, displayedPartyHp - predictedPartyHp);
			const partyPendingHealing = recoveryReadout?.actor === "player" ? Math.max(0, recoveryReadout.to - recoveryReadout.from) : battle.pendingPartyHealing;
			const partyHealingFrom = recoveryReadout?.actor === "player" ? recoveryReadout.from : displayedPartyHp;
			const visibleWildShield = recoveryReadout?.actor === "boss" ? recoveryReadout.shieldTo : displayedWildShield + battle.pendingWildShielding;
			const visiblePartyShield = recoveryReadout?.actor === "player" ? recoveryReadout.shieldTo : displayedPartyShield + battle.pendingPartyShielding;
			const amplifierTitle = (amplifier, owner) => {
				const stat = amplifier.stat === "attack" ? props.zh ? "攻击增幅" : "Attack boost" : props.zh ? "防御穿透" : "Defense penetration";
				const scope = amplifier.scope === "team" ? props.zh ? "全队" : "Whole squad" : amplifier.scope === "member" ? (() => {
					const member = battle.party.find((value) => value.instanceId === amplifier.targetInstanceId);
					const definition = member === void 0 ? void 0 : creatureById(member.creatureId);
					return definition === void 0 ? props.zh ? "单体" : "Single ally" : creatureName(definition, props.zh);
				})() : amplifier.scope === "self" ? props.zh ? "自身" : "Self" : props.zh ? "对手" : "Opponent";
				const rounds = props.zh ? `剩余 ${amplifier.remainingRounds} 回合` : `${amplifier.remainingRounds} round${amplifier.remainingRounds === 1 ? "" : "s"} left`;
				const value = `${amplifier.valuePermille / 10}%`;
				const source = props.t(SIGNAL_EFFECT_KEYS[amplifier.signal]);
				return owner === "boss" ? `${source} · ${stat} · ${scope} · ${rounds}` : `${source} · ${stat} +${value} · ${scope} · ${rounds}`;
			};
			const bossHazardLimit = Math.min(6, 2 + battle.bossSkillTier);
			const bossLockLimit = Math.min(5, Math.max(3, battle.bossSkillTier));
			const bossSkillTitle = props.t("towerSkillTier", { tier: battle.bossSkillTier });
			const bossSkillMeta = `${props.t("bossEnergy")} ${battle.bossEnergy}/24`;
			const bossSkillBody = `${props.t("bossSkillTierDetail", {
				tier: battle.bossSkillTier,
				hazards: bossHazardLimit,
				locks: bossLockLimit
			})} ${battle.bossSkillArmed ? props.t("bossSkillReadyDetail") : props.t("bossSkillChargingDetail", { remaining: Math.max(0, 24 - battle.bossEnergy) })}`;
			const bossSkillLabel = `${bossSkillTitle}. ${bossSkillMeta}. ${bossSkillBody}`;
			const transitionTitle = props.transition === void 0 ? void 0 : props.t(props.transition.kind === "tower-cleared" ? "transitionTowerCleared" : props.transition.kind === "wild-defeated" ? "transitionWildDefeated" : props.transition.kind === "capture-success" ? "transitionCaptureSuccess" : props.transition.kind === "capture-failed" ? "transitionCaptureFailed" : "transitionBattleLost");
			const swap = (from, to) => {
				if (boardLocked || (visualBoard[from]?.lockedActions ?? 0) > 0 || (visualBoard[to]?.lockedActions ?? 0) > 0 || !areAdjacentTiles(from, to)) {
					setSelectedTile(to);
					return;
				}
				setSelectedTile(void 0);
				gestureRef.current = void 0;
				setGesture(void 0);
				setSwapMotion({
					from,
					to
				});
				setAnimating(true);
				(async () => {
					const epoch = animationEpoch.current;
					await pause(props.reducedMotion ? 180 : BATTLE_MOTION.swap + 30);
					if (!mounted.current || animationEpoch.current !== epoch) return;
					const response = await props.act({
						type: "battle-swap",
						from,
						to
					}, presentBattleResponse);
					if (!mounted.current) return;
					if (response === void 0) {
						setSwapMotion({
							from,
							to,
							returning: true
						});
						await pause(props.reducedMotion ? 180 : BATTLE_MOTION.return + 30);
						if (!mounted.current) return;
					}
					setSwapMotion(void 0);
					setClearingTiles(void 0);
					setFallRows(void 0);
					setActiveChain(void 0);
					setSignalReadout(void 0);
					setRecoveryReadout(void 0);
					setAnimating(false);
				})();
			};
			const castSkill = (creatureInstanceId) => {
				if (boardLocked) return;
				setAnimating(true);
				props.act({
					type: "battle-cast",
					creatureInstanceId
				}, async (response) => {
					const member = battle.party.find((value) => value.instanceId === creatureInstanceId);
					const creature = member === void 0 ? void 0 : creatureById(member.creatureId);
					const skill = member === void 0 ? void 0 : skillByCreatureId(member.creatureId);
					const epoch = animationEpoch.current;
					if (creature !== void 0 && skill !== void 0 && member !== void 0) {
						setProtocol({
							creature,
							name: props.zh ? skill.activeNameZh : skill.activeNameEn,
							captured: props.state.creatures.find((value) => value.instanceId === creatureInstanceId) ?? member
						});
						await pause(BATTLE_MOTION.protocol + 40);
						if (!mounted.current || animationEpoch.current !== epoch) return;
						setProtocol(void 0);
					}
					await presentBattleResponse(response);
				}).finally(() => {
					if (!mounted.current) return;
					setProtocol(void 0);
					setClearingTiles(void 0);
					setFallRows(void 0);
					setActiveChain(void 0);
					setSignalReadout(void 0);
					setRecoveryReadout(void 0);
					setAnimating(false);
				});
			};
			const select = (index) => {
				if (boardLocked || (visualBoard[index]?.lockedActions ?? 0) > 0) return;
				if (selectedTile === void 0) {
					setSelectedTile(index);
					return;
				}
				if (selectedTile === index) {
					setSelectedTile(void 0);
					return;
				}
				swap(selectedTile, index);
			};
			const moveGesture = (index, clientX, clientY, tileSize, element) => {
				const currentGesture = gestureRef.current;
				if (currentGesture === void 0 || currentGesture.index !== index || boardLocked) return;
				const offsetX = clientX - currentGesture.startX;
				const offsetY = clientY - currentGesture.startY;
				const limit = tileSize * .42;
				const nextGesture = {
					...currentGesture,
					offsetX: Math.max(-limit, Math.min(limit, offsetX)),
					offsetY: Math.max(-limit, Math.min(limit, offsetY))
				};
				gestureRef.current = nextGesture;
				element.style.setProperty("--drag-x", `${nextGesture.offsetX}px`);
				element.style.setProperty("--drag-y", `${nextGesture.offsetY}px`);
				const threshold = Math.max(15, tileSize * .28);
				if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) < threshold) return;
				const target = swipeTarget(index, offsetX, offsetY);
				if (target === void 0) return;
				resetDraggedTile(element);
				gestureRef.current = void 0;
				suppressNextClick(350);
				swap(index, target);
			};
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.battleBackdrop,
				children: (0, react_jsx_runtime.jsxs)("section", {
					ref: dialog.dialogRef,
					className: `${tracewild_module_css_default.battlePanel} ${partyHitKey > 0 ? tracewild_module_css_default.battleWasHit : ""}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": battle.mode === "tower" ? props.t("towerBattle") : props.t("battle"),
					tabIndex: -1,
					onKeyDown: dialog.onDialogKeyDown,
					children: [
						(0, react_jsx_runtime.jsxs)("header", {
							className: tracewild_module_css_default.battleHeader,
							children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: battle.mode === "tower" ? props.t("towerBattle") : props.t("battle") }), (0, react_jsx_runtime.jsxs)("span", { children: [
								battle.mode === "tower" && `${props.t("towerFloor", { floor: battle.towerFloor ?? 1 })} · `,
								props.t("round"),
								" ",
								battle.round,
								" · ",
								battle.turnOwner === "boss" ? `${props.t("bossMoves")} ${battle.bossActionsRemaining}/5` : `${props.t("movesRemaining")} ${battle.actionsRemaining}/5`
							] })] }), (0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.battleWindowActions,
								children: [(0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: tracewild_module_css_default.flee,
									disabled: locked || battle.turnOwner === "boss",
									onClick: () => {
										props.act({ type: "flee" });
									},
									children: props.t("flee")
								}), (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: tracewild_module_css_default.flee,
									disabled: locked,
									onClick: props.minimize,
									"aria-label": props.t("minimizeBattle"),
									title: props.t("minimizeBattle"),
									children: "−"
								})]
							})]
						}),
						(0, react_jsx_runtime.jsx)(BattleStage, {
							battle,
							creatures: props.state.creatures,
							t: props.t,
							zh: props.zh,
							locked,
							reducedMotion: props.reducedMotion,
							onCast: castSkill,
							displayedWildHp,
							displayedWildShield: visibleWildShield,
							displayedPartyHp,
							displayedPartyShield: visiblePartyShield,
							damage: damageReadout,
							attack: attackPresentation
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.matchBattleLayout,
							children: [
								(0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.partyColumn,
									children: (0, react_jsx_runtime.jsxs)("div", {
										className: tracewild_module_css_default.sharedPartyVitals,
										children: [
											(0, react_jsx_runtime.jsxs)("div", {
												className: tracewild_module_css_default.sharedHpHeader,
												children: [(0, react_jsx_runtime.jsx)("span", { children: props.t("teamRuntime") }), (0, react_jsx_runtime.jsxs)("div", {
													className: tracewild_module_css_default.sharedHpNumbers,
													children: [
														partyPendingHealing > 0 && (0, react_jsx_runtime.jsxs)("em", {
															className: tracewild_module_css_default.hpHealingValue,
															children: ["+", partyPendingHealing.toLocaleString()]
														}),
														visiblePartyShield > 0 && (0, react_jsx_runtime.jsxs)("small", { children: [
															props.t("shield"),
															" +",
															visiblePartyShield.toLocaleString()
														] }),
														(0, react_jsx_runtime.jsxs)("strong", { children: [
															displayedPartyHp.toLocaleString(),
															" / ",
															battle.partyMaxHp.toLocaleString()
														] })
													]
												})]
											}),
											(0, react_jsx_runtime.jsxs)("div", {
												className: `${tracewild_module_css_default.hpBar} ${tracewild_module_css_default.hpTeam}`,
												children: [
													(0, react_jsx_runtime.jsx)("i", { style: { width: `${percent(displayedPartyHp, battle.partyMaxHp)}%` } }),
													(0, react_jsx_runtime.jsx)("em", { style: {
														left: `${percent(predictedPartyHp, battle.partyMaxHp)}%`,
														width: `${percent(displayedPartyHp - predictedPartyHp, battle.partyMaxHp)}%`
													} }),
													partyPendingHealing > 0 && (0, react_jsx_runtime.jsx)("span", {
														className: `${tracewild_module_css_default.hpHealingBudget} ${recoveryReadout?.actor === "player" && recoveryReadout.settling ? tracewild_module_css_default.hpHealingSettling : ""}`,
														style: {
															left: `${percent(partyHealingFrom, battle.partyMaxHp)}%`,
															width: `${percent(partyPendingHealing, battle.partyMaxHp)}%`
														}
													}, recoveryReadout?.actor === "player" ? recoveryReadout.key : `party-heal-${battle.turn}`),
													visiblePartyShield > 0 && (0, react_jsx_runtime.jsx)("b", {
														className: `${tracewild_module_css_default.hpShieldBar} ${signalReadout?.actor === "player" && signalReadout.kind === "guard" ? tracewild_module_css_default.hpShieldActive : ""}`,
														style: { width: `${percent(visiblePartyShield, battle.partyMaxHp)}%` }
													})
												]
											}),
											partyDamagePreview > 0 && (0, react_jsx_runtime.jsxs)("small", {
												className: tracewild_module_css_default.teamDamageForecast,
												children: [
													props.t("pendingDamage"),
													" -",
													partyDamagePreview.toLocaleString()
												]
											})
										]
									})
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.boardColumn,
									children: [
										(0, react_jsx_runtime.jsxs)("div", {
											className: `${tracewild_module_css_default.turnSummary} ${battle.turnOwner === "boss" ? tracewild_module_css_default.turnSummaryBoss : ""}`,
											"aria-live": "polite",
											children: [
												(0, react_jsx_runtime.jsx)("span", {
													className: `${tracewild_module_css_default.ecologyPip} ${tracewild_module_css_default[`pip_${battle.turnOwner === "boss" ? wild.ecology : activeDefinition.ecology}`]}`,
													children: TILE_SYMBOLS[battle.turnOwner === "boss" ? wild.ecology : activeDefinition.ecology]
												}),
												(0, react_jsx_runtime.jsx)("strong", { children: battle.turnOwner === "boss" ? `${creatureName(wild, props.zh)} · ${props.t("bossTurn")}` : `${creatureName(activeDefinition, props.zh)} · ${props.t("activeTurn")}` }),
												battle.turnOwner === "player" && battle.partyAmplifiers.length > 0 && (0, react_jsx_runtime.jsx)("div", {
													className: tracewild_module_css_default.playerModifierStrip,
													"aria-label": props.zh ? "队伍增幅" : "Squad amplifiers",
													children: battle.partyAmplifiers.map((amplifier) => (0, react_jsx_runtime.jsxs)("span", {
														className: `${tracewild_module_css_default.combatModifierIcon} ${tracewild_module_css_default.playerModifierIcon} ${amplifier.stat === "attack" ? tracewild_module_css_default.modifierAttack : tracewild_module_css_default.modifierPierce}`,
														"data-tooltip": amplifierTitle(amplifier, "player"),
														"aria-label": amplifierTitle(amplifier, "player"),
														tabIndex: 0,
														children: [(0, react_jsx_runtime.jsx)("b", { children: amplifier.valuePermille / 10 }), (0, react_jsx_runtime.jsx)("small", { children: "%" })]
													}, `${amplifier.signal}-${amplifier.stat}-${amplifier.scope}-${amplifier.targetInstanceId ?? "all"}`))
												}),
												battle.turnOwner === "player" && (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													className: tracewild_module_css_default.turnSkipButton,
													disabled: locked,
													title: battle.captureWindow ? props.t("abandonCapture") : props.t("skipStageHint"),
													onClick: () => {
														props.act(battle.captureWindow || battle.actionsRemaining === 0 ? { type: "battle-continue" } : { type: "battle-skip-stage" }, presentBattleResponse);
													},
													children: props.t("skipTurn")
												}),
												(0, react_jsx_runtime.jsx)("span", {
													className: tracewild_module_css_default.actionDots,
													"aria-label": `${battle.turnOwner === "boss" ? props.t("bossMoves") : props.t("movesRemaining")} ${battle.turnOwner === "boss" ? battle.bossActionsRemaining : battle.actionsRemaining}`,
													children: [
														0,
														1,
														2,
														3,
														4
													].map((index) => (0, react_jsx_runtime.jsx)("i", { className: index < (battle.turnOwner === "boss" ? battle.bossActionsRemaining : battle.actionsRemaining) ? tracewild_module_css_default.actionDotActive : "" }, index))
												}),
												activeChain !== void 0 && (0, react_jsx_runtime.jsxs)("span", {
													className: tracewild_module_css_default.cascadePill,
													children: ["CHAIN ", activeChain]
												})
											]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: tracewild_module_css_default.boardStage,
											children: [
												protocol !== void 0 && (0, react_jsx_runtime.jsxs)("div", {
													className: tracewild_module_css_default.protocolBanner,
													role: "status",
													"aria-live": "polite",
													children: [(0, react_jsx_runtime.jsx)(CreatureSprite, {
														creature: protocol.creature,
														captured: protocol.captured,
														size: "medium",
														eager: true
													}), (0, react_jsx_runtime.jsxs)("div", { children: [
														(0, react_jsx_runtime.jsx)("small", { children: props.t("activeSkill") }),
														(0, react_jsx_runtime.jsx)("strong", { children: protocol.name }),
														(0, react_jsx_runtime.jsx)("span", { children: creatureName(protocol.creature, props.zh) })
													] })]
												}),
												(0, react_jsx_runtime.jsx)("div", {
													ref: boardElement,
													className: tracewild_module_css_default.matchBoard,
													role: "grid",
													"aria-label": props.t("boardHelp"),
													"aria-description": props.t("keyboardBoard"),
													"aria-rowcount": 8,
													"aria-colcount": 8,
													"aria-busy": boardLocked,
													onFocusCapture: () => {
														boardHadFocus.current = true;
													},
													onBlurCapture: (event) => {
														if (event.relatedTarget !== null && !event.currentTarget.contains(event.relatedTarget)) boardHadFocus.current = false;
													},
													children: Array.from({ length: 8 }, (_, row) => (0, react_jsx_runtime.jsx)("div", {
														role: "row",
														className: tracewild_module_css_default.boardRow,
														children: visualBoard.slice(row * 8, (row + 1) * 8).map((tile, column) => {
															const index = row * 8 + column;
															const dragging = gesture?.index === index;
															const fallDistance = fallRows?.[index] ?? 0;
															const tileStyle = {
																"--tile-row": Math.floor(index / 8),
																"--drag-x": `${dragging ? gesture.offsetX : 0}px`,
																"--drag-y": `${dragging ? gesture.offsetY : 0}px`,
																"--fall-y": `calc(${-fallDistance} * (100% + var(--board-gap)))`,
																"--fall-duration": `${tileFallTime(fallDistance)}ms`,
																"--fall-delay": `${column * BATTLE_MOTION.fallStagger}ms`,
																"--swap-duration": `${BATTLE_MOTION.swap}ms`,
																"--return-duration": `${BATTLE_MOTION.return}ms`,
																"--clear-duration": `${BATTLE_MOTION.clear}ms`,
																"--swap-x": swapMotion === void 0 ? "0px" : `calc(${(index === swapMotion.from ? swapMotion.to : swapMotion.from) % 8 - column} * (100% + var(--board-gap)))`,
																"--swap-y": swapMotion === void 0 ? "0px" : `calc(${Math.floor((index === swapMotion.from ? swapMotion.to : swapMotion.from) / 8) - row} * (100% + var(--board-gap)))`
															};
															return (0, react_jsx_runtime.jsxs)("button", {
																type: "button",
																role: "gridcell",
																"data-cell": index,
																tabIndex: keyboardTile === index ? 0 : -1,
																"aria-selected": selectedTile === index,
																"aria-rowindex": row + 1,
																"aria-colindex": column + 1,
																onFocus: () => {
																	setFocusedTile(index);
																},
																onKeyDown: (event) => {
																	if (![
																		"ArrowLeft",
																		"ArrowRight",
																		"ArrowUp",
																		"ArrowDown",
																		"Home",
																		"End"
																	].includes(event.key)) return;
																	event.preventDefault();
																	event.stopPropagation();
																	let next = boardNeighbour(index, event.key);
																	for (let tries = 0; tries < 8 && (visualBoard[next]?.lockedActions ?? 0) > 0; tries += 1) {
																		const candidate = boardNeighbour(next, event.key === "Home" ? "ArrowRight" : event.key === "End" ? "ArrowLeft" : event.key);
																		if (candidate === next) break;
																		next = candidate;
																	}
																	if ((visualBoard[next]?.lockedActions ?? 0) === 0) {
																		setFocusedTile(next);
																		boardElement.current?.querySelector(`[data-cell="${next}"]`)?.focus({ preventScroll: true });
																	}
																},
																draggable: false,
																style: tileStyle,
																className: `${tracewild_module_css_default.matchTile} ${tracewild_module_css_default[`tile_${tile.ecology}`]} ${selectedTile === index ? tracewild_module_css_default.matchTileSelected : ""} ${dragging ? tracewild_module_css_default.matchTileDragging : ""} ${clearingTiles?.has(index) === true ? tracewild_module_css_default.matchTileClearing : ""} ${fallDistance > 0 ? tracewild_module_css_default.matchTileFalling : ""} ${tile.special !== "none" ? tracewild_module_css_default.matchTileSpecial : ""} ${(tile.lockedActions ?? 0) > 0 ? tracewild_module_css_default.matchTileLocked : ""} ${(tile.hazardActions ?? 0) > 0 ? tracewild_module_css_default.matchTileHazard : ""} ${swapMotion !== void 0 && (index === swapMotion.from || index === swapMotion.to) ? swapMotion.returning ? tracewild_module_css_default.tileReturning : tracewild_module_css_default.tileSwapping : ""}`,
																"aria-label": tileLabel(tile, index, props.t),
																disabled: boardLocked || (tile.lockedActions ?? 0) > 0,
																onClick: () => {
																	if (suppressClick.current) {
																		suppressClick.current = false;
																		return;
																	}
																	select(index);
																},
																onDragStart: (event) => {
																	event.preventDefault();
																},
																onPointerDown: (event) => {
																	if (event.button !== 0 || boardLocked || (tile.lockedActions ?? 0) > 0) return;
																	event.currentTarget.setPointerCapture(event.pointerId);
																	draggedTileElement.current = event.currentTarget;
																	resetDraggedTile(event.currentTarget);
																	const nextGesture = {
																		index,
																		pointerId: event.pointerId,
																		startX: event.clientX,
																		startY: event.clientY,
																		offsetX: 0,
																		offsetY: 0
																	};
																	gestureRef.current = nextGesture;
																	setGesture(nextGesture);
																},
																onPointerMove: (event) => {
																	if (gestureRef.current?.pointerId !== event.pointerId) return;
																	event.preventDefault();
																	moveGesture(index, event.clientX, event.clientY, event.currentTarget.clientWidth, event.currentTarget);
																},
																onPointerUp: (event) => {
																	const currentGesture = gestureRef.current;
																	if (currentGesture?.pointerId !== event.pointerId) return;
																	const offsetX = event.clientX - currentGesture.startX;
																	const offsetY = event.clientY - currentGesture.startY;
																	const threshold = Math.max(15, event.currentTarget.clientWidth * .28);
																	const target = Math.max(Math.abs(offsetX), Math.abs(offsetY)) >= threshold ? swipeTarget(index, offsetX, offsetY) : void 0;
																	if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) > 6) suppressNextClick(250);
																	gestureRef.current = void 0;
																	resetDraggedTile(event.currentTarget);
																	setGesture(void 0);
																	if (target !== void 0) swap(index, target);
																},
																onPointerCancel: (event) => {
																	gestureRef.current = void 0;
																	resetDraggedTile(event.currentTarget);
																	setGesture(void 0);
																},
																onLostPointerCapture: (event) => {
																	if (gestureRef.current?.pointerId !== event.pointerId) return;
																	gestureRef.current = void 0;
																	resetDraggedTile(event.currentTarget);
																	setGesture(void 0);
																},
																children: [
																	(0, react_jsx_runtime.jsx)("span", {
																		"aria-hidden": "true",
																		children: TILE_SYMBOLS[tile.ecology]
																	}),
																	tile.special !== "none" && (0, react_jsx_runtime.jsx)("b", {
																		"aria-hidden": "true",
																		children: tile.special === "origin" ? "◎" : tile.special === "burst" ? "✣" : tile.special === "row" ? "↔" : "↕"
																	}),
																	(tile.lockedActions ?? 0) > 0 && (0, react_jsx_runtime.jsx)("em", {
																		"aria-hidden": "true",
																		children: "⌁"
																	}),
																	(tile.hazardActions ?? 0) > 0 && (0, react_jsx_runtime.jsx)("small", {
																		className: tracewild_module_css_default.hazardMark,
																		"aria-hidden": "true",
																		children: "!"
																	})
																]
															}, index);
														})
													}, row))
												}),
												captureReady && (0, react_jsx_runtime.jsxs)("section", {
													className: `${tracewild_module_css_default.captureBoardOverlay} ${captureIntro ? tracewild_module_css_default.captureBoardIntro : ""}`,
													"aria-live": "polite",
													children: [
														(0, react_jsx_runtime.jsxs)("header", { children: [
															(0, react_jsx_runtime.jsx)("small", { children: "CAPTURE PHASE" }),
															(0, react_jsx_runtime.jsx)("strong", { children: props.t("capturePhaseTitle") }),
															(0, react_jsx_runtime.jsx)("span", { children: props.t("capturePhaseHint") })
														] }),
														availableCores.length === 0 && (0, react_jsx_runtime.jsx)("p", { children: props.t("noCores") }),
														(0, react_jsx_runtime.jsx)("div", {
															className: tracewild_module_css_default.captureCoreGrid,
															children: availableCores.map((quality) => (0, react_jsx_runtime.jsxs)("button", {
																type: "button",
																className: tracewild_module_css_default[`core_${quality}`],
																disabled: locked,
																onClick: () => {
																	props.act({
																		type: "capture",
																		quality
																	});
																},
																"aria-label": `${props.t(CORE_KEYS[quality])} · ${Math.round(visibleCaptureChance(props.state, quality) * 100)}% · ${props.state.cores[quality]}`,
																children: [
																	(0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
																	(0, react_jsx_runtime.jsx)("span", { children: props.t(CORE_KEYS[quality]) }),
																	(0, react_jsx_runtime.jsxs)("b", { children: [Math.round(visibleCaptureChance(props.state, quality) * 100), "%"] }),
																	(0, react_jsx_runtime.jsxs)("small", { children: ["×", props.state.cores[quality]] })
																]
															}, quality))
														})
													]
												})
											]
										}),
										(0, react_jsx_runtime.jsx)("p", {
											className: tracewild_module_css_default.boardHelp,
											children: props.t("boardHelp")
										}),
										(0, react_jsx_runtime.jsxs)("p", {
											className: `${tracewild_module_css_default.signalRule} ${tracewild_module_css_default[`signalRule_${battle.turnOwner === "boss" ? wild.ecology : activeDefinition.ecology}`]}`,
											children: [props.t(SIGNAL_RULE_KEYS[battle.turnOwner === "boss" ? wild.ecology : activeDefinition.ecology]), battle.turnOwner === "boss" ? ` ${props.t("signalBossRule")}` : ""]
										})
									]
								}),
								battle.mode === "tower" && (0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.towerBattleStatus,
									children: [
										(0, react_jsx_runtime.jsx)("span", {
											className: tracewild_module_css_default.towerBattleMark,
											"aria-hidden": "true",
											children: "▲"
										}),
										(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("towerNoCapture") }), (0, react_jsx_runtime.jsx)("small", { children: props.t("towerBattleReward", { floor: battle.towerFloor ?? 1 }) })] }),
										(0, react_jsx_runtime.jsxs)("b", {
											className: tracewild_module_css_default.battleHoverTrigger,
											tabIndex: 0,
											"aria-label": bossSkillLabel,
											children: [bossSkillTitle, (0, react_jsx_runtime.jsx)(BattleHoverDetail, {
												title: bossSkillTitle,
												meta: bossSkillMeta,
												body: bossSkillBody
											})]
										})
									]
								})
							]
						}),
						props.transition !== void 0 && transitionTitle !== void 0 && (0, react_jsx_runtime.jsxs)("div", {
							className: `${tracewild_module_css_default.battleTransition} ${props.transition.kind.startsWith("capture") ? tracewild_module_css_default.battleTransitionCapture : ""} ${props.transition.kind === "capture-failed" || props.transition.kind === "battle-lost" ? tracewild_module_css_default.battleTransitionFailed : ""}`,
							role: "status",
							"aria-live": "assertive",
							children: [
								(0, react_jsx_runtime.jsx)("span", { "aria-hidden": "true" }),
								(0, react_jsx_runtime.jsx)("small", { children: props.transition.kind.startsWith("capture") ? "CAPTURE" : "BATTLE RESULT" }),
								(0, react_jsx_runtime.jsx)("strong", { children: transitionTitle })
							]
						}, props.transition.key),
						(0, react_jsx_runtime.jsx)("div", {
							ref: battleEffects.layer,
							className: tracewild_module_css_default.particleLayer,
							"aria-hidden": "true"
						})
					]
				})
			});
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/components/TraceWildSettings.js
		/** DSH Settings entry for the persisted Codekin gameplay switch. */
		function TraceWildSettings({ t }) {
			const connection = (0, react.useMemo)(() => createTraceWildConnection(), []);
			const [snapshot, setSnapshot] = (0, react.useState)();
			const [online, setOnline] = (0, react.useState)(true);
			const [busy, setBusy] = (0, react.useState)(false);
			const [failed, setFailed] = (0, react.useState)(false);
			const [deleteArmed, setDeleteArmed] = (0, react.useState)(false);
			const [deleted, setDeleted] = (0, react.useState)(false);
			const adoptSnapshot = (0, react.useCallback)((value) => {
				setSnapshot((current) => current?.state.createdAt === value.state.createdAt && current.state.revision === value.state.revision ? current : value);
			}, []);
			const refresh = (0, react.useCallback)(async (signal) => {
				try {
					adoptSnapshot(await connection.load(signal));
					setOnline(true);
					setFailed(false);
				} catch {
					if (signal?.aborted !== true) {
						setOnline(false);
						setFailed(true);
					}
				}
			}, [adoptSnapshot, connection]);
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				refresh(controller.signal);
				const unsubscribe = connection.subscribe(adoptSnapshot, setOnline);
				return () => {
					controller.abort();
					unsubscribe();
				};
			}, [
				adoptSnapshot,
				connection,
				refresh
			]);
			const enabled = snapshot?.state.enabled ?? false;
			const toggle = async () => {
				if (busy || snapshot === void 0) return;
				setBusy(true);
				setFailed(false);
				try {
					adoptSnapshot(await connection.act({
						type: "set-enabled",
						enabled: !enabled
					}));
					notifyTraceWildSettingsChanged();
					setOnline(true);
					setDeleted(false);
				} catch {
					setFailed(true);
					await refresh();
				} finally {
					setBusy(false);
				}
			};
			const clearLocalData = async () => {
				if (busy || snapshot === void 0 || !deleteArmed) return;
				setBusy(true);
				setFailed(false);
				try {
					adoptSnapshot(await connection.clearLocalData());
					notifyTraceWildSettingsChanged();
					setOnline(true);
					setDeleted(true);
					setDeleteArmed(false);
				} catch {
					setFailed(true);
					await refresh();
				} finally {
					setBusy(false);
				}
			};
			return (0, react_jsx_runtime.jsxs)("section", {
				className: tracewild_module_css_default.settingsPage,
				"aria-labelledby": "codekin-settings-title",
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: tracewild_module_css_default.settingsHero,
						children: [(0, react_jsx_runtime.jsx)("img", {
							src: "/api/tracewild/assets/sprites/codekin-launcher-v2.webp",
							alt: "",
							width: 384,
							height: 384,
							loading: "lazy",
							decoding: "async",
							draggable: false
						}), (0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("p", { children: "CODEKIN" }),
							(0, react_jsx_runtime.jsx)("h2", {
								id: "codekin-settings-title",
								children: t("settingsTitle")
							}),
							(0, react_jsx_runtime.jsx)("span", { children: t("settingsDescription") })
						] })]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: tracewild_module_css_default.settingsCard,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: t("settingsEnabled") }), (0, react_jsx_runtime.jsx)("span", { children: t("settingsEnabledHint") })] }), (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "switch",
							"aria-checked": enabled,
							"aria-label": t("settingsEnabled"),
							className: `${tracewild_module_css_default.settingsSwitch} ${enabled ? tracewild_module_css_default.settingsSwitchOn : ""}`,
							disabled: busy || snapshot === void 0 || !online,
							onClick: () => {
								toggle();
							},
							children: [(0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }), (0, react_jsx_runtime.jsx)("span", { children: enabled ? t("settingsOn") : t("settingsOff") })]
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: `${tracewild_module_css_default.settingsCard} ${tracewild_module_css_default.settingsStorageCard}`,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("strong", { children: t("settingsStorage") }),
							(0, react_jsx_runtime.jsx)("code", { children: "codekinsave/state.json" }),
							(0, react_jsx_runtime.jsx)("span", { children: t("settingsStorageHint") })
						] }), deleteArmed ? (0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.settingsDeleteActions,
							children: [(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy || snapshot === void 0 || !online,
								onClick: () => {
									setDeleteArmed(false);
								},
								children: t("settingsDeleteCancel")
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.settingsDeleteConfirm,
								disabled: busy || snapshot === void 0 || !online,
								onClick: () => {
									clearLocalData();
								},
								children: t("settingsDeleteConfirm")
							})]
						}) : (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: tracewild_module_css_default.settingsDeleteButton,
							disabled: busy || snapshot === void 0 || !online,
							onClick: () => {
								setDeleteArmed(true);
							},
							children: t("settingsDeleteData")
						})]
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: failed || !online ? tracewild_module_css_default.settingsError : tracewild_module_css_default.settingsStatus,
						role: "status",
						children: failed || !online ? t("settingsUnavailable") : deleted ? t("settingsDeleted") : snapshot === void 0 ? t("settingsLoading") : enabled ? t("settingsOnHint") : t("settingsOffHint")
					})
				]
			});
		}
		//#endregion
		//#region lib/types/packages/renderer-react/src/locales.js
		const NS = "tracewild";
		const zh = {
			appearanceTitle: "更换外观",
			appearanceClose: "关闭外观选择",
			appearanceOriginal: "原形",
			appearanceEvolved: "进化形",
			appearanceSelected: "当前外观",
			appearanceChoose: "使用此外观",
			appearanceUnlockLevel: "Lv.{level} 解锁",
			appearanceHint: "外观独立保存，不影响属性与战斗能力。",
			appearanceBattleLocked: "战斗结束后可以更换外观。",
			appearanceUnavailable: "进化立绘暂不可用",
			evolutionUnlocked: "进化形解锁 · Lv.30",
			appearanceFailed: "外观未能更换，请稍后重试。",
			reduceMotion: "减少动态效果",
			resetWindow: "窗口归位",
			dismissNotice: "关闭提示",
			unsavedSquad: "保存这次编队调整？",
			unsavedSquadHint: "离开前可以保存，也可以保留原来的编队。",
			keepEditing: "继续编辑",
			saveAndLeave: "保存并离开",
			discardAndLeave: "放弃调整",
			searchCodekin: "搜索名称或图鉴编号",
			emptySlot: "选择伙伴",
			squadSlot: "出战 {slot} · {name}",
			keyboardBoard: "方向键移动，空格或回车选择两个相邻色块。",
			title: "码灵",
			subtitle: "你的 DSH 活动正在生成一座码灵世界",
			open: "打开码灵",
			close: "关闭",
			dragWindow: "按住标题栏可拖动，双击归位",
			dragLauncher: "可拖动入口位置",
			minimizeBattle: "收起窗口，保留战斗",
			systemMotion: "已跟随系统设置减少动态效果",
			settingsTitle: "码灵",
			settingsDescription: "管理码灵玩法是否响应你的 DSH 会话事件。",
			settingsEnabled: "启用码灵",
			settingsEnabledHint: "关闭后入口会隐藏，并暂停事件奖励、野生码灵刷新和挂机计时；已有进度会保留。",
			settingsOn: "已启用",
			settingsOff: "已停用",
			settingsLoading: "正在读取码灵设置…",
			settingsUnavailable: "码灵设置暂时不可用，请稍后重试。",
			settingsOnHint: "码灵正在监听不含正文的会话结果事件。",
			settingsOffHint: "码灵已暂停；你的编队与道具不会被删除。",
			settingsStorage: "本地存档与卸载",
			settingsStorageHint: "通过 dsh-web 插件管理器卸载时会保留此存档。若要彻底卸载，请先在这里永久删除存档，再卸载插件。",
			settingsDeleteData: "删除本地存档",
			settingsDeleteConfirm: "确认永久删除",
			settingsDeleteCancel: "取消",
			settingsDeleted: "本地存档已删除，码灵已停用；现在可以从插件管理器卸载。",
			map: "码灵地图",
			squad: "码灵",
			dex: "图鉴",
			inventory: "核心与记录",
			loading: "正在连接码灵世界…",
			disconnected: "码灵暂时离线，正在等待 Host 恢复。",
			retry: "重试连接",
			newEncounter: "新的码灵出现了",
			starterTitle: "选择你的初始码灵",
			starterBody: "它会成为第一位出战伙伴。之后可随时调整三只码灵的编队。",
			choose: "选择",
			mapEmpty: "继续正常使用 DSH，完成回合后这里会出现码灵。",
			enhanced: "装甲异常体",
			mapKicker: "属性信号层",
			mapSignalCount: "地图驻留 {count}/{max}",
			encounterLeavingSoon: "即将离场",
			encounterLeavesMinutes: "{count} 分钟后离场",
			encounterLeavesHours: "{count} 小时后离场",
			encounterLeavesDays: "{count} 天后离场",
			encounterResident: "驻留中",
			towerTitle: "无尽栈塔",
			towerNextFloor: "第 {floor} 层",
			towerFloor: "栈塔第 {floor} 层",
			towerHighest: "最高通关",
			towerChallenge: "开始挑战",
			towerKicker: "持续挑战协议",
			towerIntro: "越过不断增强的守卫，逐层结算养成素材。",
			towerCurrentTarget: "当前守层者",
			towerAttempts: "挑战次数",
			towerClears: "成功突破",
			towerPath: "攀登路径",
			towerSkillTier: "Boss 技能阶 {tier}",
			towerRewardPreview: "本层至少 {count} 份素材 · {bonus}",
			towerMilestoneReady: "里程碑追加高阶素材",
			towerMilestoneHint: "每 10 层追加高阶素材",
			towerBattle: "无尽栈塔战",
			towerNoCapture: "塔层守卫不可捕捉",
			towerBattleReward: "击败第 {floor} 层后立即结算升级素材",
			towerCleared: "栈塔层数已突破，升级素材已结算。",
			towerLog: "无尽栈塔层数突破",
			battle: "指令三消战",
			flee: "撤离",
			capture: "投放收容核心",
			armor: "防火墙",
			health: "运行值",
			shield: "防护层",
			energy: "指令值",
			quality: "品质",
			round: "队伍轮次",
			movesRemaining: "剩余交换",
			activeTurn: "行动中",
			statRuntime: "运行值",
			statCompute: "算力",
			statGuard: "防护",
			statResponse: "响应",
			boardHelp: "向相邻方向滑动色块；也可依次点击两个色块。无效交换不消耗次数。",
			invalidSwap: "这次交换没有形成消除。",
			captured: "捕捉成功",
			captureFailed: "本次收容未成功；仍可更换核心继续尝试。",
			battleLost: "出战编队失去战斗能力，已安全撤回。",
			skillReleased: "主动协议已释放。",
			battleActionUnavailable: "战斗状态已更新，请重试；若刚更新插件，请重启 DSH。",
			skipTurn: "SKIP",
			skipStage: "结束本码灵行动",
			skipStageHint: "保留目标运行值，直接交给下一只码灵；队伍走完后仍会结算已累计的总算力。",
			battleStageSkipped: "当前码灵结束了行动",
			noCores: "没有可用核心；完成 DSH 回合会获得新的核心。",
			battleHint: "三只码灵共享运行值；双方基础 3 次行动，直消 4 颗返还行动，直消 5 颗增加行动。队伍总攻后进入 Boss 自动三消阶段。",
			signalRepair: "运行修复",
			signalGuard: "缓存护盾",
			signalSync: "智算同步",
			signalOverclock: "编译超频",
			signalBreach: "异常穿透",
			signalRuleLumen: "智算信号：黄珠获得 18% 同步增幅",
			signalRuleForge: "编译信号：红珠随颗数与连锁超频",
			signalRuleRelay: "网络信号：蓝珠转为共享防护层",
			signalRuleAegis: "防护信号：绿珠转为共享运行值恢复",
			signalRuleGlitch: "异常信号：紫珠穿透大部分防御",
			signalBossRule: "Boss 仍保留部分攻击。",
			captureLocked: "完成队伍总攻并将目标运行值压到 50% 以下，才会出现捕捉窗口。",
			captureReady: "目标已进入可捕捉状态。",
			capturePhaseTitle: "选择收容核心",
			capturePhaseHint: "失败后可继续尝试，直到主动放弃或核心耗尽。",
			abandonCapture: "放弃收容 · 继续战斗",
			transitionTowerCleared: "栈塔突破",
			transitionWildDefeated: "目标击破",
			transitionCaptureSuccess: "收容完成",
			transitionCaptureFailed: "核心脱离",
			transitionBattleLost: "队伍撤回",
			passiveSkill: "被动",
			activeSkill: "主动",
			castSkill: "释放主动",
			skillReady: "指令值已满",
			skillCharging: "正在充能",
			skillSpent: "本阶段已释放",
			enemyIntent: "敌方意图",
			intentStrike: "蓄力冲击",
			intentSweep: "全体震荡",
			intentGuard: "防火墙增幅",
			intentDisrupt: "总线重排",
			intentCorrupt: "危险色块注入",
			intentMark: "主动协议封锁",
			intentLock: "属性珠封锁",
			intentFreeze: "行动冻结",
			enemyIntentMeta: "目标：{target} · 结算：Boss 本轮行动结束",
			intentDetailStrike: "本轮每次三消都会累计伤害，行动结束后一次扣除队伍共享运行值。",
			intentDetailGuard: "指令值就绪时消耗 24 点，为自身排入最大运行值 10% 的防护层，并在本轮结束统一获得。",
			intentDetailDisrupt: "指令值就绪时消耗 24 点，在本轮结束重新排列棋盘。",
			intentDetailCorrupt: "指令值就绪时消耗 24 点，注入最多 {count} 颗持续 3 次行动的危险色块；消除它会损失共享运行值。",
			intentDetailMark: "指令值就绪时消耗 24 点，使目标失去 2 点指令值，并封锁其主动协议 1 个行动阶段。",
			intentDetailLock: "指令值就绪时消耗 24 点，封锁目标属性最多 {count} 颗色珠 2 次行动。",
			intentDetailFreeze: "指令值就绪时消耗 24 点，使目标的下一个行动阶段直接跳过，并进入强控冷却。",
			bossSkillTierDetail: "技能阶 {tier}：危险色块上限 {hazards}，属性珠封锁上限 {locks}。高阶会提高强控概率和伤害上限；5 阶半血后进入第二阶段。",
			bossSkillReadyDetail: "本轮专属技能已就绪，将在 Boss 行动结束时消耗 24 点并执行上方敌方意图。",
			bossSkillChargingDetail: "本轮尚未武装专属技能，距离 24 点还差 {remaining} 点；即使本轮充满，也会在下一次 Boss 阶段检查。",
			targetAll: "全体",
			targetSelf: "自身",
			targetSingle: "单体",
			targetTeam: "共享运行值",
			targetBoard: "棋盘",
			targetMember: "一名码灵",
			lockedTile: "封锁中",
			hazardTile: "危险色块，剩余 {actions} 次行动",
			specialRow: "横向指令",
			specialColumn: "纵向指令",
			specialBurst: "脉冲指令",
			specialOrigin: "核心指令",
			squadHelp: "查看你拥有的全部码灵；点击任意码灵查看详情与养成。",
			squadEditHelp: "选择 1–3 只码灵并确定出战顺序；再次点击可取消选择。",
			editSquad: "调整编队",
			saveSquad: "保存",
			cancelSquad: "取消",
			squadSelection: "已选择 {count}/3",
			rosterClassify: "分类",
			rosterControls: "码灵分类与排序",
			rosterAttribute: "属性",
			rosterSort: "排序",
			rosterAll: "全部",
			rosterSortDefault: "默认顺序",
			rosterSortLevelAsc: "等级升序",
			rosterSortLevelDesc: "等级降序",
			rosterResults: "共 {count} 只码灵",
			rosterReset: "重置",
			rosterDeployed: "出战",
			rosterNoMatches: "没有符合当前分类的码灵",
			codekinDetail: "码灵详情",
			closeCodekinDetail: "关闭码灵详情",
			codekinStats: "详细数值",
			codekinProtocols: "战斗协议",
			growthMaterialChoice: "选择升级道具",
			releaseCreature: "放生码灵",
			releaseConfirmTitle: "确认放生",
			releaseConfirmBody: "确定要放生“{name}”吗？此操作无法撤销，返还素材只取决于码灵品质。",
			releaseReward: "预计返还",
			releaseCancel: "再想想",
			releaseConfirm: "确认放生",
			releaseLastBlocked: "至少需要保留一只码灵",
			released: "码灵已放生，品质素材已返还。",
			level: "等级",
			levelCap: "满级",
			xp: "经验",
			feed: "使用",
			wins: "胜场",
			dexSeen: "已发现",
			dexCaught: "已收容",
			undiscovered: "未发现",
			totalTurns: "完成回合",
			failures: "异常事件",
			captureCount: "成功收容",
			streak: "当前连胜",
			eventLog: "最近属性事件",
			emptyLog: "还没有事件。",
			privacy: "只使用事件类型和结果生成玩法；不读取或保存提示词、回复、命令、路径及错误正文。",
			corePebble: "朴素",
			corePulse: "脉冲",
			corePrism: "棱晶",
			coreNova: "星辉",
			coreOrigin: "源初",
			ecologyLumen: "智算",
			ecologyForge: "编译",
			ecologyRelay: "网络",
			ecologyAegis: "防护",
			ecologyGlitch: "异常",
			rarityCommon: "常见",
			rarityUncommon: "少见",
			rarityRare: "稀有",
			rarityApex: "顶级",
			coreInventory: "收容核心",
			materialInventory: "升级素材",
			growth: "码灵养成",
			idleReward: "上次领取了 {minutes} 分钟挂机补给",
			defeatCount: "击败野生码灵",
			claimIdleReward: "领取挂机补给",
			idleRewardReady: "挂机补给已备好",
			idleRewardMinutes: "累计 {minutes} 分钟",
			idleClaimed: "挂机补给已领取",
			rewardUnavailable: "补给已失效或已被领取",
			rewardKicker: "CODE CACHE",
			rewardTitle: "获得物品",
			rewardDismiss: "继续",
			captureCoreItem: "{quality}核心",
			growthMaterialItem: "{quality}素材",
			captureCoreDescription: "捕捉道具 · 捕捉效能 ×{power}",
			growthMaterialDescription: "升级道具 · 使用后获得 {xp} 经验",
			creatureItemDescription: "{quality}品质 · {ecology}属性的新伙伴",
			logCore: "完成事件掉落了核心",
			logMaterial: "获得了升级素材",
			logIdle: "领取了挂机补给",
			logEncounter: "地图出现了新的码灵",
			logCapture: "收容了一只码灵",
			logStarter: "初始伙伴加入编队",
			logDefeat: "对战撤回",
			logRelease: "放生码灵并回收了品质素材",
			wildDefeated: "野生码灵已被击败，掉落了升级素材。",
			materialUsed: "升级素材已使用。",
			battleStart: "遭遇开始",
			battleMatch: "三消输出 {amount} 点算力",
			battleCombo: "触发 {amount} 层连锁",
			battleArmor: "击破一层防火墙",
			battleSkill: "主动协议输出 {amount} 点算力",
			battleHeal: "恢复 {amount} 点运行值",
			battleShield: "获得 {amount} 点防护层",
			battleEnemy: "受到 {amount} 点算力冲击",
			battleEnemySweep: "全队受到 {amount} 点震荡冲击",
			battleEnemyShield: "敌方防护提升至 {amount}",
			battleEnemyDelay: "敌方行动被延迟",
			battleSwitch: "{name} 进入行动位",
			battleEnemyLock: "敌方封锁了 {amount} 颗属性珠",
			battleEnemyFreeze: "一名码灵被冻结 {amount} 个行动阶段",
			battleFrozenSkip: "冻结生效，本行动阶段已跳过",
			battleEnemyHazard: "敌方注入了 {amount} 颗危险色块",
			battleEnemySeal: "一名码灵的主动协议被封锁",
			battleHazardDamage: "危险色块造成 {amount} 点共享运行值损失",
			battlePhaseShift: "Boss 进入第二阶段并获得 {amount} 点防护层",
			battleActionRefund: "直消 4 颗，返还本次行动",
			battleActionBonus: "直消 5 颗，追加 {amount} 次行动",
			battleTeamStrike: "队伍总攻造成 {amount} 点最终伤害",
			battleCaptureFail: "核心未能稳定目标",
			pendingDamage: "待结算总算力",
			stageDamage: "本阶段算力",
			totalDamage: "TOTAL DAMAGE",
			enemyDamage: "ENEMY DAMAGE",
			teamRuntime: "队伍共享运行值",
			frozen: "冻结",
			skillSealed: "协议封锁",
			skillOk: "SKILL OK",
			continueBattle: "继续战斗",
			skipFrozen: "跳过冻结阶段",
			lastTeamStrike: "上次队伍总攻",
			bossTurn: "Boss 回合",
			bossMoves: "Boss 行动",
			bossEnergy: "Boss 指令值",
			bossCharge: "算力蓄积",
			bossActing: "Boss 正在选择交换并积攒算力",
			enemyActing: "敌方行动中",
			battleBossMatch: "Boss 消除了 {amount} 颗色珠",
			battleBossCombo: "Boss 触发 {amount} 层连锁",
			battleBossEnergy: "Boss 获得 {amount} 点指令值",
			battleBossRefund: "Boss 直消 4 颗，返还本次行动",
			battleBossBonus: "Boss 直消 5 颗，追加 {amount} 次行动",
			battleBossSkill: "Boss 释放了专属技能"
		};
		const en = {
			appearanceTitle: "Change appearance",
			appearanceClose: "Close appearance selection",
			appearanceOriginal: "Original",
			appearanceEvolved: "Evolved",
			appearanceSelected: "Current appearance",
			appearanceChoose: "Use this appearance",
			appearanceUnlockLevel: "Unlocks at Lv.{level}",
			appearanceHint: "Saved for this Codekin. Stats and abilities stay the same.",
			appearanceBattleLocked: "Change appearance after the battle.",
			appearanceUnavailable: "Evolved art unavailable",
			evolutionUnlocked: "Evolution unlocked · Lv.30",
			appearanceFailed: "Could not change appearance. Please try again.",
			reduceMotion: "Reduce motion",
			resetWindow: "Center window",
			dismissNotice: "Dismiss notice",
			unsavedSquad: "Save your squad changes?",
			unsavedSquadHint: "Save this lineup before leaving, or keep your previous squad.",
			keepEditing: "Keep editing",
			saveAndLeave: "Save & leave",
			discardAndLeave: "Discard changes",
			searchCodekin: "Search name or index number",
			emptySlot: "Choose a partner",
			squadSlot: "Slot {slot} · {name}",
			keyboardBoard: "Arrow keys to move. Space or Enter to select adjacent panels.",
			title: "Codekin",
			subtitle: "Your DSH activity is growing a world of Codekin",
			open: "Open Codekin",
			close: "Close",
			dragWindow: "Drag the title bar to move; double-click to center",
			dragLauncher: "Drag to reposition",
			minimizeBattle: "Minimize and keep battle",
			systemMotion: "Reduced motion follows your system setting",
			settingsTitle: "Codekin",
			settingsDescription: "Control whether Codekin responds to your DSH session events.",
			settingsEnabled: "Enable Codekin",
			settingsEnabledHint: "Turning it off hides the launcher and pauses event rewards, wild spawns, and idle time. Existing progress is preserved.",
			settingsOn: "Enabled",
			settingsOff: "Disabled",
			settingsLoading: "Loading Codekin settings…",
			settingsUnavailable: "Codekin settings are temporarily unavailable. Try again shortly.",
			settingsOnHint: "Codekin is listening for content-free session outcome events.",
			settingsOffHint: "Codekin is paused. Your squad and inventory remain intact.",
			settingsStorage: "Local save & uninstall",
			settingsStorageHint: "The dsh-web plugin manager preserves this save when uninstalling. For a complete removal, permanently delete the save here before uninstalling the plugin.",
			settingsDeleteData: "Delete local save",
			settingsDeleteConfirm: "Permanently delete",
			settingsDeleteCancel: "Cancel",
			settingsDeleted: "The local save was deleted and Codekin was disabled. You can now uninstall it from the plugin manager.",
			map: "Codekin Map",
			squad: "Codekin",
			dex: "Dex",
			inventory: "Cores & Log",
			loading: "Connecting to Codekin…",
			disconnected: "Codekin is offline. Waiting for the Host to recover.",
			retry: "Reconnect",
			newEncounter: "A new Codekin appeared",
			starterTitle: "Choose your first Codekin",
			starterBody: "It becomes your first combat partner. You can later build a squad of three.",
			choose: "Choose",
			mapEmpty: "Use DSH normally. Completed turns will reveal Codekin here.",
			enhanced: "Armored anomaly",
			mapKicker: "Attribute signal layer",
			mapSignalCount: "Map residents {count}/{max}",
			encounterLeavingSoon: "Leaving soon",
			encounterLeavesMinutes: "Leaves in {count} min",
			encounterLeavesHours: "Leaves in {count} hr",
			encounterLeavesDays: "Leaves in {count} days",
			encounterResident: "Resident",
			towerTitle: "Endless Stack",
			towerNextFloor: "Floor {floor}",
			towerFloor: "Stack floor {floor}",
			towerHighest: "Highest clear",
			towerChallenge: "Challenge",
			towerKicker: "Continuous challenge protocol",
			towerIntro: "Break through scaling guardians and settle growth materials floor by floor.",
			towerCurrentTarget: "Current guardian",
			towerAttempts: "Attempts",
			towerClears: "Clears",
			towerPath: "Ascension path",
			towerSkillTier: "Boss skill tier {tier}",
			towerRewardPreview: "At least {count} materials · {bonus}",
			towerMilestoneReady: "milestone bonus material",
			towerMilestoneHint: "bonus material every 10 floors",
			towerBattle: "Endless Stack Battle",
			towerNoCapture: "Stack guardians cannot be captured",
			towerBattleReward: "Clear floor {floor} to settle growth materials",
			towerCleared: "Stack floor cleared. Growth materials settled.",
			towerLog: "Endless Stack floor cleared",
			battle: "Command Match Battle",
			flee: "Retreat",
			capture: "Deploy capture core",
			armor: "Firewall",
			health: "Runtime",
			shield: "Guard layer",
			energy: "Command",
			quality: "Quality",
			round: "Squad round",
			movesRemaining: "Swaps left",
			activeTurn: "Active",
			statRuntime: "Runtime",
			statCompute: "Compute",
			statGuard: "Guard",
			statResponse: "Response",
			boardHelp: "Swipe a tile toward a neighbor, or tap two tiles. Invalid swaps cost no action.",
			invalidSwap: "That swap did not create a match.",
			captured: "Capture successful",
			captureFailed: "This capture missed. Choose another core or try again.",
			battleLost: "Your squad was safely recalled after losing the battle.",
			skillReleased: "Active protocol released.",
			battleActionUnavailable: "The battle state changed. Retry, or restart DSH after updating the plugin.",
			skipTurn: "SKIP",
			skipStage: "End this Codekin turn",
			skipStageHint: "Preserve the target runtime and pass to the next Codekin. Already queued compute still settles after the squad cycle.",
			battleStageSkipped: "The active Codekin ended its turn",
			noCores: "No cores available. Complete DSH turns to earn more.",
			battleHint: "All three Codekin share one runtime pool. Both sides start with 3 actions; a direct 4-match refunds one and a direct 5-match adds one. The Boss auto-matches after the team strike.",
			signalRepair: "Runtime repair",
			signalGuard: "Cache guard",
			signalSync: "Compute sync",
			signalOverclock: "Compile overclock",
			signalBreach: "Glitch breach",
			signalRuleLumen: "Compute signal: yellow panels gain +18% sync",
			signalRuleForge: "Compile signal: red panels overclock with clears and chains",
			signalRuleRelay: "Network signal: blue panels become shared guard",
			signalRuleAegis: "Guard signal: green panels restore shared runtime",
			signalRuleGlitch: "Glitch signal: purple panels bypass most defense",
			signalBossRule: "Boss retains partial attack.",
			captureLocked: "Finish a team strike and reduce the target below 50% runtime to open a capture window.",
			captureReady: "The target can now be captured.",
			capturePhaseTitle: "Choose a capture core",
			capturePhaseHint: "Keep trying until you abandon the phase or run out of cores.",
			abandonCapture: "Abandon capture · continue battle",
			transitionTowerCleared: "STACK CLEARED",
			transitionWildDefeated: "TARGET DEFEATED",
			transitionCaptureSuccess: "CAPTURE COMPLETE",
			transitionCaptureFailed: "CORE RELEASED",
			transitionBattleLost: "SQUAD RECALLED",
			passiveSkill: "Passive",
			activeSkill: "Active",
			castSkill: "Cast active",
			skillReady: "Command full",
			skillCharging: "Charging",
			skillSpent: "Used this stage",
			enemyIntent: "Enemy intent",
			intentStrike: "Charged impact",
			intentSweep: "Party sweep",
			intentGuard: "Firewall boost",
			intentDisrupt: "Bus reroute",
			intentCorrupt: "Hazard injection",
			intentMark: "Active protocol seal",
			intentLock: "Attribute lock",
			intentFreeze: "Turn freeze",
			enemyIntentMeta: "Target: {target} · resolves after this Boss phase",
			intentDetailStrike: "Every match this phase queues damage, which is applied to shared runtime once the Boss phase ends.",
			intentDetailGuard: "When armed, spends 24 command to queue guard equal to 10% of maximum runtime and gains it at phase end.",
			intentDetailDisrupt: "When armed, spends 24 command and rearranges the board at the end of this phase.",
			intentDetailCorrupt: "When armed, spends 24 command and injects up to {count} hazard panels lasting 3 actions. Clearing one damages shared runtime.",
			intentDetailMark: "When armed, spends 24 command, removes 2 command from the target, and seals its active protocol for 1 action stage.",
			intentDetailLock: "When armed, spends 24 command and locks up to {count} panels of the target attribute for 2 actions.",
			intentDetailFreeze: "When armed, spends 24 command, skips the target’s next action stage, and starts the hard-control cooldown.",
			bossSkillTierDetail: "Skill tier {tier}: up to {hazards} hazard panels and {locks} locked attribute panels. Higher tiers raise control odds and the damage ceiling; tier 5 enters phase two below half runtime.",
			bossSkillReadyDetail: "The signature skill is armed for this phase. It will spend 24 command and execute the enemy intent after the Boss finishes acting.",
			bossSkillChargingDetail: "The signature skill was not armed for this phase and needs {remaining} more command. If filled now, it is checked at the start of the next Boss phase.",
			targetAll: "All allies",
			targetSelf: "Self",
			targetSingle: "One ally",
			targetTeam: "Shared runtime",
			targetBoard: "Board",
			targetMember: "One Codekin",
			lockedTile: "Locked",
			hazardTile: "Hazard tile · {actions} actions left",
			specialRow: "Row command",
			specialColumn: "Column command",
			specialBurst: "Pulse command",
			specialOrigin: "Core command",
			squadHelp: "Browse every Codekin you own. Select one to view its details and growth.",
			squadEditHelp: "Select 1–3 Codekin in battle order. Select one again to remove it.",
			editSquad: "Edit squad",
			saveSquad: "Save",
			cancelSquad: "Cancel",
			squadSelection: "{count}/3 selected",
			rosterClassify: "Classify",
			rosterControls: "Codekin filters and sorting",
			rosterAttribute: "Attribute",
			rosterSort: "Sort",
			rosterAll: "All",
			rosterSortDefault: "Default order",
			rosterSortLevelAsc: "Level ascending",
			rosterSortLevelDesc: "Level descending",
			rosterResults: "{count} Codekin",
			rosterReset: "Reset",
			rosterDeployed: "Deployed",
			rosterNoMatches: "No Codekin match these filters",
			codekinDetail: "Codekin details",
			closeCodekinDetail: "Close Codekin details",
			codekinStats: "Detailed stats",
			codekinProtocols: "Battle protocols",
			growthMaterialChoice: "Choose a growth material",
			releaseCreature: "Release Codekin",
			releaseConfirmTitle: "Confirm release",
			releaseConfirmBody: "Release “{name}”? This cannot be undone. The returned material depends only on its quality.",
			releaseReward: "Returned material",
			releaseCancel: "Keep it",
			releaseConfirm: "Release",
			releaseLastBlocked: "You must keep at least one Codekin",
			released: "Codekin released. Quality material returned.",
			level: "Level",
			levelCap: "MAX",
			xp: "XP",
			feed: "Use",
			wins: "Wins",
			dexSeen: "Seen",
			dexCaught: "Captured",
			undiscovered: "Undiscovered",
			totalTurns: "Completed turns",
			failures: "Anomalies",
			captureCount: "Captures",
			streak: "Current streak",
			eventLog: "Recent attribute events",
			emptyLog: "No events yet.",
			privacy: "Uses only event types and outcomes. Prompts, replies, commands, paths, and raw errors are never read or stored.",
			corePebble: "Pebble",
			corePulse: "Pulse",
			corePrism: "Prism",
			coreNova: "Nova",
			coreOrigin: "Origin",
			ecologyLumen: "Compute",
			ecologyForge: "Compile",
			ecologyRelay: "Network",
			ecologyAegis: "Guard",
			ecologyGlitch: "Glitch",
			rarityCommon: "Common",
			rarityUncommon: "Uncommon",
			rarityRare: "Rare",
			rarityApex: "Apex",
			coreInventory: "Capture cores",
			materialInventory: "Growth materials",
			growth: "Codekin growth",
			idleReward: "Last claimed {minutes} minutes of idle supplies",
			defeatCount: "Wild Codekin defeated",
			claimIdleReward: "Claim idle supplies",
			idleRewardReady: "Idle supplies are ready",
			idleRewardMinutes: "{minutes} minutes accumulated",
			idleClaimed: "Idle supplies claimed",
			rewardUnavailable: "Those supplies are no longer available",
			rewardKicker: "CODE CACHE",
			rewardTitle: "Items acquired",
			rewardDismiss: "Continue",
			captureCoreItem: "{quality} core",
			growthMaterialItem: "{quality} material",
			captureCoreDescription: "Capture item · capture power ×{power}",
			growthMaterialDescription: "Growth item · grants {xp} XP",
			creatureItemDescription: "A new {quality} companion with the {ecology} attribute",
			logCore: "A completed event dropped a core",
			logMaterial: "Growth material obtained",
			logIdle: "Idle supplies claimed",
			logEncounter: "A new Codekin appeared",
			logCapture: "A Codekin was captured",
			logStarter: "Your starter joined the squad",
			logDefeat: "Battle retreat",
			logRelease: "Released a Codekin and recovered quality material",
			wildDefeated: "The wild Codekin was defeated and dropped growth materials.",
			materialUsed: "Growth material used.",
			battleStart: "Encounter started",
			battleMatch: "Matched for {amount} compute damage",
			battleCombo: "Triggered a {amount}-stage cascade",
			battleArmor: "Broke one firewall layer",
			battleSkill: "Active protocol produced {amount} compute damage",
			battleHeal: "Restored {amount} runtime",
			battleShield: "Gained {amount} guard",
			battleEnemy: "Took {amount} compute damage",
			battleEnemySweep: "The squad took {amount} sweep damage",
			battleEnemyShield: "Enemy guard rose to {amount}",
			battleEnemyDelay: "Enemy action was delayed",
			battleSwitch: "{name} entered the active slot",
			battleEnemyLock: "The enemy locked {amount} tiles",
			battleEnemyFreeze: "One Codekin was frozen for {amount} action stage",
			battleFrozenSkip: "Freeze triggered and skipped this action stage",
			battleEnemyHazard: "The enemy injected {amount} hazard panels",
			battleEnemySeal: "One Codekin had its active protocol sealed",
			battleHazardDamage: "Hazard panels removed {amount} shared runtime",
			battlePhaseShift: "The Boss entered phase two and gained {amount} guard",
			battleActionRefund: "Direct 4-match refunded the action",
			battleActionBonus: "Direct 5-match added {amount} action",
			battleTeamStrike: "The team strike dealt {amount} final damage",
			battleCaptureFail: "The core failed to stabilize the target",
			pendingDamage: "Queued compute",
			stageDamage: "Stage compute",
			totalDamage: "TOTAL DAMAGE",
			enemyDamage: "ENEMY DAMAGE",
			teamRuntime: "SHARED RUNTIME",
			frozen: "Frozen",
			skillSealed: "Sealed",
			skillOk: "SKILL OK",
			continueBattle: "Continue battle",
			skipFrozen: "Skip frozen stage",
			lastTeamStrike: "Last team strike",
			bossTurn: "Boss turn",
			bossMoves: "Boss actions",
			bossEnergy: "Boss command",
			bossCharge: "Compute charge",
			bossActing: "The Boss is choosing swaps and charging compute",
			enemyActing: "ENEMY ACTING",
			battleBossMatch: "The Boss cleared {amount} tiles",
			battleBossCombo: "The Boss triggered a {amount}-stage cascade",
			battleBossEnergy: "The Boss gained {amount} command points",
			battleBossRefund: "Boss direct 4-match refunded the action",
			battleBossBonus: "Boss direct 5-match added {amount} action",
			battleBossSkill: "The Boss released its signature skill"
		};
		//#endregion
		//#region lib/types/packages/renderer-react/src/index.js
		const inject = ["slots", "locale"];
		function installStyles() {
			if (typeof document === "undefined") return () => void 0;
			const existing = [...document.querySelectorAll("style[data-plugin-css]")].find((tag) => tag.dataset.pluginCss === tagId);
			const tag = existing ?? document.createElement("style");
			tag.dataset.plugin = "@nath-vikky/dsh-codekin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = ".dCfysG_overlay,.dCfysG_overlay *,.dCfysG_launcher{box-sizing:border-box}.dCfysG_launcher{pointer-events:auto;z-index:90;place-items:center;display:grid;position:fixed;bottom:22px;right:22px}.dCfysG_launcherPulse{animation:.55s steps(2,end) 3 dCfysG_launcherPulse}@keyframes dCfysG_launcherPulse{50%{transform:scale(1.15);box-shadow:0 0 0 10px #65ffd533,0 12px 34px #000c}}.dCfysG_logoCore,.dCfysG_bigCore{display:inline-block}.dCfysG_badge{border:2px solid #11181e;border-radius:12px;place-items:center;min-width:22px;height:22px;padding:0 6px;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;display:grid;position:absolute;top:-7px;right:-7px}.dCfysG_idleClaimButton{cursor:pointer;border:1px solid #e8d59859;flex:none;place-items:center;transition:transform .16s cubic-bezier(.22,1,.36,1),background .16s;display:grid;position:relative}.dCfysG_idleClaimButton:hover{background:#343024;transform:translateY(-1px)}.dCfysG_idleClaimButton:disabled{cursor:wait;opacity:.55}.dCfysG_idleClaimFloating{z-index:91;animation:1.6s ease-in-out infinite alternate dCfysG_idleFloat;position:fixed;bottom:91px;right:28px}.dCfysG_rewardCrate{border:2px solid;border-radius:3px 3px 5px 5px;width:19px;height:15px;position:relative}.dCfysG_rewardCrate:before{content:\"\";border:2px solid;border-radius:4px 4px 2px 2px;height:6px;position:absolute;top:-6px;left:-4px;right:-4px}.dCfysG_rewardCrate:after{content:\"\";border-radius:2px;width:3px;height:20px;position:absolute;top:-7px;left:6px}.dCfysG_idleClaimPulse{background:#fff2a9;border-radius:50%;width:6px;height:6px;animation:.8s ease-in-out infinite alternate dCfysG_rewardPulse;position:absolute;top:2px;right:2px;box-shadow:0 0 8px #ffe169}.dCfysG_idleClaimTooltip{pointer-events:none;z-index:120;opacity:0;visibility:hidden;text-align:left;border:1px solid #ecd99535;border-radius:12px;width:225px;padding:8px;transition:opacity .14s,transform .14s,visibility .14s;position:absolute;top:calc(100% + 7px);right:0;transform:translateY(-4px)}.dCfysG_idleClaimTooltip>strong,.dCfysG_idleClaimTooltip>small{display:block}.dCfysG_idleClaimTooltip>strong{font-size:10px}.dCfysG_idleClaimTooltip>small{margin-top:3px;font-size:8px}.dCfysG_idleClaimTooltip>span{gap:5px;margin-top:7px;display:flex}.dCfysG_idleClaimButton:hover .dCfysG_idleClaimTooltip,.dCfysG_idleClaimButton:focus-visible .dCfysG_idleClaimTooltip{opacity:1;visibility:visible;transform:translateY(0)}.dCfysG_idleClaimFloating .dCfysG_idleClaimTooltip{top:0;right:calc(100% + 9px)}@keyframes dCfysG_idleFloat{to{transform:translateY(-3px)}}@keyframes dCfysG_rewardPulse{to{opacity:.38;transform:scale(.78)}}.dCfysG_overlay{pointer-events:auto;z-index:65}.dCfysG_header{z-index:30;justify-content:space-between;align-items:center}.dCfysG_brand{align-items:center;min-width:0;display:flex}.dCfysG_brand h1{white-space:nowrap;font:760 16px/1.1 ui-sans-serif,system-ui,sans-serif}.dCfysG_headerStats{align-items:center;min-width:0}.dCfysG_miniCore{justify-content:center;align-items:center;display:inline-flex}.dCfysG_online{border:1px solid #6dffd155}.dCfysG_offline{border:1px solid #ff769655}.dCfysG_pageHeading button{cursor:pointer;transition:background .16s,border-color .16s}.dCfysG_tabs{border-bottom:1px solid var(--line);justify-content:center;align-items:center;position:relative}.dCfysG_tabs button{cursor:pointer;flex:1}.dCfysG_content{z-index:1;scrollbar-width:thin}.dCfysG_content::-webkit-scrollbar-track{background:0 0}.dCfysG_content::-webkit-scrollbar-thumb{border-radius:999px}.dCfysG_footer{z-index:2;text-align:center;justify-content:center}.dCfysG_centerMessage{grid-row:2/5;place-items:center}.dCfysG_sprite{object-fit:contain;image-rendering:auto;user-select:none;flex:none;display:inline-block}.dCfysG_sprite_tiny{width:28px;height:28px}.dCfysG_sprite_small{width:58px;height:58px}.dCfysG_sprite_medium{width:104px;height:104px}.dCfysG_sprite_large{width:154px;height:154px}.dCfysG_panelPage{width:100%;min-height:100%;margin:0 auto}.dCfysG_pageHeading{justify-content:space-between;display:flex}.dCfysG_inventoryPanel h2,.dCfysG_logPanel h2{margin:0 0 5px}.dCfysG_pageHeading p{margin:0}.dCfysG_creatureCards{display:grid}.dCfysG_creatureCard{border:1px solid var(--line);flex-direction:column;align-items:center;transition:transform .18s cubic-bezier(.22,1,.36,1),background .18s,border-color .18s;display:flex;position:relative}.dCfysG_creatureCard span{margin-top:4px}.dCfysG_creatureCard small{margin-top:7px}.dCfysG_partyIndex{place-items:center;width:24px;height:24px;font:900 12px/1 ui-monospace,monospace;display:grid;position:absolute}.dCfysG_dexGrid{grid-template-columns:repeat(3,minmax(0,1fr));padding-bottom:16px;display:grid}.dCfysG_dexCard{flex-direction:column;justify-content:center;align-items:center;display:flex;position:relative}.dCfysG_dexNumber{font:700 9px/1 ui-monospace,monospace;position:absolute;top:7px;left:7px}.dCfysG_dexCard small{margin-top:3px}.dCfysG_dexCard>span:last-child{margin-top:5px}.dCfysG_inventoryLayout{grid-template-columns:1fr;width:100%;margin:0 auto;display:grid}.dCfysG_coreGrid{grid-template-columns:repeat(5,1fr);display:grid}.dCfysG_coreCard{text-align:center;flex-direction:column;justify-content:center;align-items:center;gap:5px;display:flex;position:relative}.dCfysG_coreCard b{font:900 17px/1 ui-monospace,monospace}.dCfysG_materialCard{min-height:98px}.dCfysG_materialShard{width:23px;height:30px}.dCfysG_materialXp{opacity:.86;font:750 7px/1 ui-monospace,monospace}.dCfysG_itemInspectable{cursor:help;outline:none}.dCfysG_itemInspectable:focus-visible,.dCfysG_rewardItem:focus-visible{border-color:currentColor;box-shadow:0 0 0 2px #ffffff1b}.dCfysG_itemTooltip{pointer-events:none;z-index:15;opacity:0;visibility:hidden;flex-direction:column;justify-content:center;align-items:center;gap:5px;transition:opacity .14s,visibility .14s;display:flex;position:absolute;inset:5px}.dCfysG_itemTooltip strong{line-height:1.2}.dCfysG_itemTooltip small{text-align:center}.dCfysG_itemInspectable:hover .dCfysG_itemTooltip,.dCfysG_itemInspectable:focus .dCfysG_itemTooltip,.dCfysG_rewardItem:hover .dCfysG_itemTooltip,.dCfysG_rewardItem:focus .dCfysG_itemTooltip{opacity:1;visibility:visible}.dCfysG_growthXpTrack{height:5px;overflow:hidden}.dCfysG_growthXpTrack i{border-radius:inherit;background:linear-gradient(90deg,#69b99f,#8bd2b9);height:100%;transition:width .25s;display:block}.dCfysG_idleReward{border:1px solid #a9c07b30;border-radius:9px;margin:7px 0;padding:7px 9px;font-size:8px}.dCfysG_statsGrid{grid-template-columns:repeat(2,1fr);display:grid}.dCfysG_statsGrid span{border:1px solid #2c4252;flex-direction:column;display:flex}.dCfysG_logPanel ol{max-height:210px;margin:10px 0 0;padding:0;list-style:none;overflow:auto}.dCfysG_logPanel li{border-bottom:1px solid #213542;gap:9px;padding:9px 0;display:grid}.dCfysG_logPanel time{font-family:ui-monospace,monospace}.dCfysG_modalBackdrop{z-index:60;place-items:center;display:grid;position:absolute;inset:0}.dCfysG_battleBackdrop{place-items:center;display:grid}.dCfysG_rewardBackdrop{z-index:100;place-items:center;padding:15px;animation:.35s ease-out dCfysG_rewardBackdropIn;display:grid;position:absolute;inset:0}.dCfysG_rewardModal{text-align:center;width:min(380px,100%);position:relative;overflow:visible}.dCfysG_rewardModal>p{letter-spacing:.18em;text-transform:uppercase;margin:0 0 4px;font:800 8px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_rewardModal>h2{margin:0;font:800 23px/1.2 ui-sans-serif,system-ui,sans-serif;position:relative}.dCfysG_rewardDismissButton{cursor:pointer;background:0 0;border:0;border-radius:8px;margin:13px auto 0;padding:5px 10px;font:650 8px/1 ui-sans-serif,system-ui,sans-serif;display:block}.dCfysG_rewardDismissButton:hover,.dCfysG_rewardDismissButton:focus-visible{outline-offset:2px;outline:2px solid #a8d8ca42}.dCfysG_rewardHalo{pointer-events:none;filter:blur(4px);width:120px;height:65px;position:absolute;top:7px;left:50%;transform:translate(-50%)}.dCfysG_rewardItems{grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:8px;margin-top:18px;display:grid;position:relative}.dCfysG_rewardItem{border:1px solid;outline:none;flex-direction:column;justify-content:center;align-items:center;gap:6px;min-width:0;min-height:118px;padding:10px 6px 8px;display:flex;position:relative}.dCfysG_rewardItem .dCfysG_bigCore{width:42px;height:42px}.dCfysG_rewardItem .dCfysG_materialShard{width:31px;height:42px}.dCfysG_rewardItem .dCfysG_sprite_small{width:63px;height:63px}.dCfysG_rewardItem>strong{max-width:100%;font-size:9px;line-height:1.2}.dCfysG_rewardItem>b{color:currentColor;font:900 14px/1 ui-monospace,monospace}.dCfysG_rewardItemCompact{border-radius:8px;flex:1;gap:2px;min-height:39px;padding:3px}.dCfysG_rewardItemCompact .dCfysG_bigCore{border-width:2px;border-radius:5px;width:17px;height:17px;box-shadow:inset 0 0 0 2px #16252d}.dCfysG_rewardItemCompact .dCfysG_materialShard{width:12px;height:17px}.dCfysG_rewardItemCompact>strong{font-size:5.5px}.dCfysG_rewardItemCompact>b{font-size:7px}@keyframes dCfysG_rewardBackdropIn{0%{opacity:0}}.dCfysG_starterModal{text-align:center;width:100%;max-height:100%;padding:17px;overflow:auto}.dCfysG_starterModal h2{margin:0;font:780 23px/1.2 ui-sans-serif,system-ui,sans-serif}.dCfysG_starterGrid{grid-template-columns:1fr;gap:8px;margin-top:14px;display:grid}.dCfysG_starterGrid button{cursor:pointer;text-align:left;grid-template-rows:repeat(4,auto);grid-template-columns:96px minmax(0,1fr);align-items:center;padding:7px 12px;transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .18s,border-color .18s;display:grid}.dCfysG_starterGrid button .dCfysG_sprite_large{grid-row:1/5;width:92px;height:92px}.dCfysG_starterGrid span{font-size:11px}.dCfysG_starterGrid small{margin:5px 0 10px}.dCfysG_starterGrid b{padding:6px 14px}.dCfysG_battlePanel{scrollbar-width:thin;scrollbar-color:#8eb2a840 transparent}.dCfysG_battlePanel::-webkit-scrollbar{width:5px}.dCfysG_battlePanel::-webkit-scrollbar-track{background:0 0}.dCfysG_battlePanel::-webkit-scrollbar-thumb{background:#8eb2a840;border-radius:999px}.dCfysG_battlePanel>header{z-index:20;justify-content:space-between;align-items:center;display:flex;position:sticky;top:0}.dCfysG_battlePanel h2{margin:0;font:760 14px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_battlePanel header span{color:#829590;font-size:8px}.dCfysG_hpBar{width:min(280px,90%);position:relative;overflow:hidden}.dCfysG_hpBar i,.dCfysG_hpBar em{border-radius:inherit;height:100%;transition:width .58s cubic-bezier(.22,1,.36,1);display:block;position:absolute;inset:0 auto 0 0}.dCfysG_hpBar i{z-index:1}.dCfysG_starterGrid button:disabled,.dCfysG_pageHeading button:disabled{opacity:.4;cursor:not-allowed}.dCfysG_toast{max-width:90%}.dCfysG_battleHeader>div{align-items:baseline}.dCfysG_battleHeader>div span{font:700 10px/1 ui-monospace,monospace}.dCfysG_battleHeader .dCfysG_flee{cursor:pointer;transition:background .15s,transform .15s cubic-bezier(.22,1,.36,1)}.dCfysG_battleHeader .dCfysG_flee:hover{background:#2c2127;transform:translateY(-1px)}.dCfysG_battleHeader .dCfysG_flee:disabled{opacity:.45;cursor:not-allowed}.dCfysG_matchBattleLayout{grid-template-columns:1fr;align-items:start;display:grid}.dCfysG_boardColumn,.dCfysG_partyColumn{min-width:0}.dCfysG_turnSummary{align-items:center;gap:6px;min-height:29px;margin-bottom:3px;padding:0 4px;font-size:9px;display:flex}.dCfysG_turnSummary>strong{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.dCfysG_turnSummaryBoss{border:1px solid #d9898930;border-radius:9px;margin-inline:-2px;padding-inline:6px}.dCfysG_ecologyPip{border:1px solid;border-radius:50%;place-items:center;width:23px;height:23px;font-size:12px;display:grid}.dCfysG_pip_lumen{color:#d9b866}.dCfysG_pip_forge{color:#ce7565}.dCfysG_pip_relay{color:#6faec5}.dCfysG_pip_aegis{color:#6fba91}.dCfysG_pip_glitch{color:#aa78bd}.dCfysG_actionDots{gap:5px;margin-left:auto;display:flex}.dCfysG_actionDots i{border:1px solid #52636a;border-radius:4px;width:17px;height:5px;transform:skew(-18deg)}.dCfysG_turnSkipButton{cursor:pointer;letter-spacing:.12em;border:1px solid #78ad9e72;min-width:43px;margin-left:auto;padding:4px 9px;font:950 7px/1 ui-monospace,monospace;transition:transform .15s cubic-bezier(.22,1,.36,1),border-color .15s,box-shadow .15s;box-shadow:inset 0 1px #fff,0 3px 8px #55766b20}.dCfysG_turnSkipButton:hover:not(:disabled){border-color:#4f9b87;transform:translateY(-1px);box-shadow:inset 0 1px #fff,0 5px 10px #4e82732d}.dCfysG_turnSkipButton:disabled{cursor:wait;opacity:.5}.dCfysG_turnSkipButton+.dCfysG_actionDots{margin-left:0}.dCfysG_cascadePill{color:#b8d9d0;background:#202c32;border:1px solid #b6d4cc30;border-radius:999px;margin-left:2px;padding:4px 7px;font:750 7px/1 ui-sans-serif,system-ui,sans-serif;animation:.2s cubic-bezier(.34,1.56,.64,1) dCfysG_cascadeIn}@keyframes dCfysG_cascadeIn{0%{opacity:0;transform:translateY(3px)scale(.85)}}.dCfysG_matchBoard{aspect-ratio:1;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none;grid-template-rows:repeat(8,minmax(0,1fr));grid-template-columns:repeat(8,minmax(0,1fr));display:grid}.dCfysG_matchTile{color:#fff;cursor:grab;min-width:0;transform:translate3d(var(--drag-x), var(--drag-y), 0);contain:layout style paint;touch-action:none;user-select:none;-webkit-user-drag:none;place-items:center;display:grid;position:relative;overflow:hidden}.dCfysG_matchTile:after{content:\"\";pointer-events:none;position:absolute}.dCfysG_matchTile>span{z-index:2;pointer-events:none;font:850 clamp(11px,3.4vw,19px)/1 ui-sans-serif,system-ui,sans-serif;position:relative}.dCfysG_matchTile>b{color:#fff;text-shadow:0 1px 3px #000;font:900 10px/1 ui-monospace,monospace;position:absolute;top:2px;right:3px}.dCfysG_matchTile>em{z-index:4;color:#ecf5ff;pointer-events:none;background:#26334ce6;border:1px solid #e9f4ffb5;border-radius:4px;place-items:center;width:14px;height:14px;font:900 9px/1 ui-monospace,monospace;display:grid;position:absolute;bottom:2px;right:3px;box-shadow:0 0 7px #9dc2ff8a}.dCfysG_matchTile:hover{filter:brightness(1.08);transform:translateY(-1px)}.dCfysG_matchTile:disabled{cursor:wait}.dCfysG_matchTileSelected{filter:brightness(1.09);border-color:#edf8f5cc!important}.dCfysG_matchTileDragging{cursor:grabbing;filter:brightness(1.1);will-change:transform;box-shadow:0 8px 16px #0007}.dCfysG_matchTileSpecial{animation:1.5s ease-in-out infinite alternate dCfysG_tileSpecial}.dCfysG_matchTileLocked{cursor:not-allowed;filter:saturate(.3)brightness(.72);border-color:#a8bcdf70;box-shadow:inset 0 0 0 2px #1d294766,0 2px 5px #0005}.dCfysG_matchTileLocked:before{content:\"\";z-index:3;pointer-events:none;background:repeating-linear-gradient(135deg,#bcd1ff0c 0 5px,#0000 5px 10px);position:absolute;inset:0}@keyframes dCfysG_tileSpecial{to{filter:brightness(1.12);box-shadow:0 0 0 2px,0 3px 8px #0004}}.dCfysG_matchTileClearing{pointer-events:none;will-change:transform, opacity}.dCfysG_matchTileFalling{pointer-events:none;will-change:transform, opacity;animation:dCfysG_tileFall var(--fall-duration) cubic-bezier(.22,1,.36,1) var(--fall-delay) both!important}.dCfysG_tile_lumen{color:#fff4cf}.dCfysG_tile_forge{color:#ffe5df}.dCfysG_tile_relay{color:#e4f6fb}.dCfysG_tile_aegis{color:#e7f8ed}.dCfysG_tile_glitch{color:#f5e9f8}.dCfysG_boardHelp{text-align:center}.dCfysG_towerBattleStatus{border:1px solid #aaa1d334;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;min-height:38px;padding:6px 8px;display:grid}.dCfysG_towerBattleMark{color:#d7d1ee;background:#333248;border:1px solid #aca3d15e;border-radius:8px;place-items:center;width:24px;height:24px;font-size:10px;display:grid}.dCfysG_towerBattleStatus>div{gap:2px;min-width:0;display:grid}.dCfysG_towerBattleStatus>b{white-space:nowrap;border:1px solid #8b83ad40;padding:4px 6px}.dCfysG_core_pebble.dCfysG_bigCore,.dCfysG_core_pebble .dCfysG_bigCore{filter:saturate(.4)}.dCfysG_core_pulse.dCfysG_bigCore{filter:hue-rotate()}.dCfysG_core_prism.dCfysG_bigCore{filter:hue-rotate(70deg)}.dCfysG_core_nova.dCfysG_bigCore{filter:hue-rotate(135deg)}.dCfysG_core_origin.dCfysG_bigCore{filter:hue-rotate(245deg)brightness(1.2)}@media (width<=800px){.dCfysG_launcher{border-radius:16px;width:52px;height:52px;bottom:14px;right:14px}.dCfysG_idleClaimFloating{bottom:76px;right:17px}.dCfysG_overlay{width:min(454px,100vw - 12px);height:min(880px,100dvh - 12px)}.dCfysG_headerStats .dCfysG_miniCore:nth-of-type(n+4){display:none}.dCfysG_matchBoard{width:min(100%,clamp(260px,100dvh - 400px,346px))}}@media (width<=470px){.dCfysG_overlay{border:0;border-radius:0;width:100vw;height:100dvh}.dCfysG_overlay:after{display:none}.dCfysG_launcher{z-index:100}.dCfysG_header{padding-right:58px}.dCfysG_headerStats .dCfysG_online,.dCfysG_headerStats .dCfysG_offline{display:none}.dCfysG_dexGrid{grid-template-columns:repeat(3,minmax(0,1fr))}.dCfysG_battlePanel{border-radius:0}}@media (height<=650px) and (width>=471px){.dCfysG_overlay{height:calc(100vh - 8px)}.dCfysG_matchBoard{width:min(100%,clamp(238px,100vh - 390px,310px))}}.dCfysG_launcher{isolation:isolate}.dCfysG_launcher:before{content:\"\";z-index:-1;border:1px solid #ffffff0f;border-radius:17px;position:absolute;inset:7px}.dCfysG_launcher:hover{background-color:#1d2c35}.dCfysG_logoCore,.dCfysG_bigCore{border-color:#e4fff8}.dCfysG_overlay{grid-template-rows:68px 57px minmax(0,1fr) 30px}.dCfysG_overlay:before{animation:8s ease-in-out infinite alternate dCfysG_ambientOrb;display:block;top:90px;right:-150px}@keyframes dCfysG_ambientOrb{to{opacity:.65;transform:translate(-26px,34px)scale(1.12)}}.dCfysG_header{border-bottom:0}.dCfysG_header:after{content:\"\";position:absolute}.dCfysG_brand h1{letter-spacing:.035em;font-size:15px;font-weight:680}.dCfysG_brand p{text-overflow:ellipsis;max-width:138px;margin:4px 0 0;display:block;overflow:hidden}.dCfysG_miniCore{opacity:.82;width:20px;padding:0;font-size:7px}.dCfysG_online,.dCfysG_offline{margin-left:2px;font-size:6px}.dCfysG_idleClaimButton{border-radius:10px}.dCfysG_idleClaimFloating{border-radius:18px;width:50px;height:50px}.dCfysG_tabs{z-index:3;backdrop-filter:blur(18px)}.dCfysG_tabs button{height:41px;font:inherit;grid-template-rows:18px auto;place-items:center}.dCfysG_tabs button>small{white-space:nowrap;font:650 7px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_content::-webkit-scrollbar{width:4px}.dCfysG_footer{letter-spacing:.018em;font-size:7px;line-height:1.3}.dCfysG_towerHeading span{letter-spacing:.18em;text-transform:uppercase;font:700 7px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_towerHeading h2{font-size:21px;font-weight:640}.dCfysG_towerHeading p{margin:0}.dCfysG_towerPage{padding-bottom:12px}.dCfysG_towerHeading{justify-content:space-between;align-items:flex-end;padding:2px 4px 12px;display:flex}.dCfysG_towerHeading>div{min-width:0}.dCfysG_towerHeading p{max-width:300px}.dCfysG_towerHeading>strong{opacity:.68}.dCfysG_towerHero:before{content:\"\";background-size:34px 34px;position:absolute;inset:0;mask-image:linear-gradient(#000,#0000 80%)}.dCfysG_towerHero:after{content:\"\";filter:blur(7px);border-radius:50%;height:22px;position:absolute;bottom:14px;left:44px;right:44px}.dCfysG_towerMonument{z-index:1;flex-direction:column-reverse;justify-content:flex-start;align-items:center;display:flex;position:absolute}.dCfysG_towerMonument i{width:136px;margin-top:-2px;display:block}.dCfysG_towerMonument i:nth-child(2){width:118px}.dCfysG_towerMonument i:nth-child(3){width:100px}.dCfysG_towerMonument i:nth-child(4){width:82px}.dCfysG_towerMonument i:nth-child(5){width:64px}.dCfysG_towerMonument i:nth-child(6){width:48px}.dCfysG_towerMonument b{border:1px solid #ffe2a638;width:30px;height:48px}.dCfysG_towerBossCard{z-index:3;backdrop-filter:blur(18px);align-content:start;justify-items:center;display:grid;position:absolute}.dCfysG_towerBossCard>span{text-transform:uppercase;font:700 7px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_towerBossCard .dCfysG_sprite_large{margin:4px 0 -2px;animation:3s ease-in-out infinite alternate dCfysG_towerGuardian}.dCfysG_towerBossCard>div{justify-items:center;gap:3px;display:grid}@keyframes dCfysG_towerGuardian{to{transform:translateY(-6px)}}.dCfysG_towerBrief{z-index:4;grid-template-columns:minmax(0,1fr) 116px;min-height:94px;display:grid;position:absolute}.dCfysG_towerBrief>div{backdrop-filter:blur(14px);gap:5px;min-width:0;margin-left:0;display:grid}.dCfysG_towerBrief>div span{display:block}.dCfysG_towerBrief>button{cursor:pointer;justify-content:space-between;align-items:center;height:50px;transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s;display:flex}.dCfysG_towerBrief>button b{font-size:16px;font-weight:400}.dCfysG_towerBrief>button:not(:disabled):hover{transform:translateY(-3px);box-shadow:0 17px 36px #50b99a3c,inset 0 1px #ffffff75}.dCfysG_towerBrief>button:disabled{opacity:.38;cursor:not-allowed}.dCfysG_towerMetrics{grid-template-columns:repeat(3,1fr);margin-top:8px;display:grid}.dCfysG_towerMetrics article{align-content:center;gap:7px;min-height:78px;display:grid}.dCfysG_towerRoute{margin-top:8px}.dCfysG_towerRoute>header{justify-content:space-between;align-items:center;display:flex}.dCfysG_towerRoute>header span{font-size:9px;font-weight:650}.dCfysG_towerRoute>header small{letter-spacing:.15em;font-size:6px}.dCfysG_towerRoute>div{grid-template-columns:repeat(5,1fr);gap:5px;margin-top:14px;display:grid;position:relative}.dCfysG_towerRoute>div:before{content:\"\";height:1px;position:absolute;top:8px;left:8%;right:8%}.dCfysG_towerRoute article{justify-items:center;gap:5px;display:grid;position:relative}.dCfysG_towerRoute article i{z-index:1;border:1px solid #7d8f8a4a;border-radius:50%;width:16px;height:16px;position:relative}.dCfysG_towerRoute article b{font:550 9px/1 ui-monospace,monospace}.dCfysG_panelPage{padding:2px 1px 10px}.dCfysG_pageHeading{margin:2px 3px 15px}.dCfysG_pageHeading h2{margin-bottom:5px;font-weight:640}.dCfysG_inventoryPanel h2,.dCfysG_logPanel h2{letter-spacing:-.018em;font-size:18px;font-weight:640}.dCfysG_pageHeading button:hover{background-color:#22343b;transform:translateY(-1px)}.dCfysG_creatureCard{border-radius:21px;min-height:181px}.dCfysG_creatureCard strong{font-size:13px;font-weight:650}.dCfysG_creatureCard span{font-size:8px}.dCfysG_creatureCard small{text-align:center;font-size:7px;line-height:1.4}.dCfysG_coreGrid{gap:5px;margin:11px 0 17px}.dCfysG_statsGrid span{border-radius:14px;padding:11px;font-size:8px}.dCfysG_statsGrid b{font-size:20px;font-weight:450}.dCfysG_itemTooltip,.dCfysG_idleClaimTooltip{backdrop-filter:blur(20px)}.dCfysG_starterGrid button:hover{transform:translateY(-3px)}.dCfysG_rewardBackdrop{backdrop-filter:blur(16px)}.dCfysG_toast{backdrop-filter:blur(20px)}.dCfysG_hpBar i{box-shadow:0 0 10px #65d4a336}.dCfysG_matchBattleLayout{gap:7px}@media (width<=800px){.dCfysG_launcher{border-radius:20px;width:56px;height:56px}.dCfysG_overlay{width:min(448px,100vw - 12px);height:min(866px,100dvh - 12px)}.dCfysG_headerStats .dCfysG_miniCore:nth-of-type(n+4){display:inline-flex}}@media (width<=470px){.dCfysG_overlay{border:1px solid #dffff633;border-radius:27px;width:calc(100vw - 10px);height:calc(100dvh - 10px)}.dCfysG_overlay:after{border-radius:22px;display:block}.dCfysG_header{padding-right:54px}.dCfysG_brand p{max-width:105px}.dCfysG_headerStats .dCfysG_miniCore:nth-of-type(n+4){display:none}.dCfysG_tabs{margin-inline:8px}.dCfysG_tabs button>small{font-size:6.5px}.dCfysG_towerHero{min-height:370px}.dCfysG_towerMonument{transform-origin:0 100%;left:13px;transform:scale(.9)}.dCfysG_towerBossCard{width:177px;right:12px}.dCfysG_towerBrief{left:12px;right:12px}.dCfysG_towerBrief>div{margin-left:0}.dCfysG_towerMetrics article{padding-inline:9px}.dCfysG_battlePanel{border-radius:25px}}.dCfysG_overlay{--line-strong:#26464e2c;--text:#20353b;--violet:#777abf;border-color:#ffffffd6}.dCfysG_overlay:after{border-color:#ffffffad;box-shadow:inset 0 0 0 1px #49636b0b}.dCfysG_overlayDragging{user-select:none;transition:none}.dCfysG_overlayDragging .dCfysG_header{cursor:grabbing}.dCfysG_launcher{color:#355c5a;border-color:#ffffffd6}.dCfysG_launcher:before{background:linear-gradient(135deg,#ffffffb0,#0000 58%);border-color:#506b6815}.dCfysG_launcher:hover{box-shadow:0 22px 52px #42605c45,inset 0 1px #fff}.dCfysG_logoCore{position:relative;transform:none}.dCfysG_logoCore:before{content:\"\";border-top:1px solid #477a728a;border-bottom:1px solid #477a728a;border-radius:50%;height:7px;position:absolute;top:50%;left:3px;right:3px;transform:translateY(-50%)rotate(-31deg)}.dCfysG_logoCore:after{content:\"\";background:#7477bd;border-radius:50%;width:5px;height:5px;position:absolute;top:5px;right:2px;box-shadow:0 1px 4px #7378ba88}.dCfysG_logoCore{flex:none}.dCfysG_badge{color:#fff;background:#e8799d;border-color:#fff;box-shadow:0 6px 15px #d55e864d}.dCfysG_header{user-select:none}.dCfysG_dragHandle{background:#fff5;border:1px solid #52736d12;border-radius:999px;padding:4px 7px;display:flex;transform:translate(-50%)}.dCfysG_dragHandle i{border-radius:50%}.dCfysG_miniCore{color:var(--core-color);border-color:color-mix(in srgb, var(--core-color) 30%, transparent);position:relative;overflow:hidden}.dCfysG_miniCore:before{content:\"\";opacity:.16;border:1px solid;border-radius:5px;width:15px;height:15px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(45deg)}.dCfysG_online{box-shadow:none;border-color:#4ea98b3d}.dCfysG_offline{border-color:#df6a8a3b}.dCfysG_idleClaimButton{color:#a1782f;background:#fff8e6e0;border-color:#d9b65d48;box-shadow:inset 0 1px #fff,0 7px 18px #8f793026}.dCfysG_rewardCrate{background:linear-gradient(135deg,#f5cf72,#c69a43);border-color:#a57c2e;box-shadow:inset 0 0 0 2px #fff4cb5c}.dCfysG_rewardCrate:before{background:#e4b85e;border-color:#a57c2e}.dCfysG_rewardCrate:after{background:#fff1af;box-shadow:0 8px 0 1px #a47a31}.dCfysG_idleClaimTooltip{color:#354543;background:#fffdf5f3;border-color:#ffffffcf;box-shadow:0 18px 48px #5f6d6833}.dCfysG_idleClaimTooltip>strong{color:#8d6b2d}.dCfysG_idleClaimTooltip>small{color:#75847f}.dCfysG_tabs{border-color:#55736d13}.dCfysG_content{scrollbar-color:#75a69750 transparent}.dCfysG_content::-webkit-scrollbar-thumb{background:#75a69750}.dCfysG_footer{border-color:#55736d12}.dCfysG_core_pebble{--core-color:#7b9398;--core-light:#e6eef0;color:#6f888e}.dCfysG_core_pulse{--core-color:#44b28f;--core-light:#d9f7ec;color:#319b7b}.dCfysG_core_prism{--core-color:#5d94d5;--core-light:#dfedff;color:#5088ca}.dCfysG_core_nova{--core-color:#9a72cf;--core-light:#efe2ff;color:#8b61c2}.dCfysG_core_origin{--core-color:#d6a63e;--core-light:#fff2bf;color:#bb8c28}.dCfysG_bigCore{clip-path:polygon(50% 0,82% 13%,100% 50%,82% 87%,50% 100%,18% 87%,0 50%,18% 13%);background:linear-gradient(145deg, #fff 0 14%, var(--core-light) 15% 43%, var(--core-color) 44% 59%, #fff 60% 71%, var(--core-color) 72%);width:42px;height:42px;box-shadow:none;border:0;border-radius:0;position:relative;transform:none;filter:drop-shadow(0 7px 7px color-mix(in srgb, var(--core-color) 32%, transparent))!important}.dCfysG_bigCore:before{content:\"\";border:1px solid color-mix(in srgb, var(--core-color) 70%, white);background:radial-gradient(circle at 36% 28%, #fff 0 14%, var(--core-light) 15% 42%, var(--core-color) 43% 100%);border-radius:50%;position:absolute;inset:8px;box-shadow:inset 0 0 0 3px #ffffff73}.dCfysG_bigCore:after{content:\"\";background:#fff;border-radius:50%;width:6px;height:6px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 8px #fff}.dCfysG_materialShard{clip-path:polygon(50% 0,88% 22%,100% 65%,68% 100%,32% 100%,0 65%,12% 22%);background:linear-gradient(135deg, #fff 0 13%, var(--core-light) 14% 38%, var(--core-color) 39% 61%, color-mix(in srgb, var(--core-color) 68%, #fff) 62% 100%);filter:drop-shadow(0 6px 6px color-mix(in srgb, var(--core-color) 27%, transparent));opacity:1;border-radius:4px;position:relative}.dCfysG_materialShard:before{content:\"\";background:#ffffff9c;width:1px;position:absolute;top:4px;bottom:5px;left:48%;transform:rotate(12deg)}.dCfysG_towerHeading span{color:#3f9f83}.dCfysG_towerHero{border-color:#ffffffc7}.dCfysG_towerHero:before{background-image:linear-gradient(#5c648b0d 1px,#0000 1px),linear-gradient(90deg,#5c648b0d 1px,#0000 1px)}.dCfysG_towerMonument i{border-color:#858bc447}.dCfysG_towerBossCard{border-color:#ffffffd8}.dCfysG_towerBrief>div{border-color:#ffffffcf}.dCfysG_towerBrief>div span:first-child{color:#6569a6}.dCfysG_towerBrief>button{border-color:#ffffffd1}.dCfysG_towerMetrics article,.dCfysG_towerRoute{border-color:#ffffffc2}.dCfysG_towerRoute>header span{color:#3f5656}.dCfysG_towerRoute>header small{color:#81908d}.dCfysG_towerRoute>div:before{background:linear-gradient(90deg,#55b69771,#8a8fc264)}.dCfysG_towerRoute article{color:#71827e}.dCfysG_towerRoute .dCfysG_towerRouteCleared{color:#389a7d}.dCfysG_towerRoute .dCfysG_towerRouteActive{color:#666bae}.dCfysG_pageHeading button{border-color:#64ad964d}.dCfysG_pageHeading button:hover{background:#fff;border-color:#5da58f80}.dCfysG_creatureCard{color:#304447;background:linear-gradient(150deg,#ffffffe5,#edf4f1c9);border-color:#ffffffc7;box-shadow:inset 0 1px #fff,0 11px 25px #62776f1c}.dCfysG_dexCard{color:#304447;border-color:#ffffffc7}.dCfysG_creatureCard:hover{background:#fffffff2;border-color:#6bb19c6b}.dCfysG_creatureSelected{background:linear-gradient(150deg,#e5f6ef,#d7eee6);border-color:#62b39870;box-shadow:inset 0 1px #fff,0 0 25px #5fb49622}.dCfysG_creatureCard strong{color:#2e4345}.dCfysG_creatureCard span,.dCfysG_creatureCard small{color:#708682}.dCfysG_partyIndex{box-shadow:0 6px 15px #63bda33a}.dCfysG_inventoryPanel,.dCfysG_logPanel{border-color:#ffffffc7}.dCfysG_coreCard{border-color:#ffffffd1}.dCfysG_materialCard{background:linear-gradient(155deg,#ffffffe3,#eef2f4d1)}.dCfysG_idleReward{color:#837334;background:#fff8dcb8;border-color:#c3aa5a38}.dCfysG_statsGrid span{color:#748783;background:#ffffffa8;border-color:#ffffffc4;box-shadow:inset 0 1px #fff}.dCfysG_itemTooltip{border-color:#ffffffd6}.dCfysG_starterModal,.dCfysG_rewardModal{border-color:#ffffffdc}.dCfysG_rewardModal>h2{color:#2d4142}.dCfysG_starterGrid button{border-color:#ffffffce}.dCfysG_starterGrid b{border-color:#5bac925f}.dCfysG_rewardDismissButton{color:#768782}.dCfysG_rewardDismissButton:hover,.dCfysG_rewardDismissButton:focus-visible{color:#47675f;background:#fff;outline-color:#5da58f5c}.dCfysG_rewardHalo{background:radial-gradient(circle,#ffe17e59,#0000 70%)}.dCfysG_rewardItem>strong{color:#3f5453}.dCfysG_toast{border-color:#ffffffd6}.dCfysG_battlePanel{border-color:#ffffffd8}.dCfysG_battlePanel>header{border-color:#54756d16}.dCfysG_battleHeader .dCfysG_flee{border-color:#d878963d}.dCfysG_hpBar{border-color:#ffffffc2}.dCfysG_hpBar i{background:linear-gradient(90deg,#57b78f,#92ca7a)}.dCfysG_boardColumn{border-color:#fffc}.dCfysG_turnSummary{color:#354c4b}.dCfysG_turnSummaryBoss{color:#8e4d63;background:linear-gradient(90deg,#f7dce442,#eadbf24a);border-color:#cf718d31}.dCfysG_ecologyPip{background:#ffffffb8}.dCfysG_actionDots .dCfysG_actionDotActive{background:#64bea2;border-color:#4fa88b;box-shadow:0 0 8px #58af9445}.dCfysG_matchBoard{border-color:#ffffffdc}.dCfysG_matchTile{border-color:#ffffff8f}.dCfysG_towerBattleStatus>b{border-color:#7d82b23d}@media (width<=470px){.dCfysG_dragHandle{display:none}}.dCfysG_launcher{cursor:grab;touch-action:none;user-select:none;-webkit-user-drag:none}.dCfysG_launcherDragging{box-shadow:0 22px 52px #42605c45,inset 0 1px #fff,0 0 0 7px #69c8ac17}.dCfysG_launcherDragging:hover{cursor:grabbing;transition:none;transform:scale(1.035);box-shadow:0 22px 52px #42605c45,inset 0 1px #fff,0 0 0 7px #69c8ac17}.dCfysG_launcherReward{animation:2.35s ease-in-out infinite dCfysG_launcherGiftGlow;box-shadow:0 18px 45px #9b78394a,inset 0 1px #fff,0 0 0 6px #f5c95817}.dCfysG_launcherAvatar{border-radius:inherit;object-position:50% 46%;user-select:none;pointer-events:none;-webkit-user-drag:none;display:block;transform:scale(1.045)}.dCfysG_launcherGift{background:linear-gradient(145deg,#ffe49a,#d6a342);border:1px solid #a8792c;border-radius:5px 5px 8px 8px;width:31px;height:25px;margin-top:5px;animation:2.35s cubic-bezier(.22,1,.36,1) infinite dCfysG_launcherGiftBob;display:block;position:relative;box-shadow:inset 0 1px #fff4c6,0 7px 13px #a6772f4a}.dCfysG_launcherGift:before{content:\"\";background:linear-gradient(#fff0b5,#e1b858);border:1px solid #a8792c;border-radius:7px 7px 3px 3px;height:8px;position:absolute;top:-7px;left:-4px;right:-4px;box-shadow:inset 0 1px #fff9dc}.dCfysG_launcherGift:after{content:\"\";background:linear-gradient(90deg,#b3657f,#e28baa,#aa5674);width:5px;position:absolute;top:-8px;bottom:0;left:50%;transform:translate(-50%);box-shadow:0 1px #fff4}.dCfysG_launcherGift i:before,.dCfysG_launcherGift i:after{content:\"\";z-index:2;background:#fff0f3;border:2px solid #bf6483;width:10px;height:8px;position:absolute;top:-15px;box-shadow:inset 0 0 0 1px #fff}.dCfysG_launcherGift i:before{border-radius:8px 2px 7px 3px;right:50%;transform:rotate(21deg)}.dCfysG_launcherGift i:after{border-radius:2px 8px 3px 7px;left:50%;transform:rotate(-21deg)}@keyframes dCfysG_launcherGiftGlow{0%,72%,to{box-shadow:0 18px 45px #9b78393d,inset 0 1px #fff,0 0 0 6px #f5c95812}82%{box-shadow:0 20px 51px #b9893f5c,inset 0 1px #fff,0 0 0 10px #f5c95824}}@keyframes dCfysG_launcherGiftBob{0%,72%,to{transform:translateY(0)rotate(0)}79%{transform:translateY(-3px)rotate(-2deg)}86%{transform:translateY(-1px)rotate(2deg)}}.dCfysG_header{padding-right:57px}.dCfysG_windowClose{z-index:150;color:#655b68;cursor:pointer;backdrop-filter:blur(18px);background:#fffaf8d9;border:1px solid #ffffffd8;border-radius:15px;place-items:center;width:40px;height:40px;padding:0;transition:transform .18s cubic-bezier(.22,1,.36,1),border-color .18s,background .18s;display:grid;position:absolute;top:13px;right:14px;box-shadow:0 9px 23px #6d667b25,inset 0 1px #fff}.dCfysG_windowClose span{font:300 27px/1 ui-sans-serif,system-ui,sans-serif;transform:translateY(-1px)}.dCfysG_windowClose:hover{background:#fff;border-color:#c697a6a6;transform:translateY(-2px)rotate(3deg)}.dCfysG_overlayDockedRight .dCfysG_windowClose{left:14px;right:auto}.dCfysG_battlePanel>header{padding-right:46px}@media (width<=470px){.dCfysG_windowClose{border-radius:14px;width:38px;height:38px;top:10px;right:10px}.dCfysG_overlayDockedRight .dCfysG_windowClose{left:10px;right:auto}.dCfysG_header{padding-right:51px}}.dCfysG_settingsPage{color:#2f4143;width:min(720px,100%);margin:0 auto;padding:12px 4px 40px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.dCfysG_settingsHero{background:linear-gradient(145deg,#fff,#edf7f3 62%,#f7f1ff);border:1px solid #78a9982b;border-radius:24px;align-items:center;gap:18px;margin-bottom:22px;padding:22px;display:flex;box-shadow:0 18px 48px #527f7117}.dCfysG_settingsHero img{object-fit:cover;border-radius:22px;width:74px;height:74px;box-shadow:0 12px 26px #4e6f6b26}.dCfysG_settingsHero p{color:#6e988c;letter-spacing:.18em;margin:0 0 3px;font-size:11px;font-weight:800}.dCfysG_settingsHero h2{color:#2d4546;margin:0;font-size:26px;line-height:1.1}.dCfysG_settingsHero span{color:#70817f;margin-top:7px;font-size:13px;line-height:1.55;display:block}.dCfysG_settingsCard{background:#ffffffdb;border:1px solid #769e9226;border-radius:20px;justify-content:space-between;align-items:center;gap:24px;padding:20px 22px;display:flex;box-shadow:0 10px 30px #526f6810}.dCfysG_settingsCard>div{gap:6px;display:grid}.dCfysG_settingsCard strong{color:#304a4b;font-size:15px}.dCfysG_settingsCard>div>span{color:#788885;max-width:470px;font-size:12px;line-height:1.55}.dCfysG_settingsSwitch{color:#667974;cursor:pointer;background:#e9efed;border:1px solid #aabbb6;border-radius:999px;flex:none;width:96px;height:40px;padding:0 12px 0 39px;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;transition:background .2s,border-color .2s,color .2s;position:relative}.dCfysG_settingsSwitch i{background:#fff;border-radius:50%;width:30px;height:30px;transition:transform .22s cubic-bezier(.22,1,.36,1);position:absolute;top:4px;left:4px;box-shadow:0 3px 10px #52645f35}.dCfysG_settingsSwitchOn{color:#fff;background:#74b9a5;border-color:#66a895;padding:0 39px 0 12px}.dCfysG_settingsSwitchOn i{transform:translate(56px)}.dCfysG_settingsSwitch:disabled{cursor:wait;opacity:.58}.dCfysG_settingsStatus,.dCfysG_settingsError{margin:12px 5px 0;font-size:12px;line-height:1.5}.dCfysG_settingsStatus{color:#668078}.dCfysG_settingsError{color:#a35f69}.dCfysG_settingsStorageCard{margin-top:12px}.dCfysG_settingsStorageCard code{color:#4d6d65;background:#edf5f2;border:1px solid #6f948923;border-radius:8px;width:fit-content;padding:5px 8px;font:650 11px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace}.dCfysG_settingsDeleteButton,.dCfysG_settingsDeleteActions button{color:#a45f69;cursor:pointer;background:#fff6f6;border:1px solid #bd7d8740;border-radius:12px;flex:none;min-height:38px;padding:0 14px;font:750 11px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_settingsDeleteActions{grid-auto-flow:column;gap:8px!important;display:flex!important}.dCfysG_settingsDeleteActions button:first-child{color:#60736e;background:#f4f7f5;border-color:#829a9335}.dCfysG_settingsDeleteActions .dCfysG_settingsDeleteConfirm{color:#fff;background:#a65f69;border-color:#a85d674f}.dCfysG_settingsDeleteButton:disabled,.dCfysG_settingsDeleteActions button:disabled{cursor:wait;opacity:.55}.dCfysG_creatureCard{cursor:default;padding:0;overflow:hidden}.dCfysG_creatureCard:hover{transform:translateY(-2px)}.dCfysG_creatureSelect{width:100%;min-height:172px;color:inherit;cursor:pointer;font:inherit;background:0 0;border:0;flex-direction:column;align-items:center;padding:8px;display:flex}.dCfysG_creatureSelect>strong{color:#2e4345;font-size:14px}.dCfysG_creatureSelect>span:not(.dCfysG_creatureStats){color:#708682;margin-top:4px;font-size:10px}.dCfysG_creatureSelect>small{color:#708682;text-align:center;margin-top:7px;font-size:10px}.dCfysG_releaseModal{width:min(330px,100%)}.dCfysG_releaseModal>header{align-items:center;gap:14px;display:flex}.dCfysG_releaseModal>header .dCfysG_sprite{flex:none;width:84px;height:84px}.dCfysG_releaseModal>header p{letter-spacing:.18em;margin:0 0 3px;font-size:9px;font-weight:800}.dCfysG_releaseModal h2{font-size:21px}.dCfysG_releaseModal header strong{margin-top:3px;font-size:12px;display:block}.dCfysG_releaseModal>p{margin:15px 0}.dCfysG_releaseReward{align-items:center;gap:10px;padding:10px 12px;display:flex}.dCfysG_releaseReward>span{font-size:11px;font-weight:700}.dCfysG_releaseReward>small{margin-left:auto;font-size:10px;font-weight:800}.dCfysG_releaseActions{grid-template-columns:1fr 1fr;gap:9px;margin-top:17px;display:grid}.dCfysG_releaseActions button{color:#526662;cursor:pointer;background:#f4f7f5;border:1px solid #80999135;border-radius:13px;height:39px;font-weight:750}.dCfysG_releaseActions button:disabled{cursor:wait;opacity:.55}@media (width<=520px){.dCfysG_settingsHero{padding:17px}.dCfysG_settingsHero img{border-radius:18px;width:62px;height:62px}.dCfysG_settingsCard{flex-direction:column;align-items:flex-start}.dCfysG_settingsDeleteActions{grid-template-columns:1fr 1fr;width:100%}.dCfysG_settingsDeleteActions button,.dCfysG_settingsDeleteButton{width:100%}}.dCfysG_damage_advantage{color:#ef344d;text-shadow:0 2px #9e2036,0 0 11px #ff536c82}.dCfysG_damage_neutral{color:#e4a929;text-shadow:0 2px #9a6b17,0 0 11px #ffd45f8c}.dCfysG_damage_resisted{color:#8d969c;text-shadow:0 2px #596267,0 0 9px #d7e0e48c}.dCfysG_partyColumn{gap:5px;display:grid}.dCfysG_sharedPartyVitals{border:1px solid #ffffffd1;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:3px 8px;min-height:34px;padding:5px 8px;display:grid}.dCfysG_sharedHpHeader{grid-column:1/-1;justify-content:space-between;align-items:center;gap:8px;display:flex}.dCfysG_sharedHpHeader span{letter-spacing:.09em;font:900 7px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_sharedHpHeader strong{font:900 9px/1 ui-monospace,monospace}.dCfysG_sharedHpNumbers{justify-content:flex-end;align-items:center;gap:7px;min-width:0;display:flex}.dCfysG_sharedHpNumbers small{white-space:nowrap;border:1px solid #7bb8d89c;padding:2px 5px;font:900 6.5px/1 ui-monospace,monospace;box-shadow:inset 0 1px #fff,0 0 8px #62add33b}.dCfysG_hpHealingValue{color:#c94e7d;white-space:nowrap;background:linear-gradient(135deg,#fff0f6,#ffd4e3);border:1px solid #f19ab7a3;border-radius:999px;padding:2px 5px;font:950 6.5px/1 ui-monospace,monospace;animation:.42s cubic-bezier(.2,1.35,.36,1) both dCfysG_healingValueIn;box-shadow:inset 0 1px #fff,0 0 8px #e9719d42}.dCfysG_sharedPartyVitals .dCfysG_hpBar{border-radius:999px;width:100%;height:10px}.dCfysG_sharedPartyVitals>small{color:#5f7e76;white-space:nowrap;font:800 7px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_hpTeam i{background:linear-gradient(90deg,#41ad84,#82d29b 72%,#b8df82);box-shadow:inset 0 1px #fff7}.dCfysG_hpTeam em{z-index:2;background:linear-gradient(90deg,#ffd35c,#f4b63f);border-radius:0 999px 999px 0;transition:left .28s cubic-bezier(.22,1,.36,1),width .28s cubic-bezier(.22,1,.36,1);box-shadow:inset 0 1px #fff9,0 0 8px #efb53c72}.dCfysG_hpHealingBudget{z-index:3;transform-origin:0;background:linear-gradient(90deg,#ff9bb8,#f477a7);border-radius:999px;min-width:2px;transition:opacity .58s,transform .58s cubic-bezier(.22,1,.36,1);animation:.22s cubic-bezier(.2,1,.36,1) both dCfysG_healingBudgetIn;display:block;position:absolute;top:0;bottom:0;box-shadow:inset 0 1px #fff9,0 0 10px #f36c9a8c}.dCfysG_hpHealingSettling{opacity:0;transform:scaleX(.18)}.dCfysG_hpShieldBar{z-index:4;background:linear-gradient(90deg,#72c9f0,#3d91d4 72%,#2674bd);border-left:2px solid #effbff;border-radius:999px;min-width:2px;height:100%;transition:width .58s cubic-bezier(.22,1,.36,1),opacity .24s;display:block;position:absolute;inset:0 0 0 auto;box-shadow:inset 0 1px #ffffffb8,-2px 0 7px #46a8db5c,0 0 9px #438fce45}.dCfysG_hpShieldActive{animation:.52s cubic-bezier(.2,1,.36,1) both dCfysG_hpShieldPulse}@keyframes dCfysG_healingBudgetIn{0%{opacity:0;transform:scaleX(.25)}}@keyframes dCfysG_healingValueIn{0%{opacity:0;transform:translateY(3px)scale(.75)}}@keyframes dCfysG_hpShieldPulse{0%{filter:brightness()}38%{filter:brightness(1.4);box-shadow:inset 0 1px #fff,-3px 0 10px #65c9faab,0 0 14px #4ea9e68c}to{filter:brightness()}}.dCfysG_teamDamageForecast{justify-self:end;color:#b47a19!important;font-weight:950!important}.dCfysG_matchTileHazard{border-color:#ed5d78b8!important;box-shadow:inset 0 0 0 2px #831c3f52,0 0 10px #ed42615c!important}.dCfysG_matchTileHazard:before{content:\"\";z-index:3;pointer-events:none;background:repeating-linear-gradient(135deg,#0000 0 7px,#6011281f 7px 11px);animation:1.1s ease-in-out infinite alternate dCfysG_hazardPulse;position:absolute;inset:0}.dCfysG_hazardMark{z-index:5;color:#fff;pointer-events:none;background:#b82448e8;border-radius:50%;place-items:center;width:14px;height:14px;font:1000 9px/1 ui-monospace,monospace;display:grid;position:absolute;top:3px;left:4px;box-shadow:0 2px 7px #74142a70}@keyframes dCfysG_hazardPulse{to{background-color:#ff426b1f}}.dCfysG_playerModifierStrip{flex:none;align-items:center;gap:3px;margin-left:auto;display:flex}.dCfysG_combatModifierIcon{--modifier-color:#b47a22;z-index:12;border:1px solid color-mix(in srgb, var(--modifier-color) 64%, white);background:linear-gradient(145deg, #fff, color-mix(in srgb, var(--modifier-color) 18%, white));width:19px;height:19px;color:var(--modifier-color);box-shadow:inset 0 1px #fff, 0 2px 7px color-mix(in srgb, var(--modifier-color) 24%, transparent);cursor:help;border-radius:50%;outline:none;flex:0 0 19px;place-items:center;font:950 8px/1 ui-sans-serif,system-ui,sans-serif;display:grid;position:relative}.dCfysG_combatModifierIcon:after{content:attr(data-tooltip);z-index:60;color:#fff;text-align:left;white-space:normal;opacity:0;pointer-events:none;transform-origin:50% 100%;background:#263b3aee;border:1px solid #ffffffd9;border-radius:8px;width:max-content;max-width:210px;padding:6px 8px;font:750 7px/1.45 ui-sans-serif,system-ui,sans-serif;transition:opacity .14s,transform .14s;position:absolute;bottom:calc(100% + 7px);left:50%;transform:translate(-50%,3px)scale(.96);box-shadow:0 7px 18px #233a364f}.dCfysG_combatModifierIcon:hover:after,.dCfysG_combatModifierIcon:focus-visible:after{opacity:1;transform:translate(-50%)scale(1)}.dCfysG_playerModifierIcon{flex-basis:22px;grid-template-columns:auto auto;align-content:center;column-gap:0;width:22px;height:22px}.dCfysG_playerModifierIcon>b{font:1000 7px/1 ui-monospace,monospace}.dCfysG_playerModifierIcon>small{margin-top:1px;font:900 4.5px/1 ui-monospace,monospace}.dCfysG_modifierAttack{--modifier-color:#d45a43}.dCfysG_modifierPierce{--modifier-color:#8a5bb0}.dCfysG_battleHoverTrigger{cursor:help;outline:none;position:relative}.dCfysG_battleHoverTrigger:focus-visible{box-shadow:0 0 0 2px #9b7fbf4f}.dCfysG_battleHoverDetail{z-index:80;text-align:left;text-transform:none;letter-spacing:normal;white-space:normal;pointer-events:none;opacity:0;visibility:hidden;transform-origin:50% 100%;gap:4px;width:218px;transition:opacity .14s,visibility .14s,transform .14s;display:grid;position:absolute;bottom:calc(100% + 7px);left:50%;transform:translate(-50%,4px)scale(.97)}.dCfysG_battleHoverDetail>b{font:900 9px/1.2 ui-sans-serif,system-ui,sans-serif}.dCfysG_battleHoverDetail>small{font:800 7px/1.35 ui-sans-serif,system-ui,sans-serif}.dCfysG_battleHoverDetail>span{text-transform:none;letter-spacing:normal;font:650 7px/1.5 ui-sans-serif,system-ui,sans-serif}.dCfysG_battleHoverTrigger:hover>.dCfysG_battleHoverDetail,.dCfysG_battleHoverTrigger:focus>.dCfysG_battleHoverDetail{opacity:1;visibility:visible;transform:translate(-50%)scale(1)}.dCfysG_towerBattleStatus>b.dCfysG_battleHoverTrigger .dCfysG_battleHoverDetail{transform-origin:100% 100%;left:auto;right:0;transform:translateY(4px)scale(.97)}.dCfysG_towerBattleStatus>b.dCfysG_battleHoverTrigger:hover .dCfysG_battleHoverDetail,.dCfysG_towerBattleStatus>b.dCfysG_battleHoverTrigger:focus .dCfysG_battleHoverDetail{transform:translateY(0)scale(1)}.dCfysG_boardStage{width:min(100%,clamp(260px,100vh - 480px,346px));margin:0 auto;position:relative}.dCfysG_boardStage .dCfysG_matchBoard{width:100%}.dCfysG_signalRule{text-align:center;border:1px solid;width:fit-content;max-width:96%;margin:3px auto 0;padding:3px 8px;font:750 7px/1.35 ui-sans-serif,system-ui,sans-serif}.dCfysG_signalRule_lumen{color:#9a791d}.dCfysG_signalRule_forge{color:#b54f54}.dCfysG_signalRule_relay{color:#397ca5}.dCfysG_signalRule_aegis{color:#398765}.dCfysG_signalRule_glitch{color:#795397}.dCfysG_captureBoardOverlay{z-index:20;align-content:center;gap:11px;animation:.38s cubic-bezier(.2,1,.36,1) both dCfysG_captureBoardEnter;display:grid;position:absolute;inset:5px;box-shadow:inset 0 1px #fff,0 12px 30px #536c633f}.dCfysG_captureBoardOverlay>header{text-align:center;justify-items:center;gap:4px;display:grid}.dCfysG_captureBoardOverlay>header small{color:#b68d31;letter-spacing:.2em;font:950 7px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_captureBoardOverlay>header strong{color:#334c49;font-size:18px}.dCfysG_captureBoardOverlay>header span,.dCfysG_captureBoardOverlay>p{color:#758782;margin:0;font-size:8px;line-height:1.45}.dCfysG_captureCoreGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;display:grid}.dCfysG_captureCoreGrid button{cursor:pointer;border:1px solid;grid-template-columns:1fr auto;align-items:center;gap:3px;min-width:0;min-height:77px;padding:8px;animation:1.35s ease-in-out infinite alternate dCfysG_captureCoreBreathe;display:grid;position:relative}.dCfysG_captureCoreGrid button:nth-child(2n){animation-delay:-.55s}.dCfysG_captureCoreGrid button:hover:not(:disabled){transform:translateY(-2px)scale(1.025)}.dCfysG_captureCoreGrid button:disabled{cursor:wait;opacity:.55}.dCfysG_captureCoreGrid i{border:3px solid var(--core-color,currentColor);background:radial-gradient(circle, #fff 0 12%, transparent 13%), linear-gradient(135deg, var(--core-light,#e6eef0), #fff);width:34px;height:34px;box-shadow:inset 0 0 0 3px #fff9, 0 0 12px color-mix(in srgb, currentColor 38%, transparent);border-radius:10px;grid-row:1/4;justify-self:center;position:relative;transform:rotate(45deg)}.dCfysG_captureCoreGrid span{text-overflow:ellipsis;color:#526964;min-width:0;font-size:7px;font-weight:850;overflow:hidden}.dCfysG_captureCoreGrid b{color:currentColor;font:950 13px/1 ui-monospace,monospace}.dCfysG_captureCoreGrid small{color:#7c8d89;font:800 7px/1 ui-monospace,monospace}.dCfysG_captureBoardIntro>header strong{animation:.72s cubic-bezier(.2,1.45,.36,1) both dCfysG_captureTitlePulse}@keyframes dCfysG_captureBoardEnter{0%{opacity:0;transform:scale(.92)}}@keyframes dCfysG_captureTitlePulse{0%{opacity:0;transform:translateY(10px)scale(.72)}55%{opacity:1;transform:scale(1.12)}}@keyframes dCfysG_captureCoreBreathe{to{box-shadow:inset 0 1px #fff, 0 8px 19px #61756d28, 0 0 0 3px color-mix(in srgb, currentColor 12%, transparent)}}.dCfysG_battleTransition{z-index:55;place-content:center;justify-items:center;gap:7px;animation:1.08s both dCfysG_battleResultIn;display:grid;position:absolute;inset:0;overflow:hidden}.dCfysG_battleTransition:before{content:\"\";background:linear-gradient(90deg,#0000,#fff,#0000);width:360px;height:2px;animation:.75s ease-out both dCfysG_resultSweep;position:absolute;transform:rotate(-9deg);box-shadow:0 -35px #ffffff52,0 35px #ffffff52}.dCfysG_battleTransition:after{content:\"\";background:linear-gradient(90deg,#0000,#fff,#0000);width:360px;height:2px;animation:.75s ease-out 80ms both dCfysG_resultSweep;position:absolute;transform:rotate(9deg);box-shadow:0 -35px #ffffff52,0 35px #ffffff52}.dCfysG_battleTransition>span{border:2px solid #5fb99b;border-radius:50%;width:88px;height:88px;animation:.8s cubic-bezier(.2,1.4,.36,1) both dCfysG_resultRing;box-shadow:0 0 0 11px #65b99c1f,0 0 40px #4cb99055}.dCfysG_battleTransition>small{z-index:2;color:#66847a;letter-spacing:.22em;font:900 8px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_battleTransition>strong{z-index:2;color:#2f775f;letter-spacing:.04em;text-shadow:0 2px #fff,0 8px 20px #4f927c3d;font:1000 27px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_battleTransitionCapture>span{border-color:#c99938;box-shadow:0 0 0 11px #d8ae401d,0 0 40px #e5bd4a55}.dCfysG_battleTransitionCapture>strong{color:#a97b22}.dCfysG_battleTransitionFailed>span{border-color:#aab4b1;box-shadow:0 0 0 11px #82908b1b,0 0 35px #75847f38}.dCfysG_battleTransitionFailed>strong{color:#747f7c}@keyframes dCfysG_battleResultIn{0%{opacity:0}14%,82%{opacity:1}to{opacity:0}}@keyframes dCfysG_resultRing{0%{opacity:0;transform:scale(.25)rotate(-30deg)}to{opacity:1;transform:scale(1)rotate(0)}}@keyframes dCfysG_resultSweep{0%{opacity:0;transform:translate(-55%)rotate(-9deg)}45%{opacity:.85}to{opacity:0;transform:translate(55%)rotate(-9deg)}}@media (height<=760px){.dCfysG_boardStage{width:min(100%,clamp(238px,100dvh - 430px,310px))}}.dCfysG_spritePlaceholder{color:#82938f;filter:none;background:linear-gradient(145deg,#eef3f0,#dce6e1);border:1px solid #78908a2b;border-radius:50%;place-items:center;font:900 17px/1 ui-monospace,monospace;display:inline-grid}.dCfysG_creatureCard,.dCfysG_dexCard{content-visibility:auto;contain-intrinsic-size:auto 180px}.dCfysG_battlePanel,.dCfysG_boardStage{contain:layout style}.dCfysG_header{backdrop-filter:blur(10px)saturate(110%)}.dCfysG_overlayDragging .dCfysG_header{backdrop-filter:none}.dCfysG_overlayDragging .dCfysG_content *{animation-play-state:paused!important}.dCfysG_creatureCards{grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;padding-bottom:14px}.dCfysG_codekinCard{isolation:isolate;min-width:0}.dCfysG_codekinCard:after{content:none}.dCfysG_codekinDeployed{box-shadow:inset 0 0 0 1px #fff, 0 0 0 2px color-mix(in srgb, var(--core-color,#7b9398) 18%, transparent), 0 13px 28px color-mix(in srgb, var(--core-color,#7b9398) 24%, transparent)}.dCfysG_codekinCard .dCfysG_creatureSelect{z-index:0;justify-content:flex-start;position:relative}.dCfysG_codekinCard .dCfysG_sprite_medium{margin-top:3px}.dCfysG_codekinCard .dCfysG_creatureSelect>strong{text-overflow:ellipsis;white-space:nowrap;max-width:100%;font-size:13px;overflow:hidden}.dCfysG_codekinCard .dCfysG_creatureSelect>.dCfysG_codekinBasics{color:#c2e7ff;box-shadow:none;background:#082a62;border:0;border-radius:0;justify-content:center;align-items:center;gap:5px;margin-top:6px;padding:5px 7px;font-size:10px;font-weight:760;display:inline-flex}.dCfysG_codekinBasics>b{color:#365d54;font:820 8px/1 ui-monospace,SFMono-Regular,Consolas,monospace}.dCfysG_codekinBasics>i{background:var(--core-color,#7b9398);border-radius:50%;width:3px;height:3px}.dCfysG_codekinBasics>span{color:#c2e7ff;margin:0;font-size:10px}.dCfysG_codekinCard .dCfysG_creatureSelect>small{font-weight:720}.dCfysG_codekinNumber{z-index:4;box-shadow:none;background:0 0;border:0;border-radius:0;margin:0;padding:0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-weight:800;position:absolute}.dCfysG_codekinCard .dCfysG_partyIndex{z-index:4;border-radius:999px;margin:0;top:8px;left:auto;right:8px}.dCfysG_codekinDeployment{z-index:4;box-shadow:none;align-items:center;gap:3px;margin:0;font-weight:820;line-height:1;display:inline-flex;position:absolute}.dCfysG_codekinDeployment>i{background:#43a987;border-radius:50%;width:5px;height:5px;box-shadow:0 0 0 2px #76cdb34a}.dCfysG_codekinDeployment>b{color:#fff;background:#4d9f85;border-radius:50%;place-items:center;min-width:13px;height:13px;font:850 7px/1 ui-monospace,monospace;display:grid}.dCfysG_codekinEditMode .dCfysG_codekinCard{border-style:dashed}.dCfysG_codekinEditMode .dCfysG_codekinCard.dCfysG_creatureSelected{outline-offset:-6px;border-style:solid;outline:2px solid #58a98f8c}.dCfysG_codekinSelectionLocked{opacity:.52}.dCfysG_codekinSelectionLocked .dCfysG_creatureSelect{cursor:not-allowed}.dCfysG_squadActions{flex:none;align-items:center;display:flex}.dCfysG_squadActions>span{white-space:nowrap}.dCfysG_squadActions button{cursor:pointer;justify-content:center;align-items:center;gap:4px;font:750 9px/1 ui-sans-serif,system-ui,sans-serif;display:inline-flex}.dCfysG_squadFilterToggle>span{color:#4f8f7d;font:900 13px/1 ui-monospace,monospace;transform:translateY(-1px)}.dCfysG_squadFilterToggle>b{color:#fff;background:#4d9f85;border-radius:999px;place-items:center;min-width:15px;height:15px;font:850 7px/1 ui-monospace,monospace;display:grid}.dCfysG_squadActions .dCfysG_squadFilterActive{border-color:#50a78b70}.dCfysG_squadActions button:disabled{cursor:wait;opacity:.48}.dCfysG_rosterControls{gap:7px;margin:-5px 3px 12px;animation:.35s ease-out both dCfysG_rosterControlsIn;display:grid}.dCfysG_rosterControlRow{align-items:start;min-width:0;display:grid}.dCfysG_rosterControlRow>strong{padding-top:7px}.dCfysG_rosterControlOptions{flex-wrap:wrap;min-width:0;display:flex}.dCfysG_rosterControlOptions button{cursor:pointer;font:720 7px/1 ui-sans-serif,system-ui,sans-serif;box-shadow:inset 0 1px #fff}.dCfysG_rosterControlOptions button:hover{background:#fff;border-color:currentColor}.dCfysG_rosterControlOptions button[aria-pressed=true]{background:color-mix(in srgb, currentColor 12%, white);color:var(--core-color,#337d68);box-shadow:inset 0 1px #fff, 0 3px 9px color-mix(in srgb, currentColor 16%, transparent);border-color:currentColor}.dCfysG_rosterControlSummary{border-top:1px solid #799b9020;justify-content:space-between;align-items:center;gap:8px;min-height:24px;padding-top:6px;display:flex}.dCfysG_rosterControlSummary span{color:#718681;font-size:8px}.dCfysG_rosterControlSummary button{cursor:pointer;border-radius:8px;min-height:24px;padding:0 8px}.dCfysG_rosterEmpty button{cursor:pointer}.dCfysG_rosterControlSummary button:disabled{cursor:default;opacity:.35}.dCfysG_rosterEmpty{text-align:center;border:1px dashed #789c9145;place-content:center;justify-items:center;gap:9px;min-height:160px;margin-top:-2px;display:grid}.dCfysG_rosterEmpty strong{font-size:10px}@keyframes dCfysG_rosterControlsIn{0%{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.dCfysG_codekinDetailBackdrop{z-index:75;cursor:default;padding:10px}.dCfysG_codekinDetailModal{scrollbar-color:#78a6995c transparent;position:relative;overflow-x:hidden}.dCfysG_codekinDetailClose{z-index:3;cursor:pointer;place-items:center;padding:0;transition:transform .15s,filter .15s;display:grid;position:absolute;box-shadow:0 8px 19px #a8495950,inset 0 1px #fff6}.dCfysG_codekinDetailClose span{font:800 20px/1 system-ui,sans-serif;transform:translateY(-1px)}.dCfysG_codekinDetailClose:hover:not(:disabled){filter:brightness(1.05);transform:translateY(-1px)scale(1.03)}.dCfysG_codekinDetailClose:disabled{cursor:wait;opacity:.55}.dCfysG_codekinDetailHero{align-items:center;display:grid}.dCfysG_codekinDetailHero>div{min-width:0}.dCfysG_codekinDetailHero p{letter-spacing:.12em;margin:0 0 6px;font:850 8px/1 ui-monospace,SFMono-Regular,Consolas,monospace}.dCfysG_codekinDetailHero h2{overflow-wrap:anywhere;margin:0}.dCfysG_codekinDetailHero small{margin-top:8px;display:block}.dCfysG_codekinDetailTags{flex-wrap:wrap;gap:4px;margin-top:9px;display:flex}.dCfysG_codekinDetailTags span{font-weight:750}.dCfysG_codekinDetailSection{margin-top:9px}.dCfysG_codekinDetailSection>h3,.dCfysG_codekinGrowth h3{letter-spacing:.03em;margin:0 0 8px;font:760 10px/1.2 ui-sans-serif,system-ui,sans-serif}.dCfysG_codekinDetailStats{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;display:grid}.dCfysG_codekinDetailStats span{place-items:center;gap:3px;min-width:0;display:grid}.dCfysG_codekinDetailStats b{max-width:100%;font:780 13px/1 ui-monospace,SFMono-Regular,Consolas,monospace;overflow:hidden}.dCfysG_codekinProtocols{grid-template-columns:repeat(2,minmax(0,1fr));display:grid}.dCfysG_codekinProtocols article{min-width:0}.dCfysG_codekinProtocols span{font-weight:800;display:block}.dCfysG_codekinProtocols strong{margin-top:4px;display:block}.dCfysG_codekinProtocols p{margin:5px 0 0}.dCfysG_codekinGrowth>header{justify-content:space-between;align-items:flex-start;gap:10px;display:flex}.dCfysG_codekinGrowth>header h3{margin-bottom:3px}.dCfysG_codekinGrowth>header>b{font:800 15px/1 ui-monospace,SFMono-Regular,Consolas,monospace}.dCfysG_codekinGrowth .dCfysG_growthXpTrack{height:7px;margin-top:8px}.dCfysG_codekinGrowth>p{margin:9px 0 6px;font-weight:750}.dCfysG_codekinGrowthActions{grid-template-columns:repeat(5,minmax(0,1fr));display:grid}.dCfysG_codekinGrowthActions button{cursor:pointer;place-items:center;gap:2px;min-width:0;display:grid}.dCfysG_codekinGrowthActions button .dCfysG_materialShard{width:15px;height:19px}.dCfysG_codekinGrowthActions button strong{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.dCfysG_codekinGrowthActions button span{font:800 7px/1 ui-monospace,SFMono-Regular,Consolas,monospace}.dCfysG_codekinGrowthActions button:disabled{cursor:not-allowed;opacity:.34}.dCfysG_codekinDetailFooter{justify-content:flex-end;margin-top:9px;display:flex}.dCfysG_codekinReleaseFromDetail{cursor:pointer;padding:0 11px;font:750 8px/1 ui-sans-serif,system-ui,sans-serif}.dCfysG_codekinReleaseFromDetail:disabled{cursor:not-allowed;opacity:.42}@media (width<=470px){.dCfysG_pageHeading{align-items:flex-start}.dCfysG_squadActions{flex-wrap:wrap;max-width:205px}.dCfysG_rosterControlRow{grid-template-columns:1fr;gap:3px}.dCfysG_rosterControlRow>strong{padding:0 2px}.dCfysG_rosterControlOptions button{padding:0 6px}.dCfysG_codekinCard{contain-intrinsic-size:auto 182px;min-height:182px}.dCfysG_codekinCard .dCfysG_creatureSelect{min-height:182px}.dCfysG_codekinCard .dCfysG_sprite_medium{width:82px;height:82px;margin-top:7px}.dCfysG_codekinDeployment{padding:4px;top:6px;right:5px}.dCfysG_codekinDetailModal{border-radius:22px;padding:12px}.dCfysG_codekinDetailHero{grid-template-columns:118px minmax(0,1fr);min-height:132px;padding-left:0}.dCfysG_codekinDetailHero .dCfysG_sprite_large{width:118px;height:118px}.dCfysG_codekinDetailHero h2{font-size:19px}}.dCfysG_overlay{--surface:#092354;--surface-raised:#103473;--line:#81d9ff38;--accent:#83f5ff;--muted:#b1d0f2;--ink:#051333;width:min(480px,100vw - 24px);height:min(880px,100dvh - 24px);min-height:0;max-height:none;transform:translate(calc(-50% + var(--window-x,0px)), calc(-50% + var(--window-y,0px)));color:#f5fcff;isolation:isolate;backdrop-filter:none;background:linear-gradient(158deg,#065bfa 0%,#034cd7 48%,#073894 100%);border:1px solid #94e6ff82;border-radius:3px 30px 3px 3px;flex-direction:column;font-family:Bahnschrift,Segoe UI,Microsoft YaHei UI,sans-serif;animation:.45s cubic-bezier(.2,.85,.25,1) both dCfysG_reloadWindow;display:flex;position:fixed;inset:50% auto auto 50%;overflow:clip;box-shadow:14px 18px #03133230,0 28px 95px #00103280}.dCfysG_overlay:before{content:\"\";opacity:1;pointer-events:none;z-index:-1;filter:none;background:0 0;border:64px solid #50ddff19;border-radius:50%;width:auto;height:auto;position:absolute;inset:22% -80% -40% 25%;transform:rotate(-24deg)}.dCfysG_overlay:after{content:\"\";pointer-events:none;z-index:-1;background:#d6f7ff33;border:0;border-radius:0;height:1px;position:absolute;inset:auto -15% 13%;transform:rotate(-28deg)}.dCfysG_overlay button{-webkit-tap-highlight-color:transparent;font-family:inherit}.dCfysG_overlay :is(button,input):focus-visible,.dCfysG_launcher:focus-visible{outline-offset:3px;outline:3px solid #8bf5ff}.dCfysG_overlay button:not(:disabled):active{filter:brightness(1.17)}.dCfysG_overlay button:disabled{cursor:not-allowed}.dCfysG_overlayDragging{box-shadow:16px 24px #00143b38,0 34px 100px #00113780}.dCfysG_overlay :is(.dCfysG_content,.dCfysG_battlePanel,.dCfysG_codekinDetailModal){scrollbar-color:#67d6ff7d #00194933;scrollbar-width:thin}.dCfysG_overlay :is(.dCfysG_content,.dCfysG_battlePanel,.dCfysG_codekinDetailModal)::-webkit-scrollbar-thumb{background:#67d6ff7d;border-radius:0}.dCfysG_windowTools{z-index:35;gap:3px;display:flex;position:absolute;top:14px;right:13px}.dCfysG_windowTools button{color:#dffaff;width:29px;height:29px;min-height:29px;box-shadow:none;cursor:pointer;background:#06235080;border:1px solid #b2e9ff45;border-radius:1px;place-items:center;padding:0;font-size:21px;transition:background .15s,transform .15s;display:grid;position:static}.dCfysG_windowTools button:hover{color:#0546b4;background:#e9fcff;transform:translateY(-2px)}.dCfysG_windowTools .dCfysG_windowClose{color:#093368;background:#ecfaff}.dCfysG_windowTools .dCfysG_idleClaimButton{color:#ffdf94;margin:0;position:relative}.dCfysG_windowTools .dCfysG_idleClaimTooltip{right:-32px}.dCfysG_windowTools .dCfysG_idleClaimButton .dCfysG_rewardCrate{width:17px;height:14px}.dCfysG_motionToggle[aria-pressed=true]{color:#84f4ff;border-color:#84f4ff}.dCfysG_header{cursor:grab;touch-action:none;background:#031434;border:0;border-radius:0;flex:none;grid-template-columns:1fr;gap:12px;min-height:105px;margin:0;padding:15px 15px 12px;display:grid;position:relative}.dCfysG_header:after{background:linear-gradient(90deg,#86f6ff 0 27%,#247cfb 27% 86%,#0000 86%);height:3px;bottom:-2px;left:0;right:0}.dCfysG_brand{gap:10px;padding-right:84px}.dCfysG_brand h1{color:#fff;align-items:baseline;gap:8px;margin:0;line-height:1;display:flex}.dCfysG_brand h1 strong{letter-spacing:-.07em;font:italic 900 29px/.95 Arial Narrow,Bahnschrift,sans-serif}.dCfysG_brand h1 span{color:#8feffc;white-space:nowrap;font-size:12px;font-weight:800}.dCfysG_brand p{color:#94b9e0;letter-spacing:.18em;white-space:nowrap;margin-top:5px;font-size:8px;font-weight:700}.dCfysG_logoCore{background:linear-gradient(135deg,#b8ffff 0 43%,#086bea 44% 65%,#5dcef9 66%);border:2px solid #adfaff;border-radius:2px;width:24px;height:24px;box-shadow:4px 4px #13439b}.dCfysG_dragHandle{opacity:.35;gap:2px;position:absolute;top:5px;left:50%}.dCfysG_dragHandle i{background:#83deff;width:2px;height:2px}.dCfysG_headerStats{justify-content:flex-end;gap:6px;padding:0;display:flex}.dCfysG_headerStats .dCfysG_miniCore:nth-of-type(n+4),.dCfysG_headerStats .dCfysG_online,.dCfysG_headerStats .dCfysG_offline{display:inline-flex}.dCfysG_miniCore{min-width:30px;height:22px;box-shadow:none;background:#183662;border:1px solid;border-radius:2px;font:800 11px/20px Bahnschrift,sans-serif}.dCfysG_online{letter-spacing:.08em;background:#153c61;border-radius:0;min-height:22px;padding:5px 7px;font:800 9px/1.2 Bahnschrift,sans-serif}.dCfysG_offline{letter-spacing:.08em;border-radius:0;min-height:22px;padding:5px 7px;font:800 9px/1.2 Bahnschrift,sans-serif}.dCfysG_online{color:#87f7e2}.dCfysG_offline{color:#ffb8c4;background:#53243d}.dCfysG_idleClaimButton{width:29px;height:27px;margin-right:auto;transform:none}.dCfysG_idleClaimButton .dCfysG_rewardCrate{width:24px;height:24px}.dCfysG_tabs{box-shadow:none;background:#0737a9;border:0;border-radius:0;flex:none;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;margin:0;padding:10px 12px 8px;display:grid}.dCfysG_tabs button{color:#afcffa;min-width:0;min-height:49px;box-shadow:none;background:0 0;border:0;border-radius:0;align-content:center;justify-items:start;gap:5px;padding:7px 9px;transition:background .18s,color .18s,translate .18s;display:grid;position:relative;transform:skew(-8deg)}.dCfysG_tabs button>span{opacity:1;justify-content:space-between;width:100%;font:italic 900 15px/1 Bahnschrift,sans-serif;display:flex;transform:skew(8deg)}.dCfysG_tabs button>span i{opacity:.65;font:13px/1 sans-serif}.dCfysG_tabs button>small{letter-spacing:0;font-size:10px;font-weight:800;transform:skew(8deg)}.dCfysG_tabs button:hover{color:#fff;background:#ffffff19;transform:skew(-8deg)translateY(-2px)}.dCfysG_tabs button.dCfysG_tabActive,.dCfysG_tabs button.dCfysG_tabActive:hover{color:#054bc9;background:#effdff;border:0;box-shadow:3px 4px #031e7270}.dCfysG_tabs .dCfysG_tabActive>span{color:#0553dd;text-shadow:none}.dCfysG_content{scroll-behavior:smooth;overscroll-behavior:contain;background:0 0;flex:auto;width:100%;min-height:0;margin:0;padding:20px 17px 16px;animation:.42s cubic-bezier(.2,.8,.2,1) both dCfysG_reloadPage;position:relative;overflow:auto}.dCfysG_content[data-page=squad]{padding-top:18px}.dCfysG_footer{color:#a0c5ed;background:#042967;border-top:1px solid #85c8ff33;flex:none;align-items:center;gap:9px;margin:0;padding:9px 14px;display:flex;position:relative}.dCfysG_footer>span{letter-spacing:.08em;color:#7deafd;flex:none;font-size:8px;font-weight:800}.dCfysG_footer>small{text-align:right;font-size:8px;line-height:1.45}.dCfysG_sectionKicker,.dCfysG_towerHeading>div>span{color:#9cf6ff;letter-spacing:.15em;text-transform:uppercase;margin-bottom:7px;font:800 10px/1.2 Bahnschrift,sans-serif;display:block}.dCfysG_towerHeading h2,.dCfysG_pageHeading h2{letter-spacing:-.05em;color:#fff;margin:0;font:italic 900 33px/1.15 Bahnschrift,Microsoft YaHei UI,sans-serif}.dCfysG_towerHeading p,.dCfysG_pageHeading p{color:#c4e1ff;margin-top:8px;font-size:11px;line-height:1.5}.dCfysG_pageHeading{align-items:flex-end;gap:12px;margin-bottom:13px}.dCfysG_pageHeading h2{font-size:29px}.dCfysG_pageHeading button,.dCfysG_squadActions button,.dCfysG_rosterEmpty button{color:#061b48;background:#b3f6ff;border:1px solid #d2fcff;border-radius:1px;min-height:32px;padding:7px 10px;font-size:11px;font-weight:800;box-shadow:3px 3px #0125715c}.dCfysG_squadActions{flex-wrap:wrap;justify-content:flex-end;gap:5px}.dCfysG_squadActions>span{color:#c2eeff;font-size:10px}.dCfysG_squadActions .dCfysG_squadCancel{color:#dcf3ff;background:#082b73;border-color:#91c2f962}.dCfysG_squadActions .dCfysG_squadFilterToggle{color:#e5f7ff;background:#083b9c;border-color:#74bcff70}.dCfysG_squadActions .dCfysG_squadFilterActive{color:#0453bc;background:#e3fbff}.dCfysG_towerPage{flex-direction:column;gap:14px;min-height:580px;display:flex}.dCfysG_towerHeading{min-height:78px;margin:0}.dCfysG_towerHeading>strong{letter-spacing:-.09em;color:#0000;-webkit-text-stroke:1px #b6f4ff8c;font:italic 900 77px/.95 Bahnschrift,sans-serif}.dCfysG_towerHero{background:linear-gradient(118deg,#082b85 0 47%,#62ddfa 47.3% 69%,#148aee 69.3%);border:1px solid #6cd9ff99;border-radius:2px 34px 2px 2px;flex:1;min-height:360px;margin:0;position:relative;overflow:hidden;box-shadow:7px 8px #022b7670}.dCfysG_towerHero:before{opacity:.7;background:repeating-linear-gradient(0deg,#0000 0 30px,#91e9ff20 30px 31px)}.dCfysG_towerHero:after{background:0 0;border-color:#b4f9ff4d}.dCfysG_towerMonument{filter:drop-shadow(12px 15px #02225c55);width:235px;height:244px;bottom:45px;left:-6px;transform:rotate(-7deg)skewY(-4deg)}.dCfysG_towerMonument i{background:linear-gradient(90deg,#062966,#0b63d5 63%,#8deaff);border:1px solid #9edfff9c;border-top:3px solid #d2ffff;border-radius:0;height:30px;box-shadow:inset 0 -9px #07327a44}.dCfysG_towerMonument b{background:#b9ffff;border-color:azure;border-radius:0;box-shadow:0 0 22px #67f2ff99}.dCfysG_towerBossCard{color:#052765;clip-path:polygon(10% 0,100% 0,100% 92%,90% 100%,0 100%,0 8%);width:175px;min-height:225px;box-shadow:none;background:#edfaff;border:0;border-radius:0;padding:12px 8px;top:18px;right:16px}.dCfysG_towerBossCard>span{color:#1454a4;letter-spacing:.08em;font-size:10px}.dCfysG_towerBossCard .dCfysG_sprite_large{filter:drop-shadow(8px 9px #2b84bb26);width:144px;height:144px}.dCfysG_towerBossCard strong{color:#082959;font-size:21px;font-weight:900}.dCfysG_towerBossCard small{color:#346399;font-size:11px}.dCfysG_towerBrief{align-items:stretch;gap:9px;bottom:13px;left:12px;right:12px}.dCfysG_towerBrief>div{box-shadow:none;background:#031f59ea;border:1px solid #9bddff55;border-radius:0;padding:10px}.dCfysG_towerBrief>div span{color:#c2e8ff;font-size:10px;line-height:1.55}.dCfysG_towerBrief>button{color:#0742a6;clip-path:polygon(8% 0,100% 0,100% 87%,90% 100%,0 100%,0 12%);background:#eafeff;border:0;border-radius:0;min-width:110px;padding:12px;font-size:13px;font-weight:900;box-shadow:4px 5px #0035694d}.dCfysG_towerBrief>button:hover{background:#a7f8ff;transform:translateY(-3px)}.dCfysG_towerMetrics{gap:8px}.dCfysG_towerMetrics article{box-shadow:none;background:#073285;border:1px solid #5fa9f967;border-radius:0;padding:12px}.dCfysG_towerMetrics span{color:#acd6fd;font-size:10px}.dCfysG_towerMetrics b{color:#f0fdff;margin-top:8px;font:italic 900 30px/1 Bahnschrift,sans-serif}.dCfysG_towerRoute{box-shadow:none;background:#082d7dd1;border:1px solid #5299e55e;border-radius:0;padding:13px}.dCfysG_towerRoute header span{color:#ddf5ff;font-size:12px}.dCfysG_towerRoute header small{color:#82c8f2;font-size:8px}.dCfysG_towerRoute article b{color:#bad9ff;font-size:12px}.dCfysG_towerRoute article span{color:#b6cef2;font-size:9px}.dCfysG_towerRoute article i{background:#092b70;border-color:#779be3}.dCfysG_towerRoute .dCfysG_towerRouteCleared i{background:#7cf3e3;border-color:#aafff4;box-shadow:0 0 0 4px #66e5dd18}.dCfysG_towerRoute .dCfysG_towerRouteActive i{background:#e6fdff;border-color:#fff;box-shadow:0 0 0 5px #89f0ff27}.dCfysG_rosterSearch{background:#042568;border:1px solid #91caff6b;align-items:center;gap:8px;min-height:40px;margin-bottom:12px;padding:0 10px;display:flex}.dCfysG_rosterSearch>span{color:#8cf0ff;font-size:24px}.dCfysG_rosterSearch input{color:#f1faff;outline-offset:-2px;background:0 0;border:0;flex:1;min-width:0;padding:10px 0;font-family:inherit;font-size:12px;line-height:1.5}.dCfysG_rosterSearch input::placeholder{color:#adcaf0;opacity:1}.dCfysG_rosterSearch small{color:#8bdaf5;font-variant-numeric:tabular-nums;font-size:10px}.dCfysG_rosterControls{background:#082864;border:1px solid #8fe7ff70;border-radius:0;margin-bottom:12px;padding:12px;box-shadow:4px 5px #001e6666}.dCfysG_rosterControlRow{grid-template-columns:48px minmax(0,1fr);gap:6px;margin-bottom:8px}.dCfysG_rosterControlRow>strong{color:#9dcef1;font-size:10px}.dCfysG_rosterControlOptions{gap:4px}.dCfysG_rosterControlOptions button{color:#d3eaff;background:#143974;border:1px solid #769cc44d;border-radius:0;min-height:30px;padding:4px 8px;font-size:10px}.dCfysG_rosterControlOptions button[aria-pressed=true]{color:#0345a0;box-shadow:none;background:#d6fbff;border-color:#e1ffff}.dCfysG_rosterControlSummary{color:#bddefb;font-size:10px}.dCfysG_rosterControlSummary button{color:#b4f4ff;background:0 0;border:0;font-size:10px}.dCfysG_squadSlots{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px;display:grid}.dCfysG_squadSlots button{color:#eafcff;cursor:pointer;background:#083585;border:1px solid #a8f3ff77;border-radius:0;grid-template-columns:18px 1fr;place-items:center;min-height:80px;padding:8px;display:grid}.dCfysG_squadSlots b{color:#79d8fa;align-self:start;font:italic 900 14px/1 sans-serif}.dCfysG_squadSlots small{grid-column:1/-1;font-size:10px}.dCfysG_squadSlots .dCfysG_sprite_small{width:44px;height:44px}.dCfysG_squadSlots button:disabled{opacity:.62}.dCfysG_creatureCards{gap:10px}.dCfysG_codekinCard{--quality-color:#aabedb;border:1px solid #548bd1;border-left:3px solid var(--quality-color);min-height:188px;transform:perspective(600px) rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg));content-visibility:auto;contain-intrinsic-size:auto 188px;background:linear-gradient(149deg,#0a367e 0 72%,#113f8e 72.5%);border-radius:0;transition:transform .18s ease-out,background .18s,border-color .18s;box-shadow:4px 5px #032a7961}.dCfysG_codekinCard[data-quality=pulse]{--quality-color:#79dfe5}.dCfysG_codekinCard[data-quality=prism]{--quality-color:#b8acff}.dCfysG_codekinCard[data-quality=nova]{--quality-color:#f4b8ff}.dCfysG_codekinCard[data-quality=origin]{--quality-color:#ffe597}.dCfysG_codekinCard:hover,.dCfysG_codekinCard:focus-within{background:linear-gradient(149deg,#1156a4 0 72%,#1d66ba 72.5%);border-color:#b1efff;box-shadow:5px 7px #02276c91}.dCfysG_codekinCard[data-deployed=true]{background:linear-gradient(145deg,#0c3f86,#125b9c);border-top-color:#84eaff}.dCfysG_codekinEditMode .dCfysG_codekinCard.dCfysG_creatureSelected{background:#125395;outline-color:#a3f9ff}.dCfysG_codekinNumber{color:#97bdef;font-size:10px;top:9px;left:9px}.dCfysG_codekinCard .dCfysG_creatureSelect{color:#ebfaff;min-height:188px;padding:24px 5px 11px}.dCfysG_codekinCard .dCfysG_sprite_medium{filter:drop-shadow(5px 7px #00143a38);width:94px;height:94px;margin:0;transition:transform .24s cubic-bezier(.2,.8,.2,1)}.dCfysG_codekinCard:hover .dCfysG_sprite_medium{transform:translateY(-4px)scale(1.05)}.dCfysG_codekinCard strong{color:#f4fcff;margin-top:2px;font-size:13px;font-weight:800}.dCfysG_codekinBasics{color:#badaff;gap:4px;margin-top:6px;font-size:10px}.dCfysG_codekinBasics b{color:#96f0ff;font-size:11px}.dCfysG_codekinCard .dCfysG_creatureSelect>small{color:#b5cff0;margin-top:6px;font-size:9px}.dCfysG_codekinDeployment{color:#004694;background:#b7f6ff;border:0;border-radius:0;padding:3px 5px;font-size:8px;top:6px;right:5px}.dCfysG_codekinDeployment b{color:#0050a2}.dCfysG_partyIndex{z-index:2;border-radius:0;top:7px;left:7px;color:#053f99!important;background:#bbfbff!important}.dCfysG_rosterEmpty{color:#d6edff;background:#073181a8;border-radius:0;padding:30px}.dCfysG_dexGrid{gap:9px}.dCfysG_dexCard{background:#062e7c;border:1px solid #4d86d357;border-radius:0;min-height:157px;padding:12px 7px;box-shadow:3px 4px #00185633}.dCfysG_dexCaught{color:#e9faff;background:#0a438e;border-color:#90ecff8c}.dCfysG_dexSeen{color:#badcff;border-color:#8bbcff69}.dCfysG_dexNumber{color:#80b5ec;font-size:10px}.dCfysG_dexCard strong{color:inherit;font-size:12px}.dCfysG_dexCard small{color:#b4cff6;font-size:10px}.dCfysG_dexCard>span:last-child{color:#8ee8fd;font-size:9px}.dCfysG_spriteUnknown{filter:brightness(0)invert(.55)sepia(.6)saturate(2)hue-rotate(155deg);opacity:.45}.dCfysG_inventoryLayout{gap:14px}.dCfysG_inventoryPanel,.dCfysG_logPanel{background:#072c76c9;border:1px solid #66b7f26b;border-radius:0;padding:15px;box-shadow:5px 6px #01267355}.dCfysG_inventoryPanel h2,.dCfysG_logPanel h2{color:#f2fbff;margin-bottom:13px;font:italic 900 22px/1.2 Bahnschrift,sans-serif}.dCfysG_inventoryPanel p,.dCfysG_logPanel p{color:#b8d7f5;font-size:11px;line-height:1.6}.dCfysG_coreCard{background:#062355;border:1px solid #72bafa60;border-radius:0;min-height:110px;box-shadow:3px 4px #021d5744}.dCfysG_coreCard strong{color:#e1f2ff;font-size:10px;font-weight:700}.dCfysG_coreCard b{color:#c0f7ff;font-size:20px;font-weight:800}.dCfysG_materialXp{color:#9edff4;font-size:8px}.dCfysG_miniCore.dCfysG_core_pebble{color:#d9e6f8}.dCfysG_miniCore.dCfysG_core_pulse{color:#8af7d2}.dCfysG_miniCore.dCfysG_core_prism{color:#92d6ff}.dCfysG_miniCore.dCfysG_core_nova{color:#ddb8ff}.dCfysG_miniCore.dCfysG_core_origin{color:#ffe18c}.dCfysG_statsGrid{gap:8px;margin-top:16px}.dCfysG_statsGrid>span{color:#badcfc;background:#0a3980;border:1px solid #7fd0fa4d;border-radius:0;padding:12px;font-size:10px}.dCfysG_statsGrid b{color:#ddfaff;font:italic 800 28px/1.2 Bahnschrift,sans-serif}.dCfysG_logPanel li{color:#c1ddf7;border-color:#86caff29;grid-template-columns:64px 1fr;font-size:11px;line-height:1.6}.dCfysG_logPanel time{color:#8bcef5;font-size:9px}.dCfysG_starterModal{color:#eaf9ff;background:linear-gradient(145deg,#085ad3,#073180);border:1px solid #8ddeff;border-radius:2px 24px 2px 2px;box-shadow:9px 10px #001b5755}.dCfysG_starterModal h2{color:#f4fcff;font-style:italic}.dCfysG_starterModal>p{color:#c2e4ff;font-size:12px;line-height:1.6}.dCfysG_starterGrid button{color:#edfbff;background:#062b72;border:1px solid #92d7ff66;border-radius:0;box-shadow:3px 4px #001e6055}.dCfysG_starterGrid button:hover{background:#104c99;border-color:#acffff}.dCfysG_starterGrid strong{font-size:14px}.dCfysG_starterGrid span,.dCfysG_starterGrid small{color:#b8ddfa}.dCfysG_starterGrid b{color:#0644a2;background:#b8f9ff;border:0;border-radius:0;font-size:12px}.dCfysG_releaseModal>header p,.dCfysG_releaseModal header strong{color:#bdeaff}.dCfysG_releaseReward{background:#08357d;border:1px solid #98d5fb77;border-radius:0}.dCfysG_releaseReward>span,.dCfysG_releaseReward>small{color:#d7f5ff}.dCfysG_releaseActions .dCfysG_releaseDanger{color:#fff;background:#b44973;border-color:#ffc0d7}.dCfysG_modalBackdrop{backdrop-filter:blur(9px);background:#021434be;padding:16px}.dCfysG_rewardBackdrop,.dCfysG_codekinDetailBackdrop{background:#021434ce}.dCfysG_rewardModal,.dCfysG_releaseModal,.dCfysG_confirmPanel{color:#eefbff;background:linear-gradient(147deg,#0756d7,#06378e);border:1px solid #9decff94;border-radius:2px 24px 2px 2px;max-width:100%;max-height:calc(100% - 16px);padding:20px;animation:.38s cubic-bezier(.15,.9,.3,1.08) both dCfysG_reloadDialog;overflow-y:auto;box-shadow:9px 10px #00163960,0 20px 60px #000b2475}.dCfysG_codekinDetailModal{color:#eefbff;background:linear-gradient(147deg,#0756d7,#06378e);border:1px solid #9decff94;border-radius:2px 24px 2px 2px;max-width:100%;max-height:calc(100% - 16px);animation:.38s cubic-bezier(.15,.9,.3,1.08) both dCfysG_reloadDialog;overflow-y:auto;box-shadow:9px 10px #00163960,0 20px 60px #000b2475}.dCfysG_rewardModal h2,.dCfysG_releaseModal h2,.dCfysG_confirmPanel h2{color:#fff;margin:0 0 10px;font:italic 900 26px/1.3 Bahnschrift,Microsoft YaHei UI,sans-serif}.dCfysG_rewardModal>p,.dCfysG_releaseModal>p,.dCfysG_confirmPanel p{color:#c2e6ff;font-size:12px;line-height:1.6}.dCfysG_rewardModal>button,.dCfysG_releaseModal button,.dCfysG_confirmPanel button{color:#053781;cursor:pointer;background:#c4fbff;border:1px solid #d4fbff;border-radius:0;min-height:39px;padding:10px 16px;font-family:inherit;font-size:12px;font-weight:800;line-height:1.25}.dCfysG_confirmPanel{gap:9px;width:340px;display:grid}.dCfysG_confirmPanel .dCfysG_discardButton{color:#b2cdea;background:#0a337e;border-color:#bddeff45}.dCfysG_rewardItem{box-shadow:none;color:#e4f4ff;background:#083784;border-color:#a5deff52;border-radius:0}.dCfysG_rewardItem strong{color:#f0fbff;font-size:12px}.dCfysG_rewardItem b{color:#b6f4ff;font-size:14px}.dCfysG_itemTooltip,.dCfysG_battleHoverDetail{color:#d9f0ff;background:#041c4ef5;border:1px solid #a0eaff;border-radius:1px;padding:10px;font-size:11px;line-height:1.5;box-shadow:5px 6px #000c285c}.dCfysG_itemTooltip strong,.dCfysG_battleHoverDetail strong{color:#96efff;font-size:12px}.dCfysG_itemTooltip small{color:#c7e5ff;font-size:11px;line-height:1.5}.dCfysG_itemTooltip span,.dCfysG_battleHoverDetail span,.dCfysG_battleHoverDetail p{color:#c7e5ff;font-size:11px}.dCfysG_codekinDetailModal{width:100%;padding:17px}.dCfysG_codekinDetailClose{color:#d6f8ff;background:#041b56;border:1px solid #b2eeff9e;border-radius:0;width:31px;height:31px;font-size:23px;top:11px;right:11px}.dCfysG_codekinDetailHero{min-height:150px;box-shadow:none;background:linear-gradient(118deg,#117ad2 0 34%,#083c8c 34.3%);border:1px solid #92d8ff55;border-radius:0;grid-template-columns:132px minmax(0,1fr);gap:10px;padding:10px 15px 12px 0}.dCfysG_codekinDetailHero .dCfysG_sprite_large{filter:drop-shadow(9px 10px #00236859);width:132px;height:132px}.dCfysG_codekinDetailHero p{color:#9beeff;font-size:10px}.dCfysG_codekinDetailHero h2{color:#fff;font:italic 900 27px/1.2 Bahnschrift,Microsoft YaHei UI,sans-serif}.dCfysG_codekinDetailHero small{color:#c7e5ff;font-size:11px}.dCfysG_codekinDetailTags span{color:#cef;background:#083c90;border:1px solid #88d5ff5e;border-radius:0;padding:4px 6px;font-size:10px}.dCfysG_codekinDetailSection{box-shadow:none;background:#042d7bb8;border:1px solid #9adaff55;border-radius:0;padding:12px}.dCfysG_codekinDetailSection>h3,.dCfysG_codekinGrowth h3{color:#b5f4ff;font-size:12px}.dCfysG_codekinDetailStats span{color:#c8dfff;background:#124995;border:0;border-radius:0;padding:10px 2px;font-size:10px}.dCfysG_codekinDetailStats b{color:#f0fdff;font-size:17px}.dCfysG_codekinProtocols{gap:8px}.dCfysG_codekinProtocols article{background:#12428b;border:0;border-left:2px solid #6ed8ff;border-radius:0;padding:10px}.dCfysG_codekinProtocols span{color:#89e6fa;font-size:10px}.dCfysG_codekinProtocols strong{color:#edfaff;font-size:13px}.dCfysG_codekinProtocols p{color:#bbd9f6;font-size:11px;line-height:1.65}.dCfysG_codekinGrowth>header small,.dCfysG_codekinGrowth>p{color:#b8def6;font-size:11px}.dCfysG_codekinGrowth>header>b{color:#a9f6ff;font-size:22px}.dCfysG_codekinGrowth .dCfysG_growthXpTrack{background:#082152;border-radius:0}.dCfysG_growthXpTrack>i{background:#86efff;transition:width .4s cubic-bezier(.2,.8,.2,1)}.dCfysG_codekinGrowthActions{gap:5px}.dCfysG_codekinGrowthActions button{color:#b4efff;min-height:82px;box-shadow:none;background:#0a3d87;border:1px solid #87d0ff59;border-radius:0;padding:9px 3px;transition:background .18s,translate .18s}.dCfysG_codekinGrowthActions button:not(:disabled):hover{background:#155ca8;translate:0 -3px}.dCfysG_codekinGrowthActions button strong{color:#e2f7ff;font-size:10px}.dCfysG_codekinGrowthActions button span{font-size:10px}.dCfysG_codekinGrowthActions button small{color:#b6d5f9;font-size:10px}.dCfysG_codekinReleaseFromDetail{color:#ffd2e4;background:#51266280;border:1px solid #ffc4df7c;border-radius:0;min-height:35px;font-size:11px}.dCfysG_levelPulse{animation:.42s ease-out dCfysG_reloadLevel}.dCfysG_battleBackdrop{z-index:45;backdrop-filter:none;background:#031435;padding:7px;position:absolute;inset:0}.dCfysG_battlePanel{color:#e9faff;width:100%;height:100%;max-height:none;box-shadow:none;overscroll-behavior:contain;background:linear-gradient(160deg,#05244f,#052c69 60%,#001435);border:1px solid #71d1ff58;border-radius:1px 22px 1px 1px;padding:7px 7px 12px;position:relative;overflow:auto}.dCfysG_battlePanel>header{background:#05224fef;border-bottom:2px solid #72d9fc;min-height:49px;padding:5px 2px 10px}.dCfysG_battleHeader>div{gap:5px;display:grid}.dCfysG_battleHeader .dCfysG_battleWindowActions{flex:none;gap:5px;display:flex}.dCfysG_battlePanel h2{color:#edfaff;font-size:18px;font-style:italic;font-weight:900}.dCfysG_battleHeader>div span{color:#9dc8ef;font-size:10px}.dCfysG_battleHeader .dCfysG_flee{color:#daedff;background:#183b66;border:1px solid #a5d7ff69;border-radius:0;min-height:31px;padding:7px 12px;font-size:11px}.dCfysG_hpBar{height:12px;box-shadow:none;background:#041531;border:1px solid #83d4fa53;border-radius:1px}.dCfysG_hpBar>i,.dCfysG_hpBar>em{border-radius:0}.dCfysG_turnSummary>strong{color:#d6efff;font-size:11px}.dCfysG_turnSkipButton{color:#d8f6ff;background:#164578;border-color:#a4e0ff70;border-radius:0;min-height:27px}.dCfysG_signalRule{color:#bce9ff;background:#123962;border-color:#83c9ff44;border-radius:0;font-size:10px}.dCfysG_towerBattleStatus{box-shadow:none;background:#0b2e60;border-color:#7ac3ff55;border-radius:0}.dCfysG_towerBattleStatus strong{color:#d5f3ff;font-size:10px}.dCfysG_towerBattleStatus small{color:#a5cce9;font-size:9px}.dCfysG_towerBattleStatus>b{color:#9ee5ff;border-radius:0;font-size:8px}.dCfysG_battleHoverDetail>span{color:#d1e8ff;font-size:11px;line-height:1.6}.dCfysG_battleHoverDetail>b{color:#96f2ff;font-size:12px}.dCfysG_battleHoverDetail>small{color:#b3d8f7;font-size:10px;line-height:1.5}.dCfysG_sharedPartyVitals{box-shadow:none;background:#0b3469;border-color:#8bd8ff5c;border-radius:0}.dCfysG_sharedHpHeader span{color:#85d2f9;font-size:9px}.dCfysG_sharedHpHeader strong{color:#ddfaff;font-size:12px}.dCfysG_sharedHpNumbers small{color:#beedff;background:#135887;border-color:#92e8ff66;border-radius:0;font-size:9px}.dCfysG_hpTeam>i{background:linear-gradient(90deg,#4abcce,#a6fff0)}.dCfysG_boardColumn{box-shadow:none;background:#061b41;border:1px solid #5aa3dc70;border-radius:1px;padding:7px}.dCfysG_matchBoard{background:#001232;border:1px solid #6396c754;border-radius:1px;width:min(100%,364px);margin:0 auto;padding:5px;box-shadow:inset 0 1px 12px #000c225e}.dCfysG_boardRow{display:contents}.dCfysG_matchTile{transform-origin:50% 85%;border:1px solid #ffffff8a;border-radius:5px 5px 12px;min-height:0;padding:0;box-shadow:inset 0 -4px #00172f45,inset 0 2px #fff5,0 3px #000919b0}.dCfysG_matchTile:after{filter:none;background:#ffffff7a;border-radius:0;height:8%;top:9%;left:12%;right:40%;transform:skew(-24deg)}.dCfysG_matchTile>span{text-shadow:0 1px 1px #fff6;color:#062345;font-size:18px}.dCfysG_tile_lumen{background:linear-gradient(150deg,#ffe69c,#e5ac39)}.dCfysG_tile_forge{background:linear-gradient(150deg,#ffaaa0,#e45870)}.dCfysG_tile_relay{background:linear-gradient(150deg,#8fe9ff,#249bcc)}.dCfysG_tile_aegis{background:linear-gradient(150deg,#a3f5c6,#37b997)}.dCfysG_tile_glitch{background:linear-gradient(150deg,#e4bbff,#9b66df)}.dCfysG_matchTile:disabled{opacity:1}.dCfysG_matchTileLocked{opacity:.48!important}.dCfysG_matchTileSelected{outline-offset:1px;outline:2px solid #fff;box-shadow:0 0 0 4px #66e7ff8c,inset 0 -3px #02457938}.dCfysG_matchTileDragging{z-index:12;transform:translate3d(var(--drag-x),var(--drag-y),0) scale(1.055);transition:none}.dCfysG_matchTileFalling{animation-timing-function:linear!important}.dCfysG_boardHelp{color:#9cbbdf;margin:7px 0 2px;font-size:10px;line-height:1.5}.dCfysG_actionDots i{background:#76daf1;border-color:#9bdafc}.dCfysG_captureBoardOverlay{color:#ebfaff;backdrop-filter:blur(7px);background:linear-gradient(145deg,#074acfef,#052b78f7);border:1px solid #b3f8ff;border-radius:1px;padding:20px 12px}.dCfysG_captureBoardOverlay header small{color:#9eeeff;letter-spacing:.14em;font-size:10px}.dCfysG_captureBoardOverlay header strong{color:#fff;font-size:25px;font-style:italic;font-weight:900}.dCfysG_captureBoardOverlay header span{color:#c9e9ff;font-size:11px}.dCfysG_captureCoreGrid button{color:#dcf7ff;box-shadow:none;background:#0e428e;border-color:#88c8ff72;border-radius:0}.dCfysG_captureCoreGrid button strong,.dCfysG_captureCoreGrid button span{color:#c9f3ff;font-size:11px}.dCfysG_captureCoreGrid button b{color:#f2ffff;font-size:20px}.dCfysG_captureCoreGrid button small{color:#bce5ff;font-size:10px}.dCfysG_captureCoreGrid button:hover:not(:disabled){background:#1b68bb;border-color:#d3ffff}.dCfysG_captureBoardOverlay>button{color:#badeff;background:#0e3c85;border-radius:0;font-size:11px}.dCfysG_battleTransition{backdrop-filter:blur(4px);background:#0048d9eb;border-radius:0}.dCfysG_battleTransition strong{color:#fff;text-shadow:5px 4px #002f97;font-size:31px;font-style:italic}.dCfysG_battleTransition small{color:#8ef2ff;letter-spacing:.2em;font-size:12px}.dCfysG_battleTransitionFailed{background:#08284eed}.dCfysG_connectionBanner{color:#ffe4ef;background:#412e69;border-left:3px solid #ffb9cd;align-items:center;gap:10px;margin-bottom:14px;padding:11px;font-size:11px;display:flex}.dCfysG_connectionBanner button{color:#462251;background:#f2e9ff;border:1px solid #e4c7ee;border-radius:0;flex:none;padding:7px;font-size:11px}.dCfysG_centerMessage{color:#d0eeff;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:13px;padding:30px;font-size:13px;display:flex}.dCfysG_loadingMark{color:#98f6ff;font-size:70px;line-height:1;animation:4s linear infinite dCfysG_reloadOrbit}.dCfysG_centerMessage button{color:#0750b4;cursor:pointer;background:#b7f5ff;border:0;border-radius:0;padding:10px 16px;font-size:13px}.dCfysG_toast{color:#d9f8ff;z-index:90;background:#061e4ff5;border:1px solid #a3edff;border-left:4px solid #99f8ff;border-radius:0;align-items:center;gap:10px;width:auto;padding:12px;font-size:12px;line-height:1.5;animation:.4s ease-out dCfysG_reloadPage;display:flex;position:absolute;bottom:43px;left:14px;right:14px;transform:none;box-shadow:5px 6px #00132b55}.dCfysG_toast span{flex:1}.dCfysG_toast button{color:#cef3ff;cursor:pointer;background:#164171;border:0;flex:none;width:27px;height:27px;font-size:20px}.dCfysG_particleLayer{pointer-events:none;z-index:100;contain:strict;position:absolute;inset:0;overflow:hidden}.dCfysG_motionParticle{pointer-events:none;will-change:transform,opacity;width:5px;height:7px;position:absolute;box-shadow:0 0 5px #adf7ff33}.dCfysG_launcher{background:linear-gradient(145deg,#126cf3,#042c87);border:1px solid #99e9ffb0;border-radius:2px 18px 2px 2px;width:66px;height:66px;transition:background .2s,box-shadow .2s;box-shadow:5px 6px #00245944,0 13px 32px #00153244}.dCfysG_launcher:hover{background:#1482ee;border-color:#cbffff;transform:translateY(-3px)}.dCfysG_launcherAvatar{object-fit:contain;filter:drop-shadow(3px 6px #00194733);width:78px;max-width:none;height:78px;max-height:none}.dCfysG_launcher .dCfysG_badge{color:#fff;corner-shape:round;background:#ef4057;border:2px solid #fff;border-radius:999px;min-width:20px;height:20px;padding:0 5px;font-size:11px;box-shadow:0 2px 7px #961c364d}.dCfysG_launcherDragging{cursor:grabbing;transition:none;transform:none!important}.dCfysG_launcherReward{background:linear-gradient(140deg,#156fe4,#05308a);border-color:#a6ebff}@keyframes dCfysG_reloadWindow{0%{opacity:0;clip-path:inset(0 90% 0 0)}to{opacity:1;clip-path:inset(0)}}@keyframes dCfysG_reloadPage{0%{opacity:0;translate:16px}to{opacity:1;translate:0}}@keyframes dCfysG_reloadDialog{0%{opacity:0;transform:translateY(20px)scale(.96)rotate(-1deg)}to{opacity:1;transform:translateY(0)scale(1)rotate(0)}}@keyframes dCfysG_reloadTileClear{0%{opacity:1;filter:brightness(1.15);scale:1}45%{opacity:1;scale:1.18 .86}to{opacity:0;rotate:-13deg;scale:.35}}@keyframes dCfysG_reloadLevel{0%{color:#fff;scale:1.15}to{scale:1}}@keyframes dCfysG_reloadOrbit{to{rotate:360deg}}@media (width<=520px){.dCfysG_overlay{border-radius:2px 24px 2px 2px;width:calc(100vw - 12px);height:calc(100dvh - 12px)}.dCfysG_content{padding:17px 12px 14px}.dCfysG_header{padding:14px 12px 11px}.dCfysG_brand h1 strong{font-size:27px}.dCfysG_brand h1 span{font-size:11px}.dCfysG_brand p{font-size:7px}.dCfysG_logoCore{width:20px;height:20px}.dCfysG_tabs{gap:2px;padding:9px 9px 7px}.dCfysG_tabs button{padding:7px}.dCfysG_tabs button>small{font-size:9px}.dCfysG_towerHeading h2{font-size:29px}.dCfysG_towerHeading>strong{font-size:65px}.dCfysG_towerBossCard{width:155px;right:12px}.dCfysG_towerBossCard .dCfysG_sprite_large{width:128px;height:128px}.dCfysG_towerMonument{width:216px;left:-21px}.dCfysG_pageHeading{align-items:flex-start}.dCfysG_pageHeading h2{font-size:26px}.dCfysG_squadActions{max-width:180px}.dCfysG_squadActions button{padding:6px 8px;font-size:10px}.dCfysG_creatureCards{gap:7px}.dCfysG_codekinCard,.dCfysG_codekinCard .dCfysG_creatureSelect{min-height:179px}.dCfysG_codekinCard .dCfysG_sprite_medium{width:82px;height:82px}.dCfysG_codekinCard strong{font-size:12px}.dCfysG_codekinCard .dCfysG_creatureSelect>small{font-size:8px}.dCfysG_codekinBasics{font-size:9px}.dCfysG_codekinDetailModal{padding:12px}.dCfysG_codekinDetailHero{grid-template-columns:107px minmax(0,1fr);gap:7px;min-height:137px}.dCfysG_codekinDetailHero .dCfysG_sprite_large{width:107px;height:107px}.dCfysG_codekinDetailHero h2{font-size:23px}.dCfysG_codekinDetailTags span{font-size:9px}.dCfysG_codekinDetailStats b{font-size:15px}.dCfysG_codekinProtocols p{font-size:10px}.dCfysG_codekinGrowthActions button strong{font-size:9px}.dCfysG_modalBackdrop{padding:10px}.dCfysG_matchBoard{gap:3px}.dCfysG_matchTile>span{font-size:16px}.dCfysG_battlePanel{padding:7px 5px 10px}.dCfysG_battleHeader>div span{font-size:9px}}@media (width<=360px){.dCfysG_brand h1 strong{font-size:24px}.dCfysG_brand h1 span,.dCfysG_tabs button>span i{display:none}.dCfysG_creatureCards,.dCfysG_dexGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.dCfysG_towerBossCard{width:136px}.dCfysG_towerBossCard .dCfysG_sprite_large{width:110px;height:110px}.dCfysG_towerBrief>button{min-width:95px;font-size:12px}}.dCfysG_overlay[data-motion=reduce],.dCfysG_overlay[data-motion=reduce] *,.dCfysG_overlay[data-motion=reduce] :before,.dCfysG_overlay[data-motion=reduce] :after,.dCfysG_launcher[data-motion=reduce],.dCfysG_launcher[data-motion=reduce] *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important}.dCfysG_overlay[data-motion=reduce] .dCfysG_codekinCard{transform:none!important}.dCfysG_overlay[data-motion=reduce] .dCfysG_particleLayer{display:none}.dCfysG_matchBoard{--board-gap:5px;gap:var(--board-gap)}.dCfysG_matchTile{transition:transform .28s cubic-bezier(.22,1,.36,1),filter .25s,border-color .25s,box-shadow .25s}.dCfysG_matchTile:disabled:hover{transform:translate3d(var(--drag-x),var(--drag-y),0)}.dCfysG_tileSwapping{z-index:10;will-change:transform;animation:dCfysG_exchangeOut var(--swap-duration) cubic-bezier(.45,0,.2,1) forwards!important}.dCfysG_tileReturning{z-index:10;will-change:transform;animation:dCfysG_exchangeBack var(--return-duration) cubic-bezier(.2,.8,.25,1) both!important}@keyframes dCfysG_exchangeOut{0%{transform:translate(0)}to{transform:translate(var(--swap-x),var(--swap-y))}}@keyframes dCfysG_exchangeBack{0%{transform:translate(var(--swap-x),var(--swap-y))}to{transform:translate(0)}}.dCfysG_matchTileClearing{animation:dCfysG_reloadTileClear var(--clear-duration) cubic-bezier(.3,0,.8,.3) forwards!important}@keyframes dCfysG_tileFall{0%{transform:translateY(var(--fall-y)) scale(.97,1.03);opacity:.8;animation-timing-function:cubic-bezier(.42,0,.9,.65)}78%{opacity:1;animation-timing-function:ease-out;transform:translateY(0)scale(1.06,.94)}89%{transform:translateY(-5%)scale(.99,1.01)}to{opacity:1;transform:translateY(0)scale(1)}}.dCfysG_protocolBanner{z-index:24;color:#fff;pointer-events:none;background:linear-gradient(112deg,#126fe9 0 27%,#052964f7 27% 90%,#55dbff 90%);border-block:2px solid #a6f4ff;align-items:center;gap:10px;min-height:94px;padding:7px 18px;animation:1s both dCfysG_protocolReveal;display:flex;position:absolute;top:27%;left:-4px;right:-4px;box-shadow:0 10px 28px #0008}.dCfysG_protocolBanner>img{object-fit:contain;filter:drop-shadow(0 5px 5px #001939);width:92px;height:92px;margin:-13px 0}.dCfysG_protocolBanner>div{gap:4px;display:grid}.dCfysG_protocolBanner small{color:#9defff;letter-spacing:2px;font-size:9px}.dCfysG_protocolBanner strong{font-size:24px;font-style:italic;line-height:1.1}.dCfysG_protocolBanner span{opacity:.8;font-size:11px}@keyframes dCfysG_protocolReveal{0%{opacity:0;transform:translate(-22px)}16%,82%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(18px)}}.dCfysG_overlay[data-motion=reduce] .dCfysG_protocolBanner{animation:none!important}\n._7wqhea_hanger{z-index:3;color:#d6f8ff;cursor:pointer;background:#041b56;border:1px solid #b2eeff9e;place-items:center;width:31px;height:31px;padding:5px;display:grid;position:absolute;top:11px;right:50px}._7wqhea_hanger svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:21px;height:21px}._7wqhea_hanger[aria-expanded=true],._7wqhea_hanger:hover:not(:disabled){color:#062759;background:#5ce3ff}._7wqhea_hanger:focus-visible,._7wqhea_picker button:focus-visible{outline-offset:3px;outline:2px solid #fff}._7wqhea_hanger:disabled{opacity:.5;cursor:wait}._7wqhea_hero{grid-template-columns:168px minmax(0,1fr);min-height:212px;padding-top:24px}._7wqhea_portrait{isolation:isolate;place-items:center;width:164px;height:186px;display:grid;position:relative}._7wqhea_portrait img{object-fit:contain;image-rendering:auto;user-select:none;pointer-events:none;filter:drop-shadow(4px 7px 4px #01265a4d);width:100%;height:100%;position:absolute;inset:0}._7wqhea_current{z-index:1}._7wqhea_departing{z-index:2}._7wqhea_placeholder{color:#98e2ff;font-size:80px}._7wqhea_portrait[data-appearance-transition=change] ._7wqhea_current{animation:_7wqhea_appearanceIn var(--appearance-change) ease both}._7wqhea_portrait[data-appearance-transition=change] ._7wqhea_departing{animation:_7wqhea_appearanceOut var(--appearance-change) ease both}._7wqhea_portrait[data-appearance-transition=evolution] ._7wqhea_current{animation:_7wqhea_evolutionIn var(--appearance-evolution) cubic-bezier(.2,.7,.2,1) both}._7wqhea_portrait[data-appearance-transition=evolution] ._7wqhea_departing{animation:_7wqhea_evolutionOut var(--appearance-evolution) ease both}._7wqhea_evolutionGlow{z-index:3;pointer-events:none;mix-blend-mode:screen;animation:_7wqhea_evolutionGlow var(--appearance-evolution) ease both;background:radial-gradient(#fff 0 15%,#aeffffb3 32%,#55cfff55 52%,#0000 70%);border-radius:50%;position:absolute;inset:6%}._7wqhea_evolutionLabel{z-index:4;text-align:center;color:#03275b;animation:_7wqhea_evolutionLabel var(--appearance-evolution) ease both;background:#a7f6ff;padding:4px;font:800 10px/1.4 system-ui,sans-serif;position:absolute;bottom:0;left:-3px;right:-3px}._7wqhea_picker{color:#ecfbff;background:#032664;border:1px solid #91e4ff;margin:10px 0;padding:12px}._7wqhea_picker header{justify-content:space-between;align-items:start;gap:8px;margin-bottom:10px;display:flex}._7wqhea_picker header strong{font-size:14px;display:block}._7wqhea_picker header small{color:#add8f0;margin-top:5px;font-size:10px;line-height:1.5;display:block}._7wqhea_picker header>button{color:#d8f8ff;cursor:pointer;background:#092e69;border:1px solid #82c4eb;flex-shrink:0;width:28px;height:28px}._7wqhea_options{grid-template-columns:1fr 1fr;gap:10px;display:grid}._7wqhea_options>button{color:#d3f3ff;cursor:pointer;background:#073b7c;border:1px solid #6194c7;justify-items:center;gap:5px;min-width:0;padding:8px;display:grid}._7wqhea_options>button[aria-pressed=true]{background:#1258a0;border-color:#a9ffff;box-shadow:inset 0 0 0 1px #a9ffff}._7wqhea_options>button:disabled{cursor:default}._7wqhea_options>button:disabled:not([aria-pressed=true]){opacity:.6}._7wqhea_options img{object-fit:contain;image-rendering:auto;width:126px;max-width:100%;height:148px}._7wqhea_options strong{font-size:12px}._7wqhea_options small{color:#a1ebff;min-height:15px;font-size:10px}@keyframes _7wqhea_appearanceIn{0%{opacity:0}to{opacity:1}}@keyframes _7wqhea_appearanceOut{0%{opacity:1}to{opacity:0}}@keyframes _7wqhea_evolutionIn{0%,42%{opacity:0;filter:brightness(2);transform:scale(.92)}75%{opacity:1;filter:brightness(1.3)}to{opacity:1;filter:brightness();transform:scale(1)}}@keyframes _7wqhea_evolutionOut{0%,25%{opacity:1;filter:brightness()}48%{opacity:1;filter:brightness(4)}62%,to{opacity:0}}@keyframes _7wqhea_evolutionGlow{0%,15%,to{opacity:0;transform:scale(.45)}45%,55%{opacity:1;transform:scale(1.15)}85%{opacity:0;transform:scale(1.4)}}@keyframes _7wqhea_evolutionLabel{0%,35%{opacity:0;transform:translateY(5px)}55%,90%{opacity:1;transform:none}to{opacity:0}}@media (width<=420px){._7wqhea_hero{grid-template-columns:133px minmax(0,1fr);min-height:190px;padding-top:28px}._7wqhea_portrait{width:130px;height:164px}._7wqhea_options img{width:106px;height:130px}}";
			if (existing === void 0) document.head.appendChild(tag);
			return () => {
				if (tag.dataset.pluginCss === "@nath-vikky/dsh-codekin/tracewild.module.css") tag.remove();
			};
		}
		function apply(ctx) {
			ctx.effect(installStyles, "tracewild: styles");
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "tracewild: dictionaries");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-codekin",
				order: 80,
				locale: NS
			}, TraceWildOverlay));
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-codekin",
				order: 150,
				label: () => ctx.locale.bind(NS)("settingsTitle"),
				locale: NS
			}, TraceWildSettings));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map