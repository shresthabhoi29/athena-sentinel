'use client';

import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { AppCommandDialog } from './AppCommandDialog';
import { AppSidebar } from './AppSidebar';
import { TopNavigation } from './TopNavigation';

type CommandMode = 'search' | 'quick-add';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandMode, setCommandMode] = useState<CommandMode>('search');

  const openSearch = useCallback(() => {
    setCommandMode('search');
    setCommandOpen(true);
  }, []);

  const openQuickAdd = useCallback(() => {
    setCommandMode('quick-add');
    setCommandOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_30rem)]" />
      <div className="relative flex min-h-screen">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />

        <Dialog open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DialogContent className="data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left top-0 left-0 h-full w-[20rem] max-w-[calc(100%-2rem)] translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0">
            <DialogTitle className="sr-only">Navigation</DialogTitle>
            <DialogDescription className="sr-only">
              Athena OS application sections
            </DialogDescription>
            <AppSidebar
              mobile
              collapsed={false}
              onToggle={() => undefined}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavigation
            onMobileMenuOpen={() => setMobileSidebarOpen(true)}
            onSearchOpen={openSearch}
            onQuickAddOpen={openQuickAdd}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      <AppCommandDialog
        open={commandOpen}
        mode={commandMode}
        onOpenChange={setCommandOpen}
        onModeChange={setCommandMode}
      />
    </div>
  );
}
