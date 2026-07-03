import { create } from 'zustand'


type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  applyTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'system',
  isDark: false,

  setTheme: (theme) => {
    set({ theme })
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.isDark ? 'light' : 'dark'
      return {
        theme: newTheme,
        isDark: !state.isDark,
      }
    })
  },

  applyTheme: (theme) => {
    const html = typeof document !== 'undefined' ? document.documentElement : null
    if (!html) return

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      set({
        theme: 'system',
        isDark,
      })
      html.classList.toggle('dark', isDark)
    } else {
      const isDark = theme === 'dark'
      set({
        theme,
        isDark,
      })
      html.classList.toggle('dark', isDark)
    }

    localStorage.setItem('theme', theme)
  },
}))
