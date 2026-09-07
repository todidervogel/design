/**
 * Fassade vor der Datenhaltung.
 *
 * Das Konzept verlangt, dass jeder externe Dienst hinter einer eigenen Schicht
 * liegt, damit ein Wechsel (hier: auf Supabase) den Rest des Codes nicht
 * anfasst. Deshalb kennen die Screens nur diese Datei: Funktionen, die ein
 * Versprechen zurückgeben, so wie es ein Server täte.
 *
 * Absichtlich mit kleiner Verzögerung — sonst gäbe es keine Ladezustände zu
 * sehen, und genau die sollen im Entwurf ja stimmen.
 */
import { getDb, insert, nextId, patch, remove, update } from './db'
import { distanceKm, formatDistance } from './geo'
import { openLabel } from './hours'
import { HOME_POSITION } from '../../data/seed'

const LATENCY = Number(import.meta.env?.VITE_LATENCY ?? 220)

const wait = (value) =>
  new Promise((resolve) => {
    if (LATENCY <= 0) resolve(value)
    else setTimeout(() => resolve(value), LATENCY * (0.6 + Math.random() * 0.8))
  })

const today = () => new Date().toISOString().slice(0, 10)
const nowIso = () => new Date().toISOString().slice(0, 19)

/* ==========================================================================
   Ableitungen — das, was auf dem Server eine Sicht („View") wäre
   ========================================================================== */

const avg = (values) => {
  const list = values.filter((v) => typeof v === 'number')
  return list.length ? list.reduce((a, b) => a + b, 0) / list.length : null
}

/** Durchschnitt der drei Achsen, getrennt gehalten (Design-Grundsatz A.6). */
export function ratingOf(placeId, db = getDb()) {
  const list = db.reviews.filter((r) => r.placeId === placeId)
  if (list.length === 0) return { rating: null, reviewCount: 0 }
  return {
    reviewCount: list.length,
    rating: {
      food: avg(list.map((r) => r.ratingFood)),
      service: avg(list.map((r) => r.ratingService)),
      price: avg(list.map((r) => r.ratingPrice)),
    },
  }
}

/** Bewertung eines einzelnen Gerichts über alle Bewertungen hinweg. */
export function dishRatingOf(dishId, db = getDb()) {
  const marks = db.reviews
    .flatMap((r) => r.dishes ?? [])
    .filter((d) => d.dishId === dishId && typeof d.rating === 'number')
    .map((d) => d.rating)
  return { rating: avg(marks), ratingCount: marks.length }
}

/** Hängt an einen Betrieb alles, was sich aus anderen Tabellen ergibt. */
export function decoratePlace(place, { position = HOME_POSITION, db = getDb() } = {}) {
  const km = distanceKm(position, place)
  const published = db.videos.filter(
    (v) => v.placeId === place.id && v.status === 'published' && v.visibility === 'public',
  )
  return {
    ...place,
    ...ratingOf(place.id, db),
    distanceKm: km,
    distance: formatDistance(km),
    videoCount: published.length,
    ...openLabel(place.hours),
    openText: openLabel(place.hours).text,
    verified: place.claimStatus === 'verified',
  }
}

export function decorateVideo(video, { position, db = getDb() } = {}) {
  const place = db.places.find((p) => p.id === video.placeId)
  const author = db.users.find((u) => u.id === video.authorId)
  return {
    ...video,
    place: place ? decoratePlace(place, { position, db }) : null,
    author: author ? publicUser(author) : null,
    review: db.reviews.find((r) => r.videoId === video.id) ?? null,
    likeCount: db.likes.filter((l) => l.videoId === video.id).length,
  }
}

export function decorateReview(review, db = getDb()) {
  const author = db.users.find((u) => u.id === review.authorId)
  const place = db.places.find((p) => p.id === review.placeId)
  return {
    ...review,
    author: author ? publicUser(author) : null,
    placeName: place?.name,
    placeSlug: place?.slug,
    rating: { food: review.ratingFood, service: review.ratingService, price: review.ratingPrice },
  }
}

/** Was von einem Konto öffentlich sichtbar ist — nie das Passwort. */
export function publicUser(user, db = getDb()) {
  if (!user) return null
  const { password, ...rest } = user
  return {
    ...rest,
    videoCount: db.videos.filter((v) => v.authorId === user.id && v.status === 'published').length,
    reviewCount: db.reviews.filter((r) => r.authorId === user.id).length,
    followerCount: db.follows.filter((f) => f.followingId === user.id && f.status === 'accepted').length,
    followingCount: db.follows.filter((f) => f.followerId === user.id && f.status === 'accepted').length,
  }
}

