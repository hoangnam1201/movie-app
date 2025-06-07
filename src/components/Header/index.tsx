'use client';
import React from "react";
import { usePathname } from "next/navigation";
import SearchBox from "../SearchBox";
import Dropdown from "../Dropdown";
import Link from "next/link";
import useNavigationData from "@/hooks/useNavigationData";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const { fetchNavigationData } = useNavigationData();
  const [genres, setGenres] = React.useState<{ id: number; name: string }[]>([]);
  const [countries, setCountries] = React.useState<{ iso_3166_1: string; english_name: string; native_name: string }[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Scroll detection
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  React.useEffect(() => {
    const fetchData = async () => {
      try { 
      const data = await fetchNavigationData();
      setGenres(data.genres);
      setCountries(data.countries);
      }
      catch (error) {
        console.error("Failed to fetch navigation data:", error);
      }
    };
    fetchData();
  }, []);

  // Close mobile menu when pathname changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Transform genres for dropdown
  const genreItems = genres.map(genre => ({
    id: genre.id,
    name: genre.name,
    href: `/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`
  }));

  // Transform countries for dropdown
  const countryItems = countries.map(country => ({
    id: country.iso_3166_1,
    name: country.english_name,
    href: `/country/${country.iso_3166_1}?name=${encodeURIComponent(country.english_name)}`
  }));
  // Helper function to check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  // Close mobile menu when navigating
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };  // Check if we're on the home page
  const isHomePage = pathname === '/';

  return (
    <nav className={`fixed top-0 w-full h-20 flex items-center justify-between text-foreground px-4 sm:px-6 lg:px-8 z-50 transition-all duration-500 ease-in-out ${
      isScrolled || !isHomePage
        ? 'bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-lg border-b border-white/10 shadow-2xl' 
        : 'bg-transparent backdrop-blur-none border-b border-transparent'
    }`}>      {/* Enhanced Logo/Brand */}
      <div className="flex items-center">
        <Link 
          href="/" 
          className={`flex items-center gap-3 transition-all duration-300 ${
            isScrolled || !isHomePage ? 'hover:scale-105' : 'hover:scale-110'
          }`}
          onClick={handleLinkClick}
        >
          <div className={`transition-all duration-300 ${
            isScrolled || !isHomePage 
              ? 'w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500' 
              : 'w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500'
          } rounded-xl flex items-center justify-center shadow-lg`}>
           <Image 
              src="/logo.png" 
              alt="Logo"
              className="w-full h-full object-contain"
              width={75}
              height={48}
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold transition-all duration-300 ${
              isScrolled || !isHomePage 
                ? 'text-xl text-white' 
                : 'text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'
            }`}>
              Absolute Cinema
            </span>
            {(!isScrolled && isHomePage) && (
              <span className="text-xs text-gray-300 font-medium tracking-wider">
                DISCOVER MOVIES
              </span>
            )}
          </div>
        </Link>
      </div>      {/* Enhanced Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        <ul className="flex items-center gap-6 text-base font-medium">
          <li>
            <Link 
              href="/" 
              className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'hover:scale-105'
                  : 'hover:scale-110'
              } ${
                isActiveLink('/') 
                  ? isScrolled
                    ? 'text-red-400' 
                    : 'text-white'
                  : isScrolled
                    ? 'text-gray-200 hover:text-white' 
                    : 'text-white/90 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Home
              </span>
              
            </Link>
          </li>
          <li>
            <div className={isScrolled || !isHomePage ? 'text-gray-200' : 'text-white/90'}>
              <Dropdown 
                title="Genre" 
                items={genreItems}
                isLoading={false}
              />
            </div>
          </li>
          <li>
            <div className={isScrolled || !isHomePage ? 'text-gray-200' : 'text-white/90'}>
              <Dropdown 
                title="Country" 
                items={countryItems}
                isLoading={false}
              />
            </div>
          </li>
          <li>
            <Link 
              href="/movies" 
              className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'hover:scale-105'
                  : 'hover:scale-110'
              } ${
                isActiveLink('/movies') 
                  ? isScrolled || !isHomePage 
                    ? 'text-red-400' 
                    : 'text-white'
                  : isScrolled || !isHomePage 
                    ? 'text-gray-200 hover:text-white' 
                    : 'text-white/90 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
                Movies
              </span>
            </Link>
          </li>
          <li>
            <Link 
              href="/tv" 
              className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'hover:scale-105'
                  : 'hover:scale-110'
              } ${
                isActiveLink('/tv') 
                  ? isScrolled || !isHomePage 
                    ? 'text-red-400' 
                    : 'text-white'
                  : isScrolled || !isHomePage 
                    ? 'text-gray-200 hover:text-white' 
                    : 'text-white/90 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM16 10v4.5l4-2.25L16 10zM10 15.5v-7L6 10.75 10 15.5z"/>
                </svg>
                Series
              </span>
            </Link>
          </li>
          <li>
            <Link 
              href="/animation" 
              className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'hover:scale-105'
                  : 'hover:scale-110'
              } ${
                isActiveLink('/animation') 
                  ? isScrolled || !isHomePage 
                    ? 'text-red-400' 
                    : 'text-white'
                  : isScrolled || !isHomePage 
                    ? 'text-gray-200 hover:text-white' 
                    : 'text-white/90 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Animation
              </span>
            </Link>
          </li>
        </ul>
        
        {/* Enhanced Desktop Search */}
        <div className={`relative group transition-all duration-300 ${
          isScrolled || !isHomePage 
            ? 'bg-white/10 rounded-xl p-1 backdrop-blur-sm' 
            : 'bg-white/5 rounded-xl p-1 backdrop-blur-sm hover:bg-white/10'
        }`}>
          <SearchBox
            placeholder="Search movies..."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-5 group-hover:rotate-12 transition-transform duration-300 ${
                  isScrolled || !isHomePage ? 'text-gray-300' : 'text-white/80'
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
          />
        </div>
      </div>      {/* Enhanced Mobile/Tablet Menu Button */}
      <div className="lg:hidden flex items-center gap-4">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isScrolled || !isHomePage
              ? 'hover:bg-white/10 bg-white/5'
              : 'hover:bg-white/10 bg-white/5'
          }`}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isScrolled || !isHomePage ? 'bg-white' : 'bg-white'
              } ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 my-1 transition-all duration-300 ${
                isScrolled || !isHomePage ? 'bg-white' : 'bg-white'
              } ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isScrolled || !isHomePage ? 'bg-white' : 'bg-white'
              } ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}      {/* Enhanced Mobile Menu */}
      <div
        className={`lg:hidden fixed top-20 right-0 w-80 max-w-[90vw] h-[calc(100vh-5rem)] bg-gradient-to-b from-gray-900/98 via-black/98 to-gray-900/98 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-all duration-500 z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Mobile Search */}
          <div className="mb-8">
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
              <SearchBox
                placeholder="Search movies..."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Enhanced Mobile Navigation Links */}
          <nav className="space-y-3">
            <Link 
              href="/" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                isActiveLink('/') ? 'text-red-400 bg-red-500/20 shadow-lg' : 'text-white hover:text-red-300'
              }`}
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="font-medium">Home</span>
            </Link>
            
            <div className="space-y-3">
              <div className="px-4 py-2 text-gray-400 text-sm font-semibold uppercase tracking-wider border-b border-white/10">
                Browse Categories
              </div>
              <div className="pl-4 space-y-2">
                <div className="text-white/90">
                  <Dropdown 
                    title="Genre" 
                    items={genreItems}
                    isLoading={false}
                  />
                </div>
                <div className="text-white/90">
                  <Dropdown 
                    title="Country" 
                    items={countryItems}
                    isLoading={false}
                  />
                </div>
              </div>
            </div>
            
            <Link 
              href="/movies" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                isActiveLink('/movies') ? 'text-red-400 bg-red-500/20 shadow-lg' : 'text-white hover:text-red-300'
              }`}
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
              <span className="font-medium">Movies</span>
            </Link>
            
            <Link 
              href="/tv" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                isActiveLink('/tv') ? 'text-red-400 bg-red-500/20 shadow-lg' : 'text-white hover:text-red-300'
              }`}
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM16 10v4.5l4-2.25L16 10zM10 15.5v-7L6 10.75 10 15.5z"/>
              </svg>
              <span className="font-medium">Series</span>
            </Link>
            
            <Link 
              href="/animation" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                isActiveLink('/animation') ? 'text-red-400 bg-red-500/20 shadow-lg' : 'text-white hover:text-red-300'
              }`}
              onClick={handleLinkClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-medium">Animation</span>
            </Link>
          </nav>

          {/* Additional Mobile Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Discover Amazing Movies</div>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
