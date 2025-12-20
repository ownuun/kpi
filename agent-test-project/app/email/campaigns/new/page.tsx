'use client';

import Link from 'next/link';
import { EmailCampaignForm } from '@/components/forms/EmailCampaignForm';
import { useI18n } from '@/lib/i18n/context';

export default function NewEmailCampaignPage() {
  const { t } = useI18n();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('newCampaignTitle')}</h1>
            <p className="text-gray-600 mt-1">{t('newCampaignSubtitle')}</p>
          </div>
          <Link
            href="/email/campaigns"
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('backToCampaigns')}
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <EmailCampaignForm />
      </div>
    </div>
  );
}
