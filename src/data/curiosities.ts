export interface Curiosity {
  title: string
  emoji: string
  content: string
  category: 'easter-egg' | 'dica' | 'lore' | 'mecanica'
}

export const curiosities: Curiosity[] = [
  {
    title: 'ConcernedApe fez TUDO sozinho',
    emoji: '🎮',
    content: 'Eric Barone (ConcernedApe) desenvolveu Stardew Valley completamente sozinho durante 4 anos. Ele fez a programacao, arte, musica e design do jogo inteiro.',
    category: 'lore',
  },
  {
    title: 'A Abigail realmente come ametistas?',
    emoji: '💎',
    content: 'Quando voce da uma ametista para Abigail, ela diz "Como voce sabia que eu estava com fome? Isso parece delicioso!" — ConcernedApe confirmou que isso foi intencional e nao um bug.',
    category: 'easter-egg',
  },
  {
    title: 'O segredo da estátua do Junimo',
    emoji: '🍄',
    content: 'Se voce digitar o nome do seu personagem como "ConcernedApe", uma estatua de Junimo aparecera na sua fazenda. Existem varios outros nomes secretos que dao itens especiais.',
    category: 'easter-egg',
  },
  {
    title: 'Cafe dobra sua velocidade',
    emoji: '☕',
    content: 'Tomar cafe da um buff de velocidade que pode ser acumulado com comida que tambem da velocidade. E a melhor forma de se mover rapido pelo mapa.',
    category: 'dica',
  },
  {
    title: 'O segredo do caminhao da JojaMart',
    emoji: '🚛',
    content: 'Existe um caminhao estacionado atras do JojaMart. Se voce completar um conjunto especifico de tarefas secretas, o caminhao se move e revela uma passagem.',
    category: 'easter-egg',
  },
  {
    title: 'Galinhas azuis existem',
    emoji: '🐔',
    content: 'Se voce tiver 8+ coracoes com Shane, Marnie vai oferecer galinhas azuis para comprar. Elas produzem ovos normais, mas sao muito mais raras.',
    category: 'mecanica',
  },
  {
    title: 'O jogo era para ser um clone de Harvest Moon',
    emoji: '🌙',
    content: 'ConcernedApe comecou o projeto como uma "versao melhor de Harvest Moon". O jogo cresceu tanto que se tornou uma franquia propria e iconica.',
    category: 'lore',
  },
  {
    title: 'Cristalarium infinito de diamantes',
    emoji: '💰',
    content: 'Coloque um diamante no Cristalarium e ele vai produzir um novo diamante a cada 5 dias. E uma das melhores fontes de renda passiva do jogo.',
    category: 'dica',
  },
  {
    title: 'A bruxa pode pintar seus filhos',
    emoji: '🧙',
    content: 'A bruxa pode voar sobre seu galinheiro a noite e transformar um ovo em um Void Egg. Ela tambem pode visitar sua casa se voce tiver filhos...',
    category: 'mecanica',
  },
  {
    title: 'Pesca com o truque da barra',
    emoji: '🎣',
    content: 'Se voce "bater" o botao rapidamente em vez de segurar, a barra de pesca se move mais devagar e e muito mais facil de controlar. Essencial para peixes lendarios.',
    category: 'dica',
  },
  {
    title: 'Os Junimos sao espiritios da floresta',
    emoji: '🌲',
    content: 'Segundo o lore do jogo, os Junimos sao espiritos protetores da natureza que existem ha seculos. Eles ajudam quem cuida do vale e da comunidade.',
    category: 'lore',
  },
  {
    title: 'Skull Cavern nao tem fundo',
    emoji: '💀',
    content: 'Diferente das minas normais (120 andares), a Skull Cavern e tecnicamente infinita. Quanto mais fundo voce for, melhores sao os itens, mas os monstros ficam brutais.',
    category: 'mecanica',
  },
  {
    title: 'Rainha de Molho e um item real',
    emoji: '👑',
    content: 'O "Sauce Queen" e um programa de TV do jogo onde voce aprende receitas. Se voce perder um episodio, pode reassistir em reruns nas quartas-feiras!',
    category: 'dica',
  },
  {
    title: 'O triste passado do Shane',
    emoji: '💔',
    content: 'A historia do Shane aborda depressao e alcoolismo de forma sensivel. ConcernedApe consultou profissionais de saude mental para retratar o tema com respeito.',
    category: 'lore',
  },
  {
    title: 'Porcos sao a melhor fonte de renda',
    emoji: '🐷',
    content: 'Porcos desenterram trufas que podem ser transformadas em oleo de trufa (valor alto). Com o bonus de artesao, cada trufa gera mais de 1400g.',
    category: 'dica',
  },
]
