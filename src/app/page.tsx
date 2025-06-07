import { HeroSection } from '@/components/HeroSection'
import MovieList from '@/components/MovieList'
import MovieCategoryLinks from '@/components/MovieCategoryLinks'
import { movieService } from '@/services/movieService'
import React from 'react'

const HomePage = async () => {
  try {
    // Fetch initial data on the server
    const [popularMovies, nowPlayingMovies, topRatedMovies] = await Promise.all([
      movieService.getPopularMovies(1),
      movieService.getNowPlayingMovies(1),
      movieService.getTopRatedMovies(1),
    ]);

    return (
      <div className="animate-fade-in-scale container-safe">
        <div className="animate-slide-in-top">
          <HeroSection />
        </div>
        
        {/* Movie Category Navigation */}
        <div className="animate-slide-in-bottom container-safe py-12" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Explore Movies by Category
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover movies from different categories. Browse popular titles, catch what&apos;s playing now, or explore the highest-rated films of all time.
            </p>
          </div>
          <MovieCategoryLinks 
            variant="cards" 
            showIcons={true} 
            showDescriptions={true}
            className="max-w-4xl mx-auto"
          />
        </div>
        
        {/* Popular Movies Section */}
        <div className="animate-slide-in-left container-safe" style={{ animationDelay: '0.2s' }}>
          <MovieList 
            category="popular" 
            title="Popular Movies"
            initialMovies={popularMovies.results}
          />
        </div>
        
        {/* Now Playing Movies Section */}
        <div className="container-safe">
          <MovieList 
            category="now_playing" 
            title="Now Playing"
            initialMovies={nowPlayingMovies.results}
          />
        </div>
        
        {/* Top Rated Movies Section */}
        <div className="container-safe">
          <MovieList 
            category="top_rated" 
            title="Top Rated Movies"
            initialMovies={topRatedMovies.results}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-primary">Failed to load initial data. Please try again later.</p>
      </div>
    );
  }
    
}

export default HomePage