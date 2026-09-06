import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, Field, Input, PasswordInput, StrengthMeter, EmptyState } from '../../components/ui'
import { CenteredPage } from '../../components/layout'
import { t } from '../../i18n'

/** D.4 — Passwort vergessen */
export function ForgotPassword() {
  const [sent, setSent] = useState(false)

  return (
    <CenteredPage title={t('auth.forgot.title')}>
      {sent ? (
        <EmptyState
          icon={CheckCircle2}
          title={t('auth.forgot.sentTitle')}
          text={t('auth.forgot.sentText')}
          action={<Button variant="quiet" to="/anmelden">{t('auth.forgot.backToLogin')}</Button>}
        />
      ) : (
        <>
          <h1 className="t-h1">{t('auth.forgot.title')}</h1>
          <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('auth.forgot.text')}</p>
          <div className="stack-4" style={{ marginTop: 'var(--sp-6)' }}>
            <Field label={t('auth.register.email')} required>
              {(id) => <Input id={id} type="email" placeholder={t('auth.register.emailPlaceholder')} />}
            </Field>
            <Button variant="primary" full onClick={() => setSent(true)}>{t('auth.forgot.submit')}</Button>
          </div>
        </>
      )}
    </CenteredPage>
  )
}

/** D.5 — Neues Passwort */
export function NewPassword() {
  return (
    <CenteredPage title={t('auth.newPassword.title')}>
      <h1 className="t-h1">{t('auth.newPassword.title')}</h1>
      <div className="stack-4" style={{ marginTop: 'var(--sp-6)' }}>
        <Field label={t('auth.newPassword.password')} required>
          {(id) => (
            <>
              <PasswordInput id={id} autoComplete="new-password" />
              <StrengthMeter level={3} />
            </>
          )}
        </Field>
        <Field label={t('auth.newPassword.repeat')} required>
          {(id) => <PasswordInput id={id} autoComplete="new-password" />}
        </Field>
        <Button variant="primary" full to="/anmelden">{t('auth.newPassword.submit')}</Button>
      </div>
    </CenteredPage>
  )
}
