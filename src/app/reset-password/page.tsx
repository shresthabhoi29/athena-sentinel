import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Choose new password | Athena OS',
  description: 'Set a new Athena OS password.',
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Use the reset link from your email, then set a new password for your Athena OS account."
      footer={
        <p className="text-zinc-400">
          Need a new link?{' '}
          <Link href="/forgot-password" className="font-medium text-indigo-300">
            Request password reset
          </Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
