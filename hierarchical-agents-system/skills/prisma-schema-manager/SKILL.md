---
name: prisma-schema-manager
description: Database schema design and Prisma management expert. Use for schema design, migrations, and database architecture decisions.
---

# Prisma Schema Manager Skill

Database schema design and management skill for Prisma ORM.

## Purpose

Provide expertise in designing and managing Prisma schemas, including:
- Data modeling best practices
- Relation configuration
- Index optimization
- Migration strategies
- Schema evolution

## When to Use

- Designing new database models
- Adding fields to existing models
- Creating relationships between models
- Optimizing database queries with indexes
- Planning schema migrations
- Evolving database structure

## Key Responsibilities

### 1. Data Modeling
- Design normalized database schemas
- Choose appropriate data types
- Define required vs optional fields
- Plan default values

### 2. Relations
- Configure one-to-many relationships
- Set up many-to-many relationships
- Define cascade behaviors (onDelete, onUpdate)
- Optimize foreign key indexes

### 3. Performance
- Add strategic indexes
- Choose appropriate field types (@db.Text vs String)
- Configure unique constraints
- Plan for query patterns

### 4. Migrations
- Design safe, non-breaking migrations
- Handle data transformations
- Plan rollback procedures
- Test migration safety

## Workflow

### When Invoked:

1. **Analyze Requirements**: Understand what data needs to be stored
2. **Design Schema**: Create or modify Prisma models
3. **Validate Design**: Check for common issues
4. **Implement**: Write schema changes
5. **Plan Migration**: Determine migration strategy

## Prisma Schema Patterns

### Pattern 1: Basic Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts Post[]

  @@map("users")  // Table name
}
```

**When to use**: Simple entities with few relations

### Pattern 2: Model with Enum

```prisma
model Lead {
  id     String     @id @default(cuid())
  status LeadStatus @default(NEW)

  @@map("leads")
}

enum LeadStatus {
  NEW
  CONTACTED
  MEETING_SCHEDULED
  WON
  LOST
}
```

**When to use**: Fixed set of values (status, types, plans)

### Pattern 3: Many-to-One Relation

```prisma
model Post {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])  // Index foreign key
  @@map("posts")
}

