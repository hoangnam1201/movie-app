'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { useSearch } from '@/hooks/useSearch';
import { movieService } from '@/services/movieService';

interface SearchBoxProps {
    placeholder?: string;
    icon?: React.ReactNode;
}   

const SearchBox = (props: SearchBoxProps) => {
    const { placeholder, icon } = props;
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const { movies, searchMovies, loading, clearSearch } = useSearch();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.length > 2) {
                searchMovies(query);
                setShowResults(true);
            } else {
                clearSearch();
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, searchMovies, clearSearch]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowResults(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleMovieClick = () => {
        setShowResults(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowResults(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className='relative w-[300px]' ref={searchRef}>
            <form onSubmit={handleSubmit}>                <Input 
                    ref={inputRef}
                    className='h-[40px] bg-background/90 text-foreground border-border/50 placeholder:text-muted-foreground pr-10 backdrop-blur-sm' 
                    type="text" 
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length > 2 && setShowResults(true)}
                />
                {icon && (
                    <button 
                        type="submit"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {icon}
                    </button>
                )}
            </form>            {/* Search Results Dropdown */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-border max-h-96 overflow-y-auto z-50">
                    {loading && (
                        <div className="p-4 text-center text-muted-foreground">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                            Searching...
                        </div>
                    )}

                    {!loading && movies.length === 0 && query.length > 2 && (
                        <div className="p-4 text-center text-muted-foreground">
                            No movies found for &quot;{query}&quot;
                        </div>
                    )}

                    {!loading && movies.length > 0 && (
                        <>
                            <div className="p-2 border-b border-border">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Movies ({movies.length > 5 ? '5+' : movies.length} results)
                                </p>
                            </div>
                            
                            {movies.slice(0, 5).map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={`/watch/${movie.id}`}
                                    onClick={handleMovieClick}
                                    className="flex items-center p-3 hover:bg-accent/10 transition-colors border-b border-border/50 last:border-b-0"
                                >
                                    <div className="relative w-12 h-16 mr-3 flex-shrink-0">
                                        <Image
                                            src={movie.poster_path 
                                                ? movieService.getImageUrl(movie.poster_path)
                                                : '/placeholder-movie.jpg'
                                            }
                                            alt={movie.title}
                                            fill
                                            className="object-cover rounded"
                                            unoptimized={true}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-foreground truncate">
                                            {movie.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average.toFixed(1)}
                                        </p>
                                    </div>
                                </Link>
                            ))}

                            {movies.length > 5 && (
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={() => setShowResults(false)}
                                    className="block p-3 text-center text-primary hover:bg-primary/10 transition-colors font-medium"
                                >
                                    View all {movies.length} results
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBox