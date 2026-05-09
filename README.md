# 광한루 「춘향이 AI 도슨트」 시연

남원시 2026 상반기 시정발전 제안 — 박용환 카드 A 라이브 데모.

광한루원 12개소 QR-LLM 도슨트, 4 페르소나(춘향·이몽룡·향단·방자), 다국어 자동 응답.

## 로컬 실행

```powershell
cd C:\Users\user\Downloads\namwon-chunhyang-ai
npm install
copy .env.local.example .env.local
# .env.local 파일에 ANTHROPIC_API_KEY 입력
npm run dev
# http://localhost:3000
```

## Vercel 배포 (한 줄)

```powershell
cd C:\Users\user\Downloads\namwon-chunhyang-ai
npm install
npx vercel --prod
# 첫 배포 시 vercel login (이메일 인증)
# 프로젝트 이름: namwon-chunhyang-ai
# 환경변수 추가: ANTHROPIC_API_KEY (settings → environment variables)
# 또는 CLI로:
npx vercel env add ANTHROPIC_API_KEY production
# (값 입력 후) npx vercel --prod 재실행
```

## 스택
- Next.js 14 App Router
- @anthropic-ai/sdk → claude-haiku-4-5-20251001
- Vanilla CSS (Tailwind 미사용, 빠른 prototype)

## 핵심 파일
- `app/page.js` — UI (페르소나·위치·채팅)
- `app/api/chat/route.js` — Claude Haiku 4.5 API 라우트
- `app/layout.js` — 글로벌 레이아웃

## 제출용 URL/QR
배포 완료 후 받은 URL을 카드 A 신청서 v3 PDF의 「붙임 — 라이브 시연」에 추가한다.
