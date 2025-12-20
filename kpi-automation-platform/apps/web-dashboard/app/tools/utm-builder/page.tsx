import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { UtmBuilder } from '@/components/utm/UtmBuilder'

async function getPlatforms() {
  try {
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
    return platforms
  } catch (error) {
    console.error('Failed to fetch platforms:', error)
    return []
  }
}

export const metadata = {
  title: 'UTM Link Generator',
  description: 'Generate UTM parameters for marketing campaign tracking',
}

export default async function UtmBuilderPage() {
  const platforms = await getPlatforms()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              UTM Link Generator
            </h1>
            <p className="text-lg text-gray-600">
              Create trackable links with UTM parameters for your marketing campaigns
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm text-gray-600">
              <strong>utm_source</strong> - Traffic source (linkedin, facebook, etc.)
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-3xl mb-2">📺</div>
            <p className="text-sm text-gray-600">
              <strong>utm_medium</strong> - Marketing medium (social, email, cpc)
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-3xl mb-2">📢</div>
            <p className="text-sm text-gray-600">
              <strong>utm_campaign</strong> - Campaign name for grouping metrics
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-3xl mb-2">🏷️</div>
            <p className="text-sm text-gray-600">
              <strong>Optional</strong> - utm_term, utm_content for finer tracking
            </p>
          </div>
        </div>

        {/* Builder */}
        <UtmBuilder platforms={platforms} />

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            How to Use UTM Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Best Practices
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Use consistent naming conventions across all campaigns</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Use lowercase and underscores instead of spaces</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Always include source, medium, and campaign (required)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Use term and content only when necessary</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span>Keep URL length under 2000 characters</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Example Usage
              </h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Base URL
                  </p>
                  <code className="text-sm text-gray-900 font-mono break-all">
                    https://example.com/
                  </code>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    With UTM Parameters
                  </p>
                  <code className="text-sm text-blue-600 font-mono break-all">
                    ?utm_source=linkedin&utm_medium=social&utm_campaign=summer_sale
                  </code>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Track in Google Analytics
                  </p>
                  <p className="text-sm text-gray-700">
                    Reports → Traffic Sources → Campaigns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Resources
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>
              Read our{' '}
              <a
                href="https://support.google.com/analytics/answer/1033173"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                Google Analytics UTM Guide
              </a>
            </li>
            <li>
              Use this tool to verify your UTM parameters are correctly formatted
            </li>
            <li>
              History is saved automatically in your browser (localStorage)
            </li>
            <li>
              Generate QR codes to share your links on printed materials
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
