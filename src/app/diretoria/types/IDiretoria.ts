export interface IDiretoria {
  post: {
    id: number;
    title: string;
    slug: string;
  };
  diretoria: {
    cargo: string;
    membro: {
      id: number;
      nome: string;
      cadeira?: string;
    };
  }[];
  diretoria_fundadores: {
    cargo: string;
    membro: {
      id: number;
      nome: string;
    };
  }[];
}