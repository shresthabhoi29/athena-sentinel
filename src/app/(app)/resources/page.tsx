import type { Metadata } from 'next';
import { SentinelPage as SentinelScreen } from '@/features/mvp/pages/SentinelPage';

export const metadata: Metadata = {
  title: 'Sentinel | Athena OS',
};

export default function SentinelPage() {
  return <SentinelScreen />;
}
