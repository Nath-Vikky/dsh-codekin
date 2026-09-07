# 码灵（Codekin）

[English](README.md) · [GitHub 版本发布](https://github.com/Nath-Vikky/dsh-codekin/releases) · [npm 包](https://www.npmjs.com/package/@nath-vikky/dsh-codekin) · [引擎与内容包架构](docs/architecture.zh-CN.md)

码灵是一款面向 DeepSeek Harness Web 的精灵收集与三消对战插件。日常使用 DSH 即可获得本地遭遇与补给，收集码灵、组建三人队伍，挑战无尽栈塔。插件不会修改提示词、工具、模型请求或 Agent 行为。

## 实机预览

以下画面截自码灵 `0.3.7-rc.1` 的独立演示存档，运行于 DSH `0.1.2-rc.1`，同时安装了 `dsh-web 0.3.17`。

<p align="center">
  <img src=".github/readme/codekin-battle.webp" alt="完全体战斗界面：上半身聚焦立绘与排队队友头像" width="31%">
  <img src=".github/readme/codekin-detail.webp" alt="60 级群星水母完全体详情，保留主题场景并去除外围底色" width="31%">
  <img src=".github/readme/codekin-wardrobe.webp" alt="衣架外观选择：原形、进化形与完全体" width="31%">
</p>

<p align="center"><sub>完全体战斗立绘 · 全景详情展示 · 三阶段外观选择</sub></p>

<p align="center">
  <img src=".github/readme/codekin-roster.webp" alt="包含等级、品质和出战标识的码灵列表" width="46%">
  <img src=".github/readme/codekin-tower.webp" alt="无尽栈塔挑战与进度" width="46%">
</p>

<p align="center"><sub>收集与编队管理 · 无尽栈塔</sub></p>

### 首批 25 只码灵

![码灵首批 25 只精灵](assets/creatures/sprite-gallery-v1.png)

## 安装与启用

### 当前版本：码灵 `0.3.7-rc.1`

请使用 **DSH `0.1.2-rc.1`**。截至 2026 年 9 月 7 日，[dsh-web 最新版为 `0.3.17`](https://github.com/zhu1090093659/dsh-web/releases/tag/v0.3.17)，其[桌面包固定内置 DSH `0.1.2-rc.1`](https://github.com/zhu1090093659/dsh-web/blob/v0.3.17/desktop/runtime/host/package.json)，[聚合插件也声明相同的最低宿主版本](https://github.com/zhu1090093659/dsh-web/blob/v0.3.17/packages/dsh-web-all/package.json)。码灵本次发布沿用这一宿主与 SDK 基线。

通过 npm 安装，并明确指定版本：

```sh
pnpm dlx @deepseek-ai/dsh@0.1.2-rc.1 plugin --profile web add @nath-vikky/dsh-codekin@0.3.7-rc.1
```

同一版本也可通过 GitHub Release 安装包安装：

```sh
pnpm dlx @deepseek-ai/dsh@0.1.2-rc.1 plugin --profile web add --ignore-scripts https://github.com/Nath-Vikky/dsh-codekin/releases/download/v0.3.7-rc.1/nath-vikky-dsh-codekin-0.3.7-rc.1.tgz
```

执行命令时，请沿用现有 DSH 的 `DSH_HOME`，以更新正确的 Profile。安装后重启 DSH Web，在 **DSH 设置 → 码灵** 中启用。可拖动的入口会打开竖屏游戏窗口；挂机补给可领取时，入口会变成礼盒提醒。

npm `latest` 指向 **`0.3.7-rc.1`**。GitHub Release 与 npm 包包含相同的程序和立绘素材；npm 包另行更新了此处的安装说明。发布标签与活跃开发分支均包含经过检查的运行时 Bundle，支持源码安装。

### 版本对应关系

| 码灵 | DSH 宿主 | 分发与状态 |
| --- | --- | --- |
| **`0.3.7-rc.1`** | **`0.1.2-rc.1`** | npm `latest` 与当前 GitHub 版本；与 dsh-web `0.3.17` 使用相同宿主基线 |
| `0.3.6-rc.1` | `0.1.2-rc.1` | 上一版 GitHub 兼容版本 |
| `0.3.6-alpha.3` | `0.1.2-alpha.5` | 历史 GitHub 版本 |
| `0.3.5-alpha.2` | `0.1.2-alpha.2` | 上一版 npm 包，内容较旧 |
| `0.2.0` | `0.1.0-rc.5` | 旧版；源码保留在 `stable/0.2.x` |

以上是明确的版本配对，不表示支持所有上游预发行版本。DSH `0.1.3-alpha.2` 属于单独的 `alpha` 通道，不是本次发布的目标。

## `0.3.7-rc.1` 更新内容

- **30 级进化：**25 只码灵均解锁女性二次元进化立绘，升级时平滑切换，仅改变外观，不影响数值、技能和奖励。
- **60 级完全体：**星图鹿、炉心巨像、群星水母、曙光狮、溢流巨兽解锁全景完全体立绘。去除外围底色，保留人物与各自的主题场景。
- **衣架换装：**详情页关闭按钮旁的衣架可选择原形、进化形或完全体。解锁时自动切换一次，之后按每只码灵独立保存外观选择；已有符合等级条件的存档也会获得一次解锁。
- **战斗立绘：**进化体使用无圆框展示；完全体聚焦当前队员的上半身，排队队友放大到头像区域，主题背景淡化以便识别人物。
- **满能量轮廓与敌方警示：**指令值满后，闪烁沿人物轮廓呈现；Boss 行动时，棋盘上方显示醒目的红色警示条，并锁定玩家交换操作。

## 核心循环

1. 正常使用 DSH；一次完成的活动最多产生一个遭遇，并可能奖励捕获核心。
2. 领取挂机补给、查看区域地图，选择野生目标或无尽栈塔挑战。
3. 配置三只码灵编队，在 **8×8 棋盘**上交换相邻色块。
4. 战胜目标获取升级素材，或将野生目标运行值压低后尝试收容。
5. 完成 **1–100 级**养成，解锁立绘并选择喜欢的外观。

### 收集与养成

- 智算、编译、网络、防护、异常五类计算属性，首批 25 只码灵，五种品质的捕获核心与升级素材。
- 地图同时保留最多 7 只野生码灵。遭遇等级、稀有度、停留时间与区域分布会参考 DSH 的高层活动结果和整个背包的等级范围。
- 区域地图、图鉴、挂机补给，以及 Boss 等级、机制和奖励逐层增强的无尽栈塔。
- 码灵列表支持搜索、属性与品质筛选、等级排序；三个编队位置通过单独的编辑流程调整并保存。数值、技能、外观与素材升级集中在详情页。
- 放生需要确认，并返还一份同品质素材；物品面板展示素材经验值。

### 战斗

- 每名队员拥有三个基础行动；直接四连返还行动，五连增加行动。同属性消除积累指令值，并可生成横排、竖排、爆破和源初特殊色块。
- 队伍共享一条运行值；整轮累积伤害、恢复和防护后统一结算，搭配总攻数字、命中特效与血条动画。
- 五类属性色块构成闭环克制；同属性码灵行动时，还可触发运行修复、共享防护、智算同步、编译超频或异常穿透。
- Boss 可预告危险珠、协议封锁、锁珠、冻结、棋盘重排和防护层。`SKIP` 可提前结束当前队员阶段，便于保留低运行值的收容目标。
- 无效交换自动复位；支持键盘导航、减少动态效果，以及弹窗焦点闭环。

## 存档与卸载

进度保存在本地 `$DSH_HOME/codekinsave/state.json`，旧版 `tracewild/state.json` 会自动迁移。版本化存档记录引擎与内容包身份，必要的迁移会保留备份。

停用码灵会暂停事件奖励和挂机计时，同时保留进度。通过 dsh-web 插件管理器卸载时，默认保留存档。如需彻底移除，请先使用 **DSH 设置 → 码灵 → 删除本地存档**，再卸载插件。

码灵只记录有界游戏事件与聚合运行结果，不保存提示词正文、助手回复、工具参数、命令、工作区路径或原始错误内容。状态、操作、事件流和图片接口均使用 DSH 的浏览器认证。

## 开发与验证

运行时由确定性的无头引擎、经过校验的 Content API v1 内容包、DSH 适配层与独立 React 渲染层组成。详见[架构文档](docs/architecture.zh-CN.md)和[开发工具](tools/README.md)。

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm check
pnpm lifecycle:dsh
```

`pnpm check` 覆盖类型检查、单元测试、内容与资源校验、固定回放、七场景战斗模拟、生产构建和性能预算。CI 配置覆盖 Windows、macOS、Ubuntu 的 Node.js 22/24。安装生命周期在 DSH `0.1.2-rc.1` 中验证带认证的浏览器交互、键盘焦点、重启、卸载重装与存档保留。

仓库包含最终游戏素材与公开的实机截图。内部进化对照图册、参考图、源文件、提示词与测试存档均保留在仓库及发行包之外。

## 许可证

MIT
