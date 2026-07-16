import type { Metadata } from 'next';
import { CalendarPage as CalendarScreen } from '@/features/mvp/pages/CalendarPage';

export const metadata: Metadata = {
  title: 'Calendar | Athena OS',
};

export default function CalendarPage() {
  return <CalendarScreen />;
}
