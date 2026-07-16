import { CreditCard, Filter } from 'lucide-react'
import { useState } from 'react'
import { getDaysRemaining, toMonthly, formatDate, formatDaysRemaining } from '../utils/dateHelpers.js'

const CATEGORY_COLORS = {
  Entertainment: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Dev Tools': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Utilities: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Others: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

const CYCLE_COLORS = {
  monthly: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  yearly: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

function DaysBadge({ daysRemaining }) {
  const label = formatDaysRemaining(daysRemaining)
  if (daysRemaining === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
        {label}
      </span>
    )
  }
  if (daysRemaining <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40">
        {label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-gray-400 border border-gray-600">
      {label}
    </span>
  )
}

export default function SubscriptionsPage({ subscriptions, sym, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState('nextBillingDate')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', 'Entertainment', 'Dev Tools', 'Utilities', 'Others']

  const displayList = [...subscriptions]
    .filter((sub) => filterCategory === 'All' || sub.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'cost') return b.cost - a.cost
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      const dA = getDaysRemaining(a.nextBillingDate, a.billingCycle).daysRemaining
      const dB = getDaysRemaining(b.nextBillingDate, b.billingCycle).daysRemaining
      return dA - dB
    })

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-gray-400 mt-0.5">{subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="nextBillingDate">Sort: Due Date</option>
            <option value="cost">Sort: Cost</option>
            <option value="category">Sort: Category</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      {displayList.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No subscriptions yet. Hit Add to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map((sub) => {
            const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
            const monthlyCost = toMonthly(sub.cost, sub.billingCycle)
            return (
              <div
                key={sub.id}
                className="bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-base truncate">{sub.name}</p>
                    <p className="text-2xl font-bold text-white mt-0.5">
                      {sym}{sub.cost.toFixed(2)}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </p>
                    {sub.billingCycle === 'yearly' && (
                      <p className="text-xs text-gray-500">{sym}{monthlyCost.toFixed(2)}/mo equivalent</p>
                    )}
                  </div>
                  <DaysBadge daysRemaining={daysRemaining} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[sub.category]}`}>
                    {sub.category}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CYCLE_COLORS[sub.billingCycle]}`}>
                    {sub.billingCycle}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Next billing: <span className="text-gray-300">{formatDate(sub.nextBillingDate)}</span>
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onEdit(sub)}
                    className="flex-1 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="flex-1 text-xs text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
