import React, { useState, useRef, useEffect } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = 'login' | 'home' | 'create'
type NavItem = 'home' | 'create'

interface Campaign {
  id: string
  name: string
  brand: string
  status: 'Draft' | 'Active' | 'Finalized'
  games: number
  updatedAt: string
}

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  type?: 'text' | 'concepts' | 'finalized'
}

interface Concept {
  id: string
  title: string
  genre: string
  pitch: string
  color: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer Spark — Nike', brand: 'Nike', status: 'Active', games: 3, updatedAt: 'Sep 14' },
  { id: '2', name: 'Brew & Explore — Starbucks', brand: 'Starbucks', status: 'Finalized', games: 1, updatedAt: 'Sep 11' },
  { id: '3', name: 'Bold Moves — Adidas', brand: 'Adidas', status: 'Draft', games: 2, updatedAt: 'Sep 9' },
  { id: '4', name: 'Fresh Vibes — Glossier', brand: 'Glossier', status: 'Active', games: 1, updatedAt: 'Sep 6' },
]

const INITIAL_CONCEPTS: Concept[] = [
  { id: 'c1', title: 'Sprint Galaxy', genre: 'Endless Runner', pitch: 'Players dash through neon cities collecting brand tokens — fast, frictionless, shareable scores.', color: '#3B82F6' },
  { id: 'c2', title: 'Brand Blitz', genre: 'Trivia Blitz', pitch: 'A 60-second quiz that tests brand affinity with escalating rewards, great for email campaigns.', color: '#A855F7' },
  { id: 'c3', title: 'Drop Zone', genre: 'Puzzle Drop', pitch: 'Tetris-inspired drop game where branded pieces unlock discount codes — high replay, low friction.', color: '#16A34A' },
]

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = {
  home: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  sparkles: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  ),
  send: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  ),
  search: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
    </svg>
  ),
  chevronDown: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
    </svg>
  ),
  menu: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  logout: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  ),
  plus: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  trophy: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
    </svg>
  ),
  download: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  copy: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
  ),
  arrowDown: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
    </svg>
  ),
  gamepad: (cls = 'w-5 h-5') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
    </svg>
  ),
  bolt: (cls = 'w-5 h-5') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
  palette: (cls = 'w-5 h-5') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  ),
  ship: (cls = 'w-5 h-5') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
  layers: (cls = 'w-5 h-5') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Campaign['status'] }) {
  const map: Record<Campaign['status'], string> = {
    Draft: 'bg-gray-100 text-gray-600',
    Active: 'bg-blue-50 text-blue-600',
    Finalized: 'bg-green-50 text-green-700',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[status]}`}>
      {status}
    </span>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen flex">
      {/* Left — dark hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#06070e] overflow-hidden flex-col items-center justify-center p-12">
        {/* Aurora blobs */}
        <div
          className="animate-aurora absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.35) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)', transform: 'translate(-50%,-50%)' }}
        />
        <div
          className="animate-aurora2 absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, rgba(16,164,74,0.1) 60%, transparent 80%)', transform: 'translate(-50%,-50%)' }}
        />
        {/* Spotlight */}
        <div
          className="animate-spotlight absolute top-0 left-1/2 w-[300px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.25) 0%, transparent 70%)', transform: 'translateX(-50%)' }}
        />
        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 text-white text-2xl font-bold mb-6 shadow-lg shadow-blue-500/30">
            P
          </div>
          <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">AI Game Studio</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Turn briefs into<br />
            <span className="text-blue-400">playable games.</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Chat your way from brand brief to shipped mini-game — no dev required.
          </p>
        </div>
        {/* Disclaimer */}
        <p className="absolute bottom-6 text-gray-600 text-xs text-center px-8">
          Pixie is in beta. Game output may vary. Not for production use without review.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-500 text-white text-sm font-bold flex items-center justify-center">P</div>
            <span className="font-bold text-gray-900">Pixie</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">Welcome back to your game studio.</p>

          <form onSubmit={(e) => { e.preventDefault(); onLogin() }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@brand.com"
                className="w-full px-4 py-2.5 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-full text-sm transition-colors mt-2"
            >
              Sign in to Pixie
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button className="text-blue-500 font-medium hover:underline">Request access</button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  open,
  nav,
  onNav,
  onSignOut,
  campaigns,
  onCampaignClick,
}: {
  open: boolean
  nav: NavItem
  onNav: (n: NavItem) => void
  onSignOut: () => void
  campaigns: Campaign[]
  onCampaignClick: (id: string) => void
}) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40 flex flex-col
        w-[300px] bg-white border-r border-gray-100
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">P</div>
        <span className="font-bold text-gray-900">Pixie</span>
        <span className="ml-auto text-[10px] font-semibold tracking-widest text-blue-400 uppercase bg-blue-50 px-2 py-0.5 rounded-full">Beta</span>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
          {Icon.search('w-3.5 h-3.5 text-gray-400 flex-shrink-0')}
          <input
            placeholder="Search campaigns…"
            className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 w-full"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {([
          ['home', 'Home', Icon.home],
          ['create', 'Create game', Icon.sparkles],
        ] as [NavItem, string, (c?: string) => React.ReactElement][]).map(([id, label, IconFn]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              nav === id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {IconFn('w-4 h-4')}
            {label}
          </button>
        ))}
      </nav>

      {/* Recent campaigns */}
      <div className="mt-6 px-4 flex-1 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Recent campaigns</p>
        <div className="space-y-0.5">
          {campaigns.map(c => (
            <button
              key={c.id}
              onClick={() => onCampaignClick(c.id)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 truncate">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.games} game{c.games !== 1 ? 's' : ''} · {c.updatedAt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">jamie@brandco.io</p>
          </div>
          <button
            onClick={onSignOut}
            title="Sign out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {Icon.logout('w-3.5 h-3.5')}
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <header className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        {Icon.menu('w-4 h-4')}
      </button>
      <div className="hidden lg:block w-px h-4 bg-gray-200" />
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
    </header>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({ campaigns, onNewGame }: { campaigns: Campaign[]; onNewGame: () => void }) {
  const stats = [
    { icon: Icon.layers('w-5 h-5 text-blue-500'), value: campaigns.length, label: 'Campaigns', bg: 'bg-blue-50' },
    { icon: Icon.gamepad('w-5 h-5 text-purple-500'), value: campaigns.reduce((a, c) => a + c.games, 0), label: 'Games built', bg: 'bg-purple-50' },
    { icon: Icon.bolt('w-5 h-5 text-peach-500 text-[#F97316]'), value: '1,284', label: 'Events logged', bg: 'bg-orange-50' },
    { icon: Icon.trophy('w-5 h-5 text-[#16A34A]'), value: campaigns.filter(c => c.status === 'Finalized').length, label: 'Finalized', bg: 'bg-green-50' },
  ]

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Overview</h1>
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          {Icon.plus('w-3.5 h-3.5')}
          New game
        </button>
      </div>

      {/* Stat cards — dot-grid container */}
      <div className="relative rounded-2xl p-4 mb-6" style={{ background: 'transparent' }}>
        <div className="absolute inset-0 rounded-2xl dot-grid opacity-30 pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign list */}
      {campaigns.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 mb-3">
            {Icon.sparkles('w-5 h-5 text-blue-500')}
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">No campaigns yet</p>
          <p className="text-xs text-gray-400">Start your first game with the Create game flow.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-gray-50 flex items-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Campaigns</p>
          </div>
          {campaigns.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors ${i < campaigns.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{c.brand.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.games} game{c.games !== 1 ? 's' : ''} · Updated {c.updatedAt}</p>
              </div>
              <StatusPill status={c.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Chat Screen ─────────────────────────────────────────────────────────────

function ConceptCard({ concept, onFinalize, finalized }: { concept: Concept; onFinalize: (id: string) => void; finalized: boolean }) {
  const colorMap: Record<string, string> = {
    '#3B82F6': 'from-blue-400 to-blue-600',
    '#A855F7': 'from-purple-400 to-purple-600',
    '#16A34A': 'from-green-400 to-green-600',
  }
  const gradient = colorMap[concept.color] ?? 'from-gray-400 to-gray-600'

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex-shrink-0 w-52 ${finalized ? 'border-blue-200 ring-2 ring-blue-500/20' : 'border-gray-100'}`}>
      {/* 9:16 preview */}
      <div className={`h-36 bg-gradient-to-b ${gradient} relative flex items-center justify-center`}>
        {finalized && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1">
            {Icon.trophy('w-3.5 h-3.5 text-yellow-500')}
          </div>
        )}
        <div className="text-white text-3xl font-black opacity-20 select-none">{concept.genre.charAt(0)}</div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{concept.genre}</p>
        <p className="text-sm font-bold text-gray-900 mb-1.5">{concept.title}</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{concept.pitch}</p>
        {!finalized ? (
          <button
            onClick={() => onFinalize(concept.id)}
            className="w-full text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-full py-1.5 transition-colors"
          >
            Finalize →
          </button>
        ) : (
          <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
            {Icon.trophy('w-3.5 h-3.5')}
            Finalized
          </div>
        )}
      </div>
    </div>
  )
}

