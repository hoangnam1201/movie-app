'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, MovieDetails, MovieVideo } from '@/types/movie';
import { movieService } from '@/services/movieService';

interface MovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MovieVideo | null>(null);

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [details, videosResponse] = await Promise.all([
        movieService.getMovieDetails(movie.id),
        movieService.getMovieVideos(movie.id),
      ]);
      
      setMovieDetails(details);
      const trailerVideos = videosResponse.results.filter(
        video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
      );
      setVideos(trailerVideos);
      
      // Set the first trailer as default
      if (trailerVideos.length > 0) {
        setSelectedVideo(trailerVideos[0]);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const backdropUrl = movieDetails?.backdrop_path 
    ? movieService.getBackdropUrl(movieDetails.backdrop_path)
    : null;

  const posterUrl = movieDetails?.poster_path 
    ? movieService.getImageUrl(movieDetails.poster_path)
    : '/placeholder-movie.jpg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold truncate">{movie.title}</h2>
          <div className="flex items-center gap-3">
            <Link href={`/watch/${movie.id}`}>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2">
                ▶ Watch Now
              </button>
            </Link>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Loading movie details...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Backdrop Image */}
            {backdropUrl && (
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={backdropUrl}
                  alt={movieDetails?.title || ''}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Poster and Basic Info */}
              <div className="md:col-span-1">
                <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={posterUrl}
                    alt={movieDetails?.title || ''}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="ml-1 font-semibold">{movieDetails?.vote_average.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500">({movieDetails?.vote_count} votes)</span>
                  </div>
                  
                  <p><strong>Release Date:</strong> {movieDetails?.release_date}</p>
                  <p><strong>Runtime:</strong> {movieDetails?.runtime} minutes</p>
                  <p><strong>Status:</strong> {movieDetails?.status}</p>
                  
                  {movieDetails?.genres && (
                    <div>
                      <strong>Genres:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {movieDetails.genres.map(genre => (
                          <span
                            key={genre.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                {/* Tagline */}
                {movieDetails?.tagline && (
                  <p className="text-lg italic text-gray-600 mb-4">&quot;{movieDetails.tagline}&quot;</p>
                )}

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{movieDetails?.overview}</p>
                </div>

                {/* Video Section */}
                {videos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Preview</h3>
                    
                    {selectedVideo && (
                      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                        <iframe
                          src={movieService.getYouTubeUrl(selectedVideo.key)}
                          title={selectedVideo.name}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                )}

                {/* Production Info */}
                {movieDetails?.production_companies && movieDetails.production_companies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Production Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.production_companies.map(company => (
                        <span
                          key={company.id}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm"
                        >
                          {company.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;