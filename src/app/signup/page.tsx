import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { SignupForm } from '@/features/auth/components/SignupForm';

export const metadata: Metadata = {
  title: 'Create account | Athena OS',
  description: 'Create your Athena OS account.',
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Start with email and password. Athena will prepare your profile and settings automatically."
      footer={
        <p className="text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-300">
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
