import { axiosClient } from "@/api/axiosClient";
import type { SearchResult, SearchResponse, SearchFilters } from "@/types/ISearch";

import type { IMembros } from "@/app/academicos/membros/types/IMembros";
import type { IArtigos, IArtigosId } from "@/app/artigos/types/IArtigos";
import type { Iblog, IblogId } from "@/app/home/types/IBlog";

// Observação importante:
// Este serviço consolida a busca global do site. Conforme novos endpoints são adicionados,
// basta incluir um "searchIn..." aqui e adicioná-lo ao Promise.all do searchAll().

export class SearchService {
  private static normalizeText(text: string): string {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // =============================
  // Artigos (com conteúdo completo)
  // =============================
  private static async searchInArtigos(query: string, signal?: AbortSignal): Promise<IArtigosId[]> {
    try {
      const { data: artigosList } = await axiosClient.get<IArtigos[]>("/artigos", { signal });

      const artigosCompletos: IArtigosId[] = [];
      const searchText = this.normalizeText(query);

      for (const artigo of artigosList) {
        try {
          const { data: artigoCompleto } = await axiosClient.get<IArtigosId[]>(
            `/artigo/${artigo.id}`,
            { signal },
          );

          if (artigoCompleto && artigoCompleto[0]) {
            artigosCompletos.push(artigoCompleto[0]);
          }
        } catch (error) {
          // Se falhar ao buscar o detalhe, ignora e segue
          console.warn(`Erro ao buscar artigo completo ${artigo.id}:`, error);
        }
      }

      return artigosCompletos.filter((artigo) => {
        const textoCompleto = this.normalizeText(
          `${artigo.title} ${artigo.resumo || ""} ${artigo.conteudo || ""}`,
        );
        return textoCompleto.includes(searchText);
      });
    } catch (error) {
      console.error("Erro ao buscar artigos:", error);
      return [];
    }
  }

  // =============================
  // Blog (com conteúdo completo)
  // =============================
  private static async searchInBlog(query: string, signal?: AbortSignal): Promise<IblogId[]> {
    try {
      const { data: blogList } = await axiosClient.get<Iblog[]>("/blog", { signal });

      const blogCompletos: IblogId[] = [];
      const searchText = this.normalizeText(query);

      for (const post of blogList) {
        try {
          const { data: postCompleto } = await axiosClient.get<IblogId[]>(`/blog/${post.id}`, {
            signal,
          });

          if (postCompleto && postCompleto[0]) {
            blogCompletos.push(postCompleto[0]);
          }
        } catch (error) {
          console.warn(`Erro ao buscar post completo ${post.id}:`, error);
        }
      }

      return blogCompletos.filter((post) => {
        const textoCompleto = this.normalizeText(`${post.title} ${post.resumo || ""} ${post.conteudo || ""}`);
        return textoCompleto.includes(searchText);
      });
    } catch (error) {
      console.error("Erro ao buscar blog:", error);
      return [];
    }
  }

  // =============================
  // Membros
  // =============================
  private static async searchInMembros(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/membros");
      const membros = response.data as IMembros[];

      const matchingMembros = (membros || []).filter((membro) => {
        const haystack = this.normalizeText(`${membro.nome} ${membro.biografia || ""} ${membro.cargo || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matchingMembros.map((membro) => ({
        id: membro.id,
        title: membro.nome,
        type: "membro" as const,
        excerpt: membro.cargo,
        content: membro.biografia,
        foto: membro.foto,
      }));
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
      return [];
    }
  }

  // =============================
  // Presidentes
  // =============================
  private static async searchInPresidentes(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/presidentes");
      const presidentes = response.data;

      const matching = (presidentes || []).filter((p: any) => {
        const haystack = this.normalizeText(`${p.title} ${p.description || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matching.map((p: any) => ({
        id: p.id,
        title: p.title,
        type: "presidente" as const,
        excerpt: p.description,
        content: p.description,
      }));
    } catch (error) {
      console.error("Erro ao buscar presidentes:", error);
      return [];
    }
  }

  // =============================
  // Diretoria
  // =============================
  private static async searchInDiretoria(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/diretoria");
      const diretoria = response.data;

      const matching = (diretoria || []).filter((d: any) => {
        const haystack = this.normalizeText(`${d.title} ${d.description || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matching.map((d: any) => ({
        id: d.id,
        title: d.title,
        type: "diretoria" as const,
        excerpt: d.description,
        content: d.description,
      }));
    } catch (error) {
      console.error("Erro ao buscar diretoria:", error);
      return [];
    }
  }

  // =============================
  // Sócios Correspondentes (lista + detalhe)
  // =============================
  private static async searchInSociosCorrespondentes(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/socios-correspondentes");
      const socios = response.data;

      // 1) filtra para reduzir chamadas
      const matchingSocios = (socios || []).filter((socio: any) => {
        const haystack = this.normalizeText(`${socio.title} ${socio.resumo || socio.description || ""}`);
        return haystack.includes(normalizedQuery);
      });

      // 2) busca detalhe para conteúdo completo
      const socioDetailsPromises = matchingSocios.map(async (socio: any) => {
        try {
          const detailResponse = await axiosClient.get(`/socio-correspondente/${socio.id}`);
          const detail = Array.isArray(detailResponse.data) ? detailResponse.data[0] : detailResponse.data;

          return {
            ...socio,
            description: detail?.description || socio.description,
            resumo: detail?.resumo || socio.resumo,
            foto: detail?.foto || socio.foto,
          };
        } catch {
          return socio;
        }
      });

      const detailedSocios = await Promise.all(socioDetailsPromises);

      // 3) re-filtra incluindo conteúdo completo
      const final = detailedSocios.filter((socio: any) => {
        const haystack = this.normalizeText(`${socio.title} ${socio.resumo || ""} ${socio.description || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return final.map((socio: any) => ({
        id: socio.id,
        title: socio.title,
        type: "socio-correspondente" as const,
        excerpt: socio.resumo || socio.description,
        content: socio.description,
        foto: socio.foto,
      }));
    } catch (error) {
      console.error("Erro ao buscar sócios correspondentes:", error);
      return [];
    }
  }

  // =============================
  // Academias Regionais
  // =============================
  private static async searchInAcademiasRegionais(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/academias-regionais");
      const page = Array.isArray(response.data) ? response.data[0] : response.data;
      const academias = page?.academias ?? [];

      const matching = academias.filter((a: any) => {
        const haystack = this.normalizeText(`${a?.nome || ""} ${a?.informacoes || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matching.map((a: any, idx: number) => ({
        // academias não possuem id; usamos índice (estável dentro da resposta)
        id: typeof a?.id === "number" ? a.id : idx,
        title: a?.nome || "Academia Regional",
        type: "academia-regional" as const,
        excerpt: a?.informacoes,
        content: a?.informacoes,
        foto: a?.foto,
        url: "/academias-regionais",
      }));
    } catch (error) {
      console.error("Erro ao buscar academias regionais:", error);
      return [];
    }
  }

  // =============================
  // Atividades Literárias (lista + detalhe)
  // =============================
  private static async searchInAtividadesLiterarias(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/atividades-literarias");
      const list = response.data;

      const matching = (list || []).filter((p: any) => {
        const haystack = this.normalizeText(`${p?.title || ""} ${p?.resumo || ""}`);
        return haystack.includes(normalizedQuery);
      });

      const detailPromises = matching.map(async (p: any) => {
        try {
          const detailResp = await axiosClient.get(`/atividades-literarias/${p.id}`);
          const detail = Array.isArray(detailResp.data) ? detailResp.data[0] : detailResp.data;
          return { ...p, ...detail };
        } catch {
          return p;
        }
      });

      const detailed = await Promise.all(detailPromises);

      const final = detailed.filter((p: any) => {
        const haystack = this.normalizeText(`${p?.title || ""} ${p?.resumo || ""} ${p?.conteudo || ""} ${p?.midia || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return final.map((p: any) => ({
        id: p.id,
        title: p.title,
        type: "atividade-literaria" as const,
        excerpt: p.resumo,
        content: p.conteudo,
        date: p.date,
        foto: p.capa,
        url: `/atividades-literarias/${p.id}`,
      }));
    } catch (error) {
      console.error("Erro ao buscar atividades literárias:", error);
      return [];
    }
  }

  // =============================
  // Revistas (Revista Convergência)
  // =============================
  private static async searchInRevistas(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/revistas");
      const page = Array.isArray(response.data) ? response.data[0] : response.data;
      const revistas = page?.revista ?? [];

      const matching = revistas.filter((r: any) => {
        const haystack = this.normalizeText(`${r?.titulo_da_revista || ""} ${r?.descricao || ""} ${r?.edicao || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matching.map((r: any, idx: number) => ({
        id: typeof r?.id === "number" ? r.id : idx,
        title: r?.titulo_da_revista || "Revista",
        type: "revista" as const,
        excerpt: r?.descricao,
        foto: r?.capa,
        url: "/revistas",
      }));
    } catch (error) {
      console.error("Erro ao buscar revistas:", error);
      return [];
    }
  }

  // =============================
  // Jornal Eco
  // =============================
  private static async searchInJornalEco(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/jornal-eco");
      const page = Array.isArray(response.data) ? response.data[0] : response.data;
      const itens = page?.jornal_eco ?? [];

      const matching = itens.filter((j: any) => {
        const haystack = this.normalizeText(`${j?.titulo_do_jornal || ""} ${j?.descricao || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matching.map((j: any, idx: number) => ({
        id: typeof j?.id === "number" ? j.id : idx,
        title: j?.titulo_do_jornal || "Jornal Eco",
        type: "jornal-eco" as const,
        excerpt: j?.descricao,
        foto: j?.capa,
        url: "/jornal-eco",
      }));
    } catch (error) {
      console.error("Erro ao buscar jornal eco:", error);
      return [];
    }
  }

  // =============================
  // Acervo Bibliográfico
  // =============================
  private static async searchInAcervo(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/acervo");
      const data = response.data;
      const titulos = data?.titulos ?? [];

      const matching = titulos.filter((t: any) => {
        const haystack = this.normalizeText(`${t?.autor || ""} ${t?.titulo || ""}`);
        return haystack.includes(normalizedQuery);
      });

      return matching.map((t: any, idx: number) => ({
        id: idx,
        title: t?.titulo || "Título",
        type: "acervo" as const,
        excerpt: t?.autor ? `Autor: ${t.autor}` : undefined,
        autor: t?.autor,
        foto: t?.capa,
        url: "/acervo",
      }));
    } catch (error) {
      console.error("Erro ao buscar acervo:", error);
      return [];
    }
  }

  // =============================
  // API pública
  // =============================
  static async searchAll(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
    try {
      const normalizedQuery = this.normalizeText(query);

      const [
        membros,
        artigosCompletos,
        blogCompletos,
        presidentes,
        diretoria,
        sociosCorrespondentes,
        academiasRegionais,
        atividadesLiterarias,
        revistas,
        jornalEco,
        acervo,
      ] = await Promise.all([
        this.searchInMembros(normalizedQuery),
        this.searchInArtigos(normalizedQuery),
        this.searchInBlog(normalizedQuery),
        this.searchInPresidentes(normalizedQuery),
        this.searchInDiretoria(normalizedQuery),
        this.searchInSociosCorrespondentes(normalizedQuery),
        this.searchInAcademiasRegionais(normalizedQuery),
        this.searchInAtividadesLiterarias(normalizedQuery),
        this.searchInRevistas(normalizedQuery),
        this.searchInJornalEco(normalizedQuery),
        this.searchInAcervo(normalizedQuery),
      ]);

      // Converter artigos e blog para SearchResult
      const artigos: SearchResult[] = (artigosCompletos || []).map((artigo) => ({
        id: artigo.id,
        title: artigo.title,
        type: "artigo" as const,
        excerpt: artigo.resumo,
        content: artigo.conteudo,
        date: artigo.date,
        autor: artigo.academico?.[0]?.nome,
        foto: artigo.imagem_topo,
      }));

      const blog: SearchResult[] = (blogCompletos || []).map((post) => ({
        id: post.id,
        title: post.title,
        type: "blog" as const,
        excerpt: post.resumo,
        content: post.conteudo,
        date: post.date,
        foto: post.imagem_topo,
      }));

      let results: SearchResponse = {
        membros,
        artigos,
        blog,
        presidentes,
        diretoria,
        sociosCorrespondentes,
        academiasRegionais,
        atividadesLiterarias,
        revistas,
        jornalEco,
        acervo,
      };

      // Aplicar filtro por tipo
      if (filters.type && filters.type !== "all") {
        const filteredResults: SearchResponse = {
          membros: [],
          artigos: [],
          blog: [],
          presidentes: [],
          diretoria: [],
          sociosCorrespondentes: [],
          academiasRegionais: [],
          atividadesLiterarias: [],
          revistas: [],
          jornalEco: [],
          acervo: [],
        };

        if (filters.type === "membro") filteredResults.membros = results.membros;
        if (filters.type === "artigo") filteredResults.artigos = results.artigos;
        if (filters.type === "blog") filteredResults.blog = results.blog;
        if (filters.type === "presidente") filteredResults.presidentes = results.presidentes;
        if (filters.type === "diretoria") filteredResults.diretoria = results.diretoria;
        if (filters.type === "socio-correspondente") filteredResults.sociosCorrespondentes = results.sociosCorrespondentes;
        if (filters.type === "academia-regional") filteredResults.academiasRegionais = results.academiasRegionais;
        if (filters.type === "atividade-literaria") filteredResults.atividadesLiterarias = results.atividadesLiterarias;
        if (filters.type === "revista") filteredResults.revistas = results.revistas;
        if (filters.type === "jornal-eco") filteredResults.jornalEco = results.jornalEco;
        if (filters.type === "acervo") filteredResults.acervo = results.acervo;

        results = filteredResults;
      }

      // Aplicar limite
      if (filters.limit) {
        (Object.keys(results) as Array<keyof SearchResponse>).forEach((key) => {
          results[key] = results[key].slice(0, filters.limit);
        });
      }

      return results;
    } catch (error) {
      console.error("Erro na busca global:", error);
      return {
        membros: [],
        artigos: [],
        blog: [],
        presidentes: [],
        diretoria: [],
        sociosCorrespondentes: [],
        academiasRegionais: [],
        atividadesLiterarias: [],
        revistas: [],
        jornalEco: [],
        acervo: [],
      };
    }
  }

  static async universalSearch(query: string): Promise<SearchResult[]> {
    try {
      const searchResponse = await this.searchAll(query);

      const allResults = [
        ...searchResponse.membros,
        ...searchResponse.artigos,
        ...searchResponse.blog,
        ...searchResponse.presidentes,
        ...searchResponse.diretoria,
        ...searchResponse.sociosCorrespondentes,
        ...searchResponse.academiasRegionais,
        ...searchResponse.atividadesLiterarias,
        ...searchResponse.revistas,
        ...searchResponse.jornalEco,
        ...searchResponse.acervo,
      ];

      // Ordenar por relevância simples (titulo > excerpt > content)
      const searchText = this.normalizeText(query);

      return allResults.sort((a, b) => {
        const aTitle = this.normalizeText(a.title);
        const bTitle = this.normalizeText(b.title);

        const aHasInTitle = aTitle.includes(searchText) ? 1 : 0;
        const bHasInTitle = bTitle.includes(searchText) ? 1 : 0;

        if (aHasInTitle !== bHasInTitle) return bHasInTitle - aHasInTitle;

        const aExcerpt = this.normalizeText(a.excerpt || a.resumo || "");
        const bExcerpt = this.normalizeText(b.excerpt || b.resumo || "");

        const aHasInExcerpt = aExcerpt.includes(searchText) ? 1 : 0;
        const bHasInExcerpt = bExcerpt.includes(searchText) ? 1 : 0;

        if (aHasInExcerpt !== bHasInExcerpt) return bHasInExcerpt - aHasInExcerpt;

        return 0;
      });
    } catch (error) {
      console.error("Erro na busca universal:", error);
      return [];
    }
  }

  static async quickSearch(query: string, limit: number = 5): Promise<SearchResult[]> {
    return this.universalSearch(query).then((results) => results.slice(0, limit));
  }
}
