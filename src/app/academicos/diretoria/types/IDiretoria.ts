export interface IDiretoria {
  id: number;
  title: string;
  slug: string;
  diretoria: {
    cargo: string;
    membro: {
      id: number;
      nome: string;
    };
  }[]
}