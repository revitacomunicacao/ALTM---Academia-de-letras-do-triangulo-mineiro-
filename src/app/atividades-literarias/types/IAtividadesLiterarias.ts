export interface IAtividadeLiterariaListItem {
  id: number
  title: string
  date?: string

  capa?: string | null
  resumo?: string
}

export interface IAtividadeLiterariaDetail extends IAtividadeLiterariaListItem {
  conteudo?: string
  galeria?: string[]
  midia?: string
}
