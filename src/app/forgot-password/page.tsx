import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset access | Athena OS',
  description: 'Request an Athena OS password reset link.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and Athena OS will send a secure reset link if the account exists."
      footer={
        <p className="text-zinc-400">
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-indigo-300">
            Return to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
