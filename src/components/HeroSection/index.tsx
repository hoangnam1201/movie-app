'use client';
import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useHeroMovies } from "@/hooks/useHeroMovies";
import { movieService } from "@/services/movieService";
import LoadingSpinner from "../LoadingSpinner";

export function HeroSection() {
  const { movies, isLoading, error, formatRuntime, getReleaseYear } = useHeroMovies();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 10000); // Change slide every 6 seconds

      return () => clearInterval(interval);
    }
  }, [movies.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-white bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Movies</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-white bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No Movies Available</h2>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];  return (
    <div className="relative w-full h-screen overflow-hidden -mt-20 pt-20">
      {/* Animated Background with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Primary Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
          style={{
            backgroundImage: currentMovie?.backdrop_path 
              ? `linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%), url(${movieService.getBackdropUrl(currentMovie.backdrop_path)})`
              : "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%), url('/movie.png')"
          }}
        />
        
        {/* Animated Overlay Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/30 via-transparent to-orange-500/30 animate-pulse" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-500/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full flex">        {/* Left Side - Featured Movie Info */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="max-w-3xl">
              {/* Movie Badge */}
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🎬 NOW PLAYING
                </div>
                <div className="ml-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                  #{currentSlide + 1} Featured
                </div>
              </div>

              {/* Movie Title with Gradient */}
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {currentMovie?.title}
                </span>
              </h1>

              {/* Enhanced Movie Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Genres with enhanced styling */}
                <div className="flex gap-2">
                  {currentMovie?.genres?.slice(0, 3).map((genre, index) => (
                    <div
                      key={genre.id}
                      className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
                        index === 0 ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' :
                        index === 1 ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' :
                        'bg-gradient-to-r from-purple-600 to-red-600 text-white'
                      }`}
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
                
                {/* Year with icon */}
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm font-semibold">
                    {getReleaseYear(currentMovie?.release_date || '')}
                  </span>
                </div>

                {/* Runtime with enhanced styling */}
                {currentMovie?.runtime && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white text-sm font-semibold">
                      {formatRuntime(currentMovie.runtime)}
                    </span>
                  </div>
                )}
                
                {/* Enhanced Rating */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-4 py-2 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-sm font-bold">
                    {parseFloat(currentMovie?.vote_average.toFixed(1) || '0')}
                  </span>
                </div>
              </div>

              {/* Enhanced Movie Overview */}
              <div className="mb-10">
                <p className="text-gray-100 text-lg lg:text-xl leading-relaxed line-clamp-4 drop-shadow-lg">
                  {currentMovie?.overview}
                </p>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href={`/watch/${currentMovie?.id}`}>
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-red-500/50 border-2 border-red-500/20">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Now
                  </Button>
                </Link>

                <Button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-10 py-4 text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Favorites
                </Button>

                <Button className="bg-black/30 backdrop-blur-md hover:bg-black/50 text-white border-2 border-gray-600/50 hover:border-gray-500 px-8 py-4 text-lg font-bold rounded-xl transition-all">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Later
                </Button>
              </div>
            </div>
          </div>
        </div>{/* Right Side - Movie Showcase */}
        <div className="hidden lg:block w-96 xl:w-[600px] 2xl:w-[700px] p-8">
          <div className="h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Featured Movies
              </h3>
              <div className="text-white/70 text-sm">
                {currentSlide + 1} of {movies.length}
              </div>
            </div>
            
            {/* Enhanced Movie Grid - Show more movies */}
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
              {movies.slice(0, 8).map((movie, index) => (
                <div key={movie.id} className="relative">
                  <div 
                    className={`relative group cursor-pointer transition-all duration-500 transform ${
                      index === currentSlide 
                        ? 'ring-3 ring-red-500 ring-opacity-80 scale-110 shadow-2xl shadow-red-500/30' 
                        : 'hover:scale-105 hover:shadow-xl hover:shadow-black/50'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden relative">
                      <Image
                        src={movie.poster_path 
                          ? movieService.getImageUrl(movie.poster_path)
                          : '/placeholder-movie.jpg'
                        }
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized={true}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-red-600 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                      
                      {/* Featured Badge for Current Movie */}
                      {index === currentSlide && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
                          ✨ Featured
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-white text-sm font-semibold line-clamp-1 group-hover:text-red-400 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-400 text-xs">{getReleaseYear(movie.release_date)}</p>
                        {movie.genres && movie.genres.length > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                            {movie.genres[0].name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Navigation Dots with Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {movies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full scale-125' 
                        : 'w-3 h-3 bg-white/30 hover:bg-white/50 rounded-full hover:scale-110'
                    }`}
                  />
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / movies.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />

      {/* Carousel Navigation (Mobile) */}
      <div className="lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-red-500 scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
