import ReactDOM from "react-dom/client"
import { BrowserRouter, useRoutes } from "react-router-dom"
import routes from "virtual:generated-pages-react"
import "./index.css"
import { Header } from "./layout/Header"
import { Footer } from "./layout/Footer"
import { ScrollToTop } from "./components/ScrollToTop"

function App() {
  return useRoutes(routes)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <Header />
    <App />
    <Footer />
  </BrowserRouter>
)
