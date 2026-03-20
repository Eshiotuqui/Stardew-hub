import { useState } from 'react'
import { seasons, type Season } from '../data/seasons'

function SeasonDetail({ season }: { season: Season }) {
  return (
    <div className={`rounded-lg border-2 p-6 md:p-8 ${season.bgColor}`}>
      <div className="text-center mb-8">
        <span className="text-5xl block mb-3">{season.emoji}</span>
        <h2 className={`font-display text-lg ${season.color}`}>{season.name}</h2>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto">{season.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Crops */}
        <div className="bg-white/60 rounded-lg p-5 pixel-border">
          <h3 className="font-display text-[11px] text-stardew-green mb-3">🌱 Plantacoes</h3>
          <ul className="space-y-1">
            {season.crops.map(crop => (
              <li key={crop} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-stardew-green mt-0.5">•</span>
                {crop}
              </li>
            ))}
          </ul>
        </div>

        {/* Fish */}
        <div className="bg-white/60 rounded-lg p-5 pixel-border">
          <h3 className="font-display text-[11px] text-stardew-sky-dark mb-3">🎣 Peixes</h3>
          <ul className="space-y-1">
            {season.fish.map(fish => (
              <li key={fish} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-stardew-sky-dark mt-0.5">•</span>
                {fish}
              </li>
            ))}
          </ul>
        </div>

        {/* Foraging */}
        <div className="bg-white/60 rounded-lg p-5 pixel-border">
          <h3 className="font-display text-[11px] text-stardew-brown mb-3">🍄 Foraging</h3>
          <div className="flex flex-wrap gap-2">
            {season.foraging.map(item => (
              <span key={item} className="text-xs bg-stardew-earth/30 px-2 py-1 rounded">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Festivals */}
        <div className="bg-white/60 rounded-lg p-5 pixel-border">
          <h3 className="font-display text-[11px] text-stardew-gold mb-3">🎉 Festivais</h3>
          <div className="space-y-3">
            {season.festivals.map(fest => (
              <div key={fest.name}>
                <p className="text-sm font-semibold text-stardew-wood">
                  {fest.name} <span className="font-normal text-gray-500">(Dia {fest.day})</span>
                </p>
                <p className="text-xs text-gray-600">{fest.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-stardew-gold/10 rounded-lg p-5 border-2 border-dashed border-stardew-gold/30">
        <h3 className="font-display text-[11px] text-stardew-wood mb-3">💡 Dicas da estacao</h3>
        <ul className="space-y-2">
          {season.tips.map(tip => (
            <li key={tip} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-stardew-gold mt-0.5">★</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Seasons() {
  const [active, setActive] = useState(0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title">🗓️ Guia de Estacoes</h1>
      <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
        Cada estacao traz novas oportunidades! Veja o que plantar, pescar,
        coletar e quais festivais participar.
      </p>

      {/* Season Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {seasons.map((season, i) => (
          <button
            key={season.name}
            onClick={() => setActive(i)}
            className={`px-4 py-3 rounded font-display text-[10px] transition-all border-2
              ${active === i
                ? 'bg-stardew-green text-white border-stardew-green-dark scale-105'
                : 'bg-white text-stardew-wood border-stardew-brown-light/30 hover:border-stardew-green'
              }`}
          >
            {season.emoji} {season.name}
          </button>
        ))}
      </div>

      <SeasonDetail season={seasons[active]} />
    </div>
  )
}
