import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Notes | Athena OS',
};

export default function NotesPage() {
  return <PlaceholderPage route="/notes" />;
}
