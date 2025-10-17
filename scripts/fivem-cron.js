/*
 * FiveM 監控紀錄腳本：每分鐘抓取一次並寫入 JSONL
 * 使用方式：npm run fivem:cron（需先執行 npm run dev 啟動本地 API）
 */

const fs = require('fs');
const path = require('path');

const BASE = process.env.FIVEM_API_BASE || 'http://localhost:3000';
const TICK_MS = 60_000; // 1 minute
const OUT_DIR = path.join(process.cwd(), 'data', 'fivem');
const DAILY_DIR = path.join(process.cwd(), 'data', 'fivem', 'daily-max');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function dateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function getServers() {
  const url = `${BASE}/api/fivem/servers`;
  const res = await fetchJSON(url);
  const arr = Array.isArray(res) ? res : (Array.isArray(res?.servers) ? res.servers : []);
  if (!Array.isArray(arr)) throw new Error('servers response is not an array');
  return arr;
}

function normalizeCount(obj) {
  // 支援多種欄位：clients | players | PlayerCount | playersCount | online
  const keys = ['clients', 'players', 'PlayerCount', 'playersCount', 'online'];
  for (const k of keys) {
    if (typeof obj[k] === 'number') return obj[k];
  }
  return 0;
}

async function getPlayers(id) {
  const url = `${BASE}/api/fivem/players?id=${encodeURIComponent(id)}`;
  const data = await fetchJSON(url);
  const players = normalizeCount(data);
  const maxPlayers = typeof data['sv_maxclients'] === 'number' ? data['sv_maxclients'] : (typeof data['MaxPlayers'] === 'number' ? data['MaxPlayers'] : undefined);
  return { players, maxPlayers, raw: data };
}

function writeSnapshot(record) {
  ensureDir(OUT_DIR);
  const file = path.join(OUT_DIR, `${dateStr()}.jsonl`);
  const line = JSON.stringify(record);
  fs.appendFileSync(file, line + '\n');
}

function readDailyMaxMap(date) {
  ensureDir(DAILY_DIR);
  const file = path.join(DAILY_DIR, `${date}.json`);
  if (!fs.existsSync(file)) return {};
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read daily max file', e);
    return {};
  }
}

function writeDailyMaxMap(date, map) {
  ensureDir(DAILY_DIR);
  const file = path.join(DAILY_DIR, `${date}.json`);
  fs.writeFileSync(file, JSON.stringify(map, null, 2));
}

async function tick(servers) {
  const ts = new Date().toISOString();
  const date = dateStr(new Date(ts));
  let maxMap = readDailyMaxMap(date);
  let changed = false;
  for (const s of servers) {
    try {
      const { players, maxPlayers } = await getPlayers(s.id);
      writeSnapshot({ timestamp: ts, id: s.id, name: s.name, players, maxPlayers });
      const prev = maxMap[s.id];
      const prevVal = prev && typeof prev.players === 'number' ? prev.players : -1;
      if (players > prevVal) {
        maxMap[s.id] = { id: s.id, name: s.name, players, maxPlayers, timestamp: ts };
        changed = true;
        console.log(`[${ts}] New daily peak for ${s.name}(${s.id}): ${players}${maxPlayers ? `/${maxPlayers}` : ''}`);
      }
      console.log(`[${ts}] ${s.name}(${s.id}) players=${players}${maxPlayers ? `/${maxPlayers}` : ''}`);
    } catch (err) {
      console.error(`Error fetching ${s.name}(${s.id}):`, err.message);
      writeSnapshot({ timestamp: ts, id: s.id, name: s.name, error: String(err.message) });
    }
  }
  if (changed) writeDailyMaxMap(date, maxMap);
}

async function main() {
  console.log('FiveM cron started. Base:', BASE);
  ensureDir(OUT_DIR);
  let servers = [];
  try {
    servers = await getServers();
    if (!servers.length) {
      console.warn('No servers configured. Check NEXT_PUBLIC_FIVEM_SERVERS in .env.local.');
    }
  } catch (err) {
    console.error('Failed to load servers:', err.message);
  }

  // 立即執行一次，再每分鐘執行
  if (servers.length) await tick(servers);
  setInterval(() => tick(servers), TICK_MS);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});