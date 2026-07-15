import {
  BookOpen,
  Brain,
  CalendarDays,
  CheckSquare,
  Flame,
  FolderOpen,
  GraduationCap,
  Home,
  Library,
  NotebookText,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type ShellNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const shellNavItems: ShellNavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Workspace overview and study signals.',
  },
  {
    title: 'Subjects',
    href: '/subjects',
    icon: BookOpen,
    description: 'Subject hierarchy and progress map.',
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    description: 'Planning queue for active work.',
  },
  {
    title: 'Notes',
    href: '/notes',
    icon: NotebookText,
    description: 'Knowledge capture and review notes.',
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: CalendarDays,
    description: 'Time blocks, sessions, and deadlines.',
  },
  {
    title: 'Pomodoro',
    href: '/pomodoro',
    icon: Flame,
    description: 'Focus cycles and session rhythm.',
  },
  {
    title: 'Flashcards',
    href: '/flashcards',
    icon: Brain,
    description: 'Recall practice and spaced repetition.',
  },
  {
    title: 'Learning',
    href: '/learning',
    icon: GraduationCap,
    description: 'Learning paths and active topics.',
  },
  {
    title: 'Resources',
    href: '/resources',
    icon: Library,
    description: 'Reference material and external links.',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account, workspace, and preferences.',
  },
];

export const quickAddActions = [
  { title: 'Task', icon: CheckSquare, description: 'Prepare the task creation flow.' },
  { title: 'Note', icon: NotebookText, description: 'Prepare the note capture flow.' },
  { title: 'Subject', icon: FolderOpen, description: 'Prepare the subject setup flow.' },
  { title: 'Flashcard', icon: Brain, description: 'Prepare the flashcard authoring flow.' },
  { title: 'Goal', icon: GraduationCap, description: 'Prepare the goal planning flow.' },
  { title: 'Resource', icon: Library, description: 'Prepare the resource saving flow.' },
] satisfies Array<{
  title: string;
  icon: LucideIcon;
  description: string;
}>;
