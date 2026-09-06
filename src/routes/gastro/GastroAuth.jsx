import { Link } from 'react-router-dom'
import { Button, Checkbox, Field, Input, PasswordInput, StrengthMeter } from '../../components/ui'
import { CenteredPage } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { t, tNodes } from '../../i18n'

/** F.1 — Gastro-Anmeldung */
export function GastroLogin() {
  const { setSession } = useDesignState()
  return (
    <CenteredPage title={t('gastro.login.title')} headerSuffix={t('gastro.brandSuffix')} minimalHeader>
      <h1 className="t-h1">{t('gastro.login.title')}</h1>
      <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('gastro.login.text')}</p>

      <div className="stack-4" style={{ marginTop: 'var(--sp-6)' }}>
        <Field label={t('gastro.profile.email')} required>
          {(id) => <Input id={id} type="email" placeholder={t('auth.register.emailPlaceholder')} />}
        </Field>
        <Field label={t('auth.login.password')} required>
          {(id) => <PasswordInput id={id} />}
        </Field>
        <div style={{ textAlign: 'right', marginTop: 'calc(var(--sp-4) * -1 + var(--sp-1))' }}>
          <Link to="/passwort-vergessen" className="btn btn-quiet btn-sm">{t('auth.login.forgot')}</Link>
        </div>

        <Button variant="primary" full to="/gastro/willkommen" onClick={() => setSession('user')}>
          {t('auth.login.submit')}
        </Button>

        <hr className="divider" />

        <p className="t-small c-secondary" style={{ textAlign: 'center' }}>
          {t('gastro.login.noAccess')}{' '}
          <Link to="/gastro/eintragen" className="c-accent">{t('gastro.login.claimLink')}</Link>
        </p>
      </div>
    </CenteredPage>
  )
}

/** F.2 — Erstes Passwort setzen */
export function GastroWelcome() {
  return (
    <CenteredPage title={t('gastro.welcome.title')} headerSuffix={t('gastro.brandSuffix')} minimalHeader>
      <h1 className="t-h1">{t('gastro.welcome.title')}</h1>
      <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('gastro.welcome.text')}</p>

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

        <Checkbox
          label={
            <>
              {tNodes('gastro.welcome.accept', {
                terms: <Link to="/agb-gastro" className="c-accent">{t('gastro.welcome.termsLink')}</Link>,
              })}
              <span className="field-required">*</span>
            </>
          }
        />

        <Button variant="primary" full to="/gastro/einrichtung">{t('common.next')}</Button>
      </div>
    </CenteredPage>
  )
}
