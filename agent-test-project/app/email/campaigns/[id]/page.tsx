'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import toast from 'react-hot-toast';

interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  previewText?: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export default function CampaignDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useI18n();
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sending, setSending] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/email/campaigns/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      const data = await response.json();
      setCampaign(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setSending(true);
      setError(null);

      const response = await fetch(`/api/email/campaigns/${id}/send`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send campaign');
      }

      toast.success(data.message || 'Campaign sent successfully!');
      await fetchCampaign();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/email/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      toast.success('Campaign deleted successfully');
      router.push('/email/campaigns');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
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
      case 'SENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOpenRate = () => {
    if (!campaign || campaign.recipientCount === 0) return 0;
    return ((campaign.openedCount / campaign.recipientCount) * 100).toFixed(1);
  };

  const calculateClickRate = () => {
    if (!campaign || campaign.recipientCount === 0) return 0;
    return ((campaign.clickedCount / campaign.recipientCount) * 100).toFixed(1);
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">{t('error')}</p>
          <p className="text-sm">{error || 'Campaign not found'}</p>
          <Link href="/email/campaigns" className="text-sm underline mt-2 inline-block">
            {t('backToCampaigns')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/email/campaigns"
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('backToCampaigns')}
          </Link>
          <div className="flex gap-3">
            {campaign.status === 'DRAFT' && (
              <button
                onClick={handleSendCampaign}
                disabled={sending || campaign.recipientCount === 0}
                className={`px-4 py-2 text-white font-medium rounded-md transition-colors ${
                  sending
                    ? 'bg-yellow-500 cursor-wait'
                    : campaign.recipientCount === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                title={campaign.recipientCount === 0 ? 'No recipients added' : 'Send campaign now'}
              >
                {sending ? 'Sending...' : 'Send Now'}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
            >
              {deleting ? 'Deleting...' : 'Delete Campaign'}
            </button>
          </div>
        </div>

        {/* Campaign Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {campaign.subject}
              </h1>
              {campaign.previewText && (
                <p className="text-gray-600">{campaign.previewText}</p>
              )}
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">From:</span> {campaign.fromName} ({campaign.fromEmail})
            </div>
            {campaign.replyToEmail && (
              <div>
                <span className="font-medium">Reply-To:</span> {campaign.replyToEmail}
              </div>
            )}
            <div>
              <span className="font-medium">ID:</span> {campaign.id}
            </div>
            <div>
              <span className="font-medium">Recipients:</span> {campaign.recipientCount}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">{t('error')}</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Email Content</h2>
            <button
              onClick={() => setShowHtmlPreview(!showHtmlPreview)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {showHtmlPreview ? 'Show Plain Text' : 'Show HTML'}
            </button>
          </div>

          {showHtmlPreview ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={campaign.content}
                className="w-full h-96"
                sandbox="allow-same-origin"
                title="Email HTML Preview"
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto max-h-96">
              <p className="text-gray-700 whitespace-pre-wrap">
                {stripHtmlTags(campaign.content)}
              </p>
            </div>
          )}
        </div>

        {/* Campaign Stats */}
        {(campaign.status === 'SENT' || campaign.status === 'SENDING') && campaign.recipientCount > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{campaign.recipientCount}</div>
                <div className="text-sm text-gray-600">Recipients</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{campaign.openedCount}</div>
                <div className="text-sm text-gray-600">Opened ({calculateOpenRate()}%)</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{campaign.clickedCount}</div>
                <div className="text-sm text-gray-600">Clicked ({calculateClickRate()}%)</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{campaign.bouncedCount}</div>
                <div className="text-sm text-gray-600">Bounced</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {campaign.recipientCount - campaign.openedCount - campaign.bouncedCount}
                </div>
                <div className="text-sm text-gray-600">Not Opened</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Metadata */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Created:</span>
            <span className="text-gray-900 font-medium">{new Date(campaign.createdAt).toLocaleString()}</span>
          </div>
          {campaign.updatedAt && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900 font-medium">{new Date(campaign.updatedAt).toLocaleString()}</span>
            </div>
          )}
          {campaign.scheduledAt && campaign.status === 'SCHEDULED' && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Scheduled For:</span>
              <span className="text-gray-900 font-medium">{new Date(campaign.scheduledAt).toLocaleString()}</span>
            </div>
          )}
          {campaign.sentAt && (campaign.status === 'SENT' || campaign.status === 'SENDING') && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Sent At:</span>
              <span className="text-gray-900 font-medium">{new Date(campaign.sentAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
