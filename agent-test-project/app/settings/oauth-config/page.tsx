'use client';

import { useEffect, useState } from 'react';
import { SocialPlatform } from '@prisma/client';
import { getPlatformGuide, type PlatformGuide } from '@/lib/social/platform-guides';
import BackButton from '@/components/BackButton';

interface OAuthConfigData {
  id: string;
  platform: SocialPlatform;
  clientId: string;
  clientSecret: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlatformInfo {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description: string;
  docsUrl: string;
}

const PLATFORMS: Record<SocialPlatform, PlatformInfo> = {
  LINKEDIN: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-600',
    description: 'Professional networking platform',
    docsUrl: 'https://www.linkedin.com/developers/',
  },
  TWITTER: {
    name: 'twitter',
    displayName: 'Twitter / X',
    icon: '🐦',
    color: 'bg-black',
    description: 'Microblogging platform',
    docsUrl: 'https://developer.twitter.com/',
  },
  FACEBOOK: {
    name: 'facebook',
    displayName: 'Facebook',
    icon: '👤',
    color: 'bg-blue-500',
    description: 'Social networking platform',
    docsUrl: 'https://developers.facebook.com/',
  },
  INSTAGRAM: {
    name: 'instagram',
    displayName: 'Instagram',
    icon: '📷',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    description: 'Photo and video sharing platform',
    docsUrl: 'https://developers.facebook.com/docs/instagram',
  },
  YOUTUBE: {
    name: 'youtube',
    displayName: 'YouTube',
    icon: '🎥',
    color: 'bg-red-600',
    description: 'Video sharing platform',
    docsUrl: 'https://console.cloud.google.com/',
  },
  TIKTOK: {
    name: 'tiktok',
    displayName: 'TikTok',
    icon: '🎵',
    color: 'bg-black',
    description: 'Short-form video platform',
    docsUrl: 'https://developers.tiktok.com/',
  },
  THREADS: {
    name: 'threads',
    displayName: 'Threads',
    icon: '🧵',
    color: 'bg-gray-900',
    description: 'Text-based conversation platform',
    docsUrl: 'https://developers.facebook.com/docs/threads',
  },
  BLUESKY: {
    name: 'bluesky',
    displayName: 'Bluesky',
    icon: '🦋',
    color: 'bg-sky-500',
    description: 'Decentralized social network',
    docsUrl: 'https://docs.bsky.app/',
  },
};

