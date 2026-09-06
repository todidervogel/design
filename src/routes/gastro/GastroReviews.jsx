import { useState } from 'react'
import { ChevronDown, Star } from 'lucide-react'
import {
  Card, Chip, EmptyState, Menu, ReviewCard, ReviewCardSkeleton, Stars,
} from '../../components/ui'
import { GastroShell } from './GastroShell'
import { ConsoleHeader } from '../../components/layout'
import { ReportReviewDialog } from '../dialogs/GastroDialogs'
import { useDesignState } from '../../lib/design-state'
import { kpis, reviews } from '../../mock/content'
import { myPlace } from '../../mock/places'
import { t } from '../../i18n'

const FILTERS = ['all', 'unanswered', 'withVideo', 'lowStars']
const DISTRIBUTION = [[5, 12], [4, 7], [3, 3], [2, 1], [1, 1]]

/** F.7 — Gastro-Bewertungen */
export default function GastroReviews() {
  const { isEmpty, isLoading } = useDesignState()
  const [filter, setFilter] = useState('all')
  const [reportOpen, setReportOpen] = useState(false)
  const list = isEmpty ? [] : reviews
  const total = DISTRIBUTION.reduce((sum, [, n]) => sum + n, 0)

  return (
    <GastroShell title={t('gastro.reviews.title')}>
      <ConsoleHeader title={t('gastro.reviews.title')} />

      {!isEmpty && (
        <Card style={{ marginBottom: 'var(--sp-6)' }}>
          <div style={{ display: 'grid', gap: 'var(--sp-6)', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {[
              [t('rating.food'), myPlace.rating.food],
              [t('rating.service'), myPlace.rating.service],
              [t('rating.price'), myPlace.rating.price],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="t-small c-secondary">{label}</p>
                <p className="kpi-value">{value.toFixed(1).replace('.', ',')}</p>
                <Stars value={value} size={16} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--sp-6)', display: 'grid', gap: 6, maxWidth: 420 }}>
            <p className="t-small c-secondary">{t('gastro.reviews.distribution')}</p>
            {DISTRIBUTION.map(([stars, count]) => (
              <div className="row" key={stars} style={{ gap: 'var(--sp-2)' }}>
                <span className="t-small" style={{ width: 30 }}>{stars} <Star size={11} className="star-filled" strokeWidth={0} /></span>
                <span style={{ flex: 1, height: 8, borderRadius: 'var(--r-pill)', background: 'var(--bg-light-alt)' }}>
                  <span style={{ display: 'block', width: `${(count / total) * 100}%`, height: '100%', borderRadius: 'var(--r-pill)', background: 'var(--star-filled)' }} />
                </span>
                <span className="t-small c-secondary" style={{ width: 24, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="row-between" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
        <div className="row-wrap">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{t(`gastro.reviews.filters.${f}`)}</Chip>
          ))}
        </div>
        <Menu
          align="right"
          trigger={({ toggle }) => (
            <button type="button" className="chip" onClick={toggle}>{t('common.sortNewest')} <ChevronDown size={14} /></button>
          )}
        >
          {({ close }) => (
            <>
              <button type="button" className="menu-item" onClick={close}>{t('common.sortNewest')}</button>
              <button type="button" className="menu-item" onClick={close}>{t('place.dishesSortOptions.best')}</button>
            </>
          )}
        </Menu>
      </div>

      {isLoading ? (
        <div className="stack-3">{Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={Star} title={t('gastro.reviews.emptyTitle')} text={t('gastro.reviews.emptyText')} />
      ) : (
        <div className="stack-3">
          {list.map((r) => (
            <ReviewCard key={r.id} review={r} variant="gastro" onReport={() => setReportOpen(true)} />
          ))}
        </div>
      )}

      <ReportReviewDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </GastroShell>
  )
}
