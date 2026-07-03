# Phase 1 — 요구사항

## 프로젝트 개요

**앱 이름**: 가계부  
**목적**: 가정용 지출/수입 관리 애플리케이션 (대외 배포용)  
**주 사용자**: 개인 사용자, 가정 내 지출을 직접 관리하는 모든 연령대  
**플랫폼**: 반응형 웹앱 (데스크톱 + 모바일)  
**기술 스택**: React + TypeScript  
**백엔드**: Supabase (PostgreSQL)  
**인증**: ID/Password 기반 이메일 가입/로그인  
**데이터 저장**: Supabase PostgreSQL (클라우드 저장)  

---

## 핵심 기능

### 1. 거래 기록 (Transaction)
- **매일 여러 거래를 즉시 기록** — 거래 발생 직후 빠르게 입력 가능
- 금액, 날짜, 카테고리, 설명 입력
- 수입/지출 구분
- 거래 수정/삭제 (자신의 거래만)

### 2. 카테고리 관리
- **고정된 카테고리 목록** 제공:
  - 지출: 식비, 교통비, 쇼핑, 의료비, 교육비, 주거비, 여가, 기타
  - 수입: 급여, 용돈, 이자, 기타
- 각 거래를 카테고리로 분류

### 3. 통계 & 차트 분석 (핵심 기능)
- **월간 지출 요약**
  - 전체 지출/수입 합계
  - 카테고리별 지출 비율 (원형 차트, 막대 그래프)
- **기간별 트렌드**
  - 최근 3개월/6개월/12개월 월별 추이
- **카테고리별 상세 분석**
  - 각 카테고리의 평균, 최대, 최소 거래액

### 4. 목표 설정 & 추적
- **일일 지출 목표 설정**
  - 전체 일일 예산 (예: 하루 50,000원 목표)
  - 카테고리별 일일 목표 (예: 식비 10,000원 미만, 커피 3잔 미만)
- **목표 진행 현황**
  - 오늘 지출액 vs 목표 진행률 (프로그레스 바)
  - 카테고리별 현황 표시
- **목표 초과 알림**
  - 카테고리 목표 초과 시 시각적 경고 (색상 변경)
  - 일일 목표 초과 시 알림

### 5. 거래 검색 & 관리
- 날짜 범위 검색
- 카테고리별 필터링
- 키워드 검색 (설명 기반)
- 거래 목록 조회 (최신순/날짜순)

### 6. 인증 & 계정 관리
- **회원가입/로그인** (이메일 + 비밀번호)
  - Supabase Auth 사용
  - 이메일 인증 (선택 사항)
- **개인 계정**: 기본 가계부 (1인 사용)
- **공유 가계부**: 부부/가족 공용 가계부
  - 공유 링크/키 기반 초대
  - 최대 2명까지 공유 (v1)

### 7. 공유 기능
- **공유 키 생성**: 앱 내에서 "공유 코드" 생성
  - 예: ABC123XYZ (6자리 코드)
  - 상대방이 이 코드로 가입 후 같은 가계부 접근
- **공유 가계부 접근권한**
  - 모든 거래 데이터 실시간 공유
  - 각자 거래 입력/수정/삭제 가능
  - 다른 사용자의 거래 수정 불가 (자신의 거래만)
- **공유 해제**: 언제든지 해제 가능

### 8. 데이터 관리
- 클라우드 저장 (Supabase)
- 자동 동기화 (실시간)
- CSV 내보내기 (향후 v2)

---

## 데이터 모델

### Supabase 테이블 스키마

**1. 사용자 (Supabase Auth 기반)**
\\\
users {
  id: UUID (PK)
  email: string (unique)
  created_at: timestamp
}
\\\

**2. 가계부 계정 (개인 또는 공유)**
\\\
accounts {
  id: UUID (PK)
  owner_id: UUID (FK → users.id)
  name: string (예: "개인", "가족 공용")
  is_shared: boolean
  created_at: timestamp
}
\\\

**3. 공유 멤버**
\\\
shared_members {
  id: UUID (PK)
  account_id: UUID (FK → accounts.id)
  user_id: UUID (FK → users.id)
  role: string ('owner' | 'member')
  joined_at: timestamp
}
\\\

**4. 공유 키**
\\\
shared_keys {
  id: UUID (PK)
  account_id: UUID (FK → accounts.id)
  code: string (6자리, unique) [예: ABC123XYZ]
  created_by: UUID (FK → users.id)
  expires_at: timestamp (7일 후 만료)
  is_active: boolean
  created_at: timestamp
}
\\\

