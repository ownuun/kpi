/**
 * Platform-specific OAuth setup guides
 */

import { SocialPlatform } from '@prisma/client';

export interface SetupStep {
  title: string;
  description: string;
  details?: string[];
  code?: string;
  warning?: string;
}

export interface PlatformGuide {
  platform: SocialPlatform;
  appCreationUrl: string;
  requiredScopes: string[];
  steps: SetupStep[];
  tips: string[];
  troubleshooting?: string[];
}

export const PLATFORM_GUIDES: Record<SocialPlatform, PlatformGuide> = {
  LINKEDIN: {
    platform: 'LINKEDIN',
    appCreationUrl: 'https://www.linkedin.com/developers/apps/new',
    requiredScopes: [
      'openid',
      'profile',
      'email',
      'w_member_social',
      'r_basicprofile',
      'r_organization_social',
    ],
    steps: [
      {
        title: '1단계: LinkedIn 개발자 포털 접속',
        description: 'LinkedIn 개발자 계정으로 로그인하고 새 앱을 생성합니다.',
        details: [
          'LinkedIn 개발자 포털 (linkedin.com/developers) 접속',
          '"Create app" 버튼 클릭',
          '앱 이름, 회사 페이지 등 기본 정보 입력',
          '이용 약관 동의 후 생성',
        ],
      },
      {
        title: '2단계: OAuth 설정',
        description: '앱 설정에서 OAuth 2.0 설정을 구성합니다.',
        details: [
          '생성된 앱의 "Auth" 탭으로 이동',
          '"OAuth 2.0 settings" 섹션 찾기',
          'Redirect URLs에 아래 URL 추가:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/linkedin/callback` : undefined,
      },
      {
        title: '3단계: 권한(Scopes) 설정',
        description: '필요한 API 권한을 요청합니다.',
        details: [
          '"Products" 탭으로 이동',
          '"Sign In with LinkedIn" 제품 추가',
          '"Share on LinkedIn" 제품 추가 (포스팅용)',
          '권한 승인 대기 (즉시 승인되거나 수 분 소요)',
        ],
        warning: '일부 권한은 LinkedIn 검토가 필요할 수 있습니다.',
      },
      {
        title: '4단계: 인증 정보 복사',
        description: 'Client ID와 Client Secret을 복사합니다.',
        details: [
          '"Auth" 탭으로 돌아가기',
          '"Application credentials" 섹션에서 Client ID 복사',
          '"Client Secret"의 "Show" 버튼 클릭 후 복사',
          '아래 입력 필드에 붙여넣기',
        ],
      },
    ],
    tips: [
      '💡 LinkedIn 앱은 회사 페이지와 연결되어야 합니다.',
      '💡 개인 프로필로는 포스팅이 제한적일 수 있습니다.',
      '💡 "Share on LinkedIn" 권한이 승인되어야 포스팅 가능합니다.',
    ],
    troubleshooting: [
      'Redirect URI 불일치 오류: 정확히 위 URL을 복사했는지 확인',
      '권한 부족 오류: Products 탭에서 필요한 제품이 추가되었는지 확인',
      '토큰 만료: LinkedIn 토큰은 60일 후 만료됩니다.',
    ],
  },

  TWITTER: {
    platform: 'TWITTER',
    appCreationUrl: 'https://developer.twitter.com/en/portal/projects-and-apps',
    requiredScopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    steps: [
      {
        title: '1단계: Twitter 개발자 계정 신청',
        description: 'Twitter Developer Portal에 접속하여 개발자 계정을 신청합니다.',
        details: [
          'Twitter Developer Portal 접속',
          '개발자 계정 신청 (처음인 경우)',
          '앱 사용 목적 설명 (영문으로 작성 권장)',
          '승인 대기 (보통 1-2일 소요)',
        ],
        warning: '개발자 계정 승인이 필요합니다. 신청 시 구체적인 사용 목적을 작성하세요.',
      },
      {
        title: '2단계: 프로젝트 및 앱 생성',
        description: '새 프로젝트와 앱을 생성합니다.',
        details: [
          '"Projects & Apps" 메뉴에서 "+ Create Project" 클릭',
          '프로젝트 이름 및 용도 입력',
          '앱 이름 입력',
          'API Key와 Secret 저장 (나중에 다시 볼 수 없음)',
        ],
      },
      {
        title: '3단계: OAuth 2.0 설정',
        description: '앱 설정에서 OAuth 2.0을 활성화합니다.',
        details: [
          '생성된 앱의 "Settings" 탭 클릭',
          '"User authentication settings" 섹션에서 "Set up" 클릭',
          '"OAuth 2.0" 토글 활성화',
          '"Type of App"에서 "Web App" 선택',
          'Callback URL에 아래 URL 입력:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/twitter/callback` : undefined,
      },
      {
        title: '4단계: 권한 설정',
        description: '필요한 권한(Scopes)을 선택합니다.',
        details: [
          'App permissions에서 "Read and Write" 선택',
          'Request email from users 체크 (선택사항)',
          '저장 후 OAuth 2.0 Client ID와 Secret 복사',
        ],
      },
      {
        title: '5단계: 인증 정보 입력',
        description: 'Client ID와 Client Secret을 아래에 입력합니다.',
        details: [
          'OAuth 2.0 Client ID 복사',
          'OAuth 2.0 Client Secret 복사',
          '아래 입력 필드에 붙여넣기',
        ],
        warning: 'API Key가 아닌 OAuth 2.0 Client ID/Secret을 사용해야 합니다!',
      },
    ],
    tips: [
      '💡 Free tier는 월 1,500개 트윗 제한이 있습니다.',
      '💡 Elevated access를 신청하면 더 많은 기능 사용 가능 (월 $100)',
      '💡 OAuth 2.0 (v2)를 사용해야 PKCE를 지원합니다.',
    ],
    troubleshooting: [
      'Invalid redirect URI: Callback URL이 정확히 일치하는지 확인',
      'Insufficient permissions: Read and Write 권한이 설정되었는지 확인',
      'Rate limit exceeded: API 호출 제한을 확인하세요',
    ],
  },

  FACEBOOK: {
    platform: 'FACEBOOK',
    appCreationUrl: 'https://developers.facebook.com/apps/create/',
    requiredScopes: ['pages_manage_posts', 'pages_read_engagement', 'public_profile'],
    steps: [
      {
        title: '1단계: Facebook 개발자 계정',
        description: 'Meta for Developers에 접속하여 개발자 등록을 합니다.',
        details: [
          'Meta for Developers (developers.facebook.com) 접속',
          'Facebook 계정으로 로그인',
          '개발자 등록 (처음인 경우)',
          '이메일 인증 완료',
        ],
      },
      {
        title: '2단계: 앱 생성',
        description: '새 Facebook 앱을 생성합니다.',
        details: [
          '"내 앱" > "앱 만들기" 클릭',
          '앱 유형 선택: "비즈니스" 또는 "소비자"',
          '앱 이름 입력',
          '비즈니스 계정 연결 (선택사항)',
        ],
      },
      {
        title: '3단계: Facebook Login 설정',
        description: 'Facebook Login 제품을 추가하고 설정합니다.',
        details: [
          '대시보드에서 "제품 추가" 클릭',
          '"Facebook Login" 선택',
          '"설정" > "기본 설정"으로 이동',
          '유효한 OAuth 리디렉션 URI에 아래 URL 추가:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/facebook/callback` : undefined,
      },
      {
        title: '4단계: 권한 및 검토',
        description: '필요한 권한을 요청합니다.',
        details: [
          '"앱 검토" > "권한 및 기능" 메뉴',
          'pages_manage_posts, pages_read_engagement 권한 요청',
          '비즈니스 검증 완료 (일부 권한은 검증 필요)',
          '승인 대기 (수일 소요 가능)',
        ],
        warning: '일부 권한은 Meta의 앱 검토가 필요하며 승인까지 시간이 걸릴 수 있습니다.',
      },
      {
        title: '5단계: 인증 정보 복사',
        description: 'App ID와 App Secret을 복사합니다.',
        details: [
          '"설정" > "기본 설정"으로 이동',
          '"앱 ID" 복사',
          '"앱 시크릿 코드" 옆 "표시" 클릭 후 복사',
          '아래 입력 필드에 붙여넣기',
        ],
      },
    ],
    tips: [
      '💡 개인 프로필이 아닌 페이지에만 포스팅 가능합니다.',
      '💡 비즈니스 검증을 완료하면 더 많은 기능 사용 가능합니다.',
      '💡 앱을 "라이브" 모드로 전환해야 실제 사용 가능합니다.',
    ],
    troubleshooting: [
      '권한 거부: 페이지 관리자 권한이 있는지 확인',
      'App not in live mode: 앱을 개발 모드에서 라이브로 전환',
      '토큰 만료: 장기 토큰(60일)을 사용하도록 설정',
    ],
  },

  INSTAGRAM: {
    platform: 'INSTAGRAM',
    appCreationUrl: 'https://developers.facebook.com/apps/create/',
    requiredScopes: [
      'instagram_basic',
      'instagram_content_publish',
      'pages_show_list',
      'pages_read_engagement',
    ],
    steps: [
      {
        title: '1단계: Facebook 앱 생성',
        description: 'Instagram API는 Facebook 앱을 통해 접근합니다.',
        details: [
          'Facebook 개발자 포털에서 앱 생성',
          'Instagram Graph API 제품 추가',
          'Facebook 페이지와 Instagram 비즈니스 계정 연결 필요',
        ],
        warning: 'Instagram 개인 계정은 지원되지 않습니다. 비즈니스/크리에이터 계정이 필요합니다.',
      },
      {
        title: '2단계: Instagram 비즈니스 계정 연결',
        description: 'Instagram 계정을 Facebook 페이지와 연결합니다.',
        details: [
          'Instagram 앱에서 설정 > 계정 > 비즈니스 계정으로 전환',
          'Facebook 페이지와 연결',
          'Meta Business Suite에서 연결 확인',
        ],
      },
      {
        title: '3단계: 권한 설정',
        description: 'Instagram API 권한을 요청합니다.',
        details: [
          '앱 검토에서 instagram_content_publish 권한 요청',
          '앱 사용 목적 및 스크린샷 제출',
          '승인 대기 (보통 1-2주 소요)',
        ],
        warning: 'Instagram 콘텐츠 게시 권한은 Meta의 검토가 필수입니다.',
      },
      {
        title: '4단계: OAuth 리디렉션 설정',
        description: 'OAuth 콜백 URL을 설정합니다.',
        details: [
          'Facebook Login 설정에서 유효한 OAuth 리디렉션 URI 추가:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/instagram/callback` : undefined,
      },
      {
        title: '5단계: 인증 정보 입력',
        description: 'Facebook 앱의 ID와 Secret을 입력합니다.',
        details: [
          'Facebook 앱 ID 복사 (Client ID로 사용)',
          'Facebook 앱 시크릿 복사 (Client Secret으로 사용)',
          '아래 입력 필드에 붙여넣기',
        ],
      },
    ],
    tips: [
      '💡 Instagram 비즈니스 또는 크리에이터 계정만 API 사용 가능',
      '💡 Facebook 페이지와의 연결이 필수입니다',
      '💡 이미지/비디오는 먼저 업로드 후 퍼블리시하는 2단계 프로세스',
    ],
  },

  YOUTUBE: {
    platform: 'YOUTUBE',
    appCreationUrl: 'https://console.cloud.google.com/projectcreate',
    requiredScopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
    ],
    steps: [
      {
        title: '1단계: Google Cloud 프로젝트 생성',
        description: 'Google Cloud Console에서 새 프로젝트를 생성합니다.',
        details: [
          'Google Cloud Console 접속',
          '"새 프로젝트" 클릭',
          '프로젝트 이름 입력',
          '프로젝트 생성 완료',
        ],
      },
      {
        title: '2단계: YouTube Data API v3 활성화',
        description: 'API 라이브러리에서 YouTube API를 활성화합니다.',
        details: [
          '"API 및 서비스" > "라이브러리" 메뉴',
          '"YouTube Data API v3" 검색',
          '"사용 설정" 클릭',
        ],
      },
      {
        title: '3단계: OAuth 동의 화면 구성',
        description: 'OAuth 동의 화면을 설정합니다.',
        details: [
          '"API 및 서비스" > "OAuth 동의 화면"',
          '사용자 유형: "외부" 선택',
          '앱 이름, 지원 이메일 입력',
          '범위 추가: youtube.upload, youtube',
        ],
      },
      {
        title: '4단계: OAuth 클라이언트 ID 생성',
        description: 'OAuth 2.0 클라이언트 ID를 생성합니다.',
        details: [
          '"사용자 인증 정보" > "+ 사용자 인증 정보 만들기"',
          '"OAuth 클라이언트 ID" 선택',
          '애플리케이션 유형: "웹 애플리케이션"',
          '승인된 리디렉션 URI에 아래 URL 추가:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/youtube/callback` : undefined,
      },
      {
        title: '5단계: 인증 정보 다운로드',
        description: 'Client ID와 Client Secret을 복사합니다.',
        details: [
          '생성된 OAuth 클라이언트에서 "JSON 다운로드" 또는',
          'Client ID 복사',
          'Client Secret 복사',
          '아래 입력 필드에 붙여넣기',
        ],
      },
    ],
    tips: [
      '💡 YouTube 채널이 있어야 동영상 업로드 가능',
      '💡 일일 할당량 제한이 있습니다 (기본 10,000 units/day)',
      '💡 할당량 증가 신청 가능 (Google 검토 필요)',
    ],
  },

  TIKTOK: {
    platform: 'TIKTOK',
    appCreationUrl: 'https://developers.tiktok.com/apps',
    requiredScopes: ['user.info.basic', 'video.upload', 'video.publish'],
    steps: [
      {
        title: '1단계: TikTok 개발자 계정',
        description: 'TikTok for Developers에 등록합니다.',
        details: [
          'TikTok for Developers (developers.tiktok.com) 접속',
          'TikTok 계정으로 로그인',
          '개발자 등록 신청',
          '이메일 및 전화번호 인증',
        ],
        warning: 'TikTok 개발자 계정 승인은 수일에서 수주가 걸릴 수 있습니다.',
      },
      {
        title: '2단계: 앱 생성',
        description: '새 TikTok 앱을 생성합니다.',
        details: [
          '"Manage apps" > "Create an app" 클릭',
          '앱 이름 및 설명 입력',
          '카테고리 선택',
          '앱 생성 완료',
        ],
      },
      {
        title: '3단계: Content Posting API 신청',
        description: 'Content Posting API 접근 권한을 신청합니다.',
        details: [
          '앱 대시보드에서 "Add products" 클릭',
          '"Content Posting API" 선택',
          '사용 목적 상세 설명 작성',
          '앱 스크린샷 및 데모 영상 제출',
          '승인 대기 (2-4주 소요)',
        ],
        warning: 'Content Posting API는 엄격한 심사를 거칩니다. 명확한 사용 사례가 필요합니다.',
      },
      {
        title: '4단계: 리디렉션 URL 설정',
        description: 'OAuth 리디렉션 URL을 설정합니다.',
        details: [
          '앱 설정에서 "Login Kit" 섹션',
          '"Redirect domain" 또는 "Callback URL"에 아래 URL 추가:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/tiktok/callback` : undefined,
      },
      {
        title: '5단계: 인증 정보 복사',
        description: 'Client Key와 Client Secret을 복사합니다.',
        details: [
          '앱 대시보드에서 "Basic Information"',
          '"Client Key" 복사',
          '"Client Secret" 복사',
          '아래 입력 필드에 붙여넣기',
        ],
      },
    ],
    tips: [
      '💡 비즈니스 계정만 API 사용 가능',
      '💡 일일 업로드 제한 있음 (계정 레벨에 따라 다름)',
      '💡 승인 과정이 가장 오래 걸리는 플랫폼 중 하나',
    ],
  },

  THREADS: {
    platform: 'THREADS',
    appCreationUrl: 'https://developers.facebook.com/apps/create/',
    requiredScopes: ['threads_basic', 'threads_content_publish'],
    steps: [
      {
        title: '1단계: Meta 앱 생성',
        description: 'Threads API는 Meta(Facebook) 앱을 통해 접근합니다.',
        details: [
          'Meta for Developers에서 앱 생성',
          'Threads API 제품 추가 (베타)',
          'Instagram 계정과 Threads 연결 필요',
        ],
        warning: 'Threads API는 현재 베타 단계이며 접근이 제한될 수 있습니다.',
      },
      {
        title: '2단계: Threads 베타 신청',
        description: 'Threads API 베타 접근 권한을 신청합니다.',
        details: [
          'Threads API 대기자 명단 등록',
          '사용 사례 및 앱 목적 설명',
          '승인 이메일 대기',
        ],
      },
      {
        title: '3단계: OAuth 설정',
        description: 'OAuth 리디렉션 URI를 설정합니다.',
        details: [
          'Facebook Login 설정',
          '유효한 OAuth 리디렉션 URI에 아래 URL 추가:',
        ],
        code: typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/threads/callback` : undefined,
      },
      {
        title: '4단계: 인증 정보 입력',
        description: 'Meta 앱의 인증 정보를 입력합니다.',
        details: [
          'Meta 앱 ID 복사',
          'Meta 앱 시크릿 복사',
          '아래 입력 필드에 붙여넣기',
        ],
      },
    ],
    tips: [
      '💡 Threads API는 아직 베타 단계입니다',
      '💡 Instagram 계정이 Threads와 연결되어 있어야 합니다',
      '💡 접근 권한 승인까지 시간이 걸릴 수 있습니다',
    ],
  },

  BLUESKY: {
    platform: 'BLUESKY',
    appCreationUrl: 'https://bsky.app/settings',
    requiredScopes: ['atproto'],
    steps: [
      {
        title: '1단계: Bluesky 계정 생성',
        description: 'Bluesky 계정을 생성합니다.',
        details: [
          'Bluesky 앱 다운로드 또는 웹 접속',
          '초대 코드로 계정 생성 (또는 대기자 명단)',
          '프로필 설정 완료',
        ],
      },
      {
        title: '2단계: App Password 생성',
        description: 'API 접근용 App Password를 생성합니다.',
        details: [
          'Bluesky 설정 > "App Passwords"',
          '"Add App Password" 클릭',
          '앱 이름 입력 (예: "KPI Automation")',
          '생성된 비밀번호 복사 (다시 볼 수 없음)',
        ],
        warning: 'App Password는 한 번만 표시됩니다. 안전하게 보관하세요.',
      },
      {
        title: '3단계: 인증 정보 입력',
        description: 'Bluesky 계정 정보를 입력합니다.',
        details: [
          'Client ID: 본인의 Bluesky 핸들 (예: yourname.bsky.social)',
          'Client Secret: 생성한 App Password',
          '아래 입력 필드에 입력',
        ],
      },
    ],
    tips: [
      '💡 Bluesky는 AT Protocol 기반 분산형 네트워크입니다',
      '💡 별도의 OAuth 앱 등록이 불필요합니다',
      '💡 App Password는 계정 비밀번호와 별개입니다',
    ],
  },
};

export function getPlatformGuide(platform: SocialPlatform): PlatformGuide {
  return PLATFORM_GUIDES[platform];
}
