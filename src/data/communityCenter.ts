export interface BundleItem {
  name: string
  source: string
  season?: string
}

export interface Bundle {
  name: string
  emoji: string
  items: BundleItem[]
  reward: string
}

export interface Room {
  name: string
  emoji: string
  color: string
  bgColor: string
  description: string
  bundles: Bundle[]
  completionReward: string
}

export const rooms: Room[] = [
  {
    name: 'Sala de Artesanato',
    emoji: '🧺',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-300',
    description: 'Focada em colheitas e produtos artesanais. Completar desbloqueia a ponte para a area de mineracao.',
    completionReward: 'Ponte para a Pedreira (Quarry) reparada',
    bundles: [
      {
        name: 'Bundle de Primavera',
        emoji: '🌸',
        items: [
          { name: 'Rabanete Selvagem', source: 'Foraging na Primavera', season: 'Primavera' },
          { name: 'Narciso', source: 'Foraging na Primavera', season: 'Primavera' },
          { name: 'Alho-Porro', source: 'Foraging na Primavera', season: 'Primavera' },
          { name: 'Dente-de-Leao', source: 'Foraging na Primavera', season: 'Primavera' },
        ],
        reward: '30 Sementes de Primavera',
      },
      {
        name: 'Bundle de Verao',
        emoji: '☀️',
        items: [
          { name: 'Uva', source: 'Foraging no Verao', season: 'Verao' },
          { name: 'Ervilha Doce', source: 'Foraging no Verao', season: 'Verao' },
          { name: 'Fruta Picante', source: 'Foraging no Verao', season: 'Verao' },
        ],
        reward: '30 Sementes de Verao',
      },
      {
        name: 'Bundle de Outono',
        emoji: '🍂',
        items: [
          { name: 'Cogumelo Comum', source: 'Foraging no Outono', season: 'Outono' },
          { name: 'Amora', source: 'Foraging no Outono', season: 'Outono' },
          { name: 'Avela', source: 'Foraging no Outono', season: 'Outono' },
          { name: 'Cogumelo Selvagem', source: 'Foraging no Outono (raro)', season: 'Outono' },
        ],
        reward: '30 Sementes de Outono',
      },
      {
        name: 'Bundle de Inverno',
        emoji: '❄️',
        items: [
          { name: 'Raiz de Inverno', source: 'Foraging no Inverno (cavar)', season: 'Inverno' },
          { name: 'Inhame de Cristal', source: 'Foraging no Inverno (cavar)', season: 'Inverno' },
          { name: 'Crocus de Neve', source: 'Foraging no Inverno', season: 'Inverno' },
          { name: 'Holly', source: 'Foraging no Inverno', season: 'Inverno' },
        ],
        reward: '30 Sementes de Inverno',
      },
      {
        name: 'Bundle de Construcao',
        emoji: '🪵',
        items: [
          { name: '99 Madeira', source: 'Cortar arvores' },
          { name: '99 Pedra', source: 'Quebrar pedras' },
          { name: '10 Madeira de Lei', source: 'Cortar tocos grandes com machado de cobre+' },
        ],
        reward: 'Carrossel (Charcoal Kiln)',
      },
      {
        name: 'Bundle Exotico',
        emoji: '🥥',
        items: [
          { name: 'Coco', source: 'Deserto de Calico / Ilha do Gengibre' },
          { name: 'Prato de Cacto', source: 'Deserto de Calico' },
          { name: 'Cogumelo de Caverna', source: 'Caverna da Fazenda (cogumelos)' },
          { name: 'Cogumelo Vermelho', source: 'Caverna da Fazenda / Minas (andares de cogumelo)' },
          { name: 'Cogumelo Roxo', source: 'Caverna da Fazenda / Minas (andar 81+)' },
          { name: 'Cogumelo Morel', source: 'Floresta Secreta / Fazenda (Primavera)' },
        ],
        reward: '5 Sementes Raras de Outono',
      },
    ],
  },
  {
    name: 'Despensa',
    emoji: '🌾',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-300',
    description: 'Colheitas de todas as estacoes e produtos de qualidade. A sala mais trabalhosa do centro.',
    completionReward: 'Estufa (Greenhouse) reparada',
    bundles: [
      {
        name: 'Bundle de Colheitas de Primavera',
        emoji: '🌱',
        items: [
          { name: 'Parsnip', source: 'Plantar (4 dias)', season: 'Primavera' },
          { name: 'Feijao Verde', source: 'Plantar (10 dias, continuo)', season: 'Primavera' },
          { name: 'Couve-flor', source: 'Plantar (12 dias)', season: 'Primavera' },
          { name: 'Batata', source: 'Plantar (6 dias)', season: 'Primavera' },
        ],
        reward: '20 Fertilizante Rapido',
      },
      {
        name: 'Bundle de Colheitas de Verao',
        emoji: '🌻',
        items: [
          { name: 'Tomate', source: 'Plantar (11 dias, continuo)', season: 'Verao' },
          { name: 'Pimenta', source: 'Plantar (5 dias, continuo)', season: 'Verao' },
          { name: 'Mirtilo', source: 'Plantar (13 dias, continuo)', season: 'Verao' },
          { name: 'Melao', source: 'Plantar (12 dias)', season: 'Verao' },
        ],
        reward: '1 Aspersor de Qualidade',
      },
      {
        name: 'Bundle de Colheitas de Outono',
        emoji: '🎃',
        items: [
          { name: 'Milho', source: 'Plantar (14 dias, Verao/Outono)', season: 'Verao/Outono' },
          { name: 'Berinjela', source: 'Plantar (5 dias, continuo)', season: 'Outono' },
          { name: 'Abobora', source: 'Plantar (13 dias)', season: 'Outono' },
          { name: 'Inhame', source: 'Plantar (10 dias)', season: 'Outono' },
        ],
        reward: '1 Preserva (Preserve Jar)',
      },
      {
        name: 'Bundle de Qualidade',
        emoji: '⭐',
        items: [
          { name: 'Parsnip Ouro', source: 'Plantar com fertilizante, farming alto', season: 'Primavera' },
          { name: 'Melao Ouro', source: 'Plantar com fertilizante, farming alto', season: 'Verao' },
          { name: 'Abobora Ouro', source: 'Plantar com fertilizante, farming alto', season: 'Outono' },
          { name: 'Milho Ouro', source: 'Plantar com fertilizante, farming alto', season: 'Verao/Outono' },
        ],
        reward: '1 Aspersor de Iridio',
      },
      {
        name: 'Bundle de Animais',
        emoji: '🐄',
        items: [
          { name: 'Leite Grande', source: 'Vacas com amizade alta' },
          { name: 'Ovo Grande (marrom)', source: 'Galinhas marrons com amizade alta' },
          { name: 'Ovo Grande (branco)', source: 'Galinhas brancas com amizade alta' },
          { name: 'Queijo de Cabra Grande', source: 'Cabra com amizade alta + Prensa de Queijo' },
          { name: 'La', source: 'Ovelhas (tosquiar)' },
          { name: 'Pato com Ovo', source: 'Patos com amizade alta' },
        ],
        reward: '1 Prensa de Queijo',
      },
      {
        name: 'Bundle de Artesao',
        emoji: '🍯',
        items: [
          { name: 'Oleo de Trufa', source: 'Trufa + Prensa de Oleo' },
          { name: 'Pano', source: 'La + Tear (Loom)' },
          { name: 'Queijo de Cabra', source: 'Leite de Cabra + Prensa de Queijo' },
          { name: 'Queijo', source: 'Leite + Prensa de Queijo' },
          { name: 'Mel', source: 'Colmeia (Bee House)' },
          { name: 'Geleia ou Picles', source: 'Fruta/Vegetal + Preserva (Jar)' },
          { name: 'Suco ou Vinho', source: 'Vegetal/Fruta + Barril (Keg)' },
        ],
        reward: '1 Barril (Keg)',
      },
    ],
  },
  {
    name: 'Tanque de Peixes',
    emoji: '🐟',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-300',
    description: 'Peixes de todas as estacoes e locais. Paciencia e habilidade sao essenciais!',
    completionReward: 'Pedras brilhantes removidas (acesso ao esgoto)',
    bundles: [
      {
        name: 'Bundle de Peixes de Rio',
        emoji: '🏞️',
        items: [
          { name: 'Sunfish', source: 'Rio, dia, Primavera/Verao', season: 'Primavera/Verao' },
          { name: 'Peixe-gato', source: 'Rio, chuva, Primavera/Outono', season: 'Primavera/Outono' },
          { name: 'Shad', source: 'Rio, chuva, todas exceto Inverno', season: 'Primavera/Verao/Outono' },
          { name: 'Tiger Trout', source: 'Rio, todas estacoes', season: 'Todas' },
        ],
        reward: '30 Iscas',
      },
      {
        name: 'Bundle de Peixes de Lago',
        emoji: '🏔️',
        items: [
          { name: 'Largemouth Bass', source: 'Lago da montanha, todas', season: 'Todas' },
          { name: 'Carp', source: 'Lago da montanha/Esgoto, todas', season: 'Todas' },
          { name: 'Bullhead', source: 'Lago da montanha, todas', season: 'Todas' },
          { name: 'Esturjao', source: 'Lago da montanha, Verao/Inverno', season: 'Verao/Inverno' },
        ],
        reward: '1 Recicladora',
      },
      {
        name: 'Bundle de Peixes de Oceano',
        emoji: '🌊',
        items: [
          { name: 'Sardinha', source: 'Oceano, dia, Primavera/Outono/Inverno', season: 'Primavera/Outono/Inverno' },
          { name: 'Tuna', source: 'Oceano, dia, Verao/Inverno', season: 'Verao/Inverno' },
          { name: 'Red Snapper', source: 'Oceano, chuva, Verao/Outono', season: 'Verao/Outono' },
          { name: 'Tilapia', source: 'Oceano, dia, Verao/Outono', season: 'Verao/Outono' },
        ],
        reward: '5 Warp Totem: Praia',
      },
      {
        name: 'Bundle de Pesca Noturna',
        emoji: '🌙',
        items: [
          { name: 'Walleye', source: 'Rio, noite, chuva, Outono', season: 'Outono' },
          { name: 'Bream', source: 'Rio, noite, todas', season: 'Todas' },
          { name: 'Enguia', source: 'Oceano, noite, chuva, Primavera/Outono', season: 'Primavera/Outono' },
        ],
        reward: '1 Glow Ring',
      },
      {
        name: 'Bundle Especial de Pesca',
        emoji: '🎣',
        items: [
          { name: 'Pufferfish', source: 'Oceano, dia sol, Verao (12h-16h)', season: 'Verao' },
          { name: 'Ghostfish', source: 'Minas (andares 20-60)', season: 'Todas' },
          { name: 'Sandfish', source: 'Deserto', season: 'Todas' },
          { name: 'Woodskip', source: 'Floresta Secreta', season: 'Todas' },
        ],
        reward: '1 Prato de Marinheiro (buff pesca)',
      },
      {
        name: 'Bundle de Caranguejo',
        emoji: '🦀',
        items: [
          { name: 'Lagostim', source: 'Armadilha de caranguejo: agua doce', season: 'Todas' },
          { name: 'Caracol', source: 'Armadilha de caranguejo: agua doce', season: 'Todas' },
          { name: 'Pervinca', source: 'Armadilha de caranguejo: agua doce', season: 'Todas' },
          { name: 'Lagosta', source: 'Armadilha de caranguejo: oceano', season: 'Todas' },
          { name: 'Caranguejo', source: 'Armadilha de caranguejo: oceano', season: 'Todas' },
        ],
        reward: '3 Armadilhas de Caranguejo',
      },
    ],
  },
  {
    name: 'Sala do Caldeirão',
    emoji: '🧪',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-300',
    description: 'Minerios, gemas e itens de aventura. Explore as minas para completar!',
    completionReward: 'Minecarts reparados (transporte rapido)',
    bundles: [
      {
        name: 'Bundle de Ferreiro',
        emoji: '⚒️',
        items: [
          { name: 'Barra de Cobre', source: 'Fundir minerio de cobre (Minas 1-39)' },
          { name: 'Barra de Ferro', source: 'Fundir minerio de ferro (Minas 40-79)' },
          { name: 'Barra de Ouro', source: 'Fundir minerio de ouro (Minas 80+)' },
        ],
        reward: '1 Fornalha',
      },
      {
        name: 'Bundle de Geologo',
        emoji: '💎',
        items: [
          { name: 'Quartzo', source: 'Foraging nas minas' },
          { name: 'Quartzo de Fogo', source: 'Foraging nas minas (andar 80+)' },
          { name: 'Terra Congelada', source: 'Foraging nas minas (andar 40-79)' },
          { name: 'Lagrima Congelada', source: 'Foraging nas minas (andar 40-79)' },
        ],
        reward: '5 Omni Geodos',
      },
      {
        name: 'Bundle do Aventureiro',
        emoji: '⚔️',
        items: [
          { name: '99 Slime', source: 'Drop de Slimes (minas)' },
          { name: '10 Morcego Wing', source: 'Drop de morcegos (minas)' },
          { name: '1 Essencia Solar', source: 'Drop de fantasmas/monstros (minas 40+)' },
          { name: '1 Essencia Sombria', source: 'Drop de monstros sombrios (minas 80+)' },
        ],
        reward: '1 Small Magnet Ring',
      },
    ],
  },
  {
    name: 'Quadro de Avisos',
    emoji: '📋',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-300',
    description: 'Itens variados de diferentes fontes. O bundle mais diverso do centro.',
    completionReward: 'Onibus para o Deserto de Calico reparado',
    bundles: [
      {
        name: 'Bundle do Chef',
        emoji: '👨‍🍳',
        items: [
          { name: 'Maple Syrup', source: 'Maple Tapper em arvore de Maple' },
          { name: 'Fiddlehead Fern', source: 'Floresta Secreta, Verao', season: 'Verao' },
          { name: 'Trufa', source: 'Porcos desenterram (ao ar livre)' },
          { name: 'Pavoa', source: 'Pescar no lago da Floresta (Verao)', season: 'Verao' },
          { name: 'Cogumelo Morel', source: 'Floresta Secreta, Primavera', season: 'Primavera' },
          { name: 'Maca Vermelha', source: 'Arvore frutífera (Outono)', season: 'Outono' },
        ],
        reward: '3 Pink Cake',
      },
      {
        name: 'Bundle de Tintura',
        emoji: '🎨',
        items: [
          { name: 'Repolho Vermelho', source: 'Plantar (9 dias, Verao)', season: 'Verao' },
          { name: 'Cogumelo da Caverna (Morel)', source: 'Caverna da Fazenda' },
          { name: 'Girassol', source: 'Plantar (8 dias, Verao/Outono)', season: 'Verao/Outono' },
          { name: 'Pato com Pena', source: 'Patos com amizade alta' },
          { name: 'Aquamarine', source: 'Geodos / Minas' },
          { name: 'Maca Vermelha', source: 'Arvore frutífera (Outono)', season: 'Outono' },
        ],
        reward: 'Seed Maker',
      },
      {
        name: 'Bundle de Forragem',
        emoji: '🌿',
        items: [
          { name: 'Cogumelo Roxo', source: 'Caverna da Fazenda / Minas (81+)' },
          { name: 'Nautilius Shell', source: 'Praia, Inverno', season: 'Inverno' },
          { name: 'Framboesa Doce', source: 'Floresta Secreta, Primavera', season: 'Primavera' },
          { name: 'Coco', source: 'Deserto de Calico' },
          { name: 'Prato de Cacto', source: 'Deserto de Calico' },
        ],
        reward: '1 Autumn\'s Bounty (buff)',
      },
      {
        name: 'Bundle de Encantador',
        emoji: '✨',
        items: [
          { name: 'Vinho', source: 'Fruta + Barril (Keg)' },
          { name: 'Queijo de Cabra de Ouro', source: 'Leite de Cabra Grande + Prensa de Queijo' },
          { name: 'La', source: 'Ovelha (tosquiar)' },
          { name: 'Pato com Ovo', source: 'Patos com amizade alta' },
          { name: 'Geleia de Maca', source: 'Maca + Preserva (Jar)' },
        ],
        reward: '5 Bomb',
      },
      {
        name: 'Bundle do Campo',
        emoji: '🌻',
        items: [
          { name: '10 Feno', source: 'Cortar grama com Foice / Marnie\'s Ranch' },
          { name: '10 Fibra de Maca', source: 'Tapper em arvore de Maca' },
          { name: '3 Resina', source: 'Tapper em arvore de Carvalho' },
          { name: '1 Mel', source: 'Colmeia (Bee House)' },
        ],
        reward: '1 Junimo Hut (blueprint)',
      },
    ],
  },
  {
    name: 'Cofre',
    emoji: '💰',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-300',
    description: 'Bundles que custam ouro puro. Simples mas caro!',
    completionReward: 'Acesso a area do onibus e Deserto complementar',
    bundles: [
      {
        name: 'Bundle de 2.500g',
        emoji: '💵',
        items: [{ name: '2.500 ouro', source: 'Vender itens / Atividades lucrativas' }],
        reward: '3 Chocolate Cake',
      },
      {
        name: 'Bundle de 5.000g',
        emoji: '💵',
        items: [{ name: '5.000 ouro', source: 'Vender itens / Atividades lucrativas' }],
        reward: '30 Quality Fertilizer',
      },
      {
        name: 'Bundle de 10.000g',
        emoji: '💰',
        items: [{ name: '10.000 ouro', source: 'Vender itens / Atividades lucrativas' }],
        reward: 'Lightning Rod',
      },
      {
        name: 'Bundle de 25.000g',
        emoji: '💰',
        items: [{ name: '25.000 ouro', source: 'Vender itens / Atividades lucrativas' }],
        reward: 'Crystalarium',
      },
    ],
  },
]
