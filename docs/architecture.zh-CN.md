# 码灵架构

[English](architecture.md)

码灵 `0.3.2` 由无头游戏引擎和经过校验的内容包组合而成。默认 DSH 插件绑定官方核心内容包；Host 启动前，也可以通过同一组合 API 合并其他经过审查的内容包。

## 包职责

| 组件 | 职责 | 明确不包含 |
| --- | --- | --- |
| `packages/content-sdk` | Content API v1 类型、JSON Schema 校验、依赖解析、不可变注册表和客户端安全视图 | 游戏执行与 Host 权限 |
| `packages/engine` | 确定性的状态迁移、战斗、奖励、存档恢复和由引擎实现的机制指令 | React、Node.js API、DSH、官方生物 ID |
| `content-packs/core` | `0.3.2` 的 25 只生物、多语言文本、资源、遭遇、初始选择、爬塔轮换和声明式机制 | Host 逻辑和任意 JavaScript 机制 |
| `packages/dsh-adapter` | DSH 事件分类、持久化、本地 HTTP 路由和运行时注入 | 内容所有权与游戏规则 |
| `packages/renderer-react` | React 界面、浏览器连接和 Host 内容视图校验 | 服务端机制、别名、依赖元数据和官方核心图鉴导入 |
| `src/core-runtime.ts` | 引擎与官方核心内容的默认组合 | 新规则或内容定义 |

运行时数据流如下：

```text
内容包 -> 校验后的注册表 -> 引擎内容 -> 同步运行时
                    |                    |
                    +-> 客户端安全视图    +-> DSH 适配器 -> 版本化存档
                              |
                              +-> 本地 API -> React 渲染器
```

## 内容包契约

Content API v1 内容包由清单、属性、品质、生物、技能、有界机制指令、遭遇映射、初始选择、爬塔轮换、资源和可选别名组成。内容包只能提供数据，不能提供可执行 JavaScript。

开始游戏前，注册表会完成以下检查：

- 通过 JSON Schema 限制集合、文本和数值范围。
- 通过清单中的 SemVer 范围检查引擎兼容性。
- 检查内容包依赖版本、冲突、依赖环，并生成确定性的依赖顺序。
- 检查重复 ID，以及属性、生物、技能、机制、遭遇、初始选择、爬塔、别名和资源的悬空引用。
- 按引擎持有的机制契约检查触发点、操作码、参数名和参数类型。

依赖包始终排在被依赖方之前；依赖关系无法决定顺序时，再使用优先级和包 ID 保证结果稳定。重复内容 ID 会直接拒绝，不会静默覆盖。

内容集合在 Host 组合阶段确定。Content API v1 不会扫描任意文件夹，也不会执行内容包中的代码。

## 组合 API

默认运行时等价于：

```ts
import { CORE_CONTENT_PACK } from '@nath-vikky/dsh-codekin/content/core'
import { createCodekinComposition } from '@nath-vikky/dsh-codekin/engine'

const composition = createCodekinComposition([CORE_CONTENT_PACK])
```

`composition` 包含一个不可变注册表、客户端视图、引擎内容集合和已绑定运行时。以后新增仓库内内容包或单独审查过的内容包时，只需加入该数组，并可声明对 `@nath-vikky/codekin-core` 的版本依赖。

## Host 与渲染器边界

DSH 适配器显式接收运行时，并在本机 `/api/tracewild` 下提供状态、操作、事件、资源和客户端安全内容视图。资源请求只能命中校验后注册表声明的路径。

渲染器并行加载内容与状态，并把内容响应当作不可信 JSON 处理：限制所有集合规模、检查引用和资源路径、冻结通过校验的视图，再从中生成图鉴、技能、初始选择、爬塔轮换和图片 URL。机制、别名和内容包依赖细节不会发送到浏览器。

## 存档兼容

引擎内游戏状态继续使用 schema `3`，保持 `0.3.2` 行为契约不变；磁盘文件则使用存档格式 `1` 进行封装，并记录引擎版本和有序内容包身份。既有裸 `codekinsave/state.json` 和旧位置 `tracewild/state.json` 都会自动迁移。

当内容身份发生变化时，当前运行时会先执行有界状态恢复，再用当前身份重写存档封装。任何旧格式、内容不匹配、无法读取或未来格式的文件在被替换前，都会把原始字节保留一次到 `state.json.migration-backup`。未知或已移除的生物引用不会进入当前活动状态，也不会被执行或信任；原始记录仍可从备份恢复。未知的未来存档封装版本不会按当前格式解释。

## 验证

`pnpm check` 会执行所有工作区类型检查、单元与集成测试、`0.3.2` 行为指纹、基于属性的存档恢复测试和生产构建。`pnpm pack --dry-run` 还会检查最终安装包的文件清单。
