import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'

const WIKI_BASE = 'https://stardewvalleywiki.com'
const WIKI_API = `${WIKI_BASE}/mediawiki/api.php`

// ─── Types ───────────────────────────────────────────────

interface WikiSection {
  title: string
  content: string
}

interface ScheduleEntry {
  time: string
  location: string
}

interface WikiResult {
  title: string
  url: string
  summary: string
  sections: WikiSection[]
  infobox: Record<string, string>
  schedules: Record<string, ScheduleEntry[]>
  gifts: { loved: string[]; liked: string[]; neutral: string[]; disliked: string[]; hated: string[] }
}

// ─── EN -> PT Translation ────────────────────────────────

const enToPt: Record<string, string> = {
  // Days
  'Monday': 'Segunda', 'Tuesday': 'Terca', 'Wednesday': 'Quarta',
  'Thursday': 'Quinta', 'Friday': 'Sexta', 'Saturday': 'Sabado', 'Sunday': 'Domingo',
  // Seasons
  'Spring': 'Primavera', 'Summer': 'Verao', 'Fall': 'Outono', 'Winter': 'Inverno',
  // Weather
  'Rain': 'Chuva', 'Sunny': 'Sol', 'Rainy': 'Chuvoso',
  // Times
  'AM': 'h', 'PM': 'h',
  // Locations
  "Pierre's General Store": 'Armazem do Pierre',
  "Carpenter's Shop": 'Carpintaria da Robin',
  "Harvey's Clinic": 'Clinica do Harvey',
  "Stardrop Saloon": 'Stardrop Saloon',
  "JojaMart": 'JojaMart',
  "Museum": 'Museu',
  "Blacksmith": 'Ferreiro (Clint)',
  "Community Center": 'Centro Comunitario',
  "The Beach": 'Praia',
  "The Mountain": 'Montanha',
  "The Mines": 'Minas',
  "Cindersap Forest": 'Floresta Cindersap',
  "Pelican Town": 'Pelican Town',
  "Railroad": 'Ferrovia',
  "Bus Stop": 'Ponto de Onibus',
  "Calico Desert": 'Deserto de Calico',
  "Ginger Island": 'Ilha do Gengibre',
  "Skull Cavern": 'Caverna da Caveira',
  "The Sewers": 'Esgoto',
  "Wizard's Tower": 'Torre do Mago',
  "Marnie's Ranch": 'Rancho da Marnie',
  "Leah's Cottage": 'Casa da Leah',
  "Elliott's Cabin": 'Cabana do Elliott',
  "Mayor's Manor": 'Mansao do Prefeito',
  "Trailer": 'Trailer (Pam/Penny)',
  "Graveyard": 'Cemiterio',
  "Town Square": 'Praca da Cidade',
  "Bridge": 'Ponte',
  "River": 'Rio',
  "Lake": 'Lago',
  "Forest": 'Floresta',
  "Mountain": 'Montanha',
  "Beach": 'Praia',
  "Desert": 'Deserto',
  "Farm": 'Fazenda',
  "Kitchen": 'Cozinha',
  "Bedroom": 'Quarto',
  // Gift reactions
  'Love': 'Ama', 'Like': 'Gosta', 'Neutral': 'Neutro',
  'Dislike': 'Nao gosta', 'Hate': 'Odeia',
  // General
  'Address': 'Endereco', 'Birthday': 'Aniversario',
  'Lives In': 'Mora em', 'Marriage': 'Casamento',
  'Best Gifts': 'Melhores Presentes',
  'Family': 'Familia', 'Friends': 'Amigos', 'Friendship': 'Amizade',
  'Sell Price': 'Preco de Venda', 'Seed Price': 'Preco da Semente',
  'Growth Time': 'Tempo de Crescimento', 'Season': 'Estacao',
  'Source': 'Fonte', 'Healing': 'Cura',
  'Recipe Source': 'Fonte da Receita',
  'Ingredients': 'Ingredientes',
  // Items / crops
  'Parsnip': 'Parsnip (Rabanete)', 'Potato': 'Batata',
  'Cauliflower': 'Couve-flor', 'Green Bean': 'Feijao Verde',
  'Strawberry': 'Morango', 'Melon': 'Melao', 'Tomato': 'Tomate',
  'Blueberry': 'Mirtilo', 'Hot Pepper': 'Pimenta',
  'Corn': 'Milho', 'Eggplant': 'Berinjela', 'Pumpkin': 'Abobora',
  'Cranberry': 'Cranberry', 'Yam': 'Inhame', 'Grape': 'Uva',
  'Sunflower': 'Girassol', 'Red Cabbage': 'Repolho Roxo',
  'Artichoke': 'Alcachofra', 'Hops': 'Lupulo',
  'Ancient Fruit': 'Ancient Fruit', 'Starfruit': 'Starfruit',
  'Sweet Gem Berry': 'Sweet Gem Berry',
  // Fish
  'Sturgeon': 'Esturjao', 'Salmon': 'Salmao', 'Eel': 'Enguia',
  'Squid': 'Lula', 'Catfish': 'Peixe-gato', 'Lobster': 'Lagosta',
  'Crab': 'Caranguejo', 'Octopus': 'Polvo',
  'Pufferfish': 'Baiacu', 'Legend': 'Legend (Lendario)',
  'Super Cucumber': 'Super Pepino',
  // Minerals / gems
  'Amethyst': 'Ametista', 'Diamond': 'Diamante',
  'Emerald': 'Esmeralda', 'Ruby': 'Rubi', 'Topaz': 'Topazio',
  'Jade': 'Jade', 'Aquamarine': 'Agua-marinha',
  'Prismatic Shard': 'Fragmento Prismatico',
  'Iridium Bar': 'Barra de Iridio', 'Gold Bar': 'Barra de Ouro',
  'Iron Bar': 'Barra de Ferro', 'Copper Bar': 'Barra de Cobre',
  // Products
  'Truffle': 'Trufa', 'Honey': 'Mel', 'Wine': 'Vinho',
  'Beer': 'Cerveja', 'Cheese': 'Queijo', 'Mayonnaise': 'Maionese',
  'Cloth': 'Tecido', 'Wool': 'La', 'Milk': 'Leite',
  'Large Milk': 'Leite Grande', 'Egg': 'Ovo', 'Large Egg': 'Ovo Grande',
  'Duck Egg': 'Ovo de Pato', 'Void Egg': 'Ovo Vazio',
  'Truffle Oil': 'Oleo de Trufa', 'Goat Cheese': 'Queijo de Cabra',
  'Pale Ale': 'Pale Ale', 'Juice': 'Suco', 'Jelly': 'Geleia',
  'Pickles': 'Picles',
  // Machines
  'Keg': 'Barril', 'Preserves Jar': 'Pote de Conserva',
  'Bee House': 'Colmeia', 'Loom': 'Tear',
  'Cheese Press': 'Prensa de Queijo', 'Oil Maker': 'Prensa de Oleo',
  'Mayonnaise Machine': 'Maquina de Maionese',
  'Crystalarium': 'Cristalarium', 'Seed Maker': 'Fabricante de Sementes',
  'Furnace': 'Fornalha', 'Recycling Machine': 'Recicladora',
  'Greenhouse': 'Estufa',

  // Schedule action phrases (longer first for proper matching)
  'Stands behind the counter of the general store': 'Fica atras do balcao do Armazem',
  'Goes to stand behind the counter of the general store': 'Vai pro balcao do Armazem',
  'Leaves the counter and stands in the aisles again': 'Sai do balcao e fica pelos corredores',
  'In the aisles of the general store': 'Nos corredores do Armazem',
  'Goes to the kitchen in his house': 'Vai pra cozinha da casa dele',
  'Goes to his room and stands in front of the bookcase': 'Vai pro quarto e fica na frente da estante',
  'Goes to his room': 'Vai pro quarto',
  'Goes to her room': 'Vai pro quarto',
  'Stands behind the counter': 'Fica atras do balcao',
  'Goes to bed': 'Vai dormir',
  'Goes home': 'Vai pra casa',
  'Leaves home': 'Sai de casa',
  'Goes to the kitchen': 'Vai pra cozinha',
  'Leaves the house': 'Sai de casa',
  'Walks to': 'Vai ate',
  'Walks home': 'Volta pra casa',
  'Walks to the': 'Vai ate',
  'Stands near': 'Fica perto de',
  'Stands in': 'Fica em',
  'Stands at': 'Fica em',
  'Stands by': 'Fica perto de',
  'Stands next to': 'Fica ao lado de',
  'Sits on the bench': 'Senta no banco',
  'Sits at': 'Senta em',
  'Sits in': 'Senta em',
  'Exercises': 'Se exercita',
  'Working out': 'Malhando',
  'Hangs out': 'Fica de boa',
  'Looking at': 'Olhando',
  'Reads a book': 'Le um livro',
  'Reading': 'Lendo',
  'Boards the bus': 'Pega o onibus',
  'Arrives at': 'Chega em',
  'Leaves booth': 'Sai do estande',
  'Goes to the': 'Vai ate',
  'Goes outside': 'Vai pra fora',
  'Goes inside': 'Entra',
  'Returns home': 'Volta pra casa',
  'Returns to': 'Volta pra',
  'Heads to': 'Vai pra',
  'Heads home': 'Volta pra casa',
  'Leaves for': 'Sai pra',
  'Visits': 'Visita',
  'Fishing at': 'Pescando em',
  'Fishing on': 'Pescando em',
  'Fishing': 'Pescando',
  'Working at': 'Trabalhando em',
  'Working in': 'Trabalhando em',
  'Shopping at': 'Comprando em',
  'Watching TV': 'Assistindo TV',
  'Playing': 'Jogando/Brincando',
  'Cooking': 'Cozinhando',
  'Eating': 'Comendo',
  'Drinking': 'Bebendo',
  'Sleeping': 'Dormindo',

  // Common schedule locations/contexts
  'living room': 'sala de estar',
  'his house': 'casa dele',
  'her house': 'casa dela',
  'the counter': 'o balcao',
  'the store': 'a loja',
  'the shop': 'a loja',
  'the clinic': 'a clinica',
  'the saloon': 'o saloon',
  'the bridge': 'a ponte',
  'the graveyard': 'o cemiterio',
  'the playground': 'o parquinho',
  'the fountain': 'a fonte',
  'the tree': 'a arvore',
  'the bench': 'o banco',
  'the river': 'o rio',
  'the lake': 'o lago',
  'the dock': 'o pier',
  'his booth': 'o estande dele',
  'behind the counter': 'atras do balcao',
  'in front of': 'na frente de',
  'next to': 'ao lado de',
  'near the': 'perto de',
  'All day': 'O dia todo',
  'all day': 'o dia todo',
}

