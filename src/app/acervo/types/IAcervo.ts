// src/app/acervo/types/IAcervo.ts
export interface IAcervoTituloItem {
  capa: string
  titulo: string
  autor: string
  pdf?: string
}

export interface IAcervo {
  id: number
  title: string
  description?: string
  imagem_topo: string
  titulos: IAcervoTituloItem[]
}
