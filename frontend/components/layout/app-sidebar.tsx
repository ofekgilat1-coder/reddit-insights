'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronsUpDownIcon,
  DatabaseIcon,
  LogOutIcon,
  RadarIcon,
  SettingsIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useProfile } from '@/lib/hooks/use-insights'
import { formatNumber, formatRelative } from '@/lib/format'
import { NAV_ITEMS, SECONDARY_NAV_ITEMS, isActivePath } from './nav-items'

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" onClick={() => setOpenMobile(false)} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <RadarIcon />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Reddit Insights</span>
                <span className="text-xs text-muted-foreground">Comment analytics</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analyze</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActivePath(pathname, item.href)}
                    tooltip={item.title}
                    render={<Link href={item.href} onClick={() => setOpenMobile(false)} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY_NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActivePath(pathname, item.href)}
                    tooltip={item.title}
                    render={<Link href={item.href} onClick={() => setOpenMobile(false)} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ConnectionStatus />
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function ConnectionStatus() {
  const { data: profile } = useProfile()

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium">
          <DatabaseIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          Data source
        </div>
        <Badge variant="secondary">Demo</Badge>
      </div>
      {profile ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {formatNumber(profile.connection.commentsIndexed)} sample comments indexed
          {profile.connection.lastSyncedAt
            ? ` · synced ${formatRelative(profile.connection.lastSyncedAt)}`
            : ''}
        </p>
      ) : (
        <Skeleton className="h-4 w-full" />
      )}
    </div>
  )
}

function UserMenu() {
  const { data: profile } = useProfile()
  const router = useRouter()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="size-8 rounded-md">
              <AvatarFallback className="rounded-md">
                {profile?.initials ?? '··'}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {profile?.displayName ?? 'Loading…'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {profile ? `u/${profile.username}` : ''}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Signed in with demo data</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast('Sign-in is not available yet', {
                    description: 'Reddit authentication will be added with the backend.',
                  })
                }
              >
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
