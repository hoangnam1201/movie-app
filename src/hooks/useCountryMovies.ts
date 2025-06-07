'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieResponse } from '@/types/movie';
import { movieService } from '@/services/movieService';

export const useCountryMovies = (countryCode: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: MovieResponse = await movieService.getMoviesByCountry(countryCode, pageNum);
      
      if (reset || pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setHasMore(pageNum < response.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Error fetching country movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchMovies(1, true);
    }
  }, [countryCode]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMovies(page + 1, false);
    }
  };

  const refresh = () => {
    fetchMovies(1, true);
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
