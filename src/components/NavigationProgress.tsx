'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const NavigationProgress: React.FC = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(10);

    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 200);
    const timer3 = setTimeout(() => setProgress(90), 300);
    const timer4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Animated dots at the end of progress bar */}
      <div 
        className="fixed top-1 z-50 transition-all duration-300 ease-out"
        style={{ left: `${progress}%` }}
      >
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </>
  );
};

export default NavigationProgress;
