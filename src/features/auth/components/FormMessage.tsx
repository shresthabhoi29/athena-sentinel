type FormMessageProps = {
  message?: string;
  tone?: 'success' | 'error' | 'neutral';
};

export function FormMessage({ message, tone = 'neutral' }: FormMessageProps) {
  if (!message) {
    return null;
  }

  const className =
    tone === 'success'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
      : tone === 'error'
        ? 'border-red-500/20 bg-red-500/10 text-red-300'
        : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-200';

  return (
    <p className={`rounded-xl border px-3 py-2 text-sm leading-5 ${className}`} aria-live="polite">
      {message}
    </p>
  );
}
