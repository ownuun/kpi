'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailCampaignSchema, type EmailCampaignFormData } from '@/lib/validations/email-campaign';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function EmailCampaignForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailCampaignFormData>({
    resolver: zodResolver(emailCampaignSchema),
    defaultValues: {
      fromEmail: 'noreply@example.com',
      fromName: 'Marketing Team',
    },
  });

  const onSubmit = async (data: EmailCampaignFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Clean up empty optional fields
      const payload = {
        ...data,
        replyToEmail: data.replyToEmail || undefined,
        scheduledAt: data.scheduledAt || undefined,
        previewText: data.previewText || undefined,
      };

      const response = await fetch('/api/email/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create campaign');
      }

      const campaign = await response.json();
      
      // Redirect to campaigns page
      router.push('/email/campaigns');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* Campaign Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Campaign Details</h3>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Email Subject <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            {...register('subject')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Summer Sale - 50% Off!"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        {/* Preview Text */}
        <div>
          <label htmlFor="previewText" className="block text-sm font-medium mb-1">
            Preview Text
            <span className="ml-2 text-xs text-gray-500">(Shown in email inbox)</span>
          </label>
          <input
            id="previewText"
            type="text"
            {...register('previewText')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Don't miss out on our biggest sale of the year..."
          />
          {errors.previewText && (
            <p className="mt-1 text-sm text-red-600">{errors.previewText.message}</p>
          )}
        </div>

        {/* Email Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Email Content <span className="text-red-500">*</span>
            <span className="ml-2 text-xs text-gray-500">(HTML supported)</span>
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            placeholder="<h1>Welcome!</h1><p>This is your email content...</p>"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>
      </div>

      {/* Sender Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sender Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Name */}
          <div>
            <label htmlFor="fromName" className="block text-sm font-medium mb-1">
              From Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fromName"
              type="text"
              {...register('fromName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Marketing Team"
            />
            {errors.fromName && (
              <p className="mt-1 text-sm text-red-600">{errors.fromName.message}</p>
            )}
          </div>

          {/* From Email */}
          <div>
            <label htmlFor="fromEmail" className="block text-sm font-medium mb-1">
              From Email <span className="text-red-500">*</span>
            </label>
            <input
              id="fromEmail"
              type="email"
              {...register('fromEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="noreply@example.com"
            />
            {errors.fromEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.fromEmail.message}</p>
            )}
          </div>
        </div>

        {/* Reply To Email */}
        <div>
          <label htmlFor="replyToEmail" className="block text-sm font-medium mb-1">
            Reply-To Email
            <span className="ml-2 text-xs text-gray-500">(Optional)</span>
          </label>
          <input
            id="replyToEmail"
            type="email"
            {...register('replyToEmail')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="support@example.com"
          />
          {errors.replyToEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.replyToEmail.message}</p>
          )}
        </div>
      </div>

      {/* Scheduling Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Scheduling</h3>

        <div>
          <label htmlFor="scheduledAt" className="block text-sm font-medium mb-1">
            Schedule Send Time
            <span className="ml-2 text-xs text-gray-500">(Optional - leave empty to save as draft)</span>
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            {...register('scheduledAt')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="YYYY-MM-DD HH:mm"
          />
          <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD HH:mm (e.g., 2025-01-15 09:00)</p>
          {errors.scheduledAt && (
            <p className="mt-1 text-sm text-red-600">{errors.scheduledAt.message}</p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Campaign Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use a clear, compelling subject line to improve open rates</li>
              <li>Keep your content concise and mobile-friendly</li>
              <li>Include a clear call-to-action (CTA)</li>
              <li>Test with a small group before sending to all recipients</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </div>
    </form>
  );
}
