export declare const CONTENT_PACK_SCHEMA: {
    readonly $id: "https://codekin.dev/schema/content-pack-v1.json";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["manifest", "ecologies", "qualities", "creatures", "skills", "mechanics", "encounters", "starters", "tower", "assets"];
    readonly properties: {
        readonly manifest: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly required: readonly ["id", "version", "engine", "contentApi"];
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                };
                readonly version: {
                    readonly type: "string";
                    readonly pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$";
                };
                readonly engine: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 80;
                };
                readonly contentApi: {
                    readonly const: 1;
                };
                readonly dependencies: {
                    readonly type: "object";
                    readonly maxProperties: 32;
                    readonly propertyNames: {
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly additionalProperties: {
                        readonly type: "string";
                        readonly minLength: 1;
                        readonly maxLength: 80;
                    };
                };
                readonly conflicts: {
                    readonly type: "array";
                    readonly maxItems: 32;
                    readonly uniqueItems: true;
                    readonly items: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                };
                readonly priority: {
                    readonly type: "integer";
                    readonly minimum: -1000;
                    readonly maximum: 1000;
                };
            };
        };
        readonly ecologies: {
            readonly type: "array";
            readonly minItems: 1;
            readonly maxItems: 32;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "order", "name", "tileRole"];
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly order: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 999;
                    };
                    readonly name: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["zhCN", "en"];
                        readonly properties: {
                            readonly zhCN: {
                                readonly type: "string";
                                readonly minLength: 1;
                                readonly maxLength: 160;
                            };
                            readonly en: {
                                readonly type: "string";
                                readonly minLength: 1;
                                readonly maxLength: 160;
                            };
                        };
                    };
                    readonly tileRole: {
                        readonly enum: readonly ["sync", "overclock", "guard", "repair", "breach"];
                    };
                };
            };
        };
        readonly qualities: {
            readonly type: "array";
            readonly minItems: 1;
            readonly maxItems: 32;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "order", "name"];
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly order: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 999;
                    };
                    readonly name: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["zhCN", "en"];
                        readonly properties: {
                            readonly zhCN: {
                                readonly type: "string";
                                readonly minLength: 1;
                                readonly maxLength: 160;
                            };
                            readonly en: {
                                readonly type: "string";
                                readonly minLength: 1;
                                readonly maxLength: 160;
                            };
                        };
                    };
                };
            };
        };
        readonly creatures: {
            readonly type: "array";
            readonly maxItems: 2048;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["number", "id", "name", "ecology", "rarity", "combatRole", "baseCaptureRate", "signatureProtocol", "sprite", "stats"];
                readonly properties: {
                    readonly number: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 999999;
                    };
                    readonly id: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly name: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["zhCN", "en"];
                        readonly properties: {
                            readonly zhCN: {
                                readonly type: "string";
                                readonly minLength: 1;
                                readonly maxLength: 160;
                            };
                            readonly en: {
                                readonly type: "string";
                                readonly minLength: 1;
                                readonly maxLength: 160;
                            };
                        };
                    };
                    readonly ecology: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly rarity: {
                        readonly enum: readonly ["common", "uncommon", "rare", "apex"];
                    };
                    readonly combatRole: {
                        readonly type: "string";
                        readonly minLength: 1;
                        readonly maxLength: 80;
                    };
                    readonly baseCaptureRate: {
                        readonly type: "number";
                        readonly minimum: 0.001;
                        readonly maximum: 1;
                    };
                    readonly signatureProtocol: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly sprite: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly stats: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["hp", "attack", "defense", "speed"];
                        readonly properties: {
                            readonly hp: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 999999999;
                            };
                            readonly attack: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 999999999;
                            };
                            readonly defense: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 999999999;
                            };
                            readonly speed: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 999999999;
                            };
                        };
                    };
                };
            };
        };
        readonly skills: {
            readonly type: "array";
            readonly maxItems: 2048;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["creatureId", "energyCost", "passive", "active"];
                readonly properties: {
                    readonly creatureId: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly energyCost: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 999;
                    };
                    readonly passive: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["name", "description"];
                        readonly properties: {
                            readonly name: {
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly required: readonly ["zhCN", "en"];
                                readonly properties: {
                                    readonly zhCN: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                    readonly en: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                };
                            };
                            readonly description: {
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly required: readonly ["zhCN", "en"];
                                readonly properties: {
                                    readonly zhCN: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                    readonly en: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                };
                            };
                        };
                    };
                    readonly active: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["name", "description"];
                        readonly properties: {
                            readonly name: {
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly required: readonly ["zhCN", "en"];
                                readonly properties: {
                                    readonly zhCN: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                    readonly en: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                };
                            };
                            readonly description: {
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly required: readonly ["zhCN", "en"];
                                readonly properties: {
                                    readonly zhCN: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                    readonly en: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly maxLength: 160;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        readonly mechanics: {
            readonly type: "array";
            readonly maxItems: 2048;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["creatureId", "bindings"];
                readonly properties: {
                    readonly creatureId: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly bindings: {
                        readonly type: "array";
                        readonly minItems: 1;
                        readonly maxItems: 64;
                        readonly items: {
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly required: readonly ["trigger", "opcode"];
                            readonly properties: {
                                readonly trigger: {
                                    readonly enum: readonly ["energy:overflow", "damage:modify", "match:after", "energy:after-distribute", "stage:enter", "defeat:before", "runtime:threshold", "damage:taken", "skill:before", "skill:cast"];
                                };
                                readonly opcode: {
                                    readonly type: "string";
                                    readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                                };
                                readonly priority: {
                                    readonly type: "integer";
                                    readonly minimum: -1000;
                                    readonly maximum: 1000;
                                };
                                readonly params: {
                                    readonly type: "object";
                                    readonly maxProperties: 24;
                                    readonly propertyNames: {
                                        readonly pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$";
                                    };
                                    readonly additionalProperties: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly minLength: 1;
                                            readonly maxLength: 128;
                                        }, {
                                            readonly type: "number";
                                            readonly minimum: -1000000;
                                            readonly maximum: 1000000;
                                        }, {
                                            readonly type: "boolean";
                                        }];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        readonly encounters: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly required: readonly ["variants"];
            readonly properties: {
                readonly variants: {
                    readonly type: "object";
                    readonly maxProperties: 128;
                    readonly propertyNames: {
                        readonly pattern: "^[a-z][a-z0-9-]{0,63}$";
                    };
                    readonly additionalProperties: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                };
            };
        };
        readonly starters: {
            readonly type: "array";
            readonly maxItems: 32;
            readonly uniqueItems: true;
            readonly items: {
                readonly type: "string";
                readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
            };
        };
        readonly tower: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly required: readonly ["rotation"];
            readonly properties: {
                readonly rotation: {
                    readonly type: "array";
                    readonly minItems: 1;
                    readonly maxItems: 2048;
                    readonly items: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                };
            };
        };
        readonly assets: {
            readonly type: "array";
            readonly maxItems: 4096;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["key", "path", "mime", "kind"];
                readonly properties: {
                    readonly key: {
                        readonly type: "string";
                        readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
                    };
                    readonly path: {
                        readonly type: "string";
                        readonly pattern: "^(?!/)(?!.*(?:^|/)\\.\\.(?:/|$))[A-Za-z0-9._/-]+$";
                        readonly maxLength: 240;
                    };
                    readonly mime: {
                        readonly enum: readonly ["image/png", "image/webp"];
                    };
                    readonly kind: {
                        readonly enum: readonly ["launcher", "creature"];
                    };
                };
            };
        };
        readonly aliases: {
            readonly type: "object";
            readonly maxProperties: 4096;
            readonly propertyNames: {
                readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
            };
            readonly additionalProperties: {
                readonly type: "string";
                readonly pattern: "^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$";
            };
        };
    };
};
//# sourceMappingURL=schema.d.ts.map