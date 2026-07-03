import { create } from 'zustand'

export interface WeeklyGoal {
  id: string
  weekStartDate: Date
  budget: number
}

interface WeeklyGoalState {
  goal: WeeklyGoal | null
  setGoal: (budget: number) => void
  getCurrentWeekGoal: () => WeeklyGoal | null
  getWeekStartDate: (date: Date) => Date
}

export const useWeeklyGoalStore = create<WeeklyGoalState>((set, get) => ({
  goal: null,

  setGoal: (budget) => {
    const now = new Date()
    const weekStart = get().getWeekStartDate(now)
    set({
      goal: {
        id: Date.now().toString(),
        weekStartDate: weekStart,
        budget,
      },
    })
  },

  getCurrentWeekGoal: () => {
    const goal = get().goal
    if (!goal) return null

    const now = new Date()
    const currentWeekStart = get().getWeekStartDate(now)
    const goalWeekStart = goal.weekStartDate

    // 같은 주인지 확인
    if (goalWeekStart.getTime() === currentWeekStart.getTime()) {
      return goal
    }
    return null
  },

  getWeekStartDate: (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 월요일 기준
    return new Date(d.setDate(diff))
  },
}))
