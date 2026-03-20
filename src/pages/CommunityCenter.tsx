import { useState } from 'react'
import { rooms, type Room, type Bundle } from '../data/communityCenter'

function BundleCard({ bundle }: { bundle: Bundle }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="bg-white/70 rounded-lg pixel-border p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-display text-[10px] text-stardew-wood">
          {bundle.emoji} {bundle.name}
        </h4>
        <span className="text-xs text-gray-400">{open ? '▲' : '▼'}</span>
      </div>

      <p className="text-[10px] text-gray-500 mb-1">
        {bundle.items.length} {bundle.items.length === 1 ? 'item' : 'itens'} necessarios
      </p>

      {open && (
        <div className="mt-3 pt-3 border-t border-dashed border-stardew-brown-light/30 space-y-2">
          {bundle.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-stardew-green mt-0.5 flex-shrink-0">•</span>
              <div>
                <span className="font-semibold text-gray-700">{item.name}</span>
                <p className="text-xs text-gray-500">{item.source}</p>
                {item.season && (
                  <span className="text-[10px] bg-stardew-sky/20 text-stardew-sky-dark px-1.5 py-0.5 rounded">
                    {item.season}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="mt-3 pt-2 border-t border-stardew-gold/20">
            <p className="text-[10px] font-display text-stardew-gold">
              🎁 Recompensa: {bundle.reward}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function RoomSection({ room }: { room: Room }) {
  return (
    <div className={`rounded-lg border-2 p-6 ${room.bgColor}`}>
      <div className="text-center mb-6">
        <span className="text-4xl block mb-2">{room.emoji}</span>
        <h2 className={`font-display text-sm ${room.color}`}>{room.name}</h2>
        <p className="text-gray-600 text-sm mt-2 max-w-lg mx-auto">{room.description}</p>
        <div className="mt-3 inline-block bg-stardew-gold/15 px-3 py-1.5 rounded-lg">
          <p className="text-[10px] font-display text-stardew-wood">
            🏆 {room.completionReward}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {room.bundles.map(bundle => (
          <BundleCard key={bundle.name} bundle={bundle} />
        ))}
      </div>
    </div>
  )
}

export default function CommunityCenter() {
  const [activeRoom, setActiveRoom] = useState(0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title">🏠 Centro Comunitario</h1>
      <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
        O Centro Comunitario e o coracao de Pelican Town! Complete os bundles
        dos Junimos para restaurar cada sala e desbloquear recompensas incriveis.
      </p>
      <p className="text-center text-xs text-gray-400 mb-8">
        Clique em cada bundle para ver os itens necessarios e onde encontra-los.
      </p>

      {/* Room Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {rooms.map((room, i) => (
          <button
            key={room.name}
            onClick={() => setActiveRoom(i)}
            className={`px-3 py-2 rounded font-display text-[9px] transition-all border-2
              ${activeRoom === i
                ? 'bg-stardew-green text-white border-stardew-green-dark scale-105'
                : 'bg-white text-stardew-wood border-stardew-brown-light/30 hover:border-stardew-green'
              }`}
          >
            {room.emoji} {room.name}
          </button>
        ))}
      </div>

      <RoomSection room={rooms[activeRoom]} />

      {/* Tips */}
      <div className="mt-10 bg-stardew-gold/10 rounded-lg p-6 border-2 border-dashed border-stardew-gold/30">
        <h3 className="font-display text-[11px] text-stardew-wood mb-4">💡 Dicas para o Centro Comunitario</h3>
        <ul className="space-y-2">
          {[
            'Guarde pelo menos 1 de cada item que voce encontrar — pode ser necessario para um bundle!',
            'O Cofre exige 42.500g no total. Foque nele quando estiver lucrando bem.',
            'Itens de qualidade ouro funcionam em qualquer bundle (exceto o Bundle de Qualidade que exige ouro).',
            'A Estufa (recompensa da Despensa) e a melhor recompensa do jogo — plante Ancient Fruit la!',
            'Se optar pelo JojaMart, nao tera acesso aos bundles. Escolha sabiamente!',
            'Use o Wiki ou este guia para planejar quais itens sao exclusivos de estacao — nao perca!',
          ].map(tip => (
            <li key={tip} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-stardew-gold mt-0.5 flex-shrink-0">★</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
