import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Learning | Athena OS',
};

export default function LearningPage() {
  return <PlaceholderPage route="/learning" />;
}
