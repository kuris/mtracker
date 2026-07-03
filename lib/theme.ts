export type Theme = 'light' | 'dark' | 'system'

export const THEMES: Theme[] = ['light', 'dark', 'system']

export function getThemeLabel(theme: Theme): string {
  const labels: Record<Theme, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }
  return labels[theme]
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getAppliedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

export function initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const themeToApply = savedTheme || 'system'

  applyTheme(themeToApply)
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return

  const html = document.documentElement
  const isDark = getAppliedTheme(theme) === 'dark'

  html.classList.toggle('dark', isDark)
  localStorage.setItem('theme', theme)
}

export function observeSystemThemeChanges(callback: (isDark: boolean) => void): void {
  if (typeof window === 'undefined') return

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches)
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange)
  } else if (mediaQuery.addListener) {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange)
  }
}
