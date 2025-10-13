import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { FaGraduationCap, FaFileAlt, FaBlog } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSearch } from "@/hooks/useSearch";
import { SearchResultCard } from "./SearchResultCards";
import type { SearchResult } from "@/types/ISearch";

interface SearchBarProps {
  placeholder?: string;
  showQuickResults?: boolean;
  className?: string;
}

export function SearchBar({ 
  placeholder = "Buscar acadêmicos, artigos, blog...", 
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    quickResults, 
    loading, 
    error, 
    quickSearch, 
    clearResults
  } = useSearch();

  // Busca quando o usuário digita no modal
  useEffect(() => {
    if (query.trim().length >= 2 && isModalOpen) {
      quickSearch(query, 8);
    } else {
      clearResults();
    }
  }, [query, quickSearch, clearResults, isModalOpen]);

  // Foca no input quando o modal abre
  useEffect(() => {
    if (isModalOpen && modalInputRef.current) {
      setTimeout(() => {
        modalInputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setQuery("");
    clearResults();
  };

  const handleResultClick = () => {
    handleCloseModal();
  };

  // Agrupa resultados por tipo para exibição no modal
  const groupedResults = [
    { 
      title: "Acadêmicos", 
      results: quickResults.filter(r => r.type === 'membro'), 
      icon: <FaGraduationCap className="text-altm-gold-600" />, 
      color: "text-altm-gold-600"
    },
    { 
      title: "Artigos", 
      results: quickResults.filter(r => r.type === 'artigo'), 
      icon: <FaFileAlt className="text-blue-600" />, 
      color: "text-blue-600"
    },
    { 
      title: "Blog", 
      results: quickResults.filter(r => r.type === 'blog'), 
      icon: <FaBlog className="text-green-600" />, 
      color: "text-green-600"
    }
  ].filter(group => group.results.length > 0);

  return (
    <>
      {/* Input trigger para abrir modal */}
      <div className={`relative ${className}`}>
        <div 
          onClick={handleOpenModal}
          className="relative group cursor-pointer"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-altm-gold-600 transition-colors" />
          
          <div className="pl-10 pr-4 py-3 w-full bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-altm-gold-500 transition-all duration-200 text-gray-400 cursor-pointer">
            {placeholder}
          </div>
        </div>
      </div>

      {/* Modal de busca com animações */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header do modal com input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              
              <Input
                ref={modalInputRef}
                type="text"
                placeholder="Digite para buscar acadêmicos, artigos, blog..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-altm-gold-500 focus:ring-2 focus:ring-altm-gold-200 transition-all duration-200"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </Button>
            </div>
            
            {query.trim().length > 0 && query.trim().length < 2 && (
              <p className="text-sm text-gray-500 mt-2 ml-12">
                Digite pelo menos 2 caracteres para buscar
              </p>
            )}
          </div>

          {/* Conteúdo dos resultados */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-6 search-modal-scroll">
            {loading && (
              <div className="text-center py-12 animate-in fade-in-0 duration-300">
                <Loader2 className="w-8 h-8 mx-auto mb-3 text-altm-gold-600 animate-spin" />
                <p className="text-gray-600">Buscando...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center mb-6 animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {!loading && quickResults.length > 0 && (
              <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 pb-8">
                {groupedResults.map((group, index) => (
                  <div 
                    key={group.title} 
                    className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-xl">{group.icon}</div>
                      <h3 className={`text-lg font-semibold ${group.color}`}>
                        {group.title}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {group.results.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {group.results.map((result, resultIndex) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          className="animate-in fade-in-0 slide-in-from-left-2 duration-300"
                          style={{ animationDelay: `${(index * 100) + (resultIndex * 50)}ms` }}
                        >
                          <SearchResultCard 
                            result={result} 
                            onClick={handleResultClick}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && query.trim().length >= 2 && quickResults.length === 0 && (
              <div className="text-center py-16 animate-in fade-in-0 zoom-in-95 duration-300">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Não encontramos nada para "<span className="font-medium">{query}</span>"
                </p>
                <p className="text-sm text-gray-500">
                  Tente termos diferentes ou verifique a ortografia
                </p>
              </div>
            )}

            {!loading && query.trim().length === 0 && (
              <div className="text-center py-16 animate-in fade-in-0 zoom-in-95 duration-300">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Comece a digitar para buscar
                </h3>
                <p className="text-gray-600">
                  Encontre acadêmicos, artigos e posts do blog
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
