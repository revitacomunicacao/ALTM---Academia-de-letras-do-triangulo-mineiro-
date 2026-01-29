// types/IRevistas.ts
export interface IRevistaItem {
  titulo_da_revista: string
  capa?: string | null
  pdf?: string | null
}

export interface IRevistas {
  id: number
  title: string
  imagem_topo?: string | null
  revistas: IRevistaItem[]
}
