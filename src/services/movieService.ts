import axios from 'axios';
import https from 'https';
import { Movie, MovieResponse, CreateMovieData, MovieDetails, MovieVideosResponse, Genre, MovieWatchProviders } from '@/types/movie';


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
  baseURL: BASE_URL,
   headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  // Only disable SSL verification in development
  ...(process.env.NODE_ENV === 'development' && {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  }),
  params: {
    api_key: API_KEY,
  },
});

export const movieService = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get movie by ID
  getMovieById: async (id: number): Promise<Movie> => {
    const response = await api.get(`/movie/${id}`);
    return response.data;
  },

  // Get movie details by ID
  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    const response = await api.get(`/movie/${id}`);
    return response.data;
  },

  // Get movie videos
  getMovieVideos: async (id: number): Promise<MovieVideosResponse> => {
    const response = await api.get(`/movie/${id}/videos`);
    return response.data;
  },

  // Get similar movies
  getSimilarMovies: async (id: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get(`/movie/${id}/similar`, {
      params: { page },
    });
    return response.data;
  },

  // Get movie recommendations
  getMovieRecommendations: async (id: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get(`/movie/${id}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (id: number) => {
    const response = await api.get(`/movie/${id}/credits`);
    return response.data;
  },
  // Get movie watch providers
  getMovieWatchProviders: async (id: number): Promise<MovieWatchProviders> => {
    const response = await api.get(`/movie/${id}/watch/providers`);
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get movie genres
  getMovieGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await api.get('/genre/movie/list');
    return response.data;
  },

  // Get TV genres
  getTVGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await api.get('/genre/tv/list');
    return response.data;
  },

  // Get countries
  getCountries: async (): Promise<{ iso_3166_1: string; english_name: string; native_name: string }[]> => {
    const response = await api.get('/configuration/countries');
    return response.data;
  },

  // Get popular TV shows
  getPopularTVShows: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/discover/movie', {
      params: { with_genres: genreId, page },
    });
    return response.data;
  },

  // Get movies by country
  getMoviesByCountry: async (countryCode: string, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/discover/movie', {
      params: { with_origin_country: countryCode, page },
    });
    return response.data;
  },

  // Helper function to get full image URL
  getImageUrl: (path: string): string => {
    return `${IMAGE_BASE_URL}${path}`;
  },

  // Helper function to get backdrop image URL
  getBackdropUrl: (path: string): string => {
    return `https://image.tmdb.org/t/p/w1280${path}`;
  },

  // Helper function to get YouTube URL
  getYouTubeUrl: (key: string): string => {
    return `https://www.youtube.com/embed/${key}`;
  },
};

// For local CRUD operations
export const localMovieService = {
  createMovie: async (movieData: CreateMovieData): Promise<Movie> => {
    const newMovie: Movie = {
      id: Date.now(),
      title: movieData.title,
      overview: movieData.overview,
      poster_path: movieData.posterPath,
      backdrop_path: '',
      release_date: movieData.releaseDate || new Date().toISOString().split('T')[0],
      vote_average: movieData.voteAverage || 0,
      vote_count: 0,
      adult: false,
      original_language: 'en',
      original_title: movieData.title,
      popularity: 0,
      video: false,
      genre_ids: [],
    };
    return Promise.resolve(newMovie);
  },

  updateMovie: async (id: number, movieData: Partial<CreateMovieData>): Promise<Movie> => {
    const existingMovie = await movieService.getMovieById(id);
    const updatedMovie: Movie = {
      ...existingMovie,
      title: movieData.title || existingMovie.title,
      overview: movieData.overview || existingMovie.overview,
      poster_path: movieData.posterPath || existingMovie.poster_path,
    };
    return Promise.resolve(updatedMovie);
  },

  deleteMovie: async (id: number): Promise<boolean> => {
    console.log(`Movie with ID ${id} deleted`);
    return Promise.resolve(true);
  },
};