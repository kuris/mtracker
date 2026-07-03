'use client'

import { useState } from 'react'
import { useTransactionStore } from '@/store/transactionStore'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function MonthlyPage() {
  const { transactions } = useTransactionStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStr = currentMonth.toISOString().slice(0, 7)
  const monthTransactions = transactions.filter(
    (t) => t.date.toISOString().slice(0, 7) === monthStr
  )

  // 카테고리별 합계
  const categoryData = Object.entries(
    monthTransactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
  ).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  const COLORS = ['#ff6b6b', '#ff8a80', '#ffd4a3', '#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#ff5252']

  const totalAmount = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white p-6 rounded-b-2xl shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">월간 통계</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>

        {/* Total Amount */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-gray-500 text-sm mb-2">이번 달 총 지출</p>
          <h3 className="text-4xl font-bold text-[#ff6b6b]">
            ₩{totalAmount.toLocaleString()}
          </h3>
        </div>

        {/* Charts */}
        {categoryData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리별 지출</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-bold text-gray-800">₩{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">상세 내역</h3>
              <div className="space-y-2">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {['☕', '🍽️', '🚕', '🛍️', '📚', '🎬', '💊', '🎁'][index]}
                        </span>
                        <span className="font-bold text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#ff6b6b]">₩{item.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {((item.value / totalAmount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">이번 달 거래가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
