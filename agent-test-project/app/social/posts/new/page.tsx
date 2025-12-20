'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';

type Platform = 'LINKEDIN' | 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'THREADS' | 'BLUESKY';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
}

export default function NewPostPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const [formData, setFormData] = useState({
    content: '',
    title: '',
    platform: 'LINKEDIN' as Platform,
    scheduledAt: '',
    imageUrl: '',
  });

  // Fetch connected accounts on mount
  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      setAccountsLoading(true);
      const response = await fetch('/api/oauth/accounts');
      if (response.ok) {
        const data = await response.json();
        const accounts = data.accounts || [];
        setConnectedAccounts(accounts);

        // Set default platform to first connected account if available
        if (accounts.length > 0) {
          setFormData(prev => ({
            ...prev,
            platform: accounts[0].platform.toUpperCase() as Platform
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch connected accounts:', err);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for API
      const postData: any = {
        content: formData.content,
        platform: formData.platform,
      };

      // Add optional fields only if they have values
      if (formData.title.trim()) {
        postData.title = formData.title;
      }

      if (formData.scheduledAt) {
        postData.scheduledAt = new Date(formData.scheduledAt).toISOString();
      }

      if (formData.imageUrl.trim()) {
        postData.imageUrl = formData.imageUrl;
      }

      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      // Success - redirect to posts page
      router.push('/social/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const characterCount = formData.content.length;
  const maxCharacters = formData.platform === 'TWITTER' ? 280 : 3000;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('newPostTitle')}</h1>
            <p className="text-gray-600 mt-1">{t('newPostSubtitle')}</p>
          </div>
          <Link
            href="/social/posts"
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            {t('postFormCancel')}
          </Link>
        </div>
      </div>

      {/* No Connected Accounts Warning */}
      {!accountsLoading && connectedAccounts.length === 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">{t('noConnectedAccountsTitle')}</h3>
              <p className="mt-1 text-sm text-yellow-700">{t('noConnectedAccountsMessage')}</p>
              <Link
                href="/settings/accounts"
                className="mt-3 inline-block px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors"
              >
                {t('connectAccountsNow')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Platform Selection */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
            Platform <span className="text-red-500">*</span>
          </label>
          {accountsLoading ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              Loading connected accounts...
            </div>
          ) : connectedAccounts.length === 0 ? (
            <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-700">
              No connected accounts available. Please connect an account first.
            </div>
          ) : (
            <select
              id="platform"
              name="platform"
              required
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {connectedAccounts.map((account) => (
                <option key={account.id} value={account.platform.toUpperCase()}>
                  {account.platform === 'LINKEDIN' ? 'LinkedIn' :
                   account.platform === 'TWITTER' ? 'Twitter' :
                   account.platform === 'FACEBOOK' ? 'Facebook' :
                   account.platform === 'INSTAGRAM' ? 'Instagram' :
                   account.platform === 'YOUTUBE' ? 'YouTube' :
                   account.platform === 'TIKTOK' ? 'TikTok' :
                   account.platform === 'THREADS' ? 'Threads' :
                   account.platform === 'BLUESKY' ? 'Bluesky' :
                   account.platform}
                  {account.username && ` (@${account.username})`}
                </option>
              ))}
            </select>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {connectedAccounts.length > 0
              ? 'Select a connected account to publish this post'
              : 'Connect a social media account to create posts'}
          </p>
        </div>

        {/* Title (Optional) */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for your post"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            A catchy title can help organize your posts
          </p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            value={formData.content}
            onChange={handleChange}
            rows={8}
            placeholder="What's on your mind?"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              isOverLimit
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <div className="mt-1 flex justify-between text-xs">
            <p className="text-gray-500">Write your post content</p>
            <p className={isOverLimit ? 'text-red-500 font-medium' : 'text-gray-500'}>
              {characterCount} / {maxCharacters}
            </p>
          </div>
        </div>

        {/* Image URL (Optional) */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter a URL to an image you want to include in your post
          </p>
          {formData.imageUrl && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <div className="w-full max-w-md h-48 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scheduled Date (Optional) */}
        <div>
          <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule For <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="datetime-local"
            id="scheduledAt"
            name="scheduledAt"
            value={formData.scheduledAt}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to save as draft, or select a date/time to schedule (Format: YYYY-MM-DD HH:mm)
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || isOverLimit || connectedAccounts.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : formData.scheduledAt ? (
              'Schedule Post'
            ) : (
              'Save as Draft'
            )}
          </button>
          <Link
            href="/social/posts"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Post Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>Twitter has a 280 character limit</li>
              <li>Use hashtags to increase visibility</li>
              <li>Schedule posts for optimal engagement times</li>
              <li>Add images to get 2x more engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
