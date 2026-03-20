import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // Test 1: basic response
    const info: Record<string, string> = {
      node: process.version,
      hasFetch: typeof fetch !== 'undefined' ? 'yes' : 'no',
    }

    // Test 2: cheerio import
    try {
      const cheerio = await import('cheerio')
      info.cheerioKeys = Object.keys(cheerio).slice(0, 5).join(', ')
      info.hasLoad = typeof cheerio.load === 'function' ? 'yes' : 'no'
      if (!info.hasLoad) {
        const def = (cheerio as any).default
        info.defaultKeys = def ? Object.keys(def).slice(0, 5).join(', ') : 'no default'
        info.defaultHasLoad = def && typeof def.load === 'function' ? 'yes' : 'no'
      }
    } catch (e: any) {
      info.cheerioError = e.message
    }

    // Test 3: fetch wiki
    try {
      const r = await fetch('https://stardewvalleywiki.com/mediawiki/api.php?action=opensearch&search=Abigail&limit=1&format=json')
      const d = await r.json()
      info.wikiResult = JSON.stringify(d).slice(0, 100)
    } catch (e: any) {
      info.fetchError = e.message
    }

    res.json(info)
  } catch (e: any) {
    res.status(500).json({ error: e.message, stack: e.stack?.slice(0, 300) })
  }
}
