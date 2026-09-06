import { useState } from 'react'
import { AlertTriangle, Mail } from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, Field, Input, Modal, ModalActions, Notice, Select, useToast,
} from '../../components/ui'
import { AdminShell, AdminTable } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { adminInvites } from '../../mock/content'
import { t } from '../../i18n'

const TONE = { sent: 'default', opened: 'accent', activated: 'success', bounced: 'danger', declined: 'warning' }

/** G.6 — Admin-Einladungen */
export default function AdminInvites() {
  const { isEmpty } = useDesignState()
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const rows = isEmpty ? [] : adminInvites

  return (
    <AdminShell title={t('admin.invites.title')}>
      <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
        <h1 className="t-h1">{t('admin.invites.title')}</h1>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>{t('admin.invites.send')}</Button>
      </div>

      <AdminTable
        columns={[
          t('admin.invites.cols.place'), t('admin.invites.cols.email'), t('admin.invites.cols.sentAt'),
          t('admin.invites.cols.status'), t('admin.invites.cols.action'),
        ]}
        rows={rows}
        empty={<EmptyState icon={Mail} title={t('admin.reports.emptyTitle')} />}
        renderRow={(i) => (
          <tr key={i.id}>
            <td style={{ fontWeight: 600 }}>{i.place}</td>
            <td className="c-secondary">{i.email}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{i.sentAt}</td>
            <td><Badge tone={TONE[i.status]}>{t(`admin.invites.status.${i.status}`)}</Badge></td>
            <td><Button variant="quiet" size="sm" onClick={() => toast(t('toast.noAction'), 'info')}>{t('admin.invites.resend')}</Button></td>
          </tr>
        )}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        wide
        title={t('admin.invites.dialogTitle')}
        actions={
          <ModalActions onCancel={() => setOpen(false)}>
            <Button variant="primary" onClick={() => { setOpen(false); toast(t('toast.noAction'), 'info') }}>
              {t('admin.invites.sendNow')}
            </Button>
          </ModalActions>
        }
      >
        <div className="stack-4">
          <div className="row" style={{ gap: 'var(--sp-3)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Field label={t('admin.invites.filterCity')} className="grow">
              {(id) => <Input id={id} defaultValue="Berlin" />}
            </Field>
            <Field label={t('admin.invites.filterCategory')} className="grow">
              {(id) => <Select id={id} placeholder="—" options={['restaurant', 'cafe', 'bar'].map((c) => ({ value: c, label: t(`categories.${c}`) }))} />}
            </Field>
            <Field label={t('admin.invites.filterCount')} className="grow">
              {(id) => <Input id={id} type="number" defaultValue={50} />}
            </Field>
          </div>

          <Field label={t('admin.invites.senderLabel')}>
            {(id) => <Input id={id} defaultValue="Ana vom Team" />}
          </Field>

          <div>
            <p className="field-label">{t('admin.invites.emailPreview')}</p>
            <Card flat className="stack-2">
              <p className="t-body-bold">Dein Betrieb ist schon dabei</p>
              <p className="t-small c-secondary">
                Hallo, wir haben dein Profil aus öffentlichen Daten angelegt. Du kannst es kostenlos übernehmen,
                Videos hochladen und auf Bewertungen antworten.
              </p>
            </Card>
          </div>

          <Notice tone="danger" icon={AlertTriangle}>
            <strong>⚠️ {t('admin.invites.legalWarning')}</strong>
          </Notice>
        </div>
      </Modal>
    </AdminShell>
  )
}
