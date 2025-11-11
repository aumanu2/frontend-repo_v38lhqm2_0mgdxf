import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import './index.css'

// Simple app-wide context via props drilling (lightweight)
const getStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// Mock data seeding for first-time visitors
const seedData = () => {
  if (!getStored('leaderboard', null)) {
    setStored('leaderboard', [
      { id: 'u1', name: 'Ava', days: 21, progress: 82 },
      { id: 'u2', name: 'Noah', days: 14, progress: 68 },
      { id: 'u3', name: 'Liam', days: 7, progress: 95 },
      { id: 'u4', name: 'Mia', days: 21, progress: 40 }
    ])
  }
  if (!getStored('blogPosts', null)) {
    setStored('blogPosts', [
      {
        id: 'b1',
        title: 'Why Digital Detox Matters',
        excerpt: 'Reclaim your focus and presence with small daily habits.',
        content:
          'Constant connectivity fragments our attention. A gentle detox restores intention. Start by scheduling short offline windows and noticing how your mind settles.',
        date: '2024-09-01',
        author: 'Team D2R'
      },
      {
        id: 'b2',
        title: 'Micro-breaks, Macro Gains',
        excerpt: '5 minutes away from screens improves posture and mood.',
        content:
          'Stand up, stretch, breathe. These micro-breaks compound into deeper clarity. Pair them with device-free meals for a bigger reset.',
        date: '2024-10-14',
        author: 'Coach Lina'
      },
      {
        id: 'b3',
        title: 'Stories from the Community',
        excerpt: 'How people found balance with mindful tech routines.',
        content:
          'From muted notifications to bedtime wind-downs, small boundaries created big space. Explore routines and pick one that fits your life.',
        date: '2024-11-05',
        author: 'Community'
      }
    ])
  }
}

const useAuth = () => {
  const [user, setUser] = useState(() => getStored('user', null))
  const login = (profile) => {
    setUser(profile)
    setStored('user', profile)
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  return { user, login, logout }
}

// UI Components
const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
          <span className="font-semibold tracking-tight">Disconnect to Reconnect</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link className="hover:text-orange-600 transition" to="/blog">Blog</Link>
          <Link className="hover:text-orange-600 transition" to="/challenges">Challenges</Link>
          {user ? (
            <>
              <Link className="hover:text-orange-600 transition" to="/dashboard">Dashboard</Link>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800">Logout</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

const Footer = () => (
  <footer className="mt-20 border-t border-black/5">
    <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-6 text-sm">
      <div>
        <div className="font-semibold mb-2">Disconnect to Reconnect</div>
        <p className="text-gray-600">A minimal, soothing space to cultivate mindful tech habits.</p>
      </div>
      <div>
        <div className="font-semibold mb-2">Explore</div>
        <ul className="space-y-1 text-gray-600">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/challenges">Challenges</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">Stay mindful</div>
        <p className="text-gray-600">Small steps, gentle progress, steady clarity.</p>
      </div>
    </div>
    <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} Disconnect to Reconnect</div>
  </footer>
)

const Hero = () => (
  <section className="relative h-[60vh] md:h-[70vh] flex items-center">
    <div className="absolute inset-0">
      {/* Spline 3D cover */}
      <Spline scene="https://prod.spline.design/cEecEwR6Ehj4iT8T/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      {/* Soft gradient overlay to improve text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
    </div>
    <div className="relative max-w-6xl mx-auto px-4 text-white">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Disconnect to Reconnect</h1>
      <p className="mt-4 max-w-2xl text-white/90">Create calm, intentional distance from screens and return with clarity. Gentle challenges, thoughtful stories, and visual progress.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/login" className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white">Get Started</Link>
        <Link to="/challenges" className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30">View Challenges</Link>
      </div>
    </div>
  </section>
)

const Feature = ({ title, desc }) => (
  <div className="p-5 rounded-2xl border border-black/5 bg-white/70 backdrop-blur hover:shadow-sm transition">
    <div className="text-lg font-semibold mb-1">{title}</div>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
)

const Home = () => (
  <main>
    <Hero />
    <section className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Feature title="Mindful Onboarding" desc="A short questionnaire assigns a 7, 14, or 21-day detox challenge." />
      <Feature title="Visual Progress" desc="Calm charts show your completion and daily streaks." />
      <Feature title="Community" desc="A friendly leaderboard and rotating motivation keep you inspired." />
    </section>
  </main>
)

// Charts (CSS/SVG based, no extra deps)
const PieChart = ({ percent = 0 }) => {
  const r = 28
  const c = 2 * Math.PI * r
  const dash = (percent / 100) * c
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} stroke="#e5e7eb" strokeWidth="8" fill="none" />
      <circle cx="40" cy="40" r={r} stroke="#fb923c" strokeWidth="8" fill="none" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 40 40)" />
      <text x="40" y="44" textAnchor="middle" className="fill-gray-800 text-sm font-semibold">{Math.round(percent)}%</text>
    </svg>
  )
}

