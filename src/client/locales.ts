export const NS = 'tracewild'

export const zh = {
  title: '迹境荒野', subtitle: '你的 DSH 活动正在生成一片精灵生态', open: '打开迹境荒野', close: '关闭',
  map: '荒野地图', squad: '编队', dex: '图鉴', inventory: '核心与记录', loading: '正在连接迹境…',
  disconnected: '迹境暂时离线，正在等待 Host 恢复。', retry: '重试连接', newEncounter: '新的迹灵出现了',
  starterTitle: '选择你的初始迹灵', starterBody: '它会成为第一位出战伙伴。之后可随时调整三只迹灵的编队。',
  choose: '选择', mapEmpty: '继续正常使用 DSH，完成回合后这里会出现迹灵。', enhanced: '装甲异常体',
  battle: '协议对战', strike: '脉冲打击', scan: '观测聚焦', guard: '稳态防护', flee: '撤离',
  capture: '投放收容核心', armor: '异常护甲', focus: '观测层数', health: '生命', shield: '护盾', captured: '捕捉成功',
  captureFailed: '收容失败，异常体进行了反击。', battleLost: '出战迹灵失去战斗能力，已安全撤回。',
  noCores: '没有可用核心；完成 DSH 回合会获得新的核心。', battleHint: '先击破护甲并压低生命，再选择核心捕捉。',
  squadHelp: '最多选择 3 只。列表第一只会率先出战。', saveSquad: '保存编队', level: '等级', wins: '胜场',
  dexSeen: '已发现', dexCaught: '已收容', undiscovered: '未发现', totalTurns: '完成回合', failures: '异常事件',
  captureCount: '成功收容', streak: '当前连胜', eventLog: '最近生态事件', emptyLog: '还没有事件。',
  privacy: '只使用事件类型和结果生成玩法；不读取或保存提示词、回复、命令、路径及错误正文。',
  corePebble: '朴素核心', corePulse: '脉冲核心', corePrism: '棱晶核心', coreNova: '星辉核心', coreOrigin: '源初核心',
  ecologyLumen: '辉识域', ecologyForge: '铸构域', ecologyRelay: '脉联域', ecologyAegis: '守序域', ecologyGlitch: '异常域',
  rarityCommon: '常见', rarityUncommon: '少见', rarityRare: '稀有', rarityApex: '顶级',
  logCore: '完成事件掉落了核心', logEncounter: '地图出现了新的迹灵', logCapture: '收容了一只迹灵',
  logStarter: '初始伙伴加入编队', logDefeat: '对战撤回',
  battleStart: '遭遇开始', battleHit: '造成 {amount} 点伤害', battleArmor: '击破一层异常护甲',
  battleScan: '观测并造成 {amount} 点伤害', battleGuard: '建立 {amount} 点护盾',
  battleCounter: '受到 {amount} 点反击伤害', battleCaptureFail: '核心未能稳定目标',
} as const

export const en: Record<keyof typeof zh, string> = {
  title: 'TraceWild', subtitle: 'Your DSH activity is growing a creature ecology', open: 'Open TraceWild', close: 'Close',
  map: 'Wild Map', squad: 'Squad', dex: 'Dex', inventory: 'Cores & Log', loading: 'Connecting to the trace…',
  disconnected: 'TraceWild is offline. Waiting for the Host to recover.', retry: 'Reconnect', newEncounter: 'A new creature appeared',
  starterTitle: 'Choose your starter', starterBody: 'It becomes your first combat partner. You can later build a squad of three.',
  choose: 'Choose', mapEmpty: 'Use DSH normally. Completed turns will reveal creatures here.', enhanced: 'Armored anomaly',
  battle: 'Protocol Battle', strike: 'Pulse Strike', scan: 'Trace Focus', guard: 'Stable Guard', flee: 'Retreat',
  capture: 'Deploy capture core', armor: 'Anomaly armor', focus: 'Focus', health: 'Health', shield: 'Shield', captured: 'Capture successful',
  captureFailed: 'Capture failed and the creature counterattacked.', battleLost: 'Your creature was safely recalled after losing the battle.',
  noCores: 'No cores available. Complete DSH turns to earn more.', battleHint: 'Break armor and lower health before capturing.',
  squadHelp: 'Select up to 3. The first creature leads each battle.', saveSquad: 'Save squad', level: 'Level', wins: 'Wins',
  dexSeen: 'Seen', dexCaught: 'Captured', undiscovered: 'Undiscovered', totalTurns: 'Completed turns', failures: 'Anomalies',
  captureCount: 'Captures', streak: 'Current streak', eventLog: 'Recent ecology events', emptyLog: 'No events yet.',
  privacy: 'Uses only event types and outcomes. Prompts, replies, commands, paths, and raw errors are never read or stored.',
  corePebble: 'Plain Core', corePulse: 'Pulse Core', corePrism: 'Prism Core', coreNova: 'Nova Core', coreOrigin: 'Origin Core',
  ecologyLumen: 'Lumen', ecologyForge: 'Forge', ecologyRelay: 'Relay', ecologyAegis: 'Aegis', ecologyGlitch: 'Glitch',
  rarityCommon: 'Common', rarityUncommon: 'Uncommon', rarityRare: 'Rare', rarityApex: 'Apex',
  logCore: 'A completed event dropped a core', logEncounter: 'A new creature appeared', logCapture: 'A creature was captured',
  logStarter: 'Your starter joined the squad', logDefeat: 'Battle retreat',
  battleStart: 'Encounter started', battleHit: 'Dealt {amount} damage', battleArmor: 'Broke one anomaly armor layer',
  battleScan: 'Traced and dealt {amount} damage', battleGuard: 'Raised {amount} shield',
  battleCounter: 'Took {amount} counter damage', battleCaptureFail: 'The core failed to stabilize the target',
}

export type TraceWildLocaleKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    tracewild: TraceWildLocaleKey
  }
}
