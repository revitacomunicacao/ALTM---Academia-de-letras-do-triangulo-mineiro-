export interface IRevistaItem {
  titulo_da_revista: string
  capa: string
  /** HTML com iframe/embed da plataforma de leitura */
  codigo: string
}

export interface IRevistas {
  id: number
  title: string
  imagem_topo: string
  revistas: IRevistaItem[]
}
