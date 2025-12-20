'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@kpi/ui-components'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Linkedin, Facebook, Instagram, Globe, Mail } from 'lucide-react'

interface PlatformData {
  platform: string
  posts: number
  engagement: number
  leads: number
}

interface PlatformStatsProps {
  data: PlatformData[]
  title?: string
  description?: string
}

const platformIcons: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  Email: <Mail className="h-4 w-4" />,
  Landing: <Globe className="h-4 w-4" />,
}

const platformColors: Record<string, string> = {
  LinkedIn: '#0077B5',
  Facebook: '#1877F2',
  Instagram: '#E4405F',
  Email: '#EA4335',
  Landing: '#10B981',
}

export function PlatformStats({
  data,
  title = 'Platform Performance',
  description = 'Engagement and leads by platform',
}: PlatformStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {/* Platform Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {data.map((platform) => (
            <div
              key={platform.platform}
              className="bg-gray-50 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="text-gray-600">
                  {platformIcons[platform.platform] || <Globe className="h-4 w-4" />}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {platform.platform}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-medium text-gray-900">{platform.posts}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Engagement</span>
                  <span className="font-medium text-gray-900">
                    {new Intl.NumberFormat('ko-KR').format(platform.engagement)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Leads</span>
                  <span className="font-medium text-gray-900">{platform.leads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Bar Chart */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            Engagement Comparison
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="platform"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="engagement" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={platformColors[entry.platform] || '#6b7280'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