const BarChart = ({ data = [] }) => {
  const max = Math.max(1, ...data)
  return (
    <div className="grid grid-cols-7 gap-2 items-end h-28">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-full bg-orange-200/60 rounded">
            <div className="w-full bg-orange-500 rounded transition-all" style={{ height: `${(v / max) * 100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500">D{i + 1}</span>
        </div>
      ))}
    </div>
  )
}

// Login (placeholder Google Sign-In)
const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const handleMockGoogle = () => {
    const mock = { id: `u_${Date.now()}`, name: 'Guest', email: 'guest@example.com', avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Guest` }
    onLogin(mock)
    // Initialize empty progress state
    setStored('progress', { days: 0, target: 0, daily: [] })
    navigate('/onboarding')
  }
  return (
    <main className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-gray-600">Sign in to begin your gentle detox journey. Replace screen autopilot with intention.</p>
        <button onClick={handleMockGoogle} className="mt-6 px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800">Continue with Google (placeholder)</button>
        <p className="mt-3 text-xs text-gray-500">This is a demo. Hook up real Google Identity later.</p>
      </div>
      <div className="rounded-2xl border border-black/5 p-6 bg-gradient-to-br from-orange-50 to-rose-50">
        <div className="font-medium">What happens next?</div>
        <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
          <li>Answer 6 quick questions</li>
          <li>Get a personalized 7, 14, or 21-day challenge</li>
          <li>Track your progress with calming visuals</li>
        </ul>
      </div>
    </main>
  )
}

// Onboarding questionnaire
const Onboarding = () => {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({ q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3 })
  const handleChange = (k, v) => setAnswers((s) => ({ ...s, [k]: Number(v) }))
  const submit = () => {
    const score = Object.values(answers).reduce((a, b) => a + b, 0)
    let target = 7
    if (score >= 24) target = 21
    else if (score >= 15) target = 14
    const progress = { days: 0, target, daily: Array(7).fill(0) }
    setStored('progress', progress)
    navigate('/dashboard')
  }
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold tracking-tight">A few quick questions</h2>
      <p className="mt-2 text-gray-600">Rate each from 1 (rarely) to 5 (very often).</p>
      <div className="mt-8 space-y-6">
        {[
          'I pick up my phone without a clear reason.',
          'Notifications frequently pull me off task.',
          'I scroll in bed or late at night.',
          'I often multitask across devices.',
          'I feel restless without my phone nearby.',
          'I want more calm and focus day to day.'
        ].map((q, i) => (
          <div key={i} className="p-5 rounded-xl border border-black/5 bg-white/70">
            <div className="font-medium">{q}</div>
            <input type="range" min="1" max="5" value={answers[`q${i + 1}`]} onChange={(e) => handleChange(`q${i + 1}`, e.target.value)} className="w-full mt-3 accent-orange-500" />
            <div className="text-xs text-gray-500">{answers[`q${i + 1}`]}</div>
          </div>
        ))}
      </div>
      <button onClick={submit} className="mt-8 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white">Assign my challenge</button>
    </main>
  )
}

const Notifications = () => {
  const quotes = [
    'Small steps, big clarity.',
    'Be where your feet are.',
    'Airplane mode, grounded mind.',
    'Less screen, more scene.'
  ]
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((s) => (s + 1) % quotes.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 border border-black/5">
      <div className="text-xs text-gray-500">Motivation</div>
      <div className="mt-1 text-sm">{quotes[i]}</div>
    </div>
  )
}

