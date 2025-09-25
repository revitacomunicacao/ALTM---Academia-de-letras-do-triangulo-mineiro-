export interface SearchResult {
  id: number;
  title: string;
  type: 'membro' | 'artigo' | 'blog' | 'presidente' | 'diretoria' | 'socio-correspondente';
  excerpt?: string;
  resumo?: string;
  summary?: string;
  slug?: string;
  link?: string;
  image?: string;
  foto?: string;
  imagem_destacada?: string;
  date?: string;
  academico?: {
    id: number;
    nome: string;
    foto: string;
  };
  cadeira?: string;
  posicao?: string;
  foundIn?: string; // Onde foi encontrado (biografia, discurso_de_posse, etc.)
  context?: string; // Contexto ao redor do termo encontrado
}

export interface SearchResponse {
  membros: SearchResult[];
  artigos: SearchResult[];
  blog: SearchResult[];
  presidentes: SearchResult[];
  diretoria: SearchResult[];
  sociosCorrespondentes: SearchResult[];
}

export interface SearchFilters {
  type?: 'all' | 'membro' | 'artigo' | 'blog' | 'presidente' | 'diretoria' | 'socio-correspondente';
  limit?: number;
}
