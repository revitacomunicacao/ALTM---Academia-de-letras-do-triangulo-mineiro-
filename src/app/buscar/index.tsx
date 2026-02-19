import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SearchService } from "@/services/searchService";
import type { SearchResult } from "@/types/ISearch";
import { Search, User, BookOpen, FileText, Users, Filter } from "lucide-react";

export default function Buscar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "all";

  const types = useMemo(
    () => [
      { value: "all", label: "Todos" },
      { value: "membro", label: "Acadêmicos" },
      { value: "artigo", label: "Artigos" },
      { value: "blog", label: "Blog" },
      { value: "atividade-literaria", label: "Atividades Literárias" },
      { value: "academia-regional", label: "Academias Regionais" },
      { value: "socio-correspondente", label: "Sócios Correspondentes" },
      { value: "revista", label: "Revistas" },
      { value: "jornal-eco", label: "Jornal Eco" },
      { value: "acervo", label: "Acervo Bibliográfico" },
      { value: "presidente", label: "Presidentes" },
      { value: "diretoria", label: "Diretoria" },
    ],
    [],
  );

  const getTypeLabel = (type: string) => types.find((t) => t.value === type)?.label || type;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "membro":
        return <User className="w-4 h-4" />;
      case "artigo":
        return <BookOpen className="w-4 h-4" />;
      case "blog":
        return <FileText className="w-4 h-4" />;
      case "atividade-literaria":
        return <BookOpen className="w-4 h-4" />;
      case "acervo":
        return <BookOpen className="w-4 h-4" />;
      case "revista":
      case "jornal-eco":
        return <FileText className="w-4 h-4" />;
      case "academia-regional":
      case "socio-correspondente":
      case "presidente":
      case "diretoria":
        return <Users className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getResultLink = (result: SearchResult) => {
    if (result.url) return result.url;

    switch (result.type) {
      case "artigo":
        return `/artigos/${result.id}`;
      case "blog":
        return `/blog/${result.id}`;
      case "membro":
        return `/membros/${result.id}`;
      case "atividade-literaria":
        return `/atividades-literarias/${result.id}`;
      case "academia-regional":
        return "/academias-regionais";
      case "socio-correspondente":
        return "/socios-correspondentes";
      case "revista":
        return "/revistas";
      case "jornal-eco":
        return "/jornal-eco";
      case "acervo":
        return "/acervo";
      default:
        return "#";
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const all = await SearchService.universalSearch(searchQuery);

      const filtered =
        typeFilter === "all" ? all : all.filter((r) => String(r.type) === String(typeFilter));

      setResults(filtered);
    } catch (e) {
      console.error(e);
      setError("Erro ao realizar a busca");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void performSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, typeFilter]);

  const onTypeChange = (newType: string) => {
    const next = new URLSearchParams(searchParams);
    if (newType === "all") next.delete("type");
    else next.set("type", newType);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resultados da busca</h1>
              <p className="text-gray-600 mt-2">
                {query ? (
                  <>
                    Buscando por: <span className="font-medium text-gray-900">"{query}"</span>
                  </>
                ) : (
                  "Digite algo na busca para ver resultados"
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Filtrar:</span>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#c1a44e] focus:border-transparent"
              >
                {types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Buscando...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-lg text-red-600 mb-4">{error}</div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {query ? "Nenhum resultado encontrado" : "Faça uma busca"}
            </h2>
            <p className="text-gray-600">
              {query
                ? "Tente usar termos diferentes ou verifique a ortografia"
                : "Use a barra de pesquisa no topo do site"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Encontrados <span className="font-semibold">{results.length}</span> resultados
                {typeFilter !== "all" ? (
                  <>
                    {" "}
                    em <span className="font-semibold">{getTypeLabel(typeFilter)}</span>
                  </>
                ) : null}
              </p>
            </div>

            <div className="space-y-4">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={getResultLink(result)}
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#c1a44e] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {(result.foto || result.image || result.imagem_destacada) && (
                      <div className="flex-shrink-0">
                        <img
                          src={result.foto || result.image || result.imagem_destacada}
                          alt={result.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {getTypeIcon(result.type)}
                          {getTypeLabel(result.type)}
                        </span>
                        {result.date && <span className="text-xs text-gray-500">{result.date}</span>}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{result.title}</h3>

                      {(result.excerpt || result.resumo || result.summary) && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {result.excerpt || result.resumo || result.summary}
                        </p>
                      )}

                      {result.foundIn && (
                        <p className="text-xs text-gray-500 mt-2">
                          Encontrado em: <span className="font-medium">{result.foundIn}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
