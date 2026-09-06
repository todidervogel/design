import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Bookmark, Camera, ClipboardList, Ellipsis, Lock, Settings, Share2, UserRound } from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, IconButton, Menu, MenuItem, PlaceRow,
  ReviewCard, ReviewCardSkeleton, Skeleton, Tabs, VideoTile, useToast,
} from '../../components/ui'
import { Page } from '../../components/layout'
import { ReportContentDialog } from '../dialogs/ReportContentDialog'
import { useDesignState } from '../../lib/design-state'
import { useRequireLogin } from '../../lib/auth'
import { me, reviews, users, videos } from '../../mock/content'
import { places } from '../../mock/places'
import { t } from '../../i18n'

const TABS = [
  { id: 'videos', label: t('profile.tabs.videos') },
  { id: 'reviews', label: t('profile.tabs.reviews') },
  { id: 'saved', label: t('profile.tabs.saved') },
]

/** E.7 — Eigenes Profil */
export function OwnProfile() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'saved' ? 'saved' : 'videos')
  const { loggedIn } = useDesignState()
  const toast = useToast()

  if (!loggedIn) {
    return (
      <Page title={t('profile.guestTitle')} footer={false}>
        <div style={{ paddingBlock: 'var(--sp-16)' }}>
          <EmptyState
            icon={UserRound}
            title={t('profile.guestTitle')}
            text={t('profile.guestText')}
            action={<Button variant="primary" to="/anmelden">{t('auth.gate.login')}</Button>}
            secondaryAction={<Button variant="secondary" to="/registrieren">{t('auth.gate.register')}</Button>}
          />
        </div>
      </Page>
    )
  }

  return (
    <Page title={`@${me.username}`} footer={false}>
      <ProfileHeader
        user={me}
        actions={
          <>
            <Button variant="secondary" to="/einstellungen/profil">{t('profile.edit')}</Button>
            <IconButton icon={Share2} label={t('common.share')} onClick={() => toast(t('toast.linkCopied'))} />
            <IconButton icon={Settings} label={t('profile.settings')} to="/einstellungen" />
          </>
        }
      />

      <Tabs items={TABS} value={tab} onChange={setTab} />

      <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)' }}>
        {tab === 'videos' && <VideosTab own />}
        {tab === 'reviews' && <ReviewsTab own />}
        {tab === 'saved' && <SavedTab />}
      </div>
    </Page>
  )
}

/** E.8 — Fremdes Profil */
export function PublicProfile() {
  const { username } = useParams()
  const user = users.find((u) => u.username === username) ?? users[1]
  const [tab, setTab] = useState('videos')
  const [follow, setFollow] = useState('follow')
  const [reportOpen, setReportOpen] = useState(false)
  const toast = useToast()
  const requireLogin = useRequireLogin()

  const followLabel = { follow: t('profile.follow'), requested: t('profile.requested'), following: `${t('profile.following')} ✓` }
  const nextFollow = { follow: user.private ? 'requested' : 'following', requested: 'follow', following: 'follow' }

  return (
    <Page title={`@${user.username}`} footer={false}>
      <ProfileHeader
        user={user}
        actions={
          <>
            <Button
              variant={follow === 'follow' ? 'primary' : 'secondary'}
              onClick={requireLogin(() => setFollow(nextFollow[follow]))}
            >
              {followLabel[follow]}
            </Button>
            <Menu
              align="right"
              trigger={({ toggle }) => <IconButton icon={Ellipsis} label={t('common.more')} onClick={toggle} />}
            >
              {({ close }) => (
                <>
                  <MenuItem icon={Share2} onClick={() => { close(); toast(t('toast.linkCopied')) }}>{t('common.share')}</MenuItem>
                  <MenuItem onClick={requireLogin(() => close())}>{t('profile.block')}</MenuItem>
                  <MenuItem danger onClick={() => { close(); setReportOpen(true) }}>{t('common.report')}</MenuItem>
                </>
              )}
            </Menu>
          </>
        }
      />

      {user.private && follow !== 'following' ? (
        <div style={{ paddingBlock: 'var(--sp-12) var(--sp-16)' }}>
          <EmptyState
            icon={Lock}
            title={t('profile.privateTitle')}
            text={t('profile.privateText', { username: `@${user.username}` })}
          />
        </div>
      ) : (
        <>
          <Tabs items={TABS.slice(0, 2)} value={tab} onChange={setTab} />
          <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)' }}>
            {tab === 'videos' && <VideosTab />}
            {tab === 'reviews' && <ReviewsTab />}
          </div>
        </>
      )}

      <ReportContentDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </Page>
  )
}

