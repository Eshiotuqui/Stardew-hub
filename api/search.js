const WIKI_API = 'https://stardewvalleywiki.com/mediawiki/api.php'

async function searchWiki(query) {
  const params = new URLSearchParams({
    action: 'opensearch', search: query, limit: '5', namespace: '0', format: 'json',
  })
  const res = await fetch(`${WIKI_API}?${params}`)
  const data = await res.json()
  return data[1] || []
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  try {
    const query = req.query.q
    if (!query) { res.status(400).json({ error: 'Envie um termo de busca.' }); return }
    const results = await searchWiki(query)
    res.json({ results })
  } catch (error) {
    console.error('Erro:', error)
    res.status(500).json({ error: 'Erro ao buscar. Tente novamente.' })
  }
}
