import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Cleaning existing data...');

  // Delete all existing data
  await prisma.socialPost.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.emailCampaign.deleteMany({});

  console.log('✅ Data cleaned');

  console.log('🌱 Seeding test data...');

  // Create SNS Posts
  await prisma.socialPost.createMany({
    data: [
      {
        platform: 'LINKEDIN',
        title: '신제품 출시 공지',
        content: '드디어 KPI 추적 플랫폼을 출시합니다! 소셜 미디어 성과를 실시간으로 추적하세요. #제품출시 #분석',
        status: 'PUBLISHED',
      },
      {
        platform: 'TWITTER',
        title: '주간 팁',
        content: '📊 이번 주 마케팅 팁: 데이터 기반 의사결정이 성공의 열쇠입니다. KPI를 명확히 설정하고 지속적으로 모니터링하세요!',
        status: 'DRAFT',
      },
      {
        platform: 'FACEBOOK',
        title: '고객 성공 사례',
        content: '우리 플랫폼을 사용한 고객사가 3개월 만에 전환율을 40% 향상시켰습니다! 🎉',
        status: 'SCHEDULED',
        scheduledAt: new Date('2025-12-20T10:00:00Z'),
      },
    ],
  });

  console.log('✅ Created 3 SNS posts');

  // Create Leads
  await prisma.lead.createMany({
    data: [
      {
        firstName: '민수',
        lastName: '김',
        email: 'kim.minsu@example.com',
        phone: '+82-10-1234-5678',
        jobTitle: 'CEO',
        source: 'Website',
        status: 'NEW',
      },
      {
        firstName: '지영',
        lastName: '박',
        email: 'park.jiyoung@techcorp.com',
        phone: '+82-10-9876-5432',
        jobTitle: '마케팅 디렉터',
        source: 'LinkedIn',
        status: 'QUALIFIED',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@globalinc.com',
        phone: '+1-555-0199',
        jobTitle: 'VP of Marketing',
        source: 'Conference',
        status: 'CONTACTED',
      },
    ],
  });

  console.log('✅ Created 3 leads');

  // Create Email Campaigns
  await prisma.emailCampaign.createMany({
    data: [
      {
        subject: '플랫폼에 오신 것을 환영합니다',
        content: '가입해 주셔서 감사합니다! 시작하는 데 도움이 되는 리소스를 준비했습니다...',
        fromEmail: 'welcome@example.com',
        fromName: '환영 팀',
        status: 'DRAFT',
        recipientCount: 150,
      },
      {
        subject: '12월 뉴스레터',
        content: '이번 달의 주요 업데이트와 마케팅 팁을 확인하세요!',
        fromEmail: 'newsletter@example.com',
        fromName: '마케팅 팀',
        status: 'SENT',
        recipientCount: 1250,
        openedCount: 450,
        clickedCount: 120,
        sentAt: new Date('2025-12-01T09:00:00Z'),
      },
    ],
  });

  console.log('✅ Created 2 email campaigns');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((error) => {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
