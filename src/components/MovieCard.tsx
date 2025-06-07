import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { movieService } from '@/services/movieService';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = movie.poster_path 
  ? movieService.getImageUrl(movie.poster_path)
  : '/placeholder-movie.jpg';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';    return (
    <Link href={`/watch/${movie.id}`} className="block group">
      <div className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-[500px] flex flex-col border border-border">
        <div className="relative h-72 w-full overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center border border-border">
            <span className="text-accent text-sm">★</span>
            <span className="ml-1 text-foreground text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
          
          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg> 
            </div>
          </div>        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {movie.title}
            </h3>
            {releaseYear && (
              <span className="text-muted-foreground text-sm font-medium ml-2 flex-shrink-0">
                {releaseYear}
              </span>
            )}          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {movie.overview}
          </p>
          
          {/* Additional Movie Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex items-center space-x-4">
              <span className="bg-secondary px-2 py-1 rounded-full text-secondary-foreground">Movie</span>
              {movie.release_date && (
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground">Click to watch</span>
              <svg className="w-4 h-4 ml-1 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;