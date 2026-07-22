import { TrendingUp, Clock, Info, ArrowRight, CheckCircle } from 'lucide-react'
import AnalyticsChart from './AnalyticsChart.jsx'
import { getDaysRemaining, toMonthly } from '../utils/dateHelpers.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

export default function DashboardPage({ subscriptions, sym, onNavigate }) {
  const totalMonthly = subscriptions.reduce(
    (sum, sub) => sum + toMonthly(sub.cost, sub.billingCycle),
    0
  )

  const dueIn7Days = subscriptions.filter((sub) => {
    const { daysRemaining } = getDaysRemaining(sub.nextBillingDate, sub.billingCycle)
    return daysRemaining <= 7
  }).length

  const currentMonth = new Date().toISOString().slice(0, 7)
  const paidThisMonth = subscriptions.filter((sub) =>
    (sub.paidMonths || []).includes(currentMonth)
  ).length

  const noticeRef = useScrollReveal({ threshold: 0.1 })
  const statsRef = useScrollReveal({ threshold: 0.1 })
  const chartRef = useScrollReveal({ threshold: 0.1 })

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Data notice */}
      <div
        ref={noticeRef}
        className="reveal flex items-start gap-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-3 text-sm text-sky-600 dark:text-sky-300"
      >
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          Your data is saved locally in this browser. It will persist as long as you use the same browser on this device.
          Use <span className="font-semibold">Export</span> to download a backup file, and <span className="font-semibold">Import</span> to restore it anytime — even on a different device or browser.
        </p>
      </div>

      {/* Summary Banner */}
      <section ref={statsRef} className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Spend */}
        <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-300/50 dark:border-violet-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-sm text-violet-600 dark:text-violet-300 font-medium">Total Monthly Spend</p>
          <p className="text-4xl font-bold mt-2">
            {sym}{totalMonthly.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {sym}{(totalMonthly * 12).toFixed(2)} / year
          </p>
        </div>

        {/* Active Subscriptions */}
        <button
          onClick={() => onNavigate('subscriptions')}
          className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl p-6 flex flex-col justify-between text-left transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-500 dark:text-sky-400">
              <TrendingUp size={18} />
              <p className="text-sm font-medium">Active Subscriptions</p>
            </div>
            <ArrowRight size={15} className="text-gray-400 group-hover:text-sky-500 transition" />
          </div>
          <p className="text-4xl font-bold mt-2">{subscriptions.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">across all categories</p>
        </button>

        {/* Due Soon */}
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
            <Clock size={18} />
            <p className="text-sm font-medium">Due in Next 7 Days</p>
          </div>
          <p className="text-4xl font-bold mt-2">{dueIn7Days}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">upcoming renewals</p>
        </div>

        {/* Paid This Month */}
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
            <CheckCircle size={18} />
            <p className="text-sm font-medium">Paid This Month</p>
          </div>
          <p className="text-4xl font-bold mt-2">{paidThisMonth}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Analytics */}
      <section
        ref={chartRef}
        className="reveal bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
      >
        <h2 className="text-base font-semibold mb-4">Spend by Category</h2>
        <AnalyticsChart subscriptions={subscriptions} currencySymbol={sym} />
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
        © {new Date().getFullYear()} Carl Ivan Ken Simbulan. All rights reserved.
      </footer>
    </main>
  )
}
