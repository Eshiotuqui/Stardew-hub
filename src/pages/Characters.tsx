import { useState } from 'react'
import { characters, type Character } from '../data/characters'

function CharacterCard({ char }: { char: Character }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="stardew-card cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{char.emoji}</span>
        <div>
          <h3 className="font-display text-stardew-wood text-xs">
            {char.name}
          </h3>
          <span className="text-[10px] text-gray-500">
            {char.marriageable ? '💍 Casavel' : '🤝 Amigo'}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{char.description}</p>

      {open && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-stardew-brown-light/40 space-y-3 animate-fadeIn">
          <div>
            <p className="font-display text-[9px] text-stardew-green mb-1">🎂 Aniversario</p>
            <p className="text-sm">{char.birthday}</p>
          </div>
          <div>
            <p className="font-display text-[9px] text-stardew-green mb-1">📍 Localizacao</p>
            <p className="text-sm">{char.location}</p>
          </div>
          <div>
            <p className="font-display text-[9px] text-stardew-green mb-1">❤️ Presentes favoritos</p>
            <div className="flex flex-wrap gap-1">
              {char.likes.map(like => (
                <span
                  key={like}
                  className="text-xs bg-stardew-green/10 text-stardew-green-dark px-2 py-1 rounded"
                >
                  {like}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        {open ? '▲ Clique para fechar' : '▼ Clique para ver mais'}
      </p>
    </div>
  )
}

export default function Characters() {
  const [filter, setFilter] = useState<'all' | 'marriageable' | 'friend'>('all')

  const filtered = characters.filter(c => {
    if (filter === 'marriageable') return c.marriageable
    if (filter === 'friend') return !c.marriageable
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="section-title">👥 Personagens</h1>
      <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
        Conheca os moradores de Stardew Valley! Clique em cada personagem
        para ver detalhes como aniversario, localizacao e presentes favoritos.
      </p>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-8">
        {([
          ['all', 'Todos'],
          ['marriageable', '💍 Casaveis'],
          ['friend', '🤝 Amigos'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded font-display text-[10px] transition-all border-2
              ${filter === value
                ? 'bg-stardew-green text-white border-stardew-green-dark'
                : 'bg-white text-stardew-wood border-stardew-brown-light/30 hover:border-stardew-green'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(char => (
          <CharacterCard key={char.name} char={char} />
        ))}
      </div>
    </div>
  )
}
