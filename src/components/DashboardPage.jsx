import { TrendingUp, Clock, Info } from 'lucide-react'
import AnalyticsChart from './AnalyticsChart.jsx'
import { getDaysRemaining, toMonthly } from '../utils/dateHelpers.js'

export default function DashboardPage({ subscriptions, sym }) {
  const totalMonthly = subscriptions.reduce(
    (sum, sub) => sum + toMonthly(sub.cost, sub.billingCycle),
    0
  )

  const dueIn7Days = subscriptions.filter((sub) => {
    const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
    return daysRemaining <= 7
  }).length

  return (
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
      <section className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Spend by Category</h2>
        <AnalyticsChart subscriptions={subscriptions} currencySymbol={sym} />
      </section>
    </main>
  )
}
