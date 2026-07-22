import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const CATEGORIES = ['Entertainment', 'Dev Tools', 'Utilities', 'Others']
const BILLING_CYCLES = ['monthly', 'yearly']

const emptyForm = {
  name: '',
  cost: '',
  category: 'Entertainment',
  billingCycle: 'monthly',
  nextBillingDate: '',
}

export default function SubscriptionForm({ onSubmit, onClose, editingSubscription }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingSubscription) {
      setForm({
        name: editingSubscription.name,
        cost: String(editingSubscription.cost),
        category: editingSubscription.category,
        billingCycle: editingSubscription.billingCycle,
        nextBillingDate: editingSubscription.nextBillingDate,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingSubscription])

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.cost || isNaN(Number(form.cost)) || Number(form.cost) <= 0)
      errs.cost = 'Cost must be greater than 0'
    if (!form.nextBillingDate) errs.nextBillingDate = 'Billing date is required'
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      name: form.name.trim(),
      cost: parseFloat(form.cost),
      category: form.category,
      billingCycle: form.billingCycle,
      nextBillingDate: form.nextBillingDate,
    })
    setForm(emptyForm)
    setErrors({})
  }

  const fieldCls = 'w-full bg-white dark:bg-gray-800 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Netflix"
              className={`${fieldCls} ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Cost + Billing Cycle row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost</label>
              <input
                name="cost"
                type="number"
                min="0.01"
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                placeholder="9.99"
                className={`${fieldCls} ${errors.cost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.cost && <p className="mt-1 text-xs text-red-500">{errors.cost}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Billing Cycle</label>
              <select
                name="billingCycle"
                value={form.billingCycle}
                onChange={handleChange}
                className={`${fieldCls} border-gray-300 dark:border-gray-600`}
              >
                {BILLING_CYCLES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${fieldCls} border-gray-300 dark:border-gray-600`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Next Billing Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Billing Date</label>
            <input
              name="nextBillingDate"
              type="date"
              value={form.nextBillingDate}
              onChange={handleChange}
              className={`${fieldCls} ${errors.nextBillingDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {errors.nextBillingDate && <p className="mt-1 text-xs text-red-500">{errors.nextBillingDate}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              {editingSubscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
