import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/setup', label: 'Setup' },
  { to: '/sim', label: 'Sim' },
  { to: '/debrief', label: 'Debrief' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100">
      <header className="border-b border-white/10 bg-[#07111f]/90">
        <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            VFR Trainer
          </span>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