const Leaderboard = () => {
  const list = useMemo(() => getStored('leaderboard', []), [])
  const sorted = [...list].sort((a, b) => b.progress - a.progress).slice(0, 5)
  return (
    <div className="p-4 rounded-xl border border-black/5 bg-white/70">
      <div className="font-medium">Leaderboard</div>
      <ul className="mt-3 space-y-2 text-sm">
        {sorted.map((u, idx) => (
          <li key={u.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 text-gray-500">{idx + 1}.</span>
              <span>{u.name}</span>
              <span className="text-xs text-gray-500">{u.days}d</span>
            </div>
            <span className="text-gray-700 font-medium">{u.progress}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Dashboard = () => {
  const [progress, setProgress] = useState(() => getStored('progress', { days: 0, target: 0, daily: [] }))
  useEffect(() => seedData(), [])

  const completeToday = () => {
    const dayIdx = progress.daily.length % 7
    const daily = [...progress.daily]
    daily[dayIdx] = Math.min(100, (daily[dayIdx] || 0) + 20)
    const days = Math.min(progress.target, progress.days + 1)
    const updated = { ...progress, days, daily }
    setProgress(updated)
    setStored('progress', updated)
  }

  const percent = progress.target ? (progress.days / progress.target) * 100 : 0

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Your dashboard</h2>
          <p className="text-gray-600">Challenge: {progress.target || '—'} days</p>
        </div>
        <button onClick={completeToday} className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 text-sm">Mark today complete</button>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-black/5 bg-white/70 flex items-center gap-4">
          <PieChart percent={percent} />
          <div>
            <div className="font-medium">Overall progress</div>
            <div className="text-sm text-gray-600">{progress.days} of {progress.target} days</div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-black/5 bg-white/70 md:col-span-2">
          <div className="font-medium mb-3">Daily progress</div>
          <BarChart data={progress.daily.length ? progress.daily : [20, 40, 60, 40, 80, 20, 0]} />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Leaderboard />
        <Notifications />
        <div className="p-4 rounded-xl border border-black/5 bg-white/70">
          <div className="font-medium">Tips</div>
          <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Schedule device-free meals.</li>
            <li>Batch notifications to specific times.</li>
            <li>Place the phone outside the bedroom.</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

const Blog = () => {
  const posts = useMemo(() => getStored('blogPosts', []), [])
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold tracking-tight">Mindful tech, simply told</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.id} className="p-5 rounded-2xl border border-black/5 bg-white/70">
            <div className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</div>
            <h3 className="mt-1 font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{p.excerpt}</p>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-orange-600">Read more</summary>
              <p className="mt-2 text-gray-700">{p.content}</p>
              <div className="mt-2 text-xs text-gray-500">By {p.author}</div>
            </details>
          </article>
        ))}
      </div>
    </main>
  )
}

const Challenges = () => {
  const progress = getStored('progress', { target: 0 })
  const list = [
    { days: 7, tips: ['No phone at meals', '15-min evening wind-down', 'Mute non-urgent apps'] },
    { days: 14, tips: ['Batch notifications 3x/day', 'Device-free bedroom', 'Weekend morning offline'] },
    { days: 21, tips: ['App limits for socials', 'Daily 30-min deep work', 'One day/week mini detox'] }
  ]
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold tracking-tight">Challenges</h2>
      <p className="mt-2 text-gray-600">Pick your pace. Your current plan: {progress.target || '—'} days.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {list.map((c) => (
          <div key={c.days} className={`p-5 rounded-2xl border ${progress.target === c.days ? 'border-orange-300 bg-orange-50' : 'border-black/5 bg-white/70'}`}>
            <div className="font-semibold">{c.days}-Day Detox</div>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
              {c.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}

const RequireAuth = ({ children, user }) => {
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Shell() {
  const { user, login, logout } = useAuth()
  useEffect(() => seedData(), [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 text-gray-900">
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/onboarding" element={<RequireAuth user={user}><Onboarding /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth user={user}><Dashboard /></RequireAuth>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/challenges" element={<Challenges />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  // App is the router shell here to comply with existing entry
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
