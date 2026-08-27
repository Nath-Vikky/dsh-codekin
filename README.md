# TraceWild

[简体中文](README.zh-CN.md)

TraceWild is a pixel-creature collection and battle plugin for DeepSeek Harness Web. It turns
high-level DSH runtime outcomes into local game events without changing prompts, tools, model
requests, or agent behavior.

![The first 25 TraceWild creatures](assets/creatures/sprite-gallery-v1.png)

## What it includes

- Five creature habitats and 25 initial creatures.
- Five capture-core qualities earned through ordinary DSH use.
- Event-driven encounters, including uncommon creatures associated with failed or recovered runs.
- A 2D region map, turn-based battles, capture, a three-creature squad, and a creature index.
- Host-validated game actions and atomic local persistence.

## How it works

Use DSH normally. Completed activity can award a capture core and create an encounter. Open the
TraceWild launcher to explore the map, battle a creature, attempt a capture, organize a squad, or
review collected species. TraceWild does not submit prompts, invoke tools, or alter conversations.

## Data behavior

Game progress is stored locally by the plugin. TraceWild records bounded game events and aggregate
runtime outcomes; it does not store prompt text, assistant responses, tool arguments, commands,
workspace paths, or raw error bodies.

## Compatibility and status

This repository currently contains the `0.1.0-alpha.1` playtest build for DeepSeek Harness Web
`0.1.0-rc.5`. The package remains private while gameplay and balance are being evaluated.

## License

MIT