// Words that should only match as whole words to avoid corrupting longer words
const wholeWordOnly = new Set([
  'Love', 'Like', 'Neutral', 'Dislike', 'Hate',
  'Farm', 'Bridge', 'River', 'Lake', 'Forest', 'Mountain', 'Beach', 'Desert',
  'Rain', 'Sunny', 'Rainy',
  'Egg', 'Milk', 'Cloth', 'Wool',
  'Friend', 'Friends',
])

function translateText(text: string): string {
  let result = text

  // Translate time format first: "6:00 AM" -> "6:00h", "4:00 PM" -> "16:00h"
  result = result.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (_, h, m, period) => {
    let hour = parseInt(h)
    if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0
    return `${hour}:${m}h`
  })

  // Sort by length descending so longer phrases match first
  const entries = Object.entries(enToPt).sort((a, b) => b[0].length - a[0].length)
  for (const [en, pt] of entries) {
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Use word boundaries for short/ambiguous words to avoid partial matches
    const needsBoundary = wholeWordOnly.has(en) || en.length <= 5
    const pattern = needsBoundary ? `\\b${escaped}\\b` : escaped
    result = result.replace(new RegExp(pattern, 'gi'), pt)
  }

  return result
}

// ─── PT -> EN Search Translation ─────────────────────────

