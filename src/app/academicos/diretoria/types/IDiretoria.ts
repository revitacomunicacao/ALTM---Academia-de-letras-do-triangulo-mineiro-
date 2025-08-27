export interface IDiretoria {
  id: number;
  title: string;
  slug: string;
  link: string;
  membro: {
    id: number;
    nome: string;
    cadeira: string;
  }
}