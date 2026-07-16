import type { Metadata } from 'next';
import { SettingsPage as SettingsScreen } from '@/features/mvp/pages/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings | Athena OS',
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
