import { useState } from 'react'
import { CreditCard, LayoutDashboard, List, Download, Upload, Plus, Menu, X } from 'lucide-react'

const CURRENCIES = {
  USD: { label: 'USD ($)' },
  PHP: { label: 'PHP (₱)' },
}

export default function Header({
  page,
  onNavigate,
  currency,
  onCurrencyChange,
  onAdd,
  onExport,
  onImportClick,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Subscriptions', icon: List },
  ]

  return (
    <>
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          {/* Logo — click to go to dashboard */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition"
          >
            <CreditCard size={22} className="text-violet-400" />
            <span className="font-bold text-base tracking-tight">SubTracker</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  page === id
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Currency toggle */}
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden text-xs font-medium">
              {Object.entries(CURRENCIES).map(([code, { label }]) => (
                <button
                  key={code}
                  onClick={() => onCurrencyChange(code)}
                  className={`px-3 py-1.5 transition ${
                    currency === code ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onImportClick}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
            >
              <Upload size={14} />
              Import
            </button>

            <button
              onClick={onExport}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
            >
              <Download size={14} />
              Export
            </button>

            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition font-medium"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* Mobile: Add + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onAdd}
              className="flex items-center gap-1 text-sm bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition font-medium"
            >
              <Plus size={14} />
              Add
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-gray-900 border-l border-gray-700 flex flex-col transform transition-transform duration-300 sm:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <button
            onClick={() => { onNavigate('dashboard'); setDrawerOpen(false) }}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <CreditCard size={18} className="text-violet-400" />
            <span className="font-bold text-sm">SubTracker</span>
          </button>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 border-b border-gray-700">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); setDrawerOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                page === id
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Drawer currency */}
        <div className="px-4 py-4 border-b border-gray-700">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Currency</p>
          <div className="flex gap-2">
            {Object.entries(CURRENCIES).map(([code, { label }]) => (
              <button
                key={code}
                onClick={() => onCurrencyChange(code)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition border ${
                  currency === code
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Drawer actions */}
        <div className="px-4 py-4 flex flex-col gap-2">
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Data</p>
          <button
            onClick={() => { onImportClick(); setDrawerOpen(false) }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <Upload size={16} />
            Import Backup
          </button>
          <button
            onClick={() => { onExport(); setDrawerOpen(false) }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <Download size={16} />
            Export Backup
          </button>
        </div>
      </div>
    </>
  )
}