/* ==========================================================================
   Betriebe
   ========================================================================== */
const PRICE_ORDER = ['€', '€€', '€€€', '€€€€']

function filterPlaces(list, f, db) {
  let out = list
  if (f.query) {
    const q = f.query.toLowerCase()
    out = out.filter((p) =>
      [p.name, p.cuisine, p.address, p.city, ...(p.tags ?? [])].join(' ').toLowerCase().includes(q))
  }
  if (f.categories?.length) out = out.filter((p) => f.categories.includes(p.category))
  if (f.serving?.length) out = out.filter((p) => f.serving.every((s) => p.serving?.includes(s)))
  if (f.prices?.length) out = out.filter((p) => f.prices.includes(p.price))
  if (f.openNow) out = out.filter((p) => p.open)
  if (f.onlyVideos) out = out.filter((p) => p.videoCount > 0)
  if (f.minRating) out = out.filter((p) => (p.rating?.food ?? 0) >= f.minRating)
  if (f.radiusKm) out = out.filter((p) => p.distanceKm == null || p.distanceKm <= f.radiusKm)
  return out
}

function sortPlaces(list, sort) {
  const copy = [...list]
  if (sort === 'rating') return copy.sort((a, b) => (b.rating?.food ?? 0) - (a.rating?.food ?? 0))
  if (sort === 'videos') return copy.sort((a, b) => b.videoCount - a.videoCount)
  if (sort === 'priceAsc') return copy.sort((a, b) => PRICE_ORDER.indexOf(a.price) - PRICE_ORDER.indexOf(b.price))
  return copy.sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9))
}

export const places = {
  list(filters = {}) {
    const db = getDb()
    const position = filters.position ?? HOME_POSITION
    const all = db.places
      .filter((p) => p.status !== 'archived')
      .map((p) => decoratePlace(p, { position, db }))
    return wait(sortPlaces(filterPlaces(all, filters, db), filters.sort))
  },

  bySlug(slug, position) {
    const db = getDb()
    const place = db.places.find((p) => p.slug === slug)
    return wait(place ? decoratePlace(place, { position, db }) : null)
  },

  byId(id, position) {
    const db = getDb()
    const place = db.places.find((p) => p.id === id)
    return wait(place ? decoratePlace(place, { position, db }) : null)
  },

  /** Nächstgelegene Betriebe — für die Betriebswahl beim Hochladen (E.3). */
  nearby(position = HOME_POSITION, limit = 8) {
    const db = getDb()
    const all = db.places.map((p) => decoratePlace(p, { position, db }))
    return wait(sortPlaces(all, 'distance').slice(0, limit))
  },

  save(id, changes) {
    patch('places', id, changes)
    return wait(true)
  },

  setStatus(id, status) {
    patch('places', id, { status, closingSince: status === 'closing' ? today() : null })
    return wait(true)
  },
}

/* ==========================================================================
   Speisekarte
   ========================================================================== */
