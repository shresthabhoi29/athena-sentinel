'use client';

import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';

export function SettingsPage() {
  const { settings, updateSettings } = useWorkspaceStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Preferences</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Settings</h1>
      </div>
      <SurfaceCard>
        <SectionHeader title="Theme" />
        <select
          value={theme ?? 'dark'}
          onChange={(event) => setTheme(event.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System</option>
        </select>
      </SurfaceCard>
      <SurfaceCard>
        <SectionHeader title="Study Defaults" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Daily study goal</Label>
            <Input
              type="number"
              value={settings.dailyGoalMinutes}
              onChange={(event) => updateSettings({ dailyGoalMinutes: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Pomodoro focus minutes</Label>
            <Input
              type="number"
              value={settings.pomodoroWorkDuration}
              onChange={(event) =>
                updateSettings({ pomodoroWorkDuration: Number(event.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Short break minutes</Label>
            <Input
              type="number"
              value={settings.pomodoroShortBreak}
              onChange={(event) =>
                updateSettings({ pomodoroShortBreak: Number(event.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Long break minutes</Label>
            <Input
              type="number"
              value={settings.pomodoroLongBreak}
              onChange={(event) =>
                updateSettings({ pomodoroLongBreak: Number(event.target.value) })
              }
            />
          </div>
        </div>
      </SurfaceCard>
      <SurfaceCard>
        <SectionHeader
          title="OpenRouter API Key"
          description="Stored in your Athena settings for AI chat."
        />
        <Input
          type="password"
          value={settings.openRouterApiKey}
          onChange={(event) => updateSettings({ openRouterApiKey: event.target.value })}
          placeholder="sk-or-..."
        />
      </SurfaceCard>
    </div>
  );
}
