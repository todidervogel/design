/** Platzhalterdaten — Videos, Bewertungen, Gerichte, Nutzer, Benachrichtigungen. */

export const users = [
  { id: 'u1', username: 'maxmuster', name: 'Max Muster', videos: 12, reviews: 9, followers: 48, following: 31, private: false, bio: 'Isst sich einmal quer durch Prenzlauer Berg. Immer auf der Suche nach dem besten Sauerteig.' },
  { id: 'u2', username: 'lisa_k', name: 'Lisa K.', videos: 4, reviews: 21, followers: 190, following: 88, private: false, bio: 'Kaffee zuerst.' },
  { id: 'u3', username: 'jonas.isst', name: 'Jonas', videos: 27, reviews: 40, followers: 1204, following: 210, private: true, bio: 'Streetfood, Suppen, Sonstiges.' },
  { id: 'u4', username: 'fatima_b', name: 'Fatima B.', videos: 8, reviews: 12, followers: 76, following: 54, private: false, bio: '' },
]

/** Das angemeldete Konto (E.7). */
export const me = users[0]

export const videos = [
  { id: 'v1', placeId: 'p1', authorId: 'u1', caption: 'Die Pizza kam nach zwölf Minuten und war noch am Blubbern. Der Teig hat 48 Stunden Gare, sagt der Chef.', views: '12,4 Tsd.', likes: '1.204', comments: '38', date: '3. Sep 2026', durationSec: 35, verifiedOnSite: true, visibility: 'public', status: 'published', rating: { food: 4, service: 5, price: 3 } },
  { id: 'v2', placeId: 'p2', authorId: 'u2', caption: 'Zimtschnecke, noch warm. Mehr muss ich nicht sagen.', views: '3.910', likes: '402', comments: '11', date: '1. Sep 2026', durationSec: 18, verifiedOnSite: true, visibility: 'public', status: 'published', rating: { food: 5, service: 4, price: 5 } },
  { id: 'v3', placeId: 'p3', authorId: 'u3', caption: 'Pho um halb elf morgens. Die Brühe köchelt seit gestern.', views: '48,1 Tsd.', likes: '6.780', comments: '210', date: '30. Aug 2026', durationSec: 52, verifiedOnSite: false, visibility: 'public', status: 'published', rating: { food: 5, service: 4, price: 5 } },
  { id: 'v4', placeId: 'p5', authorId: 'u4', caption: 'Negroni mit Rauchnote. Die Karte wechselt jede Woche.', views: '1.302', likes: '88', comments: '4', date: '28. Aug 2026', durationSec: 22, verifiedOnSite: true, visibility: 'friends', status: 'review', rating: { food: 4, service: 5, price: 3 } },
  { id: 'v5', placeId: 'p6', authorId: 'u1', caption: 'Pistazie und Zitrone. Beides vegan.', views: '890', likes: '54', comments: '2', date: '24. Aug 2026', durationSec: 14, verifiedOnSite: true, visibility: 'private', status: 'published', rating: { food: 5, service: 4, price: 4 } },
  { id: 'v6', placeId: 'p1', authorId: 'u3', caption: 'Tiramisu im Glas — süß, aber nicht zu süß.', views: '5.640', likes: '712', comments: '29', date: '20. Aug 2026', durationSec: 27, verifiedOnSite: false, visibility: 'public', status: 'rejected', rejectReason: 'Falscher Betrieb', rating: null },
]

export const dishes = [
  { id: 'd1', placeId: 'p1', category: 'hauptgerichte', name: 'Pizza Margherita', description: 'Tomate, Fior di Latte, Basilikum, Olivenöl. Holzofen.', price: '9,50 €', rating: 4.6, ratingCount: 12, confirmed: true, visible: true, tags: ['vegetarisch'] },
  { id: 'd2', placeId: 'p1', category: 'hauptgerichte', name: 'Tagliatelle al Ragù', description: 'Frische Bandnudeln, Rinderragout, 4 Stunden geschmort.', price: '14,00 €', rating: 4.4, ratingCount: 8, confirmed: true, visible: true, tags: [] },
  { id: 'd3', placeId: 'p1', category: 'vorspeisen', name: 'Bruschetta', description: 'Geröstetes Brot, Tomate, Knoblauch.', price: '6,00 €', rating: 4.1, ratingCount: 5, confirmed: false, visible: true, tags: ['vegetarisch', 'vegan'] },
  { id: 'd4', placeId: 'p1', category: 'desserts', name: 'Tiramisu', description: 'Hausgemacht, mit Espresso aus der eigenen Röstung.', price: '5,50 €', rating: 4.8, ratingCount: 15, confirmed: true, visible: true, tags: ['vegetarisch'] },
  { id: 'd5', placeId: 'p1', category: 'getraenke', name: 'Hausrotwein 0,2 l', description: 'Primitivo, Apulien.', price: '5,00 €', rating: 4.0, ratingCount: 3, confirmed: true, visible: false, tags: ['vegan'] },
]

