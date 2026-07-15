import { NextResponse, type NextRequest } from 'next/server';
import { ensureUserRecords } from '@/lib/auth/user-records';
import { getSupabaseEnvError } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = safeNextPath(requestUrl.searchParams.get('next'));

  if (getSupabaseEnvError() || !code) {
    return NextResponse.redirect(new URL('/login?error=auth-callback', requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth-callback', requestUrl.origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await ensureUserRecords(user);
    } catch (bootstrapError) {
      console.error('Athena callback workspace bootstrap failed:', bootstrapError);
    }
  }

  const redirectUrl = new URL(next, requestUrl.origin);

  if (next === '/') {
    redirectUrl.searchParams.set('message', 'verified');
  }

  return NextResponse.redirect(redirectUrl);
}
