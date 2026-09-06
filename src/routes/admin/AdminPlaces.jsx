import { useState } from 'react'
import { Building2, Search } from 'lucide-react'
import { Badge, Button, EmptyState, Select } from '../../components/ui'
import { AdminShell, AdminTable } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { places } from '../../mock/places'
import { t } from '../../i18n'

const STATUSES = ['unclaimed', 'pending', 'verified', 'reportedClosed', 'closing', 'archived']
const TONE = { unclaimed: 'default', pending: 'warning', verified: 'success', reportedClosed: 'danger', closing: 'danger', archived: 'default' }

/** G.5 — Admin-Betriebe */
export default function AdminPlaces() {
  const { isEmpty } = useDesignState()
  const rows = isEmpty ? [] : places
  const statusFor = (p, i) => (p.verified ? 'verified' : STATUSES[i % STATUSES.length])

  return (
    <AdminShell title={t('admin.places.title')}>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-4)' }}>{t('admin.places.title')}</h1>

      <div className="row-wrap" style={{ marginBottom: 'var(--sp-4)' }}>
        <div className="header-search grow" style={{ maxWidth: 320 }}>
          <Search size={16} className="search-icon" />
          <input className="input" style={{ height: 36, minHeight: 36 }} placeholder={t('common.search')} aria-label={t('common.search')} />
        </div>
        <Select
          style={{ width: 'auto', minHeight: 36 }}
          placeholder={t('admin.places.cols.status')}
          options={STATUSES.map((s) => ({ value: s, label: t(`admin.places.status.${s}`) }))}
          aria-label={t('admin.places.cols.status')}
        />
      </div>

      <AdminTable
        columns={[
          t('admin.places.cols.name'), t('admin.places.cols.city'), t('admin.places.cols.status'),
          t('admin.places.cols.claimedBy'), t('admin.places.cols.videos'), t('admin.places.cols.reviews'),
          t('admin.places.cols.lastActive'), '',
        ]}
        rows={rows}
        empty={<EmptyState icon={Building2} title={t('admin.reports.emptyTitle')} />}
        renderRow={(p, i) => {
          const status = statusFor(p, i)
          return (
            <tr key={p.id}>
              <td style={{ fontWeight: 600 }}>{p.name}</td>
              <td>{p.city}</td>
              <td><Badge tone={TONE[status]}>{t(`admin.places.status.${status}`)}</Badge></td>
              <td className="c-secondary">{p.verified ? 'inhaber@beispiel.de' : '—'}</td>
              <td>{p.videoCount}</td>
              <td>{p.reviewCount}</td>
              <td className="c-secondary" style={{ whiteSpace: 'nowrap' }}>05.09.2026</td>
              <td>
                <div className="row" style={{ gap: 0, flexWrap: 'nowrap' }}>
                  <Button variant="quiet" size="sm" to={`/g/${p.slug}`}>{t('admin.places.actions.view')}</Button>
                  <Button variant="quiet" size="sm">{t('admin.places.actions.edit')}</Button>
                  <Button variant="quiet" size="sm">{t('admin.places.actions.verify')}</Button>
                  <Button variant="quiet" size="sm">{t('admin.places.actions.archive')}</Button>
                </div>
              </td>
            </tr>
          )
        }}
      />
    </AdminShell>
  )
}
