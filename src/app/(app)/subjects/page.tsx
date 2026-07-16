import type { Metadata } from 'next';
import { SubjectsPage as SubjectsScreen } from '@/features/mvp/pages/SubjectsPage';

export const metadata: Metadata = {
  title: 'Subjects | Athena OS',
};

export default function SubjectsPage() {
  return <SubjectsScreen />;
}
