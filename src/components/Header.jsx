import { useState } from 'react'
import {
  CreditCard, LayoutDashboard, List, Download, Upload, Menu, X, Pencil, Check,
} from 'lucide-react'

const CURRENCIES = {
  USD: { label: 'USD ($)' },
  PHP: { label: 'PHP (₱)' },
}

const NAME_KEY = 'sub_tracker_name'

// Shared hook for name state
function useName() {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '')
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(name)

  const save = () => {
    const trimmed = input.trim()
    setName(trimmed)
    localStorage.setItem(NAME_KEY, trimmed)
    setEditing(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') { setInput(name); setEditing(false) }
  }

  return { name, editing, input, setInput, save, handleKey, startEditing: () => { setInput(name); setEditing(true) } }
}

// Inline version for the desktop top header
function TopBarGreeting() {
  const { name, editing, input, setInput, save, handleKey, startEditing } = useName()

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter your name"
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 w-44"
        />
        <button
          onClick={save}
          className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition"
          aria-label="Save name"
        >
          <Check size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Welcome,</span>
      <span className="text-sm font-semibold text-white">
        {name || <span className="text-gray-500 font-normal italic">set your name</span>}
      </span>
      <button
        onClick={startEditing}
        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition"
        aria-label="Edit name"
      >
        <Pencil size={13} />
      </button>
    </div>
  )
}

// Stacked version for sidebar bottom / mobile drawer
function SidebarGreeting() {
  const { name, editing, input, setInput, save, handleKey, startEditing } = useName()

  if (editing) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 mt-auto">
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter your name"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={save}
          className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition"
          aria-label="Save name"
        >
          <Check size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 mt-auto">
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium">Welcome,</p>
        <p className="text-sm font-semibold text-white truncate">
          {name || <span className="text-gray-500 font-normal italic">set your name</span>}
        </p>
      </div>
      <button
        onClick={startEditing}
        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition shrink-0 ml-2"
        aria-label="Edit name"
      >
        <Pencil size={13} />
      </button>
    </div>
  )
}

// Inline greeting for mobile top header (read-only, no edit)
function MobileTopGreeting() {
  const [name] = useState(() => localStorage.getItem(NAME_KEY) || '')
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-sm text-gray-400">Welcome,</span>
      <span className="text-sm font-semibold text-white">
        {name || <span className="text-gray-500 font-normal italic">stranger</span>}
      </span>
    </div>
  )
}

export default function Header({
  page,
  onNavigate,
  currency,
  onCurrencyChange,
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
      {/* ── Desktop top header ── */}
      <header className="hidden lg:flex fixed top-0 left-56 right-0 h-14 z-30 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md items-center justify-between px-6">
        <span className="text-sm font-semibold text-white capitalize">
          {page === 'subscriptions' ? 'Subscriptions' : 'Dashboard'}
        </span>
        <TopBarGreeting />
      </header>

      {/* ── Mobile top header ── */}
      <header className="lg:hidden border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition"
          >
            <CreditCard size={22} className="text-violet-400" />
            <span className="font-bold text-base tracking-tight">SubTracker</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── Desktop left sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-gray-900 border-r border-gray-800 z-40">
        {/* Logo */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 px-5 py-5 hover:opacity-80 transition shrink-0"
        >
          <CreditCard size={20} className="text-violet-400" />
          <span className="font-bold text-base tracking-tight">SubTracker</span>
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 pb-4 border-b border-gray-800">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
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

        {/* Currency */}
        <div className="px-4 py-4 border-b border-gray-800">
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

        {/* Data actions */}
        <div className="px-3 py-4 border-b border-gray-800">
          <p className="text-xs text-gray-500 mb-2 px-1 font-medium uppercase tracking-wider">Data</p>
          <button
            onClick={onImportClick}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <Upload size={15} />
            Import Backup
          </button>
          <button
            onClick={onExport}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <Download size={15} />
            Export Backup
          </button>
        </div>

        {/* Welcome greeting at sidebar bottom */}
        <SidebarGreeting />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-gray-900 border-l border-gray-700 flex flex-col transform transition-transform duration-300 lg:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <MobileTopGreeting />
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

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

        <div className="px-4 py-4 flex flex-col gap-2 border-b border-gray-700">
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

        <SidebarGreeting />
      </div>
    </>
  )
}
