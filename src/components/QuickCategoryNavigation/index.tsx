'use client';

import React from 'react';
import MovieCategoryLinks from '../MovieCategoryLinks';

interface QuickCategoryNavigationProps {
  title?: string;
  subtitle?: string;
  variant?: 'buttons' | 'cards' | 'minimal';
  showIcons?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

const QuickCategoryNavigation: React.FC<QuickCategoryNavigationProps> = ({
  title = "Quick Browse",
  subtitle = "Jump to your favorite movie categories",
  variant = 'buttons',
  showIcons = true,
  showDescriptions = false,
  className = ''
}) => {
  return (
    <section className={`py-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      
      <MovieCategoryLinks 
        variant={variant}
        showIcons={showIcons}
        showDescriptions={showDescriptions}
        className="max-w-3xl mx-auto"
      />
    </section>
  );
};

export default QuickCategoryNavigation;
