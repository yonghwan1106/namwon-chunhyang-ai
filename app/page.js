'use client';
import { useState, useRef, useEffect, useMemo } from 'react';

// === 단청 5색 팔레트 ===
const C = {
  cheong: '#1d4f7a',  // 청
  jeok: '#c8392c',    // 적
  hwang: '#d4a017',   // 황
  baek: '#f7f3eb',    // 백 (한지)
  heuk: '#1a1612',    // 흑
  green: '#2c5e3f',   // 부 - 향단용
  ink: '#3a2010',
  mist: '#9c7a5a',
  nightBg1: '#0a0e1f',
  nightBg2: '#1a1f3a',
  dayBg1: '#f7f3eb',
  dayBg2: '#e8d8b8',
};

const PERSONAS = [
  {
    id: 'chunhyang', name: '춘향', tone: '서정',
    color: C.jeok, accent: '#e84a8a',
    voice: { pitch: 1.25, rate: 0.92 },
    greet: '그네 위에서 만나뵈오니 반갑습니다.',
    sys: '너는 광한루의 「춘향」이다. 16세 양반가 규수의 정중하고 서정적인 말투. 이몽룡과의 사랑·그네·오작교를 제 일처럼 이야기한다. 답변은 3~5문장.',
  },
  {
    id: 'mongryong', name: '이몽룡', tone: '낭만',
    color: C.cheong, accent: '#3a7bc8',
    voice: { pitch: 0.85, rate: 0.95 },
    greet: '오작교 아래, 그대를 기다렸소.',
    sys: '너는 「이몽룡」이다. 남원부사의 아들, 한양 과거 급제 후 암행어사. 낭만적이면서도 정의로운 어조. 광한루를 추억의 장소로 회상한다. 답변은 3~5문장.',
  },
  {
    id: 'hyangdan', name: '향단', tone: '안내',
    color: C.green, accent: '#2c8b4f',
    voice: { pitch: 1.1, rate: 1.0 },
    greet: '맛집·동선·시간 모두 제가 알려드릴게요.',
    sys: '너는 춘향의 시녀 「향단」이다. 정겹고 똑부러진 현지 안내자 어투. 광한루·요천변·추어탕거리 등 실용 정보(시간·교통·맛집)를 친근하게 알려준다. 답변은 3~5문장.',
  },
  {
    id: 'bangja', name: '방자', tone: '해학',
    color: C.hwang, accent: '#c8902a',
    voice: { pitch: 0.95, rate: 1.05 },
    greet: '재미난 얘기 한바탕 풀어드리지요!',
    sys: '너는 이몽룡의 종 「방자」다. 능청·해학·재치가 넘치는 사투리. 광한루 일화를 코믹하게 풀되 정보는 정확. 답변은 3~5문장.',
  },
];

const SPOT_GROUPS = [
  {
    label: '광한루원',
    items: [
      { id: 'gwanghallu', name: '광한루', desc: '호남제일루' },
      { id: 'ojakgyo', name: '오작교', desc: '견우직녀의 다리' },
      { id: 'wanwoljeong', name: '완월정', desc: '달 감상의 정자' },
      { id: 'chunhyangsadang', name: '춘향사당', desc: '춘향의 영정' },
      { id: 'wolmaejip', name: '월매집', desc: '춘향 어머니 집' },
      { id: 'yochon', name: '요천 야경교', desc: '야간 라이팅' },
    ],
  },
  {
    label: '춘향테마파크 5경',
    items: [
      { id: 'theme1', name: '①만남길', desc: '첫 만남 그네터' },
      { id: 'theme2', name: '②맹약길', desc: '백년가약' },
      { id: 'theme3', name: '③별리길', desc: '눈물의 이별' },
      { id: 'theme4', name: '④시련길', desc: '변학도와 갈등' },
      { id: 'theme5', name: '⑤축제길', desc: '재회와 축제' },
    ],
  },
  {
    label: '미식 동선',
    items: [
      { id: 'chueotang', name: '추어탕거리', desc: '남원 대표 미식' },
    ],
  },
];

const SPOTS = SPOT_GROUPS.flatMap(g => g.items);