function FinalizedCard({ concept }: { concept: Concept }) {
  const [copied, setCopied] = useState(false)
  const embedCode = `<iframe src="https://pixie.gg/game/${concept.id}" width="390" height="844" frameborder="0"></iframe>`

  function handleCopy() {
    navigator.clipboard.writeText(embedCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colorMap: Record<string, string> = {
    '#3B82F6': 'from-blue-400 to-blue-600',
    '#A855F7': 'from-purple-400 to-purple-600',
    '#16A34A': 'from-green-400 to-green-600',
  }
  const gradient = colorMap[concept.color] ?? 'from-gray-400 to-gray-600'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm w-full">
      <div className={`h-32 bg-gradient-to-r ${gradient} flex items-center px-6 gap-4`}>
        <div className="w-16 h-28 bg-white/20 rounded-xl backdrop-blur flex items-center justify-center">
          <span className="text-white text-2xl font-black opacity-60">{concept.genre.charAt(0)}</span>
        </div>
        <div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">{concept.genre}</p>
          <p className="text-white text-xl font-bold mb-1">{concept.title}</p>
          <p className="text-white/70 text-xs">{concept.pitch.slice(0, 60)}…</p>
        </div>
      </div>
      <div className="p-4 flex gap-2 flex-wrap">
        <button className="flex items-center gap-1.5 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full transition-colors">
          {Icon.download('w-3.5 h-3.5')}
          Download
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full transition-colors"
        >
          {Icon.copy('w-3.5 h-3.5')}
          {copied ? 'Copied!' : 'Copy embed'}
        </button>
      </div>
    </div>
  )
}

const QUICK_PILLS = ['Bolder', 'Simpler', 'Add leaderboard', 'Stronger CTA']

const FLOW_STEPS = [
  {
    trigger: /brand|brief|about|who/i,
    response: "Got it! I've captured your brand brief. Let me generate three distinct game concepts based on your identity and audience.",
    type: 'text' as const,
  },
  {
    trigger: /.*/,
    response: "Here are three mini-game concepts tailored to your brand. Pick one to finalize — or ask me to remix any of them.",
    type: 'concepts' as const,
  },
]

function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [finalizedId, setFinalizedId] = useState<string | null>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasGames = messages.some(m => m.type === 'concepts' || m.type === 'finalized')

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, busy])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100)
  }

  async function sendMessage(text: string) {
    if (!text.trim() || busy) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setBusy(true)

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600))

    const step = FLOW_STEPS[Math.min(stepIndex, FLOW_STEPS.length - 1)]
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: step.response,
      type: step.type,
    }
    setMessages(prev => [...prev, assistantMsg])
    setStepIndex(i => i + 1)
    setBusy(false)
  }

  function handleFinalize(conceptId: string) {
    setFinalizedId(conceptId)
    const concept = INITIAL_CONCEPTS.find(c => c.id === conceptId)!
    const finalMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🎉 **${concept.title}** is finalized! Here's your shareable build.`,
      type: 'finalized',
    }
    setMessages(prev => [...prev, finalMsg])
    setTimeout(() => setBusy(false), 0)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6"
      >
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-full py-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25">
              {Icon.sparkles('w-6 h-6 text-white')}
            </div>
            <h2
              className="text-2xl font-bold mb-2 text-center"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Welcome to Pixie
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8 max-w-xs">
              Describe your brand or campaign and I'll build a playable mini-game — ready to ship.
            </p>
            {/* 2x2 pastel tiles */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {[
                { icon: Icon.palette('w-5 h-5'), title: 'Brand intake', desc: 'Share your brief and brand kit', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
                { icon: Icon.layers('w-5 h-5'), title: '3 concepts', desc: "I'll generate three game ideas", bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
                { icon: Icon.sparkles('w-5 h-5'), title: 'Remix', desc: 'Iterate with a single message', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
                { icon: Icon.ship('w-5 h-5'), title: 'Ship it', desc: 'Get embed code and download', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
              ].map((t, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(`Tell me about the "${t.title}" step`)}
                  className={`${t.bg} border ${t.border} rounded-2xl p-4 text-left hover:opacity-80 transition-opacity`}
                >
                  <span className={t.text}>{t.icon}</span>
                  <p className={`text-sm font-semibold ${t.text} mt-2 mb-0.5`}>{t.title}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-gray-600">P</span>
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  {msg.type === 'concepts' ? (
                    <div>
                      <div className={`text-sm px-4 py-2.5 rounded-2xl mb-3 ${msg.role === 'assistant' ? 'bg-gray-100 text-gray-800 rounded-tl-sm' : 'bg-blue-500 text-white rounded-tr-sm'}`}>
                        {msg.content}
                      </div>
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        {INITIAL_CONCEPTS.map(c => (
                          <ConceptCard
                            key={c.id}
                            concept={c}
                            onFinalize={handleFinalize}
                            finalized={finalizedId === c.id}
                          />
                        ))}
                      </div>
                    </div>
                  ) : msg.type === 'finalized' ? (
                    <div>
                      <div className="text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm bg-gray-100 text-gray-800 mb-3">
                        {msg.content.replace(/\*\*/g, '')}
                      </div>
                      {finalizedId && (
                        <FinalizedCard concept={INITIAL_CONCEPTS.find(c => c.id === finalizedId)!} />
                      )}
                      {/* Banner */}
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                        <p className="text-sm text-blue-700 font-medium">Ready to create another game?</p>
                        <button className="text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full transition-colors flex-shrink-0">
                          Start new game
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`text-sm px-4 py-2.5 rounded-2xl ${
                      msg.role === 'assistant'
                        ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                        : 'bg-blue-500 text-white rounded-tr-sm'
                    }`}>
                      {msg.content}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-white">J</span>
                  </div>
                )}
              </div>
            ))}
            {/* Typing indicator */}
            {busy && (
              <div className="flex gap-3 animate-fade-in-up">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">P</span>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot w-1.5 h-1.5 bg-gray-400 rounded-full block" />
                  <span className="typing-dot w-1.5 h-1.5 bg-gray-400 rounded-full block" />
                  <span className="typing-dot w-1.5 h-1.5 bg-gray-400 rounded-full block" />
                  <span className="text-xs text-gray-400 ml-1">Pixie is thinking…</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
          className="absolute bottom-24 right-6 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {Icon.arrowDown('w-3.5 h-3.5 text-gray-500')}
        </button>
      )}

      {/* Composer */}
      <div className="border-t border-gray-100 bg-white px-4 md:px-8 py-4">
        {/* Quick pills */}
        {hasGames && (
          <div className="flex gap-2 flex-wrap mb-3">
            {QUICK_PILLS.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={busy}
                className="text-xs font-medium border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 px-3 py-1 rounded-full transition-colors disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Message Pixie…"
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={busy || !input.trim()}
            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          >
            {busy ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : Icon.send('w-4 h-4')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const [nav, setNav] = useState<NavItem>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [campaigns] = useState<Campaign[]>(CAMPAIGNS)

  const titles: Record<NavItem, string> = {
    home: 'Overview',
    create: 'Create game',
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        nav={nav}
        onNav={n => { setNav(n); setSidebarOpen(false) }}
        onSignOut={onSignOut}
        campaigns={campaigns}
        onCampaignClick={() => setNav('create')}
      />
      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={titles[nav]} onMenuClick={() => setSidebarOpen(o => !o)} />
        {nav === 'home' && (
          <HomeScreen campaigns={campaigns} onNewGame={() => setNav('create')} />
        )}
        {nav === 'create' && <ChatScreen />}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')

  return (
    <div>
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('home')} />}
      {(screen === 'home' || screen === 'create') && (
        <AppShell onSignOut={() => setScreen('login')} />
      )}
    </div>
  )
}
