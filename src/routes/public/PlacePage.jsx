import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Bookmark, Camera, ChevronDown, ChevronLeft, Globe, Image as ImageIcon, Info, MapPin, Phone,
  Share2, Navigation, UtensilsCrossed, ClipboardList,
} from 'lucide-react'
import {
  Badge, Button, Card, Chip, EmptyState, IconButton, Menu, Notice, RatingFull,
  ReviewCard, ReviewCardSkeleton, Skeleton, Stars, Tabs, Thumb, VerifiedMark, VideoTile,
  useToast,
} from '../../components/ui'
import { BarePage } from '../../components/layout'
import { ReportPlaceDialog } from '../dialogs/ReportPlaceDialog'
import { ReportContentDialog } from '../dialogs/ReportContentDialog'
import { useDesignState } from '../../lib/design-state'
import { placeBySlug } from '../../mock/places'
import { dishes, reviews, users, videos } from '../../mock/content'
import { MVP_STAGE } from '../../config'
import { t } from '../../i18n'

const TABS = [
  { id: 'videos', label: t('place.tabs.videos') },
  { id: 'dishes', label: t('place.tabs.dishes') },
  { id: 'reviews', label: t('place.tabs.reviews') },
  { id: 'info', label: t('place.tabs.info') },
]

/** C.3 — Gastro-Seite /g/[slug] · D.6 — Einstieg über QR-Code */
export default function PlacePage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const place = placeBySlug(slug)
  const { isEmpty, isLoading } = useDesignState()
  const [tab, setTab] = useState('videos')
  const [hoursOpen, setHoursOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const toast = useToast()
  const fromQr = params.get('src') === 'qr'

  return (
    <BarePage title={place.name}>
      {/* D.6 — Band beim Einstieg über den QR-Code im Lokal */}
      {fromQr && (
        <div className="build-banner" style={{ paddingRight: 'var(--sp-4)' }}>
          <span>
            📍 {t('place.qrBanner', { name: place.name })}{' '}
            <Link to="/registrieren" className="c-accent" style={{ fontWeight: 600 }}>{t('place.qrCta')}</Link>
          </span>
        </div>
      )}

      {/* Kopfbereich */}
      <div className="cover">
        {isLoading
          ? <Skeleton w="100%" h="100%" radius={0} />
          : place.hasCover ? <ImageIcon size={32} /> : <UtensilsCrossed size={40} />}
        <span className="cover-back only-mobile">
          <IconButton icon={ChevronLeft} label={t('common.back')} tone="glass" to="/karte" />
        </span>
        <span className="cover-actions">
          <IconButton icon={Share2} label={t('common.share')} tone="glass" onClick={() => toast(t('toast.linkCopied'))} />
          <IconButton icon={Bookmark} label={t('place.save')} tone="glass" onClick={() => toast(t('toast.saved'))} />
        </span>
      </div>

      <div className="container">
        {/* Informationsblock */}
        <section style={{ paddingTop: 'var(--sp-4)' }} className="stack-3">
          <div className="row-wrap" style={{ gap: 'var(--sp-2)' }}>
            <h1 className="t-h1">{place.name}</h1>
            {place.verified && <VerifiedMark withLabel />}
          </div>

          {!place.verified && (
            <Notice icon={Info}>
              {t('place.unverifiedNotice')}{' '}
              <Link to="/gastro/eintragen" className="c-accent">{t('place.unverifiedLink')}</Link>
            </Notice>
          )}

          <p className="t-body c-secondary">{place.tags.join(' · ')} · {place.price}</p>

          {isLoading ? (
            <div className="stack-2" style={{ maxWidth: 280 }}>
              <Skeleton h={16} /><Skeleton h={16} /><Skeleton h={16} />
            </div>
          ) : (
            <RatingFull rating={place.rating} count={place.reviewCount || undefined} />
          )}

          {/* Öffnungszeiten */}
          <div>
            <button
              type="button"
              className="row"
              style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', gap: 4 }}
              aria-expanded={hoursOpen}
              onClick={() => setHoursOpen((o) => !o)}
            >
              <span className="t-body" style={{ color: place.open ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                {place.open
                  ? t('hours.openUntil', { time: place.closesAt })
                  : t('hours.closedUntil', { day: t('hours.tomorrow'), time: place.opensAt })}
              </span>
              <ChevronDown size={16} style={{ transform: hoursOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {hoursOpen && <HoursTable hours={place.hours} />}
          </div>

          <div className="row" style={{ alignItems: 'flex-start' }}>
            <MapPin size={18} className="c-secondary" style={{ flex: 'none', marginTop: 2 }} />
            <span className="t-body">{place.address}</span>
          </div>
          <div className="mini-map"><MapPin size={22} /></div>

          {place.phone && (
            <a className="row" href={`tel:${place.phone}`} style={{ textDecoration: 'none' }}>
              <Phone size={18} className="c-secondary" />
              <span className="t-body">{place.phone}</span>
            </a>
          )}
          {place.website && (
            <a className="row" href={`https://${place.website}`} style={{ textDecoration: 'none' }}>
              <Globe size={18} className="c-secondary" />
              <span className="t-body c-accent">{place.website}</span>
            </a>
          )}
        </section>

        {/* Aktionsleiste */}
        <div className="action-bar">
          {MVP_STAGE >= 2 && <Button variant="primary" onClick={() => toast(t('toast.noAction'), 'info')}>{t('place.order')}</Button>}
          <Button variant="secondary" icon={Navigation} onClick={() => toast(t('toast.noAction'), 'info')}>{t('place.route')}</Button>
          <Button variant="secondary" icon={Phone} href={place.phone ? `tel:${place.phone}` : undefined}>{t('place.call')}</Button>
          <Button variant="secondary" icon={Bookmark} onClick={() => toast(t('toast.saved'))}>{t('place.save')}</Button>
          <Button variant="secondary" icon={Share2} onClick={() => toast(t('toast.linkCopied'))}>{t('common.share')}</Button>
        </div>

        {/* Reiter */}
        <Tabs items={TABS} value={tab} onChange={setTab} />

        <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)' }}>
          {tab === 'videos' && <VideosTab place={place} />}
          {tab === 'dishes' && <DishesTab />}
          {tab === 'reviews' && <ReviewsTab />}
          {tab === 'info' && <InfoTab place={place} onReport={() => setReportOpen(true)} />}
        </div>
      </div>

      <ReportPlaceDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </BarePage>
  )
}

function HoursTable({ hours, today = 'mo' }) {
  return (
    <table className="hours-table" style={{ marginTop: 'var(--sp-2)', maxWidth: 280 }}>
      <tbody>
        {hours.map(([day, time]) => (
          <tr key={day} className={day === today ? 'is-today' : undefined}>
            <td style={{ width: 110 }}>{t(`hours.days.${day}`)}</td>
            <td className={time === 'Geschlossen' ? 'c-secondary' : undefined}>{time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* --- Reiter „Videos“ ----------------------------------------------------- */
function VideosTab({ place }) {
  const { isEmpty, isLoading } = useDesignState()
  const list = isEmpty ? [] : videos.filter((v) => v.placeId === place.id || v.placeId === 'p1')

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
        title={t('place.videosEmptyTitle')}
        text={t('place.videosEmptyText')}
        action={<Button variant="primary" to="/upload">{t('place.videosEmptyCta')}</Button>}
      />
    )
  }
  return (
    <div className="video-grid">
      {list.map((v) => (
        <VideoTile
          key={v.id}
          to={`/v/${v.id}`}
          views={v.views}
          author={users.find((u) => u.id === v.authorId)?.username}
        />
      ))}
    </div>
  )
}

/* --- Reiter „Gerichte“ --------------------------------------------------- */
function DishesTab() {
  const { isEmpty, isLoading } = useDesignState()
  const list = isEmpty ? [] : dishes

  if (isLoading) {
    return (
      <div className="stack-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="row" key={i}>
            <Skeleton w={64} h={64} radius="var(--r-card)" />
            <div className="grow stack-2"><Skeleton w="40%" h={14} /><Skeleton w="80%" h={12} /></div>
          </div>
        ))}
      </div>
    )
  }
  if (list.length === 0) {
    return <EmptyState icon={ClipboardList} title={t('place.dishesEmptyTitle')} text={t('place.dishesEmptyText')} />
  }
  return (
    <div>
      <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
        <span className="t-small c-secondary">{list.length} Gerichte</span>
        <Menu
          align="right"
          trigger={({ toggle }) => (
            <button type="button" className="chip" onClick={toggle}>
              {t('place.dishesSort')} <ChevronDown size={14} />
            </button>
          )}
        >
          {({ close }) => (
            <>
              {['popular', 'best', 'priceAsc', 'priceDesc'].map((k) => (
                <button key={k} type="button" className="menu-item" onClick={close}>
                  {t(`place.dishesSortOptions.${k}`)}
                </button>
              ))}
            </>
          )}
        </Menu>
      </div>

      <div className="stack-4">
        {list.map((d) => (
          <div className="row" key={d.id} style={{ alignItems: 'flex-start', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
            <Thumb size={64} icon={UtensilsCrossed} />
            <div className="grow">
              <div className="row" style={{ gap: 4 }}>
                <span className="t-h3">{d.name}</span>
                {d.confirmed && <VerifiedMark />}
              </div>
              <p className="t-small c-secondary clamp-2">{d.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="t-body-bold">{d.price}</p>
              <p className="t-small c-secondary row" style={{ gap: 4, justifyContent: 'flex-end' }}>
                <Stars value={d.rating} size={12} /> {d.rating.toFixed(1).replace('.', ',')} ({d.ratingCount})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* --- Reiter „Bewertungen“ ------------------------------------------------ */
function ReviewsTab() {
  const { isEmpty, isLoading } = useDesignState()
  const [filter, setFilter] = useState('all')
  const [reportOpen, setReportOpen] = useState(false)
  const list = isEmpty ? [] : reviews

  return (
    <div className="stack-4">
      <div className="row-between" style={{ flexWrap: 'wrap' }}>
        <div className="row-wrap">
          {['all', 'withVideo', 'verified'].map((k) => (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>{t(`place.reviewFilters.${k}`)}</Chip>
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
        <>{Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}</>
      ) : list.length === 0 ? (
        <EmptyState icon={ClipboardList} title={t('place.reviewsEmptyTitle')} text={t('place.reviewsEmptyText')} />
      ) : (
        list.map((r) => <ReviewCard key={r.id} review={r} onReport={() => setReportOpen(true)} />)
      )}

      <ReportContentDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}

/* --- Reiter „Infos“ ------------------------------------------------------ */
function InfoTab({ place, onReport }) {
  return (
    <div className="stack-6">
      <p className="t-body">{place.description}</p>

      <div>
        <h3 className="t-h3" style={{ marginBottom: 'var(--sp-3)' }}>{t('place.features')}</h3>
        <div className="row-wrap">
          {place.features.map((f) => <Chip key={f}>{t(`features.${f}`)}</Chip>)}
        </div>
      </div>

      <div>
        <h3 className="t-h3" style={{ marginBottom: 'var(--sp-2)' }}>{t('gastro.profile.sectionHours')}</h3>
        <HoursTable hours={place.hours} />
      </div>

      <div>
        <h3 className="t-h3" style={{ marginBottom: 'var(--sp-2)' }}>{t('place.address')}</h3>
        <p className="t-body c-secondary" style={{ marginBottom: 'var(--sp-3)' }}>{place.address}</p>
        <div className="mini-map mini-map-lg"><MapPin size={26} /></div>
      </div>

      <div>
        <Button variant="quiet" onClick={onReport}>{t('place.reportProblem')}</Button>
      </div>
    </div>
  )
}
