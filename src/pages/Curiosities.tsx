import { useState } from 'react'
import { curiosities, type Curiosity } from '../data/curiosities'

const categoryInfo = {
  'easter-egg': { label: 'Easter Egg', emoji: '🥚', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  'dica': { label: 'Dica', emoji: '💡', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  'lore': { label: 'Lore', emoji: '📜', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  'mecanica': { label: 'Mecanica', emoji: '⚙️', color: 'bg-green-100 text-green-700 border-green-300' },
} as const

function CuriosityCard({ item }: { item: Curiosity }) {
  const cat = categoryInfo[item.category]

  return (
    <div className="stardew-card">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0">{item.emoji}</span>
        <div>
          <span className={`inline-block text-[9px] font-display px-2 py-0.5 rounded border mb-2 ${cat.color}`}>
            {cat.emoji} {cat.label}
          </span>
          <h3 className="font-display text-stardew-wood text-[11px] leading-relaxed">
            {item.title}
          </h3>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
    </div>
  )
}

type CategoryFilter = Curiosity['category'] | 'all'

export default function Curiosities() {
  const [filter, setFilter] = useState<CategoryFilter>('all')

  const filtered = filter === 'all'
    ? curiosities
    : curiosities.filter(c => c.category === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="section-title">🔮 Curiosidades & Dicas</h1>
      <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
        Segredos, easter eggs, dicas de veterano e fatos curiosos
        sobre Stardew Valley que todo fa precisa saber!
      </p>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded font-display text-[10px] transition-all border-2
            ${filter === 'all'
              ? 'bg-stardew-green text-white border-stardew-green-dark'
              : 'bg-white text-stardew-wood border-stardew-brown-light/30 hover:border-stardew-green'
            }`}
        >
          Todos
        </button>
        {(Object.entries(categoryInfo) as [Curiosity['category'], typeof categoryInfo[keyof typeof categoryInfo]][]).map(
          ([key, { label, emoji }]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded font-display text-[10px] transition-all border-2
                ${filter === key
                  ? 'bg-stardew-green text-white border-stardew-green-dark'
                  : 'bg-white text-stardew-wood border-stardew-brown-light/30 hover:border-stardew-green'
                }`}
            >
              {emoji} {label}
            </button>
          ),
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <CuriosityCard key={i} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 font-display text-xs mt-12">
          Nenhuma curiosidade encontrada nessa categoria...
        </p>
      )}
    </div>
  )
}
