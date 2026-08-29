# Codekin

[简体中文](README.zh-CN.md) · [Stable npm package](https://www.npmjs.com/package/@nath-vikky/dsh-codekin) · [GitHub Releases](https://github.com/Nath-Vikky/dsh-codekin/releases)

Codekin is a creature-collection and match-three battle plugin for DeepSeek Harness Web. It turns
high-level DSH runtime outcomes into local game events without changing prompts, tools, model
requests, or agent behavior.

![The first 25 Codekin](assets/creatures/sprite-gallery-v1.png)

## Install and enable

### DSH `0.1.2-alpha.1` preview

Codekin `0.3.0-alpha.1` targets the source-only DSH `0.1.2-alpha.1` preview. It is distributed only
through GitHub and is intentionally blocked from npm publishing. The current `main` branch commits
its reviewed runtime bundles, so the dsh-web Workshop-compatible repository install needs no Alpha
SDK checkout:

```sh
dsh plugin --profile web add https://github.com/Nath-Vikky/dsh-codekin
```

For a reproducible version-pinned install, use the release asset instead:

```sh
dsh plugin --profile web add --ignore-scripts https://github.com/Nath-Vikky/dsh-codekin/releases/download/v0.3.0-alpha.1/nath-vikky-dsh-codekin-0.3.0-alpha.1.tgz
```

Restart DSH Web after installation, then open **DSH Settings → Codekin** and enable the plugin.
The launcher is draggable and toggles the compact portrait game window. When idle supplies are
ready, the launcher changes into a gently animated gift reminder.

This preview adopts the Alpha client-module split and the official browser-authentication cookie.
Every Codekin state, action, event-stream, and image route rejects unauthenticated requests before
touching game state.

The previous npm-compatible source line is preserved on the `stable/0.2.x` branch.

### Current stable DSH release

For DSH Web `0.1.0-rc.5`, keep using the stable Codekin `0.2.0` package:

```sh
dsh plugin --profile web add @nath-vikky/dsh-codekin@latest
```

Do not install the Alpha `.tgz` on rc.5. The two release lines are kept separate so the compatibility
preview cannot replace the current stable npm package.

## Core loop

Use DSH normally. Completed activity can award one capture core and create at most one encounter.
Open Codekin to collect idle supplies, inspect the regional map, choose a wild target, arrange a
three-member squad, and enter a 7×7 command match battle. Winning yields growth material; weakening
a target opens a capture decision whose odds combine remaining runtime with capture-core quality.
Progress, encounters, inventory, squads, and tower state remain local to the plugin.

## What it includes

- Five clear computing attributes—Compute, Compile, Network, Guard, and Glitch—and 25 initial Codekin.
- Five capture-core qualities earned through ordinary DSH use.
- Event-driven encounters, including uncommon creatures associated with failed or recovered runs.
- Up to seven wild map residents, with long-lived common finds and shorter windows for high-level rare encounters.
- Mixed DSH activity replenishes the least represented matching region; after one region grows beyond five residents, repeated single-attribute activity is diverted to a scarcer region.
- Ordinary wild levels stay between the lowest and highest levels in the complete roster; Nova and Origin appear as over-level special challenges.
- A 2D region map, 7×7 match-three battles, capture, a three-Codekin squad, and a creature index.
- An Endless Stack Tower with increasingly strong Boss levels, qualities, mechanics, and per-floor growth rewards.
- Five attribute tiles arranged in a closed advantage loop, with strong and resisted damage.
- Level 1–100 progression, five qualities of growth material, idle supplies, and local persistence.
- A compact growth target selector keeps training usable even with a large roster.
- A persisted enable switch under DSH Settings → Codekin; disabling pauses event rewards and idle time without deleting progress.
- A two-step release flow in Squad that returns one same-quality growth material regardless of the Codekin's level.
- Three base actions per active Codekin; direct match-four refunds an action and match-five adds one.
- A wild-battle turn may be ended early to preserve a low-runtime capture target.
- The three Codekin share one squad runtime pool. Stage damage is queued and resolved through a prominent team-strike total at the end of the cycle.
- Wild Codekin use separate Boss scaling and can telegraph hazard panels, protocol seals, tile locks,
  freezes, board reroutes, and phase shields according to their level and quality.
- Matching a Codekin's attribute builds command points, and every Codekin has one passive plus one active ability.
- Match-four, match-five, and intersecting clears create row, column, burst, and origin tiles.
- Reward popups, item details, visible material experience values, and explicit confirmations for irreversible roster actions.
- Host-validated game actions and atomic local persistence.

## Battle and encounter rules

Swap adjacent tiles to queue compute damage and charge matching squad members. Each squad member
normally contributes three actions; a direct match-four refunds an action and a match-five grants an
extra action. The three squad stages are displayed separately, then resolve as one team strike. Wild
Bosses have their own multi-action cycle, strike one shared squad runtime pool, and use hazard panels,
protocol seals, locks, freezes, shields, board reroutes, and quality-dependent mechanics. A player may end the current stage early to avoid
defeating a weakened capture target. Encounter duration, level, and quality respond to effective DSH
activity while map population and regional balancing prevent one activity type from occupying every
spawn slot.

## Data behavior

Game progress is stored locally by the plugin. Codekin records bounded game events and aggregate
runtime outcomes; it does not store prompt text, assistant responses, tool arguments, commands,
workspace paths, or raw error bodies. It does not submit prompts, invoke tools, alter model requests,
or modify conversations.

## Compatibility and status

- `0.2.0`: stable npm `latest`, for DeepSeek Harness Web `0.1.0-rc.5`.
- `0.3.0-alpha.1`: GitHub-only prerelease, for the source tag `dsh-v0.1.2-alpha.1`.

The Alpha build has been validated in an isolated official source profile for package installation,
client composition, authenticated state/action/assets, client-bundle HMR, and live Cordis
disable/re-enable cleanup. It is still a compatibility preview because upstream Alpha APIs may
change again before the next stable DSH release.

## License

MIT
