'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
  totalResults?: number;
  resultsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  showInfo = true,
  totalResults,
}) => {
  // Calculate which pages to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    
    // Always show first page
    if (currentPage > delta + 2) {
      pages.push(1);
      if (currentPage > delta + 3) {
        pages.push('...');
      }
    }
    
    // Show pages around current page
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (currentPage < totalPages - delta - 1) {
      if (currentPage < totalPages - delta - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-4 mt-8 mb-4">
      {/* Results info */}
      {showInfo && totalResults && (
        <div className="text-sm text-gray-400">
          Page {currentPage} of {totalPages} • {totalResults.toLocaleString()} total results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === currentPage
                      ? 'text-white bg-red-600 border border-red-600'
                      : 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {/* Quick navigation */}
      <div className="flex items-center space-x-4">
        {/* First/Last page buttons */}
        {currentPage > 3 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← First
          </button>
        )}
        
        {currentPage < totalPages - 2 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Last →
          </button>
        )}
        
        {/* Jump to page input */}
        {totalPages > 10 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              className="w-16 px-2 py-1 text-xs text-white bg-gray-800 border border-gray-700 rounded focus:border-red-600 focus:outline-none"
              placeholder={currentPage.toString()}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  if (value >= 1 && value <= totalPages) {
                    onPageChange(value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
