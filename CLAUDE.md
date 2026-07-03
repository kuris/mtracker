# CLAUDE.md

Claude Code(claude.ai/code)가 이 저장소의 코드를 작업할 때 참고할 가이드입니다.

## 프로젝트 개요

**가계부 앱** — Next.js 14, TypeScript, Supabase로 만든 실시간 동기화 가계부 관리 애플리케이션. 사용자는 일일 지출을 추적하고, 예산을 설정하고, 배우자와 예산을 공유할 수 있습니다.

**기술 스택:**
- **프레임워크:** Next.js 14 (App Router)
- **언어:** TypeScript (strict mode)
- **상태 관리:** Zustand (여러 도메인 스토어)
- **백엔드:** Supabase (PostgreSQL, Auth, Realtime)
- **UI:** React 18, Tailwind CSS, React Hook Form + Zod, Recharts
- **빌드:** Next.js esbuild, ESLint, TypeScript

## 자주 사용하는 개발 명령어

```bash
# 의존성 설치 (React 19 & Next.js 14 호환성을 위해 --legacy-peer-deps 사용)
npm install --legacy-peer-deps

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 타입 체크
npm run type-check

# 린팅
npm run lint

# 프로덕션 빌드
npm run build
npm start
```

## 높은 수준의 아키텍처

### 상태 관리 (Zustand 스토어)

앱은 `/store` 디렉토리에 여러 개의 도메인별 Zustand 스토어를 사용합니다:

- **`authStore.ts`** — 사용자 인증(로그인, 회원가입, 로그아웃) 및 Supabase Auth를 통한 세션 관리
- **`transactionStore.ts`** — 거래 CRUD, Supabase `transactions` 테이블에서 데이터 가져오기, 일간/주간/카테고리별 합계 계산
- **`weeklyGoalStore.ts`** — 주간 예산 목표(목표 금액 및 진행률 추적)
- **`uiStore.ts`** — UI 상태(모달 표시 여부, 폼 상태)
- **`themeStore.ts`** — 테마 설정(밝음/어두움 모드, localStorage에 저장)
- **`goalStore.ts`** — 일일 목표 추적

각 스토어는 **`RootClient`** 컴포넌트(`app/RootClient.tsx`)를 통해 초기화되며, 이는 마운트 시 인증을 수화하고 데이터를 로드합니다. 이렇게 하면 페이지 렌더링 전에 앱이 준비됩니다.

### 페이지 구조 (Next.js App Router)

```
app/
├── page.tsx                  # 홈 (일일 예산, 진행률 원형 그래프, 카테고리별 분석)
├── layout.tsx                # 루트 레이아웃 (Header, Navigation, TransactionModal, 테마 스크립트)
├── RootClient.tsx            # 클라이언트측 초기화 (인증, 데이터 로딩)
├── (auth)/
│   ├── layout.tsx            # 인증 그룹 레이아웃
│   ├── login/page.tsx        # 로그인 페이지
│   └── signup/page.tsx       # 회원가입 페이지
├── monthly/page.tsx          # 월간 통계 (차트, 카테고리별 분석)
├── settings/page.tsx         # 계정 및 공유 설정
├── income/page.tsx           # 수입 추적
└── expenses/page.tsx         # 지출 추적
```

### 컴포넌트 구조

```
components/
├── layout/
│   ├── Header.tsx            # 그라데이션 배경의 상단 바
│   └── Navigation.tsx        # 사이드/하단 네비게이션
├── features/
│   └── TransactionModal.tsx  # FAB 버튼 + 거래 추가/편집 모달
└── ui/
    └── ThemeToggle.tsx       # 다크 모드 토글
```

### Supabase 연동

- **클라이언트 설정:** `lib/supabase.ts`는 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 사용하여 Supabase 클라이언트를 생성합니다
- **인증 흐름:** Supabase Auth(이메일/비밀번호) → 브라우저에 세션 저장 → `RootClient`의 앱 초기화 시 확인
- **데이터:** 거래는 `transactions` 테이블에 저장 (RLS를 통한 사용자별 범위 지정)
- **실시간:** 아직 통합되지 않음; 앱은 현재 초기화 시 데이터를 한 번만 로드

