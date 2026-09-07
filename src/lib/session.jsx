import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getDb, insert, nextId, patch, subscribe } from './store/db'
import { publicUser } from './store/api'
import { t } from '../i18n'

/**
 * Anmeldung und Sitzung.
 *
 * Die Prüfung läuft gegen die lokale Datenhaltung — an derselben Stelle
 * hängt später Supabase Auth. Nach außen sieht das gleich aus: anmelden,
 * abmelden, aktuelles Konto, Rolle.
 */

const KEY = 'app-session'
const SessionContext = createContext(null)

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(KEY))
  } catch {
    return null
  }
}

function writeStored(value) {
  try {
    if (value) localStorage.setItem(KEY, JSON.stringify(value))
    else localStorage.removeItem(KEY)
  } catch {
    /* Ohne Speicher endet die Sitzung eben beim Neuladen. */
  }
}

export function SessionProvider({ children }) {
  const [userId, setUserId] = useState(() => readStored()?.userId ?? null)
  /* Zwischenschritt der Registrierung (D.1 → D.2) und des Passwortwechsels (F.2). */
  const [pending, setPending] = useState(null)
  const [, force] = useState(0)

  useEffect(() => subscribe(() => force((n) => n + 1)), [])
  useEffect(() => { writeStored(userId ? { userId } : null) }, [userId])

  const db = getDb()
  const record = userId ? db.users.find((u) => u.id === userId) : null
  /* Konto zwischenzeitlich gelöscht oder gesperrt? Dann ist die Sitzung vorbei. */
  useEffect(() => {
    if (userId && !record) setUserId(null)
  }, [userId, record])

  const login = useCallback((identifier, password) => {
    const value = identifier.trim().toLowerCase()
    const found = getDb().users.find(
      (u) => u.email.toLowerCase() === value || u.username.toLowerCase() === value.replace(/^@/, ''),
    )
    if (!found) return { ok: false, error: t('auth.errors.unknownAccount') }
    if (found.password !== password) return { ok: false, error: t('auth.errors.wrongPassword') }
    if (found.status === 'banned') return { ok: false, error: t('auth.errors.blocked') }
    setUserId(found.id)
    return { ok: true, user: found, mustChangePassword: !!found.mustChangePassword }
  }, [])

  const logout = useCallback(() => {
    setUserId(null)
    setPending(null)
  }, [])

  /** Registrierung Schritt 1 — das Konto entsteht erst nach dem Code (D.2). */
  const startRegistration = useCallback((data) => {
    const existing = getDb().users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase() || u.username.toLowerCase() === data.username.toLowerCase(),
    )
    if (existing) return { ok: false, error: t('auth.errors.accountExists') }
    /* Der Code steht im Prototyp fest — echte SMS gibt es hier nicht. */
    setPending({ ...data, code: '123456' })
    return { ok: true }
  }, [])

  const confirmRegistration = useCallback((code) => {
    if (!pending) return { ok: false, error: t('auth.errors.noPendingRegistration') }
    if (code.replace(/\s/g, '') !== pending.code) return { ok: false, error: t('auth.errors.wrongCode') }
    const user = {
      id: nextId('users', 'u'),
      username: pending.username,
      name: pending.name || pending.username,
      email: pending.email,
      phone: pending.phone,
      password: pending.password,
      role: 'user',
      private: true,
      joined: new Date().toISOString().slice(0, 10),
      bio: '',
      radius: 5,
      status: 'active',
      reportCount: 0,
      notify: { follows: true, likes: true, replies: true, moderation: true },
    }
    insert('users', user)
    setPending(null)
    setUserId(user.id)
    return { ok: true, user }
  }, [pending])

  const changePassword = useCallback((newPassword) => {
    if (!userId) return { ok: false }
    patch('users', userId, { password: newPassword, mustChangePassword: false })
    return { ok: true }
  }, [userId])

  const updateMe = useCallback((changes) => {
    if (!userId) return
    patch('users', userId, changes)
  }, [userId])

  const value = useMemo(() => {
    const user = record ? publicUser(record, db) : null
    return {
      user,
      userId: record?.id ?? null,
      loggedIn: !!record,
      role: record?.role ?? 'guest',
      isGastro: record?.role === 'gastro',
      isAdmin: record?.role === 'admin',
      placeId: record?.placeId ?? null,
      mustChangePassword: !!record?.mustChangePassword,
      pendingRegistration: pending,
      login, logout, startRegistration, confirmRegistration, changePassword, updateMe,
      /* Nur für das Design-Panel: ohne Formular in eine Rolle springen. */
      switchTo: setUserId,
    }
  }, [record, db, pending, login, logout, startRegistration, confirmRegistration, changePassword, updateMe])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession außerhalb des SessionProvider')
  return ctx
}