export const reviews = [
  {
    id: 'r1', placeId: 'p1', authorId: 'u2', date: '3. Sep 2026', verifiedOnSite: true,
    rating: { food: 4, service: 5, price: 3 }, groupSize: 2, foodHot: true,
    dishes: [{ name: 'Pizza Margherita', stars: 5 }, { name: 'Tiramisu', stars: 4 }],
    text: 'Wir saßen draußen, es war voll, trotzdem hat alles keine 20 Minuten gedauert. Die Pizza war top, beim Preis merkt man die Lage. Tiramisu unbedingt teilen, die Portion ist groß.',
    likes: 12, hasVideo: true, answer: null,
  },
  {
    id: 'r2', placeId: 'p1', authorId: 'u3', date: '28. Aug 2026', verifiedOnSite: false,
    rating: { food: 5, service: 3, price: 4 }, groupSize: 4, foodHot: true,
    dishes: [{ name: 'Tagliatelle al Ragù', stars: 5 }],
    text: 'Essen war hervorragend. Der Service war überfordert, wir mussten zweimal nach Wasser fragen. Kommen trotzdem wieder.',
    likes: 4, hasVideo: false,
    answer: { text: 'Danke für die ehrliche Rückmeldung! Freitag war bei uns eine Kollegin krank. Wir haben nachbesetzt — beim nächsten Mal klappt das besser.', date: '29. Aug 2026' },
  },
  {
    id: 'r3', placeId: 'p1', authorId: 'u4', date: '19. Aug 2026', verifiedOnSite: true,
    rating: { food: 3, service: 4, price: 2 }, groupSize: 2, foodHot: false,
    dishes: [{ name: 'Bruschetta', stars: 3 }],
    text: 'Nett, aber für den Preis erwarte ich mehr. Die Bruschetta kam lauwarm.',
    likes: 1, hasVideo: false, answer: null,
  },
]

export const notifications = [
  { id: 'n1', type: 'follow', user: 'maxmuster', text: 'folgt dir jetzt.', time: 'vor 2 Std.', unread: true, action: 'followBack' },
  { id: 'n2', type: 'like', user: 'lisa_k', text: 'gefällt dein Video.', time: 'vor 5 Std.', unread: true },
  { id: 'n3', type: 'reply', user: 'Trattoria Bella', text: 'hat auf deine Bewertung geantwortet.', time: 'gestern', unread: false },
  { id: 'n4', type: 'approved', text: 'Dein Video wurde freigegeben und ist jetzt sichtbar.', time: 'vor 2 Tagen', unread: false },
  { id: 'n5', type: 'rejected', text: 'Dein Video wurde nicht freigegeben.', time: 'vor 4 Tagen', unread: false, link: 'why' },
]

export const searchRecent = ['ramen', 'frühstück kreuzberg', 'pizza napoletana']
export const searchPopular = ['Sauerteigbrot', 'Bowls', 'Sonntagsbrunch', 'Craft Beer', 'Baklava']

export const locations = [
  { id: 'l1', name: 'Berlin', detail: 'Deutschland · 3,8 Mio. Einwohner' },
  { id: 'l2', name: 'Prenzlauer Berg', detail: 'Stadtteil · Berlin' },
  { id: 'l3', name: 'Kastanienallee', detail: 'Straße · 10435 Berlin' },
]

