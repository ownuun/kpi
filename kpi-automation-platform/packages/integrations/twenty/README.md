# @kpi/integrations-twenty

Twenty CRM 플랫폼 통합 패키지

## 기능

- **People 관리**: 연락처 생성, 수정, 삭제, 조회
- **Company 관리**: 회사 정보 관리
- **Opportunity 관리**: 거래 기회 추적
- **GraphQL API**: 유연한 쿼리 및 뮤테이션
- **일괄 작업**: 대량 데이터 처리
- **필터링 & 정렬**: 고급 검색 기능

## 설치

```bash
npm install @kpi/integrations-twenty
```

## 사용법

### 초기화

```typescript
import { TwentySDK } from '@kpi/integrations-twenty';

const twenty = new TwentySDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.twenty.com/graphql' // optional
});
```

### Person 관리

#### 생성

```typescript
const person = await twenty.createPerson({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  jobTitle: 'Software Engineer',
  companyId: 'company-id',
  city: 'San Francisco',
  country: 'USA'
});
```

#### 조회

```typescript
// 단일 조회
const person = await twenty.getPerson('person-id');

// 목록 조회
const people = await twenty.listPeople({
  limit: 20,
  offset: 0,
  orderBy: 'createdAt',
  orderDirection: 'DESC',
  filter: {
    city: 'San Francisco'
  }
});

// 검색
const results = await twenty.searchPeople('John Doe', {
  limit: 10
});
```

#### 수정

```typescript
const updated = await twenty.updatePerson('person-id', {
  jobTitle: 'Senior Software Engineer',
  phone: '+0987654321'
});
```

#### 삭제

```typescript
await twenty.deletePerson('person-id');
```

### Company 관리

#### 생성

```typescript
const company = await twenty.createCompany({
  name: 'Acme Corporation',
  domainName: 'acme.com',
  address: '123 Main St, San Francisco, CA',
  employees: 500,
  industry: 'Technology',
  linkedinUrl: 'https://linkedin.com/company/acme',
  annualRecurringRevenue: 10000000,
  idealCustomerProfile: true
});
```

#### 조회

```typescript
// 단일 조회
const company = await twenty.getCompany('company-id');

// 목록 조회
const companies = await twenty.listCompanies({
  limit: 20,
  offset: 0,
  orderBy: 'name',
  orderDirection: 'ASC',
  filter: {
    industry: 'Technology',
    idealCustomerProfile: true
  }
});

// 검색
const results = await twenty.searchCompanies('Acme', {
  limit: 10
});
```

#### 회사와 연락처 함께 조회

```typescript
const companyWithPeople = await twenty.getCompanyWithPeople('company-id');
console.log(companyWithPeople.people);
```

#### ICP 마킹

```typescript
// Ideal Customer Profile로 마킹
await twenty.markAsICP('company-id');

// ICP 마킹 해제
await twenty.unmarkAsICP('company-id');
```

### Opportunity 관리

#### 생성

```typescript
const opportunity = await twenty.createOpportunity({
  name: 'Enterprise Deal',
  amount: 100000,
  stage: 'PROPOSAL',
  probability: 75,
  closeDate: '2025-12-31',
  companyId: 'company-id',
  personId: 'person-id'
});
```

#### 스테이지 이동

```typescript
await twenty.moveOpportunityStage('opportunity-id', 'MEETING');
```

#### 거래 성공/실패

```typescript
// 거래 성공
await twenty.winOpportunity('opportunity-id');

// 거래 실패
await twenty.loseOpportunity('opportunity-id', 'Budget constraints');
```

### 일괄 작업

#### People 일괄 생성

```typescript
const result = await twenty.batchCreatePeople([
  {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com'
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com'
  }
]);

console.log('Created:', result.created);
console.log('Failed:', result.failed);
```

#### Companies 일괄 삭제

```typescript
const result = await twenty.batchDeleteCompanies([
  'company-id-1',
  'company-id-2'
]);

console.log('Deleted:', result.deleted);
console.log('Failed:', result.failed);
```

## API 레퍼런스

### Person Operations

- `createPerson(input)` - 새 연락처 생성
- `getPerson(id)` - 연락처 조회
- `updatePerson(id, input)` - 연락처 수정
- `deletePerson(id)` - 연락처 삭제
- `listPeople(params)` - 연락처 목록 조회
- `searchPeople(query, params)` - 연락처 검색
- `getPeopleByCompany(companyId, params)` - 회사별 연락처 조회
- `batchCreatePeople(inputs)` - 일괄 생성
- `batchDeletePeople(ids)` - 일괄 삭제

### Company Operations

- `createCompany(input)` - 새 회사 생성
- `getCompany(id)` - 회사 조회
- `updateCompany(id, input)` - 회사 수정
- `deleteCompany(id)` - 회사 삭제
- `listCompanies(params)` - 회사 목록 조회
- `searchCompanies(query, params)` - 회사 검색
- `getCompanyWithPeople(id)` - 회사와 연락처 함께 조회
- `getCompanyWithOpportunities(id)` - 회사와 거래 기회 함께 조회
- `batchCreateCompanies(inputs)` - 일괄 생성
- `batchDeleteCompanies(ids)` - 일괄 삭제
- `markAsICP(id)` - ICP로 마킹
- `unmarkAsICP(id)` - ICP 마킹 해제

### Opportunity Operations

- `createOpportunity(input)` - 새 거래 기회 생성
- `updateOpportunity(id, input)` - 거래 기회 수정
- `deleteOpportunity(id)` - 거래 기회 삭제
- `moveOpportunityStage(id, stage)` - 스테이지 이동
- `winOpportunity(id)` - 거래 성공 처리
- `loseOpportunity(id, reason)` - 거래 실패 처리

## 타입

```typescript
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: string;
  name: string;
  domainName?: string;
  address?: string;
  employees?: number;
  industry?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  annualRecurringRevenue?: number;
  idealCustomerProfile?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Opportunity {
  id: string;
  name: string;
  amount: number;
  stage: 'NEW' | 'SCREENING' | 'MEETING' | 'PROPOSAL' | 'CUSTOMER';
  probability: number;
  closeDate?: string;
  companyId?: string;
  personId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## GraphQL 쿼리

직접 GraphQL 쿼리를 실행할 수도 있습니다:

```typescript
import { queries } from '@kpi/integrations-twenty';

const data = await twenty.client.query(queries.GET_PERSON, {
  id: 'person-id'
});
```

## 에러 처리

```typescript
import { TwentyError } from '@kpi/integrations-twenty';

try {
  await twenty.createPerson(input);
} catch (error) {
  if (error instanceof TwentyError) {
    console.error('Twenty Error:', error.code, error.message);
    console.error('GraphQL Errors:', error.graphQLErrors);
  }
}
```

## 라이선스

MIT
