import express from 'express'
import cors from 'cors'
import { answerQuestion, searchWiki } from './wiki'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/ask', async (req, res) => {
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
})

app.get('/api/search', async (req, res) => {
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
})

app.listen(PORT, () => {
  console.log(`🌾 Stardew Wiki API rodando em http://localhost:${PORT}`)
})
