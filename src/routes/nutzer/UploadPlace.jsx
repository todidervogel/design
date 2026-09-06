import { useState } from 'react'
import { Check, Search, UtensilsCrossed } from 'lucide-react'
import { Button, Notice, SkeletonRow, Thumb } from '../../components/ui'
import { Page } from '../../components/layout'
import { MissingPlaceDialog } from '../dialogs/MissingPlaceDialog'
import { useDesignState } from '../../lib/design-state'
import { places } from '../../mock/places'
import { t } from '../../i18n'

/** E.3 — Restaurant auswählen, Schritt 3 */
export default function UploadPlace() {
  const { isLoading, isEmpty } = useDesignState()
  const [selected, setSelected] = useState('p2')
  const [missingOpen, setMissingOpen] = useState(false)
  const list = isEmpty ? [] : places

  /** Unter 150 m gilt das Video als „vor Ort“ verifiziert. */
  const isOnSite = (p) => p.distance.includes('m') && parseInt(p.distance, 10) < 150

  return (
    <Page title={t('upload.place.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6) 120px' }} className="stack-4">
        <div>
          <h1 className="t-h1">{t('upload.place.title')}</h1>
          <p className="t-body c-secondary" style={{ marginTop: 'var(--sp-2)' }}>{t('upload.place.subtitle')}</p>
        </div>

        <div className="header-search" style={{ maxWidth: 'none' }}>
          <Search size={18} className="search-icon" />
          <input className="input" style={{ height: 44 }} placeholder={t('upload.place.searchPlaceholder')} aria-label={t('common.search')} />
        </div>

        <h2 className="t-small c-secondary">{t('upload.place.nearby')}</h2>

        <div className="list-group">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : list.map((p) => (
              <div key={p.id}>
                <label
                  className="list-row"
                  style={selected === p.id ? { background: 'var(--accent-soft)' } : undefined}
                >
                  <Thumb size={48} icon={UtensilsCrossed} />
                  <span className="grow">
                    <span className="t-h3" style={{ display: 'block' }}>{p.name}</span>
                    <span className="t-small c-secondary">{p.cuisine} · {p.distance}</span>
                  </span>
                  <input
                    type="radio"
                    name="place"
                    checked={selected === p.id}
                    onChange={() => setSelected(p.id)}
                    style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                  />
                </label>
                {selected === p.id && isOnSite(p) && (
                  <div style={{ padding: '0 var(--sp-4) var(--sp-3)' }}>
                    <Notice tone="success" icon={Check}>
                      <span dangerouslySetInnerHTML={{ __html: t('upload.place.onSiteNotice').replace('verifiziert', '<strong>verifiziert</strong>') }} />
                    </Notice>
                  </div>
                )}
              </div>
            ))}
        </div>

        <Button variant="quiet" onClick={() => setMissingOpen(true)}>{t('upload.place.missing')}</Button>
      </div>

      <div className="action-bar" style={{ position: 'fixed', bottom: 68, left: 0, right: 0, padding: 'var(--sp-3) var(--gutter)', gridAutoFlow: 'row' }}>
        <Button variant="primary" full to="/upload/bewertung">{t('common.next')}</Button>
      </div>

      <MissingPlaceDialog open={missingOpen} onClose={() => setMissingOpen(false)} />
    </Page>
  )
}
