export const metadata = {
  title: '광한루 춘향이 AI 도슨트 — 남원시 시정발전 제안 시연',
  description: '광한루원 12개소 QR-LLM 도슨트. 4 페르소나(춘향·이몽룡·향단·방자), 한·영·중·일 다국어, TTS 음성투어, 야간 라이팅, 행위 기반 상품권 미션, 접근성 3모드.',
  openGraph: {
    title: '광한루 춘향이 AI 도슨트',
    description: 'QR 한 번이면 24시간 다국어 야간 음성투어 — 2026 남원시 시정발전 제안 (박용환)',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: '광한루 춘향이 AI 도슨트' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a1612',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&family=Gowun+Batang:wght@400;700&display=swap" />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='44' fill='%23c8392c'/%3E%3Cpath d='M50 22 Q60 50 78 50 Q60 50 50 78 Q40 50 22 50 Q40 50 50 22Z' fill='%23f7f3eb'/%3E%3C/svg%3E" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            '"Noto Serif KR","Gowun Batang","Malgun Gothic","맑은 고딕",-apple-system,BlinkMacSystemFont,sans-serif',
          minHeight: '100dvh',
          color: '#1a1612',
          background: '#1a1612',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </body>
    </html>
  );
}
