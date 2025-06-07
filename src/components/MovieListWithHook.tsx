'use client';

import React from 'react';
import { useMovies } from '@/hooks/useMovies';
import MovieCard from './MovieCard';
import LoadMoreButton from './LoadMoreButton';

interface MovieListWithHookProps {
  category?: 'popular' | 'now_playing' | 'top_rated';
  title?: string;
}

const MovieListWithHook: React.FC<MovieListWithHookProps> = ({ 
  category = 'popular', 
  title = 'Popular Movies' 
}) => {  const { movies, loading, error, hasMore, loadMore, refresh } = useMovies(category);

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
            onClick={refresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      
      {movies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No movies found.</p>
        </div>
      ) : (
        <>          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
          
          {hasMore && (
            <LoadMoreButton
              onClick={loadMore}
              loading={loading}
              hasMore={hasMore}
              buttonText="Load More Movies"
              position="right"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MovieListWithHook;