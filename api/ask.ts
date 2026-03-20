import type { VercelRequest, VercelResponse } from '@vercel/node'

// Dynamic import to handle ESM/CJS cheerio
async function getCheerio() {
  const mod = await import('cheerio')
  return mod.default || mod
}

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
  'Monday': 'Segunda', 'Tuesday': 'Terca', 'Wednesday': 'Quarta',
  'Thursday': 'Quinta', 'Friday': 'Sexta', 'Saturday': 'Sabado', 'Sunday': 'Domingo',
  'Spring': 'Primavera', 'Summer': 'Verao', 'Fall': 'Outono', 'Winter': 'Inverno',
  'Rain': 'Chuva', 'Sunny': 'Sol', 'Rainy': 'Chuvoso',
  'AM': 'h', 'PM': 'h',
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
  "Bridge": 'Ponte', "River": 'Rio', "Lake": 'Lago',
  "Forest": 'Floresta', "Mountain": 'Montanha', "Beach": 'Praia',
  "Desert": 'Deserto', "Farm": 'Fazenda', "Kitchen": 'Cozinha', "Bedroom": 'Quarto',
  'Love': 'Ama', 'Like': 'Gosta', 'Neutral': 'Neutro',
  'Dislike': 'Nao gosta', 'Hate': 'Odeia',
  'Address': 'Endereco', 'Birthday': 'Aniversario',
  'Lives In': 'Mora em', 'Marriage': 'Casamento',
  'Best Gifts': 'Melhores Presentes',
  'Family': 'Familia', 'Friends': 'Amigos', 'Friendship': 'Amizade',
  'Sell Price': 'Preco de Venda', 'Seed Price': 'Preco da Semente',
  'Growth Time': 'Tempo de Crescimento', 'Season': 'Estacao',
  'Source': 'Fonte', 'Healing': 'Cura',
  'Recipe Source': 'Fonte da Receita', 'Ingredients': 'Ingredientes',
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
  'Sturgeon': 'Esturjao', 'Salmon': 'Salmao', 'Eel': 'Enguia',
  'Squid': 'Lula', 'Catfish': 'Peixe-gato', 'Lobster': 'Lagosta',
  'Crab': 'Caranguejo', 'Octopus': 'Polvo',
  'Pufferfish': 'Baiacu', 'Legend': 'Legend (Lendario)',
  'Super Cucumber': 'Super Pepino',
  'Amethyst': 'Ametista', 'Diamond': 'Diamante',
  'Emerald': 'Esmeralda', 'Ruby': 'Rubi', 'Topaz': 'Topazio',
  'Jade': 'Jade', 'Aquamarine': 'Agua-marinha',
  'Prismatic Shard': 'Fragmento Prismatico',
  'Iridium Bar': 'Barra de Iridio', 'Gold Bar': 'Barra de Ouro',
  'Iron Bar': 'Barra de Ferro', 'Copper Bar': 'Barra de Cobre',
  'Truffle': 'Trufa', 'Honey': 'Mel', 'Wine': 'Vinho',
  'Beer': 'Cerveja', 'Cheese': 'Queijo', 'Mayonnaise': 'Maionese',
  'Cloth': 'Tecido', 'Wool': 'La', 'Milk': 'Leite',
  'Large Milk': 'Leite Grande', 'Egg': 'Ovo', 'Large Egg': 'Ovo Grande',
  'Duck Egg': 'Ovo de Pato', 'Void Egg': 'Ovo Vazio',
  'Truffle Oil': 'Oleo de Trufa', 'Goat Cheese': 'Queijo de Cabra',
  'Pale Ale': 'Pale Ale', 'Juice': 'Suco', 'Jelly': 'Geleia', 'Pickles': 'Picles',
  'Keg': 'Barril', 'Preserves Jar': 'Pote de Conserva',
  'Bee House': 'Colmeia', 'Loom': 'Tear',
  'Cheese Press': 'Prensa de Queijo', 'Oil Maker': 'Prensa de Oleo',
  'Mayonnaise Machine': 'Maquina de Maionese',
  'Crystalarium': 'Cristalarium', 'Seed Maker': 'Fabricante de Sementes',
  'Furnace': 'Fornalha', 'Recycling Machine': 'Recicladora', 'Greenhouse': 'Estufa',
  'Stands behind the counter of the general store': 'Fica atras do balcao do Armazem',
  'Goes to stand behind the counter of the general store': 'Vai pro balcao do Armazem',
  'Stands behind the counter': 'Fica atras do balcao',
  'Goes to bed': 'Vai dormir', 'Goes home': 'Vai pra casa',
  'Leaves home': 'Sai de casa', 'Goes to the kitchen': 'Vai pra cozinha',
  'Leaves the house': 'Sai de casa',
  'Walks to': 'Vai ate', 'Walks home': 'Volta pra casa',
  'Stands near': 'Fica perto de', 'Stands in': 'Fica em',
  'Stands at': 'Fica em', 'Stands by': 'Fica perto de',
  'Sits on the bench': 'Senta no banco',
  'Goes to the': 'Vai ate', 'Returns home': 'Volta pra casa',
  'Heads to': 'Vai pra', 'Heads home': 'Volta pra casa',
  'Fishing': 'Pescando', 'Working at': 'Trabalhando em',
  'living room': 'sala de estar', 'his house': 'casa dele', 'her house': 'casa dela',
  'the counter': 'o balcao', 'the store': 'a loja', 'the shop': 'a loja',
  'the clinic': 'a clinica', 'the saloon': 'o saloon',
  'behind the counter': 'atras do balcao',
  'All day': 'O dia todo', 'all day': 'o dia todo',
}

