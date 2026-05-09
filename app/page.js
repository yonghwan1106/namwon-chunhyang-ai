'use client';
import { useState, useRef, useEffect, useMemo } from 'react';

const PERSONAS = [
  {
    id: 'chunhyang', name: '춘향', emoji: '🌸', tone: '서정적', color: '#e84a8a',
    voice: { pitch: 1.25, rate: 0.92, gender: 'female' },
    sys: '너는 광한루의 「춘향」이다. 16세 양반가 규수의 정중하고 서정적인 말투. 이몽룡과의 사랑·그네·오작교를 제 일처럼 이야기한다. 사용자가 외국어로 물으면 그 언어로 답한다. 답변은 3~5문장.',
  },
  {
    id: 'mongryong', name: '이몽룡', emoji: '🎓', tone: '낭만·올곧음', color: '#3a7bc8',
    voice: { pitch: 0.85, rate: 0.95, gender: 'male' },
    sys: '너는 「이몽룡」이다. 남원부사의 아들, 한양 과거 급제 후 암행어사. 낭만적이면서도 정의로운 어조. 광한루를 추억의 장소로 회상한다. 사용자 언어에 맞춰 답변. 답변은 3~5문장.',
  },
  {
    id: 'hyangdan', name: '향단', emoji: '🌿', tone: '현지 안내', color: '#2c8b4f',
    voice: { pitch: 1.1, rate: 1.0, gender: 'female' },
    sys: '너는 춘향의 시녀 「향단」이다. 정겹고 똑부러진 현지 안내자 어투. 광한루·요천변·추어탕거리 등 실용 정보(시간·교통·맛집)를 친근하게 알려준다. 사용자 언어에 맞춰 답변. 답변은 3~5문장.',
  },
  {
    id: 'bangja', name: '방자', emoji: '🍶', tone: '유머·재치', color: '#c8902a',
    voice: { pitch: 0.95, rate: 1.05, gender: 'male' },
    sys: '너는 이몽룡의 종 「방자」다. 능청·해학·재치가 넘치는 사투리. 광한루 일화를 코믹하게 풀되 정보는 정확. 답변은 3~5문장.',
  },
];

const SPOTS = [
  { id: 'gwanghallu', name: '광한루', desc: '본루(本樓), 호남제일루', icon: '🏛️' },
  { id: 'ojakgyo', name: '오작교', desc: '견우직녀의 다리', icon: '🌉' },
  { id: 'wanwoljeong', name: '완월정', desc: '달 감상의 정자', icon: '🌙' },
  { id: 'chunhyangsadang', name: '춘향사당', desc: '춘향의 영정', icon: '⛩️' },
  { id: 'wolmaejip', name: '월매집', desc: '춘향 어머니의 집', icon: '🏠' },
  { id: 'yochon', name: '요천 야경교', desc: '야간 라이팅 명소', icon: '✨' },
  { id: 'theme1', name: '테마파크 ①만남길', desc: '몽룡·춘향의 첫 만남', icon: '🌳' },
  { id: 'theme2', name: '테마파크 ②맹약길', desc: '백년가약', icon: '💍' },
  { id: 'theme3', name: '테마파크 ③별리길', desc: '눈물의 이별', icon: '💧' },
  { id: 'theme4', name: '테마파크 ④시련길', desc: '변학도와의 갈등', icon: '⚔️' },
  { id: 'theme5', name: '테마파크 ⑤축제길', desc: '재회와 축제', icon: '🎉' },
  { id: 'chueotang', name: '추어탕거리', desc: '남원 대표 미식 동선', icon: '🍲' },
];

