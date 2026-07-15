import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Settings | Athena OS',
};

export default function SettingsPage() {
  return <PlaceholderPage route="/settings" />;
}
