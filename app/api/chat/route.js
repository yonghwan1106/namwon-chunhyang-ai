import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const PERSONA_SYS = {
  chunhyang: '너는 광한루의 「춘향」이다. 16세 양반가 규수의 정중하고 서정적인 말투. 이몽룡과의 사랑·그네·오작교를 제 일처럼 이야기한다. 사용자가 외국어로 물으면 그 언어로 답한다. 답변은 3~5문장.',
  mongryong: '너는 「이몽룡」이다. 남원부사의 아들, 한양 과거 급제 후 암행어사. 낭만적이면서도 정의로운 어조. 광한루를 추억의 장소로 회상한다. 사용자 언어에 맞춰 답변. 답변은 3~5문장.',
  hyangdan: '너는 춘향의 시녀 「향단」이다. 정겹고 똑부러진 현지 안내자 어투. 광한루·요천변·추어탕거리 등 실용 정보(시간·교통·맛집)를 친근하게 알려준다. 사용자 언어에 맞춰 답변. 답변은 3~5문장.',
  bangja: '너는 이몽룡의 종 「방자」다. 능청·해학·재치가 넘치는 사투리. 광한루 일화를 코믹하게 풀되 정보는 정확. 답변은 3~5문장.',
};

const SPOT_HINT = {
  gwanghallu: '광한루 본루 — 호남제일루, 1419년 황희 정승 창건, 보물 281호.',
  ojakgyo: '오작교 — 광한루 앞 다리, 견우직녀 전설 모티프, 광한루원 백미.',
  wanwoljeong: '완월정 — 달맞이 정자.',
  chunhyangsadang: '춘향사당 — 1931년 건립, 매년 음력 5월 5일 춘향제 거행.',
  wolmaejip: '월매집 — 춘향 어머니 월매가 살던 집의 재현.',
  yochon: '요천 야경교 — 야간 라이팅과 분수쇼 명소.',
  theme1: '춘향테마파크 만남길 — 첫 만남 그네터.',
  theme2: '춘향테마파크 맹약길 — 백년가약을 맺는 길.',
  theme3: '춘향테마파크 별리길 — 한양으로 떠나는 이별 길.',
  theme4: '춘향테마파크 시련길 — 변학도 수청 강요 시련.',
  theme5: '춘향테마파크 축제길 — 어사 출두 후 재회와 축제.',
  chueotang: '추어탕거리 — 남원 대표 미식 동선, 새집·현식당·부산집 등 노포 다수.',
};

function detectLang(text) {
  if (!text) return 'ko';
  if (/[぀-ヿ]/.test(text)) return 'ja';
  if (/[一-鿿]/.test(text) && !/[가-힯]/.test(text)) return 'zh';
  if (/[가-힯]/.test(text)) return 'ko';
  if (/[a-zA-Z]/.test(text)) return 'en';
  return 'ko';
}

const LANG_RULE = {
  ko: '[언어 규칙] 사용자가 한국어로 물었다. 한국어로 답하라.',
  en: '[LANGUAGE RULE — STRICT] The user wrote in English. You MUST respond in English. Stay in character but write every word in English. Do not mix Korean.',
  zh: '[语言规则 — 严格] 用户使用中文提问。你必须用中文回答。保持角色设定，但每一个字都必须是中文。不要混用韩语。',
  ja: '[言語ルール — 厳守] ユーザーは日本語で質問しました。必ず日本語で答えてください。キャラクター設定は保ちつつ、すべて日本語で書くこと。韓国語を混ぜないでください。',
};

export async function POST(req) {
  try {
    const { persona, spot, night, messages } = await req.json();
    let sys = PERSONA_SYS[persona] || PERSONA_SYS.chunhyang;
    if (spot) sys += `\n\n[현재 위치 정보] ${SPOT_HINT[spot] || ''}`;
    if (night) sys += '\n\n[현재 시간대] 야간이다. 광한루의 별빛·달빛·라이팅을 자연스럽게 묘사에 녹이고, 야간 동선(요천 야경교·완월정 달맞이·테마파크 야간 라이팅)을 우선 추천하라.';
    else sys += '\n\n[현재 시간대] 주간이다. 산책 동선·전통시장·추어탕거리 등 낮 활동을 우선 추천하라.';

    const lastUser = [...(messages || [])].reverse().find(m => m.role === 'user');
    const lang = detectLang(lastUser?.content);
    sys += '\n\n' + LANG_RULE[lang];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({
        text: '(시연 모드) ANTHROPIC_API_KEY가 설정되지 않았습니다.\n\n실제 배포 시: 광한루는 1419년 황희 정승이 창건한 호남제일루로, 보물 281호입니다. 오작교 위에서 견우직녀 전설을 떠올리며 거니실 수 있습니다.',
      });
    }

    const client = new Anthropic({ apiKey });
    const r = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: sys,
      messages: (messages || [])
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
    });
    const text = r.content?.map(b => b.type === 'text' ? b.text : '').join('') || '';
    return Response.json({ text });
  } catch (e) {
    console.error(e);
    return Response.json({ text: `오류: ${e?.message || 'unknown'}` }, { status: 500 });
  }
}
