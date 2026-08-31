# Codekin

[简体中文](README.zh-CN.md) · [npm package](https://www.npmjs.com/package/@nath-vikky/dsh-codekin) · [GitHub Releases](https://github.com/Nath-Vikky/dsh-codekin/releases)

[Engine and content-pack architecture](docs/architecture.md)

Codekin is a creature-collection and match-three battle plugin for DeepSeek Harness Web. It turns
high-level DSH runtime outcomes into local game events without changing prompts, tools, model
requests, or agent behavior.

![The first 25 Codekin](assets/creatures/sprite-gallery-v1.png)

## Install and enable

### DSH `0.1.2-alpha.2` preview

Codekin `0.3.5-alpha.2` uses the npm-published DSH `0.1.2-alpha.2` as its current development and validation
baseline. This release is distributed through npm `latest` and GitHub Releases. The current `main`
branch commits its reviewed runtime bundles. Install and launch Alpha DSH with explicit versions:

```sh
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.2 plugin --profile web add @nath-vikky/dsh-codekin@latest
```

For a reproducible npm install, pin the Codekin version too:

```sh
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.2 plugin --profile web add @nath-vikky/dsh-codekin@0.3.5-alpha.2
```

The GitHub Release asset remains available as an equivalent version-pinned installation source:

```sh
pnpm dlx @deepseek-ai/dsh@0.1.2-alpha.2 plugin --profile web add --ignore-scripts https://github.com/Nath-Vikky/dsh-codekin/releases/download/v0.3.5-alpha.2/nath-vikky-dsh-codekin-0.3.5-alpha.2.tgz
```

Restart DSH Web after installation, then open **DSH Settings → Codekin** and enable the plugin.
The launcher is draggable and toggles the compact portrait game window. When idle supplies are
ready, the launcher changes into a gently animated gift reminder.

Codekin saves progress at `$DSH_HOME/codekinsave/state.json`. Existing installs automatically move
the former `tracewild/state.json` save on first launch. Uninstalling from the dsh-web plugin manager
is a confirmed one-click operation and preserves progress by default. For a complete removal, first
use **DSH Settings → Codekin → Delete local save**, then uninstall the plugin.

This preview adopts the Alpha client-module split and the official browser-authentication cookie.
Every Codekin state, action, event-stream, and image route rejects unauthenticated requests before
touching game state.

The previous npm-compatible source line is preserved on the `stable/0.2.x` branch.

### Current stable DSH release

For DSH Web `0.1.0-rc.5`, keep using the stable Codekin `0.2.0` package:

```sh
dsh plugin --profile web add @nath-vikky/dsh-codekin@0.2.0
```

Do not install the Alpha package on rc.5. The stable Codekin `0.2.0` remains available by explicit
version even though npm `latest` now follows the DSH Alpha release line.

## Core loop

Use DSH normally. Completed activity can award one capture core and create at most one encounter.
Open Codekin to collect idle supplies, inspect the regional map, choose a wild target, arrange a
three-member squad, and enter an 8×8 command match battle. Winning yields growth material; weakening
a target opens a capture decision whose odds combine remaining runtime with capture-core quality.
Progress, encounters, inventory, squads, and tower state remain local to the plugin.

## What it includes

- Five clear computing attributes—Compute, Compile, Network, Guard, and Glitch—and 25 initial Codekin.
- Five capture-core qualities earned through ordinary DSH use.
- Event-driven encounters, including uncommon creatures associated with failed or recovered runs.
- Up to seven wild map residents, with long-lived common finds and shorter windows for high-level rare encounters.
- Mixed DSH activity replenishes the least represented matching region; after one region grows beyond five residents, repeated single-attribute activity is diverted to a scarcer region.
- Ordinary wild levels stay between the lowest and highest levels in the complete roster; Nova and Origin appear as over-level special challenges.
- A 2D region map, 8×8 match-three battles, capture, a three-Codekin squad, and a creature index.
- An Endless Stack Tower with increasingly strong Boss levels, qualities, mechanics, and per-floor growth rewards.
- Five attribute tiles arranged in a closed advantage loop. On a matching Codekin's turn they become
  distinct signal roles: runtime repair, shared guard, Compute sync, Compile overclock, or Glitch breach;
  on every other turn they remain ordinary damage panels.
- Level 1–100 progression, five qualities of growth material, idle supplies, and local persistence.
- The owned-Codekin roster keeps formation editing separate from browsing: three unique slots can be adjusted and saved explicitly, while each roster card stays focused on portrait and identity.
- Selecting a Codekin opens a dismissible detail panel for combat values, skills, and material-based upgrading, keeping growth tools usable as the collection expands.
- A persisted enable switch under DSH Settings → Codekin; disabling pauses event rewards and idle time without deleting progress.
- A two-step release flow in Squad that returns one same-quality growth material regardless of the Codekin's level.
- Three base actions per active Codekin; direct match-four refunds an action and match-five adds one.
- Any battle lets the player end the active Codekin's remaining actions. In wild encounters this can
  preserve a low-runtime capture target instead of defeating it accidentally.
- The three Codekin share one squad runtime pool. Stage damage is queued and resolved through a prominent team-strike total at the end of the cycle.
- Repair and guard are likewise queued across the whole squad or Boss phase, then settle together. Compute sync, Compile overclock, and Glitch breach persist as scoped two-round modifiers with compact hover details.
- Wild Codekin use separate Boss scaling and can telegraph hazard panels, protocol seals, tile locks,
  freezes, board reroutes, and phase shields according to their level and quality.
- Matching a Codekin's attribute builds command points, and every Codekin has one passive plus one active ability.
- Match-four, match-five, and intersecting clears create row, column, burst, and origin tiles.
- Reward popups, item details, visible material experience values, and explicit confirmations for irreversible roster actions.
- Host-validated game actions and atomic local persistence.

## 0.3.5-alpha.2 engine and content-pack preview

- The runtime is now composed from a deterministic headless engine, a validated Content API v1 registry,
  the official core content pack, a DSH adapter, and an independent React renderer.
- Content manifests declare SemVer engine compatibility, dependencies, conflicts, aliases, assets, and
  bounded mechanic instructions; invalid or ambiguous packs are rejected before gameplay starts.
- Versioned save envelopes record both engine and ordered content-pack identities while retaining automatic
  migration and one-time backups for legacy or mismatched saves.
- The official npm-published DSH `0.1.2-alpha.2` packages are pinned across development and the six-job
  Windows, macOS, and Ubuntu CI matrix for Node.js 22 and 24.
- Squad management is now an explicit three-slot edit-and-save flow. The owned roster shows compact identity
  cards, while combat values, skills, and upgrading live in a closeable Codekin detail panel.

## 0.3.2 battle update

- The command board is now 8×8, keeps panels anchored during pointer gestures, and silently restores
  invalid swaps without replacing the battle state with a technical error.
- The active squad member has a visible focus glow, while one compact `SKIP` control works consistently
  in wild encounters and the Endless Stack Tower.
- Every player clear briefly contributes an effectiveness-colored damage value before the HUD settles
  on the final `TOTAL DAMAGE`. Boss actions use the same readable `ENEMY DAMAGE` presentation and a
  slightly slower cadence.
- Player and Boss strikes travel as a visible attack wave before HP changes or defeat resolves. Enemy
  phases also lock the board behind a red warning strip until all Boss actions finish.
- Recovery, shielding, damage forecasts, and HP changes animate in the vital bar. Persistent attack,
  defense, and scoped attribute effects use compact icons with custom hover details and remaining rounds.
- Enemy intent and Boss-skill chips stay compact beside the Boss vitals, with in-game hover panels rather
  than overlapping browser-native tooltips.

## Battle and encounter rules

Swap adjacent tiles to queue compute damage and charge matching squad members. Matching Guard and
Network panels queue phase-wide recovery and shielding, while Compute, Compile, and Glitch panels
also establish persistent team, single-member, or opponent modifiers. Each squad member
normally contributes three actions; a direct match-four refunds an action and a match-five grants an
extra action. The three squad stages are displayed separately, then resolve as one team strike. Wild
Bosses have their own multi-action cycle, strike one shared squad runtime pool, and use hazard panels,
protocol seals, locks, freezes, shields, board reroutes, and quality-dependent mechanics. A player may
end the current stage early in any battle; in a wild encounter this can avoid defeating a weakened
capture target. Encounter duration, level, and quality respond to effective DSH
activity while map population and regional balancing prevent one activity type from occupying every
spawn slot.

## Data behavior

Game progress is stored locally at `$DSH_HOME/codekinsave/state.json`. Codekin records bounded game
events and aggregate runtime outcomes; it does not store prompt text, assistant responses, tool arguments, commands,
workspace paths, or raw error bodies. It does not submit prompts, invoke tools, alter model requests,
or modify conversations. The on-disk save envelope records its format, engine version, and ordered content-pack
identity while retaining automatic migration from the previous raw state format.

## Compatibility and status

- `0.2.0`: stable pinned version for DeepSeek Harness Web `0.1.0-rc.5`.
- `0.3.5-alpha.2`: current npm and GitHub Latest engine/content-pack Alpha release, validated against `@deepseek-ai/dsh@0.1.2-alpha.2`.
- `0.3.5-alpha.1`: previous GitHub engine/content-pack Alpha release.
- `0.3.2`: previous GitHub-only battle-system prerelease on the same DSH Alpha baseline.

The Alpha build has been validated in an isolated official npm profile for package installation,
client composition, authenticated state/action/assets, client-bundle HMR, and live Cordis
disable/re-enable cleanup. It is still a compatibility preview because upstream Alpha APIs may
change again before the next stable DSH release.

## License

MIT
