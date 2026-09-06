import { useState } from 'react'
import { Lightbulb, MapPin } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Select, useToast } from '../../components/ui'
import { AdminShell, AdminTable } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { adminSuggestions } from '../../mock/content'
import { t } from '../../i18n'

const TONE = { open: 'warning', created: 'success', rejected: 'default' }
const REJECT_REASONS = ['notExist', 'duplicate', 'notGastro']

/** G.8 — Admin-Vorschläge (fehlende Betriebe aus E.4) */
export default function AdminSuggestions() {
  const { isEmpty } = useDesignState()
  const [selected, setSelected] = useState(null)
  const toast = useToast()
  const rows = isEmpty ? [] : adminSuggestions

  return (
    <AdminShell title={t('admin.suggestions.title')}>
      <h1 className="t-h1">{t('admin.suggestions.title')}</h1>
      <p className="t-small c-secondary" style={{ marginBottom: 'var(--sp-4)' }}>{t('admin.suggestions.intro')}</p>

      <div className="admin-split" style={{ gridTemplateColumns: selected ? '1fr 360px' : '1fr' }}>
        <AdminTable
          columns={[
            t('admin.suggestions.cols.name'), t('admin.suggestions.cols.address'), t('admin.suggestions.cols.type'),
            t('admin.suggestions.cols.reportedBy'), t('admin.suggestions.cols.date'), t('admin.suggestions.cols.status'), '',
          ]}
          rows={rows}
          empty={<EmptyState icon={Lightbulb} title={t('admin.reports.emptyTitle')} />}
          renderRow={(s) => (
            <tr key={s.id}>
              <td style={{ fontWeight: 600 }}>{s.name}</td>
              <td className="c-secondary">{s.address}</td>
              <td>{t(`categories.${s.type}`)}</td>
              <td className="c-secondary">{s.reportedBy}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{s.date}</td>
              <td><Badge tone={TONE[s.status]}>{t(`admin.suggestions.status.${s.status}`)}</Badge></td>
              <td><Button variant="quiet" size="sm" onClick={() => setSelected(s)}>{t('common.view')}</Button></td>
            </tr>
          )}
        />

        {selected && (
          <Card className="stack-4">
            <div className="row-between">
              <h2 className="t-h2">{selected.name}</h2>
              <Button variant="quiet" size="sm" onClick={() => setSelected(null)}>{t('common.close')}</Button>
            </div>

            <p className="t-small c-secondary">{selected.address}</p>
            <div className="mini-map"><MapPin size={22} /></div>

            <div className="row-wrap">
              <Button variant="primary" size="sm" onClick={() => { setSelected(null); toast(t('toast.saved')) }}>
                {t('admin.suggestions.create')}
              </Button>
            </div>

            <div>
              <p className="field-label">{t('admin.suggestions.reject')}</p>
              <div className="row" style={{ gap: 'var(--sp-2)' }}>
                <Select
                  placeholder="—"
                  options={REJECT_REASONS.map((r) => ({ value: r, label: t(`admin.suggestions.rejectReasons.${r}`) }))}
                  aria-label={t('admin.suggestions.reject')}
                />
                <Button variant="danger" size="sm" onClick={() => { setSelected(null); toast(t('toast.saved')) }}>
                  {t('admin.suggestions.reject')}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminShell>
  )
}
