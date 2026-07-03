'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useUIStore } from '@/store/uiStore'

export function Header() {
  const { toggleSidebar, sidebarOpen } = useUIStore()

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">가계부</h1>
              <p className="text-xs text-white opacity-90">Household Budget App</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all"
              aria-label="Profile"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
