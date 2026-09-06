import { createContext, useContext, useMemo, useState } from 'react'

/**
 * TEIL K.4 — Jeder Screen hat drei Varianten: gefüllt, leer, ladend.
 *
 * Der Zustand wird global umgeschaltet (Design-Panel unten rechts) und von den
 * Screens über useDesignState() gelesen. So lässt sich jede Variante ansehen,
 * ohne echte Daten oder Logik zu brauchen.
 *
 * Zusätzlich steuerbar:
 *  - session: 'guest' | 'user'  → Kopfleiste B.1 oder B.2
 *  - buildBanner: Aufbau-Banner B.5 ein/aus
 *  - cookieBanner: Cookie-Banner ein/aus
 */
const DesignStateContext = createContext(null)

export function DesignStateProvider({ children }) {
  const [state, setState] = useState('filled')
  const [session, setSession] = useState('user')
  const [buildBanner, setBuildBanner] = useState(true)
  const [cookieBanner, setCookieBanner] = useState(false)

  const value = useMemo(
    () => ({
      state,
      setState,
      isEmpty: state === 'empty',
      isLoading: state === 'loading',
      isFilled: state === 'filled',
      session,
      setSession,
      loggedIn: session === 'user',
      buildBanner,
      setBuildBanner,
      cookieBanner,
      setCookieBanner,
    }),
    [state, session, buildBanner, cookieBanner],
  )

  return <DesignStateContext.Provider value={value}>{children}</DesignStateContext.Provider>
}

export function useDesignState() {
  const ctx = useContext(DesignStateContext)
  if (!ctx) throw new Error('useDesignState außerhalb des DesignStateProvider')
  return ctx
}

/**
 * Kleine Hilfe: gibt je nach Zustand eine der drei Varianten zurück.
 *
 *   <Variant loading={<Skelett />} empty={<LeererZustand />}>
 *     …gefüllter Inhalt…
 *   </Variant>
 */
export function Variant({ loading, empty, children }) {
  const { isLoading, isEmpty } = useDesignState()
  if (isLoading && loading !== undefined) return loading
  if (isEmpty && empty !== undefined) return empty
  return children
}

/** Liefert die Liste leer, wenn der Zustand „leer“ aktiv ist. */
export function useData(list) {
  const { isEmpty } = useDesignState()
  return isEmpty ? [] : list
}
