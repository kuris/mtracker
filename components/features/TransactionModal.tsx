'use client'

import { useState } from 'react'
import { useTransactionStore } from '@/store/transactionStore'
import { useUIStore } from '@/store/uiStore'

const CATEGORIES = [
  { emoji: '☕', label: '커피', id: 'coffee' },
  { emoji: '🍽️', label: '식사', id: 'food' },
  { emoji: '🚕', label: '이동', id: 'transport' },
  { emoji: '🛍️', label: '쇼핑', id: 'shopping' },
  { emoji: '📚', label: '책', id: 'books' },
  { emoji: '🎬', label: '엔터', id: 'entertainment' },
  { emoji: '💊', label: '의료', id: 'medical' },
  { emoji: '🎁', label: '선물', id: 'gift' },
]

export function TransactionModal() {
  const { isModalOpen, closeModal } = useUIStore()
  const { addTransaction } = useTransactionStore()
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('coffee')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || parseFloat(amount) <= 0) {
      alert('금액을 입력해주세요')
      return
    }

    addTransaction({
      amount: parseFloat(amount),
      category: selectedCategory,
      description,
      date: new Date(),
    })

    // Reset form
    setAmount('')
    setDescription('')
    setSelectedCategory('coffee')
    closeModal()
  }

  if (!isModalOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[90vh] overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">지출 추가</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                금액
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#ff6b6b]">₩</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 px-4 py-3 text-2xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-[#ff6b6b]"
                  autoFocus
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                카테고리
              </label>
              <div className="grid grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#ff6b6b] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-bold text-center">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                설명 (선택)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 스타벅스 아메리카노"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b6b]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
            >
              저장
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
