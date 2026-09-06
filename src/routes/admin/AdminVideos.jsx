import { useState } from 'react'
import { Play, Video } from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, Field, Select, Skeleton, Textarea, Thumb, useToast,
} from '../../components/ui'
import { AdminShell } from './AdminShell'
import { useDesignState } from '../../lib/design-state'
import { places } from '../../mock/places'
import { users, videos } from '../../mock/content'
import { t } from '../../i18n'

const REASONS = ['spam', 'hate', 'sexual', 'violence', 'copyright', 'wrongPlace', 'quality', 'other']

/** G.3 — Admin Video-Freigabe */
export default function AdminVideos() {
  const { isEmpty, isLoading } = useDesignState()
  const [selected, setSelected] = useState('v1')
  const [rejecting, setRejecting] = useState(false)
  const toast = useToast()

  const queue = isEmpty ? [] : videos.slice(0, 5)
  const video = queue.find((v) => v.id === selected) ?? queue[0]
  const author = video ? users.find((u) => u.id === video.authorId) : null
  const place = video ? places.find((p) => p.id === video.placeId) : null

  return (
    <AdminShell title={t('admin.videos.title')}>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-4)' }}>{t('admin.videos.title')}</h1>

      {isLoading ? (
        <div className="admin-split">
          <div className="stack-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={64} radius="var(--r-card)" />)}</div>
          <Skeleton h={360} radius="var(--r-card)" />
        </div>
      ) : queue.length === 0 ? (
        <EmptyState icon={Video} title={t('admin.videos.emptyTitle')} text={t('admin.videos.emptyText')} />
      ) : (
        <div className="admin-split">
          {/* Warteschlange */}
          <div className="list-group">
            {queue.map((v) => {
              const p = places.find((x) => x.id === v.placeId)
              const a = users.find((x) => x.id === v.authorId)
              return (
                <button
                  key={v.id}
                  type="button"
                  className="list-row"
                  onClick={() => { setSelected(v.id); setRejecting(false) }}
                  style={selected === v.id ? { background: 'var(--bg-light-alt)' } : undefined}
                >
                  <Thumb width={40} height={56} icon={Play} />
                  <span className="grow">
                    <span className="t-small" style={{ fontWeight: 600, display: 'block' }}>{p?.name}</span>
                    <span className="t-small c-secondary">@{a?.username} · {t('admin.videos.since', { time: '2 Std.' })}</span>
                  </span>
                  {v.status === 'rejected' && <Badge tone="danger">{t('admin.videos.reported')}</Badge>}
                </button>
              )
            })}
          </div>

          {/* Ausgewähltes Video */}
          <div className="stack-4">
            <div
              style={{
                background: '#000', borderRadius: 'var(--r-card)', display: 'grid', placeItems: 'center',
                aspectRatio: '9 / 16', maxHeight: 420, width: '100%', maxWidth: 260,
              }}
            >
              <Play size={36} color="#fff" fill="#fff" strokeWidth={0} />
            </div>

            <Card>
              <table className="table" style={{ margin: 0 }}>
                <tbody>
                  <tr><td className="c-secondary" style={{ width: 160 }}>{t('admin.videos.author')}</td><td>@{author?.username}</td></tr>
                  <tr><td className="c-secondary">{t('admin.videos.place')}</td><td>{place?.name}</td></tr>
                  <tr><td className="c-secondary">{t('admin.videos.duration')}</td><td>{video.durationSec} Sek.</td></tr>
                  <tr>
                    <td className="c-secondary">{t('admin.videos.rating')}</td>
                    <td>{video.rating ? `★ ${video.rating.food} / ${video.rating.service} / ${video.rating.price}` : t('rating.none')}</td>
                  </tr>
                  <tr><td className="c-secondary">{t('admin.videos.caption')}</td><td>{video.caption}</td></tr>
                  <tr>
                    <td className="c-secondary">{t('admin.videos.gps')}</td>
                    <td>{video.verifiedOnSite ? t('common.yes') : t('common.no')}</td>
                  </tr>
                </tbody>
              </table>
            </Card>

            <div className="row-wrap">
              <Button
                variant="primary"
                style={{ background: 'var(--success)' }}
                onClick={() => toast(t('toast.saved'))}
              >
                {t('admin.videos.approve')}
              </Button>
              <Button variant="danger" onClick={() => setRejecting((r) => !r)}>{t('admin.videos.reject')}</Button>
              <Button variant="secondary" onClick={() => toast(t('toast.noAction'), 'info')}>{t('admin.videos.postpone')}</Button>
            </div>

            {rejecting && (
              <Card className="stack-3">
                <Field label={t('admin.videos.reasonLabel')} required>
                  {(id) => (
                    <Select id={id} placeholder="—" options={REASONS.map((r) => ({ value: r, label: t(`admin.videos.reasons.${r}`) }))} />
                  )}
                </Field>
                <Field label={t('admin.videos.messageLabel')}>
                  {(id) => <Textarea id={id} rows={3} />}
                </Field>
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <Button variant="secondary" size="sm" onClick={() => setRejecting(false)}>{t('common.cancel')}</Button>
                  <Button variant="danger" size="sm" onClick={() => { setRejecting(false); toast(t('toast.saved')) }}>
                    {t('admin.videos.reject')}
                  </Button>
                </div>
              </Card>
            )}

            <p className="t-small c-tertiary">{t('admin.videos.shortcuts')}</p>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
