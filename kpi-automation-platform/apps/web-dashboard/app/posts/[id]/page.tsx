'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostEditor from '@/components/posts/PostEditor';
import PlatformSelector from '@/components/posts/PlatformSelector';
import MediaUploader from '@/components/posts/MediaUploader';
import SchedulePicker from '@/components/posts/SchedulePicker';
import PostPreview from '@/components/posts/PostPreview';
import PostAnalytics from '@/components/posts/PostAnalytics';
import { Platform, MediaType, PostStatus, Post, UpdatePostRequest } from '@/types/posts';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [media, setMedia] = useState<Array<{ type: MediaType; url: string }>>([]);
  const [scheduledAt, setScheduledAt] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to load post');

      const result = await response.json();
      const postData = result.data as Post;

      setPost(postData);
      setContent(postData.content);
      setSelectedPlatforms(postData.platforms);
      setMedia(postData.media || []);
      setScheduledAt(postData.scheduledAt);
      setTags(postData.tags || []);
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      alert('Please enter content and select at least one platform');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdatePostRequest = {
        content,
        platforms: selectedPlatforms,
        media: media.length > 0 ? media : undefined,
        scheduledAt,
        tags: tags.length > 0 ? tags : undefined,
      };

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update post');

      await loadPost();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      router.push('/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/publish`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to publish post');

      await loadPost();
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <button
            onClick={() => router.push('/posts')}
            className="text-blue-600 hover:underline"
          >
            Go back to posts
          </button>
        </div>
      </div>
    );
  }

  const canEdit = post.status === PostStatus.DRAFT || post.status === PostStatus.SCHEDULED;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post Details</h1>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                post.status === PostStatus.PUBLISHED
                  ? 'bg-green-100 text-green-800'
                  : post.status === PostStatus.SCHEDULED
                  ? 'bg-blue-100 text-blue-800'
                  : post.status === PostStatus.DRAFT
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {post.status.toUpperCase()}
            </span>
            {post.scheduledAt && (
              <span className="text-gray-600">
                Scheduled for {new Date(post.scheduledAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Edit
            </button>
          )}
          {post.status === PostStatus.DRAFT && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Publish Now
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Select Platforms</h2>
                <PlatformSelector
                  selected={selectedPlatforms}
                  onChange={setSelectedPlatforms}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Post Content</h2>
                <PostEditor
                  content={content}
                  onChange={setContent}
                  platforms={selectedPlatforms}
                  tags={tags}
                  onTagsChange={setTags}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Media</h2>
                <MediaUploader media={media} onChange={setMedia} maxFiles={10} />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Schedule</h2>
                <SchedulePicker
                  scheduledAt={scheduledAt}
                  onChange={setScheduledAt}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(post.content);
                    setSelectedPlatforms(post.platforms);
                    setMedia(post.media || []);
                    setScheduledAt(post.scheduledAt);
                    setTags(post.tags || []);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Platforms</h2>
                <div className="flex flex-wrap gap-2">
                  {post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Content</h2>
                <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-blue-600 hover:underline"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {post.media && post.media.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Media</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {post.media.map((item, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {item.type === MediaType.IMAGE ? (
                          <img
                            src={item.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {post.status === PostStatus.PUBLISHED && (
                <PostAnalytics postId={postId} platforms={post.platforms} />
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <PostPreview
              content={isEditing ? content : post.content}
              platforms={isEditing ? selectedPlatforms : post.platforms}
              media={isEditing ? media : (post.media || [])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
