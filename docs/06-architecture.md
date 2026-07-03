# Phase 6 — 아키텍처

## 기술 스택 확정

### 프론트엔드
- **프레임워크**: Next.js 14+ (App Router)
  - 이유: React의 장점 + 서버 컴포넌트 + API 라우트 + 자동 최적화
  - SSR 가능 (SEO), Static Export 지원
- **언어**: TypeScript (no-any)
- **상태 관리**: Zustand
  - 이유: 경량(2KB), 미들웨어 지원, 직관적 API
- **UI**: Tailwind CSS
  - 이유: 유틸리티 중심, 빠른 프로토타이핑, 다크모드 기본 지원
- **컴포넌트 라이브러리**: shadcn/ui (선택)
  - 이유: 복사-붙여넣기 방식, 완전 커스텀 가능
- **차트**: Recharts
  - 이유: React 네이티브, 반응형, 접근성 좋음
- **HTTP 클라이언트**: @supabase/supabase-js
  - 이유: Supabase 공식 라이브러리, 자동 타입 생성
- **폼**: React Hook Form
  - 이유: 경량, 성능 좋음, Zod와 통합 가능
- **검증**: Zod
  - 이유: TypeScript 네이티브, 런타임 검증

### 백엔드
- **호스팅**: Vercel
  - 이유: Next.js 최적 호스팅, 자동 배포, 환경 변수 관리 쉬움
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **실시간**: Supabase Realtime

### 개발 도구
- **패키지 관리**: pnpm
- **버전 관리**: Git + GitHub
- **테스트**: Jest + React Testing Library
- **린팅**: ESLint + Prettier
- **빌드**: Next.js 기본 빌드 (esbuild)

---

## 폴더 구조

\\\
newtodo/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 홈 페이지
│   ├── (auth)/
│   │   ├── signup/page.tsx        # 회원가입
│   │   ├── login/page.tsx         # 로그인
│   │   └── layout.tsx             # 인증 레이아웃
│   ├── (app)/
│   │   ├── home/page.tsx          # 메인 가계부
│   │   ├── monthly/page.tsx       # 월간 통계
│   │   ├── settings/page.tsx      # 설정
│   │   └── layout.tsx             # 앱 레이아웃
│   ├── api/
│   │   ├── transactions/route.ts  # 거래 API
│   │   ├── goals/route.ts         # 목표 API
│   │   ├── share/route.ts         # 공유 API
│   │   └── auth/route.ts          # 인증 API
│   └── middleware.ts              # 인증 미들웨어
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── features/
│   │   ├── TransactionForm.tsx    # 거래 입력 폼
│   │   ├── CategoryCard.tsx       # 카테고리 카드
│   │   ├── ProgressCircle.tsx     # 진행률 원형
│   │   ├── TransactionList.tsx    # 거래 목록
│   │   └── StatsChart.tsx         # 통계 차트
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   └── common/
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── supabase.ts                # Supabase 클라이언트
│   ├── auth.ts                    # 인증 유틸리티
│   ├── api.ts                     # API 호출 함수
│   └── utils.ts                   # 유틸리티 함수
├── store/
│   ├── authStore.ts               # Zustand 인증 스토어
│   ├── transactionStore.ts        # Zustand 거래 스토어
│   ├── goalStore.ts               # Zustand 목표 스토어
│   └── uiStore.ts                 # Zustand UI 상태 스토어
├── types/
│   ├── database.ts                # Supabase 생성 타입
│   ├── models.ts                  # 비즈니스 모델 타입
│   └── api.ts                     # API 요청/응답 타입
├── styles/
│   ├── globals.css                # 글로벌 스타일
│   └── variables.css              # CSS 변수 (컬러, 폰트)
├── hooks/
│   ├── useAuth.ts                 # 인증 훅
│   ├── useTransactions.ts         # 거래 데이터 훅
│   ├── useGoals.ts                # 목표 데이터 훅
│   └── useRealtime.ts             # Realtime 구독 훅
├── public/
│   └── icons/                     # 이모지, 아이콘
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local                     # 로컬 환경 변수 (커밋 X)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
\\\

---

## 데이터 흐름 & 상태 관리 (Zustand)

### Zustand 스토어 구조

\\\	ypescript
// store/authStore.ts
import create from 'zustand'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const user = await authService.login(email, password)
      set({ user, error: null })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },
  // ... 더 많은 액션
}))

// 사용 예
function LoginPage() {
  const { login, isLoading } = useAuthStore()
  // ...
}
\\\

### 전역 상태 구조

\\\
AuthStore
  - user (User | null)
  - isAuthenticated (boolean)
  - isLoading (boolean)
  - error (string | null)

TransactionStore
  - transactions (Transaction[])
  - selectedMonth (Date)
  - filter (CategoryFilter)
  - isLoading (boolean)
  - add/update/delete 액션

