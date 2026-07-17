import { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from './components/Header.jsx'
import DashboardPage from './components/DashboardPage.jsx'
import SubscriptionsPage from './components/SubscriptionsPage.jsx'
import SubscriptionForm from './components/SubscriptionForm.jsx'
import { getDaysRemaining } from './utils/dateHelpers.js'

const STORAGE_KEY = 'sub_tracker_data'
const CURRENCY_KEY = 'sub_tracker_currency'

const CURRENCY_SYMBOLS = { USD: '$', PHP: '₱' }

const ROUTE_MAP = {
  '/dashboard': 'dashboard',
  '/mysubscriptions': 'subscriptions',
}
const REVERSE_MAP = {
  dashboard: '/dashboard',
  subscriptions: '/mysubscriptions',
}

function getPageFromPath() {
  return ROUTE_MAP[window.location.pathname] || 'dashboard'
}

export default function App() {
  const [page, setPage] = useState(getPageFromPath)

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
  const importRef = useRef(null)

  const sym = CURRENCY_SYMBOLS[currency] ?? '$'

  // Sync URL when page changes
  useEffect(() => {
    const path = REVERSE_MAP[page] || '/dashboard'
    if (window.location.pathname !== path) {
      window.history.pushState({ page }, '', path)
    }
  }, [page])

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPop = () => setPage(getPageFromPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Sync subscriptions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions))
  }, [subscriptions])

  // Sync currency
  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency)
  }, [currency])

  // Roll over past-due dates on mount
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

  const handleAdd = useCallback(() => {
    setEditingSubscription(null)
    setShowForm(true)
  }, [])

  // --- Mark as Paid ---
  const handleMarkPaid = useCallback((id) => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const paidMonths = s.paidMonths || []
        if (paidMonths.includes(currentMonth)) return s
        return { ...s, paidMonths: [...paidMonths, currentMonth] }
      })
    )
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hidden file input for import */}
      <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      <Header
        page={page}
        onNavigate={setPage}
        currency={currency}
        onCurrencyChange={setCurrency}
        onExport={handleExport}
        onImportClick={() => importRef.current?.click()}
      />

      {/* Offset content on desktop to account for fixed sidebar + top header */}
      <div className="lg:pl-56 lg:pt-14">
        {page === 'dashboard' && (
          <DashboardPage subscriptions={subscriptions} sym={sym} onNavigate={setPage} />
        )}

        {page === 'subscriptions' && (
          <SubscriptionsPage
            subscriptions={subscriptions}
            sym={sym}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkPaid={handleMarkPaid}
            onAdd={handleAdd}
          />
        )}
      </div>

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
