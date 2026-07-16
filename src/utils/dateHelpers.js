/**
 * Calculate days remaining until the next billing date.
 * If the date has passed, roll it forward to the next cycle automatically.
 * Returns { daysRemaining, updatedDate } so callers can persist the rolled-over date.
 */
export function getDaysRemaining(nextBillingDateStr, billingCycle) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let billingDate = new Date(nextBillingDateStr + 'T00:00:00')

  // Roll forward until we have a future (or today) date
  while (billingDate < today) {
    if (billingCycle === 'monthly') {
      billingDate.setMonth(billingDate.getMonth() + 1)
    } else {
      billingDate.setFullYear(billingDate.getFullYear() + 1)
    }
  }

  const diff = billingDate.getTime() - today.getTime()
  const daysRemaining = Math.round(diff / (1000 * 60 * 60 * 24))

  const updatedDate = billingDate.toISOString().split('T')[0]

  return { daysRemaining, updatedDate }
}

/**
 * Format the days remaining into a human-readable string.
 */
export function formatDaysRemaining(daysRemaining) {
  if (daysRemaining === 0) return 'Due Today'
  if (daysRemaining === 1) return '1 day left'
  return `${daysRemaining} days left`
}

/**
 * Normalize a subscription cost to monthly equivalent.
 */
export function toMonthly(cost, billingCycle) {
  if (billingCycle === 'yearly') return cost / 12
  return cost
}

/**
 * Format a date string (YYYY-MM-DD) to a readable format.
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
