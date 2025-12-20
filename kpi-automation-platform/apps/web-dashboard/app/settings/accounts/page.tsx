'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ConnectedAccount {
  id: string;
  platform: string;
  accountName: string;
  accountId: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
}

const PLATFORMS = [
  { id: 'LINKEDIN', name: 'LinkedIn', icon: '🔗', color: 'bg-blue-600' },
  { id: 'TWITTER', name: 'Twitter/X', icon: '𝕏', color: 'bg-gray-900' },
  { id: 'FACEBOOK', name: 'Facebook', icon: 'f', color: 'bg-blue-700' },
  { id: 'INSTAGRAM', name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
  { id: 'THREADS', name: 'Threads', icon: '@', color: 'bg-gray-800' },
];

export default function AccountsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchAccounts();
    }
  }, [status, router]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/social-accounts');
      const data = await res.json();
      if (data.success) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectAccount = (platform: string) => {
    window.location.href = `/api/oauth/connect?platform=${platform}`;
  };

  const disconnectAccount = async (accountId: string) => {
    if (!confirm('정말 이 계정의 연결을 해제하시겠습니까?')) {
      return;
    }

    try {
      const res = await fetch(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAccounts();
      } else {
        alert('계정 연결 해제에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      alert('계정 연결 해제 중 오류가 발생했습니다');
    }
  };

  const setPrimaryAccount = async (accountId: string) => {
    try {
      const res = await fetch(`/api/social-accounts/${accountId}/set-primary`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchAccounts();
      } else {
        alert('기본 계정 설정에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to set primary account:', error);
      alert('기본 계정 설정 중 오류가 발생했습니다');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SNS 계정 연결</h1>
        <p className="text-gray-600 mt-2">
          소셜 미디어 계정을 연결하여 자동으로 포스팅하세요
        </p>
      </div>

      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const connectedAccounts = accounts.filter(
            (acc) => acc.platform === platform.id && acc.isActive
          );

          return (
            <div key={platform.id} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                    {connectedAccounts.length === 0 ? (
                      <p className="text-sm text-gray-500">연결된 계정 없음</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {connectedAccounts.length}개 계정 연결됨
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => connectAccount(platform.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  + 계정 연결
                </button>
              </div>

              {connectedAccounts.length > 0 && (
                <div className="mt-4 space-y-3">
                  {connectedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{account.accountName}</p>
                            {account.isPrimary && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                                기본 계정
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">@{account.accountId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!account.isPrimary && (
                          <button
                            onClick={() => setPrimaryAccount(account.id)}
                            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
                          >
                            기본으로 설정
                          </button>
                        )}
                        <button
                          onClick={() => disconnectAccount(account.id)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          연결 해제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 안내</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 각 플랫폼당 여러 계정을 연결할 수 있습니다</li>
          <li>• "기본 계정"으로 설정된 계정이 자동으로 사용됩니다</li>
          <li>• 포스팅 작성 시 연결된 계정으로만 발행됩니다</li>
        </ul>
      </div>
    </div>
  );
}
