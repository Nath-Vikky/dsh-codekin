import { a as CORE_CAPTURE_MULTIPLIERS, c as STARTER_CREATURE_IDS, d as creaturesInEcology, i as CAPTURE_CORE_QUALITIES, l as TRACE_ECOLOGIES, n as QUALITY_SKILL_MULTIPLIERS, o as CORE_DROP_WEIGHTS, r as skillByCreatureId, s as CREATURE_CATALOG, t as CREATURE_SKILLS, u as creatureById } from "./skills-xhKkac7-.js";
import { s as defineContentPack } from "./src-CtkEB06v.js";
//#region lib/types/content-packs/core/src/index.js
const ECOLOGY_NAMES = {
	lumen: {
		zhCN: "智算",
		en: "Compute"
	},
	forge: {
		zhCN: "编译",
		en: "Compile"
	},
	relay: {
		zhCN: "网络",
		en: "Network"
	},
	aegis: {
		zhCN: "防护",
		en: "Guard"
	},
	glitch: {
		zhCN: "异常",
		en: "Glitch"
	}
};
const ECOLOGY_ROLES = {
	lumen: "sync",
	forge: "overclock",
	relay: "guard",
	aegis: "repair",
	glitch: "breach"
};
const QUALITY_NAMES = {
	pebble: {
		zhCN: "砾石",
		en: "Pebble"
	},
	pulse: {
		zhCN: "脉冲",
		en: "Pulse"
	},
	prism: {
		zhCN: "棱镜",
		en: "Prism"
	},
	nova: {
		zhCN: "新星",
		en: "Nova"
	},
	origin: {
		zhCN: "源初",
		en: "Origin"
	}
};
const CORE_CONTENT_PACK = defineContentPack({
	manifest: {
		id: "@nath-vikky/codekin-core",
		version: "0.3.2",
		engine: ">=0.3.2 <0.4.0",
		contentApi: 1
	},
	ecologies: TRACE_ECOLOGIES.map((id, order) => ({
		id,
		order,
		name: ECOLOGY_NAMES[id],
		tileRole: ECOLOGY_ROLES[id]
	})),
	qualities: CAPTURE_CORE_QUALITIES.map((id, order) => ({
		id,
		order,
		name: QUALITY_NAMES[id]
	})),
	creatures: CREATURE_CATALOG.map((creature) => ({
		number: creature.number,
		id: creature.id,
		name: {
			zhCN: creature.nameZh,
			en: creature.nameEn
		},
		ecology: creature.ecology,
		rarity: creature.rarity,
		combatRole: creature.combatRole,
		baseCaptureRate: creature.baseCaptureRate,
		signatureProtocol: creature.signatureProtocol,
		sprite: `creature:${creature.id}:sprite`,
		stats: creature.stats
	})),
	skills: CREATURE_SKILLS.map((skill) => ({
		creatureId: skill.creatureId,
		energyCost: skill.energyCost,
		passive: {
			name: {
				zhCN: skill.passiveNameZh,
				en: skill.passiveNameEn
			},
			description: {
				zhCN: skill.passiveDescriptionZh,
				en: skill.passiveDescriptionEn
			}
		},
		active: {
			name: {
				zhCN: skill.activeNameZh,
				en: skill.activeNameEn
			},
			description: {
				zhCN: skill.activeDescriptionZh,
				en: skill.activeDescriptionEn
			}
		}
	})),
	starters: [...STARTER_CREATURE_IDS],
	tower: { rotation: CREATURE_CATALOG.map((creature) => creature.id) },
	assets: [{
		key: "launcher:default",
		path: "sprites/codekin-launcher-v1.webp",
		mime: "image/webp",
		kind: "launcher"
	}, ...CREATURE_CATALOG.map((creature) => ({
		key: `creature:${creature.id}:sprite`,
		path: `sprites/${creature.id}.webp`,
		mime: "image/webp",
		kind: "creature"
	}))]
});
//#endregion
export { CAPTURE_CORE_QUALITIES, CORE_CAPTURE_MULTIPLIERS, CORE_CONTENT_PACK, CORE_DROP_WEIGHTS, CREATURE_CATALOG, CREATURE_SKILLS, QUALITY_SKILL_MULTIPLIERS, STARTER_CREATURE_IDS, TRACE_ECOLOGIES, creatureById, creaturesInEcology, skillByCreatureId };

//# sourceMappingURL=content-core.js.map