export default function OAuthConfigPage() {
  const [configs, setConfigs] = useState<Record<SocialPlatform, OAuthConfigData | null>>({} as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);
  const [formData, setFormData] = useState({ clientId: '', clientSecret: '' });
  const [saving, setSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/oauth-config');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const configMap: Record<SocialPlatform, OAuthConfigData | null> = {} as any;
      Object.values(SocialPlatform).forEach((platform) => {
        configMap[platform] = null;
      });
      data.configs.forEach((config: OAuthConfigData) => {
        configMap[config.platform] = config;
      });

      setConfigs(configMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (platform: SocialPlatform) => {
    const config = configs[platform];
    setEditingPlatform(platform);
    setShowGuide(true);
    setFormData({
      clientId: config?.clientId || '',
      clientSecret: config?.clientSecret || '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!editingPlatform) return;

    if (!formData.clientId.trim() || !formData.clientSecret.trim()) {
      setError('Client ID와 Client Secret을 모두 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/oauth-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: editingPlatform,
          clientId: formData.clientId.trim(),
          clientSecret: formData.clientSecret.trim(),
          isActive: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSuccess(`${PLATFORMS[editingPlatform].displayName} 설정이 저장되었습니다!`);
      setEditingPlatform(null);
      setShowGuide(false);
      setFormData({ clientId: '', clientSecret: '' });
      loadConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (platform: SocialPlatform) => {
    if (!confirm(`${PLATFORMS[platform].displayName} OAuth 설정을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/oauth-config?platform=${platform}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSuccess(`${PLATFORMS[platform].displayName} 설정이 삭제되었습니다!`);
      loadConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration');
    }
  };

  const handleCancel = () => {
    setEditingPlatform(null);
    setShowGuide(false);
    setFormData({ clientId: '', clientSecret: '' });
    setError(null);
  };

  const renderGuide = (guide: PlatformGuide) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            📖 {PLATFORMS[guide.platform].displayName} 연동 가이드
          </h3>
          <button
            onClick={() => setShowGuide(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕ 닫기
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {guide.steps.map((step, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-gray-700 mb-2">{step.description}</p>

              {step.details && (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-2">
                  {step.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}

              {step.code && (
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto mb-2">
                  {step.code}
                </div>
              )}

              {step.warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                  ⚠️ {step.warning}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        {guide.tips && guide.tips.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">유용한 팁</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {guide.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Troubleshooting */}
        {guide.troubleshooting && guide.troubleshooting.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2">문제 해결</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
              {guide.troubleshooting.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-6 flex gap-3">
          <a
            href={guide.appCreationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-center font-medium"
          >
            🚀 {PLATFORMS[guide.platform].displayName} 앱 만들러 가기
          </a>
          <a
            href={PLATFORMS[guide.platform].docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 text-center font-medium"
          >
            📚 개발자 문서 보기
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">OAuth 설정</h1>
          <p className="mt-2 text-gray-600">
            소셜 미디어 플랫폼의 OAuth 인증 정보를 설정합니다. 모든 인증 정보는 암호화되어 안전하게 저장됩니다.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-2xl mr-3">❌</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">오류</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button onClick={() => setError(null)} className="mt-2 text-sm text-red-600 hover:text-red-800">
              닫기
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-2xl mr-3">✅</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">성공</h3>
                <p className="mt-1 text-sm text-green-700">{success}</p>
              </div>
            </div>
            <button onClick={() => setSuccess(null)} className="mt-2 text-sm text-green-600 hover:text-green-800">
              닫기
            </button>
          </div>
        )}

        {/* Guide Section */}
        {editingPlatform && showGuide && (
          <div className="mb-6">
            {renderGuide(getPlatformGuide(editingPlatform))}
          </div>
        )}

        {/* Form Section */}
        {editingPlatform && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {PLATFORMS[editingPlatform].icon} {PLATFORMS[editingPlatform].displayName} 인증 정보 입력
              </h3>
              {!showGuide && (
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  📖 가이드 다시 보기
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  placeholder="앱의 Client ID를 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Secret <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                  placeholder="앱의 Client Secret을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  🔒 입력한 정보는 AES-256-GCM 암호화되어 데이터베이스에 저장됩니다.
                </p>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? '저장 중...' : '💾 저장'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">설정 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PLATFORMS).map(([platform, info]) => {
              const config = configs[platform as SocialPlatform];
              const isEditing = editingPlatform === platform;

              if (isEditing) return null; // 편집 중이면 카드 숨김

              return (
                <div key={platform} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className={`${info.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                      {info.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{info.displayName}</h3>
                      <p className="text-xs text-gray-500">{info.description}</p>
                    </div>
                  </div>

                  {config ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ 설정됨
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(config.updatedAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <p className="font-mono truncate">ID: {config.clientId.substring(0, 24)}...</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(platform as SocialPlatform)}
                          className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium"
                        >
                          ✏️ 수정
                        </button>
                        <button
                          onClick={() => handleDelete(platform as SocialPlatform)}
                          className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 text-sm font-medium"
                        >
                          🗑️ 삭제
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-3">아직 설정되지 않음</p>
                      <button
                        onClick={() => handleEdit(platform as SocialPlatform)}
                        className={`w-full ${info.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                      >
                        ⚙️ 연동하기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* General Help */}
        {!editingPlatform && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 시작 방법</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">1️⃣ 플랫폼 선택</h4>
                <p>위에서 연동하고 싶은 소셜 미디어 플랫폼의 "연동하기" 버튼을 클릭하세요.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2️⃣ 가이드 따라하기</h4>
                <p>각 플랫폼별 상세 가이드가 표시됩니다. 단계별로 따라하면서 앱을 생성하세요.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3️⃣ 인증 정보 입력</h4>
                <p>개발자 포털에서 받은 Client ID와 Secret을 복사해서 입력하세요.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4️⃣ 계정 연동</h4>
                <p>저장 후 "소셜 미디어 계정" 페이지로 가서 실제 계정을 연결하세요.</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-300">
              <p className="font-semibold text-blue-900 mb-2">🔒 보안 정보</p>
              <p className="text-sm text-blue-800">
                모든 OAuth 인증 정보는 AES-256-GCM 암호화 알고리즘으로 암호화되어 데이터베이스에 저장됩니다.
                이 애플리케이션만 복호화할 수 있으며, 평문으로 저장되지 않습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
