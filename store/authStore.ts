import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setIsLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    })
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual authentication
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email,
      }
      set({
        user: mockUser,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Login failed:', error)
      set({
        user: null,
        isAuthenticated: false,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    })
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