**5. 거래**
\\\
transactions {
  id: UUID (PK)
  account_id: UUID (FK → accounts.id)
  user_id: UUID (FK → users.id, 입력한 사람)
  date: date
  amount: integer (원)
  type: enum ('income', 'expense')
  category: string
  description: text (선택)
  created_at: timestamp
  updated_at: timestamp
}
\\\

**6. 일일 목표**
\\\
daily_goals {
  id: UUID (PK)
  account_id: UUID (FK → accounts.id)
  date: date
  total_budget: integer (원)
  category_budgets: jsonb ({ [category]: amount })
  created_at: timestamp
  updated_at: timestamp
}
\\\

---

## 비기능 요구사항

### 성능
- 거래 100개 기준 초기 로드 < 1초
- 차트 렌더링 < 500ms
- 부드러운 모바일 인터랙션
- Supabase Realtime 동기화 < 500ms

### 접근성
- 시맨틱 HTML5 사용
- 키보드 네비게이션 지원
- 충분한 색상 대비 (WCAG AA 준수)

### 반응형
- 모바일 (320px 이상)
- 태블릿 (768px 이상)
- 데스크톱 (1024px 이상)
- 터치/마우스 모두 지원

### 보안
- Supabase Auth로 사용자 인증
- Row Level Security (RLS) 적용
  - 사용자는 자신의 account만 접근 가능
  - 공유된 account는 shared_members에 있는 사용자만 접근
- 비밀번호는 Supabase에서 관리 (bcrypt 해싱)
- 입력값 검증 (XSS 방지)
- HTTPS 필수

---

## 범위 제외 (Out of Scope)

### v1에 포함하지 않음
- ❌ 은행/카드 자동 동기화
- ❌ 반복 거래 (자동 정기 입출금)
- ❌ 3명 이상 공유
- ❌ 클라우드 백업 (Supabase가 자동 관리)
- ❌ 절약 챌린지, 게임화 요소
- ❌ 진지한 회계 기능 (복식부기, 세무 보고)

### 향후 v2 고려사항
- CSV 가져오기/내보내기
- 월간 예산 설정 및 초과 알림
- 특정 기간의 거래 분석 (사용자 지정 범위)
- 반복 거래 템플릿
- 사용자 커스텀 카테고리
- 3명 이상 공유
- 소셜 로그인 (Google, GitHub 등)

---

## 완료 기준 (Definition of Done)

### 기능 검증
- [ ] 회원가입/로그인 완전 동작 (이메일 인증 포함)
- [ ] 개인 계정 생성 및 기본 가계부 자동 생성
- [ ] 거래 CRUD (생성/읽기/수정/삭제) 완전 동작
- [ ] 공유 코드 생성 및 다른 사용자 초대 동작
- [ ] 공유 가계부에서 두 사용자 실시간 데이터 동기화
- [ ] 카테고리별 필터링 동작
- [ ] 월간 통계 및 차트 렌더링
- [ ] 일일 지출 목표 설정 및 카테고리별 목표 설정 동작
- [ ] 일일 목표 진행률 표시 및 목표 초과 경고 동작
- [ ] Supabase RLS 정책 검증 (권한 없는 접근 차단)
- [ ] 모바일/태블릿/데스크톱 반응형 동작

### 품질 검증
- [ ] 타입스크립트 타입 검사 100% (no-any)
- [ ] 브라우저 콘솔 에러 없음
- [ ] 접근성 기본 검사 통과
- [ ] 거래 100개 이상에서 성능 저하 없음
- [ ] Supabase 쿼리 최적화 (N+1 문제 없음)

### 배포 준비
- [ ] 빌드 성공
- [ ] 프로덕션 최적화 (미니피케이션)
- [ ] 초기 로드 시간 < 2초
- [ ] Supabase 프로덕션 프로젝트 설정
- [ ] 환경 변수 (.env) 설정

---

## 우선순위 (MoSCoW)

| 우선순위 | 기능 |
|---------|------|
| **Must** | 회원가입/로그인, 거래 CRUD, 고정 카테고리, 공유 기능(공유 코드), 월간 통계, 일일 목표, Supabase 저장 |
| **Should** | 차트 시각화, 기간별 필터링, 반응형 UI, 목표 초과 알림, Realtime 동기화, RLS 정책 |
| **Could** | 검색, 트렌드 분석, CSV 내보내기, 이메일 인증 |
| **Won't** | 3명 이상 공유, 자동 동기화(은행), 소셜 로그인 |
