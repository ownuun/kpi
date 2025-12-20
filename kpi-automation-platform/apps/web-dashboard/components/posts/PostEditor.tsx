'use client';

import { useState, useEffect } from 'react';
import { Platform } from '@/types/posts';

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
  platforms: Platform[];
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

// Platform character limits
const PLATFORM_LIMITS: Record<Platform, number> = {
  [Platform.TWITTER]: 280,
  [Platform.FACEBOOK]: 63206,
  [Platform.INSTAGRAM]: 2200,
  [Platform.LINKEDIN]: 3000,
  [Platform.YOUTUBE]: 5000,
  [Platform.PINTEREST]: 500,
  [Platform.TIKTOK]: 2200,
  [Platform.THREADS]: 500,
  [Platform.REDDIT]: 40000,
  [Platform.DISCORD]: 2000,
  [Platform.TELEGRAM]: 4096,
  [Platform.MASTODON]: 500,
  [Platform.BLUESKY]: 300,
  [Platform.MEDIUM]: 100000,
  [Platform.WORDPRESS]: 100000,
  [Platform.GHOST]: 100000,
  [Platform.DRUPAL]: 100000,
};

export default function PostEditor({
  content,
  onChange,
  platforms,
  tags = [],
  onTagsChange,
}: PostEditorProps) {
  const [newTag, setNewTag] = useState('');
  const [characterWarnings, setCharacterWarnings] = useState<
    Array<{ platform: Platform; limit: number; current: number }>
  >([]);

  useEffect(() => {
    if (platforms.length === 0) return;

    const warnings = platforms
      .map((platform) => ({
        platform,
        limit: PLATFORM_LIMITS[platform],
        current: content.length,
      }))
      .filter((w) => w.current > w.limit);

    setCharacterWarnings(warnings);
  }, [content, platforms]);

  const handleAddTag = () => {
    if (!newTag.trim() || !onTagsChange) return;
    const tag = newTag.trim().replace(/^#/, '');
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!onTagsChange) return;
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onChange(content + '\n');
    }
  };

  const mostRestrictive = platforms.length > 0
    ? Math.min(...platforms.map((p) => PLATFORM_LIMITS[p]))
    : Infinity;

  const getCharCountColor = () => {
    const ratio = content.length / mostRestrictive;
    if (ratio > 1) return 'text-red-600';
    if (ratio > 0.9) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {/* Text Area */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? (Ctrl+Enter for new line)"
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-sans text-gray-900"
          maxLength={mostRestrictive}
        />

        {/* Character Count */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-sm font-medium ${getCharCountColor()}`}>
            {content.length}
            {mostRestrictive !== Infinity && ` / ${mostRestrictive}`}
          </span>
        </div>
      </div>

      {/* Character Warnings */}
      {characterWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">
                Character limit exceeded
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {characterWarnings.map((warning) => (
                  <li key={warning.platform}>
                    {warning.platform}: {warning.current} / {warning.limit} characters
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex gap-2 items-center border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => onChange(content + '**bold**')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Bold"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 4v12h4.5a3.5 3.5 0 001.528-6.653A3.5 3.5 0 0010.5 4H6zm2 5V6h2.5a1.5 1.5 0 110 3H8zm0 2h3a2 2 0 110 4H8v-4z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onChange(content + '*italic*')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Italic"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 2h8v2h-2.5l-4 12H12v2H4v-2h2.5l4-12H8V2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onChange(content + '\n• ')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Bullet List"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onChange(content + '🔗 [link text](url)')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Add Link"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
          </svg>
        </button>

        <div className="flex-1"></div>

        {/* AI Assist (Future Feature) */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:bg-gray-100 rounded transition-colors"
          title="AI Assist (Coming Soon)"
          disabled
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
          </svg>
        </button>
      </div>

      {/* Tags Input */}
      {onTagsChange && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags (Hashtags)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tag (without #)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
