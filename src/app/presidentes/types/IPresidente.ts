export interface IPresidente {
  id: number,
  title: string,
  slug: string,
  link: string,
  periodo: string,
  presidente: {
    id: number,
    nome: string
  }
}