export const menu = {
  get(placeId) {
    const db = getDb()
    const cats = db.menuCategories
      .filter((c) => c.placeId === placeId)
      .sort((a, b) => a.sort - b.sort)
      .map((c) => ({
        ...c,
        items: db.dishes
          .filter((d) => d.categoryId === c.id)
          .sort((a, b) => a.sort - b.sort)
          .map((d) => ({ ...d, ...dishRatingOf(d.id, db) })),
      }))
    return wait(cats)
  },

  /** Flache Liste aller Gerichte eines Betriebs — für Bewertung und Suche. */
  dishes(placeId) {
    const db = getDb()
    return wait(db.dishes.filter((d) => d.placeId === placeId).map((d) => ({ ...d, ...dishRatingOf(d.id, db) })))
  },

  addCategory(placeId, name) {
    const db = getDb()
    const sort = db.menuCategories.filter((c) => c.placeId === placeId).length
    const row = { id: nextId('menuCategories', 'mc'), placeId, name, description: '', sort }
    update((d) => ({ menuCategories: [...d.menuCategories, row] }))
    return wait(row)
  },

  updateCategory(id, changes) {
    patch('menuCategories', id, changes)
    return wait(true)
  },

  removeCategory(id) {
    remove('dishes', (d) => d.categoryId === id)
    remove('menuCategories', (c) => c.id === id)
    return wait(true)
  },

  moveCategory(id, direction) {
    update((d) => {
      const cat = d.menuCategories.find((c) => c.id === id)
      if (!cat) return null
      const siblings = d.menuCategories.filter((c) => c.placeId === cat.placeId).sort((a, b) => a.sort - b.sort)
      const index = siblings.findIndex((c) => c.id === id)
      const target = index + direction
      if (target < 0 || target >= siblings.length) return null
      const swapped = [...siblings]
      ;[swapped[index], swapped[target]] = [swapped[target], swapped[index]]
      const order = new Map(swapped.map((c, i) => [c.id, i]))
      return {
        menuCategories: d.menuCategories.map((c) => (order.has(c.id) ? { ...c, sort: order.get(c.id) } : c)),
      }
    })
    return wait(true)
  },

  addDish(placeId, categoryId, dish) {
    const db = getDb()
    const sort = db.dishes.filter((d) => d.categoryId === categoryId).length
    const row = {
      id: nextId('dishes', 'd'), placeId, categoryId, sort,
      name: '', description: '', priceCents: 0, diet: [], allergens: [],
      spicy: 0, popular: false, available: true, confirmed: true, ...dish,
    }
    update((d) => ({ dishes: [...d.dishes, row] }))
    return wait(row)
  },

  updateDish(id, changes) {
    patch('dishes', id, changes)
    return wait(true)
  },

  removeDish(id) {
    remove('dishes', (d) => d.id === id)
    return wait(true)
  },
}

/* ==========================================================================
   Videos
   ========================================================================== */
export const videos = {
  /**
   * Feed-Reihenfolge nach Konzept 8.4: Umkreis, dann eine Mischung aus
   * Aktualität, vorhandener Bewertung und Ortsprüfung. Gesehenes rutscht
   * ans Ende, eine kleine Zufallskomponente verhindert Stillstand.
   */
  feed({ position = HOME_POSITION, radiusKm = 5, userId, seed = 1 } = {}) {
    const db = getDb()
    const seen = new Set(db.seenVideos ?? [])
    const scored = db.videos
      .filter((v) => v.status === 'published')
      .filter((v) => v.visibility === 'public' || v.authorId === userId)
      .map((v) => decorateVideo(v, { position, db }))
      .filter((v) => v.place && (v.place.distanceKm ?? 0) <= radiusKm)
      .map((v) => {
        const age = (Date.now() - new Date(v.createdAt).getTime()) / 86400000
        const score =
          100 - age * 2 +
          (v.review ? 25 : 0) +
          (v.verifiedOnSite ? 15 : 0) +
          ((Math.sin((Number(v.id.replace(/\D/g, '')) + seed) * 12.9898) + 1) * 5) -
          (seen.has(v.id) ? 1000 : 0)
        return { ...v, score }
      })
      .sort((a, b) => b.score - a.score)

    const widened = scored.length < 5 && radiusKm < 50
    return wait({ items: scored, widened, radiusKm })
  },

  byId(id, position) {
    const db = getDb()
    const v = db.videos.find((x) => x.id === id)
    return wait(v ? decorateVideo(v, { position, db }) : null)
  },

  byPlace(placeId, { includeAll = false } = {}) {
    const db = getDb()
    return wait(
      db.videos
        .filter((v) => v.placeId === placeId)
        .filter((v) => includeAll || (v.status === 'published' && v.visibility === 'public'))
        .map((v) => decorateVideo(v, { db })),
    )
  },

  byAuthor(authorId, { own = false } = {}) {
    const db = getDb()
    return wait(
      db.videos
        .filter((v) => v.authorId === authorId)
        .filter((v) => own || (v.status === 'published' && v.visibility === 'public'))
        .map((v) => decorateVideo(v, { db })),
    )
  },

  /** Warteschlange der Freigabe (G.3). */
  pending() {
    const db = getDb()
    return wait(db.videos.filter((v) => v.status === 'pending_review').map((v) => decorateVideo(v, { db })))
  },

  create(data) {
    const id = nextId('videos', 'v')
    const row = {
      id, views: 0, verifiedOnSite: false, visibility: 'public',
      status: 'pending_review', authorType: 'user', createdAt: today(), ...data,
    }
    insert('videos', row)
    return wait(row)
  },

  moderate(id, status, reason) {
    patch('videos', id, { status, rejectReason: reason ?? null })
    const db = getDb()
    const video = db.videos.find((v) => v.id === id)
    if (video) {
      notifications.create({
        userId: video.authorId,
        type: status === 'published' ? 'approved' : 'rejected',
        text: status === 'published'
          ? 'Dein Video wurde freigegeben und ist jetzt sichtbar.'
          : 'Dein Video wurde nicht freigegeben.',
      })
    }
    admin.log(status === 'published' ? 'Video freigegeben' : 'Video abgelehnt', id, reason ?? '')
    return wait(true)
  },

  setVisibility(id, visibility) {
    patch('videos', id, { visibility })
    return wait(true)
  },

  remove(id) {
    remove('videos', (v) => v.id === id)
    remove('reviews', (r) => r.videoId === id)
    return wait(true)
  },

  markSeen(id) {
    update((d) => (d.seenVideos?.includes(id) ? null : { seenVideos: [...(d.seenVideos ?? []), id] }))
    return true
  },
}

