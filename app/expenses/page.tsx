'use client'

import { useState } from 'react'
import { useTransactionStore, Transaction } from '@/store/transactionStore'

const CATEGORY_EMOJIS: Record<string, string> = {
  coffee: '☕',
  food: '🍽️',
  transport: '🚕',
  shopping: '🛍️',
  books: '📚',
  entertainment: '🎬',
  medical: '💊',
  gift: '🎁',
}

export default function ExpensesPage() {
  const { transactions, updateTransaction, deleteTransaction } = useTransactionStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const expenses = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const filtered = selectedCategory
    ? expenses.filter((t) => t.category === selectedCategory)
    : expenses

  const totalExpense = filtered.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white p-6 rounded-b-2xl shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">지출</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-gray-500 text-sm mb-2">총 지출</p>
          <h2 className="text-4xl font-bold text-[#ff6b6b]">
            ₩{totalExpense.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            {filtered.length}건의 거래
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">카테고리별 필터</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-[#ff6b6b] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {Object.entries(CATEGORY_EMOJIS).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedCategory === key
                    ? 'bg-[#ff6b6b] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {emoji} {key}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((expense) => (
              <div key={expense.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {editingId === expense.id ? (
                  // Edit Mode
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-sm font-bold text-gray-700">금액</label>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">설명</label>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateTransaction(expense.id, {
                            amount: parseFloat(editAmount) || expense.amount,
                            description: editDescription,
                          })
                          setEditingId(null)
                        }}
                        className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                    setEditingId(expense.id)
                    setEditAmount(expense.amount.toString())
                    setEditDescription(expense.description || '')
                  }}>
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl">
                        {CATEGORY_EMOJIS[expense.category] || '💰'}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {expense.category}
                        </p>
                        {expense.description && (
                          <p className="text-sm text-gray-500">{expense.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          {expense.date.toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-bold text-[#ff6b6b] text-lg">
                          ₩{expense.amount.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTransaction(expense.id)
                        }}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">지출이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
