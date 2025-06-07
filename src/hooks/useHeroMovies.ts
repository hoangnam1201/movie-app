'use client';
import { useState, useEffect } from 'react';
import { movieService } from '@/services/movieService';
import { Movie, Genre } from '@/types/movie';

interface HeroMovie extends Movie {
  genres?: Genre[];
  runtime?: number;
}

export const useHeroMovies = () => {
  const [movies, setMovies] = useState<HeroMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);      // Get popular movies for hero section
      const popularMoviesResponse = await movieService.getPopularMovies(1);
      
      // Take first 8 popular movies for hero carousel (increased from 5)
      const heroMoviePromises = popularMoviesResponse.results.slice(0, 8).map(async (movie) => {
        try {
          // Get detailed information for each movie
          const movieDetails = await movieService.getMovieDetails(movie.id);
          return {
            ...movie,
            genres: movieDetails.genres,
            runtime: movieDetails.runtime,
          };
        } catch (detailError) {
          console.warn(`Failed to fetch details for movie ${movie.id}:`, detailError);
          return movie;
        }
      });

      const heroMovies = await Promise.all(heroMoviePromises);
      setMovies(heroMovies);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hero movies';
      setError(errorMessage);
      console.error('Error fetching hero movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroMovies();
  }, []);

  // Helper function to format runtime
  const formatRuntime = (minutes?: number): string => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:00`;
  };

  // Helper function to get release year
  const getReleaseYear = (dateString: string): string => {
    return new Date(dateString).getFullYear().toString();
  };

  return {
    movies,
    isLoading,
    error,
    refetch: fetchHeroMovies,
    formatRuntime,
    getReleaseYear,
  };
};
