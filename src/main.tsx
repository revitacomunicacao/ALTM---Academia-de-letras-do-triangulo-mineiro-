import ReactDOM from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from 'virtual:generated-pages-react'
import './index.css'
import { Header } from './layout/Header'
import { Footer } from './layout/Footer'

function App() {
  return useRoutes(routes)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/desenvolvimento/altm">
    <Header />
    <App />
    <Footer />
  </BrowserRouter>
)
