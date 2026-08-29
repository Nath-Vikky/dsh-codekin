window.__ModuleLoader__.load({
	id: "@nath-vikky/dsh-codekin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
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
		Object.freeze({
			pebble: 55,
			pulse: 25,
			prism: 12,
			nova: 6,
			origin: 2
		});
		Object.freeze({
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
		const STARTER_CREATURE_IDS = Object.freeze([
			"lumen-indeximp",
			"forge-sparkmite",
			"aegis-veribud"
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
			pulse: 1.15,
			prism: 1.35,
			nova: 1.6,
			origin: 1.95
		});
		Object.freeze({
			pebble: 1,
			pulse: 1.07,
			prism: 1.16,
			nova: 1.28,
			origin: 1.42
		});
		Object.freeze({
			pebble: 1,
			pulse: 1.04,
			prism: 1.09,
			nova: 1.15,
			origin: 1.22
		});
		Object.freeze({
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
			return Math.floor(index / 7);
		}
		function columnOf(index) {
			return index % 7;
		}
		function areAdjacentTiles(first, second) {
			if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || second < 0 || first >= 49 || second >= 49) return false;
			return Math.abs(rowOf(first) - rowOf(second)) + Math.abs(columnOf(first) - columnOf(second)) === 1;
		}
		Object.freeze({
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
				"四连智算会修复运行值最低的队员。",
				"A 4+ Compute match repairs the lowest-runtime ally.",
				"页幕",
				"Page Veil",
				"修复全队并为行动码灵提供防护层。",
				"Repairs the squad and guards the active Codekin."
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
				"每阶段首次防护消除修复行动码灵。",
				"The first Guard match each stage repairs the active Codekin.",
				"完整校验",
				"Full Verify",
				"净化并修复全队。",
				"Cleanses and repairs the squad."
			],
			[
				"aegis-loop-tortoise",
				"环路甲壳",
				"Loop Shell",
				"进入行动位时获得防护层。",
				"Gains a guard layer when entering the active slot.",
				"环路守护",
				"Loop Guard",
				"为全队提供防护层。",
				"Guards the entire squad."
			],
			[
				"aegis-anchorbee",
				"特殊锚点",
				"Special Anchor",
				"触发特殊色块时获得防护层。",
				"Triggering a special tile grants a guard layer.",
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
				"每场战斗首次致命伤会被保全。",
				"Prevents the first lethal hit each battle.",
				"曙光重启",
				"Dawn Restart",
				"治疗并保护全队。",
				"Heals and shields the squad."
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
				"首次有队员运行值过半时延迟敌方。",
				"Delays the enemy the first time an ally drops below half runtime.",
				"延迟回击",
				"Delayed Payback",
				"造成伤害并延迟敌方。",
				"Deals damage and delays the enemy."
			],
			[
				"glitch-crashfox",
				"红线爆发",
				"Redline Burst",
				"低运行值时显著提高伤害。",
				"Deals substantially more damage at low runtime.",
				"崩溃闪焰",
				"Crash Flare",
				"造成高额伤害并损失少量当前运行值。",
				"Deals heavy damage at a small current-runtime cost."
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
		//#endregion
		//#region lib/types/client/bridge.js
		const API = "/api/tracewild";
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
		function plainRecord(value) {
			if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError("invalid animation");
			return value;
		}
		function matchTile(value) {
			const row = plainRecord(value);
			const keys = Object.keys(row);
			if (keys.length !== 2 && keys.length !== 3 || !("ecology" in row) || !("special" in row) || keys.some((key) => key !== "ecology" && key !== "special" && key !== "lockedActions") || !TRACE_ECOLOGIES.includes(row.ecology) || !TILE_SPECIALS.includes(row.special)) throw new TypeError("invalid animation");
			if (row.lockedActions !== void 0 && (!Number.isSafeInteger(row.lockedActions) || row.lockedActions < 1 || row.lockedActions > 2)) throw new TypeError("invalid animation");
			return {
				ecology: row.ecology,
				special: row.special,
				...row.lockedActions === void 0 ? {} : { lockedActions: row.lockedActions }
			};
		}
		function matchBoard(value) {
			if (!Array.isArray(value) || value.length !== 49) throw new TypeError("invalid animation");
			return value.map(matchTile);
		}
		function battleAnimation(value) {
			const row = plainRecord(value);
			if (row.kind !== "match" || typeof row.battleId !== "string" || row.battleId.length < 3 || row.battleId.length > 96 || !Array.isArray(row.frames) || row.frames.length < 1 || row.frames.length > 12) throw new TypeError("invalid animation");
			const frames = row.frames.map((value, frameIndex) => {
				const frame = plainRecord(value);
				if (frame.chain !== frameIndex + 1 || !Array.isArray(frame.removed) || frame.removed.length < 1 || frame.removed.length > 49 || !Array.isArray(frame.fallRows) || frame.fallRows.length !== 49) throw new TypeError("invalid animation");
				const removed = frame.removed.map((index) => {
					if (!Number.isSafeInteger(index) || index < 0 || index >= 49) throw new TypeError("invalid animation");
					return index;
				});
				if (new Set(removed).size !== removed.length) throw new TypeError("invalid animation");
				const fallRows = frame.fallRows.map((distance) => {
					if (!Number.isSafeInteger(distance) || distance < 0 || distance > 7) throw new TypeError("invalid animation");
					return distance;
				});
				return {
					chain: frame.chain,
					before: matchBoard(frame.before),
					after: matchBoard(frame.after),
					removed,
					fallRows
				};
			});
			return {
				kind: "match",
				battleId: row.battleId,
				frames
			};
		}
		function snapshot(value) {
			if (typeof value !== "object" || value === null) throw new TypeError("invalid snapshot");
			const row = value;
			if (row.schemaVersion !== 3 || typeof row.serverTime !== "number" || typeof row.state !== "object" || row.state === null || row.state.schemaVersion !== 3 || typeof row.state.enabled !== "boolean" || !Array.isArray(row.state.creatures) || !Array.isArray(row.state.encounters) || !Array.isArray(row.state.dex) || !Array.isArray(row.state.squad)) throw new TypeError("invalid snapshot");
			return structuredClone(row);
		}
		function createTraceWildConnection() {
			return {
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
		//#region \0tracewild-css:src/client/components/tracewild.module.css.mjs
		const css = "*{box-sizing:border-box}.BPn80q_launcher{pointer-events:auto;z-index:90;color:#fff;cursor:pointer;background:#182128;border:1px solid #b7d8cf40;border-radius:20px;place-items:center;width:58px;height:58px;transition:transform .18s cubic-bezier(.22,1,.36,1),background .18s,border-color .18s;display:grid;position:fixed;bottom:22px;right:22px;box-shadow:0 14px 38px #02060b8f,inset 0 1px #ffffff12}.BPn80q_launcher:hover{background:#202c34;border-color:#b7d8cf70;transform:translateY(-2px)scale(1.025)}.BPn80q_launcherOpen{background:#231e24;border-color:#d2a8bd66;border-radius:14px;width:44px;height:44px;top:max(14px,50vh - 433px);bottom:auto;right:max(14px,50vw - 219px)}.BPn80q_launcherOpen .BPn80q_launcherCore{filter:saturate(.72)hue-rotate(125deg);transform:rotate(135deg)scale(.82)}.BPn80q_launcherPulse{animation:.55s steps(2,end) 3 BPn80q_launcherPulse}@keyframes BPn80q_launcherPulse{50%{transform:scale(1.15);box-shadow:0 0 0 10px #65ffd533,0 12px 34px #000c}}.BPn80q_launcherCore,.BPn80q_logoCore,.BPn80q_bigCore,.BPn80q_captureRow i{background:linear-gradient(135deg,#75c9b0 0 42%,#243b46 43% 57%,#a6ded0 58%);border:3px solid #dafcf3;border-radius:8px;width:27px;height:27px;display:inline-block;transform:rotate(45deg);box-shadow:inset 0 0 0 3px #16252d,0 4px 10px #0006}.BPn80q_badge{background:#cc6d91;border:2px solid #11181e;border-radius:12px;place-items:center;min-width:22px;height:22px;padding:0 6px;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;display:grid;position:absolute;top:-7px;right:-7px}.BPn80q_idleClaimButton{color:#f3dda0;cursor:pointer;background:#29271f;border:1px solid #e8d59859;border-radius:9px;flex:none;place-items:center;width:29px;height:29px;transition:transform .16s cubic-bezier(.22,1,.36,1),background .16s;display:grid;position:relative;box-shadow:inset 0 1px #fff1bd18,0 4px 12px #0005}.BPn80q_idleClaimButton:hover{background:#343024;transform:translateY(-1px)}.BPn80q_idleClaimButton:disabled{cursor:wait;opacity:.55}.BPn80q_idleClaimFloating{z-index:91;border-radius:15px;width:46px;height:46px;animation:1.6s ease-in-out infinite alternate BPn80q_idleFloat;position:fixed;bottom:91px;right:28px}.BPn80q_rewardCrate{background:linear-gradient(135deg,#6f5d31,#423720);border:2px solid;border-radius:3px 3px 5px 5px;width:19px;height:15px;position:relative;box-shadow:inset 0 0 0 2px #151b1d88}.BPn80q_rewardCrate:before{content:\"\";background:#554727;border:2px solid;border-radius:4px 4px 2px 2px;height:6px;position:absolute;top:-6px;left:-4px;right:-4px}.BPn80q_rewardCrate:after{content:\"\";background:currentColor;border-radius:2px;width:3px;height:20px;position:absolute;top:-7px;left:6px;box-shadow:0 8px 0 1px #151b1d}.BPn80q_idleClaimPulse{background:#fff2a9;border-radius:50%;width:6px;height:6px;animation:.8s ease-in-out infinite alternate BPn80q_rewardPulse;position:absolute;top:2px;right:2px;box-shadow:0 0 8px #ffe169}.BPn80q_idleClaimTooltip{pointer-events:none;z-index:120;color:#e9f1ed;opacity:0;visibility:hidden;text-align:left;background:#171b1deb;border:1px solid #ecd99535;border-radius:12px;width:225px;padding:8px;transition:opacity .14s,transform .14s,visibility .14s;position:absolute;top:calc(100% + 7px);right:0;transform:translateY(-4px);box-shadow:0 12px 35px #000b}.BPn80q_idleClaimTooltip>strong,.BPn80q_idleClaimTooltip>small{display:block}.BPn80q_idleClaimTooltip>strong{color:#f2dfa6;font-size:10px}.BPn80q_idleClaimTooltip>small{color:#8d9c97;margin-top:3px;font-size:8px}.BPn80q_idleClaimTooltip>span{gap:5px;margin-top:7px;display:flex}.BPn80q_idleClaimButton:hover .BPn80q_idleClaimTooltip,.BPn80q_idleClaimButton:focus-visible .BPn80q_idleClaimTooltip{opacity:1;visibility:visible;transform:translateY(0)}.BPn80q_idleClaimFloating .BPn80q_idleClaimTooltip{top:0;right:calc(100% + 9px)}@keyframes BPn80q_idleFloat{to{transform:translateY(-3px)}}@keyframes BPn80q_rewardPulse{to{opacity:.38;transform:scale(.78)}}.BPn80q_overlay{--surface:#171f26;--surface-raised:#1b252d;--line:#d9eee817;--text:#edf6f3;--muted:#8fa39e;--accent:#7fcdb7;pointer-events:auto;z-index:65;color:var(--text);background:#10171d;border:1px solid #c7e5dc30;border-radius:26px;grid-template-rows:58px 44px minmax(0,1fr) 27px;width:min(454px,100vw - 24px);height:min(880px,100vh - 24px);font-family:Inter,ui-sans-serif,system-ui,sans-serif;animation:.3s cubic-bezier(.34,1.56,.64,1) BPn80q_shellEnter;display:grid;position:fixed;top:50%;left:50%;overflow:hidden;transform:translate(-50%,-50%);box-shadow:0 28px 90px #000b,0 0 0 1px #ffffff08}.BPn80q_overlay:after{content:\"\";pointer-events:none;z-index:12;border:1px solid #ffffff08;border-radius:21px;position:absolute;inset:4px}.BPn80q_overlay:before{display:none}.BPn80q_header{z-index:30;border-bottom:1px solid var(--line);backdrop-filter:blur(14px);background:#141c22eb;justify-content:space-between;align-items:center;padding:7px 58px 7px 13px;display:flex;position:relative}.BPn80q_brand{align-items:center;gap:9px;min-width:0;display:flex}.BPn80q_brand h1{letter-spacing:.015em;color:#edf7f4;white-space:nowrap;margin:0;font:760 16px/1.1 ui-sans-serif,system-ui,sans-serif}.BPn80q_brand p{display:none}.BPn80q_headerStats{align-items:center;gap:4px;min-width:0;display:flex}.BPn80q_miniCore{background:#19232a;border:1px solid;border-radius:7px;justify-content:center;align-items:center;min-width:25px;height:22px;padding:0 4px;font:750 9px/1 ui-sans-serif,system-ui,sans-serif;display:inline-flex;position:relative}.BPn80q_miniCore:before{display:none}.BPn80q_online,.BPn80q_offline{letter-spacing:.08em;border-radius:7px;padding:6px 5px;font:750 7px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_online{color:#6dffd1;background:#1f664722;border:1px solid #6dffd155}.BPn80q_offline{color:#ff7696;background:#6b173333;border:1px solid #ff769655}.BPn80q_close,.BPn80q_pageHeading button{border:1px solid var(--line);color:#dce9e5;cursor:pointer;background:#1a242b;border-radius:9px;padding:6px 9px;font-size:9px;transition:background .16s,border-color .16s}.BPn80q_header .BPn80q_close{display:none}.BPn80q_close:hover,.BPn80q_pageHeading button:hover{background:#222e35;border-color:#a8c8bf4d}.BPn80q_tabs{z-index:2;border-bottom:1px solid var(--line);background:#12191f;justify-content:center;align-items:center;gap:3px;padding:5px 7px;display:flex;position:relative}.BPn80q_tabs button{color:#879a96;cursor:pointer;background:0 0;border:0;border-radius:10px;flex:1;min-width:0;height:32px;font:700 10px/1 ui-sans-serif,system-ui,sans-serif;transition:color .15s,background .15s,transform .15s cubic-bezier(.22,1,.36,1)}.BPn80q_content{z-index:1;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#8eb2a840 transparent;min-height:0;padding:9px;position:relative;overflow:auto}.BPn80q_content::-webkit-scrollbar-track{background:0 0}.BPn80q_content::-webkit-scrollbar-thumb{background:#8eb2a840;border-radius:999px}.BPn80q_footer{z-index:2;border-top:1px solid var(--line);color:#758783;text-align:center;background:#11181e;justify-content:center;align-items:center;padding:0 10px;font-size:7px;display:flex;position:relative}.BPn80q_centerMessage{color:#a6c5d3;grid-row:2/5;place-items:center;display:grid}@keyframes BPn80q_shellEnter{0%{opacity:0;transform:translate(-50%,-47%)scale(.96)}to{opacity:1;transform:translate(-50%,-50%)scale(1)}}.BPn80q_mapFrame{grid-template-rows:minmax(390px,1fr) auto auto;gap:8px;height:100%;min-height:500px;display:grid}.BPn80q_worldMap{border:1px solid var(--line);background:radial-gradient(at 18% 25%,#4b7f8460 0 12%,#0000 31%),radial-gradient(at 80% 25%,#8a654852 0 13%,#0000 31%),radial-gradient(at 50% 12%,#6f618f4a 0 13%,#0000 30%),radial-gradient(at 25% 77%,#52765d52 0 16%,#0000 34%),radial-gradient(at 77% 77%,#81566852 0 14%,#0000 33%),#151e25;border-radius:20px;min-height:460px;position:relative;overflow:hidden;box-shadow:inset 0 1px #ffffff08}.BPn80q_worldMap:before{content:\"\";opacity:.09;background-image:linear-gradient(30deg,#d7fff40a 12%,#0000 12.5% 87%,#d7fff40a 87.5%),linear-gradient(150deg,#d7fff40a 12%,#0000 12.5% 87%,#d7fff40a 87.5%);background-size:38px 66px;position:absolute;inset:0}.BPn80q_regionLabel{z-index:1;letter-spacing:.05em;text-transform:uppercase;background:#11191fc7;border:1px solid;border-radius:8px;padding:5px 9px;font:700 9px/1 ui-sans-serif,system-ui,sans-serif;position:absolute}.BPn80q_region_lumen{color:#64e9ff;top:8%;left:8%}.BPn80q_region_forge{color:#ff9b51;top:8%;right:8%}.BPn80q_region_relay{color:#b792ff;top:4%;left:45%}.BPn80q_region_aegis{color:#77e890;bottom:8%;left:8%}.BPn80q_region_glitch{color:#ff5ca3;bottom:8%;right:8%}.BPn80q_encounter{z-index:3;color:#e5f2ee;cursor:pointer;background:#172129eb;border:1px solid #d5e9e322;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;width:72px;min-height:70px;padding:2px;transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .18s,border-color .18s;display:flex;position:absolute;transform:translate(-50%,-50%);box-shadow:0 8px 22px #0005,inset 0 1px #ffffff0d}.BPn80q_encounter .BPn80q_sprite_small{width:47px;height:47px}.BPn80q_encounter:hover{z-index:5;background:#202c34;border-color:#d5e9e34a;transform:translate(-50%,-53%)scale(1.045)}.BPn80q_encounter>span:nth-of-type(2){text-overflow:ellipsis;white-space:nowrap;width:100%;font-size:10px;font-weight:700;overflow:hidden}.BPn80q_encounter b{color:#ff79b2;margin-top:2px;font-size:8px}.BPn80q_encounterEnhanced{border-color:#ff4c9f;animation:1.4s steps(2,end) infinite BPn80q_glitchBlink}@keyframes BPn80q_glitchBlink{50%{box-shadow:0 0 16px #ff3b9199}}.BPn80q_mapEmpty{color:#789aaa;text-align:center;place-items:center;padding:30px;display:grid;position:absolute;inset:0}.BPn80q_mapLegend{flex-wrap:wrap;justify-content:center;gap:8px;display:flex}.BPn80q_mapLegend span{border:1px solid var(--line);color:#9eafab;background:#172027;border-radius:999px;padding:5px 10px;font-size:10px}.BPn80q_mapLegend span[data-ecology=lumen]{border-color:#64e9ff88}.BPn80q_mapLegend span[data-ecology=forge]{border-color:#ff9b5188}.BPn80q_mapLegend span[data-ecology=relay]{border-color:#b792ff88}.BPn80q_mapLegend span[data-ecology=aegis]{border-color:#77e89088}.BPn80q_mapLegend span[data-ecology=glitch]{border-color:#ff5ca388}.BPn80q_towerDock{background:linear-gradient(135deg,#232536,#192329 60%,#1d2630);border:1px solid #afa1e12f;border-radius:17px;grid-template-columns:47px 54px minmax(0,1fr) 46px auto;align-items:center;gap:8px;min-height:78px;padding:8px 10px;display:grid;position:relative;overflow:hidden;box-shadow:inset 0 1px #ffffff0b}.BPn80q_towerDock:before{content:\"\";pointer-events:none;opacity:.23;background:radial-gradient(circle at 12% 0,#a9a1ff55,#0000 29%),linear-gradient(115deg,#0000 55%,#70c8b00c);position:absolute;inset:0}.BPn80q_towerGlyph{filter:drop-shadow(0 5px 6px #0007);flex-direction:column-reverse;align-items:center;width:42px;height:52px;display:flex;position:relative}.BPn80q_towerGlyph i{background:linear-gradient(90deg,#393b52,#55526e 48%,#303749);border:1px solid #aa9fd36b;border-radius:3px 3px 1px 1px;width:33px;height:10px;display:block;box-shadow:inset 0 1px #ffffff1c}.BPn80q_towerGlyph i:nth-child(2){width:27px}.BPn80q_towerGlyph i:nth-child(3){width:21px}.BPn80q_towerGlyph b{background:#6d6451;border:1px solid #c6bb8159;border-radius:7px 7px 1px 1px;width:14px;height:9px;box-shadow:0 0 9px #e6d07c32}.BPn80q_towerBossPreview{place-items:center;min-width:0;display:grid;position:relative}.BPn80q_towerBossPreview .BPn80q_sprite_small{filter:drop-shadow(0 5px 5px #0007);width:47px;height:47px}.BPn80q_towerBossPreview span{color:#cdc7e6;background:#191c28e8;border:1px solid #8b84ad4a;border-radius:999px;min-width:max-content;padding:2px 5px;font:800 6px/1 ui-sans-serif,system-ui,sans-serif;position:absolute;bottom:-2px;left:50%;transform:translate(-50%)}.BPn80q_towerSummary{gap:3px;min-width:0;display:grid;position:relative}.BPn80q_towerSummary strong{color:#e5e1f5;font-size:11px}.BPn80q_towerSummary span{color:#abb8bd;text-overflow:ellipsis;white-space:nowrap;font-size:8px;overflow:hidden}.BPn80q_towerSummary small{color:#828f99;font-size:6.5px;line-height:1.35}.BPn80q_towerProgress{justify-items:center;gap:2px;display:grid;position:relative}.BPn80q_towerProgress span{color:#859098;font-size:6px}.BPn80q_towerProgress b{color:#d6d1eb;font:900 18px/1 ui-monospace,monospace}.BPn80q_towerDock>button{color:#e1dff1;cursor:pointer;background:#323247;border:1px solid #a9a1d150;border-radius:999px;padding:8px 10px;font:750 8px/1 ui-sans-serif,system-ui,sans-serif;transition:transform .15s cubic-bezier(.22,1,.36,1),background .15s;position:relative}.BPn80q_towerDock>button:not(:disabled):hover{background:#41405a;transform:translateY(-1px)}.BPn80q_towerDock>button:disabled{opacity:.4;cursor:not-allowed}.BPn80q_sprite{object-fit:contain;image-rendering:pixelated;user-select:none;flex:none;display:inline-block}.BPn80q_sprite_tiny{width:28px;height:28px}.BPn80q_sprite_small{width:58px;height:58px}.BPn80q_sprite_medium{width:104px;height:104px}.BPn80q_sprite_large{width:154px;height:154px}.BPn80q_spriteUnknown{filter:brightness(0)drop-shadow(0 0 3px #5d7188);opacity:.62}.BPn80q_panelPage{width:100%;min-height:100%;margin:0 auto}.BPn80q_pageHeading{justify-content:space-between;align-items:center;gap:20px;margin-bottom:14px;display:flex}.BPn80q_pageHeading h2,.BPn80q_inventoryPanel h2,.BPn80q_logPanel h2{color:#e4f1ed;margin:0 0 5px;font:760 18px/1.2 ui-sans-serif,system-ui,sans-serif}.BPn80q_pageHeading p{color:#7895a5;margin:0;font-size:12px}.BPn80q_creatureCards{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;display:grid}.BPn80q_creatureCard{border:1px solid var(--line);background:var(--surface);color:#e4efec;cursor:pointer;border-radius:15px;flex-direction:column;align-items:center;min-height:172px;padding:8px;transition:transform .18s cubic-bezier(.22,1,.36,1),background .18s,border-color .18s;display:flex;position:relative}.BPn80q_creatureSelected{background:#1b292a;border-color:#8bc7b769}.BPn80q_creatureCard strong{font-size:14px}.BPn80q_creatureCard span{color:#8eabb9;margin-top:4px;font-size:10px}.BPn80q_creatureCard small{color:#b7d2d8;margin-top:7px}.BPn80q_partyIndex{border-radius:6px;place-items:center;width:24px;height:24px;font:900 12px/1 ui-monospace,monospace;display:grid;position:absolute;top:8px;left:8px;color:#06141d!important;background:#58e4c0!important}.BPn80q_dexGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding-bottom:16px;display:grid}.BPn80q_dexCard{border:1px solid var(--line);background:var(--surface);color:#687b77;border-radius:13px;flex-direction:column;justify-content:center;align-items:center;min-height:142px;padding:8px;display:flex;position:relative}.BPn80q_dexSeen{color:#a8bbb6;border-color:#a9c8c02c}.BPn80q_dexCaught{color:#e6f2ee;background:#19262a;border-color:#88c6b54a}.BPn80q_dexNumber{color:#537080;font:700 9px/1 ui-monospace,monospace;position:absolute;top:7px;left:7px}.BPn80q_dexCard small{color:#7395a5;margin-top:3px}.BPn80q_dexCard>span:last-child{margin-top:5px;font-size:8px}.BPn80q_inventoryLayout{grid-template-columns:1fr;gap:9px;width:100%;margin:0 auto;display:grid}.BPn80q_inventoryPanel,.BPn80q_logPanel{border:1px solid var(--line);background:var(--surface);border-radius:15px;padding:11px}.BPn80q_coreGrid{grid-template-columns:repeat(5,1fr);gap:5px;margin:12px 0;display:grid}.BPn80q_coreCard{border:1px solid var(--line);text-align:center;background:#1a242b;border-radius:12px;flex-direction:column;justify-content:center;align-items:center;gap:5px;min-height:94px;display:flex;position:relative}.BPn80q_bigCore{width:38px;height:38px}.BPn80q_coreCard strong{color:#aec9d0;font-size:11px}.BPn80q_coreCard b{font:900 17px/1 ui-monospace,monospace}.BPn80q_materialCard{background:linear-gradient(155deg,#1d272e,#171f25);min-height:98px}.BPn80q_materialShard{clip-path:polygon(50% 0,92% 34%,73% 100%,27% 100%,8% 34%);opacity:.8;filter:drop-shadow(0 3px 5px #0008);background:currentColor;width:23px;height:30px}.BPn80q_materialXp{color:currentColor;opacity:.86;font:750 7px/1 ui-monospace,monospace}.BPn80q_itemInspectable{cursor:help;outline:none}.BPn80q_itemInspectable:focus-visible,.BPn80q_rewardItem:focus-visible{border-color:currentColor;box-shadow:0 0 0 2px #ffffff1b}.BPn80q_itemTooltip{pointer-events:none;z-index:15;color:#e6efec;opacity:0;visibility:hidden;background:#10171df2;border:1px solid #dbece629;border-radius:9px;flex-direction:column;justify-content:center;align-items:center;gap:5px;padding:7px;transition:opacity .14s,visibility .14s;display:flex;position:absolute;inset:5px}.BPn80q_itemTooltip strong{color:currentColor;font-size:9px;line-height:1.2}.BPn80q_itemTooltip small{color:#a5b5b0;text-align:center;font-size:7.5px;line-height:1.35}.BPn80q_itemInspectable:hover .BPn80q_itemTooltip,.BPn80q_itemInspectable:focus .BPn80q_itemTooltip,.BPn80q_rewardItem:hover .BPn80q_itemTooltip,.BPn80q_rewardItem:focus .BPn80q_itemTooltip{opacity:1;visibility:visible}.BPn80q_growthList{gap:5px;margin:8px 0 11px;display:grid}.BPn80q_growthRow{border:1px solid var(--line);background:#182127;border-radius:11px;grid-template-columns:31px minmax(92px,1fr) minmax(0,1.35fr);align-items:center;gap:6px;min-width:0;padding:6px;display:grid}.BPn80q_growthRow>div:nth-child(2){gap:2px;min-width:0;display:grid}.BPn80q_growthRow strong{text-overflow:ellipsis;white-space:nowrap;color:#d9e8e4;font-size:9px;overflow:hidden}.BPn80q_growthRow small{color:#7f9993;font:7px/1.2 ui-monospace,monospace}.BPn80q_growthActions{grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;min-width:0;display:grid}.BPn80q_growthActions button{min-width:0;height:34px;color:inherit;cursor:pointer;background:#202a30;border:1px solid;border-radius:7px;grid-template-rows:8px 8px 7px;place-items:center;padding:3px 1px;font:700 6px/1 ui-monospace,monospace;display:grid}.BPn80q_growthActions button i{clip-path:polygon(50% 0,100% 38%,72% 100%,28% 100%,0 38%);background:currentColor;width:6px;height:8px;margin:0 auto 2px;display:block}.BPn80q_growthActions button span{font-size:6px}.BPn80q_growthActions button small{color:#93a29e;font-size:5.5px}.BPn80q_growthActions button:disabled{opacity:.28;cursor:not-allowed}.BPn80q_growthWorkbench{gap:7px;margin:8px 0 11px;display:grid}.BPn80q_growthSelector{border:1px solid var(--line);background:#182127;border-radius:11px;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:5px 9px;padding:8px;display:grid}.BPn80q_growthSelector>span{color:#d9e8e4;font-size:8px;font-weight:750}.BPn80q_growthSelector select{color:#dce9e5;cursor:pointer;background:#111a20;border:1px solid #ffffff1c;border-radius:8px;outline:0;width:100%;min-width:0;padding:7px 25px 7px 8px;font:700 8px/1.2 ui-sans-serif,system-ui,sans-serif}.BPn80q_growthSelector>small{color:#7f9993;grid-column:1/-1;font-size:6.5px}.BPn80q_growthSelected{border:1px solid var(--line);background:#182127;border-radius:13px;gap:8px;padding:8px;display:grid}.BPn80q_growthSummary{grid-template-columns:58px minmax(0,1fr);align-items:center;gap:9px;min-width:0;display:grid}.BPn80q_growthSummary>div{gap:3px;min-width:0;display:grid}.BPn80q_growthSummary strong{text-overflow:ellipsis;white-space:nowrap;color:#d9e8e4;font-size:11px;overflow:hidden}.BPn80q_growthSummary span,.BPn80q_growthSummary small{color:#7f9993;font-size:7px}.BPn80q_growthXpTrack{background:#0e161b;border-radius:999px;height:5px;overflow:hidden}.BPn80q_growthXpTrack i{border-radius:inherit;background:linear-gradient(90deg,#69b99f,#8bd2b9);height:100%;transition:width .25s;display:block}.BPn80q_idleReward{color:#b9c995;background:#24271d;border:1px solid #a9c07b30;border-radius:9px;margin:7px 0;padding:7px 9px;font-size:8px}.BPn80q_statsGrid{grid-template-columns:repeat(2,1fr);gap:6px;display:grid}.BPn80q_statsGrid span{color:#7996a5;border:1px solid #2c4252;border-radius:8px;flex-direction:column;padding:10px;font-size:10px;display:flex}.BPn80q_statsGrid b{color:#c8fff0;font:900 21px/1.2 ui-monospace,monospace}.BPn80q_logPanel ol{max-height:210px;margin:10px 0 0;padding:0;list-style:none;overflow:auto}.BPn80q_logPanel li{border-bottom:1px solid #213542;grid-template-columns:82px 1fr;gap:9px;padding:9px 0;font-size:11px;display:grid}.BPn80q_logPanel time{color:#567182;font-family:ui-monospace,monospace}.BPn80q_modalBackdrop,.BPn80q_battleBackdrop{z-index:60;backdrop-filter:blur(12px);background:#070b0ed9;place-items:center;padding:8px;display:grid;position:absolute;inset:0}.BPn80q_rewardBackdrop{z-index:100;backdrop-filter:blur(9px);background:#070b0ec2;place-items:center;padding:15px;animation:.18s ease-out BPn80q_rewardBackdropIn;display:grid;position:absolute;inset:0}.BPn80q_rewardModal{text-align:center;background:linear-gradient(160deg,#1b2428,#12191e);border:1px solid #e9d8903b;border-radius:22px;width:min(380px,100%);max-height:82%;padding:24px 16px 15px;animation:.28s cubic-bezier(.22,1.35,.36,1) BPn80q_rewardModalIn;position:relative;overflow:visible;box-shadow:0 28px 80px #000d,inset 0 1px #fff8d512}.BPn80q_rewardModal>p{color:#dbc881;letter-spacing:.18em;text-transform:uppercase;margin:0 0 4px;font:800 8px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_rewardModal>h2{color:#f5f5e9;margin:0;font:800 23px/1.2 ui-sans-serif,system-ui,sans-serif;position:relative}.BPn80q_rewardModal>small{color:#71847e;margin-top:13px;font-size:8px;display:block}.BPn80q_rewardHalo{pointer-events:none;filter:blur(4px);background:radial-gradient(circle,#ffe98424,#0000 70%);width:120px;height:65px;position:absolute;top:7px;left:50%;transform:translate(-50%)}.BPn80q_rewardItems{grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:8px;margin-top:18px;display:grid;position:relative}.BPn80q_rewardItem{background:#182126;border:1px solid;border-radius:15px;outline:none;flex-direction:column;justify-content:center;align-items:center;gap:6px;min-width:0;min-height:118px;padding:10px 6px 8px;display:flex;position:relative;box-shadow:inset 0 1px #ffffff0d}.BPn80q_rewardItem .BPn80q_bigCore{width:42px;height:42px}.BPn80q_rewardItem .BPn80q_materialShard{width:31px;height:42px}.BPn80q_rewardItem .BPn80q_sprite_small{width:63px;height:63px}.BPn80q_rewardItem>strong{color:#dceae6;max-width:100%;font-size:9px;line-height:1.2}.BPn80q_rewardItem>b{color:currentColor;font:900 14px/1 ui-monospace,monospace}.BPn80q_rewardItemCompact{border-radius:8px;flex:1;gap:2px;min-height:39px;padding:3px}.BPn80q_rewardItemCompact .BPn80q_bigCore{border-width:2px;border-radius:5px;width:17px;height:17px;box-shadow:inset 0 0 0 2px #16252d}.BPn80q_rewardItemCompact .BPn80q_materialShard{width:12px;height:17px}.BPn80q_rewardItemCompact>strong{font-size:5.5px}.BPn80q_rewardItemCompact>b{font-size:7px}@keyframes BPn80q_rewardBackdropIn{0%{opacity:0}}@keyframes BPn80q_rewardModalIn{0%{opacity:0;transform:translateY(12px)scale(.93)}}.BPn80q_starterModal{text-align:center;background:#151e25;border:1px solid #d9eee824;border-radius:22px;width:100%;max-height:100%;padding:17px;overflow:auto;box-shadow:0 24px 90px #000b}.BPn80q_starterModal h2{color:#e8f4f0;margin:0;font:780 23px/1.2 ui-sans-serif,system-ui,sans-serif}.BPn80q_starterGrid{grid-template-columns:1fr;gap:8px;margin-top:14px;display:grid}.BPn80q_starterGrid button{color:#e5f0ed;cursor:pointer;text-align:left;background:#1a242b;border:1px solid #d9eee817;border-radius:16px;grid-template-rows:repeat(4,auto);grid-template-columns:96px minmax(0,1fr);align-items:center;padding:7px 12px;transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .18s,border-color .18s;display:grid}.BPn80q_starterGrid button .BPn80q_sprite_large{grid-row:1/5;width:92px;height:92px}.BPn80q_starterGrid span{color:#91a49f;font-size:11px}.BPn80q_starterGrid small{color:#667b76;margin:5px 0 10px}.BPn80q_starterGrid b{color:#b8dfd4;border:1px solid #8bc7b75c;border-radius:8px;padding:6px 14px}.BPn80q_battlePanel{overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#8eb2a840 transparent;background:#11181e;border:0;border-radius:22px;width:100%;height:100%;max-height:none;padding:8px 10px 12px;overflow:auto}.BPn80q_battlePanel::-webkit-scrollbar{width:5px}.BPn80q_battlePanel::-webkit-scrollbar-track{background:0 0}.BPn80q_battlePanel::-webkit-scrollbar-thumb{background:#8eb2a840;border-radius:999px}.BPn80q_battlePanel>header{z-index:20;background:linear-gradient(#11181e 78%,#0000);border-bottom:1px solid #d9eee817;justify-content:space-between;align-items:center;min-height:34px;padding:0 2px 7px;display:flex;position:sticky;top:0}.BPn80q_battlePanel h2{color:#e5f1ed;margin:0;font:760 14px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_battlePanel header span{color:#829590;font-size:8px}.BPn80q_arena{background:radial-gradient(circle,#29617633,#0000 58%);grid-template-columns:1fr 70px 1fr;align-items:center;gap:12px;min-height:260px;padding:10px 7%;display:grid}.BPn80q_fighter{flex-direction:column;align-items:center;min-width:0;display:flex}.BPn80q_fighterEnhanced{filter:drop-shadow(0 0 13px #ff4b9f66)}.BPn80q_fighterName{color:#e0ece8;justify-content:space-between;width:min(280px,100%);font-size:12px;display:flex}.BPn80q_battleVs{color:#ffcd62;text-align:center;font:900 23px/1 ui-monospace,monospace}.BPn80q_hpBar{background:#263139;border:1px solid #ffffff0d;border-radius:999px;width:min(280px,90%);height:8px;position:relative;overflow:hidden}.BPn80q_hpBar i,.BPn80q_hpBar em{border-radius:inherit;height:100%;transition:width .28s cubic-bezier(.22,1,.36,1);display:block;position:absolute;inset:0 auto 0 0}.BPn80q_hpBar i{z-index:1;background:linear-gradient(90deg,#62b989,#9bca78)}.BPn80q_hpWild em{z-index:2;background:linear-gradient(90deg,#ce6680,#d76c7d);box-shadow:2px 0 #fff4a55c}.BPn80q_fighter small{color:#7595a3;margin-top:6px;font-size:10px}.BPn80q_battleBottom{grid-template-columns:minmax(220px,.7fr) minmax(420px,1.3fr);gap:10px;display:grid}.BPn80q_battleLog{color:#86a5b2;background:#060e18;border:1px solid #2d4858;border-radius:9px;min-height:150px;max-height:220px;margin:0;padding:10px 10px 10px 28px;font:10px/1.55 ui-monospace,monospace;overflow:auto}.BPn80q_battleControls{background:#0a1724;border:1px solid #2d4858;border-radius:9px;padding:10px}.BPn80q_battleControls p{color:#7695a2;margin:0 0 8px;font-size:10px}.BPn80q_moveButtons{grid-template-columns:repeat(4,1fr);gap:6px;display:grid}.BPn80q_moveButtons button,.BPn80q_captureRow button{color:#d9fff4;cursor:pointer;background:#10283a;border:1px solid #477080;border-radius:7px;padding:9px 7px;font:700 10px/1.2 ui-monospace,monospace}.BPn80q_moveButtons button:hover,.BPn80q_captureRow button:hover{border-color:#69e4c5}.BPn80q_moveButtons .BPn80q_flee{color:#ff9eb8;border-color:#733f55}.BPn80q_captureRow{border-top:1px solid #29414f;flex-wrap:wrap;align-items:center;gap:6px;margin-top:9px;padding-top:9px;display:flex}.BPn80q_captureRow>strong{color:#bbfff0;margin-right:5px;font-size:11px}.BPn80q_captureRow>span{color:#7895a3;font-size:10px}.BPn80q_captureRow button{justify-content:flex-start;align-items:center;gap:7px;min-width:104px;display:flex}.BPn80q_captureRow i{width:13px;height:13px;box-shadow:none;border-width:2px}.BPn80q_captureRow button span{text-align:left;flex:1;font-size:9px}.BPn80q_captureRow button b{font-size:11px}.BPn80q_moveButtons button:disabled,.BPn80q_captureRow button:disabled,.BPn80q_starterGrid button:disabled,.BPn80q_pageHeading button:disabled{opacity:.4;cursor:not-allowed}.BPn80q_toast{z-index:80;color:#e0ece8;background:#202b31f2;border:1px solid #d9eee824;border-radius:999px;width:max-content;max-width:90%;padding:8px 13px;font-size:9px;animation:.24s cubic-bezier(.34,1.56,.64,1) BPn80q_toastIn;position:absolute;bottom:34px;left:50%;transform:translate(-50%);box-shadow:0 8px 30px #0008}@keyframes BPn80q_toastIn{0%{opacity:0;transform:translate(-50%,6px)scale(.96)}}.BPn80q_battleHeader>div{align-items:baseline;gap:8px;display:flex}.BPn80q_battleHeader>div span{color:#8babb7;font:700 10px/1 ui-monospace,monospace}.BPn80q_battleHeader .BPn80q_flee{color:#dca2b6;cursor:pointer;background:#241c21;border:1px solid #b97b9238;border-radius:999px;padding:6px 12px;font-size:8px;transition:background .15s,transform .15s cubic-bezier(.22,1,.36,1)}.BPn80q_battleHeader .BPn80q_flee:hover{background:#2c2127;transform:translateY(-1px)}.BPn80q_battleHeader .BPn80q_flee:disabled{opacity:.45;cursor:not-allowed}.BPn80q_wildBanner{background:radial-gradient(at 25% 82%,#77688738 0 15%,#0000 47%),#182129;border:1px solid #d9eee817;border-radius:18px;grid-template-columns:104px minmax(0,1fr);align-items:end;gap:5px;min-height:108px;margin:6px 0;padding:5px 8px 8px;display:grid;position:relative;overflow:hidden}.BPn80q_wildBanner .BPn80q_sprite_medium{z-index:2;filter:drop-shadow(0 10px 8px #0007);width:100px;height:100px;animation:2.2s ease-in-out infinite alternate BPn80q_enemyFloat;position:relative}.BPn80q_enemyAura{z-index:1;background:radial-gradient(#bda4c852,#0000 68%);border-radius:50%;width:110px;height:30px;animation:1.8s ease-in-out infinite alternate BPn80q_enemyAura;position:absolute;bottom:4px;left:8px}.BPn80q_wildVitals{z-index:3;align-self:center;gap:4px;min-width:0;padding-top:22px;display:grid;position:relative}.BPn80q_wildVitals .BPn80q_hpBar{width:100%;max-width:none}.BPn80q_wildVitals small{color:#8aa7b2;font:8px/1.3 ui-monospace,monospace}.BPn80q_enemyIntent{z-index:5;background:#241d22d9;border:1px solid #c79ab02b;border-radius:999px;justify-content:space-between;align-items:center;gap:6px;min-width:105px;padding:5px 9px;display:flex;position:absolute;top:7px;right:8px}.BPn80q_enemyIntent span{color:#a47f99;text-transform:uppercase;letter-spacing:.06em;font:800 7px/1 ui-monospace,monospace}.BPn80q_enemyIntent strong{color:#ffc0dc;font-size:8px}.BPn80q_enemyIntent small{color:#d09bb3;font:650 6px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_damageBurst{z-index:8;color:#fff5a2;text-shadow:0 2px #8b203d,0 0 14px #ffeb6b;pointer-events:none;font:1000 27px/1 ui-monospace,monospace;animation:.7s cubic-bezier(.1,.8,.2,1) forwards BPn80q_damageRise;position:absolute;top:18px;left:78px}.BPn80q_comboBurst{z-index:8;color:#8effe0;text-shadow:0 0 12px #3fffd1;pointer-events:none;font:1000 13px/1 ui-monospace,monospace;animation:.65s ease-out both BPn80q_comboPop;position:absolute;bottom:10px;right:17px}@keyframes BPn80q_enemyFloat{to{transform:translateY(-5px)rotate(1deg)}}@keyframes BPn80q_enemyAura{to{opacity:.45;transform:scaleX(1.12)}}@keyframes BPn80q_damageRise{0%{opacity:0;transform:translateY(12px)scale(.7)}22%{opacity:1;transform:translateY(0)scale(1.18)}to{opacity:0;transform:translateY(-31px)scale(.95)}}@keyframes BPn80q_comboPop{0%{opacity:0;transform:scale(.45)rotate(-7deg)}45%{opacity:1;transform:scale(1.14)}to{opacity:0;transform:translateY(-12px)}}.BPn80q_matchBattleLayout{grid-template-columns:1fr;align-items:start;gap:6px;display:grid}.BPn80q_boardColumn,.BPn80q_partyColumn{min-width:0}.BPn80q_boardColumn{background:#151e25;border:1px solid #d9eee817;border-radius:17px;padding:5px}.BPn80q_turnSummary{color:#dce9e5;align-items:center;gap:6px;min-height:29px;margin-bottom:3px;padding:0 4px;font-size:9px;display:flex}.BPn80q_turnSummaryBoss{color:#ffd9d1;background:linear-gradient(90deg,#5d27352b,#33253d24);border:1px solid #d9898930;border-radius:9px;margin-inline:-2px;padding-inline:6px}.BPn80q_ecologyPip{background:#1b252c;border:1px solid;border-radius:50%;place-items:center;width:23px;height:23px;font-size:12px;display:grid}.BPn80q_pip_lumen{color:#d9b866}.BPn80q_pip_forge{color:#ce7565}.BPn80q_pip_relay{color:#6faec5}.BPn80q_pip_aegis{color:#6fba91}.BPn80q_pip_glitch{color:#aa78bd}.BPn80q_actionDots{gap:5px;margin-left:auto;display:flex}.BPn80q_actionDots i{background:#222d34;border:1px solid #52636a;border-radius:4px;width:17px;height:5px;transform:skew(-18deg)}.BPn80q_actionDots .BPn80q_actionDotActive{background:#7fcdb7;border-color:#7fcdb7}.BPn80q_cascadePill{color:#b8d9d0;background:#202c32;border:1px solid #b6d4cc30;border-radius:999px;margin-left:2px;padding:4px 7px;font:750 7px/1 ui-sans-serif,system-ui,sans-serif;animation:.2s cubic-bezier(.34,1.56,.64,1) BPn80q_cascadeIn}@keyframes BPn80q_cascadeIn{0%{opacity:0;transform:translateY(3px)scale(.85)}}.BPn80q_matchBoard{aspect-ratio:1;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none;background:#0d1318;border:1px solid #d9eee81f;border-radius:18px;grid-template-rows:repeat(7,minmax(0,1fr));grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;width:min(100%,clamp(260px,100vh - 400px,346px));margin:0 auto;padding:5px;display:grid;box-shadow:inset 0 1px #ffffff08,0 8px 22px #0004}.BPn80q_matchTile{color:#fff;cursor:grab;min-width:0;min-height:0;transform:translate3d(var(--drag-x), var(--drag-y), 0);will-change:transform, opacity;animation:.3s cubic-bezier(.34,1.56,.64,1) both BPn80q_tileSettle;animation-delay:calc(var(--tile-row) * 12ms);touch-action:none;user-select:none;-webkit-user-drag:none;border:1px solid #ffffff24;border-radius:31%;place-items:center;padding:0;transition:transform .13s cubic-bezier(.22,1,.36,1),filter .15s,border-color .15s,box-shadow .15s;display:grid;position:relative;overflow:hidden;box-shadow:inset 0 1px #ffffff24,0 2px 5px #0005}.BPn80q_matchTile:after{content:\"\";filter:blur(1px);pointer-events:none;background:#ffffff32;border-radius:50%;height:18%;position:absolute;top:11%;left:21%;right:21%}.BPn80q_matchTile>span{z-index:2;text-shadow:0 1px 2px #0006;pointer-events:none;font:850 clamp(13px,4vw,21px)/1 ui-sans-serif,system-ui,sans-serif;position:relative}.BPn80q_matchTile>b{color:#fff;text-shadow:0 1px 3px #000;font:900 10px/1 ui-monospace,monospace;position:absolute;top:2px;right:3px}.BPn80q_matchTile>em{z-index:4;color:#ecf5ff;pointer-events:none;background:#26334ce6;border:1px solid #e9f4ffb5;border-radius:4px;place-items:center;width:14px;height:14px;font:900 9px/1 ui-monospace,monospace;display:grid;position:absolute;bottom:2px;right:3px;box-shadow:0 0 7px #9dc2ff8a}.BPn80q_matchTile:hover{filter:brightness(1.08);transform:translateY(-1px)}.BPn80q_matchTile:disabled{cursor:wait;opacity:.72}.BPn80q_matchTileSelected{filter:brightness(1.09);box-shadow:0 0 0 2px #edf8f538,0 5px 12px #0005;border-color:#edf8f5cc!important}.BPn80q_matchTileDragging{z-index:12;cursor:grabbing;transform:translate3d(var(--drag-x), var(--drag-y), 0) scale(1.055);filter:brightness(1.1);transition:none;box-shadow:0 8px 16px #0007}.BPn80q_matchTileSpecial{animation:1.5s ease-in-out infinite alternate BPn80q_tileSpecial}.BPn80q_matchTileLocked{cursor:not-allowed;filter:saturate(.3)brightness(.72);border-color:#a8bcdf70;box-shadow:inset 0 0 0 2px #1d294766,0 2px 5px #0005}.BPn80q_matchTileLocked:before{content:\"\";z-index:3;pointer-events:none;background:repeating-linear-gradient(135deg,#bcd1ff0c 0 5px,#0000 5px 10px);position:absolute;inset:0}@keyframes BPn80q_tileSettle{0%{opacity:.15;transform:translateY(-18px)scale(.72)}to{opacity:1;transform:translateY(0)scale(1)}}@keyframes BPn80q_tileSpecial{to{filter:brightness(1.12);box-shadow:0 0 0 2px,0 3px 8px #0004}}.BPn80q_matchTileClearing{pointer-events:none;animation:.19s cubic-bezier(.4,0,.2,1) forwards BPn80q_tileClear!important}.BPn80q_matchTileFalling{pointer-events:none;animation:BPn80q_tileFall var(--fall-duration) cubic-bezier(.22,1,.36,1) var(--fall-delay) both!important}@keyframes BPn80q_tileClear{0%{opacity:1;filter:brightness();transform:scale(1)}45%{opacity:1;filter:brightness(1.22);transform:scale(1.08)}to{opacity:0;filter:blur(2px);transform:scale(.28)}}@keyframes BPn80q_tileFall{0%{opacity:.1;transform:translateY(var(--fall-y)) scale(.92)}72%{opacity:1;transform:translateY(4%)scale(1.015,.985)}88%{transform:translateY(-2%)scale(.995,1.005)}to{opacity:1;transform:translateY(0)scale(1)}}.BPn80q_tileSwapRight{z-index:10;animation:.14s ease-in forwards BPn80q_swapRight!important}.BPn80q_tileSwapLeft{z-index:10;animation:.14s ease-in forwards BPn80q_swapLeft!important}.BPn80q_tileSwapDown{z-index:10;animation:.14s ease-in forwards BPn80q_swapDown!important}.BPn80q_tileSwapUp{z-index:10;animation:.14s ease-in forwards BPn80q_swapUp!important}@keyframes BPn80q_swapRight{to{transform:translate(calc(100% + 3px))scale(.94)}}@keyframes BPn80q_swapLeft{to{transform:translate(calc(-100% - 3px))scale(.94)}}@keyframes BPn80q_swapDown{to{transform:translateY(calc(100% + 3px))scale(.94)}}@keyframes BPn80q_swapUp{to{transform:translateY(calc(-100% - 3px))scale(.94)}}.BPn80q_tile_lumen{color:#fff4cf;background:linear-gradient(145deg,#dfc170,#aa7940)}.BPn80q_tile_forge{color:#ffe5df;background:linear-gradient(145deg,#d77d6c,#9e4d50)}.BPn80q_tile_relay{color:#e4f6fb;background:linear-gradient(145deg,#76b8cf,#497ba3)}.BPn80q_tile_aegis{color:#e7f8ed;background:linear-gradient(145deg,#79c29a,#477e65)}.BPn80q_tile_glitch{color:#f5e9f8;background:linear-gradient(145deg,#b781c8,#77558f)}.BPn80q_boardHelp{text-align:center;color:#71837e;margin:4px 0 1px;font-size:8px}.BPn80q_partyColumn{gap:4px;display:grid}.BPn80q_partyBattleList{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;display:grid}.BPn80q_partyCombatant{opacity:.68;background:#171f26;border:1px solid #d9eee814;border-radius:12px;grid-template-columns:40px minmax(0,1fr);align-items:center;gap:3px;min-height:78px;padding:4px;transition:opacity .18s,background .18s,border-color .18s,transform .18s cubic-bezier(.22,1,.36,1);display:grid;position:relative;overflow:hidden}.BPn80q_partyCombatant .BPn80q_sprite_small{filter:drop-shadow(0 4px 4px #0006);width:41px;height:41px}.BPn80q_partySlot{z-index:4;color:#95aaa4;background:#263239;border-radius:50%;place-items:center;width:14px;height:14px;font:750 7px/1 ui-sans-serif,system-ui,sans-serif;display:grid;position:absolute;top:3px;left:3px}.BPn80q_partyCombatantActive{opacity:1;background:#1b292b;border-color:#8cc9b837;transform:translateY(-1px)}.BPn80q_partyCombatantDown{filter:grayscale();opacity:.38}.BPn80q_partyCombatantBody{gap:2px;min-width:0;display:grid}.BPn80q_partyCombatantBody .BPn80q_fighterName{gap:1px;font-size:8px;display:grid}.BPn80q_partyCombatantBody .BPn80q_fighterName strong,.BPn80q_partyCombatantBody .BPn80q_fighterName span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.BPn80q_partyCombatantBody .BPn80q_hpBar{border-width:1px;width:100%;height:4px}.BPn80q_partyCombatantBody small{color:#849792;white-space:nowrap;font-size:6.5px}.BPn80q_frozenBadge{z-index:5;color:#cce9ff;background:#26394ce6;border:1px solid #b9dcff61;border-radius:999px;padding:3px 5px;font:800 6px/1 ui-sans-serif,system-ui,sans-serif;position:absolute;top:4px;right:4px;box-shadow:0 0 8px #91c8ff3d}.BPn80q_energyBar{background:#2b343a;border-radius:4px;width:100%;height:4px;overflow:hidden}.BPn80q_energyBar i{background:linear-gradient(90deg,#6e9fbd,#9a7db3,#bd789c);height:100%;transition:width .28s cubic-bezier(.22,1,.36,1);display:block}.BPn80q_skillSummary{flex-wrap:wrap;gap:5px;margin-top:2px;display:flex}.BPn80q_skillSummary span{color:#9db9c3;text-overflow:ellipsis;white-space:nowrap;border:1px solid #345362;border-radius:4px;max-width:49%;padding:3px 5px;font-size:8px;overflow:hidden}.BPn80q_skillButton{color:#d9c9df;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;background:#28222e;border:1px solid #ab8fba33;border-radius:999px;width:100%;margin-top:1px;padding:4px;font:700 7px/1 ui-sans-serif,system-ui,sans-serif;transition:background .15s,transform .15s cubic-bezier(.22,1,.36,1),border-color .15s;overflow:hidden}.BPn80q_skillButton:not(:disabled){animation:1.6s ease-in-out infinite alternate BPn80q_skillReady}.BPn80q_skillButton:not(:disabled):hover{background:#332a3a;transform:translateY(-1px)}.BPn80q_skillButton:disabled{opacity:.42;cursor:not-allowed;animation:none}@keyframes BPn80q_skillReady{to{border-color:#c2a8cd61}}.BPn80q_battleWasHit .BPn80q_partyBattleList{animation:.28s ease-out BPn80q_partyShake}@keyframes BPn80q_partyShake{20%{filter:brightness(1.45)saturate(.6);transform:translate(-5px)}45%{transform:translate(4px)}70%{transform:translate(-2px)}}.BPn80q_capturePanel{background:#171f26;border:1px solid #d9eee817;border-radius:13px;grid-template-columns:minmax(94px,.65fr) minmax(0,1.35fr);align-items:center;gap:6px;min-height:38px;padding:5px 7px;display:grid}.BPn80q_capturePanelReady{background:#28241c;border-color:#c9b2764a;animation:1.5s ease-in-out infinite alternate BPn80q_captureReady}.BPn80q_capturePanel>div:first-child{flex-direction:column;justify-content:space-between;align-items:baseline;gap:2px;min-width:0;display:flex}.BPn80q_capturePanel>div:first-child strong{color:#d9fff4;font-size:9px}.BPn80q_capturePanel>div:first-child span,.BPn80q_capturePanel p{color:#7f9aa5;margin:0;font-size:6px}.BPn80q_captureButtons{flex-wrap:nowrap;gap:3px;min-width:0;margin-top:0;display:flex}.BPn80q_captureButtons button{cursor:pointer;background:#202a31;border:1px solid;border-radius:8px;flex:1;align-items:center;gap:3px;min-width:0;padding:5px;transition:transform .15s cubic-bezier(.22,1,.36,1),background .15s;display:flex}.BPn80q_captureButtons button:not(:disabled):hover{background:#28343b;transform:translateY(-1px)}.BPn80q_captureButtons button:disabled{opacity:.35;cursor:not-allowed}.BPn80q_captureButtons i{border:2px solid;border-radius:3px;width:10px;height:10px;transform:rotate(45deg)}.BPn80q_captureButtons span{color:#bed4da;text-overflow:ellipsis;font-size:6px;overflow:hidden}.BPn80q_captureButtons b{color:currentColor;margin-left:auto;font:900 10px/1 ui-monospace,monospace}@keyframes BPn80q_captureReady{to{border-color:#d9c08373}}.BPn80q_continueButton{color:#cce9e1;cursor:pointer;background:#20332f;border:1px solid #8dc7b552;border-radius:9px;grid-column:1/-1;width:100%;padding:7px;font:750 8px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_continueButton:hover{background:#29403b;border-color:#9ddbc9}.BPn80q_continueButton:disabled{opacity:.4;cursor:not-allowed}.BPn80q_towerBattleStatus{background:linear-gradient(120deg,#232431,#171f26);border:1px solid #aaa1d334;border-radius:13px;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;min-height:38px;padding:6px 8px;display:grid}.BPn80q_towerBattleMark{color:#d7d1ee;background:#333248;border:1px solid #aca3d15e;border-radius:8px;place-items:center;width:24px;height:24px;font-size:10px;display:grid}.BPn80q_towerBattleStatus>div{gap:2px;min-width:0;display:grid}.BPn80q_towerBattleStatus strong{color:#ddd9ee;font-size:8px}.BPn80q_towerBattleStatus small{color:#83939c;font-size:6px}.BPn80q_towerBattleStatus>b{color:#bcb5d6;white-space:nowrap;border:1px solid #8b83ad40;border-radius:999px;padding:4px 6px;font-size:6px}.BPn80q_towerBattleStatus .BPn80q_continueButton{grid-column:1/-1}.BPn80q_battleFooterArea{min-height:25px;margin-top:0;display:block}.BPn80q_teamStrikeSummary{justify-content:center;gap:5px;margin:3px 0 5px;display:flex}.BPn80q_teamStrikeSummary span{color:#9f997b;text-align:center;background:#26241b;border:1px solid #d7c67e2b;border-radius:8px;flex:1;padding:4px 6px;font-size:6.5px}.BPn80q_teamStrikeSummary b{color:#f2d982;font:900 10px/1 ui-monospace,monospace}.BPn80q_battleFooterArea>p{display:none}.BPn80q_battleFooterArea .BPn80q_battleLog{background:#151d23;border-color:#d9eee814;border-radius:10px;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:10px;min-height:25px;max-height:31px;margin:0;padding:5px 7px 5px 22px;font:7px/1.5 ui-sans-serif,system-ui,sans-serif;display:grid;overflow:hidden}.BPn80q_battleFooterArea .BPn80q_battleLog li{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.BPn80q_core_pebble{color:#a5bcc6}.BPn80q_core_pulse{color:#53dfb6}.BPn80q_core_prism{color:#63bbff}.BPn80q_core_nova{color:#c381ff}.BPn80q_core_origin{color:#ffd35e}.BPn80q_core_pebble.BPn80q_bigCore,.BPn80q_core_pebble .BPn80q_bigCore{filter:saturate(.4)}.BPn80q_core_pulse.BPn80q_bigCore{filter:hue-rotate()}.BPn80q_core_prism.BPn80q_bigCore{filter:hue-rotate(70deg)}.BPn80q_core_nova.BPn80q_bigCore{filter:hue-rotate(135deg)}.BPn80q_core_origin.BPn80q_bigCore{filter:hue-rotate(245deg)brightness(1.2)}@media (width<=800px){.BPn80q_launcher{border-radius:16px;width:52px;height:52px;bottom:14px;right:14px}.BPn80q_idleClaimFloating{bottom:76px;right:17px}.BPn80q_launcherOpen{border-radius:14px;width:44px;height:44px;top:max(14px,50vh - 433px);bottom:auto}.BPn80q_overlay{width:min(454px,100vw - 12px);height:min(880px,100dvh - 12px)}.BPn80q_headerStats .BPn80q_miniCore:nth-of-type(n+4){display:none}.BPn80q_wildBanner{min-height:102px}.BPn80q_matchBoard{width:min(100%,clamp(260px,100dvh - 400px,346px))}}@media (width<=470px){.BPn80q_overlay{border:0;border-radius:0;width:100vw;height:100dvh}.BPn80q_overlay:after{display:none}.BPn80q_launcher{z-index:100}.BPn80q_header{padding-right:58px}.BPn80q_headerStats .BPn80q_online,.BPn80q_headerStats .BPn80q_offline,.BPn80q_close{display:none}.BPn80q_mapFrame{grid-template-rows:minmax(350px,1fr) auto auto;min-height:460px}.BPn80q_worldMap{min-height:350px}.BPn80q_towerDock{grid-template-columns:38px 43px minmax(0,1fr) auto;gap:5px;padding:7px}.BPn80q_towerGlyph{width:36px;transform:scale(.86)}.BPn80q_towerBossPreview .BPn80q_sprite_small{width:41px;height:41px}.BPn80q_towerProgress,.BPn80q_towerSummary small{display:none}.BPn80q_towerDock>button{padding-inline:8px}.BPn80q_dexGrid{grid-template-columns:repeat(3,minmax(0,1fr))}.BPn80q_battlePanel{border-radius:0}}@media (height<=650px) and (width>=471px){.BPn80q_overlay{height:calc(100vh - 8px)}.BPn80q_wildBanner{min-height:88px}.BPn80q_wildBanner .BPn80q_sprite_medium{width:82px;height:82px}.BPn80q_partyCombatant{min-height:70px}.BPn80q_matchBoard{width:min(100%,clamp(238px,100vh - 390px,310px))}}@media (prefers-reduced-motion:reduce){.BPn80q_launcherPulse,.BPn80q_encounterEnhanced,.BPn80q_idleClaimFloating,.BPn80q_idleClaimPulse,.BPn80q_rewardBackdrop,.BPn80q_rewardModal{animation:none}.BPn80q_launcher,.BPn80q_encounter,.BPn80q_starterGrid button{transition:none}.BPn80q_matchTileSpecial,.BPn80q_matchTile,.BPn80q_skillButton:not(:disabled),.BPn80q_wildBanner .BPn80q_sprite_medium,.BPn80q_enemyAura,.BPn80q_partyCombatantActive,.BPn80q_capturePanelReady,.BPn80q_damageBurst,.BPn80q_comboBurst,.BPn80q_matchTileClearing,.BPn80q_matchTileFalling,.BPn80q_cascadePill,.BPn80q_toast{animation:none}}.BPn80q_launcher{isolation:isolate;background:radial-gradient(circle at 30% 20%,#d8fff526,#0000 38%),linear-gradient(145deg,#18252f,#0b1119 72%);border:1px solid #d6fff43b;border-radius:23px;width:62px;height:62px;box-shadow:0 22px 55px #02050a99,inset 0 1px #ffffff21,0 0 0 6px #7de7c607}.BPn80q_launcher:before{content:\"\";z-index:-1;background:linear-gradient(135deg,#ffffff08,#0000 55%);border:1px solid #ffffff0f;border-radius:17px;position:absolute;inset:7px}.BPn80q_launcher:hover{background-color:#1d2c35;border-color:#baffeb73;transform:translateY(-4px)scale(1.025)}.BPn80q_launcherOpen{backdrop-filter:blur(18px);background:#121922e8;border-radius:15px;width:43px;height:43px;top:max(14px,50vh - 426px);right:max(14px,50vw - 216px);box-shadow:0 12px 36px #02050aaa,inset 0 1px #ffffff1c}.BPn80q_launcherCore,.BPn80q_logoCore,.BPn80q_bigCore,.BPn80q_captureRow i{background:linear-gradient(135deg,#83e0c3 0 41%,#1c313b 42% 58%,#c7f5e8 59%);border-color:#e4fff8;border-radius:9px;box-shadow:inset 0 0 0 3px #0d1821,0 8px 18px #02060a88,0 0 16px #7affd135}.BPn80q_badge{background:#ff8fae;border-color:#0b1118;box-shadow:0 5px 14px #ff598963}.BPn80q_overlay{--surface:#101923b8;--surface-raised:#16232ecf;--line:#dffcf517;--line-strong:#dffcf52e;--text:#f4faf8;--muted:#91a6a2;--accent:#91e4cb;--violet:#a9b7ff;isolation:isolate;background:radial-gradient(circle at 92% 2%,#8e9cff15 0 13%,#0000 35%),radial-gradient(circle at 0 80%,#4dd8b90d 0 18%,#0000 42%),linear-gradient(160deg,#0d151e 0%,#080d14 67%,#0a1018 100%);border-color:#dffff633;border-radius:34px;grid-template-rows:68px 57px minmax(0,1fr) 30px;width:min(448px,100vw - 24px);height:min(866px,100dvh - 24px);font-family:Inter,Segoe UI,PingFang SC,system-ui,sans-serif;animation:.46s cubic-bezier(.22,1,.36,1) BPn80q_spatialShellEnter;box-shadow:0 42px 120px #000d,0 0 0 1px #ffffff08,inset 0 1px #ffffff0d}.BPn80q_overlay:before{content:\"\";pointer-events:none;z-index:-1;filter:blur(12px);background:radial-gradient(circle,#7788ff16,#0000 67%);border-radius:50%;width:320px;height:320px;animation:8s ease-in-out infinite alternate BPn80q_ambientOrb;display:block;position:absolute;top:90px;right:-150px}.BPn80q_overlay:after{z-index:40;border-color:#ffffff0b;border-radius:28px;inset:5px}@keyframes BPn80q_spatialShellEnter{0%{opacity:0;filter:blur(8px);transform:translate(-50%,-47%)scale(.965)}to{opacity:1;filter:blur();transform:translate(-50%,-50%)scale(1)}}@keyframes BPn80q_ambientOrb{to{opacity:.65;transform:translate(-26px,34px)scale(1.12)}}.BPn80q_header{backdrop-filter:blur(26px)saturate(125%);background:linear-gradient(#131e28d9,#0c131bb8);border-bottom:0;padding:10px 57px 9px 15px}.BPn80q_header:after{content:\"\";background:linear-gradient(90deg,#0000,#cafff12b 18% 82%,#0000);height:1px;position:absolute;bottom:0;left:15px;right:15px}.BPn80q_brand{gap:11px}.BPn80q_brand h1{letter-spacing:.035em;font-size:15px;font-weight:680}.BPn80q_brand p{color:#78908b;letter-spacing:.07em;text-overflow:ellipsis;white-space:nowrap;max-width:138px;margin:4px 0 0;font-size:7px;display:block;overflow:hidden}.BPn80q_logoCore{width:30px;height:30px}.BPn80q_headerStats{gap:3px}.BPn80q_miniCore{opacity:.82;background:#121d25b8;border-color:currentColor;border-radius:7px;width:20px;min-width:20px;height:20px;padding:0;font-size:7px;box-shadow:inset 0 1px #ffffff0e}.BPn80q_online,.BPn80q_offline{letter-spacing:.11em;border-radius:999px;margin-left:2px;padding:6px 7px;font-size:6px}.BPn80q_online{color:#87f4d2;background:#4dd5aa12;border-color:#73e9c53c;box-shadow:0 0 14px #49e1af13}.BPn80q_idleClaimButton{background:#211f18b8;border-color:#f8dd9d3b;border-radius:10px;box-shadow:inset 0 1px #fff5d319,0 7px 20px #0007}.BPn80q_idleClaimFloating{border-radius:18px;width:50px;height:50px}.BPn80q_tabs{z-index:3;backdrop-filter:blur(18px);background:#111a23a1;border:1px solid #e4fff510;border-radius:17px;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin:7px 12px 6px;padding:4px;display:grid;box-shadow:inset 0 1px #ffffff0a}.BPn80q_tabs button{color:#6f827f;height:41px;font:inherit;border-radius:12px;grid-template-rows:18px auto;place-items:center;gap:2px;transition:color .2s,background .2s,transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s;display:grid}.BPn80q_tabs button>span{opacity:.82;font:400 16px/1 ui-sans-serif,system-ui,sans-serif;transform:translateY(1px)}.BPn80q_tabs button>small{letter-spacing:.04em;white-space:nowrap;font:650 7px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_tabs button:hover{color:#c9ded9;background:#ffffff07;transform:translateY(-1px)}.BPn80q_content{scrollbar-color:#9fd8c43d transparent;background:linear-gradient(#0000,#0306091c);padding:11px 13px 14px}.BPn80q_content::-webkit-scrollbar{width:4px}.BPn80q_footer{color:#60736f;letter-spacing:.018em;background:#090f16c7;border-color:#dffff612;font-size:7px;line-height:1.3}.BPn80q_mapFrame{grid-template-rows:auto minmax(500px,1fr) auto;gap:11px;height:auto;min-height:620px}.BPn80q_mapIntro{justify-content:space-between;align-items:flex-end;padding:2px 4px 0;display:flex}.BPn80q_mapIntro>div:first-child{min-width:0}.BPn80q_mapIntro span,.BPn80q_towerHeading span{color:#75cdb4;letter-spacing:.18em;text-transform:uppercase;font:700 7px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_mapIntro h2,.BPn80q_towerHeading h2{color:#f0f7f5;letter-spacing:-.025em;margin:5px 0 2px;font-size:21px;font-weight:640}.BPn80q_mapIntro p,.BPn80q_towerHeading p{color:#758984;margin:0;font-size:9px}.BPn80q_mapRadar{background:radial-gradient(circle,#7aebca10,#0000 67%);border:1px solid #a8e8d51f;border-radius:50%;width:48px;height:48px;position:relative}.BPn80q_mapRadar i{border:1px solid #9bdfca1b;border-radius:50%;position:absolute;inset:7px}.BPn80q_mapRadar i:nth-child(2){inset:15px}.BPn80q_mapRadar i:nth-child(3){background:#8fe0c7;border:0;inset:23px;box-shadow:0 0 11px #7effd4}.BPn80q_mapRadar b{transform-origin:bottom;background:linear-gradient(#9df6da,#0000);width:1px;height:22px;animation:3.8s linear infinite BPn80q_radarSweep;position:absolute;bottom:50%;left:50%}@keyframes BPn80q_radarSweep{to{transform:rotate(360deg)}}.BPn80q_worldMap{background:radial-gradient(at 13% 14%,#58d6d42e 0 7%,#0000 30%),radial-gradient(at 84% 18%,#f5a66d24 0 9%,#0000 31%),radial-gradient(at 52% 6%,#9e84ff23 0 7%,#0000 28%),radial-gradient(at 18% 82%,#73d68f25 0 11%,#0000 35%),radial-gradient(at 87% 84%,#ed6da02a 0 9%,#0000 32%),linear-gradient(155deg,#13212c 0%,#0d1720 53%,#0b121a 100%);border-color:#dffcf51c;border-radius:29px;min-height:500px;box-shadow:inset 0 1px #ffffff10,inset 0 -50px 100px #03070a45,0 18px 44px #0003}.BPn80q_worldMap:before{opacity:.2;background-image:linear-gradient(#b8fff50d 1px,#0000 1px),linear-gradient(90deg,#b8fff50d 1px,#0000 1px);background-size:42px 42px;inset:-20%;transform:perspective(360px)rotateX(56deg)translateY(90px)scale(1.25);mask-image:linear-gradient(#0000,#000 28% 78%,#0000)}.BPn80q_worldMap:after{content:\"\";pointer-events:none;border:1px solid #ffffff08;border-radius:21px;position:absolute;inset:12px}.BPn80q_mapAtmosphere{pointer-events:none;filter:blur(.1px);position:absolute;inset:0}.BPn80q_mapAtmosphere i{opacity:.14;border:1px solid;border-radius:50%;width:150px;height:150px;animation:5s ease-in-out infinite alternate BPn80q_biomeBreathe;position:absolute}.BPn80q_mapAtmosphere i:after{content:\"\";border:1px solid;border-radius:50%;position:absolute;inset:31%}.BPn80q_mapAtmosphere i:first-child{color:#66edee;top:5px;left:-38px}.BPn80q_mapAtmosphere i:nth-child(2){color:#ffb375;animation-delay:-.7s;top:18px;right:-42px}.BPn80q_mapAtmosphere i:nth-child(3){color:#b3a2ff;animation-delay:-1.4s;top:-72px;left:34%}.BPn80q_mapAtmosphere i:nth-child(4){color:#88e99b;animation-delay:-2.1s;bottom:-42px;left:-20px}.BPn80q_mapAtmosphere i:nth-child(5){color:#ff78af;animation-delay:-2.8s;bottom:-48px;right:-28px}@keyframes BPn80q_biomeBreathe{to{opacity:.24;transform:scale(1.12)}}.BPn80q_mapRoutes{pointer-events:none;opacity:.34;position:absolute;inset:0}.BPn80q_mapRoutes i{transform-origin:top;background:linear-gradient(#c9fff252,#0000);width:1px;height:145px;position:absolute;top:50%;left:50%}.BPn80q_mapRoutes i:first-child{transform:rotate(38deg)}.BPn80q_mapRoutes i:nth-child(2){transform:rotate(112deg)}.BPn80q_mapRoutes i:nth-child(3){transform:rotate(204deg)}.BPn80q_mapRoutes i:nth-child(4){transform:rotate(292deg)}.BPn80q_regionLabel{letter-spacing:.09em;backdrop-filter:blur(12px);opacity:.78;background:#08111994;border-color:#ffffff13;border-radius:999px;padding:5px 9px;font-size:7px;font-weight:680}.BPn80q_region_lumen{top:7%;left:6%}.BPn80q_region_forge{top:7%;right:6%}.BPn80q_region_relay{top:3%;left:43%}.BPn80q_region_aegis{bottom:6%;left:6%}.BPn80q_region_glitch{bottom:6%;right:6%}.BPn80q_encounter{width:78px;min-height:91px;box-shadow:none;backdrop-filter:none;background:0 0;border:0;border-radius:18px;padding:2px 3px 5px;animation:.42s cubic-bezier(.22,1,.36,1) both BPn80q_encounterArrive;overflow:visible}.BPn80q_encounterAvatar{--encounter-ring:#a8c5bd;z-index:2;height:62px;color:var(--encounter-ring);isolation:isolate;background:linear-gradient(155deg,#d8e9e5,#93b8ad);border:2px solid #ffffffd6;border-radius:50%;flex:0 0 62px;place-items:center;display:grid;position:relative;box-shadow:0 10px 22px #02060b73,inset 0 0 0 2px #0b151d5c;width:62px!important;overflow:hidden!important}.BPn80q_encounter .BPn80q_encounterAvatar .BPn80q_sprite_small{z-index:2;filter:drop-shadow(0 6px 5px #0006);width:68px;max-width:none;height:68px;position:relative;transform:translateY(2px)scale(1.07)}.BPn80q_encounterSpecial{border-color:var(--encounter-ring);box-shadow:0 0 0 3px color-mix(in srgb, var(--encounter-ring) 28%, transparent), 0 10px 23px #02060b73, 0 0 19px color-mix(in srgb, var(--encounter-ring) 42%, transparent), inset 0 0 0 2px #ffffff6b}.BPn80q_encounterRing_pebble{--encounter-ring:#a9bfd0}.BPn80q_encounterRing_pulse{--encounter-ring:#52d9aa}.BPn80q_encounterRing_prism{--encounter-ring:#64aef5}.BPn80q_encounterRing_nova{--encounter-ring:#bb79ed}.BPn80q_encounterRing_origin{--encounter-ring:#efb93e}.BPn80q_encounterName{color:#eef8f5;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px #071019;width:100%;margin-top:4px;font-size:9px;font-weight:740;overflow:hidden}.BPn80q_encounterMeta{color:#9eb4ae;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 4px #071019;max-width:100%;margin-top:1px;font-size:6.5px;overflow:hidden}.BPn80q_encounter:hover{background:0 0;transform:translate(-50%,-55%)scale(1.065)}.BPn80q_encounter:hover .BPn80q_encounterAvatar{box-shadow:0 0 0 4px color-mix(in srgb, var(--encounter-ring) 25%, transparent), 0 13px 27px #02060b88;border-color:#fff}.BPn80q_encounterPulse{z-index:1;width:58px;height:58px;box-shadow:0 0 0 8px color-mix(in srgb, currentColor 8%, transparent), 0 0 25px color-mix(in srgb, currentColor 24%, transparent);border:1px solid;border-radius:50%;animation:2.5s ease-out infinite BPn80q_signalPulse;position:absolute;top:33px;left:50%;transform:translate(-50%,-50%)}.BPn80q_encounterEnhanced .BPn80q_encounterAvatar{--encounter-ring:#f0529c}.BPn80q_encounterEnhanced{animation:.42s cubic-bezier(.22,1,.36,1) both BPn80q_encounterArrive,2s ease-in-out infinite alternate BPn80q_anomalyGlow}@keyframes BPn80q_encounterArrive{0%{opacity:0;transform:translate(-50%,-42%)scale(.84)}}@keyframes BPn80q_signalPulse{70%,to{opacity:0;transform:translate(-50%,-50%)scale(1.35)}}@keyframes BPn80q_anomalyGlow{to{filter:drop-shadow(0 0 8px #ff5b9b75)}}.BPn80q_mapEmpty{color:#829b95;font-size:11px;line-height:1.65}.BPn80q_mapLegend{gap:5px}.BPn80q_mapLegend span{color:#83958f;letter-spacing:.04em;background:#111b2391;border-color:#ffffff10;border-radius:999px;padding:5px 9px;font-size:7px}.BPn80q_towerPage{padding-bottom:12px}.BPn80q_towerHeading{justify-content:space-between;align-items:flex-end;padding:2px 4px 12px;display:flex}.BPn80q_towerHeading>div{min-width:0}.BPn80q_towerHeading p{max-width:300px;line-height:1.5}.BPn80q_towerHeading>strong{color:#d9d9ff;letter-spacing:-.08em;opacity:.68;font:280 36px/1 ui-monospace,monospace}.BPn80q_towerHero{background:radial-gradient(circle at 20% 48%,#8893ff2d,#0000 32%),radial-gradient(circle at 83% 28%,#6ce5ca1d,#0000 29%),linear-gradient(145deg,#171c2b 0%,#0f1821 55%,#0a1119 100%);border:1px solid #dedcff1d;border-radius:29px;min-height:388px;position:relative;overflow:hidden;box-shadow:inset 0 1px #ffffff12,0 18px 44px #0003}.BPn80q_towerHero:before{content:\"\";opacity:.24;background-image:linear-gradient(#dfe4ff0d 1px,#0000 1px),linear-gradient(90deg,#dfe4ff0d 1px,#0000 1px);background-size:34px 34px;position:absolute;inset:0;mask-image:linear-gradient(#000,#0000 80%)}.BPn80q_towerHero:after{content:\"\";filter:blur(7px);background:radial-gradient(#8f94ff30,#0000 67%);border-radius:50%;height:22px;position:absolute;bottom:14px;left:44px;right:44px}.BPn80q_towerMonument{z-index:1;filter:drop-shadow(0 24px 24px #000a);flex-direction:column-reverse;justify-content:flex-start;align-items:center;width:150px;height:302px;display:flex;position:absolute;bottom:32px;left:24px}.BPn80q_towerMonument i{background:linear-gradient(90deg,#242b42,#4a4d6f 48%,#20293d);border:1px solid #bfc4ff30;border-radius:6px 6px 2px 2px;width:136px;height:36px;margin-top:-2px;display:block;box-shadow:inset 0 1px #ffffff1a}.BPn80q_towerMonument i:nth-child(2){width:118px}.BPn80q_towerMonument i:nth-child(3){width:100px}.BPn80q_towerMonument i:nth-child(4){width:82px}.BPn80q_towerMonument i:nth-child(5){width:64px}.BPn80q_towerMonument i:nth-child(6){width:48px}.BPn80q_towerMonument b{background:linear-gradient(#6d654e,#292b35);border:1px solid #ffe2a638;border-radius:18px 18px 4px 4px;width:30px;height:48px;box-shadow:0 0 28px #ffe08b32}.BPn80q_towerBossCard{z-index:3;backdrop-filter:blur(18px);background:#0d151db8;border:1px solid #ffffff14;border-radius:24px;align-content:start;justify-items:center;width:190px;min-height:214px;padding:13px;display:grid;position:absolute;top:18px;right:18px;box-shadow:0 17px 38px #0006,inset 0 1px #ffffff0d}.BPn80q_towerBossCard>span{color:#959ed2;letter-spacing:.13em;text-transform:uppercase;font:700 7px/1 ui-sans-serif,system-ui,sans-serif}.BPn80q_towerBossCard .BPn80q_sprite_large{filter:drop-shadow(0 15px 11px #0008);width:132px;height:132px;margin:4px 0 -2px;animation:3s ease-in-out infinite alternate BPn80q_towerGuardian}.BPn80q_towerBossCard>div{justify-items:center;gap:3px;display:grid}.BPn80q_towerBossCard strong{color:#f1f4fb;font-size:14px;font-weight:650}.BPn80q_towerBossCard small{color:#879393;font-size:8px}@keyframes BPn80q_towerGuardian{to{transform:translateY(-6px)}}.BPn80q_towerBrief{z-index:4;grid-template-columns:minmax(0,1fr) 116px;align-items:end;gap:10px;min-height:94px;display:grid;position:absolute;bottom:17px;left:18px;right:18px}.BPn80q_towerBrief>div{backdrop-filter:blur(14px);background:#091119a8;border:1px solid #ffffff10;border-radius:14px;gap:5px;min-width:0;margin-left:0;padding:8px 10px;display:grid;box-shadow:inset 0 1px #ffffff08}.BPn80q_towerBrief>div span{color:#9aa9aa;font-size:7px;line-height:1.45;display:block}.BPn80q_towerBrief>button{color:#07130f;cursor:pointer;background:linear-gradient(135deg,#9be8d1,#78cdb7);border:1px solid #b5f5e03b;border-radius:16px;justify-content:space-between;align-items:center;height:50px;padding:0 13px;font-size:9px;font-weight:760;transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s;display:flex;box-shadow:0 13px 28px #50b99a2c,inset 0 1px #ffffff75}.BPn80q_towerBrief>button b{font-size:16px;font-weight:400}.BPn80q_towerBrief>button:not(:disabled):hover{transform:translateY(-3px);box-shadow:0 17px 36px #50b99a3c,inset 0 1px #ffffff75}.BPn80q_towerBrief>button:disabled{opacity:.38;cursor:not-allowed}.BPn80q_towerMetrics{grid-template-columns:repeat(3,1fr);gap:7px;margin-top:8px;display:grid}.BPn80q_towerMetrics article{background:linear-gradient(145deg,#151f29ad,#0d151dae);border:1px solid #fff1;border-radius:19px;align-content:center;gap:7px;min-height:78px;padding:11px 13px;display:grid;box-shadow:inset 0 1px #ffffff09}.BPn80q_towerMetrics span{color:#778a86;font-size:7px}.BPn80q_towerMetrics b{color:#e6efed;font:400 23px/1 ui-monospace,monospace}.BPn80q_towerRoute{background:#101820a8;border:1px solid #fff1;border-radius:21px;margin-top:8px;padding:12px}.BPn80q_towerRoute>header{justify-content:space-between;align-items:center;display:flex}.BPn80q_towerRoute>header span{color:#c9d6d2;font-size:9px;font-weight:650}.BPn80q_towerRoute>header small{color:#566a65;letter-spacing:.15em;font-size:6px}.BPn80q_towerRoute>div{grid-template-columns:repeat(5,1fr);gap:5px;margin-top:14px;display:grid;position:relative}.BPn80q_towerRoute>div:before{content:\"\";background:linear-gradient(90deg,#5ee0ba42,#9a9fce38);height:1px;position:absolute;top:8px;left:8%;right:8%}.BPn80q_towerRoute article{color:#5e706d;justify-items:center;gap:5px;display:grid;position:relative}.BPn80q_towerRoute article i{z-index:1;background:#111a22;border:1px solid #7d8f8a4a;border-radius:50%;width:16px;height:16px;position:relative}.BPn80q_towerRoute article b{font:550 9px/1 ui-monospace,monospace}.BPn80q_towerRoute article span{font-size:6px}.BPn80q_towerRoute .BPn80q_towerRouteCleared i{background:#5ed2ae;border-color:#75dfbf80;box-shadow:0 0 11px #5fe6ba42}.BPn80q_towerRoute .BPn80q_towerRouteActive i{background:#9da4e8;border-color:#c6c9ff;box-shadow:0 0 0 5px #999ff115,0 0 15px #a4aaff55}.BPn80q_panelPage{padding:2px 1px 10px}.BPn80q_pageHeading{gap:12px;margin:2px 3px 15px}.BPn80q_pageHeading h2,.BPn80q_inventoryPanel h2,.BPn80q_logPanel h2{color:#edf6f3;letter-spacing:-.018em;margin-bottom:5px;font-size:18px;font-weight:640}.BPn80q_pageHeading p{color:#758985;font-size:9px;line-height:1.5}.BPn80q_close,.BPn80q_pageHeading button,.BPn80q_continueButton{color:#d9eee8;background:#16242cc2;border-color:#aee8d62d;border-radius:13px;padding:8px 12px;font-size:8px;box-shadow:inset 0 1px #ffffff0a}.BPn80q_close:hover,.BPn80q_pageHeading button:hover,.BPn80q_continueButton:hover{background-color:#22343b;border-color:#bff7e765;transform:translateY(-1px)}.BPn80q_creatureCards{gap:8px}.BPn80q_creatureCard{background:linear-gradient(150deg,#16232cc7,#0d161ec2);border-color:#fff1;border-radius:21px;min-height:181px;padding:10px;box-shadow:inset 0 1px #ffffff0b,0 13px 28px #0002}.BPn80q_creatureCard:hover{background:linear-gradient(150deg,#1b2b35da,#101b23d1);border-color:#c8fff137;transform:translateY(-3px)}.BPn80q_creatureCard strong{font-size:13px;font-weight:650}.BPn80q_creatureCard span{color:#839a94;font-size:8px}.BPn80q_creatureCard small{color:#9aafaa;text-align:center;font-size:7px;line-height:1.4}.BPn80q_creatureCard>.BPn80q_creatureStats{grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;width:100%;margin-top:7px;display:grid}.BPn80q_creatureCard>.BPn80q_creatureStats>span{background:#0c171e70;border:1px solid #ffffff14;border-radius:7px;place-items:center;gap:2px;min-width:0;margin:0;padding:4px 2px;line-height:1;display:grid}.BPn80q_creatureStats b{color:#d9ede7;font:780 9px/1 ui-monospace,monospace}.BPn80q_partyIndex{border-radius:9px;top:10px;left:10px;box-shadow:0 7px 16px #54cbaa3b;background:#92e4ca!important}.BPn80q_dexGrid{gap:6px}.BPn80q_dexCard{background:linear-gradient(150deg,#131e27b5,#0c141bbb);border-color:#ffffff0e;border-radius:18px;min-height:148px}.BPn80q_dexNumber{color:#5c7470;font-size:7px}.BPn80q_dexCard strong{font-size:10px}.BPn80q_dexCard small{color:#78928c;font-size:7px}.BPn80q_dexCard>span:last-child{color:#6f8581;font-size:6px}.BPn80q_inventoryLayout{gap:9px}.BPn80q_inventoryPanel,.BPn80q_logPanel{background:linear-gradient(150deg,#141f28b8,#0d151db3);border-color:#ffffff10;border-radius:22px;padding:13px;box-shadow:inset 0 1px #ffffff09}.BPn80q_coreGrid{gap:5px;margin:11px 0 17px}.BPn80q_coreCard{background:#111b23b8;border-color:#ffffff10;border-radius:15px;min-height:97px;box-shadow:inset 0 1px #ffffff09}.BPn80q_coreCard strong{color:#a9bcb8;font-size:8px;font-weight:620}.BPn80q_coreCard b{font-size:15px;font-weight:550}.BPn80q_growthList{gap:6px}.BPn80q_growthRow{background:#111b23a3;border-color:#ffffff10;border-radius:15px;grid-template-columns:37px minmax(92px,1fr) minmax(0,1.45fr);gap:7px;padding:7px}.BPn80q_growthRow strong{font-size:8px}.BPn80q_growthRow small{color:#728883;font-size:6px}.BPn80q_growthActions button{background:#172229;border-color:currentColor;border-radius:9px;height:37px}.BPn80q_statsGrid{gap:6px}.BPn80q_statsGrid span{color:#708681;background:#101a22a6;border-color:#ffffff0f;border-radius:14px;padding:11px;font-size:8px}.BPn80q_statsGrid b{color:#d7eee7;font-size:20px;font-weight:450}.BPn80q_logPanel li{border-color:#ffffff0e;font-size:8px}.BPn80q_itemTooltip,.BPn80q_idleClaimTooltip{backdrop-filter:blur(20px);background:#0a1118ed;border-color:#e3fff21d;box-shadow:0 20px 55px #000c}.BPn80q_starterModal,.BPn80q_rewardModal{background:radial-gradient(circle at 50% 0,#8ee2ca12,#0000 38%),linear-gradient(160deg,#16232c,#0b1219);border-color:#ffffff1b;border-radius:28px;box-shadow:0 35px 100px #000e,inset 0 1px #ffffff12}.BPn80q_starterGrid button{background:linear-gradient(145deg,#17242d,#0e171f);border-color:#ffffff10;border-radius:20px}.BPn80q_starterGrid button:hover{background:linear-gradient(145deg,#1d3038,#111d25);border-color:#a7edda43;transform:translateY(-3px)}.BPn80q_rewardBackdrop{backdrop-filter:blur(16px);background:#030609ca}.BPn80q_rewardModal>p{color:#e7cf8e;font-size:7px}.BPn80q_rewardItem{background:linear-gradient(150deg,#17232b,#0d151c);border-color:currentColor;border-radius:18px;box-shadow:inset 0 1px #ffffff0e,0 12px 30px #0003}.BPn80q_toast{color:#e7f3ef;backdrop-filter:blur(20px);background:#16232bea;border-color:#dffcf522;box-shadow:0 15px 40px #0009}.BPn80q_battleBackdrop{padding:5px}.BPn80q_battlePanel{background:radial-gradient(circle at 50% 0,#527d9320,#0000 27%),linear-gradient(160deg,#0f1922,#090f16 72%);border:1px solid #e3fff018;border-radius:29px;padding:8px 10px 12px;box-shadow:0 38px 100px #000d,inset 0 1px #ffffff0d}.BPn80q_battlePanel>header{background:linear-gradient(#0f1922e8 72%,#0000);border-color:#fff1;min-height:38px}.BPn80q_battlePanel h2{font-size:14px;font-weight:650}.BPn80q_battleHeader>div span{color:#718984;font-size:7px}.BPn80q_wildBanner{background:radial-gradient(at 23% 86%,#9787bc3b 0 13%,#0000 43%),radial-gradient(circle at 88% 8%,#67c9b317,#0000 34%),linear-gradient(145deg,#17242e,#0d161e);border-color:#ffffff12;border-radius:24px;min-height:128px;box-shadow:inset 0 1px #ffffff0c}.BPn80q_wildBanner .BPn80q_sprite_medium{filter:drop-shadow(0 16px 12px #0009);width:112px;height:112px}.BPn80q_enemyAura{filter:blur(3px);background:radial-gradient(#c5b2df48,#0000 68%);width:126px}.BPn80q_enemyIntent{backdrop-filter:blur(14px);background:#231920bf;border-color:#f0abc52c}.BPn80q_hpBar{background:#202d34;border-color:#ffffff0d}.BPn80q_hpBar i{background:linear-gradient(90deg,#64c69b,#9ed184);box-shadow:0 0 10px #65d4a336}.BPn80q_matchBattleLayout{gap:7px}.BPn80q_partyBattleList{gap:5px}.BPn80q_partyCombatant{background:linear-gradient(145deg,#151f28,#0d161d);border-color:#ffffff10;border-radius:15px;min-height:82px}.BPn80q_partyCombatantActive{background:linear-gradient(145deg,#19302f,#102020);border-color:#88dbc33e;box-shadow:0 8px 20px #0003}.BPn80q_boardColumn{background:linear-gradient(145deg,#121c24,#0a1118);border-color:#ffffff10;border-radius:21px;padding:6px;box-shadow:inset 0 1px #ffffff09}.BPn80q_turnSummaryBoss{background:linear-gradient(90deg,#5d27352b,#39253d20);border-color:#e08a9c2b}.BPn80q_matchBoard{background:linear-gradient(145deg,#071016,#0c151c);border-color:#ffffff17;border-radius:22px;box-shadow:inset 0 1px #ffffff0b,inset 0 -20px 40px #0204053d,0 15px 28px #0003}.BPn80q_matchTile{border-color:#fff2;border-radius:34%;box-shadow:inset 0 1px #ffffff28,0 4px 8px #0005}.BPn80q_matchTile:after{background:#ffffff3b}.BPn80q_tile_lumen{background:linear-gradient(145deg,#efd487,#a6783e)}.BPn80q_tile_forge{background:linear-gradient(145deg,#ed8f80,#a64d57)}.BPn80q_tile_relay{background:linear-gradient(145deg,#8acfe3,#4c7faa)}.BPn80q_tile_aegis{background:linear-gradient(145deg,#8bd4aa,#477d65)}.BPn80q_tile_glitch{background:linear-gradient(145deg,#c893d5,#76568f)}.BPn80q_capturePanel,.BPn80q_towerBattleStatus{background:linear-gradient(145deg,#151f28,#0d161d);border-color:#ffffff10;border-radius:16px}.BPn80q_captureButtons button{background:#162129;border-radius:10px}.BPn80q_skillButton{background:#251f2c;border-color:#c0a3cc31}@media (width<=800px){.BPn80q_launcher{border-radius:20px;width:56px;height:56px}.BPn80q_launcherOpen{border-radius:15px;width:43px;height:43px;top:max(14px,50vh - 426px)}.BPn80q_overlay{width:min(448px,100vw - 12px);height:min(866px,100dvh - 12px)}.BPn80q_headerStats .BPn80q_miniCore:nth-of-type(n+4){display:inline-flex}}@media (width<=470px){.BPn80q_overlay{border:1px solid #dffff633;border-radius:27px;width:calc(100vw - 10px);height:calc(100dvh - 10px)}.BPn80q_overlay:after{border-radius:22px;display:block}.BPn80q_header{padding-right:54px}.BPn80q_brand p{max-width:105px}.BPn80q_headerStats .BPn80q_miniCore:nth-of-type(n+4){display:none}.BPn80q_tabs{margin-inline:8px}.BPn80q_tabs button>small{font-size:6.5px}.BPn80q_mapFrame{grid-template-rows:auto minmax(450px,1fr) auto;min-height:575px}.BPn80q_worldMap{min-height:450px}.BPn80q_towerHero{min-height:370px}.BPn80q_towerMonument{transform-origin:0 100%;left:13px;transform:scale(.9)}.BPn80q_towerBossCard{width:177px;right:12px}.BPn80q_towerBrief{left:12px;right:12px}.BPn80q_towerBrief>div{margin-left:0}.BPn80q_towerMetrics article{padding-inline:9px}.BPn80q_battlePanel{border-radius:25px}}@media (prefers-reduced-motion:reduce){.BPn80q_overlay,.BPn80q_overlay:before,.BPn80q_mapRadar b,.BPn80q_mapAtmosphere i,.BPn80q_encounter,.BPn80q_encounterPulse,.BPn80q_encounterEnhanced,.BPn80q_towerBossCard .BPn80q_sprite_large{animation:none}}.BPn80q_overlay{--surface:#ffffffa8;--surface-raised:#fffffff0;--line:#26464e16;--line-strong:#26464e2c;--text:#20353b;--muted:#718488;--accent:#4fa88e;--violet:#777abf;left:calc(50% + var(--window-x,0px));top:calc(50% + var(--window-y,0px));color:var(--text);background:radial-gradient(circle at 91% 4%,#c7c8ff82 0 12%,#0000 36%),radial-gradient(circle at 1% 76%,#bcebdc8f 0 17%,#0000 42%),radial-gradient(circle at 76% 91%,#ffd9c46b 0 10%,#0000 35%),linear-gradient(155deg,#f9f8f2 0%,#eef5f3 55%,#f5f1f2 100%);border-color:#ffffffd6;box-shadow:0 34px 90px #41525b32,0 0 0 1px #49636b1a,inset 0 1px #fff}.BPn80q_overlay:before{opacity:.55;background:radial-gradient(circle,#9fa8ed4d,#0000 68%)}.BPn80q_overlay:after{border-color:#ffffffad;box-shadow:inset 0 0 0 1px #49636b0b}.BPn80q_overlayDragging{user-select:none;transition:none}.BPn80q_overlayDragging .BPn80q_header{cursor:grabbing}.BPn80q_launcher{color:#355c5a;background:radial-gradient(circle at 28% 19%,#fff,#0000 35%),linear-gradient(145deg,#fbfffc,#dceae6 72%);border-color:#ffffffd6;box-shadow:0 18px 45px #42605c3d,inset 0 1px #fff,0 0 0 6px #7bd7bd12}.BPn80q_launcher:before{background:linear-gradient(135deg,#ffffffb0,#0000 58%);border-color:#506b6815}.BPn80q_launcher:hover{background:#fff;border-color:#75bca8b8;box-shadow:0 22px 52px #42605c45,inset 0 1px #fff}.BPn80q_launcherOpen{backdrop-filter:blur(20px);background:#fffaf8df;border-color:#ffffffd9;inset:18px 18px auto auto;box-shadow:0 12px 30px #5b64762b,inset 0 1px #fff}.BPn80q_launcherCore,.BPn80q_logoCore{background:radial-gradient(circle,#fafffd 0 17%,#79cfb4 18% 25%,#dff4ec 26% 53%,#68bfa7 54% 58%,#fff 59%);border:1px solid #4ba68c78;border-radius:50%;width:29px;height:29px;position:relative;transform:none;box-shadow:inset 0 1px #fff,0 6px 14px #428a7642,0 0 0 4px #5bc09f0d}.BPn80q_launcherCore:before,.BPn80q_logoCore:before{content:\"\";border-top:1px solid #477a728a;border-bottom:1px solid #477a728a;border-radius:50%;height:7px;position:absolute;top:50%;left:3px;right:3px;transform:translateY(-50%)rotate(-31deg)}.BPn80q_launcherCore:after,.BPn80q_logoCore:after{content:\"\";background:#7477bd;border-radius:50%;width:5px;height:5px;position:absolute;top:5px;right:2px;box-shadow:0 1px 4px #7378ba88}.BPn80q_launcherOpen .BPn80q_launcherCore{box-shadow:none;filter:none;background:0 0;border:0;transform:none}.BPn80q_launcherOpen .BPn80q_launcherCore:before,.BPn80q_launcherOpen .BPn80q_launcherCore:after{content:\"\";width:19px;height:2px;box-shadow:none;background:#655a69;border:0;border-radius:999px;position:absolute;top:13px;left:5px;right:auto;transform:rotate(45deg)}.BPn80q_launcherOpen .BPn80q_launcherCore:after{transform:rotate(-45deg)}.BPn80q_logoCore{flex:none;width:31px;height:31px}.BPn80q_badge{color:#fff;background:#e8799d;border-color:#fff;box-shadow:0 6px 15px #d55e864d}.BPn80q_header{cursor:grab;touch-action:none;user-select:none;backdrop-filter:blur(28px)saturate(125%);background:linear-gradient(#fffffff0,#f6faf7c9)}.BPn80q_header:after{background:linear-gradient(90deg,#0000,#52766e22 18% 82%,#0000)}.BPn80q_brand h1{color:#21393e}.BPn80q_brand p{color:#7a8d8e}.BPn80q_dragHandle{opacity:.68;background:#fff5;border:1px solid #52736d12;border-radius:999px;gap:3px;padding:4px 7px;display:flex;position:absolute;top:10px;left:50%;transform:translate(-50%)}.BPn80q_dragHandle i{background:#79908c;border-radius:50%;width:3px;height:3px}.BPn80q_miniCore{color:var(--core-color);border-color:color-mix(in srgb, var(--core-color) 30%, transparent);background:color-mix(in srgb, var(--core-color) 8%, white);position:relative;overflow:hidden;box-shadow:inset 0 1px #fff}.BPn80q_miniCore:before{content:\"\";opacity:.16;border:1px solid;border-radius:5px;width:15px;height:15px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(45deg)}.BPn80q_online{color:#347d68;box-shadow:none;background:#6fc5a61d;border-color:#4ea98b3d}.BPn80q_offline{color:#bd5875;background:#ee769519;border-color:#df6a8a3b}.BPn80q_idleClaimButton{color:#a1782f;background:#fff8e6e0;border-color:#d9b65d48;box-shadow:inset 0 1px #fff,0 7px 18px #8f793026}.BPn80q_rewardCrate{background:linear-gradient(135deg,#f5cf72,#c69a43);border-color:#a57c2e;box-shadow:inset 0 0 0 2px #fff4cb5c}.BPn80q_rewardCrate:before{background:#e4b85e;border-color:#a57c2e}.BPn80q_rewardCrate:after{background:#fff1af;box-shadow:0 8px 0 1px #a47a31}.BPn80q_idleClaimTooltip{color:#354543;background:#fffdf5f3;border-color:#ffffffcf;box-shadow:0 18px 48px #5f6d6833}.BPn80q_idleClaimTooltip>strong{color:#8d6b2d}.BPn80q_idleClaimTooltip>small{color:#75847f}.BPn80q_tabs{background:#ffffff82;border-color:#55736d13;box-shadow:inset 0 1px #fff,0 4px 13px #6477700c}.BPn80q_tabs button{color:#7b8a89}.BPn80q_tabs button:hover{color:#345b58;background:#ffffff9c}.BPn80q_tabs .BPn80q_tabActive{color:#294b49;background:linear-gradient(145deg,#fff,#eaf4f0);box-shadow:inset 0 0 0 1px #6a978c22,0 6px 16px #5e797023}.BPn80q_tabs .BPn80q_tabActive>span{color:#4ca88c;text-shadow:none}.BPn80q_content{scrollbar-color:#75a69750 transparent;background:linear-gradient(#0000,#d9e8e336)}.BPn80q_content::-webkit-scrollbar-thumb{background:#75a69750}.BPn80q_footer{color:#82918f;background:#f5f8f4bc;border-color:#55736d12}.BPn80q_centerMessage{color:#557a75}.BPn80q_core_pebble{--core-color:#7b9398;--core-light:#e6eef0;color:#6f888e}.BPn80q_core_pulse{--core-color:#44b28f;--core-light:#d9f7ec;color:#319b7b}.BPn80q_core_prism{--core-color:#5d94d5;--core-light:#dfedff;color:#5088ca}.BPn80q_core_nova{--core-color:#9a72cf;--core-light:#efe2ff;color:#8b61c2}.BPn80q_core_origin{--core-color:#d6a63e;--core-light:#fff2bf;color:#bb8c28}.BPn80q_bigCore{clip-path:polygon(50% 0,82% 13%,100% 50%,82% 87%,50% 100%,18% 87%,0 50%,18% 13%);background:linear-gradient(145deg, #fff 0 14%, var(--core-light) 15% 43%, var(--core-color) 44% 59%, #fff 60% 71%, var(--core-color) 72%);width:42px;height:42px;box-shadow:none;border:0;border-radius:0;position:relative;transform:none;filter:drop-shadow(0 7px 7px color-mix(in srgb, var(--core-color) 32%, transparent))!important}.BPn80q_bigCore:before{content:\"\";border:1px solid color-mix(in srgb, var(--core-color) 70%, white);background:radial-gradient(circle at 36% 28%, #fff 0 14%, var(--core-light) 15% 42%, var(--core-color) 43% 100%);border-radius:50%;position:absolute;inset:8px;box-shadow:inset 0 0 0 3px #ffffff73}.BPn80q_bigCore:after{content:\"\";background:#fff;border-radius:50%;width:6px;height:6px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 8px #fff}.BPn80q_materialShard{clip-path:polygon(50% 0,88% 22%,100% 65%,68% 100%,32% 100%,0 65%,12% 22%);background:linear-gradient(135deg, #fff 0 13%, var(--core-light) 14% 38%, var(--core-color) 39% 61%, color-mix(in srgb, var(--core-color) 68%, #fff) 62% 100%);filter:drop-shadow(0 6px 6px color-mix(in srgb, var(--core-color) 27%, transparent));opacity:1;border-radius:4px;position:relative}.BPn80q_materialShard:before{content:\"\";background:#ffffff9c;width:1px;position:absolute;top:4px;bottom:5px;left:48%;transform:rotate(12deg)}.BPn80q_captureButtons i,.BPn80q_captureRow i{clip-path:polygon(50% 0,88% 20%,100% 50%,78% 88%,50% 100%,18% 82%,0 50%,18% 18%);background:linear-gradient(145deg, #fff, currentColor 48%, color-mix(in srgb, currentColor 60%, #fff));width:14px;height:14px;box-shadow:none;filter:drop-shadow(0 2px 3px color-mix(in srgb, currentColor 35%, transparent));border:0;border-radius:0;transform:none}.BPn80q_mapIntro span,.BPn80q_towerHeading span{color:#3f9f83}.BPn80q_mapIntro h2,.BPn80q_towerHeading h2{color:#24393e}.BPn80q_mapIntro p,.BPn80q_towerHeading p{color:#748789}.BPn80q_mapRadar{background:radial-gradient(circle,#7bcab02a,#0000 67%);border-color:#53988832}.BPn80q_mapRadar i{border-color:#559d8b28}.BPn80q_mapRadar i:nth-child(3){background:#4eac8f;box-shadow:0 0 11px #55b99b7d}.BPn80q_mapRadar b{background:linear-gradient(#4da88d,#0000)}.BPn80q_worldMap{background:radial-gradient(at 13% 14%,#9ce9e3a8 0 7%,#0000 31%),radial-gradient(at 84% 18%,#ffd3ae9c 0 9%,#0000 32%),radial-gradient(at 52% 6%,#c9bdffa0 0 8%,#0000 29%),radial-gradient(at 18% 82%,#b7e8b8a6 0 11%,#0000 35%),radial-gradient(at 87% 84%,#f5b5cc9c 0 10%,#0000 33%),linear-gradient(155deg,#e8f4f1 0%,#f1f0ea 52%,#f5eeed 100%);border-color:#ffffffbf;box-shadow:inset 0 1px #fff,inset 0 -50px 100px #c5d8d129,0 18px 40px #62766d1b}.BPn80q_worldMap:before{opacity:.42;background-image:linear-gradient(#456b6510 1px,#0000 1px),linear-gradient(90deg,#456b6510 1px,#0000 1px)}.BPn80q_worldMap:after{border-color:#ffffffa8}.BPn80q_mapAtmosphere i{opacity:.24}.BPn80q_mapRoutes{opacity:.42}.BPn80q_mapRoutes i{background:linear-gradient(#547c7452,#0000)}.BPn80q_regionLabel{color:#4c6663;background:#ffffff9e;border-color:#ffffffb8;box-shadow:0 7px 18px #5c71691a}.BPn80q_encounter{color:#263c40;box-shadow:none;backdrop-filter:none;background:0 0}.BPn80q_encounterAvatar{background:linear-gradient(155deg,#f7fbfa,#c9ded8);border-color:#ffffffed;box-shadow:0 10px 22px #5970693b,inset 0 0 0 2px #ffffffb8}.BPn80q_encounterName{color:#2a4245;text-shadow:0 1px 5px #fff}.BPn80q_encounterMeta{color:#718783;text-shadow:0 1px 4px #fff}.BPn80q_encounter:hover{background:0 0}.BPn80q_encounterPulse{border-color:currentColor}.BPn80q_mapEmpty{color:#667f7a}.BPn80q_mapLegend span{color:#607773;background:#ffffff9e;border-color:#ffffffb5;box-shadow:0 4px 13px #60766f14}.BPn80q_towerHeading>strong{color:#7d7fbc}.BPn80q_towerHero{background:radial-gradient(circle at 20% 48%,#afb5f58c,#0000 33%),radial-gradient(circle at 83% 28%,#9ce2d29c,#0000 30%),linear-gradient(145deg,#f3f2fa 0%,#edf5f1 55%,#f8f3ef 100%);border-color:#ffffffc7;box-shadow:inset 0 1px #fff,0 18px 40px #6c718822}.BPn80q_towerHero:before{opacity:.5;background-image:linear-gradient(#5c648b0d 1px,#0000 1px),linear-gradient(90deg,#5c648b0d 1px,#0000 1px)}.BPn80q_towerHero:after{background:radial-gradient(#9297da47,#0000 67%)}.BPn80q_towerMonument i{background:linear-gradient(90deg,#b8bbe0,#e4e3f6 48%,#aeb8d6);border-color:#858bc447;box-shadow:inset 0 1px #ffffffb8}.BPn80q_towerMonument b{background:linear-gradient(#ffe9a6,#b9b7c8);border-color:#d3ad5b63;box-shadow:0 0 28px #e3bd5d52}.BPn80q_towerBossCard{background:#ffffffe0;border-color:#ffffffd8;box-shadow:0 15px 34px #69787629,inset 0 1px #fff}.BPn80q_towerBossCard>span{color:#7477ad}.BPn80q_towerBossCard strong{color:#2d3c42}.BPn80q_towerBossCard small{color:#738481}.BPn80q_towerBrief>div{background:#ffffffe0;border-color:#ffffffcf;box-shadow:inset 0 1px #fff,0 8px 20px #667a7420}.BPn80q_towerBrief>div span{color:#647976}.BPn80q_towerBrief>div span:first-child{color:#6569a6}.BPn80q_towerBrief>button{color:#153b32;background:linear-gradient(135deg,#83d6bd,#a4e5d2);border-color:#ffffffd1;box-shadow:0 12px 27px #53ab9035,inset 0 1px #ffffffb5}.BPn80q_towerMetrics article,.BPn80q_towerRoute{background:#ffffffa6;border-color:#ffffffc2;box-shadow:inset 0 1px #fff,0 8px 22px #60746c12}.BPn80q_towerMetrics span{color:#72847f}.BPn80q_towerMetrics b{color:#354b4e}.BPn80q_towerRoute>header span{color:#3f5656}.BPn80q_towerRoute>header small{color:#81908d}.BPn80q_towerRoute>div:before{background:linear-gradient(90deg,#55b69771,#8a8fc264)}.BPn80q_towerRoute article{color:#71827e}.BPn80q_towerRoute article i{background:#f7faf7;border-color:#7f94905c}.BPn80q_towerRoute .BPn80q_towerRouteCleared{color:#389a7d}.BPn80q_towerRoute .BPn80q_towerRouteActive{color:#666bae}.BPn80q_pageHeading h2,.BPn80q_inventoryPanel h2,.BPn80q_logPanel h2{color:#263b40}.BPn80q_pageHeading p{color:#718487}.BPn80q_close,.BPn80q_pageHeading button,.BPn80q_continueButton{color:#345952;background:#ffffffa8;border-color:#6fa99733;box-shadow:inset 0 1px #fff,0 5px 14px #60736b12}.BPn80q_pageHeading button{background:linear-gradient(135deg,#dff2eb,#cde8df);border-color:#64ad964d}.BPn80q_close:hover,.BPn80q_pageHeading button:hover,.BPn80q_continueButton:hover{background:#fff;border-color:#5da58f80}.BPn80q_creatureCard,.BPn80q_dexCard{color:#304447;background:linear-gradient(150deg,#ffffffe5,#edf4f1c9);border-color:#ffffffc7;box-shadow:inset 0 1px #fff,0 11px 25px #62776f1c}.BPn80q_creatureCard:hover{background:#fffffff2;border-color:#6bb19c6b}.BPn80q_creatureSelected{background:linear-gradient(150deg,#e5f6ef,#d7eee6);border-color:#62b39870;box-shadow:inset 0 1px #fff,0 0 25px #5fb49622}.BPn80q_creatureCard strong,.BPn80q_dexCard strong{color:#2e4345}.BPn80q_creatureCard span,.BPn80q_creatureCard small,.BPn80q_dexCard small,.BPn80q_dexCard>span:last-child{color:#708682}.BPn80q_creatureCard>.BPn80q_creatureStats>span{background:#f2f8f5b8;border-color:#6e9b8c20}.BPn80q_creatureStats b{color:#345952}.BPn80q_partyIndex{box-shadow:0 6px 15px #63bda33a;color:#21443a!important;background:#a5e7d2!important}.BPn80q_dexSeen{border-color:#9bb7b14f}.BPn80q_dexCaught{background:linear-gradient(150deg,#f6fffb,#dff2ec);border-color:#64b49a62}.BPn80q_dexNumber{color:#82938f}.BPn80q_inventoryPanel,.BPn80q_logPanel{background:#ffffffa8;border-color:#ffffffc7;box-shadow:inset 0 1px #fff,0 10px 26px #60746d15}.BPn80q_coreCard{background:linear-gradient(155deg,#ffffffdb,#edf2efe0);border-color:#ffffffd1;box-shadow:inset 0 1px #fff,0 8px 20px #687a7415}.BPn80q_coreCard strong{color:#526966}.BPn80q_materialCard{background:linear-gradient(155deg,#ffffffe3,#eef2f4d1)}.BPn80q_growthRow{background:#ffffffad;border-color:#ffffffc7;box-shadow:inset 0 1px #fff}.BPn80q_growthRow strong{color:#38504f}.BPn80q_growthRow small{color:#738783}.BPn80q_growthActions button{background:#f5f7f4;box-shadow:inset 0 1px #fff}.BPn80q_growthActions button small{color:#778783}.BPn80q_growthSelector,.BPn80q_growthSelected{background:#ffffffad;border-color:#ffffffc7;box-shadow:inset 0 1px #fff}.BPn80q_growthSelector>span,.BPn80q_growthSummary strong{color:#38504f}.BPn80q_growthSelector>small,.BPn80q_growthSummary span,.BPn80q_growthSummary small{color:#738783}.BPn80q_growthSelector select{color:#38504f;background:#f5f9f7;border-color:#668b8026;box-shadow:inset 0 1px #fff}.BPn80q_growthSelector select:focus{border-color:#6aab9870;box-shadow:0 0 0 2px #6aab9818}.BPn80q_growthXpTrack{background:#dfeae5}.BPn80q_idleReward{color:#837334;background:#fff8dcb8;border-color:#c3aa5a38}.BPn80q_statsGrid span{color:#748783;background:#ffffffa8;border-color:#ffffffc4;box-shadow:inset 0 1px #fff}.BPn80q_statsGrid b{color:#344d4d}.BPn80q_logPanel li{border-color:#54756d14}.BPn80q_logPanel time{color:#7c8d89}.BPn80q_logPanel p{color:#627a76}.BPn80q_itemTooltip{color:#364a49;background:#fffdf8f3;border-color:#ffffffd6;box-shadow:0 18px 48px #5c6c6635}.BPn80q_itemTooltip small{color:#6f7f7c}.BPn80q_modalBackdrop,.BPn80q_battleBackdrop{backdrop-filter:blur(18px)saturate(110%);background:radial-gradient(circle at 50% 25%,#b9dcd0a3,#0000 48%),#edf1eecc}.BPn80q_rewardBackdrop{background:#e8eeeaca}.BPn80q_starterModal,.BPn80q_rewardModal{background:radial-gradient(circle at 50% 0,#bde9dc73,#0000 38%),linear-gradient(160deg,#fff,#eff4f1);border-color:#ffffffdc;box-shadow:0 30px 85px #536a613d,inset 0 1px #fff}.BPn80q_starterModal h2,.BPn80q_rewardModal>h2{color:#2d4142}.BPn80q_starterModal>p{color:#70827e}.BPn80q_starterGrid button{color:#304746;background:linear-gradient(145deg,#fff,#edf4f1);border-color:#ffffffce;box-shadow:0 8px 20px #60776d1a}.BPn80q_starterGrid button:hover{background:#fff;border-color:#65ad9775}.BPn80q_starterGrid span,.BPn80q_starterGrid small{color:#718681}.BPn80q_starterGrid b{color:#377f6b;background:#e2f4ed;border-color:#5bac925f}.BPn80q_rewardModal>p{color:#a0772c}.BPn80q_rewardModal>small{color:#768782}.BPn80q_rewardHalo{background:radial-gradient(circle,#ffe17e59,#0000 70%)}.BPn80q_rewardItem{border-color:color-mix(in srgb, var(--core-color) 45%, white);background:linear-gradient(150deg,#fff,#f1f4f1);box-shadow:inset 0 1px #fff,0 12px 28px #63756f1e}.BPn80q_rewardItem>strong{color:#3f5453}.BPn80q_toast{color:#3c5551;background:#fffffff0;border-color:#ffffffd6;box-shadow:0 14px 38px #596c6535}.BPn80q_battleBackdrop{background:radial-gradient(circle at 50% 12%,#cbd7f0a3,#0000 40%),#e9eeebdf}.BPn80q_battlePanel{background:radial-gradient(circle at 50% 0,#c9e4dc86,#0000 28%),linear-gradient(160deg,#f8faf6,#eaf1ee 72%);border-color:#ffffffd8;box-shadow:0 32px 90px #53655e45,inset 0 1px #fff}.BPn80q_battlePanel>header{background:linear-gradient(#f7faf6ee 72%,#0000);border-color:#54756d16}.BPn80q_battlePanel h2{color:#293f42}.BPn80q_battleHeader>div span{color:#718680}.BPn80q_battleHeader .BPn80q_flee{color:#b45070;background:#fff0f4bd;border-color:#d878963d}.BPn80q_wildBanner{background:radial-gradient(at 23% 86%,#c6b8e297 0 14%,#0000 44%),radial-gradient(circle at 88% 8%,#9edacb80,#0000 35%),linear-gradient(145deg,#f9f7fb,#e9f1ee);border-color:#ffffffd1;box-shadow:inset 0 1px #fff,0 9px 23px #61736d1b}.BPn80q_enemyAura{background:radial-gradient(#aa91c260,#0000 68%)}.BPn80q_fighterName{color:#34494b}.BPn80q_fighterName span{color:#718480}.BPn80q_enemyIntent{background:#fff5f8d9;border-color:#d07c9945}.BPn80q_enemyIntent span{color:#a0647e}.BPn80q_enemyIntent strong{color:#a94368}.BPn80q_enemyIntent small{color:#9b6377}.BPn80q_wildVitals small{color:#6f8580}.BPn80q_hpBar{background:#d8e2de;border-color:#ffffffc2;box-shadow:inset 0 1px #8ea19a2b}.BPn80q_hpBar i{background:linear-gradient(90deg,#57b78f,#92ca7a)}.BPn80q_hpWild i{background:linear-gradient(90deg,#dc9360,#edbe6f)}.BPn80q_hpWild em{background:linear-gradient(90deg,#d45e7b,#df7b8d)}.BPn80q_partyCombatant{background:linear-gradient(145deg,#ffffffdf,#edf3f0d9);border-color:#ffffffc9;box-shadow:inset 0 1px #fff,0 7px 17px #60746d16}.BPn80q_partyCombatantActive{background:linear-gradient(145deg,#f4fffb,#dcefe8);border-color:#65b09662}.BPn80q_partySlot{color:#47776b;background:#dcebe5}.BPn80q_partyCombatantBody small{color:#6d837e}.BPn80q_boardColumn{background:linear-gradient(145deg,#f7faf7,#e5ece8);border-color:#fffc;box-shadow:inset 0 1px #fff,0 10px 22px #65776f1b}.BPn80q_turnSummary{color:#354c4b}.BPn80q_turnSummaryBoss{color:#8e4d63;background:linear-gradient(90deg,#f7dce442,#eadbf24a);border-color:#cf718d31}.BPn80q_ecologyPip{background:#ffffffb8}.BPn80q_actionDots i{background:#dbe5e1;border-color:#8aa09a}.BPn80q_actionDots .BPn80q_actionDotActive{background:#64bea2;border-color:#4fa88b;box-shadow:0 0 8px #58af9445}.BPn80q_matchBoard{background:linear-gradient(145deg,#dde6e1,#eef2ef);border-color:#ffffffdc;box-shadow:inset 0 1px #fff,inset 0 -20px 40px #aebfb72c,0 13px 27px #65766f26}.BPn80q_matchTile{border-color:#ffffff8f;box-shadow:inset 0 1px #ffffff70,0 4px 8px #60716b3b}.BPn80q_capturePanel,.BPn80q_towerBattleStatus{background:linear-gradient(145deg,#ffffffe0,#eaf1edda);border-color:#ffffffcf;box-shadow:inset 0 1px #fff}.BPn80q_capturePanelReady{background:linear-gradient(145deg,#fffaf0,#f4edcf);border-color:#d7b7595b}.BPn80q_capturePanel>div:first-child strong{color:#345b53}.BPn80q_capturePanel>div:first-child span,.BPn80q_capturePanel p{color:#70847f}.BPn80q_captureButtons button{background:#ffffffc7;box-shadow:inset 0 1px #fff}.BPn80q_captureButtons span{color:#556d69}.BPn80q_skipStageButton{color:#806b37;background:#fff8e8c9;border-color:#c9a95b59}.BPn80q_skipStageButton:hover{background:#fffaf0;border-color:#b99743}.BPn80q_skillButton{color:#7c5789;background:#f2eaf5;border-color:#9978aa3b}.BPn80q_towerBattleStatus strong{color:#5b5f8f}.BPn80q_towerBattleStatus small{color:#71837f}.BPn80q_towerBattleStatus>b{color:#676a98;border-color:#7d82b23d}.BPn80q_battleFooterArea .BPn80q_battleLog{color:#637a75;background:#ffffff92;border-color:#ffffffc4}.BPn80q_teamStrikeSummary span{color:#817237;background:#fff8d7;border-color:#c2a6463b}.BPn80q_teamStrikeSummary b{color:#9d7623}.BPn80q_damageBurst{color:#d24c75;text-shadow:0 1px #fff,0 0 13px #f57c9c75}.BPn80q_comboBurst{color:#318c72;text-shadow:0 0 11px #5cd2ae65}@media (width<=470px){.BPn80q_launcherOpen{top:10px;right:10px}.BPn80q_dragHandle{display:none}}.BPn80q_launcher{cursor:grab;touch-action:none;user-select:none;-webkit-user-drag:none}.BPn80q_launcherDragging,.BPn80q_launcherDragging:hover{cursor:grabbing;transition:none;transform:scale(1.035);box-shadow:0 22px 52px #42605c45,inset 0 1px #fff,0 0 0 7px #69c8ac17}.BPn80q_launcherReward{background:radial-gradient(circle at 28% 18%,#fff,#0000 34%),linear-gradient(145deg,#fffdf4,#f8e8bd 74%);border-color:#f0cf74c7;animation:2.35s ease-in-out infinite BPn80q_launcherGiftGlow;box-shadow:0 18px 45px #9b78394a,inset 0 1px #fff,0 0 0 6px #f5c95817}.BPn80q_launcherAvatar{border-radius:inherit;object-fit:cover;object-position:50% 46%;user-select:none;pointer-events:none;-webkit-user-drag:none;filter:saturate(.94)contrast(.98);width:100%;height:100%;display:block;transform:scale(1.045)}.BPn80q_launcherGift{background:linear-gradient(145deg,#ffe49a,#d6a342);border:1px solid #a8792c;border-radius:5px 5px 8px 8px;width:31px;height:25px;margin-top:5px;animation:2.35s cubic-bezier(.22,1,.36,1) infinite BPn80q_launcherGiftBob;display:block;position:relative;box-shadow:inset 0 1px #fff4c6,0 7px 13px #a6772f4a}.BPn80q_launcherGift:before{content:\"\";background:linear-gradient(#fff0b5,#e1b858);border:1px solid #a8792c;border-radius:7px 7px 3px 3px;height:8px;position:absolute;top:-7px;left:-4px;right:-4px;box-shadow:inset 0 1px #fff9dc}.BPn80q_launcherGift:after{content:\"\";background:linear-gradient(90deg,#b3657f,#e28baa,#aa5674);width:5px;position:absolute;top:-8px;bottom:0;left:50%;transform:translate(-50%);box-shadow:0 1px #fff4}.BPn80q_launcherGift i:before,.BPn80q_launcherGift i:after{content:\"\";z-index:2;background:#fff0f3;border:2px solid #bf6483;width:10px;height:8px;position:absolute;top:-15px;box-shadow:inset 0 0 0 1px #fff}.BPn80q_launcherGift i:before{border-radius:8px 2px 7px 3px;right:50%;transform:rotate(21deg)}.BPn80q_launcherGift i:after{border-radius:2px 8px 3px 7px;left:50%;transform:rotate(-21deg)}@keyframes BPn80q_launcherGiftGlow{0%,72%,to{box-shadow:0 18px 45px #9b78393d,inset 0 1px #fff,0 0 0 6px #f5c95812}82%{box-shadow:0 20px 51px #b9893f5c,inset 0 1px #fff,0 0 0 10px #f5c95824}}@keyframes BPn80q_launcherGiftBob{0%,72%,to{transform:translateY(0)rotate(0)}79%{transform:translateY(-3px)rotate(-2deg)}86%{transform:translateY(-1px)rotate(2deg)}}.BPn80q_header{padding-right:57px}.BPn80q_windowClose{z-index:150;color:#655b68;cursor:pointer;backdrop-filter:blur(18px);background:#fffaf8d9;border:1px solid #ffffffd8;border-radius:15px;place-items:center;width:40px;height:40px;padding:0;transition:transform .18s cubic-bezier(.22,1,.36,1),border-color .18s,background .18s;display:grid;position:absolute;top:13px;right:14px;box-shadow:0 9px 23px #6d667b25,inset 0 1px #fff}.BPn80q_windowClose span{font:300 27px/1 ui-sans-serif,system-ui,sans-serif;transform:translateY(-1px)}.BPn80q_windowClose:hover{background:#fff;border-color:#c697a6a6;transform:translateY(-2px)rotate(3deg)}.BPn80q_overlayDockedRight .BPn80q_windowClose{left:14px;right:auto}.BPn80q_battlePanel>header{padding-right:46px}@media (width<=470px){.BPn80q_windowClose{border-radius:14px;width:38px;height:38px;top:10px;right:10px}.BPn80q_overlayDockedRight .BPn80q_windowClose{left:10px;right:auto}.BPn80q_header{padding-right:51px}}@media (prefers-reduced-motion:reduce){.BPn80q_launcherReward,.BPn80q_launcherGift{animation:none}}.BPn80q_settingsPage{color:#2f4143;width:min(720px,100%);margin:0 auto;padding:12px 4px 40px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.BPn80q_settingsHero{background:linear-gradient(145deg,#fff,#edf7f3 62%,#f7f1ff);border:1px solid #78a9982b;border-radius:24px;align-items:center;gap:18px;margin-bottom:22px;padding:22px;display:flex;box-shadow:0 18px 48px #527f7117}.BPn80q_settingsHero img{object-fit:cover;border-radius:22px;width:74px;height:74px;box-shadow:0 12px 26px #4e6f6b26}.BPn80q_settingsHero p{color:#6e988c;letter-spacing:.18em;margin:0 0 3px;font-size:11px;font-weight:800}.BPn80q_settingsHero h2{color:#2d4546;margin:0;font-size:26px;line-height:1.1}.BPn80q_settingsHero span{color:#70817f;margin-top:7px;font-size:13px;line-height:1.55;display:block}.BPn80q_settingsCard{background:#ffffffdb;border:1px solid #769e9226;border-radius:20px;justify-content:space-between;align-items:center;gap:24px;padding:20px 22px;display:flex;box-shadow:0 10px 30px #526f6810}.BPn80q_settingsCard>div{gap:6px;display:grid}.BPn80q_settingsCard strong{color:#304a4b;font-size:15px}.BPn80q_settingsCard>div>span{color:#788885;max-width:470px;font-size:12px;line-height:1.55}.BPn80q_settingsSwitch{color:#667974;cursor:pointer;background:#e9efed;border:1px solid #aabbb6;border-radius:999px;flex:none;width:96px;height:40px;padding:0 12px 0 39px;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;transition:background .2s,border-color .2s,color .2s;position:relative}.BPn80q_settingsSwitch i{background:#fff;border-radius:50%;width:30px;height:30px;transition:transform .22s cubic-bezier(.22,1,.36,1);position:absolute;top:4px;left:4px;box-shadow:0 3px 10px #52645f35}.BPn80q_settingsSwitchOn{color:#fff;background:#74b9a5;border-color:#66a895;padding:0 39px 0 12px}.BPn80q_settingsSwitchOn i{transform:translate(56px)}.BPn80q_settingsSwitch:disabled{cursor:wait;opacity:.58}.BPn80q_settingsStatus,.BPn80q_settingsError{margin:12px 5px 0;font-size:12px;line-height:1.5}.BPn80q_settingsStatus{color:#668078}.BPn80q_settingsError{color:#a35f69}.BPn80q_creatureCard{cursor:default;padding:0;overflow:hidden}.BPn80q_creatureCard:hover{transform:translateY(-2px)}.BPn80q_creatureSelect{width:100%;min-height:172px;color:inherit;cursor:pointer;font:inherit;background:0 0;border:0;flex-direction:column;align-items:center;padding:8px;display:flex}.BPn80q_creatureSelect>strong{color:#2e4345;font-size:14px}.BPn80q_creatureSelect>span:not(.BPn80q_creatureStats),.BPn80q_creatureSelect>small{color:#708682;margin-top:4px;font-size:10px}.BPn80q_creatureSelect>small{text-align:center;margin-top:7px}.BPn80q_creatureSelect>.BPn80q_creatureStats{grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;width:100%;margin-top:7px;display:grid}.BPn80q_creatureSelect>.BPn80q_creatureStats>span{color:#708682;background:#f2f8f5b8;border:1px solid #6e9b8c20;border-radius:7px;place-items:center;gap:2px;min-width:0;margin:0;padding:4px 2px;font-size:8px;line-height:1;display:grid}.BPn80q_releaseButton{z-index:5;color:#a3666e;cursor:pointer;background:#fff5f5dc;border:1px solid #c79ba036;border-radius:10px;place-items:center;width:29px;height:29px;padding:0;transition:transform .16s,background .16s,border-color .16s;display:grid;position:absolute;top:8px;right:8px;box-shadow:0 5px 13px #8c5e6615}.BPn80q_releaseButton span{margin:0;font:700 15px/1 system-ui,sans-serif;transform:rotate(45deg)}.BPn80q_releaseButton:hover:not(:disabled){background:#fff;border-color:#bc747f70;transform:translateY(-1px)}.BPn80q_releaseButton:disabled{cursor:not-allowed;opacity:.34}.BPn80q_releaseModal{color:#3d4b4a;background:#fffdfcf5;border:1px solid #c9aaa74a;border-radius:25px;width:min(330px,100%);padding:22px;animation:.24s cubic-bezier(.22,1,.36,1) both BPn80q_rewardModalIn;box-shadow:0 28px 80px #65565a33}.BPn80q_releaseModal>header{align-items:center;gap:14px;display:flex}.BPn80q_releaseModal>header .BPn80q_sprite{flex:none;width:84px;height:84px}.BPn80q_releaseModal>header p{color:#b06d75;letter-spacing:.18em;margin:0 0 3px;font-size:9px;font-weight:800}.BPn80q_releaseModal h2{color:#4a4145;margin:0;font-size:21px}.BPn80q_releaseModal header strong{color:#7b676a;margin-top:3px;font-size:12px;display:block}.BPn80q_releaseModal>p{color:#746a6c;margin:15px 0;font-size:12px;line-height:1.6}.BPn80q_releaseReward{background:#fff9e9;border:1px solid #d5b26f35;border-radius:17px;align-items:center;gap:10px;padding:10px 12px;display:flex}.BPn80q_releaseReward>span{color:#8b744d;font-size:11px;font-weight:700}.BPn80q_releaseReward>small{color:#977842;margin-left:auto;font-size:10px;font-weight:800}.BPn80q_releaseActions{grid-template-columns:1fr 1fr;gap:9px;margin-top:17px;display:grid}.BPn80q_releaseActions button{color:#526662;cursor:pointer;background:#f4f7f5;border:1px solid #80999135;border-radius:13px;height:39px;font-weight:750}.BPn80q_releaseActions .BPn80q_releaseDanger{color:#fff;background:#aa6670;border-color:#bc7a8345}.BPn80q_releaseActions button:disabled{cursor:wait;opacity:.55}@media (width<=520px){.BPn80q_settingsHero{padding:17px}.BPn80q_settingsHero img{border-radius:18px;width:62px;height:62px}.BPn80q_settingsCard{flex-direction:column;align-items:flex-start}}";
		const tagId = "@nath-vikky/dsh-codekin/tracewild.module.css";
		var tracewild_module_css_default = {
			"actionDotActive": "BPn80q_actionDotActive",
			"actionDots": "BPn80q_actionDots",
			"ambientOrb": "BPn80q_ambientOrb",
			"anomalyGlow": "BPn80q_anomalyGlow",
			"arena": "BPn80q_arena",
			"badge": "BPn80q_badge",
			"battleBackdrop": "BPn80q_battleBackdrop",
			"battleBottom": "BPn80q_battleBottom",
			"battleControls": "BPn80q_battleControls",
			"battleFooterArea": "BPn80q_battleFooterArea",
			"battleHeader": "BPn80q_battleHeader",
			"battleLog": "BPn80q_battleLog",
			"battlePanel": "BPn80q_battlePanel",
			"battleVs": "BPn80q_battleVs",
			"battleWasHit": "BPn80q_battleWasHit",
			"bigCore": "BPn80q_bigCore",
			"biomeBreathe": "BPn80q_biomeBreathe",
			"boardColumn": "BPn80q_boardColumn",
			"boardHelp": "BPn80q_boardHelp",
			"brand": "BPn80q_brand",
			"captureButtons": "BPn80q_captureButtons",
			"capturePanel": "BPn80q_capturePanel",
			"capturePanelReady": "BPn80q_capturePanelReady",
			"captureReady": "BPn80q_captureReady",
			"captureRow": "BPn80q_captureRow",
			"cascadeIn": "BPn80q_cascadeIn",
			"cascadePill": "BPn80q_cascadePill",
			"centerMessage": "BPn80q_centerMessage",
			"close": "BPn80q_close",
			"comboBurst": "BPn80q_comboBurst",
			"comboPop": "BPn80q_comboPop",
			"content": "BPn80q_content",
			"continueButton": "BPn80q_continueButton",
			"coreCard": "BPn80q_coreCard",
			"coreGrid": "BPn80q_coreGrid",
			"core_nova": "BPn80q_core_nova",
			"core_origin": "BPn80q_core_origin",
			"core_pebble": "BPn80q_core_pebble",
			"core_prism": "BPn80q_core_prism",
			"core_pulse": "BPn80q_core_pulse",
			"creatureCard": "BPn80q_creatureCard",
			"creatureCards": "BPn80q_creatureCards",
			"creatureSelect": "BPn80q_creatureSelect",
			"creatureSelected": "BPn80q_creatureSelected",
			"creatureStats": "BPn80q_creatureStats",
			"damageBurst": "BPn80q_damageBurst",
			"damageRise": "BPn80q_damageRise",
			"dexCard": "BPn80q_dexCard",
			"dexCaught": "BPn80q_dexCaught",
			"dexGrid": "BPn80q_dexGrid",
			"dexNumber": "BPn80q_dexNumber",
			"dexSeen": "BPn80q_dexSeen",
			"dragHandle": "BPn80q_dragHandle",
			"ecologyPip": "BPn80q_ecologyPip",
			"encounter": "BPn80q_encounter",
			"encounterArrive": "BPn80q_encounterArrive",
			"encounterAvatar": "BPn80q_encounterAvatar",
			"encounterEnhanced": "BPn80q_encounterEnhanced",
			"encounterMeta": "BPn80q_encounterMeta",
			"encounterName": "BPn80q_encounterName",
			"encounterPulse": "BPn80q_encounterPulse",
			"encounterRing_nova": "BPn80q_encounterRing_nova",
			"encounterRing_origin": "BPn80q_encounterRing_origin",
			"encounterRing_pebble": "BPn80q_encounterRing_pebble",
			"encounterRing_prism": "BPn80q_encounterRing_prism",
			"encounterRing_pulse": "BPn80q_encounterRing_pulse",
			"encounterSpecial": "BPn80q_encounterSpecial",
			"enemyAura": "BPn80q_enemyAura",
			"enemyFloat": "BPn80q_enemyFloat",
			"enemyIntent": "BPn80q_enemyIntent",
			"energyBar": "BPn80q_energyBar",
			"fighter": "BPn80q_fighter",
			"fighterEnhanced": "BPn80q_fighterEnhanced",
			"fighterName": "BPn80q_fighterName",
			"flee": "BPn80q_flee",
			"footer": "BPn80q_footer",
			"frozenBadge": "BPn80q_frozenBadge",
			"glitchBlink": "BPn80q_glitchBlink",
			"growthActions": "BPn80q_growthActions",
			"growthList": "BPn80q_growthList",
			"growthRow": "BPn80q_growthRow",
			"growthSelected": "BPn80q_growthSelected",
			"growthSelector": "BPn80q_growthSelector",
			"growthSummary": "BPn80q_growthSummary",
			"growthWorkbench": "BPn80q_growthWorkbench",
			"growthXpTrack": "BPn80q_growthXpTrack",
			"header": "BPn80q_header",
			"headerStats": "BPn80q_headerStats",
			"hpBar": "BPn80q_hpBar",
			"hpWild": "BPn80q_hpWild",
			"idleClaimButton": "BPn80q_idleClaimButton",
			"idleClaimFloating": "BPn80q_idleClaimFloating",
			"idleClaimPulse": "BPn80q_idleClaimPulse",
			"idleClaimTooltip": "BPn80q_idleClaimTooltip",
			"idleFloat": "BPn80q_idleFloat",
			"idleReward": "BPn80q_idleReward",
			"inventoryLayout": "BPn80q_inventoryLayout",
			"inventoryPanel": "BPn80q_inventoryPanel",
			"itemInspectable": "BPn80q_itemInspectable",
			"itemTooltip": "BPn80q_itemTooltip",
			"launcher": "BPn80q_launcher",
			"launcherAvatar": "BPn80q_launcherAvatar",
			"launcherCore": "BPn80q_launcherCore",
			"launcherDragging": "BPn80q_launcherDragging",
			"launcherGift": "BPn80q_launcherGift",
			"launcherGiftBob": "BPn80q_launcherGiftBob",
			"launcherGiftGlow": "BPn80q_launcherGiftGlow",
			"launcherOpen": "BPn80q_launcherOpen",
			"launcherPulse": "BPn80q_launcherPulse",
			"launcherReward": "BPn80q_launcherReward",
			"logPanel": "BPn80q_logPanel",
			"logoCore": "BPn80q_logoCore",
			"mapAtmosphere": "BPn80q_mapAtmosphere",
			"mapEmpty": "BPn80q_mapEmpty",
			"mapFrame": "BPn80q_mapFrame",
			"mapIntro": "BPn80q_mapIntro",
			"mapLegend": "BPn80q_mapLegend",
			"mapRadar": "BPn80q_mapRadar",
			"mapRoutes": "BPn80q_mapRoutes",
			"matchBattleLayout": "BPn80q_matchBattleLayout",
			"matchBoard": "BPn80q_matchBoard",
			"matchTile": "BPn80q_matchTile",
			"matchTileClearing": "BPn80q_matchTileClearing",
			"matchTileDragging": "BPn80q_matchTileDragging",
			"matchTileFalling": "BPn80q_matchTileFalling",
			"matchTileLocked": "BPn80q_matchTileLocked",
			"matchTileSelected": "BPn80q_matchTileSelected",
			"matchTileSpecial": "BPn80q_matchTileSpecial",
			"materialCard": "BPn80q_materialCard",
			"materialShard": "BPn80q_materialShard",
			"materialXp": "BPn80q_materialXp",
			"miniCore": "BPn80q_miniCore",
			"modalBackdrop": "BPn80q_modalBackdrop",
			"moveButtons": "BPn80q_moveButtons",
			"offline": "BPn80q_offline",
			"online": "BPn80q_online",
			"overlay": "BPn80q_overlay",
			"overlayDockedRight": "BPn80q_overlayDockedRight",
			"overlayDragging": "BPn80q_overlayDragging",
			"pageHeading": "BPn80q_pageHeading",
			"panelPage": "BPn80q_panelPage",
			"partyBattleList": "BPn80q_partyBattleList",
			"partyColumn": "BPn80q_partyColumn",
			"partyCombatant": "BPn80q_partyCombatant",
			"partyCombatantActive": "BPn80q_partyCombatantActive",
			"partyCombatantBody": "BPn80q_partyCombatantBody",
			"partyCombatantDown": "BPn80q_partyCombatantDown",
			"partyIndex": "BPn80q_partyIndex",
			"partyShake": "BPn80q_partyShake",
			"partySlot": "BPn80q_partySlot",
			"pip_aegis": "BPn80q_pip_aegis",
			"pip_forge": "BPn80q_pip_forge",
			"pip_glitch": "BPn80q_pip_glitch",
			"pip_lumen": "BPn80q_pip_lumen",
			"pip_relay": "BPn80q_pip_relay",
			"radarSweep": "BPn80q_radarSweep",
			"regionLabel": "BPn80q_regionLabel",
			"region_aegis": "BPn80q_region_aegis",
			"region_forge": "BPn80q_region_forge",
			"region_glitch": "BPn80q_region_glitch",
			"region_lumen": "BPn80q_region_lumen",
			"region_relay": "BPn80q_region_relay",
			"releaseActions": "BPn80q_releaseActions",
			"releaseButton": "BPn80q_releaseButton",
			"releaseDanger": "BPn80q_releaseDanger",
			"releaseModal": "BPn80q_releaseModal",
			"releaseReward": "BPn80q_releaseReward",
			"rewardBackdrop": "BPn80q_rewardBackdrop",
			"rewardBackdropIn": "BPn80q_rewardBackdropIn",
			"rewardCrate": "BPn80q_rewardCrate",
			"rewardHalo": "BPn80q_rewardHalo",
			"rewardItem": "BPn80q_rewardItem",
			"rewardItemCompact": "BPn80q_rewardItemCompact",
			"rewardItems": "BPn80q_rewardItems",
			"rewardModal": "BPn80q_rewardModal",
			"rewardModalIn": "BPn80q_rewardModalIn",
			"rewardPulse": "BPn80q_rewardPulse",
			"settingsCard": "BPn80q_settingsCard",
			"settingsError": "BPn80q_settingsError",
			"settingsHero": "BPn80q_settingsHero",
			"settingsPage": "BPn80q_settingsPage",
			"settingsStatus": "BPn80q_settingsStatus",
			"settingsSwitch": "BPn80q_settingsSwitch",
			"settingsSwitchOn": "BPn80q_settingsSwitchOn",
			"shellEnter": "BPn80q_shellEnter",
			"signalPulse": "BPn80q_signalPulse",
			"skillButton": "BPn80q_skillButton",
			"skillReady": "BPn80q_skillReady",
			"skillSummary": "BPn80q_skillSummary",
			"skipStageButton": "BPn80q_skipStageButton",
			"spatialShellEnter": "BPn80q_spatialShellEnter",
			"sprite": "BPn80q_sprite",
			"spriteUnknown": "BPn80q_spriteUnknown",
			"sprite_large": "BPn80q_sprite_large",
			"sprite_medium": "BPn80q_sprite_medium",
			"sprite_small": "BPn80q_sprite_small",
			"sprite_tiny": "BPn80q_sprite_tiny",
			"starterGrid": "BPn80q_starterGrid",
			"starterModal": "BPn80q_starterModal",
			"statsGrid": "BPn80q_statsGrid",
			"swapDown": "BPn80q_swapDown",
			"swapLeft": "BPn80q_swapLeft",
			"swapRight": "BPn80q_swapRight",
			"swapUp": "BPn80q_swapUp",
			"tabActive": "BPn80q_tabActive",
			"tabs": "BPn80q_tabs",
			"teamStrikeSummary": "BPn80q_teamStrikeSummary",
			"tileClear": "BPn80q_tileClear",
			"tileFall": "BPn80q_tileFall",
			"tileSettle": "BPn80q_tileSettle",
			"tileSpecial": "BPn80q_tileSpecial",
			"tileSwapDown": "BPn80q_tileSwapDown",
			"tileSwapLeft": "BPn80q_tileSwapLeft",
			"tileSwapRight": "BPn80q_tileSwapRight",
			"tileSwapUp": "BPn80q_tileSwapUp",
			"tile_aegis": "BPn80q_tile_aegis",
			"tile_forge": "BPn80q_tile_forge",
			"tile_glitch": "BPn80q_tile_glitch",
			"tile_lumen": "BPn80q_tile_lumen",
			"tile_relay": "BPn80q_tile_relay",
			"toast": "BPn80q_toast",
			"toastIn": "BPn80q_toastIn",
			"towerBattleMark": "BPn80q_towerBattleMark",
			"towerBattleStatus": "BPn80q_towerBattleStatus",
			"towerBossCard": "BPn80q_towerBossCard",
			"towerBossPreview": "BPn80q_towerBossPreview",
			"towerBrief": "BPn80q_towerBrief",
			"towerDock": "BPn80q_towerDock",
			"towerGlyph": "BPn80q_towerGlyph",
			"towerGuardian": "BPn80q_towerGuardian",
			"towerHeading": "BPn80q_towerHeading",
			"towerHero": "BPn80q_towerHero",
			"towerMetrics": "BPn80q_towerMetrics",
			"towerMonument": "BPn80q_towerMonument",
			"towerPage": "BPn80q_towerPage",
			"towerProgress": "BPn80q_towerProgress",
			"towerRoute": "BPn80q_towerRoute",
			"towerRouteActive": "BPn80q_towerRouteActive",
			"towerRouteCleared": "BPn80q_towerRouteCleared",
			"towerSummary": "BPn80q_towerSummary",
			"turnSummary": "BPn80q_turnSummary",
			"turnSummaryBoss": "BPn80q_turnSummaryBoss",
			"wildBanner": "BPn80q_wildBanner",
			"wildVitals": "BPn80q_wildVitals",
			"windowClose": "BPn80q_windowClose",
			"worldMap": "BPn80q_worldMap"
		};
		//#endregion
		//#region lib/types/client/components/TraceWildOverlay.js
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
		function CreatureSprite(props) {
			return (0, react_jsx_runtime.jsx)("img", {
				className: `${tracewild_module_css_default.sprite} ${tracewild_module_css_default[`sprite_${props.size ?? "medium"}`]} ${props.unknown ? tracewild_module_css_default.spriteUnknown : ""}`,
				src: `/api/tracewild/assets/sprites/${props.creature.id}.webp?v=soft-chibi-v3`,
				alt: "",
				draggable: false
			});
		}
		function creatureName(creature, zh) {
			return zh ? creature.nameZh : creature.nameEn;
		}
		function encounterTimeLabel(t, expiresAt, now) {
			if (!Number.isFinite(expiresAt) || !Number.isFinite(now)) return t("encounterResident");
			const minutes = Math.max(0, Math.ceil((expiresAt - now) / 6e4));
			if (minutes <= 1) return t("encounterLeavingSoon");
			if (minutes < 60) return t("encounterLeavesMinutes", { count: minutes });
			const hours = Math.ceil(minutes / 60);
			if (hours < 24) return t("encounterLeavesHours", { count: hours });
			return t("encounterLeavesDays", { count: Math.ceil(hours / 24) });
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
				quantity: 1
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
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.rewardBackdrop,
				onClick: (event) => {
					if (event.target === event.currentTarget) props.dismiss();
				},
				children: (0, react_jsx_runtime.jsxs)("section", {
					className: tracewild_module_css_default.rewardModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "tracewild-reward-title",
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
						(0, react_jsx_runtime.jsx)("small", { children: props.t("rewardDismiss") })
					]
				})
			});
		}
		function ReleaseCreatureModal(props) {
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.modalBackdrop,
				onMouseDown: (event) => {
					if (event.target === event.currentTarget && !props.busy) props.dismiss();
				},
				children: (0, react_jsx_runtime.jsxs)("section", {
					className: tracewild_module_css_default.releaseModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "codekin-release-title",
					onMouseDown: (event) => {
						event.stopPropagation();
					},
					children: [
						(0, react_jsx_runtime.jsxs)("header", { children: [(0, react_jsx_runtime.jsx)(CreatureSprite, {
							creature: props.creature,
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
		function battleLogText(row, t, zh) {
			const amount = row.amount ?? 0;
			switch (row.kind) {
				case "start": return t("battleStart");
				case "match": return t("battleMatch", { amount });
				case "combo": return t("battleCombo", { amount });
				case "armor-break": return t("battleArmor");
				case "skill": return t("battleSkill", { amount });
				case "heal": return t("battleHeal", { amount });
				case "shield": return t("battleShield", { amount });
				case "enemy": return t("battleEnemy", { amount });
				case "enemy-sweep": return t("battleEnemySweep", { amount });
				case "enemy-shield": return t("battleEnemyShield", { amount });
				case "enemy-delay": return t("battleEnemyDelay");
				case "enemy-lock": return t("battleEnemyLock", { amount });
				case "enemy-freeze": return t("battleEnemyFreeze", { amount });
				case "boss-match": return t("battleBossMatch", { amount });
				case "boss-combo": return t("battleBossCombo", { amount });
				case "boss-energy": return t("battleBossEnergy", { amount });
				case "boss-action-refund": return t("battleBossRefund");
				case "boss-action-bonus": return t("battleBossBonus", { amount });
				case "boss-skill": return t("battleBossSkill");
				case "stage-skip": return t("battleStageSkipped");
				case "frozen-skip": return t("battleFrozenSkip");
				case "phase-shift": return t("battlePhaseShift", { amount });
				case "action-refund": return t("battleActionRefund");
				case "action-bonus": return t("battleActionBonus", { amount });
				case "team-strike": return t("battleTeamStrike", { amount });
				case "switch": {
					const creature = row.creatureId === void 0 ? void 0 : creatureById(row.creatureId);
					return t("battleSwitch", { name: creature === void 0 ? "—" : creatureName(creature, zh) });
				}
				case "capture-failed": return t("battleCaptureFail");
				case "wild-defeated": return t("wildDefeated");
				case "defeat": return t("battleLost");
			}
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
			const [windowPosition, setWindowPosition] = (0, react.useState)({
				x: 0,
				y: 0
			});
			const [draggingWindow, setDraggingWindow] = (0, react.useState)(false);
			const [launcherPosition, setLauncherPosition] = (0, react.useState)();
			const [draggingLauncher, setDraggingLauncher] = (0, react.useState)(false);
			const [squadDraft, setSquadDraft] = (0, react.useState)([]);
			const [growthTarget, setGrowthTarget] = (0, react.useState)();
			const [rewardQueue, setRewardQueue] = (0, react.useState)([]);
			const [releaseCandidate, setReleaseCandidate] = (0, react.useState)();
			const latestSnapshot = (0, react.useRef)();
			const actionInFlight = (0, react.useRef)(false);
			const pendingSnapshot = (0, react.useRef)();
			const overlayElement = (0, react.useRef)(null);
			const windowDrag = (0, react.useRef)();
			const launcherElement = (0, react.useRef)(null);
			const launcherDrag = (0, react.useRef)();
			const launcherWasDragged = (0, react.useRef)(false);
			const pulseTimer = (0, react.useRef)();
			const zh = t("title") === "码灵";
			const adoptSnapshot = (0, react.useCallback)((value) => {
				const previous = latestSnapshot.current;
				const sameProfile = previous !== void 0 && value.state.createdAt === previous.state.createdAt;
				if (sameProfile && value.state.revision < previous.state.revision) return;
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
			const refresh = (0, react.useCallback)(async (signal) => {
				try {
					adoptSnapshot(await connection.load(signal));
					setOnline(true);
				} catch {
					if (signal?.aborted !== true) setOnline(false);
				}
			}, [adoptSnapshot, connection]);
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				refresh(controller.signal);
				const unsubscribe = connection.subscribe((value) => {
					if (actionInFlight.current) {
						pendingSnapshot.current = value;
						return;
					}
					adoptSnapshot(value);
				}, setOnline);
				return () => {
					controller.abort();
					unsubscribe();
				};
			}, [
				adoptSnapshot,
				connection,
				refresh
			]);
			(0, react.useEffect)(() => () => {
				if (pulseTimer.current !== void 0) window.clearTimeout(pulseTimer.current);
			}, []);
			(0, react.useEffect)(() => {
				if (snapshot !== void 0) setSquadDraft([...snapshot.state.squad]);
			}, [snapshot?.state.revision]);
			(0, react.useEffect)(() => {
				if (snapshot === void 0) return;
				setGrowthTarget((current) => snapshot.state.creatures.some((creature) => creature.instanceId === current) ? current : snapshot.state.creatures[0]?.instanceId);
			}, [snapshot?.state.createdAt, snapshot?.state.revision]);
			(0, react.useEffect)(() => {
				if (releaseCandidate === void 0) return;
				if (snapshot?.state.creatures.some((creature) => creature.instanceId === releaseCandidate) !== true) setReleaseCandidate(void 0);
			}, [releaseCandidate, snapshot?.state.revision]);
			(0, react.useEffect)(() => {
				if (notice === void 0) return;
				const timer = window.setTimeout(() => {
					setNotice(void 0);
				}, 2800);
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
					if (event.key !== "Escape") return;
					if (rewardQueue.length > 0) setRewardQueue((queue) => queue.slice(1));
					else if (releaseCandidate !== void 0) setReleaseCandidate(void 0);
					else if (snapshot?.state.battle === void 0) setOpen(false);
				};
				window.addEventListener("keydown", onKey);
				return () => {
					window.removeEventListener("keydown", onKey);
				};
			}, [
				open,
				releaseCandidate,
				rewardQueue.length,
				snapshot?.state.battle
			]);
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
				event.preventDefault();
				event.currentTarget.setPointerCapture(event.pointerId);
				windowDrag.current = {
					pointerId: event.pointerId,
					startX: event.clientX,
					startY: event.clientY,
					x: windowPosition.x,
					y: windowPosition.y,
					width: rect.width,
					height: rect.height
				};
				setDraggingWindow(true);
			};
			const moveWindowDrag = (event) => {
				const drag = windowDrag.current;
				if (drag === void 0 || drag.pointerId !== event.pointerId) return;
				event.preventDefault();
				setWindowPosition(clampWindowPosition(drag.x + event.clientX - drag.startX, drag.y + event.clientY - drag.startY, drag.width, drag.height));
			};
			const finishWindowDrag = (event) => {
				if (windowDrag.current?.pointerId !== event.pointerId) return;
				windowDrag.current = void 0;
				setDraggingWindow(false);
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
			};
			const beginLauncherDrag = (event) => {
				if (event.button !== 0) return;
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
					height: rect.height
				};
				setDraggingLauncher(true);
			};
			const moveLauncherDrag = (event) => {
				const drag = launcherDrag.current;
				if (drag === void 0 || drag.pointerId !== event.pointerId) return;
				const deltaX = event.clientX - drag.startX;
				const deltaY = event.clientY - drag.startY;
				if (Math.hypot(deltaX, deltaY) > 4) launcherWasDragged.current = true;
				if (!launcherWasDragged.current) return;
				event.preventDefault();
				setLauncherPosition(clampFloatingPosition(drag.x + deltaX, drag.y + deltaY, drag.width, drag.height));
			};
			const finishLauncherDrag = (event) => {
				if (launcherDrag.current?.pointerId !== event.pointerId) return;
				launcherDrag.current = void 0;
				setDraggingLauncher(false);
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
			};
			const act = (0, react.useCallback)(async (action) => {
				if (busy || actionInFlight.current) return void 0;
				actionInFlight.current = true;
				setBusy(true);
				setNotice(void 0);
				try {
					const response = await connection.act(action);
					adoptSnapshot(response);
					setOnline(true);
					if (response.notice === "capture-success") setNotice(t("captured"));
					if (response.notice === "capture-failed") setNotice(t("captureFailed"));
					if (response.notice === "battle-lost") setNotice(t("battleLost"));
					if (response.notice === "wild-defeated") setNotice(t("wildDefeated"));
					if (response.notice === "tower-cleared") setNotice(t("towerCleared"));
					if (response.notice === "skill-cast") setNotice(t("skillReleased"));
					if (response.notice === "material-used") setNotice(t("materialUsed"));
					if (response.notice === "idle-claimed") setNotice(t("idleClaimed"));
					if (response.notice === "creature-released") setNotice(t("released"));
					return response;
				} catch (error) {
					if (error instanceof TraceWildConnectionError && error.code === "invalid-action") setNotice(action.type === "claim-idle-reward" ? t("rewardUnavailable") : t("invalidSwap"));
					else {
						setNotice(error instanceof TraceWildConnectionError && error.code === "conflict" ? t("invalidSwap") : t("disconnected"));
						await refresh();
					}
				} finally {
					actionInFlight.current = false;
					const pending = pendingSnapshot.current;
					pendingSnapshot.current = void 0;
					if (pending !== void 0) adoptSnapshot(pending);
					setBusy(false);
				}
			}, [
				adoptSnapshot,
				busy,
				connection,
				refresh,
				t
			]);
			const state = snapshot?.state;
			const uncaught = state?.encounters.length ?? 0;
			const pendingIdleReward = state?.idle.pendingReward;
			const claimIdleReward = () => {
				setOpen(true);
				act({ type: "claim-idle-reward" });
			};
			if (state?.enabled === false) return null;
			const launcher = (0, react_jsx_runtime.jsxs)("button", {
				ref: launcherElement,
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
					src: "/api/tracewild/assets/sprites/codekin-launcher-v1.webp",
					alt: "",
					"aria-hidden": "true",
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
				className: `${tracewild_module_css_default.overlay} ${draggingWindow ? tracewild_module_css_default.overlayDragging : ""} ${windowPosition.x > 140 ? tracewild_module_css_default.overlayDockedRight : ""}`,
				style: {
					"--window-x": `${windowPosition.x}px`,
					"--window-y": `${windowPosition.y}px`
				},
				"aria-label": t("title"),
				children: [
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: tracewild_module_css_default.windowClose,
						onClick: () => {
							setOpen(false);
						},
						title: t("close"),
						"aria-label": t("close"),
						children: (0, react_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "×"
						})
					}),
					(0, react_jsx_runtime.jsxs)("header", {
						className: tracewild_module_css_default.header,
						title: t("dragWindow"),
						onDoubleClick: (event) => {
							if (event.target.closest("button") === null) setWindowPosition({
								x: 0,
								y: 0
							});
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
								}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h1", { children: t("title") }), (0, react_jsx_runtime.jsx)("p", { children: t("subtitle") })] })]
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
								children: [
									pendingIdleReward !== void 0 && (0, react_jsx_runtime.jsx)(IdleRewardButton, {
										reward: pendingIdleReward,
										t,
										zh,
										busy,
										claim: claimIdleReward
									}),
									CAPTURE_CORE_QUALITIES.map((quality) => (0, react_jsx_runtime.jsx)("span", {
										className: `${tracewild_module_css_default.miniCore} ${tracewild_module_css_default[`core_${quality}`]}`,
										title: `${coreItemName(t, quality)} · ${t("captureCoreDescription", { power: CORE_CAPTURE_POWER[quality].toFixed(2) })}`,
										children: state?.cores[quality] ?? 0
									}, quality)),
									(0, react_jsx_runtime.jsx)("span", {
										className: online ? tracewild_module_css_default.online : tracewild_module_css_default.offline,
										children: online ? "LIVE" : "OFFLINE"
									})
								]
							})
						]
					}),
					state === void 0 ? (0, react_jsx_runtime.jsx)("div", {
						className: tracewild_module_css_default.centerMessage,
						children: online ? t("loading") : t("disconnected")
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
							className: tracewild_module_css_default.tabs,
							"aria-label": t("title"),
							children: [
								"map",
								"tower",
								"squad",
								"dex",
								"inventory"
							].map((id) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-tab": id,
								className: tab === id ? tracewild_module_css_default.tabActive : "",
								onClick: () => {
									setTab(id);
								},
								children: [(0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: TAB_ICONS[id]
								}), (0, react_jsx_runtime.jsx)("small", { children: id === "tower" ? t("towerTitle") : t(id) })]
							}, id))
						}),
						(0, react_jsx_runtime.jsxs)("main", {
							className: tracewild_module_css_default.content,
							children: [
								tab === "map" && (0, react_jsx_runtime.jsx)(MapView, {
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
								tab === "squad" && (0, react_jsx_runtime.jsx)(SquadView, {
									state,
									t,
									zh,
									draft: squadDraft,
									setDraft: setSquadDraft,
									busy,
									save: () => act({
										type: "set-squad",
										instanceIds: squadDraft
									}),
									release: setReleaseCandidate
								}),
								tab === "dex" && (0, react_jsx_runtime.jsx)(DexView, {
									state,
									t,
									zh
								}),
								tab === "inventory" && (0, react_jsx_runtime.jsx)(InventoryView, {
									state,
									t,
									zh,
									busy,
									act,
									growthTarget,
									setGrowthTarget
								})
							]
						}),
						(0, react_jsx_runtime.jsx)("footer", {
							className: tracewild_module_css_default.footer,
							children: t("privacy")
						}),
						state.battle !== void 0 && (0, react_jsx_runtime.jsx)(BattleView, {
							state,
							t,
							zh,
							busy,
							act
						}),
						notice !== void 0 && (0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.toast,
							role: "status",
							children: notice
						}),
						rewardQueue[0] !== void 0 && (0, react_jsx_runtime.jsx)(AcquiredItemsModal, {
							items: rewardQueue[0],
							t,
							zh,
							dismiss: () => {
								setRewardQueue((queue) => queue.slice(1));
							}
						}),
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
					] })
				]
			});
		}
		function StarterSelection(props) {
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.modalBackdrop,
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: tracewild_module_css_default.starterModal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "tracewild-starter-title",
					children: [
						(0, react_jsx_runtime.jsx)("h2", {
							id: "tracewild-starter-title",
							children: props.t("starterTitle")
						}),
						(0, react_jsx_runtime.jsx)("p", { children: props.t("starterBody") }),
						(0, react_jsx_runtime.jsx)("div", {
							className: tracewild_module_css_default.starterGrid,
							children: STARTER_CREATURE_IDS.map((id) => {
								const creature = creatureById(id);
								return (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: props.busy,
									onClick: () => {
										props.choose(id);
									},
									children: [
										(0, react_jsx_runtime.jsx)(CreatureSprite, {
											creature,
											size: "large"
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
		function MapView(props) {
			const [clock, setClock] = (0, react.useState)(props.serverTime);
			(0, react.useEffect)(() => {
				const startedAt = Date.now();
				setClock(props.serverTime);
				const timer = window.setInterval(() => {
					setClock(props.serverTime + Math.max(0, Date.now() - startedAt));
				}, 3e4);
				return () => {
					window.clearInterval(timer);
				};
			}, [props.serverTime]);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: tracewild_module_css_default.mapFrame,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: tracewild_module_css_default.mapIntro,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("span", { children: props.t("mapKicker") }),
							(0, react_jsx_runtime.jsx)("h2", { children: props.t("map") }),
							(0, react_jsx_runtime.jsx)("p", { children: props.t("mapSignalCount", {
								count: props.state.encounters.length,
								max: 7
							}) })
						] }), (0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.mapRadar,
							"aria-hidden": "true",
							children: [
								(0, react_jsx_runtime.jsx)("i", {}),
								(0, react_jsx_runtime.jsx)("i", {}),
								(0, react_jsx_runtime.jsx)("i", {}),
								(0, react_jsx_runtime.jsx)("b", {})
							]
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: tracewild_module_css_default.worldMap,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: tracewild_module_css_default.mapAtmosphere,
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
								className: tracewild_module_css_default.mapRoutes,
								"aria-hidden": "true",
								children: [
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {}),
									(0, react_jsx_runtime.jsx)("i", {})
								]
							}),
							Object.keys(ECOLOGY_KEYS).map((ecology) => (0, react_jsx_runtime.jsx)("div", {
								className: `${tracewild_module_css_default.regionLabel} ${tracewild_module_css_default[`region_${ecology}`]}`,
								children: props.t(ECOLOGY_KEYS[ecology])
							}, ecology)),
							props.state.encounters.map((encounter) => {
								const creature = creatureById(encounter.creatureId);
								if (creature === void 0) return null;
								const special = encounter.enhanced || creature.rarity === "rare" || creature.rarity === "apex" || encounter.quality === "nova" || encounter.quality === "origin";
								const remaining = encounterTimeLabel(props.t, encounter.expiresAt, clock);
								return (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `${tracewild_module_css_default.encounter} ${encounter.enhanced ? tracewild_module_css_default.encounterEnhanced : ""}`,
									style: {
										left: `${encounter.mapX}%`,
										top: `${encounter.mapY}%`
									},
									"data-special": special ? "true" : void 0,
									disabled: props.busy || !props.state.starterChosen,
									onClick: () => {
										props.start(encounter.id);
									},
									title: `${creatureName(creature, props.zh)} · Lv.${encounter.level} · ${props.t(CORE_KEYS[encounter.quality])} · ${remaining}`,
									children: [
										(0, react_jsx_runtime.jsx)("i", {
											className: tracewild_module_css_default.encounterPulse,
											"aria-hidden": "true"
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: `${tracewild_module_css_default.encounterAvatar} ${special ? tracewild_module_css_default.encounterSpecial : ""} ${special ? tracewild_module_css_default[`encounterRing_${encounter.quality}`] : ""}`,
											children: (0, react_jsx_runtime.jsx)(CreatureSprite, {
												creature,
												size: "small"
											})
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: tracewild_module_css_default.encounterName,
											children: creatureName(creature, props.zh)
										}),
										(0, react_jsx_runtime.jsxs)("small", {
											className: tracewild_module_css_default.encounterMeta,
											children: [
												"Lv.",
												encounter.level,
												" · ",
												remaining
											]
										}),
										encounter.enhanced && (0, react_jsx_runtime.jsx)("b", { children: props.t("enhanced") })
									]
								}, encounter.id);
							}),
							props.state.encounters.length === 0 && (0, react_jsx_runtime.jsx)("div", {
								className: tracewild_module_css_default.mapEmpty,
								children: props.t("mapEmpty")
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: tracewild_module_css_default.mapLegend,
						children: Object.keys(ECOLOGY_KEYS).map((ecology) => (0, react_jsx_runtime.jsx)("span", {
							"data-ecology": ecology,
							children: props.t(ECOLOGY_KEYS[ecology])
						}, ecology))
					})
				]
			});
		}
		function TowerView(props) {
			const towerState = props.state.tower ?? {
				highestClearedFloor: 0,
				attempts: 0,
				clears: 0
			};
			const towerComplete = towerState.highestClearedFloor >= MAX_TOWER_FLOOR;
			const tower = towerFloorProfile(Math.min(MAX_TOWER_FLOOR, towerState.highestClearedFloor + 1));
			const towerBoss = creatureById(tower.creatureId);
			const routeStart = Math.max(1, tower.floor - 2);
			const routeFloors = Array.from({ length: 5 }, (_, index) => Math.min(MAX_TOWER_FLOOR, routeStart + index)).filter((floor, index, rows) => rows.indexOf(floor) === index);
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
										size: "large"
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
							const profile = towerFloorProfile(floor);
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
		function SquadView(props) {
			const toggle = (instanceId) => {
				if (props.draft.includes(instanceId)) {
					if (props.draft.length > 1) props.setDraft(props.draft.filter((id) => id !== instanceId));
					return;
				}
				if (props.draft.length < 3) props.setDraft([...props.draft, instanceId]);
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: tracewild_module_css_default.panelPage,
				children: [(0, react_jsx_runtime.jsxs)("div", {
					className: tracewild_module_css_default.pageHeading,
					children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: props.t("squad") }), (0, react_jsx_runtime.jsx)("p", { children: props.t("squadHelp") })] }), (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: props.busy || props.draft.length === 0,
						onClick: props.save,
						children: props.t("saveSquad")
					})]
				}), (0, react_jsx_runtime.jsx)("div", {
					className: tracewild_module_css_default.creatureCards,
					children: props.state.creatures.map((captured) => {
						const creature = creatureById(captured.creatureId);
						if (creature === void 0) return null;
						const position = props.draft.indexOf(captured.instanceId);
						const stats = playerStats(creature.stats, captured.level, captured.quality);
						return (0, react_jsx_runtime.jsxs)("article", {
							className: `${tracewild_module_css_default.creatureCard} ${position >= 0 ? tracewild_module_css_default.creatureSelected : ""}`,
							children: [
								position >= 0 && (0, react_jsx_runtime.jsx)("span", {
									className: tracewild_module_css_default.partyIndex,
									children: position + 1
								}),
								(0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: tracewild_module_css_default.releaseButton,
									disabled: props.busy || props.state.creatures.length <= 1,
									title: props.state.creatures.length <= 1 ? props.t("releaseLastBlocked") : props.t("releaseCreature"),
									"aria-label": `${props.t("releaseCreature")} · ${creatureName(creature, props.zh)}`,
									onClick: () => {
										props.release(captured.instanceId);
									},
									children: (0, react_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "↗"
									})
								}),
								(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: tracewild_module_css_default.creatureSelect,
									onClick: () => {
										toggle(captured.instanceId);
									},
									children: [
										(0, react_jsx_runtime.jsx)(CreatureSprite, {
											creature,
											size: "medium"
										}),
										(0, react_jsx_runtime.jsx)("strong", { children: creatureName(creature, props.zh) }),
										(0, react_jsx_runtime.jsxs)("span", { children: [
											props.t(ECOLOGY_KEYS[creature.ecology]),
											" · ",
											props.t(RARITY_KEYS[creature.rarity])
										] }),
										(0, react_jsx_runtime.jsxs)("small", { children: [
											props.t("level"),
											" ",
											captured.level,
											" · ",
											props.t("quality"),
											" ",
											props.t(CORE_KEYS[captured.quality]),
											" · ",
											props.t("wins"),
											" ",
											captured.wins
										] }),
										(0, react_jsx_runtime.jsxs)("span", {
											className: tracewild_module_css_default.creatureStats,
											children: [
												(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.hp }), props.t("statRuntime")] }),
												(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.attack }), props.t("statCompute")] }),
												(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.defense }), props.t("statGuard")] }),
												(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("b", { children: stats.speed }), props.t("statResponse")] })
											]
										})
									]
								})
							]
						}, captured.instanceId);
					})
				})]
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
					children: CREATURE_CATALOG.map((creature) => {
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
			const selectedCaptured = props.state.creatures.find((captured) => captured.instanceId === props.growthTarget) ?? props.state.creatures[0];
			const selectedCreature = selectedCaptured === void 0 ? void 0 : creatureById(selectedCaptured.creatureId);
			const selectedLevelBaseXp = selectedCaptured === void 0 ? 0 : totalXpForLevel(selectedCaptured.level, selectedCaptured.quality);
			const selectedProgress = selectedCaptured === void 0 ? 0 : Math.max(0, selectedCaptured.xp - selectedLevelBaseXp);
			const selectedNeeded = selectedCaptured === void 0 || selectedCaptured.level >= 100 ? 0 : xpToNextLevel(selectedCaptured.level, selectedCaptured.quality);
			const selectedProgressPercent = selectedNeeded <= 0 ? 100 : Math.min(100, Math.round(selectedProgress / selectedNeeded * 100));
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
						(0, react_jsx_runtime.jsx)("h2", { children: props.t("growth") }),
						(0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.growthWorkbench,
							children: [(0, react_jsx_runtime.jsxs)("label", {
								className: tracewild_module_css_default.growthSelector,
								children: [
									(0, react_jsx_runtime.jsx)("span", { children: props.t("growthTarget") }),
									(0, react_jsx_runtime.jsx)("select", {
										value: selectedCaptured?.instanceId ?? "",
										disabled: props.busy || props.state.creatures.length === 0,
										onChange: (event) => {
											props.setGrowthTarget(event.currentTarget.value);
										},
										children: props.state.creatures.map((captured) => {
											const creature = creatureById(captured.creatureId);
											if (creature === void 0) return null;
											return (0, react_jsx_runtime.jsxs)("option", {
												value: captured.instanceId,
												children: [
													creatureName(creature, props.zh),
													" · Lv.",
													captured.level,
													" · ",
													props.t(CORE_KEYS[captured.quality])
												]
											}, captured.instanceId);
										})
									}),
									(0, react_jsx_runtime.jsx)("small", { children: props.t("growthTargetHint", { count: props.state.creatures.length }) })
								]
							}), selectedCaptured !== void 0 && selectedCreature !== void 0 && (0, react_jsx_runtime.jsxs)("article", {
								className: tracewild_module_css_default.growthSelected,
								children: [(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.growthSummary,
									children: [(0, react_jsx_runtime.jsx)(CreatureSprite, {
										creature: selectedCreature,
										size: "small"
									}), (0, react_jsx_runtime.jsxs)("div", { children: [
										(0, react_jsx_runtime.jsx)("strong", { children: creatureName(selectedCreature, props.zh) }),
										(0, react_jsx_runtime.jsxs)("span", { children: [
											props.t(ECOLOGY_KEYS[selectedCreature.ecology]),
											" · ",
											props.t("quality"),
											" ",
											props.t(CORE_KEYS[selectedCaptured.quality]),
											" · Lv.",
											selectedCaptured.level
										] }),
										(0, react_jsx_runtime.jsx)("small", { children: selectedCaptured.level >= 100 ? props.t("levelCap") : `${props.t("xp")} ${selectedProgress}/${selectedNeeded}` }),
										(0, react_jsx_runtime.jsx)("div", {
											className: tracewild_module_css_default.growthXpTrack,
											"aria-hidden": "true",
											children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${selectedProgressPercent}%` } })
										})
									] })]
								}), (0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.growthActions,
									children: CAPTURE_CORE_QUALITIES.map((quality) => (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: tracewild_module_css_default[`core_${quality}`],
										disabled: props.busy || selectedCaptured.level >= 100 || props.state.materials[quality] <= 0,
										onClick: () => {
											props.act({
												type: "feed-material",
												creatureInstanceId: selectedCaptured.instanceId,
												quality,
												count: 1
											});
										},
										title: `${props.t("feed")} · ${materialItemName(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`,
										"aria-label": `${props.t("feed")} ${materialItemName(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`,
										children: [
											(0, react_jsx_runtime.jsx)("i", {}),
											(0, react_jsx_runtime.jsxs)("span", { children: ["+", MATERIAL_XP[quality]] }),
											(0, react_jsx_runtime.jsxs)("small", { children: ["×", props.state.materials[quality]] })
										]
									}, quality))
								})]
							})]
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
		const INTENT_KEYS = {
			strike: "intentStrike",
			sweep: "intentSweep",
			guard: "intentGuard",
			disrupt: "intentDisrupt",
			corrupt: "intentCorrupt",
			mark: "intentMark",
			lock: "intentLock",
			freeze: "intentFreeze"
		};
		function tileLabel(tile, index, t) {
			return `${t(ECOLOGY_KEYS[tile.ecology])}${tile.special === "none" ? "" : ` · ${t(SPECIAL_KEYS[tile.special])}`}${(tile.lockedActions ?? 0) > 0 ? ` · ${t("lockedTile", { actions: tile.lockedActions ?? 0 })}` : ""} · ${Math.floor(index / 7) + 1},${index % 7 + 1}`;
		}
		function swipeTarget(index, deltaX, deltaY) {
			const row = Math.floor(index / 7);
			const column = index % 7;
			if (Math.abs(deltaX) >= Math.abs(deltaY)) {
				if (deltaX > 0 && column < 6) return index + 1;
				if (deltaX < 0 && column > 0) return index - 1;
				return;
			}
			if (deltaY > 0 && row < 6) return index + 7;
			if (deltaY < 0 && row > 0) return index - 7;
		}
		function swapMotionClass(index, motion) {
			if (motion === void 0 || index !== motion.from && index !== motion.to) return "";
			const delta = motion.to - motion.from;
			if (index === motion.from) return delta === 1 ? tracewild_module_css_default.tileSwapRight ?? "" : delta === -1 ? tracewild_module_css_default.tileSwapLeft ?? "" : delta === 7 ? tracewild_module_css_default.tileSwapDown ?? "" : tracewild_module_css_default.tileSwapUp ?? "";
			return delta === 1 ? tracewild_module_css_default.tileSwapLeft ?? "" : delta === -1 ? tracewild_module_css_default.tileSwapRight ?? "" : delta === 7 ? tracewild_module_css_default.tileSwapUp ?? "" : tracewild_module_css_default.tileSwapDown ?? "";
		}
		function BattleView(props) {
			const battle = props.state.battle;
			const [selectedTile, setSelectedTile] = (0, react.useState)();
			const [gesture, setGesture] = (0, react.useState)();
			const [swapMotion, setSwapMotion] = (0, react.useState)();
			const [animating, setAnimating] = (0, react.useState)(false);
			const [visualBoard, setVisualBoard] = (0, react.useState)(() => battle.board.map((tile) => ({ ...tile })));
			const [clearingTiles, setClearingTiles] = (0, react.useState)();
			const [fallRows, setFallRows] = (0, react.useState)();
			const [activeChain, setActiveChain] = (0, react.useState)();
			const [damageBurst, setDamageBurst] = (0, react.useState)();
			const [partyHitKey, setPartyHitKey] = (0, react.useState)(0);
			const gestureRef = (0, react.useRef)();
			const bossActionInFlight = (0, react.useRef)(false);
			const bossActionTimer = (0, react.useRef)();
			const swapTimer = (0, react.useRef)();
			const motionTimers = (0, react.useRef)(/* @__PURE__ */ new Set());
			const animationEpoch = (0, react.useRef)(0);
			const suppressClick = (0, react.useRef)(false);
			const suppressClickTimer = (0, react.useRef)();
			const previousBattle = (0, react.useRef)({
				id: battle.id,
				wildHp: battle.wildHp,
				partyHp: battle.party.reduce((sum, row) => sum + row.hp, 0)
			});
			const encounter = props.state.encounters.find((row) => row.id === battle.encounterId);
			const wild = creatureById(battle.wildCreatureId);
			const active = battle.party[battle.activeIndex];
			const activeDefinition = active === void 0 ? void 0 : creatureById(active.creatureId);
			const locked = props.busy || animating;
			const boardLocked = locked || battle.turnOwner === "boss" || battle.captureWindow || battle.actionsRemaining <= 0;
			const partyHp = battle.party.reduce((sum, row) => sum + row.hp, 0);
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
				animationEpoch.current += 1;
				setSwapMotion(void 0);
				setClearingTiles(void 0);
				setFallRows(void 0);
				setActiveChain(void 0);
				setVisualBoard(battle.board.map((tile) => ({ ...tile })));
			}, [battle.id]);
			(0, react.useEffect)(() => {
				if (!animating) setVisualBoard(battle.board.map((tile) => ({ ...tile })));
			}, [animating, battle.board]);
			(0, react.useEffect)(() => {
				const previous = previousBattle.current;
				if (previous.id !== battle.id) {
					previousBattle.current = {
						id: battle.id,
						wildHp: battle.wildHp,
						partyHp
					};
					return;
				}
				const wildDamage = previous.wildHp - battle.wildHp;
				if (wildDamage > 0) setDamageBurst({
					key: Date.now(),
					amount: wildDamage
				});
				if (previous.partyHp > partyHp) setPartyHitKey((value) => value + 1);
				previousBattle.current = {
					id: battle.id,
					wildHp: battle.wildHp,
					partyHp
				};
			}, [
				battle.id,
				battle.wildHp,
				partyHp
			]);
			(0, react.useEffect)(() => () => {
				animationEpoch.current += 1;
				if (bossActionTimer.current !== void 0) window.clearTimeout(bossActionTimer.current);
				if (swapTimer.current !== void 0) window.clearTimeout(swapTimer.current);
				if (suppressClickTimer.current !== void 0) window.clearTimeout(suppressClickTimer.current);
				for (const timer of motionTimers.current) window.clearTimeout(timer);
				motionTimers.current.clear();
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
				motionTimers.current.add(timer);
			});
			const playCascade = async (animation, finalBoard) => {
				if (animation.battleId !== battle.id) return;
				const epoch = ++animationEpoch.current;
				const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				for (const frame of animation.frames) {
					if (animationEpoch.current !== epoch) return;
					setFallRows(void 0);
					setVisualBoard(frame.before.map((tile) => ({ ...tile })));
					setClearingTiles(new Set(frame.removed));
					setActiveChain(frame.chain);
					await pause(reducedMotion ? 20 : 190);
					if (animationEpoch.current !== epoch) return;
					setClearingTiles(void 0);
					setVisualBoard(frame.after.map((tile) => ({ ...tile })));
					setFallRows(frame.fallRows);
					const longestFall = Math.max(...frame.fallRows);
					await pause(reducedMotion ? 20 : Math.min(540, 270 + longestFall * 34));
					if (animationEpoch.current !== epoch) return;
					setFallRows(void 0);
					await pause(reducedMotion ? 0 : 45);
				}
				if (animationEpoch.current !== epoch) return;
				setActiveChain(void 0);
				setVisualBoard(finalBoard.map((tile) => ({ ...tile })));
			};
			const runBossAction = () => {
				if (battle.turnOwner !== "boss" || props.busy || animating || bossActionInFlight.current) return;
				bossActionInFlight.current = true;
				setAnimating(true);
				props.act({ type: "battle-continue" }).then(async (response) => {
					const finalBattle = response?.state.battle;
					if (response?.animation !== void 0 && finalBattle?.id === battle.id) {
						const motion = response.animation.swap;
						if (motion !== void 0) {
							setSwapMotion(motion);
							await pause(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 150);
							setSwapMotion(void 0);
						}
						await playCascade(response.animation, finalBattle.board);
					}
				}).finally(() => {
					bossActionInFlight.current = false;
					setSwapMotion(void 0);
					setClearingTiles(void 0);
					setFallRows(void 0);
					setActiveChain(void 0);
					setAnimating(false);
				});
			};
			(0, react.useEffect)(() => {
				if (battle.turnOwner !== "boss" || props.busy || animating || bossActionInFlight.current) return;
				bossActionTimer.current = window.setTimeout(() => {
					bossActionTimer.current = void 0;
					runBossAction();
				}, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 420);
				return () => {
					if (bossActionTimer.current !== void 0) window.clearTimeout(bossActionTimer.current);
					bossActionTimer.current = void 0;
				};
			}, [
				battle.id,
				battle.turnOwner,
				battle.bossActionsRemaining,
				props.busy,
				animating
			]);
			if (battle.mode === "wild" && encounter === void 0 || wild === void 0 || active === void 0 || activeDefinition === void 0) return null;
			const availableCores = CAPTURE_CORE_QUALITIES.filter((quality) => props.state.cores[quality] > 0);
			const captureReady = battle.mode === "wild" && battle.captureWindow;
			const predictedHp = Math.max(0, battle.wildHp - Math.max(0, battle.pendingTeamDamage - battle.wildShield));
			const enemyTarget = battle.enemyTargetScope === "all" ? props.t("targetAll") : battle.enemyTargetScope === "self" ? props.t("targetSelf") : (() => {
				const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex];
				const definition = target === void 0 ? void 0 : creatureById(target.creatureId);
				return definition === void 0 ? props.t("targetSingle") : creatureName(definition, props.zh);
			})();
			const latestLog = battle.log.slice(-2);
			const lastLog = battle.log.at(-1);
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
				swapTimer.current = window.setTimeout(() => {
					swapTimer.current = void 0;
					props.act({
						type: "battle-swap",
						from,
						to
					}).then(async (response) => {
						setSwapMotion(void 0);
						const finalBattle = response?.state.battle;
						if (response?.animation !== void 0 && finalBattle?.id === battle.id) await playCascade(response.animation, finalBattle.board);
					}).finally(() => {
						setClearingTiles(void 0);
						setFallRows(void 0);
						setActiveChain(void 0);
						setAnimating(false);
					});
				}, 130);
			};
			const castSkill = (creatureInstanceId) => {
				if (boardLocked) return;
				setAnimating(true);
				props.act({
					type: "battle-cast",
					creatureInstanceId
				}).then(async (response) => {
					const finalBattle = response?.state.battle;
					if (response?.animation !== void 0 && finalBattle?.id === battle.id) await playCascade(response.animation, finalBattle.board);
				}).finally(() => {
					setClearingTiles(void 0);
					setFallRows(void 0);
					setActiveChain(void 0);
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
			const moveGesture = (index, clientX, clientY, tileSize) => {
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
				setGesture(nextGesture);
				const threshold = Math.max(15, tileSize * .28);
				if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) < threshold) return;
				const target = swipeTarget(index, offsetX, offsetY);
				if (target === void 0) return;
				gestureRef.current = void 0;
				suppressNextClick(350);
				swap(index, target);
			};
			return (0, react_jsx_runtime.jsx)("div", {
				className: tracewild_module_css_default.battleBackdrop,
				children: (0, react_jsx_runtime.jsxs)("section", {
					className: `${tracewild_module_css_default.battlePanel} ${partyHitKey > 0 ? tracewild_module_css_default.battleWasHit : ""}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": battle.mode === "tower" ? props.t("towerBattle") : props.t("battle"),
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
							] })] }), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: tracewild_module_css_default.flee,
								disabled: locked || battle.turnOwner === "boss",
								onClick: () => {
									props.act({ type: "flee" });
								},
								children: props.t("flee")
							})]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: `${tracewild_module_css_default.wildBanner} ${encounter?.enhanced === true || battle.mode === "tower" ? tracewild_module_css_default.fighterEnhanced : ""}`,
							children: [
								(0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.enemyAura,
									"aria-hidden": "true"
								}),
								(0, react_jsx_runtime.jsx)(CreatureSprite, {
									creature: wild,
									size: "medium"
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.wildVitals,
									children: [
										(0, react_jsx_runtime.jsxs)("div", {
											className: tracewild_module_css_default.fighterName,
											children: [(0, react_jsx_runtime.jsx)("strong", { children: creatureName(wild, props.zh) }), (0, react_jsx_runtime.jsxs)("span", { children: [
												"Lv.",
												battle.wildLevel,
												" · ",
												props.t(CORE_KEYS[battle.wildQuality]),
												" · ",
												props.t(ECOLOGY_KEYS[wild.ecology]),
												battle.mode === "tower" ? ` · ${props.t("towerSkillTier", { tier: battle.bossSkillTier })}` : ""
											] })]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: `${tracewild_module_css_default.hpBar} ${tracewild_module_css_default.hpWild}`,
											children: [(0, react_jsx_runtime.jsx)("em", { style: { width: `${percent(predictedHp, battle.wildMaxHp)}%` } }), (0, react_jsx_runtime.jsx)("i", { style: { width: `${percent(battle.wildHp, battle.wildMaxHp)}%` } })]
										}),
										(0, react_jsx_runtime.jsxs)("small", { children: [
											props.t("health"),
											" ",
											battle.wildHp,
											"/",
											battle.wildMaxHp,
											" · ",
											props.t("armor"),
											" ",
											battle.wildArmor,
											battle.wildShield > 0 ? ` · ${props.t("shield")} ${battle.wildShield}` : "",
											battle.pendingTeamDamage > 0 ? ` · ${props.t("pendingDamage")} ${battle.pendingTeamDamage}` : ""
										] }),
										(0, react_jsx_runtime.jsx)("div", {
											className: tracewild_module_css_default.energyBar,
											children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${percent(battle.bossEnergy, 24)}%` } })
										}),
										(0, react_jsx_runtime.jsxs)("small", { children: [
											props.t("bossEnergy"),
											" ",
											battle.bossEnergy,
											"/24 · ",
											battle.bossSkillArmed ? props.t("skillReady") : props.t("skillCharging"),
											battle.turnOwner === "boss" ? ` · ${props.t("bossCharge")} ${battle.bossAttackCharge.toFixed(1)}` : ""
										] })
									]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.enemyIntent,
									children: [
										(0, react_jsx_runtime.jsx)("span", { children: props.t("enemyIntent") }),
										(0, react_jsx_runtime.jsx)("strong", { children: props.t(INTENT_KEYS[battle.enemyIntent]) }),
										(0, react_jsx_runtime.jsx)("small", { children: enemyTarget })
									]
								}),
								damageBurst !== void 0 && (0, react_jsx_runtime.jsxs)("strong", {
									className: tracewild_module_css_default.damageBurst,
									children: ["-", damageBurst.amount]
								}, damageBurst.key),
								lastLog?.kind === "combo" && (0, react_jsx_runtime.jsxs)("strong", {
									className: tracewild_module_css_default.comboBurst,
									children: ["CHAIN ×", lastLog.amount ?? 1]
								})
							]
						}, `${battle.id}-${battle.wildHp}`),
						(0, react_jsx_runtime.jsxs)("div", {
							className: tracewild_module_css_default.matchBattleLayout,
							children: [
								(0, react_jsx_runtime.jsx)("div", {
									className: tracewild_module_css_default.partyColumn,
									children: (0, react_jsx_runtime.jsx)("div", {
										className: tracewild_module_css_default.partyBattleList,
										children: battle.party.map((member, index) => {
											const creature = creatureById(member.creatureId);
											const skill = skillByCreatureId(member.creatureId);
											if (creature === void 0 || skill === void 0) return null;
											const isActive = index === battle.activeIndex;
											const canCast = battle.turnOwner === "player" && isActive && member.hp > 0 && battle.actionsRemaining > 0 && !battle.captureWindow && member.energy >= skill.energyCost && !member.skillUsedStage;
											return (0, react_jsx_runtime.jsxs)("article", {
												className: `${tracewild_module_css_default.partyCombatant} ${isActive ? tracewild_module_css_default.partyCombatantActive : ""} ${member.hp <= 0 ? tracewild_module_css_default.partyCombatantDown : ""}`,
												title: `${props.t("passiveSkill")} · ${props.zh ? skill.passiveNameZh : skill.passiveNameEn}\n${props.zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn}`,
												children: [
													(0, react_jsx_runtime.jsx)("span", {
														className: tracewild_module_css_default.partySlot,
														children: index + 1
													}),
													(0, react_jsx_runtime.jsx)(CreatureSprite, {
														creature,
														size: "small"
													}),
													(0, react_jsx_runtime.jsxs)("div", {
														className: tracewild_module_css_default.partyCombatantBody,
														children: [
															(0, react_jsx_runtime.jsxs)("div", {
																className: tracewild_module_css_default.fighterName,
																children: [(0, react_jsx_runtime.jsx)("strong", { children: creatureName(creature, props.zh) }), (0, react_jsx_runtime.jsx)("span", { children: props.t(CORE_KEYS[member.quality]) })]
															}),
															(0, react_jsx_runtime.jsx)("div", {
																className: tracewild_module_css_default.hpBar,
																children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${percent(member.hp, member.maxHp)}%` } })
															}),
															(0, react_jsx_runtime.jsx)("div", {
																className: tracewild_module_css_default.energyBar,
																children: (0, react_jsx_runtime.jsx)("i", { style: { width: `${percent(member.energy, skill.energyCost)}%` } })
															}),
															(0, react_jsx_runtime.jsxs)("small", { children: [
																member.hp,
																"/",
																member.maxHp,
																" · ",
																props.t("energy"),
																" ",
																member.energy,
																"/",
																skill.energyCost
															] }),
															member.stageDamage > 0 && (0, react_jsx_runtime.jsxs)("small", { children: [
																props.t("stageDamage"),
																" +",
																member.stageDamage
															] }),
															member.frozenStages > 0 && (0, react_jsx_runtime.jsx)("strong", {
																className: tracewild_module_css_default.frozenBadge,
																children: props.t("frozen")
															}),
															(0, react_jsx_runtime.jsx)("button", {
																type: "button",
																className: tracewild_module_css_default.skillButton,
																disabled: locked || !canCast,
																onClick: () => {
																	castSkill(member.instanceId);
																},
																title: props.zh ? skill.activeDescriptionZh : skill.activeDescriptionEn,
																children: props.zh ? skill.activeNameZh : skill.activeNameEn
															})
														]
													})
												]
											}, member.instanceId);
										})
									}, `party-${partyHitKey}-${battle.activeIndex}`)
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.boardColumn,
									children: [
										(0, react_jsx_runtime.jsxs)("div", {
											className: `${tracewild_module_css_default.turnSummary} ${battle.turnOwner === "boss" ? tracewild_module_css_default.turnSummaryBoss : ""}`,
											children: [
												(0, react_jsx_runtime.jsx)("span", {
													className: `${tracewild_module_css_default.ecologyPip} ${tracewild_module_css_default[`pip_${battle.turnOwner === "boss" ? wild.ecology : activeDefinition.ecology}`]}`,
													children: TILE_SYMBOLS[battle.turnOwner === "boss" ? wild.ecology : activeDefinition.ecology]
												}),
												(0, react_jsx_runtime.jsx)("strong", { children: battle.turnOwner === "boss" ? `${creatureName(wild, props.zh)} · ${props.t("bossTurn")}` : `${creatureName(activeDefinition, props.zh)} · ${props.t("activeTurn")}` }),
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
										(0, react_jsx_runtime.jsx)("div", {
											className: tracewild_module_css_default.matchBoard,
											role: "grid",
											"aria-label": props.t("boardHelp"),
											"aria-busy": boardLocked,
											children: visualBoard.map((tile, index) => {
												const dragging = gesture?.index === index;
												const fallDistance = fallRows?.[index] ?? 0;
												const tileStyle = {
													"--tile-row": Math.floor(index / 7),
													"--drag-x": `${dragging ? gesture.offsetX : 0}px`,
													"--drag-y": `${dragging ? gesture.offsetY : 0}px`,
													"--fall-y": `${fallDistance * -110}%`,
													"--fall-duration": `${240 + fallDistance * 34}ms`,
													"--fall-delay": `${index % 7 * 9}ms`
												};
												return (0, react_jsx_runtime.jsxs)("button", {
													type: "button",
													role: "gridcell",
													draggable: false,
													style: tileStyle,
													className: `${tracewild_module_css_default.matchTile} ${tracewild_module_css_default[`tile_${tile.ecology}`]} ${selectedTile === index ? tracewild_module_css_default.matchTileSelected : ""} ${dragging ? tracewild_module_css_default.matchTileDragging : ""} ${clearingTiles?.has(index) === true ? tracewild_module_css_default.matchTileClearing : ""} ${fallDistance > 0 ? tracewild_module_css_default.matchTileFalling : ""} ${tile.special !== "none" ? tracewild_module_css_default.matchTileSpecial : ""} ${(tile.lockedActions ?? 0) > 0 ? tracewild_module_css_default.matchTileLocked : ""} ${swapMotionClass(index, swapMotion)}`,
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
														if (boardLocked || (tile.lockedActions ?? 0) > 0) return;
														event.currentTarget.setPointerCapture(event.pointerId);
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
														moveGesture(index, event.clientX, event.clientY, event.currentTarget.clientWidth);
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
														setGesture(void 0);
														if (target !== void 0) swap(index, target);
													},
													onPointerCancel: () => {
														gestureRef.current = void 0;
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
														})
													]
												}, index);
											})
										}),
										(0, react_jsx_runtime.jsx)("p", {
											className: tracewild_module_css_default.boardHelp,
											children: props.t("boardHelp")
										})
									]
								}),
								battle.mode === "wild" ? (0, react_jsx_runtime.jsxs)("div", {
									className: `${tracewild_module_css_default.capturePanel} ${captureReady ? tracewild_module_css_default.capturePanelReady : ""}`,
									children: [
										(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("capture") }), (0, react_jsx_runtime.jsx)("span", { children: captureReady ? props.t("captureReady") : battle.turnOwner === "boss" ? props.t("bossActing") : props.t("captureLocked") })] }),
										availableCores.length === 0 && (0, react_jsx_runtime.jsx)("p", { children: props.t("noCores") }),
										(0, react_jsx_runtime.jsx)("div", {
											className: tracewild_module_css_default.captureButtons,
											children: availableCores.map((quality) => (0, react_jsx_runtime.jsxs)("button", {
												type: "button",
												className: tracewild_module_css_default[`core_${quality}`],
												disabled: locked || !captureReady,
												onClick: () => {
													props.act({
														type: "capture",
														quality
													});
												},
												"aria-label": `${props.t(CORE_KEYS[quality])} · ${props.state.cores[quality]}`,
												children: [
													(0, react_jsx_runtime.jsx)("i", {}),
													(0, react_jsx_runtime.jsx)("span", { children: props.t(CORE_KEYS[quality]) }),
													(0, react_jsx_runtime.jsxs)("b", { children: [Math.round(visibleCaptureChance(props.state, quality) * 100), "%"] }),
													(0, react_jsx_runtime.jsxs)("small", { children: ["×", props.state.cores[quality]] })
												]
											}, quality))
										}),
										battle.turnOwner === "player" && !battle.captureWindow && battle.actionsRemaining > 0 && (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: `${tracewild_module_css_default.continueButton} ${tracewild_module_css_default.skipStageButton}`,
											disabled: locked,
											title: props.t("skipStageHint"),
											onClick: () => {
												props.act({ type: "battle-skip-stage" });
											},
											children: props.t("skipStage")
										}),
										battle.turnOwner === "player" && (battle.captureWindow || battle.actionsRemaining === 0) && (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: tracewild_module_css_default.continueButton,
											disabled: locked,
											onClick: () => {
												props.act({ type: "battle-continue" });
											},
											children: battle.captureWindow ? props.t("continueBattle") : props.t("skipFrozen")
										})
									]
								}) : (0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.towerBattleStatus,
									children: [
										(0, react_jsx_runtime.jsx)("span", {
											className: tracewild_module_css_default.towerBattleMark,
											"aria-hidden": "true",
											children: "▲"
										}),
										(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: props.t("towerNoCapture") }), (0, react_jsx_runtime.jsx)("small", { children: props.t("towerBattleReward", { floor: battle.towerFloor ?? 1 }) })] }),
										(0, react_jsx_runtime.jsx)("b", { children: props.t("towerSkillTier", { tier: battle.bossSkillTier }) }),
										battle.turnOwner === "player" && battle.actionsRemaining === 0 && (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: tracewild_module_css_default.continueButton,
											disabled: locked,
											onClick: () => {
												props.act({ type: "battle-continue" });
											},
											children: props.t("skipFrozen")
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: tracewild_module_css_default.battleFooterArea,
									children: [
										(battle.pendingTeamDamage > 0 || battle.lastTeamStrike > 0) && (0, react_jsx_runtime.jsxs)("div", {
											className: tracewild_module_css_default.teamStrikeSummary,
											children: [(0, react_jsx_runtime.jsxs)("span", { children: [
												props.t("pendingDamage"),
												" ",
												(0, react_jsx_runtime.jsx)("b", { children: battle.pendingTeamDamage })
											] }), (0, react_jsx_runtime.jsxs)("span", { children: [
												props.t("lastTeamStrike"),
												" ",
												(0, react_jsx_runtime.jsx)("b", { children: battle.lastTeamDamageApplied })
											] })]
										}),
										(0, react_jsx_runtime.jsx)("p", { children: props.t("battleHint") }),
										(0, react_jsx_runtime.jsx)("ol", {
											className: tracewild_module_css_default.battleLog,
											children: latestLog.map((row, index) => (0, react_jsx_runtime.jsx)("li", { children: battleLogText(row, props.t, props.zh) }, `${row.turn}-${row.kind}-${index}`))
										})
									]
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region lib/types/client/components/TraceWildSettings.js
		/** DSH Settings entry for the persisted Codekin gameplay switch. */
		function TraceWildSettings({ t }) {
			const connection = (0, react.useMemo)(() => createTraceWildConnection(), []);
			const [snapshot, setSnapshot] = (0, react.useState)();
			const [online, setOnline] = (0, react.useState)(true);
			const [busy, setBusy] = (0, react.useState)(false);
			const [failed, setFailed] = (0, react.useState)(false);
			const refresh = (0, react.useCallback)(async (signal) => {
				try {
					setSnapshot(await connection.load(signal));
					setOnline(true);
					setFailed(false);
				} catch {
					if (signal?.aborted !== true) {
						setOnline(false);
						setFailed(true);
					}
				}
			}, [connection]);
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				refresh(controller.signal);
				const unsubscribe = connection.subscribe(setSnapshot, setOnline);
				return () => {
					controller.abort();
					unsubscribe();
				};
			}, [connection, refresh]);
			const enabled = snapshot?.state.enabled ?? false;
			const toggle = async () => {
				if (busy || snapshot === void 0) return;
				setBusy(true);
				setFailed(false);
				try {
					setSnapshot(await connection.act({
						type: "set-enabled",
						enabled: !enabled
					}));
					setOnline(true);
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
							src: "/api/tracewild/assets/sprites/codekin-launcher-v1.webp",
							alt: "",
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
					(0, react_jsx_runtime.jsx)("p", {
						className: failed || !online ? tracewild_module_css_default.settingsError : tracewild_module_css_default.settingsStatus,
						role: "status",
						children: failed || !online ? t("settingsUnavailable") : snapshot === void 0 ? t("settingsLoading") : enabled ? t("settingsOnHint") : t("settingsOffHint")
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		const NS = "tracewild";
		const zh = {
			title: "码灵",
			subtitle: "你的 DSH 活动正在生成一座码灵世界",
			open: "打开码灵",
			close: "关闭",
			dragWindow: "按住标题栏可拖动，双击归位",
			dragLauncher: "可拖动入口位置",
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
			map: "码灵地图",
			squad: "编队",
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
			captureFailed: "收容失败，异常体进入了完整 Boss 行动阶段。",
			battleLost: "出战编队失去战斗能力，已安全撤回。",
			skillReleased: "主动协议已释放。",
			skipStage: "结束本码灵行动",
			skipStageHint: "保留目标运行值，直接交给下一只码灵；队伍走完后仍会结算已累计的总算力。",
			battleStageSkipped: "当前码灵结束了行动",
			noCores: "没有可用核心；完成 DSH 回合会获得新的核心。",
			battleHint: "双方基础 3 次行动；直消 4 颗返还行动，直消 5 颗增加行动。队伍总攻后进入 Boss 自动三消阶段。",
			captureLocked: "完成队伍总攻并将目标运行值压到 50% 以下，才会出现捕捉窗口。",
			captureReady: "目标已进入可捕捉状态。",
			passiveSkill: "被动",
			activeSkill: "主动",
			castSkill: "释放主动",
			skillReady: "指令值已满",
			skillCharging: "正在充能",
			skillSpent: "本阶段已释放",
			enemyIntent: "敌方意图",
			intentStrike: "单体突击",
			intentSweep: "全体震荡",
			intentGuard: "防护反击",
			intentDisrupt: "重排棋盘",
			intentCorrupt: "异常侵染",
			intentMark: "智算锁定",
			intentLock: "属性珠封锁",
			intentFreeze: "行动冻结",
			targetAll: "全体",
			targetSelf: "自身",
			targetSingle: "单体",
			lockedTile: "封锁中",
			specialRow: "横向指令",
			specialColumn: "纵向指令",
			specialBurst: "脉冲指令",
			specialOrigin: "核心指令",
			squadHelp: "最多选择 3 只，按顺序轮流行动；每只拥有连续 3 次交换。",
			saveSquad: "保存编队",
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
			growthTarget: "选择养成对象",
			growthTargetHint: "背包共 {count} 只，仅显示当前选中的码灵",
			idleReward: "上次领取了 {minutes} 分钟挂机补给",
			defeatCount: "击败野生码灵",
			claimIdleReward: "领取挂机补给",
			idleRewardReady: "挂机补给已备好",
			idleRewardMinutes: "累计 {minutes} 分钟",
			idleClaimed: "挂机补给已领取",
			rewardUnavailable: "补给已失效或已被领取",
			rewardKicker: "CODE CACHE",
			rewardTitle: "获得物品",
			rewardDismiss: "点击空白处继续",
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
			battlePhaseShift: "Boss 进入第二阶段并获得 {amount} 点防护层",
			battleActionRefund: "直消 4 颗，返还本次行动",
			battleActionBonus: "直消 5 颗，追加 {amount} 次行动",
			battleTeamStrike: "队伍总攻造成 {amount} 点最终伤害",
			battleCaptureFail: "核心未能稳定目标",
			pendingDamage: "待结算总算力",
			stageDamage: "本阶段算力",
			frozen: "冻结",
			continueBattle: "继续战斗",
			skipFrozen: "跳过冻结阶段",
			lastTeamStrike: "上次队伍总攻",
			bossTurn: "Boss 回合",
			bossMoves: "Boss 行动",
			bossEnergy: "Boss 指令值",
			bossCharge: "算力蓄积",
			bossActing: "Boss 正在选择交换并积攒算力",
			battleBossMatch: "Boss 消除了 {amount} 颗色珠",
			battleBossCombo: "Boss 触发 {amount} 层连锁",
			battleBossEnergy: "Boss 获得 {amount} 点指令值",
			battleBossRefund: "Boss 直消 4 颗，返还本次行动",
			battleBossBonus: "Boss 直消 5 颗，追加 {amount} 次行动",
			battleBossSkill: "Boss 释放了专属技能"
		};
		const en = {
			title: "Codekin",
			subtitle: "Your DSH activity is growing a world of Codekin",
			open: "Open Codekin",
			close: "Close",
			dragWindow: "Drag the title bar to move; double-click to center",
			dragLauncher: "Drag to reposition",
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
			map: "Codekin Map",
			squad: "Squad",
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
			captureFailed: "Capture failed and the Codekin entered its full Boss phase.",
			battleLost: "Your squad was safely recalled after losing the battle.",
			skillReleased: "Active protocol released.",
			skipStage: "End this Codekin turn",
			skipStageHint: "Preserve the target runtime and pass to the next Codekin. Already queued compute still settles after the squad cycle.",
			battleStageSkipped: "The active Codekin ended its turn",
			noCores: "No cores available. Complete DSH turns to earn more.",
			battleHint: "Both sides start with 3 actions. A direct 4-match refunds the action; a direct 5-match adds one. The Boss auto-matches after the team strike.",
			captureLocked: "Finish a team strike and reduce the target below 50% runtime to open a capture window.",
			captureReady: "The target can now be captured.",
			passiveSkill: "Passive",
			activeSkill: "Active",
			castSkill: "Cast active",
			skillReady: "Command full",
			skillCharging: "Charging",
			skillSpent: "Used this stage",
			enemyIntent: "Enemy intent",
			intentStrike: "Single strike",
			intentSweep: "Party sweep",
			intentGuard: "Guard counter",
			intentDisrupt: "Board reroute",
			intentCorrupt: "Glitch corruption",
			intentMark: "Compute lock",
			intentLock: "Attribute lock",
			intentFreeze: "Turn freeze",
			targetAll: "All allies",
			targetSelf: "Self",
			targetSingle: "One ally",
			lockedTile: "Locked",
			specialRow: "Row command",
			specialColumn: "Column command",
			specialBurst: "Pulse command",
			specialOrigin: "Core command",
			squadHelp: "Select up to 3. They rotate in order with 3 consecutive swaps each.",
			saveSquad: "Save squad",
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
			growthTarget: "Choose a growth target",
			growthTargetHint: "{count} Codekin owned · only the selected target is shown",
			idleReward: "Last claimed {minutes} minutes of idle supplies",
			defeatCount: "Wild Codekin defeated",
			claimIdleReward: "Claim idle supplies",
			idleRewardReady: "Idle supplies are ready",
			idleRewardMinutes: "{minutes} minutes accumulated",
			idleClaimed: "Idle supplies claimed",
			rewardUnavailable: "Those supplies are no longer available",
			rewardKicker: "CODE CACHE",
			rewardTitle: "Items acquired",
			rewardDismiss: "Click the empty area to continue",
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
			battlePhaseShift: "The Boss entered phase two and gained {amount} guard",
			battleActionRefund: "Direct 4-match refunded the action",
			battleActionBonus: "Direct 5-match added {amount} action",
			battleTeamStrike: "The team strike dealt {amount} final damage",
			battleCaptureFail: "The core failed to stabilize the target",
			pendingDamage: "Queued compute",
			stageDamage: "Stage compute",
			frozen: "Frozen",
			continueBattle: "Continue battle",
			skipFrozen: "Skip frozen stage",
			lastTeamStrike: "Last team strike",
			bossTurn: "Boss turn",
			bossMoves: "Boss actions",
			bossEnergy: "Boss command",
			bossCharge: "Compute charge",
			bossActing: "The Boss is choosing swaps and charging compute",
			battleBossMatch: "The Boss cleared {amount} tiles",
			battleBossCombo: "The Boss triggered a {amount}-stage cascade",
			battleBossEnergy: "The Boss gained {amount} command points",
			battleBossRefund: "Boss direct 4-match refunded the action",
			battleBossBonus: "Boss direct 5-match added {amount} action",
			battleBossSkill: "The Boss released its signature skill"
		};
		//#endregion
		//#region lib/types/client/index.js
		const inject = ["slots", "locale"];
		function installStyles() {
			if (typeof document === "undefined") return () => void 0;
			const existing = [...document.querySelectorAll("style[data-plugin-css]")].find((tag) => tag.dataset.pluginCss === tagId);
			const tag = existing ?? document.createElement("style");
			tag.dataset.plugin = "@nath-vikky/dsh-codekin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
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