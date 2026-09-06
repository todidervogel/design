import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { Switch } from '../ui'
import { useDesignState } from '../../lib/design-state'
import { t } from '../../i18n'

/**
 * Design-Panel — Werkzeug für die Abnahme, kein Bestandteil des Produkts.
 * Schaltet die drei Screen-Varianten (K.4), die Sitzung (B.1/B.2) und die
 * beiden Banner um.
 */
export function DevPanel() {
  const [open, setOpen] = useState(false)
  const s = useDesignState()

  if (!open) {
    return (
      <button type="button" className="dev-toggle" onClick={() => setOpen(true)} aria-label={t('dev.open')} title={t('dev.title')}>
        <SlidersHorizontal size={18} />
      </button>
    )
  }

  return (
    <>
      <button type="button" className="dev-toggle" onClick={() => setOpen(false)} aria-label={t('common.close')}>
        <X size={18} />
      </button>
      <div className="dev-panel stack-3">
        <div className="row-between">
          <strong>{t('dev.title')}</strong>
          <span className="t-tiny c-tertiary">{t('dev.note')}</span>
        </div>

        <div>
          <p className="t-small c-secondary" style={{ marginBottom: 4 }}>{t('dev.state')}</p>
          <div className="seg">
            {['filled', 'empty', 'loading'].map((v) => (
              <button key={v} type="button" aria-pressed={s.state === v} onClick={() => s.setState(v)}>
                {t(`dev.states.${v}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="t-small c-secondary" style={{ marginBottom: 4 }}>{t('dev.session')}</p>
          <div className="seg">
            {['guest', 'user'].map((v) => (
              <button key={v} type="button" aria-pressed={s.session === v} onClick={() => s.setSession(v)}>
                {t(`dev.sessions.${v}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="row-between">
          <span className="t-small">{t('dev.buildBanner')}</span>
          <Switch checked={s.buildBanner} onChange={s.setBuildBanner} label={t('dev.buildBanner')} />
        </div>
        <div className="row-between">
          <span className="t-small">{t('dev.cookieBanner')}</span>
          <Switch checked={s.cookieBanner} onChange={s.setCookieBanner} label={t('dev.cookieBanner')} />
        </div>

        <Link to="/uebersicht" className="btn btn-secondary btn-full btn-sm" onClick={() => setOpen(false)}>
          {t('dev.screenIndex')}
        </Link>
      </div>
    </>
  )
}
