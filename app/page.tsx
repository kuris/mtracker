'use client'

import { useState } from 'react'
import { useTransactionStore } from '@/store/transactionStore'
import { useUIStore } from '@/store/uiStore'
import { useWeeklyGoalStore } from '@/store/weeklyGoalStore'

const CATEGORIES = {
  coffee: { emoji: '☕', label: '커피' },
  food: { emoji: '🍽️', label: '식사' },
  transport: { emoji: '🚕', label: '이동' },
  shopping: { emoji: '🛍️', label: '쇼핑' },
  books: { emoji: '📚', label: '책' },
  entertainment: { emoji: '🎬', label: '엔터' },
  medical: { emoji: '💊', label: '의료' },
  gift: { emoji: '🎁', label: '선물' },
}

export default function HomePage() {
  const { openModal } = useUIStore()
  const { transactions, getDailyTotal, getTotalByCategory, getWeeklyTotal } = useTransactionStore()
  const { getCurrentWeekGoal, getWeekStartDate, setGoal } = useWeeklyGoalStore()
  const [today] = useState(new Date())
  const [weeklyBudgetInput, setWeeklyBudgetInput] = useState('')
  const [showWeeklyInput, setShowWeeklyInput] = useState(false)

  // 주간 계산
  const weekStart = getWeekStartDate(today)
  const currentWeekGoal = getCurrentWeekGoal()
  const weeklySpent = getWeeklyTotal(weekStart)
  const weeklyBudget = currentWeekGoal?.budget || 0
  const weeklyProgress = weeklyBudget > 0 ? Math.min((weeklySpent / weeklyBudget) * 100, 100) : 0
  const weeklyRemaining = weeklyBudget - weeklySpent

  // 일간 계산
  const goalAmount = 50000
  const spentAmount = getDailyTotal(today)
  const progress = Math.min((spentAmount / goalAmount) * 100, 100)
  const categoryTotals = getTotalByCategory(today)

  // 진행률에 따른 상태 메시지 및 이모지
  const getStatusMessage = () => {
    if (progress < 40) return { emoji: '❄️', message: '절약했어요!' }
    if (progress < 70) return { emoji: '🌤️', message: '적당해요' }
    if (progress < 100) return { emoji: '☀️', message: '거의 다 썼어요' }
    return { emoji: '🔥', message: '목표 초과!' }
  }

  const status = getStatusMessage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white p-6 rounded-b-2xl shadow-sm">
        <div className="text-center">
          <div className="text-4xl mb-2">❤️</div>
          <h1 className="text-lg font-bold">우리 함께 절약 중이에요</h1>
          <p className="text-sm mt-1 opacity-90">{today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-24">
        {/* Weekly Budget */}
        {!showWeeklyInput ? (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">📅 이번주 예산</h3>
              <button
                onClick={() => setShowWeeklyInput(true)}
                className="text-sm text-[#ff6b6b] font-bold hover:underline"
              >
                설정
              </button>
            </div>
            {weeklyBudget > 0 ? (
              <>
                <div className="mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      ₩{weeklySpent.toLocaleString()} / ₩{weeklyBudget.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-[#ff6b6b]">{Math.round(weeklyProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b]"
                      style={{ width: `${weeklyProgress}%` }}
                    />
                  </div>
                </div>
                <div className={`text-sm font-bold ${weeklyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyRemaining >= 0 ? '남은 금액' : '초과 금액'}: ₩{Math.abs(weeklyRemaining).toLocaleString()}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">이번주 예산을 설정해주세요</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="space-y-3">
              <input
                type="number"
                value={weeklyBudgetInput}
                onChange={(e) => setWeeklyBudgetInput(e.target.value)}
                placeholder="이번주 예산 (예: 100000)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b6b]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (weeklyBudgetInput) {
                      setGoal(parseInt(weeklyBudgetInput))
                      setWeeklyBudgetInput('')
                      setShowWeeklyInput(false)
                    }
                  }}
                  className="flex-1 py-2 bg-[#ff6b6b] text-white rounded-lg font-bold hover:shadow-md"
                >
                  설정
                </button>
                <button
                  onClick={() => {
                    setShowWeeklyInput(false)
                    setWeeklyBudgetInput('')
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Circle */}
        <div className="flex justify-center my-8">
          <div className="relative w-32 h-32">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#ffd4a3"
                strokeWidth="8"
                strokeDasharray={`${(progress / 100) * 314} 314`}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-[#ff6b6b]">{Math.round(progress)}%</div>
              <div className="text-xs text-gray-500">목표 중</div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{status.emoji}</div>
          <p className="text-xl font-bold text-gray-700">{status.message}</p>
        </div>

        {/* Goal Card */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🎯</span>
            <h3 className="font-bold text-gray-700">오늘의 목표</h3>
          </div>
          <div className="text-2xl font-bold text-[#ff6b6b]">
            ₩{spentAmount.toLocaleString()} / ₩{goalAmount.toLocaleString()}
          </div>
        </div>

        {/* Category Cards */}
        <div className="space-y-3 mb-6">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h4 className="font-bold text-gray-700">{cat.label}</h4>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#ff6b6b]">
                    ₩{(categoryTotals[key] || 0).toLocaleString()}
                  </div>
                  {categoryTotals[key] && (
                    <div className="text-xs text-gray-500">
                      {transactions.filter((t) => t.category === key && t.date.toISOString().split('T')[0] === today.toISOString().split('T')[0]).length}건
                    </div>
                  )}
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b]"
                  style={{
                    width: `${Math.min(((categoryTotals[key] || 0) / goalAmount) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={openModal}
          className="w-full bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-shadow"
        >
          + 새로운 지출 추가
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex gap-2 p-3">
        <button className="flex-1 py-2 bg-[#ff6b6b] text-white rounded-lg text-xs font-bold">
          지금
        </button>
        <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200">
          이달
        </button>
        <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200">
          공유
        </button>
      </div>
    </div>
  )
}
