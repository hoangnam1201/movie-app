import React from 'react';
import Image from 'next/image';
import { MovieWatchProviders, WatchProvider } from '@/types/movie';
import { movieService } from '@/services/movieService';

interface WatchProvidersProps {
  watchProviders: MovieWatchProviders;
  countryCode?: string;
}

const WatchProviders: React.FC<WatchProvidersProps> = ({ 
  watchProviders, 
  countryCode = 'US' 
}) => {
  const providers = watchProviders.results[countryCode];

  if (!providers) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Where to Watch</h3>
        <p className="text-gray-400">No streaming information available for your region.</p>
      </div>
    );
  }

  const renderProviderSection = (title: string, providerList: WatchProvider[] | undefined, color: string) => {
    if (!providerList || providerList.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className={`font-semibold mb-3 ${color}`}>{title}</h4>
        <div className="flex flex-wrap gap-3">
          {providerList.slice(0, 6).map((provider) => (
            <div
              key={provider.provider_id}
              className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-colors"
              title={provider.provider_name}
            >
              <div className="relative w-8 h-8 rounded overflow-hidden">
                <Image
                  src={movieService.getImageUrl(provider.logo_path)}
                  alt={provider.provider_name}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <span className="text-sm font-medium">{provider.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Where to Watch</h3>
        {providers.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
          >
            View on JustWatch
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      <div className="space-y-4">
        {renderProviderSection('Stream', providers.flatrate, 'text-green-400')}
        {renderProviderSection('Rent', providers.rent, 'text-yellow-400')}
        {renderProviderSection('Buy', providers.buy, 'text-blue-400')}
        {renderProviderSection('Free with Ads', providers.ads, 'text-purple-400')}
      </div>

      {(!providers.flatrate?.length && !providers.rent?.length && !providers.buy?.length && !providers.ads?.length) && (
        <p className="text-gray-400 text-center py-4">
          No streaming options available in your region.
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Streaming data provided by JustWatch. Availability may vary by region and change over time.
        </p>
      </div>
    </div>
  );
};

export default WatchProviders;
