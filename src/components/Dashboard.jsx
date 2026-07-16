import { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Plus, Download, Upload, TrendingUp, CreditCard, Clock, Filter, Info
} from 'lucide-react'
import SubscriptionForm from './SubscriptionForm.jsx'
import AnalyticsChart from './AnalyticsChart.jsx'
import { getDaysRemaining, formatDaysRemaining, toMonthly, formatDate } from '../utils/dateHelpers.js'

const STORAGE_KEY = 'sub_tracker_data'
const CURRENCY_KEY = 'sub_tracker_currency'

const CURRENCIES = {
  USD: { symbol: '$', label: 'USD ($)' },
  PHP: { symbol: '₱', label: 'PHP (₱)' },
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

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(CURRENCY_KEY) || 'USD'
  })

  const [showForm, setShowForm] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)
  const [sortBy, setSortBy] = useState('nextBillingDate')
  const [filterCategory, setFilterCategory] = useState('All')
  const importRef = useRef(null)

  const sym = CURRENCIES[currency]?.symbol ?? '$'

  // Sync subscriptions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions))
  }, [subscriptions])

  // Sync currency preference to localStorage
  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency)
  }, [currency])

  // On mount, roll over any past-due dates
  useEffect(() => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        const { updatedDate } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
        return updatedDate !== sub.nextBillingDate ? { ...sub, nextBillingDate: updatedDate } : sub
      })
    )
  }, [])

  // --- CRUD ---
  const handleAddOrEdit = useCallback(
    (formData) => {
      if (editingSubscription) {
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === editingSubscription.id ? { ...s, ...formData } : s))
        )
      } else {
        setSubscriptions((prev) => [...prev, { id: uuidv4(), ...formData }])
      }
      setShowForm(false)
      setEditingSubscription(null)
    },
    [editingSubscription]
  )

  const handleDelete = useCallback((id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const handleEdit = useCallback((sub) => {
    setEditingSubscription(sub)
    setShowForm(true)
  }, [])

  // --- Export ---
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(subscriptions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscriptions-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // --- Import ---
  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (Array.isArray(data)) {
          setSubscriptions(data)
        } else {
          alert('Invalid backup file format.')
        }
      } catch {
        alert('Could not parse the backup file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // --- Computed values ---
  const totalMonthly = subscriptions.reduce(
    (sum, sub) => sum + toMonthly(sub.cost, sub.billingCycle),
    0
  )

  const dueIn7Days = subscriptions.filter((sub) => {
    const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
    return daysRemaining <= 7
  }).length

  // --- Filtered + Sorted list ---
  const displayList = [...subscriptions]
    .filter((sub) => filterCategory === 'All' || sub.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'cost') return b.cost - a.cost
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      const dA = getDaysRemaining(a.nextBillingDate, a.billingCycle).daysRemaining
      const dB = getDaysRemaining(b.nextBillingDate, b.billingCycle).daysRemaining
      return dA - dB
    })

  const categories = ['All', 'Entertainment', 'Dev Tools', 'Utilities', 'Others']

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={22} className="text-violet-400" />
            <span className="font-bold text-base tracking-tight">SubTracker</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Currency toggle */}
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden text-xs font-medium">
              {Object.entries(CURRENCIES).map(([code, { label }]) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-3 py-1.5 transition ${
                    currency === code
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Import */}
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button
              onClick={() => importRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
            >
              <Upload size={14} />
              Import
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
            >
              <Download size={14} />
              Export
            </button>

            {/* Add */}
            <button
              onClick={() => { setEditingSubscription(null); setShowForm(true) }}
              className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition font-medium"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Data notice */}
        <div className="flex items-start gap-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-3 text-sm text-sky-300">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            Your data is saved locally in this browser. It will persist as long as you use the same browser on this device.
            Use <span className="font-semibold">Export</span> to download a backup file, and <span className="font-semibold">Import</span> to restore it anytime — even on a different device or browser.
          </p>
        </div>

        {/* Summary Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Monthly Spend */}
          <div className="sm:col-span-1 bg-gradient-to-br from-violet-600/20 to-violet-800/10 border border-violet-500/20 rounded-2xl p-6 flex flex-col justify-between">
            <p className="text-sm text-violet-300 font-medium">Total Monthly Spend</p>
            <p className="text-4xl font-bold text-white mt-2">
              {sym}{totalMonthly.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {sym}{(totalMonthly * 12).toFixed(2)} / year
            </p>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-sky-400">
              <TrendingUp size={18} />
              <p className="text-sm font-medium">Active Subscriptions</p>
            </div>
            <p className="text-4xl font-bold text-white mt-2">{subscriptions.length}</p>
            <p className="text-xs text-gray-400 mt-1">across all categories</p>
          </div>

          {/* Due Soon */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock size={18} />
              <p className="text-sm font-medium">Due in Next 7 Days</p>
            </div>
            <p className="text-4xl font-bold text-white mt-2">{dueIn7Days}</p>
            <p className="text-xs text-gray-400 mt-1">upcoming renewals</p>
          </div>
        </section>

        {/* Analytics */}
        {subscriptions.length > 0 && (
          <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Spend by Category</h2>
            <AnalyticsChart subscriptions={subscriptions} currencySymbol={sym} />
          </section>
        )}

        {/* Subscriptions List */}
        <section>
          {/* List Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-white">
              Subscriptions{' '}
              {filterCategory !== 'All' && (
                <span className="text-sm text-gray-400 font-normal">— {filterCategory}</span>
              )}
            </h2>
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

          {/* Cards Grid */}
          {displayList.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No subscriptions yet. Add your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayList.map((sub) => {
                const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
                const monthlyCost = toMonthly(sub.cost, sub.billingCycle)
                return (
                  <div
                    key={sub.id}
                    className="bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition group"
                  >
                    {/* Card top */}
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

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[sub.category]}`}>
                        {sub.category}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CYCLE_COLORS[sub.billingCycle]}`}>
                        {sub.billingCycle}
                      </span>
                    </div>

                    {/* Billing date */}
                    <p className="text-xs text-gray-500">
                      Next billing: <span className="text-gray-300">{formatDate(sub.nextBillingDate)}</span>
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="flex-1 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 py-1.5 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
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
        </section>
      </main>

      {/* Modal */}
      {showForm && (
        <SubscriptionForm
          onSubmit={handleAddOrEdit}
          onClose={() => { setShowForm(false); setEditingSubscription(null) }}
          editingSubscription={editingSubscription}
        />
      )}
    </div>
  )
}
