import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Resources | Athena OS',
};

export default function ResourcesPage() {
  return <PlaceholderPage route="/resources" />;
}
