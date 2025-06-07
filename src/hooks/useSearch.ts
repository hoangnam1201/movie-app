import { useState, useCallback } from 'react';
import { Movie } from '@/types/movie';
import { movieService } from '@/services/movieService';

interface SearchState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

interface UseSearchReturn extends SearchState {
  searchMovies: (query: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
  lastQuery: string;
}

export const useSearch = (): UseSearchReturn => {
  const [state, setState] = useState<SearchState>({
    movies: [],
    loading: false,
    error: null,
    totalResults: 0,
    totalPages: 0,
    currentPage: 0,
  });
  
  const [lastQuery, setLastQuery] = useState('');

  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, movies: [], error: null }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await movieService.searchMovies(query.trim(), page);
      
      setState(prev => ({
        ...prev,
        movies: page === 1 ? response.results : [...prev.movies, ...response.results],
        totalResults: response.total_results,
        totalPages: response.total_pages,
        currentPage: page,
        loading: false,
      }));
      
      setLastQuery(query);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to search movies. Please try again.',
      }));
      console.error('Search error:', error);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.currentPage < state.totalPages && !state.loading && lastQuery) {
      await searchMovies(lastQuery, state.currentPage + 1);
    }
  }, [state.currentPage, state.totalPages, state.loading, lastQuery, searchMovies]);

  const clearSearch = useCallback(() => {
    setState({
      movies: [],
      loading: false,
      error: null,
      totalResults: 0,
      totalPages: 0,
      currentPage: 0,
    });
    setLastQuery('');
  }, []);

  return {
    ...state,
    searchMovies,
    loadMore,
    clearSearch,
    lastQuery,
  };
};

export default useSearch;
