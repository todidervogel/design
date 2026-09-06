import { Link, useNavigate } from 'react-router-dom'
import { Bell, Bookmark, CircleHelp, LogOut, Menu as MenuIcon, Search, Settings, User } from 'lucide-react'
import { Avatar, Button, IconButton, Menu, MenuItem, MenuSeparator } from '../ui'
import { useDesignState } from '../../lib/design-state'
import { APP_NAME } from '../../config'
import { t } from '../../i18n'
import { me } from '../../mock/content'

/** Wortmarke — zieht den Produktnamen aus der zentralen Konstante. */
export function Wordmark({ suffix, to = '/' }) {
  return (
    <Link to={to} className="wordmark">
      {APP_NAME}
      {suffix && <span className="wordmark-suffix"> {suffix}</span>}
    </Link>
  )
}

/**
 * TEIL B.1 / B.2 — Kopfleiste Web.
 * Nicht eingeloggt: Suchfeld, „Für Gastronomen“, Anmelden, Registrieren.
 * Eingeloggt: Suchfeld, Glocke, Avatar mit Aufklappmenü.
 */
export function Header({ suffix, minimal }) {
  const { loggedIn, setSession } = useDesignState()
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="container header-inner">
        <Wordmark suffix={suffix} />

        {!minimal && (
          <>
            <form
              className="header-search only-desktop"
              onSubmit={(e) => { e.preventDefault(); navigate('/suche') }}
              role="search"
            >
              <Search size={18} className="search-icon" />
              <input className="input" type="search" placeholder={t('header.searchPlaceholder')} aria-label={t('common.search')} />
            </form>

            <div className="header-actions">
              {/* Mobil: Suchsymbol und Hamburger-Menü */}
              <span className="only-mobile row" style={{ gap: 0 }}>
                <IconButton icon={Search} label={t('common.search')} to="/suche" />
                <Menu
                  align="right"
                  trigger={({ toggle }) => <IconButton icon={MenuIcon} label={t('header.menu')} onClick={toggle} />}
                >
                  {({ close }) => (
                    <>
                      <MenuItem onClick={() => { close(); navigate('/karte') }}>{t('footer.map')}</MenuItem>
                      <MenuItem onClick={() => { close(); navigate('/feed') }}>{t('footer.feed')}</MenuItem>
                      <MenuItem onClick={() => { close(); navigate('/fuer-gastronomen') }}>{t('header.forRestaurants')}</MenuItem>
                      <MenuSeparator />
                      {loggedIn ? (
                        <>
                          <MenuItem icon={User} onClick={() => { close(); navigate('/profil') }}>{t('header.avatarMenu.profile')}</MenuItem>
                          <MenuItem icon={Settings} onClick={() => { close(); navigate('/einstellungen') }}>{t('header.avatarMenu.settings')}</MenuItem>
                          <MenuItem icon={LogOut} onClick={() => { close(); setSession('guest') }}>{t('header.avatarMenu.logout')}</MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem onClick={() => { close(); navigate('/anmelden') }}>{t('header.login')}</MenuItem>
                          <MenuItem onClick={() => { close(); navigate('/registrieren') }}>{t('header.register')}</MenuItem>
                        </>
                      )}
                    </>
                  )}
                </Menu>
              </span>

              <span className="only-desktop row" style={{ gap: 'var(--sp-2)' }}>
                {loggedIn ? (
                  <>
                    <span style={{ position: 'relative' }}>
                      <IconButton icon={Bell} label={t('header.notifications')} to="/benachrichtigungen" />
                      <span className="notif-dot" />
                    </span>
                    <Menu
                      align="right"
                      trigger={({ toggle }) => (
                        <button type="button" className="btn btn-icon" onClick={toggle} aria-label={me.username}>
                          <Avatar name={me.username} size={32} />
                        </button>
                      )}
                    >
                      {({ close }) => (
                        <>
                          <MenuItem icon={User} onClick={() => { close(); navigate('/profil') }}>{t('header.avatarMenu.profile')}</MenuItem>
                          <MenuItem icon={Bookmark} onClick={() => { close(); navigate('/profil?tab=saved') }}>{t('header.avatarMenu.saved')}</MenuItem>
                          <MenuItem icon={Settings} onClick={() => { close(); navigate('/einstellungen') }}>{t('header.avatarMenu.settings')}</MenuItem>
                          <MenuSeparator />
                          <MenuItem icon={CircleHelp} onClick={close}>{t('header.avatarMenu.help')}</MenuItem>
                          <MenuItem icon={LogOut} onClick={() => { close(); setSession('guest') }}>{t('header.avatarMenu.logout')}</MenuItem>
                        </>
                      )}
                    </Menu>
                  </>
                ) : (
                  <>
                    <Link to="/fuer-gastronomen" className="btn btn-quiet">{t('header.forRestaurants')}</Link>
                    <Button variant="secondary" to="/anmelden">{t('header.login')}</Button>
                    <Button variant="primary" to="/registrieren">{t('header.register')}</Button>
                  </>
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
