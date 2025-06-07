'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MovieDetails, MovieVideo, MovieWatchProviders } from '@/types/movie';
import { movieService } from '@/services/movieService';
import WatchProviders from '@/components/WatchProviders';

const WatchPage = () => {
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id as string;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<MovieVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchProviders, setWatchProviders] = useState<MovieWatchProviders | null>(null);

  useEffect(() => {
    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);
  const fetchMovieData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [details, videosResponse, watchProvidersResponse] = await Promise.all([
        movieService.getMovieDetails(parseInt(movieId)),
        movieService.getMovieVideos(parseInt(movieId)),
        movieService.getMovieWatchProviders(parseInt(movieId)).catch(() => null), // Optional - don't fail if not available
      ]);

      setMovieDetails(details);
      setWatchProviders(watchProvidersResponse);
      
      // Filter and prioritize videos
      const availableVideos = videosResponse.results.filter(
        video => video.site === 'YouTube'
      );
      
      // Prioritize trailers, then teasers, then other videos
      const sortedVideos = availableVideos.sort((a, b) => {
        const priority = { 'Trailer': 3, 'Teaser': 2, 'Clip': 1 };
        return (priority[b.type as keyof typeof priority] || 0) - (priority[a.type as keyof typeof priority] || 0);
      });

      setVideos(sortedVideos);
      
      if (sortedVideos.length > 0) {
        setSelectedVideo(sortedVideos[0]);
      }
    } catch (err) {
      setError('Failed to load movie data. Please try again.');
      console.error('Error fetching movie data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Error Loading Movie</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={goBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">No Videos Available</h1>
          <p className="mb-4">Sorry, no videos are available for this movie.</p>
          <button
            onClick={goBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with controls */}
      <div className="sticky top-0 z-30 bg-black bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={goBack}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center"
          >
            ← Back
          </button>
          
          <h1 className="text-lg md:text-xl font-bold text-white truncate mx-4">
            {movieDetails.title}
          </h1>
          
          <button
            onClick={toggleFullscreen}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'container mx-auto px-4 py-6'}`}>
        <div className={`${isFullscreen ? 'w-full h-full' : 'grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen'}`}>
          
          {/* Left Column - Video Player */}
          <div className={`${isFullscreen ? 'w-full h-full' : 'lg:col-span-2'}`}>
            <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full aspect-video bg-gray-900 rounded-lg overflow-hidden'}`}>
              {selectedVideo ? (
                <iframe
                  src={`${movieService.getYouTubeUrl(selectedVideo.key)}?autoplay=1&modestbranding=1&rel=0`}
                  title={selectedVideo.name}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <p>No video selected</p>
                </div>
              )}

              {/* Fullscreen overlay controls */}
              {isFullscreen && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <button
                    onClick={goBack}
                    className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white px-4 py-2 rounded flex items-center"
                  >
                    ← Back
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white px-4 py-2 rounded"
                  >
                    Exit Fullscreen
                  </button>
                </div>
              )}

              {/* Video title overlay for fullscreen */}
              {isFullscreen && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {movieDetails.title}
                  </h1>
                  {selectedVideo && (
                    <p className="text-sm md:text-lg text-gray-300 drop-shadow">
                      {selectedVideo.name} • {selectedVideo.type}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Video Selection - Only shown when not in fullscreen */}
            {!isFullscreen && videos.length > 1 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Available Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {videos.map((video) => (
                    <div
                      key={video.key}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedVideo?.key === video.key
                          ? 'bg-blue-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <h3 className="font-semibold text-sm mb-1">{video.name}</h3>
                      <div className="flex justify-between items-center text-xs text-gray-300">
                        <span className="bg-gray-700 px-2 py-1 rounded">{video.type}</span>
                        <span>{video.site}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Movie Overview - Only shown when not in fullscreen */}
            {!isFullscreen && (
              <div className="mt-6 bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Overview</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{movieDetails.overview}</p>
                
                {movieDetails.tagline && (
                  <p className="text-lg italic text-blue-400">&quot;{movieDetails.tagline}&quot;</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Movie Details */}
          {!isFullscreen && (
            <div className="lg:col-span-1 space-y-6">
              {/* Movie Poster */}
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={movieDetails.poster_path 
                    ? movieService.getImageUrl(movieDetails.poster_path)
                    : '/placeholder-movie.jpg'
                  }
                  alt={movieDetails.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>

              {/* Movie Statistics */}
              <div className="bg-gray-900 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold">Movie Details</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg mr-2">★</span>
                    <span className="font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400 ml-2">({movieDetails.vote_count} votes)</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Release Date:</span>
                    <span className="ml-2">{new Date(movieDetails.release_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Runtime:</span>
                    <span className="ml-2">{movieDetails.runtime} minutes</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2">{movieDetails.status}</span>
                  </div>

                  {movieDetails.budget > 0 && (
                    <div>
                      <span className="text-gray-400">Budget:</span>
                      <span className="ml-2">${movieDetails.budget.toLocaleString()}</span>
                    </div>
                  )}

                  {movieDetails.revenue > 0 && (
                    <div>
                      <span className="text-gray-400">Revenue:</span>
                      <span className="ml-2">${movieDetails.revenue.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movieDetails.genres && movieDetails.genres.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.genres.map(genre => (
                        <span
                          key={genre.id}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Companies */}
                {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Production</h4>
                    <div className="space-y-1">
                      {movieDetails.production_companies.slice(0, 3).map(company => (
                        <div key={company.id} className="text-sm text-gray-300">
                          {company.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Watch Providers */}
              {watchProviders && (
                <div>
                  <WatchProviders watchProviders={watchProviders} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;