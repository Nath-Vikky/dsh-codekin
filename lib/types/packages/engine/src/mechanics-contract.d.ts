import type { ContentCreatureMechanicsDefinition, ContentMechanicTrigger, ContentValidationIssue } from '../../content-sdk/src/types.ts';
type ParameterKind = 'string' | 'number' | 'boolean';
interface OpcodeContract {
    trigger: ContentMechanicTrigger;
    required: Readonly<Record<string, ParameterKind>>;
    optional: Readonly<Record<string, ParameterKind>>;
}
export declare const CODEKIN_MECHANIC_CONTRACTS: Readonly<Record<string, OpcodeContract>>;
export declare const CODEKIN_MECHANIC_OPCODES: readonly string[];
export declare function mechanicsContractIssues(definitions: readonly ContentCreatureMechanicsDefinition[]): readonly ContentValidationIssue[];
export declare class MechanicsContractError extends TypeError {
    readonly issues: readonly ContentValidationIssue[];
    constructor(issues: readonly ContentValidationIssue[]);
}
export declare function assertMechanicsContract(definitions: readonly ContentCreatureMechanicsDefinition[]): void;
export {};
//# sourceMappingURL=mechanics-contract.d.ts.map