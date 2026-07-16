import type { Metadata } from 'next';
import { ResourcesPage as ResourcesScreen } from '@/features/mvp/pages/ResourcesPage';

export const metadata: Metadata = {
  title: 'Resources | Athena OS',
};

export default function ResourcesPage() {
  return <ResourcesScreen />;
}
