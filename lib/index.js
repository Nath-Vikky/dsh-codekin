import { i as TRACE_ECOLOGIES, n as CAPTURE_CORE_QUALITIES } from "./src-ByrL1b1w.js";
import { CORE_CAPTURE_MULTIPLIERS, CORE_CREATURE_MECHANICS, CORE_DROP_WEIGHTS, CREATURE_CATALOG, CREATURE_SKILLS, SIGNAL_VARIANT_CREATURE_IDS, STARTER_CREATURE_IDS, creatureById, creatureIdForSignalVariant, creaturesInEcology, mechanicsByCreatureId, skillByCreatureId } from "./content-core.js";
import { $ as MAX_PLAYER_LEVEL, A as createMatchBoard, At as CODEKIN_MECHANIC_CONTRACTS, B as BOSS_SKILL_ENERGY_COST, C as towerSkillTierForFloor, Ct as xpToNextLevel, D as areAdjacentTiles, Dt as createEngineContent, E as MAX_MATCH_CASCADES, Et as QUALITY_SKILL_MULTIPLIERS, F as resolveBattleSwap, G as MATERIAL_XP, H as CAPTURE_HEALTH_RATIO, I as resolveExistingBattleMatches, J as MAX_BOSS_ACTIONS, K as MAX_ACTIONS_PER_CREATURE, L as resolveForcedTiles, M as findFirstLegalBattleSwap, Mt as MechanicsContractError, N as hasBattleMatches, Nt as assertMechanicsContract, O as chooseBossBattleSwap, Ot as currentEngineContent, P as reshuffleBattleBoard, Pt as mechanicsContractIssues, Q as MAX_MAP_ENCOUNTERS, R as BASE_ACTIONS_PER_CREATURE, S as towerQualityForFloor, St as wildStats, T as MATCH_BOARD_SIZE, Tt as EngineContentError, U as CORE_CAPTURE_POWER, V as BOSS_SKILL_ENERGY_LIMIT, W as MATERIAL_DROP_WEIGHTS, X as MAX_BOSS_SWAPS_PER_PHASE, Y as MAX_BOSS_BONUS_ACTIONS, Z as MAX_CAPTURE_ATTEMPTS, _ as ECOLOGY_ADVANTAGE, _t as threatPoints, a as CORE_ENGINE_CONTENT, at as XP_QUALITY_MULTIPLIERS, b as emptyTowerMaterialReward, bt as wildLevelForRoster, c as captureChanceForBattle, ct as coreQualityWeights, d as restoreTraceWildState, dt as idleRewardTier, et as PLAYER_QUALITY_BASE_MULTIPLIERS, f as settleTraceWildIdleRewards, ft as levelForXp, g as createCodekinRuntime, gt as sessionLevel, h as createCodekinComposition, ht as qualityIndex, i as CORE_CONTENT_VIEW, it as WILD_QUALITY_RESISTANCE, j as findBestBattleSwap, jt as CODEKIN_MECHANIC_OPCODES, k as convertRandomBattleTiles, kt as withEngineContent, l as createInitialTraceWildState, lt as effectivePartyLevel, m as normalizeTraceWildAction, mt as playerStats, n as CORE_CODEKIN_RUNTIME, nt as PLAYER_QUALITY_MULTIPLIERS, o as applyTraceSignal, ot as activeMinuteBand, p as towerFloorProfile, pt as playerLevelFactor, q as MAX_BONUS_ACTIONS_PER_STAGE, r as CORE_CONTENT_REGISTRY, rt as QUALITY_ORDER, s as applyTraceWildAction, st as captureChance, t as CORE_CODEKIN_COMPOSITION, tt as PLAYER_QUALITY_GROWTH_BONUSES, u as expireTraceWildEncounters, ut as encounterLifetimeMs, v as TraceWildRuleError, vt as totalXpForLevel, w as MATCH_BOARD_CELLS, wt as CODEKIN_ENGINE_VERSION, x as towerBossStats, xt as wildQualityWeights, y as MAX_TOWER_FLOOR, yt as wildLevelFor, z as BASE_BOSS_ACTIONS } from "./core-runtime-DkvOIUpM.js";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { createHash, randomInt } from "node:crypto";
import { constants, copyFileSync, mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
//#region lib/types/packages/dsh-adapter/src/routes.js
const TRACEWILD_API_PREFIX = "/api/tracewild";
const MAX_ACTION_BODY_BYTES = 4096;
const HEARTBEAT_MS = 15e3;
var TraceWildRoutesClosedError = class extends Error {};
var TraceWildRouteLifecycle = class {
	controller = new AbortController();
	streams = /* @__PURE__ */ new Map();
	get signal() {
		return this.controller.signal;
	}
	trackStream(res, cleanup) {
		if (this.signal.aborted) {
			cleanup();
			if (!res.writableEnded && !res.destroyed) res.end();
			return;
		}
		this.streams.set(res, cleanup);
	}
	releaseStream(res) {
		this.streams.delete(res);
	}
	close() {
		if (this.signal.aborted) return;
		this.controller.abort();
		for (const [res, cleanup] of [...this.streams]) {
			cleanup();
			if (!res.writableEnded && !res.destroyed) res.end();
		}
		this.streams.clear();
	}
};
function securityHeaders() {
	return {
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
		"referrer-policy": "no-referrer",
		"cross-origin-resource-policy": "same-origin"
	};
}
function contentRoute(content, lifecycle) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/content`,
		handler(req, res) {
			if (rejectUntrusted(req, res)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			sendJson(res, 200, content);
		}
	};
}
function sendJson(res, status, value) {
	res.writeHead(status, {
		...securityHeaders(),
		"content-type": "application/json; charset=utf-8"
	});
	res.end(JSON.stringify(value));
}
function failure(res, status, error) {
	sendJson(res, status, {
		ok: false,
		error
	});
}
function requestHeader(req, name) {
	const value = req.headers[name];
	return typeof value === "string" ? value : void 0;
}
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function loopbackAuthority(req) {
	const host = requestHeader(req, "host");
	if (host === void 0 || host.length === 0 || host.length > 255 || /[\s\\/@?#]/u.test(host)) return void 0;
	try {
		const parsed = new URL(`http://${host}`);
		return isLoopbackHostname(parsed.hostname) ? parsed : void 0;
	} catch {
		return;
	}
}
/**
* Local Web trust fence kept inside Codekin so it does not depend on private
* or version-specific Connection internals. This is a DNS-rebinding and
* browser-origin fence, not user authentication.
*/
function rejectUntrusted(req, res) {
	const authority = loopbackAuthority(req);
	const site = requestHeader(req, "sec-fetch-site");
	const origin = requestHeader(req, "origin");
	let trusted = authority !== void 0 && site !== "cross-site" && (req.headers["sec-fetch-site"] === void 0 || site !== void 0) && (req.headers.origin === void 0 || origin !== void 0);
	if (authority !== void 0 && trusted && origin !== void 0) try {
		const parsed = new URL(origin);
		trusted = (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.host === authority.host;
	} catch {
		trusted = false;
	}
	if (trusted) return false;
	res.writeHead(403, securityHeaders());
	res.end("forbidden");
	return true;
}
function sameOrigin(req) {
	const host = req.headers.host;
	if (typeof host !== "string" || host.length === 0 || host.length > 255) return false;
	const site = req.headers["sec-fetch-site"];
	if (site !== void 0 && site !== "same-origin" && site !== "none") return false;
	const origin = req.headers.origin;
	if (origin === void 0) return site === "same-origin" || site === "none";
	if (typeof origin !== "string" || origin.length > 512) return false;
	try {
		const parsed = new URL(origin);
		return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.host === host;
	} catch {
		return false;
	}
}
function readBody(req, signal) {
	return new Promise((resolve, reject) => {
		let size = 0;
		let settled = false;
		const chunks = [];
		const cleanup = () => {
			req.off("data", onData);
			req.off("end", onEnd);
			req.off("error", onError);
			signal.removeEventListener("abort", onAbort);
		};
		const finish = (callback) => {
			if (settled) return;
			settled = true;
			cleanup();
			callback();
		};
		const onData = (chunk) => {
			if (settled) return;
			size += chunk.byteLength;
			if (size > MAX_ACTION_BODY_BYTES) {
				finish(() => {
					reject(/* @__PURE__ */ new TypeError("body too large"));
				});
				queueMicrotask(() => req.destroy());
				return;
			}
			chunks.push(chunk);
		};
		const onEnd = () => {
			finish(() => {
				try {
					resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
				} catch {
					reject(/* @__PURE__ */ new TypeError("invalid json"));
				}
			});
		};
		const onError = () => {
			finish(() => {
				reject(/* @__PURE__ */ new TypeError("request error"));
			});
		};
		const onAbort = () => {
			finish(() => {
				reject(new TraceWildRoutesClosedError());
			});
		};
		if (signal.aborted) {
			onAbort();
			return;
		}
		req.on("data", onData);
		req.on("end", onEnd);
		req.on("error", onError);
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
function stateRoute(service, lifecycle) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/state`,
		handler(req, res) {
			if (rejectUntrusted(req, res)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			sendJson(res, 200, service.snapshot());
		}
	};
}
function actionRoute(service, lifecycle) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/action`,
		async handler(req, res) {
			if (rejectUntrusted(req, res)) return;
			if (req.method !== "POST") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (!sameOrigin(req) || !/^application\/json(?:\s*;|$)/i.test(String(req.headers["content-type"] ?? ""))) {
				failure(res, 403, "invalid-action");
				return;
			}
			try {
				const action = normalizeTraceWildAction(await readBody(req, lifecycle.signal));
				if (lifecycle.signal.aborted) throw new TraceWildRoutesClosedError();
				sendJson(res, 200, service.act(action));
			} catch (error) {
				if (error instanceof TraceWildRoutesClosedError || lifecycle.signal.aborted) {
					failure(res, 503, "unavailable");
					return;
				}
				if (error instanceof TraceWildRuleError) {
					failure(res, error.code === "conflict" ? 409 : 400, error.code);
					return;
				}
				if (error instanceof TypeError) {
					failure(res, 400, "invalid-action");
					return;
				}
				failure(res, 500, "unavailable");
			}
		}
	};
}
function saveRoute(service, lifecycle) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/save`,
		async handler(req, res) {
			if (rejectUntrusted(req, res)) return;
			if (req.method !== "DELETE") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (!sameOrigin(req) || !/^application\/json(?:\s*;|$)/i.test(String(req.headers["content-type"] ?? ""))) {
				failure(res, 403, "invalid-action");
				return;
			}
			try {
				const value = await readBody(req, lifecycle.signal);
				if (lifecycle.signal.aborted) throw new TraceWildRoutesClosedError();
				if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError("invalid cleanup request");
				const row = value;
				const keys = Object.keys(row);
				if (keys.length !== 1 || keys[0] !== "confirmation" || row.confirmation !== "delete-codekin-save") throw new TypeError("invalid cleanup request");
				sendJson(res, 200, service.clearLocalData());
			} catch (error) {
				if (error instanceof TraceWildRoutesClosedError || lifecycle.signal.aborted) {
					failure(res, 503, "unavailable");
					return;
				}
				if (error instanceof TypeError) {
					failure(res, 400, "invalid-action");
					return;
				}
				failure(res, 500, "unavailable");
			}
		}
	};
}
function eventsRoute(service, lifecycle) {
	return {
		kind: "exact",
		path: `${TRACEWILD_API_PREFIX}/events`,
		handler(req, res) {
			if (rejectUntrusted(req, res)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			res.writeHead(200, {
				...securityHeaders(),
				"cache-control": "no-cache, no-transform",
				"content-type": "text/event-stream; charset=utf-8",
				"connection": "keep-alive",
				"x-accel-buffering": "no"
			});
			res.flushHeaders?.();
			let closed = false;
			let unsubscribe;
			const heartbeat = setInterval(() => {
				if (!closed) res.write(": tracewild\n\n");
			}, HEARTBEAT_MS);
			heartbeat.unref?.();
			const close = () => {
				if (closed) return;
				closed = true;
				clearInterval(heartbeat);
				req.off("close", close);
				res.off("close", close);
				lifecycle.releaseStream(res);
				unsubscribe?.();
			};
			req.once("close", close);
			res.once("close", close);
			lifecycle.trackStream(res, close);
			unsubscribe = service.subscribe((snapshot) => {
				if (closed) return;
				try {
					res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
				} catch {
					close();
				}
			});
			if (closed) unsubscribe();
		}
	};
}
function assetRoute(assetDirectory, assetFiles, lifecycle) {
	return {
		kind: "prefix",
		path: `${TRACEWILD_API_PREFIX}/assets`,
		async handler(req, res) {
			if (rejectUntrusted(req, res)) return;
			if (req.method !== "GET") {
				res.writeHead(405, securityHeaders());
				res.end();
				return;
			}
			if (lifecycle.signal.aborted) {
				failure(res, 503, "unavailable");
				return;
			}
			const filename = new URL(req.url ?? "/", "http://tracewild.invalid").pathname.slice(`${TRACEWILD_API_PREFIX}/assets/`.length);
			const mime = assetFiles.get(filename);
			if (mime === void 0) {
				res.writeHead(404, securityHeaders());
				res.end();
				return;
			}
			try {
				const body = await readFile(join(assetDirectory, filename));
				if (lifecycle.signal.aborted) {
					failure(res, 503, "unavailable");
					return;
				}
				res.writeHead(200, {
					...securityHeaders(),
					"cache-control": "public, max-age=86400, immutable",
					"content-type": mime,
					"content-length": String(body.byteLength)
				});
				res.end(body);
			} catch {
				res.writeHead(404, securityHeaders());
				res.end();
			}
		}
	};
}
function createTraceWildRoutes(service, assetDirectory, content) {
	const lifecycle = new TraceWildRouteLifecycle();
	const assetFiles = new Map(content.assets.map((asset) => [asset.path, asset.mime]));
	return {
		routes: [
			stateRoute(service, lifecycle),
			contentRoute(content, lifecycle),
			actionRoute(service, lifecycle),
			saveRoute(service, lifecycle),
			eventsRoute(service, lifecycle),
			assetRoute(assetDirectory, assetFiles, lifecycle)
		],
		close: () => {
			lifecycle.close();
		}
	};
}
//#endregion
//#region lib/types/packages/dsh-adapter/src/classifier.js
function fresh(turn) {
	return {
		turn,
		lumen: 0,
		forge: 0,
		relay: 0,
		aegis: 0,
		failedTools: 0,
		toolCount: 0,
		callEcology: /* @__PURE__ */ new Map()
	};
}
function classifyTool(name) {
	const value = name.toLowerCase();
	if (/(subagent|agent|delegate|send.message|followup|fork|handoff|interrupt)/.test(value)) return "relay";
	if (/(read|search|grep|glob|find|list|web|browser|resource|inspect|query)/.test(value)) return "lumen";
	if (/(exec|command|bash|pwsh|terminal|write|edit|patch|build|test|run|apply|create|delete|move|copy)/.test(value)) return "forge";
	return "aegis";
}
function signalId(session, event) {
	return createHash("sha256").update(`${String(session.id)}\0${String(event.data.turn)}\0${String(event.seq)}`).digest("hex").slice(0, 24);
}
function failureVariant(reason) {
	if (reason.kind === "max-tokens") return "overflow";
	if (reason.kind === "interrupted") return "crash";
	if (reason.kind === "blocked") return "stack";
	if (reason.kind !== "error") return void 0;
	const code = reason.error.code.toUpperCase();
	if (/(ENOENT|NOT.?FOUND|MISSING)/.test(code)) return "missing";
	if (/(TIMEOUT|TIMEDOUT|DEADLINE)/.test(code)) return "timeout";
	if (/(STACK|RECURS|LOOP)/.test(code)) return "stack";
	if (/(ENOSPC|OOM|MEMORY|OVERFLOW|LIMIT)/.test(code)) return "overflow";
	return "crash";
}
var TraceWildEventClassifier = class {
	traces = /* @__PURE__ */ new WeakMap();
	activity = /* @__PURE__ */ new WeakMap();
	observe(session, event) {
		const activeMinutes = this.observeActivity(session, event.time);
		switch (event.type) {
			case "turn/start":
				this.traces.set(session, fresh(event.data.turn));
				return;
			case "tool/call": {
				const trace = this.trace(session, event.data.turn);
				const ecology = classifyTool(event.data.name);
				trace.callEcology.set(String(event.data.callId), ecology);
				trace.toolCount += 1;
				if (ecology === "lumen") trace.lumen += 1;
				if (ecology === "forge") trace.forge += 1;
				if (ecology === "relay") trace.relay += 1;
				if (ecology === "aegis") trace.aegis += 1;
				return;
			}
			case "tool/result": {
				const trace = this.trace(session, event.data.turn);
				const firstBlock = event.data.message.content[0];
				if (event.data.error !== void 0 || firstBlock?.isError === true) trace.failedTools += 1;
				return;
			}
			case "turn/end": {
				const trace = this.trace(session, event.data.turn);
				this.traces.delete(session);
				if (event.data.reason.kind === "aborted") return void 0;
				if (event.data.reason.kind !== "completed") {
					const variant = failureVariant(event.data.reason);
					return {
						id: signalId(session, event),
						at: event.time,
						ecology: "glitch",
						ecologyCandidates: ["glitch"],
						outcome: "failed",
						intensity: Math.min(5, 1 + Math.floor(trace.toolCount / 2) + trace.failedTools),
						activeMinutes,
						enhanced: true,
						...variant === void 0 ? {} : { variant }
					};
				}
				const ecology = this.completedEcology(trace);
				return {
					id: signalId(session, event),
					at: event.time,
					ecology,
					ecologyCandidates: this.completedEcologyCandidates(trace),
					outcome: "completed",
					intensity: Math.min(5, 1 + Math.floor(trace.toolCount / 3) + (trace.failedTools > 0 ? 2 : 0)),
					activeMinutes,
					enhanced: false
				};
			}
			default: return;
		}
	}
	/** Fold child activity into its live top-level turn without ever minting a child reward. */
	observeRelatedActivity(session, event) {
		this.observeActivity(session, event.time);
		const trace = this.traces.get(session);
		if (trace === void 0) return;
		if (event.type === "tool/call") {
			const ecology = classifyTool(event.data.name);
			trace.callEcology.set(String(event.data.callId), ecology);
			trace.toolCount += 1;
			if (ecology === "lumen") trace.lumen += 1;
			if (ecology === "forge") trace.forge += 1;
			if (ecology === "relay") trace.relay += 1;
			if (ecology === "aegis") trace.aegis += 1;
			return;
		}
		if (event.type === "tool/result") {
			const firstBlock = event.data.message.content[0];
			if (event.data.error !== void 0 || firstBlock?.isError === true) trace.failedTools += 1;
		}
	}
	disposeSession(session) {
		this.traces.delete(session);
		this.activity.delete(session);
	}
	observeActivity(session, at) {
		const current = this.activity.get(session);
		if (current === void 0 || !Number.isFinite(at) || at < current.lastEventAt) {
			this.activity.set(session, {
				lastEventAt: Number.isFinite(at) ? at : 0,
				activeMs: 0
			});
			return 0;
		}
		const gap = at - current.lastEventAt;
		if (gap > 0 && gap <= 12e4) current.activeMs = Math.min(108e5, current.activeMs + gap);
		current.lastEventAt = at;
		return current.activeMs / 6e4;
	}
	trace(session, turn) {
		const current = this.traces.get(session);
		if (current !== void 0 && current.turn === turn) return current;
		const next = fresh(turn);
		this.traces.set(session, next);
		return next;
	}
	completedEcology(trace) {
		if (trace.failedTools > 0) return "aegis";
		if (trace.relay > 0 && trace.relay >= trace.forge && trace.relay >= trace.lumen) return "relay";
		if (trace.forge > 0 && trace.forge >= trace.lumen) return "forge";
		if (trace.lumen > 0) return "lumen";
		return "aegis";
	}
	completedEcologyCandidates(trace) {
		const candidates = [];
		if (trace.lumen > 0) candidates.push("lumen");
		if (trace.forge > 0) candidates.push("forge");
		if (trace.relay > 0) candidates.push("relay");
		if (trace.aegis > 0 || trace.failedTools > 0) candidates.push("aegis");
		return candidates.length > 0 ? candidates : ["aegis"];
	}
};
//#endregion
//#region lib/types/packages/dsh-adapter/src/persistence.js
const MAX_SAVE_BYTES = 2097152;
const CODEKIN_SAVE_FORMAT = "codekin.save";
function traceWildHome() {
	const configured = process.env.DSH_HOME;
	if (configured === void 0 || configured.trim() === "") return join(homedir(), ".dsh");
	const expanded = configured === "~" ? homedir() : configured.startsWith("~/") || configured.startsWith("~\\") ? join(homedir(), configured.slice(2)) : configured;
	return isAbsolute(expanded) ? resolve(expanded) : resolve(process.cwd(), expanded);
}
function codekinSaveStatePath() {
	return join(traceWildHome(), "codekinsave", "state.json");
}
function traceWildLegacyStatePath() {
	return join(traceWildHome(), "tracewild", "state.json");
}
function missingFile(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
function existingFile(error) {
	return error instanceof Error && "code" in error && error.code === "EEXIST";
}
function record(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function validStateVersion(value) {
	const version = record(value)?.schemaVersion;
	return version === 1 || version === 2 || version === 3;
}
function envelopeMatchesRuntime(root, runtime) {
	if (root.engineVersion !== runtime.engineVersion) return false;
	const content = record(root.content);
	if (content?.id !== runtime.content.id || !Array.isArray(content.packs)) return false;
	return content.packs.length === runtime.content.packs.length && content.packs.every((value, index) => {
		const pack = record(value);
		const expected = runtime.content.packs[index];
		return expected !== void 0 && pack?.id === expected.id && pack.version === expected.version;
	});
}
function createCodekinSaveEnvelope(runtime, state) {
	return {
		format: CODEKIN_SAVE_FORMAT,
		version: 1,
		engineVersion: runtime.engineVersion,
		content: {
			id: runtime.content.id,
			packs: runtime.content.packs.map((pack) => ({
				id: pack.id,
				version: pack.version
			}))
		},
		state
	};
}
function readState(runtime, filename, now) {
	try {
		if (statSync(filename).size > MAX_SAVE_BYTES) return void 0;
		const parsed = JSON.parse(readFileSync(filename, "utf8"));
		const root = record(parsed);
		if (root?.format === "codekin.save") {
			if (root.version !== 1 || !validStateVersion(root.state)) return void 0;
			return {
				state: runtime.restoreTraceWildState(root.state, now),
				shouldRewrite: !envelopeMatchesRuntime(root, runtime)
			};
		}
		return {
			state: runtime.restoreTraceWildState(parsed, now),
			shouldRewrite: validStateVersion(parsed)
		};
	} catch {
		return;
	}
}
function removeFile(filename) {
	try {
		unlinkSync(filename);
	} catch (error) {
		if (!missingFile(error)) throw error;
	}
}
var TraceWildPersistence = class {
	runtime;
	filename;
	legacyFilename;
	pendingMigrationBackup;
	constructor(runtime, filename = codekinSaveStatePath(), legacyFilename = filename === codekinSaveStatePath() ? traceWildLegacyStatePath() : void 0) {
		this.runtime = runtime;
		this.filename = filename;
		this.legacyFilename = legacyFilename;
	}
	load(now = Date.now()) {
		try {
			statSync(this.filename);
			const loaded = readState(this.runtime, this.filename, now);
			if (loaded === void 0) {
				this.pendingMigrationBackup = this.filename;
				return this.runtime.createInitialTraceWildState(now);
			}
			if (loaded.shouldRewrite) {
				this.pendingMigrationBackup = this.filename;
				try {
					this.save(loaded.state);
				} catch {}
			}
			return loaded.state;
		} catch (error) {
			if (!missingFile(error)) return this.runtime.createInitialTraceWildState(now);
		}
		if (this.legacyFilename !== void 0) {
			const migrated = readState(this.runtime, this.legacyFilename, now);
			if (migrated !== void 0) {
				this.pendingMigrationBackup = this.legacyFilename;
				try {
					this.save(migrated.state);
					removeFile(this.legacyFilename);
					removeFile(`${this.legacyFilename}.tmp`);
				} catch {}
				return migrated.state;
			}
		}
		return this.runtime.createInitialTraceWildState(now);
	}
	save(state) {
		mkdirSync(dirname(this.filename), {
			recursive: true,
			mode: 448
		});
		if (this.pendingMigrationBackup !== void 0) {
			try {
				copyFileSync(this.pendingMigrationBackup, `${this.filename}.migration-backup`, constants.COPYFILE_EXCL);
			} catch (error) {
				if (!existingFile(error)) throw error;
			}
			this.pendingMigrationBackup = void 0;
		}
		const temporary = `${this.filename}.tmp`;
		const body = JSON.stringify(createCodekinSaveEnvelope(this.runtime, state));
		if (Buffer.byteLength(body, "utf8") > MAX_SAVE_BYTES) throw new Error("Codekin save is too large");
		writeFileSync(temporary, body, {
			encoding: "utf8",
			mode: 384
		});
		renameSync(temporary, this.filename);
	}
	clear() {
		this.pendingMigrationBackup = void 0;
		removeFile(this.filename);
		removeFile(`${this.filename}.tmp`);
		removeFile(`${this.filename}.migration-backup`);
		if (this.legacyFilename !== void 0 && this.legacyFilename !== this.filename) {
			removeFile(this.legacyFilename);
			removeFile(`${this.legacyFilename}.tmp`);
		}
	}
};
//#endregion
//#region lib/types/packages/dsh-adapter/src/service.js
const cryptoRandom = () => randomInt(0, 4294967296) / 4294967296;
var TraceWildService = class {
	ctx;
	stateValue;
	listeners = /* @__PURE__ */ new Set();
	classifier = new TraceWildEventClassifier();
	persistence;
	random;
	now;
	runtime;
	constructor(ctx, options) {
		this.ctx = ctx;
		this.runtime = options.runtime;
		this.persistence = options.persistence ?? new TraceWildPersistence(this.runtime);
		this.random = options.random ?? cryptoRandom;
		this.now = options.now ?? Date.now;
		this.stateValue = this.persistence.load(this.now());
		const settled = this.runtime.settleTraceWildIdleRewards(this.stateValue, this.now(), this.random);
		if (settled !== this.stateValue) {
			this.persistence.save(settled);
			this.stateValue = settled;
		}
	}
	snapshot() {
		const serverTime = this.now();
		const expired = this.runtime.expireTraceWildEncounters(this.stateValue, serverTime);
		const settled = this.runtime.settleTraceWildIdleRewards(expired, serverTime, this.random);
		if (settled !== this.stateValue) {
			this.persistence.save(settled);
			this.stateValue = settled;
		}
		return {
			schemaVersion: 3,
			state: structuredClone(this.stateValue),
			serverTime
		};
	}
	subscribe(listener) {
		this.listeners.add(listener);
		listener(this.snapshot());
		return () => {
			this.listeners.delete(listener);
		};
	}
	observe(session, event) {
		if (!this.stateValue.enabled) return;
		if (session.header.parentSession !== void 0 || session.header.origin === "subagent") {
			const root = this.rootSession(session);
			if (root !== void 0) this.classifier.observeRelatedActivity(root, event);
			return;
		}
		const signal = this.classifier.observe(session, event);
		if (signal === void 0) return;
		try {
			const next = this.runtime.applyTraceSignal(this.stateValue, signal, this.random);
			if (next === this.stateValue) return;
			this.persistence.save(next);
			this.stateValue = next;
			this.publish();
		} catch (error) {
			this.ctx.logger.warn("tracewild: event reward could not be committed");
			this.ctx.logger.warn(error);
		}
	}
	rootSession(session) {
		let current = session;
		const visited = /* @__PURE__ */ new Set();
		for (let depth = 0; depth < 16 && current.header.parentSession !== void 0; depth += 1) {
			const id = String(current.id);
			if (visited.has(id)) return void 0;
			visited.add(id);
			const parent = this.ctx.sessions.get(current.header.parentSession);
			if (parent === void 0) return void 0;
			current = parent;
		}
		return current.header.parentSession === void 0 && current.header.origin !== "subagent" ? current : void 0;
	}
	disposeSession(session) {
		this.classifier.disposeSession(session);
	}
	act(action) {
		const previousEnabled = this.stateValue.enabled;
		const result = this.runtime.applyTraceWildAction(this.stateValue, action, this.random, this.now());
		this.persistence.save(result.state);
		this.stateValue = result.state;
		if (result.state.enabled !== previousEnabled) this.classifier = new TraceWildEventClassifier();
		const snapshot = this.snapshot();
		this.publish(snapshot);
		return {
			ok: true,
			...snapshot,
			...result.notice === void 0 ? {} : { notice: result.notice },
			...result.animation === void 0 ? {} : { animation: result.animation }
		};
	}
	clearLocalData() {
		const now = this.now();
		const next = this.runtime.createInitialTraceWildState(now);
		next.enabled = false;
		this.persistence.clear();
		this.stateValue = next;
		this.classifier = new TraceWildEventClassifier();
		const snapshot = this.snapshot();
		this.publish(snapshot);
		return {
			ok: true,
			...snapshot
		};
	}
	publish(snapshot = this.snapshot()) {
		for (const listener of [...this.listeners]) try {
			listener(snapshot);
		} catch {}
	}
};
//#endregion
//#region lib/types/src/index.js
/** Codekin Host plugin. */
const name = "dsh-codekin";
const inject = ["sessions", "webServer"];
function apply(ctx) {
	const service = new TraceWildService(ctx, { runtime: CORE_CODEKIN_RUNTIME });
	const assetDirectory = fileURLToPath(new URL("../assets/creatures/", import.meta.url));
	ctx.effect(() => {
		const routeGroup = createTraceWildRoutes(service, assetDirectory, CORE_CONTENT_VIEW);
		const disposers = [];
		try {
			for (const route of routeGroup.routes) disposers.push(ctx.webServer.register(route));
			disposers.push(ctx.on("session/event", (session, event) => {
				service.observe(session, event);
			}));
			disposers.push(ctx.on("session/disposed", (session) => {
				service.disposeSession(session);
			}));
		} catch (error) {
			routeGroup.close();
			for (const dispose of disposers.reverse()) try {
				dispose();
			} catch {}
			throw error;
		}
		return () => {
			routeGroup.close();
			for (const dispose of disposers.reverse()) try {
				dispose();
			} catch {}
		};
	}, "tracewild: events and web routes");
}
//#endregion
export { BASE_ACTIONS_PER_CREATURE, BASE_BOSS_ACTIONS, BOSS_SKILL_ENERGY_COST, BOSS_SKILL_ENERGY_LIMIT, CAPTURE_CORE_QUALITIES, CAPTURE_HEALTH_RATIO, CODEKIN_ENGINE_VERSION, CODEKIN_MECHANIC_CONTRACTS, CODEKIN_MECHANIC_OPCODES, CORE_CAPTURE_MULTIPLIERS, CORE_CAPTURE_POWER, CORE_CODEKIN_COMPOSITION, CORE_CODEKIN_RUNTIME, CORE_CONTENT_REGISTRY, CORE_CONTENT_VIEW, CORE_CREATURE_MECHANICS, CORE_DROP_WEIGHTS, CORE_ENGINE_CONTENT, CREATURE_CATALOG, CREATURE_SKILLS, ECOLOGY_ADVANTAGE, EngineContentError, MATCH_BOARD_CELLS, MATCH_BOARD_SIZE, MATERIAL_DROP_WEIGHTS, MATERIAL_XP, MAX_ACTIONS_PER_CREATURE, MAX_BONUS_ACTIONS_PER_STAGE, MAX_BOSS_ACTIONS, MAX_BOSS_BONUS_ACTIONS, MAX_BOSS_SWAPS_PER_PHASE, MAX_CAPTURE_ATTEMPTS, MAX_MAP_ENCOUNTERS, MAX_MATCH_CASCADES, MAX_PLAYER_LEVEL, MAX_TOWER_FLOOR, MechanicsContractError, PLAYER_QUALITY_BASE_MULTIPLIERS, PLAYER_QUALITY_GROWTH_BONUSES, PLAYER_QUALITY_MULTIPLIERS, QUALITY_ORDER, QUALITY_SKILL_MULTIPLIERS, SIGNAL_VARIANT_CREATURE_IDS, STARTER_CREATURE_IDS, TRACE_ECOLOGIES, TraceWildRuleError, TraceWildService, WILD_QUALITY_RESISTANCE, XP_QUALITY_MULTIPLIERS, activeMinuteBand, apply, applyTraceSignal, applyTraceWildAction, areAdjacentTiles, assertMechanicsContract, captureChance, captureChanceForBattle, chooseBossBattleSwap, convertRandomBattleTiles, coreQualityWeights, createCodekinComposition, createCodekinRuntime, createEngineContent, createInitialTraceWildState, createMatchBoard, creatureById, creatureIdForSignalVariant, creaturesInEcology, currentEngineContent, effectivePartyLevel, emptyTowerMaterialReward, encounterLifetimeMs, expireTraceWildEncounters, findBestBattleSwap, findFirstLegalBattleSwap, hasBattleMatches, idleRewardTier, inject, levelForXp, mechanicsByCreatureId, mechanicsContractIssues, name, normalizeTraceWildAction, playerLevelFactor, playerStats, qualityIndex, reshuffleBattleBoard, resolveBattleSwap, resolveExistingBattleMatches, resolveForcedTiles, restoreTraceWildState, sessionLevel, settleTraceWildIdleRewards, skillByCreatureId, threatPoints, totalXpForLevel, towerBossStats, towerFloorProfile, towerQualityForFloor, towerSkillTierForFloor, wildLevelFor, wildLevelForRoster, wildQualityWeights, wildStats, withEngineContent, xpToNextLevel };

//# sourceMappingURL=index.js.map