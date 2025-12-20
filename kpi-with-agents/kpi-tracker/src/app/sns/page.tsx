'use client';

import { useState, useEffect } from 'react';
import { createPostizClient, type Post, type SocialPlatform, type PostStats } from '@kpi/integrations-postiz';

interface PlatformMetrics {
  platform: SocialPlatform;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
}

export default function SNSDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [publishNow, setPublishNow] = useState(true);

  const platforms: SocialPlatform[] = [
    'linkedin',
    'facebook',
    'instagram',
    'twitter',
    'youtube',
    'tiktok',
    'threads',
    'reddit',
  ];

  // Initialize Postiz client
  const client = createPostizClient({
    apiUrl: process.env.NEXT_PUBLIC_POSTIZ_API_URL || 'http://localhost:3000/api',
    apiKey: process.env.NEXT_PUBLIC_POSTIZ_API_KEY || '',
  });

  // Fetch recent posts and metrics
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch recent posts
        const postsResponse = await client.getPosts({
          limit: 10,
          offset: 0,
        });
        setRecentPosts(postsResponse.posts);

        // Calculate platform metrics
        const metrics = calculatePlatformMetrics(postsResponse.posts);
        setPlatformMetrics(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const calculatePlatformMetrics = (posts: Post[]): PlatformMetrics[] => {
    const metricsMap = new Map<SocialPlatform, PlatformMetrics>();

    posts.forEach((post) => {
      post.platforms.forEach((platform) => {
        const existing = metricsMap.get(platform);
        const stats = post.stats?.[platform] || {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
        };

        if (existing) {
          existing.totalPosts += 1;
          existing.totalViews += stats.views;
          existing.totalLikes += stats.likes;
          existing.totalShares += stats.shares;
        } else {
          metricsMap.set(platform, {
            platform,
            totalPosts: 1,
            totalViews: stats.views,
            totalLikes: stats.likes,
            totalShares: stats.shares,
          });
        }
      });
    });

    return Array.from(metricsMap.values()).sort(
      (a, b) => b.totalPosts - a.totalPosts
    );
  };

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (!content.trim()) {
      alert('Please enter post content');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const hashtagsArray = hashtags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await client.createPost({
        platforms: selectedPlatforms,
        content: {
          text: content,
          mediaUrls: mediaUrls.filter(Boolean),
          hashtags: hashtagsArray,
        },
        schedule: publishNow
          ? { publishNow: true }
          : {
              publishNow: false,
              scheduledAt: scheduledDate ? new Date(scheduledDate) : undefined,
            },
      });

      // Reset form
      setContent('');
      setMediaUrls([]);
      setHashtags('');
      setScheduledDate('');
      setSelectedPlatforms([]);
      setPublishNow(true);

      // Refresh posts
      const postsResponse = await client.getPosts({ limit: 10 });
      setRecentPosts(postsResponse.posts);

      alert('Post created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status: Post['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SNS Manager Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and schedule posts across multiple social media platforms
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Creation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Create New Post
              </h2>

              <form onSubmit={handleCreatePost} className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Platforms
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedPlatforms.includes(platform)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Post Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="What's on your mind?"
                  />
                </div>

                {/* Media URLs */}
                <div>
                  <label
                    htmlFor="media"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Media URLs (comma-separated)
                  </label>
                  <input
                    id="media"
                    type="text"
                    value={mediaUrls.join(', ')}
                    onChange={(e) =>
                      setMediaUrls(
                        e.target.value.split(',').map((url) => url.trim())
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label
                    htmlFor="hashtags"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Hashtags (comma-separated)
                  </label>
                  <input
                    id="hashtags"
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="marketing, socialmedia, business"
                  />
                </div>

                {/* Schedule Options */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={publishNow}
                        onChange={() => setPublishNow(true)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Publish Now
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!publishNow}
                        onChange={() => setPublishNow(false)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Schedule for Later
                      </span>
                    </label>
                  </div>

                  {!publishNow && (
                    <div>
                      <label
                        htmlFor="scheduledDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Schedule Date & Time
                      </label>
                      <input
                        id="scheduledDate"
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Post'}
                </button>
              </form>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Platform Performance
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading metrics...</p>
                </div>
              ) : platformMetrics.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No data available yet
                </p>
              ) : (
                <div className="space-y-4">
                  {platformMetrics.map((metric) => (
                    <div
                      key={metric.platform}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {metric.platform}
                        </span>
                        <span className="text-sm text-gray-500">
                          {metric.totalPosts} posts
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Views</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {metric.totalViews.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Likes</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {metric.totalLikes.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Shares</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {metric.totalShares.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Posts
              </h2>
              <a
                href="/sns/posts"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </a>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : recentPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No posts yet</p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white line-clamp-2">
                          {post.content.text}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                      <span>
                        {post.status === 'scheduled'
                          ? `Scheduled: ${formatDate(post.scheduledAt)}`
                          : post.status === 'published'
                          ? `Published: ${formatDate(post.publishedAt)}`
                          : 'Draft'}
                      </span>
                      {post.status === 'published' && post.stats && (
                        <div className="flex gap-4">
                          {Object.values(post.stats).some(
                            (s) => s && s.views > 0
                          ) && (
                            <span>
                              Views:{' '}
                              {Object.values(post.stats)
                                .reduce((sum, s) => sum + (s?.views || 0), 0)
                                .toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
