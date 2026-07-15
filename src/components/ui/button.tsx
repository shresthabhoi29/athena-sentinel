import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          variant === 'default' && 'bg-white text-black shadow-sm hover:bg-zinc-200',
          variant === 'destructive' && 'bg-red-600 text-white shadow-sm hover:bg-red-500',
          variant === 'outline' &&
            'border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white',
          variant === 'secondary' &&
            'border border-zinc-800/50 bg-zinc-900 text-zinc-300 hover:bg-zinc-800',
          variant === 'ghost' && 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
          variant === 'link' && 'text-indigo-400 underline-offset-4 hover:underline',
          variant === 'glass' &&
            'glass border border-white/10 text-white shadow-lg hover:bg-white/10',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-lg px-3 text-xs',
          size === 'lg' && 'h-11 rounded-2xl px-8',
          size === 'icon' && 'h-10 w-10 rounded-xl',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
