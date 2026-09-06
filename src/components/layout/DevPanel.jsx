import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { Switch } from '../ui'
import { useDesignState } from '../../lib/design-state'
import { t } from '../../i18n'

/** Kleine Auswahlleiste mit zwei oder drei Schaltern. */
function Segmented({ label, options, value, onChange, hint }) {
  return (
    <div>
      <p className="t-small c-secondary" style={{ marginBottom: 4 }}>{label}</p>
      <div className="seg">
        {options.map(({ id, label: text, disabled }) => (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            disabled={disabled}
            style={disabled ? { opacity: 0.4, cursor: 'default' } : undefined}
            onClick={() => !disabled && onChange(id)}
          >
            {text}
          </button>
        ))}
      </div>
      {hint && <p className="t-small c-tertiary" style={{ marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

/**
 * Design-Panel — Werkzeug für die Abnahme, kein Bestandteil des Produkts.
 * Schaltet Ziel (Website/App), Gerät, Anmeldung, Darstellung, die drei
 * Screen-Varianten (K.4) und die beiden Banner um.
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

        <Segmented
          label={t('dev.platform')}
          value={s.platform}
          onChange={s.setPlatform}
          options={[
            { id: 'web', label: t('dev.platforms.web') },
            { id: 'app', label: t('dev.platforms.app') },
          ]}
        />

        <p className="t-small c-secondary">
          {t('dev.device')}:{' '}
          <strong className="c-primary">{t(`dev.devices.${s.device}`)}</strong>
          {s.os !== 'desktop' && s.os !== 'unknown' && ` · ${s.os}`}
          <br />
          <span className="t-tiny c-tertiary">{t('dev.deviceHint')}</span>
        </p>

        <Segmented
          label={t('dev.session')}
          value={s.session}
          onChange={s.setSession}
          hint={s.isApp ? t('dev.guestInApp') : undefined}
          options={[
            { id: 'guest', label: t('dev.sessions.guest') },
            { id: 'user', label: t('dev.sessions.user') },
          ]}
        />

        <Segmented
          label={t('dev.theme')}
          value={s.darkMode ? 'dark' : 'light'}
          onChange={(v) => s.setTheme(v)}
          hint={s.isWeb ? t('settings.appearanceHint') : undefined}
          options={[
            { id: 'light', label: t('dev.themes.light') },
            { id: 'dark', label: t('dev.themes.dark'), disabled: s.isWeb },
          ]}
        />

        <Segmented
          label={t('dev.state')}
          value={s.state}
          onChange={s.setState}
          options={['filled', 'empty', 'loading'].map((id) => ({ id, label: t(`dev.states.${id}`) }))}
        />

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
