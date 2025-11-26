import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { FaGraduationCap, FaFileAlt, FaBlog, FaChevronRight } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { SearchService } from "@/services/searchService";
import type { SearchResult } from "@/types/ISearch";
import useSeo from "@/hooks/useSeo";
import banner from "@/assets/background.jpg";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useSeo({
    title: query ? `Resultados para "${query}"` : "Buscar",
    description: query ? `Resultados da busca por "${query}" na Academia de Letras do Triângulo Mineiro` : "Busque por conteúdo na Academia de Letras do Triângulo Mineiro"
  });

  // Busca real usando o SearchService
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await SearchService.universalSearch(searchQuery);
      
      // Combina todos os resultados em uma única lista
      const allResults: SearchResult[] = [
        ...results.membros,
        ...results.artigos,
        ...results.blog
      ];
      
      setSearchResults(allResults);
      setTotalResults(allResults.length);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'membro':
        return <FaGraduationCap className="text-altm-gold-600" />;
      case 'artigo':
        return <FaFileAlt className="text-blue-600" />;
      case 'blog':
        return <FaBlog className="text-green-600" />;
      default:
        return <Search className="text-gray-600" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'membro':
        return 'Acadêmico';
      case 'artigo':
        return 'Artigo';
      case 'blog':
        return 'Notícias';
      default:
        return 'Conteúdo';
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'membro':
        // Mapeia a seção encontrada para o hash correto na URL
        const sectionHash = {
          'biografia': 'biografia',
          'discurso_de_posse': 'discurso-de-posse', 
          'textos_escolhidos': 'textos-escolhidos',
          'bibliografia': 'bibliografia'
        }[result.foundIn || ''];
        
        if (sectionHash) {
          return `/academicos/membros/${result.id}#${sectionHash}`;
        }
        return `/academicos/membros/${result.id}`;
      case 'artigo':
        return `/artigos/${result.id}`;
      case 'blog':
        return `/blog/${result.id}`;
      default:
        return '#';
    }
  };

  const getFoundInLabel = (foundIn?: string) => {
    switch (foundIn) {
      case 'biografia':
        return 'Clique para ver na biografia';
      case 'discurso_de_posse':
        return 'Clique para ver no discurso de posse';
      case 'textos_escolhidos':
        return 'Clique para ver nos textos escolhidos';
      case 'bibliografia':
        return 'Clique para ver na bibliografia';
      case 'conteudo':
        return 'Encontrado no conteúdo';
      case 'resumo':
        return 'Encontrado no resumo';
      case 'academico':
        return 'Encontrado no nome do acadêmico';
      case 'title':
        return 'Encontrado no título';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Buscar"
        subtitle="Pesquise em nosso acervo completo"
        imagem_topo={banner}
        icon={<Search size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Buscar" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulário de busca */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-7 h-7 group-focus-within:text-altm-gold-600 transition-colors" />
              
              <Input
                type="text"
                placeholder="Digite aqui o que você procura..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-16 pr-40 py-6 text-xl border-2 border-gray-200 rounded-2xl shadow-xl focus:border-altm-gold-500 focus:ring-4 focus:ring-altm-gold-200 transition-all duration-200 placeholder:text-gray-400 font-medium"
              />
              
              <Button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Buscar
              </Button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {query && (
          <div className="space-y-6">
            {/* Header dos resultados */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSearching ? 'Buscando...' : `Resultados para "${query}"`}
              </h2>
              {!isSearching && totalResults > 0 && (
                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Loading */}
            {isSearching && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 mx-auto mb-3 text-altm-gold-600 animate-spin" />
                <p className="text-gray-600">Pesquisando em todo o acervo...</p>
              </div>
            )}

            {/* Resultados */}
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    to={getResultLink(result)}
                    className="block bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {result.foto || result.imagem_destacada || result.image ? (
                          <img 
                            src={result.foto || result.imagem_destacada || result.image} 
                            alt={result.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {getResultIcon(result.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {getResultTypeLabel(result.type)}
                          </span>
                          {result.foundIn && (
                            <span className="text-xs text-gray-500">
                              • {getFoundInLabel(result.foundIn)}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-altm-gold-700 transition-colors">
                          {result.title}
                        </h3>
                        
                        {result.academico && (
                          <p className="text-sm text-gray-600 mb-2">
                            Por {result.academico.nome}
                          </p>
                        )}
                        
                        {result.context && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {result.context}
                          </p>
                        )}
                      </div>
                      
                      <FaChevronRight className="text-gray-400 text-sm flex-shrink-0 mt-2" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Sem resultados */}
            {!isSearching && query && searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos nada para "<span className="font-medium">{query}</span>"
                </p>
                <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="font-medium text-blue-900 mb-2">Dicas para melhorar sua busca:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>• Verifique a ortografia das palavras</li>
                    <li>• Use termos mais gerais ou sinônimos</li>
                    <li>• Tente buscar por nomes de autores ou temas</li>
                    <li>• Use palavras-chave como "literatura", "biografia"</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial */}
        {!query && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Digite algo para começar a buscar
            </h3>
            <p className="text-gray-600">
              Pesquise por nomes, temas, textos ou qualquer conteúdo do nosso acervo
            </p>
          </div>
        )}

        {/* Botão voltar */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-altm-gold-600 hover:text-altm-gold-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à página inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
