'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpWithPassword, type AuthActionResult } from '@/features/auth/actions';
import { signupSchema, type SignupInput } from '@/features/auth/schemas';
import { FieldError } from './FieldError';
import { FormMessage } from './FormMessage';

export function SignupForm() {
  const router = useRouter();
  const [result, setResult] = useState<AuthActionResult | null>(null);
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignupInput) {
    setResult(null);
    const nextResult = await signUpWithPassword(values);
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
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          autoComplete="name"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register('name')}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register('email')}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register('password')}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirm password</Label>
        <Input
          id="signup-confirm-password"
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
        Create account
      </Button>
    </form>
  );
}
