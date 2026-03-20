import type { VercelRequest, VercelResponse } from '@vercel/node'
import { answerQuestion } from '../server/wiki'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

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
