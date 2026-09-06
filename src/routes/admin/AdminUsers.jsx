import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import {
  Badge, Button, Checkbox, EmptyState, Field, Input, Modal, ModalActions, Select, useToast,
} from '../../components/ui'
import { AdminShell, AdminTable } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { adminUsers } from '../../mock/content'
import { t } from '../../i18n'

const TONE = { active: 'success', warned: 'warning', banned: 'danger' }
const DURATIONS = ['h24', 'd7', 'd30', 'forever']

/** G.7 — Admin-Nutzer */
export default function AdminUsers() {
  const { isEmpty } = useDesignState()
  const [banUser, setBanUser] = useState(null)
  const toast = useToast()
  const rows = isEmpty ? [] : adminUsers

  return (
    <AdminShell title={t('admin.users.title')}>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-4)' }}>{t('admin.users.title')}</h1>

      <div className="header-search" style={{ maxWidth: 320, marginBottom: 'var(--sp-4)' }}>
        <Search size={16} className="search-icon" />
        <input className="input" style={{ height: 36, minHeight: 36 }} placeholder={t('common.search')} aria-label={t('common.search')} />
      </div>

      <AdminTable
        columns={[
          t('admin.users.cols.username'), t('admin.users.cols.email'), t('admin.users.cols.registered'),
          t('admin.users.cols.videos'), t('admin.users.cols.reviews'), t('admin.users.cols.reportsAgainst'),
          t('admin.users.cols.status'), '',
        ]}
        rows={rows}
        empty={<EmptyState icon={Users} title={t('admin.reports.emptyTitle')} />}
        renderRow={(u) => (
          <tr key={u.id}>
            <td style={{ fontWeight: 600 }}>@{u.username}</td>
            <td className="c-secondary">{u.email}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{u.registered}</td>
            <td>{u.videos}</td>
            <td>{u.reviews}</td>
            <td className={u.reports > 2 ? 'c-danger' : undefined}>{u.reports}</td>
            <td><Badge tone={TONE[u.status]}>{t(`admin.users.status.${u.status}`)}</Badge></td>
            <td>
              <div className="row" style={{ gap: 0, flexWrap: 'nowrap' }}>
                <Button variant="quiet" size="sm" to={`/p/${u.username}`}>{t('admin.users.actions.view')}</Button>
                <Button variant="quiet" size="sm" onClick={() => toast(t('toast.saved'))}>{t('admin.users.actions.warn')}</Button>
                {u.status === 'banned' ? (
                  <Button variant="quiet" size="sm" onClick={() => toast(t('toast.saved'))}>{t('admin.users.actions.unban')}</Button>
                ) : (
                  <Button variant="quiet" size="sm" onClick={() => setBanUser(u)}>{t('admin.users.actions.ban')}</Button>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        open={banUser != null}
        onClose={() => setBanUser(null)}
        title={t('admin.users.banDialogTitle')}
        description={banUser ? `@${banUser.username}` : undefined}
        actions={
          <ModalActions onCancel={() => setBanUser(null)}>
            <Button variant="danger" onClick={() => { setBanUser(null); toast(t('toast.saved')) }}>
              {t('admin.users.actions.ban')}
            </Button>
          </ModalActions>
        }
      >
        <div className="stack-3">
          <Field label={t('admin.users.durationLabel')} required>
            {(id) => <Select id={id} placeholder="—" options={DURATIONS.map((d) => ({ value: d, label: t(`admin.users.durations.${d}`) }))} />}
          </Field>
          <Field label={t('admin.users.reasonLabel')} required>
            {(id) => <Input id={id} />}
          </Field>
          <Checkbox label={t('admin.users.notifyUser')} defaultChecked />
        </div>
      </Modal>
    </AdminShell>
  )
}
