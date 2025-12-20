'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SocialPlatform } from '@prisma/client';
import BackButton from '@/components/BackButton';
import { useI18n } from '@/lib/i18n/context';

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  platformId: string;
  accountName: string;
  accountHandle?: string;
  accountPicture?: string;
  tokenExpiresAt?: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
}

interface PlatformConfig {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description: string;
  isAvailable: boolean;
  tier: number;
}

const PLATFORMS: Record<SocialPlatform, PlatformConfig> = {
  LINKEDIN: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-600',
    description: 'descriptionLinkedIn',
    isAvailable: true,
    tier: 1,
  },
  TWITTER: {
    name: 'twitter',
    displayName: 'Twitter / X',
    icon: '🐦',
    color: 'bg-black',
    description: 'descriptionTwitter',
    isAvailable: true,
    tier: 1,
  },
  FACEBOOK: {
    name: 'facebook',
    displayName: 'Facebook',
    icon: '👤',
    color: 'bg-blue-500',
    description: 'descriptionFacebook',
    isAvailable: true,
    tier: 2,
  },
  INSTAGRAM: {
    name: 'instagram',
    displayName: 'Instagram',
    icon: '📷',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    description: 'descriptionInstagram',
    isAvailable: false,
    tier: 2,
  },
  YOUTUBE: {
    name: 'youtube',
    displayName: 'YouTube',
    icon: '🎥',
    color: 'bg-red-600',
    description: 'descriptionYouTube',
    isAvailable: false,
    tier: 2,
  },
  TIKTOK: {
    name: 'tiktok',
    displayName: 'TikTok',
    icon: '🎵',
    color: 'bg-black',
    description: 'descriptionTikTok',
    isAvailable: false,
    tier: 3,
  },
  THREADS: {
    name: 'threads',
    displayName: 'Threads',
    icon: '🧵',
    color: 'bg-gray-900',
    description: 'descriptionThreads',
    isAvailable: true,
    tier: 3,
  },
  BLUESKY: {
    name: 'bluesky',
    displayName: 'Bluesky',
    icon: '🦋',
    color: 'bg-sky-500',
    description: 'descriptionBluesky',
    isAvailable: false,
    tier: 3,
  },
};

export default function SocialAccountsPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle OAuth callback messages
  useEffect(() => {
    const successParam = searchParams.get('success');
    const errorParam = searchParams.get('error');
    const platform = searchParams.get('platform');

    if (successParam && platform) {
      setSuccess(`Successfully connected ${PLATFORMS[platform.toUpperCase() as SocialPlatform]?.displayName || platform}!`);
      // Clear URL parameters
      window.history.replaceState({}, '', '/settings/accounts');
      // Reload accounts
      loadAccounts();
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      window.history.replaceState({}, '', '/settings/accounts');
    }
  }, [searchParams]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/oauth/accounts');
      if (!response.ok) throw new Error('Failed to load accounts');
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform: string) => {
    window.location.href = `/api/oauth/${platform}/authorize`;
  };

  const handleDisconnect = async (accountId: string, platformName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platformName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/oauth/accounts?id=${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to disconnect account');

      setSuccess(`Successfully disconnected ${platformName}`);
      loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect account');
    }
  };

  const isConnected = (platform: SocialPlatform) => {
    return accounts.some((acc) => acc.platform === platform);
  };

  const getAccount = (platform: SocialPlatform) => {
    return accounts.find((acc) => acc.platform === platform);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('socialAccountsPageTitle')}</h1>
              <p className="mt-2 text-gray-600">
                {t('socialAccountsPageSubtitle')}
              </p>
            </div>
            <a
              href="/settings/oauth-config"
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium flex items-center"
            >
              ⚙️ {t('oauthSettings')}
            </a>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="mt-1 text-sm text-green-700">{success}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="mt-2 text-sm text-green-600 hover:text-green-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading accounts...</p>
          </div>
        ) : (
          <>
            {/* Tier 1: Available Platforms */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('availablePlatforms')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(PLATFORMS)
                  .filter(([_, config]) => config.isAvailable)
                  .map(([platform, config]) => {
                    const connected = isConnected(platform as SocialPlatform);
                    const account = getAccount(platform as SocialPlatform);

                    return (
                      <div
                        key={platform}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`${config.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                              {config.icon}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {config.displayName}
                              </h3>
                              {connected && account ? (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">
                                    {account.accountName}
                                  </p>
                                  {account.accountHandle && (
                                    <p className="text-sm text-gray-500">
                                      {account.accountHandle}
                                    </p>
                                  )}
                                  <div className="flex items-center mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      ✓ {t('connected')}
                                    </span>
                                    {account.tokenExpiresAt && new Date(account.tokenExpiresAt) < new Date() && (
                                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        ⚠ Token Expired
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-1 text-sm text-gray-500">{t('notConnected')}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-600">{t(config.description as any)}</p>

                        <div className="mt-6">
                          {connected ? (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleConnect(config.name)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              >
                                {t('reconnect')}
                              </button>
                              <button
                                onClick={() => handleDisconnect(account!.id, config.displayName)}
                                className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                              >
                                {t('disconnect')}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleConnect(config.name)}
                              className={`w-full ${config.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                            >
                              {t('connectPlatform')} {config.displayName}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Coming Soon Platforms */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('comingSoon')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(PLATFORMS)
                  .filter(([_, config]) => !config.isAvailable)
                  .map(([platform, config]) => (
                    <div
                      key={platform}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60"
                    >
                      <div className="flex items-center">
                        <div className={`${config.color} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
                          {config.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-base font-semibold text-gray-900">
                            {config.displayName}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            Tier {config.tier}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{t(config.description as any)}</p>
                      <div className="mt-4">
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          {t('comingSoon')}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>LinkedIn:</strong> Make sure you have a LinkedIn developer app with "Sign In with LinkedIn" and "Share on LinkedIn" permissions.
                </p>
                <p>
                  <strong>Twitter:</strong> Requires Twitter Developer account with OAuth 2.0 enabled and "Read and Write" permissions.
                </p>
                <p className="mt-4">
                  📚 <a href="https://www.linkedin.com/developers/" target="_blank" className="underline hover:text-blue-900">LinkedIn Developer Portal</a>
                  {' | '}
                  <a href="https://developer.twitter.com/" target="_blank" className="underline hover:text-blue-900">Twitter Developer Portal</a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
