/**
 * Platzhalterdaten — Betriebe.
 * Alles erfunden. Später 1:1 durch echte Daten ersetzbar.
 */
export const places = [
  {
    id: 'p1', slug: 'trattoria-bella', name: 'Trattoria Bella', verified: true,
    cuisine: 'Italienisch', tags: ['Italienisch', 'Pizza'], price: '€€',
    distance: '1,2 km', videoCount: 3, reviewCount: 24,
    rating: { food: 4.3, service: 4.0, price: 3.8 },
    open: true, closesAt: '22:00', opensAt: '11:30',
    address: 'Kastanienallee 42, 10435 Berlin', city: 'Berlin',
    phone: '+49 30 1234567', website: 'trattoria-bella.de',
    lat: 34, lng: 46, category: 'restaurant', hasCover: true,
    description:
      'Kleine Familientrattoria seit 1998. Wir backen im Holzofen, machen die Pasta selbst und beziehen Tomaten und Öl von einem Hof in Apulien.',
    features: ['aussenplaetze', 'vegetarisch', 'reservierung', 'kartenzahlung', 'wlan'],
    hours: [
      ['mo', '11:30 – 22:00'], ['di', '11:30 – 22:00'], ['mi', '11:30 – 22:00'],
      ['do', '11:30 – 23:00'], ['fr', '11:30 – 23:30'], ['sa', '12:00 – 23:30'],
      ['so', '12:00 – 21:00'],
    ],
  },
  {
    id: 'p2', slug: 'cafe-morgenrot', name: 'Café Morgenrot', verified: false,
    cuisine: 'Café', tags: ['Café', 'Frühstück'], price: '€',
    distance: '450 m', videoCount: 1, reviewCount: 8,
    rating: { food: 4.6, service: 4.4, price: 4.5 },
    open: true, closesAt: '18:00', opensAt: '08:00',
    address: 'Oderberger Str. 7, 10435 Berlin', city: 'Berlin',
    phone: '+49 30 7654321', website: 'morgenrot-cafe.de',
    lat: 22, lng: 28, category: 'cafe', hasCover: false,
    description: 'Frühstück den ganzen Tag, Filterkaffee aus der Rösterei um die Ecke.',
    features: ['vegan', 'vegetarisch', 'hunde', 'wlan', 'barrierefrei'],
    hours: [
      ['mo', 'Geschlossen'], ['di', '08:00 – 18:00'], ['mi', '08:00 – 18:00'],
      ['do', '08:00 – 18:00'], ['fr', '08:00 – 19:00'], ['sa', '09:00 – 19:00'],
      ['so', '09:00 – 17:00'],
    ],
  },
  {
    id: 'p3', slug: 'dong-xuan-imbiss', name: 'Dong Xuan Imbiss', verified: true,
    cuisine: 'Vietnamesisch', tags: ['Vietnamesisch', 'Suppe'], price: '€',
    distance: '2,8 km', videoCount: 7, reviewCount: 61,
    rating: { food: 4.7, service: 3.9, price: 4.8 },
    open: false, closesAt: '20:00', opensAt: '11:00',
    address: 'Herzbergstr. 128, 10365 Berlin', city: 'Berlin',
    phone: '+49 30 5556677', website: '',
    lat: 58, lng: 71, category: 'imbiss', hasCover: true,
    description: 'Pho, Bun Bo und Sommerrollen. Bar bezahlen, schnell essen, glücklich sein.',
    features: ['abholung', 'lieferung', 'vegetarisch'],
    hours: [
      ['mo', '11:00 – 20:00'], ['di', '11:00 – 20:00'], ['mi', '11:00 – 20:00'],
      ['do', '11:00 – 20:00'], ['fr', '11:00 – 21:00'], ['sa', '11:00 – 21:00'],
      ['so', 'Geschlossen'],
    ],
  },
  {
    id: 'p4', slug: 'baeckerei-sommer', name: 'Bäckerei Sommer', verified: false,
    cuisine: 'Bäckerei', tags: ['Bäckerei'], price: '€',
    distance: '900 m', videoCount: 0, reviewCount: 0,
    rating: null,
    open: true, closesAt: '18:30', opensAt: '06:30',
    address: 'Schönhauser Allee 118, 10437 Berlin', city: 'Berlin',
    phone: '+49 30 4443322', website: '',
    lat: 41, lng: 18, category: 'baeckerei', hasCover: false,
    description: 'Sauerteigbrot, Franzbrötchen und Kaffee zum Mitnehmen.',
    features: ['abholung', 'kartenzahlung'],
    hours: [
      ['mo', '06:30 – 18:30'], ['di', '06:30 – 18:30'], ['mi', '06:30 – 18:30'],
      ['do', '06:30 – 18:30'], ['fr', '06:30 – 18:30'], ['sa', '07:00 – 14:00'],
      ['so', 'Geschlossen'],
    ],
  },
  {
    id: 'p5', slug: 'bar-nordlicht', name: 'Bar Nordlicht', verified: true,
    cuisine: 'Bar', tags: ['Bar', 'Cocktails'], price: '€€€',
    distance: '3,4 km', videoCount: 2, reviewCount: 19,
    rating: { food: 3.9, service: 4.6, price: 3.2 },
    open: true, closesAt: '02:00', opensAt: '18:00',
    address: 'Weichselstr. 3, 12043 Berlin', city: 'Berlin',
    phone: '+49 30 9998877', website: 'bar-nordlicht.de',
    lat: 72, lng: 55, category: 'bar', hasCover: true,
    description: 'Kleine Karte, große Drinks. Küche bis 23 Uhr.',
    features: ['reservierung', 'kartenzahlung', 'aussenplaetze'],
    hours: [
      ['mo', 'Geschlossen'], ['di', '18:00 – 01:00'], ['mi', '18:00 – 01:00'],
      ['do', '18:00 – 02:00'], ['fr', '18:00 – 03:00'], ['sa', '18:00 – 03:00'],
      ['so', '18:00 – 00:00'],
    ],
  },
  {
    id: 'p6', slug: 'eis-luisa', name: 'Eis Luisa', verified: false,
    cuisine: 'Eisdiele', tags: ['Eisdiele'], price: '€',
    distance: '1,7 km', videoCount: 4, reviewCount: 33,
    rating: { food: 4.9, service: 4.2, price: 4.0 },
    open: false, closesAt: '21:00', opensAt: '12:00',
    address: 'Boxhagener Str. 84, 10245 Berlin', city: 'Berlin',
    phone: '', website: '',
    lat: 30, lng: 62, category: 'eisdiele', hasCover: true,
    description: 'Handgemachtes Eis, jeden Tag frisch. Auch vegan.',
    features: ['vegan', 'barrierefrei'],
    hours: [
      ['mo', '12:00 – 21:00'], ['di', '12:00 – 21:00'], ['mi', '12:00 – 21:00'],
      ['do', '12:00 – 21:00'], ['fr', '12:00 – 22:00'], ['sa', '11:00 – 22:00'],
      ['so', '11:00 – 22:00'],
    ],
  },
]

export const placeBySlug = (slug) => places.find((p) => p.slug === slug) ?? places[0]

/** Der Betrieb, als der die Gastro-Ansicht angemeldet ist. */
export const myPlace = places[0]

/** Marker-Gruppierung auf der Karte (C.2). */
export const clusters = [{ id: 'c1', count: 24, lat: 84, lng: 24 }]
