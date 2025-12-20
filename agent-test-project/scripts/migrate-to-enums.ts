import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Normalizing data for enum migration...');

  try {
    // Check if database exists and has data
    const leadCount = await prisma.lead.count();
    const postCount = await prisma.socialPost.count();

    console.log(`📊 Found ${leadCount} leads and ${postCount} social posts`);

    if (leadCount > 0) {
      console.log('🔧 Normalizing Lead status...');
      const leads = await prisma.lead.findMany();

      for (const lead of leads) {
        if (lead.status) {
          const normalizedStatus = lead.status.toUpperCase();
          await prisma.lead.update({
            where: { id: lead.id },
            data: { status: normalizedStatus as any }
          });
        }
      }
      console.log(`✅ Normalized ${leads.length} lead statuses`);
    }

    if (postCount > 0) {
      console.log('🔧 Normalizing SocialPost status and platform...');
      const posts = await prisma.socialPost.findMany();

      for (const post of posts) {
        let normalizedStatus = post.status;
        let normalizedPlatform = post.platform;

        if (post.status) {
          normalizedStatus = post.status.toUpperCase();
          // 'ERROR' -> 'FAILED' 변환
          if (normalizedStatus === 'ERROR') {
            normalizedStatus = 'FAILED';
          }
        }

        if (post.platform) {
          normalizedPlatform = post.platform.toUpperCase();
        }

        await prisma.socialPost.update({
          where: { id: post.id },
          data: {
            status: normalizedStatus as any,
            platform: normalizedPlatform as any
          }
        });
      }
      console.log(`✅ Normalized ${posts.length} social post statuses and platforms`);
    }

    // Normalize EmailCampaign status if exists
    const emailCampaignCount = await prisma.emailCampaign.count();
    if (emailCampaignCount > 0) {
      console.log('🔧 Normalizing EmailCampaign status...');
      const campaigns = await prisma.emailCampaign.findMany();

      for (const campaign of campaigns) {
        if (campaign.status) {
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { status: campaign.status.toUpperCase() as any }
          });
        }
      }
      console.log(`✅ Normalized ${campaigns.length} email campaign statuses`);
    }

    console.log('✅ Data normalized successfully');
  } catch (error) {
    console.error('❌ Error during normalization:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
