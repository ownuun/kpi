'use client';

import { Platform } from '@/types/posts';

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

const PLATFORM_INFO: Record<
  Platform,
  {
    name: string;
    icon: string;
    color: string;
    bgColor: string;
    category: 'social' | 'video' | 'blog';
  }
> = {
  [Platform.FACEBOOK]: {
    name: 'Facebook',
    icon: 'f',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    category: 'social',
  },
  [Platform.INSTAGRAM]: {
    name: 'Instagram',
    icon: 'ig',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    category: 'social',
  },
  [Platform.TWITTER]: {
    name: 'Twitter/X',
    icon: 'X',
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    category: 'social',
  },
  [Platform.LINKEDIN]: {
    name: 'LinkedIn',
    icon: 'in',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    category: 'social',
  },
  [Platform.THREADS]: {
    name: 'Threads',
    icon: '@',
    color: 'text-gray-800',
    bgColor: 'bg-gray-100',
    category: 'social',
  },
  [Platform.MASTODON]: {
    name: 'Mastodon',
    icon: 'M',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    category: 'social',
  },
  [Platform.BLUESKY]: {
    name: 'Bluesky',
    icon: 'B',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    category: 'social',
  },
  [Platform.REDDIT]: {
    name: 'Reddit',
    icon: 'R',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    category: 'social',
  },
  [Platform.DISCORD]: {
    name: 'Discord',
    icon: 'D',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    category: 'social',
  },
  [Platform.TELEGRAM]: {
    name: 'Telegram',
    icon: 'T',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    category: 'social',
  },
  [Platform.YOUTUBE]: {
    name: 'YouTube',
    icon: 'YT',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    category: 'video',
  },
  [Platform.TIKTOK]: {
    name: 'TikTok',
    icon: 'TT',
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    category: 'video',
  },
  [Platform.PINTEREST]: {
    name: 'Pinterest',
    icon: 'P',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    category: 'social',
  },
  [Platform.MEDIUM]: {
    name: 'Medium',
    icon: 'M',
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    category: 'blog',
  },
  [Platform.WORDPRESS]: {
    name: 'WordPress',
    icon: 'W',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    category: 'blog',
  },
  [Platform.GHOST]: {
    name: 'Ghost',
    icon: 'G',
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    category: 'blog',
  },
  [Platform.DRUPAL]: {
    name: 'Drupal',
    icon: 'Dr',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    category: 'blog',
  },
};

export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const togglePlatform = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  const toggleCategory = (category: 'social' | 'video' | 'blog') => {
    const categoryPlatforms = Object.entries(PLATFORM_INFO)
      .filter(([_, info]) => info.category === category)
      .map(([platform]) => platform as Platform);

    const allSelected = categoryPlatforms.every((p) => selected.includes(p));

    if (allSelected) {
      onChange(selected.filter((p) => !categoryPlatforms.includes(p)));
    } else {
      const newSelected = [...selected];
      categoryPlatforms.forEach((p) => {
        if (!newSelected.includes(p)) {
          newSelected.push(p);
        }
      });
      onChange(newSelected);
    }
  };

  const selectAll = () => {
    onChange(Object.keys(PLATFORM_INFO) as Platform[]);
  };

  const clearAll = () => {
    onChange([]);
  };

  const renderPlatformButton = (platform: Platform) => {
    const info = PLATFORM_INFO[platform];
    const isSelected = selected.includes(platform);

    return (
      <button
        key={platform}
        type="button"
        onClick={() => togglePlatform(platform)}
        className={`
          relative flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
          ${
            isSelected
              ? `${info.bgColor} ${info.color} border-current font-medium`
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }
        `}
      >
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
          ${isSelected ? info.bgColor : 'bg-gray-100'}
        `}
        >
          {info.icon}
        </div>
        <span className="text-sm">{info.name}</span>
        {isSelected && (
          <svg
            className="w-5 h-5 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    );
  };

  const socialPlatforms = Object.entries(PLATFORM_INFO)
    .filter(([_, info]) => info.category === 'social')
    .map(([platform]) => platform as Platform);

  const videoPlatforms = Object.entries(PLATFORM_INFO)
    .filter(([_, info]) => info.category === 'video')
    .map(([platform]) => platform as Platform);

  const blogPlatforms = Object.entries(PLATFORM_INFO)
    .filter(([_, info]) => info.category === 'blog')
    .map(([platform]) => platform as Platform);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="px-4 py-2 text-sm bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          Select All ({Object.keys(PLATFORM_INFO).length})
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-2 text-sm bg-gray-50 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={() => toggleCategory('social')}
          className="px-4 py-2 text-sm bg-gray-50 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Social Media
        </button>
        <button
          type="button"
          onClick={() => toggleCategory('video')}
          className="px-4 py-2 text-sm bg-gray-50 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Video Platforms
        </button>
        <button
          type="button"
          onClick={() => toggleCategory('blog')}
          className="px-4 py-2 text-sm bg-gray-50 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Blog Platforms
        </button>
      </div>

      {/* Selected Count */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{selected.length}</span> platform
        {selected.length !== 1 ? 's' : ''} selected
      </div>

      {/* Social Media Platforms */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Social Media Platforms
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {socialPlatforms.map(renderPlatformButton)}
        </div>
      </div>

      {/* Video Platforms */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Video Platforms
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {videoPlatforms.map(renderPlatformButton)}
        </div>
      </div>

      {/* Blog Platforms */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Blog Platforms</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {blogPlatforms.map(renderPlatformButton)}
        </div>
      </div>

      {/* Validation Warning */}
      {selected.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-yellow-800">
              Please select at least one platform to publish your post.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
