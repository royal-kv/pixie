import React, { useState, useRef, useEffect } from 'react'
import DriftWall from './components/DriftWall'
import MaskedHeading from './components/MaskedHeading'
import SpotlightCard from './components/SpotlightCard'
import { BorderBeam } from './components/BorderBeam'
import ShinyText from './components/ShinyText'
import GlareHover from './components/GlareHover'
import TextType from './components/TextType'
import SplitText from './components/SplitText'

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = 'login' | 'splash' | 'home' | 'create'
type NavItem = 'home' | 'create' | 'games'

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
}

interface CreatedGame {
  id: string
  file: string
  title: string
  genre: string
  topScore: number
  peopleEngaged: number
  avgSessionSec: number
  leaderboard: LeaderboardEntry[]
  dailyPlays: number[]
}

interface Campaign {
  id: string
  name: string
  brand: string
  status: 'Draft' | 'Active' | 'Finalized'
  games: number
  updatedAt: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer Spark — Nike', brand: 'Nike', status: 'Active', games: 3, updatedAt: 'Sep 14' },
  { id: '2', name: 'Brew & Explore — Starbucks', brand: 'Starbucks', status: 'Finalized', games: 1, updatedAt: 'Sep 11' },
  { id: '3', name: 'Bold Moves — Adidas', brand: 'Adidas', status: 'Draft', games: 2, updatedAt: 'Sep 9' },
  { id: '4', name: 'Fresh Vibes — Glossier', brand: 'Glossier', status: 'Active', games: 1, updatedAt: 'Sep 6' },
  { id: '5', name: 'Level Up — Spotify', brand: 'Spotify', status: 'Active', games: 2, updatedAt: 'Sep 4' },
  { id: '6', name: 'Rush Hour — DoorDash', brand: 'DoorDash', status: 'Finalized', games: 1, updatedAt: 'Sep 2' },
  { id: '7', name: 'Cloud Nine — Airbnb', brand: 'Airbnb', status: 'Draft', games: 1, updatedAt: 'Aug 29' },
  { id: '8', name: 'Fast Lane — Uber', brand: 'Uber', status: 'Active', games: 2, updatedAt: 'Aug 26' },
]

const LANDING_WALL_ITEMS = [1074, 1080, 1084, 1050, 1069, 1039, 1043, 1044, 1062, 1015, 1025, 1010].map(id => ({
  image: `https://picsum.photos/id/${id}/600/400`,
}))

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
  play: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11.5-6.86a1 1 0 0 0 0-1.72L9.5 4.27a1 1 0 0 0-1.5.87Z" />
    </svg>
  ),
  close: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
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
  arrowLeft: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
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
  sun: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.5" />
      <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2.5 12h2M19.5 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  moon: (cls = 'w-4 h-4') => (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 1 0 20.354 15.354Z" />
    </svg>
  ),
}

// ─── Brand mark ───────────────────────────────────────────────────────────────
// A four-point sparkle glyph — the Pixie logo. Solid currentColor fill so it
// drops into the same colored/gradient badge boxes used across the app (swap
// via text-color utilities), and doubles as a low-opacity watermark on plain
// backgrounds.
function PixieMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 1 L10.3 7.7 L17 9 L10.3 10.3 L9 17 L7.7 10.3 L1 9 L7.7 7.7 Z" />
      <path d="M18 14 L18.6 17.4 L22 18 L18.6 18.6 L18 22 L17.4 18.6 L14 18 L17.4 17.4 Z" />
    </svg>
  )
}

