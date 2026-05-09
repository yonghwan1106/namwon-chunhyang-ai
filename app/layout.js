export const metadata = {
  title: '광한루 춘향이 AI 도슨트 — 남원시 시정발전 제안 시연',
  description: '광한루원 12개소 QR-LLM 도슨트. 4 페르소나(춘향·이몽룡·향단·방자), 다국어, TTS 음성투어, 행위 기반 상품권 미션.',
  openGraph: {
    title: '광한루 춘향이 AI 도슨트',
    description: 'QR 한 번이면 24시간 다국어 야간 음성투어 — 남원시 시정발전 제안 시연 (박용환)',
    type: 'website',
    locale: 'ko_KR',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a2746',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='80' font-size='80'%3E🌸%3C/text%3E%3C/svg%3E" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            '"Noto Serif KR","본명조","Malgun Gothic","맑은 고딕",-apple-system,BlinkMacSystemFont,sans-serif',
          minHeight: '100dvh',
          color: '#fff',
          background: '#0a0e27',
        }}
      >
        {children}
      </body>
    </html>
  );
}
