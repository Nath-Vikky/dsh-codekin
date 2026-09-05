# Codekin development tools

The repository includes deterministic tools for validating content and reproducing engine behavior. They run on the same Content API, mechanics contracts, and authoritative reducer used by the plugin.

## Renderer interaction checks

`pnpm check` includes display spring stability at 30/60/144 fps, bounded release momentum, keyboard board boundaries, local preference recovery, and normalized roster search. Renderer physics never update engine state or consume its random source.

`pnpm lifecycle:dsh` also checks the installed UI in Chrome/Edge: dialog focus and Escape, roster search/reset, squad editing, arrow-key navigation, system reduced motion, and launcher focus restoration. For a visual review, check map, tower, roster, details and battle at both desktop and 390×844, then exercise a valid/invalid swap, window/launcher dragging, unsaved squad navigation, and capture rewards using an isolated DSH profile.

## Content-pack lint

```sh
pnpm content:lint
```

The default command validates the bundled core pack. It checks the JSON schema, SemVer and dependency graph, cross-pack references, reviewed mechanics opcodes and parameters, asset paths, file signatures, and asset-size limits. To validate one or more modules explicitly:

```sh
node tools/content-pack-lint.ts \
  --asset-root "@nath-vikky/codekin-core=assets/creatures" \
  "content-packs/core/src/index.ts#CORE_CONTENT_PACK"
```

Use `--json` or `--output <report.json>` for a machine-readable `codekin-pack-lint-v1` report. Every pack containing assets needs a matching `--asset-root <pack-id>=<directory>` entry.

## Replay

```sh
pnpm replay -- tests/fixtures/replays/core-smoke-v1.json
```

A `codekin-replay-v1` transcript records the deterministic random algorithm and seed, optional engine/content identities, an optional initial state, and ordered signal/action steps. Optional final revision and SHA-256 expectations make a transcript suitable for regression gates. Use `--json` for step digests or `--state-out <state.json>` to export the final authoritative state.

## Simulation

```sh
pnpm simulate
pnpm simulate -- --check --output simulation-report.json
```

The default `codekin-simulation-v1` report runs seven combat scenarios over 24 fixed seeds. `--check` applies the repository's pacing and danger thresholds; `--seeds` and `--seed` select larger deterministic runs. The command never uses user-controlled randomness or live DSH state.

## Performance and size budgets

```sh
pnpm build
pnpm performance -- --check --output performance-report.json
```

The `codekin-performance-v1` report measures a typical authoritative battle action, a 750-Codekin restore, content-registry construction, the fixed simulation matrix, browser and total JavaScript bundles, core assets, and large-roster JSON size. Cross-platform release ceilings live in `performance-budget.json`; timing gates use p95 samples and intentionally leave headroom for shared CI hosts.

The core image budget is 3 MB for the launcher, 25 original sprites, and 25 transparent 768px evolution portraits. Evolution uses WebP with preserved alpha; review galleries, source masters, and processing prompts remain outside the repository and package. Appearance changes do not add gameplay random draws or alter combat values.

## Installed DSH lifecycle

```sh
pnpm lifecycle:dsh
```

This release gate creates an isolated DSH Web Alpha profile, installs a local package tarball, starts the host, exercises the state and action routes, runs a headless Chrome/Edge roster and keyboard-accessibility smoke test, disables Codekin, restarts DSH, removes and reinstalls the plugin, and verifies that the same save and starter survive every transition. Pass `--source <package-spec>` to test a Git commit or registry package through the same path. Failed runs retain their temporary profile for diagnosis; successful runs remove it unless `--keep` is supplied. `--skip-browser` is available for host-only diagnosis but is not used by the release gate.

The browser smoke also checks that reduced motion follows the system until the player explicitly enables full motion, and that this override is persisted. Battle timing lives in `packages/renderer-react/src/battle-motion.ts`; reduced motion removes travel without removing turn and protocol reading time.
