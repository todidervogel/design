import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bookmark, Flag, Heart, MessageCircle, Play, Share2 } from 'lucide-react'
import {
  Avatar, Button, Card, Chip, EmptyState, OnSiteBadge, PlaceRow, RatingCompact,
  Skeleton, useToast,
} from '../../components/ui'
import { Page } from '../../components/layout'
import { ReportContentDialog } from '../dialogs/ReportContentDialog'
import { useDesignState } from '../../lib/design-state'
import { useRequireLogin } from '../../lib/auth'
import { places } from '../../mock/places'
import { reviews, users, videos } from '../../mock/content'
import { MVP_STAGE } from '../../config'
import { groupSizeLabel, t } from '../../i18n'

/** C.7 — Videodetailseite /v/[id] */
export default function VideoDetail() {
  const { id } = useParams()
  const { isLoading } = useDesignState()
  const [reportOpen, setReportOpen] = useState(false)
  const toast = useToast()
  const requireLogin = useRequireLogin()

  const video = videos.find((v) => v.id === id) ?? videos[0]
  const author = users.find((u) => u.id === video.authorId) ?? users[0]
  const place = places.find((p) => p.id === video.placeId) ?? places[0]
  const review = reviews[0]

  return (
    <Page title={place.name} footer={false}>
      <div className="split-video" style={{ paddingBlock: 'var(--sp-6) var(--sp-16)' }}>
        {/* Video links */}
        <div
          style={{
            background: '#000', borderRadius: 'var(--r-card)', display: 'grid', placeItems: 'center',
            aspectRatio: '9 / 16', maxHeight: 640, margin: '0 auto', width: '100%',
          }}
        >
          <Play size={44} color="#fff" fill="#fff" strokeWidth={0} />
        </div>

        {/* Spalte rechts */}
        <div className="stack-4">
          <div className="row">
            <Avatar name={author.username} size={40} />
            <div className="grow">
              <p className="t-body-bold">@{author.username}</p>
              <p className="t-small c-secondary">{video.date}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={requireLogin(() => toast(t('toast.saved')))}>
              {t('videoDetail.follow')}
            </Button>
          </div>

          <Card pad={0}><PlaceRow place={place} showSave={false} /></Card>

          {isLoading ? (
            <Card><Skeleton h={14} /><Skeleton h={14} style={{ marginTop: 8 }} /><Skeleton h={14} style={{ marginTop: 8 }} /></Card>
          ) : (
            <Card className="stack-2">
              <div className="row" style={{ gap: 'var(--sp-2)' }}>
                {video.verifiedOnSite && <OnSiteBadge />}
              </div>
              <RatingCompact rating={video.rating} />
              <p className="t-small c-secondary">
                {groupSizeLabel(review.groupSize)} · {t('place.foodHot')} ✓
              </p>
              <div className="row-wrap">
                {review.dishes.map((d) => <Chip key={d.name}>{d.name} ★{d.stars}</Chip>)}
              </div>
              <p className="t-body">{video.caption}</p>
            </Card>
          )}

          <hr className="divider" />

          <div className="row-wrap">
            <Button variant="quiet" size="sm" icon={Heart} onClick={requireLogin(() => toast(t('toast.saved')))}>{video.likes}</Button>
            <Button variant="quiet" size="sm" icon={MessageCircle} disabled={MVP_STAGE < 2}>{t('videoDetail.comments')}</Button>
            <Button variant="quiet" size="sm" icon={Bookmark} onClick={requireLogin(() => toast(t('toast.saved')))}>{t('place.save')}</Button>
            <Button variant="quiet" size="sm" icon={Share2} onClick={() => toast(t('toast.linkCopied'))}>{t('common.share')}</Button>
            <Button variant="quiet" size="sm" icon={Flag} onClick={() => setReportOpen(true)}>{t('videoDetail.report')}</Button>
          </div>

          <hr className="divider" />

          {MVP_STAGE >= 2 ? null : (
            <EmptyState icon={MessageCircle} title={t('videoDetail.comments')} text={t('videoDetail.commentsSoon')} />
          )}
        </div>
      </div>

      <ReportContentDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </Page>
  )
}