const QUIZZES = {
  gwanghallu: [
    { q: '광한루를 처음 지은 정승의 이름은?', options: ['황희', '정도전', '맹사성'], correct: 0 },
    { q: '광한루의 보물 지정 번호는?', options: ['281호', '180호', '500호'], correct: 0 },
  ],
  ojakgyo: [
    { q: '오작교에서 만난다는 두 별의 이름은?', options: ['견우와 직녀', '동방과 북두', '삼신과 칠성'], correct: 0 },
    { q: '오작교를 잇는 새로 알려진 동물은?', options: ['까치', '제비', '참새'], correct: 0 },
  ],
  wanwoljeong: [
    { q: '완월정(玩月亭)에서 즐기는 것은?', options: ['달맞이', '꽃놀이', '뱃놀이'], correct: 0 },
  ],
  chunhyangsadang: [
    { q: '춘향사당이 건립된 연도는?', options: ['1931년', '1850년', '1995년'], correct: 0 },
    { q: '춘향제는 매년 음력 몇 월 며칠?', options: ['5월 5일', '8월 15일', '3월 3일'], correct: 0 },
  ],
  wolmaejip: [
    { q: '월매는 누구의 어머니인가?', options: ['춘향', '향단', '월선'], correct: 0 },
  ],
  yochon: [
    { q: '요천 야경교에서 볼 수 있는 것은?', options: ['라이팅과 분수쇼', '폭포', '얼음 조각'], correct: 0 },
  ],
  theme1: [
    { q: '몽룡과 춘향의 첫 만남이 이뤄진 곳은?', options: ['그네터', '서당', '마을 우물'], correct: 0 },
  ],
  theme2: [
    { q: '맹약길에서 두 사람이 맺은 약속은?', options: ['백년가약', '의형제', '학문 교류'], correct: 0 },
  ],
  theme3: [
    { q: '몽룡이 한양으로 떠나며 걷는 길의 이름은?', options: ['별리길', '귀로', '청춘길'], correct: 0 },
  ],
  theme4: [
    { q: '시련길에서 춘향에게 수청을 강요한 인물은?', options: ['변학도', '월매', '향단'], correct: 0 },
  ],
  theme5: [
    { q: '축제길에서 어사가 된 인물은?', options: ['이몽룡', '방자', '변학도'], correct: 0 },
  ],
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

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (accessMode !== 'voice' || msgs.length === 0) return;
    const lastIdx = msgs.length - 1;
    const last = msgs[lastIdx];
    if (last && last.role === 'assistant' && !last.type) {
      speak(last.content, lastIdx);
    }
  }, [msgs.length, accessMode]);

  useEffect(() => {
    if (stamps.size >= 3 && quizScore >= 5 && !coupon) {
      const code = `NW${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setCoupon({ code, amount: 1000, place: '추어탕거리·전통시장' });
    }
  }, [stamps.size, quizScore, coupon]);

  function pickSpot(s) {
    setSpot(s);
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
          persona: persona.id,
          spot: spot?.id,
          night: isNight,
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
    if (ok) setQuizScore(s => Math.min(s + 1, 5));
    const reply = ok
      ? `정답이옵니다! 🌸 (퀴즈 ${Math.min(quizScore + 1, 5)}/5)`
      : `아쉽군요. 정답은 「${activeQuiz.options[activeQuiz.correct]}」였습니다.`;
    setMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
    setActiveQuiz(null);
  }

  const samples = spot ? [
    '이 장소 이야기 들려줘',
    'What is this place?',
    '가까운 맛집 추천해줘',
    isNight ? '야간 라이팅 포인트?' : '주변 동선 알려줘',
  ] : [];

  const theme = isNight ? {
    bgGrad: 'radial-gradient(ellipse at top,#1a1f4a 0%,#0a0e27 50%,#050817 100%)',
    panel: 'rgba(20,30,60,0.55)',
    panelBorder: 'rgba(180,200,255,0.15)',
    chatBg: 'rgba(0,0,0,0.4)',
    accent: '#a8c5ff',
    starOpacity: 1,
  } : {
    bgGrad: 'linear-gradient(180deg,#f7e8d3 0%,#e8c8a8 100%)',
    panel: 'rgba(255,255,255,0.65)',
    panelBorder: 'rgba(140,80,40,0.25)',
    chatBg: 'rgba(255,255,255,0.55)',
    accent: '#8b3a2a',
    starOpacity: 0,
  };

  const textColor = isNight ? '#fff' : '#3a2010';
  const subColor = isNight ? '#9fb3d9' : '#6b4520';

  return (
    <div style={{ minHeight: '100dvh', background: theme.bgGrad, color: textColor, transition: 'background 0.6s' }}>
      {isNight && <Stars />}

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '20px 14px 120px', fontSize: 16 * fontScale }}>
        <header style={{ textAlign: 'center', padding: '8px 0 18px', position: 'relative' }}>
          <div style={{ fontSize: 11 * fontScale, letterSpacing: 4, color: subColor, textTransform: 'uppercase' }}>
            Namwon · Gwanghallu · {isNight ? 'Night Mode' : 'Day Mode'}
          </div>
          <h1 style={{ fontSize: 28 * fontScale, margin: '6px 0 4px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            광한루 「춘향이 AI 도슨트」
          </h1>
          <p style={{ color: subColor, fontSize: 13 * fontScale, margin: 0 }}>
            QR 한 번이면 24시간 다국어 야간 음성투어 — 남원시 시정발전 제안 시연 (박용환)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {isNight && (
              <span style={{ fontSize: 11 * fontScale, padding: '4px 10px', borderRadius: 14, background: 'rgba(168,197,255,0.15)', color: '#a8c5ff', border: '1px solid rgba(168,197,255,0.4)' }}>
                🌙 오작교 별빛 모드 자동 활성화
              </span>
            )}
            <button onClick={() => setNightOverride(isNight ? false : true)}
              style={{ fontSize: 11 * fontScale, padding: '4px 10px', borderRadius: 14, background: 'transparent', color: subColor, border: `1px solid ${theme.panelBorder}`, cursor: 'pointer' }}>
              {isNight ? '☀ 낮 모드로' : '🌙 야간 모드로'}
            </button>
            {nightOverride !== null && (
              <button onClick={() => setNightOverride(null)}
                style={{ fontSize: 11 * fontScale, padding: '4px 10px', borderRadius: 14, background: 'transparent', color: subColor, border: `1px solid ${theme.panelBorder}`, cursor: 'pointer' }}>
                ↻ 자동
              </button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'normal', label: '♿ 일반' },
              { id: 'voice', label: '🔊 음성 우선' },
              { id: 'caption', label: '📺 자막 우선' },
            ].map(m => (
              <button key={m.id} onClick={() => { setAccessMode(m.id); if (m.id !== 'voice') stopSpeak(); }}
                style={{
                  fontSize: 11 * fontScale, padding: '4px 10px', borderRadius: 14,
                  background: accessMode === m.id ? theme.accent : 'transparent',
                  color: accessMode === m.id ? (isNight ? '#0a0e27' : '#fff') : subColor,
                  border: `1px solid ${accessMode === m.id ? theme.accent : theme.panelBorder}`,
                  cursor: 'pointer', fontWeight: accessMode === m.id ? 700 : 400,
                }}>
                {m.label}
              </button>
            ))}
            <button onClick={() => setShowMission(true)}
              style={{
                fontSize: 11 * fontScale, padding: '4px 10px', borderRadius: 14,
                background: coupon ? '#e84a8a' : 'rgba(232,74,138,0.15)',
                color: coupon ? '#fff' : '#e84a8a',
                border: `1px solid #e84a8a`, cursor: 'pointer', fontWeight: 700,
              }}>
              🎫 미션 {stamps.size}/3 · 퀴즈 {quizScore}/5{coupon ? ' ✅' : ''}
            </button>
          </div>
        </header>

        <Section title="① 페르소나 선택" theme={theme} subColor={subColor} fontScale={fontScale}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => setPersona(p)}
                style={{
                  background: persona.id === p.id ? p.color : (isNight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)'),
                  color: persona.id === p.id ? '#fff' : textColor,
                  border: persona.id === p.id ? `2px solid ${p.color}` : `1px solid ${theme.panelBorder}`,
                  padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                  fontSize: 13 * fontScale, fontWeight: 600, transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: 24 * fontScale }}>{p.emoji}</div>
                <div>{p.name}</div>
                <div style={{ fontSize: 10 * fontScale, opacity: 0.85, fontWeight: 400 }}>{p.tone}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="② 위치 선택 (QR 스캔 가정)" theme={theme} subColor={subColor} fontScale={fontScale}
          extra={<span style={{ fontSize: 11 * fontScale, color: subColor }}>{stamps.size}/12 방문</span>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {SPOTS.map(s => {
              const visited = stamps.has(s.id);
              const active = spot?.id === s.id;
              return (
                <button key={s.id} onClick={() => pickSpot(s)}
                  style={{
                    background: active
                      ? 'rgba(232,74,138,0.3)'
                      : visited
                        ? (isNight ? 'rgba(168,197,255,0.12)' : 'rgba(140,80,40,0.12)')
                        : (isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.4)'),
                    color: textColor,
                    border: active ? '1.5px solid #e84a8a' : `1px solid ${theme.panelBorder}`,
                    padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                    fontSize: 11.5 * fontScale, textAlign: 'left', position: 'relative',
                  }}>
                  <div style={{ fontSize: 16 * fontScale }}>{s.icon}</div>
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 10 * fontScale, opacity: 0.7 }}>{s.desc}</div>
                  {visited && (
                    <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 11 }}>✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        <Section
          title={<><span>③ 대화 — </span><b style={{ color: persona.color }}>{persona.emoji} {persona.name}</b>{spot && <span> · 📍 {spot.name}</span>}</>}
          theme={theme} subColor={subColor} fontScale={fontScale}
          extra={spot && (
            <button onClick={startQuiz} disabled={!!activeQuiz}
              style={{
                fontSize: 11 * fontScale, padding: '4px 10px', borderRadius: 14,
                background: activeQuiz ? 'rgba(140,140,140,0.25)' : 'rgba(232,74,138,0.2)',
                color: activeQuiz ? subColor : '#e84a8a',
                border: `1px solid ${activeQuiz ? theme.panelBorder : '#e84a8a'}`,
                cursor: activeQuiz ? 'not-allowed' : 'pointer', fontWeight: 600,
              }}>
              ❓ 퀴즈 도전
            </button>
          )}>
          <div ref={scrollRef} style={{
            minHeight: 240, maxHeight: 380, overflowY: 'auto',
            background: theme.chatBg, borderRadius: 10, padding: 12, marginBottom: 10,
          }}>
            {msgs.length === 0 && (
              <div style={{ color: subColor, fontSize: 13 * fontScale, padding: 20, textAlign: 'center' }}>
                위치를 먼저 선택해 주세요. 한국어 · English · 中文 · 日本語 입력 가능합니다.
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{ margin: '8px 0', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  background: m.role === 'user'
                    ? '#3a7bc8'
                    : (isNight ? 'rgba(255,255,255,0.13)' : 'rgba(140,80,40,0.12)'),
                  color: m.role === 'user' ? '#fff' : textColor,
                  padding: '10px 14px', borderRadius: 14,
                  fontSize: (accessMode === 'caption' ? 16 : 13.5) * fontScale,
                  lineHeight: 1.6, whiteSpace: 'pre-wrap', position: 'relative',
                }}>
                  {m.type === 'quiz' ? (
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>❓ {m.content}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {m.options.map((o, oi) => (
                          <button key={oi} onClick={() => activeQuiz && answerQuiz(oi)} disabled={!activeQuiz}
                            style={{
                              padding: '8px 12px', borderRadius: 10,
                              background: 'rgba(255,255,255,0.15)',
                              color: textColor, border: `1px solid ${theme.panelBorder}`,
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
                            marginTop: 6, padding: '2px 8px', fontSize: 11 * fontScale,
                            background: 'transparent', color: subColor,
                            border: `1px solid ${theme.panelBorder}`, borderRadius: 12, cursor: 'pointer',
                          }}>
                          {speakingIdx === i ? '⏹ 정지' : '🔊 듣기'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: subColor, fontSize: 12 * fontScale, padding: 6 }}>… {persona.name}이 답하는 중</div>}
          </div>

          {spot && samples.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {samples.map(s => (
                <button key={s} onClick={() => send(s)} disabled={loading}
                  style={{
                    background: isNight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)',
                    color: textColor, border: `1px solid ${theme.panelBorder}`,
                    padding: '5px 10px', borderRadius: 14, fontSize: 11.5 * fontScale, cursor: 'pointer',
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
                border: `1px solid ${theme.panelBorder}`,
                background: isNight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
                color: textColor, fontSize: 14 * fontScale, outline: 'none',
              }} />
            <button type="submit" disabled={!spot || loading || !input.trim()}
              style={{
                padding: '12px 20px', borderRadius: 24, border: 'none',
                background: persona.color, color: '#fff', fontWeight: 700,
                cursor: 'pointer', fontSize: 13 * fontScale,
                opacity: (!spot || loading || !input.trim()) ? 0.5 : 1,
              }}>
              전송
            </button>
          </form>
        </Section>

        <footer style={{ textAlign: 'center', color: subColor, fontSize: 11 * fontScale, marginTop: 24, lineHeight: 1.7 }}>
          모델: Claude Haiku 4.5 · TTS: 브라우저 SpeechSynthesis · 시연용<br />
          2026 상반기 남원시 시정발전 제안 (박용환) — 본 데모는 시연 목적이며, 발급되는 상품권은 모의 데이터입니다.
        </footer>
      </main>

      {showMission && (
        <Modal onClose={() => setShowMission(false)}>
          <h2 style={{ margin: '0 0 12px', fontSize: 22, color: '#3a2010' }}>🎫 광한루 미션 카드</h2>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b4520', lineHeight: 1.6 }}>
            행위 기반 인센티브 — 광한루 12개소 중 <b>3곳을 방문</b>하고 <b>퀴즈 5문제 정답</b> 시 추어탕거리·전통시장에서 사용 가능한 1,000원 상품권이 발급됩니다.
            <br /><br />
            <b style={{ color: '#c8392c' }}>※ 본 데모는 시뮬레이션입니다.</b> 실제 발급은 시범사업 채택 후 지역사랑상품권 시스템 연동으로 구현됩니다.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <Pill label="📍 위치 방문" value={`${stamps.size}/3`} done={stamps.size >= 3} />
            <Pill label="❓ 퀴즈 정답" value={`${quizScore}/5`} done={quizScore >= 5} />
          </div>
          {coupon ? (
            <div style={{ background: 'linear-gradient(135deg,#e84a8a,#c8392c)', color: '#fff', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 2 }}>SOUTH NAMWON COUPON</div>
              <div style={{ fontSize: 28, fontWeight: 800, margin: '6px 0' }}>₩ {coupon.amount.toLocaleString()}</div>
              <div style={{ fontSize: 13, marginBottom: 6 }}>{coupon.place}</div>
              <div style={{ fontSize: 16, fontFamily: 'monospace', letterSpacing: 2, padding: '6px 0', borderTop: '1px dashed rgba(255,255,255,0.5)' }}>
                {coupon.code}
              </div>
              <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>(시연용 모의 발급 — 실제 사용 불가)</div>
            </div>
          ) : (
            <div style={{ background: '#f5e6c8', color: '#6b4520', borderRadius: 12, padding: 16, textAlign: 'center', fontSize: 13 }}>
              미션 진행 중입니다. 더 많은 장소를 방문하고 퀴즈에 도전해 보세요!
            </div>
          )}
          <button onClick={() => setShowMission(false)}
            style={{ width: '100%', marginTop: 14, padding: '10px', borderRadius: 8, border: 'none', background: '#3a2010', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            닫기
          </button>
        </Modal>
      )}
    </div>
  );
}

function Section({ title, theme, subColor, fontScale, extra, children }) {
  return (
    <section style={{
      background: theme.panel, borderRadius: 16, padding: 16, marginBottom: 14,
      border: `1px solid ${theme.panelBorder}`, backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontSize: 12 * fontScale, color: subColor, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>{title}</div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function Pill({ label, value, done }) {
  return (
    <div style={{
      flex: 1, padding: 10, borderRadius: 10,
      background: done ? '#2c8b4f' : '#f5e6c8',
      color: done ? '#fff' : '#6b4520', textAlign: 'center', fontSize: 12, fontWeight: 600,
    }}>
      <div style={{ fontSize: 11, opacity: 0.85 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{value} {done && '✅'}</div>
    </div>
  );
}

function Modal({ onClose, children }) {
  return (
    <div onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16,
      }}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', color: '#3a2010', borderRadius: 16, padding: 24,
          maxWidth: 420, width: '100%', boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
        }}>
        {children}
      </div>
    </div>
  );
}

function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 60,
      s: Math.random() * 1.5 + 0.5,
      d: Math.random() * 3 + 1,
      o: Math.random() * 0.6 + 0.3,
    }));
  }, []);
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((st, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${st.x}%`, top: `${st.y}%`,
          width: st.s, height: st.s, background: '#fff', borderRadius: '50%',
          opacity: st.o, animation: `twinkle ${st.d}s ease-in-out infinite`,
          boxShadow: '0 0 4px rgba(255,255,255,0.8)',
        }} />
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:0.2}50%{opacity:1}}`}</style>
    </div>
  );
}