/* ==========================================================================
   Bewertungen
   ========================================================================== */
export const reviews = {
  byPlace(placeId, { filter = 'all' } = {}) {
    const db = getDb()
    let list = db.reviews.filter((r) => r.placeId === placeId)
    if (filter === 'withVideo') list = list.filter((r) => r.videoId)
    if (filter === 'verified') list = list.filter((r) => r.verifiedOnSite)
    return wait(list.map((r) => decorateReview(r, db)))
  },

  byAuthor(authorId) {
    const db = getDb()
    return wait(db.reviews.filter((r) => r.authorId === authorId).map((r) => decorateReview(r, db)))
  },

  create(data) {
    const row = {
      id: nextId('reviews', 'r'), createdAt: today(), likes: 0, answer: null,
      dishes: [], verifiedOnSite: false, ...data,
    }
    insert('reviews', row)
    return wait(row)
  },

  answer(id, text) {
    patch('reviews', id, { answer: { text, createdAt: today() } })
    const db = getDb()
    const review = db.reviews.find((r) => r.id === id)
    const place = db.places.find((p) => p.id === review?.placeId)
    if (review) {
      notifications.create({
        userId: review.authorId, type: 'reply', actor: place?.name,
        text: 'hat auf deine Bewertung geantwortet.',
      })
    }
    return wait(true)
  },

  like(id) {
    patch('reviews', id, (r) => ({ likes: (r.likes ?? 0) + 1 }))
    return wait(true)
  },
}

/* ==========================================================================
   Soziales — Gefällt mir, Gespeichertes, Folgen
   ========================================================================== */
export const social = {
  isLiked(userId, videoId) {
    return getDb().likes.some((l) => l.userId === userId && l.videoId === videoId)
  },

  toggleLike(userId, videoId) {
    const liked = social.isLiked(userId, videoId)
    if (liked) remove('likes', (l) => l.userId === userId && l.videoId === videoId)
    else insert('likes', { userId, videoId })
    return !liked
  },

  isSaved(userId, type, targetId) {
    return getDb().saves.some((s) => s.userId === userId && s.type === type && s.targetId === targetId)
  },

  toggleSave(userId, type, targetId) {
    const saved = social.isSaved(userId, type, targetId)
    if (saved) remove('saves', (s) => s.userId === userId && s.type === type && s.targetId === targetId)
    else insert('saves', { userId, type, targetId })
    return !saved
  },

  saved(userId, type) {
    const db = getDb()
    const ids = db.saves.filter((s) => s.userId === userId && s.type === type).map((s) => s.targetId)
    if (type === 'place') {
      return wait(db.places.filter((p) => ids.includes(p.id)).map((p) => decoratePlace(p, { db })))
    }
    return wait(db.videos.filter((v) => ids.includes(v.id)).map((v) => decorateVideo(v, { db })))
  },

  followState(userId, targetId) {
    const row = getDb().follows.find((f) => f.followerId === userId && f.followingId === targetId)
    return row?.status ?? 'none'
  },

  toggleFollow(userId, targetId) {
    const db = getDb()
    const current = social.followState(userId, targetId)
    if (current !== 'none') {
      remove('follows', (f) => f.followerId === userId && f.followingId === targetId)
      return 'none'
    }
    const target = db.users.find((u) => u.id === targetId)
    const status = target?.private ? 'pending' : 'accepted'
    insert('follows', { followerId: userId, followingId: targetId, status })
    if (status === 'accepted') {
      const me = db.users.find((u) => u.id === userId)
      notifications.create({ userId: targetId, type: 'follow', actor: me?.username, text: 'folgt dir jetzt.' })
    }
    return status
  },
}

