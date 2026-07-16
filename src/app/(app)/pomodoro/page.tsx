import type { Metadata } from 'next';
import { PomodoroPage as PomodoroScreen } from '@/features/mvp/pages/PomodoroPage';

export const metadata: Metadata = {
  title: 'Pomodoro | Athena OS',
};

export default function PomodoroPage() {
  return <PomodoroScreen />;
}
