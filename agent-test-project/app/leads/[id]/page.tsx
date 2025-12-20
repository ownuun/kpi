'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import BackButton from '@/components/BackButton';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  jobTitle?: string;
  city?: string;
  company?: string;
  linkedinUrl?: string;
  source?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const { t } = useI18n();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lead');
        }
        const data = await response.json();
        setLead(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-green-100 text-green-800';
      case 'CONTACTED':
        return 'bg-blue-100 text-blue-800';
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800';
      case 'CONVERTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOST':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton className="mb-4" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">{t('error')}</p>
          <p className="text-sm">{error || 'Lead not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <BackButton className="mb-4" />
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            {lead.jobTitle && (
              <p className="text-lg text-gray-600 mt-1">{lead.jobTitle}</p>
            )}
            {lead.company && (
              <p className="text-gray-500 mt-1">at {lead.company}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href={`/leads/${id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </Link>
            <span
              className={`px-4 py-2 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
            >
              {lead.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Email</div>
                <div className="flex-1">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Phone</div>
                  <div className="flex-1 text-gray-900">
                    {lead.countryCode} {lead.phone}
                  </div>
                </div>
              )}

              {lead.city && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Location</div>
                  <div className="flex-1 text-gray-900">{lead.city}</div>
                </div>
              )}

              {lead.linkedinUrl && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">LinkedIn</div>
                  <div className="flex-1">
                    <a
                      href={lead.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              )}

              {lead.source && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">Source</div>
                  <div className="flex-1 text-gray-900">{lead.source}</div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Lead Created</p>
                  <p className="text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {lead.updatedAt !== lead.createdAt && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">↻</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-500">
                      {new Date(lead.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors">
                Send Email
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Add to Campaign
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors">
                Create Task
              </button>
              <Link
                href={`/leads/${id}/edit`}
                className="block w-full px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors text-center"
              >
                Edit Lead
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-gray-900">{lead.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono text-xs text-gray-600">{lead.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
