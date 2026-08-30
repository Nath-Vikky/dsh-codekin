import type { CodekinContentPack, ContentValidationIssue } from './types.ts';
export declare class ContentPackValidationError extends TypeError {
    readonly issues: readonly ContentValidationIssue[];
    constructor(issues: readonly ContentValidationIssue[]);
}
export declare function assertContentPack(value: unknown): asserts value is CodekinContentPack;
export declare function contentPackIssues(value: unknown): readonly ContentValidationIssue[];
//# sourceMappingURL=validation.d.ts.map