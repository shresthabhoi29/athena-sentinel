import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Athena OS',
  description: 'Personal study operating system and spaced-repetition core',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
