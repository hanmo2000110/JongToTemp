# JongToTemp

Next.js(App Router) + TypeScript + Tailwind CSS 기반의 최소 실행 골격입니다.

## 포함된 구성

- Next.js App Router 기본 구조 (`app/`)
- Tailwind CSS + PostCSS 설정
- shadcn/ui 사용을 위한 기본 테마 토큰 및 유틸(`cn`)
- Recharts 의존성 포함

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 빌드 결과로 프로덕션 서버 실행

## 환경 변수 템플릿

루트에 `.env.local` 파일을 만들고 아래 템플릿을 사용하세요.

```bash
# Public variables (브라우저 노출 가능)
NEXT_PUBLIC_APP_NAME=JongToTemp

# Server-only variables
# API_KEY=your_api_key_here
```
## 현재 작업 현황

- 최신 현황/우선순위/실행 체크리스트: `docs/WORK_STATUS_AND_NEXT_STEPS.md`

