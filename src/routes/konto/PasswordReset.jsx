import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button, EmptyState, Field, Input, Notice, PasswordInput, StrengthMeter } from '../../components/ui'
import { CenteredPage } from '../../components/layout'
import { useSession } from '../../lib/session'
import { getDb, patch } from '../../lib/store/db'
import { rules, useForm } from '../../lib/form'
import { t } from '../../i18n'

/** Gleiche Stärkeregel wie bei der Registrierung. */
function strengthOf(password = '') {
  if (password.length < 8) return 1
  const variety = [/[a-zäöüß]/, /[A-ZÄÖÜ]/, /[0-9]/, /[^\w]/].filter((r) => r.test(password)).length
  if (password.length >= 12 && variety >= 3) return 3
  return variety >= 2 ? 2 : 1
}

/** D.4 — Passwort vergessen */
export function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    initial: { email: '' },
    schema: { email: [rules.required(), rules.email()] },
    onSubmit: (values) => {
      /* Ob es das Konto gibt, verrät die Seite bewusst nicht — sonst ließe
         sich damit prüfen, wer hier ein Konto hat. */
      const found = getDb().users.find((u) => u.email.toLowerCase() === values.email.trim().toLowerCase())
      if (found) sessionStorage.setItem('reset-user', found.id)
      setSent(true)
      return { ok: true }
    },
  })

  return (
    <CenteredPage title={t('auth.forgot.title')}>
      {sent ? (
        <EmptyState
          icon={CheckCircle2}
          title={t('auth.forgot.sentTitle')}
          text={t('auth.forgot.sentText')}
          action={<Button variant="primary" onClick={() => navigate('/passwort-neu')}>{t('auth.newPassword.title')}</Button>}
          secondaryAction={<Button variant="quiet" to="/anmelden">{t('auth.forgot.backToLogin')}</Button>}
        />
      ) : (
        <>
          <h1 className="t-h1">{t('auth.forgot.title')}</h1>
          <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('auth.forgot.text')}</p>
          <form className="stack-4" style={{ marginTop: 'var(--sp-6)' }} onSubmit={form.handleSubmit} noValidate>
            <Field label={t('auth.register.email')} required error={form.error('email')}>
              {(id) => <Input id={id} type="email" placeholder={t('auth.register.emailPlaceholder')} {...form.field('email')} />}
            </Field>
            <Button type="submit" variant="primary" full loading={form.submitting}>{t('auth.forgot.submit')}</Button>
          </form>
        </>
      )}
    </CenteredPage>
  )
}

/** D.5 — Neues Passwort */
export function NewPassword() {
  const { userId, changePassword } = useSession()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)

  const form = useForm({
    initial: { password: '', repeat: '' },
    schema: {
      password: [rules.required(), rules.password()],
      repeat: [rules.required(), rules.matches('password')],
    },
    onSubmit: (values) => {
      /* Entweder das angemeldete Konto oder das aus dem Zurücksetzen-Weg. */
      const target = userId ?? sessionStorage.getItem('reset-user')
      if (!target) return { ok: false, error: t('auth.errors.unknownAccount') }
      if (userId) changePassword(values.password)
      else patch('users', target, { password: values.password, mustChangePassword: false })
      sessionStorage.removeItem('reset-user')
      setDone(true)
      setTimeout(() => navigate(userId ? '/einstellungen' : '/anmelden', { replace: true }), 900)
      return { ok: true }
    },
  })

  return (
    <CenteredPage title={t('auth.newPassword.title')}>
      <h1 className="t-h1">{t('auth.newPassword.title')}</h1>

      <form className="stack-4" style={{ marginTop: 'var(--sp-6)' }} onSubmit={form.handleSubmit} noValidate>
        {form.formError && <Notice tone="danger">{form.formError}</Notice>}
        {done && <Notice tone="success">{t('common.saved')}</Notice>}

        <Field label={t('auth.newPassword.password')} required error={form.error('password')}>
          {(id) => (
            <>
              <PasswordInput id={id} autoComplete="new-password" {...form.field('password')} />
              <StrengthMeter level={strengthOf(form.values.password)} />
            </>
          )}
        </Field>
        <Field label={t('auth.newPassword.repeat')} required error={form.error('repeat')}>
          {(id) => <PasswordInput id={id} autoComplete="new-password" {...form.field('repeat')} />}
        </Field>
        <Button type="submit" variant="primary" full loading={form.submitting}>{t('auth.newPassword.submit')}</Button>
      </form>
    </CenteredPage>
  )
}