const ptToEn: Record<string, string> = {
  // NPCs
  'abigail': 'Abigail', 'sebastian': 'Sebastian', 'sam': 'Sam',
  'haley': 'Haley', 'leah': 'Leah', 'penny': 'Penny',
  'maru': 'Maru', 'emily': 'Emily', 'alex': 'Alex',
  'elliott': 'Elliott', 'shane': 'Shane', 'harvey': 'Harvey',
  'robin': 'Robin', 'demetrius': 'Demetrius', 'willy': 'Willy',
  'gus': 'Gus', 'clint': 'Clint', 'lewis': 'Lewis',
  'marnie': 'Marnie', 'caroline': 'Caroline', 'pierre': 'Pierre',
  'wizard': 'Wizard', 'pam': 'Pam', 'evelyn': 'Evelyn',
  'george': 'George', 'dwarf': 'Dwarf', 'sandy': 'Sandy',
  'krobus': 'Krobus', 'linus': 'Linus', 'leo': 'Leo',
  'kent': 'Kent', 'jodi': 'Jodi', 'jas': 'Jas', 'vincent': 'Vincent',
  // Crops
  'morango': 'Strawberry', 'abobora': 'Pumpkin', 'batata': 'Potato',
  'tomate': 'Tomato', 'milho': 'Corn', 'melao': 'Melon',
  'mirtilo': 'Blueberry', 'cranberry': 'Cranberry', 'berinjela': 'Eggplant',
  'couve-flor': 'Cauliflower', 'repolho': 'Red Cabbage',
  'girassol': 'Sunflower', 'pimenta': 'Hot Pepper', 'rabanete': 'Parsnip',
  'parsnip': 'Parsnip', 'lupulo': 'Hops', 'feijao': 'Green Bean',
  'alcachofra': 'Artichoke', 'inhame': 'Yam', 'uva': 'Grape',
  'ancient fruit': 'Ancient Fruit', 'starfruit': 'Starfruit',
  'cafe': 'Coffee Bean', 'arroz': 'Rice',
  // Items
  'ametista': 'Amethyst', 'diamante': 'Diamond', 'esmeralda': 'Emerald',
  'rubi': 'Ruby', 'topazio': 'Topaz', 'jade': 'Jade',
  'obsidiana': 'Obsidian', 'iridio': 'Iridium Bar', 'iridium': 'Iridium Bar',
  'ouro': 'Gold Bar', 'ferro': 'Iron Bar', 'cobre': 'Copper Bar',
  'trufa': 'Truffle', 'mel': 'Honey', 'vinho': 'Wine',
  'cerveja': 'Beer', 'queijo': 'Cheese', 'maionese': 'Mayonnaise',
  'prismatic shard': 'Prismatic Shard', 'prismatico': 'Prismatic Shard',
  'fragmento prismatico': 'Prismatic Shard',
  // Fish
  'esturjao': 'Sturgeon', 'sturgeon': 'Sturgeon',
  'salmao': 'Salmon', 'enguia': 'Eel', 'lula': 'Squid',
  'pufferfish': 'Pufferfish', 'baiacu': 'Pufferfish',
  'peixe-gato': 'Catfish', 'super pepino': 'Super Cucumber',
  'lagosta': 'Lobster', 'caranguejo': 'Crab', 'polvo': 'Octopus',
  'peixe lendario': 'Legend', 'legend': 'Legend',
  // Locations
  'minas': 'The Mines', 'skull cavern': 'Skull Cavern',
  'caverna da caveira': 'Skull Cavern', 'deserto': 'Calico Desert',
  'praia': 'The Beach', 'floresta': 'Cindersap Forest',
  'montanha': 'The Mountain', 'esgoto': 'The Sewers',
  'ilha': 'Ginger Island', 'ilha do gengibre': 'Ginger Island',
  'fazenda': 'The Farm', 'cidade': 'Pelican Town',
  // Mechanics
  'estufa': 'Greenhouse', 'greenhouse': 'Greenhouse',
  'centro comunitario': 'Bundles', 'bundles': 'Bundles',
  'barril': 'Keg', 'keg': 'Keg',
  'preserva': 'Preserves Jar', 'cristalarium': 'Crystalarium',
  'colmeia': 'Bee House', 'tear': 'Loom',
  'pesca': 'Fishing', 'mineracao': 'Mining',
  'agricultura': 'Farming', 'cozinha': 'Cooking',
  'forjamento': 'Forge', 'encantamento': 'Forge',
  // Seasons
  'primavera': 'Spring', 'verao': 'Summer',
  'outono': 'Fall', 'inverno': 'Winter',
}

