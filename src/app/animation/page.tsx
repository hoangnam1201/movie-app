'use client';

import React from 'react';
import { useAnimationMovies } from '@/hooks/useAnimationMovies';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const AnimationPage = () => {
  const { movies, loading, error, loadMore, hasMore } = useAnimationMovies();

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Animation Movies</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Animation Movies</h1>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Popular Animation Movies</h1>
        
        {movies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No animation movies found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnimationPage;
