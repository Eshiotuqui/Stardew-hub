export default async function handler(req, res) {
  try {
    const info = { node: process.version }

    try {
      const cheerio = await import('cheerio')
      info.cheerioType = typeof cheerio
      info.cheerioKeys = Object.keys(cheerio).slice(0, 8).join(', ')
      info.loadType = typeof cheerio.load
    } catch (e) {
      info.cheerioError = e.message
    }

    try {
      const r = await fetch('https://stardewvalleywiki.com/mediawiki/api.php?action=opensearch&search=Abigail&limit=1&format=json')
      const d = await r.json()
      info.wiki = JSON.stringify(d).slice(0, 100)
    } catch (e) {
      info.fetchError = e.message
    }

    res.json(info)
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack?.slice(0, 500) })
  }
}
