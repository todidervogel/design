import { useCallback, useEffect, useRef, useState } from 'react'
import { getDb, subscribe } from './db'
import api from './api'

export { default as api } from './api'
export * from './geo'
export * from './hours'
export { getDb, resetDb, subscribe } from './db'
export { decoratePlace, decorateReview, decorateVideo, publicUser, ratingOf } from './api'

/**
 * Zählt jede Änderung an der Datenhaltung mit. Abfragen hängen daran und
 * holen sich neue Daten, sobald irgendwo geschrieben wurde.
 */
let version = 0
subscribe(() => { version += 1 })

export function useDbVersion() {
  const [, force] = useState(0)
  useEffect(() => subscribe(() => force((n) => n + 1)), [])
  return version
}

/**
 * Eine Abfrage gegen die Fassade.
 *
 *   const { data, loading } = useQuery(() => api.places.list({ radiusKm }), [radiusKm])
 *
 * Beim ersten Aufruf gibt es einen echten Ladezustand. Läuft die Abfrage
 * später wegen einer Änderung erneut, bleibt der alte Inhalt stehen und es
 * wird nur still nachgeladen — sonst würde die Seite bei jedem Klick blinken.
 */
export function useQuery(runner, deps = [], { initial = null, enabled = true } = {}) {
  const dbVersion = useDbVersion()
  const [state, setState] = useState({ data: initial, loading: enabled, error: null, refreshing: false })
  const hasData = useRef(false)
  const runnerRef = useRef(runner)
  runnerRef.current = runner

  const run = useCallback(() => {
    if (!enabled) {
      setState({ data: initial, loading: false, error: null, refreshing: false })
      return undefined
    }
    let cancelled = false
    setState((s) => (hasData.current
      ? { ...s, refreshing: true }
      : { data: initial, loading: true, error: null, refreshing: false }))

    Promise.resolve()
      .then(() => runnerRef.current())
      .then((data) => {
        if (cancelled) return
        hasData.current = true
        setState({ data, loading: false, error: null, refreshing: false })
      })
      .catch((error) => {
        if (cancelled) return
        setState({ data: initial, loading: false, error, refreshing: false })
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])

  useEffect(() => run(), [run, dbVersion])

  return { ...state, reload: run }
}

/**
 * Eine Änderung. Kümmert sich um den „läuft gerade"-Zustand, damit Buttons
 * währenddessen gesperrt werden können.
 *
 *   const [speichern, läuft] = useMutation((werte) => api.places.save(id, werte))
 */
export function useMutation(fn, { onSuccess, onError } = {}) {
  const [busy, setBusy] = useState(false)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async (...args) => {
    setBusy(true)
    try {
      const result = await fnRef.current(...args)
      onSuccess?.(result)
      return result
    } catch (error) {
      onError?.(error)
      return undefined
    } finally {
      setBusy(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [run, busy]
}

/** Direkter, synchroner Blick in die Datenhaltung — für kleine Abfragen. */
export function useDbValue(selector) {
  useDbVersion()
  return selector(getDb())
}

export { api as default }
