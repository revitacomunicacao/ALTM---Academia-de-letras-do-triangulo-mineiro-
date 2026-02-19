import { axiosClient } from "@/api/axiosClient";
import type { SearchItem } from "@/types/ISearch";

export type SearchResult = SearchItem;

function normalizeText(text: string) {
  return (text || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function matchAny(query: string, values: Array<string | undefined | null>) {
  const q = normalizeText(query);
  if (!q) return false;

  return values.some((v) => {
    const n = normalizeText(String(v || ""));
    return n.includes(q);
  });
}

export class SearchService {
  static async universalSearch(query: string): Promise<SearchResult[]> {
    const q = normalizeText(query);
    if (!q) return [];

    // Executa em paralelo
    const [
      membros,
      artigos,
      blog,
      atividadesLiterarias,
      academiasRegionais,
      sociosCorrespondentes,
      revistas,
      jornalEco,
      acervo,
      presidentes,
      diretoria,
    ] = await Promise.all([
      this.searchInMembros(q),
      this.searchInArtigos(q),
      this.searchInBlog(q),
      this.searchInAtividadesLiterarias(q),
      this.searchInAcademiasRegionais(q),
      this.searchInSociosCorrespondentes(q),
      this.searchInRevistas(q),
      this.searchInJornalEco(q),
      this.searchInAcervo(q),
      this.searchInPresidentes(q),
      this.searchInDiretoria(q),
    ]);

    // Junta + ordena simples (prioriza título)
    const all = [
      ...membros,
      ...artigos,
      ...blog,
      ...atividadesLiterarias,
      ...academiasRegionais,
      ...sociosCorrespondentes,
      ...revistas,
      ...jornalEco,
      ...acervo,
      ...presidentes,
      ...diretoria,
    ];

    // Ordenação: primeiro match no título
    const scored = all
      .map((item) => {
        const titleMatch = normalizeText(item.title).includes(q);
        const contentMatch =
          normalizeText(item.excerpt || "").includes(q) || normalizeText(item.content || "").includes(q);
        const score = titleMatch ? 2 : contentMatch ? 1 : 0;
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map((s) => s.item);
  }

  // ==============================
  // Membros / Acadêmicos
  // ==============================
  private static async searchInMembros(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/membros");
      const membros = Array.isArray(response.data) ? response.data : [];

      const matchingMembros = membros.filter((membro) =>
        matchAny(normalizedQuery, [membro.nome, membro.cargo, membro.biografia]),
      );

      return matchingMembros.map((membro) => ({
        id: membro.id,
        // Em alguns retornos o nome pode vir em outra chave.
        title: (membro as any)?.nome || (membro as any)?.title || (membro as any)?.name || "Acadêmico",
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

  // ==============================
  // Artigos
  // ==============================
  private static async searchInArtigos(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/artigos");
      const artigos = Array.isArray(response.data) ? response.data : [];

      const matchingArtigos = artigos.filter((artigo) =>
        matchAny(normalizedQuery, [artigo.title, artigo.resumo, artigo.conteudo]),
      );

      return matchingArtigos.map((artigo) => ({
        id: artigo.id,
        title: artigo.title,
        type: "artigo" as const,
        excerpt: artigo.resumo,
        content: artigo.conteudo,
        date: artigo.date,
        imagem_destacada: artigo.imagem_destacada,
      }));
    } catch (error) {
      console.error("Erro ao buscar artigos:", error);
      return [];
    }
  }

  // ==============================
  // Blog
  // ==============================
  private static async searchInBlog(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/blog");
      const posts = Array.isArray(response.data) ? response.data : [];

      const matchingPosts = posts.filter((post) =>
        matchAny(normalizedQuery, [post.title, post.resumo, post.content]),
      );

      return matchingPosts.map((post) => ({
        id: post.id,
        title: post.title,
        type: "blog" as const,
        excerpt: post.resumo,
        content: post.content,
        date: post.date,
        image: post.image,
      }));
    } catch (error) {
      console.error("Erro ao buscar blog:", error);
      return [];
    }
  }

  // ==============================
  // Atividades Literárias
  // ==============================
  private static async searchInAtividadesLiterarias(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/atividades-literarias");
      const posts = Array.isArray(response.data) ? response.data : [];

      const matching = posts.filter((post) =>
        matchAny(normalizedQuery, [post.title, post.conteudo, post.midia]),
      );

      return matching.map((post) => ({
        id: post.id,
        title: post.title,
        type: "atividade-literaria" as const,
        excerpt: "",
        content: post.conteudo,
        date: post.date,
        image: post.capa,
      }));
    } catch (error) {
      console.error("Erro ao buscar atividades literárias:", error);
      return [];
    }
  }

  // ==============================
  // Academias Regionais
  // ==============================
  private static async searchInAcademiasRegionais(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/academias-regionais");
      const page = Array.isArray(response.data) ? response.data[0] : response.data;
      const academias = Array.isArray(page?.academias) ? page.academias : [];

      const matching = academias.filter((a: any) => matchAny(normalizedQuery, [a?.nome, a?.informacoes]));

      return matching.map((a: any, idx: number) => ({
        // academias não possuem id; usamos índice (estável dentro da resposta)
        id: typeof a?.id === "number" ? a.id : idx,
        title: a?.nome || "Academia Regional",
        type: "academia-regional" as const,
        // Resultados devem exibir apenas o nome (sem HTML/conteúdo).
        excerpt: "",
        content: "",
        foto: a?.foto,
        url: "/academias-regionais",
      }));
    } catch (error) {
      console.error("Erro ao buscar academias regionais:", error);
      return [];
    }
  }

  // ==============================
  // Sócios Correspondentes
  // ==============================
  private static async searchInSociosCorrespondentes(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/socios-correspondentes");
      const socios = Array.isArray(response.data) ? response.data : [];

      const matching = socios.filter((s) => matchAny(normalizedQuery, [s.title, s.resumo, s.content]));

      return matching.map((s) => ({
        id: s.id,
        title: s.title,
        type: "socio-correspondente" as const,
        excerpt: s.resumo,
        content: s.content,
        image: s.imagem_destacada,
        url: "/socios-correspondentes",
      }));
    } catch (error) {
      console.error("Erro ao buscar sócios correspondentes:", error);
      return [];
    }
  }

  // ==============================
  // Revistas
  // ==============================
  private static async searchInRevistas(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/revistas");
      const revistas = Array.isArray(response.data) ? response.data : [];

      const matching = revistas.filter((r) => matchAny(normalizedQuery, [r.title, r.edicao, r.descricao]));

      return matching.map((r) => ({
        id: r.id,
        title: r.title,
        type: "revista" as const,
        excerpt: r.descricao,
        content: r.descricao,
        image: r.capa,
        url: "/revistas",
      }));
    } catch (error) {
      console.error("Erro ao buscar revistas:", error);
      return [];
    }
  }

  // ==============================
  // Jornal Eco
  // ==============================
  private static async searchInJornalEco(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/jornal-eco");
      const items = Array.isArray(response.data) ? response.data : [];

      const matching = items.filter((j) => matchAny(normalizedQuery, [j.title, j.descricao]));

      return matching.map((j) => ({
        id: j.id,
        title: j.title,
        type: "jornal-eco" as const,
        excerpt: j.descricao,
        content: j.descricao,
        image: j.capa,
        url: "/jornal-eco",
      }));
    } catch (error) {
      console.error("Erro ao buscar jornal eco:", error);
      return [];
    }
  }

  // ==============================
  // Acervo
  // ==============================
  private static async searchInAcervo(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/acervo");
      const page = Array.isArray(response.data) ? response.data[0] : response.data;
      const titulos = Array.isArray(page?.titulos) ? page.titulos : [];

      const matching = titulos.filter((t: any) => matchAny(normalizedQuery, [t?.autor, t?.titulo]));

      return matching.map((t: any, idx: number) => ({
        id: idx,
        title: `${t?.autor || "Autor"} — ${t?.titulo || "Título"}`,
        type: "acervo" as const,
        excerpt: "",
        content: "",
        image: t?.capa,
        url: "/acervo",
        foundIn: t?.autor ? "Autor" : "Título",
      }));
    } catch (error) {
      console.error("Erro ao buscar acervo:", error);
      return [];
    }
  }

  // ==============================
  // Presidentes
  // ==============================
private static async searchInPresidentes(normalizedQuery: string): Promise<SearchResult[]> {
  try {
    const response = await axiosClient.get("/presidentes");
    const list = Array.isArray(response.data) ? response.data : [];

    const matching = list.filter((p: any) =>
      matchAny(normalizedQuery, [
        p?.nome,
        p?.title,
        p?.name,
        p?.periodo,
        p?.biografia,
        p?.content,
      ]),
    );

    return matching.map((p: any) => ({
      id: p.id,
      title: p?.nome || p?.title || p?.name || "Presidente",
      type: "presidente" as const,
      excerpt: p?.periodo || "",
      content: p?.biografia || p?.content || "",
      image: p?.foto || p?.imagem || p?.image || "",
      url: "/presidentes",
    }));
  } catch (error) {
    console.error("Erro ao buscar presidentes:", error);
    return [];
  }
}


  // ==============================
  // Diretoria
  // ==============================
  private static async searchInDiretoria(normalizedQuery: string): Promise<SearchResult[]> {
    try {
      const response = await axiosClient.get("/diretoria");
      const list = Array.isArray(response.data) ? response.data : [];

      const matching = list.filter((d) => matchAny(normalizedQuery, [d.nome, d.cargo, d.biografia]));

      return matching.map((d) => ({
        id: d.id,
        title: d.nome,
        type: "diretoria" as const,
        excerpt: d.cargo,
        content: d.biografia,
        image: d.foto,
        url: "/diretoria",
      }));
    } catch (error) {
      console.error("Erro ao buscar diretoria:", error);
      return [];
    }
  }
}
