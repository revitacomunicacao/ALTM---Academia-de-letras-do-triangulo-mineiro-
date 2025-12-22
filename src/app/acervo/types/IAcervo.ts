export interface IAcervoTituloItem {
  capa: string
  titulo: string
  autor: string
}

export interface IAcervo {
  id: number
  title: string
  description?: string
  imagem_topo: string
  titulos: IAcervoTituloItem[]
}