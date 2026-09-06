import { Button, Field, Input, Modal, ModalActions, Select, Textarea, useToast } from '../../components/ui'
import { t } from '../../i18n'

const TYPES = ['restaurant', 'cafe', 'bar', 'imbiss', 'baeckerei', 'eisdiele', 'pub', 'sonstiges']

/** E.4 — Dialog „Restaurant fehlt“ */
export function MissingPlaceDialog({ open, onClose }) {
  const toast = useToast()
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('upload.missing.title')}
      description={t('upload.missing.text')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="primary" onClick={() => { onClose?.(); toast(t('toast.reportReceived')) }}>
            {t('upload.missing.submit')}
          </Button>
        </ModalActions>
      }
    >
      <div className="stack-3">
        <Field label={t('upload.missing.name')} required>
          {(id) => <Input id={id} placeholder={t('upload.missing.namePlaceholder')} />}
        </Field>
        <Field label={t('upload.missing.address')} required>
          {(id) => <Input id={id} placeholder={t('upload.missing.addressPlaceholder')} />}
        </Field>
        <Field label={t('upload.missing.type')}>
          {(id) => <Select id={id} options={TYPES.map((v) => ({ value: v, label: t(`categories.${v}`) }))} />}
        </Field>
        <Field label={t('upload.missing.note')}>
          {(id) => <Textarea id={id} rows={3} />}
        </Field>
      </div>
      <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-3)' }}>{t('upload.missing.hint')}</p>
    </Modal>
  )
}
