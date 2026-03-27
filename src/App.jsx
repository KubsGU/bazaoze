import { Suspense, lazy } from 'react'
import { Menu } from 'lucide-react'
import { NavLink, Route, Routes } from 'react-router-dom'

const SinglePage = lazy(() => import('./pages/SinglePage'))

const navItems = [
  { label: 'Home', href: '/home' },
  { label: 'Uslugi', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Kontakt', href: '/contact' },
]

function App() {
  return (
    <main className="bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <NavLink to="/" className="cursor-pointer text-sm tracking-[0.35em] text-emerald-300/90">
            BAZA OZE
          </NavLink>
          <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `cursor-pointer transition hover:text-white ${isActive ? 'text-white' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/home" className="cursor-pointer md:hidden">
            <Menu className="size-5 text-zinc-200" />
          </NavLink>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center px-6 md:px-10">
            <div className="h-10 w-64 animate-pulse rounded-xl bg-white/10" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<SinglePage />} />
          <Route path="/:section" element={<SinglePage />} />
          <Route path="*" element={<SinglePage />} />
        </Routes>
      </Suspense>
    </main>
  )
}

export default App
