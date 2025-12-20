'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import EmailPerformanceChart from '@/components/dashboard/EmailPerformanceChart';
import SocialPerformanceChart from '@/components/dashboard/SocialPerformanceChart';
import LeadFunnelChart from '@/components/dashboard/LeadFunnelChart';
import StatsCard from '@/components/dashboard/StatsCard';

interface HomePageProps {
  stats: any;
}

export default function ClientHomePage({ stats }: HomePageProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-end gap-3 mb-4">
            <Link
              href="/settings/email-config"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Settings
            </Link>
            <Link
              href="/settings/oauth-config"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              OAuth Settings
            </Link>
            <Link
              href="/settings/accounts"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Social Accounts
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('appTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* SNS Posts Card */}
          <Link
            href="/social/posts"
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-200 hover:border-blue-500"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-200 transition-colors">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {t('snsPostsTitle')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('snsPostsDescription')}
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>{t('goToPosts')}</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Email Campaigns Card */}
          <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-200 hover:border-green-500">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 group-hover:bg-green-200 transition-colors">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {t('emailCampaignsTitle')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('emailCampaignsDescription')}
            </p>
            <div className="space-y-2">
              <Link
                href="/email/send"
                className="flex items-center text-green-600 font-semibold hover:text-green-700"
              >
                <span>⚡ 빠른 발송</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/email/campaigns"
                className="flex items-center text-green-600 font-medium hover:text-green-700"
              >
                <span>{t('goToCampaigns')}</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Leads Card */}
          <Link
            href="/leads"
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-200 hover:border-purple-500"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-6 group-hover:bg-purple-200 transition-colors">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {t('leadsTitle')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('leadsDescription')}
            </p>
            <div className="flex items-center text-purple-600 font-medium">
              <span>{t('goToLeads')}</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Dashboard Stats */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title={t('totalLeads')}
                value={stats.leads?.total || 0}
                subtitle={`${stats.leads?.byStatus?.length || 0} ${t('statuses')}`}
                icon="👥"
              />
              <StatsCard
                title={t('emailCampaignsCount')}
                value={stats.email?.total || 0}
                subtitle={`${stats.email?.openRate || 0}% ${t('openRate')}`}
                icon="📧"
              />
              <StatsCard
                title={t('socialPosts')}
                value={stats.social?.total || 0}
                subtitle={`${stats.social?.views || 0} ${t('totalViews')}`}
                icon="📱"
              />
              <StatsCard
                title={t('activeCampaigns')}
                value={stats.campaigns?.active || 0}
                subtitle={`${stats.campaigns?.total || 0} ${t('total')}`}
                icon="🎯"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {stats.leads?.byStatus && stats.leads.byStatus.length > 0 && (
                <LeadFunnelChart data={stats.leads.byStatus} />
              )}
              {stats.email?.campaigns && stats.email.campaigns.length > 0 && (
                <EmailPerformanceChart data={stats.email.campaigns} />
              )}
            </div>

            {stats.social?.byPlatform && stats.social.byPlatform.length > 0 && (
              <div className="mb-8">
                <SocialPerformanceChart data={stats.social.byPlatform} />
              </div>
            )}

            {/* Recent Leads */}
            {stats.leads?.recent && stats.leads.recent.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">{t('recentLeadsTitle')}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('created')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.leads.recent.map((lead: any) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : ''}
                              ${lead.status === 'CONTACTED' ? 'bg-green-100 text-green-800' : ''}
                              ${lead.status === 'QUALIFIED' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${lead.status === 'CONVERTED' ? 'bg-purple-100 text-purple-800' : ''}
                              ${lead.status === 'LOST' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {t(lead.status.toLowerCase() as any)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {!stats && (
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {t('loading')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">--</div>
                <div className="text-gray-600">{t('socialPosts')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">--</div>
                <div className="text-gray-600">{t('emailCampaignsCount')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">--</div>
                <div className="text-gray-600">{t('totalLeads')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>{t('backendReady')}</p>
        </div>
      </div>
    </div>
  );
}
