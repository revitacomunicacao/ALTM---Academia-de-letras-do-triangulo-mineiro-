import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchService } from '@/services/searchService';
import type { SearchResponse, SearchResult, SearchFilters } from '@/types/ISearch';

interface UseSearchReturn {
  results: SearchResponse;
  quickResults: SearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string, filters?: SearchFilters) => void;
  quickSearch: (query: string, limit?: number) => void;
  clearResults: () => void;
  hasResults: boolean;
  totalResults: number;
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResponse>({
    membros: [],
    artigos: [],
    blog: [],
    presidentes: [],
    diretoria: [],
    sociosCorrespondentes: []
  });
  
  const [quickResults, setQuickResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cancela a busca anterior se uma nova for iniciada
  const cancelPreviousSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  // Busca completa com debounce
  const search = useCallback(async (query: string, filters: SearchFilters = {}) => {
    cancelPreviousSearch();
    
    if (!query.trim() || query.trim().length < 2) {
      setResults({
        membros: [],
        artigos: [],
        blog: [],
        presidentes: [],
        diretoria: [],
        sociosCorrespondentes: []
      });
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce de 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();
        
        const searchResults = await SearchService.universalSearch(
          query, 
          filters, 
          abortControllerRef.current.signal
        );
        
        setResults(searchResults);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Erro na busca:', err);
          setError('Erro ao realizar a busca. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [cancelPreviousSearch]);

  // Busca rápida com debounce menor (para autocomplete)
  const quickSearch = useCallback(async (query: string, limit: number = 6) => {
    cancelPreviousSearch();
    
    if (!query.trim() || query.trim().length < 2) {
      setQuickResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce menor para busca rápida (150ms)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();
        
        const searchResults = await SearchService.quickSearch(
          query, 
          limit
        );
        
        setQuickResults(searchResults);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Erro na busca rápida:', err);
          setError('Erro ao realizar a busca. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    }, 150);
  }, [cancelPreviousSearch]);

  const clearResults = useCallback(() => {
    cancelPreviousSearch();
    setResults({
      membros: [],
      artigos: [],
      blog: [],
      presidentes: [],
      diretoria: [],
      sociosCorrespondentes: []
    });
    setQuickResults([]);
    setError(null);
    setLoading(false);
  }, [cancelPreviousSearch]);

  // Limpeza quando o componente desmonta
  useEffect(() => {
    return () => {
      cancelPreviousSearch();
    };
  }, [cancelPreviousSearch]);

  const hasResults = Object.values(results).some(arr => arr.length > 0) || quickResults.length > 0;
  
  const totalResults = Object.values(results).reduce((total, arr) => total + arr.length, 0);

  return {
    results,
    quickResults,
    loading,
    error,
    search,
    quickSearch,
    clearResults,
    hasResults,
    totalResults
  };
}
