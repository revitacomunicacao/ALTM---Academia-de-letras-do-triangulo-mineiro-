export interface IArtigos {
  id: number;
  title: string;
  date: string;
  resumo: string;
  academico: {
    id: number;
    nome: string;
    foto: string;
  }
}

export interface IArtigosId {
  id: number;
  title: string;
  date: string;
  conteudo: string;
  resumo: string;
  academico: {
    id: number;
    nome: string;
    foto: string;
  }[];
}