import { useState } from 'react'
import { Button, Field, Modal, ModalActions, Radio, Textarea, useToast } from '../../components/ui'
import { t } from '../../i18n'

const REASONS = ['spam', 'hate', 'fake', 'wrong', 'violence', 'sexual', 'copyright', 'other']

/** E.14 — Dialog „Melden“ (Video / Bewertung / Profil) */
export function ReportContentDialog({ open, onClose }) {
  const [reason, setReason] = useState('spam')
  const toast = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('reportContent.title')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="primary" onClick={() => { onClose?.(); toast(t('toast.reportReceived')) }}>
            {t('reportContent.submit')}
          </Button>
        </ModalActions>
      }
    >
      <div className="stack-2">
        {REASONS.map((r) => (
          <Radio key={r} name="report-content" label={t(`reportContent.reasons.${r}`)} checked={reason === r} onChange={() => setReason(r)} />
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-4)' }}>
        <Field label={t('reportContent.explanationLabel')}>
          <Textarea rows={3} />
        </Field>
      </div>

      <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-3)' }}>{t('reportContent.hint')}</p>
    </Modal>
  )
}
