import { useState } from 'react'
import { Button, Field, Modal, ModalActions, Radio, Textarea, charCount, useToast } from '../../components/ui'
import { t } from '../../i18n'

const REASONS = ['closed', 'address', 'hours', 'contact', 'notExist', 'other']

/** C.4 — Dialog „Problem melden“ (Betrieb) */
export function ReportPlaceDialog({ open, onClose }) {
  const [reason, setReason] = useState('closed')
  const [text, setText] = useState('')
  const toast = useToast()

  const submit = () => {
    onClose?.()
    toast(t('toast.reportThanks'))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('reportPlace.title')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="primary" onClick={submit}>{t('reportPlace.submit')}</Button>
        </ModalActions>
      }
    >
      <div className="stack-2">
        {REASONS.map((r) => (
          <Radio
            key={r}
            name="report-place"
            label={t(`reportPlace.reasons.${r}`)}
            checked={reason === r}
            onChange={() => setReason(r)}
          />
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-4)' }}>
        <Field label={t('reportPlace.explanationLabel')} count={charCount(text, 500)}>
          <Textarea
            rows={4}
            maxLength={500}
            placeholder={t('reportPlace.explanationPlaceholder')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
      </div>

      <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-3)' }}>{t('reportPlace.hint')}</p>
    </Modal>
  )
}
