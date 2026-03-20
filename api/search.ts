import type { VercelRequest, VercelResponse } from '@vercel/node'
import { searchWiki } from '../server/wiki'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const query = req.query.q as string
    if (!query) {
      res.status(400).json({ error: 'Envie um termo de busca.' })
      return
    }

    const results = await searchWiki(query)
    res.json({ results })
  } catch (error) {
    console.error('Erro na busca:', error)
    res.status(500).json({ error: 'Erro ao buscar. Tente novamente.' })
  }
}
