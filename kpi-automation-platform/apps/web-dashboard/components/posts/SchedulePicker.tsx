'use client';

import { useState, useEffect } from 'react';

interface SchedulePickerProps {
  scheduledAt?: string;
  onChange: (scheduledAt: string | undefined) => void;
}

export default function SchedulePicker({ scheduledAt, onChange }: SchedulePickerProps) {
  const [isScheduled, setIsScheduled] = useState(!!scheduledAt);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    if (scheduledAt) {
      const dt = new Date(scheduledAt);
      setDate(dt.toISOString().split('T')[0]);
      setTime(dt.toTimeString().slice(0, 5));
      setIsScheduled(true);
    }
  }, [scheduledAt]);

  useEffect(() => {
    if (isScheduled && date && time) {
      const dateTime = new Date(`${date}T${time}`);
      onChange(dateTime.toISOString());
    } else {
      onChange(undefined);
    }
  }, [isScheduled, date, time]);

  const toggleSchedule = () => {
    setIsScheduled(!isScheduled);
    if (isScheduled) {
      onChange(undefined);
    }
  };

  const setQuickSchedule = (hours: number) => {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
    setIsScheduled(true);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
    };
  };

  const minDateTime = getMinDateTime();

  const getBestTimes = () => {
    const now = new Date();
    const times = [];

    // Tomorrow 9 AM
    const tomorrow9am = new Date(now);
    tomorrow9am.setDate(tomorrow9am.getDate() + 1);
    tomorrow9am.setHours(9, 0, 0, 0);
    times.push({
      label: 'Tomorrow 9 AM',
      date: tomorrow9am.toISOString().split('T')[0],
      time: '09:00',
    });

    // Tomorrow 2 PM
    const tomorrow2pm = new Date(now);
    tomorrow2pm.setDate(tomorrow2pm.getDate() + 1);
    tomorrow2pm.setHours(14, 0, 0, 0);
    times.push({
      label: 'Tomorrow 2 PM',
      date: tomorrow2pm.toISOString().split('T')[0],
      time: '14:00',
    });

    // Next Monday 9 AM
    const nextMonday = new Date(now);
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    nextMonday.setHours(9, 0, 0, 0);
    times.push({
      label: 'Next Monday 9 AM',
      date: nextMonday.toISOString().split('T')[0],
      time: '09:00',
    });

    return times;
  };

  return (
    <div className="space-y-4">
      {/* Schedule Toggle */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={toggleSchedule}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-sm font-medium text-gray-700">
            Schedule for later
          </span>
        </label>

        {!isScheduled && (
          <span className="text-sm text-gray-600">Post will be published immediately</span>
        )}
      </div>

      {/* Schedule Options */}
      {isScheduled && (
        <div className="space-y-4 pl-8">
          {/* Quick Schedule Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuickSchedule(1)}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              In 1 hour
            </button>
            <button
              type="button"
              onClick={() => setQuickSchedule(3)}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              In 3 hours
            </button>
            <button
              type="button"
              onClick={() => setQuickSchedule(24)}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              Tomorrow
            </button>
          </div>

          {/* Best Times Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggested best times
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {getBestTimes().map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setDate(preset.date);
                    setTime(preset.time);
                  }}
                  className="px-3 py-2 text-sm bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="font-semibold">{preset.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(`${preset.date}T${preset.time}`).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDateTime.date}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Seoul">Seoul (KST)</option>
              <option value="Asia/Shanghai">Shanghai (CST)</option>
              <option value="Australia/Sydney">Sydney (AEDT)</option>
              <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                Your Local Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
              </option>
            </select>
          </div>

          {/* Schedule Summary */}
          {date && time && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">
                    Scheduled for
                  </h4>
                  <p className="text-sm text-blue-700">
                    {new Date(`${date}T${time}`).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: timezone,
                    })}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {timezone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Warning */}
          {date && time && new Date(`${date}T${time}`) <= new Date() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">
                  Scheduled time must be at least 5 minutes in the future
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
