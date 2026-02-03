export interface IJornalEcoItem {
  titulo_do_jornal: string
  capa: string
  pdf: string[] // galeria de páginas (urls)
}

export interface IJornalEco {
  id: number
  title: string
  imagem_topo: string
  revistas: IJornalEcoItem[]
}
