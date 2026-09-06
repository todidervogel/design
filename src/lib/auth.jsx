import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDesignState } from './design-state'

/**
 * Zwei Regeln rund um die Anmeldung:
 *
 * 1. In der App gibt es keinen Gastmodus. Wer nicht angemeldet ist, landet
 *    auf der Anmeldung — nur die Konto-, Rechts- und Fehlerseiten sind offen.
 *
 * 2. Auf der Website darf man sich als Gast umsehen, aber nichts beitragen:
 *    liken, folgen, speichern und hochladen fragen erst nach einem Konto.
 *
 * Wie überall im Prototyp passiert dabei nichts Echtes — die Schranke zeigt
 * einen Dialog beziehungsweise leitet weiter.
 */

/** Ohne Anmeldung erreichbar, auch in der App. */
const OPEN_PATHS = [
  '/anmelden',
  '/registrieren',
  '/passwort-vergessen',
  '/passwort-neu',
  '/gastro',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/agb-gastro',
  '/richtlinien',
  '/cookies',
  '/uebersicht',
  '/404',
  '/500',
  '/403',
  '/offline',
]

/** Beitragen — auf der Website erst nach Anmeldung erreichbar. */
const CONTRIBUTE_PATHS = ['/upload']

const isUnder = (pathname, list) =>
  list.some((p) => pathname === p || pathname.startsWith(`${p}/`))

const AuthGateContext = createContext(null)

export function AuthGateProvider({ children }) {
  const { loggedIn } = useDesignState()
  const [open, setOpen] = useState(false)

  /**
   * Führt die Aktion aus, wenn jemand angemeldet ist — sonst erscheint der
   * Hinweis, dass dafür ein Konto nötig ist.
   *
   *   const requireLogin = useRequireLogin()
   *   <button onClick={requireLogin(() => toast('Gespeichert'))}>…</button>
   */
  const requireLogin = useCallback(
    (action) => (event) => {
      if (loggedIn) return action?.(event)
      event?.preventDefault?.()
      return setOpen(true)
    },
    [loggedIn],
  )

  const value = useMemo(
    () => ({ requireLogin, gateOpen: open, closeGate: () => setOpen(false) }),
    [requireLogin, open],
  )

  return <AuthGateContext.Provider value={value}>{children}</AuthGateContext.Provider>
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext)
  if (!ctx) throw new Error('useAuthGate außerhalb des AuthGateProvider')
  return ctx
}

export function useRequireLogin() {
  return useAuthGate().requireLogin
}

/**
 * Wacht über den Zugang zu den Routen.
 * App ohne Anmeldung → Anmeldung. Website als Gast → Upload gesperrt.
 */
export function RouteGuard({ children }) {
  const { isApp, loggedIn } = useDesignState()
  const { pathname } = useLocation()

  if (loggedIn) return children
  if (isUnder(pathname, OPEN_PATHS)) return children
  if (isApp) return <Navigate to="/anmelden" replace />
  if (isUnder(pathname, CONTRIBUTE_PATHS)) return <Navigate to="/anmelden" replace />

  return children
}