export const adminEvents = [
  { time: '06.09.2026 09:14', event: 'Video freigegeben (v1)', actor: 'admin@intern' },
  { time: '06.09.2026 08:52', event: 'Betrieb verifiziert: Trattoria Bella', actor: 'admin@intern' },
  { time: '05.09.2026 17:30', event: 'Nutzer verwarnt: @jonas.isst', actor: 'moderation@intern' },
  { time: '05.09.2026 11:02', event: 'Betriebs-Anfrage eingegangen: Bar Nordlicht', actor: 'System' },
  { time: '04.09.2026 20:45', event: 'Meldung abgewiesen (Bewertung r3)', actor: 'moderation@intern' },
]

export const adminReports = [
  { id: 'm1', date: '06.09.2026', type: 'video', object: 'v6 · Trattoria Bella', reason: 'Falscher Betrieb', count: 3, status: 'open' },
  { id: 'm2', date: '05.09.2026', type: 'review', object: 'r3 · Trattoria Bella', reason: 'Gefälschte Bewertung', count: 1, status: 'review' },
  { id: 'm3', date: '04.09.2026', type: 'place', object: 'Bäckerei Sommer', reason: 'Dauerhaft geschlossen', count: 5, status: 'open' },
  { id: 'm4', date: '02.09.2026', type: 'profile', object: '@jonas.isst', reason: 'Spam oder Werbung', count: 2, status: 'done' },
]

export const adminInvites = [
  { id: 'i1', place: 'Café Morgenrot', email: 'hallo@morgenrot-cafe.de', sentAt: '01.09.2026', status: 'opened' },
  { id: 'i2', place: 'Eis Luisa', email: 'info@eis-luisa.de', sentAt: '01.09.2026', status: 'activated' },
  { id: 'i3', place: 'Bäckerei Sommer', email: 'kontakt@baeckerei-sommer.de', sentAt: '29.08.2026', status: 'bounced' },
  { id: 'i4', place: 'Bar Nordlicht', email: 'bar@nordlicht.de', sentAt: '28.08.2026', status: 'sent' },
]

export const adminUsers = [
  { id: 'au1', username: 'maxmuster', email: 'max@beispiel.de', registered: '12.03.2026', videos: 12, reviews: 9, reports: 0, status: 'active' },
  { id: 'au2', username: 'lisa_k', email: 'lisa@beispiel.de', registered: '02.05.2026', videos: 4, reviews: 21, reports: 1, status: 'active' },
  { id: 'au3', username: 'jonas.isst', email: 'jonas@beispiel.de', registered: '18.01.2026', videos: 27, reviews: 40, reports: 4, status: 'warned' },
  { id: 'au4', username: 'spamking', email: 'noreply@spam.example', registered: '30.08.2026', videos: 2, reviews: 0, reports: 9, status: 'banned' },
]

export const adminSuggestions = [
  { id: 's1', name: 'Trattoria da Enzo', address: 'Danziger Str. 12, 10435 Berlin', type: 'restaurant', reportedBy: '@lisa_k', date: '05.09.2026', status: 'open' },
  { id: 's2', name: 'Späti Kastanie', address: 'Kastanienallee 90, 10435 Berlin', type: 'sonstiges', reportedBy: '@maxmuster', date: '03.09.2026', status: 'rejected' },
  { id: 's3', name: 'Kombüse', address: 'Simon-Dach-Str. 5, 10245 Berlin', type: 'imbiss', reportedBy: '@fatima_b', date: '01.09.2026', status: 'created' },
]

export const adminLog = [
  { time: '06.09.2026 09:14', admin: 'ana@intern', action: 'Video freigegeben', object: 'v1', note: '' },
  { time: '06.09.2026 08:52', admin: 'ana@intern', action: 'Betrieb verifiziert', object: 'Trattoria Bella', note: 'Code telefonisch bestätigt' },
  { time: '05.09.2026 17:30', admin: 'ben@intern', action: 'Nutzer verwarnt', object: '@jonas.isst', note: 'Wiederholte Meldungen' },
  { time: '05.09.2026 14:08', admin: 'ben@intern', action: 'Meldung abgewiesen', object: 'r3', note: 'Kein Verstoß erkennbar' },
]

export const kpis = {
  gastro: { views: '2.418', reviews: '24', reviewsNew: '3', food: 4.3, profileViews: '731' },
  admin: { queue: 7, reports: 4, claims: 2, places: 1284, users: 5391, videos: 812 },
}
