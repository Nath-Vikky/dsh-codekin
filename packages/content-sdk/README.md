# Codekin Content SDK

`@nath-vikky/codekin-content-sdk` defines, validates, and combines versioned Codekin content packs. Content packs contain bounded data, references, and reviewed mechanic opcodes; they do not receive filesystem, network, DeepSeek Harness, or arbitrary code-execution capabilities.

The workspace package is private while content API version 1 is being stabilized. The installable plugin exposes the reviewed build through `@nath-vikky/dsh-codekin/content`.

The schema is compiled with Ajv, while manifest engine and dependency ranges use SemVer. Registry output is cloned and deeply frozen before it is exposed to the engine or client-view builder.

Repository content can be checked with `pnpm content:lint`. The command combines schema and registry validation with the engine's reviewed mechanics contracts and on-disk asset verification. See [`tools/README.md`](../../tools/README.md) for module and machine-readable report options.
