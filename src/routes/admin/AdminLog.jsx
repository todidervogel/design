import { FileClock } from 'lucide-react'
import { EmptyState, Input, Select } from '../../components/ui'
import { AdminShell, AdminTable } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { adminLog } from '../../mock/content'
import { t } from '../../i18n'

/** G.9 — Admin-Protokoll (nur lesbar) */
export default function AdminLog() {
  const { isEmpty } = useDesignState()
  const rows = isEmpty ? [] : adminLog

  return (
    <AdminShell title={t('admin.log.title')}>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-4)' }}>{t('admin.log.title')}</h1>

      <div className="row-wrap" style={{ marginBottom: 'var(--sp-4)' }}>
        <Select
          style={{ width: 'auto', minHeight: 36 }}
          placeholder={t('admin.log.filterAdmin')}
          options={['ana@intern', 'ben@intern']}
          aria-label={t('admin.log.filterAdmin')}
        />
        <Input type="date" style={{ width: 'auto', minHeight: 36 }} aria-label={t('admin.log.filterRange')} />
      </div>

      <AdminTable
        columns={[
          t('admin.log.cols.time'), t('admin.log.cols.admin'), t('admin.log.cols.action'),
          t('admin.log.cols.object'), t('admin.log.cols.note'),
        ]}
        rows={rows}
        empty={<EmptyState icon={FileClock} title={t('admin.reports.emptyTitle')} />}
        renderRow={(l) => (
          <tr key={l.time + l.action}>
            <td style={{ whiteSpace: 'nowrap' }}>{l.time}</td>
            <td>{l.admin}</td>
            <td>{l.action}</td>
            <td className="c-secondary">{l.object}</td>
            <td className="c-secondary">{l.note || '—'}</td>
          </tr>
        )}
      />
    </AdminShell>
  )
}
