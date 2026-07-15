import { create } from 'zustand';

interface PomodoroState {
  timeRemaining: number;
  totalDuration: number;
  isActive: boolean;
  type: 'focus' | 'short_break' | 'long_break';
  setTimeRemaining: (time: number) => void;
  setTotalDuration: (duration: number) => void;
  setIsActive: (active: boolean) => void;
  setType: (type: 'focus' | 'short_break' | 'long_break') => void;
  tick: () => void;
  reset: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  timeRemaining: 25 * 60,
  totalDuration: 25 * 60,
  isActive: false,
  type: 'focus',
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setTotalDuration: (duration) => set({ totalDuration: duration, timeRemaining: duration }),
  setIsActive: (active) => set({ isActive: active }),
  setType: (type) => {
    const duration = type === 'focus' ? 25 * 60 : type === 'short_break' ? 5 * 60 : 15 * 60;
    set({ type, totalDuration: duration, timeRemaining: duration, isActive: false });
  },
  tick: () =>
    set((state) => {
      if (!state.isActive) return {};
      if (state.timeRemaining <= 1) {
        return { timeRemaining: 0, isActive: false };
      }
      return { timeRemaining: state.timeRemaining - 1 };
    }),
  reset: () =>
    set((state) => ({
      timeRemaining: state.totalDuration,
      isActive: false,
    })),
}));
