import { CreditCard, Filter, CheckCircle, Plus, Search, AlertCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { getDaysRemaining, toMonthly, formatDate, formatDaysRemaining } from '../utils/dateHelpers.js'

function ConfirmPaidModal({ subName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 mt-0.5 p-2 rounded-full bg-emerald-500/10">
            <AlertCircle size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold">Mark as Paid?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You're marking <span className="font-medium text-gray-900 dark:text-white">{subName}</span> as paid for this month. There is no undo.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 py-2 rounded-xl transition"
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
  Entertainment: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-500/30',
  'Dev Tools': 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-500/30',
  Utilities: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
  Others: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
}

const CYCLE_COLORS = {
  monthly: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-300 dark:border-sky-500/30',
  yearly: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-500/30',
}

function DaysBadge({ daysRemaining }) {
  const label = formatDaysRemaining(daysRemaining)
  if (daysRemaining === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-500/40">
        {label}
      </span>
    )
  }
  if (daysRemaining <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-300 dark:border-orange-500/40">
        {label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
      {label}
    </span>
  )
}

/** Animates in when it enters the viewport */
function RevealCard({ children, delay }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay}`}>
      {children}
    </div>
  )
}

export default function SubscriptionsPage({ subscriptions, sym, onEdit, onDelete, onMarkPaid, onAdd }) {
  const [sortBy, setSortBy] = useState('nextBillingDate')
  const [filterCategory, setFilterCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [confirmSub, setConfirmSub] = useState(null)

  const currentMonth = new Date().toISOString().slice(0, 7)
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

  const inputCls = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500'

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Subscriptions</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
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

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative sm:flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 ${inputCls}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`flex-1 sm:flex-none px-2 py-1.5 ${inputCls}`}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`flex-1 sm:flex-none px-2 py-1.5 ${inputCls}`}
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
        <div className="text-center py-20 text-gray-400">
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {subscriptions.length === 0
              ? 'No subscriptions yet. Hit Add to get started!'
              : 'No subscriptions match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map((sub, i) => {
            const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
            const monthlyCost = toMonthly(sub.cost, sub.billingCycle)
            const isPaidThisMonth = (sub.paidMonths || []).includes(currentMonth)
            return (
              <RevealCard key={sub.id} delay={Math.min((i % 3) + 1, 6)}>
                <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">{sub.name}</p>
                      <p className="text-2xl font-bold mt-0.5">
                        {sym}{sub.cost.toFixed(2)}
                        <span className="text-sm font-normal text-gray-400 ml-1">
                          /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </p>
                      {sub.billingCycle === 'yearly' && (
                        <p className="text-xs text-gray-400">{sym}{monthlyCost.toFixed(2)}/mo equivalent</p>
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
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30">
                        <CheckCircle size={11} />
                        Paid this month
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400">
                    Next billing: <span className="text-gray-600 dark:text-gray-300">{formatDate(sub.nextBillingDate)}</span>
                  </p>

                  <div className="flex gap-2 pt-1">
                    {!isPaidThisMonth && (
                      <button
                        onClick={() => setConfirmSub({ id: sub.id, name: sub.name })}
                        className="flex-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-white hover:bg-emerald-600 border border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-600 py-1.5 rounded-lg transition"
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(sub)}
                      className="flex-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 py-1.5 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="flex-1 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-200 dark:border-red-500/30 hover:border-red-500 py-1.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </RevealCard>
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
