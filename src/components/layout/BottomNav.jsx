import { NavLink } from 'react-router-dom'
import { MapPin, Plus, Search, SquarePlay, User } from 'lucide-react'
import { useDesignState } from '../../lib/design-state'
import { t } from '../../i18n'

/**
 * TEIL B.3 — Untere Navigationsleiste, nur auf schmalen Bildschirmen.
 *
 * Unterschied zwischen den beiden Zielen:
 *
 *   App     fünf Punkte, „Aufnehmen“ mittig und hervorgehoben
 *   Website vier Punkte ohne „Aufnehmen“ — Videos aufnehmen gehört zur App,
 *           nicht auf eine Internetseite
 *
 * Am Rechner erscheint die Leiste gar nicht; dort führt die Kopfleiste (B.1/B.2).
 */
export function BottomNav({ dark }) {
  const { isApp, isDesktop } = useDesignState()

  if (isDesktop) return null

  const active = ({ isActive }) => (isActive ? 'is-active' : '')

  return (
    <nav className={`bottom-nav ${dark ? 'bottom-nav-dark' : ''}`} aria-label="Hauptnavigation">
      <NavLink to="/feed" className={active}>
        <SquarePlay size={22} />
        <span className="t-tiny">{t('bottomNav.feed')}</span>
      </NavLink>
      <NavLink to="/karte" className={active}>
        <MapPin size={22} />
        <span className="t-tiny">{t('bottomNav.map')}</span>
      </NavLink>

      {isApp && (
        <NavLink to="/upload" className={active}>
          <span className="nav-capture"><Plus size={22} /></span>
          <span className="t-tiny">{t('bottomNav.capture')}</span>
        </NavLink>
      )}

      <NavLink to="/suche" className={active}>
        <Search size={22} />
        <span className="t-tiny">{t('bottomNav.search')}</span>
      </NavLink>
      <NavLink to="/profil" className={active}>
        <User size={22} />
        <span className="t-tiny">{t('bottomNav.profile')}</span>
      </NavLink>
    </nav>
  )
}
