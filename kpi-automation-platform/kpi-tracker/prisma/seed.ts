import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. 비즈니스 라인 생성
  const outsource = await prisma.businessLine.upsert({
    where: { name: '외주' },
    update: {},
    create: {
      name: '외주',
      description: '아웃소싱 서비스',
      landingUrl: 'https://example.com/outsource',
      revenueGoal: 10000000,
    },
  });

  const b2b = await prisma.businessLine.upsert({
    where: { name: 'B2B' },
    update: {},
    create: {
      name: 'B2B',
      description: '컨설팅 기업 대상',
      landingUrl: 'https://example.com/b2b',
      revenueGoal: 10000000,
    },
  });

  const anyon = await prisma.businessLine.upsert({
    where: { name: 'ANYON' },
    update: {},
    create: {
      name: 'ANYON',
      description: 'B2C 프로덕트',
      landingUrl: 'https://example.com/anyon',
      revenueGoal: 10000000,
    },
  });

  console.log('✅ Business Lines created');

  // 2. 플랫폼 생성
  const platforms = [
    { name: 'LinkedIn', type: 'SNS', hasApi: true, color: '#0077B5' },
    { name: 'Facebook', type: 'SNS', hasApi: true, color: '#1877F2' },
    { name: 'Instagram', type: 'SNS', hasApi: true, color: '#E4405F' },
    { name: 'YouTube', type: 'SNS', hasApi: true, color: '#FF0000' },
    { name: 'TikTok', type: 'SNS', hasApi: true, color: '#000000' },
    { name: 'Threads', type: 'SNS', hasApi: true, color: '#000000' },
    { name: 'Reddit', type: 'SNS', hasApi: true, color: '#FF4500' },
    { name: '카카오 오픈톡방', type: 'SNS', hasApi: false, color: '#FEE500' },
    { name: '네이버 밴드', type: 'SNS', hasApi: false, color: '#00C73C' },
    { name: '보배드림', type: 'OTHER', hasApi: false, color: '#0066CC' },
    { name: '위시캣', type: 'MARKETPLACE', hasApi: false, color: '#FF6B00' },
    { name: '크몽', type: 'MARKETPLACE', hasApi: false, color: '#FF6600' },
    { name: 'Email', type: 'EMAIL', hasApi: true, color: '#EA4335' },
  ];

  for (const platform of platforms) {
    await prisma.platform.upsert({
      where: { name: platform.name },
      update: {},
      create: platform as any,
    });
  }

  console.log('✅ Platforms created');

  // 3. 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@kpi-tracker.com' },
    update: {},
    create: {
      email: 'admin@kpi-tracker.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created (admin@kpi-tracker.com / admin123)');

  // 4. 샘플 데이터 (선택적)
  if (process.env.SEED_SAMPLE_DATA === 'true') {
    console.log('🎲 Creating sample data...');

    const user = await prisma.user.findUnique({
      where: { email: 'admin@kpi-tracker.com' },
    });

    const linkedIn = await prisma.platform.findUnique({
      where: { name: 'LinkedIn' },
    });

    if (user && linkedIn) {
      // 샘플 포스트
      await prisma.post.create({
        data: {
          platformId: linkedIn.id,
          businessLineId: outsource.id,
          userId: user.id,
          content: '샘플 포스트입니다.',
          publishedAt: new Date(),
          views: 120,
          likes: 15,
          comments: 3,
        },
      });

      // 샘플 리드
      await prisma.lead.create({
        data: {
          businessLineId: b2b.id,
          userId: user.id,
          name: '홍길동',
          email: 'hong@example.com',
          phone: '010-1234-5678',
          company: 'ABC 주식회사',
          industry: 'IT',
          source: 'linkedin',
          status: 'NEW',
        },
      });

      console.log('✅ Sample data created');
    }
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
