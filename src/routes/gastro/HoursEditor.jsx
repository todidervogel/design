import { useState } from 'react'
import { Button, Switch } from '../../components/ui'
import { t } from '../../i18n'

const DAYS = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so']

/**
 * Öffnungszeiten-Tabelle — F.3 (Schritt 3) und F.9 (Abschnitt Öffnungszeiten).
 * Je Zeile: Wochentag · Schalter · zwei Zeitfelder · zweite Zeitspanne für die Mittagspause.
 */
export function HoursEditor() {
  const [open, setOpen] = useState({ mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false })
  const [extra, setExtra] = useState({})

  return (
    <div>
      <Button variant="quiet" size="sm" style={{ marginLeft: -8 }}>{t('hours.applyAll')}</Button>

      <div className="list-group" style={{ marginTop: 'var(--sp-2)' }}>
        {DAYS.map((d) => (
          <div className="list-row list-row-static" key={d} style={{ flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            <span className="t-body" style={{ width: 100, flex: 'none' }}>{t(`hours.days.${d}`)}</span>

            <Switch checked={!!open[d]} onChange={(v) => setOpen((s) => ({ ...s, [d]: v }))} label={t('hours.openLabel')} />
            <span className="t-small c-secondary" style={{ width: 72, flex: 'none' }}>
              {open[d] ? t('hours.openLabel') : t('hours.closed')}
            </span>

            {open[d] && (
              <span className="row grow" style={{ gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <input className="input" type="time" defaultValue="11:30" aria-label={t('hours.from')} style={{ width: 120, minHeight: 36 }} />
                <span className="t-small c-secondary">–</span>
                <input className="input" type="time" defaultValue="22:00" aria-label={t('hours.to')} style={{ width: 120, minHeight: 36 }} />

                {extra[d] && (
                  <>
                    <input className="input" type="time" defaultValue="15:00" style={{ width: 120, minHeight: 36 }} aria-label={t('hours.from')} />
                    <span className="t-small c-secondary">–</span>
                    <input className="input" type="time" defaultValue="18:00" style={{ width: 120, minHeight: 36 }} aria-label={t('hours.to')} />
                  </>
                )}

                {!extra[d] && (
                  <Button variant="quiet" size="sm" onClick={() => setExtra((s) => ({ ...s, [d]: true }))}>
                    {t('hours.addSpan')}
                  </Button>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
