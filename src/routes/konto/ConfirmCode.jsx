import { useState } from 'react'
import { Button } from '../../components/ui'
import { CenteredPage } from '../../components/layout'
import { t } from '../../i18n'

/** D.2 — Handynummer bestätigen */
export default function ConfirmCode() {
  const [sent, setSent] = useState(false)

  return (
    <CenteredPage title={t('auth.code.title')}>
      <h1 className="t-h1">{t('auth.code.title')}</h1>
      <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>
        {t('auth.code.text', { phone: '+49 151 •••• 6789' })}
      </p>

      <div className="row" style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-6)' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            className="input"
            inputMode="numeric"
            maxLength={1}
            aria-label={`Ziffer ${i + 1}`}
            style={{ width: 48, height: 56, textAlign: 'center', fontSize: 19, fontWeight: 600, padding: 0 }}
          />
        ))}
      </div>

      <Button variant="primary" full to="/profil" style={{ marginTop: 'var(--sp-6)' }}>
        {t('auth.code.submit')}
      </Button>

      <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-4)' }}>
        {t('auth.code.notReceived')}{' '}
        {sent ? (
          <span className="c-tertiary">{t('auth.code.resendIn', { time: '0:59' })}</span>
        ) : (
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => setSent(true)}>{t('auth.code.resend')}</button>
        )}
      </p>
      <Button variant="quiet" size="sm" to="/registrieren" style={{ marginLeft: -8 }}>{t('auth.code.changeNumber')}</Button>
    </CenteredPage>
  )
}
