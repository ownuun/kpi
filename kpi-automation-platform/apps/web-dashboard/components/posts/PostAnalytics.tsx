'use client';

import { useEffect, useState } from 'react';
import { Platform, PostAnalytics as Analytics } from '@/types/posts';

interface PostAnalyticsProps {
  postId: string;
  platforms: Platform[];
}

export default function PostAnalytics({ postId, platforms }: PostAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');

  useEffect(() => {
    loadAnalytics();
  }, [postId]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/analytics`);
      if (!response.ok) throw new Error('Failed to load analytics');

      const result = await response.json();
      setAnalytics(result.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAnalytics =
    selectedPlatform === 'all'
      ? analytics
      : analytics.filter((a) => a.platform === selectedPlatform);

  const totalStats = analytics.reduce(
    (acc, curr) => ({
      views: acc.views + curr.views,
      likes: acc.likes + curr.likes,
      shares: acc.shares + curr.shares,
      comments: acc.comments + curr.comments,
      clicks: acc.clicks + curr.clicks,
      reach: acc.reach + curr.reach,
      impressions: acc.impressions + curr.impressions,
      engagement: acc.engagement + curr.engagement,
    }),
    {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      clicks: 0,
      reach: 0,
      impressions: 0,
      engagement: 0,
    }
  );

  const averageEngagementRate =
    analytics.length > 0
      ? analytics.reduce((acc, curr) => acc + curr.engagementRate, 0) / analytics.length
      : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>Analytics data not available yet</p>
          <p className="text-sm mt-1">Check back after your post has been published</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Analytics</h2>

        {/* Platform Filter */}
        {platforms.length > 1 && (
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Views"
          value={totalStats.views}
          icon="👁️"
          color="text-blue-600"
        />
        <StatCard
          label="Total Likes"
          value={totalStats.likes}
          icon="❤️"
          color="text-red-600"
        />
        <StatCard
          label="Total Shares"
          value={totalStats.shares}
          icon="↗️"
          color="text-green-600"
        />
        <StatCard
          label="Total Comments"
          value={totalStats.comments}
          icon="💬"
          color="text-purple-600"
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Clicks"
          value={totalStats.clicks}
          icon="🖱️"
          color="text-indigo-600"
        />
        <StatCard
          label="Reach"
          value={totalStats.reach}
          icon="📊"
          color="text-cyan-600"
        />
        <StatCard
          label="Impressions"
          value={totalStats.impressions}
          icon="👀"
          color="text-orange-600"
        />
        <StatCard
          label="Engagement Rate"
          value={`${averageEngagementRate.toFixed(2)}%`}
          icon="📈"
          color="text-green-600"
        />
      </div>

      {/* Platform Breakdown */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Platform Breakdown
        </h3>

        <div className="space-y-4">
          {filteredAnalytics.map((stat) => (
            <div
              key={`${stat.platform}-${stat.collectedAt}`}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{stat.platform}</h4>
                <span className="text-xs text-gray-500">
                  Updated: {new Date(stat.collectedAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Views</div>
                  <div className="font-semibold">{stat.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Likes</div>
                  <div className="font-semibold">{stat.likes.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Shares</div>
                  <div className="font-semibold">{stat.shares.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Comments</div>
                  <div className="font-semibold">{stat.comments.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-semibold text-green-600">
                    {stat.engagementRate.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
