//#region lib/types/content-packs/core/src/catalog.js
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
		hp: 1200,
		attack: 165,
		defense: 105,
		speed: 100
	}),
	uncommon: Object.freeze({
		hp: 1290,
		attack: 178,
		defense: 114,
		speed: 106
	}),
	rare: Object.freeze({
		hp: 1380,
		attack: 192,
		defense: 124,
		speed: 112
	}),
	apex: Object.freeze({
		hp: 1490,
		attack: 208,
		defense: 136,
		speed: 120
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
			hp: base.hp + ecologyOffset * 30,
			attack: base.attack + number % 3 * 8,
			defense: base.defense + number % 2 * 7,
			speed: base.speed + (number + 1) % 3 * 5
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
//#region lib/types/content-packs/core/src/skills.js
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
export { CORE_CAPTURE_MULTIPLIERS as a, STARTER_CREATURE_IDS as c, creaturesInEcology as d, CAPTURE_CORE_QUALITIES as i, TRACE_ECOLOGIES as l, QUALITY_SKILL_MULTIPLIERS as n, CORE_DROP_WEIGHTS as o, skillByCreatureId as r, CREATURE_CATALOG as s, CREATURE_SKILLS as t, creatureById as u };

//# sourceMappingURL=skills-xhKkac7-.js.map