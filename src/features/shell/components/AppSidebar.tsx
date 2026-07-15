'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { shellNavItems } from '../navigation';

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
};

export function AppSidebar({ collapsed, onToggle, onNavigate, mobile = false }: AppSidebarProps) {
  const pathname = usePathname();
  const isCompact = collapsed && !mobile;

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-white/10 bg-zinc-950/90 text-zinc-100 backdrop-blur-xl',
        mobile ? 'w-full border-r-0' : 'hidden border-r lg:flex',
        !mobile && (isCompact ? 'w-[5.25rem]' : 'w-72'),
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3" onClick={onNavigate}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/15 text-sm font-semibold text-indigo-200">
            A
          </div>
          {!isCompact && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-white">Athena OS</p>
              <p className="truncate text-xs text-zinc-500">Study workspace</p>
            </div>
          )}
        </Link>
        {!mobile && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={isCompact ? 'Expand sidebar' : 'Collapse sidebar'}
            className="h-8 w-8 shrink-0"
          >
            {isCompact ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
        {shellNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={isCompact ? item.title : undefined}
              className={cn(
                'group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition',
                active
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:bg-white/10 hover:text-white',
                isCompact && 'justify-center px-0',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCompact && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div
          className={cn(
            'rounded-xl border border-white/10 bg-white/[0.03] p-3',
            isCompact && 'p-2',
          )}
        >
          <div className="h-1.5 rounded-full bg-zinc-800">
            <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-indigo-400 to-emerald-300" />
          </div>
          {!isCompact && (
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Shell ready. Feature surfaces are staged for implementation.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
