import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/personagens', label: 'Personagens' },
  { to: '/estacoes', label: 'Estacoes' },
  { to: '/centro-comunitario', label: 'Centro Comunitario' },
  { to: '/curiosidades', label: 'Curiosidades' },
  { to: '/wiki', label: '🔍 Wiki' },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="bg-stardew-green-dark border-b-4 border-stardew-wood sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-3xl">🌾</span>
          <h1 className="font-display text-stardew-gold text-sm md:text-base m-0">
            Stardew Fan Hub
          </h1>
        </Link>

        <nav className="flex gap-1 sm:gap-2 flex-wrap justify-center">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded font-display text-[10px] transition-all duration-200 no-underline
                ${pathname === to
                  ? 'bg-stardew-gold text-stardew-wood'
                  : 'text-stardew-cream hover:bg-white/20'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
