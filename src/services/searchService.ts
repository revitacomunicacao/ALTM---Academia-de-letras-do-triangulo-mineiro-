import { axiosClient } from "@/api/axiosClient";
import type { SearchResult, SearchResponse, SearchFilters } from "@/types/ISearch";
import type { IMembros } from "@/app/academicos/membros/types/IMembros";
import type { IArtigos, IArtigosId } from "@/app/artigos/types/IArtigos";
import type { Iblog, IblogId } from "@/app/home/types/IBlog";

export class SearchService {
  // Busca específica para artigos com conteúdo completo
  private static async searchInArtigos(query: string, signal?: AbortSignal): Promise<IArtigosId[]> {
    try {
      // Primeiro, busca a lista de artigos
      const { data: artigosList } = await axiosClient.get<IArtigos[]>('/artigos', { signal });
      
      // Para cada artigo, busca o conteúdo completo
      const artigosCompletos: IArtigosId[] = [];
      const searchText = query.toLowerCase().trim();
      
      for (const artigo of artigosList) {
        try {
          // Busca o artigo completo
          const { data: artigoCompleto } = await axiosClient.get<IArtigosId[]>(`/artigo/${artigo.id}`, { signal });
          const artigoData = Array.isArray(artigoCompleto) ? artigoCompleto[0] : artigoCompleto;
      
          if (artigoData) {
            // Verifica se a busca encontra algo no conteúdo completo
            const searchableFields = [
              artigoData.title,
              artigoData.conteudo,
              artigoData.resumo,
              artigoData.academico?.map(a => a.nome).join(' ')
            ];
            
            const found = searchableFields.some(field => {
              if (typeof field === 'string' && field.trim() !== '') {
                return field.toLowerCase().includes(searchText);
              }
              return false;
            });
            
            if (found) {
              artigosCompletos.push(artigoData);
            }
          }
        } catch (error) {
          console.warn(`Erro ao buscar artigo ${artigo.id}:`, error);
        }
      }
      
      return artigosCompletos;
    } catch (error) {
      console.warn('Erro ao buscar artigos:', error);
      return [];
    }
  }

  // Busca específica para blog com conteúdo completo
  private static async searchInBlog(query: string, signal?: AbortSignal): Promise<IblogId[]> {
    try {
      // Primeiro, busca a lista de posts do blog
      const { data: blogList } = await axiosClient.get<Iblog[]>('/blog', { signal });
      
      // Para cada post, busca o conteúdo completo
      const blogsCompletos: IblogId[] = [];
      const searchText = query.toLowerCase().trim();
      
      for (const blog of blogList) {
        try {
          // Busca o post completo
          const { data: blogCompleto } = await axiosClient.get<IblogId[]>(`/blog/${blog.id}`, { signal });
          const blogData = Array.isArray(blogCompleto) ? blogCompleto[0] : blogCompleto;
          
          if (blogData) {
            // Verifica se a busca encontra algo no conteúdo completo
            const searchableFields = [
              blogData.title,
              blogData.content,
              blogData.summary,
              blogData.excerpt,
              blogData.resumo
            ];
            
            const found = searchableFields.some(field => {
              if (typeof field === 'string' && field.trim() !== '') {
                return field.toLowerCase().includes(searchText);
              }
              return false;
            });
            
            if (found) {
              blogsCompletos.push(blogData);
            }
          }
        } catch (error) {
          console.warn(`Erro ao buscar blog ${blog.id}:`, error);
        }
      }
      
      return blogsCompletos;
    } catch (error) {
      console.warn('Erro ao buscar blog:', error);
      return [];
    }
  }

