import { Bell, CheckCircle2, Heart, MessageSquare, UserPlus, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, Button, EmptyState, Skeleton, useToast } from '../../components/ui'
import { Page } from '../../components/layout'
import { useDesignState } from '../../lib/design-state'
import { notifications } from '../../mock/content'
import { t } from '../../i18n'

const ICONS = { follow: UserPlus, like: Heart, reply: MessageSquare, approved: CheckCircle2, rejected: XCircle }

/** E.13 — Benachrichtigungen */
export default function Notifications() {
  const { isEmpty, isLoading } = useDesignState()
  const toast = useToast()
  const list = isEmpty ? [] : notifications

  return (
    <Page title={t('notifications.title')} footer={false}>
      <div style={{ paddingBlock: 'var(--sp-6) var(--sp-16)', maxWidth: 640 }}>
        <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
          <h1 className="t-h1">{t('notifications.title')}</h1>
          <Button variant="quiet" size="sm" onClick={() => toast(t('toast.saved'))}>
            {t('notifications.markAllRead')}
          </Button>
        </div>

        {isLoading ? (
          <div className="list-group">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="list-row list-row-static" key={i}>
                <Skeleton w={40} h={40} radius="50%" />
                <div className="grow"><Skeleton w="70%" h={12} /></div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon={Bell} title={t('notifications.emptyTitle')} text={t('notifications.emptyText')} />
        ) : (
          <div className="list-group">
            {list.map((n) => {
              const Icon = ICONS[n.type] ?? Bell
              return (
                <div
                  className="list-row list-row-static"
                  key={n.id}
                  style={n.unread ? { background: 'var(--accent-soft)' } : undefined}
                >
                  {n.user ? <Avatar name={n.user} size={40} /> : (
                    <span className="thumb-placeholder" style={{ width: 40, height: 40, borderRadius: '50%' }}>
                      <Icon size={18} />
                    </span>
                  )}
                  <span className="grow t-body">
                    {n.user && <strong>{n.user.startsWith('@') || n.user.includes(' ') ? n.user : `@${n.user}`} </strong>}
                    {n.text}
                    {n.link === 'why' && <> <Link to="/richtlinien" className="c-accent">{t('notifications.why')}</Link></>}
                  </span>
                  {n.action === 'followBack' && <Button variant="secondary" size="sm">{t('notifications.followBack')}</Button>}
                  <span className="t-small c-tertiary" style={{ flex: 'none' }}>{n.time}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Page>
  )
}
