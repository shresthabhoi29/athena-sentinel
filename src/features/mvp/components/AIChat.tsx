'use client';

import { AthenaAssistant } from '@/features/ai';

/**
 * AIChat component - forwards to the new Athena Assistant.
 * Kept for backward compatibility with existing dashboard integration.
 */
export function AIChat() {
  return <AthenaAssistant />;
}
