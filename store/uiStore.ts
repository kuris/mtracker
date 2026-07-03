import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  isModalOpen: boolean
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  openModal: () => void
  closeModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  isModalOpen: false,

  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }))
  },

  toggleMobileMenu: () => {
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
    }))
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },

  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open })
  },

  openModal: () => {
    set({ isModalOpen: true })
  },

  closeModal: () => {
    set({ isModalOpen: false })
  },
}))
