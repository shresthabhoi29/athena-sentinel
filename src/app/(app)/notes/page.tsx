import type { Metadata } from 'next';
import { NotesPage as NotesScreen } from '@/features/mvp/pages/NotesPage';

export const metadata: Metadata = {
  title: 'Notes | Athena OS',
};

export default function NotesPage() {
  return <NotesScreen />;
}
