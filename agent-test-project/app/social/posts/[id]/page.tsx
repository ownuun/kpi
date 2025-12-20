'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';

interface SocialPost {
  id: string;
  content: string;
  title?: string;
  platform: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  imageUrl?: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  updatedAt?: string;
}

export default function PostDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useI18n();
  const [post, setPost] = useState<SocialPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/social/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/social/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      alert('Post deleted successfully');
      router.push('/social/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'ERROR':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'LINKEDIN':
        return 'bg-blue-600';
      case 'TWITTER':
        return 'bg-sky-500';
      case 'FACEBOOK':
        return 'bg-blue-700';
      case 'INSTAGRAM':
        return 'bg-pink-600';
      case 'YOUTUBE':
        return 'bg-red-600';
      case 'TIKTOK':
        return 'bg-black';
      case 'THREADS':
        return 'bg-gray-800';
      case 'BLUESKY':
        return 'bg-indigo-600';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">{t('error')}</p>
          <p className="text-sm">{error || 'Post not found'}</p>
          <Link href="/social/posts" className="text-sm underline mt-2 inline-block">
            {t('backToPosts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/social/posts"
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('backToPosts')}
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
          >
            {deleting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>

        {/* Post Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm font-semibold text-white rounded ${getPlatformColor(post.platform)}`}>
                {post.platform}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              ID: {post.id}
            </div>
          </div>

          {post.title && (
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
          )}
        </div>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
          <img
            src={post.imageUrl}
            alt={post.title || 'Post image'}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Metrics */}
      {post.status === 'PUBLISHED' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{post.views.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{post.likes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{post.shares.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Shares</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{post.comments.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
          </div>
        </div>
      )}

      {/* Post Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Created:</span>
            <span className="text-gray-900 font-medium">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          {post.updatedAt && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900 font-medium">{new Date(post.updatedAt).toLocaleString()}</span>
            </div>
          )}
          {post.scheduledAt && post.status === 'SCHEDULED' && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Scheduled For:</span>
              <span className="text-gray-900 font-medium">{new Date(post.scheduledAt).toLocaleString()}</span>
            </div>
          )}
          {post.publishedAt && post.status === 'PUBLISHED' && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Published:</span>
              <span className="text-gray-900 font-medium">{new Date(post.publishedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
