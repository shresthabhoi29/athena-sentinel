import type { Metadata } from 'next';
import { FlashcardsPage as FlashcardsScreen } from '@/features/mvp/pages/FlashcardsPage';

export const metadata: Metadata = {
  title: 'Flashcards | Athena OS',
};

export default function FlashcardsPage() {
  return <FlashcardsScreen />;
}
