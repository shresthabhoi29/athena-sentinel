export const demoSessionCookie = 'athena-demo-session';

function hasPlaceholderValue(value: string) {
  const normalized = value.toLowerCase();

  return (
    normalized.includes('dummy') ||
    normalized.includes('your-project') ||
    normalized.includes('your_') ||
    normalized.includes('placeholder')
  );
}

function hasValidSupabaseUrl(value?: string) {
  if (!value || hasPlaceholderValue(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

export function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    hasValidSupabaseUrl(url) && anonKey && anonKey.length > 40 && !hasPlaceholderValue(anonKey),
  );
}

export function isDemoAuthEnabled() {
  return process.env.NODE_ENV !== 'production' && !hasSupabaseEnv();
}

export function getSupabaseEnvError() {
  if (hasSupabaseEnv()) {
    return null;
  }

  if (isDemoAuthEnabled()) {
    return 'Supabase is using placeholder credentials. Local demo sign-in is enabled for development.';
  }

  return 'Supabase authentication is not configured yet. Add real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY values.';
}
