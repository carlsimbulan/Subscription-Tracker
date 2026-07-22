import { CreditCard, TrendingUp, Clock, Shield, Download, BarChart2, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: CreditCard,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Track All Subscriptions',
    desc: 'Keep every recurring charge in one place — Netflix, Spotify, SaaS tools, and more.',
  },
  {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Renewal Reminders',
    desc: 'Always know what\'s due in the next 7 days so you\'re never caught off guard.',
  },
  {
    icon: BarChart2,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    title: 'Spend Analytics',
    desc: 'Visualize your spending by category and see your monthly vs. yearly totals at a glance.',
  },
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Multi-Currency Support',
    desc: 'Switch between USD and PHP instantly. Your totals update everywhere automatically.',
  },
  {
    icon: Download,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    title: 'Export & Import',
    desc: 'Download a JSON backup anytime and restore it on any device or browser.',
  },
  {
    icon: Shield,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: '100% Private',
    desc: 'Everything stays in your browser\'s local storage. No accounts, no servers, no tracking.',
  },
]

const highlights = [
  'No sign-up required',
  'Works offline',
  'Data stays on your device',
  'Free forever',
]

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={22} className="text-violet-400" />
            <span className="font-bold text-base tracking-tight">SubTracker</span>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Get Started
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 font-medium mb-6">
            <Shield size={13} />
            100% local &mdash; your data never leaves your device
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Take control of your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              subscriptions
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            SubTracker helps you monitor every recurring charge, stay ahead of renewal dates,
            and understand exactly where your money goes — all without an account or internet connection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl text-base font-semibold transition shadow-lg shadow-violet-900/40"
            >
              Get Started
              <ArrowRight size={16} />
            </button>
            <p className="text-sm text-gray-500">No sign-up. Free forever.</p>
          </div>

          {/* Highlights row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-1.5 text-sm text-gray-400">
                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                {h}
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="border-t border-gray-800" />
        </div>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Everything you need, nothing you don't
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A focused set of tools to keep your subscriptions organized and your spending in check.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, bg, title, desc }) => (
              <div
                key={title}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 flex flex-col gap-3 transition"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${bg}`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="font-semibold text-white text-base">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/10 border border-violet-500/20 rounded-2xl px-8 py-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to stop guessing what you pay for?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Open your dashboard now — if you've been here before, your data is already waiting for you.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl text-base font-semibold transition shadow-lg shadow-violet-900/40"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Carl Ivan Ken Simbulan. All rights reserved.
      </footer>
    </div>
  )
}
