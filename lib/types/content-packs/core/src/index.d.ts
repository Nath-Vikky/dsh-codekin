export * from './catalog.ts';
export * from './skills.ts';
export * from './mechanics.ts';
export declare const CORE_CONTENT_PACK: {
    readonly manifest: {
        readonly id: "@nath-vikky/codekin-core";
        readonly version: "0.3.2";
        readonly engine: ">=0.3.2 <0.4.0";
        readonly contentApi: 1;
    };
    readonly ecologies: {
        id: "lumen" | "forge" | "relay" | "aegis" | "glitch";
        order: number;
        name: {
            readonly zhCN: "智算";
            readonly en: "Compute";
        } | {
            readonly zhCN: "编译";
            readonly en: "Compile";
        } | {
            readonly zhCN: "网络";
            readonly en: "Network";
        } | {
            readonly zhCN: "防护";
            readonly en: "Guard";
        } | {
            readonly zhCN: "异常";
            readonly en: "Glitch";
        };
        tileRole: "sync" | "overclock" | "guard" | "repair" | "breach";
    }[];
    readonly qualities: {
        id: "pebble" | "pulse" | "prism" | "nova" | "origin";
        order: number;
        name: {
            readonly zhCN: "砾石";
            readonly en: "Pebble";
        } | {
            readonly zhCN: "脉冲";
            readonly en: "Pulse";
        } | {
            readonly zhCN: "棱镜";
            readonly en: "Prism";
        } | {
            readonly zhCN: "新星";
            readonly en: "Nova";
        } | {
            readonly zhCN: "源初";
            readonly en: "Origin";
        };
    }[];
    readonly creatures: {
        number: number;
        id: string;
        name: {
            zhCN: string;
            en: string;
        };
        ecology: "lumen" | "forge" | "relay" | "aegis" | "glitch";
        rarity: import("../../../src/core-runtime.ts").TraceRarity;
        combatRole: string;
        baseCaptureRate: number;
        signatureProtocol: string;
        sprite: string;
        stats: import("../../../src/core-runtime.ts").CreatureStats;
    }[];
    readonly skills: {
        creatureId: string;
        energyCost: number;
        passive: {
            name: {
                zhCN: string;
                en: string;
            };
            description: {
                zhCN: string;
                en: string;
            };
        };
        active: {
            name: {
                zhCN: string;
                en: string;
            };
            description: {
                zhCN: string;
                en: string;
            };
        };
    }[];
    readonly mechanics: readonly import("../../../packages/content-sdk/src/types.ts").ContentCreatureMechanicsDefinition[];
    readonly encounters: {
        readonly variants: Readonly<Record<string, string>>;
    };
    readonly starters: readonly ["lumen-indeximp", "forge-sparkmite", "aegis-veribud"];
    readonly tower: {
        readonly rotation: string[];
    };
    readonly assets: readonly [{
        readonly key: "launcher:default";
        readonly path: "sprites/codekin-launcher-v1.webp";
        readonly mime: "image/webp";
        readonly kind: "launcher";
    }, ...{
        key: string;
        path: string;
        mime: "image/webp";
        kind: "creature";
    }[]];
};
//# sourceMappingURL=index.d.ts.map