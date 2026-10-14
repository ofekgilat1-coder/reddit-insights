'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { MoonIcon, SearchIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NAV_ITEMS, SECONDARY_NAV_ITEMS, isActivePath } from './nav-items'

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const current = [...NAV_ITEMS, ...SECONDARY_NAV_ITEMS].find((item) =>
    isActivePath(pathname, item.href),
  )

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/comments?q=${encodeURIComponent(trimmed)}` : '/comments')
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4 self-center!" />
      <h1 className="truncate text-sm font-medium">{current?.title ?? 'Reddit Insights'}</h1>

      <div className="ml-auto flex items-center gap-2">
        <form onSubmit={submit} role="search" className="hidden md:block">
          <InputGroup className="w-64">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search comments…"
              aria-label="Search comments"
            />
            <InputGroupAddon align="inline-end">
              <Kbd>↵</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </form>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search comments"
          onClick={() => router.push('/comments')}
        >
          <SearchIcon />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
