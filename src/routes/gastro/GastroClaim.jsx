import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Search } from 'lucide-react'
import {
  Button, Checkbox, EmptyState, Field, Input, Select, Skeleton,
} from '../../components/ui'
import { Page } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { places } from '../../mock/places'
import { t, tNodes } from '../../i18n'

const ROLES = ['owner', 'management', 'marketing', 'staff']
const TYPES = ['restaurant', 'cafe', 'bar', 'imbiss', 'baeckerei', 'eisdiele', 'pub', 'sonstiges']

/** F.14 — Betrieb eintragen */
export default function GastroClaim() {
  const { isEmpty, isLoading } = useDesignState()
  const [mode, setMode] = useState(null) // null | 'claim' | 'new'
  const [done, setDone] = useState(false)
  const list = isEmpty ? [] : places.slice(0, 3)

  if (done) {
    return (
      <Page title={t('gastro.claim.doneTitle')} footer={false}>
        <div style={{ paddingBlock: 'var(--sp-16)' }}>
          <EmptyState
            icon={CheckCircle2}
            title={t('gastro.claim.doneTitle')}
            text={t('gastro.claim.doneText')}
            action={<Button variant="primary" to="/">{t('errors.e404.cta')}</Button>}
          />
        </div>
      </Page>
    )
  }

  return (
    <Page title={t('gastro.claim.title')} headerSuffix={t('gastro.brandSuffix')}>
      <div style={{ paddingBlock: 'var(--sp-8) var(--sp-16)', maxWidth: 560 }} className="stack-6">
        <div>
          <h1 className="t-h1">{t('gastro.claim.title')}</h1>
          <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('gastro.claim.text')}</p>
        </div>

        {mode === null && (
          <>
            <div className="header-search" style={{ maxWidth: 'none' }}>
              <Search size={18} className="search-icon" />
              <input className="input" style={{ height: 44 }} placeholder={t('gastro.claim.searchPlaceholder')} aria-label={t('common.search')} />
            </div>

            <Field label={t('gastro.claim.cityLabel')}>
              {(id) => <Input id={id} placeholder={t('gastro.claim.cityPlaceholder')} />}
            </Field>

            {isLoading ? (
              <div className="stack-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={64} radius="var(--r-card)" />)}</div>
            ) : (
              <div className="list-group">
                {list.map((p) => (
                  <div className="list-row list-row-static" key={p.id}>
                    <span className="grow">
                      <span className="t-body-bold" style={{ display: 'block' }}>{p.name}</span>
                      <span className="t-small c-secondary">{p.address}</span>
                    </span>
                    <Button variant="secondary" size="sm" onClick={() => setMode('claim')}>{t('gastro.claim.isMine')}</Button>
                  </div>
                ))}
              </div>
            )}

            <Button variant="quiet" onClick={() => setMode('new')} style={{ marginLeft: -8 }}>
              {t('gastro.claim.notFound')}
            </Button>
          </>
        )}

        {mode !== null && (
          <>
            <h2 className="t-h2">{mode === 'claim' ? t('gastro.claim.formClaimTitle') : t('gastro.claim.formNewTitle')}</h2>

            <div className="stack-4">
              <Field label={t('gastro.claim.yourName')} required>
                {(id) => <Input id={id} />}
              </Field>
              <Field label={t('gastro.claim.yourRole')} required>
                {(id) => <Select id={id} placeholder="—" options={ROLES.map((r) => ({ value: r, label: t(`gastro.claim.roles.${r}`) }))} />}
              </Field>
              <Field label={t('gastro.claim.email')} required hint={t('gastro.claim.emailHint')}>
                {(id) => <Input id={id} type="email" placeholder={t('auth.register.emailPlaceholder')} />}
              </Field>
              <Field label={t('gastro.claim.phone')} required>
                {(id) => <Input id={id} type="tel" />}
              </Field>

              {mode === 'new' && (
                <>
                  <Field label={t('gastro.claim.businessName')} required>
                    {(id) => <Input id={id} placeholder={t('upload.missing.namePlaceholder')} />}
                  </Field>
                  <Field label={t('gastro.claim.street')} required>
                    {(id) => <Input id={id} />}
                  </Field>
                  <div className="row" style={{ gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                    <Field label={t('gastro.claim.zip')} required className="grow">
                      {(id) => <Input id={id} />}
                    </Field>
                    <Field label={t('gastro.claim.city')} required className="grow">
                      {(id) => <Input id={id} />}
                    </Field>
                  </div>
                  <Field label={t('gastro.claim.type')} required>
                    {(id) => <Select id={id} placeholder="—" options={TYPES.map((v) => ({ value: v, label: t(`categories.${v}`) }))} />}
                  </Field>
                </>
              )}

              <Checkbox label={<>{t('gastro.claim.authorized')} <span className="field-required">*</span></>} />
              <Checkbox
                label={
                  <>
                    {tNodes('gastro.claim.acceptTerms', {
                      terms: <Link to="/agb-gastro" className="c-accent">{t('gastro.welcome.termsLink')}</Link>,
                    })}
                    <span className="field-required">*</span>
                  </>
                }
              />

              <div className="row">
                <Button variant="secondary" onClick={() => setMode(null)}>{t('common.back')}</Button>
                <Button variant="primary" onClick={() => setDone(true)}>{t('gastro.claim.submit')}</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Page>
  )
}
