import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Dashboard | Athena OS',
};

export default function DashboardPage() {
  return <PlaceholderPage route="/dashboard" />;
}
