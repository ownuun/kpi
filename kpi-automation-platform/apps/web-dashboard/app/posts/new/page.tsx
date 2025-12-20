'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/posts/PostEditor';
import PlatformSelector from '@/components/posts/PlatformSelector';
import MediaUploader from '@/components/posts/MediaUploader';
import SchedulePicker from '@/components/posts/SchedulePicker';
import PostPreview from '@/components/posts/PostPreview';
import { Platform, MediaType, CreatePostRequest } from '@/types/posts';

export default function NewPostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [media, setMedia] = useState<Array<{ type: MediaType; url: string }>>([]);
  const [scheduledAt, setScheduledAt] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handleSubmit = async (saveAsDraft = false) => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      alert('Please enter content and select at least one platform');
      return;
    }

    setIsSubmitting(true);
    setIsDraft(saveAsDraft);

    try {
      const postData: CreatePostRequest = {
        content,
        platforms: selectedPlatforms,
        media: media.length > 0 ? media : undefined,
        scheduledAt: saveAsDraft ? undefined : scheduledAt,
        tags: tags.length > 0 ? tags : undefined,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          isDraft: saveAsDraft,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      router.push(`/posts/${result.data.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="mt-2 text-gray-600">
          Create and schedule posts for multiple social media platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Select Platforms</h2>
            <PlatformSelector
              selected={selectedPlatforms}
              onChange={setSelectedPlatforms}
            />
          </div>

          {/* Content Editor */}
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

          {/* Media Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <MediaUploader
              media={media}
              onChange={setMedia}
              maxFiles={10}
            />
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule</h2>
            <SchedulePicker
              scheduledAt={scheduledAt}
              onChange={setScheduledAt}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              {isDraft && isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {!isDraft && isSubmitting
                ? 'Publishing...'
                : scheduledAt
                ? 'Schedule Post'
                : 'Publish Now'}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <PostPreview
              content={content}
              platforms={selectedPlatforms}
              media={media}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
