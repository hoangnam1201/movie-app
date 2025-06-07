'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { movieService } from '@/services/movieService';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (query) {
      const pageFromUrl = parseInt(searchParams.get('page') || '1');
      setCurrentPage(pageFromUrl);
      searchMovies(query, pageFromUrl);
    }
  }, [query, searchParams]);
  const searchMovies = async (searchQuery: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movieService.searchMovies(searchQuery, page);
      
      setMovies(response.results);
      setCurrentPage(page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page'); // Remove page param for page 1 to keep URL clean
    } else {
      params.set('page', page.toString());
    }
    
    const newUrl = `?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    
    searchMovies(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Search Movies</h1>
            <p className="text-gray-400">Enter a search term to find movies</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-400">
            {loading && currentPage === 1 ? (
              'Searching...'
            ) : (
              `${totalResults} results found for "${query}"`
            )}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State for Initial Search */}
        {loading && currentPage === 1 && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* No Results */}
        {!loading && movies.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold mb-2">No movies found</h2>
            <p className="text-gray-400 mb-4">
              Try searching with different keywords or check your spelling
            </p>
            <Link 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Browse Popular Movies
            </Link>
          </div>
        )}

        {/* Search Results Grid */}
        {movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
            {movies.map((movie) => (
              <Link 
                key={movie.id} 
                href={`/watch/${movie.id}`}
                className="group"
              >
                <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                  {/* Movie Poster */}
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={movie.poster_path 
                        ? movieService.getImageUrl(movie.poster_path)
                        : '/placeholder-movie.jpg'
                      }
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={true}
                    />
                    
                    {/* Rating Overlay */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                  
                  {/* Movie Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}        {/* Pagination */}
        {movies.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
