/**
 * Die Datenhaltung des Prototyps.
 *
 * Ein einziger Zustandsbaum, der im Browser gespeichert wird. Er verhält sich
 * nach außen wie eine Datenbank: lesen, schreiben, benachrichtigen. Genau das
 * macht später der Server — deshalb greift kein Screen direkt hierauf zu,
 * sondern immer über die Fassade in `api.js`.
 */
import { initialDatabase } from '../../data/seed'

const KEY = 'app-db'
const VERSION = 3

let db = load()
const listeners = new Set()

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw?.version === VERSION && raw.data) return raw.data
  } catch {
    /* Kaputter oder alter Stand — dann eben von vorn. */
  }
  return initialDatabase()
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, data: db }))
  } catch {
    /* Privater Modus oder voller Speicher: der Stand lebt dann nur bis zum Neuladen. */
  }
}

/** Aktueller Stand. Nur lesen — Änderungen laufen über `update`. */
export const getDb = () => db

/** Beobachter für React. Gibt die Abmeldefunktion zurück. */
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function emit() {
  persist()
  listeners.forEach((fn) => fn(db))
}

/** Ändert den Baum. `fn` bekommt den alten Stand und liefert die Änderungen. */
export function update(fn) {
  const patch = fn(db)
  if (!patch) return db
  db = { ...db, ...patch }
  emit()
  return db
}

/** Hängt einen Datensatz an eine Tabelle an. */
export function insert(table, row) {
  update((d) => ({ [table]: [row, ...(d[table] ?? [])] }))
  return row
}

/** Ändert einen Datensatz anhand seiner id. */
export function patch(table, id, changes) {
  update((d) => ({
    [table]: (d[table] ?? []).map((row) =>
      row.id === id ? { ...row, ...(typeof changes === 'function' ? changes(row) : changes) } : row,
    ),
  }))
}

/** Entfernt Datensätze. */
export function remove(table, predicate) {
  update((d) => ({ [table]: (d[table] ?? []).filter((row) => !predicate(row)) }))
}

/** Setzt alles auf den Auslieferungsstand zurück. */
export function resetDb() {
  db = initialDatabase()
  emit()
}

/** Fortlaufende, aber lesbare Kennungen: „v11", „r9", … */
export function nextId(table, prefix) {
  const rows = db[table] ?? []
  const numbers = rows
    .map((r) => Number(String(r.id).replace(/\D/g, '')))
    .filter((n) => Number.isFinite(n))
  return `${prefix}${(numbers.length ? Math.max(...numbers) : 0) + 1}`
}
