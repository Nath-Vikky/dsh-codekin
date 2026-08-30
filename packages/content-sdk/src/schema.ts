const ID_PATTERN = '^[A-Za-z0-9@][A-Za-z0-9._:@/-]{1,127}$'
const VERSION_PATTERN = '^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$'
const ASSET_PATH_PATTERN = '^(?!/)(?!.*(?:^|/)\\.\\.(?:/|$))[A-Za-z0-9._/-]+$'

const localizedText = {
  type: 'object',
  additionalProperties: false,
  required: ['zhCN', 'en'],
  properties: {
    zhCN: { type: 'string', minLength: 1, maxLength: 160 },
    en: { type: 'string', minLength: 1, maxLength: 160 },
  },
} as const

export const CONTENT_PACK_SCHEMA = {
  $id: 'https://codekin.dev/schema/content-pack-v1.json',
  type: 'object',
  additionalProperties: false,
  required: [
    'manifest', 'ecologies', 'qualities', 'creatures', 'skills', 'mechanics',
    'encounters', 'starters', 'tower', 'assets',
  ],
  properties: {
    manifest: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'version', 'engine', 'contentApi'],
      properties: {
        id: { type: 'string', pattern: ID_PATTERN },
        version: { type: 'string', pattern: VERSION_PATTERN },
        engine: { type: 'string', minLength: 1, maxLength: 80 },
        contentApi: { const: 1 },
        dependencies: {
          type: 'object',
          maxProperties: 32,
          propertyNames: { pattern: ID_PATTERN },
          additionalProperties: { type: 'string', minLength: 1, maxLength: 80 },
        },
        conflicts: {
          type: 'array', maxItems: 32, uniqueItems: true,
          items: { type: 'string', pattern: ID_PATTERN },
        },
        priority: { type: 'integer', minimum: -1000, maximum: 1000 },
      },
    },
    ecologies: {
      type: 'array', minItems: 1, maxItems: 32,
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'order', 'name', 'tileRole'],
        properties: {
          id: { type: 'string', pattern: ID_PATTERN },
          order: { type: 'integer', minimum: 0, maximum: 999 },
          name: localizedText,
          tileRole: { enum: ['sync', 'overclock', 'guard', 'repair', 'breach'] },
        },
      },
    },
    qualities: {
      type: 'array', minItems: 1, maxItems: 32,
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'order', 'name'],
        properties: {
          id: { type: 'string', pattern: ID_PATTERN },
          order: { type: 'integer', minimum: 0, maximum: 999 },
          name: localizedText,
        },
      },
    },
    creatures: {
      type: 'array', maxItems: 2048,
      items: {
        type: 'object', additionalProperties: false,
        required: [
          'number', 'id', 'name', 'ecology', 'rarity', 'combatRole',
          'baseCaptureRate', 'signatureProtocol', 'sprite', 'stats',
        ],
        properties: {
          number: { type: 'integer', minimum: 1, maximum: 999999 },
          id: { type: 'string', pattern: ID_PATTERN },
          name: localizedText,
          ecology: { type: 'string', pattern: ID_PATTERN },
          rarity: { enum: ['common', 'uncommon', 'rare', 'apex'] },
          combatRole: { type: 'string', minLength: 1, maxLength: 80 },
          baseCaptureRate: { type: 'number', minimum: 0.001, maximum: 1 },
          signatureProtocol: { type: 'string', pattern: ID_PATTERN },
          sprite: { type: 'string', pattern: ID_PATTERN },
          stats: {
            type: 'object', additionalProperties: false,
            required: ['hp', 'attack', 'defense', 'speed'],
            properties: {
              hp: { type: 'integer', minimum: 1, maximum: 999999999 },
              attack: { type: 'integer', minimum: 1, maximum: 999999999 },
              defense: { type: 'integer', minimum: 1, maximum: 999999999 },
              speed: { type: 'integer', minimum: 1, maximum: 999999999 },
            },
          },
        },
      },
    },
    skills: {
      type: 'array', maxItems: 2048,
      items: {
        type: 'object', additionalProperties: false,
        required: ['creatureId', 'energyCost', 'passive', 'active'],
        properties: {
          creatureId: { type: 'string', pattern: ID_PATTERN },
          energyCost: { type: 'integer', minimum: 0, maximum: 999 },
          passive: {
            type: 'object', additionalProperties: false,
            required: ['name', 'description'],
            properties: { name: localizedText, description: localizedText },
          },
          active: {
            type: 'object', additionalProperties: false,
            required: ['name', 'description'],
            properties: { name: localizedText, description: localizedText },
          },
        },
      },
    },
    mechanics: {
      type: 'array', maxItems: 2048,
      items: {
        type: 'object', additionalProperties: false,
        required: ['creatureId', 'bindings'],
        properties: {
          creatureId: { type: 'string', pattern: ID_PATTERN },
          bindings: {
            type: 'array', minItems: 1, maxItems: 64,
            items: {
              type: 'object', additionalProperties: false,
              required: ['trigger', 'opcode'],
              properties: {
                trigger: {
                  enum: [
                    'energy:overflow', 'damage:modify', 'match:after',
                    'energy:after-distribute', 'stage:enter', 'defeat:before',
                    'runtime:threshold', 'damage:taken', 'skill:before', 'skill:cast',
                  ],
                },
                opcode: { type: 'string', pattern: ID_PATTERN },
                priority: { type: 'integer', minimum: -1000, maximum: 1000 },
                params: {
                  type: 'object', maxProperties: 24,
                  propertyNames: { pattern: '^[A-Za-z][A-Za-z0-9_-]{0,63}$' },
                  additionalProperties: {
                    anyOf: [
                      { type: 'string', minLength: 1, maxLength: 128 },
                      { type: 'number', minimum: -1000000, maximum: 1000000 },
                      { type: 'boolean' },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    encounters: {
      type: 'object', additionalProperties: false, required: ['variants'],
      properties: {
        variants: {
          type: 'object', maxProperties: 128,
          propertyNames: { pattern: '^[a-z][a-z0-9-]{0,63}$' },
          additionalProperties: { type: 'string', pattern: ID_PATTERN },
        },
      },
    },
    starters: {
      type: 'array', maxItems: 32, uniqueItems: true,
      items: { type: 'string', pattern: ID_PATTERN },
    },
    tower: {
      type: 'object', additionalProperties: false, required: ['rotation'],
      properties: {
        rotation: {
          type: 'array', minItems: 1, maxItems: 2048,
          items: { type: 'string', pattern: ID_PATTERN },
        },
      },
    },
    assets: {
      type: 'array', maxItems: 4096,
      items: {
        type: 'object', additionalProperties: false,
        required: ['key', 'path', 'mime', 'kind'],
        properties: {
          key: { type: 'string', pattern: ID_PATTERN },
          path: { type: 'string', pattern: ASSET_PATH_PATTERN, maxLength: 240 },
          mime: { enum: ['image/png', 'image/webp'] },
          kind: { enum: ['launcher', 'creature'] },
        },
      },
    },
    aliases: {
      type: 'object', maxProperties: 4096,
      propertyNames: { pattern: ID_PATTERN },
      additionalProperties: { type: 'string', pattern: ID_PATTERN },
    },
  },
} as const
