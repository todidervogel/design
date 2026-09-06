import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AffixInput, Button, Checkbox, Field, Input, PasswordInput, Select, StrengthMeter,
} from '../../components/ui'
import { CenteredPage } from '../../components/layout'
import { t, tNodes } from '../../i18n'

const days = Array.from({ length: 31 }, (_, i) => String(i + 1))
const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const years = Array.from({ length: 90 }, (_, i) => String(2010 - i))

/**
 * D.1 — Registrierung
 *
 * Es findet KEINE Validierung statt. Über den Schalter „Fehlerzustände zeigen“
 * lassen sich alle Fehlertexte aus der Spezifikation sichtbar machen.
 */
export default function Register() {
  const [showErrors, setShowErrors] = useState(false)

  return (
    <CenteredPage title={t('auth.register.title')}>
      <h1 className="t-h1">{t('auth.register.title')}</h1>
      <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('auth.register.subtitle')}</p>

      <div className="stack-4" style={{ marginTop: 'var(--sp-6)' }}>
        <Field label={t('auth.register.email')} required error={showErrors ? t('auth.register.errors.email') : undefined}>
          {(id) => <Input id={id} type="email" placeholder={t('auth.register.emailPlaceholder')} />}
        </Field>

        <Field label={t('auth.register.phone')} required hint={t('auth.register.phoneHint')}>
          {(id) => <AffixInput id={id} prefixSelect={['+49', '+43', '+41']} placeholder={t('auth.register.phonePlaceholder')} />}
        </Field>

        <Field
          label={t('auth.register.username')}
          required
          hint={t('auth.register.usernameHint')}
          error={showErrors ? t('auth.register.errors.usernameTaken') : undefined}
        >
          {(id) => <AffixInput id={id} prefix="@" placeholder={t('auth.register.usernamePlaceholder')} />}
        </Field>

        <Field
          label={t('auth.register.password')}
          required
          hint={t('auth.register.passwordHint')}
          error={showErrors ? t('auth.register.errors.passwordShort') : undefined}
        >
          {(id) => (
            <>
              <PasswordInput id={id} />
              <StrengthMeter level={2} />
            </>
          )}
        </Field>

        <Field
          label={t('auth.register.birthday')}
          required
          hint={t('auth.register.birthdayHint')}
          error={showErrors ? t('auth.register.errors.age') : undefined}
        >
          <div className="row" style={{ gap: 'var(--sp-2)' }}>
            <Select placeholder={t('auth.register.day')} options={days} aria-label={t('auth.register.day')} />
            <Select placeholder={t('auth.register.month')} options={months} aria-label={t('auth.register.month')} />
            <Select placeholder={t('auth.register.year')} options={years} aria-label={t('auth.register.year')} />
          </div>
        </Field>

        <div className="stack-2">
          <Checkbox
            label={
              <>
                {tNodes('auth.register.acceptTerms', {
                  terms: <Link to="/agb" className="c-accent">{t('footer.terms')}</Link>,
                  privacy: <Link to="/datenschutz" className="c-accent">{t('footer.privacy')}</Link>,
                })}
                <span className="field-required">*</span>
              </>
            }
          />
          {showErrors && <p className="field-error" style={{ marginLeft: 30 }}>{t('auth.register.errors.terms')}</p>}
          <Checkbox label={<>{t('auth.register.acceptLocation')} <span className="field-required">*</span></>} />
          <Checkbox label={`${t('auth.register.acceptNews')} (${t('common.optional')})`} />
        </div>

        <Button variant="primary" full to="/registrieren/code">{t('auth.register.submit')}</Button>

        <p className="t-small c-secondary" style={{ textAlign: 'center' }}>
          {t('auth.register.haveAccount')} <Link to="/anmelden" className="c-accent">{t('auth.register.loginLink')}</Link>
        </p>

        {/* Nur für die Design-Abnahme: schaltet alle Fehlertexte sichtbar. */}
        <div className="card card-flat row-between">
          <span className="t-small c-secondary">Fehlerzustände zeigen (A.5)</span>
          <Button variant="quiet" size="sm" onClick={() => setShowErrors((v) => !v)}>
            {showErrors ? 'Aus' : 'An'}
          </Button>
        </div>
      </div>
    </CenteredPage>
  )
}
