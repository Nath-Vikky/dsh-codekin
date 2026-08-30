import Ajv from "ajv";
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
			minItems: 1,
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
			minItems: 1,
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
				minItems: 1,
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
function createContentRegistry(values) {
	const packs = [];
	for (const value of values) {
		assertContentPack(value);
		packs.push(value);
	}
	packs.sort((left, right) => left.manifest.id.localeCompare(right.manifest.id));
	const ecologies = packs.flatMap((pack) => pack.ecologies);
	const qualities = packs.flatMap((pack) => pack.qualities);
	const creatures = packs.flatMap((pack) => pack.creatures);
	const skills = packs.flatMap((pack) => pack.skills);
	const assets = packs.flatMap((pack) => pack.assets);
	const issues = [
		...duplicateIssues(packs, "packs", (row) => row.manifest.id),
		...duplicateIssues(ecologies, "ecologies", (row) => row.id),
		...duplicateIssues(qualities, "qualities", (row) => row.id),
		...duplicateIssues(creatures, "creatures", (row) => row.id),
		...duplicateIssues(creatures, "creature-numbers", (row) => String(row.number)),
		...duplicateIssues(skills, "skills", (row) => row.creatureId),
		...duplicateIssues(assets, "assets", (row) => row.key)
	];
	const ecologyIds = new Set(ecologies.map((row) => row.id));
	const creatureIds = new Set(creatures.map((row) => row.id));
	const assetKeys = new Set(assets.map((row) => row.key));
	const skillIds = new Set(skills.map((row) => row.creatureId));
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
	}
	for (const skill of skills) if (!creatureIds.has(skill.creatureId)) issues.push({
		path: `/skills/${skill.creatureId}`,
		message: "unknown creature"
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
	const assetMap = new Map(assets.map((row) => [row.key, row]));
	const registry = {
		packs: Object.freeze([...packs]),
		ecologies: Object.freeze([...ecologies]),
		qualities: Object.freeze([...qualities]),
		creatures: Object.freeze([...creatures]),
		skills: Object.freeze([...skills]),
		assets: Object.freeze([...assets]),
		resolveId: (id) => resolveAlias(aliases, id),
		creature: (id) => creatureMap.get(resolveAlias(aliases, id)),
		skill: (id) => skillMap.get(resolveAlias(aliases, id)),
		asset: (key) => assetMap.get(key)
	};
	return Object.freeze(registry);
}
//#endregion
//#region lib/types/packages/content-sdk/src/types.js
const CONTENT_API_VERSION = 1;
//#endregion
export { contentPackIssues as a, assertContentPack as i, createContentRegistry as n, CONTENT_PACK_SCHEMA as o, ContentPackValidationError as r, defineContentPack as s, CONTENT_API_VERSION as t };

//# sourceMappingURL=src-CtkEB06v.js.map