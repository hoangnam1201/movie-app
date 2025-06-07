'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Movie, MovieResponse } from '@/types/movie';
import { movieService } from '@/services/movieService';
import MovieCard from './MovieCard';
import Pagination from './Pagination';

interface MovieListProps {
  category?: 'popular' | 'now_playing' | 'top_rated';
  title?: string;
  initialMovies?: Movie[];
  showPagination?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ 
  category = 'popular', 
  title = 'Popular Movies',
  initialMovies = [],
  showPagination = true
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(initialMovies.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Get initial page from URL params
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    setCurrentPage(pageFromUrl);
    
    // Only fetch if we don't have initial data or if we're on a different page
    if (initialMovies.length === 0 || pageFromUrl !== 1) {
      fetchMovies(pageFromUrl);
    } else {
      // If we have initial data and we're on page 1, just set the current page
      setCurrentPage(1);
    }
  }, [category, initialMovies.length, searchParams]);

  const fetchMovies = async (pageNum: number = 1) => {
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
      
      setMovies(response.results);
      setCurrentPage(pageNum);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNum: number) => {
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum === 1) {
      params.delete('page'); // Remove page param for page 1 to keep URL clean
    } else {
      params.set('page', pageNum.toString());
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
    
    fetchMovies(pageNum);
    // Scroll to top of the movie list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-96">
              <div className="h-64 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchMovies(currentPage)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        
        {movies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No movies found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}               
                />
              ))}            
            </div>
            
            {showPagination && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MovieList;