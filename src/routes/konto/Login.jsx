import { Link } from 'react-router-dom'
import { Button, Field, Input, PasswordInput } from '../../components/ui'
import { CenteredPage } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { t } from '../../i18n'

/** D.3 — Anmelden */
export default function Login() {
  const { setSession } = useDesignState()

  return (
    <CenteredPage title={t('auth.login.title')}>
      <h1 className="t-h1">{t('auth.login.title')}</h1>

      <div className="stack-4" style={{ marginTop: 'var(--sp-6)' }}>
        <Field label={t('auth.login.identifier')} required>
          {(id) => <Input id={id} autoComplete="username" />}
        </Field>

        <Field label={t('auth.login.password')} required>
          {(id) => <PasswordInput id={id} autoComplete="current-password" />}
        </Field>

        <div style={{ textAlign: 'right', marginTop: 'calc(var(--sp-4) * -1 + var(--sp-1))' }}>
          <Link to="/passwort-vergessen" className="btn btn-quiet btn-sm">{t('auth.login.forgot')}</Link>
        </div>

        <Button variant="primary" full to="/feed" onClick={() => setSession('user')}>{t('auth.login.submit')}</Button>

        <div className="row" style={{ gap: 'var(--sp-3)' }}>
          <hr className="divider grow" />
          <span className="t-small c-tertiary">{t('common.or')}</span>
          <hr className="divider grow" />
        </div>

        <Button variant="secondary" full to="/gastro/anmelden">{t('auth.login.gastro')}</Button>

        <p className="t-small c-secondary" style={{ textAlign: 'center' }}>
          {t('auth.login.noAccount')} <Link to="/registrieren" className="c-accent">{t('auth.login.registerLink')}</Link>
        </p>
      </div>
    </CenteredPage>
  )
}
