import { useNavigate } from 'react-router-dom'
import { Gauge, Images, SwitchCamera, Timer, X, Zap } from 'lucide-react'
import { Button, IconButton } from '../../components/ui'
import { FullscreenPage } from '../../components/layout'
import { t } from '../../i18n'

/** E.1 — Video aufnehmen, Schritt 1 */
export default function UploadCapture() {
  const navigate = useNavigate()

  return (
    <FullscreenPage title={t('bottomNav.capture')} bottomNav={false}>
      <div className="capture">
        <div className="capture-preview" aria-hidden="true" />

        {/* Oben */}
        <div className="row-between" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'var(--sp-4)', zIndex: 10 }}>
          <IconButton icon={X} label={t('common.cancel')} tone="on-dark" onClick={() => navigate(-1)} />
          <div className="row" style={{ gap: 0 }}>
            <IconButton icon={Zap} label={t('upload.capture.flash')} tone="on-dark" />
            <IconButton icon={SwitchCamera} label={t('upload.capture.switch')} tone="on-dark" />
          </div>
        </div>

        {/* Rechte Spalte — im MVP ausgegraut */}
        <div style={{ position: 'absolute', right: 'var(--sp-3)', top: '35%', zIndex: 10, display: 'grid', gap: 'var(--sp-3)', opacity: 0.4 }}>
          <IconButton icon={Timer} label={t('upload.capture.timer')} tone="on-dark" disabled />
          <IconButton icon={Gauge} label={t('upload.capture.speed')} tone="on-dark" disabled />
        </div>

        {/* Unten */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'var(--sp-4)', zIndex: 10 }}>
          <div className="row" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
            <div className="progress-track grow"><div className="progress-fill" style={{ width: '22%' }} /></div>
            <span className="t-small c-on-dark-dim">0:00 / 1:00</span>
          </div>

          <p className="t-small c-on-dark-dim" style={{ textAlign: 'center', marginBottom: 'var(--sp-3)' }}>
            {t('upload.capture.maxLength')}
          </p>

          <div className="row-between">
            <button
              type="button"
              style={{ background: 'none', border: 0, color: '#fff', display: 'grid', justifyItems: 'center', gap: 4, cursor: 'pointer', width: 72 }}
            >
              <Images size={24} />
              <span className="t-tiny">{t('upload.capture.gallery')}</span>
            </button>

            <button
              type="button"
              className="capture-shutter"
              aria-label={t('upload.capture.shutterHint')}
              title={t('upload.capture.shutterHint')}
              onClick={() => navigate('/upload/bearbeiten')}
            />

            <div style={{ width: 72, textAlign: 'right' }}>
              <Button variant="primary" size="sm" to="/upload/bearbeiten">{t('upload.capture.next')}</Button>
            </div>
          </div>
        </div>
      </div>
    </FullscreenPage>
  )
}
