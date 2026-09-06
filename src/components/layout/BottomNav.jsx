import { NavLink } from 'react-router-dom'
import { MapPin, Plus, Search, SquarePlay, User } from 'lucide-react'
import { t } from '../../i18n'

/** TEIL B.3 — Untere Navigationsleiste, nur Mobil. Fünf Punkte, Aufnehmen mittig. */
export function BottomNav({ dark }) {
  const item = ({ isActive }) => (isActive ? 'is-active' : '')
  return (
    <nav className={`bottom-nav ${dark ? 'bottom-nav-dark' : ''}`} aria-label="Hauptnavigation">
      <NavLink to="/feed" className={item}>
        <SquarePlay size={22} />
        <span className="t-tiny">{t('bottomNav.feed')}</span>
      </NavLink>
      <NavLink to="/karte" className={item}>
        <MapPin size={22} />
        <span className="t-tiny">{t('bottomNav.map')}</span>
      </NavLink>
      <NavLink to="/upload" className={item}>
        <span className="nav-capture"><Plus size={22} /></span>
        <span className="t-tiny">{t('bottomNav.capture')}</span>
      </NavLink>
      <NavLink to="/suche" className={item}>
        <Search size={22} />
        <span className="t-tiny">{t('bottomNav.search')}</span>
      </NavLink>
      <NavLink to="/profil" className={item}>
        <User size={22} />
        <span className="t-tiny">{t('bottomNav.profile')}</span>
      </NavLink>
    </nav>
  )
}
