import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // Se houver hash (#secao), tenta rolar até o elemento
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""))
      if (el) {
        el.scrollIntoView({ block: "start" })
        return
      }
    }

    // Caso contrário, sempre volta ao topo ao trocar de rota
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname, search, hash])

  return null
}
