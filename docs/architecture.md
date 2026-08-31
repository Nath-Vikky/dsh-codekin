# Codekin architecture

[简体中文](architecture.zh-CN.md)

Codekin `0.3.5-alpha.2` is composed from a headless game engine and validated content packs. The default DSH plugin binds the official core pack, while the same composition API can combine additional packs before the host starts.

## Package map

| Component | Responsibility | Excludes |
| --- | --- | --- |
| `packages/content-sdk` | Content API v1 types, JSON Schema validation, dependency resolution, immutable registry, client-safe view | Game execution and host access |
| `packages/engine` | Deterministic state transitions, combat, rewards, save restoration, reviewed mechanic opcode executors | React, Node.js APIs, DSH, official creature IDs |
| `content-packs/core` | The 25 creatures, localized text, assets, encounters, starters, tower rotation, and declarative mechanics shipped in `0.3.5-alpha.2` | Host logic and arbitrary JavaScript mechanics |
| `packages/dsh-adapter` | DSH event classification, persistence, loopback HTTP routes, runtime injection | Content ownership and game rules |
| `packages/renderer-react` | React UI, browser connection, validation of the host-provided content view | Server mechanics, aliases, dependency metadata, official core catalog imports |
| `src/core-runtime.ts` | Default composition of the engine and official core content | New rules or content definitions |

The runtime data flow is:

```text
content packs -> validated registry -> engine content -> synchronous runtime
                         |                              |
                         +-> client-safe view           +-> DSH adapter -> versioned save
                                      |
                                      +-> loopback API -> React renderer
```

## Content pack contract

A Content API v1 pack declares a manifest plus ecologies, qualities, creatures, skills, bounded mechanic instructions, encounter mappings, starters, tower rotation, assets, and optional aliases. Packs are data; they cannot supply executable JavaScript.

Registry construction performs these checks before gameplay starts:

- JSON Schema validation with bounded collection and text sizes.
- Engine compatibility through the manifest's SemVer range.
- Required pack versions, conflicts, dependency cycles, and deterministic dependency order.
- Duplicate identifiers and dangling ecology, creature, skill, mechanic, encounter, starter, tower, alias, and asset references.
- Mechanic trigger, opcode, parameter name, and parameter type compatibility against the engine-owned contract.

Dependencies always load before dependants. Priority and pack ID provide deterministic ordering where dependency order does not decide it. Duplicate content identifiers are rejected instead of silently overriding earlier packs.

Content selection happens during host composition. Content API v1 does not scan arbitrary filesystem locations or execute code found in a pack.

## Composition API

The default runtime is equivalent to:

```ts
import { CORE_CONTENT_PACK } from '@nath-vikky/dsh-codekin/content/core'
import { createCodekinComposition } from '@nath-vikky/dsh-codekin/engine'

const composition = createCodekinComposition([CORE_CONTENT_PACK])
```

`composition` contains one immutable registry, client view, engine content set, and bound runtime. A future in-repository or separately reviewed pack can be added to the array and can declare a dependency on `@nath-vikky/codekin-core`.

## Host and renderer boundary

The DSH adapter receives a runtime explicitly. It exposes state, actions, events, assets, and the client-safe content view under `/api/tracewild` on the loopback host. Asset requests are restricted to paths declared by the validated content registry.

The renderer loads content and state together. It parses the content response as untrusted JSON, bounds every collection, validates references and asset paths, freezes the accepted view, and derives its catalog, skills, starters, tower rotation, and image URLs from that view. Mechanics, aliases, and pack dependency internals are not sent to the browser.

## Save compatibility

The in-engine game state remains schema version `3`, preserving the `0.3.2` behavior contract. On disk it is wrapped in save format version `1`, which records the engine version and ordered content-pack identities. Existing raw `codekinsave/state.json` files and the older `tracewild/state.json` location are migrated automatically.

When the recorded content identity changes, the current runtime performs its bounded state restoration first and then rewrites the envelope with the active identity. Before any legacy, mismatched, unreadable, or future-format file can be replaced, its exact bytes are retained once as `state.json.migration-backup`. Unknown or removed creature references are excluded from the active restored state rather than executed or trusted, while the backup preserves the original records for recovery. Unknown future envelope versions are not interpreted as the current format.

## Verification

`pnpm check` runs workspace type checks, unit and integration tests, `0.3.2` compatibility fingerprints, property-based save restoration tests, and production builds. `pnpm pack --dry-run` additionally verifies the installable artifact contents.
