import { Link } from 'react-router-dom'

const features = [
  {
    emoji: '👥',
    title: 'Personagens',
    description: 'Conheca todos os NPCs, seus gostos, aniversarios e onde encontra-los.',
    to: '/personagens',
  },
  {
    emoji: '🗓️',
    title: 'Guia de Estacoes',
    description: 'Plantacoes, peixes, foraging e festivais de cada estacao.',
    to: '/estacoes',
  },
  {
    emoji: '🏠',
    title: 'Centro Comunitario',
    description: 'Todos os bundles, itens necessarios e onde encontrar cada um.',
    to: '/centro-comunitario',
  },
  {
    emoji: '🔮',
    title: 'Curiosidades',
    description: 'Easter eggs, dicas de veterano e segredos escondidos no vale.',
    to: '/curiosidades',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-stardew-sky to-stardew-green py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-6xl mb-6">🌾</p>
          <h1 className="font-display text-stardew-cream text-xl md:text-3xl mb-4 drop-shadow-lg">
            Stardew Fan Hub
          </h1>
          <p className="text-stardew-cream/90 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Seu cantinho de fa de Stardew Valley. Dicas, curiosidades,
            guias e tudo sobre o vale que a gente tanto ama.
          </p>
          <Link to="/curiosidades" className="stardew-btn">
            Explorar Curiosidades
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="section-title">O que voce encontra aqui</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <Link key={f.to} to={f.to} className="stardew-card text-center no-underline group">
              <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform">
                {f.emoji}
              </span>
              <h3 className="font-display text-stardew-wood text-xs mb-3">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="bg-stardew-green/10 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-xl italic text-stardew-wood mb-4">
            "Voce herdou a velha fazenda do seu avo em Stardew Valley.
            Armado com ferramentas de segunda mao e algumas moedas,
            voce parte para comecar sua nova vida..."
          </blockquote>
          <p className="text-sm text-gray-500">— Introducao do jogo</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="section-title">Stardew Valley em numeros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: '12', label: 'Personagens casaveis', emoji: '💕' },
            { number: '4', label: 'Estacoes do ano', emoji: '🌈' },
            { number: '120', label: 'Andares nas minas', emoji: '⛏️' },
            { number: '30M+', label: 'Copias vendidas', emoji: '🎮' },
          ].map(stat => (
            <div key={stat.label} className="stardew-card text-center">
              <span className="text-3xl block mb-2">{stat.emoji}</span>
              <p className="font-display text-stardew-green text-lg">{stat.number}</p>
              <p className="text-gray-600 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