const wholeWordOnly = new Set([
  'Love', 'Like', 'Neutral', 'Dislike', 'Hate',
  'Farm', 'Bridge', 'River', 'Lake', 'Forest', 'Mountain', 'Beach', 'Desert',
  'Rain', 'Sunny', 'Rainy', 'Egg', 'Milk', 'Cloth', 'Wool', 'Friend', 'Friends',
])

function translateText(text: string): string {
  let result = text
  result = result.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (_, h, m, period) => {
    let hour = parseInt(h)
    if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0
    return `${hour}:${m}h`
  })
  const entries = Object.entries(enToPt).sort((a, b) => b[0].length - a[0].length)
  for (const [en, pt] of entries) {
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const needsBoundary = wholeWordOnly.has(en) || en.length <= 5
    const pattern = needsBoundary ? `\\b${escaped}\\b` : escaped
    result = result.replace(new RegExp(pattern, 'gi'), pt)
  }
  return result
}

// ─── PT -> EN Search Translation ─────────────────────────

const ptToEn: Record<string, string> = {
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
  'morango': 'Strawberry', 'abobora': 'Pumpkin', 'batata': 'Potato',
  'tomate': 'Tomato', 'milho': 'Corn', 'melao': 'Melon',
  'mirtilo': 'Blueberry', 'cranberry': 'Cranberry', 'berinjela': 'Eggplant',
  'couve-flor': 'Cauliflower', 'repolho': 'Red Cabbage',
  'girassol': 'Sunflower', 'pimenta': 'Hot Pepper', 'rabanete': 'Parsnip',
  'parsnip': 'Parsnip', 'lupulo': 'Hops', 'feijao': 'Green Bean',
  'alcachofra': 'Artichoke', 'inhame': 'Yam', 'uva': 'Grape',
  'ancient fruit': 'Ancient Fruit', 'starfruit': 'Starfruit',
  'cafe': 'Coffee Bean', 'arroz': 'Rice',
  'ametista': 'Amethyst', 'diamante': 'Diamond', 'esmeralda': 'Emerald',
  'rubi': 'Ruby', 'topazio': 'Topaz', 'jade': 'Jade',
  'trufa': 'Truffle', 'mel': 'Honey', 'vinho': 'Wine',
  'cerveja': 'Beer', 'queijo': 'Cheese', 'maionese': 'Mayonnaise',
  'prismatic shard': 'Prismatic Shard', 'prismatico': 'Prismatic Shard',
  'fragmento prismatico': 'Prismatic Shard',
  'esturjao': 'Sturgeon', 'salmao': 'Salmon', 'enguia': 'Eel', 'lula': 'Squid',
  'pufferfish': 'Pufferfish', 'baiacu': 'Pufferfish',
  'peixe-gato': 'Catfish', 'lagosta': 'Lobster', 'polvo': 'Octopus',
  'minas': 'The Mines', 'skull cavern': 'Skull Cavern',
  'caverna da caveira': 'Skull Cavern', 'deserto': 'Calico Desert',
  'praia': 'The Beach', 'floresta': 'Cindersap Forest',
  'montanha': 'The Mountain', 'esgoto': 'The Sewers',
  'ilha': 'Ginger Island', 'ilha do gengibre': 'Ginger Island',
  'fazenda': 'The Farm', 'cidade': 'Pelican Town',
  'estufa': 'Greenhouse', 'centro comunitario': 'Bundles', 'bundles': 'Bundles',
  'barril': 'Keg', 'pesca': 'Fishing', 'mineracao': 'Mining',
  'agricultura': 'Farming', 'cozinha': 'Cooking',
  'primavera': 'Spring', 'verao': 'Summer', 'outono': 'Fall', 'inverno': 'Winter',
}

