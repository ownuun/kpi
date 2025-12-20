'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';

type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'ALL';

interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  previewText?: string;
  fromEmail: string;
  fromName: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  status: string;
  createdAt: string;
}

export default function EmailCampaignsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus>('ALL');
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/email/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    return selectedStatus === 'ALL' || campaign.status === selectedStatus;
  });

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

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.recipientCount === 0) return 0;
    return ((campaign.openedCount / campaign.recipientCount) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: EmailCampaign) => {
    if (campaign.recipientCount === 0) return 0;
    return ((campaign.clickedCount / campaign.recipientCount) * 100).toFixed(1);
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setSendingId(campaignId);
      setError(null);

      const response = await fetch('/api/email/campaigns/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send campaign');
      }

      // Refresh campaigns list
      await fetchCampaigns();

      alert(data.message || 'Campaign sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSendingId(null);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('emailCampaignsPageTitle')}</h1>
            <p className="text-gray-600 mt-1">{t('emailCampaignsPageSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              {t('backToHome')}
            </Link>
            <Link
              href="/email/campaigns/new"
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              {t('newCampaign')}
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED'] as CampaignStatus[]).map((status) => {
              const statusKey = `campaignFilter${status.charAt(0) + status.slice(1).toLowerCase()}` as any;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    selectedStatus === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(statusKey)}
                  {status !== 'ALL' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({campaigns.filter(c => c.status === status).length})
                    </span>
                  )}
                  {status === 'ALL' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({campaigns.length})
                    </span>
                  )}
                </button>
              );
            })
            }
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={fetchCampaigns}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              {t('refresh')}
            </button>
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

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-4 text-lg">{t('noCampaignsFound')}</p>
          <p className="text-gray-400 text-sm mb-6">
            {selectedStatus !== 'ALL'
              ? t('noCampaignsMessage')
              : t('noCampaignsMessage')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => router.push(`/email/campaigns/${campaign.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {campaign.subject}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  {campaign.previewText && (
                    <p className="text-gray-600 text-sm mb-2">{campaign.previewText}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>From: {campaign.fromName} ({campaign.fromEmail})</span>
                    {campaign.scheduledAt && campaign.status === 'SCHEDULED' && (
                      <span>Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}</span>
                    )}
                    {campaign.sentAt && (
                      <span>Sent: {new Date(campaign.sentAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {campaign.status === 'DRAFT' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendCampaign(campaign.id);
                    }}
                    disabled={sendingId === campaign.id || campaign.recipientCount === 0}
                    className={`px-4 py-2 text-white text-sm font-medium rounded-md transition-colors ${
                      sendingId === campaign.id
                        ? 'bg-yellow-500 cursor-wait'
                        : campaign.recipientCount === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={campaign.recipientCount === 0 ? 'No recipients added' : 'Send campaign now'}
                  >
                    {sendingId === campaign.id ? 'Sending...' : 'Send Now'}
                  </button>
                )}
              </div>

              {/* Campaign Stats (for sent campaigns) */}
              {(campaign.status === 'SENT' || campaign.status === 'SENDING') && campaign.recipientCount > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{campaign.recipientCount}</div>
                    <div className="text-xs text-gray-600">Recipients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{campaign.openedCount}</div>
                    <div className="text-xs text-gray-600">Opened ({calculateOpenRate(campaign)}%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{campaign.clickedCount}</div>
                    <div className="text-xs text-gray-600">Clicked ({calculateClickRate(campaign)}%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{campaign.bouncedCount}</div>
                    <div className="text-xs text-gray-600">Bounced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {campaign.recipientCount - campaign.openedCount - campaign.bouncedCount}
                    </div>
                    <div className="text-xs text-gray-600">Not Opened</div>
                  </div>
                </div>
              )}

              {/* Preview Content */}
              {campaign.status === 'DRAFT' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {campaign.content.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredCampaigns.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredCampaigns.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'SENT').length}
              </div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {campaigns.filter(c => c.status === 'SCHEDULED').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {campaigns.filter(c => c.status === 'DRAFT').length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {campaigns.reduce((sum, c) => sum + c.recipientCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Recipients</div>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Email Campaign Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>Test your campaigns with small groups before sending to everyone</li>
              <li>Personalize subject lines to increase open rates</li>
              <li>Include clear call-to-action buttons</li>
              <li>Monitor bounce rates and clean your email list regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
