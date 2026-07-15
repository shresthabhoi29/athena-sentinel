'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendPasswordReset, type AuthActionResult } from '@/features/auth/actions';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas';
import { FieldError } from './FieldError';
import { FormMessage } from './FormMessage';

export function ForgotPasswordForm() {
  const [result, setResult] = useState<AuthActionResult | null>(null);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setResult(null);
    setResult(await sendPasswordReset(values));
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormMessage
        message={result?.message}
        tone={result ? (result.ok ? 'success' : 'error') : 'neutral'}
      />

      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register('email')}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Send reset link
      </Button>
    </form>
  );
}
