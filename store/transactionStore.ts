import { create } from 'zustand'

export interface Transaction {
  id: string
  amount: number
  category: string
  description?: string
  date: Date
}

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void
  deleteTransaction: (id: string) => void
  getTransactionsByDate: (date: Date) => Transaction[]
  getTotalByCategory: (date: Date) => Record<string, number>
  getDailyTotal: (date: Date) => number
  getWeeklyTotal: (startDate: Date) => number
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  addTransaction: (transaction) => {
    const id = Date.now().toString()
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id,
        },
      ],
    }))
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }))
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }))
  },

  getTransactionsByDate: (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return get().transactions.filter(
      (t) => t.date.toISOString().split('T')[0] === dateStr
    )
  },

  getTotalByCategory: (date) => {
    const dayTransactions = get().getTransactionsByDate(date)
    return dayTransactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
  },

  getDailyTotal: (date) => {
    return get()
      .getTransactionsByDate(date)
      .reduce((sum, t) => sum + t.amount, 0)
  },

  getWeeklyTotal: (startDate) => {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)

    return get().transactions
      .filter((t) => t.date >= startDate && t.date < endDate)
      .reduce((sum, t) => sum + t.amount, 0)
  },
}))
