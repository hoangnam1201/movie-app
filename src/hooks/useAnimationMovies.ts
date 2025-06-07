'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieResponse } from '@/types/movie';
import { movieService } from '@/services/movieService';

export const useAnimationMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnimationMovies = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Animation genre ID is 16 in TMDB
      const response: MovieResponse = await movieService.getMoviesByGenre(16, pageNum);
      
      if (reset || pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setHasMore(pageNum < response.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch animation movies. Please try again.');
      console.error('Error fetching animation movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimationMovies(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchAnimationMovies(page + 1, false);
    }
  };

  const refresh = () => {
    fetchAnimationMovies(1, true);
  };

  return {
    movies,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
