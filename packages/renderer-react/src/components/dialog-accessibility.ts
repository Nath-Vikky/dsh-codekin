import { useCallback, useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, MutableRefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface DialogAccessibility<Element extends HTMLElement> {
  dialogRef: MutableRefObject<Element | null>
  onDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>): void
}

/** Keeps keyboard focus inside a dialog and restores the invoking control. */
export function useDialogAccessibility<Element extends HTMLElement = HTMLElement>(
  dismiss?: () => void,
  dismissalBlocked = false,
): DialogAccessibility<Element> {
  const dialogRef = useRef<Element | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(
    typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog !== null && !dialog.contains(document.activeElement)) {
      const initial = dialog.querySelector<HTMLElement>('[data-dialog-initial-focus], button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
      initial?.focus()
    }
    return () => {
      const target = returnFocusRef.current
      queueMicrotask(() => {
        // React StrictMode temporarily runs effect cleanup while the dialog is
        // still connected. Only restore focus after a real unmount.
        if (dialog?.isConnected === true || target?.isConnected !== true) return
        target.focus()
      })
    }
  }, [])

  const onDialogKeyDown = useCallback((event: ReactKeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Escape' && dismiss !== undefined && !dismissalBlocked) {
      event.preventDefault()
      event.stopPropagation()
      dismiss()
      return
    }
    if (event.key !== 'Tab') return
    const dialog = dialogRef.current
    if (dialog === null) return
    const controls = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      .filter(control => control.getAttribute('aria-hidden') !== 'true')
    if (controls.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }
    const first = controls[0]!
    const last = controls.at(-1)!
    const active = document.activeElement
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault()
      first.focus()
    }
  }, [dismiss, dismissalBlocked])

  return { dialogRef, onDialogKeyDown }
}
