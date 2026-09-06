import { useState } from 'react'
import { ChevronDown, MapPin, Search as SearchIcon, UtensilsCrossed, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Avatar, Button, Chip, EmptyState, FilterChip, Menu, PlaceRow, Skeleton, SkeletonRow,
  Stars, Tabs, Thumb, Checkbox, Radio,
} from '../../components/ui'
import { Page } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { places } from '../../mock/places'
import { dishes, locations, searchPopular, searchRecent, users } from '../../mock/content'
import { RADIUS_OPTIONS, DEFAULT_RADIUS, PRICE_LEVELS } from '../../config'
import { t } from '../../i18n'

const TABS = [
  { id: 'dishes', label: t('search.tabs.dishes') },
  { id: 'places', label: t('search.tabs.places') },
  { id: 'locations', label: t('search.tabs.locations') },
  { id: 'profiles', label: t('search.tabs.profiles') },
]

/** C.5 — Suchergebnisse */
export default function SearchPage() {
  const { isEmpty, isLoading } = useDesignState()
  const [query, setQuery] = useState('pizza')
  const [tab, setTab] = useState('dishes')
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [recent, setRecent] = useState(searchRecent)

  return (
    <Page title={t('search.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6)' }}>
        <div className="header-search" style={{ maxWidth: 'none' }}>
          <SearchIcon size={18} className="search-icon" />
          <input
            className="input"
            style={{ height: 44 }}
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('common.search')}
          />
        </div>
      </div>

      {/* Vor der Eingabe: Verlauf und Vorschläge */}
      {query.length === 0 ? (
        <div className="stack-6" style={{ paddingBottom: 'var(--sp-16)' }}>
          <div>
            <h2 className="t-small c-secondary" style={{ marginBottom: 'var(--sp-2)' }}>{t('search.recent')}</h2>
            <div className="row-wrap">
              {recent.map((r) => (
                <span className="chip" key={r}>
                  {r}
                  <button
                    type="button"
                    aria-label={t('search.removeRecent')}
                    onClick={() => setRecent((list) => list.filter((x) => x !== r))}
                    style={{ border: 0, background: 'none', cursor: 'pointer', padding: 0, display: 'grid' }}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="t-small c-secondary" style={{ marginBottom: 'var(--sp-2)' }}>{t('search.popularNearby')}</h2>
            <div className="row-wrap">
              {searchPopular.map((p) => <Chip key={p} onClick={() => setQuery(p)}>{p}</Chip>)}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row-between" style={{ gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <Tabs items={TABS} value={tab} onChange={setTab} className="grow" />
            <div className="row-wrap">
              <FilterChip label={t('common.radiusValue', { value: radius })} align="right">
                {({ close }) => (
                  <>
                    {RADIUS_OPTIONS.map((r) => (
                      <button key={r} type="button" className="menu-item" onClick={() => { setRadius(r); close() }}>{r} km</button>
                    ))}
                  </>
                )}
              </FilterChip>
              <FilterChip label={t('common.filter')} align="right" width={280}>
                {({ close }) => (
                  <>
                    <p className="t-small c-secondary menu-title">{t('map.categoryMenuTitle')}</p>
                    <div style={{ padding: '0 var(--sp-3)' }}>
                      {['restaurant', 'cafe', 'bar', 'imbiss'].map((c) => <Checkbox key={c} label={t(`categories.${c}`)} />)}
                    </div>
                    <p className="t-small c-secondary menu-title">{t('map.ratingMenuTitle')}</p>
                    <div style={{ padding: '0 var(--sp-3)' }}>
                      {['all', 'from3', 'from4', 'from45'].map((k, i) => (
                        <Radio key={k} name="s-rating" label={t(`map.ratingOptions.${k}`)} defaultChecked={i === 0} />
                      ))}
                    </div>
                    <p className="t-small c-secondary menu-title">{t('map.priceMenuTitle')}</p>
                    <div className="row-wrap" style={{ padding: '0 var(--sp-3) var(--sp-2)' }}>
                      {PRICE_LEVELS.map((p) => <Chip key={p}>{p}</Chip>)}
                    </div>
                    <div className="menu-actions">
                      <Button variant="quiet" size="sm" onClick={close}>{t('common.reset')}</Button>
                      <span className="spacer" />
                      <Button variant="primary" size="sm" onClick={close}>{t('common.apply')}</Button>
                    </div>
                  </>
                )}
              </FilterChip>
            </div>
          </div>

          <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)' }}>
            {isLoading ? (
              <>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</>
            ) : isEmpty ? (
              <EmptyState
                icon={SearchIcon}
                title={t('search.emptyTitle', { query })}
                text={t('search.emptyText')}
              />
            ) : (
              <>
                {tab === 'dishes' && <DishResults />}
                {tab === 'places' && places.map((p) => <PlaceRow key={p.id} place={p} />)}
                {tab === 'locations' && <LocationResults />}
                {tab === 'profiles' && <ProfileResults />}
              </>
            )}
          </div>
        </>
      )}
    </Page>
  )
}

function DishResults() {
  return (
    <div>
      {dishes.map((d) => {
        const place = places.find((p) => p.id === d.placeId) ?? places[0]
        return (
          <Link to={`/g/${place.slug}`} className="place-row" key={d.id}>
            <Thumb size={64} icon={UtensilsCrossed} />
            <div className="grow">
              <p className="t-h3">{d.name}</p>
              <p className="t-small c-secondary">{place.name} · {place.distance}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="t-body-bold">{d.price}</p>
              <Stars value={d.rating} size={12} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function LocationResults() {
  return (
    <div>
      {locations.map((l) => (
        <Link to="/karte" className="place-row" key={l.id} style={{ alignItems: 'center' }}>
          <Thumb size={40} radius="50%" icon={MapPin} />
          <div className="grow">
            <p className="t-body-bold">{l.name}</p>
            <p className="t-small c-secondary">{l.detail}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

function ProfileResults() {
  const states = ['follow', 'requested', 'following', 'follow']
  return (
    <div>
      {users.map((u, i) => (
        <div className="place-row" key={u.id} style={{ alignItems: 'center' }}>
          <Avatar name={u.username} size={48} />
          <Link to={`/p/${u.username}`} className="grow" style={{ textDecoration: 'none' }}>
            <p className="t-body-bold">@{u.username}</p>
            <p className="t-small c-secondary">{t('search.profileMeta', { videos: u.videos, reviews: u.reviews })}</p>
          </Link>
          <Button variant={states[i] === 'follow' ? 'secondary' : 'secondary'} size="sm">
            {t(`search.${states[i]}`)}
          </Button>
        </div>
      ))}
    </div>
  )
}
