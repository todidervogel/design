import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, ChevronRight, Cookie, Download, FileText, Globe, Lock, LogOut, Mail,
  MapPin, Phone, Scale, Shield, Smartphone, User, Video,
} from 'lucide-react'
import { Button, Field, Input, Switch, Textarea, charCount, useToast } from '../../components/ui'
import { Page } from '../../components/layout'
import { DeleteAccountDialog } from '../dialogs/DeleteAccountDialog'
import { useDesignState } from '../../lib/design-state'
import { me } from '../../mock/content'
import { APP_VERSION, DEFAULT_RADIUS } from '../../config'
import { t } from '../../i18n'

/** Eine Zeile der Einstellungsliste: Symbol, Beschriftung, rechts Pfeil oder Schalter. */
function Row({ icon: Icon, label, hint, value, to, onClick, control }) {
  const inner = (
    <>
      {Icon && <Icon size={18} className="c-secondary" style={{ flex: 'none' }} />}
      <span className="grow">
        <span className="t-body">{label}</span>
        {hint && <span className="t-small c-secondary" style={{ display: 'block' }}>{hint}</span>}
      </span>
      {value && <span className="t-small c-tertiary">{value}</span>}
      {control ?? <ChevronRight size={18} className="c-tertiary" />}
    </>
  )
  if (control) return <div className="list-row list-row-static">{inner}</div>
  if (to) return <Link to={to} className="list-row">{inner}</Link>
  return <button type="button" className="list-row" onClick={onClick}>{inner}</button>
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="t-small c-secondary" style={{ marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {title}
      </h2>
      <div className="list-group">{children}</div>
    </section>
  )
}

/** E.10 — Einstellungen */
export default function Settings() {
  const { setSession } = useDesignState()
  const [flags, setFlags] = useState({
    private: false, location: true, autoplay: false,
    nFollow: true, nLike: true, nComment: false, nReply: true, nNews: false,
  })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const set = (k) => (v) => setFlags((f) => ({ ...f, [k]: v }))

  return (
    <Page title={t('settings.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)', maxWidth: 640 }} className="stack-8">
        <h1 className="t-h1">{t('settings.title')}</h1>

        <Section title={t('settings.sections.account')}>
          <Row icon={User} label={t('settings.editProfile')} to="/einstellungen/profil" />
          <Row icon={Mail} label={t('settings.email')} value="name@beispiel.de" to="/einstellungen/profil" />
          <Row icon={Phone} label={t('settings.phone')} value="+49 151 •••• 6789" to="/einstellungen/profil" />
          <Row icon={Lock} label={t('settings.changePassword')} to="/passwort-neu" />
        </Section>

        <Section title={t('settings.sections.privacy')}>
          <Row
            icon={Shield}
            label={t('settings.privateProfile')}
            hint={t('settings.privateProfileHint')}
            control={<Switch checked={flags.private} onChange={set('private')} label={t('settings.privateProfile')} />}
          />
          <Row icon={User} label={t('settings.discoverable')} value={t('settings.discoverableOptions.all')} to="/einstellungen" />
          <Row icon={Lock} label={t('settings.blocked')} to="/einstellungen" />
          <Row
            icon={MapPin}
            label={t('settings.location')}
            hint={t('settings.locationHint')}
            control={<Switch checked={flags.location} onChange={set('location')} label={t('settings.location')} />}
          />
        </Section>

        <Section title={t('settings.sections.content')}>
          <Row icon={MapPin} label={t('settings.defaultRadius')} value={`${DEFAULT_RADIUS} km`} to="/einstellungen" />
          <Row icon={Globe} label={t('settings.language')} value={t('common.german')} to="/einstellungen" />
          <Row icon={Video} label={t('settings.videoQuality')} value={t('settings.videoQualityOptions.auto')} to="/einstellungen" />
          <Row
            icon={Smartphone}
            label={t('settings.autoplayMobile')}
            control={<Switch checked={flags.autoplay} onChange={set('autoplay')} label={t('settings.autoplayMobile')} />}
          />
        </Section>

        <Section title={t('settings.sections.notifications')}>
          {[
            ['nFollow', 'notifyFollowers'], ['nLike', 'notifyLikes'], ['nComment', 'notifyComments'],
            ['nReply', 'notifyReplies'], ['nNews', 'notifyNews'],
          ].map(([key, labelKey]) => (
            <Row
              key={key}
              icon={Bell}
              label={t(`settings.${labelKey}`)}
              control={<Switch checked={flags[key]} onChange={set(key)} label={t(`settings.${labelKey}`)} />}
            />
          ))}
        </Section>

        <Section title={t('settings.sections.data')}>
          <Row icon={Download} label={t('settings.downloadData')} to="/einstellungen/daten" />
          <Row icon={Cookie} label={t('settings.cookies')} to="/cookies" />
        </Section>

        <Section title={t('settings.sections.legal')}>
          <Row icon={FileText} label={t('settings.guidelines')} to="/richtlinien" />
          <Row icon={FileText} label={t('settings.terms')} to="/agb" />
          <Row icon={Shield} label={t('settings.privacy')} to="/datenschutz" />
          <Row icon={Scale} label={t('settings.imprint')} to="/impressum" />
        </Section>

        <Section title={t('settings.sections.help')}>
          <Row label={t('settings.helpCenter')} to="/einstellungen" />
          <Row label={t('settings.reportProblem')} to="/einstellungen" />
          <Row label={t('settings.about')} value={`Version ${APP_VERSION}`} to="/einstellungen" />
        </Section>

        <div className="stack-2" style={{ paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <Button variant="quiet" full icon={LogOut} className="c-danger" style={{ color: 'var(--danger)' }} onClick={() => setSession('guest')}>
            {t('settings.logout')}
          </Button>
          <Button variant="quiet" full style={{ color: 'var(--danger)' }} onClick={() => setDeleteOpen(true)}>
            {t('settings.deleteAccount')}
          </Button>
        </div>
      </div>

      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </Page>
  )
}

/** E.9 — Profil bearbeiten */
export function EditProfile() {
  const [name, setName] = useState('Max Muster')
  const [bio, setBio] = useState('Isst sich einmal quer durch Prenzlauer Berg.')
  const toast = useToast()

  return (
    <Page title={t('profile.editPage.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)', maxWidth: 480 }} className="stack-6">
        <h1 className="t-h1">{t('profile.editPage.title')}</h1>

        <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--sp-2)' }}>
          <button
            type="button"
            className="avatar-placeholder"
            style={{ width: 96, height: 96, fontSize: 13, cursor: 'pointer', position: 'relative' }}
          >
            {t('profile.editPage.changeImage')}
          </button>
          <Button variant="quiet" size="sm">{t('profile.editPage.removeImage')}</Button>
        </div>

        <div className="stack-4">
          <Field label={t('profile.editPage.displayName')} count={charCount(name, 40)}>
            {(id) => <Input id={id} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />}
          </Field>

          <Field label={t('profile.editPage.username')} hint={t('profile.editPage.usernameHint')}>
            {(id) => (
              <div className="input-affix">
                <span className="affix">@</span>
                <input id={id} className="input" defaultValue={me.username} />
              </div>
            )}
          </Field>

          <Field label={t('profile.editPage.bio')} count={charCount(bio, 150)}>
            {(id) => <Textarea id={id} rows={3} maxLength={150} value={bio} onChange={(e) => setBio(e.target.value)} />}
          </Field>

          <Field label={t('profile.editPage.website')}>
            {(id) => <Input id={id} placeholder={t('profile.editPage.websitePlaceholder')} />}
          </Field>
        </div>

        <div className="row">
          <Button variant="primary" onClick={() => toast(t('toast.saved'))}>{t('common.save')}</Button>
          <Button variant="quiet" to="/profil">{t('common.cancel')}</Button>
        </div>
      </div>
    </Page>
  )
}

/** E.12 — Meine Daten herunterladen */
export function DataExport() {
  const toast = useToast()
  return (
    <Page title={t('settings.dataPage.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)', maxWidth: 480 }} className="stack-6">
        <div>
          <h1 className="t-h1">{t('settings.dataPage.title')}</h1>
          <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('settings.dataPage.text')}</p>
        </div>

        <div className="stack-2">
          {[['profile', true], ['videos', true], ['reviews', true], ['saved', true], ['activity', false]].map(([key, on]) => (
            <label className="check" key={key}>
              <input type="checkbox" defaultChecked={on} />
              <span className="check-text">{t(`settings.dataPage.${key}`)}</span>
            </label>
          ))}
        </div>

        <div>
          <Button variant="primary" onClick={() => toast(t('toast.saved'))}>{t('settings.dataPage.submit')}</Button>
          <p className="t-small c-secondary" style={{ marginTop: 'var(--sp-3)' }}>{t('settings.dataPage.hint')}</p>
        </div>
      </div>
    </Page>
  )
}
