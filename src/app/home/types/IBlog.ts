export interface Iblog {
  id: number;
  title: string;
  summary: string;
  resumo: string;
  imagem_destacada: string;
} 

export interface IblogId {
  id: number;
  title: string;
  content: string;
  summary: string;
  excerpt: string;
  resumo: string;
  categories: string[]
  imagem_destacada: string;
} 