  private static async searchInEndpoint<T>(
    endpoint: string, 
    query: string,
    signal?: AbortSignal
  ): Promise<T[]> {
    try {
      // Busca todos os dados primeiro
      const { data } = await axiosClient.get<T[]>(endpoint, { signal });
      
      // Filtra localmente por sequência de caracteres no título e conteúdo completo
      const filteredData = data.filter((item: any) => {
        const searchText = query.toLowerCase().trim();
        
        // Campos para busca completa (título + todo conteúdo)
        const searchableFields = [
          // Campos de título/nome
          item.title,
          item.nome, 
          item.name,
          
          // Campos de conteúdo para membros (IMembros)
          item.biografia,
          item.textos_escolhidos,
          item.bibliografia,
          item.discurso_de_posse,
          item.expert,
          item.naturalidade,
          item.posicao,
          item.cadeira,
          
          // Campos de conteúdo para artigos (IArtigos/IArtigosId)
          item.conteudo,
          item.resumo,
          
          // Campos de conteúdo para blog (Iblog/IblogId)
          item.content,
          item.summary,
          item.excerpt,
          
          // Campos de acadêmico relacionado (para artigos)
          item.academico?.nome
        ];
        
        // Verifica se algum campo contém a sequência exata de caracteres
        return searchableFields.some(field => {
          if (typeof field === 'string' && field.trim() !== '') {
            return field.toLowerCase().includes(searchText);
          }
          return false;
        });
      });
      
      return filteredData;
    } catch (error) {
      console.warn(`Erro ao buscar em ${endpoint}:`, error);
      return [];
    }
  }

  private static normalizeResults(data: any[], type: SearchResult['type'], query?: string): SearchResult[] {
    return data.map(item => {
      let foundIn = '';
      let context = '';
      
      // Se temos uma query, vamos determinar onde foi encontrada
      if (query) {
        const searchText = query.toLowerCase().trim();
        
        // Verifica onde o termo foi encontrado (mantendo a ordem de prioridade)
        if (item.title?.toLowerCase().includes(searchText) || item.nome?.toLowerCase().includes(searchText)) {
          foundIn = 'title';
        } else if (item.biografia?.toLowerCase().includes(searchText)) {
          foundIn = 'biografia';
          context = this.extractContext(item.biografia, searchText);
        } else if (item.discurso_de_posse?.toLowerCase().includes(searchText)) {
          foundIn = 'discurso_de_posse';
          context = this.extractContext(item.discurso_de_posse, searchText);
        } else if (item.textos_escolhidos?.toLowerCase().includes(searchText)) {
          foundIn = 'textos_escolhidos';
          context = this.extractContext(item.textos_escolhidos, searchText);
        } else if (item.bibliografia?.toLowerCase().includes(searchText)) {
          foundIn = 'bibliografia';
          context = this.extractContext(item.bibliografia, searchText);
        } else if (item.conteudo?.toLowerCase().includes(searchText)) {
          foundIn = 'conteudo';
          context = this.extractContext(item.conteudo, searchText);
        } else if (item.content?.toLowerCase().includes(searchText)) {
          foundIn = 'conteudo';
          context = this.extractContext(item.content, searchText);
        } else if (item.resumo?.toLowerCase().includes(searchText)) {
          foundIn = 'resumo';
          context = this.extractContext(item.resumo, searchText);
        } else if (item.summary?.toLowerCase().includes(searchText)) {
          foundIn = 'resumo';
          context = this.extractContext(item.summary, searchText);
        } else if (item.excerpt?.toLowerCase().includes(searchText)) {
          foundIn = 'resumo';
          context = this.extractContext(item.excerpt, searchText);
        } else if (item.academico?.some && item.academico.some((a: any) => a.nome?.toLowerCase().includes(searchText))) {
          foundIn = 'academico';
          const academicoEncontrado = item.academico.find((a: any) => a.nome?.toLowerCase().includes(searchText));
          context = `Acadêmico: ${academicoEncontrado?.nome}`;
        }
      }

      return {
        id: item.id,
        title: item.title || item.nome || item.name,
        type,
        excerpt: item.expert || item.excerpt,
        resumo: item.resumo,
        summary: item.summary,
        slug: item.slug,
        link: item.link,
        image: item.foto || item.imagem_destacada,
        foto: item.foto,
        imagem_destacada: item.imagem_destacada,
        date: item.date || item.data_de_nascimento,
        academico: Array.isArray(item.academico) ? item.academico[0] : item.academico,
        cadeira: item.cadeira,
        posicao: item.posicao,
        foundIn,
        context
      };
    });
  }

