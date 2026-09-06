import { Lock, Music, Smile, SlidersHorizontal, Type } from 'lucide-react'
import { Button } from '../../components/ui'
import { FullscreenPage } from '../../components/layout'
import { t } from '../../i18n'

const TOOLS = [
  [Music, 'music'], [Type, 'text'], [SlidersHorizontal, 'filter'], [Smile, 'sticker'],
]

/** E.2 — Video zuschneiden, Schritt 2 */
export default function UploadTrim() {
  return (
    <FullscreenPage title={t('upload.trim.title')} bottomNav={false}>
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
        {/* Videovorschau */}
        <div style={{ flex: '1 1 auto', background: 'linear-gradient(200deg, #33333B, #131317)', minHeight: 320 }} />

        <div style={{ padding: 'var(--sp-4)' }} className="stack-4">
          {/* Zeitleiste mit Miniaturbildern und zwei Griffen */}
          <div>
            <div style={{ position: 'relative', display: 'flex', gap: 2, height: 56, borderRadius: 'var(--r-control)', overflow: 'hidden' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} style={{ flex: 1, background: i > 1 && i < 8 ? '#3A3A44' : '#22222A' }} />
              ))}
              <span style={{ position: 'absolute', left: '18%', top: 0, bottom: 0, width: 10, background: 'var(--accent)', borderRadius: '4px 0 0 4px', cursor: 'ew-resize' }} />
              <span style={{ position: 'absolute', left: '78%', top: 0, bottom: 0, width: 10, background: 'var(--accent)', borderRadius: '0 4px 4px 0', cursor: 'ew-resize' }} />
            </div>
            <p className="t-small c-on-dark-dim" style={{ marginTop: 'var(--sp-2)' }}>
              {t('upload.trim.selected', { from: '0:12', to: '0:47', seconds: 35 })}
            </p>
          </div>

          {/* Werkzeugleiste — im MVP alle ausgegraut */}
          <div className="row" style={{ gap: 'var(--sp-4)', justifyContent: 'center' }}>
            {TOOLS.map(([Icon, key]) => (
              <button
                key={key}
                type="button"
                disabled
                title={t('common.comingSoon')}
                style={{ background: 'none', border: 0, color: '#fff', opacity: 0.4, display: 'grid', justifyItems: 'center', gap: 4, cursor: 'default' }}
              >
                <span style={{ position: 'relative' }}>
                  <Icon size={22} />
                  <Lock size={11} style={{ position: 'absolute', right: -6, bottom: -2 }} />
                </span>
                <span className="t-tiny">{t(`upload.trim.tools.${key}`)}</span>
              </button>
            ))}
          </div>
          <p className="t-small c-on-dark-dim" style={{ textAlign: 'center' }}>{t('common.comingSoon')}</p>

          <div className="row-between">
            <Button variant="secondary" to="/upload" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
              {t('common.back')}
            </Button>
            <Button variant="primary" to="/upload/restaurant">{t('common.next')}</Button>
          </div>
        </div>
      </div>
    </FullscreenPage>
  )
}
