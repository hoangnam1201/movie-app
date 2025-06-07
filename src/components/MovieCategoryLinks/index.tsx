'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoryButton {
  key: 'popular' | 'now_playing' | 'top_rated';
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

interface MovieCategoryLinksProps {
  variant?: 'buttons' | 'cards' | 'minimal';
  showIcons?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

const MovieCategoryLinks: React.FC<MovieCategoryLinksProps> = ({
  variant = 'buttons',
  showIcons = true,
  showDescriptions = false,
  className = ''
}) => {
  const pathname = usePathname();

  const categories: CategoryButton[] = [
    {
      key: 'popular',
      label: 'Popular Movies',
      description: 'The most popular movies right now',
      href: '/movies?category=popular',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      key: 'now_playing',
      label: 'Now Playing',
      description: 'Currently in theaters',
      href: '/movies?category=now_playing',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )
    },
    {
      key: 'top_rated',
      label: 'Top Rated',
      description: 'Highest rated movies of all time',
      href: '/movies?category=top_rated',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      )
    }
  ];

  // Check if current page matches category
  const isActiveCategory = (categoryKey: string) => {
    if (pathname === '/movies') {
      const urlParams = new URLSearchParams(window.location.search);
      const currentCategory = urlParams.get('category') || 'popular';
      return currentCategory === categoryKey;
    }
    return false;
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {categories.map((category) => (
          <Link
            key={category.key}
            href={category.href}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-white hover:text-white hover:scale-105"
          >
            {showIcons && (
              <span className="inline-flex items-center gap-2">
                {category.icon}
                {category.label}
              </span>
            )}
            {!showIcons && category.label}
          </Link>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {categories.map((category) => (
          <Link
            key={category.key}
            href={category.href}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-700"
          >
            <div className="relative z-10">
              {showIcons && (
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  {category.icon}
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                {category.label}
              </h3>
              {showDescriptions && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Arrow icon */}
            <div className="absolute top-6 right-6 text-gray-400 group-hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Default 'buttons' variant
  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {categories.map((category) => (
        <Link
          key={category.key}
          href={category.href}
          className={`group relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isActiveCategory(category.key)
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:from-gray-700 hover:to-gray-800 hover:text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <div className="flex items-center gap-3">
            {showIcons && (
              <div className={`transition-colors duration-300 ${
                isActiveCategory(category.key) ? 'text-white' : 'text-gray-400 group-hover:text-red-400'
              }`}>
                {category.icon}
              </div>
            )}
            <div className="text-center">
              <div className="font-bold text-base">{category.label}</div>
              {showDescriptions && (
                <div className="text-xs opacity-75 mt-1">{category.description}</div>
              )}
            </div>
          </div>
          
          {/* Hover shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
        </Link>
      ))}
    </div>
  );
};

export default MovieCategoryLinks;