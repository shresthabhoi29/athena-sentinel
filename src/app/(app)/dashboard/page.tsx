import type { Metadata } from 'next';
import { DashboardPage as DashboardScreen } from '@/features/mvp/pages/DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard | Athena OS',
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
