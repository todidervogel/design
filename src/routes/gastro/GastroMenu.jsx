import { useState } from 'react'
import { ClipboardList, Ellipsis, GripVertical, Image, Pencil, Trash2, UtensilsCrossed } from 'lucide-react'
import {
  Badge, Button, Checkbox, Chip, Dropzone, EmptyState, Field, IconButton, Input,
  Menu, MenuItem, Modal, ModalActions, Select, Skeleton, Switch, Textarea, Thumb,
  charCount, useToast,
} from '../../components/ui'
import { GastroShell } from './GastroShell'
import { ConsoleHeader } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { dishes } from '../../mock/content'
import { t } from '../../i18n'

const CATEGORIES = ['vorspeisen', 'hauptgerichte', 'desserts', 'getraenke']
const TAGS = ['vegetarisch', 'vegan', 'glutenfrei', 'scharf']
const ALLERGENS = ['Gluten', 'Milch', 'Eier', 'Nüsse', 'Soja', 'Sellerie', 'Senf', 'Fisch']

/** F.6 — Gastro-Speisekarte */
export default function GastroMenu() {
  const { isEmpty, isLoading } = useDesignState()
  const [dialog, setDialog] = useState(null) // null | 'add' | dishId
  const [visible, setVisible] = useState(() => Object.fromEntries(dishes.map((d) => [d.id, d.visible])))
  const toast = useToast()

  const list = isEmpty ? [] : dishes

  return (
    <GastroShell title={t('gastro.menu.title')}>
      <ConsoleHeader title={t('gastro.menu.title')}>
        <Button variant="secondary" onClick={() => toast(t('toast.noAction'), 'info')}>{t('gastro.menu.addCategory')}</Button>
        <Button variant="primary" onClick={() => setDialog('add')}>{t('gastro.menu.addDish')}</Button>
      </ConsoleHeader>

      {isLoading ? (
        <div className="stack-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={64} radius="var(--r-card)" />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={t('gastro.menu.emptyTitle')}
          text={t('gastro.menu.emptyText')}
          action={<Button variant="primary" onClick={() => setDialog('add')}>{t('gastro.menu.emptyCta')}</Button>}
        />
      ) : (
        <div className="stack-8">
          {CATEGORIES.map((cat) => {
            const items = list.filter((d) => d.category === cat)
            if (items.length === 0) return null
            return (
              <section key={cat}>
                <div className="row-between" style={{ marginBottom: 'var(--sp-3)' }}>
                  <div className="row" style={{ gap: 'var(--sp-2)' }}>
                    <GripVertical size={18} className="c-tertiary" style={{ cursor: 'grab' }} />
                    <h2 className="t-h2">{t(`gastro.menu.categories.${cat}`)}</h2>
                  </div>
                  <Menu
                    align="right"
                    trigger={({ toggle }) => <IconButton icon={Ellipsis} label={t('common.more')} onClick={toggle} />}
                  >
                    {({ close }) => (
                      <>
                        <MenuItem onClick={close}>{t('common.rename')}</MenuItem>
                        <MenuItem danger onClick={close}>{t('common.delete')}</MenuItem>
                      </>
                    )}
                  </Menu>
                </div>

                <div className="list-group">
                  {items.map((d) => (
                    <div className="list-row list-row-static" key={d.id}>
                      <GripVertical size={16} className="c-tertiary" style={{ cursor: 'grab', flex: 'none' }} />
                      <Thumb size={48} icon={UtensilsCrossed} />
                      <div className="grow">
                        <p className="t-body-bold">{d.name}</p>
                        <p className="t-small c-secondary clamp-2">{d.description}</p>
                      </div>
                      <span className="t-body-bold" style={{ flex: 'none' }}>{d.price}</span>
                      <div className="row" style={{ gap: 'var(--sp-2)', flex: 'none' }}>
                        <span className="t-small c-secondary only-desktop">{t('gastro.menu.visible')}</span>
                        <Switch
                          checked={!!visible[d.id]}
                          onChange={(v) => setVisible((s) => ({ ...s, [d.id]: v }))}
                          label={t('gastro.menu.visible')}
                        />
                        <IconButton icon={Pencil} label={t('common.edit')} onClick={() => setDialog(d.id)} />
                        <IconButton icon={Trash2} label={t('common.delete')} onClick={() => toast(t('toast.noAction'), 'info')} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <DishDialog open={dialog != null} isNew={dialog === 'add'} onClose={() => setDialog(null)} />
    </GastroShell>
  )
}

function DishDialog({ open, isNew, onClose }) {
  const [description, setDescription] = useState('')
  const toast = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? t('gastro.menu.dialogAdd') : t('gastro.menu.dialogEdit')}
      actions={
        <ModalActions onCancel={onClose}>
          <Button variant="primary" onClick={() => { onClose(); toast(t('toast.saved')) }}>{t('common.save')}</Button>
        </ModalActions>
      }
    >
      <div className="stack-3">
        <Field label={t('gastro.menu.nameLabel')} required>
          {(id) => <Input id={id} placeholder={t('gastro.menu.namePlaceholder')} />}
        </Field>

        <Field label={t('gastro.menu.descriptionLabel')} count={charCount(description, 300)}>
          {(id) => <Textarea id={id} rows={3} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} />}
        </Field>

        <div className="row" style={{ gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
          <Field label={t('gastro.menu.priceLabel')} required className="grow">
            {(id) => (
              <div className="input-affix">
                <input id={id} className="input" inputMode="decimal" placeholder={t('gastro.menu.pricePlaceholder')} />
                <span className="affix">€</span>
              </div>
            )}
          </Field>
          <Field label={t('gastro.menu.categoryLabel')} required className="grow">
            {(id) => (
              <Select
                id={id}
                placeholder="—"
                options={CATEGORIES.map((c) => ({ value: c, label: t(`gastro.menu.categories.${c}`) }))}
              />
            )}
          </Field>
        </div>

        <Field label={t('gastro.menu.imageLabel')}>
          <Dropzone icon={Image} small text={t('gastro.setup.dropImage')} />
        </Field>

        <div className="row-wrap">
          {TAGS.map((tag) => <Checkbox key={tag} label={t(`gastro.menu.tags.${tag}`)} />)}
        </div>

        <Field label={t('gastro.menu.allergensLabel')}>
          <div className="row-wrap">
            {ALLERGENS.map((a) => <Chip key={a} onClick={() => {}}>{a}</Chip>)}
          </div>
        </Field>
      </div>
    </Modal>
  )
}