const QUIZZES = {
  gwanghallu: [
    { q: '광한루를 처음 지은 정승의 이름은?', options: ['황희', '정도전', '맹사성'], correct: 0 },
    { q: '광한루의 보물 지정 번호는?', options: ['281호', '180호', '500호'], correct: 0 },
  ],
  ojakgyo: [
    { q: '오작교에서 만난다는 두 별의 이름은?', options: ['견우와 직녀', '동방과 북두', '삼신과 칠성'], correct: 0 },
    { q: '오작교를 잇는 새로 알려진 동물은?', options: ['까치', '제비', '참새'], correct: 0 },
  ],
  wanwoljeong: [{ q: '완월정(玩月亭)에서 즐기는 것은?', options: ['달맞이', '꽃놀이', '뱃놀이'], correct: 0 }],
  chunhyangsadang: [
    { q: '춘향사당이 건립된 연도는?', options: ['1931년', '1850년', '1995년'], correct: 0 },
    { q: '춘향제는 매년 음력 몇 월 며칠?', options: ['5월 5일', '8월 15일', '3월 3일'], correct: 0 },
  ],
  wolmaejip: [{ q: '월매는 누구의 어머니인가?', options: ['춘향', '향단', '월선'], correct: 0 }],
  yochon: [{ q: '요천 야경교에서 볼 수 있는 것은?', options: ['라이팅과 분수쇼', '폭포', '얼음 조각'], correct: 0 }],
  theme1: [{ q: '몽룡과 춘향의 첫 만남이 이뤄진 곳은?', options: ['그네터', '서당', '마을 우물'], correct: 0 }],
  theme2: [{ q: '맹약길에서 두 사람이 맺은 약속은?', options: ['백년가약', '의형제', '학문 교류'], correct: 0 }],
  theme3: [{ q: '몽룡이 한양으로 떠나며 걷는 길의 이름은?', options: ['별리길', '귀로', '청춘길'], correct: 0 }],
  theme4: [{ q: '시련길에서 춘향에게 수청을 강요한 인물은?', options: ['변학도', '월매', '향단'], correct: 0 }],
  theme5: [{ q: '축제길에서 어사가 된 인물은?', options: ['이몽룡', '방자', '변학도'], correct: 0 }],
  chueotang: [
    { q: '남원의 대표 음식은?', options: ['추어탕', '갈비탕', '냉면'], correct: 0 },
    { q: '추어탕의 주재료는?', options: ['미꾸라지', '메기', '잉어'], correct: 0 },
  ],
};

function detectLang(text) {
  if (/[぀-ヿ]/.test(text)) return 'ja-JP';
  if (/[一-鿿]/.test(text) && !/[가-힯]/.test(text)) return 'zh-CN';
  if (/[가-힯]/.test(text)) return 'ko-KR';
  if (/[a-zA-Z]/.test(text)) return 'en-US';
  return 'ko-KR';
}

