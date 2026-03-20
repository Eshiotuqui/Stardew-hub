import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Characters from './pages/Characters'
import Seasons from './pages/Seasons'
import Curiosities from './pages/Curiosities'
import CommunityCenter from './pages/CommunityCenter'
import WikiChat from './pages/WikiChat'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/personagens" element={<Characters />} />
          <Route path="/estacoes" element={<Seasons />} />
          <Route path="/centro-comunitario" element={<CommunityCenter />} />
          <Route path="/curiosidades" element={<Curiosities />} />
          <Route path="/wiki" element={<WikiChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
