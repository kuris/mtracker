'use client'

import { useState } from 'react'
import { useTransactionStore } from '@/store/transactionStore'

export default function IncomePage() {
  const { transactions, updateTransaction, deleteTransaction } = useTransactionStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const incomes = transactions
    .filter((t) => t.category === 'income')
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4caf50] to-[#45a049] text-white p-6 rounded-b-2xl shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">수입</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-gray-500 text-sm mb-2">총 수입</p>
          <h2 className="text-4xl font-bold text-green-600">
            ₩{totalIncome.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            {incomes.length}건의 거래
          </p>
        </div>

        {/* Income List */}
        {incomes.length > 0 ? (
          <div className="space-y-3">
            {incomes.map((income) => (
              <div key={income.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {editingId === income.id ? (
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
                          updateTransaction(income.id, {
                            amount: parseFloat(editAmount) || income.amount,
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
                    setEditingId(income.id)
                    setEditAmount(income.amount.toString())
                    setEditDescription(income.description || '')
                  }}>
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl">💰</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {income.description || '수입'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {income.date.toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-bold text-green-600 text-lg">
                          +₩{income.amount.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTransaction(income.id)
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
            <p className="text-gray-500 text-lg">수입이 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">
              홈에서 거래를 추가하고 "수입" 카테고리를 만들어보세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
