'use client';

import { Menu, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

type TopNavigationProps = {
  onMobileMenuOpen: () => void;
  onSearchOpen: () => void;
  onQuickAddOpen: () => void;
};

export function TopNavigation({
  onMobileMenuOpen,
  onSearchOpen,
  onQuickAddOpen,
}: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0A0A0C]/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
          className="border border-white/10 bg-white/[0.03] lg:hidden"
        >
          <Menu />
        </Button>
        <button
          type="button"
          onClick={onSearchOpen}
          className="hidden h-10 min-w-[17rem] items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-left text-sm text-zinc-500 transition hover:bg-white/10 hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none md:flex"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Athena OS
          </span>
          <kbd className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] text-zinc-500">
            Ctrl K
          </kbd>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onSearchOpen}
          aria-label="Search Athena OS"
          className="border border-white/10 bg-white/[0.03] md:hidden"
        >
          <Search />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="default" size="sm" onClick={onQuickAddOpen}>
          <Plus />
          <span className="hidden sm:inline">Quick Add</span>
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
