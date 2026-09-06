import { useState } from 'react'
import { Crosshair, Search, UtensilsCrossed } from 'lucide-react'
import {
  Button, Chip, FilterChip, PlaceRow, SkeletonRow, EmptyState, Checkbox, Radio,
} from '../../components/ui'
import { BarePage } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { places, clusters } from '../../mock/places'
import { RADIUS_OPTIONS, PRICE_LEVELS, DEFAULT_RADIUS } from '../../config'
import { t } from '../../i18n'

const CATEGORIES = ['restaurant', 'cafe', 'bar', 'imbiss', 'baeckerei', 'eisdiele', 'pub']

/** C.2 — Kartenansicht */
export default function MapView() {
  const { isEmpty, isLoading } = useDesignState()
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [openNow, setOpenNow] = useState(false)
  const [onlyVideos, setOnlyVideos] = useState(false)
  const [prices, setPrices] = useState([])
  const [selected, setSelected] = useState(null)
  const list = isEmpty ? [] : places

  const togglePrice = (p) => setPrices((v) => (v.includes(p) ? v.filter((x) => x !== p) : [...v, p]))

  const results = isLoading ? (
    <>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</>
  ) : list.length === 0 ? (
    <EmptyState
      icon={Search}
      title={t('map.emptyTitle')}
      text={t('map.emptyText')}
      action={<Button variant="secondary" onClick={() => setRadius(25)}>{t('map.emptyCta')}</Button>}
    />
  ) : (
    <>
      <p className="t-small c-secondary" style={{ padding: 'var(--sp-3) var(--sp-4) 0' }}>
        {t('map.resultCount', { count: list.length })}
      </p>
      {list.map((p) => <PlaceRow key={p.id} place={p} />)}
    </>
  )

  return (
    <BarePage title={t('map.title')}>
      <div className="map-page">
        <div className="map-layout">
          {/* Desktop: Ergebnisliste links */}
          <aside className="map-list">{results}</aside>

          <div className="map-canvas">
            <div className="map-overlay-top">
              <div className="map-toolbar">
                <div className="header-search" style={{ maxWidth: 'none' }}>
                  <Search size={18} className="search-icon" />
                  <input className="input" placeholder={t('map.searchHere')} aria-label={t('map.searchHere')} />
                </div>

                <div className="chip-scroll">
                  <FilterChip label={t('common.radiusValue', { value: radius })} active>
                    {({ close }) => (
                      <>
                        <p className="t-small c-secondary menu-title">{t('map.radiusMenuTitle')}</p>
                        {RADIUS_OPTIONS.map((r) => (
                          <button key={r} type="button" className="menu-item" onClick={() => { setRadius(r); close() }}>
                            {r} km {radius === r && <span className="c-accent">✓</span>}
                          </button>
                        ))}
                      </>
                    )}
                  </FilterChip>

                  <Chip active={openNow} onClick={() => setOpenNow((v) => !v)}>{t('common.openNow')}</Chip>

                  <FilterChip label={t('common.category')}>
                    {({ close }) => (
                      <>
                        <p className="t-small c-secondary menu-title">{t('map.categoryMenuTitle')}</p>
                        <div style={{ padding: '0 var(--sp-3)' }}>
                          {CATEGORIES.map((c) => <Checkbox key={c} label={t(`categories.${c}`)} />)}
                        </div>
                        <div className="menu-actions">
                          <Button variant="quiet" size="sm" onClick={close}>{t('common.reset')}</Button>
                          <span className="spacer" />
                          <Button variant="primary" size="sm" onClick={close}>{t('common.apply')}</Button>
                        </div>
                      </>
                    )}
                  </FilterChip>

                  <FilterChip label={t('common.rating')}>
                    {({ close }) => (
                      <>
                        <p className="t-small c-secondary menu-title">{t('map.ratingMenuTitle')}</p>
                        <div style={{ padding: '0 var(--sp-3) var(--sp-2)' }}>
                          {['all', 'from3', 'from4', 'from45'].map((k, i) => (
                            <Radio key={k} name="rating" label={t(`map.ratingOptions.${k}`)} defaultChecked={i === 0} onChange={close} />
                          ))}
                        </div>
                      </>
                    )}
                  </FilterChip>

                  <Chip active={onlyVideos} onClick={() => setOnlyVideos((v) => !v)}>{t('common.onlyWithVideos')}</Chip>

                  <FilterChip label={t('common.price')} align="right">
                    {() => (
                      <>
                        <p className="t-small c-secondary menu-title">{t('map.priceMenuTitle')}</p>
                        <div className="row-wrap" style={{ padding: '0 var(--sp-3) var(--sp-3)' }}>
                          {PRICE_LEVELS.map((p) => (
                            <Chip key={p} active={prices.includes(p)} onClick={() => togglePrice(p)}>{p}</Chip>
                          ))}
                        </div>
                      </>
                    )}
                  </FilterChip>
                </div>
              </div>
            </div>

            {/* Marker */}
            {!isLoading && list.map((p) => (
              <button
                key={p.id}
                type="button"
                className="marker"
                data-selected={selected === p.id}
                style={{ top: `${p.lat}%`, left: `${p.lng}%` }}
                aria-label={p.name}
                onClick={() => setSelected(p.id)}
              >
                <span className={p.videoCount > 0 ? 'marker-video' : 'marker-dot'}>
                  <UtensilsCrossed size={p.videoCount > 0 ? 16 : 11} />
                </span>
              </button>
            ))}
            {!isLoading && !isEmpty && clusters.map((c) => (
              <button key={c.id} type="button" className="marker" style={{ top: `${c.lat}%`, left: `${c.lng}%` }} aria-label={`${c.count} Betriebe`}>
                <span className="marker-cluster">{c.count}</span>
              </button>
            ))}

            <button type="button" className="btn btn-icon map-locate" aria-label={t('map.centerOnMe')}>
              <Crosshair size={20} />
            </button>

            <div className="map-attribution">{t('footer.mapData')}</div>

            {/* Mobil: ziehbares Blatt mit der Liste */}
            <div className="bottom-sheet">
              <div className="sheet-handle" />
              {results}
            </div>
          </div>
        </div>
      </div>
    </BarePage>
  )
}