  // Extrai contexto ao redor do termo encontrado
  private static extractContext(text: string, searchTerm: string, contextLength: number = 150): string {
    if (!text || !searchTerm) return '';
    
    const lowerText = text.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearchTerm);
    
    if (index === -1) return '';
    
    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(text.length, index + searchTerm.length + contextLength / 2);
    
    let context = text.substring(start, end);
    
    // Adiciona reticências se necessário
    if (start > 0) context = '...' + context;
    if (end < text.length) context = context + '...';
    
    return context;
  }

  static async universalSearch(
    query: string, 
    filters: SearchFilters = {},
    signal?: AbortSignal
  ): Promise<SearchResponse> {
    // Validação: query deve ter pelo menos 1 caractere para buscar
    if (!query.trim() || query.trim().length < 1) {
      return {
        membros: [],
        artigos: [],
        blog: [],
        presidentes: [],
        diretoria: [],
        sociosCorrespondentes: []
      };
    }

    const searchPromises: Promise<any>[] = [];
    const results: SearchResponse = {
      membros: [],
      artigos: [],
      blog: [],
      presidentes: [],
      diretoria: [],
      sociosCorrespondentes: []
    };

    // Se não especificou tipo ou quer buscar em todos
    if (!filters.type || filters.type === 'all') {
      searchPromises.push(
        // Membros
        this.searchInEndpoint<IMembros>('/membros', query, signal)
          .then(data => ({ type: 'membros' as const, data })),
        
        // Artigos (com conteúdo completo)
        this.searchInArtigos(query, signal)
          .then(data => ({ type: 'artigos' as const, data })),
        
        // Blog (com conteúdo completo)
        this.searchInBlog(query, signal)
          .then(data => ({ type: 'blog' as const, data }))
      );
    } else {
      // Busca específica por tipo
      if (filters.type === 'membro') {
        searchPromises.push(
          this.searchInEndpoint<IMembros>('/membros', query, signal)
            .then(data => ({ type: 'membros' as const, data }))
        );
      } else if (filters.type === 'artigo') {
        searchPromises.push(
          this.searchInArtigos(query, signal)
            .then(data => ({ type: 'artigos' as const, data }))
        );
      } else if (filters.type === 'blog') {
        searchPromises.push(
          this.searchInBlog(query, signal)
            .then(data => ({ type: 'blog' as const, data }))
        );
      }
    }

    try {
      const searchResults = await Promise.allSettled(searchPromises);
      
      searchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          const { type, data } = result.value;
          const searchResultType: SearchResult['type'] = type === 'membros' ? 'membro' :
            type === 'artigos' ? 'artigo' :
            type === 'blog' ? 'blog' :
            type === 'presidentes' ? 'presidente' :
            type === 'diretoria' ? 'diretoria' : 'socio-correspondente';
          
          // Type assertion para corrigir o erro
          (results as any)[type] = this.normalizeResults(data, searchResultType, query);
        }
      });

      // Aplicar limite se especificado
      if (filters.limit) {
        Object.keys(results).forEach(key => {
          const resultKey = key as keyof SearchResponse;
          results[resultKey] = results[resultKey].slice(0, filters.limit);
        });
      }

      return results;
    } catch (error) {
      console.error('Erro na busca universal:', error);
      return results;
    }
  }

  // Busca rápida que retorna resultados misturados
  static async quickSearch(query: string, limit: number = 6): Promise<SearchResult[]> {
    // Validação: query deve ter pelo menos 2 caracteres
    if (!query.trim() || query.trim().length < 2) {
      return [];
    }
    
    const results = await this.universalSearch(query, { limit: 2 });
    
    // Mistura apenas os resultados dos tipos permitidos
    const allResults: SearchResult[] = [
      ...results.membros,
      ...results.artigos,
      ...results.blog
    ];

    return allResults.slice(0, limit);
  }
}
