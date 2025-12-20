'use client';

import { useState } from 'react';
import { Platform, MediaType } from '@/types/posts';

interface PostPreviewProps {
  content: string;
  platforms: Platform[];
  media: Array<{ type: MediaType; url: string }>;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.FACEBOOK]: 'bg-blue-600',
  [Platform.INSTAGRAM]: 'bg-pink-600',
  [Platform.TWITTER]: 'bg-gray-900',
  [Platform.LINKEDIN]: 'bg-blue-700',
  [Platform.YOUTUBE]: 'bg-red-600',
  [Platform.PINTEREST]: 'bg-red-600',
  [Platform.TIKTOK]: 'bg-gray-900',
  [Platform.THREADS]: 'bg-gray-800',
  [Platform.REDDIT]: 'bg-orange-600',
  [Platform.DISCORD]: 'bg-indigo-600',
  [Platform.TELEGRAM]: 'bg-blue-500',
  [Platform.MASTODON]: 'bg-purple-600',
  [Platform.BLUESKY]: 'bg-sky-600',
  [Platform.MEDIUM]: 'bg-gray-900',
  [Platform.WORDPRESS]: 'bg-blue-600',
  [Platform.GHOST]: 'bg-gray-900',
  [Platform.DRUPAL]: 'bg-blue-600',
};

export default function PostPreview({ content, platforms, media }: PostPreviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    platforms.length > 0 ? platforms[0] : null
  );

  if (platforms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p>Select platforms to see preview</p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    if (!selectedPlatform) return null;

    switch (selectedPlatform) {
      case Platform.TWITTER:
        return <TwitterPreview content={content} media={media} />;
      case Platform.FACEBOOK:
        return <FacebookPreview content={content} media={media} />;
      case Platform.INSTAGRAM:
        return <InstagramPreview content={content} media={media} />;
      case Platform.LINKEDIN:
        return <LinkedInPreview content={content} media={media} />;
      default:
        return <GenericPreview platform={selectedPlatform} content={content} media={media} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Preview</h2>

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                ${
                  selectedPlatform === platform
                    ? `${PLATFORM_COLORS[platform]} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">{renderPreview()}</div>
    </div>
  );
}

function TwitterPreview({ content, media }: { content: string; media: any[] }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">Your Name</span>
            <span className="text-gray-500 text-sm">@username</span>
            <span className="text-gray-500 text-sm">· now</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{content || 'Your tweet will appear here...'}</p>
          {media.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden border border-gray-200">
              {media.slice(0, 4).map((item, index) => (
                <div key={index} className="aspect-video bg-gray-100">
                  {item.type === MediaType.IMAGE && (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-12 mt-3 text-gray-500">
            <div className="flex items-center gap-1 text-xs">
              <span>💬</span>
              <span>0</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span>🔁</span>
              <span>0</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span>❤️</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Character count: {content.length} / 280
      </div>
    </div>
  );
}

function FacebookPreview({ content, media }: { content: string; media: any[] }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div>
          <div className="font-semibold text-sm">Your Name</div>
          <div className="text-xs text-gray-500">Just now · 🌎</div>
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap">{content || 'Your post will appear here...'}</p>
      {media.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {media[0].type === MediaType.IMAGE && (
            <img src={media[0].url} alt="" className="w-full object-cover" />
          )}
        </div>
      )}
      <div className="flex justify-between pt-2 border-t border-gray-200 text-gray-500 text-xs">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>↗️ Share</span>
      </div>
    </div>
  );
}

function InstagramPreview({ content, media }: { content: string; media: any[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        <span className="font-semibold text-sm">your_username</span>
      </div>
      {media.length > 0 && (
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {media[0].type === MediaType.IMAGE && (
            <img src={media[0].url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}
      <div className="flex gap-4 text-xl">
        <span>❤️</span>
        <span>💬</span>
        <span>↗️</span>
      </div>
      <div className="text-sm">
        <span className="font-semibold">your_username</span>{' '}
        <span className="whitespace-pre-wrap">{content || 'Your caption will appear here...'}</span>
      </div>
    </div>
  );
}

function LinkedInPreview({ content, media }: { content: string; media: any[] }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
        <div>
          <div className="font-semibold text-sm">Your Name</div>
          <div className="text-xs text-gray-500">Your Headline</div>
          <div className="text-xs text-gray-500">Just now · 🌎</div>
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap">{content || 'Your post will appear here...'}</p>
      {media.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {media[0].type === MediaType.IMAGE && (
            <img src={media[0].url} alt="" className="w-full object-cover" />
          )}
        </div>
      )}
      <div className="flex justify-between pt-2 border-t border-gray-200 text-gray-600 text-xs">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>🔁 Repost</span>
        <span>↗️ Send</span>
      </div>
    </div>
  );
}

function GenericPreview({
  platform,
  content,
  media,
}: {
  platform: Platform;
  content: string;
  media: any[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex-1">
          <div className="font-semibold text-sm mb-1">Your Account</div>
          <p className="text-sm whitespace-pre-wrap">
            {content || `Your ${platform} post will appear here...`}
          </p>
          {media.length > 0 && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
              <div className="grid grid-cols-2 gap-1">
                {media.slice(0, 4).map((item, index) => (
                  <div key={index} className="aspect-video bg-gray-100">
                    {item.type === MediaType.IMAGE && (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
        Preview for {platform}
      </div>
    </div>
  );
}
