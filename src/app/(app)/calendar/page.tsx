import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Calendar | Athena OS',
};

export default function CalendarPage() {
  return <PlaceholderPage route="/calendar" />;
}
