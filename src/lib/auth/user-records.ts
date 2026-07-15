import type { User } from '@supabase/supabase-js';
import { db } from '@/lib/db';
import { settings, users } from '@/lib/db/schema';

export async function ensureUserRecords(user: Pick<User, 'id' | 'email' | 'user_metadata'>) {
  const email = user.email?.toLowerCase();

  if (!user.id || !email) {
    throw new Error('A valid authenticated user is required to prepare the workspace.');
  }

  const name =
    typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim().length > 0
      ? user.user_metadata.name.trim()
      : null;

  await db.transaction(async (tx) => {
    await tx
      .insert(users)
      .values({
        id: user.id,
        email,
        name,
      })
      .onConflictDoNothing({ target: users.id });

    await tx
      .insert(settings)
      .values({
        userId: user.id,
      })
      .onConflictDoNothing({ target: settings.userId });
  });
}
