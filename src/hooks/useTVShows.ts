'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieResponse } from '@/types/movie';
import { movieService } from '@/services/movieService';

export const useTVShows = () => {
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTVShows = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: MovieResponse = await movieService.getPopularTVShows(pageNum);
      
      if (reset || pageNum === 1) {
        setTvShows(response.results);
      } else {
        setTvShows(prev => [...prev, ...response.results]);
      }
      
      setHasMore(pageNum < response.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch TV shows. Please try again.');
      console.error('Error fetching TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchTVShows(page + 1, false);
    }
  };

  const refresh = () => {
    fetchTVShows(1, true);
  };

  return {
    tvShows,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
