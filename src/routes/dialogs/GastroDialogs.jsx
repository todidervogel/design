import { useState } from 'react'
import { FileUp } from 'lucide-react'
import {
  Button, Checkbox, Dropzone, Field, Input, Modal, ModalActions, Notice, Radio,
  Select, Textarea, charCount, useToast,
} from '../../components/ui'
import { t } from '../../i18n'

const REPORT_REASONS = ['neverThere', 'falseClaims', 'hate', 'mixup', 'blackmail', 'other']

/** F.8 — Dialog „Bewertung melden“ (Gastro) */
export function ReportReviewDialog({ open, onClose }) {
  const [reason, setReason] = useState('neverThere')
  const [text, setText] = useState('')
  const toast = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('gastro.reportReview.title')}
      description={t('gastro.reportReview.text')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="primary" onClick={() => { onClose?.(); toast(t('toast.reportReceived')) }}>
            {t('gastro.reportReview.submit')}
          </Button>
        </ModalActions>
      }
    >
      <div className="stack-2">
        {REPORT_REASONS.map((r) => (
          <Radio key={r} name="report-review" label={t(`gastro.reportReview.reasons.${r}`)} checked={reason === r} onChange={() => setReason(r)} />
        ))}
      </div>

      <div className="stack-3" style={{ marginTop: 'var(--sp-4)' }}>
        <Field label={t('gastro.reportReview.reasonLabel')} required count={charCount(text, 1000)}>
          {(id) => (
            <Textarea
              id={id}
              rows={5}
              maxLength={1000}
              placeholder={t('gastro.reportReview.reasonPlaceholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}
        </Field>
        <Field label={t('gastro.reportReview.evidenceLabel')}>
          <Dropzone icon={FileUp} small text={t('gastro.setup.dropImage')} hint={t('gastro.reportReview.evidenceHint')} />
        </Field>
      </div>

      <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-3)' }}>{t('gastro.reportReview.hint')}</p>
    </Modal>
  )
}

/** F.12 — Dialog „Betrieb als geschlossen melden“ */
export function CloseBusinessDialog({ open, onClose }) {
  const [mode, setMode] = useState('permanent')
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const toast = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('gastro.close.title')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="danger" disabled={!confirmed} onClick={() => { onClose?.(); toast(t('toast.noAction'), 'info') }}>
            {t('gastro.close.submit')}
          </Button>
        </ModalActions>
      }
    >
      <div className="stack-2">
        <Radio name="close-mode" label={t('gastro.close.permanent')} checked={mode === 'permanent'} onChange={() => setMode('permanent')} />
        <Radio name="close-mode" label={t('gastro.close.temporary')} checked={mode === 'temporary'} onChange={() => setMode('temporary')} />
      </div>

      {mode === 'temporary' && (
        <div style={{ marginTop: 'var(--sp-3)' }}>
          <Field label={t('gastro.close.reopenLabel')}>
            {(id) => <Input id={id} type="date" />}
          </Field>
        </div>
      )}

      {mode === 'permanent' && (
        <Notice className="stack-2" style={{ marginTop: 'var(--sp-4)', display: 'block' }}>
          <p className="t-body-bold">{t('gastro.close.consequencesTitle')}</p>
          <ul style={{ margin: 'var(--sp-2) 0 0', paddingLeft: 'var(--sp-4)' }}>
            {['c1', 'c2', 'c3', 'c4', 'c5'].map((k) => <li key={k}>{t(`gastro.close.${k}`)}</li>)}
          </ul>
        </Notice>
      )}

      <div className="stack-3" style={{ marginTop: 'var(--sp-4)' }}>
        <Field label={t('gastro.close.reasonLabel')}>
          {(id) => (
            <Select
              id={id}
              placeholder="—"
              onChange={(e) => setReason(e.target.value)}
              options={['aufgabe', 'umzug', 'verkauf', 'renovierung', 'other'].map((v) => ({ value: v, label: t(`gastro.close.reasons.${v}`) }))}
            />
          )}
        </Field>

        {reason === 'umzug' && (
          <Field label={t('gastro.close.newAddress')}>
            {(id) => <Input id={id} placeholder={t('upload.missing.addressPlaceholder')} />}
          </Field>
        )}

        <Checkbox label={<>{t('gastro.close.confirm')} <span className="field-required">*</span></>} checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
      </div>
    </Modal>
  )
}

/** F.11 — Hinweis-Dialog „Verifizierung“ */
export function VerificationDialog({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('gastro.settings.startVerification')}
      description={t('gastro.settings.verificationDialogText')}
      actions={<Button variant="primary" onClick={onClose}>{t('gastro.settings.verificationDialogOk')}</Button>}
    />
  )
}