GoalStore
  - goals (DailyGoal[])
  - selectedDate (Date)
  - isLoading (boolean)
  - set/update 액션

UIStore
  - isModalOpen (boolean)
  - activeTab (string)
  - theme (dark | light)
  - openModal/closeModal 액션
\\\

---

## 컴포넌트 구조

### 페이지 레이아웃
\\\
RootLayout
├── Header
├── Navigation
└── PageContent
    ├── HomePage
    │   ├── ProgressCircle
    │   ├── CategoryCards (각각 CategoryCard)
    │   ├── FAB (+ 버튼)
    │   └── TransactionModal
    ├── MonthlyPage
    │   ├── StatsCard
    │   ├── StatsChart
    │   └── CategoryBreakdown
    └── SettingsPage
        ├── AccountSettings
        ├── GoalSettings
        └── SharedAccountSettings
\\\

---

## 타입 정의 (TypeScript)

\\\	ypescript
// types/models.ts

export type User = {
  id: string
  email: string
  createdAt: Date
}

export type Transaction = {
  id: string
  accountId: string
  userId: string
  date: Date
  amount: number
  type: 'income' | 'expense'
  category: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type DailyGoal = {
  id: string
  accountId: string
  date: Date
  totalBudget?: number
  categoryBudgets?: Record<string, number>
  categoryCountGoals?: Record<string, { target: number; frequency: 'daily' | 'weekly' }>
  createdAt: Date
  updatedAt: Date
}

export type Account = {
  id: string
  ownerId: string
  name: string
  isShared: boolean
  createdAt: Date
}

export type SharedMember = {
  id: string
  accountId: string
  userId: string
  role: 'owner' | 'member'
  joinedAt: Date
}

export type SharedKey = {
  id: string
  accountId: string
  code: string
  createdBy: string
  expiresAt: Date
  isActive: boolean
  createdAt: Date
}
\\\

---

## API 라우트 구조

### Next.js API 라우트 (선택사항)
\\\
app/api/
├── transactions/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── goals/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (PUT)
├── share/
│   ├── generate-code/route.ts (POST)
│   └── join/route.ts (POST)
└── auth/
    ├── login/route.ts
    ├── signup/route.ts
    └── logout/route.ts
\\\

### Supabase 클라이언트 직접 호출
\\\	ypescript
// 대부분의 API는 클라이언트에서 직접 Supabase 호출
// RLS(Row Level Security)로 보안 보장

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(URL, KEY)

// 거래 조회
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('account_id', accountId)
  .gte('date', startDate)
  .lte('date', endDate)
\\\

---

## 인증 흐름

\\\
사용자 입력 (이메일/비밀번호)
  ↓
Supabase Auth (이메일 인증/비밀번호 검증)
  ↓
JWT 토큰 발급 (localStorage 저장)
  ↓
AuthStore에 user 저장
  ↓
middleware.ts에서 인증 확인
  ↓
보호된 페이지 접근 가능
\\\

---

## 실시간 동기화 (Supabase Realtime)

\\\	ypescript
// hooks/useRealtime.ts

export function useRealtimeTransactions(accountId: string) {
  const { addTransaction, updateTransaction } = useTransactionStore()

  useEffect(() => {
    const subscription = supabase
      .from('transactions')
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          addTransaction(payload.new)
        } else if (payload.eventType === 'UPDATE') {
          updateTransaction(payload.new)
        }
      })
      .eq('account_id', accountId)
      .subscribe()

    return () => supabase.removeSubscription(subscription)
  }, [accountId])
}
\\\

---

## 성능 최적화

### 번들 최적화
- Next.js 자동 코드 스플리팅
- Dynamic import for modals/heavy components
- Image 컴포넌트로 이미지 최적화

### 데이터베이스 최적화
- Supabase 인덱스 (date, account_id, user_id)
- 페이지네이션 (거래 목록)
- 캐싱 전략 (월간 데이터는 재검색 최소화)

### 렌더링 최적화
- React 메모이제이션 (CategoryCard 등)
- Zustand 선택적 구독
- 필요한 부분만 재렌더링

---

## 배포 전략

### 개발
\\\
pnpm dev
→ http://localhost:3000
→ 핫 리로드 지원
\\\

### 프로덕션
\\\
GitHub에 push
  ↓
Vercel 자동 배포
  ↓
프리뷰 배포 (PR)
  ↓
메인 브랜치 → 프로덕션 배포
\\\

### 환경 변수
\\\
.env.local (커밋 X)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
\\\

---

## 다음 단계

1. **Phase 7 (계획)**: 마일스톤별 구현 작업 리스트
2. **구현 시작**: M1부터 M7까지 단계별 진행

