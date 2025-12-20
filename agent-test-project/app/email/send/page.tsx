'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function QuickSendEmailPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState('');
  const [fromName, setFromName] = useState('Marketing Team');
  const [fromEmail, setFromEmail] = useState('onboarding@resend.dev');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    // 유효성 검사
    if (!subject.trim()) {
      toast.error('제목을 입력하세요');
      return;
    }
    if (!content.trim()) {
      toast.error('내용을 입력하세요');
      return;
    }
    if (!recipients.trim()) {
      toast.error('받는 사람 이메일 주소를 입력하세요');
      return;
    }

    // 이메일 주소 파싱 (콤마, 세미콜론, 스페이스, 줄바꿈으로 구분)
    const emailList = recipients
      .split(/[,;\s\n]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast.error(`유효하지 않은 이메일 주소: ${invalidEmails.join(', ')}`);
      return;
    }

    if (emailList.length === 0) {
      toast.error('최소 1개 이상의 이메일 주소가 필요합니다');
      return;
    }

    if (emailList.length > 100) {
      toast.error('한 번에 최대 100개까지만 보낼 수 있습니다');
      return;
    }

    if (!confirm(`${emailList.length}명에게 이메일을 발송하시겠습니까?`)) {
      return;
    }

    try {
      setSending(true);

      // 1. 캠페인 생성
      const campaignResponse = await fetch('/api/email/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          fromEmail,
          fromName,
        }),
      });

      if (!campaignResponse.ok) {
        const errorData = await campaignResponse.json();
        throw new Error(errorData.error || '캠페인 생성 실패');
      }

      const campaign = await campaignResponse.json();

      // 2. 즉시 발송
      const sendResponse = await fetch(`/api/email/campaigns/${campaign.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: emailList,
          sendNow: true,
          useQueue: true,
        }),
      });

      if (!sendResponse.ok) {
        const errorData = await sendResponse.json();
        throw new Error(errorData.error || '이메일 발송 실패');
      }

      const result = await sendResponse.json();

      toast.success(`✅ ${emailList.length}명에게 이메일 발송이 시작되었습니다!`);

      // 폼 초기화
      setSubject('');
      setContent('');
      setRecipients('');
    } catch (error) {
      console.error('이메일 발송 오류:', error);
      toast.error(error instanceof Error ? error.message : '이메일 발송에 실패했습니다');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📧 빠른 이메일 발송</h1>
              <p className="text-gray-600 mt-2">여러 사람에게 한 번에 이메일을 보내세요</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              ← 홈으로
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 발신자 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">발신자 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  발신자 이름
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Marketing Team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  발신자 이메일
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="onboarding@resend.dev"
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 도메인 인증 없이는 onboarding@resend.dev 사용 추천
                </p>
              </div>
            </div>
          </div>

          {/* 받는 사람 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              받는 사람 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example1@gmail.com, example2@gmail.com&#10;example3@naver.com&#10;여러 줄로 입력 가능 (콤마, 세미콜론, 스페이스, 줄바꿈으로 구분)"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                입력된 이메일: {recipients.split(/[,;\s\n]+/).filter(e => e.trim().length > 0).length}개
              </span>
              <span className="text-gray-500">
                최대 100개까지 가능
              </span>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="새해 인사 드립니다 🎉"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 내용 <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-gray-500">(HTML 사용 가능)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="<h1>안녕하세요!</h1>&#10;<p>새해 복 많이 받으세요.</p>&#10;<p>감사합니다.</p>"
            />
          </div>

          {/* 도움말 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 사용 팁</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• 받는 사람 이메일은 콤마(,), 세미콜론(;), 스페이스, 줄바꿈으로 구분됩니다</li>
              <li>• HTML 태그를 사용하여 이메일을 꾸밀 수 있습니다</li>
              <li>• 발송 전 테스트로 본인 이메일에 먼저 보내보세요</li>
              <li>• 무료 플랜은 월 100건까지 발송 가능합니다</li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSubject('');
                setContent('');
                setRecipients('');
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? '발송 중...' : '📨 이메일 발송'}
            </button>
          </div>
        </div>

        {/* 예시 */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-3">📝 HTML 이메일 예시</h3>
          <div className="bg-white rounded p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-700">{`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">안녕하세요! 👋</h1>
  <p style="font-size: 16px; line-height: 1.6;">
    새해 복 많이 받으세요!
  </p>
  <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; color: #1e40af;">
      <strong>특별 할인:</strong> 50% OFF 🎉
    </p>
  </div>
  <a href="https://example.com" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    자세히 보기
  </a>
  <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
    이 이메일을 받고 싶지 않으시면 <a href="#">구독 취소</a>
  </p>
</div>`}</pre>
          </div>
          <p className="mt-3 text-sm text-purple-800">
            위 예시를 복사해서 사용하거나 수정해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}
