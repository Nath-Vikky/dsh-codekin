import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { TraceWildSnapshot } from '../../core/types.ts'
import { createTraceWildConnection } from '../bridge.ts'
import css from './tracewild.module.css'

export type TraceWildSettingsProps = SettingsSectionOwnerProps & PropsLocale<'tracewild'>

/** DSH Settings entry for the persisted Codekin gameplay switch. */
export function TraceWildSettings({ t }: TraceWildSettingsProps) {
  const connection = useMemo(() => createTraceWildConnection(), [])
  const [snapshot, setSnapshot] = useState<TraceWildSnapshot>()
  const [online, setOnline] = useState(true)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [deleteArmed, setDeleteArmed] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const refresh = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
      setSnapshot(await connection.load(signal))
      setOnline(true)
      setFailed(false)
    } catch {
      if (signal?.aborted !== true) {
        setOnline(false)
        setFailed(true)
      }
    }
  }, [connection])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    const unsubscribe = connection.subscribe(setSnapshot, setOnline)
    return () => {
      controller.abort()
      unsubscribe()
    }
  }, [connection, refresh])

  const enabled = snapshot?.state.enabled ?? false
  const toggle = async (): Promise<void> => {
    if (busy || snapshot === undefined) return
    setBusy(true)
    setFailed(false)
    try {
      setSnapshot(await connection.act({ type: 'set-enabled', enabled: !enabled }))
      setOnline(true)
      setDeleted(false)
    } catch {
      setFailed(true)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const clearLocalData = async (): Promise<void> => {
    if (busy || snapshot === undefined || !deleteArmed) return
    setBusy(true)
    setFailed(false)
    try {
      setSnapshot(await connection.clearLocalData())
      setOnline(true)
      setDeleted(true)
      setDeleteArmed(false)
    } catch {
      setFailed(true)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={css.settingsPage} aria-labelledby="codekin-settings-title">
      <header className={css.settingsHero}>
        <img src="/api/tracewild/assets/sprites/codekin-launcher-v1.webp" alt="" draggable={false} />
        <div>
          <p>CODEKIN</p>
          <h2 id="codekin-settings-title">{t('settingsTitle')}</h2>
          <span>{t('settingsDescription')}</span>
        </div>
      </header>

      <div className={css.settingsCard}>
        <div>
          <strong>{t('settingsEnabled')}</strong>
          <span>{t('settingsEnabledHint')}</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={t('settingsEnabled')}
          className={`${css.settingsSwitch} ${enabled ? css.settingsSwitchOn : ''}`}
          disabled={busy || snapshot === undefined || !online}
          onClick={() => { void toggle() }}
        >
          <i aria-hidden="true" />
          <span>{enabled ? t('settingsOn') : t('settingsOff')}</span>
        </button>
      </div>
      <div className={`${css.settingsCard} ${css.settingsStorageCard}`}>
        <div>
          <strong>{t('settingsStorage')}</strong>
          <code>codekinsave/state.json</code>
          <span>{t('settingsStorageHint')}</span>
        </div>
        {deleteArmed
          ? (
              <div className={css.settingsDeleteActions}>
                <button
                  type="button"
                  disabled={busy || snapshot === undefined || !online}
                  onClick={() => { setDeleteArmed(false) }}
                >
                  {t('settingsDeleteCancel')}
                </button>
                <button
                  type="button"
                  className={css.settingsDeleteConfirm}
                  disabled={busy || snapshot === undefined || !online}
                  onClick={() => { void clearLocalData() }}
                >
                  {t('settingsDeleteConfirm')}
                </button>
              </div>
            )
          : (
              <button
                type="button"
                className={css.settingsDeleteButton}
                disabled={busy || snapshot === undefined || !online}
                onClick={() => { setDeleteArmed(true) }}
              >
                {t('settingsDeleteData')}
              </button>
            )}
      </div>

      <p className={failed || !online ? css.settingsError : css.settingsStatus} role="status">
        {failed || !online
          ? t('settingsUnavailable')
          : deleted
            ? t('settingsDeleted')
          : snapshot === undefined
            ? t('settingsLoading')
            : enabled
              ? t('settingsOnHint')
              : t('settingsOffHint')}
      </p>
    </section>
  )
}
