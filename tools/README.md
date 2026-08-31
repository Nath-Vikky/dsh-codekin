# Codekin development tools

The repository includes deterministic tools for validating content and reproducing engine behavior. They run on the same Content API, mechanics contracts, and authoritative reducer used by the plugin.

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
