'use client';

import React from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
  currentCount?: number;
  totalCount?: number;
  buttonText?: string;
  position?: 'center' | 'right';
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  loading,
  hasMore,
  currentCount,
  totalCount,
  buttonText = 'Load More Movies',
  position = 'right'
}) => {
  if (!hasMore) return null;

  const positionClass = position === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className={`flex ${positionClass} items-center mt-8 mb-4`}>
      <div className="flex flex-col items-end space-y-2">
        {/* Progress indicator */}
        {currentCount && totalCount && (
          <div className="text-sm text-gray-400 flex items-center space-x-2">
            <span>Showing {currentCount} of {totalCount} movies</span>
            <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-300"
                style={{ width: `${Math.min((currentCount / totalCount) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Enhanced Load More Button */}
        <button
          onClick={onClick}
          disabled={loading}
          className="group relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:shadow-none overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="relative flex items-center space-x-3">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span className="font-semibold">Loading...</span>
              </>
            ) : (
              <>
                <span className="font-semibold">{buttonText}</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </div>
        </button>

        {/* Load More hint */}
        {!loading && (
          <div className="text-xs text-gray-500 italic">
            Click to discover more amazing movies
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadMoreButton;
