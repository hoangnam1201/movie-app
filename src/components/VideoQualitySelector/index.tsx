import React from 'react';

interface VideoQualityOption {
  label: string;
  value: string;
  description: string;
}

interface VideoQualitySelectorProps {
  currentQuality: string;
  onQualityChange: (quality: string) => void;
  disabled?: boolean;
}

const VideoQualitySelector: React.FC<VideoQualitySelectorProps> = ({
  currentQuality,
  onQualityChange,
  disabled = false
}) => {
  const qualityOptions: VideoQualityOption[] = [
    { label: '360p', value: '360', description: 'Standard Definition' },
    { label: '480p', value: '480', description: 'Enhanced Definition' },
    { label: '720p', value: '720', description: 'High Definition' },
    { label: '1080p', value: '1080', description: 'Full HD' },
    { label: 'Auto', value: 'auto', description: 'Automatic Quality' }
  ];

  return (
    <div className="relative group">
      <button
        disabled={disabled}
        className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Quality
      </button>
      
      <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-48">
        <div className="p-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 px-2">Video Quality</h3>
          {qualityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onQualityChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors ${
                currentQuality === option.value ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{option.label}</span>
                {currentQuality === option.value && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-xs text-gray-400">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoQualitySelector;
