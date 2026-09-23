import QRCode from 'qrcode';

const root = document.getElementById('smm-topup');
if (root) start(root);
async function start(root) {
  const el = id => root.querySelector(`#topup-${id}`);
  const api = root.dataset.api?.replace(/\/$/, '');
  let username, intent, timer, storageKey, busy = false, stopped = false;
  let token, tokenAt = 0;
  let requestKey, requestAmount;
  const status = message => { el('status').textContent = message; };
  const money = amount => Number(amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const readSaved = () => { try { return JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch { return {}; } };
  const save = value => { try { sessionStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* May be disabled by browser. */ } };
  async function call(path, options = {}) {
    if (!token || Date.now() - tokenAt > 240000) {
      if (typeof window.SMMTopupGetToken !== 'function') throw new Error('ยังไม่ได้เชื่อมระบบยืนยันผู้ใช้ กรุณาติดต่อแอดมิน');
      token = await window.SMMTopupGetToken(); tokenAt = Date.now();
      if (typeof token !== 'string' || !token) throw new Error('กรุณาเข้าสู่ระบบใหม่');
    }
    const response = await fetch(`${api}${path}`, { ...options, signal: AbortSignal.timeout(25000),
      headers: { ...options.headers, Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) token = null;
      const error = new Error(data.message || 'ระบบไม่พร้อม กรุณาตรวจสถานะรายการเดิม');
      error.status = response.status; throw error;
    }
    return data;
  }
  function setBusy(value) {
    busy = value;
    el('generate').disabled = value || !username;
    el('submit').disabled = value;
    el('refresh').disabled = value;
    el('new').disabled = value;
  }
  async function render(row) {
    intent = row;
    save({ id: row.id });
    el('create').hidden = true;
    el('reference').textContent = `รหัสรายการ: ${row.id}`;
    el('refresh').hidden = false;
    el('payment').hidden = row.status !== 'awaiting';
    el('new').hidden = !['completed', 'expired', 'failed'].includes(row.status);
    if (row.status === 'awaiting') {
      if (!row.qrCode) throw new Error('ไม่พบ QR กรุณาตรวจสถานะรายการเดิม');
      await QRCode.toCanvas(el('qr'), row.qrCode, { width: 320, margin: 4, errorCorrectionLevel: 'M' });
      el('pay-amount').textContent = `ยอดโอน ${money(row.amount)} บาท`;
      el('recipient').textContent = `ผู้รับ: ${row.accountName}`;
      el('expiry').textContent = `โปรดโอนและส่งสลิปก่อน ${new Date(row.expiresAt * 1000).toLocaleTimeString('th-TH')}`;
    }
    const messages = {
      creating: 'กำลังสร้าง QR กรุณารอสักครู่',
      awaiting: row.lastCode ? 'สลิปไม่ผ่านเงื่อนไข กรุณาตรวจบัญชีผู้รับ ยอด และเวลา แล้วส่งสลิปที่ถูกต้อง' : 'รอชำระเงินและอัปโหลดสลิป',
      verifying: 'กำลังตรวจสลิป กรุณารอโดยไม่ส่งซ้ำ',
      verified: 'ตรวจสลิปผ่านแล้ว กำลังเติมเครดิตและโบนัสที่ได้รับ',
      completed: `เติมสำเร็จ ${money(row.amount)} บาท${Number(row.bonus) ? ` พร้อมโบนัส ${money(row.bonus)} บาท` : ''} รีเฟรชหน้าเว็บเพื่อดูยอดคงเหลือ`,
      review: 'รายการอยู่ระหว่างตรวจสอบ กรุณาอย่าโอนซ้ำ ติดต่อแอดมินพร้อมรหัสรายการ',
      expired: 'รายการหมดอายุแล้ว หากโอนแล้วกรุณาติดต่อแอดมินพร้อมสลิป',
      failed: 'สร้าง QR ไม่สำเร็จ สามารถสร้างรายการใหม่ได้'
    };
    status(messages[row.status] || 'กรุณาตรวจสถานะรายการ');
    clearTimeout(timer);
    if (['creating', 'awaiting', 'verifying', 'verified'].includes(row.status) && !stopped) timer = setTimeout(refresh, row.status === 'awaiting' ? 30000 : 10000);
  }
  async function refresh() {
    if (!intent || busy || stopped) return;
    setBusy(true);
    try { await render(await call(`/api/intents/${intent.id}`)); }
    catch (error) { status(`${error.message} — กดตรวจสถานะรายการเดิมเพื่อลองอีกครั้ง`); }
    finally { setBusy(false); }
  }
  el('amount').addEventListener('input', () => {
    const amount = Number(el('amount').value);
    el('preview').textContent = amount >= 1000 ? `โบนัสประมาณ ${money(amount * .1)} บาท` : 'รับโบนัส 10% เมื่อเติมตั้งแต่ 1,000 บาท';
  });
  el('create').addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    const amount = el('amount').value;
    if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) < 50) return status('กรอกยอดขั้นต่ำ 50 บาท ทศนิยมไม่เกิน 2 ตำแหน่ง');
    if (requestAmount && requestAmount !== amount && requestKey) return status('มีรายการที่ยังไม่ทราบผล กรุณาลองสร้างด้วยยอดเดิมก่อน');
    requestKey ||= crypto.randomUUID(); requestAmount = amount;
    save({ requestKey, requestAmount });
    setBusy(true); status('กำลังสร้าง QR…');
    try { await render(await call('/api/intents', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey }, body: JSON.stringify({ amount }) })); }
    catch (error) {
      if (error.status === 400) { requestKey = null; requestAmount = null; save({}); status(error.message); }
      else status(`${error.message} — ลองอีกครั้งด้วยยอดเดิม ระบบจะใช้รหัสรายการเดิม`);
    }
    finally { setBusy(false); }
  });
  el('upload').addEventListener('submit', async event => {
    event.preventDefault(); if (busy || !intent) return;
    const file = el('file').files[0];
    if (!file || file.size > 5 * 1024 * 1024) return status('กรุณาเลือกสลิปขนาดไม่เกิน 5 MB');
    const form = new FormData(); form.append('file', file);
    setBusy(true); status('กำลังตรวจสลิป…');
    try { await render(await call(`/api/intents/${intent.id}/slip`, { method: 'POST', body: form })); }
    catch (error) { status(`${error.message} — กรุณาตรวจสถานะรายการเดิมก่อนส่งอีกครั้ง`); }
    finally { setBusy(false); }
  });
  el('refresh').addEventListener('click', refresh);
  el('save').addEventListener('click', () => {
    const link = document.createElement('a'); link.download = `promptpay-${intent.id}.png`;
    link.href = el('qr').toDataURL('image/png'); link.click();
  });
  el('new').addEventListener('click', () => {
    clearTimeout(timer); intent = null; requestKey = null; requestAmount = null; save({});
    el('create').hidden = false; el('payment').hidden = true; el('refresh').hidden = true; el('new').hidden = true;
    el('reference').textContent = ''; el('file').value = ''; status('กรอกยอดเพื่อสร้างรายการใหม่');
  });
  window.addEventListener('pagehide', () => { stopped = true; clearTimeout(timer); });
  window.addEventListener('pageshow', () => { stopped = false; if (intent) refresh(); });
  try {
    if (!api?.startsWith('https://') || api.includes('YOUR-WORKER')) throw new Error('ยังไม่ได้ตั้งค่า URL ระบบเติมเงิน');
    const me = await call('/api/me');
    const names = [...document.querySelectorAll('h2.totals-block__count-value.style-text-primary')]
      .map(node => node.textContent.trim()).filter(name => /^[0-9a-zA-Z_@.\-]{1,100}$/.test(name));
    if (!names.includes(me.username)) throw new Error('ชื่อผู้ใช้บนหน้าเว็บไม่ตรงกับบัญชีที่ยืนยัน กรุณาเข้าสู่ระบบใหม่');
    username = me.username; storageKey = `smm-topup:${api}:${username}`;
    el('username').textContent = username; el('amount').disabled = false; el('generate').disabled = false;
    const saved = readSaved();
    if (saved.id) {
      intent = { id: saved.id }; el('create').hidden = true; el('refresh').hidden = false;
      await refresh();
    } else {
      requestKey = saved.requestKey; requestAmount = saved.requestAmount;
      if (requestAmount) el('amount').value = requestAmount;
      status('กรอกจำนวนเงินเพื่อสร้าง QR PromptPay');
    }
  } catch (error) { status(error.message); }
}
