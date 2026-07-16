'use server';

import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { demoSessionCookie, getSupabaseEnvError, isDemoAuthEnabled } from '@/lib/supabase/env';
import { ensureUserRecords } from '@/lib/auth/user-records';
import {
  forgotPasswordSchema,
  loginSchema,
  magicLinkSchema,
  resetPasswordSchema,
  signupSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type MagicLinkInput,
  type ResetPasswordInput,
  type SignupInput,
} from './schemas';

export type AuthActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function validationError() {
  return {
    ok: false,
    message: 'Check the highlighted fields and try again.',
  };
}

async function getOrigin() {
  const headerStore = await headers();
  return (
    headerStore.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.replace(/^/, 'https://') ||
    'http://localhost:3000'
  );
}

async function startDemoSession(nextPath = '/') {
  const cookieStore = await cookies();
  cookieStore.set(demoSessionCookie, 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });

  return {
    ok: true,
    message:
      'Demo session started. Add real Supabase credentials when you are ready for email auth.',
    redirectTo: safeNextPath(nextPath),
  };
}

function callbackUrl(origin: string, next = '/') {
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

function safeNextPath(value?: string) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

function friendlyAuthError(error: { message?: string; status?: number; code?: string }) {
  const message = error.message?.toLowerCase() ?? '';
  const code = error.code?.toLowerCase() ?? '';

  if (message.includes('invalid login') || message.includes('invalid credentials')) {
    return 'That email and password combination did not match.';
  }

  if (message.includes('already') || code.includes('user_already_exists')) {
    return 'An account already exists for this email. Try signing in instead.';
  }

  if (message.includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }

  if (message.includes('expired') || message.includes('invalid token')) {
    return 'This authentication link has expired. Request a fresh link and try again.';
  }

  if (error.status === 429 || message.includes('rate limit') || message.includes('too many')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }

  if (message.includes('fetch failed') || message.includes('network')) {
    return 'The authentication service could not be reached. Check your connection and try again.';
  }

  return 'Authentication failed. Please try again.';
}

async function prepareWorkspace(user: Parameters<typeof ensureUserRecords>[0]) {
  try {
    await ensureUserRecords(user);
    return null;
  } catch (error) {
    console.error('Athena workspace bootstrap failed:', error);
    return 'Your account was authenticated, but Athena could not prepare your workspace. Please try signing in again.';
  }
}

export async function signInWithPassword(
  values: LoginInput,
  nextPath?: string,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return validationError();
  }

  const configError = getSupabaseEnvError();

  if (configError) {
    if (isDemoAuthEnabled()) {
      return startDemoSession(nextPath);
    }

    return { ok: false, message: configError };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: friendlyAuthError(error) };
  }

  if (!data.user) {
    return { ok: false, message: 'No account session was returned. Please try again.' };
  }

  const workspaceError = await prepareWorkspace(data.user);

  if (workspaceError) {
    return { ok: false, message: workspaceError };
  }

  return { ok: true, message: 'Welcome back.', redirectTo: safeNextPath(nextPath) };
}

export async function signUpWithPassword(values: SignupInput): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return validationError();
  }

  const configError = getSupabaseEnvError();

  if (configError) {
    if (isDemoAuthEnabled()) {
      return startDemoSession();
    }

    return { ok: false, message: configError };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name || null,
      },
      emailRedirectTo: callbackUrl(origin),
    },
  });

  if (error) {
    return { ok: false, message: friendlyAuthError(error) };
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    return {
      ok: false,
      message: 'An account already exists for this email. Try signing in instead.',
    };
  }

  if (!data.user) {
    return { ok: false, message: 'Supabase did not return a user. Please try again.' };
  }

  const workspaceError = await prepareWorkspace(data.user);

  if (workspaceError) {
    return { ok: false, message: workspaceError };
  }

  if (data.session) {
    return { ok: true, message: 'Your Athena workspace is ready.', redirectTo: '/' };
  }

  return {
    ok: true,
    message: 'Check your inbox to verify your email, then return to sign in.',
  };
}

export async function sendMagicLink(
  values: MagicLinkInput,
  nextPath?: string,
): Promise<AuthActionResult> {
  const parsed = magicLinkSchema.safeParse(values);

  if (!parsed.success) {
    return validationError();
  }

  const configError = getSupabaseEnvError();

  if (configError) {
    if (isDemoAuthEnabled()) {
      return startDemoSession(nextPath);
    }

    return { ok: false, message: configError };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: callbackUrl(origin, safeNextPath(nextPath)),
    },
  });

  if (error) {
    return { ok: false, message: friendlyAuthError(error) };
  }

  return { ok: true, message: 'Magic link sent. Check your inbox to continue.' };
}

export async function sendPasswordReset(values: ForgotPasswordInput): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return validationError();
  }

  const configError = getSupabaseEnvError();

  if (configError) {
    return { ok: false, message: configError };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: callbackUrl(origin, '/reset-password'),
  });

  if (error) {
    return { ok: false, message: friendlyAuthError(error) };
  }

  return {
    ok: true,
    message: 'If this email exists in Athena OS, a reset link will arrive shortly.',
  };
}

export async function resetPassword(values: ResetPasswordInput): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return validationError();
  }

  const configError = getSupabaseEnvError();

  if (configError) {
    return { ok: false, message: configError };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: 'Your reset link is missing or expired. Request a new password reset link.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: friendlyAuthError(error) };
  }

  await prepareWorkspace(user);
  await supabase.auth.signOut();

  return {
    ok: true,
    message: 'Password updated. Sign in again with your new password.',
    redirectTo: '/login?message=password-reset',
  };
}

export async function signOut(): Promise<AuthActionResult> {
  const configError = getSupabaseEnvError();

  if (configError) {
    if (isDemoAuthEnabled()) {
      const cookieStore = await cookies();
      cookieStore.delete(demoSessionCookie);
    }

    return { ok: true, message: 'Signed out.', redirectTo: '/login' };
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  return { ok: true, message: 'Signed out.', redirectTo: '/login' };
}
