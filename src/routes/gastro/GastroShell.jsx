import {
  BarChart3, ClipboardList, Image, QrCode, Settings, Star, Video,
} from 'lucide-react'
import { ConsoleAccount, ConsolePage } from '../../components/layout'
import { myPlace } from '../../mock/places'
import { t } from '../../i18n'

const ITEMS = [
  { to: '/gastro', label: t('gastro.nav.overview'), icon: BarChart3 },
  { to: '/gastro/videos', label: t('gastro.nav.videos'), icon: Video },
  { to: '/gastro/speisekarte', label: t('gastro.nav.menu'), icon: ClipboardList },
  { to: '/gastro/bewertungen', label: t('gastro.nav.reviews'), icon: Star },
  { to: '/gastro/profil', label: t('gastro.nav.profile'), icon: Image },
  { to: '/gastro/qr', label: t('gastro.nav.qr'), icon: QrCode },
  { to: '/gastro/einstellungen', label: t('gastro.nav.settings'), icon: Settings },
]

/** Rahmen aller Gastro-Screens (F.4 Seitenleiste). */
export function GastroShell({ title, children }) {
  return (
    <ConsolePage
      title={title}
      items={ITEMS}
      base="/gastro"
      headerSuffix={t('gastro.brandSuffix')}
      footerSlot={<ConsoleAccount name={myPlace.name} sub={myPlace.city} />}
    >
      {children}
    </ConsolePage>
  )
}
