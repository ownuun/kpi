'use client';

import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { useI18n } from '@/lib/i18n/context';

export default function NewLeadPage() {
  const { t } = useI18n();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('addNewLeadTitle')}</h1>
            <p className="text-gray-600 mt-1">{t('addNewLeadSubtitle')}</p>
          </div>
          <Link
            href="/leads"
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('backToLeads')}
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <LeadForm />
      </div>
    </div>
  );
}
