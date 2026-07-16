import type { Metadata } from 'next';
import { LearningPage as LearningScreen } from '@/features/mvp/pages/LearningPage';

export const metadata: Metadata = {
  title: 'Learning | Athena OS',
};

export default function LearningPage() {
  return <LearningScreen />;
}
