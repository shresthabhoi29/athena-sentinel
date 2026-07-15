import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Pomodoro | Athena OS',
};

export default function PomodoroPage() {
  return <PlaceholderPage route="/pomodoro" />;
}
