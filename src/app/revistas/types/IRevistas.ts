export type GalleryItem = string | { url?: string } | { sizes?: { full?: string } }

export interface IRevistaItem {
  titulo_da_revista: string
  capa: string

  // novo padrão:
  paginas?: string[] | GalleryItem[]

  // fallback (se o nome do campo no ACF ainda for "pdf"):
  pdf?: string[] | GalleryItem[]
}

export interface IRevistas {
  id: number
  title: string
  imagem_topo: string
  revistas: IRevistaItem[]
}
