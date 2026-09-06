import { useState } from 'react'
import { Camera, Ellipsis, Play, Video } from 'lucide-react'
import {
  Badge, Button, Chip, Dropzone, EmptyState, Field, Menu, MenuItem, Modal, ModalActions,
  Select, Skeleton, Textarea, charCount, useToast,
} from '../../components/ui'
import { GastroShell } from './GastroShell'
import { ConsoleHeader } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { dishes, videos } from '../../mock/content'
import { t } from '../../i18n'

const FILTERS = ['all', 'published', 'review', 'rejected']
const STATUS_TONE = { published: 'success', review: 'warning', rejected: 'danger' }
const STATUS_KEY = { published: 'published', review: 'review', rejected: 'rejected' }

/** F.5 — Gastro-Videos */
export default function GastroVideos() {
  const { isEmpty, isLoading } = useDesignState()
  const [filter, setFilter] = useState('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const toast = useToast()

  const list = isEmpty ? [] : videos.filter((v) => filter === 'all' || v.status === filter)

  return (
    <GastroShell title={t('gastro.videos.title')}>
      <ConsoleHeader title={t('gastro.videos.title')}>
        <Button variant="primary" onClick={() => setUploadOpen(true)}>{t('gastro.videos.upload')}</Button>
      </ConsoleHeader>

      <div className="chip-scroll" style={{ marginBottom: 'var(--sp-6)' }}>
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{t(`gastro.videos.filters.${f}`)}</Chip>
        ))}
      </div>

      {isLoading ? (
        <div className="video-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} h={0} style={{ aspectRatio: '9 / 16', height: 'auto' }} radius="var(--r-card)" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Camera}
          title={t('gastro.videos.emptyTitle')}
          text={t('gastro.videos.emptyText')}
          action={<Button variant="primary" onClick={() => setUploadOpen(true)}>{t('gastro.videos.emptyCta')}</Button>}
        />
      ) : (
        <div className="video-grid">
          {list.map((v) => (
            <div key={v.id}>
              <div className="video-tile" style={{ position: 'relative' }}>
                <span className="video-tile-top">
                  <Badge tone={STATUS_TONE[v.status]}>{t(`gastro.videos.filters.${STATUS_KEY[v.status]}`)}</Badge>
                  <Menu
                    align="right"
                    trigger={({ toggle }) => (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); toggle() }}
                        className="btn btn-icon btn-icon-glass"
                        style={{ width: 28, height: 28 }}
                        aria-label={t('common.more')}
                      >
                        <Ellipsis size={16} />
                      </button>
                    )}
                  >
                    {({ close }) => (
                      <>
                        <MenuItem onClick={close}>{t('gastro.videos.menu.view')}</MenuItem>
                        <MenuItem onClick={close}>{t('gastro.videos.menu.editCaption')}</MenuItem>
                        <MenuItem onClick={close}>{t('gastro.videos.menu.hide')}</MenuItem>
                        <MenuItem danger onClick={close}>{t('gastro.videos.menu.delete')}</MenuItem>
                      </>
                    )}
                  </Menu>
                </span>
                <span className="video-tile-body">
                  <span className="t-small c-on-dark row" style={{ gap: 4 }}>
                    <Play size={12} fill="#fff" strokeWidth={0} /> {v.views}
                  </span>
                  <span className="t-small c-on-dark-dim">{v.date}</span>
                </span>
              </div>
              {v.status === 'rejected' && (
                <p className="t-small c-danger" style={{ marginTop: 4 }}>
                  {t('gastro.videos.rejectedReason', { reason: v.rejectReason })} ·{' '}
                  <button type="button" className="btn btn-quiet btn-sm" style={{ color: 'var(--danger)' }}>
                    {t('gastro.videos.appeal')}
                  </button>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        wide
        title={t('gastro.videos.dialogTitle')}
        actions={
          <ModalActions onCancel={() => setUploadOpen(false)}>
            <Button variant="primary" onClick={() => { setUploadOpen(false); toast(t('toast.saved')) }}>
              {t('gastro.videos.submit')}
            </Button>
          </ModalActions>
        }
      >
        <div className="split" style={{ gridTemplateColumns: '180px 1fr' }}>
          <Dropzone icon={Video} text={t('gastro.setup.dropVideo')} hint={t('gastro.setup.videoHint')} small />
          <div className="stack-3">
            <Field label={t('gastro.videos.captionLabel')} count={charCount(caption, 300)}>
              {(id) => (
                <Textarea id={id} rows={3} maxLength={300} value={caption} onChange={(e) => setCaption(e.target.value)} />
              )}
            </Field>
            <Field label={t('gastro.videos.dishLabel')}>
              {(id) => <Select id={id} placeholder="—" options={dishes.map((d) => ({ value: d.id, label: d.name }))} />}
            </Field>
            <p className="t-small c-secondary">{t('gastro.videos.reviewHint')}</p>
          </div>
        </div>
      </Modal>
    </GastroShell>
  )
}
