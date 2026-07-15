'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendMagicLink, signInWithPassword, type AuthActionResult } from '@/features/auth/actions';
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
  type MagicLinkInput,
} from '@/features/auth/schemas';
import { FieldError } from './FieldError';
import { FormMessage } from './FormMessage';

type LoginFormProps = {
  notice?: string;
  nextPath?: string;
};

export function LoginForm({ notice, nextPath }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [result, setResult] = useState<AuthActionResult | null>(
    notice ? { ok: true, message: notice } : null,
  );
  const passwordForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const magicForm = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  async function onPasswordSubmit(values: LoginInput) {
    setResult(null);
    const nextResult = await signInWithPassword(values, nextPath);
    setResult(nextResult);

    if (nextResult.ok && nextResult.redirectTo) {
      router.replace(nextResult.redirectTo);
      router.refresh();
    }
  }

  async function onMagicSubmit(values: MagicLinkInput) {
    setResult(null);
    const nextResult = await sendMagicLink(values, nextPath);
    setResult(nextResult);
  }

  const isPasswordSubmitting = passwordForm.formState.isSubmitting;
  const isMagicSubmitting = magicForm.formState.isSubmitting;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-black/30 p-1">
        <Button
          type="button"
          variant={mode === 'password' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setMode('password');
            setResult(null);
          }}
        >
          <KeyRound />
          Password
        </Button>
        <Button
          type="button"
          variant={mode === 'magic' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setMode('magic');
            setResult(null);
          }}
        >
          <Mail />
          Magic link
        </Button>
      </div>

      <FormMessage
        message={result?.message}
        tone={result ? (result.ok ? 'success' : 'error') : 'neutral'}
      />

      {mode === 'password' ? (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              disabled={isPasswordSubmitting}
              aria-invalid={Boolean(passwordForm.formState.errors.email)}
              {...passwordForm.register('email')}
            />
            <FieldError message={passwordForm.formState.errors.email?.message} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="login-password">Password</Label>
              <Link href="/forgot-password" className="text-xs font-medium text-indigo-300">
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              disabled={isPasswordSubmitting}
              aria-invalid={Boolean(passwordForm.formState.errors.password)}
              {...passwordForm.register('password')}
            />
            <FieldError message={passwordForm.formState.errors.password?.message} />
          </div>

          <Button type="submit" className="w-full" disabled={isPasswordSubmitting}>
            {isPasswordSubmitting && <Loader2 className="animate-spin" />}
            Sign in
          </Button>
        </form>
      ) : (
        <form onSubmit={magicForm.handleSubmit(onMagicSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              autoComplete="email"
              disabled={isMagicSubmitting}
              aria-invalid={Boolean(magicForm.formState.errors.email)}
              {...magicForm.register('email')}
            />
            <FieldError message={magicForm.formState.errors.email?.message} />
          </div>

          <Button type="submit" className="w-full" disabled={isMagicSubmitting}>
            {isMagicSubmitting && <Loader2 className="animate-spin" />}
            Send magic link
          </Button>
        </form>
      )}
    </div>
  );
}
