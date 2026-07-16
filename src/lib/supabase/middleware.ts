import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { demoSessionCookie, hasSupabaseEnv, isDemoAuthEnabled } from './env';

const publicAuthRoutes = new Set(['/login', '/signup', '/forgot-password', '/reset-password']);
const signedInRedirectRoutes = new Set(['/login', '/signup', '/forgot-password']);

function isPublicRoute(pathname: string) {
  return publicAuthRoutes.has(pathname) || pathname.startsWith('/auth/callback');
}

function redirectToLogin(request: NextRequest, expired = false) {
  const redirectUrl = new URL('/login', request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (nextPath !== '/') {
    redirectUrl.searchParams.set('next', nextPath);
  }

  if (expired) {
    redirectUrl.searchParams.set('error', 'session-expired');
  }

  return NextResponse.redirect(redirectUrl);
}

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => cookie.name.startsWith('sb-'));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasSupabaseEnv()) {
    const hasDemoSession =
      isDemoAuthEnabled() && request.cookies.get(demoSessionCookie)?.value === 'true';

    if (hasDemoSession && signedInRedirectRoutes.has(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (hasDemoSession) {
      return supabaseResponse;
    }

    if (!isPublicRoute(request.nextUrl.pathname)) {
      return redirectToLogin(request);
    }

    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = isPublicRoute(request.nextUrl.pathname);

  if (!user && !isPublic) {
    return redirectToLogin(request, hasSupabaseSessionCookie(request));
  }

  if (user && signedInRedirectRoutes.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}
