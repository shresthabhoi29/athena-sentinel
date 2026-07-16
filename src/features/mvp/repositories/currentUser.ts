import { cookies } from 'next/headers';
import { ensureUserRecords } from '@/lib/auth/user-records';
import { createClient } from '@/lib/supabase/server';
import { demoSessionCookie, isDemoAuthEnabled } from '@/lib/supabase/env';

const demoUserId = '00000000-0000-4000-8000-000000000001';

export async function getCurrentWorkspaceUserId() {
  const cookieStore = await cookies();

  if (isDemoAuthEnabled() && cookieStore.get(demoSessionCookie)?.value === 'true') {
    await ensureUserRecords({
      id: demoUserId,
      email: 'demo@athena.local',
      user_metadata: {
        name: 'Athena Demo',
      },
    });
    return demoUserId;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Missing authenticated session.');
  }

  await ensureUserRecords(user);
  return user.id;
}