// ─── Wiki API ────────────────────────────────────────────

async function searchWiki(query: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'opensearch', search: query, limit: '5', namespace: '0', format: 'json',
  })
  const res = await fetch(`${WIKI_API}?${params}`)
  const data = await res.json() as any[]
  return data[1] || []
}

async function getPageContent(title: string): Promise<WikiResult | null> {
  const cheerio = await getCheerio()

  const params = new URLSearchParams({
    action: 'parse', page: title, prop: 'text', format: 'json',
  })
  const res = await fetch(`${WIKI_API}?${params}`)
  const data = await res.json() as any

  if (data.error) return null
  const html = data.parse?.text?.['*']
  if (!html) return null

  const $ = cheerio.load(html)
  $('.mw-editsection, .reference, script, style, .toc, .navbox').remove()

  const infobox: Record<string, string> = {}
  $('.infobox tr, .infoboxtable tr').each((_: number, row: any) => {
    const key = $(row).find('th, td:first-child').first().text().trim()
    const val = $(row).find('td:last-child').text().trim()
    if (key && val && key !== val) infobox[key] = val
  })

  const schedules: Record<string, ScheduleEntry[]> = {}
  let currentScheduleLabel = ''

  $('.mw-parser-output').children().each((_: number, el: any) => {
    const tag = el.tagName || el.name
    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = $(el).text().trim()
      if (text.toLowerCase().includes('schedule') || currentScheduleLabel) {
        currentScheduleLabel = text
      }
    }
    if (tag === 'table' && currentScheduleLabel) {
      const entries: ScheduleEntry[] = []
      $(el).find('tr').each((_: number, row: any) => {
        const cells: string[] = []
        $(row).find('td').each((_: number, cell: any) => {
          cells.push($(cell).text().trim())
        })
        if (cells.length >= 2) {
          entries.push({ time: cells[0], location: cells.slice(1).join(' - ') })
        }
      })
      if (entries.length > 0) schedules[currentScheduleLabel] = entries
    }
    if (tag === 'h2' && !$(el).text().toLowerCase().includes('schedule')) {
      currentScheduleLabel = ''
    }
  })

  const gifts = { loved: [] as string[], liked: [] as string[], neutral: [] as string[], disliked: [] as string[], hated: [] as string[] }
  let inGiftSection = false
  let currentGiftCategory: keyof typeof gifts | null = null

  $('.mw-parser-output').children().each((_: number, el: any) => {
    const tag = el.tagName || el.name
    const text = $(el).text().trim().toLowerCase()
    if (tag === 'h2') { inGiftSection = text.includes('gift'); currentGiftCategory = null }
    if (tag === 'h3' && inGiftSection) {
      if (text.includes('love') || text.includes('best')) currentGiftCategory = 'loved'
      else if (text.includes('like')) currentGiftCategory = 'liked'
      else if (text.includes('neutral')) currentGiftCategory = 'neutral'
      else if (text.includes('dislike')) currentGiftCategory = 'disliked'
      else if (text.includes('hate')) currentGiftCategory = 'hated'
    }
    if (currentGiftCategory && inGiftSection && (tag === 'ul' || tag === 'div' || tag === 'table')) {
      const excludeTerms = new Set([
        'friendship', 'friends', 'villager', 'villagers', 'universal',
        'gift', 'gifts', 'birthday', 'cooking', 'mining', 'farming',
        'fishing', 'combat', 'foraging', 'artisan', 'quality',
      ])
      $(el).find('a').each((_: number, link: any) => {
        const itemName = $(link).attr('title') || $(link).text().trim()
        if (itemName && itemName.length > 1 && itemName.length < 40
            && !excludeTerms.has(itemName.toLowerCase())
            && !/^(All |Most |Some |Universal|Category)/i.test(itemName)) {
          gifts[currentGiftCategory!].push(itemName)
        }
      })
    }
  })

  if (gifts.loved.length === 0) {
    const bestGiftsVal = infobox['Best Gifts'] || infobox['Loved Gifts'] || ''
    if (bestGiftsVal) gifts.loved = bestGiftsVal.split(/[,;]/).map(s => s.trim()).filter(Boolean)
  }

  const sections: WikiSection[] = []
  let currentTitle = 'Introducao'
  let currentContent: string[] = []
  const pushSection = () => {
    const text = currentContent.join('\n').trim()
    if (text) sections.push({ title: currentTitle, content: text })
    currentContent = []
  }

  $('.mw-parser-output').children().each((_: number, el: any) => {
    const tag = el.tagName || el.name
    if (tag === 'h2' || tag === 'h3') { pushSection(); currentTitle = $(el).text().trim() }
    else if (tag === 'p') { const text = $(el).text().trim(); if (text) currentContent.push(text) }
    else if (tag === 'ul' || tag === 'ol') {
      $(el).find('li').each((_: number, li: any) => {
        const text = $(li).text().trim(); if (text) currentContent.push(`• ${text}`)
      })
    } else if (tag === 'table' && !$(el).hasClass('infobox') && !$(el).hasClass('infoboxtable')) {
      const rows: string[] = []
      $(el).find('tr').each((_: number, row: any) => {
        const cells: string[] = []
        $(row).find('th, td').each((_: number, cell: any) => { cells.push($(cell).text().trim()) })
        if (cells.length > 0) rows.push(cells.join(' | '))
      })
      if (rows.length > 0) currentContent.push(rows.join('\n'))
    }
  })
  pushSection()

  return {
    title: data.parse.title,
    url: `${WIKI_BASE}/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    summary: sections[0]?.content.slice(0, 500) || '',
    sections, infobox, schedules, gifts,
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

  let season: string | null = null
  if (/primavera|spring/.test(q)) season = 'Spring'
  else if (/verao|summer/.test(q)) season = 'Summer'
  else if (/outono|fall|autumn/.test(q)) season = 'Fall'
  else if (/inverno|winter/.test(q)) season = 'Winter'

  let day: string | null = null
  if (/segunda/.test(q)) day = 'Monday'
  else if (/terca/.test(q)) day = 'Tuesday'
  else if (/quarta/.test(q)) day = 'Wednesday'
  else if (/quinta/.test(q)) day = 'Thursday'
  else if (/sexta/.test(q)) day = 'Friday'
  else if (/sabado/.test(q)) day = 'Saturday'
  else if (/domingo/.test(q)) day = 'Sunday'

  let time: string | null = null
  const timeMatch = q.match(/(\d{1,2})\s*(?:h|:00|hora)/)
  if (timeMatch) time = timeMatch[1]

  let npc: string | null = null
  let subject: string | null = null
  const sortedEntries = Object.entries(ptToEn).sort((a, b) => b[0].length - a[0].length)
  for (const [pt, en] of sortedEntries) {
    if (q.includes(pt)) {
      const isNpc = /^[A-Z][a-z]+$/.test(en) && en.length > 2 && !['Spring', 'Summer', 'Fall', 'Winter', 'Fishing', 'Mining', 'Farming', 'Cooking'].includes(en)
      if (isNpc && !npc) npc = en
      else if (!subject) subject = en
    }
  }
  return { types, season, day, time, npc, subject }
}

function extractSearchTerms(question: string): string[] {
  const stopWords = new Set([
    'onde', 'como', 'quando', 'qual', 'quais', 'que', 'quem',
    'posso', 'encontrar', 'achar', 'pegar', 'conseguir', 'plantar',
    'fica', 'esta', 'estao', 'tem', 'fazer', 'dar', 'para',
    'o', 'a', 'os', 'as', 'de', 'do', 'da', 'dos', 'das',
    'um', 'uma', 'no', 'na', 'nos', 'nas', 'em', 'e', 'eh',
    'eu', 'me', 'se', 'ao', 'por', 'com', 'mais', 'melhor',
    'gosta', 'presente', 'favorito', 'favorita', 'sobre', 'info',
    'dica', 'dicas', 'tipo', 'vai', 'vou', 'quero', 'saber',
    'hora', 'horario', 'dia', 'noite',
  ])
  const cleaned = question.replace(/[?!.,;:'"]/g, '').toLowerCase()
  const terms: string[] = []
  const sortedEntries = Object.entries(ptToEn).sort((a, b) => b[0].length - a[0].length)
  for (const [pt, en] of sortedEntries) { if (cleaned.includes(pt)) terms.push(en) }
  if (terms.length > 0) return [...new Set(terms)].slice(0, 3)
  const words = cleaned.split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w))
  for (const w of words) {
    if (ptToEn[w]) terms.push(ptToEn[w])
    else terms.push(w.charAt(0).toUpperCase() + w.slice(1))
  }
  return [...new Set(terms)].slice(0, 3)
}

// ─── Response Builder ────────────────────────────────────

function buildResponse(question: string, page: WikiResult, ctx: QuestionContext): string {
  const name = page.title
  const parts: string[] = []

  if (ctx.types.includes('schedule')) parts.push(...buildScheduleResponse(page, ctx, name))
  if (ctx.types.includes('gifts')) parts.push(...buildGiftResponse(page, name))
  if (ctx.types.includes('farming')) parts.push(...buildFarmingResponse(page, name))
  if (ctx.types.includes('fishing')) parts.push(...buildFishingResponse(page, name))
  if (ctx.types.includes('crafting')) parts.push(...buildCraftingResponse(page, name))
  if (ctx.types.includes('general') || parts.length === 0) parts.push(...buildGeneralResponse(page, name))

  parts.push(`\n📎 Fonte: ${page.url}`)
  return parts.join('\n')
}

function buildScheduleResponse(page: WikiResult, ctx: QuestionContext, name: string): string[] {
  const parts: string[] = []
  const seasonPt = ctx.season ? (enToPt[ctx.season] || ctx.season) : null
  const dayPt = ctx.day ? (enToPt[ctx.day] || ctx.day) : null

  if (Object.keys(page.schedules).length === 0 && !page.sections.find(s => s.title.toLowerCase().includes('schedule'))) {
    const address = page.infobox['Address'] || page.infobox['Lives In'] || ''
    if (address) parts.push(`O **${name}** geralmente fica em **${translateText(address)}**.`)
    else parts.push(`Nao encontrei um horario detalhado para **${name}** na wiki.`)
    return parts
  }

  if (seasonPt && dayPt && ctx.time) parts.push(`Sobre o **${name}** na ${dayPt}-feira, ${ctx.time}h, no ${seasonPt}:`)
  else if (seasonPt) parts.push(`Sobre a rotina do **${name}** no ${seasonPt}:`)
  else if (ctx.time) parts.push(`Sobre onde o **${name}** esta as ${ctx.time}h:`)
  else parts.push(`Sobre a rotina do **${name}**:`)
  parts.push('')

  const scheduleKeys = Object.keys(page.schedules)
  let relevantSchedules: [string, ScheduleEntry[]][] = []
  if (ctx.season) {
    relevantSchedules = scheduleKeys
      .filter(k => k.toLowerCase().includes(ctx.season!.toLowerCase()))
      .map(k => [k, page.schedules[k]])
  }
  if (relevantSchedules.length === 0) {
    relevantSchedules = scheduleKeys.slice(0, 3).map(k => [k, page.schedules[k]])
  }

  if (relevantSchedules.length > 0) {
    for (const [label, entries] of relevantSchedules.slice(0, 2)) {
      parts.push(`**${translateText(label)}:**`)
      for (const entry of entries.slice(0, 6)) {
        parts.push(`  • ${translateText(entry.time)} → ${translateText(entry.location)}`)
      }
      parts.push('')
    }
    if (ctx.time) {
      const hour = parseInt(ctx.time)
      const foundEntry = relevantSchedules[0]?.[1]?.find(e => {
        const match = e.time.match(/(\d{1,2})/)
        return match && Math.abs(parseInt(match[1]) - hour) <= 1
      })
      if (foundEntry) parts.push(`👉 Por volta das ${ctx.time}h, ele(a) deve estar em **${translateText(foundEntry.location)}**.`)
    }
  } else {
    const scheduleSection = page.sections.find(s => s.title.toLowerCase().includes('schedule'))
    if (scheduleSection) parts.push(translateText(scheduleSection.content.slice(0, 600)))
  }

  const address = page.infobox['Address'] || page.infobox['Lives In'] || ''
  if (address) parts.push(`\n🏠 Mora em: **${translateText(address)}**`)
  return parts
}

function buildGiftResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []
  parts.push(`Sobre os presentes do **${name}**:`)
  parts.push('')
  const { gifts } = page
  if (gifts.loved.length > 0 || gifts.liked.length > 0) {
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
    if (gifts.hated.length > 0) {
      parts.push('💔 **ODEIA:**')
      gifts.hated.slice(0, 5).forEach(item => parts.push(`  • ${translateText(item)}`))
      parts.push('')
    }
    if (gifts.loved.length > 0) {
      parts.push(`👉 Dica: da **${translateText(gifts.loved[0])}** — ele(a) ama!`)
    }
  } else {
    parts.push('Nao encontrei dados de presentes na wiki pra esse personagem.')
  }
  const birthday = page.infobox['Birthday']
  if (birthday) {
    parts.push(`\n🎂 Aniversario: **${translateText(birthday)}**`)
    parts.push(`💡 No aniversario, presentes valem **8x** mais amizade!`)
  }
  return parts
}

function buildFarmingResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []
  parts.push(`Sobre o cultivo de **${translateText(name)}**:`)
  parts.push('')
  const info = page.infobox
  if (info['Season']) parts.push(`🗓️ Estacao: **${translateText(info['Season'])}**`)
  if (info['Growth Time']) parts.push(`⏱️ Tempo de crescimento: **${translateText(info['Growth Time'])}**`)
  if (info['Seed Price']) parts.push(`🌱 Preco da semente: **${info['Seed Price']}**`)
  if (info['Sell Price']) parts.push(`💰 Preco de venda: **${info['Sell Price']}**`)
  if (parts.length <= 2) parts.push(translateText(page.summary.slice(0, 500)))
  return parts
}

function buildFishingResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []
  parts.push(`Sobre o **${translateText(name)}**:`)
  parts.push('')
  const info = page.infobox
  if (info['Location']) parts.push(`📍 Onde pescar: **${translateText(info['Location'])}**`)
  if (info['Time']) parts.push(`🕐 Horario: **${translateText(info['Time'])}**`)
  if (info['Season']) parts.push(`🗓️ Estacao: **${translateText(info['Season'])}**`)
  if (info['Sell Price']) parts.push(`💰 Preco de venda: **${info['Sell Price']}**`)
  if (parts.length <= 2) parts.push(translateText(page.summary.slice(0, 400)))
  return parts
}

function buildCraftingResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []
  parts.push(`Sobre **${translateText(name)}**:`)
  parts.push('')
  const info = page.infobox
  if (info['Ingredients']) parts.push(`🧱 Ingredientes: **${translateText(info['Ingredients'])}**`)
  if (info['Recipe Source']) parts.push(`📖 Como aprender: **${translateText(info['Recipe Source'])}**`)
  if (parts.length <= 2) parts.push(translateText(page.summary.slice(0, 500)))
  return parts
}

function buildGeneralResponse(page: WikiResult, name: string): string[] {
  const parts: string[] = []
  parts.push(`Sobre **${translateText(name)}**:`)
  parts.push('')
  parts.push(translateText(page.summary.slice(0, 500)))
  const importantKeys = ['Birthday', 'Address', 'Lives In', 'Season', 'Sell Price', 'Source', 'Location']
  const infoEntries = Object.entries(page.infobox).filter(([k]) => importantKeys.some(ik => k.includes(ik)))
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

async function answerQuestion(question: string): Promise<string> {
  const ctx = analyzeQuestion(question)
  const searchTerms = extractSearchTerms(question.toLowerCase().trim())
  const priorityTerms = [ctx.npc, ctx.subject, ...searchTerms].filter((t): t is string => !!t)
  const uniqueTerms = [...new Set(priorityTerms)].slice(0, 3)

  for (const term of uniqueTerms) {
    const titles = await searchWiki(term)
    if (titles.length === 0) continue
    const page = await getPageContent(titles[0])
    if (!page) continue
    return buildResponse(question, page, ctx)
  }

  const titles = await searchWiki(question)
  if (titles.length > 0) {
    const page = await getPageContent(titles[0])
    if (page) return buildResponse(question, page, ctx)
  }

  return `Hmm, nao encontrei nada sobre isso na wiki 😅\n\nTenta com o nome em ingles (ex: "Strawberry" em vez de "morango")\nOu pergunta algo como: "onde fica o Sebastian no inverno?" ou "o que a Abigail gosta?"`
}

// ─── Handler ─────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  try {
    const { question } = req.body
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Envie uma pergunta valida.' })
      return
    }
    const answer = await answerQuestion(question.trim())
    res.json({ answer })
  } catch (error) {
    console.error('Erro ao buscar na wiki:', error)
    res.status(500).json({ error: 'Erro ao consultar a wiki. Tente novamente.' })
  }
}
