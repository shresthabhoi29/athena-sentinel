import type { Metadata } from 'next';
import { TasksPage as TasksScreen } from '@/features/mvp/pages/TasksPage';

export const metadata: Metadata = {
  title: 'Tasks | Athena OS',
};

export default function TasksPage() {
  return <TasksScreen />;
}
