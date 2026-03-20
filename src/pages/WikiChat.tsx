import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'user' | 'bot'
  content: string
  loading?: boolean
}

const SUGGESTIONS = [
  'Onde ta o Pierre na terca de inverno as 16h?',
  'O que a Abigail mais gosta de presente?',
  'Como plantar Ancient Fruit?',
  'Onde pesco o Sturgeon?',
  'Onde encontro o Sebastian no inverno?',
  'Como consigo Iridium?',
  'O que preciso pro bundle da Despensa?',
  'Rotina do Shane no verao',
]

const LOADING_MESSAGES = [
  'Consultando a wiki do vale...',
  'Procurando na biblioteca do museu...',
  'Perguntando pro Wizard...',
  'Vasculhando a wiki...',
  'Checando os arquivos do prefeito Lewis...',
]

// Em dev local com "npm run server" usa localhost:3001
// Na Vercel, usa a própria URL (relativa)
const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : ''

function formatMessage(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Wiki links
    .replace(/📎 Fonte: (https?:\/\/[^\s<]+)/g,
      '📎 <a href="$1" target="_blank" class="text-stardew-sky-dark underline hover:text-stardew-green transition-colors">Ver na wiki completa</a>')
    // Other URLs
    .replace(/(https?:\/\/[^\s<]+)/g, (match) => {
      if (match.includes('class=')) return match // already formatted
      return `<a href="${match}" target="_blank" class="text-stardew-sky-dark underline hover:text-stardew-green">${match}</a>`
    })
    // Line breaks
    .replace(/\n/g, '<br/>')
}

function randomLoadingMessage(): string {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
}

export default function WikiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      content: 'E ai, fazendeiro! 🌾\n\nEu busco informacoes direto da wiki oficial do Stardew Valley e trago tudo traduzido pra voce.\n\nPode perguntar sobre **personagens** (rotina, presentes), **plantacoes**, **pesca**, **crafting** e muito mais!\n\nEscolhe uma sugestao ai embaixo ou digita sua pergunta 👇',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: question.trim(),
    }

    const loadingMsg: Message = {
      id: Date.now() + 1,
      role: 'bot',
      content: randomLoadingMessage(),
      loading: true,
    }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      })

      const data = await res.json()

      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? { ...m, content: data.answer || data.error, loading: false }
            : m
        )
      )
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? {
                ...m,
                content: 'Opa, nao consegui conectar no servidor 😅\n\nVerifica se o backend ta rodando com:\n**npm run server**',
                loading: false,
              }
            : m
        )
      )
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="font-display text-stardew-wood text-base md:text-xl mb-1">
          🔍 Pergunte a Wiki
        </h1>
        <p className="text-gray-400 text-xs">
          Respostas em portugues, direto da wiki oficial
        </p>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 text-xs bg-white border-2 border-stardew-brown-light/20 rounded-full
                         text-stardew-wood hover:border-stardew-green hover:bg-stardew-green/5
                         hover:scale-105 transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scroll-smooth">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot avatar */}
            {msg.role === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stardew-green/20 flex items-center justify-center mr-2 mt-1">
                <span className="text-sm">{msg.loading ? '⏳' : '🌾'}</span>
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-stardew-green text-white rounded-br-sm'
                  : 'bg-white shadow-sm border border-gray-100 rounded-bl-sm'
              } ${msg.loading ? 'animate-pulse' : ''}`}
            >
              <div
                className={`text-sm leading-relaxed ${
                  msg.role === 'bot' ? 'text-gray-700' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stardew-sky/30 flex items-center justify-center ml-2 mt-1">
                <span className="text-sm">🧑‍🌾</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 bg-white rounded-2xl border-2 border-stardew-brown-light/20 p-1.5 focus-within:border-stardew-green transition-colors shadow-sm">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ex: onde ta o Pierre no inverno as 16h?"
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2 bg-stardew-green text-white font-display text-[10px] rounded-xl
                     hover:bg-stardew-green-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95"
        >
          {isLoading ? '⏳' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
