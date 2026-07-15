'use client';

import Link from 'next/link';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-10 gap-3 border border-white/10 bg-white/[0.03] px-2.5"
          aria-label="Open user menu"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-emerald-300 text-xs font-bold text-zinc-950">
            A
          </span>
          <span className="hidden text-sm text-zinc-300 sm:inline">Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-white">Athena User</p>
          <p className="text-xs text-zinc-500">Authenticated workspace</p>
        </div>
        <DropdownMenuSeparator className="my-1 h-px bg-white/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <UserCircle />
            Profile coming soon
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 h-px bg-white/10" />
        <div className="p-1">
          <LogoutButton />
        </div>
        <div className="sr-only">
          <LogOut />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
