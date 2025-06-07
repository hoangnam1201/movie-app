import React from 'react';

interface StreamingNoticeProps {
  movieTitle: string;
  onClose?: () => void;
}

const StreamingNotice: React.FC<StreamingNoticeProps> = ({ movieTitle, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              About Movie Streaming
            </h3>
            <div className="text-sm text-blue-100 space-y-2">
              <p>
                <strong>{movieTitle}</strong> - You&apos;re currently watching official trailers, teasers, and clips provided by The Movie Database (TMDB).
              </p>
              <p>
                This application uses TMDB API to showcase movie information and promotional content. 
                For full movie streaming, please check these popular platforms:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">Netflix</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">Disney+</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">HBO Max</span>
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs">Amazon Prime</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Hulu</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">Apple TV+</span>
              </div>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-blue-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default StreamingNotice;
