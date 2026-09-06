import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'

/**
 * Globaler Zustand des Prototyps.
 *
 * TEIL K.4 — Jeder Screen hat drei Varianten: gefüllt, leer, ladend.
 *
 * Zusätzlich steuerbar (alles über das Design-Panel umschaltbar, damit sich
 * jede Kombination ansehen lässt, ohne etwas neu zu bauen):
 *
 *  - platform: 'web' | 'app'   Website im Browser oder verpackte App
 *  - device:   'mobile' | 'desktop'
 *  - session:  'guest' | 'user'
 *  - theme:    'light' | 'dark' | 'auto'   (Dunkelmodus gibt es nur in der App)
 *  - buildBanner / cookieBanner
 */
const DesignStateContext = createContext(null)

/** Läuft der Code in der verpackten App oder im Browser? */
function detectPlatform() {
  try {
    return Capacitor.isNativePlatform() ? 'app' : 'web'
  } catch {
    return 'web'
  }
}

/**
 * Handy oder Rechner? Auf der Website macht das einen Unterschied:
 * Mobil gibt es die untere Navigationsleiste, am Rechner die Kopfleiste.
 */
function detectDevice() {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent || ''
  const mobileOs = /Android|iPhone|iPad|iPod/i.test(ua)
  const narrow = window.matchMedia('(max-width: 1023px)').matches
  const touch = window.matchMedia('(pointer: coarse)').matches
  return mobileOs || (narrow && touch) || narrow ? 'mobile' : 'desktop'
}

function detectOs() {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent || ''
  if (/Android/i.test(ua)) return 'android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  return 'desktop'
}

/**
 * Die Einstellungen des Design-Panels überleben ein Neuladen — sonst fällt
 * jeder direkt geöffnete Link zurück auf „Website, Gast, hell".
 */
const STORE_KEY = 'design-panel'

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeStore(value) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value))
  } catch {
    /* Privater Modus o. Ä. — dann eben ohne Gedächtnis. */
  }
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function DesignStateProvider({ children }) {
  const stored = readStore()

  const [state, setState] = useState(stored.state ?? 'filled')
  // In der verpackten App steht das Ziel fest, im Browser ist es umschaltbar.
  const [platform, setPlatform] = useState(
    detectPlatform() === 'app' ? 'app' : stored.platform ?? 'web',
  )
  const [device, setDevice] = useState(detectDevice)
  const [os] = useState(detectOs)
  const [buildBanner, setBuildBanner] = useState(stored.buildBanner ?? true)
  const [cookieBanner, setCookieBanner] = useState(stored.cookieBanner ?? false)
  const [theme, setTheme] = useState(stored.theme ?? 'auto')
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  // In der App gibt es keinen Gastmodus: Wer nicht angemeldet ist, landet auf
  // der Anmeldung. Die App startet deshalb abgemeldet, die Website als Gast.
  const [session, setSession] = useState(stored.session ?? 'guest')

  useEffect(() => {
    writeStore({ state, platform, session, theme, buildBanner, cookieBanner })
  }, [state, platform, session, theme, buildBanner, cookieBanner])

  // Breite mitverfolgen, damit sich das Design-Panel beim Drehen richtig verhält
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const onChange = () => setDevice(detectDevice())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /**
   * Der Dunkelmodus gehört zur App. Die Website bleibt hell — so steht es
   * im Farbteil der Spezifikation, und dort wäre er auch nicht angefragt.
   */
  const darkMode = platform === 'app' && (theme === 'dark' || (theme === 'auto' && systemDark))

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const value = useMemo(
    () => ({
      state,
      setState,
      isEmpty: state === 'empty',
      isLoading: state === 'loading',
      isFilled: state === 'filled',

      platform,
      setPlatform,
      isApp: platform === 'app',
      isWeb: platform === 'web',

      device,
      setDevice,
      isMobile: device === 'mobile',
      isDesktop: device === 'desktop',
      os,

      session,
      setSession,
      loggedIn: session === 'user',

      theme,
      setTheme,
      darkMode,

      buildBanner,
      setBuildBanner,
      cookieBanner,
      setCookieBanner,
    }),
    [state, platform, device, os, session, theme, darkMode, buildBanner, cookieBanner],
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
