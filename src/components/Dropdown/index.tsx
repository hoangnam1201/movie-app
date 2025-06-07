'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface DropdownItem {
  id: number | string;
  name: string;
  href: string;
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
  isLoading?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ title, items, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);  return (
    <div className="relative dropdown-container" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-lg font-bold text-foreground hover:text-accent transition-colors px-4 py-3 rounded-lg hover:bg-accent/10 w-full justify-between lg:w-auto lg:justify-start lg:px-0 lg:py-0 lg:hover:bg-transparent"
        disabled={isLoading}
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`dropdown-menu absolute top-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 
          ${items.length <= 7 ? 'w-64' : 'w-fit min-w-64 max-w-screen-sm'}
          lg:left-0
          max-lg:left-0 max-lg:right-0 max-lg:w-auto max-lg:max-w-none
        `}>
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No items available
            </div>
          ) : (
            <div className="py-2 flex max-w-full overflow-x-hidden">
              {(() => {
                const itemsPerColumn = 7;
                const numberOfColumns = Math.ceil(items.length / itemsPerColumn);
                const columns = [];
                
                for (let col = 0; col < numberOfColumns; col++) {
                  const startIndex = col * itemsPerColumn;
                  const endIndex = Math.min(startIndex + itemsPerColumn, items.length);
                  const columnItems = items.slice(startIndex, endIndex);
                  
                  columns.push(
                    <div key={col} className="flex flex-col min-w-64 max-w-64 overflow-hidden max-lg:min-w-full max-lg:max-w-full">
                      {columnItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block px-4 py-2 text-foreground hover:bg-accent/10 hover:text-accent transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  );
                }
                
                return columns;
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