export default function Home() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [spot, setSpot] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [accessMode, setAccessMode] = useState('normal');
  const [nightOverride, setNightOverride] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [stamps, setStamps] = useState(new Set());
  const [quizScore, setQuizScore] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [showMission, setShowMission] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [speakingIdx, setSpeakingIdx] = useState(-1);
  const [stampPulse, setStampPulse] = useState(null);
  const [fireworks, setFireworks] = useState(false);

  const scrollRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setMounted(true);
    try {
      const saved = localStorage.getItem('nw_access_mode');
      if (saved) setAccessMode(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('nw_access_mode', accessMode); } catch {}
  }, [accessMode]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  const isNight = useMemo(() => {
    if (nightOverride !== null) return nightOverride;
    if (!mounted) return false;
    const h = new Date().getHours();
    return h >= 18 || h < 6;
  }, [nightOverride, mounted]);

  const fontScale = accessMode === 'caption' ? 1.25 : 1;

  function speak(text, idx = -1) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = detectLang(text);
    u.rate = persona.voice.rate;
    u.pitch = persona.voice.pitch;
    u.onend = () => setSpeakingIdx(-1);
    u.onerror = () => setSpeakingIdx(-1);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(u);
  }

  function stopSpeak() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(-1);
    }
  }

  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    if (accessMode !== 'voice' || msgs.length === 0) return;
    const lastIdx = msgs.length - 1;
    const last = msgs[lastIdx];
    if (last && last.role === 'assistant' && !last.type) speak(last.content, lastIdx);
  }, [msgs.length, accessMode]);

  useEffect(() => {
    if (stamps.size >= 3 && quizScore >= 5 && !coupon) {
      const code = `NW${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setCoupon({ code, amount: 1000, place: '추어탕거리·전통시장' });
    }
  }, [stamps.size, quizScore, coupon]);

  function pickSpot(s) {
    setSpot(s);
    if (!stamps.has(s.id)) {
      setStampPulse(s.id);
      setTimeout(() => setStampPulse(null), 800);
    }
    setStamps(prev => new Set([...prev, s.id]));
    const greet = `(${persona.name}) ${s.name}에 오신 걸 환영합니다. ${s.desc}이지요. 무엇이 궁금하신가요?`;
    setMsgs([{ role: 'assistant', content: greet }]);
  }

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const next = [...msgs, { role: 'user', content: q }];
    setMsgs(next); setInput(''); setLoading(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          persona: persona.id, spot: spot?.id, night: isNight,
          messages: next.filter(m => !m.type),
        }),
      });
      const data = await r.json();
      setMsgs([...next, { role: 'assistant', content: data.text || '(응답 없음)' }]);
    } catch (e) {
      setMsgs([...next, { role: 'assistant', content: '서버 오류. 잠시 후 다시 시도해주세요.' }]);
    } finally { setLoading(false); }
  }

  function startQuiz() {
    if (!spot) return;
    const pool = QUIZZES[spot.id];
    if (!pool || pool.length === 0) {
      setMsgs(prev => [...prev, { role: 'assistant', content: '이 곳은 아직 퀴즈가 준비되지 않았습니다. 다른 곳에서 도전해 보세요!' }]);
      return;
    }
    const q = pool[Math.floor(Math.random() * pool.length)];
    setActiveQuiz({ ...q, spotId: spot.id });
    setMsgs(prev => [...prev, { role: 'assistant', type: 'quiz', content: q.q, options: q.options, correct: q.correct }]);
  }

  function answerQuiz(idx) {
    if (!activeQuiz) return;
    const ok = idx === activeQuiz.correct;
    if (ok) {
      setQuizScore(s => Math.min(s + 1, 5));
      setFireworks(true);
      setTimeout(() => setFireworks(false), 1200);
    }
    const reply = ok
      ? `정답이옵니다! 🌸 (퀴즈 ${Math.min(quizScore + 1, 5)}/5)`
      : `아쉽군요. 정답은 「${activeQuiz.options[activeQuiz.correct]}」였습니다.`;
    setMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
    setActiveQuiz(null);
  }

  const samples = spot ? [
    '이 장소 이야기 들려줘',
    'What is this place?',
    '가까운 맛집',
    isNight ? '야간 라이팅 포인트?' : '주변 동선',
  ] : [];

  const t = isNight ? {
    bg: `radial-gradient(ellipse at top,${C.nightBg2} 0%,${C.nightBg1} 55%,#04060e 100%)`,
    panel: 'rgba(20,25,50,0.5)',
    panelBorder: 'rgba(212,160,23,0.25)',
    chatBg: 'rgba(0,0,0,0.4)',
    text: '#f5f0e0',
    sub: '#a8b8d4',
    accent: C.hwang,
  } : {
    bg: `linear-gradient(180deg,${C.dayBg1} 0%,${C.dayBg2} 100%)`,
    panel: 'rgba(255,253,247,0.7)',
    panelBorder: 'rgba(200,57,44,0.2)',
    chatBg: 'rgba(255,253,247,0.6)',
    text: C.heuk,
    sub: C.mist,
    accent: C.jeok,
  };

  return (
    <div style={{
      minHeight: '100dvh', background: t.bg, color: t.text, transition: 'background 0.8s ease',
      fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
    }}>
      <HanjiOverlay isNight={isNight} />
      {isNight && <Stars />}
      {fireworks && <Fireworks />}

      <main style={{ maxWidth: 980, margin: '0 auto', padding: '20px 14px 120px', fontSize: 16 * fontScale, position: 'relative', zIndex: 2 }}>
        <GwanghalluHeader isNight={isNight} t={t} fontScale={fontScale} />

        <FloatingBar
          isNight={isNight} nightOverride={nightOverride} setNightOverride={setNightOverride}
          accessMode={accessMode} setAccessMode={setAccessMode} stopSpeak={stopSpeak}
          stamps={stamps} quizScore={quizScore} coupon={coupon} setShowMission={setShowMission}
          t={t} fontScale={fontScale}
        />

        <Section title="① 페르소나" subtitle="네 인물 중 한 분을 선택하세요" t={t} fontScale={fontScale}>
          <div className="persona-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 }}>
            {PERSONAS.map(p => (
              <PersonaCard
                key={p.id} p={p}
                active={persona.id === p.id}
                onClick={() => setPersona(p)}
                isNight={isNight} t={t} fontScale={fontScale}
              />
            ))}
          </div>
        </Section>

        <Section title="② 위치 (QR 스캔 가정)" subtitle={`${stamps.size}/12 방문`} t={t} fontScale={fontScale}>
          {SPOT_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11 * fontScale, color: t.sub, marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>
                {group.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 6 }}>
                {group.items.map(s => (
                  <SpotButton
                    key={s.id} s={s}
                    active={spot?.id === s.id}
                    visited={stamps.has(s.id)}
                    pulsing={stampPulse === s.id}
                    onClick={() => pickSpot(s)}
                    isNight={isNight} t={t} fontScale={fontScale}
                  />
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section
          title={<><span>③ 대화 — </span><b style={{ color: persona.color }}>{persona.name}</b>{spot && <span style={{ color: t.sub }}> · {spot.name}</span>}</>}
          subtitle={null} t={t} fontScale={fontScale}
          extra={spot && (
            <button onClick={startQuiz} disabled={!!activeQuiz}
              style={{
                fontSize: 11 * fontScale, padding: '5px 12px', borderRadius: 14,
                background: activeQuiz ? 'rgba(140,140,140,0.2)' : `${C.jeok}22`,
                color: activeQuiz ? t.sub : C.jeok,
                border: `1px solid ${activeQuiz ? t.panelBorder : C.jeok}`,
                cursor: activeQuiz ? 'not-allowed' : 'pointer', fontWeight: 700,
              }}>
              ❓ 퀴즈 도전
            </button>
          )}>
          <div ref={scrollRef} style={{
            minHeight: 240, maxHeight: 380, overflowY: 'auto',
            background: t.chatBg, borderRadius: 12, padding: 12, marginBottom: 10,
            border: `1px solid ${t.panelBorder}`,
          }}>
            {msgs.length === 0 && (
              <div style={{ color: t.sub, fontSize: 13 * fontScale, padding: 32, textAlign: 'center', lineHeight: 1.7 }}>
                먼저 위치를 선택해 주세요.<br />
                <span style={{ fontSize: 11 * fontScale, opacity: 0.8 }}>한국어 · English · 中文 · 日本語 입력 가능</span>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{ margin: '10px 0', display: 'flex', gap: 8, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
                {m.role === 'assistant' && <PersonaAvatar p={persona} size={28} />}
                <div style={{
                  maxWidth: '78%',
                  background: m.role === 'user'
                    ? C.cheong
                    : (isNight ? 'rgba(255,255,255,0.10)' : 'rgba(255,253,247,0.85)'),
                  color: m.role === 'user' ? '#fff' : t.text,
                  padding: '10px 14px', borderRadius: 14,
                  fontSize: (accessMode === 'caption' ? 16 : 13.5) * fontScale,
                  lineHeight: 1.65, whiteSpace: 'pre-wrap',
                  border: m.role === 'user' ? 'none' : `1px solid ${t.panelBorder}`,
                  boxShadow: speakingIdx === i ? `0 0 0 3px ${persona.color}55, 0 0 16px ${persona.color}88` : 'none',
                  animation: speakingIdx === i ? 'pulse 1.4s ease-in-out infinite' : 'none',
                }}>
                  {m.type === 'quiz' ? (
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>❓ {m.content}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {m.options.map((o, oi) => (
                          <button key={oi} onClick={() => activeQuiz && answerQuiz(oi)} disabled={!activeQuiz}
                            style={{
                              padding: '8px 12px', borderRadius: 10,
                              background: 'rgba(255,255,255,0.18)',
                              color: t.text, border: `1px solid ${t.panelBorder}`,
                              cursor: activeQuiz ? 'pointer' : 'default', textAlign: 'left',
                              fontSize: 13 * fontScale, opacity: activeQuiz ? 1 : 0.6,
                            }}>
                            {String.fromCharCode(0x2460 + oi)} {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>{m.content}</div>
                      {m.role === 'assistant' && (
                        <button
                          onClick={() => (speakingIdx === i ? stopSpeak() : speak(m.content, i))}
                          aria-label="음성 재생"
                          style={{
                            marginTop: 8, padding: '3px 10px', fontSize: 11 * fontScale,
                            background: speakingIdx === i ? persona.color : 'transparent',
                            color: speakingIdx === i ? '#fff' : t.sub,
                            border: `1px solid ${speakingIdx === i ? persona.color : t.panelBorder}`,
                            borderRadius: 12, cursor: 'pointer', fontWeight: 600,
                          }}>
                          {speakingIdx === i ? '⏹ 정지' : '🔊 듣기'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: t.sub, fontSize: 12 * fontScale, padding: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="dot-anim">●●●</span> {persona.name}이 답하는 중
              </div>
            )}
          </div>

          {spot && samples.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {samples.map(s => (
                <button key={s} onClick={() => send(s)} disabled={loading}
                  style={{
                    background: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,253,247,0.6)',
                    color: t.text, border: `1px solid ${t.panelBorder}`,
                    padding: '6px 12px', borderRadius: 14, fontSize: 11.5 * fontScale, cursor: 'pointer',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={e => { e.preventDefault(); send(); }} style={{ display: 'flex', gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)} disabled={!spot || loading}
              placeholder={spot ? '메시지를 입력하세요…' : '먼저 위치를 선택하세요'}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 24,
                border: `1.5px solid ${t.panelBorder}`,
                background: isNight ? 'rgba(0,0,0,0.4)' : 'rgba(255,253,247,0.85)',
                color: t.text, fontSize: 14 * fontScale, outline: 'none',
                fontFamily: 'inherit',
              }} />
            <button type="submit" disabled={!spot || loading || !input.trim()}
              style={{
                padding: '12px 22px', borderRadius: 24, border: 'none',
                background: persona.color, color: '#fff', fontWeight: 700,
                cursor: 'pointer', fontSize: 13 * fontScale,
                opacity: (!spot || loading || !input.trim()) ? 0.5 : 1,
                fontFamily: 'inherit',
              }}>
              전송
            </button>
          </form>
        </Section>

        <footer style={{ textAlign: 'center', color: t.sub, fontSize: 11 * fontScale, marginTop: 28, lineHeight: 1.8 }}>
          <div style={{ marginBottom: 4 }}>모델: Claude Haiku 4.5 · TTS: 브라우저 SpeechSynthesis · 한지·단청 디자인</div>
          <div>2026 상반기 남원시 시정발전 제안 — <b style={{ color: t.text }}>박용환</b></div>
          <div style={{ fontSize: 10 * fontScale, opacity: 0.7, marginTop: 6 }}>
            발신처: 남원시청 기획예산과 inihh30@korea.kr · 본 데모의 쿠폰은 시연용 모의 데이터
          </div>
        </footer>
      </main>

      <Watermark />

      {showMission && (
        <Modal onClose={() => setShowMission(false)}>
          <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 40 }}>🎫</div>
          <h2 style={{ margin: '12px 0 12px', fontSize: 22, color: C.heuk, textAlign: 'center', fontWeight: 800 }}>
            광한루 미션 카드
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: C.ink, lineHeight: 1.7 }}>
            행위 기반 인센티브 — 광한루 12개소 중 <b>3곳을 방문</b>하고 <b>퀴즈 5문제 정답</b> 시 추어탕거리·전통시장에서 사용 가능한 1,000원 상품권이 발급됩니다.
            <br /><br />
            <b style={{ color: C.jeok }}>※ 본 데모는 시뮬레이션입니다.</b> 실제 발급은 시범사업 채택 후 지역사랑상품권 시스템 연동으로 구현됩니다.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <Pill label="📍 위치 방문" value={`${stamps.size}/3`} done={stamps.size >= 3} />
            <Pill label="❓ 퀴즈 정답" value={`${quizScore}/5`} done={quizScore >= 5} />
          </div>
          {coupon ? (
            <div style={{
              background: `linear-gradient(135deg,${C.jeok},#a82820)`, color: '#fff',
              borderRadius: 12, padding: 18, textAlign: 'center',
              boxShadow: `0 6px 24px ${C.jeok}55`, animation: 'unfold 0.6s cubic-bezier(.2,.9,.3,1.2)',
            }}>
              <div style={{ fontSize: 11, opacity: 0.9, letterSpacing: 3 }}>NAMWON GIFT COUPON</div>
              <div style={{ fontSize: 30, fontWeight: 900, margin: '6px 0' }}>₩ {coupon.amount.toLocaleString()}</div>
              <div style={{ fontSize: 13, marginBottom: 8 }}>{coupon.place}</div>
              <div style={{ fontSize: 16, fontFamily: 'monospace', letterSpacing: 2, padding: '8px 0', borderTop: '1px dashed rgba(255,255,255,0.6)' }}>
                {coupon.code}
              </div>
              <div style={{ fontSize: 10, opacity: 0.85, marginTop: 4 }}>(시연용 모의 발급 — 실제 사용 불가)</div>
            </div>
          ) : (
            <div style={{ background: '#f5e6c8', color: C.ink, borderRadius: 12, padding: 16, textAlign: 'center', fontSize: 13 }}>
              미션 진행 중입니다. 더 많은 장소를 방문하고 퀴즈에 도전해 보세요!
            </div>
          )}
          <button onClick={() => setShowMission(false)}
            style={{ width: '100%', marginTop: 14, padding: '11px', borderRadius: 10, border: 'none', background: C.heuk, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            닫기
          </button>
        </Modal>
      )}

      <GlobalKeyframes />
    </div>
  );
}

// === Sub-components ===

function GwanghalluHeader({ isNight, t, fontScale }) {
  return (
    <header style={{ textAlign: 'center', padding: '8px 0 18px', position: 'relative' }}>
      <svg viewBox="0 0 600 140" style={{ width: '100%', maxWidth: 580, height: 'auto', display: 'block', margin: '0 auto' }} aria-hidden>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? '#0a0e1f' : '#f7e8d3'} stopOpacity="0" />
            <stop offset="100%" stopColor={isNight ? '#1a1f3a' : '#e8d8b8'} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="600" height="140" fill="url(#sky)" />
        {isNight && <circle cx="500" cy="35" r="22" fill={C.hwang} opacity="0.85" />}
        {!isNight && <circle cx="500" cy="35" r="20" fill={C.hwang} opacity="0.6" />}
        <g stroke={isNight ? C.hwang : C.jeok} strokeWidth="1.4" fill="none" opacity="0.85">
          <path d="M120 100 L180 100 L180 70 L300 60 L420 70 L420 100 L480 100" />
          <path d="M180 70 L160 50 L300 38 L440 50 L420 70" />
          <path d="M160 50 L300 24 L440 50" />
          <line x1="200" y1="100" x2="200" y2="70" />
          <line x1="240" y1="100" x2="240" y2="68" />
          <line x1="280" y1="100" x2="280" y2="64" />
          <line x1="320" y1="100" x2="320" y2="64" />
          <line x1="360" y1="100" x2="360" y2="66" />
          <line x1="400" y1="100" x2="400" y2="70" />
        </g>
        <g stroke={isNight ? '#a8b8d4' : C.cheong} strokeWidth="1" fill="none" opacity="0.55">
          <path d="M60 110 Q80 95 100 110 Q120 95 140 110 L140 120 L60 120 Z" />
          <path d="M460 110 Q480 95 500 110 Q520 95 540 110 L540 120 L460 120 Z" />
        </g>
        <line x1="0" y1="120" x2="600" y2="120" stroke={t.panelBorder} strokeWidth="0.8" />
      </svg>
      <div style={{ fontSize: 10 * fontScale, letterSpacing: 5, color: t.sub, textTransform: 'uppercase', marginTop: 4 }}>
        Namwon · Gwanghallu · {isNight ? 'Night Mode' : 'Day Mode'}
      </div>
      <h1 style={{ fontSize: 30 * fontScale, margin: '4px 0 4px', fontWeight: 900, letterSpacing: '-0.5px', color: t.text }}>
        광한루 「춘향이 AI 도슨트」
      </h1>
      <p style={{ color: t.sub, fontSize: 12.5 * fontScale, margin: 0, lineHeight: 1.6 }}>
        QR 한 번이면 24시간 다국어 야간 음성투어<br />
        <span style={{ fontSize: 11 * fontScale, opacity: 0.8 }}>2026 남원시 시정발전 제안 시연 · 박용환</span>
      </p>
    </header>
  );
}

function FloatingBar({ isNight, nightOverride, setNightOverride, accessMode, setAccessMode, stopSpeak, stamps, quizScore, coupon, setShowMission, t, fontScale }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap',
      margin: '0 0 18px', padding: '10px 12px', borderRadius: 100,
      background: t.panel, border: `1px solid ${t.panelBorder}`, backdropFilter: 'blur(10px)',
    }}>
      {isNight && (
        <span style={{ fontSize: 10.5 * fontScale, padding: '4px 10px', borderRadius: 14, background: `${C.hwang}22`, color: C.hwang, border: `1px solid ${C.hwang}55`, fontWeight: 600 }}>
          🌙 별빛 모드
        </span>
      )}
      <button onClick={() => setNightOverride(isNight ? false : true)}
        style={tagBtnStyle(false, t, fontScale)}>
        {isNight ? '☀ 낮' : '🌙 밤'}
      </button>
      {nightOverride !== null && (
        <button onClick={() => setNightOverride(null)} style={tagBtnStyle(false, t, fontScale)}>↻ 자동</button>
      )}
      {[
        { id: 'normal', label: '♿ 일반' },
        { id: 'voice', label: '🔊 음성' },
        { id: 'caption', label: '📺 자막' },
      ].map(m => (
        <button key={m.id} onClick={() => { setAccessMode(m.id); if (m.id !== 'voice') stopSpeak(); }}
          style={tagBtnStyle(accessMode === m.id, t, fontScale, t.accent, isNight)}>
          {m.label}
        </button>
      ))}
      <button onClick={() => setShowMission(true)}
        style={{
          fontSize: 10.5 * fontScale, padding: '4px 12px', borderRadius: 14,
          background: coupon ? C.jeok : `${C.jeok}22`,
          color: coupon ? '#fff' : C.jeok,
          border: `1px solid ${C.jeok}`, cursor: 'pointer', fontWeight: 700,
        }}>
        🎫 {stamps.size}/3 · {quizScore}/5{coupon ? ' ✓' : ''}
      </button>
    </div>
  );
}

function tagBtnStyle(active, t, fontScale, activeBg, isNight) {
  return {
    fontSize: 10.5 * fontScale, padding: '4px 10px', borderRadius: 14,
    background: active ? (activeBg || t.accent) : 'transparent',
    color: active ? (isNight ? '#0a0e1f' : '#fff') : t.sub,
    border: `1px solid ${active ? (activeBg || t.accent) : t.panelBorder}`,
    cursor: 'pointer', fontWeight: active ? 700 : 500, fontFamily: 'inherit',
  };
}

function Section({ title, subtitle, t, fontScale, extra, children }) {
  return (
    <section style={{
      background: t.panel, borderRadius: 18, padding: 18, marginBottom: 14,
      border: `1px solid ${t.panelBorder}`, backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13 * fontScale, color: t.text, fontWeight: 700 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11 * fontScale, color: t.sub, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function PersonaCard({ p, active, onClick, isNight, t, fontScale }) {
  return (
    <button onClick={onClick}
      style={{
        background: active ? p.color : (isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,253,247,0.7)'),
        color: active ? '#fff' : t.text,
        border: active ? `2px solid ${p.color}` : `1px solid ${t.panelBorder}`,
        padding: '14px 10px', borderRadius: 14, cursor: 'pointer',
        fontSize: 13 * fontScale, fontWeight: 600,
        transition: 'all 0.3s cubic-bezier(.2,.9,.3,1.1)',
        transform: active ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: active ? `0 6px 18px ${p.color}66` : 'none',
        animation: 'persona-in 0.5s ease',
        fontFamily: 'inherit', textAlign: 'center',
      }}>
      <PersonaAvatar p={p} size={48} />
      <div style={{ fontWeight: 800, fontSize: 15 * fontScale, marginTop: 8 }}>{p.name}</div>
      <div style={{ fontSize: 10 * fontScale, opacity: 0.85, fontWeight: 500, letterSpacing: 1, marginTop: 2 }}>{p.tone}</div>
      <div style={{ fontSize: 10.5 * fontScale, opacity: 0.85, fontWeight: 400, marginTop: 6, lineHeight: 1.4, minHeight: 28 }}>
        {p.greet}
      </div>
    </button>
  );
}

function PersonaAvatar({ p, size = 40 }) {
  const stroke = '#fff';
  const fill = p.color;
  if (p.id === 'chunhyang') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={{ display: 'inline-block' }}>
        <circle cx="32" cy="32" r="30" fill={fill} opacity="0.18" />
        <path d="M22 18 Q32 8 42 18 L42 30 Q32 38 22 30 Z" fill={fill} opacity="0.8" />
        <circle cx="32" cy="36" r="5" fill={fill} />
        <path d="M20 50 Q32 42 44 50" stroke={fill} strokeWidth="2.5" fill="none" />
        <circle cx="14" cy="22" r="2.5" fill={fill} opacity="0.6" />
        <circle cx="50" cy="20" r="2" fill={fill} opacity="0.5" />
        <circle cx="48" cy="44" r="1.8" fill={fill} opacity="0.4" />
      </svg>
    );
  }
  if (p.id === 'mongryong') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={{ display: 'inline-block' }}>
        <circle cx="32" cy="32" r="30" fill={fill} opacity="0.18" />
        <ellipse cx="32" cy="20" rx="16" ry="6" fill={fill} opacity="0.85" />
        <rect x="20" y="20" width="24" height="3" fill={fill} />
        <circle cx="32" cy="36" r="6" fill={fill} />
        <path d="M22 50 L42 50 L40 42 L24 42 Z" fill={fill} opacity="0.7" />
      </svg>
    );
  }
  if (p.id === 'hyangdan') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={{ display: 'inline-block' }}>
        <circle cx="32" cy="32" r="30" fill={fill} opacity="0.18" />
        <path d="M22 22 Q32 14 42 22 Q42 32 32 36 Q22 32 22 22Z" fill={fill} opacity="0.8" />
        <circle cx="32" cy="40" r="5" fill={fill} />
        <path d="M22 52 L42 52 L40 46 L24 46 Z" fill={fill} opacity="0.65" />
        <circle cx="22" cy="22" r="2" fill={C.jeok} />
      </svg>
    );
  }
  if (p.id === 'bangja') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={{ display: 'inline-block' }}>
        <circle cx="32" cy="32" r="30" fill={fill} opacity="0.2" />
        <ellipse cx="32" cy="22" rx="11" ry="5" fill={fill} opacity="0.85" />
        <rect x="29" y="14" width="6" height="10" rx="1.5" fill={fill} opacity="0.8" />
        <circle cx="32" cy="36" r="6" fill={fill} />
        <path d="M24 48 Q32 44 40 48 L42 54 L22 54 Z" fill={fill} opacity="0.7" />
        <circle cx="46" cy="42" r="3" fill={fill} opacity="0.5" />
      </svg>
    );
  }
  return null;
}

function SpotButton({ s, active, visited, pulsing, onClick, isNight, t, fontScale }) {
  return (
    <button onClick={onClick}
      style={{
        background: active
          ? `${C.jeok}33`
          : visited
            ? (isNight ? 'rgba(212,160,23,0.10)' : 'rgba(200,57,44,0.08)')
            : (isNight ? 'rgba(255,255,255,0.04)' : 'rgba(255,253,247,0.55)'),
        color: t.text,
        border: active ? `1.5px solid ${C.jeok}` : `1px solid ${t.panelBorder}`,
        padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
        fontSize: 11.5 * fontScale, textAlign: 'left', position: 'relative',
        fontFamily: 'inherit',
        animation: pulsing ? 'stamp 0.6s cubic-bezier(.2,.9,.3,1.4)' : 'none',
        transition: 'background 0.2s',
      }}>
      <div style={{ fontWeight: 700, fontSize: 12 * fontScale }}>{s.name}</div>
      <div style={{ fontSize: 10 * fontScale, opacity: 0.65, marginTop: 1 }}>{s.desc}</div>
      {visited && (
        <div style={{
          position: 'absolute', top: 4, right: 6,
          width: 16, height: 16, borderRadius: '50%',
          background: C.jeok, color: '#fff',
          fontSize: 10, fontWeight: 800, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          animation: pulsing ? 'stamp-mark 0.7s ease' : 'none',
          boxShadow: `0 0 0 2px ${isNight ? C.heuk : C.baek}`,
        }}>✓</div>
      )}
    </button>
  );
}

function Pill({ label, value, done }) {
  return (
    <div style={{
      flex: 1, padding: 12, borderRadius: 10,
      background: done ? C.green : '#f5e6c8',
      color: done ? '#fff' : C.ink, textAlign: 'center', fontSize: 12, fontWeight: 600,
    }}>
      <div style={{ fontSize: 11, opacity: 0.85 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{value} {done && '✓'}</div>
    </div>
  );
}

function Modal({ onClose, children }) {
  return (
    <div onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: 16, backdropFilter: 'blur(4px)',
      }}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: '#fffaf0', color: C.ink, borderRadius: 18, padding: 28,
          maxWidth: 440, width: '100%', boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
          border: `2px solid ${C.jeok}33`, position: 'relative',
          fontFamily: 'inherit',
        }}>
        {children}
      </div>
    </div>
  );
}

function HanjiOverlay({ isNight }) {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: isNight ? 0.05 : 0.12,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.25 0 0 0 0 0.1 0 0 0 0.55 0'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>")`,
      mixBlendMode: 'multiply',
    }} />
  );
}

function Stars() {
  const stars = useMemo(() => Array.from({ length: 70 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 65,
    s: Math.random() * 1.6 + 0.5,
    d: Math.random() * 3 + 1.2,
    o: Math.random() * 0.6 + 0.3,
  })), []);
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {stars.map((st, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${st.x}%`, top: `${st.y}%`,
          width: st.s, height: st.s, background: '#fff', borderRadius: '50%',
          opacity: st.o, animation: `twinkle ${st.d}s ease-in-out infinite`,
          boxShadow: '0 0 4px rgba(255,255,255,0.85)',
        }} />
      ))}
    </div>
  );
}

function Fireworks() {
  const sparks = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    angle: (i / 22) * 360,
    delay: Math.random() * 0.2,
  })), []);
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', width: 4, height: 4 }}>
        {sparks.map((sp, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0, width: 6, height: 6, borderRadius: '50%',
            background: i % 3 === 0 ? C.jeok : i % 3 === 1 ? C.hwang : C.cheong,
            transform: `rotate(${sp.angle}deg) translateY(0)`,
            animation: `spark 1s ease-out ${sp.delay}s forwards`,
            boxShadow: '0 0 6px currentColor',
          }} />
        ))}
      </div>
    </div>
  );
}

function Watermark() {
  return (
    <div style={{
      position: 'fixed', bottom: 8, right: 12, zIndex: 5,
      fontSize: 9, color: 'rgba(150,130,100,0.6)', fontFamily: '"Noto Serif KR",serif',
      letterSpacing: 0.5, pointerEvents: 'none', userSelect: 'none',
    }}>
      박용환 · 2026 남원시 시정발전 제안
    </div>
  );
}

function GlobalKeyframes() {
  return (
    <style>{`
      @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
      @keyframes pulse {
        0%,100% { box-shadow: 0 0 0 0 currentColor; }
        50% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
      }
      @keyframes persona-in {
        from { opacity: 0; transform: translateY(8px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes stamp {
        0% { transform: scale(1); }
        30% { transform: scale(0.94); }
        60% { transform: scale(1.04) rotate(-1deg); }
        100% { transform: scale(1) rotate(0); }
      }
      @keyframes stamp-mark {
        0% { transform: scale(0) rotate(-30deg); opacity: 0; }
        60% { transform: scale(1.4) rotate(8deg); opacity: 1; }
        100% { transform: scale(1) rotate(0); opacity: 1; }
      }
      @keyframes spark {
        0% { transform: rotate(var(--a,0deg)) translateY(0) scale(1); opacity: 1; }
        100% { transform: rotate(var(--a,0deg)) translateY(-120px) scale(0.3); opacity: 0; }
      }
      @keyframes unfold {
        0% { transform: scaleY(0.05) scaleX(0.6); opacity: 0; }
        50% { transform: scaleY(1.05) scaleX(1) ; opacity: 1; }
        100% { transform: scaleY(1) scaleX(1); opacity: 1; }
      }
      .dot-anim { animation: dot 1.4s steps(3,end) infinite; letter-spacing: 1px; }
      @keyframes dot {
        0%,33% { color: rgba(150,130,100,0.4); }
        34%,66% { color: rgba(150,130,100,0.7); }
        67%,100% { color: rgba(150,130,100,1); }
      }
      @media (max-width: 480px) {
        .persona-grid { grid-template-columns: repeat(2,1fr) !important; }
      }
    `}</style>
  );
}
