'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword, type AuthActionResult } from '@/features/auth/actions';
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas';
import { FieldError } from './FieldError';
import { FormMessage } from './FormMessage';

export function ResetPasswordForm() {
  const router = useRouter();
  const [result, setResult] = useState<AuthActionResult | null>(null);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setResult(null);
    const nextResult = await resetPassword(values);
    setResult(nextResult);

    if (nextResult.ok && nextResult.redirectTo) {
      router.replace(nextResult.redirectTo);
      router.refresh();
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormMessage
        message={result?.message}
        tone={result ? (result.ok ? 'success' : 'error') : 'neutral'}
      />

      <div className="space-y-2">
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register('password')}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-confirm-password">Confirm new password</Label>
        <Input
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.confirmPassword)}
          {...form.register('confirmPassword')}
        />
        <FieldError message={form.formState.errors.confirmPassword?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Update password
      </Button>
    </form>
  );
}
