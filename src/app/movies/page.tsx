'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MovieList from '@/components/MovieList';

const MoviesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<'popular' | 'now_playing' | 'top_rated'>('popular');

  const categories = [
    { key: 'popular' as const, label: 'Popular Movies', description: 'The most popular movies right now' },
    { key: 'now_playing' as const, label: 'Now Playing', description: 'Currently in theaters' },
    { key: 'top_rated' as const, label: 'Top Rated', description: 'Highest rated movies of all time' }
  ];
  // Get initial category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') as 'popular' | 'now_playing' | 'top_rated';
    if (categoryFromUrl && ['popular', 'now_playing', 'top_rated'].includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: 'popular' | 'now_playing' | 'top_rated') => {
    setActiveCategory(category);
    
    // Update URL with new category and reset page
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'popular') {
      params.delete('category'); // Remove category param for popular to keep URL clean
    } else {
      params.set('category', category);
    }
    params.delete('page'); // Reset to page 1 when changing category
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/movies';
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Movies
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover thousands of movies from different categories. Use pagination to browse through our extensive collection.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeCategory === category.key
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="text-center">
                <div className="font-bold">{category.label}</div>
                <div className="text-xs opacity-75">{category.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Category Description */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gray-800 rounded-lg px-6 py-3">
            <p className="text-gray-300">
              {categories.find(cat => cat.key === activeCategory)?.description}
            </p>
          </div>
        </div>

        {/* Movies List with Pagination */}
        <MovieList 
          key={activeCategory} // Force re-render when category changes
          category={activeCategory}
          title={categories.find(cat => cat.key === activeCategory)?.label || 'Movies'}
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default MoviesPage;