// ─── Wiki API ────────────────────────────────────────────

export async function searchWiki(query: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'opensearch',
    search: query,
    limit: '5',
    namespace: '0',
    format: 'json',
  })

  const res = await fetch(`${WIKI_API}?${params}`)
  const data = await res.json()
  return data[1] || []
}

export async function getPageContent(title: string): Promise<WikiResult | null> {
  const params = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'text',
    format: 'json',
  })

  const res = await fetch(`${WIKI_API}?${params}`)
  const data = await res.json()

  if (data.error) return null

  const html = data.parse?.text?.['*']
  if (!html) return null

  const $ = cheerio.load(html)
  $('.mw-editsection, .reference, script, style, .toc, .navbox').remove()

  // Extract infobox
  const infobox: Record<string, string> = {}
  $('.infobox tr, .infoboxtable tr').each((_, row) => {
    const key = $(row).find('th, td:first-child').first().text().trim()
    const val = $(row).find('td:last-child').text().trim()
    if (key && val && key !== val) {
      infobox[key] = val
    }
  })

  // Extract schedule tables specifically
  const schedules: Record<string, ScheduleEntry[]> = {}
  let currentScheduleLabel = ''

  $('.mw-parser-output').children().each((_, el) => {
    const tag = (el as Element).tagName
    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = $(el).text().trim()
      if (text.toLowerCase().includes('schedule') || currentScheduleLabel) {
        currentScheduleLabel = text
      }
    }
    if (tag === 'table' && currentScheduleLabel) {
      const entries: ScheduleEntry[] = []
      $(el).find('tr').each((_, row) => {
        const cells: string[] = []
        $(row).find('td').each((_, cell) => {
          cells.push($(cell).text().trim())
        })
        if (cells.length >= 2) {
          entries.push({ time: cells[0], location: cells.slice(1).join(' - ') })
        }
      })
      if (entries.length > 0) {
        schedules[currentScheduleLabel] = entries
      }
    }
    // Reset if we hit a non-schedule h2
    if (tag === 'h2' && !$(el).text().toLowerCase().includes('schedule')) {
      currentScheduleLabel = ''
    }
  })

  // Extract gift preferences by looking for the gift taste sections
  const gifts = { loved: [] as string[], liked: [] as string[], neutral: [] as string[], disliked: [] as string[], hated: [] as string[] }

  // Method 1: Look for <h3> with ids like #Best_Gifts, #Loved, #Liked, etc.
  // and grab items from the following content
  let inGiftSection = false
  let currentGiftCategory: keyof typeof gifts | null = null

  $('.mw-parser-output').children().each((_, el) => {
    const tag = (el as Element).tagName
    const text = $(el).text().trim().toLowerCase()

    if (tag === 'h2') {
      inGiftSection = text.includes('gift')
      currentGiftCategory = null
    }
    if (tag === 'h3' && inGiftSection) {
      if (text.includes('love') || text.includes('best')) currentGiftCategory = 'loved'
      else if (text.includes('like')) currentGiftCategory = 'liked'
      else if (text.includes('neutral')) currentGiftCategory = 'neutral'
      else if (text.includes('dislike')) currentGiftCategory = 'disliked'
      else if (text.includes('hate')) currentGiftCategory = 'hated'
    }
    // Items are usually in <ul> or <div> after the header, with item names linked
    if (currentGiftCategory && inGiftSection && (tag === 'ul' || tag === 'div' || tag === 'table')) {
      // Exclusion list: common non-item links that appear in gift sections
      const excludeTerms = new Set([
        'friendship', 'friends', 'villager', 'villagers', 'universal',
        'gift', 'gifts', 'birthday', 'cooking', 'mining', 'farming',
        'fishing', 'combat', 'foraging', 'artisan', 'quality',
        'silver', 'gold', 'iridium', 'normal', 'category',
        'milk', 'sugar', 'wheat flour', 'oil', 'vinegar', 'rice',
        'hoes', 'pickaxes', 'axes', 'watering cans',
        'clay', 'stone', 'wood', 'fiber', 'sap', 'coal',
        'artifacts', 'minerals', 'trinkets', 'vegetables', 'fruits',
        'spring', 'summer', 'fall', 'winter', 'books',
        'the mines', 'the beach', 'the mountain', 'pelican town',
        'calico desert', 'ginger island', 'skull cavern',
        'stardew valley', 'community center',
      ])
      $(el).find('a').each((_, link) => {
        const itemName = $(link).attr('title') || $(link).text().trim()
        if (itemName && itemName.length > 1 && itemName.length < 40
            && !excludeTerms.has(itemName.toLowerCase())
            && !/^(All |Most |Some |Universal|Category)/i.test(itemName)) {
          gifts[currentGiftCategory!].push(itemName)
        }
      })
    }
  })

  // Method 2: Fallback - look for the "Best Gifts" infobox row
  if (gifts.loved.length === 0) {
    const bestGiftsVal = infobox['Best Gifts'] || infobox['Loved Gifts'] || ''
    if (bestGiftsVal) {
      gifts.loved = bestGiftsVal.split(/[,;]/).map(s => s.trim()).filter(Boolean)
    }
  }

  // Extract sections
  const sections: WikiSection[] = []
  let currentTitle = 'Introducao'
  let currentContent: string[] = []

  const pushSection = () => {
    const text = currentContent.join('\n').trim()
    if (text) sections.push({ title: currentTitle, content: text })
    currentContent = []
  }

  $('.mw-parser-output').children().each((_, el) => {
    const tag = (el as Element).tagName
    if (tag === 'h2' || tag === 'h3') {
      pushSection()
      currentTitle = $(el).text().trim()
    } else if (tag === 'p') {
      const text = $(el).text().trim()
      if (text) currentContent.push(text)
    } else if (tag === 'ul' || tag === 'ol') {
      $(el).find('li').each((_, li) => {
        const text = $(li).text().trim()
        if (text) currentContent.push(`• ${text}`)
      })
    } else if (tag === 'table' && !$(el).hasClass('infobox') && !$(el).hasClass('infoboxtable')) {
      const rows: string[] = []
      $(el).find('tr').each((_, row) => {
        const cells: string[] = []
        $(row).find('th, td').each((_, cell) => {
          cells.push($(cell).text().trim())
        })
        if (cells.length > 0) rows.push(cells.join(' | '))
      })
      if (rows.length > 0) currentContent.push(rows.join('\n'))
    }
  })
  pushSection()

  const summary = sections[0]?.content.slice(0, 500) || ''

  return {
    title: data.parse.title,
    url: `${WIKI_BASE}/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    summary,
    sections,
    infobox,
    schedules,
    gifts,
  }
}

// ─── Question Analysis ───────────────────────────────────

type QuestionType = 'schedule' | 'gifts' | 'farming' | 'crafting' | 'fishing' | 'general'

interface QuestionContext {
  types: QuestionType[]
  season: string | null
  day: string | null
  time: string | null
  npc: string | null
  subject: string | null
}

function analyzeQuestion(question: string): QuestionContext {
  const q = question.toLowerCase()

  const types: QuestionType[] = []
  if (/onde|fica|esta|estao|localiz|encontr|horario|hora|schedule|terca|segunda|quarta|quinta|sexta|sabado|domingo|\d+h/.test(q)) types.push('schedule')
  if (/presente|gosta|ama|odeia|gift|like|love|dar de|favorit/.test(q)) types.push('gifts')
  if (/plantar|crescer|colher|semente|crop|plant|grow|harvest|quanto tempo|dias/.test(q)) types.push('farming')
  if (/craftar|receita|recipe|craft|ingrediente|fazer|construir|fabricar/.test(q)) types.push('crafting')
  if (/pesc|fish|pescar|vara|isca|onde peg/.test(q)) types.push('fishing')
  if (types.length === 0) types.push('general')

  // Extract season
  let season: string | null = null
  if (/primavera|spring/.test(q)) season = 'Spring'
  else if (/verao|summer/.test(q)) season = 'Summer'
  else if (/outono|fall|autumn/.test(q)) season = 'Fall'
  else if (/inverno|winter/.test(q)) season = 'Winter'

  // Extract day
  let day: string | null = null
  if (/segunda/.test(q)) day = 'Monday'
  else if (/terca/.test(q)) day = 'Tuesday'
  else if (/quarta/.test(q)) day = 'Wednesday'
  else if (/quinta/.test(q)) day = 'Thursday'
  else if (/sexta/.test(q)) day = 'Friday'
  else if (/sabado/.test(q)) day = 'Saturday'
  else if (/domingo/.test(q)) day = 'Sunday'

  // Extract time
  let time: string | null = null
  const timeMatch = q.match(/(\d{1,2})\s*(?:h|:00|hora)/)
  if (timeMatch) time = timeMatch[1]

  // Find NPC or subject
  let npc: string | null = null
  let subject: string | null = null

  const sortedEntries = Object.entries(ptToEn).sort((a, b) => b[0].length - a[0].length)
  for (const [pt, en] of sortedEntries) {
    if (q.includes(pt)) {
      // Check if it's an NPC (first 34 entries roughly) by checking the English name
      const isNpc = /^[A-Z][a-z]+$/.test(en) && en.length > 2 && !['Spring', 'Summer', 'Fall', 'Winter', 'Fishing', 'Mining', 'Farming', 'Cooking'].includes(en)
      if (isNpc && !npc) npc = en
      else if (!subject) subject = en
    }
  }

  return { types, season, day, time, npc, subject }
}

// ─── Search Terms Extraction ─────────────────────────────

function extractSearchTerms(question: string): string[] {
  const stopWords = new Set([
    'onde', 'como', 'quando', 'qual', 'quais', 'que', 'quem',
    'posso', 'encontrar', 'achar', 'pegar', 'conseguir', 'plantar',
    'fica', 'esta', 'estao', 'tem', 'fazer', 'dar', 'para',
    'o', 'a', 'os', 'as', 'de', 'do', 'da', 'dos', 'das',
    'um', 'uma', 'no', 'na', 'nos', 'nas', 'em', 'e', 'eh',
    'eu', 'me', 'se', 'ao', 'por', 'com', 'mais', 'melhor',
    'the', 'is', 'at', 'in', 'on', 'what', 'where', 'how', 'who',
    'gosta', 'presente', 'favorito', 'favorita', 'sobre', 'info',
    'dica', 'dicas', 'tipo', 'vai', 'vou', 'quero', 'saber',
    'falar', 'fale', 'mim', 'muito', 'tudo', 'ta', 'tava',
    'hora', 'horario', 'dia', 'noite',
  ])

  const cleaned = question.replace(/[?!.,;:'"]/g, '').toLowerCase()
  const terms: string[] = []

  const sortedEntries = Object.entries(ptToEn).sort((a, b) => b[0].length - a[0].length)
  for (const [pt, en] of sortedEntries) {
    if (cleaned.includes(pt)) terms.push(en)
  }

  if (terms.length > 0) return [...new Set(terms)].slice(0, 3)

  const words = cleaned.split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w))
  for (const w of words) {
    const lower = w.toLowerCase()
    if (ptToEn[lower]) {
      terms.push(ptToEn[lower])
    } else {
      terms.push(w.charAt(0).toUpperCase() + w.slice(1))
    }
  }

  return [...new Set(terms)].slice(0, 3)
}

// ─── Conversational Response Builder ─────────────────────

function buildConversationalResponse(question: string, page: WikiResult, ctx: QuestionContext): string {
  const name = page.title
  const parts: string[] = []

  // ── Schedule questions ──
  if (ctx.types.includes('schedule')) {
    parts.push(...buildScheduleResponse(page, ctx, name))
  }

  // ── Gift questions ──
  if (ctx.types.includes('gifts')) {
    parts.push(...buildGiftResponse(page, ctx, name))
  }

  // ── Farming questions ──
  if (ctx.types.includes('farming')) {
    parts.push(...buildFarmingResponse(page, name))
  }

  // ── Fishing questions ──
  if (ctx.types.includes('fishing')) {
    parts.push(...buildFishingResponse(page, name))
  }

  // ── Crafting questions ──
  if (ctx.types.includes('crafting')) {
    parts.push(...buildCraftingResponse(page, name))
  }

  // ── General / fallback ──
  if (ctx.types.includes('general') || parts.length === 0) {
    parts.push(...buildGeneralResponse(page, name))
  }

  // Add source link at the end
  parts.push(`\n📎 Fonte: ${page.url}`)

  return parts.join('\n')
}

function buildScheduleResponse(page: WikiResult, ctx: QuestionContext, name: string): string[] {
  const parts: string[] = []
  const seasonPt = ctx.season ? (enToPt[ctx.season] || ctx.season) : null
  const dayPt = ctx.day ? (enToPt[ctx.day] || ctx.day) : null

  // Find the right schedule section
  const scheduleSection = page.sections.find(s =>
    s.title.toLowerCase().includes('schedule')
  )

  if (!scheduleSection && Object.keys(page.schedules).length === 0) {
    // NPC without detailed schedule
    const address = page.infobox['Address'] || page.infobox['Lives In'] || ''
    if (address) {
      parts.push(`O **${name}** geralmente fica em **${translateText(address)}**.`)
      if (seasonPt) {
        parts.push(`No ${seasonPt}, a rotina pode variar um pouco, mas voce normalmente encontra por la.`)
      }
    } else {
      parts.push(`Nao encontrei um horario detalhado para **${name}** na wiki.`)
    }
    return parts
  }

  // Header
  if (seasonPt && dayPt && ctx.time) {
    parts.push(`Sobre o **${name}** na ${dayPt}-feira, ${ctx.time}h, no ${seasonPt}:`)
  } else if (seasonPt) {
    parts.push(`Sobre a rotina do **${name}** no ${seasonPt}:`)
  } else if (ctx.time) {
    parts.push(`Sobre onde o **${name}** esta as ${ctx.time}h:`)
  } else {
    parts.push(`Sobre a rotina do **${name}**:`)
  }
  parts.push('')

  // Try to find specific schedule entries
  const scheduleKeys = Object.keys(page.schedules)
  let relevantSchedules: [string, ScheduleEntry[]][] = []

  if (ctx.season) {
    relevantSchedules = scheduleKeys
      .filter(k => k.toLowerCase().includes(ctx.season!.toLowerCase()))
      .map(k => [k, page.schedules[k]])
  }

  if (relevantSchedules.length === 0) {
    // Use all schedules or the section text
    relevantSchedules = scheduleKeys.slice(0, 3).map(k => [k, page.schedules[k]])
  }

  if (relevantSchedules.length > 0) {
    for (const [label, entries] of relevantSchedules.slice(0, 2)) {
      parts.push(`**${translateText(label)}:**`)
      for (const entry of entries.slice(0, 6)) {
        const translatedLoc = translateText(entry.location)
        const translatedTime = translateText(entry.time)
        parts.push(`  • ${translatedTime} → ${translatedLoc}`)
      }
      parts.push('')
    }

    // Add a helpful tip if time was specified
    if (ctx.time) {
      const hour = parseInt(ctx.time)
      const foundEntry = relevantSchedules[0]?.[1]?.find(e => {
        const match = e.time.match(/(\d{1,2})/)
        return match && Math.abs(parseInt(match[1]) - hour) <= 1
      })
      if (foundEntry) {
        parts.push(`👉 Por volta das ${ctx.time}h, ele(a) deve estar em **${translateText(foundEntry.location)}**.`)
      }
    }
  } else if (scheduleSection) {
    // Fallback: use the text from the schedule section, translated
    const translated = translateText(scheduleSection.content.slice(0, 600))
    parts.push(translated)
  }

  // Address
  const address = page.infobox['Address'] || page.infobox['Lives In'] || ''
  if (address) {
    parts.push(`\n🏠 Mora em: **${translateText(address)}**`)
  }

  return parts
}

function buildGiftResponse(page: WikiResult, _ctx: QuestionContext, name: string): string[] {
  const parts: string[] = []

  parts.push(`Sobre os presentes do **${name}**:`)
  parts.push('')

  const { gifts } = page
  const hasGiftData = gifts.loved.length > 0 || gifts.liked.length > 0

  if (hasGiftData) {
    if (gifts.loved.length > 0) {
      parts.push('❤️ **Presentes que AMA:**')
      gifts.loved.slice(0, 8).forEach(item => parts.push(`  • ${translateText(item)}`))
      parts.push('')
    }

    if (gifts.liked.length > 0) {
      parts.push('💛 **Presentes que GOSTA:**')
      gifts.liked.slice(0, 8).forEach(item => parts.push(`  • ${translateText(item)}`))
      parts.push('')
    }

    if (gifts.disliked.length > 0) {
      parts.push('👎 **NAO gosta:**')
      gifts.disliked.slice(0, 5).forEach(item => parts.push(`  • ${translateText(item)}`))
      parts.push('')
    }

    if (gifts.hated.length > 0) {
      parts.push('💔 **ODEIA (nunca de esses!):**')
      gifts.hated.slice(0, 5).forEach(item => parts.push(`  • ${translateText(item)}`))
      parts.push('')
    }

    // Friendly summary
    if (gifts.loved.length > 0) {
      const topGift = translateText(gifts.loved[0])
      parts.push(`👉 Dica rapida: se quer ganhar amizade rapido, da **${topGift}** — ele(a) ama!`)
    }
  } else {
    // Fallback: look for gift info in sections text
    const giftSection = page.sections.find(s => /gift|present/i.test(s.title))
    if (giftSection) {
      // Try to extract item names from the text
      const items = giftSection.content
        .split('\n')
        .filter(line => line.startsWith('•'))
        .map(line => translateText(line.replace('• ', '')))

      if (items.length > 0) {
        parts.push('🎁 **Itens mencionados na secao de presentes:**')
        items.slice(0, 10).forEach(item => parts.push(`  • ${item}`))
      } else {
        parts.push('Nao consegui extrair a lista de presentes de forma estruturada.')
        parts.push('Confere direto na wiki pra ter certeza!')
      }
    } else {
      parts.push('Nao encontrei dados de presentes na wiki pra esse personagem.')
    }
  }

  // Birthday
  const birthday = page.infobox['Birthday']
  if (birthday) {
    parts.push(`\n🎂 Aniversario: **${translateText(birthday)}**`)
    parts.push(`💡 No aniversario, os presentes valem **8x** mais amizade — nao esquece!`)
  }

  return parts
}

function buildFarmingResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []

  parts.push(`Sobre o cultivo de **${translateText(name)}**:`)
  parts.push('')

  // Infobox data
  const info = page.infobox
  if (info['Season']) parts.push(`🗓️ Estacao: **${translateText(info['Season'])}**`)
  if (info['Growth Time']) parts.push(`⏱️ Tempo de crescimento: **${translateText(info['Growth Time'])}**`)
  if (info['Seed Price']) parts.push(`🌱 Preco da semente: **${info['Seed Price']}**`)
  if (info['Sell Price']) parts.push(`💰 Preco de venda: **${info['Sell Price']}**`)
  if (info['Healing']) parts.push(`💚 Cura: **${info['Healing']}**`)

  // Growth stages
  const stagesSection = page.sections.find(s => /stage|grow/i.test(s.title))
  if (stagesSection) {
    parts.push('')
    parts.push('**Fases de crescimento:**')
    const translated = translateText(stagesSection.content.slice(0, 400))
    parts.push(translated)
  }

  // Tips
  parts.push('')
  if (info['Growth Time']) {
    const regrows = page.summary.toLowerCase().includes('regrow') || page.summary.toLowerCase().includes('continues')
    if (regrows) {
      parts.push('💡 Essa planta **volta a produzir** depois da primeira colheita — nao precisa replantar!')
    }
  }

  if (parts.length <= 2) {
    // Fallback: use summary
    parts.push(translateText(page.summary.slice(0, 500)))
  }

  return parts
}

function buildFishingResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []
  const translatedName = translateText(name)

  parts.push(`Sobre o **${translatedName}**:`)
  parts.push('')

  const info = page.infobox
  const hasInfobox = info['Location'] || info['Time'] || info['Season']

  if (hasInfobox) {
    if (info['Location']) parts.push(`📍 Onde pescar: **${translateText(info['Location'])}**`)
    if (info['Time']) parts.push(`🕐 Horario: **${translateText(info['Time'])}**`)
    if (info['Season']) parts.push(`🗓️ Estacao: **${translateText(info['Season'])}**`)
    if (info['Weather']) parts.push(`🌤️ Clima: **${translateText(info['Weather'])}**`)
    if (info['Difficulty']) parts.push(`⚡ Dificuldade: **${info['Difficulty']}**`)
    if (info['Behavior']) parts.push(`🐟 Comportamento: **${info['Behavior']}**`)
    if (info['Sell Price']) parts.push(`💰 Preco de venda: **${info['Sell Price']}**`)
  } else {
    // Extract key info from summary
    const summary = page.summary
    // Parse location from text
    const locationMatch = summary.match(/caught (?:in|at|on) (?:the )?([\w\s]+?)(?:\s+during|\s+in|\s*\.)/i)
    const seasonMatch = summary.match(/during\s+(Spring|Summer|Fall|Winter(?:\s+and\s+(?:Spring|Summer|Fall|Winter))*)/i)
    const timeMatch = summary.match(/(?:between|from)\s+(\d+\s*(?:am|pm))\s+(?:to|and|–)\s+(\d+\s*(?:am|pm))/i)

    if (locationMatch) parts.push(`📍 Onde pescar: **${translateText(locationMatch[1].trim())}**`)
    if (seasonMatch) parts.push(`🗓️ Estacao: **${translateText(seasonMatch[1])}**`)
    if (timeMatch) parts.push(`🕐 Horario: **${translateText(timeMatch[1])} ate ${translateText(timeMatch[2])}**`)

    // Show translated summary if we still have little info
    if (parts.length <= 2) {
      parts.push(translateText(summary.slice(0, 400)))
    }
  }

  parts.push('')
  parts.push('💡 Dica: use comida com buff de pesca (tipo Dish O\' The Sea ou Trout Soup) pra facilitar!')

  return parts
}

function buildCraftingResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []

  parts.push(`Sobre **${translateText(name)}**:`)
  parts.push('')

  const info = page.infobox
  if (info['Ingredients'] || info['Recipe Source']) {
    if (info['Ingredients']) parts.push(`🧱 Ingredientes: **${translateText(info['Ingredients'])}**`)
    if (info['Recipe Source']) parts.push(`📖 Como aprender: **${translateText(info['Recipe Source'])}**`)
  }

  const recipeSection = page.sections.find(s => /recipe|craft|ingredient/i.test(s.title))
  if (recipeSection) {
    parts.push('')
    parts.push(translateText(recipeSection.content.slice(0, 500)))
  }

  if (parts.length <= 2) {
    parts.push(translateText(page.summary.slice(0, 500)))
  }

  return parts
}

function buildGeneralResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []

  parts.push(`Sobre **${translateText(name)}**:`)
  parts.push('')

  // Translated summary
  const translatedSummary = translateText(page.summary.slice(0, 500))
  parts.push(translatedSummary)

  // Key infobox entries
  const importantKeys = ['Birthday', 'Address', 'Lives In', 'Season', 'Sell Price', 'Source', 'Location']
  const infoEntries = Object.entries(page.infobox)
    .filter(([k]) => importantKeys.some(ik => k.includes(ik)))

  if (infoEntries.length > 0) {
    parts.push('')
    parts.push('📋 **Info rapida:**')
    for (const [key, val] of infoEntries.slice(0, 6)) {
      parts.push(`  • ${translateText(key)}: ${translateText(val)}`)
    }
  }

  return parts
}

// ─── Main Answer Function ────────────────────────────────

export async function answerQuestion(question: string): Promise<string> {
  const ctx = analyzeQuestion(question)
  const searchTerms = extractSearchTerms(question.toLowerCase().trim())

  // Search the most relevant term first (NPC or subject)
  const priorityTerms = [
    ctx.npc,
    ctx.subject,
    ...searchTerms,
  ].filter((t): t is string => !!t)

  const uniqueTerms = [...new Set(priorityTerms)].slice(0, 3)

  for (const term of uniqueTerms) {
    const titles = await searchWiki(term)
    if (titles.length === 0) continue

    const page = await getPageContent(titles[0])
    if (!page) continue

    return buildConversationalResponse(question, page, ctx)
  }

  // Fallback with original question
  const titles = await searchWiki(question)
  if (titles.length > 0) {
    const page = await getPageContent(titles[0])
    if (page) {
      return buildConversationalResponse(question, page, ctx)
    }
  }

  // Friendly error
  const suggestions = [
    'Tenta com o nome em ingles (ex: "Strawberry" em vez de "morango")',
    'Ou pergunta algo como: "onde fica o Sebastian no inverno?" ou "o que a Abigail gosta?"',
  ]

  return `Hmm, nao encontrei nada sobre isso na wiki 😅\n\n${suggestions.join('\n')}`
}