function ProfileHeader({ user, actions }) {
  const { isLoading } = useDesignState()
  return (
    <section
      style={{ paddingBlock: 'var(--sp-8)', display: 'grid', gap: 'var(--sp-3)', justifyItems: 'center', textAlign: 'center' }}
    >
      {isLoading ? (
        <>
          <Skeleton w={96} h={96} radius="50%" />
          <Skeleton w={160} h={20} />
          <Skeleton w={220} h={12} />
        </>
      ) : (
        <>
          <Avatar name={user.username} size={96} />
          <div>
            <h1 className="t-h1">@{user.username}</h1>
            <p className="t-body c-secondary">{user.name}</p>
          </div>
          {user.bio && <p className="t-body clamp-3" style={{ maxWidth: 460 }}>{user.bio}</p>}
          <div className="row" style={{ gap: 'var(--sp-6)' }}>
            <span className="t-body"><strong>{user.videos}</strong> <span className="c-secondary">{t('profile.counts.videos')}</span></span>
            <span className="t-body"><strong>{user.followers}</strong> <span className="c-secondary">{t('profile.counts.followers')}</span></span>
            <span className="t-body"><strong>{user.following}</strong> <span className="c-secondary">{t('profile.counts.following')}</span></span>
          </div>
          {user.private && <Badge icon={Lock}>{t('common.privateProfile')}</Badge>}
          <div className="row-wrap" style={{ justifyContent: 'center' }}>{actions}</div>
        </>
      )}
    </section>
  )
}

function VideosTab({ own }) {
  const { isEmpty, isLoading } = useDesignState()
  const list = isEmpty ? [] : videos

  if (isLoading) {
    return (
      <div className="video-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} h={0} style={{ aspectRatio: '9 / 16', height: 'auto' }} radius="var(--r-card)" />
        ))}
      </div>
    )
  }
  if (list.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title={t('profile.empty.videosTitle')}
        text={t('profile.empty.videosText')}
        action={own ? <Button variant="primary" to="/upload">{t('profile.empty.videosCta')}</Button> : undefined}
      />
    )
  }
  return (
    <div className="video-grid">
      {list.map((v) => (
        <VideoTile key={v.id} to={`/v/${v.id}`} views={v.views} locked={v.visibility !== 'public'} />
      ))}
    </div>
  )
}

function ReviewsTab({ own }) {
  const { isEmpty, isLoading } = useDesignState()
  const list = isEmpty ? [] : reviews

  if (isLoading) return <div className="stack-4">{Array.from({ length: 2 }).map((_, i) => <ReviewCardSkeleton key={i} />)}</div>
  if (list.length === 0) {
    return <EmptyState icon={ClipboardList} title={t('profile.empty.reviewsTitle')} text={t('profile.empty.reviewsText')} />
  }
  return (
    <div className="stack-4">
      {list.map((r) => {
        const place = places.find((p) => p.id === r.placeId)
        return <ReviewCard key={r.id} review={r} variant={own ? 'own' : 'public'} placeName={place?.name} />
      })}
    </div>
  )
}

function SavedTab() {
  const { isEmpty } = useDesignState()
  const [sub, setSub] = useState('videos')

  if (isEmpty) {
    return <EmptyState icon={Bookmark} title={t('profile.empty.savedTitle')} text={t('profile.empty.savedText')} />
  }

  return (
    <div>
      <div className="row-wrap" style={{ marginBottom: 'var(--sp-4)' }}>
        {['videos', 'places'].map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={sub === k} onClick={() => setSub(k)}>
            {t(`profile.savedTabs.${k}`)}
          </button>
        ))}
      </div>
      {sub === 'videos' ? (
        <div className="video-grid">
          {videos.slice(0, 4).map((v) => <VideoTile key={v.id} to={`/v/${v.id}`} views={v.views} />)}
        </div>
      ) : (
        <div className="list-group">
          {places.slice(0, 3).map((p) => <PlaceRow key={p.id} place={p} />)}
        </div>
      )}
    </div>
  )
}
