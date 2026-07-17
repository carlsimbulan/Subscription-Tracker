import { CreditCard, Filter, CheckCircle, Plus, Search, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { getDaysRemaining, toMonthly, formatDate, formatDaysRemaining } from '../utils/dateHelpers.js'

function ConfirmPaidModal({ subName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 mt-0.5 p-2 rounded-full bg-emerald-500/10">
            <AlertCircle size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Mark as Paid?</p>
            <p className="text-sm text-gray-400 mt-1">
              You're marking <span className="text-white font-medium">{subName}</span> as paid for this month. There is no undo.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 py-2 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-sm bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl transition font-medium"
          >
            Yes, Mark as Paid
          </button>
        </div>
      </div>
    </div>
  )
}

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

export default function SubscriptionsPage({ subscriptions, sym, onEdit, onDelete, onMarkPaid, onAdd }) {
  const [sortBy, setSortBy] = useState('nextBillingDate')
  const [filterCategory, setFilterCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [confirmSub, setConfirmSub] = useState(null) // { id, name }

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const categories = ['All', 'Entertainment', 'Dev Tools', 'Utilities', 'Others']

  const displayList = [...subscriptions]
    .filter((sub) => filterCategory === 'All' || sub.category === filterCategory)
    .filter((sub) => sub.name.toLowerCase().includes(search.toLowerCase()))
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
      <div className="mb-6">

        {/* Title + Add — always on same row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">Subscriptions</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition font-medium shrink-0"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Controls:
            Mobile  → stacked: search full width, then filter+sort side by side
            Desktop → single row: search flex-1, filter, sort all inline          */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative sm:flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Filter + Sort — side by side on both mobile and desktop */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 sm:flex-none bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="nextBillingDate">Sort: Due Date</option>
              <option value="cost">Sort: Cost</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>
        </div>

      </div>

      {/* Cards */}
      {displayList.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {subscriptions.length === 0
              ? 'No subscriptions yet. Hit Add to get started!'
              : 'No subscriptions match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map((sub) => {
            const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
            const monthlyCost = toMonthly(sub.cost, sub.billingCycle)
            const isPaidThisMonth = (sub.paidMonths || []).includes(currentMonth)
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
                  {isPaidThisMonth && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      <CheckCircle size={11} />
                      Paid this month
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Next billing: <span className="text-gray-300">{formatDate(sub.nextBillingDate)}</span>
                </p>

                <div className="flex gap-2 pt-1">
                  {!isPaidThisMonth && (
                    <button
                      onClick={() => setConfirmSub({ id: sub.id, name: sub.name })}
                      className="flex-1 text-xs text-emerald-400 hover:text-white hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 py-1.5 rounded-lg transition"
                    >
                      Mark as Paid
                    </button>
                  )}
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

      {confirmSub && (
        <ConfirmPaidModal
          subName={confirmSub.name}
          onConfirm={() => { onMarkPaid(confirmSub.id); setConfirmSub(null) }}
          onCancel={() => setConfirmSub(null)}
        />
      )}
    </main>
  )
}
