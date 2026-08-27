import type { CaptureCoreQuality } from './types.ts'

export interface CreatureSkillDefinition {
  creatureId: string
  energyCost: number
  passiveNameZh: string
  passiveNameEn: string
  passiveDescriptionZh: string
  passiveDescriptionEn: string
  activeNameZh: string
  activeNameEn: string
  activeDescriptionZh: string
  activeDescriptionEn: string
}

export const QUALITY_SKILL_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>> = Object.freeze({
  pebble: 1,
  pulse: 1.08,
  prism: 1.16,
  nova: 1.26,
  origin: 1.38,
})

type SkillRow = readonly [
  creatureId: string,
  passiveNameZh: string,
  passiveNameEn: string,
  passiveDescriptionZh: string,
  passiveDescriptionEn: string,
  activeNameZh: string,
  activeNameEn: string,
  activeDescriptionZh: string,
  activeDescriptionEn: string,
]

const ROWS: readonly SkillRow[] = Object.freeze([
  ['lumen-indeximp', '索引标记', 'Index Mark', '每轮首次辉识消除施加标记。', 'The first Lumen match each round applies Mark.', '索引闪光', 'Index Flash', '造成伤害，将 3 格转为辉识。', 'Deals damage and converts 3 tiles to Lumen.'],
  ['lumen-foliomoth', '页翼抚慰', 'Page Comfort', '四连辉识会治疗生命最低的队员。', 'A 4+ Lumen match heals the lowest-health ally.', '页幕', 'Page Veil', '治疗全队并为行动精灵提供护盾。', 'Heals the squad and shields the active creature.'],
  ['lumen-lensel', '连锁洞察', 'Chain Insight', '每阶段首次二层连锁额外获得能量。', 'The first 2+ cascade each stage grants extra energy.', '棱镜追踪', 'Prism Trace', '将 4 格转为克制敌方的属性。', 'Converts 4 tiles to the element that counters the enemy.'],
  ['lumen-echocoil', '回声余韵', 'Echo Residue', '每轮首次二层连锁追加一次回声伤害。', 'The first 2+ cascade each round echoes part of its damage.', '回声档案', 'Echo Archive', '重放上一次有效交换的伤害。', 'Replays damage from the previous valid swap.'],
  ['lumen-atlashart', '星图起点', 'Atlas Opening', '每轮首次消除拥有更高连锁倍率。', 'The first match each round starts with a higher combo multiplier.', '星图领域', 'Atlas Field', '接下来两步的属性倍率最低为克制。', 'The next two moves use at least the advantaged multiplier.'],
  ['forge-sparkmite', '火花追击', 'Spark Follow-up', '四连锻炉追加一次小型打击。', 'A 4+ Forge match adds a small follow-up hit.', '火花跃迁', 'Spark Hop', '连续造成三次伤害。', 'Deals three consecutive hits.'],
  ['forge-rivetclaw', '铆钉蓄势', 'Rivet Charge', '受击后强化下一次锻炉伤害。', 'Taking damage strengthens the next Forge hit.', '铆钉回弹', 'Rivet Rebound', '获得护盾并准备一次反击。', 'Gains a shield and prepares a counterattack.'],
  ['forge-solderling', '熔线共燃', 'Solder Burn', '锻炉与其他颜色连锁时施加灼烧。', 'Forge chained with another color applies Burn.', '熔线桥', 'Solder Bridge', '将 4 格转为锻炉并施加灼烧。', 'Converts 4 tiles to Forge and applies Burn.'],
  ['forge-anvilback', '重砧破层', 'Anvil Break', '五连锻炉额外破除护甲。', 'A 5+ Forge match breaks extra armor.', '落砧', 'Falling Anvil', '重击并破除最多 3 层护甲。', 'Strikes heavily and breaks up to 3 armor.'],
  ['forge-kiln-colossus', '炉温递增', 'Rising Heat', '锻炉连锁会强化灼烧。', 'Forge cascades increase Burn pressure.', '炉心过载', 'Kiln Overload', '清除全部锻炉色块并造成伤害。', 'Clears every Forge tile and deals damage.'],
  ['relay-pingfly', '抢先握手', 'Early Handshake', '进入行动位时获得 2 能量。', 'Gains 2 energy when entering the active slot.', '信标握手', 'Beacon Handshake', '自动生成并结算一个中继三连。', 'Creates and resolves a Relay match.'],
  ['relay-duplex-hare', '双相节拍', 'Duplex Rhythm', '奇数轮强化伤害，偶数轮强化充能。', 'Odd rounds boost damage; even rounds boost energy.', '双相切换', 'Duplex Switch', '下一次消除的首段伤害重复一次。', 'Repeats the first damage segment of the next move.'],
  ['relay-routeray', '软路由', 'Soft Route', '每阶段首次中继消除会整理一行色块。', 'The first Relay match each stage tidies one row.', '路径重排', 'Route Reroute', '重新布置棋盘并保留特殊色块。', 'Rearranges the board while preserving special tiles.'],
  ['relay-forktail', '分岔连击', 'Fork Combo', '连锁获得额外倍率。', 'Cascades gain additional combo power.', '分岔回返', 'Fork Return', '下一次消除会追加一次回返伤害。', 'The next match adds a returning hit.'],
  ['relay-mesh-jelly', '群网供能', 'Mesh Supply', '中继充能时也为其他队员提供少量能量。', 'Relay energy also supplies other allies.', '群网共振', 'Mesh Resonance', '全队获得能量并将 3 格转为中继。', 'Grants squad energy and converts 3 tiles to Relay.'],
  ['aegis-veribud', '校验露珠', 'Verify Dew', '每阶段首次守序消除治疗行动精灵。', 'The first Aegis match each stage heals the active creature.', '完整校验', 'Full Verify', '净化并治疗全队。', 'Cleanses and heals the squad.'],
  ['aegis-loop-tortoise', '环路甲壳', 'Loop Shell', '进入行动位时获得护盾。', 'Gains a shield when entering the active slot.', '环路守护', 'Loop Guard', '为全队提供护盾。', 'Shields the entire squad.'],
  ['aegis-anchorbee', '特殊锚点', 'Special Anchor', '触发特殊色块时获得护盾。', 'Triggering a special tile grants a shield.', '定锚力场', 'Anchor Field', '延迟敌方并保护棋盘一阶段。', 'Delays the enemy and protects the board for one stage.'],
  ['aegis-steady-ram', '逆势稳态', 'Resisted Steady', '抵抗色块造成伤害时生成护盾。', 'Resisted tile damage creates a shield.', '稳态反弹', 'Steady Rebound', '获得护盾并造成伤害。', 'Gains a shield and deals damage.'],
  ['aegis-dawnguard', '曙光保全', 'Dawn Safeguard', '每场战斗首次致命伤会被保全。', 'Prevents the first lethal hit each battle.', '曙光重启', 'Dawn Restart', '治疗并保护全队。', 'Heals and shields the squad.'],
  ['glitch-null-nibbler', '空值侵蚀', 'Null Erosion', '故障消除会额外破除护甲或护盾。', 'Glitch matches erode extra armor or shield.', '空值啃噬', 'Null Bite', '移除防护并造成伤害。', 'Removes protection and deals damage.'],
  ['glitch-stack-weaver', '栈裂增殖', 'Stack Growth', '二层连锁后生成一个故障色块。', 'A 2+ cascade creates a Glitch tile.', '断栈蛛网', 'Broken Stack Web', '将 5 格转为故障并施加标记。', 'Converts 5 tiles to Glitch and applies Mark.'],
  ['glitch-lagtoad', '超时缓冲', 'Timeout Buffer', '首次有队员半血时延迟敌方。', 'Delays the enemy the first time an ally drops below half health.', '延迟回击', 'Delayed Payback', '造成伤害并延迟敌方。', 'Deals damage and delays the enemy.'],
  ['glitch-crashfox', '红线爆发', 'Redline Burst', '低生命时显著提高伤害。', 'Deals substantially more damage at low health.', '崩溃闪焰', 'Crash Flare', '造成高额伤害并损失少量当前生命。', 'Deals heavy damage at a small current-health cost.'],
  ['glitch-overflow-maw', '能量溢流', 'Energy Overflow', '满能量后的少量溢出强化主动技能。', 'Limited energy overflow strengthens the active skill.', '边界溢流', 'Boundary Overflow', '吞噬故障色块并转化为伤害。', 'Consumes Glitch tiles and converts them into damage.'],
])

export const CREATURE_SKILLS: readonly CreatureSkillDefinition[] = Object.freeze(ROWS.map(row => Object.freeze({
  creatureId: row[0],
  energyCost: 12,
  passiveNameZh: row[1],
  passiveNameEn: row[2],
  passiveDescriptionZh: row[3],
  passiveDescriptionEn: row[4],
  activeNameZh: row[5],
  activeNameEn: row[6],
  activeDescriptionZh: row[7],
  activeDescriptionEn: row[8],
})))

const BY_CREATURE_ID = new Map(CREATURE_SKILLS.map(skill => [skill.creatureId, skill]))

export function skillByCreatureId(creatureId: string): CreatureSkillDefinition | undefined {
  return BY_CREATURE_ID.get(creatureId)
}
