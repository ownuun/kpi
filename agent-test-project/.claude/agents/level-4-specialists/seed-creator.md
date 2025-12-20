---
name: seed-creator
description: Database Seed 전문가. 테스트 데이터, Faker, 일관성.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Seed Creator

## 🔍 Start
```typescript
await webSearch("Prisma seed best practices 2025");
await webSearch("faker.js realistic test data 2025");
await webFetch("https://www.prisma.io/docs/guides/database/seed-database", "latest patterns");
```

## 🎯 Implementation
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (development only!)
  if (process.env.NODE_ENV === 'development') {
    await prisma.post.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tag.deleteMany();
  }

  // Create tags
  const tags = await Promise.all(
    ['TypeScript', 'React', 'Prisma', 'Next.js', 'Node.js'].map((name) =>
      prisma.tag.create({ data: { name } })
    )
  );

  console.log(`✅ Created ${tags.length} tags`);

  // Create users with profiles
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          role: i === 0 ? 'ADMIN' : 'USER',
          profile: {
            create: {
              bio: faker.lorem.paragraph(),
              avatar: faker.image.avatar(),
            },
          },
        },
        include: { profile: true },
      });
      return user;
    })
  );

  console.log(`✅ Created ${users.length} users with profiles`);

  // Create posts with random tags
  const posts = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => {
        const randomTags = faker.helpers.arrayElements(
          tags,
          faker.number.int({ min: 1, max: 3 })
        );

        return prisma.post.create({
          data: {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            published: faker.datatype.boolean(),
            authorId: user.id,
            tags: {
              connect: randomTags.map((tag) => ({ id: tag.id })),
            },
          },
          include: { tags: true },
        });
      })
    )
  );

  console.log(`✅ Created ${posts.length} posts`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

## package.json
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset && prisma db seed"
  }
}
```

## Run Commands
```bash
# Seed database
npx prisma db seed

# Reset and seed
npx prisma migrate reset
```
