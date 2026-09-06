import { useState } from 'react'
import { Button, Field, Input, Modal, ModalActions, useToast } from '../../components/ui'
import { t } from '../../i18n'

/** E.11 — Dialog „Konto löschen“ */
export function DeleteAccountDialog({ open, onClose }) {
  const [value, setValue] = useState('')
  const toast = useToast()
  const confirmed = value.trim().toUpperCase() === 'LÖSCHEN'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('settings.deleteDialog.title')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="danger" disabled={!confirmed} onClick={() => { onClose?.(); toast(t('toast.noAction'), 'info') }}>
            {t('settings.deleteDialog.submit')}
          </Button>
        </ModalActions>
      }
    >
      <p className="t-body">{t('settings.deleteDialog.intro')}</p>
      <ul className="t-body c-secondary" style={{ margin: 'var(--sp-3) 0 var(--sp-4)', paddingLeft: 'var(--sp-6)' }}>
        <li>{t('settings.deleteDialog.b1')}</li>
        <li>{t('settings.deleteDialog.b2')}</li>
        <li>{t('settings.deleteDialog.b3')}</li>
      </ul>
      <Field label={t('settings.deleteDialog.confirmLabel')} required>
        {(id) => (
          <Input
            id={id}
            placeholder={t('settings.deleteDialog.confirmPlaceholder')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </Field>
    </Modal>
  )
}