/* ==========================================================================
   Nutzer
   ========================================================================== */
export const users = {
  byUsername(username) {
    const db = getDb()
    const u = db.users.find((x) => x.username === username)
    return wait(u ? publicUser(u, db) : null)
  },

  byId(id) {
    const db = getDb()
    const u = db.users.find((x) => x.id === id)
    return wait(u ? publicUser(u, db) : null)
  },

  save(id, changes) {
    patch('users', id, changes)
    return wait(true)
  },

  setStatus(id, status) {
    patch('users', id, { status })
    admin.log(status === 'banned' ? 'Nutzer gesperrt' : status === 'warned' ? 'Nutzer verwarnt' : 'Sperre aufgehoben', id, '')
    return wait(true)
  },

  /** Auskunft nach Art. 15/20 DSGVO — alles, was zu diesem Konto gehört. */
  exportData(id) {
    const db = getDb()
    const user = db.users.find((u) => u.id === id)
    if (!user) return wait(null)
    const { password, ...profile } = user
    return wait({
      exportiertAm: nowIso(),
      profil: profile,
      videos: db.videos.filter((v) => v.authorId === id),
      bewertungen: db.reviews.filter((r) => r.authorId === id),
      gefaelltMir: db.likes.filter((l) => l.userId === id),
      gespeichert: db.saves.filter((s) => s.userId === id),
      folgt: db.follows.filter((f) => f.followerId === id),
      folgen: db.follows.filter((f) => f.followingId === id),
    })
  },

  /**
   * Löschung nach Art. 17: Profil und Videos verschwinden, Bewertungen
   * bleiben anonym erhalten — sonst verfälschen sich die Durchschnitte.
   */
  deleteAccount(id) {
    remove('videos', (v) => v.authorId === id)
    remove('likes', (l) => l.userId === id)
    remove('saves', (s) => s.userId === id)
    remove('follows', (f) => f.followerId === id || f.followingId === id)
    remove('notifications', (n) => n.userId === id)
    update((d) => ({
      reviews: d.reviews.map((r) => (r.authorId === id ? { ...r, authorId: null, anonymized: true } : r)),
      users: d.users.filter((u) => u.id !== id),
    }))
    return wait(true)
  },
}

/* ==========================================================================
   Benachrichtigungen
   ========================================================================== */
export const notifications = {
  list(userId) {
    const db = getDb()
    return wait(db.notifications.filter((n) => n.userId === userId))
  },

  unreadCount(userId) {
    return getDb().notifications.filter((n) => n.userId === userId && n.unread).length
  },

  create(data) {
    const row = { id: nextId('notifications', 'n'), createdAt: nowIso(), unread: true, ...data }
    insert('notifications', row)
    return row
  },

  markAllRead(userId) {
    update((d) => ({
      notifications: d.notifications.map((n) => (n.userId === userId ? { ...n, unread: false } : n)),
    }))
    return wait(true)
  },
}

/* ==========================================================================
   Meldungen
   ========================================================================== */
export const reports = {
  list({ status } = {}) {
    const db = getDb()
    const list = status ? db.reports.filter((r) => r.status === status) : db.reports
    return wait(list)
  },

  create({ targetType, targetId, reason, note, reporterId, label }) {
    const db = getDb()
    const existing = db.reports.find((r) => r.targetType === targetType && r.targetId === targetId && r.status === 'open')
    if (existing) {
      patch('reports', existing.id, (r) => ({ count: r.count + 1 }))
      /* Ab drei unabhängigen Meldungen gilt ein Betrieb als gemeldet geschlossen (8.7). */
      if (targetType === 'place' && reason === 'venue_closed' && existing.count + 1 >= 3) {
        patch('places', targetId, { status: 'closed_reported' })
      }
      return wait(existing)
    }
    const row = {
      id: nextId('reports', 'm'), createdAt: today(), reporterId, targetType, targetId,
      label: label ?? targetId, reason, note: note ?? '', count: 1, status: 'open', handledBy: null,
    }
    insert('reports', row)
    return wait(row)
  },

  resolve(id, status, adminId) {
    patch('reports', id, { status, handledBy: adminId ?? null })
    admin.log(status === 'resolved' ? 'Meldung bearbeitet' : 'Meldung abgewiesen', id, '')
    return wait(true)
  },
}

/* ==========================================================================
   Verwaltung
   ========================================================================== */
