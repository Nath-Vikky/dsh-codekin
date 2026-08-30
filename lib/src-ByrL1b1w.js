import Ajv from "ajv";
import { satisfies, validRange } from "semver";
//#region lib/types/packages/content-sdk/src/define.js
function defineContentPack(pack) {
	return pack;
}
//#endregion
//#region lib/types/packages/content-sdk/src/schema.js
const ID_PATTERN = "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
const VERSION_PATTERN = "^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$";
const ASSET_PATH_PATTERN = "^(?!/)(?!.*(?:^|/)\\.\\.(?:/|$))[A-Za-z0-9._/-]+$";
const localizedText = {
	type: "object",
	additionalProperties: false,
	required: ["zhCN", "en"],
	properties: {
		zhCN: {
			type: "string",
			minLength: 1,
			maxLength: 160
		},
		en: {
			type: "string",
			minLength: 1,
			maxLength: 160
		}
	}
};
const CONTENT_PACK_SCHEMA = {
	$id: "https://codekin.dev/schema/content-pack-v1.json",
	type: "object",
	additionalProperties: false,
	required: [
		"manifest",
		"ecologies",
		"qualities",
		"creatures",
		"skills",
		"mechanics",
		"encounters",
		"starters",
		"tower",
		"assets"
	],
	properties: {
		manifest: {
			type: "object",
			additionalProperties: false,
			required: [
				"id",
				"version",
				"engine",
				"contentApi"
			],
			properties: {
				id: {
					type: "string",
					pattern: ID_PATTERN
				},
				version: {
					type: "string",
					pattern: VERSION_PATTERN
				},
				engine: {
					type: "string",
					minLength: 1,
					maxLength: 80
				},
				contentApi: { const: 1 },
				dependencies: {
					type: "object",
					maxProperties: 32,
					propertyNames: { pattern: ID_PATTERN },
					additionalProperties: {
						type: "string",
						minLength: 1,
						maxLength: 80
					}
				},
				conflicts: {
					type: "array",
					maxItems: 32,
					uniqueItems: true,
					items: {
						type: "string",
						pattern: ID_PATTERN
					}
				},
				priority: {
					type: "integer",
					minimum: -1e3,
					maximum: 1e3
				}
			}
		},
		ecologies: {
			type: "array",
			maxItems: 32,
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"id",
					"order",
					"name",
					"tileRole"
				],
				properties: {
					id: {
						type: "string",
						pattern: ID_PATTERN
					},
					order: {
						type: "integer",
						minimum: 0,
						maximum: 999
					},
					name: localizedText,
					tileRole: { enum: [
						"sync",
						"overclock",
						"guard",
						"repair",
						"breach"
					] }
				}
			}
		},
		qualities: {
			type: "array",
			maxItems: 32,
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"id",
					"order",
					"name"
				],
				properties: {
					id: {
						type: "string",
						pattern: ID_PATTERN
					},
					order: {
						type: "integer",
						minimum: 0,
						maximum: 999
					},
					name: localizedText
				}
			}
		},
		creatures: {
			type: "array",
			maxItems: 2048,
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"number",
					"id",
					"name",
					"ecology",
					"rarity",
					"combatRole",
					"baseCaptureRate",
					"signatureProtocol",
					"sprite",
					"stats"
				],
				properties: {
					number: {
						type: "integer",
						minimum: 1,
						maximum: 999999
					},
					id: {
						type: "string",
						pattern: ID_PATTERN
					},
					name: localizedText,
					ecology: {
						type: "string",
						pattern: ID_PATTERN
					},
					rarity: { enum: [
						"common",
						"uncommon",
						"rare",
						"apex"
					] },
					combatRole: {
						type: "string",
						minLength: 1,
						maxLength: 80
					},
					baseCaptureRate: {
						type: "number",
						minimum: .001,
						maximum: 1
					},
					signatureProtocol: {
						type: "string",
						pattern: ID_PATTERN
					},
					sprite: {
						type: "string",
						pattern: ID_PATTERN
					},
					stats: {
						type: "object",
						additionalProperties: false,
						required: [
							"hp",
							"attack",
							"defense",
							"speed"
						],
						properties: {
							hp: {
								type: "integer",
								minimum: 1,
								maximum: 999999999
							},
							attack: {
								type: "integer",
								minimum: 1,
								maximum: 999999999
							},
							defense: {
								type: "integer",
								minimum: 1,
								maximum: 999999999
							},
							speed: {
								type: "integer",
								minimum: 1,
								maximum: 999999999
							}
						}
					}
				}
			}
		},
		skills: {
			type: "array",
			maxItems: 2048,
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"creatureId",
					"energyCost",
					"passive",
					"active"
				],
				properties: {
					creatureId: {
						type: "string",
						pattern: ID_PATTERN
					},
					energyCost: {
						type: "integer",
						minimum: 0,
						maximum: 999
					},
					passive: {
						type: "object",
						additionalProperties: false,
						required: ["name", "description"],
						properties: {
							name: localizedText,
							description: localizedText
						}
					},
					active: {
						type: "object",
						additionalProperties: false,
						required: ["name", "description"],
						properties: {
							name: localizedText,
							description: localizedText
						}
					}
				}
			}
		},
		mechanics: {
			type: "array",
			maxItems: 2048,
			items: {
				type: "object",
				additionalProperties: false,
				required: ["creatureId", "bindings"],
				properties: {
					creatureId: {
						type: "string",
						pattern: ID_PATTERN
					},
					bindings: {
						type: "array",
						minItems: 1,
						maxItems: 64,
						items: {
							type: "object",
							additionalProperties: false,
							required: ["trigger", "opcode"],
							properties: {
								trigger: { enum: [
									"energy:overflow",
									"damage:modify",
									"match:after",
									"energy:after-distribute",
									"stage:enter",
									"defeat:before",
									"runtime:threshold",
									"damage:taken",
									"skill:before",
									"skill:cast"
								] },
								opcode: {
									type: "string",
									pattern: ID_PATTERN
								},
								priority: {
									type: "integer",
									minimum: -1e3,
									maximum: 1e3
								},
								params: {
									type: "object",
									maxProperties: 24,
									propertyNames: { pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$" },
									additionalProperties: { anyOf: [
										{
											type: "string",
											minLength: 1,
											maxLength: 128
										},
										{
											type: "number",
											minimum: -1e6,
											maximum: 1e6
										},
										{ type: "boolean" }
									] }
								}
							}
						}
					}
				}
			}
		},
		encounters: {
			type: "object",
			additionalProperties: false,
			required: ["variants"],
			properties: { variants: {
				type: "object",
				maxProperties: 128,
				propertyNames: { pattern: "^[a-z][a-z0-9-]{0,63}$" },
				additionalProperties: {
					type: "string",
					pattern: ID_PATTERN
				}
			} }
		},
		starters: {
			type: "array",
			maxItems: 32,
			uniqueItems: true,
			items: {
				type: "string",
				pattern: ID_PATTERN
			}
		},
		tower: {
			type: "object",
			additionalProperties: false,
			required: ["rotation"],
			properties: { rotation: {
				type: "array",
				maxItems: 2048,
				items: {
					type: "string",
					pattern: ID_PATTERN
				}
			} }
		},
		assets: {
			type: "array",
			maxItems: 4096,
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"key",
					"path",
					"mime",
					"kind"
				],
				properties: {
					key: {
						type: "string",
						pattern: ID_PATTERN
					},
					path: {
						type: "string",
						pattern: ASSET_PATH_PATTERN,
						maxLength: 240
					},
					mime: { enum: ["image/png", "image/webp"] },
					kind: { enum: ["launcher", "creature"] }
				}
			}
		},
		aliases: {
			type: "object",
			maxProperties: 4096,
			propertyNames: { pattern: ID_PATTERN },
			additionalProperties: {
				type: "string",
				pattern: ID_PATTERN
			}
		}
	}
};
//#endregion
//#region lib/types/packages/content-sdk/src/validation.js
const validate = new Ajv({
	allErrors: true,
	strict: true
}).compile(CONTENT_PACK_SCHEMA);
function issuesFrom(errors) {
	return (errors ?? []).map((error) => ({
		path: error.instancePath === "" ? "/" : error.instancePath,
		message: error.message ?? error.keyword
	}));
}
var ContentPackValidationError = class extends TypeError {
	issues;
	constructor(issues) {
		super(`invalid Codekin content pack: ${issues.map((issue) => `${issue.path} ${issue.message}`).join("; ")}`);
		this.name = "ContentPackValidationError";
		this.issues = Object.freeze([...issues]);
	}
};
function assertContentPack(value) {
	if (!validate(value)) throw new ContentPackValidationError(issuesFrom(validate.errors));
}
function contentPackIssues(value) {
	return validate(value) ? [] : Object.freeze(issuesFrom(validate.errors));
}
//#endregion
//#region lib/types/packages/content-sdk/src/registry.js
function deepFreeze(value) {
	if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value;
	for (const child of Object.values(value)) deepFreeze(child);
	return Object.freeze(value);
}
function packOrder(packs, issues) {
	const byId = /* @__PURE__ */ new Map();
	for (const pack of packs) if (!byId.has(pack.manifest.id)) byId.set(pack.manifest.id, pack);
	for (const pack of packs) {
		for (const conflict of pack.manifest.conflicts ?? []) if (byId.has(conflict)) issues.push({
			path: `/packs/${pack.manifest.id}/conflicts`,
			message: `conflicts with loaded pack ${conflict}`
		});
		for (const [dependencyId, range] of Object.entries(pack.manifest.dependencies ?? {})) {
			const dependency = byId.get(dependencyId);
			if (dependency === void 0) issues.push({
				path: `/packs/${pack.manifest.id}/dependencies/${dependencyId}`,
				message: "missing dependency"
			});
			else if (validRange(range) === null || !satisfies(dependency.manifest.version, range, { includePrerelease: true })) issues.push({
				path: `/packs/${pack.manifest.id}/dependencies/${dependencyId}`,
				message: `version ${dependency.manifest.version} does not satisfy ${range}`
			});
		}
	}
	const compare = (left, right) => (left.manifest.priority ?? 0) - (right.manifest.priority ?? 0) || left.manifest.id.localeCompare(right.manifest.id);
	const indegree = new Map([...byId.keys()].map((id) => [id, 0]));
	const dependents = /* @__PURE__ */ new Map();
	for (const pack of byId.values()) for (const dependencyId of Object.keys(pack.manifest.dependencies ?? {})) {
		if (!byId.has(dependencyId)) continue;
		indegree.set(pack.manifest.id, (indegree.get(pack.manifest.id) ?? 0) + 1);
		const rows = dependents.get(dependencyId) ?? [];
		rows.push(pack.manifest.id);
		dependents.set(dependencyId, rows);
	}
	const ready = [...byId.values()].filter((pack) => indegree.get(pack.manifest.id) === 0).sort(compare);
	const ordered = [];
	while (ready.length > 0) {
		const pack = ready.shift();
		ordered.push(pack);
		for (const dependentId of (dependents.get(pack.manifest.id) ?? []).sort()) {
			const next = (indegree.get(dependentId) ?? 0) - 1;
			indegree.set(dependentId, next);
			if (next === 0) {
				ready.push(byId.get(dependentId));
				ready.sort(compare);
			}
		}
	}
	if (ordered.length !== byId.size) {
		const cycle = [...byId.keys()].filter((id) => !ordered.some((pack) => pack.manifest.id === id)).sort();
		issues.push({
			path: "/packs",
			message: `dependency cycle: ${cycle.join(", ")}`
		});
	}
	return ordered;
}
function duplicateIssues(rows, category, key) {
	const seen = /* @__PURE__ */ new Set();
	const issues = [];
	for (const row of rows) {
		const id = key(row);
		if (seen.has(id)) issues.push({
			path: `/${category}/${id}`,
			message: `duplicate ${category} id`
		});
		seen.add(id);
	}
	return issues;
}
function resolveAlias(aliases, id) {
	const seen = /* @__PURE__ */ new Set();
	let current = id;
	while (aliases.has(current)) {
		if (seen.has(current)) throw new ContentPackValidationError([{
			path: `/aliases/${id}`,
			message: "alias cycle"
		}]);
		seen.add(current);
		current = aliases.get(current);
	}
	return current;
}
function createContentRegistry(values, options = {}) {
	const inputPacks = [];
	for (const value of values) {
		assertContentPack(value);
		inputPacks.push(deepFreeze(structuredClone(value)));
	}
	const issues = [...duplicateIssues(inputPacks, "packs", (row) => row.manifest.id)];
	if (options.engineVersion !== void 0) for (const pack of inputPacks) {
		const range = pack.manifest.engine;
		if (validRange(range) === null || !satisfies(options.engineVersion, range, { includePrerelease: true })) issues.push({
			path: `/packs/${pack.manifest.id}/engine`,
			message: `engine ${options.engineVersion} does not satisfy ${range}`
		});
	}
	const packs = packOrder(inputPacks, issues);
	const ecologies = packs.flatMap((pack) => pack.ecologies);
	const qualities = packs.flatMap((pack) => pack.qualities);
	const creatures = packs.flatMap((pack) => pack.creatures);
	const skills = packs.flatMap((pack) => pack.skills);
	const mechanics = packs.flatMap((pack) => pack.mechanics);
	const encounterVariantRows = packs.flatMap((pack) => Object.entries(pack.encounters.variants).map(([variant, creatureId]) => ({
		variant,
		creatureId
	})));
	const assets = packs.flatMap((pack) => pack.assets);
	issues.push(...duplicateIssues(ecologies, "ecologies", (row) => row.id), ...duplicateIssues(qualities, "qualities", (row) => row.id), ...duplicateIssues(creatures, "creatures", (row) => row.id), ...duplicateIssues(creatures, "creature-numbers", (row) => String(row.number)), ...duplicateIssues(skills, "skills", (row) => row.creatureId), ...duplicateIssues(mechanics, "mechanics", (row) => row.creatureId), ...duplicateIssues(encounterVariantRows, "encounter-variants", (row) => row.variant), ...duplicateIssues(assets, "assets", (row) => row.key));
	const ecologyIds = new Set(ecologies.map((row) => row.id));
	const creatureIds = new Set(creatures.map((row) => row.id));
	const assetKeys = new Set(assets.map((row) => row.key));
	const skillIds = new Set(skills.map((row) => row.creatureId));
	const mechanicIds = new Set(mechanics.map((row) => row.creatureId));
	for (const creature of creatures) {
		if (!ecologyIds.has(creature.ecology)) issues.push({
			path: `/creatures/${creature.id}/ecology`,
			message: `unknown ecology ${creature.ecology}`
		});
		if (!assetKeys.has(creature.sprite)) issues.push({
			path: `/creatures/${creature.id}/sprite`,
			message: `unknown asset ${creature.sprite}`
		});
		if (!skillIds.has(creature.id)) issues.push({
			path: `/creatures/${creature.id}`,
			message: "missing skill definition"
		});
		if (!mechanicIds.has(creature.id)) issues.push({
			path: `/creatures/${creature.id}`,
			message: "missing mechanics definition"
		});
	}
	for (const skill of skills) if (!creatureIds.has(skill.creatureId)) issues.push({
		path: `/skills/${skill.creatureId}`,
		message: "unknown creature"
	});
	for (const definition of mechanics) if (!creatureIds.has(definition.creatureId)) issues.push({
		path: `/mechanics/${definition.creatureId}`,
		message: "unknown creature"
	});
	for (const row of encounterVariantRows) if (!creatureIds.has(row.creatureId)) issues.push({
		path: `/encounters/variants/${row.variant}`,
		message: `unknown creature ${row.creatureId}`
	});
	for (const pack of packs) {
		for (const starter of pack.starters) if (!creatureIds.has(starter)) issues.push({
			path: `/packs/${pack.manifest.id}/starters`,
			message: `unknown creature ${starter}`
		});
		for (const creatureId of pack.tower.rotation) if (!creatureIds.has(creatureId)) issues.push({
			path: `/packs/${pack.manifest.id}/tower/rotation`,
			message: `unknown creature ${creatureId}`
		});
	}
	const aliases = /* @__PURE__ */ new Map();
	for (const pack of packs) for (const [from, to] of Object.entries(pack.aliases ?? {})) {
		if (aliases.has(from) || creatureIds.has(from)) issues.push({
			path: `/packs/${pack.manifest.id}/aliases/${from}`,
			message: "duplicate alias"
		});
		aliases.set(from, to);
	}
	for (const [from] of aliases) try {
		const target = resolveAlias(aliases, from);
		if (!creatureIds.has(target)) issues.push({
			path: `/aliases/${from}`,
			message: `unknown target ${target}`
		});
	} catch (error) {
		if (error instanceof ContentPackValidationError) issues.push(...error.issues);
		else throw error;
	}
	if (issues.length > 0) throw new ContentPackValidationError(issues);
	const creatureMap = new Map(creatures.map((row) => [row.id, row]));
	const skillMap = new Map(skills.map((row) => [row.creatureId, row]));
	const mechanicsMap = new Map(mechanics.map((row) => [row.creatureId, row]));
	const encounterVariantMap = new Map(encounterVariantRows.map((row) => [row.variant, row.creatureId]));
	const assetMap = new Map(assets.map((row) => [row.key, row]));
	const registry = {
		packs: Object.freeze([...packs]),
		ecologies: Object.freeze([...ecologies]),
		qualities: Object.freeze([...qualities]),
		creatures: Object.freeze([...creatures]),
		skills: Object.freeze([...skills]),
		mechanics: Object.freeze([...mechanics]),
		encounterVariants: Object.freeze(Object.fromEntries(encounterVariantMap)),
		assets: Object.freeze([...assets]),
		resolveId: (id) => resolveAlias(aliases, id),
		creature: (id) => creatureMap.get(resolveAlias(aliases, id)),
		skill: (id) => skillMap.get(resolveAlias(aliases, id)),
		creatureMechanics: (id) => mechanicsMap.get(resolveAlias(aliases, id)),
		encounterCreature: (variant) => {
			const id = encounterVariantMap.get(variant);
			return id === void 0 ? void 0 : creatureMap.get(resolveAlias(aliases, id));
		},
		asset: (key) => assetMap.get(key)
	};
	return Object.freeze(registry);
}
//#endregion
//#region lib/types/packages/content-sdk/src/types.js
const CONTENT_API_VERSION = 1;
const TRACE_ECOLOGIES = Object.freeze([
	"lumen",
	"forge",
	"relay",
	"aegis",
	"glitch"
]);
const CAPTURE_CORE_QUALITIES = Object.freeze([
	"pebble",
	"pulse",
	"prism",
	"nova",
	"origin"
]);
//#endregion
//#region lib/types/packages/content-sdk/src/view.js
function createContentView(registry) {
	const packs = Object.freeze(registry.packs.map((pack) => Object.freeze({
		id: pack.manifest.id,
		version: pack.manifest.version
	})));
	return Object.freeze({
		contentApi: 1,
		id: packs.map((pack) => `${pack.id}@${pack.version}`).join("+"),
		packs,
		ecologies: Object.freeze([...registry.ecologies]),
		qualities: Object.freeze([...registry.qualities]),
		creatures: Object.freeze([...registry.creatures]),
		skills: Object.freeze([...registry.skills]),
		starters: Object.freeze([...new Set(registry.packs.flatMap((pack) => pack.starters))]),
		towerRotation: Object.freeze(registry.packs.flatMap((pack) => pack.tower.rotation)),
		assets: Object.freeze([...registry.assets])
	});
}
//#endregion
export { createContentRegistry as a, contentPackIssues as c, TRACE_ECOLOGIES as i, CONTENT_PACK_SCHEMA as l, CAPTURE_CORE_QUALITIES as n, ContentPackValidationError as o, CONTENT_API_VERSION as r, assertContentPack as s, createContentView as t, defineContentPack as u };

//# sourceMappingURL=src-ByrL1b1w.js.map