import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Subjects | Athena OS',
};

export default function SubjectsPage() {
  return <PlaceholderPage route="/subjects" />;
}