export const admin = {
  overview() {
    const db = getDb()
    return wait({
      queue: db.videos.filter((v) => v.status === 'pending_review').length,
      reports: db.reports.filter((r) => r.status === 'open').length,
      claims: db.places.filter((p) => p.claimStatus === 'pending').length,
      places: db.places.length,
      users: db.users.filter((u) => u.role === 'user').length,
      videos: db.videos.length,
      log: db.auditLog.slice(0, 5),
    })
  },

  users() {
    const db = getDb()
    return wait(db.users.filter((u) => u.role === 'user').map((u) => publicUser(u, db)))
  },

  places() {
    const db = getDb()
    return wait(db.places.map((p) => decoratePlace(p, { db })))
  },

  invites() {
    const db = getDb()
    return wait(db.invites.map((i) => ({ ...i, placeName: db.places.find((p) => p.id === i.placeId)?.name })))
  },

  createInvite(placeId, email) {
    const row = { id: nextId('invites', 'i'), placeId: placeId ?? null, email, sentAt: today(), status: 'sent' }
    insert('invites', row)
    admin.log('Einladung verschickt', email, '')
    return wait(row)
  },

  resendInvite(id) {
    patch('invites', id, { sentAt: today(), status: 'sent' })
    return wait(true)
  },

  suggestions() {
    return wait(getDb().suggestions)
  },

  resolveSuggestion(id, status) {
    patch('suggestions', id, { status })
    admin.log(status === 'created' ? 'Betrieb angelegt' : 'Vorschlag abgelehnt', id, '')
    return wait(true)
  },

  log(action, object, note, who = 'ana@intern') {
    insert('auditLog', { id: nextId('auditLog', 'lg'), at: nowIso(), admin: who, action, object, note })
  },

  auditLog() {
    return wait(getDb().auditLog)
  },
}

/* ==========================================================================
   Suche (8.8) — vier Reiter über einer Abfrage
   ========================================================================== */
export const search = {
  run(query, { position = HOME_POSITION } = {}) {
    const db = getDb()
    const q = query.trim().toLowerCase()
    if (!q) return wait({ dishes: [], places: [], locations: [], profiles: [] })

    const matchedDishes = db.dishes
      .filter((d) => `${d.name} ${d.description}`.toLowerCase().includes(q))
      .map((d) => {
        const place = db.places.find((p) => p.id === d.placeId)
        return {
          ...d, ...dishRatingOf(d.id, db),
          place: place ? decoratePlace(place, { position, db }) : null,
        }
      })
      .filter((d) => d.place)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    const matchedPlaces = db.places
      .filter((p) => `${p.name} ${p.cuisine} ${p.tags.join(' ')} ${p.address} ${p.city}`.toLowerCase().includes(q))
      .map((p) => decoratePlace(p, { position, db }))
      .sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9))

    const matchedLocations = (db.locations ?? []).filter((l) => `${l.name} ${l.detail}`.toLowerCase().includes(q))

    const matchedProfiles = db.users
      .filter((u) => u.role === 'user' && u.status !== 'banned')
      .filter((u) => `${u.username} ${u.name}`.toLowerCase().includes(q))
      .map((u) => publicUser(u, db))

    return wait({
      dishes: matchedDishes,
      places: matchedPlaces,
      locations: matchedLocations,
      profiles: matchedProfiles,
    })
  },

  remember(query) {
    const q = query.trim()
    if (!q) return
    update((d) => ({ searchHistory: [q, ...(d.searchHistory ?? []).filter((x) => x !== q)].slice(0, 8) }))
  },

  history() {
    return getDb().searchHistory ?? []
  },

  clearHistory() {
    update(() => ({ searchHistory: [] }))
  },
}

/* ==========================================================================
   Gastro-Auswertung (F.4)
   ========================================================================== */
export const gastro = {
  dashboard(placeId) {
    const db = getDb()
    const own = db.videos.filter((v) => v.placeId === placeId)
    const list = db.reviews.filter((r) => r.placeId === placeId)
    const { rating } = ratingOf(placeId, db)
    return wait({
      views: own.reduce((sum, v) => sum + (v.views ?? 0), 0),
      videoCount: own.length,
      pending: own.filter((v) => v.status === 'pending_review').length,
      reviewCount: list.length,
      reviewsNew: list.filter((r) => !r.answer).length,
      rating,
      latest: list.slice(0, 3).map((r) => decorateReview(r, db)),
    })
  },
}

export default {
  places, menu, videos, reviews, social, users, notifications, reports, admin, search, gastro,
}
