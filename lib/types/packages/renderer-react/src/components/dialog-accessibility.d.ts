import type { KeyboardEvent as ReactKeyboardEvent, MutableRefObject } from 'react';
export interface DialogAccessibility<Element extends HTMLElement> {
    dialogRef: MutableRefObject<Element | null>;
    onDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>): void;
}
/** Keeps keyboard focus inside a dialog and restores the invoking control. */
export declare function useDialogAccessibility<Element extends HTMLElement = HTMLElement>(dismiss?: () => void, dismissalBlocked?: boolean): DialogAccessibility<Element>;
//# sourceMappingURL=dialog-accessibility.d.ts.map