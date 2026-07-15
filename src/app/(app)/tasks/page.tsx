import type { Metadata } from 'next';
import { PlaceholderPage } from '@/features/shell/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Tasks | Athena OS',
};

export default function TasksPage() {
  return <PlaceholderPage route="/tasks" />;
}
