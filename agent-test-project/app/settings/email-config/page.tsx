'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import toast from 'react-hot-toast';

interface EmailConfig {
  id: string;
  resendApiKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailConfigPage() {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email-config');
      const data = await response.json();

      if (response.ok && data.config) {
        setConfig(data.config);
        setApiKey(data.config.resendApiKey);
        setShowGuide(false); // 이미 설정되어 있으면 가이드 숨김
      } else {
        setShowGuide(true); // 설정이 없으면 가이드 표시
      }
    } catch (err) {
      console.error('Failed to load email config:', err);
      setShowGuide(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Resend API 키를 입력해주세요.');
      return;
    }

    if (!apiKey.startsWith('re_')) {
      toast.error('유효한 Resend API 키가 아닙니다. "re_"로 시작해야 합니다.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resendApiKey: apiKey.trim(),
          isActive: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success('이메일 설정이 저장되었습니다!');
      setIsEditing(false);
      setShowGuide(false);
      loadConfig();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('이메일 설정을 삭제하시겠습니까? 이메일 캠페인을 발송할 수 없게 됩니다.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/email-config', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success('이메일 설정이 삭제되었습니다.');
      setConfig(null);
      setApiKey('');
      setShowGuide(true);
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowGuide(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiKey(config?.resendApiKey || '');
    if (config) {
      setShowGuide(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">📧 이메일 서비스 설정</h1>
          <p className="mt-2 text-gray-600">
            Resend API를 설정하여 이메일 캠페인을 발송할 수 있습니다.
          </p>
        </div>

        {/* Guide Section */}
        {showGuide && (
          <div className="mb-6 bg-white border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                📖 Resend 설정 가이드
              </h3>
              {config && (
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕ 닫기
                </button>
              )}
            </div>

            {/* Steps */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">1️⃣ Resend 가입하기</h4>
                <p className="text-gray-700 mb-3">
                  Resend 웹사이트에 방문하여 계정을 만드세요.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <p className="text-sm font-semibold text-blue-900 mb-2">📝 상세 가이드:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>아래 "Resend 가입하러 가기" 버튼을 클릭하세요</li>
                    <li>우측 상단의 "Sign Up" 버튼을 클릭하세요</li>
                    <li>이메일 주소를 입력하고 "Continue with Email" 클릭</li>
                    <li>받은 메일함에서 인증 메일을 확인하고 링크를 클릭하세요</li>
                    <li>비밀번호를 설정하면 가입 완료!</li>
                  </ol>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>✅ 무료 플랜으로 시작 가능 (월 100건까지 무료)</li>
                  <li>✅ 이메일 주소만으로 간편 가입</li>
                  <li>✅ 신용카드 등록 불필요</li>
                  <li>⏱️ 가입은 약 2분 정도 소요됩니다</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">2️⃣ 도메인 인증하기 (선택사항)</h4>
                <p className="text-gray-700 mb-3">
                  발신자 이메일 도메인을 인증하면 더 높은 전달률을 얻을 수 있습니다.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-3">
                  <p className="font-semibold text-yellow-900 mb-2">💡 처음이시라면 이 단계를 건너뛰세요!</p>
                  <p className="text-sm text-yellow-800 mb-2">
                    테스트용으로 <strong>onboarding@resend.dev</strong> 주소를 사용할 수 있습니다.
                    도메인 인증은 나중에 해도 됩니다.
                  </p>
                  <p className="text-sm text-yellow-800">
                    ➡️ <strong>3단계: API 키 발급받기</strong>로 바로 이동하세요!
                  </p>
                </div>

                <details className="bg-green-50 border border-green-200 rounded p-3">
                  <summary className="cursor-pointer font-semibold text-green-900 mb-2">
                    🔍 도메인 인증 상세 가이드 (고급)
                  </summary>
                  <div className="mt-3 space-y-3">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
                      <li>Resend 대시보드 좌측 메뉴에서 "Domains" 클릭</li>
                      <li>우측 상단의 "Add Domain" 버튼 클릭</li>
                      <li>본인이 소유한 도메인 입력 (예: example.com)</li>
                      <li>Resend가 제공하는 3개의 DNS 레코드를 복사</li>
                      <li>도메인 호스팅 업체(GoDaddy, AWS Route53, Cloudflare 등)에 로그인</li>
                      <li>DNS 설정 페이지에서 레코드 추가</li>
                      <li>Resend로 돌아와서 "Verify DNS Records" 클릭</li>
                      <li>녹색 체크 표시가 나타나면 인증 완료!</li>
                    </ol>
                    <div className="bg-white border border-green-300 rounded p-2 mt-2">
                      <p className="text-xs text-green-900 font-semibold mb-1">⏱️ 소요 시간:</p>
                      <p className="text-xs text-green-800">DNS 전파는 보통 5-10분, 최대 24시간 소요</p>
                    </div>
                  </div>
                </details>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">3️⃣ API 키 발급받기 ⭐ 중요!</h4>
                <p className="text-gray-700 mb-3">
                  Resend 대시보드에서 API 키를 생성하세요. 이 키가 있어야 이메일을 보낼 수 있습니다!
                </p>

                <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-3">
                  <p className="text-sm font-semibold text-purple-900 mb-2">📝 단계별 가이드 (반드시 따라하세요!):</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
                    <li>
                      <strong>Resend 대시보드</strong>에 로그인하세요
                      <span className="block ml-5 text-xs text-purple-600">
                        (아직 로그인 안 했다면 아래 "Resend 가입하러 가기" 버튼 클릭)
                      </span>
                    </li>
                    <li>
                      좌측 메뉴에서 <strong>"API Keys"</strong> 클릭
                      <span className="block ml-5 text-xs text-purple-600">
                        (열쇠 모양 아이콘 🔑)
                      </span>
                    </li>
                    <li>
                      우측 상단의 <strong>"Create API Key"</strong> 버튼 클릭
                      <span className="block ml-5 text-xs text-purple-600">
                        (보라색 또는 파란색 버튼)
                      </span>
                    </li>
                    <li>
                      키 이름을 입력하세요
                      <span className="block ml-5 text-xs text-purple-600">
                        예: "My Campaign API Key" 또는 "Production Key"
                      </span>
                    </li>
                    <li>
                      권한(Permission)을 선택하세요
                      <span className="block ml-5 text-xs text-purple-600">
                        추천: <strong>"Sending access"</strong> (이메일 발송만 가능)
                      </span>
                    </li>
                    <li>
                      <strong>"Add"</strong> 버튼을 클릭하세요
                    </li>
                    <li>
                      <strong className="text-red-600">⚠️ 중요!</strong> 생성된 API 키를 즉시 복사하세요!
                      <span className="block ml-5 text-xs text-purple-600">
                        이 키는 다시 볼 수 없습니다! 잃어버리면 새로 만들어야 합니다.
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-900 text-green-400 p-3 rounded mt-2 mb-2">
                  <p className="text-xs text-gray-400 mb-1">API 키 형식 예시:</p>
                  <div className="font-mono text-sm overflow-x-auto">
                    re_abcdefghijk1234567890_ABCDEFGHIJK1234567890
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                  <p className="text-sm font-semibold text-red-900 mb-1">🚨 주의사항:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                    <li>API 키는 "re_"로 시작해야 합니다</li>
                    <li>생성 후 딱 한 번만 보여줍니다 - 반드시 즉시 복사하세요!</li>
                    <li>키를 잃어버리면 삭제 후 새로 만들어야 합니다</li>
                    <li>이 키로 이메일을 발송할 수 있으므로 안전하게 보관하세요</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-bold text-gray-900 mb-2">4️⃣ 이 페이지에 API 키 입력하고 저장</h4>
                <p className="text-gray-700 mb-3">
                  방금 복사한 API 키를 아래 입력란에 붙여넣고 저장 버튼을 클릭하세요.
                </p>

                <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-3">
                  <p className="text-sm font-semibold text-orange-900 mb-2">📝 입력 방법:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-orange-800">
                    <li>
                      아래로 스크롤해서 <strong>"Resend API 키"</strong> 입력란을 찾으세요
                    </li>
                    <li>
                      입력란을 클릭한 후 복사한 API 키를 붙여넣기 하세요
                      <span className="block ml-5 text-xs text-orange-600">
                        (Ctrl+V 또는 우클릭 → 붙여넣기)
                      </span>
                    </li>
                    <li>
                      API 키가 <strong>"re_"</strong>로 시작하는지 확인하세요
                    </li>
                    <li>
                      <strong>"💾 저장"</strong> 버튼을 클릭하세요
                    </li>
                    <li>
                      녹색 성공 메시지가 나타나면 완료!
                    </li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm font-semibold text-green-900 mb-1">✅ 저장 후에는:</p>
                  <p className="text-sm text-green-800">
                    바로 이메일 캠페인을 만들어서 테스트 이메일을 발송해보세요!
                    성공하면 모든 설정이 완료된 것입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-3 text-lg">🚀 빠른 시작 (3분 완성!)</h4>
              <p className="text-sm text-green-800 mb-3">
                처음 사용하시는 분은 이 순서대로만 따라하세요:
              </p>
              <div className="bg-white rounded p-3 space-y-2">
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-center text-sm font-bold mr-2">1</span>
                  <p className="text-sm text-gray-800 flex-1">
                    아래 "🚀 Resend 가입하러 가기" 버튼 클릭 → 이메일로 가입
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-center text-sm font-bold mr-2">2</span>
                  <p className="text-sm text-gray-800 flex-1">
                    Resend 대시보드 → 좌측 "API Keys" → "Create API Key" 클릭
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-center text-sm font-bold mr-2">3</span>
                  <p className="text-sm text-gray-800 flex-1">
                    이름 입력 → Permission은 "Sending access" → Add 클릭 → <strong>API 키 복사!</strong>
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-center text-sm font-bold mr-2">4</span>
                  <p className="text-sm text-gray-800 flex-1">
                    이 페이지 아래로 스크롤 → API 키 붙여넣기 → 💾 저장 버튼 클릭
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-sm font-bold mr-2">✓</span>
                  <p className="text-sm text-gray-800 flex-1">
                    완료! 이제 이메일 캠페인 페이지에서 테스트 메일 발송 가능!
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">💡 유용한 팁</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>✅ 무료 플랜(월 100건)으로 충분히 테스트 가능합니다</li>
                <li>✅ 도메인 인증 없이도 onboarding@resend.dev로 바로 테스트 가능</li>
                <li>✅ API 키는 이 시스템에서 암호화되어 저장됩니다 (AES-256)</li>
                <li>✅ 발송 실패 시 Resend 대시보드 "Logs"에서 원인 확인 가능</li>
                <li>✅ 이메일 발송 제한: 무료는 월 100건, Pro는 월 50,000건</li>
              </ul>
            </div>

            {/* Troubleshooting */}
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-900 mb-2">🔧 문제 해결</h4>
              <ul className="space-y-2 text-sm text-red-800">
                <li>
                  <strong>Q: API 키가 유효하지 않다고 나와요</strong>
                  <p className="ml-4 text-xs text-red-700">→ "re_"로 시작하는지, 복사할 때 앞뒤 공백이 없는지 확인하세요</p>
                </li>
                <li>
                  <strong>Q: 이메일이 안 가요</strong>
                  <p className="ml-4 text-xs text-red-700">→ Resend 대시보드 "Logs"에서 에러 확인 / 무료 플랜 100건 제한 확인</p>
                </li>
                <li>
                  <strong>Q: API 키를 잃어버렸어요</strong>
                  <p className="ml-4 text-xs text-red-700">→ Resend에서 기존 키 삭제 후 새 키를 만들고 다시 입력하세요</p>
                </li>
                <li>
                  <strong>Q: 스팸함으로 가요</strong>
                  <p className="ml-4 text-xs text-red-700">→ 도메인 인증(SPF, DKIM, DMARC)을 완료하면 전달률이 크게 향상됩니다</p>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://resend.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-center font-medium"
              >
                🚀 Resend 가입하러 가기
              </a>
              <a
                href="https://resend.com/docs/introduction"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 text-center font-medium"
              >
                📚 Resend 문서 보기
              </a>
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
          <>
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  🔑 Resend API 키
                </h3>
                {!isEditing && !showGuide && (
                  <button
                    onClick={() => setShowGuide(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    📖 가이드 보기
                  </button>
                )}
              </div>

              {config && !isEditing ? (
                // Display Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✅</span>
                      <div>
                        <p className="font-semibold text-green-900">이메일 서비스가 활성화되었습니다</p>
                        <p className="text-sm text-green-700">
                          마지막 업데이트: {new Date(config.updatedAt).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API 키
                    </label>
                    <div className="font-mono text-sm text-gray-600 bg-white p-3 rounded border border-gray-300">
                      {config.resendApiKey.substring(0, 10)}••••••••••••••••••••
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      🔒 보안을 위해 일부만 표시됩니다
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleEdit}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      ✏️ 수정
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resend API 키 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="re_로 시작하는 API 키를 입력하세요"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      🔒 입력한 API 키는 AES-256-GCM 암호화되어 안전하게 저장됩니다.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📌 확인사항</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>✓ API 키가 "re_"로 시작하는지 확인하세요</li>
                      <li>✓ Resend 대시보드에서 API 키가 활성 상태인지 확인하세요</li>
                      <li>✓ 도메인 인증이 완료되었는지 확인하세요</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {saving ? '저장 중...' : '💾 저장'}
                    </button>
                    {config && (
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
                      >
                        취소
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Test Email Section */}
            {config && !isEditing && (
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">🧪 테스트 발송</h3>
                <p className="text-sm text-purple-800 mb-4">
                  이메일 캠페인 페이지에서 테스트 이메일을 발송하여 설정이 올바른지 확인하세요.
                </p>
                <a
                  href="/email/campaigns/new"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
                >
                  📬 이메일 캠페인 만들기
                </a>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Resend란?</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Resend</strong>는 개발자 친화적인 이메일 발송 서비스입니다.
              SendGrid, Mailgun과 같은 다른 이메일 서비스 대비 다음과 같은 장점이 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>간단한 API와 우수한 개발자 경험</li>
              <li>React 컴포넌트로 이메일 템플릿 작성 가능</li>
              <li>무료 플랜 제공 (월 100건)</li>
              <li>99.99% 가동률 보장</li>
              <li>상세한 발송 로그 및 분석</li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="font-semibold text-gray-900 mb-2">📊 요금제</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="font-semibold text-gray-900">Free</p>
                <p className="text-gray-600">월 100건 무료</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="font-semibold text-gray-900">Pro</p>
                <p className="text-gray-600">$20/월, 50,000건</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="font-semibold text-gray-900">Business</p>
                <p className="text-gray-600">$80/월, 150,000건</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
