export interface Season {
  name: string
  emoji: string
  color: string
  bgColor: string
  description: string
  crops: string[]
  foraging: string[]
  fish: string[]
  festivals: { name: string; day: number; description: string }[]
  tips: string[]
}

export const seasons: Season[] = [
  {
    name: 'Primavera',
    emoji: '🌸',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-300',
    description: 'A estacao do recomeco! Perfeita para plantar suas primeiras sementes e conhecer os moradores do vale.',
    crops: ['Parsnip (4 dias)', 'Batata (6 dias)', 'Couve-flor (12 dias)', 'Feijao Verde (10 dias, volta a produzir)', 'Morango (8 dias, volta a produzir)'],
    foraging: ['Narciso', 'Dente-de-Leao', 'Alho-Porro', 'Cebola da Primavera'],
    fish: ['Enguia', 'Peixe-gato', 'Shad', 'Peixe Lendario (Primavera)'],
    festivals: [
      { name: 'Festival do Ovo', day: 13, description: 'Caca aos ovos! Encontre mais ovos que Abigail para ganhar um chapeu de palha.' },
      { name: 'Danca das Flores', day: 24, description: 'Convide alguem para dancar. Precisa de 4 coracoes para ser aceito.' },
    ],
    tips: [
      'Plante Parsnips logo no dia 1 — eles crescem rapido e dao XP de farming',
      'Guarde dinheiro para comprar sementes de Morango no Festival do Ovo (dia 13)',
      'Conserte a ponte na praia para acessar area de foraging extra',
    ],
  },
  {
    name: 'Verao',
    emoji: '☀️',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-300',
    description: 'Sol forte e colheitas valiosas! A estacao mais lucrativa para agricultura e uma otima epoca para explorar.',
    crops: ['Melao (12 dias)', 'Mirtilo (13 dias, volta a produzir)', 'Lupulo (11 dias, volta a produzir)', 'Tomate (11 dias, volta a produzir)', 'Pimenta (5 dias, volta a produzir)'],
    foraging: ['Uva', 'Ervilha Doce', 'Fruta Picante'],
    fish: ['Peixe Arco-iris', 'Esturjao', 'Super Pepino', 'Octopus'],
    festivals: [
      { name: 'Luau', day: 11, description: 'Contribua com um ingrediente para a sopa comunitaria. Itens de qualidade ouro impressionam o governador!' },
      { name: 'Danca da Agua-Viva', day: 28, description: 'Danca noturna na praia com lindas aguas-vivas brilhantes.' },
    ],
    tips: [
      'Mirtilos sao a melhor relacao custo-beneficio para iniciantes',
      'Lupulo pode ser transformado em Pale Ale (muito lucrativo com Kegs)',
      'E a melhor estacao para pescar — muitos peixes exclusivos',
    ],
  },
  {
    name: 'Outono',
    emoji: '🍂',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-300',
    description: 'Colheitas incriveis e paisagens douradas. Muitos consideram a melhor estacao para fazer dinheiro.',
    crops: ['Abobora (13 dias)', 'Cranberry (7 dias, volta a produzir)', 'Uva (10 dias, volta a produzir)', 'Berinjela (5 dias, volta a produzir)', 'Alcachofra (8 dias)'],
    foraging: ['Cogumelo Comum', 'Cogumelo Roxo', 'Avela', 'Amora'],
    fish: ['Salmao', 'Enguia', 'Walleye', 'Peixe Lendario (Outono)'],
    festivals: [
      { name: 'Feira de Stardew Valley', day: 16, description: 'Exiba seus melhores itens! Ganhe fichas para trocar por premios exclusivos.' },
      { name: "Espiritos'Eve", day: 27, description: 'Labirinto assustador com surpresas. Encontre a Rarecrow dourada!' },
    ],
    tips: [
      'Cranberries sao otimas para renda e para completar bundles',
      'Aboboras gigantes podem aparecer em plantacoes 3x3!',
      'Colete cogumelos — alguns valem muito e sao usados em receitas importantes',
    ],
  },
  {
    name: 'Inverno',
    emoji: '❄️',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-300',
    description: 'Sem plantacoes ao ar livre (exceto Winter Seeds), mas perfeita para mineracao, pesca e socializacao.',
    crops: ['Winter Seeds (foraging seeds)', 'Sementes de Fibra (na estufa)'],
    foraging: ['Inhame de Inverno', 'Raiz de Cristal', 'Crocus', 'Holly'],
    fish: ['Esturjao', 'Pepino do Mar', 'Lula', 'Peixe Lendario (Inverno)'],
    festivals: [
      { name: 'Festival de Gelo', day: 8, description: 'Competicao de pesca no gelo. Pegue 5+ peixes para ganhar!' },
      { name: 'Festa do Inverno', day: 25, description: 'Troca de presentes secreta. Voce recebe e da um presente.' },
    ],
    tips: [
      'Foque em mineracao — va fundo nas minas ou Skull Cavern',
      'Use Winter Seeds para ter alguma renda de foraging',
      'Otimo momento para melhorar ferramentas e reorganizar a fazenda',
      'Planeje suas compras de sementes para a Primavera do proximo ano',
    ],
  },
]
