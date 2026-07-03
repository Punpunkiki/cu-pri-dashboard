// CU-PRI · LINE Messaging API webhook (Vercel Edge Function)
//
// Handles rich-menu POSTBACK taps and new-follower events with branded Flex cards.
// Plain text keywords are intentionally ignored here — those are answered by the
// OA Manager keyword auto-replies (the rich-message cards), so we never double-reply.
//
// Secrets are read from environment variables (set these in Vercel → Project → Settings → Environment Variables):
//   LINE_CHANNEL_SECRET        — Messaging API channel secret
//   LINE_CHANNEL_ACCESS_TOKEN  — long-lived channel access token
//
// Endpoint (after deploy): https://cu-pri-dashboard.vercel.app/api/webhook

export const config = { runtime: 'edge' };

const DASH = 'https://cu-pri-dashboard.vercel.app';
const PINK = '#E8578D';
const DARK = '#1C1B23';
const enc = new TextEncoder();

// --- LINE request signature verification (HMAC-SHA256, base64) ---
async function validSignature(secret, rawBody, signature) {
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

async function reply(token, replyToken, messages) {
  const res = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) console.error('LINE reply failed', res.status, await res.text());
}

// --- Flex cards ---
function linkFooter(label, uri, color) {
  return {
    type: 'box', layout: 'vertical', paddingAll: '16px',
    contents: [{ type: 'button', style: 'primary', color, height: 'sm',
      action: { type: 'uri', label, uri } }],
  };
}

function weeklyFlex() {
  const row = (k, v, vc) => ({ type: 'box', layout: 'baseline', contents: [
    { type: 'text', text: k, size: 'sm', color: '#8A8A93', flex: 6 },
    { type: 'text', text: v, size: 'sm', weight: 'bold', color: vc, flex: 3, align: 'end' }] });
  return {
    type: 'flex',
    altText: '📊 สรุปผู้บริหารรายสัปดาห์: COP +8.2% · ประหยัด ฿186,400 · ป้องกัน 42.8 tCO2e',
    contents: { type: 'bubble', size: 'mega',
      header: { type: 'box', layout: 'vertical', backgroundColor: PINK, paddingAll: '16px', contents: [
        { type: 'text', text: '📊 สรุปผู้บริหารรายสัปดาห์', color: '#FFFFFF', weight: 'bold', size: 'lg' },
        { type: 'text', text: '23–29 มิ.ย. 2569 · อาคารนำร่อง 8 เครื่อง · CU-PRI', color: '#FBDCE9', size: 'xs', margin: 'sm' }] },
      body: { type: 'box', layout: 'vertical', spacing: 'sm', paddingAll: '16px', contents: [
        row('ประสิทธิภาพ COP เฉลี่ย', '+8.2%', '#1B9E77'),
        row('ชั่วโมงฉุกเฉินที่หลีกเลี่ยงได้', '14 ชม.', '#1F1F26'),
        row('ประหยัดค่าไฟ + ค่าซ่อม', '฿186,400', '#1F1F26'),
        row('ป้องกันการปล่อย (เดือนนี้)', '42.8 tCO2e', '#1B9E77'),
        { type: 'separator', margin: 'md' },
        { type: 'text', text: 'สถานะ: 🟢 ปกติ 6 · 🟡 เฝ้าระวัง 1 · 🔴 วิกฤต 1', size: 'xs', color: '#8A8A93', wrap: true, margin: 'md' }] },
      footer: linkFooter('เปิดแดชบอร์ดผู้บริหาร', `${DASH}/?view=executive`, PINK) },
  };
}

function alertsFlex() {
  const alert = (dot, title, tc, l1, l2) => [
    { type: 'box', layout: 'baseline', spacing: 'sm', contents: [
      { type: 'text', text: dot, flex: 0, size: 'sm' },
      { type: 'text', text: title, weight: 'bold', color: tc, size: 'sm', wrap: true }] },
    { type: 'text', text: l1, size: 'xs', color: '#1F1F26', wrap: true, margin: 'sm' },
    { type: 'text', text: l2, size: 'xs', color: '#8A8A93', wrap: true }];
  return {
    type: 'flex',
    altText: '🔔 การแจ้งเตือนที่ใช้งานอยู่ (2): CH-MED-01 ยืนยันการรั่ว · CH-SCI-02 เฝ้าระวัง',
    contents: { type: 'bubble', size: 'mega',
      header: { type: 'box', layout: 'vertical', backgroundColor: DARK, paddingAll: '16px', contents: [
        { type: 'text', text: '🔔 การแจ้งเตือนที่ใช้งานอยู่ (2)', color: '#FFFFFF', weight: 'bold', size: 'lg' },
        { type: 'text', text: 'เรียงตามความรุนแรง', color: '#C9C9CE', size: 'xs', margin: 'sm' }] },
      body: { type: 'box', layout: 'vertical', spacing: 'md', paddingAll: '16px', contents: [
        ...alert('🔴', 'CH-MED-01 · คณะแพทยศาสตร์', '#DC2626', 'ยืนยันการรั่ว (ท่อทางดูด) · NDIR 36 ppm', 'WO-2569-0142 · กำลังดำเนินการ'),
        { type: 'separator', margin: 'md' },
        ...alert('🟡', 'CH-SCI-02 · คณะวิทยาศาสตร์', '#B45309', 'Micro-leak เฝ้าระวัง · Confidence 68/100', 'รอ Cross-validation จาก NDIR')] },
      footer: linkFooter('เปิดแดชบอร์ด', `${DASH}/?view=dashboard`, DARK) },
  };
}

