'use client';

import type { LeadActivity } from '@/types/lead';
import { formatRelativeTime, formatDate } from '@/lib/lead-utils';

interface ActivityTimelineProps {
  activities: LeadActivity[];
}

const ACTIVITY_ICONS = {
  CALL: '📞',
  EMAIL: '📧',
  MEETING: '🤝',
  NOTE: '📝',
  STATUS_CHANGE: '🔄',
};

const ACTIVITY_COLORS = {
  CALL: 'bg-blue-100 text-blue-800',
  EMAIL: 'bg-purple-100 text-purple-800',
  MEETING: 'bg-green-100 text-green-800',
  NOTE: 'bg-yellow-100 text-yellow-800',
  STATUS_CHANGE: 'bg-gray-100 text-gray-800',
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No activities yet</p>
        <p className="text-sm">Activities will appear here as they occur</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Timeline line */}
          {index !== activities.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
          )}

          <div className="flex gap-4">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                ACTIVITY_COLORS[activity.type]
              }`}
            >
              {ACTIVITY_ICONS[activity.type]}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatRelativeTime(new Date(activity.createdAt))} •{' '}
                    {formatDate(new Date(activity.createdAt))}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    ACTIVITY_COLORS[activity.type]
                  }`}
                >
                  {activity.type}
                </span>
              </div>

              {activity.description && (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {activity.description}
                </p>
              )}

              {activity.createdBy && (
                <p className="text-xs text-gray-500 mt-2">
                  by {activity.createdBy}
                </p>
              )}

              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-gray-500 font-medium">
                          {key}:
                        </span>{' '}
                        <span className="text-gray-700">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
