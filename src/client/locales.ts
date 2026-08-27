export const NS = 'tracewild'

export const zh = {
  title: '迹境荒野', subtitle: '你的 DSH 活动正在生成一片精灵生态', open: '打开迹境荒野', close: '关闭',
  map: '荒野地图', squad: '编队', dex: '图鉴', inventory: '核心与记录', loading: '正在连接迹境…',
  disconnected: '迹境暂时离线，正在等待 Host 恢复。', retry: '重试连接', newEncounter: '新的迹灵出现了',
  starterTitle: '选择你的初始迹灵', starterBody: '它会成为第一位出战伙伴。之后可随时调整三只迹灵的编队。',
  choose: '选择', mapEmpty: '继续正常使用 DSH，完成回合后这里会出现迹灵。', enhanced: '装甲异常体',
  battle: '迹阵三消战', flee: '撤离', capture: '投放收容核心', armor: '护甲', health: '生命', shield: '护盾',
  energy: '能量', quality: '品质', round: '队伍轮次', movesRemaining: '剩余交换', activeTurn: '行动中',
  boardHelp: '选择两个相邻色块进行交换。无效交换不会消耗行动次数。', invalidSwap: '这次交换没有形成消除。',
  captured: '捕捉成功', captureFailed: '收容失败，异常体立即进行了反击。',
  battleLost: '出战编队失去战斗能力，已安全撤回。', skillReleased: '主动协议已释放。',
  noCores: '没有可用核心；完成 DSH 回合会获得新的核心。',
  battleHint: '每只迹灵连续交换 3 次；消除对应颜色会为同生态队员充能。',
  captureLocked: '击破护甲并将目标生命压到 30% 以下才能捕捉。', captureReady: '目标已进入可捕捉状态。',
  passiveSkill: '被动', activeSkill: '主动', castSkill: '释放主动', skillReady: '能量已满', skillCharging: '正在充能', skillSpent: '本阶段已释放',
  enemyIntent: '敌方意图', intentStrike: '强力攻击', intentGuard: '防护反击', intentDisrupt: '重排棋盘',
  intentCorrupt: '故障侵染', intentMark: '辉识锁定',
  specialRow: '横向轨迹核', specialColumn: '纵向轨迹核', specialBurst: '脉冲核', specialOrigin: '原点核',
  squadHelp: '最多选择 3 只，按顺序轮流行动；每只拥有连续 3 次交换。', saveSquad: '保存编队',
  level: '等级', wins: '胜场', dexSeen: '已发现', dexCaught: '已收容', undiscovered: '未发现',
  totalTurns: '完成回合', failures: '异常事件', captureCount: '成功收容', streak: '当前连胜',
  eventLog: '最近生态事件', emptyLog: '还没有事件。',
  privacy: '只使用事件类型和结果生成玩法；不读取或保存提示词、回复、命令、路径及错误正文。',
  corePebble: '朴素', corePulse: '脉冲', corePrism: '棱晶', coreNova: '星辉', coreOrigin: '源初',
  ecologyLumen: '辉识', ecologyForge: '锻炉', ecologyRelay: '中继', ecologyAegis: '守序', ecologyGlitch: '故障',
  rarityCommon: '常见', rarityUncommon: '少见', rarityRare: '稀有', rarityApex: '顶级',
  logCore: '完成事件掉落了核心', logEncounter: '地图出现了新的迹灵', logCapture: '收容了一只迹灵',
  logStarter: '初始伙伴加入编队', logDefeat: '对战撤回',
  battleStart: '遭遇开始', battleMatch: '三消造成 {amount} 点伤害', battleCombo: '触发 {amount} 层连锁',
  battleArmor: '击破一层异常护甲', battleSkill: '主动协议造成 {amount} 点效果',
  battleHeal: '恢复 {amount} 点生命', battleShield: '获得 {amount} 点护盾', battleEnemy: '受到 {amount} 点敌方伤害',
  battleEnemyShield: '敌方防护提升至 {amount}', battleEnemyDelay: '敌方行动被延迟', battleSwitch: '{name} 进入行动位',
  battleCaptureFail: '核心未能稳定目标',
} as const