function statusFlex() {
  const rows = [
    ['🔴', 'CH-MED-01', 'คณะแพทยศาสตร์', 'NDIR 36 ppm', '#DC2626'],
    ['🟡', 'CH-SCI-02', 'คณะวิทยาศาสตร์', 'Conf. 68', '#B45309'],
    ['🟢', 'CH-MED-02', 'คณะแพทยศาสตร์', 'COP 5.3', '#1B9E77'],
    ['🟢', 'CH-SCI-01', 'คณะวิทยาศาสตร์', 'COP 5.1', '#1B9E77'],
    ['🟢', 'CH-ENG-01', 'คณะวิศวกรรมศาสตร์', 'COP 5.4', '#1B9E77'],
    ['🟢', 'VRF-CJ9-01', 'อาคารจามจุรี 9', 'COP 4.9', '#1B9E77'],
    ['🟢', 'CH-LIB-01', 'หอสมุดกลาง', 'COP 5.2', '#1B9E77'],
    ['🟢', 'CH-MCS-01', 'มหาจักรีสิรินธร', 'COP 5.0', '#1B9E77'],
  ].map(([dot, id, fac, val, vc]) => ({ type: 'box', layout: 'baseline', spacing: 'sm', contents: [
    { type: 'text', text: dot, flex: 0, size: 'xs' },
    { type: 'text', text: id, size: 'xs', color: '#1F1F26', weight: 'bold', flex: 4 },
    { type: 'text', text: val, size: 'xs', color: vc, align: 'end', flex: 3 }] }));
  return {
    type: 'flex',
    altText: '🏢 สถานะอาคารนำร่อง · 8 เครื่อง · 6 อาคาร',
    contents: { type: 'bubble', size: 'mega',
      header: { type: 'box', layout: 'vertical', backgroundColor: DARK, paddingAll: '16px', contents: [
        { type: 'text', text: '🏢 สถานะอาคารนำร่อง', color: '#FFFFFF', weight: 'bold', size: 'lg' },
        { type: 'text', text: '8 เครื่อง · 6 อาคาร', color: '#C9C9CE', size: 'xs', margin: 'sm' }] },
      body: { type: 'box', layout: 'vertical', spacing: 'sm', paddingAll: '16px', contents: rows },
      footer: linkFooter('เปิดแดชบอร์ด', `${DASH}/?view=dashboard`, DARK) },
  };
}

function welcomeFlex() {
  return {
    type: 'flex',
    altText: 'ยินดีต้อนรับสู่ CU-PRI · ระบบเฝ้าระวังการรั่วไหลของสารทำความเย็นอัจฉริยะ',
    contents: { type: 'bubble', size: 'mega',
      header: { type: 'box', layout: 'vertical', backgroundColor: PINK, paddingAll: '16px', contents: [
        { type: 'text', text: 'ยินดีต้อนรับสู่ CU-PRI', color: '#FFFFFF', weight: 'bold', size: 'lg' },
        { type: 'text', text: 'Predictive Refrigerant Intelligence', color: '#FBDCE9', size: 'xs', margin: 'sm' }] },
      body: { type: 'box', layout: 'vertical', spacing: 'sm', paddingAll: '16px', contents: [
        { type: 'text', text: 'ระบบเฝ้าระวังการรั่วไหลของสารทำความเย็น สำหรับอาคารนำร่องจุฬาฯ', size: 'sm', color: '#1F1F26', wrap: true },
        { type: 'text', text: 'ใช้เมนูด้านล่างเพื่อดูแดชบอร์ด การแจ้งเตือน รายงานสรุป และสถานะอาคาร', size: 'xs', color: '#8A8A93', wrap: true, margin: 'md' }] },
      footer: linkFooter('เปิดแดชบอร์ด', `${DASH}/?view=dashboard`, PINK) },
  };
}

export default async function handler(req) {
  if (req.method === 'GET') return new Response('CU-PRI LINE webhook is live.', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const secret = process.env.LINE_CHANNEL_SECRET;
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const rawBody = await req.text();
  const signature = req.headers.get('x-line-signature');

  if (!(await validSignature(secret, rawBody, signature))) {
    return new Response('Invalid signature', { status: 401 });
  }

  let payload = {};
  try { payload = JSON.parse(rawBody || '{}'); } catch { /* verify pings send empty body */ }
  const events = payload.events || [];

  await Promise.all(events.map(async (event) => {
    try {
      if (event.type === 'follow') {
        await reply(token, event.replyToken, [welcomeFlex()]);
        return;
      }
      if (event.type === 'postback') {
        const p = new URLSearchParams(event.postback?.data || '');
        const menu = p.get('menu');
        const action = p.get('action');
        if (menu === 'weekly') return reply(token, event.replyToken, [weeklyFlex()]);
        if (menu === 'alerts') return reply(token, event.replyToken, [alertsFlex()]);
        if (menu === 'status') return reply(token, event.replyToken, [statusFlex()]);
        if (action === 'enroute') {
          const asset = p.get('asset') || '';
          return reply(token, event.replyToken, [{ type: 'text',
            text: `รับทราบ ✅ บันทึกแล้วว่าทีมช่างกำลังเข้าพื้นที่ ${asset}` }]);
        }
      }
      // message / other events: ignored on purpose (OA keyword auto-replies handle text)
    } catch (e) {
      console.error('event handling error', e);
    }
  }));

  return new Response('OK', { status: 200 });
}