model User {
  id    String @id
  posts Post[]  // Reverse relation
}
```

**When to use**: Entity belongs to another (Post belongs to User)

### Pattern 4: Optional Relation

```prisma
model Lead {
  id     String  @id
  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
}
```

**When to use**: Relation may not exist (lead may not be assigned)

### Pattern 5: Self-Referencing Relation

```prisma
model Category {
  id       String     @id
  parentId String?
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
}
```

**When to use**: Hierarchical data (categories, organizational structure)

### Pattern 6: Composite Unique Constraint

```prisma
model UserPlatform {
  userId     String
  platformId String

  user     User     @relation(fields: [userId], references: [id])
  platform Platform @relation(fields: [platformId], references: [id])

  @@unique([userId, platformId])  // One connection per user-platform pair
  @@index([userId])
  @@index([platformId])
}
```

**When to use**: Prevent duplicate combinations

### Pattern 7: Analytics/Metrics Model

```prisma
model Post {
  id String @id

  // Analytics fields
  views        Int       @default(0)
  likes        Int       @default(0)
  comments     Int       @default(0)
  shares       Int       @default(0)
  lastSyncedAt DateTime? // Track when analytics were last updated

  @@index([lastSyncedAt])  // For finding stale data
}
```

**When to use**: Tracking metrics that update periodically

## Field Type Selection

### String Types

```prisma
model Post {
  title   String          // Short text (VARCHAR 191)
  content String @db.Text // Long text (TEXT)
}
```

- **String**: Default for short text (max 191 chars for MySQL)
- **String @db.Text**: Long text (no length limit)

### Number Types

```prisma
model Deal {
  amount      Int      // Integer (e.g., price in cents)
  probability Int      // Percentage 0-100
  discount    Float?   // Decimal values
}
```

- **Int**: Whole numbers (ID, counts, amounts in smallest unit)
- **Float**: Decimal numbers (percentages, ratios)
- **Decimal**: High precision (financial calculations)

### Date Types

```prisma
model Event {
  scheduledAt DateTime           // Specific date/time
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- **DateTime**: Timestamps, scheduled times, dates

### Boolean

```prisma
model Meeting {
  completed Boolean @default(false)
}
```

- **Boolean**: Yes/no, true/false states

### Optional vs Required

```prisma
model Lead {
  name    String    // Required
  email   String    // Required
  phone   String?   // Optional
  notes   String?   // Optional
}
```

- No `?`: Required field
- With `?`: Optional field (nullable)

## Index Strategy

### When to Add Indexes

1. **Foreign Keys**: Always index
   ```prisma
   model Post {
     userId String
     user   User   @relation(fields: [userId], references: [id])

     @@index([userId])  // ✅ Index foreign key
   }
   ```

2. **Frequently Queried Fields**:
   ```prisma
   model Post {
     publishedAt DateTime?

     @@index([publishedAt])  // ✅ If you often query by date
   }
   ```

3. **Unique Constraints**:
   ```prisma
   model User {
     email String @unique  // ✅ Automatically indexed
   }
   ```

4. **Composite Queries**:
   ```prisma
   model Post {
     businessLineId String
     publishedAt    DateTime?

     @@index([businessLineId, publishedAt])  // ✅ For filtering by both
   }
   ```

### When NOT to Index

- Fields rarely queried
- Very frequently updated fields
- Small tables (< 1000 rows)
- Boolean fields with even distribution

## Cascade Behaviors

### onDelete Options

```prisma
model Post {
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  //                                                            ^^^^^^^^
}
```

- **Cascade**: Delete posts when user is deleted (common for ownership)
- **SetNull**: Set userId to null (requires String? field)
- **Restrict**: Prevent deleting user if posts exist (default)
- **NoAction**: Similar to Restrict

### onUpdate Options

```prisma
model Post {
  userId String
  user   User   @relation(fields: [userId], references: [id], onUpdate: Cascade)
  //                                                            ^^^^^^^^
}
```

- **Cascade**: Update foreign key if referenced id changes (usually default)
- **Restrict**: Prevent updating id if references exist

## Migration Strategies

### Safe Migrations (Non-Breaking)

✅ **Add optional field**:
```prisma
model Lead {
  industry String?  // ✅ Optional - safe to add
}
```

✅ **Add new model**:
```prisma
model Subscription {  // ✅ New table - safe
  id String @id
}
```

✅ **Add index**:
```prisma
model Lead {
  @@index([email])  // ✅ Safe, improves performance
}
```

### Risky Migrations (Breaking)

⚠️ **Make field required**:
```prisma
model Lead {
  industry String  // ⚠️ Risky if table has data
  // Need: Add with default OR set all existing values first
}
```

⚠️ **Remove field**:
```prisma
// Removed: phone field
// ⚠️ Data loss - make sure it's archived if needed
```

⚠️ **Change field type**:
```prisma
model Deal {
  amount Decimal  // Changed from Int
  // ⚠️ Requires data transformation
}
```

### Migration Workflow

1. **Design Change**: Update schema
2. **Generate Migration**: `prisma migrate dev`
3. **Review SQL**: Check migration file
4. **Test in Dev**: Apply and test
5. **Test Rollback**: Reset and replay
6. **Deploy**: `prisma migrate deploy` in production

## Common Patterns for KPI Platform

### Business Line Segmentation

```prisma
model BusinessLine {
  id   String @id
  name String @unique  // "외주", "B2B", "ANYON"

  posts          Post[]
  leads          Lead[]
  deals          Deal[]
  emailCampaigns EmailCampaign[]
}

// All trackable entities reference business line
model Post {
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id])
}
```

### UTM Tracking

```prisma
model LandingVisit {
  id String @id

  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmContent  String?

  visitedAt DateTime @default(now())

  @@index([utmSource])
  @@index([utmCampaign])
}
```

### Status Progression

```prisma
enum LeadStatus {
  NEW
  CONTACTED
  MEETING_SCHEDULED
  MEETING_COMPLETED
  PROPOSAL_SENT
  WON
  LOST
}

model Lead {
  status LeadStatus @default(NEW)

  @@index([status])  // For filtering by status
}
```

### External Platform Integration

```prisma
model Post {
  externalId  String?  // LinkedIn post ID, Facebook post ID, etc.
  publishedAt DateTime?

  // Track when we last synced data from platform
  lastSyncedAt DateTime?

  @@index([externalId])
  @@index([lastSyncedAt])
}
```

## Best Practices

1. **Use cuid() for IDs**: More random than uuid, good for distributed systems
2. **Always @map tables**: Use snake_case for table names
3. **Index foreign keys**: Always for performance
4. **Optional by default**: Make fields optional unless strictly required
5. **Add timestamps**: createdAt and updatedAt on all models
6. **Use enums**: For fixed sets of values (status, types, plans)
7. **Plan cascades**: Decide what happens when parent is deleted
8. **Test migrations**: Always test in dev before production

## Anti-Patterns

❌ **Over-indexing**: Don't index everything
❌ **Missing cascade**: Not specifying onDelete behavior
❌ **No timestamps**: Missing createdAt/updatedAt
❌ **Required fields**: Making everything required (inflexible)
❌ **Unclear naming**: Abbreviated or cryptic field names
❌ **No map**: Using PascalCase table names instead of snake_case

## References

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## Related Skills

- database-engineer: For executing migrations
- code-analyzer: For finding Prisma query patterns
- api-endpoint-builder: For CRUD operations on models
