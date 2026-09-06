import { Plus, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Button, Card, EmptyState, Notice, ReviewCard, ReviewCardSkeleton, Skeleton,
  Stars, VideoTile,
} from '../../components/ui'
import { Kpi } from '../../components/layout'
import { GastroShell } from './GastroShell'
import { useDesignState } from '../../lib/design-state'
import { myPlace } from '../../mock/places'
import { kpis, reviews, videos } from '../../mock/content'
import { t } from '../../i18n'

const TASKS = [
  ['profile', true], ['cover', false], ['menu', false], ['video', false], ['qr', false],
]

/** F.4 — Gastro-Dashboard, Bereich „Übersicht“ */
export default function GastroDashboard() {
  const { isEmpty, isLoading } = useDesignState()
  const k = kpis.gastro

  return (
    <GastroShell title={t('gastro.nav.overview')}>
      <div className="stack-8">
        <div className="stack-3">
          <h1 className="t-h1">{myPlace.name}</h1>
          {!myPlace.verified || true ? (
            <Notice>
              {t('gastro.dashboard.unverified')}{' '}
              <Link to="/gastro/einstellungen" className="c-accent">{t('gastro.dashboard.verifyNow')}</Link>
            </Notice>
          ) : null}
        </div>

        {isLoading ? (
          <div className="kpi-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><Skeleton w="50%" h={12} /><Skeleton w="70%" h={32} style={{ marginTop: 8 }} /></Card>
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState icon={Star} title={t('gastro.dashboard.emptyTitle')} text={t('gastro.dashboard.emptyText')} />
        ) : (
          <>
            <div className="kpi-grid">
              <Kpi label={t('gastro.dashboard.kpiViews')} value={k.views} sub={t('gastro.dashboard.kpiViewsSub')} change="+12 %" />
              <Kpi label={t('gastro.dashboard.kpiReviews')} value={k.reviews} sub={`${k.reviewsNew} ${t('gastro.dashboard.kpiReviewsSub')}`} />
              <Kpi label={t('gastro.dashboard.kpiFood')} value={String(k.food).replace('.', ',')}>
                <Stars value={k.food} size={16} />
              </Kpi>
              <Kpi label={t('gastro.dashboard.kpiProfile')} value={k.profileViews} sub={t('gastro.dashboard.kpiViewsSub')} />
            </div>

            <section>
              <h2 className="t-h2" style={{ marginBottom: 'var(--sp-4)' }}>{t('gastro.dashboard.latestReviews')}</h2>
              <div className="stack-3">
                {reviews.slice(0, 3).map((r) => <ReviewCard key={r.id} review={r} variant="gastro" />)}
              </div>
              <Button variant="quiet" to="/gastro/bewertungen" style={{ marginTop: 'var(--sp-2)', marginLeft: -8 }}>
                {t('common.showAll')}
              </Button>
            </section>

            <section>
              <h2 className="t-h2" style={{ marginBottom: 'var(--sp-4)' }}>{t('gastro.dashboard.yourVideos')}</h2>
              <div className="video-rail">
                <Link
                  to="/gastro/videos"
                  className="dropzone"
                  style={{ width: 180, flex: 'none', aspectRatio: '9 / 16', textDecoration: 'none' }}
                >
                  <Plus size={24} />
                  <span className="t-small">{t('gastro.dashboard.uploadVideo')}</span>
                </Link>
                {videos.slice(0, 4).map((v) => (
                  <VideoTile key={v.id} to={`/v/${v.id}`} views={v.views} width={180} />
                ))}
              </div>
            </section>
          </>
        )}

        <section>
          <h2 className="t-h2" style={{ marginBottom: 'var(--sp-3)' }}>{t('gastro.dashboard.tasks')}</h2>
          <div className="list-group">
            {TASKS.map(([key, done]) => (
              <label className="list-row" key={key}>
                <input type="checkbox" defaultChecked={done} style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
                <span className={`grow t-body ${done ? 'c-secondary' : ''}`} style={done ? { textDecoration: 'line-through' } : undefined}>
                  {t(`gastro.dashboard.taskList.${key}`)}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </GastroShell>
  )
}
