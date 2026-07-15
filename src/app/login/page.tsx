import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in | Athena OS',
  description: 'Sign in to Athena OS.',
};

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
    next?: string;
  }>;
};

function loginNotice(message?: string, error?: string) {
  if (error === 'session-expired') {
    return 'Your session expired. Sign in again to continue.';
  }

  if (error === 'auth-callback') {
    return 'That sign-in link could not be verified. Request a new link and try again.';
  }

  if (message === 'password-reset') {
    return 'Password updated. Sign in with your new password.';
  }

  if (message === 'verified') {
    return 'Email verified. Sign in to continue.';
  }

  return undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Use your Athena OS credentials or request a one-time magic link."
      footer={
        <p className="text-zinc-400">
          New to Athena OS?{' '}
          <Link href="/signup" className="font-medium text-indigo-300">
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm notice={loginNotice(params.message, params.error)} nextPath={params.next} />
    </AuthShell>
  );
}
