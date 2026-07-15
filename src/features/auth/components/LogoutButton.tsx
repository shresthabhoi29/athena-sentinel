'use client';

import { LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/actions';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    const result = await signOut();
    router.replace(result.redirectTo ?? '/login');
    router.refresh();
  }

  return (
    <Button type="button" variant="glass" size="sm" onClick={handleLogout} disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
      Log out
    </Button>
  );
}
