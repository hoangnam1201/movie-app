'use client';

import React from 'react';
import { useTVShows } from '../../hooks/useTVShows';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const TVPage = () => {
  const { tvShows, loading, error, loadMore, hasMore } = useTVShows();

  if (loading && tvShows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">TV Series</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">TV Series</h1>
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
        <h1 className="text-4xl font-bold mb-8">Popular TV Series</h1>
        
        {tvShows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No TV shows found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {tvShows.map((show) => (
                <MovieCard
                  key={show.id}
                  movie={show}
                  onView={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
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
                  {loading ? 'Loading...' : 'Load More Shows'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TVPage;