### 스타일링 및 디자인

- **Tailwind CSS** 커스텀 색상 (코랄 핑크: `#ff6b6b`, 연한 핑크: `#ff8a80`, 따뜻한 크림색 배경: `#fff5f3`)
- **테마 지원:** `prefers-color-scheme` 미디어 쿼리를 통한 다크 모드 감지 + localStorage 지속성 (ThemeToggle로 전환)
- **반응형:** 모바일 우선, `lg:` 브레이크포인트에서 레이아웃 조정 (예: `flex-col lg:flex-row`)
- **아이콘/이모지:** 카테고리(☕ 커피, 🍽️ 식사, 🚕 이동 등)와 상태 메시지에 광범위하게 사용

## 데이터 흐름

1. **앱 로드 시:** `RootClient`가 `initializeAuth()` 호출 → Supabase 세션 확인
2. **인증된 경우:** `loadTransactions()`과 `loadCurrentWeekGoal()` 트리거
3. **거래 CRUD:** 폼이 `transactionStore`로 전달 → 스토어가 Supabase와 동기화 → 로컬 캐시 업데이트
4. **UI 상태:** `uiStore`(모달 열기/닫기)가 폼 표시 여부 제어
5. **계산된 값:** 스토어는 뷰를 위한 `getDailyTotal()`, `getTotalByCategory()`, `getWeeklyTotal()` 등의 메서드 내보냄

## 핵심 패턴

### 폼 처리
- **React Hook Form + Zod:** 로그인, 회원가입, 거래 폼에서 사용
- 패턴: Zod 스키마 정의 → `useForm()` 훅 사용 → 제출 시 검증 → 스토어로 전달

### TypeScript 인터페이스
- 스토어는 상태 형태 정의 (예: `TransactionState`, `AuthStore`)
- 핵심 엔티티는 `/types/*` 또는 인라인 (예: `Transaction`, `User` 인터페이스)

### 클라이언트/서버 분할
- **서버:** 메타데이터, 정적 레이아웃을 위한 `RootLayout`
- **클라이언트:** `RootClient`, 모든 스토어 (Zustand는 클라이언트 전용), 인터랙티브 페이지
- 클라이언트 컴포넌트에 `'use client'` pragma 표시

### 환경 변수
- `.env.local`에 포함되어야 할 항목:
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 익명 키
- `NEXT_PUBLIC_` 접두사를 붙여야 브라우저에서 접근 가능; `lib/supabase.ts`의 초기화 시 확인

## 테스트 및 검증

- **타입 체크:** `npm run type-check` (strict mode의 TypeScript)
- **린팅:** `npm run lint` (ESLint + Next.js 설정)
- **수동 테스트:** `npm run dev` 후 `http://localhost:3000` 접속
- 아직 자동화된 테스트 스위트가 구성되지 않음

## 배포 참고사항

- **Vercel 준비 완료:** 표준 설정의 Next.js 앱, Vercel CLI 또는 Git 통합으로 배포 가능
- **환경 설정:** Supabase 키를 Vercel 환경 변수로 설정해야 함
- **데이터베이스:** Supabase PostgreSQL 스키마가 존재해야 함 (자세한 내용은 `README.md` 로드맵 참조; 현재는 로컬 Zustand만 사용)

## 알려진 한계 및 향후 작업

- **데이터 지속성:** 현재 인메모리 Zustand 스토어 사용; 페이지 새로고침 시 데이터 초기화
- **실시간 동기화:** 아직 탭/기기 간 실시간 업데이트 없음 (로드맵: Supabase Realtime)
- **인증:** Supabase Auth 통합되었으나 데이터 스키마 아직 확정 안 됨
- **RLS:** Supabase 테이블에서 Row-Level Security 규칙 아직 구성 안 됨
- **오프라인:** 오프라인 지원 없음; 모든 기능이 네트워크 접근 필요

자세한 로드맵은 `README.md` 참조 (v2 기능: CSV 내보내기/가져오기, 고급 필터, 3명 이상 공유 등).
