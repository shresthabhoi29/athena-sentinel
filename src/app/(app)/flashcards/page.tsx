import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Flashcards | Athena OS',
};

export default function FlashcardsPage() {
  return <PlaceholderPage route="/flashcards" />;
}
