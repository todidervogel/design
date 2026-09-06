import { ChevronRight, Compass, Info, MapPin, Navigation, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, IconButton, Skeleton, VideoTile } from '../../components/ui'
import { Page } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { places } from '../../mock/places'
import { videos } from '../../mock/content'
import { t } from '../../i18n'

/** C.1 — Startseite */
export default function Home() {
  const { isLoading, isEmpty } = useDesignState()
  const tiles = isEmpty ? [] : [...videos, ...videos].slice(0, 6)

  return (
    <Page title={t('home.title')}>
      {/* Abschnitt 1 — Kopfbereich */}
      <section className="section" style={{ maxWidth: 720 }}>
        <h1 className="t-display">{t('home.title')}</h1>
        <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-3)' }}>{t('home.subtitle')}</p>

        <div className="row-wrap" style={{ marginTop: 'var(--sp-6)', gap: 'var(--sp-2)' }}>
          <div className="input-affix grow" style={{ minWidth: 260 }}>
            <span className="affix"><MapPin size={18} /></span>
            <input className="input" placeholder={t('home.locationPlaceholder')} aria-label={t('home.locationPlaceholder')} />
            <Button variant="quiet" size="sm" icon={Navigation}>{t('home.useLocation')}</Button>
          </div>
          <Button variant="primary" to="/karte">{t('home.go')}</Button>
        </div>
      </section>

      {/* Abschnitt 2 — Videovorschau */}
      <section style={{ paddingBottom: 'var(--sp-12)' }}>
        <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
          <h2 className="t-h2">{t('home.popularTitle')}</h2>
          <IconButton icon={ChevronRight} label={t('home.popularNext')} />
        </div>

        {isLoading ? (
          <div className="video-rail">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} w={180} h={320} radius="var(--r-card)" style={{ flex: 'none' }} />
            ))}
          </div>
        ) : tiles.length === 0 ? (
          <div className="card card-flat" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
            <p className="t-body c-secondary">{t('feed.emptyText')}</p>
          </div>
        ) : (
          <div className="video-rail">
            {tiles.map((v, i) => {
              const place = places.find((p) => p.id === v.placeId) ?? places[0]
              return (
                <VideoTile
                  key={`${v.id}-${i}`}
                  to={`/v/${v.id}`}
                  title={place.name}
                  subtitle={place.distance}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* Abschnitt 3 — Kartenvorschau */}
      <section style={{ paddingBottom: 'var(--sp-12)' }}>
        <h2 className="t-h2" style={{ marginBottom: 'var(--sp-4)' }}>{t('home.mapTitle')}</h2>
        <div className="map-canvas" style={{ height: 400, borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {!isLoading && places.map((p) => (
            <span key={p.id} className="marker" style={{ top: `${p.lat}%`, left: `${p.lng}%` }}>
              <span className={p.videoCount > 0 ? 'marker-video' : 'marker-dot'}>
                <UtensilsCrossed size={p.videoCount > 0 ? 16 : 11} />
              </span>
            </span>
          ))}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <Button variant="primary" to="/karte">{t('home.openMap')}</Button>
          </div>
          <div className="map-attribution">{t('footer.mapData')}</div>
        </div>
      </section>

      {/* Abschnitt 4 — So funktioniert's */}
      <section style={{ paddingBottom: 'var(--sp-12)' }}>
        <h2 className="t-h2" style={{ marginBottom: 'var(--sp-6)' }}>{t('home.howTitle')}</h2>
        <div style={{ display: 'grid', gap: 'var(--sp-6)', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {[
            [Compass, 'discoverTitle', 'discoverText'],
            [Info, 'informTitle', 'informText'],
            [Navigation, 'goTitle', 'goText'],
          ].map(([Icon, titleKey, textKey]) => (
            <div key={titleKey}>
              <Icon size={28} className="c-accent" />
              <h3 className="t-h3" style={{ marginTop: 'var(--sp-3)' }}>{t(`home.how.${titleKey}`)}</h3>
              <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-1)' }}>{t(`home.how.${textKey}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Abschnitt 5 — Für Gastronomen */}
      <section
        className="card card-flat"
        style={{ padding: 'var(--sp-8)', marginBottom: 'var(--sp-12)' }}
      >
        <h2 className="t-h2">{t('home.gastroTitle')}</h2>
        <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)', maxWidth: 560 }}>{t('home.gastroText')}</p>
        <Button variant="primary" to="/gastro/eintragen" style={{ marginTop: 'var(--sp-4)' }}>
          {t('home.gastroCta')}
        </Button>
        <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-3)' }}>
          <Link to="/fuer-gastronomen" className="c-accent">{t('header.forRestaurants')}</Link>
        </p>
      </section>
    </Page>
  )
}
