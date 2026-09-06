import { Link } from 'react-router-dom'
import { Bookmark, Play, UtensilsCrossed } from 'lucide-react'
import { Badge, Thumb, VerifiedMark } from './Primitives'
import { IconButton } from './Button'
import { RatingCompact } from './Rating'
import { t } from '../../i18n'
import { useToast } from './Feedback'

/**
 * Betriebszeile — Ergebnisliste Karte (C.2), Suche (C.5), Videodetail (C.7).
 * Vier Zeilen: Name · Kategorie/Preis/Entfernung · Sterne · Öffnungsstatus.
 */
export function PlaceRow({ place, showSave = true, compact }) {
  const toast = useToast()
  return (
    <div className="place-row">
      <Link to={`/g/${place.slug}`} className="place-thumb-wrap" aria-hidden="true" tabIndex={-1}>
        <Thumb size={compact ? 56 : 72} icon={UtensilsCrossed} />
        {place.videoCount > 0 && (
          <span className="place-video-badge">
            <Badge tone="dark" icon={Play}>{place.videoCount}</Badge>
          </span>
        )}
      </Link>

      <div className="grow">
        <Link to={`/g/${place.slug}`} className="row" style={{ gap: 6, textDecoration: 'none' }}>
          <span className="t-h3 truncate">{place.name}</span>
          {place.verified && <VerifiedMark />}
        </Link>

        <p className="t-small c-secondary">
          {place.cuisine} · {place.price} · {place.distance}
        </p>

        <div style={{ marginTop: 2 }}><RatingCompact rating={place.rating} average /></div>

        <p className="t-small" style={{ marginTop: 2, color: place.open ? 'var(--success)' : 'var(--text-secondary)' }}>
          {place.open
            ? t('hours.openUntil', { time: place.closesAt })
            : t('hours.closedUntil', { day: t('hours.tomorrow'), time: place.opensAt })}
        </p>
      </div>

      {showSave && (
        <IconButton
          icon={Bookmark}
          label={t('map.save')}
          onClick={() => toast(t('toast.saved'))}
        />
      )}
    </div>
  )
}

/** Kompakte, nicht klickbare Variante für Zusammenfassungen. */
export function PlaceSummary({ place, right }) {
  return (
    <div className="row" style={{ gap: 'var(--sp-3)' }}>
      <Thumb size={40} icon={UtensilsCrossed} />
      <div className="grow">
        <div className="row" style={{ gap: 4 }}>
          <span className="t-body-bold truncate">{place.name}</span>
          {place.verified && <VerifiedMark />}
        </div>
        <p className="t-small c-secondary truncate">
          {place.cuisine} · {place.distance} · {place.open ? t('common.openNow') : t('hours.closed')}
        </p>
      </div>
      {right}
    </div>
  )
}
