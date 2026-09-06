import { useState } from 'react'
import { Flag } from 'lucide-react'
import {
  Badge, Button, Card, Chip, EmptyState, Field, Select, Textarea, useToast,
} from '../../components/ui'
import { AdminShell, AdminTable } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { adminReports } from '../../mock/content'
import { t } from '../../i18n'

const STATUS_TONE = { open: 'warning', review: 'accent', done: 'success', rejected: 'default' }
const FILTERS = ['open', 'review', 'done', 'rejected']

/** G.4 — Admin-Meldungen */
export default function AdminReports() {
  const { isEmpty } = useDesignState()
  const [filter, setFilter] = useState('open')
  const [selected, setSelected] = useState(null)
  const toast = useToast()
  const rows = isEmpty ? [] : adminReports

  return (
    <AdminShell title={t('admin.reports.title')}>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-4)' }}>{t('admin.reports.title')}</h1>

      <div className="row-between" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
        <div className="row-wrap">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{t(`admin.reports.status.${f}`)}</Chip>
          ))}
        </div>
        <Select
          style={{ width: 'auto', minHeight: 34 }}
          placeholder={t('admin.reports.cols.type')}
          options={['video', 'review', 'profile', 'place'].map((v) => ({ value: v, label: t(`admin.reports.types.${v}`) }))}
          aria-label={t('admin.reports.cols.type')}
        />
      </div>

      <div className="admin-split" style={{ gridTemplateColumns: selected ? '1fr 380px' : '1fr' }}>
        <AdminTable
          columns={[
            t('admin.reports.cols.date'), t('admin.reports.cols.type'), t('admin.reports.cols.object'),
            t('admin.reports.cols.reason'), t('admin.reports.cols.count'), t('admin.reports.cols.status'),
            t('admin.reports.cols.action'),
          ]}
          rows={rows}
          empty={<EmptyState icon={Flag} title={t('admin.reports.emptyTitle')} />}
          renderRow={(r) => (
            <tr key={r.id}>
              <td style={{ whiteSpace: 'nowrap' }}>{r.date}</td>
              <td>{t(`admin.reports.types.${r.type}`)}</td>
              <td>{r.object}</td>
              <td>{r.reason}</td>
              <td>{r.count}</td>
              <td><Badge tone={STATUS_TONE[r.status]}>{t(`admin.reports.status.${r.status}`)}</Badge></td>
              <td>
                <Button variant="quiet" size="sm" onClick={() => setSelected(r)}>{t('common.view')}</Button>
              </td>
            </tr>
          )}
        />

        {selected && (
          <Card className="stack-4">
            <div className="row-between">
              <h2 className="t-h2">{selected.object}</h2>
              <Button variant="quiet" size="sm" onClick={() => setSelected(null)}>{t('common.close')}</Button>
            </div>

            <div className="card card-flat">
              <p className="t-small c-secondary">{t('admin.reports.cols.object')}</p>
              <p className="t-body">{selected.object}</p>
            </div>

            <div className="stack-2">
              {Array.from({ length: selected.count }).map((_, i) => (
                <div className="card card-flat" key={i}>
                  <p className="t-small">{selected.reason}</p>
                  <p className="t-small c-secondary">{selected.date} · anonym</p>
                </div>
              ))}
            </div>

            {selected.reason.includes('geschlossen') && (
              <div className="card card-flat stack-2">
                <p className="t-body-bold">{t('admin.reports.closedTitle')}</p>
                <p className="t-small c-secondary">{t('admin.reports.closedCount', { count: selected.count })}</p>
                <div className="row-wrap">
                  <Button variant="secondary" size="sm" onClick={() => toast(t('toast.saved'))}>{t('admin.reports.markClosed')}</Button>
                  <Button variant="secondary" size="sm" onClick={() => toast(t('toast.noAction'), 'info')}>{t('admin.reports.requestCheck')}</Button>
                  <Button variant="quiet" size="sm" onClick={() => setSelected(null)}>{t('admin.reports.dismiss')}</Button>
                </div>
              </div>
            )}

            <div className="row-wrap">
              <Button variant="danger" size="sm" onClick={() => toast(t('toast.saved'))}>{t('admin.reports.removeContent')}</Button>
              <Button variant="secondary" size="sm" onClick={() => toast(t('toast.saved'))}>{t('admin.reports.warnUser')}</Button>
              <Button variant="danger" size="sm" onClick={() => toast(t('toast.saved'))}>{t('admin.reports.banUser')}</Button>
              <Button variant="quiet" size="sm" onClick={() => setSelected(null)}>{t('admin.reports.dismiss')}</Button>
            </div>

            <Field label={t('admin.reports.noteLabel')}>
              {(id) => <Textarea id={id} rows={3} />}
            </Field>
          </Card>
        )}
      </div>
    </AdminShell>
  )
}
