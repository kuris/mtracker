'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
  getAppliedTheme,
  initializeTheme,
  observeSystemThemeChanges,
  applyTheme as applyThemeUtil,
  type Theme,
} from './theme'

export function useTheme() {
  const { theme, isDark, setTheme, applyTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme()
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(savedTheme)
    const applied = getAppliedTheme(savedTheme)
    useThemeStore.setState({ isDark: applied === 'dark' })
    setMounted(true)
  }, [setTheme])

  // Observe system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const handleSystemThemeChange = (isDark: boolean) => {
      if (useThemeStore.getState().theme === 'system') {
        useThemeStore.setState({ isDark })
        applyThemeUtil(theme)
      }
    }

    observeSystemThemeChanges(handleSystemThemeChange)
  }, [theme, applyTheme])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    applyThemeUtil(newTheme)
    setTheme(newTheme)
    useThemeStore.setState({ isDark: !isDark })
  }

  return {
    theme,
    isDark,
    mounted,
    setTheme: (newTheme: Theme) => {
      applyThemeUtil(newTheme)
      setTheme(newTheme)
      const applied = getAppliedTheme(newTheme)
      useThemeStore.setState({ isDark: applied === 'dark' })
    },
    toggleTheme,
  }
}
