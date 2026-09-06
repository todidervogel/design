import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck, Bookmark, Camera, ChevronRight, Ellipsis, Heart, Lock, MessageCircle,
  Plus, Search, Share2, SlidersHorizontal, UtensilsCrossed,
} from 'lucide-react'
import {
  Avatar, Button, EmptyState, IconButton, Menu, MenuItem, MenuSeparator, OnSiteBadge,
  RatingCompact, Skeleton, Switch, Thumb, useToast,
} from '../../components/ui'
import { FullscreenPage } from '../../components/layout'
import { ReportContentDialog } from '../dialogs/ReportContentDialog'
import { useDesignState } from '../../lib/design-state'
import { useRequireLogin } from '../../lib/auth'
import { places } from '../../mock/places'
import { videos, users } from '../../mock/content'
import { RADIUS_OPTIONS, DEFAULT_RADIUS, MVP_STAGE } from '../../config'
import { t } from '../../i18n'

/** C.6 — Video-Feed */
export default function Feed() {
  const { isEmpty, isLoading } = useDesignState()
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [onlyRated, setOnlyRated] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const requireLogin = useRequireLogin()

  const video = videos[0]
  const author = users.find((u) => u.id === video.authorId)
  const place = places.find((p) => p.id === video.placeId)
  const commentsEnabled = MVP_STAGE >= 2

  return (
    <FullscreenPage title={t('bottomNav.feed')}>
      <div className="feed">
        <div className="feed-video" aria-hidden="true" />

        {/* Oben — Reiter und Werkzeuge */}
        <div className="feed-top">
          <span style={{ width: 40 }} />
          <div className="feed-tabs">
            <button type="button" className="feed-tab" aria-selected="true">{t('feed.tabNearby')}</button>
            <button
              type="button"
              className="feed-tab"
              aria-selected="false"
              disabled={MVP_STAGE < 2}
              style={MVP_STAGE < 2 ? { opacity: 0.5, cursor: 'default' } : undefined}
            >
              {t('feed.tabFriends')}
              {MVP_STAGE < 2 && <Lock size={12} />}
            </button>
          </div>
          <div className="row" style={{ gap: 0 }}>
            <IconButton icon={Search} label={t('common.search')} tone="on-dark" to="/suche" />
            <Menu
              align="right"
              dark
              width={260}
              trigger={({ toggle }) => (
                <IconButton icon={SlidersHorizontal} label={t('feed.settings')} tone="on-dark" onClick={toggle} />
              )}
            >
              {() => (
                <>
                  <p className="t-small c-on-dark-dim menu-title">{t('feed.settingsTitle')}</p>
                  {RADIUS_OPTIONS.map((r) => (
                    <button key={r} type="button" className="menu-item c-on-dark" onClick={() => setRadius(r)}>
                      {r} km {radius === r && <span className="c-accent">✓</span>}
                    </button>
                  ))}
                  <MenuSeparator />
                  <div className="row-between" style={{ padding: 'var(--sp-2) var(--sp-3)' }}>
                    <span className="t-small c-on-dark">{t('feed.onlyRated')}</span>
                    <Switch checked={onlyRated} onChange={setOnlyRated} label={t('feed.onlyRated')} />
                  </div>
                </>
              )}
            </Menu>
          </div>
        </div>

        {isLoading ? (
          <FeedSkeleton />
        ) : isEmpty ? (
          <div className="feed-stage">
            <EmptyState
              onDark
              icon={Camera}
              title={t('feed.emptyTitle')}
              text={t('feed.emptyText')}
              action={<Button variant="primary" to="/karte">{t('feed.emptyCta')}</Button>}
              secondaryAction={<Button variant="quiet" onClick={() => setRadius(25)}>{t('feed.emptyCtaSecondary')}</Button>}
            />
          </div>
        ) : (
          <>
            {/* Rechte Spalte */}
            <div className="feed-rail">
              <button
                type="button"
                className="feed-rail-item"
                onClick={requireLogin(() => navigate(`/p/${author.username}`))}
                aria-label={t('feed.follow')}
              >
                <span className="feed-avatar-wrap">
                  <Avatar name={author.username} size={44} />
                  <span className="feed-follow-plus"><Plus size={12} /></span>
                </span>
              </button>
              <button type="button" className="feed-rail-item" onClick={requireLogin(() => toast(t('toast.saved')))}>
                <Heart size={28} />
                <span className="count">{video.likes}</span>
              </button>
              <button
                type="button"
                className="feed-rail-item"
                style={commentsEnabled ? undefined : { opacity: 0.5 }}
                aria-disabled={!commentsEnabled}
              >
                <MessageCircle size={28} />
                {commentsEnabled && <span className="count">{video.comments}</span>}
              </button>
              <button type="button" className="feed-rail-item" onClick={requireLogin(() => toast(t('toast.saved')))}>
                <Bookmark size={28} />
              </button>
              <button type="button" className="feed-rail-item" onClick={() => toast(t('toast.linkCopied'))}>
                <Share2 size={28} />
              </button>
              <Menu
                align="right"
                dark
                trigger={({ toggle }) => (
                  <button type="button" className="feed-rail-item" onClick={toggle} aria-label={t('feed.moreOptions')}>
                    <Ellipsis size={28} />
                  </button>
                )}
              >
                {({ close }) => (
                  <>
                    <MenuItem className="c-on-dark" onClick={close}>{t('feed.menu.notInterested')}</MenuItem>
                    <MenuItem onClick={() => { close(); toast(t('toast.linkCopied')) }}>{t('feed.menu.copyLink')}</MenuItem>
                    <MenuItem onClick={() => { close(); setReportOpen(true) }}>{t('feed.menu.reportVideo')}</MenuItem>
                    <MenuItem danger onClick={close}>{t('feed.menu.blockAuthor')}</MenuItem>
                    <MenuSeparator />
                    <MenuItem onClick={close}>{t('common.cancel')}</MenuItem>
                  </>
                )}
              </Menu>
            </div>

            {/* Unten links */}
            <div className="feed-bottom">
              <div className="feed-caption-block stack-2">
                <div className="row" style={{ gap: 'var(--sp-2)' }}>
                  <span className="t-body-bold c-on-dark">@{author.username}</span>
                  {video.verifiedOnSite && <OnSiteBadge tone="dark" />}
                </div>
                <p className="t-body c-on-dark clamp-2">{video.caption}</p>
                <button
                  type="button"
                  className="t-small c-on-dark-dim"
                  style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  {t('common.more')}
                </button>
                <RatingCompact rating={video.rating} onDark />
              </div>

              {/* Kaltstart-Hinweis */}
              <div className="feed-coldstart">
                <span className="grow">{t('feed.coldStart')}</span>
                <Button variant="quiet" size="sm" to="/karte" style={{ color: '#fff' }}>{t('feed.coldStartCta')}</Button>
              </div>

              {/* Restaurantleiste */}
              <button type="button" className="feed-place-bar" onClick={() => navigate(`/g/${place.slug}`)}>
                <span className="thumb-placeholder" style={{ width: 40, height: 40, background: 'rgba(255,255,255,.16)', color: 'rgba(255,255,255,.6)' }}>
                  <UtensilsCrossed size={16} />
                </span>
                <span className="grow" style={{ textAlign: 'left' }}>
                  <span className="t-body-bold c-on-dark row" style={{ gap: 4 }}>
                    {place.name}
                    {place.verified && <BadgeCheck size={15} style={{ color: '#8FBBEE' }} />}
                  </span>
                  <span className="t-small c-on-dark-dim">
                    {place.cuisine} · {place.distance} · {place.open ? t('common.openNow') : t('hours.closed')}
                  </span>
                </span>
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      <ReportContentDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </FullscreenPage>
  )
}

function FeedSkeleton() {
  return (
    <>
      <div className="feed-rail">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} dark w={32} h={32} radius="50%" />
        ))}
      </div>
      <div className="feed-bottom">
        <div className="stack-2" style={{ maxWidth: '70%' }}>
          <Skeleton dark w={120} h={14} />
          <Skeleton dark w="100%" h={12} />
          <Skeleton dark w="70%" h={12} />
        </div>
        <Skeleton dark h={56} radius="var(--r-control)" style={{ marginTop: 'var(--sp-3)' }} />
      </div>
    </>
  )
}
