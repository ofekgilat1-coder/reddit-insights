import {
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  NetworkIcon,
  SettingsIcon,
  SparklesIcon,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Overview', href: '/', icon: LayoutDashboardIcon },
  { title: 'Topics', href: '/topics', icon: NetworkIcon },
  { title: 'Comment Explorer', href: '/comments', icon: MessageSquareTextIcon },
  { title: 'AI Chat', href: '/chat', icon: SparklesIcon },
]

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { title: 'Settings', href: '/settings', icon: SettingsIcon },
]

export function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}
