import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { Button, Card, Field, Input, Select, charCount, useToast } from '../../components/ui'
import { GastroShell } from './GastroShell'
import { ConsoleHeader } from '../../components/layout'
import { myPlace } from '../../mock/places'
import { t } from '../../i18n'

const TEMPLATES = ['a6', 'a4', 'sticker', 'plain']

/** F.10 — Gastro-QR-Codes */
export default function GastroQr() {
  const [template, setTemplate] = useState('a6')
  const [text, setText] = useState(t('gastro.qr.textPlaceholder'))
  const toast = useToast()

  return (
    <GastroShell title={t('gastro.qr.title')}>
      <ConsoleHeader title={t('gastro.qr.title')} />
      <p className="t-body c-secondary" style={{ marginTop: 'calc(var(--sp-6) * -1)', marginBottom: 'var(--sp-6)', maxWidth: 560 }}>
        {t('gastro.qr.text')}
      </p>

      <div className="split" style={{ maxWidth: 860 }}>
        {/* Vorschau */}
        <Card style={{ display: 'grid', justifyItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-8)' }}>
          <div
            style={{
              width: 240, height: 240, display: 'grid', placeItems: 'center',
              border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: '#fff',
            }}
          >
            <QrCode size={180} strokeWidth={1} />
          </div>
          <p className="t-body-bold">{myPlace.name}</p>
          <p className="t-small c-secondary" style={{ textAlign: 'center' }}>{text}</p>
        </Card>

        {/* Einstellungen */}
        <div className="stack-6">
          <div>
            <p className="field-label">{t('gastro.qr.templateLabel')}</p>
            <div style={{ display: 'grid', gap: 'var(--sp-2)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  className="card"
                  onClick={() => setTemplate(tpl)}
                  style={{
                    textAlign: 'left', cursor: 'pointer',
                    borderColor: template === tpl ? 'var(--accent)' : 'var(--border)',
                    background: template === tpl ? 'var(--accent-soft)' : 'var(--bg-light)',
                  }}
                >
                  <span className="t-body-bold" style={{ display: 'block' }}>{t(`gastro.qr.templates.${tpl}Title`)}</span>
                  <span className="t-small c-secondary">{t(`gastro.qr.templates.${tpl}Text`)}</span>
                </button>
              ))}
            </div>
          </div>

          <Field label={t('gastro.qr.textLabel')} count={charCount(text, 60)}>
            {(id) => <Input id={id} maxLength={60} value={text} onChange={(e) => setText(e.target.value)} />}
          </Field>

          <Field label={t('common.language')}>
            {(id) => <Select id={id} options={[t('common.german'), t('common.english')]} />}
          </Field>

          <div className="row-wrap">
            <Button variant="secondary" onClick={() => toast(t('toast.noAction'), 'info')}>{t('gastro.qr.preview')}</Button>
            <Button variant="primary" onClick={() => toast(t('toast.noAction'), 'info')}>{t('gastro.qr.downloadPdf')}</Button>
            <Button variant="quiet" onClick={() => toast(t('toast.noAction'), 'info')}>{t('gastro.qr.downloadPng')}</Button>
          </div>
        </div>
      </div>
    </GastroShell>
  )
}
