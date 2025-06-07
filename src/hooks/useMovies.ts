'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieResponse } from '@/types/movie';
import { movieService } from '@/services/movieService';

export const useMovies = (category: 'popular' | 'now_playing' | 'top_rated' = 'popular') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let response: MovieResponse;
      switch (category) {
        case 'now_playing':
          response = await movieService.getNowPlayingMovies(pageNum);
          break;
        case 'top_rated':
          response = await movieService.getTopRatedMovies(pageNum);
          break;
        default:
          response = await movieService.getPopularMovies(pageNum);
      }
      
      if (reset || pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setHasMore(pageNum < response.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, true);
  }, [category]);

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