# 가계부 (Household Budget App)

부부가 함께 관리하는 실시간 동기화 가계부 앱 ❤️

## 🚀 기능

### M1: 기본 레이아웃
- ✅ 코랄 핑크 디자인
- ✅ 헤더 + 네비게이션
- ✅ 반응형 UI

### M2: 인증
- ✅ 로그인 페이지
- ✅ 회원가입 페이지
- ✅ 폼 검증 (이메일, 비밀번호)

### M3: 거래 입력 & 목록
- ✅ FAB 버튼 + 모달
- ✅ 금액 + 카테고리 + 설명 입력
- ✅ 카테고리별 금액 자동 계산
- ✅ 거래 목록 표시

### M4: 목표 기능
- ✅ GoalStore 구현
- ✅ 일일 목표 설정

### M5: 날씨 표시 + 실시간 업데이트
- ✅ 진행률별 상태 메시지 (❄️ 🌤️ ☀️ 🔥)
- ✅ 실시간 진행률 업데이트

### M6: 월간 통계
- ✅ Recharts 원형 차트
- ✅ 카테고리별 지출 분석
- ✅ 월 네비게이션

### M7: 공유 기능
- ✅ 공유 코드 생성
- ✅ 배우자 계정 연결 UI
- ✅ 계정 정보 페이지

### M8: QA & 배포
- ✅ 전체 플로우 테스트
- ✅ 최종 정리 및 문서화

## 📋 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19 + Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### 데이터 관리
- **Local State**: Zustand (로컬 기반)
- **추후**: Supabase PostgreSQL + Auth + Realtime

### 개발 도구
- **Package Manager**: npm (--legacy-peer-deps)
- **Build**: Next.js esbuild
- **Linting**: ESLint + Prettier

## 🛠️ 설치 & 실행

### 사전 요구사항
- Node.js 18+
- npm 또는 pnpm

### 설치

```bash
# 프로젝트 디렉토리로 이동
cd newtodo

# 의존성 설치 (React 19 & Next.js 14 호환성)
npm install --legacy-peer-deps
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 📱 주요 페이지

| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈 | `/` | 오늘의 거래 & 진행률 |
| 로그인 | `/login` | 이메일/비밀번호 로그인 |
| 회원가입 | `/signup` | 신규 계정 생성 |
| 월간 통계 | `/monthly` | 차트 & 카테고리별 분석 |
| 설정 | `/settings` | 공유 코드 & 계정 정보 |

## 🎨 디자인 시스템

### 색상
- **Primary**: `#ff6b6b` (코랄 핑크)
- **Primary Light**: `#ff8a80` (연한 핑크)
- **Background**: `#fff5f3` (따뜻한 크림)
- **Text**: `#333333` (어두운 회색)

### 컴포넌트
- Header: 코랄 그라데이션 배경
- Navigation: 화이트 사이드바
- Cards: 흰색 배경 + 부드러운 그림자
- Buttons: 코랄 그라데이션 + 호버 효과

## 🧪 테스트 계정

```
이메일: demo@example.com
비밀번호: demo123
```

> 현재는 로컬 Zustand 기반이므로 실제 인증이 아닙니다.

## 📊 데이터 구조

### Transaction (거래)
```typescript
{
  id: string
  amount: number
  category: string (coffee, food, transport, shopping, ...)
  description?: string
  date: Date
}
```

### DailyGoal (일일 목표)
```typescript
{
  id: string
  date: Date
  dailyBudget: number
  categoryGoals: Record<string, { target: number; type: 'amount' | 'count' }>
  categoryCounts: Record<string, number>
}
```

## 🗺️ 로드맵 (v2 이후)

- [ ] Supabase 연동 (PostgreSQL)
- [ ] Supabase Auth 통합
- [ ] Realtime 동기화
- [ ] CSV 내보내기/가져오기
- [ ] 거래 검색 & 필터
- [ ] 커스텀 카테고리
- [ ] 복잡한 통계 분석
- [ ] 3명 이상 공유
- [ ] 소셜 로그인
- [ ] 다크모드 전환

## 📝 개발 노트

### 현재 상태
- **버전**: v1.0.0 (로컬 MVP)
- **상태**: 개발 완료
- **테스트**: 수동 테스트 완료

### 알려진 한계
- 로컬 Zustand 상태만 사용 (새로고침 시 데이터 초기화)
- 실시간 동기화 없음 (추후 Supabase Realtime으로 구현)
- 데이터 영속성 없음 (로컬스토리지 미적용)

### 다음 단계
1. Supabase 프로젝트 생성
2. Database 스키마 설계
3. RLS 정책 구성
4. API 라우트 작성
5. Realtime 구독 구현
6. 인증 시스템 연동

## 🤝 기여

이 프로젝트는 개인 학습 목적입니다.

## 📄 라이선스

MIT

---

**만든이**: 사용자
**최종 업데이트**: 2026년 7월 3일
