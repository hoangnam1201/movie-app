'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsLoading(true);
    
    // Set a delay for the transition effect
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex items-center justify-center">
          <div className="text-center">
            {/* Enhanced loading animation */}
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="w-20 h-20 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
              
              {/* Inner pulsing circle */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-full animate-pulse"></div>
              
              {/* Movie film strip effect */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-sm animate-ping"></div>
            </div>
            
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2 animate-pulse">Loading...</h3>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page content with transition */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          isLoading 
            ? 'opacity-0 scale-95 blur-sm' 
            : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

export default PageTransition;
