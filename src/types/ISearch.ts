export interface SearchResult {
  id: number;
  title: string;
  type:
    | 'membro'
    | 'artigo'
    | 'blog'
    | 'presidente'
    | 'diretoria'
    | 'socio-correspondente'
    | 'academia-regional'
    | 'atividade-literaria'
    | 'revista'
    | 'jornal-eco'
    | 'acervo';
  excerpt?: string;
  resumo?: string;
  summary?: string;
  slug?: string;
  link?: string;
  date?: string;
  image?: string;
  foto?: string;
  imagem_destacada?: string;
  foundIn?: string;
  autor?: string;
  url?: string;
}

export interface SearchResponse {
  membros: SearchResult[];
  artigos: SearchResult[];
  blog: SearchResult[];
  presidentes: SearchResult[];
  diretoria: SearchResult[];
  sociosCorrespondentes: SearchResult[];
  academiasRegionais: SearchResult[];
  atividadesLiterarias: SearchResult[];
  revistas: SearchResult[];
  jornalEco: SearchResult[];
  acervo: SearchResult[];
}

export interface SearchFilters {
  type?:
    | 'all'
    | 'membro'
    | 'artigo'
    | 'blog'
    | 'presidente'
    | 'diretoria'
    | 'socio-correspondente'
    | 'academia-regional'
    | 'atividade-literaria'
    | 'revista'
    | 'jornal-eco'
    | 'acervo';
  limit?: number;
}