// Standard 4-color "G" mark used on "Continue with Google" buttons.
function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  )
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Campaign['status'] }) {
  const map: Record<Campaign['status'], string> = {
    Draft: 'bg-secondary text-muted-foreground',
    Active: 'bg-primary/10 text-primary',
    Finalized: 'bg-green-500/15 text-green-400',
  }
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${map[status]}`}>
      {status}
    </span>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, theme }: { onLogin: () => void; theme: 'dark' | 'light' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const scrimRgb = theme === 'light' ? '250, 249, 252' : '6, 7, 14'

  return (
    <div className="min-h-screen relative overflow-y-auto overflow-x-hidden bg-background flex p-6">
      {/* Drifting photo wall backdrop */}
      <div className="fixed inset-0">
        <DriftWall
          items={LANDING_WALL_ITEMS}
          columns={7}
          tileWidth={180}
          tileHeight={120}
          gap={14}
          speed={30}
          direction="up"
          variance={0.4}
          parallax={0.4}
          dim={0.45}
          fade={0.7}
          overlayColor={theme === 'light' ? '#f1ecfb' : '#06070e'}
        />
      </div>
      {/* Scrim for text legibility */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(${scrimRgb},0.92) 0%, rgba(${scrimRgb},0.55) 55%, rgba(${scrimRgb},0.25) 100%)` }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md text-center m-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white mb-5 shadow-lg shadow-fuchsia-500/30">
          <PixieMark className="w-7 h-7" />
        </div>
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-2">AI Game Studio</p>

        <div className="h-44 mb-2">
          <MaskedHeading
            text="Pixie"
            tag="h1"
            src="https://picsum.photos/id/1039/1200/500"
            textScale={0.37}
            weight={700}
            reveal="rise"
            trigger="mount"
            className="text-foreground"
          />
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Chat your way from brand brief to shipped mini-game — no dev required.
        </p>

        {/* Sign-in card */}
        <div className="glass-panel border border-border rounded-2xl p-8 text-left shadow-xl animate-rise-in">
          <h2 className="text-lg font-bold text-foreground mb-1">Sign in</h2>
          <p className="text-muted-foreground text-sm mb-5">Welcome back to your game studio.</p>

          <form onSubmit={(e) => { e.preventDefault(); onLogin() }} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@brand.com"
                className="w-full px-4 py-3 rounded-full border border-border bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-full border border-border bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="w-full btn-neon text-white font-semibold py-3 rounded-full text-sm transition-opacity hover:opacity-90 mt-1"
            >
              Sign in to Pixie
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-full text-sm transition-colors"
          >
            <GoogleIcon className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button className="text-primary font-medium hover:underline">Request access</button>
          </p>
        </div>

        <p className="mt-6 text-muted-foreground text-xs text-center px-8">
          Pixie is in beta. Game output may vary. Not for production use without review.
        </p>
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
  theme,
  onToggleTheme,
}: {
  open: boolean
  nav: NavItem
  onNav: (n: NavItem) => void
  onSignOut: () => void
  campaigns: Campaign[]
  onCampaignClick: (id: string) => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}) {
  const [hoveredNav, setHoveredNav] = useState<NavItem | null>(null)

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40 flex flex-col
        w-64 bg-sidebar/80 backdrop-blur-xl text-sidebar-foreground border-r border-sidebar-border
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0">
          <PixieMark className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-bold text-foreground">Pixie</span>
        <span className="ml-auto text-[10px] font-semibold tracking-widest text-primary uppercase bg-primary/10 px-2 py-1 rounded-full">Beta</span>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-2">
          {Icon.search('w-3.5 h-3.5 text-gray-400 flex-shrink-0')}
          <input
            placeholder="Search campaigns…"
            className="bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-1">
        <GlareHover
          width="100%"
          height="auto"
          background="transparent"
          borderColor="transparent"
          borderRadius="0.5rem"
          glareColor="#c084fc"
          glareOpacity={0.35}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={700}
          forceActive={hoveredNav === 'home'}
        >
        <button
          onClick={() => onNav('home')}
          onMouseEnter={() => setHoveredNav('home')}
          onMouseLeave={() => setHoveredNav(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors animate-rise-in hover-lift ${
            nav === 'home'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          style={{ '--rise-delay': '0s' } as React.CSSProperties}
        >
          {Icon.home('w-4 h-4')}
          Home
        </button>
        </GlareHover>
        <GlareHover
          width="100%"
          height="auto"
          background="transparent"
          borderColor="transparent"
          borderRadius="0.5rem"
          glareColor="#c084fc"
          glareOpacity={0.35}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={700}
          forceActive={hoveredNav === 'create'}
        >
        <button
          onClick={() => onNav('create')}
          onMouseEnter={() => setHoveredNav('create')}
          onMouseLeave={() => setHoveredNav(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors animate-rise-in hover-lift ${
            nav === 'create'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          style={{ '--rise-delay': '0.05s' } as React.CSSProperties}
        >
          {Icon.sparkles('w-4 h-4')}
          Create game
        </button>
        </GlareHover>
        <GlareHover
          width="100%"
          height="auto"
          background="transparent"
          borderColor="transparent"
          borderRadius="0.5rem"
          glareColor="#c084fc"
          glareOpacity={0.35}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={700}
          forceActive={hoveredNav === 'games'}
        >
        <button
          onClick={() => onNav('games')}
          onMouseEnter={() => setHoveredNav('games')}
          onMouseLeave={() => setHoveredNav(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors animate-rise-in hover-lift ${
            nav === 'games'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          style={{ '--rise-delay': '0.1s' } as React.CSSProperties}
        >
          {Icon.gamepad('w-4 h-4')}
          Created games
        </button>
        </GlareHover>
      </nav>

      {/* Recent campaigns */}
      <div className="mt-4 px-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">Recent campaigns</p>
        <div className="space-y-1">
          {campaigns.map((c, i) => (
            <button
              key={c.id}
              onClick={() => onCampaignClick(c.id)}
              style={{ '--rise-delay': `${0.15 + i * 0.05}s` } as React.CSSProperties}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors group animate-rise-in hover-lift"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-foreground truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.games} game{c.games !== 1 ? 's' : ''} · {c.updatedAt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">jamie@brandco.io</p>
          </div>
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-lg text-gray-400 hover:text-muted-foreground hover:bg-secondary transition-colors"
          >
            {theme === 'dark' ? Icon.sun('w-3.5 h-3.5') : Icon.moon('w-3.5 h-3.5')}
          </button>
          <button
            onClick={onSignOut}
            title="Sign out"
            className="p-2 rounded-lg text-gray-400 hover:text-muted-foreground hover:bg-secondary transition-colors"
          >
            {Icon.logout('w-3.5 h-3.5')}
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

interface TopBarInfo {
  title: string
  subtitle: string
  icon: (cls?: string) => React.ReactElement
  iconBg: string
  iconColor: string
}

function TopBar({ info, onMenuClick }: { info: TopBarInfo; onMenuClick: () => void }) {
  return (
    <header className="flex items-center gap-3 px-6 py-2.75 border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors flex-shrink-0"
      >
        {Icon.menu('w-4 h-4')}
      </button>
      <div className="hidden lg:block w-px h-4 bg-border flex-shrink-0" />
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${info.iconBg}`}>
        {info.icon(`w-4 h-4 ${info.iconColor}`)}
      </div>
      <div className="min-w-0 flex flex-col gap-0">
        <SplitText
          key={info.title}
          text={info.title}
          tag="h2"
          className="text-base font-semibold text-foreground leading-tight truncate"
          textAlign="left"
          splitType="chars"
          from={{ opacity: 0, y: 14 }}
          to={{ opacity: 1, y: 0 }}
          duration={0.45}
          delay={18}
          ease="power3.out"
          threshold={0}
          rootMargin="0px"
        />
        <p className="hidden sm:block text-xs text-muted-foreground truncate">{info.subtitle}</p>
      </div>
    </header>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({ campaigns, onNewGame }: { campaigns: Campaign[]; onNewGame: () => void }) {
  const stats = [
    { icon: Icon.layers('w-6 h-6 text-primary'), value: campaigns.length, label: 'Campaigns', bg: 'bg-primary/10' },
    { icon: Icon.gamepad('w-6 h-6 text-purple-500'), value: campaigns.reduce((a, c) => a + c.games, 0), label: 'Games built', bg: 'bg-purple-500/15' },
    { icon: Icon.bolt('w-6 h-6 text-orange-500'), value: '1,284', label: 'Events logged', bg: 'bg-orange-500/15' },
    { icon: Icon.trophy('w-6 h-6 text-green-400'), value: campaigns.filter(c => c.status === 'Finalized').length, label: 'Finalized', bg: 'bg-green-500/15' },
  ]

  return (
    <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-foreground">Overview</h1>
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 btn-neon text-white text-sm font-semibold px-6 py-3 rounded-full transition-opacity hover:opacity-90"
        >
          {Icon.plus('w-3.5 h-3.5')}
          New game
        </button>
      </div>

      {/* Stat cards — dot-grid container */}
      <div className="relative rounded-2xl p-4 mb-8" style={{ background: 'transparent' }}>
        <div className="absolute inset-0 rounded-2xl dot-grid opacity-30 pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <SpotlightCard
              key={i}
              spotlightColor="rgba(168, 85, 247, 0.18)"
              className="glass-panel bg-card/60 rounded-2xl border border-border p-6 shadow-sm animate-rise-in hover-lift flex flex-col items-center text-center gap-1"
              style={{ '--rise-delay': `${i * 0.06}s` } as React.CSSProperties}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${s.bg} mb-3`}>
                {s.icon}
              </div>
              <p className="text-3xl font-bold text-foreground tracking-tight">{s.value}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Campaign list */}
      {campaigns.length === 0 ? (
        <div className="glass-panel bg-card/50 border border-dashed border-border rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            {Icon.sparkles('w-5 h-5 text-primary')}
          </div>
          <p className="text-sm font-medium text-foreground mb-2">No campaigns yet</p>
          <p className="text-xs text-muted-foreground">Start your first game with the Create game flow.</p>
        </div>
      ) : (
        <div className="glass-panel bg-card/60 border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Campaigns</p>
          </div>
          {campaigns.map((c, i) => (
            <SpotlightCard
              key={c.id}
              spotlightColor="rgba(168, 85, 247, 0.12)"
              className={`flex items-center gap-4 px-6 py-5 hover:bg-muted/80 cursor-pointer transition-colors animate-rise-in hover-lift ${i < campaigns.length - 1 ? 'border-b border-border' : ''}`}
              style={{ '--rise-delay': `${0.24 + i * 0.06}s` } as React.CSSProperties}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-purple-500/25 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{c.brand.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.games} game{c.games !== 1 ? 's' : ''} · Updated {c.updatedAt}</p>
              </div>
              <StatusPill status={c.status} />
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Created Games ────────────────────────────────────────────────────────────

function GamesScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const game = CREATED_GAMES.find(g => g.id === selectedId) ?? null
  const playingGame = CREATED_GAMES.find(g => g.id === playingId) ?? null

  if (game) {
    return <GameAnalytics game={game} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
      <div className="flex flex-wrap justify-between gap-y-6">
        {CREATED_GAMES.map((g, i) => (
          <div
            key={g.id}
            onClick={() => setSelectedId(g.id)}
            className="glass-panel text-left w-[350px] flex-shrink-0 bg-card/60 border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-rise-in hover-lift"
            style={{ '--rise-delay': `${i * 0.06}s` } as React.CSSProperties}
          >
            <div className="h-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 flex items-center px-3 gap-2">
              <span className="text-white text-xs font-bold tracking-wide">{g.genre}</span>
              <span className="ml-auto text-white/60 text-xs">LIVE PREVIEW</span>
            </div>
            <div className="relative bg-muted" style={{ height: 500 }}>
              <iframe
                src={g.file}
                className="w-full h-full border-0 pointer-events-none"
                title={g.title}
                sandbox="allow-scripts allow-same-origin"
              />
              <button
                onClick={e => { e.stopPropagation(); setPlayingId(g.id) }}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/20 text-white flex items-center justify-center shadow-lg transition-colors"
                title={`Play ${g.title}`}
              >
                {Icon.play('w-5 h-5 ml-1')}
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{g.title}</p>
                <button
                  onClick={e => { e.stopPropagation(); setPlayingId(g.id) }}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary flex-shrink-0"
                >
                  {Icon.play('w-3 h-3')}
                  Play
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {Icon.trophy('w-3.5 h-3.5 text-orange-500')}
                  {g.topScore.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  {Icon.bolt('w-3.5 h-3.5 text-primary')}
                  {g.peopleEngaged.toLocaleString()} engaged
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {playingGame && <GamePlayModal game={playingGame} onClose={() => setPlayingId(null)} />}
    </div>
  )
}

function GamePlayModal({
  game,
  onClose,
}: {
  game: { file: string; title: string; genre: string }
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={onClose}>
      <div
        className="glass-panel bg-card/80 rounded-2xl overflow-hidden shadow-xl w-full max-w-sm border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-9 bg-gradient-to-r from-fuchsia-600 to-purple-600 flex items-center px-4 gap-2">
          <span className="text-white text-xs font-bold tracking-wide">{game.title}</span>
          <span className="text-white/60 text-xs">{game.genre}</span>
          <button
            onClick={onClose}
            className="ml-auto text-white/80 hover:text-white p-1 -m-1"
            title="Close"
          >
            {Icon.close('w-4 h-4')}
          </button>
        </div>
        <div className="bg-muted" style={{ height: 640 }}>
          <iframe
            src={game.file}
            className="w-full h-full border-0"
            title={game.title}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Engagement chart ──────────────────────────────────────────────────────
// Dependency-free SVG line+area chart — single series, so no legend box (the
// heading above it names the series). 2px line, rounded caps, ~10%-opacity
// area wash, hairline recessive gridlines, crosshair + tooltip on hover.

const CHART_COLOR = '#c084fc' // matches --primary; validated via dataviz skill's contrast check

function niceMax(value: number) {
  if (value <= 0) return 10
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const steps = [1, 2, 2.5, 5, 10]
  for (const step of steps) {
    const candidate = step * magnitude
    if (candidate >= value) return candidate
  }
  return 10 * magnitude
}

function EngagementChart({ data, gameId }: { data: number[]; gameId: string }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const width = 600
  const height = 200
  const padding = { top: 16, right: 16, bottom: 28, left: 40 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const maxVal = niceMax(Math.max(...data))
  const yTicks = [0, maxVal / 2, maxVal]

  const points = data.map((v, i) => {
    const x = padding.left + (i / (data.length - 1)) * plotW
    const y = padding.top + plotH - (v / maxVal) * plotH
    return { x, y, v }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${padding.top + plotH} L ${points[0].x.toFixed(2)} ${padding.top + plotH} Z`

  const gradientId = `engagement-fill-${gameId}`
  const last = points[points.length - 1]
  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let nearestDist = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - relX)
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto touch-none"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.12} />
            <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* gridlines — hairline, recessive */}
        {yTicks.map((t, i) => {
          const y = padding.top + plotH - (t / maxVal) * plotH
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" strokeWidth={1} className="text-border" />
              <text x={padding.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground" fontSize={10}>
                {Math.round(t).toLocaleString()}
              </text>
            </g>
          )
        })}

        {/* x-axis: first / mid / last only */}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map(i => (
          <text key={i} x={points[i].x} y={height - 8} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
            {i === data.length - 1 ? 'Today' : `${data.length - 1 - i}d ago`}
          </text>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={CHART_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* end marker: >=8px with a surface ring */}
        <circle cx={last.x} cy={last.y} r={5} fill="var(--color-card)" />
        <circle cx={last.x} cy={last.y} r={4} fill={CHART_COLOR} />
        <text x={last.x} y={last.y - 12} textAnchor="end" className="fill-foreground font-semibold" fontSize={11}>
          {last.v.toLocaleString()}
        </text>

        {/* crosshair */}
        {hovered && (
          <>
            <line x1={hovered.x} y1={padding.top} x2={hovered.x} y2={padding.top + plotH} stroke="currentColor" strokeWidth={1} className="text-border" />
            <circle cx={hovered.x} cy={hovered.y} r={5} fill="var(--color-card)" />
            <circle cx={hovered.x} cy={hovered.y} r={4} fill={CHART_COLOR} />
          </>
        )}
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className="absolute pointer-events-none bg-foreground text-background text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg -translate-x-1/2 -translate-y-full"
          style={{ left: `${(hovered.x / width) * 100}%`, top: `${(hovered.y / height) * 100}%`, marginTop: -8 }}
        >
          <span className="font-semibold">{hovered.v.toLocaleString()}</span> plays ·{' '}
          {hoverIndex === data.length - 1 ? 'Today' : `${data.length - 1 - hoverIndex}d ago`}
        </div>
      )}
    </div>
  )
}

function GameAnalytics({ game, onBack }: { game: CreatedGame; onBack: () => void }) {
  const stats = [
    { icon: Icon.trophy('w-5 h-5 text-orange-500'), value: game.topScore.toLocaleString(), label: 'Top score', bg: 'bg-orange-500/15' },
    { icon: Icon.bolt('w-5 h-5 text-primary'), value: game.peopleEngaged.toLocaleString(), label: 'People engaged', bg: 'bg-primary/10' },
    { icon: Icon.gamepad('w-5 h-5 text-purple-500'), value: `${Math.floor(game.avgSessionSec / 60)}m ${game.avgSessionSec % 60}s`, label: 'Avg. session', bg: 'bg-purple-500/15' },
  ]

  return (
    <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        {Icon.arrowLeft('w-3.5 h-3.5')}
        Created games
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 flex items-center justify-center flex-shrink-0">
          {Icon.gamepad('w-5 h-5 text-white')}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{game.title}</h1>
          <p className="text-xs text-muted-foreground">{game.genre}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="glass-panel bg-card/60 rounded-2xl border border-border p-6 shadow-sm animate-rise-in hover-lift"
            style={{ '--rise-delay': `${i * 0.06}s` } as React.CSSProperties}
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} mb-4`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel bg-card/60 border border-border rounded-2xl p-6 shadow-sm mb-8 animate-rise-in" style={{ '--rise-delay': '0.15s' } as React.CSSProperties}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Plays — last 14 days</p>
        <EngagementChart data={game.dailyPlays} gameId={game.id} />
      </div>

      <div className="glass-panel bg-card/60 border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Leaderboard</p>
        </div>
        {game.leaderboard.map((entry, i) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 px-6 py-4 animate-rise-in hover-lift ${i < game.leaderboard.length - 1 ? 'border-b border-border' : ''}`}
            style={{ '--rise-delay': `${0.2 + i * 0.06}s` } as React.CSSProperties}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                entry.rank === 1
                  ? 'bg-orange-500/20 text-orange-300'
                  : entry.rank === 2
                  ? 'bg-secondary text-muted-foreground'
                  : entry.rank === 3
                  ? 'bg-orange-500/15 text-orange-500'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {entry.rank}
            </span>
            <span className="flex-1 text-sm font-medium text-foreground">{entry.name}</span>
            <span className="text-sm font-semibold text-foreground">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Chat Screen ─────────────────────────────────────────────────────────────

// Flow stages
type FlowStage =
  | 'idle'        // empty welcome
  | 'cooking'     // user sent brief, AI "cooking" animation
  | 'targeting'   // ask age group
  | 'hallucinating' // user picked age, AI generating games
  | 'concepts'    // show 3 game iframes + style cards
  | 'finalizing'  // user picked style, show lead-rush
  | 'done'        // fully shipped

const STAGE_ORDER: FlowStage[] = ['idle', 'cooking', 'targeting', 'hallucinating', 'concepts', 'finalizing', 'done']

const AGE_GROUPS = ['10 – 20', '20 – 30', '30 – 40', '40 – 50', '50+']

const STYLE_CARDS = [
  { id: 'aesthetic', label: 'Aesthetic' },
  { id: 'logic', label: 'Concept' },
  { id: 'pace', label: 'Pace' },
]

const GAME_PREVIEWS = [
  { file: '/lead-catcher.html', title: 'Lead Catcher', genre: 'Catcher' },
  { file: '/lead-dodger.html', title: 'Lead Dodger', genre: 'Dodger' },
  { file: '/lead-rush-cyber.html', title: 'Lead Rush Cyber', genre: 'Runner' },
]

const FINAL_GAME = { file: '/lead-rush.html', title: 'Lead Rush', genre: 'Runner' }

const CREATED_GAMES: CreatedGame[] = [
  {
    id: 'lead-rush',
    file: '/lead-rush.html',
    title: 'Lead Rush',
    genre: 'Runner',
    topScore: 8420,
    peopleEngaged: 2184,
    avgSessionSec: 132,
    leaderboard: [
      { rank: 1, name: 'Jordan K.', score: 8420 },
      { rank: 2, name: 'Alex R.', score: 7960 },
      { rank: 3, name: 'Sam P.', score: 7510 },
      { rank: 4, name: 'Taylor M.', score: 7002 },
      { rank: 5, name: 'Casey W.', score: 6588 },
      { rank: 6, name: 'Morgan P.', score: 6140 },
      { rank: 7, name: 'Jamie L.', score: 5820 },
      { rank: 8, name: 'Rowan T.', score: 5510 },
    ],
    dailyPlays: [98, 112, 105, 130, 142, 158, 149, 171, 165, 188, 176, 204, 195, 221],
  },
  {
    id: 'lead-catcher',
    file: '/lead-catcher.html',
    title: 'Lead Catcher',
    genre: 'Catcher',
    topScore: 4820,
    peopleEngaged: 1312,
    avgSessionSec: 96,
    leaderboard: [
      { rank: 1, name: 'Morgan T.', score: 4820 },
      { rank: 2, name: 'Riley S.', score: 4510 },
      { rank: 3, name: 'Jamie D.', score: 4290 },
      { rank: 4, name: 'Drew L.', score: 3980 },
      { rank: 5, name: 'Quinn B.', score: 3745 },
      { rank: 6, name: 'Avery C.', score: 3512 },
      { rank: 7, name: 'Peyton R.', score: 3299 },
      { rank: 8, name: 'Harper W.', score: 3105 },
    ],
    dailyPlays: [62, 70, 65, 78, 84, 91, 87, 96, 90, 102, 98, 110, 104, 118],
  },
  {
    id: 'lead-dodger',
    file: '/lead-dodger.html',
    title: 'Lead Dodger',
    genre: 'Dodger',
    topScore: 3960,
    peopleEngaged: 987,
    avgSessionSec: 84,
    leaderboard: [
      { rank: 1, name: 'Avery H.', score: 3960 },
      { rank: 2, name: 'Reese N.', score: 3705 },
      { rank: 3, name: 'Charlie F.', score: 3420 },
      { rank: 4, name: 'Skyler J.', score: 3180 },
      { rank: 5, name: 'Rowan G.', score: 2950 },
      { rank: 6, name: 'Emery K.', score: 2760 },
      { rank: 7, name: 'Finley B.', score: 2588 },
      { rank: 8, name: 'Dakota S.', score: 2410 },
    ],
    dailyPlays: [48, 52, 45, 58, 61, 66, 60, 70, 65, 74, 69, 79, 73, 85],
  },
  {
    id: 'lead-rush-cyber',
    file: '/lead-rush-cyber.html',
    title: 'Lead Rush Cyber',
    genre: 'Runner',
    topScore: 6215,
    peopleEngaged: 1540,
    avgSessionSec: 108,
    leaderboard: [
      { rank: 1, name: 'Sage P.', score: 6215 },
      { rank: 2, name: 'Emerson K.', score: 5890 },
      { rank: 3, name: 'Blair W.', score: 5460 },
      { rank: 4, name: 'Kendall R.', score: 5102 },
      { rank: 5, name: 'Marlowe C.', score: 4780 },
      { rank: 6, name: 'Sawyer D.', score: 4455 },
      { rank: 7, name: 'Ellis M.', score: 4180 },
      { rank: 8, name: 'Remy A.', score: 3920 },
    ],
    dailyPlays: [71, 79, 74, 88, 95, 103, 97, 112, 106, 121, 114, 132, 125, 141],
  },
]

// Cooking animation component
function CookingAnimation({ label }: { label: string }) {
  const sparks = ['✦', '✧', '⋆', '✦', '✧']
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl rounded-tl-sm p-5 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative w-8 h-8">
          {sparks.map((s, i) => (
            <span
              key={i}
              className="absolute text-fuchsia-300 text-xs font-bold"
              style={{
                top: `${50 + 40 * Math.sin((i / sparks.length) * Math.PI * 2)}%`,
                left: `${50 + 40 * Math.cos((i / sparks.length) * Math.PI * 2)}%`,
                animation: `cookSpark 1.4s ${i * 0.28}s ease-in-out infinite`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {s}
            </span>
          ))}
          <span className="absolute inset-0 flex items-center justify-center text-base">🍳</span>
        </div>
        <span className="text-sm font-semibold text-purple-200">{label}</span>
      </div>
      <div className="flex gap-1 items-center">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 rounded-full bg-purple-400/60"
            style={{
              width: `${12 + i * 6}px`,
              animation: `cookBar 1.2s ${i * 0.18}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Game iframe card — while `generating`, the preview sits blurred behind an
// AI-creating overlay; once generation finishes it defocuses back to sharp.
// `final` swaps the style checkboxes for the finalized game's download/embed
// actions — used for the winning concept, shown at the same size as the rest.
function GameIframeCard({
  game,
  generating = false,
  final = false,
  beamDelay = 0,
  selectedStyle,
  onSelectStyle,
  onPlay,
}: {
  game: { file: string; title: string; genre: string }
  generating?: boolean
  final?: boolean
  beamDelay?: number
  selectedStyle: string | null
  onSelectStyle: (id: string) => void
  onPlay: () => void
}) {
  const [copied, setCopied] = useState(false)
  function copyEmbed() {
    const embed = `<iframe src="${window.location.origin}${game.file}" width="390" height="844" frameborder="0" allow="autoplay"></iframe>`
    navigator.clipboard.writeText(embed).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="glass-panel relative flex-shrink-0 w-[190px] min-[1400px]:w-[220px] bg-card/60 border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="relative bg-muted aspect-[307/432] overflow-hidden">
        <iframe
          src={game.file}
          className={`w-full h-full border-0 pointer-events-none transition-[filter,transform] duration-[1200ms] ease-out ${
            generating ? 'blur-lg scale-110' : 'blur-0 scale-100'
          }`}
          title={game.title}
          sandbox="allow-scripts allow-same-origin"
        />

        {/* AI-generating overlay — shimmer sweep over a dimmed backdrop while
            the game "renders", the same visual language as ChatGPT/Gemini's
            image-gen loaders. */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-700 ease-out ${
            generating ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/40 to-transparent ai-scanline" />
          <PixieMark className="w-5 h-5 text-white animate-pulse relative drop-shadow" />
          <span className="text-[10px] font-semibold tracking-widest text-white/90 uppercase relative drop-shadow">
            Generating…
          </span>
        </div>

        <button
          onClick={onPlay}
          className={`absolute inset-0 m-auto w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/20 text-white flex items-center justify-center shadow-lg transition-opacity duration-500 ${
            generating ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          title={`Play ${game.title}`}
        >
          {Icon.play('w-4 h-4 ml-0.5')}
        </button>
      </div>
      <div className="px-3 py-2.5 border-t border-border">
        {generating ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-2.5 w-2/3 rounded-full bg-muted" />
            <div className="h-2 w-full rounded-full bg-muted" />
            <div className="h-2 w-5/6 rounded-full bg-muted" />
            <div className="h-2 w-4/6 rounded-full bg-muted" />
          </div>
        ) : final ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-xs font-semibold text-foreground">{game.title}</p>
              <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">FINAL</span>
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold btn-neon text-white py-1.5 transition-opacity hover:opacity-90">
                {Icon.download('w-3 h-3')}
                Download
              </button>
              <button
                onClick={copyEmbed}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold border border-border text-foreground hover:bg-muted py-1.5 transition-colors"
              >
                {Icon.copy('w-3 h-3')}
                {copied ? 'Copied' : 'Embed'}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <p className="text-xs font-semibold text-foreground mb-2">{game.title}</p>
            <div className="space-y-1.5">
              {STYLE_CARDS.map(s => {
                const checked = selectedStyle === s.id
                return (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onSelectStyle(s.id)}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? 'bg-primary border-primary' : 'border-border bg-muted'
                      }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
      {!generating && <BorderBeam duration={8} size={180} delay={beamDelay} />}
    </div>
  )
}

const QUICK_PILLS = ['Bolder', 'Simpler', 'Add leaderboard', 'Stronger CTA']

// Completed-step marker, left behind once an in-progress animation finishes
function StepDone({ label }: { label: string }) {
  return (
    <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-4 py-2 flex items-center gap-2">
      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// Chat message bubble
function Bubble({ role, children }: { role: 'assistant' | 'user'; children: React.ReactNode }) {
  return (
    <div className={`flex gap-3 animate-rise-in ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex-shrink-0 flex items-center justify-center mt-1 flex-shrink-0">
          <PixieMark className="w-3.5 h-3.5" />
        </div>
      )}
      <div className={`max-w-[50%] ${role === 'user' ? 'order-first' : ''}`}>
        {children}
      </div>
      {role === 'user' && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex-shrink-0 flex items-center justify-center mt-1">
          <span className="text-xs font-bold text-white">J</span>
        </div>
      )}
    </div>
  )
}

function ReasoningBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-muted-foreground transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Reasoning
      </button>
      {open && (
        <p className="text-xs text-muted-foreground italic leading-snug mt-2 pl-3 border-l-2 border-border">
          {text}
        </p>
      )}
    </div>
  )
}

function TextBubble({ role, text, reasoning }: { role: 'assistant' | 'user'; text: string; reasoning?: string }) {
  return (
    <Bubble role={role}>
      {role === 'assistant' && reasoning && <ReasoningBlock text={reasoning} />}
      <div className={`text-sm px-4 py-2 rounded-2xl ${
        role === 'assistant'
          ? 'bg-secondary text-foreground rounded-tl-sm '
          : 'bg-primary text-white rounded-tr-sm'
      }`}>
        {text}
      </div>
    </Bubble>
  )
}

function ChatScreen() {
  const [stage, setStage] = useState<FlowStage>('idle')
  const [messages, setMessages] = useState<Array<{ id: string; role: 'assistant' | 'user'; text: string; reasoning?: string }>>([])
  const [input, setInput] = useState('')
  const [inputBusy, setInputBusy] = useState(false)
  const [selectedAge, setSelectedAge] = useState<string | null>(null)
  const [customAge, setCustomAge] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<Record<string, string>>({})
  const [playingGameFile, setPlayingGameFile] = useState<string | null>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const atConcepts = stage === 'concepts' || stage === 'finalizing' || stage === 'done'
  const atDone = stage === 'done'
  const stageIndex = STAGE_ORDER.indexOf(stage)
  const stagePassed = (s: FlowStage) => stageIndex > STAGE_ORDER.indexOf(s)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight })
  }, [messages, stage, inputBusy])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80)
  }

  function addMsg(role: 'assistant' | 'user', text: string, reasoning?: string) {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role, text, reasoning }])
  }

  async function handleBriefSend(text: string) {
    if (!text.trim() || inputBusy) return
    addMsg('user', text)
    setInput('')
    setInputBusy(true)
    setStage('cooking')
    await new Promise(r => setTimeout(r, 2600))
    addMsg(
      'assistant',
      "Great brief! Now — who's your target audience? Pick an age group so I can tune the game mechanics and UX for them.",
      "The brief gives me tone and product category, but not who's playing. Mechanics, pacing, and difficulty all shift a lot by age group, so I need that before generating variants."
    )
    setStage('targeting')
    setInputBusy(false)
  }

  async function handleAgeSelect(age: string) {
    if (selectedAge) return
    setSelectedAge(age)
    addMsg('user', `Target: ${age}`)
    setStage('hallucinating')
    await new Promise(r => setTimeout(r, 3200))
    addMsg(
      'assistant',
      "Here are three playable game variants tailored to your brief. Try them live — then tell me which style resonates with your brand.",
      `Given the ${age} target, I generated three distinct mechanics — a catcher, a dodger, and a reflex runner — to cover a range of engagement styles rather than betting on one. Presenting them side by side makes it easy to compare before committing to a visual style.`
    )
    setStage('concepts')
  }

  function handleStyleSelect(gameFile: string, styleId: string) {
    if (stage !== 'concepts') return
    setSelectedStyles(prev => {
      if (prev[gameFile] === styleId) {
        const { [gameFile]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [gameFile]: styleId }
    })
  }

  async function handleStyleContinue() {
    const picks = GAME_PREVIEWS.filter(g => selectedStyles[g.file])
    if (picks.length === 0) return
    const summary = picks
      .map(g => `${g.title}: ${STYLE_CARDS.find(s => s.id === selectedStyles[g.file])!.label}`)
      .join(', ')
    addMsg('user', `Style picks — ${summary}`)
    setStage('finalizing')
    await new Promise(r => setTimeout(r, 2600))
    addMsg(
      'assistant',
      "This concept has been remixed — I merged your style picks into Lead Rush, tuned to match your brand's voice and target audience. Here's your finalized game, ready to ship.",
      `With ${summary} as the style picks, I merged the strongest mechanic from the variants into Lead Rush and applied the chosen visual treatments, then re-tuned difficulty and pacing for the target audience before locking the final build.`
    )
    setStage('done')
  }

  function handleReset() {
    setStage('idle')
    setMessages([])
    setSelectedAge(null)
    setCustomAge('')
    setSelectedStyles({})
    setInputBusy(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-hide px-6 md:px-10 pt-8 pb-40"
      >
        {/* ── Empty state ── */}
        {stage === 'idle' && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-full py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center mb-8 shadow-lg shadow-fuchsia-500/30">
              <PixieMark className="w-10 h-10 text-white" />
            </div>
            <TextType
              as="h2"
              text="Welcome to Pixie"
              typingSpeed={60}
              initialDelay={200}
              loop={false}
              showCursor={false}
              className="text-4xl font-bold mb-4 text-center bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text text-transparent"
            />
            <TextType
              as="p"
              text="Describe your product or campaign and I'll build a playable mini-game — fully branded, ready to ship."
              typingSpeed={20}
              initialDelay={1100}
              loop={false}
              cursorCharacter="▋"
              cursorClassName="text-primary"
              className="text-muted-foreground text-lg text-center mb-12 max-w-lg leading-relaxed"
            />
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {[
                { icon: Icon.palette('w-5 h-5'), title: 'Brand intake', desc: 'Share your brief and brand kit', bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', prompt: "I need to make a game for my product in lead management. Our brand is modern, bold, and targets sales teams who love fast-paced workflows." },
                { icon: Icon.layers('w-5 h-5'), title: '3 concepts', desc: "Three playable variants generated", bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/20', prompt: "Build three game concepts for a fintech app focused on expense tracking." },
                { icon: Icon.sparkles('w-5 h-5'), title: 'Remix', desc: 'Iterate with a single message', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/20', prompt: "Make the game feel more competitive with leaderboards and time pressure." },
                { icon: Icon.ship('w-5 h-5'), title: 'Ship it', desc: 'Get embed code and download', bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/20', prompt: "I want to finalize the runner game and get the embed code for our landing page." },
              ].map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleBriefSend(t.prompt)}
                  className={`${t.bg} border ${t.border} rounded-xl p-3.5 text-left hover:opacity-80 transition-opacity`}
                >
                  <span className={t.text}>{t.icon}</span>
                  <p className={`text-sm font-semibold ${t.text} mt-2 mb-0.5`}>{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Message thread ── */}
        {messages.length > 0 && (
          <div className="max-w-[1075px] mx-auto space-y-5">
            {messages.map(m => (
              <TextBubble key={m.id} role={m.role} text={m.text} reasoning={m.reasoning} />
            ))}

            {/* ── Cooking animation ── */}
            {(stage === 'cooking' || stagePassed('cooking')) && (
              <Bubble role="assistant">
                {stage === 'cooking' ? (
                  <CookingAnimation label="Pixie is cooking your game…" />
                ) : (
                  <StepDone label="Cooked up your game brief" />
                )}
              </Bubble>
            )}

            {/* ── Age targeting cards ── */}
            {(stage === 'targeting' || stage === 'hallucinating' || atConcepts) && (
              <div className="animate-rise-in">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 ml-10">Target audience</p>
                <div className="flex flex-wrap gap-2 ml-10">
                  {AGE_GROUPS.map(age => (
                    <button
                      key={age}
                      onClick={() => handleAgeSelect(age)}
                      disabled={!!selectedAge}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                        selectedAge === age
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                          : selectedAge
                          ? 'bg-muted text-gray-400 border-border cursor-default'
                          : 'bg-card text-foreground border-border hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                  {!selectedAge && (
                    <div className="flex items-center gap-2">
                      <input
                        value={customAge}
                        onChange={e => setCustomAge(e.target.value)}
                        placeholder="Custom…"
                        className="px-3 py-2 rounded-full text-sm border border-border outline-none focus:ring-2 focus:ring-ring w-28 placeholder:text-muted-foreground"
                        onKeyDown={e => e.key === 'Enter' && customAge.trim() && handleAgeSelect(customAge.trim())}
                      />
                      {customAge.trim() && (
                        <button
                          onClick={() => handleAgeSelect(customAge.trim())}
                          className="px-3 py-2 rounded-full text-xs font-semibold bg-primary text-white"
                        >
                          Set
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Generation complete marker ── */}
            {stagePassed('hallucinating') && (
              <Bubble role="assistant">
                <StepDone label="Generated 3 game variants" />
              </Bubble>
            )}

            {/* ── Selection guidance ── */}
            {atConcepts && (
              <TextBubble
                role="assistant"
                text="Pick the game that's ready to go, or customize a new one — for each variant, choose an Aesthetic, Concept, and Pace to remix it into something new."
              />
            )}

            {/* ── 3 game iframes — appear immediately and "generate" in place,
                 then defocus from blurred to sharp once ready. This row is
                 the historical record of what was picked — it freezes once
                 remixed; the final game is a new card below, not a swap
                 inside this row. ── */}
            {(stage === 'hallucinating' || atConcepts) && (
              <div className="animate-rise-in space-y-4">
                {/* Iframes */}
                <div className="flex justify-[safe_center] gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {GAME_PREVIEWS.map((g, i) => (
                    <GameIframeCard
                      key={g.file}
                      game={g}
                      generating={stage === 'hallucinating'}
                      beamDelay={-i * 1.6}
                      selectedStyle={selectedStyles[g.file] ?? null}
                      onSelectStyle={styleId => handleStyleSelect(g.file, styleId)}
                      onPlay={() => setPlayingGameFile(g.file)}
                    />
                  ))}
                </div>

                {stage === 'concepts' && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleStyleContinue}
                      disabled={Object.keys(selectedStyles).length === 0}
                      className={`px-5 py-2 text-sm font-semibold transition-colors ${
                        Object.keys(selectedStyles).length > 0
                          ? 'btn-neon text-white'
                          : 'bg-secondary text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      Remix
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Final game generated marker ── */}
            {stagePassed('finalizing') && (
              <Bubble role="assistant">
                <StepDone label="Final game generated" />
              </Bubble>
            )}

            {/* ── Remix confirmation ── */}
            {atDone && (
              <TextBubble
                role="assistant"
                text="This concept has been remixed into Lead Rush — take a look below."
              />
            )}

            {/* ── Final game — a new message/card, same size as the concepts
                 above, that generates in place then defocuses to sharp. ── */}
            {(stage === 'finalizing' || atDone) && (
              <div className="animate-rise-in space-y-4">
                <div className="flex justify-[safe_center] gap-4">
                  <GameIframeCard
                    game={FINAL_GAME}
                    generating={stage === 'finalizing'}
                    final
                    selectedStyle={null}
                    onSelectStyle={() => {}}
                    onPlay={() => setPlayingGameFile(FINAL_GAME.file)}
                  />
                </div>
                {atDone && (
                  <div className="flex justify-end">
                    <button onClick={handleReset} className="px-5 py-2 text-sm font-semibold btn-neon text-white transition-opacity hover:opacity-90">
                      Start new game
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll-to-bottom */}
      {showScrollBtn && (
        <button
          onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
          className="glass-panel absolute bottom-24 right-6 w-8 h-8 bg-card/70 border border-border rounded-full shadow-md flex items-center justify-center hover:bg-muted transition-colors"
        >
          {Icon.arrowDown('w-3.5 h-3.5 text-muted-foreground')}
        </button>
      )}

      {/* Composer — floats over the scrolled chat; the section itself has no
          background, only the individual fields (pills, input, send) do. */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-8 pt-4 pb-5 pointer-events-none">
        {atConcepts && !atDone && (
          <div className="max-w-[640px] mx-auto flex gap-2 flex-wrap mb-3 pointer-events-auto">
            {QUICK_PILLS.map(p => (
              <button key={p} className="text-xs font-medium border border-border text-muted-foreground hover:border-primary/40 hover:text-primary px-4 py-2 rounded-full transition-colors bg-card">
                {p}
              </button>
            ))}
          </div>
        )}
        <div className="max-w-[640px] mx-auto flex gap-2.5 pointer-events-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleBriefSend(input)}
            placeholder={stage === 'idle' ? 'Describe your product or campaign…' : 'Message Pixie…'}
            className="flex-1 px-4 py-3 rounded-full border border-border bg-card shadow-sm text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground disabled:opacity-40"
          />
          <button
            onClick={() => handleBriefSend(input)}
            disabled={!input.trim()}
            className="w-[46px] h-[46px] btn-neon disabled:opacity-40 disabled:shadow-none text-white rounded-full flex items-center justify-center transition-opacity hover:opacity-90 flex-shrink-0"
          >
            {inputBusy ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : Icon.send('w-4 h-4')}
          </button>
        </div>
      </div>

      {playingGameFile && (
        <GamePlayModal
          game={[...GAME_PREVIEWS, FINAL_GAME].find(g => g.file === playingGameFile)!}
          onClose={() => setPlayingGameFile(null)}
        />
      )}
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({
  onSignOut,
  theme,
  onToggleTheme,
}: {
  onSignOut: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}) {
  const [nav, setNav] = useState<NavItem>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [campaigns] = useState<Campaign[]>(CAMPAIGNS)

  const topBarInfo: Record<NavItem, TopBarInfo> = {
    home: {
      title: 'Overview',
      subtitle: 'Your campaigns and games at a glance',
      icon: Icon.home,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    create: {
      title: 'Create game',
      subtitle: 'Chat your way from brief to shipped mini-game',
      icon: Icon.sparkles,
      iconBg: 'bg-purple-500/15',
      iconColor: 'text-purple-500',
    },
    games: {
      title: 'Created games',
      subtitle: 'Browse, play, and analyze what you’ve shipped',
      icon: Icon.gamepad,
      iconBg: 'bg-orange-500/15',
      iconColor: 'text-orange-500',
    },
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        nav={nav}
        onNav={n => { setNav(n); setSidebarOpen(false) }}
        onSignOut={onSignOut}
        campaigns={campaigns}
        onCampaignClick={() => setNav('create')}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar info={topBarInfo[nav]} onMenuClick={() => setSidebarOpen(o => !o)} />
        {nav === 'home' && (
          <HomeScreen campaigns={campaigns} onNewGame={() => setNav('create')} />
        )}
        {nav === 'create' && <ChatScreen />}
        {nav === 'games' && <GamesScreen />}
      </div>
    </div>
  )
}

// ─── Splash ───────────────────────────────────────────────────────────────────

function SplashScreen({ onDone, theme }: { onDone: () => void; theme: 'dark' | 'light' }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <PixieMark className="w-12 h-12 text-foreground animate-rise-in" />
      <ShinyText
        text="Pixie"
        speed={1.4}
        color={theme === 'light' ? '#d4d1dc' : '#4b4b4b'}
        shineColor={theme === 'light' ? '#9333ea' : '#ffffff'}
        spread={120}
        className="text-7xl font-bold"
      />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('pixie-theme') === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('pixie-theme', theme)
  }, [theme])

  return (
    <div>
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('splash')} theme={theme} />}
      {screen === 'splash' && <SplashScreen onDone={() => setScreen('home')} theme={theme} />}
      {(screen === 'home' || screen === 'create') && (
        <AppShell
          onSignOut={() => setScreen('login')}
          theme={theme}
          onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        />
      )}
    </div>
  )
}
