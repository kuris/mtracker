import { create } from 'zustand'

export interface DailyGoal {
  id: string
  date: Date
  dailyBudget: number
  categoryGoals: Record<string, { target: number; type: 'amount' | 'count' }>
  categoryCounts: Record<string, number>
}

interface GoalState {
  goal: DailyGoal | null
  setGoal: (goal: DailyGoal) => void
  incrementCategoryCount: (category: string) => void
  getTodayGoal: (date: Date) => DailyGoal | null
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goal: null,

  setGoal: (goal) => {
    set({ goal })
  },

  incrementCategoryCount: (category) => {
    set((state) => ({
      goal: state.goal
        ? {
            ...state.goal,
            categoryCounts: {
              ...state.goal.categoryCounts,
              [category]: (state.goal.categoryCounts[category] || 0) + 1,
            },
          }
        : null,
    }))
  },

  getTodayGoal: (date) => {
    const goal = get().goal
    if (!goal) return null

    const goalDate = goal.date.toISOString().split('T')[0]
    const todayDate = date.toISOString().split('T')[0]

    return goalDate === todayDate ? goal : null
  },
}))
