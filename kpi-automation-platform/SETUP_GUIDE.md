# KPI 자동화 플랫폼 설정 가이드

## 1. 환경 변수 설정

### 필수 설정

#### Postiz API (SNS 포스팅)
```bash
POSTIZ_API_URL=http://localhost:5000
POSTIZ_API_KEY=your_postiz_api_key_here
```

**Postiz API Key 발급 방법:**
1. Postiz 서버 실행: `docker-compose up -d postiz`
2. http://localhost:5000 접속
3. 계정 생성 및 로그인
4. Settings > API Keys > Generate New Key
5. 생성된 키를 `.env` 파일에 추가

---

### 파일 스토리지 설정 (3가지 옵션 중 선택)

#### 옵션 1: Vercel Blob Storage (권장 - 프로덕션)

**장점:** 무료 5GB, CDN 자동 제공, 설정 간단
**단점:** Vercel 계정 필요

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**설정 방법:**
1. Vercel 프로젝트 생성: https://vercel.com
2. Storage 탭 > Blob > Create Database
3. `.env.local` 탭에서 `BLOB_READ_WRITE_TOKEN` 복사
4. 로컬 `.env` 파일에 추가

---

#### 옵션 2: Cloudinary (대안 - 이미지/비디오 최적화)

**장점:** 무료 25GB, 이미지 자동 최적화, 변환 기능
**단점:** 약간 복잡한 설정

```bash
CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@your-cloud-name
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

**설정 방법:**
1. Cloudinary 계정 생성: https://cloudinary.com/users/register_free
2. Dashboard에서 API Environment variable 복사
3. `.env` 파일에 추가

---

#### 옵션 3: 로컬 스토리지 (개발 전용)

**장점:** 설정 불필요, 즉시 사용 가능
**단점:** 프로덕션 사용 불가, 파일이 서버에 저장됨

```bash
# 환경 변수 설정 없음 - 자동으로 /public/uploads 폴더 사용
```

**자동 동작:**
- `BLOB_READ_WRITE_TOKEN`과 `CLOUDINARY_URL`이 모두 없으면 자동 활성화
- 파일은 `public/uploads/images/` 또는 `public/uploads/videos/`에 저장
- 개발 환경에서만 사용 권장

---

## 2. 패키지 설치

### Vercel Blob 사용 시
```bash
pnpm add @vercel/blob
```

### Cloudinary 사용 시
```bash
pnpm add cloudinary
```

### 로컬 스토리지 사용 시
```bash
# 추가 패키지 불필요
```

---

## 3. 실제 업로드 테스트

### 3.1 서버 실행
```bash
pnpm dev
```

### 3.2 포스트 작성 테스트
1. http://localhost:3000/posts/new 접속
2. 플랫폼 선택 (예: LinkedIn, Facebook)
3. 포스트 내용 작성
4. 이미지/비디오 업로드
5. "Publish Now" 또는 "Schedule Post" 클릭

### 3.3 확인 사항
- ✅ 파일이 선택한 스토리지에 업로드되는지 확인
- ✅ 업로드된 URL이 정상적으로 반환되는지 확인
- ✅ Postiz API 호출이 성공하는지 확인

---

## 4. Postiz 자체 호스팅 (선택사항)

Postiz를 직접 호스팅하려면:

```bash
cd ../clones
git clone https://github.com/gitroomhq/postiz-app.git
cd postiz-app
docker-compose up -d
```

또는 기존 docker-compose.yml 사용:
```bash
docker-compose up -d postiz
```

---

## 5. 문제 해결

### "POSTIZ_API_KEY is not configured" 에러
- `.env` 파일에 `POSTIZ_API_KEY` 추가
- 서버 재시작 (`pnpm dev` 재실행)

### "Failed to upload media" 에러
- 스토리지 설정 확인 (Vercel Blob 또는 Cloudinary)
- 파일 크기 확인 (최대 50MB)
- 파일 형식 확인 (이미지/비디오만 가능)

### "HTTP 401: Unauthorized" 에러
- Postiz API Key가 올바른지 확인
- Postiz 서버가 실행 중인지 확인

### 로컬 스토리지 사용 시 이미지가 안 보이는 경우
- Next.js 서버 재시작
- `public/uploads` 폴더 권한 확인

---

## 6. 프로덕션 배포

### Vercel 배포 시
1. Vercel Blob 설정 (위 옵션 1 참조)
2. Environment Variables에 모든 환경 변수 추가
3. `vercel` 명령어로 배포

```bash
vercel --prod
```

### Docker 배포 시
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 7. 다음 단계

- [ ] 실제 SNS 플랫폼 계정 연결 (Postiz 대시보드에서)
- [ ] 각 플랫폼별 OAuth 인증 완료
- [ ] 첫 포스트 발행 테스트
- [ ] 스케줄링 테스트
- [ ] Analytics 데이터 수집 확인

---

## 참고 자료

- [Postiz 문서](https://docs.postiz.com)
- [Vercel Blob 문서](https://vercel.com/docs/storage/vercel-blob)
- [Cloudinary 문서](https://cloudinary.com/documentation)
- [Next.js 환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
