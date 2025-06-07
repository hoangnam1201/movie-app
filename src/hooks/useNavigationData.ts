import { movieService } from '@/services/movieService';

const POPULAR_COUNTRY_CODES = [
    'US', 'GB', 'CA', 'AU', 'FR', 'DE', 'JP', 'KR', 'IN', 'IT', 'ES', 'BR', 'MX', 'CN', 'RU'
];

const useNavigationData = () => {

    const fetchNavigationData = async () => {
        try {
            const [genresResponse, countriesResponse] = await Promise.all([
                movieService.getMovieGenres(),
                movieService.getCountries()
            ]);

            const popularCountries = countriesResponse.filter(
                country => POPULAR_COUNTRY_CODES.includes(country.iso_3166_1)
            );

            return {
                genres: genresResponse.genres,
                countries: popularCountries
            };
        } catch (error) {
            console.error('Error fetching navigation data:', error);
            throw new Error('Failed to load navigation data');
        } 
    };

    return { fetchNavigationData };
}
export default useNavigationData;