export const en: Record<keyof typeof zh, string> = {
  title: 'TraceWild', subtitle: 'Your DSH activity is growing a creature ecology', open: 'Open TraceWild', close: 'Close',
  map: 'Wild Map', squad: 'Squad', dex: 'Dex', inventory: 'Cores & Log', loading: 'Connecting to the trace…',
  disconnected: 'TraceWild is offline. Waiting for the Host to recover.', retry: 'Reconnect', newEncounter: 'A new creature appeared',
  starterTitle: 'Choose your starter', starterBody: 'It becomes your first combat partner. You can later build a squad of three.',
  choose: 'Choose', mapEmpty: 'Use DSH normally. Completed turns will reveal creatures here.', enhanced: 'Armored anomaly',
  battle: 'Trace Match Battle', flee: 'Retreat', capture: 'Deploy capture core', armor: 'Armor', health: 'Health', shield: 'Shield',
  energy: 'Energy', quality: 'Quality', round: 'Squad round', movesRemaining: 'Swaps left', activeTurn: 'Active',
  boardHelp: 'Select two adjacent tiles to swap. Invalid swaps do not consume an action.', invalidSwap: 'That swap did not create a match.',
  captured: 'Capture successful', captureFailed: 'Capture failed and the creature immediately counterattacked.',
  battleLost: 'Your squad was safely recalled after losing the battle.', skillReleased: 'Active protocol released.',
  noCores: 'No cores available. Complete DSH turns to earn more.',
  battleHint: 'Each creature gets 3 swaps. Matching its ecology charges squad energy.',
  captureLocked: 'Break armor and reduce the target below 30% health to capture it.', captureReady: 'The target can now be captured.',
  passiveSkill: 'Passive', activeSkill: 'Active', castSkill: 'Cast active', skillReady: 'Energy full', skillCharging: 'Charging', skillSpent: 'Used this stage',
  enemyIntent: 'Enemy intent', intentStrike: 'Heavy strike', intentGuard: 'Guard counter', intentDisrupt: 'Board reroute',
  intentCorrupt: 'Glitch corruption', intentMark: 'Lumen lock',
  specialRow: 'Row trace core', specialColumn: 'Column trace core', specialBurst: 'Pulse core', specialOrigin: 'Origin core',
  squadHelp: 'Select up to 3. They rotate in order with 3 consecutive swaps each.', saveSquad: 'Save squad',
  level: 'Level', wins: 'Wins', dexSeen: 'Seen', dexCaught: 'Captured', undiscovered: 'Undiscovered',
  totalTurns: 'Completed turns', failures: 'Anomalies', captureCount: 'Captures', streak: 'Current streak',
  eventLog: 'Recent ecology events', emptyLog: 'No events yet.',
  privacy: 'Uses only event types and outcomes. Prompts, replies, commands, paths, and raw errors are never read or stored.',
  corePebble: 'Pebble', corePulse: 'Pulse', corePrism: 'Prism', coreNova: 'Nova', coreOrigin: 'Origin',
  ecologyLumen: 'Lumen', ecologyForge: 'Forge', ecologyRelay: 'Relay', ecologyAegis: 'Aegis', ecologyGlitch: 'Glitch',
  rarityCommon: 'Common', rarityUncommon: 'Uncommon', rarityRare: 'Rare', rarityApex: 'Apex',
  logCore: 'A completed event dropped a core', logEncounter: 'A new creature appeared', logCapture: 'A creature was captured',
  logStarter: 'Your starter joined the squad', logDefeat: 'Battle retreat',
  battleStart: 'Encounter started', battleMatch: 'Matched for {amount} damage', battleCombo: 'Triggered a {amount}-stage cascade',
  battleArmor: 'Broke one anomaly armor layer', battleSkill: 'Active protocol produced {amount} effect',
  battleHeal: 'Restored {amount} health', battleShield: 'Gained {amount} shield', battleEnemy: 'Took {amount} enemy damage',
  battleEnemyShield: 'Enemy protection rose to {amount}', battleEnemyDelay: 'Enemy action was delayed', battleSwitch: '{name} entered the active slot',
  battleCaptureFail: 'The core failed to stabilize the target',
}

export type TraceWildLocaleKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    tracewild: TraceWildLocaleKey
  }
}
