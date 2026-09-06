import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Play } from 'lucide-react'
import {
  Button, Card, EmptyState, Field, Notice, RadioCard, Switch, Textarea, charCount,
} from '../../components/ui'
import { Page } from '../../components/layout'
import { MVP_STAGE } from '../../config'
import { t, tNodes } from '../../i18n'

/** E.6 — Veröffentlichen, Schritt 5 */
export default function UploadPublish() {
  const [caption, setCaption] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [comments, setComments] = useState(false)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <Page title={t('upload.publish.doneTitle')} footer={false}>
        <div style={{ paddingBlock: 'var(--sp-16)' }}>
          <EmptyState
            icon={CheckCircle2}
            title={t('upload.publish.doneTitle')}
            text={t('upload.publish.doneText')}
            action={<Button variant="primary" to="/profil">{t('upload.publish.doneProfile')}</Button>}
            secondaryAction={<Button variant="secondary" to="/upload">{t('upload.publish.doneAgain')}</Button>}
          />
        </div>
      </Page>
    )
  }

  return (
    <Page title={t('upload.publish.title')} footer={false}>
      <div className="split" style={{ paddingBlock: 'var(--sp-6) var(--sp-16)' }}>
        {/* Videovorschau */}
        <div
          style={{
            background: '#000', borderRadius: 'var(--r-card)', display: 'grid', placeItems: 'center',
            aspectRatio: '9 / 16', maxHeight: 420, width: '100%', maxWidth: 240,
          }}
        >
          <Play size={32} color="#fff" fill="#fff" strokeWidth={0} />
        </div>

        <div className="stack-6">
          <Field label={t('upload.publish.captionLabel')} count={charCount(caption, 300)}>
            {(id) => (
              <Textarea
                id={id}
                rows={3}
                maxLength={300}
                placeholder={t('upload.publish.captionPlaceholder')}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            )}
          </Field>

          {/* Zusammenfassung — nicht bearbeitbar */}
          <Card flat>
            <div className="row-between" style={{ alignItems: 'flex-start' }}>
              <div className="stack-2">
                <p className="t-body">📍 Trattoria Bella · ✓ {t('upload.publish.verifiedOnSite')}</p>
                <p className="t-body">★ 4 {t('rating.food')} · ★ 5 {t('rating.service')} · ★ 3 {t('rating.price')}</p>
                <p className="t-body">{t('upload.publish.dishesRated', { count: 2 })}</p>
              </div>
              <Link to="/upload/bewertung" className="btn btn-quiet btn-sm">{t('upload.publish.summaryChange')}</Link>
            </div>
          </Card>

          <div>
            <p className="field-label">{t('upload.publish.visibilityLabel')}</p>
            <div className="stack-2">
              {['public', 'friends', 'private'].map((v) => (
                <RadioCard
                  key={v}
                  name="visibility"
                  label={t(`upload.publish.visibility.${v}Title`)}
                  description={t(`upload.publish.visibility.${v}Text`)}
                  checked={visibility === v}
                  onChange={() => setVisibility(v)}
                />
              ))}
            </div>
          </div>

          <div className="row-between" style={{ opacity: MVP_STAGE >= 2 ? 1 : 0.4 }}>
            <span className="t-body">{t('upload.publish.allowComments')}</span>
            <Switch checked={comments} onChange={setComments} disabled={MVP_STAGE < 2} label={t('upload.publish.allowComments')} />
          </div>

          <Notice>
            {tNodes('upload.publish.consent', {
              guidelines: <Link to="/richtlinien" className="c-accent">{t('footer.guidelines')}</Link>,
            })}
          </Notice>

          <div className="row-between">
            <Button variant="secondary" to="/upload/bewertung">{t('common.back')}</Button>
            <Button variant="primary" onClick={() => setDone(true)}>{t('upload.publish.submit')}</Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
