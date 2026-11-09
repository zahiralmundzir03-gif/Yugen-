
(function(){
'use strict';

/* ==================================================
   YŪGEN NEXUS — API CENTER
   ================================================== */
const API_CENTER = {
  services: {
    nexray:   { baseURL: "https://api.nexray.web.id",  apiKey: "" },
    nexaEU:   { baseURL: "https://api.nexray.eu.cc",   apiKey: "" },
    ikyy:     { baseURL: "https://api.ikyyxd.my.id",   apiKey: "" },
    xylo:     { baseURL: "https://xyloapi.qzz.io",     apiKey: "" },
    nexadev:  { baseURL: "https://api.nexadev.my.id",  apiKey: "" },
    nexadev2: { baseURL: "https://apii.nexadev.my.id", apiKey: "" },
    saavn:    { baseURL: "https://saavn.dev/api",      apiKey: "" },
    itunes:   { baseURL: "https://itunes.apple.com",   apiKey: "" },
    lrclib:   { baseURL: "https://lrclib.net/api",     apiKey: "" },
    gemini:   { baseURL: "https://generativelanguage.googleapis.com/v1beta", apiKey: "" },
    vercel:   { baseURL: "https://api.vercel.com",     apiKey: "" },
    netlify:  { baseURL: "https://api.netlify.com/api/v1", apiKey: "" },
    tmpfiles: { baseURL: "https://tmpfiles.org",       apiKey: "" },
    uguu:     { baseURL: "https://uguu.se",            apiKey: "" },
    catbox:   { baseURL: "https://catbox.moe",         apiKey: "" },
    ipapi:    { baseURL: "https://ipapi.co",           apiKey: "" }
  },
  endpoints: {
    spotifyDownload: { service: "nexaEU", path: "/downloader/spotify",     method: "GET" },
    spotifyPlay:     { service: "nexaEU", path: "/downloader/spotifyplay", method: "GET" },
    spotifySearch:   { service: "nexray", path: "/search/spotify",         method: "GET" },
    saavnSearch:     { service: "saavn",  path: "/search/songs",           method: "GET" },
    itunesSearch:    { service: "itunes", path: "/search",                 method: "GET" },
    lrclibGet:       { service: "lrclib", path: "/get",                    method: "GET" },
    youtubeMp4:      { service: "ikyy",   path: "/download/ytmp4",         method: "GET" },
    youtubeMp3:      { service: "ikyy",   path: "/download/ytmp3",         method: "GET" },
    youtubeShorts:   { service: "ikyy",   path: "/download/yt-shorts",     method: "GET" },
    instagramDownload:{ service:"ikyy",   path: "/download/instagram",     method:"GET" },
    facebookDownload:{ service: "ikyy",   path: "/download/facebook",      method:"GET" },
    teraboxDownload: { service: "ikyy",   path: "/download/terabox",       method: "GET" },
    nikParser:       { service: "ikyy",   path: "/tools/nikparser",        method: "GET" },
    fixError:        { service: "ikyy",   path: "/tools/fixerror",         method: "GET" },
    webToApk:        { service: "ikyy",   path: "/tools/web2apk",          method: "GET" },
    ssweb:           { service: "ikyy",   path: "/tools/ssweb",            method: "GET" },
    removeBG:        { service: "nexadev",path: "/tools/remove/",          method: "GET" },
    windowsCanvas:   { service: "nexadev2", path: "/wmp1",                 method: "GET" },
    urlToQR:         { service: "xylo",   path: "/api/qr-tool/generate",   method: "GET" },
    bratImg:         { service: "nexaEU", path: "/maker/brathd",           method: "GET" },
    bratVid:         { service: "nexaEU", path: "/maker/bratvidhd",        method: "GET" },
    iqc:             { service: "nexaEU", path: "/maker/iqc",              method: "GET" },
    fakeDana:        { service: "nexaEU", path: "/maker/fakedana",         method: "GET" },
    tiktokStalker:   { service: "nexaEU", path: "/stalker/tiktok",         method: "GET" },
    nglSpam:         { service: "nexaEU", path: "/tools/spamngl",          method: "GET" },
    ucbrowserDownload:{ service: "ikyy",  path: "/download/ucbrowser",     method: "GET" },
    fakeBankJago:    { service: "nexray", path: "/maker/fakebank-jago",    method: "GET" },
    instagramStalker:{ service: "ikyy",   path: "/stalker/telegram",       method: "GET" },
    amPreset:        { service: "ikyy",   path: "/tools/ampreset",         method: "GET" }
  }
};

function buildURL(endpointKey, params) {
  const ep = API_CENTER.endpoints[endpointKey];
  if (!ep) throw new Error("Endpoint '" + endpointKey + "' tidak terdaftar di API Center.");
  const svc = API_CENTER.services[ep.service];
  if (!svc || !svc.baseURL) throw new Error("Service '" + ep.service + "' belum dikonfigurasi.");
  let url = svc.baseURL.replace(/\/$/, "") + ep.path;
  if (params && typeof params === "object") {
    const qs = new URLSearchParams();
    Object.keys(params).forEach(k => { if (params[k] != null && params[k] !== "") qs.set(k, params[k]); });
    const s = qs.toString();
    if (s) url += (url.indexOf("?") === -1 ? "?" : "&") + s;
  }
  return url;
}

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const norm = (u) => String(u == null ? "" : u).toLowerCase().trim();
const isDev = (u) => false; // Hak developer hanya berasal dari role database yang tervalidasi.
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rand = () => Math.random().toString(36).slice(2, 10);

function genUUID(){
  try { if (crypto && crypto.randomUUID) return crypto.randomUUID(); } catch(e){}
  const b = new Uint8Array(16);
  try { crypto.getRandomValues(b); } catch(e){ for (let i=0;i<16;i++) b[i] = Math.floor(Math.random()*256); }
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, x => x.toString(16).padStart(2,'0')).join('');
  return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
}

/* ==================================================
   TELEGRAM BOT (untuk Laporkan Masalah & Upgrade Role)
   ================================================== */
const TELEGRAM = {
  botToken: "YOUR_BOT_TOKEN_HERE",
  chatId: "YOUR_CHAT_ID_HERE"
};

function tgIsConfigured() {
  return TELEGRAM.botToken && TELEGRAM.botToken !== "YOUR_BOT_TOKEN_HERE"
      && TELEGRAM.chatId && TELEGRAM.chatId !== "YOUR_CHAT_ID_HERE";
}

async function tgSendMessage(text) {
  if (!tgIsConfigured()) throw new Error("Bot Telegram belum dikonfigurasi oleh developer.");
  const url = "https://api.telegram.org/bot" + TELEGRAM.botToken + "/sendMessage";
  const r = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM.chatId, text: text, parse_mode: "HTML", disable_web_page_preview: true })
  }, 25000, "Telegram");
  const d = await r.json();
  if (!d.ok) throw new Error(d.description || "Gagal kirim Telegram.");
  return d;
}

async function tgSendPhoto(file, caption) {
  if (!tgIsConfigured()) throw new Error("Bot Telegram belum dikonfigurasi oleh developer.");
  const fd = new FormData();
  fd.append("chat_id", TELEGRAM.chatId);
  fd.append("caption", caption);
  fd.append("parse_mode", "HTML");
  fd.append("photo", file, file.name || "evidence.jpg");
  const url = "https://api.telegram.org/bot" + TELEGRAM.botToken + "/sendPhoto";
  const r = await fetchWithTimeout(url, { method: "POST", body: fd }, 30000, "Telegram");
  const d = await r.json();
  if (!d.ok) throw new Error(d.description || "Gagal kirim foto Telegram.");
  return d;
}

/* Loader */
(function(){
  const loader = $("#yn-loader"), number = $("#yn-loader-number"), fill = $("#yn-loader-fill");
  if (!loader) return;
  let hidden = false;
  function hideLoader(){ if (hidden) return; hidden = true; if (number) number.textContent = "100%"; if (fill) fill.style.width = "100%"; loader.classList.add("done"); setTimeout(function(){ try { loader.remove(); } catch(e){} }, 900); }
  try {
    const start = performance.now();
    const tick = function(now){
      if (hidden) return;
      const t = Math.min(1, (now - start) / 1200);
      const p = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      if (number) number.textContent = p + "%";
      if (fill) fill.style.width = p + "%";
      if (t < 1) requestAnimationFrame(tick); else setTimeout(hideLoader, 150);
    };
    requestAnimationFrame(tick);
  } catch(e) { hideLoader(); }
  setTimeout(hideLoader, 3200);
  window.addEventListener("error", hideLoader);
})();

/* WhatsApp links */
(function(){
  const devLink = $("#yn-wa-dev"), chanLink = $("#yn-wa-channel"), devNote = $("#yn-wa-note"), chanNote = $("#yn-wa-channel-note");
  const num = "6285646446871";
  const msg = "Halo%20Developer%20Yugen%20Nexus%2C%20saya%20ingin%20menyampaikan%3A";
  const chan = "https://whatsapp.com/channel/0029Vb9DnuXBFLgbxwwAnm19";
  if (devLink) { devLink.href = "https://wa.me/" + num + "?text=" + msg; if (devNote) devNote.textContent = "+" + num; }
  if (chanLink) { chanLink.href = chan; if (chanNote) chanNote.textContent = chan; }
})();

/* IDB */
const IDB = (function(){
  const NAME = "yugen_nexus_v16", VER = 2;
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function(res, rej){
      let req;
      try { req = indexedDB.open(NAME, VER); } catch (e) { rej(e); return; }
      req.onupgradeneeded = function(e){
        const db = e.target.result;
        if (!db.objectStoreNames.contains("users")) db.createObjectStore("users", { keyPath: "usernameKey" });
        if (!db.objectStoreNames.contains("music")) {
          const s = db.createObjectStore("music", { keyPath: "id" });
          s.createIndex("savedAt", "savedAt", { unique: false });
        }
        if (!db.objectStoreNames.contains("banner")) db.createObjectStore("banner", { keyPath: "id" });
      };
      req.onsuccess = function(){ res(req.result); };
      req.onerror = function(){ rej(req.error); };
    });
    return dbp;
  }
  function tx(store, mode) { return open().then(function(db){ return db.transaction(store, mode).objectStore(store); }); }
  return {
    put: (s, i) => new Promise((res, rej) => tx(s, "readwrite").then(st => { const r = st.put(i); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }).catch(rej)),
    del: (s, k) => new Promise((res, rej) => tx(s, "readwrite").then(st => { const r = st.delete(k); r.onsuccess = () => res(); r.onerror = () => rej(r.error); }).catch(rej)),
    get: (s, k) => new Promise((res, rej) => tx(s, "readonly").then(st => { const r = st.get(k); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }).catch(rej)),
    getAll: (s) => new Promise((res, rej) => tx(s, "readonly").then(st => { const r = st.getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error); }).catch(rej))
  };
})();

const Store = {
  get(k){ try { return localStorage.getItem("yn16_" + k); } catch(e) { return null; } },
  set(k, v){ try { localStorage.setItem("yn16_" + k, v); return true; } catch(e) { return false; } },
  remove(k){ try { localStorage.removeItem("yn16_" + k); } catch(e) {} }
};

/* Toast */
const Toast = (function(){
  const host = $("#yn-toast-region");
  let active = 0;
  const ICONS = {
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg>',
    success: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>'
  };
  function spawn(msg, type) {
    if (!host) return;
    const el = document.createElement("div");
    el.className = "yn-toast " + (type || "info");
    el.innerHTML = (ICONS[type] || ICONS.info) + "<span>" + escapeHTML(msg) + "</span>";
    host.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add("show"); });
    active++;
    setTimeout(function(){ el.classList.remove("show"); setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); active--; }, 320); }, type === "error" ? 3600 : 2400);
  }
  return { show(msg, type) { if (active >= 3) return; spawn(msg, type || "info"); } };
})();
const toast = Toast.show;

/* Network */
function fetchWithTimeout(url, options, timeoutMs, label) {
  options = options || {}; timeoutMs = timeoutMs || 30000; label = label || "request";
  const controller = new AbortController();
  let timer = null;
  const timeoutPromise = new Promise(function(_, reject){
    timer = setTimeout(function(){ try { controller.abort(); } catch(e){} reject(new Error(label + " timeout")); }, timeoutMs);
  });
  const opts = Object.assign({}, options, { signal: controller.signal });
  const fetchPromise = fetch(url, opts).catch(function(err){
    if (controller.signal.aborted) throw new Error(label + " timeout");
    throw err;
  });
  return Promise.race([fetchPromise, timeoutPromise]).finally(function(){ if (timer) clearTimeout(timer); });
}

const FAST_PROXIES = [
  function(u){ return u; },
  function(u){ return "https://corsproxy.io/?" + encodeURIComponent(u); },
  function(u){ return "https://api.allorigins.win/raw?url=" + encodeURIComponent(u); },
  function(u){ return "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u); },
  function(u){ return "https://cors.eu.org/" + u; },
  function(u){ return "https://api.cors.lol/?url=" + encodeURIComponent(u); }
];

async function fetchAuto(url, options, timeoutMs, label) {
  options = options || {}; timeoutMs = timeoutMs || 25000; label = label || "request";
  const errors = [];
  for (let i = 0; i < FAST_PROXIES.length; i++) {
    const proxied = FAST_PROXIES[i](url);
    const attemptTimeout = i === 0 ? Math.min(timeoutMs, 15000) : timeoutMs;
    try {
      const res = await fetchWithTimeout(proxied, options, attemptTimeout, label + "-p" + i);
      if (!res.ok) { errors.push("p" + i + "=HTTP" + res.status); continue; }
      return res;
    } catch (e) {
      let m = (e.message || "fail").replace(/timeout/gi, "TO").replace(/Failed to fetch/gi, "CORS");
      if (m.length > 30) m = m.slice(0, 30);
      errors.push("p" + i + "=" + m);
    }
  }
  throw new Error("Semua proxy gagal [" + errors.join(", ") + "]");
}

async function fetchJSONAuto(url, options, timeoutMs, label) {
  const res = await fetchAuto(url, options, timeoutMs, label);
  const txt = await res.text();
  let body;
  try { body = JSON.parse(txt); } catch(e) {
    const preview = txt.slice(0, 80).replace(/\s+/g, " ").replace(/[<>]/g, "");
    throw new Error(label + ": bukan JSON [" + preview + "]");
  }
  if (body && (body.status === false || body.success === false)) {
    const msg = body.message || body.msg || (body.error && body.error.message) || (label + " gagal");
    throw new Error(typeof msg === "string" ? msg : (label + " gagal"));
  }
  return body;
}

async function fetchBinaryAuto(url, timeoutMs, label) {
  const res = await fetchAuto(url, {}, timeoutMs || 40000, label || "binary");
  const blob = await res.blob();
  if (!blob || blob.size < 100) throw new Error("Respons kosong atau bukan file.");
  const type = String(blob.type || "").toLowerCase();
  if (type.includes("application/json") || type.includes("text/html")) {
    let msg = "API mengembalikan pesan, bukan file.";
    try { const txt = await blob.text(); const d = JSON.parse(txt); msg = d.message || d.error || msg; } catch(e){}
    throw new Error(typeof msg === "string" ? msg : "Bukan file binary.");
  }
  return { blob: blob, url: URL.createObjectURL(blob), size: blob.size };
}

async function fetchJSON(url, options, timeoutMs, label) {
  options = options || {}; timeoutMs = timeoutMs || 30000; label = label || "API";
  const res = await fetchWithTimeout(url, options, timeoutMs, label);
  let body;
  try { body = await res.json(); } catch(e) { throw new Error(label + ": respons bukan JSON valid."); }
  if (!res.ok) {
    const msg = (body && (body.message || (body.error && body.error.message) || body.error)) || ("HTTP " + res.status);
    const err = new Error(typeof msg === "string" ? msg : ("HTTP " + res.status)); err.status = res.status; throw err;
  }
  if (body && (body.status === false || body.success === false)) {
    const msg = body.message || body.msg || (body.error && body.error.message) || (label + " gagal.");
    throw new Error(typeof msg === "string" ? msg : (label + " gagal."));
  }
  return body;
}

function friendlyError(err) {
  const msg = String((err && err.message) || err || "");
  if (/timeout|abort/i.test(msg)) return "Koneksi timeout. Coba lagi.";
  if (/HTTP 404/.test(msg)) return "Data tidak ditemukan.";
  if (/HTTP 403/.test(msg)) return "Akses ditolak.";
  if (/HTTP 429/.test(msg)) return "Terlalu banyak permintaan.";
  if (/HTTP 5\d\d/.test(msg)) return "Server bermasalah.";
  if (/Failed to fetch|NetworkError|CORS/i.test(msg)) return "Tidak terhubung ke server (CORS/offline).";
  return msg || "Server tidak tersedia.";
}

async function forceDownloadFile(url, filename) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const blob = await res.blob();
    const obj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = obj; a.download = filename || ("file-" + Date.now());
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(obj); }, 8000);
    return true;
  } catch (e) {
    window.open(url, "_blank", "noopener");
    return false;
  }
}

function parseLRC(lrc) {
  const lines = [];
  lrc.split(/\r?\n/).forEach(function(raw){
    const m = raw.match(/^\[(\d+):(\d+)(?:[.:](\d+))?\](.*)$/);
    if (!m) return;
    const min = parseInt(m[1], 10), sec = parseInt(m[2], 10);
    const frac = m[3] ? parseInt(m[3].padEnd(3, "0").slice(0, 3), 10) / 1000 : 0;
    const text = (m[4] || "").trim();
    if (text) lines.push({ time: min * 60 + sec + frac, text: text });
  });
  lines.sort(function(a, b){ return a.time - b.time; });
  return lines;
}

/* ============ RESPONSE NORMALIZERS ============ */
function normalizeIGDownload(d) {
  if (!d) throw new Error("Respons kosong.");
  const data = d.result || d.data || d.raw_response || d;
  let links = [];
  let title = (data && data.title) || "Instagram Media";
  let thumbnail = (data && (data.thumbnail || data.thumb)) || null;

  if (d.raw_response) {
    const rr = d.raw_response;
    const rrData = (rr && (rr.data || rr)) || {};
    if (Array.isArray(rrData.urls)) {
      links = rrData.urls.map(function(x, i){
        const u = typeof x === "string" ? x : (x.url || x.link);
        const t = (typeof x === "object" && (x.type || x.format)) || "";
        const isVideo = /video|mp4/i.test(t) || /\.mp4/i.test(u || "");
        return { url: u, label: isVideo ? ("Video " + (i + 1)) : ("Foto " + (i + 1)) };
      }).filter(function(l){ return l.url; });
    } else if (rrData.url) {
      links = [{ url: rrData.url, label: /\.mp4/i.test(rrData.url) ? "Video" : "Media" }];
    }
    thumbnail = thumbnail || rrData.thumbnail || rrData.thumb || null;
  }

  if (!links.length && Array.isArray(data.links)) {
    links = data.links.filter(function(l){ return l && (l.url || l.link); }).map(function(l, i){
      return { url: l.url || l.link, label: l.label || l.type || ("Media " + (i + 1)) };
    });
  }

  if (!links.length && Array.isArray(d)) {
    links = d.map(function(x, i){
      const u = typeof x === "string" ? x : (x.url || x.link);
      const isVideo = /\.mp4/i.test(u || "");
      return { url: u, label: isVideo ? ("Video " + (i + 1)) : ("Media " + (i + 1)) };
    }).filter(function(l){ return l.url; });
  }

  if (!links.length && data && data.download_url) links = [{ url: data.download_url, label: "Media" }];
  if (!links.length && data && typeof data.url === "string") links = [{ url: data.url, label: "Media" }];

  if (!links.length) throw new Error((d && (d.message || d.msg)) || "Tidak ada tautan unduhan.");
  return { title: title, links: links, thumbnail: thumbnail, raw: d };
}

function normalizeFBDownload(d) {
  if (!d) throw new Error("Respons kosong.");
  const data = d.result || d.data || d;
  let links = [];
  let title = (data && data.title) || "Facebook Video";
  let thumbnail = (data && data.thumbnail) || null;

  const dl = data && (data.downloads || data.download_data);
  if (dl) {
    if (Array.isArray(dl.links)) {
      links = dl.links.filter(function(l){ return l && l.url; }).map(function(l){
        return { url: l.url, label: [l.quality, l.type].filter(Boolean).join(" · ") || "Video" };
      });
    }
    if (dl.thumbnail) thumbnail = dl.thumbnail;
  }

  if (!links.length && Array.isArray(data.links)) {
    links = data.links.filter(function(l){ return l && (l.url || l.link); }).map(function(l, i){
      return { url: l.url || l.link, label: l.label || l.quality || ("Video " + (i + 1)) };
    });
  }

  if (!links.length && data && typeof data.url === "string") links = [{ url: data.url, label: "Video" }];
  if (!links.length && data && data.download_url) links = [{ url: data.download_url, label: "Video" }];

  if (!links.length) throw new Error((d && (d.message || d.msg)) || "Tidak ada tautan unduhan.");
  return { title: title, links: links, thumbnail: thumbnail, raw: d };
}

/* API wrappers */
const API = {
  async spotifyDownload(url) {
    const u = String(url || "").trim();
    if (!u) throw new Error("URL Spotify wajib.");
    const full = buildURL("spotifyDownload", { url: u });
    const d = await fetchJSONAuto(full, {}, 45000, "spotifyDownload");
    const r = (d && d.result) || {};
    if (!r.url) throw new Error("Server tidak mengembalikan URL download.");
    return { title: r.title || "Spotify Track", artist: r.artist || "", url: r.url, thumbnail: null, quality: "audio", raw: d };
  },
  async spotifyPlay(q) {
    const query = String(q || "").trim();
    if (!query) throw new Error("Kata kunci wajib.");
    const full = buildURL("spotifyPlay", { q: query });
    const d = await fetchJSONAuto(full, {}, 45000, "spotifyPlay");
    const r = (d && d.result) || {};
    if (!r.download_url && !r.url) throw new Error("Server tidak mengembalikan audio.");
    return {
      title: r.title || query, artist: r.artist || "", thumbnail: r.thumbnail || null,
      duration: r.duration || "", album: r.album || "",
      download_url: r.download_url || r.url, spotify_url: r.url || "", raw: d
    };
  },
  async spotifySearch(q) {
    const query = String(q || "").trim();
    if (!query) throw new Error("Kata kunci wajib.");
    return fetchJSONAuto(buildURL("spotifySearch", { q: query }), {}, 30000, "spotifySearch");
  },
  async saavnSearch(q) {
    const query = String(q || "").trim();
    if (!query) throw new Error("Query wajib.");
    const d = await fetchJSONAuto(buildURL("saavnSearch", { query: query, limit: 10 }), {}, 25000, "saavn");
    return (d && d.data && d.data.results) || (d && d.results) || [];
  },
  async itunesPreview(q) {
    const query = String(q || "").trim();
    if (!query) throw new Error("Query wajib.");
    const d = await fetchJSONAuto(buildURL("itunesSearch", { term: query, media: "music", limit: 3 }), {}, 20000, "itunes");
    const results = (d && d.results) || [];
    return results.find(r => r.previewUrl) || null;
  },
  async lyrics(artist, title) {
    const cleanTitle = String(title || "").split(" - ")[0].split("(")[0].split("[")[0].trim();
    const cleanArtist = String(artist || "").split(",")[0].split("&")[0].split("feat")[0].trim();
    if (!cleanTitle) return null;
    try {
      const d = await fetchJSONAuto(buildURL("lrclibGet", { artist_name: cleanArtist, track_name: cleanTitle }), {}, 12000, "lrclib");
      if (d && d.syncedLyrics) return { synced: parseLRC(d.syncedLyrics), plain: d.plainLyrics || null };
      if (d && d.plainLyrics) return { synced: null, plain: d.plainLyrics };
    } catch(e){}
    return null;
  },
  async youtubeMp4(url) {
    const q = String(url || "").trim(); if (!q) throw new Error("URL YouTube wajib.");
    const d = await fetchJSON(buildURL("youtubeMp4", { q: q }), {}, 45000, "ytmp4");
    const r = (d && d.result) || {};
    const dl = (r.VideoUrl && r.VideoUrl.url) || (typeof r.VideoUrl === "string" ? r.VideoUrl : null) || r.url || null;
    if (!dl) throw new Error("Server tidak mengembalikan URL video.");
    return { title: r.title || "YouTube Video", thumbnail: r.thumbnail || null, duration: r.duration || null, url: dl, quality: "720p", raw: d };
  },
  async youtubeMp3(url) {
    const u = String(url || "").trim(); if (!u) throw new Error("URL YouTube wajib.");
    const d = await fetchJSON(buildURL("youtubeMp3", { url: u }), {}, 45000, "ytmp3");
    const r = (d && d.result) || {};
    const dl = (r.audio && r.audio.url) || null;
    if (!dl) throw new Error("Server tidak mengembalikan URL audio.");
    return { title: r.title || "YouTube Audio", thumbnail: r.thumbnail || null, duration: r.duration || null, url: dl, quality: (r.audio && r.audio.quality) || "audio", raw: d };
  },
  async youtubeShorts(url) {
    const u = String(url || "").trim(); if (!u) throw new Error("URL Shorts wajib.");
    const d = await fetchJSON(buildURL("youtubeShorts", { url: u }), {}, 45000, "shorts");
    const r = (d && d.result) || {};
    const dl = (r.DownloadUrl && r.DownloadUrl.url) || (typeof r.DownloadUrl === "string" ? r.DownloadUrl : null) || null;
    if (!dl) throw new Error("Server tidak mengembalikan URL video.");
    return { title: r.title || "YouTube Shorts", thumbnail: null, duration: null, url: dl, quality: "720p", raw: d };
  },
  async ucBrowser(url) {
    const u = String(url || "").trim(); if (!u) throw new Error("URL wajib.");
    const d = await fetchJSONAuto(buildURL("ucbrowserDownload", { url: u }), {}, 45000, "ucbrowser");
    const data = (d && (d.result || d.data)) || d || {};

    if (Array.isArray(data.videos) && data.videos.length) {
      const v = data.videos[0];
      if (v.error) throw new Error(v.error);
      return {
        title: v.file_name || "UC Browser file",
        url: v.video_url,
        quality: v.resolution || v.size || "-",
        thumbnail: v.thumbnail_url,
        duration: v.duration,
        raw: d
      };
    }

    if (Array.isArray(data.files) && data.files.length) {
      const f = data.files.find(function(x){ return x && (x.download_url || x.url); }) || data.files[0];
      const dl = f.download_url || f.url || data.url;
      if (!dl) throw new Error("File tidak punya URL unduhan.");
      return { title: f.file_name || "UC Browser file", url: dl, quality: f.size || "-", raw: d };
    }

    const dl = data.url || data.download || data.link || data.downloadUrl;
    if (!dl) throw new Error("Server tidak mengembalikan URL file.");
    return { title: data.title || data.filename || "UC Browser file", url: dl, quality: data.quality || data.size || "-", raw: d };
  },
  async instagramDownload(url) {
    const u = String(url || "").trim(); if (!u) throw new Error("URL wajib.");
    const d = await fetchJSONAuto(buildURL("instagramDownload", { url: u }), {}, 45000, "instagram");
    return normalizeIGDownload(d);
  },
  async facebookDownload(url) {
    const u = String(url || "").trim(); if (!u) throw new Error("URL wajib.");
    const d = await fetchJSONAuto(buildURL("facebookDownload", { url: u }), {}, 45000, "facebook");
    return normalizeFBDownload(d);
  },
  async teraboxDownload(url){
    const u = String(url || "").trim(); if (!u) throw new Error("URL TeraBox wajib.");
    let d;
    try { d = await fetchJSONAuto(buildURL("teraboxDownload", { url: u }), {}, 60000, "terabox"); }
    catch (e) { e.message = "TeraBox API gagal: " + (e.message || "koneksi/CORS"); throw e; }
    const data = (d && (d.result || d.data)) || d || {};
    if (!data) throw new Error("API tidak mengembalikan data.");

    if (Array.isArray(data.files) && data.files.length) {
      const links = [];
      data.files.forEach(function(f, i){
        if (!f) return;
        const name = f.name || f.file_name || ("File " + (i + 1));
        const size = f.size || f.size_formatted || "-";
        const quality = f.quality || "HD";
        if (f.downloadLink) links.push({ url: f.downloadLink, label: name + " · " + size + " · " + quality });
        if (f.normalDlink && f.normalDlink !== f.downloadLink) links.push({ url: f.normalDlink, label: name + " · Normal" });
        if (f.fastStreamUrl) links.push({ url: f.fastStreamUrl, label: name + " · Stream" });
      });
      if (!links.length) throw new Error("File tidak punya tautan unduhan.");
      const first = data.files[0] || {};
      return {
        title: first.name || first.file_name || "TeraBox File",
        size: first.size || first.size_formatted || "",
        thumbnail: first.thumbnail || null,
        links: links,
        raw: d
      };
    }

    if (!d || d.status !== true || !data || !data.direct_download_url) throw new Error((d && d.message) || "API tidak mengembalikan direct download URL.");
    const links = [{ url: data.direct_download_url, label: "Download file langsung" }];
    const streams = data.stream_urls || {};
    Object.keys(streams).forEach(function(q){ if (streams[q] && streams[q] !== data.direct_download_url) links.push({ url: streams[q], label: "Streaming " + q }); });
    return { title: data.title || "TeraBox file", size: data.size || "", links: links, raw: d };
  },
  async tiktokStalker(username) {
    const uname = String(username || "").replace(/^@/, "").trim(); if (!uname) throw new Error("Username wajib.");
    return fetchJSONAuto(buildURL("tiktokStalker", { username: uname }), {}, 30000, "tiktokstalker");
  },
  async instagramStalker(username) {
    const uname = String(username || "").replace(/^@/, "").trim(); if (!uname) throw new Error("Username wajib.");
    const d = await fetchJSONAuto(buildURL("instagramStalker", { username: uname }), {}, 30000, "tgstalker");
    if (!d) throw new Error("Respons kosong.");
    if (d.ok === false || d.status === false) throw new Error(d.message || d.error || "Data tidak ditemukan.");
    return d;
  },
  async amPreset(url) {
    const u = String(url || "").trim(); if (!u) throw new Error("URL TikTok wajib.");
    const d = await fetchJSONAuto(buildURL("amPreset", { url: u }), {}, 60000, "ampreset");
    if (!d) throw new Error("Respons kosong.");
    const data = d.result || d.data || d;
    if (d.ok === false || d.status === false || (data && (data.ok === false || data.status === false))) {
      throw new Error(d.message || data.message || "Preset tidak ditemukan.");
    }
    if (!data.presets && !data.total && data.ok !== true) {
      throw new Error("Struktur respons tidak dikenali (tidak ada field presets).");
    }
    return data;
  },
  async fetchTikTokData(url) {
    if (!url) throw new Error("URL wajib.");
    const d = await fetchJSONAuto("https://www.tikwm.com/api/?url=" + encodeURIComponent(url) + "&hd=1", {}, 30000, "tiktok");
    if (d.code !== 0) throw new Error(d.msg || "TikTok error");
    return d.data;
  },
  async nglSpam(target, message, amount) {
    const t = String(target || "").replace(/^@/, "").trim();
    const m = String(message || "").trim();
    const n = Math.max(1, Math.min(500, parseInt(amount) || 10));
    if (!t) throw new Error("Target NGL wajib."); if (!m) throw new Error("Pesan wajib.");
    return fetchJSONAuto(buildURL("nglSpam", { url: t, pesan: m, jumlah: n }), {}, 60000, "ngl");
  },
  async geminiListModels(apiKey) {
    if (!apiKey) throw new Error("API key wajib.");
    const r = await fetchWithTimeout(API_CENTER.services.gemini.baseURL + "/models?key=" + encodeURIComponent(apiKey), {}, 25000, "Gemini");
    const d = await r.json();
    if (!r.ok) throw new Error((d.error && d.error.message) || "HTTP " + r.status);
    return (d.models || []).filter(m => (m.supportedGenerationMethods || []).includes("generateContent"));
  },
  async geminiChat(apiKey, model, contents, sysPrompt) {
    if (!apiKey || !model) throw new Error("API key dan model wajib.");
    const body = { contents: contents, generationConfig: { temperature: 0.9, maxOutputTokens: 2048 } };
    if (sysPrompt && sysPrompt.trim()) body.systemInstruction = { parts: [{ text: sysPrompt }] };
    const r = await fetchWithTimeout(API_CENTER.services.gemini.baseURL + "/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(apiKey), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, 30000, "Gemini");
    const d = await r.json();
    if (!r.ok) throw new Error((d.error && d.error.message) || "HTTP " + r.status);
    const text = (((d.candidates || [])[0] || {}).content || { parts: [] }).parts.map(p => p.text || "").join("").trim();
    return { text: text, raw: d };
  },
  async nikParser(nik) {
    if (!/^\d{16}$/.test(nik)) throw new Error("NIK harus 16 digit.");
    return fetchJSON(buildURL("nikParser", { nik: nik }));
  },
  async fixError(code) {
    if (!code) throw new Error("Kode wajib.");
    return fetchJSON(buildURL("fixError", { code: code }));
  },
  async urlToQR(data) {
    if (!data) throw new Error("URL / teks wajib.");
    const d = await fetchJSONAuto(buildURL("urlToQR", { data: data, size: "500x500", margin: "1", color: "%23000000" }), {}, 25000, "toqr");
    const url = (d && d.data && d.data.url) || (d && d.url);
    if (!url) throw new Error("Server tidak mengembalikan URL QR.");
    return { url: url, raw: d };
  },
  async removeBG(imageUrl) {
    if (!imageUrl) throw new Error("URL gambar wajib.");
    const imgRes = await fetchAuto(imageUrl, {}, 30000, "img-src");
    const imgBlob = await imgRes.blob();
    if (!imgBlob || imgBlob.size < 100) throw new Error("Gambar sumber kosong.");
    const fd = new FormData();
    fd.append("file", imgBlob, "image.jpg");
    let cdnUrl;
    try {
      const upRes = await fetchWithTimeout("https://cdnn.ikyyxd.my.id/api/upload.php", {
        method: "POST", body: fd
      }, 25000, "cdn-upload");
      if (!upRes.ok) throw new Error("HTTP " + upRes.status);
      const upData = await upRes.json();
      cdnUrl = upData.url || (upData.result && upData.result.url) || upData.file;
    } catch (e) {
      throw new Error("Upload CDN gagal: " + e.message);
    }
    if (!cdnUrl) throw new Error("Upload CDN tidak mengembalikan URL.");
    const deviceId = Array.from({ length: 16 }, () => Math.floor(Math.random()*16).toString(16)).join('');
    let processed;
    try {
      const res = await fetchWithTimeout("https://www.dreamai.art/api/background-remover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-Id": deviceId
        },
        body: JSON.stringify({ images: [cdnUrl] })
      }, 35000, "dreamai");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Gagal remove background.");
      processed = data.processedImage;
    } catch (e) {
      throw new Error("DreamAI gagal: " + e.message);
    }
    if (!processed) throw new Error("DreamAI tidak mengembalikan hasil.");
    const finalRes = await fetchAuto(processed, {}, 30000, "final");
    const finalBlob = await finalRes.blob();
    return { blob: finalBlob, url: URL.createObjectURL(finalBlob), size: finalBlob.size };
  },
  async windowsCanvas(text) {
    if (!text) throw new Error("Teks wajib.");
    return fetchBinaryAuto(buildURL("windowsCanvas", { text: text }), 45000, "wmp1");
  },
  async ssweb(url) {
    if (!url) throw new Error("URL wajib.");
    return fetchBinaryAuto(buildURL("ssweb", { url: url }), 45000, "ssweb");
  },
  async bratImage(text) { if (!text) throw new Error("Teks wajib."); return fetchBinaryAuto(buildURL("bratImg", { text: text }), 25000, "brat"); },
  async bratVideo(text) { if (!text) throw new Error("Teks wajib."); return fetchBinaryAuto(buildURL("bratVid", { text: text }), 40000, "bratvid"); },
  async iqc(text) { if (!text) throw new Error("Teks wajib."); return fetchBinaryAuto(buildURL("iqc", { text: text }), 25000, "iqc"); },
  async fakeDana(nominal) {
    const n = String(nominal || "").trim(); if (!n) throw new Error("Nominal wajib.");
    return fetchBinaryAuto(buildURL("fakeDana", { nominal: n }), 25000, "fakedana");
  },
  async fakeBankJago(nama, saldo) {
    if (!nama) throw new Error("Nama wajib.");
    if (!saldo) throw new Error("Saldo wajib.");
    return fetchBinaryAuto(buildURL("fakeBankJago", { nama: nama, saldo: saldo }), 45000, "fakebankjago");
  },
  async amPremiumPost(action, data) {
    const body = JSON.stringify(Object.assign({ action: action }, data || {}));
    const baseUrl = "https://anita-studio.netlify.app/.netlify/functions/amprem";
    const urls = [
      baseUrl,
      "https://corsproxy.io/?" + encodeURIComponent(baseUrl),
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(baseUrl)
    ];
    let lastErr;
    for (let i = 0; i < urls.length; i++) {
      try {
        const r = await fetchWithTimeout(urls[i], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body
        }, 30000, "amprem-p" + i);
        if (!r.ok) {
          let msg = "HTTP " + r.status;
          try { const j = await r.json(); msg = j.message || j.error || msg; } catch(e){}
          throw new Error(msg);
        }
        return await r.json();
      } catch(e) { lastErr = e; }
    }
    throw lastErr || new Error("Gagal menghubungi server AM Premium.");
  },
  async vercelDeploy(token, name, html) {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 52) || "yn-deploy";
    const bytes = new TextEncoder().encode(html);
    let bin = ""; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = btoa(bin);
    const body = { name: cleanName, files: [{ file: "index.html", data: b64, encoding: "base64" }], target: "production" };
    const r = await fetchWithTimeout(API_CENTER.services.vercel.baseURL + "/v13/deployments", { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify(body) }, 30000, "Vercel");
    const d = await r.json();
    if (!r.ok) throw new Error((d.error && d.error.message) || "HTTP " + r.status);
    return d;
  },
  async vercelPoll(token, id) {
    for (let i = 0; i < 60; i++) {
      await new Promise(function(r){ setTimeout(r, 2000); });
      const res = await fetchWithTimeout(API_CENTER.services.vercel.baseURL + "/v13/deployments/" + id, { headers: { Authorization: "Bearer " + token } }, 20000, "Vercel");
      if (!res.ok) continue;
      const d = await res.json();
      if (d.readyState === "READY") { if (!d.url) d.url = ((d.alias && d.alias[0]) || (id + ".vercel.app")); return d; }
      if (d.readyState === "ERROR" || d.readyState === "CANCELED") throw new Error("Deploy gagal.");
    }
    throw new Error("Timeout deploy.");
  },
  async vercelCheckToken(token) {
    const r = await fetchWithTimeout(API_CENTER.services.vercel.baseURL + "/v2/user", { headers: { Authorization: "Bearer " + token } }, 20000, "Vercel");
    if (!r.ok) throw new Error("Token tidak valid.");
    return r.json();
  },
  async netlifyCheckToken(token) {
    const r = await fetchWithTimeout(API_CENTER.services.netlify.baseURL + "/sites?per_page=1", { headers: { Authorization: "Bearer " + token } }, 20000, "Netlify");
    if (!r.ok) throw new Error("Token tidak valid.");
    return true;
  },
  async sha1Hex(text) {
    const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  },
  async netlifyDeploy(token, name, html) {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 40) || ("yn-" + rand());
    const siteRes = await fetchWithTimeout(API_CENTER.services.netlify.baseURL + "/sites", { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ name: cleanName }) }, 30000, "Netlify");
    const site = await siteRes.json();
    if (!siteRes.ok) throw new Error(site.message || site.error || "Gagal membuat site.");
    const siteId = site.id;
    const sha1 = await this.sha1Hex(html);
    const deployRes = await fetchWithTimeout(API_CENTER.services.netlify.baseURL + "/sites/" + siteId + "/deploys", { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ files: { "/index.html": sha1 } }) }, 30000, "Netlify");
    const deploy = await deployRes.json();
    if (!deployRes.ok) throw new Error(deploy.message || "Gagal membuat deploy.");
    const upRes = await fetchWithTimeout(API_CENTER.services.netlify.baseURL + "/deploys/" + deploy.id + "/files/index.html", { method: "PUT", headers: { Authorization: "Bearer " + token, "Content-Type": "application/octet-stream" }, body: html }, 60000, "Netlify");
    if (!upRes.ok) throw new Error("Upload file gagal: HTTP " + upRes.status);
    let finalUrl = site.ssl_url || site.url || ("https://" + cleanName + ".netlify.app");
    for (let i = 0; i < 20; i++) {
      await new Promise(function(r){ setTimeout(r, 1500); });
      const pollRes = await fetchWithTimeout(API_CENTER.services.netlify.baseURL + "/deploys/" + deploy.id, { headers: { Authorization: "Bearer " + token } }, 15000, "Netlify");
      if (!pollRes.ok) continue;
      const pd = await pollRes.json();
      if (pd.state === "ready" || pd.state === "current") { finalUrl = pd.ssl_url || pd.url || finalUrl; break; }
      if (pd.state === "error") throw new Error("Deploy gagal di sisi Netlify.");
    }
    return { url: finalUrl, siteId: siteId, deployId: deploy.id };
  }
};

async function resolvePlayableAudio(query, expectedTitle, expectedArtist) {
  const q = String(query || "").trim();
  if (!q) throw new Error("Query kosong.");
  try {
    const tracks = await API.saavnSearch(q);
    if (Array.isArray(tracks) && tracks.length) {
      let best = tracks[0];
      if (expectedTitle) {
        const target = norm(expectedTitle);
        const matched = tracks.find(function(t){ return norm(t.name || t.title).includes(target) || target.includes(norm(t.name || t.title)); });
        if (matched) best = matched;
      }
      const dl = Array.isArray(best.downloadUrl) ? best.downloadUrl : [];
      const pick = dl.find(function(x){ return /320/.test(x.quality || ""); }) || dl[dl.length - 1] || dl[0];
      if (pick && pick.url) {
        const imgs = Array.isArray(best.image) ? best.image : [];
        const cover = (imgs.find(function(i){ return /500x500/.test(i.quality || ""); }) || imgs[imgs.length-1] || imgs[0] || {}).url || null;
        const artists = (best.artists && (best.artists.primary || best.artists.all)) || [];
        return {
          url: pick.url, source: "JioSaavn", quality: pick.quality || "auto", cover: cover,
          title: best.name || best.title || expectedTitle || q,
          artist: (artists[0] && artists[0].name) || expectedArtist || "",
          duration: best.duration || 0
        };
      }
    }
  } catch(e){}
  try {
    const p = await API.itunesPreview(q);
    if (p && p.previewUrl) {
      return {
        url: p.previewUrl, source: "Apple Music Preview", quality: "30s preview",
        cover: (p.artworkUrl100 || "").replace("100x100", "600x600") || null,
        title: p.trackName || expectedTitle || q,
        artist: p.artistName || expectedArtist || "",
        duration: p.trackTimeMillis ? Math.round(p.trackTimeMillis / 1000) : 30
      };
    }
  } catch(e){}
  throw new Error("Audio tidak ditemukan di server manapun.");
}

/* AUTH — SUPABASE CLOUD */
const Auth = (function(){
  let client = null;
  let cachedSession = null;
  let realtimeChannel = null;
  function ensureClient(){
    if (client) return client;
    const cfg = window.YN_SUPABASE_CONFIG || {};
    if (!cfg.url || !cfg.anonKey || /YOUR_|CHANGE_ME/i.test(cfg.url + cfg.anonKey))
      throw new Error("Supabase belum dikonfigurasi. Isi URL dan anon key di public/supabase-config.js lalu deploy ulang.");
    if (!window.supabase || !window.supabase.createClient) throw new Error("Library Supabase gagal dimuat. Periksa koneksi internet.");
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true },
      realtime: { params: { eventsPerSecond: 10 } }
    });
    return client;
  }
  function normalizeProfile(row){
    if (!row) return null;
    return { id:row.id, user_id:row.id, username:row.username, usernameKey:String(row.username||'').toLowerCase(),
      email:row.email, uuid:row.id, role:row.role || 'basic', verified:!!row.email_confirmed,
      createdAt:row.created_at ? new Date(row.created_at).getTime() : null,
      lastLogin:row.last_login ? new Date(row.last_login).getTime() : null, deviceId:null };
  }
  async function profileFor(id){
    const c=ensureClient();
    const {data,error}=await c.from('profiles').select('*').eq('id',id).single();
    if(error) throw new Error(error.message || 'Profil akun tidak dapat dimuat.');
    return normalizeProfile(data);
  }
  function subscribeRealtime(){
    const c=ensureClient();
    if(realtimeChannel) c.removeChannel(realtimeChannel);
    realtimeChannel=c.channel('yn-profiles-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},async(payload)=>{
        const authData=await c.auth.getSession();
        const id=authData.data && authData.data.session && authData.data.session.user.id;
        if(id){
          try { cachedSession=await profileFor(id); window.dispatchEvent(new CustomEvent('yn:profile-updated',{detail:cachedSession})); }
          catch(e){ console.warn('Realtime profile:',e.message); }
        }
        window.dispatchEvent(new CustomEvent('yn:profiles-changed',{detail:payload}));
      }).subscribe();
  }
  async function init(){
    const c=ensureClient();
    const {data,error}=await c.auth.getSession();
    if(error) throw error;
    if(data.session){
      try { cachedSession=await profileFor(data.session.user.id); }
      catch(e){ console.warn('Profile session:',e.message); cachedSession=null; }
    }
    c.auth.onAuthStateChange((_event,session)=>{
      if(!session){ cachedSession=null; return; }
      setTimeout(async()=>{
        try { cachedSession=await profileFor(session.user.id); window.dispatchEvent(new CustomEvent('yn:auth-updated',{detail:cachedSession})); }
        catch(e){ console.warn('Auth profile:',e.message); }
      },0);
    });
    if(data.session) subscribeRealtime();
    return cachedSession;
  }
  async function register(data){
    const c=ensureClient();
    const username=String(data.username||'').trim();
    const email=String(data.email||'').trim().toLowerCase();
    if(!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) throw new Error('Username 3-32 karakter.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email tidak valid.');
    if(!data.password || data.password.length<8) throw new Error('Password minimal 8 karakter.');
    const {data:available,error:lookupError}=await c.rpc('is_username_available',{candidate_username:username});
    if(lookupError) throw new Error(lookupError.message);
    if(!available) throw new Error('Username sudah digunakan.');
    const {data:result,error}=await c.auth.signUp({email,password:String(data.password),options:{data:{username}}});
    if(error) throw new Error(error.message);
    if(!result.user) throw new Error('Pendaftaran tidak berhasil. Coba lagi.');
    return {user:{id:result.user.id,user_id:result.user.id,username,email,role:'basic',verified:false},otp:null};
  }
  async function verifyOtp(email,otp){
    const c=ensureClient();
    const {data,error}=await c.auth.verifyOtp({email:String(email).trim().toLowerCase(),token:String(otp).trim(),type:'signup'});
    if(error) throw new Error(error.message || 'Kode verifikasi tidak valid.');
    if(!data.user) throw new Error('Verifikasi belum menghasilkan sesi akun.');
    cachedSession=await profileFor(data.user.id);
    subscribeRealtime();
    return cachedSession;
  }
  async function resendOtp(email){
    const {error}=await ensureClient().auth.resend({type:'signup',email:String(email).trim().toLowerCase()});
    if(error) throw new Error(error.message);
    return true;
  }
  async function login(email,password){
    const {data,error}=await ensureClient().auth.signInWithPassword({email:String(email).trim().toLowerCase(),password:String(password)});
    if(error) throw new Error(error.message);
    cachedSession=await profileFor(data.user.id);
    await ensureClient().rpc('touch_last_login');
    subscribeRealtime();
    return cachedSession;
  }
  async function logout(){ await ensureClient().auth.signOut(); cachedSession=null; }
  async function getUsers(){
    const {data,error}=await ensureClient().from('profiles').select('*').order('created_at',{ascending:false});
    if(error) throw new Error(error.message);
    return (data||[]).map(normalizeProfile);
  }
  async function findUser(username){
    if(!username) return null;
    const {data,error}=await ensureClient().from('profiles').select('*').ilike('username',String(username).trim()).maybeSingle();
    if(error) { if(error.code==='PGRST116') return null; throw new Error(error.message); }
    return normalizeProfile(data);
  }
  async function setRole(username,role,actor){
    if(!actor || !['owner','developers'].includes(actor.role)) throw new Error('Akses ditolak.');
    const {data,error}=await ensureClient().rpc('admin_set_user_role',{target_username:String(username),new_role:String(role)});
    if(error) throw new Error(error.message);
    return normalizeProfile(data);
  }
  async function deleteUser(username,actor){
    if(!actor || !['owner','developers'].includes(actor.role)) throw new Error('Akses ditolak.');
    const {error}=await ensureClient().rpc('admin_delete_user',{target_username:String(username)});
    if(error) throw new Error(error.message);
    return true;
  }
  function saveSession(user){ cachedSession=user; }
  function getSession(){ return cachedSession; }
  function clearSession(){ logout().catch(e=>console.warn('Sign out:',e)); }
  async function seedZill(){ return null; } // Tidak ada akun developer/password bawaan.
  async function saveUser(){ throw new Error('Perubahan akun harus melalui fungsi database yang tervalidasi.'); }
  function deviceId(){ return null; }
  return {init,register,verifyOtp,resendOtp,login,logout,getUsers,findUser,saveUser,setRole,deleteUser,seedZill,saveSession,getSession,clearSession,deviceId};
})();

const RoleGate = {
  perms: {
    basic: ["youtube","tiktok","instagram","spotify","terabox","facebook","ucbrowser","brat","iqc","fakedana","fakebankjago","calculator","nik-parser","tiktok-stalker","instagram-stalker","am-preset","hd-image","url-to-qr","windows","ssweb","morse","nglspam"],
    vip: ["*"], developers: ["*"], owner: ["*"]
  },
  canAccess(toolId, session) {
    if (!session) return false;
    if (session.role === "developers" || session.role === "owner" || session.role === "vip") return true;
    return (this.perms[session.role] || []).indexOf(toolId) !== -1;
  },
  isDeveloper(session) { return !!(session && (session.role === "developers" || session.role === "owner" || isDev(session.username))); },
  label(role) { return ({ developers: "Developers", owner: "Owner", vip: "Premium", basic: "Basic" })[role] || "Basic"; }
};
  
/* Modal helpers */
const modalBd = $("#yn-modal-bd"), modalBody = $("#yn-modal-body"), modalTitle = $("#yn-modal-title"), modalIcon = $("#yn-modal-icon"), modalClose = $("#yn-modal-close"), modalGuideBtn = $("#yn-modal-guide");
let modalLock = false, modalCloseTimer = null, currentTool = null;
function setModalLoading(on){ if (modalBody) modalBody.classList.toggle("is-loading", !!on); }
function hideResult(){ const r = $("#yn-result-wrap"); if (r) r.remove(); }
function showResultNode(node){
  hideResult();
  const wrap = document.createElement("div");
  wrap.id = "yn-result-wrap"; wrap.className = "yn-result";
  wrap.innerHTML = '<div class="yn-result-label">Hasil</div>';
  wrap.appendChild(node);
  modalBody.appendChild(wrap);
  try { wrap.scrollIntoView({ behavior: "smooth", block: "start" }); } catch(e){}
}
function createJSONToggle(data){
  const d = document.createElement("details");
  d.className = "yn-result-json";
  d.innerHTML = "<summary>JSON Response</summary><pre>" + escapeHTML(JSON.stringify(data, null, 2)) + "</pre>";
  return d;
}
function createInfoBox(text){
  const b = document.createElement("div"); b.className = "yn-info";
  b.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg><span>' + escapeHTML(text) + '</span>';
  return b;
}
function createSuccessBox(title, pairs){
  pairs = pairs || [];
  const b = document.createElement("div"); b.className = "yn-success";
  let html = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg><div><strong>' + escapeHTML(title) + '</strong>';
  pairs.forEach(function(p){ html += "<br/>" + escapeHTML(p[0]) + ": " + escapeHTML(String(p[1])); });
  html += "</div>";
  b.innerHTML = html;
  return b;
}
function showError(msg, raw){
  const frag = document.createDocumentFragment();
  const e = document.createElement("div"); e.className = "yn-error";
  e.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg><span>' + escapeHTML(msg) + '</span>';
  frag.appendChild(e);
  if (raw) frag.appendChild(createJSONToggle(raw));
  showResultNode(frag);
}
function primaryBtn(label){
  const b = document.createElement("button");
  b.className = "yn-btn yn-btn-primary"; b.type = "button";
  b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 10-13h-7z"/></svg><span>' + escapeHTML(label || "Jalankan") + '</span>';
  return b;
}
function secondaryBtn(label){
  const b = document.createElement("button");
  b.className = "yn-btn yn-btn-secondary"; b.type = "button";
  b.innerHTML = "<span>" + escapeHTML(label || "Tombol") + "</span>";
  return b;
}
function setBtnLoading(btn, loading, label){
  label = label || "Jalankan";
  if (!btn) return;
  if (loading) {
    if (!btn._orig) btn._orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="yn-spinner"></span><span>Memproses...</span>';
  } else {
    btn.disabled = false;
    if (btn._orig) { btn.innerHTML = btn._orig; btn._orig = null; }
    else btn.innerHTML = "<span>" + escapeHTML(label) + "</span>";
  }
}
function field(opts){
  const wrap = document.createElement("div"); wrap.className = "yn-field";
  const lb = document.createElement("label");
  lb.className = "yn-field-label"; lb.setAttribute("for", opts.id); lb.textContent = opts.label;
  if (opts.optional) { const o = document.createElement("span"); o.className = "opt"; o.textContent = "(opsional)"; lb.appendChild(o); }
  wrap.appendChild(lb);
  let input;
  if (opts.type === "textarea") { input = document.createElement("textarea"); input.id = opts.id; input.placeholder = opts.placeholder || ""; input.value = opts.value || ""; }
  else if (opts.type === "select" && Array.isArray(opts.options)) {
    input = document.createElement("select"); input.id = opts.id;
    opts.options.forEach(function(o){ const opt = document.createElement("option"); opt.value = o.value; opt.textContent = o.label; if (o.value === opts.value) opt.selected = true; input.appendChild(opt); });
  } else { input = document.createElement("input"); input.id = opts.id; input.type = opts.type || "text"; input.placeholder = opts.placeholder || ""; input.value = opts.value || ""; }
  wrap.appendChild(input);
  if (opts.hint) { const h = document.createElement("div"); h.className = "yn-field-hint"; h.textContent = opts.hint; wrap.appendChild(h); }
  return wrap;
}
function apiKeyField(opts){
  const wrap = document.createElement("div"); wrap.className = "yn-field";
  const lb = document.createElement("label"); lb.className = "yn-field-label"; lb.setAttribute("for", opts.id); lb.textContent = opts.label;
  wrap.appendChild(lb);
  const row = document.createElement("div"); row.className = "yn-input-row";
  const input = document.createElement("input"); input.type = "password"; input.id = opts.id; input.placeholder = opts.placeholder || "";
  row.appendChild(input);
  if (opts.keyUrl) {
    const btn = document.createElement("a");
    btn.className = "yn-api-key-btn";
    btn.href = opts.keyUrl; btn.target = "_blank"; btn.rel = "noopener";
    btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>Ambil Key';
    row.appendChild(btn);
  }
  wrap.appendChild(row);
  if (opts.hint) { const h = document.createElement("div"); h.className = "yn-field-hint"; h.textContent = opts.hint; wrap.appendChild(h); }
  return wrap;
}
function downloadBtn(url, label, filename){
  const b = document.createElement("button"); b.type = "button";
  b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>' + escapeHTML(label || "Unduh");
  b.addEventListener("click", async function(){
    const orig = b.innerHTML; b.disabled = true; b.innerHTML = '<span class="yn-spinner"></span>';
    try {
      const fn = filename || (function(){ try { const u = new URL(url); return (u.pathname.split("/").filter(Boolean).pop() || "").split("?")[0] || ("dl-" + Date.now() + ".bin"); } catch(e) { return "dl-" + Date.now() + ".bin"; } })();
      const ok = await forceDownloadFile(url, fn);
      toast(ok ? "Download dimulai." : "Buka di tab baru.", ok ? "success" : "info");
    } finally { b.disabled = false; b.innerHTML = orig; }
  });
  return b;
}
function copyBtn(text, label){
  const b = document.createElement("button"); b.type = "button";
  b.innerHTML = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>' + escapeHTML(label || "Salin");
  b.addEventListener("click", async function(){
    const v = typeof text === "function" ? text() : text;
    if (!v) return toast("Kosong.", "error");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(v);
      else { const ta = document.createElement("textarea"); ta.value = v; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
      toast("Tersalin.", "success");
    } catch (e) { toast("Gagal menyalin.", "error"); }
  });
  return b;
}
function fmtCount(v){
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v == null ? "0" : v);
  if (n >= 1e9) return (n/1e9).toFixed(1).replace(/\.0$/,"") + "B";
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,"") + "M";
  if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,"") + "K";
  return n.toLocaleString("id-ID");
}
function fmtDate(ts){ if (!ts) return "-"; return new Date(ts).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtBytes(n){ if (!n && n !== 0) return "-"; if (n < 1024) return n + " B"; if (n < 1024*1024) return (n/1024).toFixed(1) + " KB"; return (n/(1024*1024)).toFixed(2) + " MB"; }
function imgFromBlob(url, alt){
  const b = document.createElement("div"); b.className = "yn-result-media";
  const img = document.createElement("img"); img.src = url; img.alt = alt || "hasil"; img.loading = "lazy";
  b.appendChild(img); return b;
}
function metaGrid(items){
  const g = document.createElement("div"); g.className = "yn-result-meta";
  items.forEach(function(it){
    if (it.value == null || it.value === "") return;
    const i = document.createElement("div"); i.className = "yn-result-meta-item";
    i.innerHTML = '<div class="yn-result-meta-label">' + escapeHTML(it.label) + '</div><div class="yn-result-meta-value">' + escapeHTML(String(it.value)) + '</div>';
    g.appendChild(i);
  });
  return g;
}

/* Image upload */
async function compressImage(file, maxDim){
  maxDim = maxDim || 1600;
  if (!file || !file.type.startsWith("image/") || file.size <= 1024 * 1024) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  try {
    const bmp = await createImageBitmap(file);
    const longest = Math.max(bmp.width, bmp.height);
    if (longest <= maxDim) { if (bmp.close) bmp.close(); return file; }
    const scale = maxDim / longest;
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d", { alpha: false });
    ctx.fillStyle = "#F3EFE4"; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h); if (bmp.close) bmp.close();
    const blob = await new Promise(function(r){ c.toBlob(r, "image/jpeg", 0.82); });
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch (e) { return file; }
}
async function uploadImage(file) {
  const uploadFile = await compressImage(file);
  const providers = [
    async function(){
      const fd = new FormData(); fd.append("file", uploadFile);
      const r = await fetchWithTimeout(API_CENTER.services.tmpfiles.baseURL + "/api/v1/upload", { method: "POST", body: fd }, 12000, "upload");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      const u = d && d.data && d.data.url;
      if (!u) throw new Error("no url");
      return u.replace(/^https?:\/\/tmpfiles\.org\//, "https://tmpfiles.org/dl/");
    },
    async function(){
      const fd = new FormData(); fd.append("files[]", uploadFile);
      const r = await fetchWithTimeout(API_CENTER.services.uguu.baseURL + "/upload.php", { method: "POST", body: fd }, 12000, "upload");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      if (!d || !d.files || !d.files[0] || !d.files[0].url) throw new Error("no url");
      return d.files[0].url;
    },
    async function(){
      const fd = new FormData(); fd.append("reqtype", "fileupload"); fd.append("fileToUpload", uploadFile);
      const r = await fetchWithTimeout(API_CENTER.services.catbox.baseURL + "/user/api.php", { method: "POST", body: fd }, 12000, "upload");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const t = (await r.text()).trim();
      if (!/^https?:\/\//i.test(t)) throw new Error("no url");
      return t;
    }
  ];
  return new Promise(function(res, rej){
    let settled = false; let pending = providers.length;
    const finish = function(){ pending--; if (pending <= 0 && !settled) { settled = true; rej(new Error("Semua upload server gagal.")); } };
    providers.forEach(function(p, i){
      setTimeout(function(){
        if (settled) return;
        p().then(function(url){ if (!settled) { settled = true; res(url); } }).catch(finish);
      }, i * 500);
    });
  });
}

/* LOGOS */
const LOGO = {
  tiktok: '<svg viewBox="0 0 48 48"><path d="M34 10c-1.5-2-2.5-4.5-2.7-7H25v28c0 3.5-2.8 6.3-6.3 6.3S12.4 34.5 12.4 31s2.8-6.3 6.3-6.3c.6 0 1.2.1 1.8.3v-6.5c-.6-.1-1.2-.1-1.8-.1C12.9 18.4 8 23.3 8 29.3S12.9 40.2 18.7 40.2 29.4 35.3 29.4 29.3V16.6c2.6 1.9 5.7 3 9.1 3V13c-1.6 0-3.1-.3-4.5-.9z" fill="#556B49"/></svg>',
  instagram: '<svg viewBox="0 0 48 48"><defs><linearGradient id="yg" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#758C68"/><stop offset="50%" stop-color="#B4813F"/><stop offset="100%" stop-color="#556B49"/></linearGradient></defs><rect x="4" y="4" width="40" height="40" rx="10" fill="url(#yg)"/><circle cx="24" cy="24" r="9.5" fill="none" stroke="#FFFDF7" stroke-width="3.4"/><circle cx="35" cy="13" r="2.6" fill="#FFFDF7"/></svg>',
  youtube: '<svg viewBox="0 0 48 48"><path d="M46 14.8c-.5-2-2-3.5-4-4C38.5 10 24 10 24 10s-14.5 0-18 .8c-2 .5-3.5 2-4 4C1.2 18.4 1.2 24 1.2 24s0 5.6.8 9.2c.5 2 2 3.5 4 4C9.5 38 24 38 24 38s14.5 0 18-.8c2-.5 3.5-2 4-4 .8-3.6.8-9.2.8-9.2s0-5.6-.8-9.2z" fill="#A32B1E" opacity=".82"/><path d="M19.5 31V17l13 7z" fill="#FFFDF7"/></svg>',
  spotify: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#556B49"/><path d="M13 19.5c7-2.2 15.5-1.2 22 3.2" stroke="#FFFDF7" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M14 26c5.7-1.7 12.5-.9 17.8 2.6" stroke="#FFFDF7" stroke-width="2.8" fill="none" stroke-linecap="round"/></svg>',
  terabox: '<svg viewBox="0 0 48 48"><path d="M24 4L6 14v20l18 10 18-10V14z" fill="#3F6079"/><path d="M6 14l18 10 18-10M24 24v20" stroke="#FFFDF7" stroke-width="2.2" fill="none" stroke-linejoin="round"/></svg>',
  gemini: '<svg viewBox="0 0 48 48"><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#556B49"/><stop offset="50%" stop-color="#B4813F"/><stop offset="100%" stop-color="#758C68"/></linearGradient></defs><path d="M24 4l4.2 15.8L44 24l-15.8 4.2L24 44l-4.2-15.8L4 24l15.8-4.2z" fill="url(#gg)"/></svg>',
  removebg: '<svg viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="5" fill="#B4813F" opacity=".14"/><rect x="4" y="4" width="40" height="40" rx="5" fill="none" stroke="#B4813F" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="16" cy="16" r="4" fill="#758C68"/><path d="M4 36l12-12 8 8 8-8 12 12" stroke="#556B49" stroke-width="2.5" fill="none" stroke-linejoin="round"/></svg>',
  hdimage: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="32" height="32" rx="4" fill="#758C68"/><circle cx="16" cy="18" r="4" fill="#FFFDF7"/><path d="M4 32l12-12 8 8 12-12 4 4v20z" fill="#FFFDF7" opacity=".55"/></svg>',
  nik: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="4" fill="#3F6079"/><circle cx="16" cy="20" r="4" fill="#FFFDF7"/><path d="M10 30c0-3 3-5 6-5s6 2 6 5" fill="#FFFDF7"/><path d="M26 18h14M26 22h14M26 26h10M26 30h12" stroke="#FFFDF7" stroke-width="1.8" stroke-linecap="round"/></svg>',
  fixerror: '<svg viewBox="0 0 48 48"><path d="M28 8c-6 0-11 5-11 11 0 2 .5 4 1.5 5.5L8 35l5 5 10.5-10.5c1.5 1 3.5 1.5 5.5 1.5 6 0 11-5 11-11S34 8 28 8z" fill="#B4813F"/></svg>',
  web2apk: '<svg viewBox="0 0 48 48"><rect x="12" y="10" width="24" height="28" rx="2" fill="#556B49"/><circle cx="24" cy="34" r="1.5" fill="#FFFDF7"/><path d="M24 16l-5 6h3v6h4v-6h3z" fill="#FFFDF7"/></svg>',
  calculator: '<svg viewBox="0 0 48 48"><rect x="8" y="4" width="32" height="40" rx="5" fill="#556B49"/><rect x="12" y="8" width="24" height="8" rx="2" fill="#C6D3BC"/><g fill="#C6D3BC"><rect x="12" y="20" width="6" height="6" rx="1"/><rect x="21" y="20" width="6" height="6" rx="1"/><rect x="30" y="20" width="6" height="6" rx="1"/><rect x="12" y="29" width="6" height="6" rx="1"/><rect x="21" y="29" width="6" height="6" rx="1"/><rect x="30" y="29" width="6" height="6" rx="1"/></g></svg>',
  deploy: '<svg viewBox="0 0 48 48"><path d="M24 6L8 22h10v14h12V22h10z" fill="#758C68"/><rect x="8" y="40" width="32" height="4" rx="1.5" fill="#556B49"/></svg>',
  ngl: '<svg viewBox="0 0 48 48"><path d="M42 22c0 3.4-.9 6.6-2.6 9.4-2.3 3.9-6.5 6.6-11.4 6.6-1.8 0-3.5-.3-5-.9L13 42l2.5-7.5C12.7 32 10 27.3 10 22 10 13.7 17.2 7 26 7s16 6.7 16 15z" fill="#B4813F"/><text x="24" y="27" text-anchor="middle" fill="#FFFDF7" font-family="Inter,sans-serif" font-size="10" font-weight="700">NGL</text></svg>',
  tiktokstalker: '<svg viewBox="0 0 48 48"><circle cx="22" cy="22" r="14" fill="none" stroke="#556B49" stroke-width="3"/><circle cx="17" cy="20" r="1.5" fill="#556B49"/><circle cx="27" cy="20" r="1.5" fill="#556B49"/><path d="M17 27c2 2 4 2 6 0" stroke="#556B49" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M44 44l-8-8" stroke="#556B49" stroke-width="4" stroke-linecap="round"/></svg>',
  instagramstalker: '<svg viewBox="0 0 48 48"><circle cx="20" cy="20" r="13" fill="none" stroke="#B4813F" stroke-width="2.8"/><rect x="22" y="22" width="18" height="18" rx="5" fill="none" stroke="#758C68" stroke-width="2.4"/><circle cx="31" cy="31" r="5.5" fill="none" stroke="#758C68" stroke-width="2"/><circle cx="37" cy="25" r="1.5" fill="#758C68"/></svg>',
  facebook: '<svg viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="9" fill="#3F6079"/><path d="M28 14h5v7h-4c-1 0-2 1-2 2v3h6l-1 7h-5v10h-7V33h-4v-7h4v-4c0-5 3-8 8-8z" fill="#FFFDF7"/></svg>',
  urltoqr: '<svg viewBox="0 0 48 48"><rect x="6" y="6" width="10" height="10" rx="2" fill="#556B49"/><rect x="32" y="6" width="10" height="10" rx="2" fill="#556B49"/><rect x="6" y="32" width="10" height="10" rx="2" fill="#556B49"/><rect x="20" y="6" width="3" height="3" fill="#B4813F"/><rect x="26" y="10" width="3" height="3" fill="#B4813F"/><rect x="20" y="20" width="8" height="8" rx="1" fill="#B4813F"/></svg>',
  brat: '<svg viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="5" fill="#758C68"/><text x="24" y="30" text-anchor="middle" fill="#FFFDF7" font-family="monospace" font-size="11" font-weight="700">brat</text></svg>',
  iqc: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="4" fill="#B4813F"/><path d="M20 28c-3 0-5-2-5-5s2-5 5-5 5 2 5 5M28 18v10c0 3 2 5 5 5" stroke="#FFFDF7" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
  fakedana: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="4" fill="#3F6079"/><text x="24" y="30" text-anchor="middle" fill="#FFFDF7" font-family="Inter,sans-serif" font-size="10" font-weight="700">DANA</text></svg>',
  fakebankjago: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="4" fill="#B4813F"/><text x="24" y="30" text-anchor="middle" fill="#FFFDF7" font-family="Inter,sans-serif" font-size="9" font-weight="700">JAGO</text></svg>',
  windows: '<svg viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="4" fill="#758C68"/><rect x="10" y="10" width="12" height="12" fill="#FFFDF7"/><rect x="26" y="10" width="12" height="12" fill="#FFFDF7"/><rect x="10" y="26" width="12" height="12" fill="#FFFDF7"/><rect x="26" y="26" width="12" height="12" fill="#FFFDF7"/></svg>',
  ssweb: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="30" rx="3" fill="#3F6079"/><rect x="4" y="8" width="40" height="6" rx="3" fill="#1F241D"/><circle cx="10" cy="11" r="1.5" fill="#FFFDF7"/><circle cx="15" cy="11" r="1.5" fill="#FFFDF7"/><circle cx="20" cy="11" r="1.5" fill="#FFFDF7"/><rect x="8" y="18" width="32" height="16" fill="#FFFDF7" opacity=".9"/></svg>',
  morse: '<svg viewBox="0 0 48 48"><circle cx="10" cy="24" r="4" fill="#556B49"/><rect x="19" y="20" width="18" height="8" rx="2" fill="#B4813F"/><circle cx="10" cy="38" r="3" fill="#758C68"/><circle cx="20" cy="38" r="3" fill="#758C68"/><rect x="28" y="35" width="12" height="6" rx="2" fill="#758C68"/></svg>',
  apitest: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="none" stroke="#758C68" stroke-width="3"/><path d="M16 24h4l3-6 4 12 3-6h2" stroke="#B4813F" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ucbrowser: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#556B49"/><circle cx="24" cy="24" r="14" fill="none" stroke="#FFFDF7" stroke-width="2.4"/><path d="M12 24h24M24 12c4 6 4 18 0 24M24 12c-4 6-4 18 0 24" stroke="#FFFDF7" stroke-width="2" fill="none" opacity=".7"/></svg>',
  ampreset: '<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="6" fill="#B4813F"/><path d="M14 32L24 14l10 18z" fill="#FFFDF7" opacity=".9"/><circle cx="24" cy="28" r="4" fill="#B4813F"/></svg>',
  ampremium: '<svg viewBox="0 0 48 48"><defs><linearGradient id="amg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#B4813F"/><stop offset="100%" stop-color="#556B49"/></linearGradient></defs><path d="M24 4L6 12v12c0 10 8 16 18 20 10-4 18-10 18-20V12z" fill="url(#amg)"/><path d="M16 22l5 5 11-11" stroke="#FFFDF7" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function renderStalkerResult(data) {
  const d = (data && (data.result || data.data)) || data || {};
  const frag = document.createDocumentFragment();
  const card = document.createElement("div"); card.className = "yn-stalker-card";
  const photo = d.avatar || d.photo || d.profile_pic;
  const verified = d.verified === true || String(d.verified || "").toLowerCase() === "verified";
  const name = d.name || d.full_name || d.username || "?";
  const username = d.username || d.user_name || "?";
  const bio = d.bio || d.biography || d.description || "";
  const stats = d.stats || {};
  const followers = stats.followers !== undefined ? stats.followers : (d.followers || 0);
  const following = stats.following !== undefined ? stats.following : (d.following || 0);
  const likes = stats.likes !== undefined ? stats.likes : (d.likes || 0);
  const posts = stats.videos !== undefined ? stats.videos : (stats.posts !== undefined ? stats.posts : (d.posts || 0));
  const badge = verified ? '<span class="yn-stalker-verified"><svg viewBox="0 0 24 24"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"/></svg></span>' : "";
  card.innerHTML = '<div class="yn-stalker-header">' +
    (photo ? ('<img class="yn-stalker-avatar" src="' + escapeHTML(photo) + '" alt="avatar" onerror="this.style.display=\'none\'"/>') : "") +
    '<div class="yn-stalker-info"><div class="yn-stalker-name">' + escapeHTML(name) + badge + '</div><div class="yn-stalker-username">@' + escapeHTML(username) + '</div></div></div>' +
    (bio ? ('<div class="yn-stalker-bio">' + escapeHTML(bio) + '</div>') : "") +
    '<div class="yn-stalker-stats"><div class="yn-stalker-stat"><div class="yn-stalker-stat-value">' + escapeHTML(fmtCount(posts)) + '</div><div class="yn-stalker-stat-label">Posts</div></div><div class="yn-stalker-stat"><div class="yn-stalker-stat-value">' + escapeHTML(fmtCount(followers)) + '</div><div class="yn-stalker-stat-label">Followers</div></div><div class="yn-stalker-stat"><div class="yn-stalker-stat-value">' + escapeHTML(fmtCount(following)) + '</div><div class="yn-stalker-stat-label">Following</div></div><div class="yn-stalker-stat"><div class="yn-stalker-stat-value">' + escapeHTML(fmtCount(likes)) + '</div><div class="yn-stalker-stat-label">Likes</div></div></div>';
  frag.appendChild(card);
  const actions = document.createElement("div"); actions.className = "yn-result-actions";
  if (photo) actions.appendChild(downloadBtn(photo, "Foto Profil", username + "-avatar.jpg"));
  actions.appendChild(copyBtn(JSON.stringify(data, null, 2), "Copy JSON"));
  frag.appendChild(actions);
  frag.appendChild(createJSONToggle(data));
  showResultNode(frag);
}

function renderYouTube(root) {
  const tabs = document.createElement("div"); tabs.className = "yn-yt-tabs";
  const defs = [
    { id: "mp4", label: "MP4", act: "Siapkan MP4", fn: function(u){ return API.youtubeMp4(u); }, kind: "video" },
    { id: "mp3", label: "MP3", act: "Siapkan MP3", fn: function(u){ return API.youtubeMp3(u); }, kind: "audio" },
    { id: "shorts", label: "SHORTS", act: "Ambil Shorts", fn: function(u){ return API.youtubeShorts(u); }, kind: "video" }
  ];
  const tabEls = {}, panels = {};
  defs.forEach(function(d, i){
    const el = document.createElement("button");
    el.type = "button"; el.className = "yn-yt-tab" + (i === 0 ? " active" : ""); el.textContent = d.label;
    tabEls[d.id] = el; tabs.appendChild(el);
    const wrap = document.createElement("div"); wrap.className = "yn-yt-content" + (i === 0 ? " active" : "");
    wrap.appendChild(field({ label: "URL YouTube", id: "yt-" + d.id, type: "url", placeholder: "https://youtube.com/..." }));
    const btn = primaryBtn(d.act); wrap.appendChild(btn);
    panels[d.id] = wrap; root.appendChild(wrap);
    btn.addEventListener("click", async function(){
      const u = $("#yt-" + d.id).value.trim();
      if (!u) return toast("URL wajib.", "error");
      hideResult(); setBtnLoading(btn, true, d.act); setModalLoading(true);
      try {
        const res = await d.fn(u);
        const frag = document.createDocumentFragment();
        if (res.thumbnail) { const t = document.createElement("div"); t.className = "yn-result-media"; const im = document.createElement("img"); im.src = res.thumbnail; t.appendChild(im); frag.appendChild(t); }
        if (res.title) { const h = document.createElement("div"); h.style.cssText = "font-weight:600;margin-bottom:10px;color:var(--ink)"; h.textContent = res.title; frag.appendChild(h); }
        const mb = document.createElement("div"); mb.className = "yn-result-media";
        if (d.kind === "video") { const v = document.createElement("video"); v.src = res.url; v.controls = true; v.playsInline = true; mb.appendChild(v); }
        else { const a = document.createElement("audio"); a.src = res.url; a.controls = true; mb.appendChild(a); }
        frag.appendChild(mb);
        frag.appendChild(metaGrid([
          { label: "Judul", value: res.title },
          { label: "Durasi", value: res.duration || "Tidak tersedia" },
          { label: "Kualitas", value: res.quality || "-" },
          { label: "Tipe", value: d.kind === "video" ? "Video" : "Audio" }
        ]));
        const acts = document.createElement("div"); acts.className = "yn-result-actions";
        acts.appendChild(downloadBtn(res.url, d.kind === "video" ? "Download MP4" : "Download MP3", d.kind === "video" ? "video.mp4" : "audio.mp3"));
        acts.appendChild(copyBtn(res.url, "Copy URL"));
        frag.appendChild(acts);
        frag.appendChild(createJSONToggle(res.raw));
        showResultNode(frag); toast("Berhasil.", "success");
      } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
      finally { setBtnLoading(btn, false, d.act); setModalLoading(false); }
    });
  });
  root.insertBefore(tabs, root.firstChild);
  Object.keys(tabEls).forEach(function(k){
    tabEls[k].addEventListener("click", function(){
      Object.keys(tabEls).forEach(function(kk){ tabEls[kk].classList.toggle("active", kk === k); });
      Object.keys(panels).forEach(function(kk){ panels[kk].classList.toggle("active", kk === k); });
      hideResult();
    });
  });
}
function renderTikTok(root) {
  root.appendChild(field({ label: "URL TikTok", id: "tt-url", type: "textarea", placeholder: "https://www.tiktok.com/@user/video/..." }));
  const btn = primaryBtn("Ambil TikTok"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const raw = $("#tt-url").value.trim();
    if (!raw) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const d = await API.fetchTikTokData(raw);
      const frag = document.createDocumentFragment();
      if (d.author && d.author.unique_id) {
        const hdr = document.createElement("div"); hdr.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:12px";
        if (d.author.avatar) hdr.innerHTML = '<img src="' + escapeHTML(d.author.avatar) + '" style="width:44px;height:44px;border-radius:50%;object-fit:cover"/>';
        hdr.innerHTML += '<div style="font-weight:600">@' + escapeHTML(d.author.unique_id) + '</div>';
        frag.appendChild(hdr);
      }
      if (d.title) { const h = document.createElement("div"); h.style.cssText = "font-size:.84rem;margin-bottom:10px;color:var(--ink-2)"; h.textContent = d.title; frag.appendChild(h); }
      if (Array.isArray(d.images) && d.images.length) {
        d.images.slice(0, 20).forEach(function(u){ const b = document.createElement("div"); b.className = "yn-result-media"; const i = document.createElement("img"); i.src = u; i.loading = "lazy"; b.appendChild(i); frag.appendChild(b); });
      } else if (d.hdplay || d.play) {
        const b = document.createElement("div"); b.className = "yn-result-media";
        const v = document.createElement("video"); v.src = d.hdplay || d.play; v.controls = true; v.playsInline = true; if (d.cover) v.poster = d.cover;
        b.appendChild(v); frag.appendChild(b);
      }
      if (d.music) { const b = document.createElement("div"); b.className = "yn-result-media"; const a = document.createElement("audio"); a.src = d.music; a.controls = true; b.appendChild(a); frag.appendChild(b); }
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      if (d.hdplay || d.play) acts.appendChild(downloadBtn(d.hdplay || d.play, "MP4 HD", "tt-hd.mp4"));
      if (d.music) acts.appendChild(downloadBtn(d.music, "MP3", "tt.mp3"));
      if (d.title) acts.appendChild(copyBtn(d.title, "Copy Caption"));
      frag.appendChild(acts); frag.appendChild(createJSONToggle(d));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderInstagram(root) {
  root.appendChild(field({ label: "URL Instagram", id: "ig-url", type: "url", placeholder: "https://instagram.com/reel/..." }));
  const btn = primaryBtn("Download"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#ig-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const res = await API.instagramDownload(u);
      const frag = document.createDocumentFragment();
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      res.links.forEach(function(l, i){
        const isVideo = /video|mp4|reel/i.test(l.label || "") || /\.mp4/i.test(l.url);
        const b = document.createElement("div"); b.className = "yn-result-media";
        if (isVideo) { const v = document.createElement("video"); v.src = l.url; v.controls = true; v.playsInline = true; b.appendChild(v); }
        else { const im = document.createElement("img"); im.src = l.url; im.loading = "lazy"; b.appendChild(im); }
        frag.appendChild(b);
        acts.appendChild(downloadBtn(l.url, l.label || ("Unduh " + (i+1)), isVideo ? ("ig-" + (i+1) + ".mp4") : ("ig-" + (i+1) + ".jpg")));
      });
      frag.appendChild(acts); frag.appendChild(createJSONToggle(res.raw));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderFacebook(root) {
  root.appendChild(field({ label: "URL Facebook", id: "fb-url", type: "url", placeholder: "https://facebook.com/..." }));
  const btn = primaryBtn("Download"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#fb-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const res = await API.facebookDownload(u);
      const frag = document.createDocumentFragment();
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      res.links.forEach(function(l, i){
        const b = document.createElement("div"); b.className = "yn-result-media";
        const v = document.createElement("video"); v.src = l.url; v.controls = true; v.playsInline = true; b.appendChild(v);
        frag.appendChild(b);
        acts.appendChild(downloadBtn(l.url, l.label || ("Video " + (i+1)), "fb-" + (i+1) + ".mp4"));
      });
      frag.appendChild(acts); frag.appendChild(createJSONToggle(res.raw));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderUCBrowser(root) {
  root.appendChild(createInfoBox("Masukkan URL yang akan diunduh melalui UC Browser Downloader."));
  root.appendChild(field({ label: "URL File", id: "uc-url", type: "url", placeholder: "https://..." }));
  const btn = primaryBtn("Ambil File"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#uc-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const res = await API.ucBrowser(u);
      const frag = document.createDocumentFragment();
      if (res.thumbnail) frag.appendChild(imgFromBlob(res.thumbnail, "thumb"));
      frag.appendChild(metaGrid([
        { label: "Nama File", value: res.title },
        { label: "Kualitas/Ukuran", value: res.quality },
        { label: "Durasi", value: res.duration || "-" }
      ]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      acts.appendChild(downloadBtn(res.url, "Download", res.title.replace(/[^\w\-]+/g, "_") || "file.bin"));
      acts.appendChild(copyBtn(res.url, "Copy URL"));
      frag.appendChild(acts); frag.appendChild(createJSONToggle(res.raw));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderSpotify(root) {
  root.appendChild(createInfoBox("Masukkan URL track Spotify untuk mengambil file audio."));
  root.appendChild(field({ label: "URL Spotify", id: "sp-url", type: "url", placeholder: "https://open.spotify.com/track/..." }));
  const btn = primaryBtn("Ambil Audio"); root.appendChild(btn);

  btn.addEventListener("click", async function(){
    const u = $("#sp-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const res = await API.spotifyDownload(u);
      const frag = document.createDocumentFragment();
      frag.appendChild(metaGrid([
        { label: "Judul", value: res.title },
        { label: "Artist", value: res.artist },
        { label: "Kualitas", value: res.quality }
      ]));
      const mb = document.createElement("div"); mb.className = "yn-result-media";
      const a = document.createElement("audio"); a.src = res.url; a.controls = true; mb.appendChild(a); frag.appendChild(mb);
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      
      const playBtn = document.createElement("button"); playBtn.type = "button";
      playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/></svg>Putar di Player';
      playBtn.addEventListener("click", async function(){
        try {
          await MusicPlayer.playUrl(res.url, { name: res.title, artist: res.artist, source: "Nexray Spotify" });
          toast("Memutar: " + res.title, "success");
        } catch(e){ toast("Gagal putar: " + e.message, "error"); }
      });
      acts.appendChild(playBtn);

      const saveMusicBtn = document.createElement("button"); saveMusicBtn.type = "button";
      saveMusicBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Simpan ke Music';
      saveMusicBtn.addEventListener("click", async function(){
        const old = saveMusicBtn.innerHTML; saveMusicBtn.disabled = true; saveMusicBtn.innerHTML = '<span class="yn-spinner"></span> Menyimpan';
        try { await MusicPlayer.add({url:res.url,name:res.title,artist:res.artist,image:null,duration:0,source:"Spotify Downloader"}); saveMusicBtn.textContent = "Tersimpan di Music"; toast("Lagu disimpan ke Music Player.","success"); }
        catch(e){ saveMusicBtn.disabled=false; saveMusicBtn.innerHTML=old; toast("Gagal menyimpan: "+(e.message || "error"),"error"); }
      });
      acts.appendChild(saveMusicBtn);

      acts.appendChild(downloadBtn(res.url, "Download MP3", res.title.replace(/[^\w\-]+/g, "_") + ".mp3"));
      acts.appendChild(copyBtn(res.url, "Copy URL"));
      frag.appendChild(acts);
      frag.appendChild(createJSONToggle(res.raw));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e)); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderTerabox(root) {
  root.appendChild(createInfoBox("Masukkan tautan berbagi TeraBox. Tautan hasil berasal dari API dan bisa kedaluwarsa."));
  root.appendChild(field({ label: "URL TeraBox", id: "tb-url", type: "url", placeholder: "https://www.terabox.com/…" }));
  const btn = primaryBtn("Ambil File"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#tb-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    try { const parsed = new URL(u); if (!/^https?:$/.test(parsed.protocol) || !/(terabox|1024tera|4funbox|dubox)/i.test(parsed.hostname)) throw new Error("Masukkan URL TeraBox yang valid."); }
    catch(e) { return toast(e.message || "URL tidak valid.", "error"); }
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const res = await API.teraboxDownload(u);
      const frag = document.createDocumentFragment();
      frag.appendChild(metaGrid([{label:"Nama file",value:res.title},{label:"Ukuran",value:res.size || "Tidak tersedia"}]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      res.links.forEach(function(l){ acts.appendChild(downloadBtn(l.url, l.label)); });
      frag.appendChild(acts); frag.appendChild(createJSONToggle(res.raw));
      showResultNode(frag); toast("Link TeraBox berhasil diambil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}

function renderTikTokStalker(root) {
  root.appendChild(field({ label: "Username TikTok", id: "tts-user", type: "text", placeholder: "username (tanpa @)" }));
  const btn = primaryBtn("Stalk"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const uname = $("#tts-user").value.trim();
    if (!uname) return toast("Username wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try { const d = await API.tiktokStalker(uname); renderStalkerResult(d); toast("Berhasil.", "success"); }
    catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderInstagramStalker(root) {
  root.appendChild(field({ label: "Username Telegram", id: "igs-user", type: "text", placeholder: "username (tanpa @)" }));
  const btn = primaryBtn("Stalk Telegram"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const uname = $("#igs-user").value.trim();
    if (!uname) return toast("Username wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try { const d = await API.instagramStalker(uname); renderStalkerResult(d); toast("Berhasil.", "success"); }
    catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}

function renderAMPreset(root) {
  root.appendChild(createInfoBox("Masukkan URL TikTok yang mengandung preset Alight Motion. Sistem akan memindai komentar/reply untuk menemukan tautan preset."));
  root.appendChild(field({ label: "URL TikTok Video", id: "amp-url", type: "url", placeholder: "https://vt.tiktok.com/..." }));
  const btn = primaryBtn("Cari Preset"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#amp-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const d = await API.amPreset(u);
      const frag = document.createDocumentFragment();
      if (d.author && d.author.username) {
        const hdr = document.createElement("div"); hdr.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:12px";
        if (d.author.avatar) hdr.innerHTML = '<img src="' + escapeHTML(d.author.avatar) + '" style="width:44px;height:44px;border-radius:50%;object-fit:cover"/>';
        hdr.innerHTML += '<div><div style="font-weight:600">@' + escapeHTML(d.author.username) + '</div><div style="font-size:.7rem;color:var(--ink-3)">' + escapeHTML(d.author.nickname || "") + '</div></div>';
        frag.appendChild(hdr);
      }
      frag.appendChild(metaGrid([
        { label: "Total Preset", value: d.total || 0 },
        { label: "Tipe", value: d.types ? Object.keys(d.types).map(function(k){ return k + ": " + d.types[k]; }).join(", ") : "-" },
        { label: "Platform", value: d.platform || "tiktok" }
      ]));
      const list = document.createElement("div");
      list.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:10px";
      (d.presets || []).forEach(function(p, i){
        const card = document.createElement("div");
        card.style.cssText = "padding:12px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--radius-sm)";
        const typeBadge = '<span style="font-family:var(--font-mono);font-size:.54rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-2);background:rgba(180,129,63,.1);border:1px solid rgba(180,129,63,.4);padding:.2rem .55rem;border-radius:2px">' + escapeHTML(p.type || "?") + '</span>';
        const commenter = p.commenter ? ' <span style="font-family:var(--font-mono);font-size:.56rem;color:var(--ink-3)">' + escapeHTML(p.commenter) + '</span>' : '';
        const byAuthor = p.byAuthor ? ' <span style="font-family:var(--font-mono);font-size:.5rem;color:var(--sage-2)">✓ by author</span>' : '';
        card.innerHTML = '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">' + typeBadge + commenter + byAuthor + '</div>' + (p.detail ? '<div style="font-family:var(--font-mono);font-size:.6rem;line-height:1.5;color:var(--ink-2);margin-bottom:8px;overflow-wrap:anywhere">' + escapeHTML(p.detail) + '</div>' : '');
        const acts = document.createElement("div"); acts.className = "yn-result-actions";
        if (p.download) acts.appendChild(downloadBtn(p.download, "Download", "preset-" + i + ".xml"));
        if (p.url) {
          const openBtn = document.createElement("a");
          openBtn.href = p.url; openBtn.target = "_blank"; openBtn.rel = "noopener";
          openBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>Buka';
          acts.appendChild(openBtn);
        }
        card.appendChild(acts);
        list.appendChild(card);
      });
      frag.appendChild(list);
      frag.appendChild(createJSONToggle(d));
      showResultNode(frag); toast("Ditemukan " + (d.total || 0) + " preset.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}

function renderAMPremium(root) {
  root.appendChild(createInfoBox("Generator Alight Motion Premium. Masukkan email, minta magic link, lalu tempel magic link yang diterima di email untuk verifikasi."));
  const STEP = { EMAIL: 1, VERIFY: 2, DONE: 3 };
  let currentStep = STEP.EMAIL;
  let currentEmail = "";
  let currentIdToken = "";
  let currentRawLink = "";

  const panel = document.createElement("div");
  panel.style.cssText = "display:flex;flex-direction:column;gap:12px";
  root.appendChild(panel);

  function renderStep() {
    panel.innerHTML = "";
    const indicator = document.createElement("div");
    indicator.style.cssText = "display:flex;gap:6px;margin-bottom:6px";
    [["1","Email"],["2","Verifikasi"],["3","Selesai"]].forEach(function(s, i){
      const num = i + 1;
      const active = (currentStep === STEP.EMAIL && num === 1) || (currentStep === STEP.VERIFY && num === 2) || (currentStep === STEP.DONE && num === 3);
      const done = num < currentStep;
      const el = document.createElement("div");
      el.style.cssText = "flex:1;padding:6px;text-align:center;border-radius:3px;font-family:var(--font-mono);font-size:.54rem;letter-spacing:.14em;text-transform:uppercase;border:1px solid " + (active ? "var(--sage)" : (done ? "rgba(63,107,76,.4)" : "var(--line-2)")) + ";background:" + (active ? "var(--sage-soft)" : (done ? "rgba(63,107,76,.06)" : "var(--surface-2)")) + ";color:" + (active ? "var(--sage-3)" : (done ? "var(--success-2)" : "var(--ink-3)")) + ";font-weight:" + (active ? "700" : "500");
      el.textContent = s[1];
      indicator.appendChild(el);
    });
    panel.appendChild(indicator);

    if (currentStep === STEP.EMAIL) {
      panel.appendChild(field({ label: "Email Alight Motion", id: "amprem-email", type: "email", placeholder: "email@contoh.com", value: currentEmail }));
      const sendBtn = primaryBtn("Kirim Magic Link");
      sendBtn.addEventListener("click", async function(){
        const email = $("#amprem-email").value.trim();
        if (!email) return toast("Email wajib.", "error");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Email tidak valid.", "error");
        hideResult(); setBtnLoading(sendBtn, true); setModalLoading(true);
        try {
          const res = await API.amPremiumPost("send-magiclink", { email: email });
          if (!res.success) throw new Error(res.message || "Gagal kirim magic link.");
          currentEmail = email;
          currentStep = STEP.VERIFY;
          toast("Magic link terkirim. Cek email kamu.", "success");
          renderStep();
        } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
        finally { setBtnLoading(sendBtn, false); setModalLoading(false); }
      });
      panel.appendChild(sendBtn);
    } else if (currentStep === STEP.VERIFY) {
      panel.appendChild(createInfoBox("Cek email kamu, temukan magic link, lalu tempel URL lengkapnya di bawah."));
      panel.appendChild(field({ label: "Magic Link (URL lengkap dari email)", id: "amprem-raw", type: "textarea", placeholder: "https://...", value: currentRawLink }));
      const verifyBtn = primaryBtn("Verifikasi Akun");
      verifyBtn.addEventListener("click", async function(){
        const raw = $("#amprem-raw").value.trim();
        if (!raw) return toast("Magic link wajib.", "error");
        hideResult(); setBtnLoading(verifyBtn, true); setModalLoading(true);
        try {
          const res = await API.amPremiumPost("verify-account", { email: currentEmail, rawLink: raw });
          if (!res.success) throw new Error(res.message || "Verifikasi gagal.");
          currentIdToken = res.idToken || (res.profile && res.profile.idToken);
          if (!currentIdToken) throw new Error("idToken tidak ditemukan.");
          currentRawLink = raw;
          const applyRes = await API.amPremiumPost("apply-premium", { email: currentEmail, idToken: currentIdToken });
          if (!applyRes.success) throw new Error(applyRes.message || "Apply premium gagal.");
          const frag = document.createDocumentFragment();
          frag.appendChild(createSuccessBox("Alight Motion Premium Aktif", [
            ["Email", currentEmail],
            ["Status", "Premium aktif"]
          ]));
          frag.appendChild(createJSONToggle(applyRes));
          showResultNode(frag);
          currentStep = STEP.DONE;
          toast("Premium berhasil diaktifkan!", "success");
          renderStep();
        } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
        finally { setBtnLoading(verifyBtn, false); setModalLoading(false); }
      });
      panel.appendChild(verifyBtn);
      const backBtn = secondaryBtn("Ganti Email");
      backBtn.addEventListener("click", function(){ currentStep = STEP.EMAIL; renderStep(); });
      panel.appendChild(backBtn);
    } else {
      panel.appendChild(createSuccessBox("Selesai", [
        ["Email", currentEmail],
        ["Status", "Premium Alight Motion aktif"]
      ]));
      const resetBtn = primaryBtn("Mulai Lagi");
      resetBtn.addEventListener("click", function(){ currentStep = STEP.EMAIL; currentEmail = ""; currentIdToken = ""; currentRawLink = ""; hideResult(); renderStep(); });
      panel.appendChild(resetBtn);
    }
  }
  renderStep();
}

function renderRemoveBG(root) {
  root.appendChild(createInfoBox("Upload file gambar. Server akan menghapus background dan mengembalikan PNG transparan."));
  const up = document.createElement("div"); up.className = "yn-field";
  up.innerHTML = '<label class="yn-field-label" for="rb-file">Gambar Sumber</label><input type="file" id="rb-file" accept="image/*" style="width:100%;padding:.7rem;background:var(--surface);border:1px solid var(--line-2);border-radius:4px;font-size:.8rem"/>';
  root.appendChild(up);
  const statusEl = document.createElement("div");
  statusEl.style.cssText = "font-family:var(--font-mono);font-size:.58rem;color:var(--ink-3);margin-bottom:8px";
  statusEl.textContent = "Belum ada file.";
  root.appendChild(statusEl);
  const fi = up.querySelector("#rb-file");
  fi.addEventListener("change", function(){
    const f = fi.files && fi.files[0];
    if (!f) { statusEl.textContent = "Belum ada file."; return; }
    if (!/^image\//.test(f.type)) { statusEl.textContent = "Harus gambar."; fi.value = ""; return; }
    if (f.size > 15 * 1024 * 1024) { statusEl.textContent = "Maks 15MB."; fi.value = ""; return; }
    statusEl.textContent = f.name + " (" + (f.size/1024).toFixed(1) + " KB)";
  });
  const btn = primaryBtn("Remove Background"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const f = fi.files && fi.files[0];
    if (!f) return toast("Pilih gambar.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    statusEl.textContent = "Mengunggah gambar ke server...";
    try {
      const url = await uploadImage(f);
      statusEl.textContent = "Memproses hapus background...";
      const out = await API.removeBG(url);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(out.url, "removed-bg"));
      frag.appendChild(metaGrid([{ label: "Ukuran Hasil", value: fmtBytes(out.blob.size) }, { label: "Tipe", value: out.blob.type || "PNG" }]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download PNG';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "removed-bg-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
      statusEl.textContent = "Selesai.";
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); statusEl.textContent = "Gagal."; }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderHDImage(root) {
  const up = document.createElement("div"); up.className = "yn-field";
  up.innerHTML = '<label class="yn-field-label" for="hdi-file">Gambar Sumber</label><input type="file" id="hdi-file" accept="image/*" style="width:100%;padding:.7rem;background:var(--surface);border:1px solid var(--line-2);border-radius:4px;font-size:.8rem"/>';
  root.appendChild(up);
  root.appendChild(field({ label: "Skala", id: "hdi-scale", type: "select", value: "2", options: [{ value: "2", label: "2x" }, { value: "3", label: "3x" }, { value: "4", label: "4x" }] }));
  const btn = primaryBtn("Upscale"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const f = up.querySelector("#hdi-file").files && up.querySelector("#hdi-file").files[0];
    if (!f) return toast("Pilih gambar.", "error");
    const scale = Math.max(2, Math.min(4, parseInt($("#hdi-scale").value) || 2));
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const img = await new Promise(function(res, rej){ const i = new Image(); i.onload = function(){ res(i); }; i.onerror = rej; i.src = URL.createObjectURL(f); });
      const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
      if (w * h > 40e6) throw new Error("Hasil >40MP. Coba skala lebih kecil.");
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      const outUrl = c.toDataURL("image/png");
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(outUrl, "hd-result"));
      frag.appendChild(metaGrid([{ label: "Dimensi", value: w + " x " + h }, { label: "Skala", value: scale + "x" }, { label: "Format", value: "PNG" }]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = outUrl; a.download = "hd-" + w + "x" + h + "-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(e.message || "Gagal upscale."); toast(e.message || "Gagal.", "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderURLtoQR(root) {
  root.appendChild(field({ label: "URL / Teks", id: "qr-url", type: "text", placeholder: "https://example.com" }));
  const btn = primaryBtn("Generate QR"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#qr-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const res = await API.urlToQR(u);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(res.url, "QR Code"));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      acts.appendChild(downloadBtn(res.url, "Download PNG", "qr-" + Date.now() + ".png"));
      acts.appendChild(copyBtn(res.url, "Copy URL"));
      frag.appendChild(acts); frag.appendChild(createJSONToggle(res.raw));
      showResultNode(frag); toast("QR dibuat.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderNIKParser(root) {
  root.appendChild(field({ label: "NIK", id: "nik-in", type: "text", placeholder: "16 digit" }));
  const btn = primaryBtn("Parse NIK"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const nik = $("#nik-in").value.trim();
    if (!/^\d{16}$/.test(nik)) return toast("NIK harus 16 digit.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const d = await API.nikParser(nik);
      const grid = document.createElement("div"); grid.className = "yn-kv-grid";
      const flat = function(obj, p){ p = p || ""; const o = {}; for (const k in obj) { const v = obj[k]; const key = p ? (p + "." + k) : k; if (v && typeof v === "object" && !Array.isArray(v)) { const sub = flat(v, key); Object.keys(sub).forEach(function(sk){ o[sk] = sub[sk]; }); } else o[key] = v; } return o; };
      const f = flat(d || {}, "");
      for (const k in f) { const item = document.createElement("div"); item.className = "yn-kv-item"; item.innerHTML = '<div class="yn-kv-key">' + escapeHTML(k) + '</div><div class="yn-kv-val">' + escapeHTML(String(f[k] == null ? "-" : f[k])) + '</div>'; grid.appendChild(item); }
      const frag = document.createDocumentFragment();
      frag.appendChild(grid); frag.appendChild(createJSONToggle(d));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderFixError(root) {
  root.appendChild(field({ label: "Kode / Error", id: "fix-code", type: "textarea", placeholder: "Paste kode error..." }));
  const btn = primaryBtn("Fix Error"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const c = $("#fix-code").value.trim();
    if (!c) return toast("Kode wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const d = await API.fixError(c);
      const txt = document.createElement("div"); txt.className = "yn-result-text";
      txt.textContent = typeof d === "string" ? d : (d.result || d.message || d.fixed || JSON.stringify(d, null, 2));
      const frag = document.createDocumentFragment();
      frag.appendChild(txt); frag.appendChild(createJSONToggle(d));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderWebToApk(root) {
  root.appendChild(field({ label: "URL Website", id: "apk-url", type: "url", placeholder: "https://..." }));
  const up = document.createElement("div"); up.className = "yn-field";
  up.innerHTML = '<label class="yn-field-label" for="apk-icon">Icon App (PNG 512x512)</label><input type="file" id="apk-icon" accept="image/*" style="width:100%;padding:.7rem;background:var(--surface);border:1px solid var(--line-2);border-radius:4px;font-size:.8rem"/>';
  root.appendChild(up);
  const statusEl = document.createElement("div");
  statusEl.style.cssText = "font-family:var(--font-mono);font-size:.58rem;color:var(--ink-3);margin-bottom:8px";
  statusEl.textContent = "Icon: belum dipilih";
  root.appendChild(statusEl);
  up.querySelector("#apk-icon").addEventListener("change", function(){
    const f = up.querySelector("#apk-icon").files && up.querySelector("#apk-icon").files[0];
    if (f) statusEl.textContent = "Icon: " + f.name + " (" + (f.size/1024).toFixed(1) + " KB)";
  });
  root.appendChild(field({ label: "Nama App", id: "apk-name", type: "text", placeholder: "My App" }));
  root.appendChild(field({ label: "Package", id: "apk-pkg", type: "text", placeholder: "com.example.app", optional: true }));
  const btn = primaryBtn("Build APK"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#apk-url").value.trim();
    const n = $("#apk-name").value.trim();
    const p = $("#apk-pkg").value.trim();
    const f = up.querySelector("#apk-icon").files && up.querySelector("#apk-icon").files[0];
    if (!u) return toast("URL wajib.", "error");
    if (!f) return toast("Icon wajib.", "error");
    if (!n) return toast("Nama wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const icon = await uploadImage(f);
      const full = buildURL("webToApk", { url: u, icon: icon, name: n, package: p, version: "1.0.0" });
      const d = await fetchJSON(full);
      const txt = document.createElement("div"); txt.className = "yn-result-text";
      txt.textContent = JSON.stringify(d, null, 2);
      const frag = document.createDocumentFragment();
      frag.appendChild(txt); frag.appendChild(createJSONToggle(d));
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderNGL(root) {
  root.appendChild(field({ label: "URL / Username NGL", id: "ngl-username", type: "text", placeholder: "https://ngl.link/username" }));
  root.appendChild(field({ label: "Pesan", id: "ngl-message", type: "textarea", placeholder: "Tulis pesan..." }));
  root.appendChild(field({ label: "Jumlah", id: "ngl-count", type: "number", placeholder: "10", value: "10" }));
  const btn = primaryBtn("Kirim NGL"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const raw = $("#ngl-username").value.trim();
    const message = $("#ngl-message").value.trim();
    const amount = parseInt($("#ngl-count").value) || 10;
    if (!raw) return toast("Target wajib.", "error");
    if (!message) return toast("Pesan wajib.", "error");
    const url = /^https?:\/\//i.test(raw) ? raw : ("https://ngl.link/" + raw.replace(/^@/, ""));
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const d = await API.nglSpam(url, message, amount);
      const grid = document.createElement("div"); grid.className = "yn-kv-grid";
      [["Status", d.status ? "OK" : "Gagal"], ["Result", d.result || "-"]].forEach(function(item){
        const it = document.createElement("div"); it.className = "yn-kv-item";
        it.innerHTML = '<div class="yn-kv-key">' + escapeHTML(item[0]) + '</div><div class="yn-kv-val">' + escapeHTML(String(item[1])) + '</div>';
        grid.appendChild(it);
      });
      const frag = document.createDocumentFragment();
      frag.appendChild(grid); frag.appendChild(createJSONToggle(d));
      showResultNode(frag); toast("Terkirim.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderBrat(root) {
  const tabs = document.createElement("div"); tabs.className = "yn-yt-tabs"; tabs.style.gridTemplateColumns = "1fr 1fr";
  const tabImg = document.createElement("button"); tabImg.type = "button"; tabImg.className = "yn-yt-tab active"; tabImg.textContent = "TEKS BIASA";
  const tabVid = document.createElement("button"); tabVid.type = "button"; tabVid.className = "yn-yt-tab"; tabVid.textContent = "TEKS ANIMASI";
  tabs.appendChild(tabImg); tabs.appendChild(tabVid); root.appendChild(tabs);
  const imgPanel = document.createElement("div"); imgPanel.className = "yn-yt-content active";
  imgPanel.appendChild(field({ label: "Teks", id: "brat-img-text", type: "textarea", placeholder: "", value: "" }));
  const btnImg = primaryBtn("Generate Brat PNG"); imgPanel.appendChild(btnImg);
  const vidPanel = document.createElement("div"); vidPanel.className = "yn-yt-content";
  vidPanel.appendChild(field({ label: "Teks Animasi", id: "brat-vid-text", type: "textarea", placeholder: " ", value: " " }));
  const btnVid = primaryBtn("Generate Brat Video"); vidPanel.appendChild(btnVid);
  root.appendChild(imgPanel); root.appendChild(vidPanel);
  tabImg.addEventListener("click", function(){ tabImg.classList.add("active"); tabVid.classList.remove("active"); imgPanel.classList.add("active"); vidPanel.classList.remove("active"); hideResult(); });
  tabVid.addEventListener("click", function(){ tabVid.classList.add("active"); tabImg.classList.remove("active"); vidPanel.classList.add("active"); imgPanel.classList.remove("active"); hideResult(); });
  async function run(kind, btn, textId) {
    const text = $(textId).value.trim();
    if (!text) return toast("Teks wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const out = kind === "img" ? await API.bratImage(text) : await API.bratVideo(text);
      const frag = document.createDocumentFragment();
      if (kind === "img") frag.appendChild(imgFromBlob(out.url, "brat"));
      else { const b = document.createElement("div"); b.className = "yn-result-media"; const v = document.createElement("video"); v.src = out.url; v.controls = true; v.playsInline = true; v.loop = true; b.appendChild(v); frag.appendChild(b); }
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "brat-" + Date.now() + "." + (kind === "img" ? "png" : "mp4");
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  }
  btnImg.addEventListener("click", function(){ run("img", btnImg, "#brat-img-text"); });
  btnVid.addEventListener("click", function(){ run("vid", btnVid, "#brat-vid-text"); });
}
function renderIQC(root) {
  root.appendChild(field({ label: "Teks", id: "iqc-text", type: "textarea", placeholder: "hi", value: "hi" }));
  const btn = primaryBtn("Generate IQC"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const text = $("#iqc-text").value.trim();
    if (!text) return toast("Teks wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const out = await API.iqc(text);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(out.url, "iqc"));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download PNG';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "iqc-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderWindowsCanvas(root) {
  root.appendChild(createInfoBox("Windows Canvas — render teks bergaya chat Windows. Pisahkan antar baris dengan tanda | (pipe)."));
  root.appendChild(field({ label: "Teks", id: "wmp1-text", type: "textarea", placeholder: "ngapain cemburu|kan|cuman sebatas|teman", value: "ngapain cemburu|kan|cuman sebatas|teman" }));
  const btn = primaryBtn("Generate Canvas"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const text = $("#wmp1-text").value.trim();
    if (!text) return toast("Teks wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const out = await API.windowsCanvas(text);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(out.url, "windows-canvas"));
      frag.appendChild(metaGrid([{ label: "Ukuran", value: fmtBytes(out.blob.size) }, { label: "Tipe", value: out.blob.type || "gambar" }]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "windows-canvas-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderSSWeb(root) {
  root.appendChild(createInfoBox("Screenshot halaman web — masukkan URL lengkap."));
  root.appendChild(field({ label: "URL Website", id: "ssweb-url", type: "url", placeholder: "https://example.com" }));
  const btn = primaryBtn("Ambil Screenshot"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const u = $("#ssweb-url").value.trim();
    if (!u) return toast("URL wajib.", "error");
    if (!/^https?:\/\//i.test(u)) return toast("URL harus dimulai http:// atau https://", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const out = await API.ssweb(u);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(out.url, "screenshot"));
      frag.appendChild(metaGrid([{ label: "Ukuran", value: fmtBytes(out.blob.size) }, { label: "URL", value: u }]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "ssweb-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Screenshot berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderFakeDana(root) {
  root.appendChild(field({ label: "Nominal", id: "dana-nominal", type: "text", placeholder: "", value: "" }));
  const btn = primaryBtn("Generate"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const n = $("#dana-nominal").value.trim();
    if (!n) return toast("Nominal wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const out = await API.fakeDana(n);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(out.url, "fakedana"));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download PNG';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "fakedana-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderFakeBankJago(root) {
  root.appendChild(field({ label: "Nama Pemilik", id: "jago-nama", type: "text", placeholder: "Zill", value: "" }));
  root.appendChild(field({ label: "Saldo", id: "jago-saldo", type: "text", placeholder: "10000", value: "" }));
  const btn = primaryBtn("Generate"); root.appendChild(btn);
  btn.addEventListener("click", async function(){
    const nama = $("#jago-nama").value.trim();
    const saldo = $("#jago-saldo").value.trim();
    if (!nama) return toast("Nama wajib.", "error");
    if (!saldo) return toast("Saldo wajib.", "error");
    hideResult(); setBtnLoading(btn, true); setModalLoading(true);
    try {
      const out = await API.fakeBankJago(nama, saldo);
      const frag = document.createDocumentFragment();
      frag.appendChild(imgFromBlob(out.url, "fakebankjago"));
      frag.appendChild(metaGrid([{ label: "Nama", value: nama }, { label: "Saldo", value: "Rp " + Number(saldo).toLocaleString("id-ID") }]));
      const acts = document.createElement("div"); acts.className = "yn-result-actions";
      const dl = document.createElement("button"); dl.type = "button";
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>Download PNG';
      dl.addEventListener("click", function(){
        const a = document.createElement("a"); a.href = out.url; a.download = "fakejago-" + Date.now() + ".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast("Download dimulai.", "success");
      });
      acts.appendChild(dl); frag.appendChild(acts);
      showResultNode(frag); toast("Berhasil.", "success");
    } catch (e) { showError(friendlyError(e), e.raw); toast(friendlyError(e), "error"); }
    finally { setBtnLoading(btn, false); setModalLoading(false); }
  });
}
function renderGemini(root) {
  const KEY_STORE = "gemini_key", MODEL_STORE = "gemini_model", CHAT_STORE = "gemini_chat", SYS_STORE = "gemini_sys";
  const PRIORITY = ["gemini-2.5-flash","gemini-2.5-pro","gemini-2.0-flash","gemini-1.5-flash"];
  root.appendChild(apiKeyField({ label: "Gemini API Key", id: "gem-key", placeholder: "AIza...", keyUrl: "https://aistudio.google.com/app/apikey" }));
  const mw = document.createElement("div"); mw.className = "yn-field";
  mw.innerHTML = '<label class="yn-field-label" for="gem-model">Model</label><div class="yn-input-row"><select id="gem-model" style="flex:1"><option value="">Muat key dulu...</option></select><button type="button" class="yn-btn yn-btn-secondary" id="gem-refresh" style="width:auto;padding:0 14px;margin:0;font-size:.7rem">Muat</button></div>';
  root.appendChild(mw);
  root.appendChild(field({ label: "System Prompt", id: "gem-sys", type: "textarea", placeholder: "Kamu adalah...", optional: true }));
  const row = document.createElement("div"); row.className = "yn-btn-row";
  const saveBtn = primaryBtn("Simpan Key"); const clrBtn = secondaryBtn("Hapus");
  row.appendChild(saveBtn); row.appendChild(clrBtn); root.appendChild(row);
  const log = document.createElement("div"); log.className = "yn-chat-log"; root.appendChild(log);
  const ir = document.createElement("div"); ir.className = "yn-chat-input";
  ir.innerHTML = '<textarea id="gem-in" placeholder="Tulis pesan..." rows="2"></textarea><button class="yn-chat-send" id="gem-send" type="button">Kirim</button>';
  root.appendChild(ir);
  let key = Store.get(KEY_STORE) || ""; let model = Store.get(MODEL_STORE) || ""; let sys = Store.get(SYS_STORE) || "";
  let history = []; try { const r = Store.get(CHAT_STORE); if (r) history = JSON.parse(r) || []; } catch(e){}
  const persist = function(){ Store.set(CHAT_STORE, JSON.stringify(history.slice(-40))); };
  $("#gem-sys").value = sys;
  $("#gem-sys").addEventListener("input", function(e){ sys = e.target.value; Store.set(SYS_STORE, sys); });
  const msel = $("#gem-model");
  async function loadModels(k, pref) {
    if (!k) return false;
    setBtnLoading($("#gem-refresh"), true);
    try {
      const models = await API.geminiListModels(k);
      if (!models.length) throw new Error("Tidak ada model.");
      key = k;
      const names = models.map(function(m){ return m.name.replace(/^models\//, ""); });
      const sorted = names.slice().sort(function(a, b){ const ai = PRIORITY.indexOf(a), bi = PRIORITY.indexOf(b); return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi); });
      msel.innerHTML = "";
      sorted.forEach(function(n){ const o = document.createElement("option"); o.value = n; o.textContent = n; msel.appendChild(o); });
      model = pref && sorted.indexOf(pref) !== -1 ? pref : sorted[0];
      msel.value = model;
      Store.set(KEY_STORE, key); Store.set(MODEL_STORE, model);
      return true;
    } catch (e) { toast(e.message, "error"); return false; }
    finally { setBtnLoading($("#gem-refresh"), false); }
  }
  const renderChat = function(){
    log.innerHTML = "";
    if (!history.length) { log.innerHTML = '<div style="text-align:center;padding:20px;color:var(--ink-3);font-family:var(--font-mono);font-size:.66rem">Mulai percakapan.</div>'; return; }
    history.forEach(function(m){ const b = document.createElement("div"); b.className = "yn-bubble " + (m.role === "user" ? "user" : "assistant"); b.textContent = (m.parts || []).map(function(p){ return p.text || ""; }).join(""); log.appendChild(b); });
    log.scrollTop = log.scrollHeight;
  };
  saveBtn.addEventListener("click", async function(){
    const k = $("#gem-key").value.trim();
    if (!k) return toast("Key wajib.", "error");
    if (await loadModels(k, model)) toast("Key tersimpan.", "success");
  });
  $("#gem-refresh").addEventListener("click", function(){ loadModels($("#gem-key").value.trim() || key, model); });
  msel.addEventListener("change", function(){ if (msel.value) { model = msel.value; Store.set(MODEL_STORE, model); } });
  clrBtn.addEventListener("click", function(){ key = ""; model = ""; Store.remove(KEY_STORE); Store.remove(MODEL_STORE); msel.innerHTML = '<option value="">Muat key dulu...</option>'; toast("Dihapus.", "success"); });
  const send = async function(){
    if (!key) return toast("Simpan key dulu.", "error");
    if (!model) return toast("Pilih model.", "error");
    const q = $("#gem-in").value.trim();
    if (!q) return;
    $("#gem-in").value = ""; $("#gem-send").disabled = true;
    history.push({ role: "user", parts: [{ text: q }] }); persist(); renderChat();
    setModalLoading(true);
    try {
      const res = await API.geminiChat(key, model, history, sys);
      history.push({ role: "model", parts: [{ text: res.text }] }); persist(); renderChat();
    } catch (e) { toast(e.message, "error"); history.pop(); persist(); }
    finally { $("#gem-send").disabled = false; setModalLoading(false); }
  };
  $("#gem-send").addEventListener("click", send);
  $("#gem-in").addEventListener("keydown", function(e){ if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  renderChat();
  if (key) { $("#gem-key").value = key; if (model) { msel.innerHTML = '<option value="' + model + '" selected>' + model + '</option>'; } loadModels(key, model); }
}
function renderCalculator(root) {
  const wrap = document.createElement("div"); wrap.className = "yn-calc";
  const disp = document.createElement("div"); disp.className = "yn-calc-display";
  disp.innerHTML = '<div class="yn-calc-history"></div><div class="yn-calc-result">0</div>';
  wrap.appendChild(disp);
  const keys = document.createElement("div"); keys.className = "yn-calc-keys"; wrap.appendChild(keys);
  root.appendChild(wrap);
  let expr = "", justEval = false;
  const histEl = disp.querySelector(".yn-calc-history"); const resEl = disp.querySelector(".yn-calc-result");
  const upd = function(){ resEl.textContent = expr || "0"; };
  function evalExpr(src) {
    const input = src.replace(/x/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\s+/g, "");
    if (!/^[0-9.+*/()\-]+$/.test(input)) throw new Error();
    let i = 0;
    const pr = function(){ if (input[i] === "+") { i++; return pr(); } if (input[i] === "-") { i++; return -pr(); } if (input[i] === "(") { i++; const v = as(); if (input[i] !== ")") throw new Error(); i++; return v; } const s = i; let d = 0; while (i < input.length && /[0-9.]/.test(input[i])) { if (input[i] === ".") d++; i++; } if (s === i || d > 1) throw new Error(); return Number(input.slice(s, i)); };
    const md = function(){ let v = pr(); while (input[i] === "*" || input[i] === "/") { const op = input[i++]; const r = pr(); v = op === "*" ? v * r : v / r; } return v; };
    const as = function(){ let v = md(); while (input[i] === "+" || input[i] === "-") { const op = input[i++]; const r = md(); v = op === "+" ? v + r : v - r; } return v; };
    const r = as();
    if (i !== input.length) throw new Error();
    return r;
  }
  const press = function(v){
    if (v === "=") { if (!expr) return; try { const r = evalExpr(expr); histEl.textContent = expr + " ="; expr = String(r); justEval = true; } catch(e) { resEl.style.color = "var(--danger)"; setTimeout(function(){ resEl.style.color = ""; }, 1200); expr = ""; } upd(); return; }
    if (v === "C") { expr = ""; histEl.textContent = ""; justEval = false; upd(); return; }
    if (v === "DEL") { expr = expr.slice(0, -1); justEval = false; upd(); return; }
    if (justEval) { if (/[\d.]/.test(v)) expr = ""; justEval = false; }
    expr += v; upd();
  };
  [["C","C","clear"],["(","(","func"],[")",")","func"],["÷","÷","op"],["7","7",""],["8","8",""],["9","9",""],["x","x","op"],["4","4",""],["5","5",""],["6","6",""],["−","−","op"],["1","1",""],["2","2",""],["3","3",""],["+","+","op"],["0","0",""],[".",".","func"],["DEL","DEL","clear"],["=","=","eq"]].forEach(function(row){
    const b = document.createElement("button"); b.type = "button"; b.className = "yn-calc-key" + (row[2] ? " " + row[2] : ""); b.textContent = row[0];
    b.addEventListener("click", function(){ press(row[1]); });
    keys.appendChild(b);
  });
}
function renderDeploy(root) {
  const VERCEL_KEY = "vercel_token", NETLIFY_KEY = "netlify_token";
  root.appendChild(createInfoBox("Deploy HTML ke Vercel atau Netlify. Token disimpan lokal. Untuk produksi, gunakan backend proxy."));
  const tabs = document.createElement("div"); tabs.className = "yn-yt-tabs"; tabs.style.gridTemplateColumns = "1fr 1fr";
  const tabVercel = document.createElement("button"); tabVercel.type = "button"; tabVercel.className = "yn-yt-tab active"; tabVercel.textContent = "VERCEL";
  const tabNetlify = document.createElement("button"); tabNetlify.type = "button"; tabNetlify.className = "yn-yt-tab"; tabNetlify.textContent = "NETLIFY";
  tabs.appendChild(tabVercel); tabs.appendChild(tabNetlify); root.appendChild(tabs);
  function buildPanel(platform) {
    const wrap = document.createElement("div");
    wrap.className = "yn-yt-content" + (platform === "vercel" ? " active" : "");
    const isVercel = platform === "vercel";
    const keyStore = isVercel ? VERCEL_KEY : NETLIFY_KEY;
    const keyId = isVercel ? "vw-token" : "nl-token";
    const nameId = isVercel ? "vw-name" : "nl-name";
    const fileId = isVercel ? "vw-file" : "nl-file";
    const statusId = isVercel ? "vw-status" : "nl-status";
    const htmlId = isVercel ? "vw-html" : "nl-html";
    wrap.appendChild(apiKeyField({
      label: isVercel ? "Vercel Token" : "Netlify Token",
      id: keyId, placeholder: isVercel ? "vcp_..." : "nfp_...",
      keyUrl: isVercel ? "https://vercel.com/account/tokens" : "https://app.netlify.com/user/applications#personal-access-tokens"
    }));
    const keyInput = wrap.querySelector("#" + keyId);
    const saved = Store.get(keyStore);
    if (saved && keyInput) keyInput.value = saved;
    const row = document.createElement("div"); row.className = "yn-btn-row";
    const saveBtn = secondaryBtn("Simpan Token"); const clrBtn = secondaryBtn("Hapus Token");
    row.appendChild(saveBtn); row.appendChild(clrBtn); wrap.appendChild(row);
    wrap.appendChild(field({ label: "Nama Project / Site", id: nameId, type: "text", placeholder: isVercel ? "my-project" : "my-site" }));
    const upWrap = document.createElement("div"); upWrap.className = "yn-field";
    upWrap.innerHTML = '<label class="yn-field-label">Upload HTML</label><div style="padding:12px;border:1px dashed var(--line-2);border-radius:4px;background:var(--surface-2)"><input type="file" id="' + fileId + '" accept=".html,.htm,text/html" style="width:100%;font-size:.8rem"/><div id="' + statusId + '" style="margin-top:8px;font-family:var(--font-mono);font-size:.56rem;color:var(--ink-3)">Belum ada file.</div></div>';
    wrap.appendChild(upWrap);
    const htmlField = field({ label: "Konten HTML", id: htmlId, type: "textarea", placeholder: "Paste HTML atau upload file..." });
    htmlField.querySelector("textarea").style.minHeight = "180px";
    wrap.appendChild(htmlField);
    const fi = wrap.querySelector("#" + fileId);
    const fs = wrap.querySelector("#" + statusId);
    const htmlTextarea = wrap.querySelector("#" + htmlId);
    fi.addEventListener("change", function(){
      const f = fi.files && fi.files[0];
      if (!f) return;
      if (!/\.html?$/i.test(f.name) && f.type !== "text/html") { fs.textContent = "Pilih .html/.htm"; fi.value = ""; return; }
      if (f.size > 5 * 1024 * 1024) { fs.textContent = "Maks 5MB."; fi.value = ""; return; }
      const rd = new FileReader();
      fs.textContent = "Membaca " + f.name + "...";
      rd.onload = function(){ htmlTextarea.value = String(rd.result || ""); fs.textContent = f.name + " (" + (f.size/1024).toFixed(1) + " KB)"; toast("Dimuat.", "success"); };
      rd.onerror = function(){ fs.textContent = "Gagal baca."; };
      rd.readAsText(f);
    });
    const btn = primaryBtn(isVercel ? "Deploy ke Vercel" : "Deploy ke Netlify"); wrap.appendChild(btn);
    saveBtn.addEventListener("click", async function(){
      const t = keyInput.value.trim();
      if (!t) return toast("Token wajib.", "error");
      try {
        if (isVercel) await API.vercelCheckToken(t);
        else await API.netlifyCheckToken(t);
        Store.set(keyStore, t); toast("Token valid & tersimpan.", "success");
      } catch (e) { toast("Invalid: " + e.message, "error"); }
    });
    clrBtn.addEventListener("click", function(){ Store.remove(keyStore); toast("Token dihapus.", "success"); });
    btn.addEventListener("click", async function(){
      const t = Store.get(keyStore);
      const n = wrap.querySelector("#" + nameId).value.trim();
      const h = htmlTextarea.value.trim();
      if (!t) return toast("Simpan token dulu.", "error");
      if (!n || !h) return toast("Nama & HTML wajib.", "error");
      hideResult(); setBtnLoading(btn, true); setModalLoading(true);
      try {
        let url;
        if (isVercel) { const dep = await API.vercelDeploy(t, n, h); const polled = await API.vercelPoll(t, dep.id); url = /^https?:\/\//i.test(polled.url) ? polled.url : ("https://" + polled.url); }
        else { const dep = await API.netlifyDeploy(t, n, h); url = dep.url; }
        const frag = document.createDocumentFragment();
        frag.appendChild(createSuccessBox("Deploy berhasil", [["URL", url], ["Platform", isVercel ? "Vercel" : "Netlify"]]));
        const acts = document.createElement("div"); acts.className = "yn-result-actions";
        const openBtn = document.createElement("a"); openBtn.href = url; openBtn.target = "_blank"; openBtn.rel = "noopener";
        openBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>Buka';
        acts.appendChild(openBtn); acts.appendChild(copyBtn(url, "Copy URL"));
        frag.appendChild(acts);
        showResultNode(frag); toast("Sukses.", "success");
      } catch (e) { showError(friendlyError(e)); toast(friendlyError(e), "error"); }
      finally { setBtnLoading(btn, false); setModalLoading(false); }
    });
    return wrap;
  }
  const pVercel = buildPanel("vercel"); const pNetlify = buildPanel("netlify");
  root.appendChild(pVercel); root.appendChild(pNetlify);
  tabVercel.addEventListener("click", function(){ tabVercel.classList.add("active"); tabNetlify.classList.remove("active"); pVercel.classList.add("active"); pNetlify.classList.remove("active"); hideResult(); });
  tabNetlify.addEventListener("click", function(){ tabNetlify.classList.add("active"); tabVercel.classList.remove("active"); pNetlify.classList.add("active"); pVercel.classList.remove("active"); hideResult(); });
}

/* MORSE CODE */
function renderMorse(root) {
  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
    I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
    Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
    6: "-....", 7: "--...", 8: "---..", 9: "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "'": ".----.", "/": "-..-.",
    "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
    "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "@": ".--.-."
  };
  const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

  const wrap = document.createElement("div");
  wrap.className = "yn-morse";
  wrap.innerHTML =
    '<div class="yn-morse-modes">' +
      '<button class="yn-morse-mode active" id="textToMorse" type="button" aria-pressed="true">Teks ke Morse</button>' +
      '<button class="yn-morse-mode" id="morseToText" type="button" aria-pressed="false">Morse ke Teks</button>' +
    '</div>' +
    '<div class="yn-field"><label class="yn-field-label" for="morseInput">Input</label>' +
      '<textarea id="morseInput" placeholder="Ketik teks di sini..." style="min-height:90px"></textarea></div>' +
    '<div class="yn-morse-visual" id="morseVisual" aria-hidden="true"></div>' +
    '<div class="yn-field"><label class="yn-field-label" for="morseOutput">Hasil</label>' +
      '<textarea id="morseOutput" placeholder="Hasil konversi..." readonly style="min-height:90px"></textarea></div>' +
    '<div class="yn-morse-speed"><label for="morseSpeed">Kecepatan</label>' +
      '<input type="range" id="morseSpeed" min="1" max="100" value="50"/></div>' +
    '<div class="yn-morse-actions">' +
      '<button type="button" class="primary" id="morsePlay" disabled>' +
        '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/></svg>Putar</button>' +
      '<button type="button" id="morseCopy" disabled>' +
        '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Salin</button>' +
      '<button type="button" id="morseClear">' +
        '<svg viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>Hapus</button>' +
      '<button type="button" id="morseSwap">' +
        '<svg viewBox="0 0 24 24"><path d="M7 4v13M4 14l3 3 3-3M17 20V7M14 10l3-3 3 3"/></svg>Tukar</button>' +
    '</div>';
  root.appendChild(wrap);

  const input = $("#morseInput", wrap);
  const output = $("#morseOutput", wrap);
  const visual = $("#morseVisual", wrap);
  const encodeBtn = $("#textToMorse", wrap);
  const decodeBtn = $("#morseToText", wrap);
  const clearBtn = $("#morseClear", wrap);
  const playBtn = $("#morsePlay", wrap);
  const copyBtnEl = $("#morseCopy", wrap);
  const swapBtn = $("#morseSwap", wrap);
  const speedSlider = $("#morseSpeed", wrap);

  let mode = "encode";
  let audioContext = null;
  let playbackToken = 0;

  function encode(text) {
    return [...text.toUpperCase()].map(char => char === " " ? "/" : (MORSE[char] || "?")).join(" ");
  }
  function decode(text) {
    const trimmed = text.trim();
    if (!trimmed) return "";
    return trimmed
      .replace(/[•·]/g, ".").replace(/[—–]/g, "-")
      .split(/\s*\/\s*|\s{3,}/)
      .map(word => word.trim().split(/\s+/).filter(Boolean).map(code => REVERSE[code] || "").join(""))
      .join(" ")
      .trim();
  }
  function getOutput() {
    return mode === "encode" ? encode(input.value) : decode(input.value);
  }
  function renderVisual(code) {
    visual.replaceChildren();
    if (!code || !code.trim()) return;
    const fragment = document.createDocumentFragment();
    for (const symbol of code) {
      if (symbol === ".") {
        const dot = document.createElement("span"); dot.className = "morse-dot"; fragment.appendChild(dot);
      } else if (symbol === "-") {
        const dash = document.createElement("span"); dash.className = "morse-dash"; fragment.appendChild(dash);
      } else if (symbol === " ") {
        const gap = document.createElement("span"); gap.className = "morse-gap"; fragment.appendChild(gap);
      } else if (symbol === "/") {
        const wg = document.createElement("span"); wg.className = "morse-word-gap"; fragment.appendChild(wg);
      }
    }
    visual.appendChild(fragment);
  }
  function convert() {
    const converted = getOutput();
    output.value = converted;
    renderVisual(mode === "encode" ? converted : input.value);
    playBtn.disabled = !converted.trim();
    copyBtnEl.disabled = !converted.trim();
  }
  function setMode(next) {
    mode = next;
    encodeBtn.classList.toggle("active", mode === "encode");
    decodeBtn.classList.toggle("active", mode === "decode");
    encodeBtn.setAttribute("aria-pressed", String(mode === "encode"));
    decodeBtn.setAttribute("aria-pressed", String(mode === "decode"));
    input.placeholder = mode === "encode" ? "Ketik teks di sini..." : "Masukkan kode Morse, contoh: .... .- ..";
    convert();
  }
  function clearAll() {
    playbackToken++;
    input.value = ""; output.value = ""; visual.replaceChildren();
    playBtn.disabled = true; copyBtnEl.disabled = true;
    input.focus();
  }
  function getSpeed() {
    const value = Number(speedSlider.value || 50);
    return Math.max(0.04, 0.24 - (value / 100) * 0.19);
  }
  async function playMorse() {
    const code = mode === "encode" ? getOutput() : input.value.trim();
    if (!code || !/[.\-]/.test(code)) return;
    const token = ++playbackToken;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("Audio tidak didukung browser ini.");
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === "suspended") await audioContext.resume();
      if (token !== playbackToken) return;
      const unit = getSpeed();
      const symbols = code.replace(/[•·]/g, ".").replace(/[—–]/g, "-");
      let start = audioContext.currentTime + 0.05;
      for (const char of symbols) {
        if (token !== playbackToken) break;
        if (char === "." || char === "-") {
          const duration = char === "." ? unit : unit * 3;
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = "sine";
          osc.frequency.value = 650;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.16, start + 0.008);
          gain.gain.setValueAtTime(0.16, start + duration - 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          osc.connect(gain); gain.connect(audioContext.destination);
          osc.start(start); osc.stop(start + duration);
          start += duration + unit;
        } else if (char === " ") {
          start += unit * 3;
        } else if (char === "/") {
          start += unit * 4;
        }
      }
    } catch (err) { toast(err.message || "Gagal memutar audio.", "error"); }
  }
  async function copyResult() {
    const text = getOutput();
    if (!text.trim()) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
      toast("Tersalin.", "success");
    } catch (e) { toast("Gagal menyalin.", "error"); }
  }

  input.addEventListener("input", convert);
  encodeBtn.addEventListener("click", function(){ setMode("encode"); });
  decodeBtn.addEventListener("click", function(){ setMode("decode"); });
  clearBtn.addEventListener("click", clearAll);
  playBtn.addEventListener("click", playMorse);
  copyBtnEl.addEventListener("click", copyResult);
  speedSlider.addEventListener("input", function(){ playbackToken++; });
  swapBtn.addEventListener("click", function(){
    const current = mode === "encode" ? getOutput() : input.value;
    setMode(mode === "encode" ? "decode" : "encode");
    input.value = current;
    convert();
  });

  setMode("encode");
}

function renderAPI(root) {
  root.appendChild(createInfoBox("API Test Center — menguji SEMUA endpoint API Center secara real-time. Test All menembak paralel (4 sekaligus). Developers only."));

  const TEST_PARAMS = {
    spotifyDownload:   { url: "https://open.spotify.com/track/3QGsuHI8jO1Rx4JWLUh9jd" },
    spotifyPlay:       { q: "treat you better" },
    spotifySearch:     { q: "treat you better" },
    saavnSearch:       { query: "treat you better", limit: 1 },
    itunesSearch:      { term: "treat you better", media: "music", limit: 1 },
    lrclibGet:         { artist_name: "Shawn Mendes", track_name: "Treat You Better" },
    youtubeMp4:        { q: "https://youtu.be/dQw4w9WgXcQ" },
    youtubeMp3:        { url: "https://youtu.be/dQw4w9WgXcQ" },
    youtubeShorts:     { url: "https://youtu.be/dQw4w9WgXcQ" },
    instagramDownload: { url: "https://www.instagram.com/p/CqQF5k4yYcv/" },
    facebookDownload:  { url: "https://www.facebook.com/watch/?v=10153231379946729" },
    teraboxDownload:   { url: "https://www.terabox.com/s/1abcdefg" },
    nikParser:         { nik: "3204110609970001" },
    fixError:          { code: "console.log(1)" },
    webToApk:          { url: "https://example.com", name: "Test", package: "com.test.app", version: "1.0.0" },
    ssweb:             { url: "https://example.com" },
    removeBG:          { url: "https://cdnn.ikyyxd.my.id/storage/c1a9e2a719c9c2c773fea62243a3a038.jpg?preview=true" },
    windowsCanvas:     { text: "halo|dunia" },
    urlToQR:           { data: "https://example.com", size: "300x300", margin: "1", color: "%23000000" },
    bratImg:           { text: "test" },
    bratVid:           { text: "test" },
    iqc:               { text: "test" },
    fakeDana:          { nominal: "100000" },
    tiktokStalker:     { username: "tiktok" },
    nglSpam:           { url: "https://ngl.link/test", pesan: "test", jumlah: 1 },
    ucbrowserDownload: { url: "https://example.com/file.zip" },
    fakeBankJago:      { nama: "Zill", saldo: "10000" },
    instagramStalker:  { username: "telegram" },
    amPreset:          { url: "https://vt.tiktok.com/ZSpSFMPNp/" }
  };

  const header = document.createElement("div");
  header.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px;background:var(--surface-2);border:1px solid var(--line-2);border-radius:var(--radius-sm);margin-bottom:10px";
  header.innerHTML =
    '<div style="flex:1;min-width:180px">' +
      '<div style="font-family:var(--font-mono);font-size:.54rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-4);margin-bottom:2px">REAL-TIME STATUS</div>' +
      '<div id="yn-api-summary" style="font-family:var(--font-mono);font-size:.72rem;font-weight:600;color:var(--ink)">0 OK · 0 FAIL · 0 PENDING</div>' +
    '</div>' +
    '<button id="yn-api-testall" type="button" class="yn-btn yn-btn-primary" style="width:auto;margin:0;padding:0 16px;font-size:.7rem;min-height:40px">' +
      '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 10-13h-7z"/></svg><span>TEST SEMUA</span>' +
    '</button>' +
    '<button id="yn-api-reset" type="button" class="yn-btn yn-btn-secondary" style="width:auto;margin:0;padding:0 14px;font-size:.7rem;min-height:40px">' +
      '<span>RESET</span>' +
    '</button>';
  root.appendChild(header);

  const summaryEl = header.querySelector("#yn-api-summary");
  const testAllBtn = header.querySelector("#yn-api-testall");
  const resetBtn = header.querySelector("#yn-api-reset");

  const wrap = document.createElement("div");
  wrap.className = "yn-api-test";
  wrap.id = "yn-api-list";
  root.appendChild(wrap);

  const endpointKeys = Object.keys(API_CENTER.endpoints);
  const state = {};

  function updateSummary() {
    let ok = 0, fail = 0, pending = 0;
    endpointKeys.forEach(function(k) {
      const st = state[k] && state[k].status;
      if (st === "OK") ok++;
      else if (st === "FAIL") fail++;
      else pending++;
    });
    if (summaryEl) {
      summaryEl.innerHTML =
        '<span style="color:var(--success-2);font-weight:700">' + ok + '</span> OK · ' +
        '<span style="color:var(--danger);font-weight:700">' + fail + '</span> FAIL · ' +
        '<span style="color:var(--gold-3);font-weight:700">' + pending + '</span> PENDING · ' +
        '<span style="color:var(--ink-3)">' + endpointKeys.length + ' TOTAL</span>';
    }
  }

  endpointKeys.forEach(function(key) {
    const ep = API_CENTER.endpoints[key];
    const fullUrl = buildURL(key, TEST_PARAMS[key] || {});
    state[key] = { status: "PENDING", elapsed: 0, message: "" };

    const row = document.createElement("div");
    row.className = "yn-api-row";
    row.dataset.key = key;
    row.innerHTML =
      '<div class="yn-api-row-head">' +
        '<span class="yn-api-row-name">' + escapeHTML(key) + '</span>' +
        '<span class="yn-api-method">' + escapeHTML(ep.method) + '</span>' +
        '<span style="font-family:var(--font-mono);font-size:.5rem;letter-spacing:.14em;text-transform:uppercase;color:var(--sage-2);background:var(--sage-soft);border:1px solid var(--sage);padding:.18rem .5rem;border-radius:2px">' + escapeHTML(ep.service) + '</span>' +
      '</div>' +
      '<div class="yn-api-url">' + escapeHTML(fullUrl) + '</div>' +
      '<div class="yn-api-status pending">⏳ Menunggu tes</div>' +
      '<div class="yn-api-actions">' +
        '<button type="button" class="primary" data-act="test">TEST</button>' +
        '<button type="button" data-act="direct">DIRECT</button>' +
        '<button type="button" data-act="open">BUKA</button>' +
      '</div>';

    const statusEl = row.querySelector(".yn-api-status");
    const testBtn = row.querySelector('[data-act="test"]');
    const directBtn = row.querySelector('[data-act="direct"]');
    const openBtn = row.querySelector('[data-act="open"]');

    function setStatus(stateObj) {
      state[key] = stateObj;
      const cls = stateObj.status === "OK" ? "ok" : (stateObj.status === "FAIL" ? "fail" : "pending");
      statusEl.className = "yn-api-status " + cls;
      statusEl.textContent = stateObj.message || stateObj.status;
      updateSummary();
    }

    async function runTest(viaProxy) {
      testBtn.disabled = true;
      directBtn.disabled = true;
      setStatus({ status: "PENDING", message: "⏳ Menguji (" + (viaProxy ? "proxy" : "direct") + ")...", elapsed: 0 });
      const t0 = performance.now();
      try {
        let res;
        if (viaProxy) {
          res = await fetchAuto(fullUrl, {}, 20000, key);
        } else {
          res = await fetchWithTimeout(fullUrl, {}, 15000, key + "-direct");
        }
        const elapsed = Math.round(performance.now() - t0);
        const ct = (res.headers.get("content-type") || "").toLowerCase();

        if (!res.ok) {
          setStatus({
            status: "FAIL",
            message: "✕ HTTP " + res.status + " · " + elapsed + "ms · " + (ct || "?"),
            elapsed: elapsed
          });
          return;
        }

        let preview = "";
        if (ct.indexOf("application/json") !== -1) {
          const txt = await res.text();
          try {
            const json = JSON.parse(txt);
            const pretty = JSON.stringify(json).slice(0, 160);
            preview = " · " + pretty + (pretty.length >= 160 ? "..." : "");
          } catch (e) {
            preview = " · bukan JSON valid";
          }
        } else if (ct.indexOf("image/") === 0 || ct.indexOf("video/") === 0 || ct.indexOf("audio/") === 0 || ct.indexOf("octet-stream") !== -1) {
          const b = await res.blob();
          preview = " · " + (b.size / 1024).toFixed(1) + " KB · " + (ct || "?");
        } else {
          const txt = await res.text();
          preview = " · " + txt.slice(0, 100).replace(/\s+/g, " ") + (txt.length > 100 ? "..." : "");
        }

        setStatus({
          status: "OK",
          message: "✓ 200 · " + elapsed + "ms" + preview,
          elapsed: elapsed
        });
      } catch (e) {
        const elapsed = Math.round(performance.now() - t0);
        setStatus({
          status: "FAIL",
          message: "✕ " + (e.message || "error").slice(0, 80) + " · " + elapsed + "ms",
          elapsed: elapsed
        });
      } finally {
        testBtn.disabled = false;
        directBtn.disabled = false;
      }
    }

    testBtn.addEventListener("click", function(){ runTest(true); });
    directBtn.addEventListener("click", function(){ runTest(false); });
    openBtn.addEventListener("click", function(){
      window.open(fullUrl, "_blank", "noopener");
    });

    row._runTest = runTest;
    wrap.appendChild(row);
  });

  updateSummary();

  let running = false;

  async function testAll() {
    if (running) return;
    running = true;
    testAllBtn.disabled = true;
    testAllBtn.innerHTML = '<span class="yn-spinner"></span><span>MENGUJI...</span>';

    endpointKeys.forEach(function(k) {
      state[k] = { status: "PENDING", message: "⏳ Menunggu...", elapsed: 0 };
      const r = wrap.querySelector('[data-key="' + k + '"]');
      if (r) {
        const s = r.querySelector(".yn-api-status");
        s.className = "yn-api-status pending";
        s.textContent = "⏳ Menunggu...";
      }
    });
    updateSummary();

    const CONCURRENCY = 4;
    let cursor = 0;

    async function worker() {
      while (cursor < endpointKeys.length) {
        const myIdx = cursor++;
        const key = endpointKeys[myIdx];
        const row = wrap.querySelector('[data-key="' + key + '"]');
        if (row && typeof row._runTest === "function") {
          await row._runTest(true);
        }
      }
    }

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) workers.push(worker());
    await Promise.all(workers);

    running = false;
    testAllBtn.disabled = false;
    testAllBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 10-13h-7z"/></svg><span>TEST ULANG SEMUA</span>';
    toast("Selesai menguji semua endpoint.", "success");
  }

  function resetAll() {
    endpointKeys.forEach(function(k) {
      state[k] = { status: "PENDING", message: "⏳ Menunggu tes", elapsed: 0 };
      const r = wrap.querySelector('[data-key="' + k + '"]');
      if (r) {
        const s = r.querySelector(".yn-api-status");
        s.className = "yn-api-status pending";
        s.textContent = "⏳ Menunggu tes";
      }
    });
    updateSummary();
    toast("Reset selesai.", "info");
  }

  testAllBtn.addEventListener("click", testAll);
  resetBtn.addEventListener("click", resetAll);
}

/* TOOL REGISTRY */
const TOOLS = [
  { id: "youtube", name: "YouTube Downloader", desc: "MP4, MP3, Shorts", badge: "Downloader", cat: "downloader", kana: "一", icon: LOGO.youtube, render: renderYouTube,
    guide: ["Tempel URL video YouTube lengkap (contoh: <code>https://youtube.com/watch?v=...</code>) pada kolom yang tersedia.",
      "Pilih tab sesuai kebutuhan: <b>MP4</b> untuk video, <b>MP3</b> untuk audio, <b>SHORTS</b> untuk video pendek.",
      "Tekan tombol utama dan tunggu proses selesai — preview akan muncul otomatis di bawah form.",
      "Gunakan tombol <b>Download</b> untuk menyimpan file, atau <b>Copy URL</b> untuk mengambil tautan langsung."],
    note: "Kualitas video mengikuti sumber server. Jika gagal, coba lagi beberapa saat." },
  { id: "tiktok", name: "TikTok Downloader", desc: "Video HD dan audio", badge: "Downloader", cat: "downloader", kana: "二", icon: LOGO.tiktok, render: renderTikTok,
    guide: ["Salin tautan video TikTok dari aplikasi (bagikan → salin tautan).",
      "Tempel pada kolom URL TikTok, lalu tekan <b>Ambil TikTok</b>.",
      "Untuk postingan foto, semua gambar akan tampil berurutan.",
      "Gunakan tombol <b>MP4 HD</b> untuk video tanpa watermark, atau <b>MP3</b> untuk audio."],
    note: "Video foto/slide bisa memuat banyak gambar — scroll ke bawah pada hasil." },
  { id: "instagram", name: "Instagram Downloader", desc: "Video, reels, foto", badge: "Downloader", cat: "downloader", kana: "三", icon: LOGO.instagram, render: renderInstagram,
    guide: ["Buka postingan Instagram, tekan titik tiga → <b>Salin tautan</b>.",
      "Tempel tautan pada kolom URL Instagram.",
      "Tekan <b>Download</b> lalu tunggu hasil muncul.",
      "Setiap media punya tombol unduh sendiri — pilih sesuai yang dibutuhkan."],
    note: "Akun privat tidak dapat diproses. Pastikan tautan mengarah ke postingan/reel publik." },
  { id: "facebook", name: "Facebook Downloader", desc: "Video SD & HD", badge: "Downloader", cat: "downloader", kana: "四", icon: LOGO.facebook, render: renderFacebook,
    guide: ["Salin tautan video Facebook (klik kanan video → salin tautan, atau menu bagikan).",
      "Tempel tautan pada kolom URL Facebook.",
      "Tekan <b>Download</b> dan tunggu preview video muncul.",
      "Gunakan tombol unduh di bawah preview untuk menyimpan file."],
    note: "Video dari grup tertutup tidak dapat diakses." },
  { id: "ucbrowser", name: "UC Browser Downloader", desc: "Ambil file via UC", badge: "Downloader", cat: "downloader", kana: "五", icon: LOGO.ucbrowser, render: renderUCBrowser, isNew: true,
    guide: ["Masukkan URL file yang akan diunduh.",
      "Tekan <b>Ambil File</b>.",
      "Hasil akan menampilkan nama file dan tautan unduhan.",
      "Tekan <b>Download</b> untuk menyimpan, atau <b>Copy URL</b> untuk tautan."],
    note: "Cocok untuk file yang biasanya diunduh via UC Browser." },
  { id: "spotify", name: "Spotify Downloader", desc: "Playable + MP3", badge: "Downloader", cat: "downloader", kana: "六", icon: LOGO.spotify, render: renderSpotify,
    guide: ["Tempel <b>URL track Spotify</b> (contoh: <code>https://open.spotify.com/track/...</code>) pada kolom yang tersedia.",
      "Tekan <b>Ambil Audio</b> dan tunggu sampai data lagu muncul.",
      "Gunakan tombol <b>Putar di Player</b> untuk mendengarkan, atau <b>Simpan ke Music</b> agar tersimpan di library lokal.",
      "Gunakan <b>Download MP3</b> untuk mengunduh file secara langsung."],
    note: "Pastikan URL mengarah ke track Spotify yang valid." },
  { id: "terabox", name: "Terabox Downloader", desc: "Ambil file", badge: "Downloader", cat: "downloader", kana: "七", icon: LOGO.terabox, render: renderTerabox,
    guide: ["Buka tautan berbagi TeraBox dan salin URL-nya.",
      "Tempel pada kolom URL TeraBox.",
      "Tekan <b>Ambil File</b> dan tunggu sampai daftar tautan muncul.",
      "Pilih tautan <b>Download file langsung</b> atau tautan streaming sesuai kualitas."],
    note: "Tautan hasil biasanya bersifat sementara dan bisa kedaluwarsa." },
  { id: "tiktok-stalker", name: "TikTok Stalker", desc: "Profil TikTok", badge: "Stalker", cat: "stalker", kana: "八", icon: LOGO.tiktokstalker, render: renderTikTokStalker,
    guide: ["Masukkan <b>username</b> TikTok tanpa tanda @.",
      "Tekan <b>Stalk</b> dan tunggu data profil dimuat.",
      "Kartu profil menampilkan avatar, bio, jumlah posting, follower, following, dan likes.",
      "Gunakan <b>Foto Profil</b> untuk mengunduh avatar atau <b>Copy JSON</b> untuk data mentah."],
    note: "Akun privat hanya menampilkan data terbatas." },
  { id: "instagram-stalker", name: "Telegram Stalker", desc: "Profil Telegram", badge: "Stalker", cat: "stalker", kana: "九", icon: LOGO.instagramstalker, render: renderInstagramStalker, isNew: true,
    guide: ["Masukkan <b>username Telegram</b> tanpa tanda @.",
      "Tekan <b>Stalk Telegram</b>.",
      "Kartu profil menampilkan foto, nama, username, bio, dan label.",
      "Gunakan <b>Copy JSON</b> untuk melihat data mentah."],
    note: "Data dari profil publik Telegram. Profil privat hanya menampilkan data terbatas." },
  { id: "am-preset", name: "AM Preset Search", desc: "Cari preset Alight", badge: "Maker", cat: "maker", kana: "十", icon: LOGO.ampreset, render: renderAMPreset, isNew: true,
    guide: ["Salin URL video TikTok yang berisi preset Alight Motion di komentar.",
      "Tempel di kolom URL, lalu tekan <b>Cari Preset</b>.",
      "Sistem akan memindai komentar dan reply untuk menemukan tautan preset.",
      "Klik <b>Download</b> untuk mengunduh file XML, atau <b>Buka</b> untuk link Alight Motion."],
    note: "Preset hanya ditemukan jika ada di komentar atau reply video." },
  { id: "am-premium", name: "AM Premium Generator", desc: "Alight Motion Premium", badge: "Tools", cat: "tools", kana: "十一", icon: LOGO.ampremium, render: renderAMPremium, isNew: true,
    guide: ["Masukkan email Alight Motion (boleh email apa saja).",
      "Tekan <b>Kirim Magic Link</b> — sistem akan mengirim link verifikasi ke email.",
      "Buka email, salin magic link lengkap, tempel di kolom verifikasi, lalu tekan <b>Verifikasi Akun</b>.",
      "Setelah verifikasi berhasil, premium otomatis diaktifkan."],
    note: "Proses ini berjalan di server pihak ketiga. Email harus aktif untuk menerima magic link." },
  { id: "removebg", name: "Remove Background", desc: "Hapus BG", badge: "Tools", cat: "tools", kana: "十二", icon: LOGO.removebg, render: renderRemoveBG,
    guide: ["Pilih file gambar dari perangkat (maks 15 MB).",
      "File akan otomatis dikompres lalu diunggah ke server sementara.",
      "Tekan <b>Remove Background</b> dan tunggu hasil PNG transparan muncul.",
      "Tekan <b>Download PNG</b> untuk menyimpan hasil."],
    note: "Gambar dengan latar kompleks (rambut, bulu, transparansi) bisa menghasilkan tepi kurang rapi." },
  { id: "hd-image", name: "HD Image Upscale", desc: "Upscale lokal 2x-4x", badge: "Tools", cat: "tools", kana: "十三", icon: LOGO.hdimage, render: renderHDImage,
    guide: ["Pilih gambar sumber dari perangkat.",
      "Tentukan skala pembesaran: <b>2x</b>, <b>3x</b>, atau <b>4x</b>.",
      "Tekan <b>Upscale</b> — proses berjalan sepenuhnya di browser, tanpa upload.",
      "Tekan <b>Download</b> untuk menyimpan hasil PNG."],
    note: "Hasil dibatasi sekitar 40 megapiksel agar browser tidak kehabisan memori." },
  { id: "web-to-apk", name: "Web to APK", desc: "Website jadi APK", badge: "Maker", cat: "maker", kana: "十四", icon: LOGO.web2apk, render: renderWebToApk,
    guide: ["Isi <b>URL website</b> yang akan dibungkus menjadi aplikasi.",
      "Unggah <b>icon</b> berukuran 512x512 piksel (PNG disarankan).",
      "Isi <b>Nama App</b>; kolom package bersifat opsional.",
      "Tekan <b>Build APK</b> dan tunggu respons server berisi tautan/berkas hasil."],
    note: "Proses build berjalan di server pihak ketiga, waktu tunggu bisa bervariasi." },
  { id: "nik-parser", name: "NIK Parser", desc: "Baca NIK", badge: "Tools", cat: "tools", kana: "十五", icon: LOGO.nik, render: renderNIKParser,
    guide: ["Masukkan <b>16 digit NIK</b> tanpa spasi atau tanda baca.",
      "Tekan <b>Parse NIK</b>.",
      "Hasil ditampilkan sebagai grid pasangan kunci–nilai (provinsi, tanggal lahir, jenis kelamin, dan lainnya).",
      "Buka bagian <b>JSON Response</b> untuk melihat data mentah."],
    note: "Pastikan NIK yang dimasukkan valid agar hasil tidak kosong." },
  { id: "fix-error", name: "Fix Error", desc: "Perbaiki kode error", badge: "Tools", cat: "tools", kana: "十六", icon: LOGO.fixerror, render: renderFixError,
    guide: ["Tempel pesan error atau potongan kode yang bermasalah pada kolom input.",
      "Tekan <b>Fix Error</b>.",
      "Hasil saran perbaikan akan muncul pada kotak teks hasil.",
      "Gunakan <b>JSON Response</b> untuk melihat respons mentah dari server."],
    note: "Sertakan pesan error lengkap agar saran perbaikan lebih akurat." },
  { id: "url-to-qr", name: "URL to QR", desc: "URL jadi QR", badge: "Tools", cat: "tools", kana: "十七", icon: LOGO.urltoqr, render: renderURLtoQR,
    guide: ["Masukkan URL atau teks apa pun pada kolom input.",
      "Tekan <b>Generate QR</b>.",
      "Gambar QR akan muncul beserta tombol unduh.",
      "Gunakan <b>Download PNG</b> untuk menyimpan, atau <b>Copy URL</b> untuk mengambil tautan gambar."],
    note: "Teks panjang menghasilkan QR dengan modul lebih rapat — pindai dari jarak dekat." },
  { id: "brat", name: "Brat Generator", desc: "Teks + animasi", badge: "Maker", cat: "maker", kana: "十八", icon: LOGO.brat, render: renderBrat, isNew: true,
    guide: ["Pilih tab <b>Teks Biasa</b> untuk gambar statis, atau <b>Teks Animasi</b> untuk video pendek.",
      "Tulis teks pada kolom yang tersedia.",
      "Tekan tombol generate sesuai tab yang aktif.",
      "Preview muncul di bawah; tekan <b>Download</b> untuk menyimpan PNG atau MP4."],
    note: "Teks sangat panjang bisa terpotong mengikuti batas kanvas server." },
  { id: "iqc", name: "IQC Generator", desc: "Quote card estetik", badge: "Maker", cat: "maker", kana: "十九", icon: LOGO.iqc, render: renderIQC, isNew: true,
    guide: ["Tulis teks kutipan pada kolom input.",
      "Tekan <b>Generate IQC</b>.",
      "Preview kartu kutipan muncul di bawah form.",
      "Tekan <b>Download PNG</b> untuk menyimpan hasil."],
    note: "Gunakan baris baru untuk memisahkan paragraf agar tata letak lebih rapi." },
  { id: "ssweb", name: "SSWeb Screenshot", desc: "Screenshot website", badge: "Tools", cat: "tools", kana: "二十", icon: LOGO.ssweb, render: renderSSWeb, isNew: true,
    guide: ["Masukkan URL lengkap yang diawali <code>http://</code> atau <code>https://</code>.",
      "Tekan <b>Ambil Screenshot</b>.",
      "Pratinjau screenshot muncul di bawah form.",
      "Tekan <b>Download</b> untuk menyimpan gambar."],
    note: "Situs dengan proteksi anti-bot atau login bisa menghasilkan halaman kosong." },
  { id: "fakedana", name: "Fake DANA", desc: "Screenshot saldo", badge: "Maker", cat: "maker", kana: "廿一", icon: LOGO.fakedana, render: renderFakeDana, isNew: true,
    guide: ["Masukkan nominal saldo yang diinginkan (angka saja).",
      "Tekan <b>Generate</b>.",
      "Pratinjau gambar muncul di bawah form.",
      "Tekan <b>Download PNG</b> untuk menyimpan."],
    note: "Gunakan titik atau tanpa pemisah sesuai format yang diinginkan server." },
  { id: "fakebankjago", name: "Fake Bank Jago", desc: "Screenshot saldo Jago", badge: "Maker", cat: "maker", kana: "廿二", icon: LOGO.fakebankjago, render: renderFakeBankJago, isNew: true,
    guide: ["Masukkan nama pemilik saldo.",
      "Masukkan nominal saldo (angka saja, tanpa titik).",
      "Tekan <b>Generate</b>.",
      "Preview muncul; tekan <b>Download PNG</b> untuk menyimpan."],
    note: "Gambar yang dihasilkan hanya untuk keperluan hiburan." },
  { id: "gemini", name: "Gemini AI", desc: "Chat Gemini", badge: "AI", cat: "ai", kana: "廿三", icon: LOGO.gemini, render: renderGemini,
    guide: ["Ambil API key dari Google AI Studio melalui tombol <b>Ambil Key</b>.",
      "Tempel key lalu tekan <b>Simpan Key</b> — daftar model akan dimuat otomatis.",
      "Pilih model pada dropdown. Isi <b>System Prompt</b> bila perlu mengatur gaya jawaban.",
      "Ketik pesan pada kolom bawah dan tekan <b>Kirim</b>. Riwayat tersimpan lokal."],
    note: "Key disimpan di browser perangkat ini. Hapus dengan tombol Hapus bila memakai perangkat bersama." },
  { id: "deploy-web", name: "Deploy HTML", desc: "Vercel + Netlify", badge: "Maker", cat: "maker", kana: "廿四", icon: LOGO.deploy, render: renderDeploy, isNew: true,
    guide: ["Pilih tab <b>Vercel</b> atau <b>Netlify</b>.",
      "Buat personal access token dari tautan penyedia, tempel, lalu tekan <b>Simpan Token</b>.",
      "Isi nama project dan tempel konten HTML — atau unggah file .html lewat input file.",
      "Tekan tombol deploy dan tunggu sampai URL hasil muncul."],
    note: "Token tersimpan di localStorage perangkat ini. Untuk pemakaian bersama, gunakan backend proxy." },
  { id: "nglspam", name: "NGL Spammer", desc: "Pesan massal NGL", badge: "Tools", cat: "tools", kana: "廿五", icon: LOGO.ngl, render: renderNGL, isNew: true,
    guide: ["Masukkan tautan NGL (contoh <code>https://ngl.link/username</code>) atau cukup username-nya.",
      "Tulis pesan yang akan dikirim.",
      "Tentukan jumlah pengiriman (1–500).",
      "Tekan <b>Kirim NGL</b> dan tunggu ringkasan status."],
    note: "Pengiriman dalam jumlah besar bisa memicu rate-limit dari server tujuan." },
  { id: "windows", name: "Windows Canvas", desc: "Kanvas chat Windows", badge: "Maker", cat: "maker", kana: "廿六", icon: LOGO.windows, render: renderWindowsCanvas, isNew: true,
    guide: ["Tulis teks pada kolom input.",
      "Gunakan tanda <code>|</code> (pipe) untuk memisahkan antar baris/gelembung chat.",
      "Tekan <b>Generate Canvas</b>.",
      "Pratinjau gambar muncul; tekan <b>Download</b> untuk menyimpan."],
    note: "Contoh format: <code>ngapain cemburu|kan|cuman sebatas|teman</code>" },
  { id: "morse", name: "Morse Code", desc: "Encode, decode, audio", badge: "Tools", cat: "tools", kana: "廿七", icon: LOGO.morse, render: renderMorse, isNew: true,
    guide: ["Pilih mode <b>Teks ke Morse</b> atau <b>Morse ke Teks</b>.",
      "Ketik pada kolom input — hasil konversi muncul langsung di kolom output.",
      "Atur <b>Kecepatan</b> lewat slider, lalu tekan <b>Putar</b> untuk mendengar kode Morse.",
      "Tekan <b>Salin</b> untuk menyalin hasil, <b>Hapus</b> untuk mengosongkan, atau <b>Tukar</b> untuk membalik arah konversi."],
    note: "Pemisah kata pada morse menggunakan garis miring (/). Tiga spasi juga dikenali sebagai pemisah kata." },
  { id: "calculator", name: "Calculator", desc: "Kalkulator lengkap", badge: "Utility", cat: "utility", kana: "廿八", icon: LOGO.calculator, render: renderCalculator,
    guide: ["Gunakan tombol angka dan operator seperti kalkulator biasa.",
      "Tekan <b>=</b> untuk menghitung hasil; riwayat ekspresi tampil di atas angka.",
      "Tekan <b>C</b> untuk mengosongkan seluruh ekspresi, atau <b>DEL</b> untuk menghapus satu karakter.",
      "Hasil perhitungan bisa langsung dipakai untuk operasi berikutnya."],
    note: "Ekspresi mendukung tanda kurung dan urutan operasi matematika standar." },
  { id: "apitest", name: "API Test Center", desc: "Uji endpoint (Dev)", badge: "Utility", cat: "utility", kana: "廿九", icon: LOGO.apitest, render: renderAPI, isNew: true, devOnly: true,
    guide: ["Daftar endpoint sudah terisi otomatis sesuai konfigurasi API Center.",
      "Tekan <b>TEST API</b> untuk menguji lewat rantai proxy otomatis.",
      "Tekan <b>DIRECT</b> untuk menguji tanpa proxy — berguna memeriksa dukungan CORS asli.",
      "Status, waktu respons, dan cuplikan hasil ditampilkan per baris."],
    note: "Hanya tersedia untuk role Developers." }
];

/* MUSIC PLAYER */
const MusicPlayer = (function(){
  const STORE = "music";
  const audio = new Audio(); audio.preload = "auto";
  let playlist = []; let currentIdx = -1; let loopMode = false; let autoplayNext = true; let currentBlobUrl = null;
  let directPlaying = null; let currentUrl = null; let currentSource = null;
  let lyricLines = []; let lyricLastActive = -1; let lyricEls = [];

  const els = {
    toggle: $("#yn-music-toggle"), panel: $("#yn-music-panel"), close: $("#yn-music-close"),
    play: $("#yn-music-play"), playIcon: $("#yn-music-play-icon"), prev: $("#yn-music-prev"), next: $("#yn-music-next"),
    fill: $("#yn-music-fill"), progress: $("#yn-music-progress"), cur: $("#yn-music-cur"), dur: $("#yn-music-dur"),
    loop: $("#yn-music-loop"), auto: $("#yn-music-auto"),
    library: $("#yn-music-library"), queue: $("#yn-music-queue"),
    search: $("#yn-music-search-input"), searchBtn: $("#yn-music-search-btn"), searchResults: $("#yn-music-search-results"),
    nowTitle: $("#yn-music-now-title"), nowSub: $("#yn-music-now-sub"), art: $("#yn-music-art"),
    vinyl: $("#yn-vinyl"), vinylLabel: $("#yn-vinyl-label"),
    lyrics: $("#yn-lyrics-panel"),
    actions: $("#yn-music-actions"), dlBtn: $("#yn-music-download"), copyUrlBtn: $("#yn-music-copy-url"), sourceBadge: $("#yn-music-source")
  };
  const ICON_PLAY = '<path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/>';
  const ICON_PAUSE = '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';
  const ICON_NOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
  const ICON_TRASH = '<svg viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>';
  const ICON_PLAY_SM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 5l10 7-10 7z"/></svg>';
  const ICON_PAUSE_SM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 5v14M16 5v14"/></svg>';

  function normalize(it) {
    if (!it || typeof it !== "object") return null;
    if (!it.url && !it.previewUrl && !it.blob) return null;
    return {
      id: it.id || ("t_" + rand()),
      name: it.name || "Unknown",
      artist: it.artist || "Unknown",
      album: it.album || "-",
      image: it.image || null,
      previewUrl: it.previewUrl || it.url || "",
      blob: it.blob instanceof Blob ? it.blob : null,
      duration: Number(it.duration) || 0,
      source: it.source || "URL",
      savedAt: it.savedAt || Date.now()
    };
  }
  async function loadLib() {
    try {
      const items = await IDB.getAll(STORE);
      items.sort(function(a, b){ return (b.savedAt || 0) - (a.savedAt || 0); });
      playlist = items.map(normalize).filter(Boolean);
      if (currentIdx >= 0 && !playlist[currentIdx]) currentIdx = -1;
    } catch(e) { playlist = []; }
  }
  function fmt(s){ if (!isFinite(s) || s < 0) return "0:00"; const m = Math.floor(s / 60), ss = Math.floor(s % 60); return m + ":" + String(ss).padStart(2, "0"); }
  function render() {
    if (!els.library) return;
    els.library.innerHTML = "";
    if (!playlist.length) els.library.innerHTML = '<div class="yn-music-empty">' + ICON_NOTE + '<div>Belum ada lagu.</div></div>';
    else {
      playlist.forEach(function(t, i){
        const el = document.createElement("div");
        el.className = "yn-music-item" + (i === currentIdx ? " active" : "");
        const cover = t.image ? ('<img src="' + escapeHTML(t.image) + '" alt="" loading="lazy"/>') : ICON_NOTE;
        const isPlaying = i === currentIdx && !audio.paused;
        el.innerHTML = '<div class="yn-music-item-cover">' + cover + '</div><div class="yn-music-item-info"><div class="yn-music-item-name">' + escapeHTML(t.name) + (t.blob ? ' <span style="color:var(--success);font-size:.48rem">saved</span>' : '') + '</div><div class="yn-music-item-artist">' + escapeHTML(t.artist) + '</div></div><div class="yn-music-item-actions"><button class="del" aria-label="Hapus">' + ICON_TRASH + '</button><button aria-label="Play">' + (isPlaying ? ICON_PAUSE_SM : ICON_PLAY_SM) + '</button></div>';
        el.addEventListener("click", function(ev){ if (ev.target.closest(".del")) return; playIdx(i); });
        const del = el.querySelector(".del"); let armed = false;
        del.addEventListener("click", function(ev){
          ev.stopPropagation();
          if (!armed) { armed = true; del.style.background = "var(--danger)"; del.style.color = "var(--surface)"; setTimeout(function(){ armed = false; del.style.background = ""; del.style.color = ""; }, 3000); return; }
          removeTrack(t.id);
        });
        els.library.appendChild(el);
      });
    }
    if (els.queue) {
      els.queue.innerHTML = "";
      playlist.forEach(function(t, i){
        const el = document.createElement("div"); el.className = "yn-music-item" + (i === currentIdx ? " active" : "");
        el.innerHTML = '<div class="yn-music-item-cover">' + (t.image ? ('<img src="' + escapeHTML(t.image) + '"/>') : ICON_NOTE) + '</div><div class="yn-music-item-info"><div class="yn-music-item-name">' + escapeHTML(t.name) + '</div><div class="yn-music-item-artist">' + escapeHTML(t.artist) + '</div></div>';
        el.addEventListener("click", function(){ playIdx(i); });
        els.queue.appendChild(el);
      });
    }
  }
  function updateNow() {
    if (!els.nowTitle) return;
    const cur = (directPlaying && currentIdx < 0) ? directPlaying : (currentIdx >= 0 && playlist[currentIdx] ? playlist[currentIdx] : null);
    if (!cur) {
      els.nowTitle.textContent = "Belum ada lagu";
      els.nowSub.textContent = "Cari lagu di tab Cari";
      if (els.art) els.art.innerHTML = ICON_NOTE;
      if (els.vinylLabel) els.vinylLabel.textContent = "♪";
      if (els.actions) els.actions.style.display = "none";
      currentUrl = null; currentSource = null;
      return;
    }
    els.nowTitle.textContent = cur.name || "Unknown";
    els.nowSub.textContent = cur.artist || "";
    if (els.art) els.art.innerHTML = cur.image ? ('<img src="' + escapeHTML(cur.image) + '" alt=""/>') : ICON_NOTE;
    if (els.vinylLabel) els.vinylLabel.innerHTML = cur.image ? ('<img src="' + escapeHTML(cur.image) + '" alt=""/>') : "♪";
    if (els.actions) els.actions.style.display = "flex";
    if (els.sourceBadge) els.sourceBadge.textContent = currentSource || cur.source || "URL";
  }
  function setPlaying(p){ 
    if (els.playIcon) els.playIcon.innerHTML = p ? ICON_PAUSE : ICON_PLAY; 
    if (els.toggle) els.toggle.classList.toggle("playing", p); 
    if (els.vinyl) els.vinyl.classList.toggle("playing", p);
  }

  function clearLyrics() {
    lyricLines = []; lyricLastActive = -1; lyricEls = [];
    if (els.lyrics) { els.lyrics.innerHTML = '<div class="yn-lyrics-empty">Memuat lirik...</div>'; }
  }
  async function loadLyrics(artist, title) {
    if (!els.lyrics) return;
    clearLyrics();
    try {
      const r = await API.lyrics(artist, title);
      if (!r) { els.lyrics.innerHTML = '<div class="yn-lyrics-empty">Lirik tidak tersedia untuk lagu ini.</div>'; return; }
      if (r.synced && r.synced.length) renderSynced(r.synced);
      else if (r.plain) renderPlain(r.plain);
      else els.lyrics.innerHTML = '<div class="yn-lyrics-empty">Lirik tidak tersedia.</div>';
    } catch(e) {
      els.lyrics.innerHTML = '<div class="yn-lyrics-empty">Gagal memuat lirik.</div>';
    }
  }
  function renderSynced(lines) {
    lyricLines = lines; lyricEls = []; lyricLastActive = -1;
    els.lyrics.innerHTML = "";
    lines.forEach(function(l){
      const el = document.createElement("div");
      el.className = "yn-lyric-line";
      el.textContent = l.text;
      els.lyrics.appendChild(el);
      lyricEls.push(el);
    });
    syncLyrics(audio.currentTime || 0);
  }
  function renderPlain(text) {
    lyricLines = []; lyricEls = [];
    els.lyrics.innerHTML = "";
    const d = document.createElement("div");
    d.className = "yn-lyrics-plain";
    d.textContent = text;
    els.lyrics.appendChild(d);
  }
  function syncLyrics(currentTime) {
    if (!lyricEls.length || !lyricLines.length) return;
    let activeIdx = -1;
    for (let i = 0; i < lyricLines.length; i++) { if (lyricLines[i].time <= currentTime + 0.1) activeIdx = i; else break; }
    if (activeIdx < 0) return;
    if (lyricLastActive === activeIdx) return;
    lyricLastActive = activeIdx;
    lyricEls.forEach(function(el, i){
      el.classList.remove("active", "near");
      if (i === activeIdx) el.classList.add("active");
      else if (Math.abs(i - activeIdx) === 1) el.classList.add("near");
    });
    const activeEl = lyricEls[activeIdx];
    if (activeEl && els.lyrics) {
      try { activeEl.scrollIntoView({ behavior: "smooth", block: "center" }); } catch(e) {}
    }
  }

  async function playUrlWithFallback(url, meta) {
    if (!url) throw new Error("URL audio kosong.");
    if (currentBlobUrl) { try { URL.revokeObjectURL(currentBlobUrl); } catch(e){} currentBlobUrl = null; }
    directPlaying = meta;
    currentUrl = url;
    currentSource = meta.source || "Direct";
    updateNow();
    audio.pause(); audio.removeAttribute("src"); audio.load();
    audio.src = url; audio.load();
    try {
      await new Promise(function(res, rej){
        const ok = function(){ cleanup(); res(); };
        const bad = function(){ cleanup(); rej(new Error("direct-error")); };
        const to = setTimeout(function(){ cleanup(); rej(new Error("direct-timeout")); }, 12000);
        function cleanup(){ clearTimeout(to); audio.removeEventListener("canplay", ok); audio.removeEventListener("error", bad); }
        audio.addEventListener("canplay", ok, { once: true });
        audio.addEventListener("error", bad, { once: true });
      });
      await audio.play();
      loadLyrics(meta.artist, meta.name);
      return;
    } catch (e) {
      /* fallback ke blob */
    }
    const res = await fetchBinaryAuto(url, 45000, "audio");
    currentBlobUrl = res.url;
    audio.src = res.url; audio.load();
    await audio.play();
    currentSource = (meta.source || "Direct") + " · blob";
    updateNow();
    loadLyrics(meta.artist, meta.name);
  }

  async function playResolved(meta) {
    if (!meta || !meta.url) throw new Error("Meta tidak valid.");
    if (els.panel && !els.panel.classList.contains("show")) els.panel.classList.add("show");
    const lyricsTab = document.querySelector('.yn-music-tab[data-mtab="lyrics"]');
    if (lyricsTab) lyricsTab.click();
    if (els.nowTitle) { els.nowTitle.textContent = meta.name || "Loading..."; els.nowSub.textContent = meta.artist || ""; if (els.art) els.art.innerHTML = meta.image ? '<img src="' + escapeHTML(meta.image) + '"/>' : ICON_NOTE; }
    currentIdx = -1; directPlaying = { name: meta.name, artist: meta.artist, image: meta.image, source: "resolving" };
    updateNow();
    clearLyrics();
    els.lyrics.innerHTML = '<div class="yn-lyrics-empty">Mencari audio...</div>';
    let resolved;
    try {
      resolved = await resolvePlayableAudio((meta.name || "") + " " + (meta.artist || ""), meta.name, meta.artist);
    } catch(e) {
      els.lyrics.innerHTML = '<div class="yn-lyrics-empty">Audio tidak ditemukan: ' + escapeHTML(e.message) + '</div>';
      throw e;
    }
    const finalMeta = {
      name: resolved.title || meta.name,
      artist: resolved.artist || meta.artist,
      image: meta.image || resolved.cover,
      source: resolved.source + (resolved.quality ? " · " + resolved.quality : "")
    };
    await playUrlWithFallback(resolved.url, finalMeta);
    return resolved;
  }

  async function playIdx(i) {
    if (i < 0 || i >= playlist.length) return;
    const t = playlist[i];
    currentIdx = i; directPlaying = null;
    updateNow(); render();
    try {
      if (t.blob) {
        if (currentBlobUrl) { try { URL.revokeObjectURL(currentBlobUrl); } catch(e){} }
        currentBlobUrl = URL.createObjectURL(t.blob);
        audio.pause(); audio.removeAttribute("src"); audio.load();
        audio.src = currentBlobUrl; audio.load();
        await audio.play();
        currentUrl = t.previewUrl || null;
        currentSource = "Blob";
        updateNow();
        loadLyrics(t.artist, t.name);
        return;
      }
      await playUrlWithFallback(t.previewUrl, { name: t.name, artist: t.artist, image: t.image, source: t.source || "Direct" });
    } catch (err) {
      setPlaying(false);
      toast("Gagal memutar: " + (err.message || "unknown"), "error");
    }
  }
  function toggle() {
    if (currentIdx < 0 && !directPlaying) { if (!playlist.length) return toast("Playlist kosong. Cari lagu dulu.", "error"); playIdx(0); return; }
    if (audio.paused) audio.play().catch(function(e){ setPlaying(false); toast("Gagal putar: " + (e.message || "browser block"), "error"); });
    else audio.pause();
  }
  function next() { if (!playlist.length) return; if (loopMode) { audio.currentTime = 0; audio.play(); return; } playIdx((currentIdx + 1) % playlist.length); }
  function prev() { if (!playlist.length) return; if (audio.currentTime > 3) { audio.currentTime = 0; return; } playIdx((currentIdx - 1 + playlist.length) % playlist.length); }

  audio.addEventListener("play", function(){ setPlaying(true); render(); });
  audio.addEventListener("pause", function(){ setPlaying(false); render(); });
  audio.addEventListener("ended", function(){ if (loopMode) { audio.currentTime = 0; audio.play(); return; } if (autoplayNext && currentIdx >= 0) next(); else setPlaying(false); });
  audio.addEventListener("timeupdate", function(){
    if (audio.duration && isFinite(audio.duration)) {
      if (els.fill) els.fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
      if (els.cur) els.cur.textContent = fmt(audio.currentTime);
    }
    syncLyrics(audio.currentTime);
  });
  audio.addEventListener("loadedmetadata", function(){ if (els.dur) els.dur.textContent = fmt(audio.duration); });
  audio.addEventListener("error", function(){
    setPlaying(false);
    const code = audio.error && audio.error.code;
    const msgs = { 1: "Playback dibatalkan.", 2: "URL/format rusak.", 3: "Format tidak didukung.", 4: "URL tidak dapat diakses." };
    toast(msgs[code] || "Lagu gagal dimuat.", "error");
  });
  if (els.progress) els.progress.addEventListener("click", function(e){ if (!audio.duration) return; const r = els.progress.getBoundingClientRect(); audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration; });
  if (els.toggle) els.toggle.addEventListener("click", function(){ els.panel.classList.toggle("show"); });
  if (els.close) els.close.addEventListener("click", function(){ els.panel.classList.remove("show"); });
  if (els.play) els.play.addEventListener("click", toggle);
  if (els.next) els.next.addEventListener("click", next);
  if (els.prev) els.prev.addEventListener("click", prev);
  if (els.loop) els.loop.addEventListener("click", function(){ loopMode = !loopMode; els.loop.textContent = loopMode ? "Loop On" : "Loop Off"; els.loop.classList.toggle("active", loopMode); });
  if (els.auto) els.auto.addEventListener("click", function(){ autoplayNext = !autoplayNext; els.auto.textContent = autoplayNext ? "Auto On" : "Auto Off"; els.auto.classList.toggle("active", autoplayNext); });
  if (els.dlBtn) els.dlBtn.addEventListener("click", async function(){
    if (!currentUrl) return toast("URL tidak tersedia.", "error");
    els.dlBtn.disabled = true; const orig = els.dlBtn.innerHTML; els.dlBtn.innerHTML = '<span class="yn-spinner"></span>';
    try {
      const cur = (directPlaying) ? directPlaying : (currentIdx >= 0 ? playlist[currentIdx] : null);
      const fn = ((cur && cur.name) || "track").replace(/[^\w\-]+/g, "_") + ".mp3";
      const ok = await forceDownloadFile(currentUrl, fn);
      toast(ok ? "Download dimulai." : "Buka di tab baru.", ok ? "success" : "info");
    } catch(e){ toast("Gagal download: " + e.message, "error"); }
    finally { els.dlBtn.disabled = false; els.dlBtn.innerHTML = orig; }
  });
  if (els.copyUrlBtn) els.copyUrlBtn.addEventListener("click", function(){
    if (!currentUrl) return toast("URL tidak tersedia.", "error");
    try { navigator.clipboard.writeText(currentUrl).then(function(){ toast("URL disalin.", "success"); }).catch(function(){ toast("Gagal menyalin.", "error"); }); } catch(e){ toast("Gagal menyalin.", "error"); }
  });

  async function doSearch() {
    const q = (els.search && els.search.value || "").trim();
    if (!q) return toast("Kata kunci wajib.", "error");
    if (!els.searchResults) return;
    if (els.searchBtn) { els.searchBtn.disabled = true; els.searchBtn.textContent = "..."; }
    els.searchResults.innerHTML = '<div class="yn-music-empty">Mencari "' + escapeHTML(q) + '"...</div>';
    try {
      const res = await API.spotifyPlay(q);
      if (!res || !res.download_url) throw new Error("Lagu tidak ditemukan.");
      els.searchResults.innerHTML = "";
      const item = document.createElement("div");
      item.className = "yn-music-item";
      item.style.marginBottom = "4px";
      const thumb = res.thumbnail;
      item.innerHTML = '<div class="yn-music-item-cover">' + (thumb ? ('<img src="' + escapeHTML(thumb) + '" alt="" loading="lazy"/>') : ICON_NOTE) + '</div><div class="yn-music-item-info"><div class="yn-music-item-name">' + escapeHTML(res.title || "?") + '</div><div class="yn-music-item-artist">' + escapeHTML(res.artist || "") + (res.duration ? (" · " + res.duration) : "") + '</div></div><div class="yn-music-item-actions"><button type="button" class="saveBtn" title="Simpan">+</button><button type="button" class="playBtn" title="Putar">' + ICON_PLAY_SM + '</button></div>';
      const playBtn = item.querySelector(".playBtn");
      const saveBtn = item.querySelector(".saveBtn");
      const meta = { name: res.title || q, artist: res.artist || "", image: thumb, source: "Nexray SpotifyPlay" };

      playBtn.addEventListener("click", async function(e){
        e.stopPropagation();
        const orig = playBtn.innerHTML; playBtn.innerHTML = '<span class="yn-spinner"></span>'; playBtn.disabled = true;
        try {
          if (els.panel && !els.panel.classList.contains("show")) els.panel.classList.add("show");
          const lyricsTab = document.querySelector('.yn-music-tab[data-mtab="lyrics"]');
          if (lyricsTab) lyricsTab.click();
          currentIdx = -1;
          await playUrlWithFallback(res.download_url, { name: meta.name, artist: meta.artist, image: meta.image, source: "Nexray SpotifyPlay" });
          toast("Memutar: " + meta.name, "success");
        } catch(err) { toast("Gagal: " + (err.message || "unknown"), "error"); }
        finally { playBtn.innerHTML = orig; playBtn.disabled = false; }
      });
      saveBtn.addEventListener("click", async function(e){
        e.stopPropagation();
        saveBtn.disabled = true; const orig = saveBtn.innerHTML; saveBtn.innerHTML = '<span class="yn-spinner"></span>';
        try {
          const saved = await add({ url: res.download_url, name: meta.name, artist: meta.artist, album: res.album || "", image: meta.image, duration: 0, source: "Nexray SpotifyPlay" });
          saveBtn.innerHTML = "OK"; saveBtn.style.background = "var(--success)"; saveBtn.style.color = "var(--surface)";
          toast(saved ? "Tersimpan + blob." : "Tersimpan (URL).", "success");
        } catch (err) { saveBtn.disabled = false; saveBtn.innerHTML = orig; toast("Gagal simpan: " + (err.message || "error"), "error"); }
      });
      els.searchResults.appendChild(item);
      toast("Ditemukan 1 lagu.", "success");
    } catch (e) {
      const errMsg = String(e.message || "Gagal mencari.");
      els.searchResults.innerHTML = '<div class="yn-info" style="color:var(--danger)"><span>' + escapeHTML(errMsg.slice(0, 200)) + '</span></div>';
      toast("Gagal mencari.", "error");
    } finally {
      if (els.searchBtn) { els.searchBtn.disabled = false; els.searchBtn.textContent = "Cari"; }
    }
  }
  if (els.searchBtn) els.searchBtn.addEventListener("click", doSearch);
  if (els.search) els.search.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); doSearch(); } });

  $$(".yn-music-tab").forEach(function(b){
    b.addEventListener("click", function(){
      $$(".yn-music-tab").forEach(function(x){ x.classList.toggle("active", x === b); });
      $$(".yn-music-view").forEach(function(v){ v.classList.remove("active"); });
      const v = $("#yn-music-view-" + b.dataset.mtab); if (v) v.classList.add("active");
    });
  });

  async function add(song) {
    const n = normalize(song);
    if (!n) throw new Error("Data lagu tidak valid.");
    let blob = null;
    if (n.previewUrl) {
      try { const res = await fetchBinaryAuto(n.previewUrl, 45000, "audio"); blob = res.blob; } catch (e) {}
    }
    try {
      const all = await IDB.getAll(STORE);
      for (const x of all) {
        const xn = normalize(x);
        if (xn && n.previewUrl && xn.previewUrl === n.previewUrl) await IDB.del(STORE, x.id);
      }
    } catch (e) {}
    const saved = {
      id: n.id, name: n.name, artist: n.artist, album: n.album, image: n.image,
      previewUrl: n.previewUrl, blob: blob, duration: n.duration, source: song.source || "URL", savedAt: Date.now()
    };
    await IDB.put(STORE, saved);
    await loadLib(); render(); updateNow();
    return !!blob;
  }
  async function removeTrack(id) {
    try {
      if (playlist[currentIdx] && playlist[currentIdx].id === id) { audio.pause(); audio.removeAttribute("src"); audio.load(); currentIdx = -1; updateNow(); setPlaying(false); }
      await IDB.del(STORE, id);
      await loadLib(); render();
      toast("Dihapus.", "success");
    } catch (e) { toast("Gagal hapus.", "error"); }
  }
  async function init() {
    if (els.loop) els.loop.classList.toggle("active", loopMode);
    if (els.auto) els.auto.classList.toggle("active", autoplayNext);
    setPlaying(false);
    await loadLib(); render(); updateNow();
  }
  return { init, add, playUrl: playUrlWithFallback, playResolved };
})();

/* MAINTENANCE MODULE */
const MaintenanceModule = (function(){
  const KEY = "maintenance";
  const overlay = $("#yn-maint-overlay");
  const titleEl = $("#yn-maint-title");
  const descEl = $("#yn-maint-desc");
  const btnEl = $("#yn-maint-info-btn");
  const btnTextEl = $("#yn-maint-btn-text");
  const ownerLoginBtn = $("#yn-maint-owner-login");

  const DEFAULTS = {
    enabled: false,
    title: "Yūgen Nexus Sedang Maintenance",
    desc: "Server lagi down. Kami sedang melakukan pemeliharaan sistem. Silakan coba kembali nanti.",
    btnText: "Info Selengkapnya Ada Di Saluran",
    url: ""
  };

  function load() {
    try {
      const raw = Store.get(KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      return Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch(e) { return Object.assign({}, DEFAULTS); }
  }
  function save(cfg) { return Store.set(KEY, JSON.stringify(cfg)); }
  function isValidUrl(u) {
    if (!u) return false;
    try { const p = new URL(u); return p.protocol === "https:" || p.protocol === "http:"; } catch(e) { return false; }
  }
  function apply(cfg) {
    if (titleEl) titleEl.textContent = cfg.title || DEFAULTS.title;
    if (descEl) descEl.textContent = cfg.desc || DEFAULTS.desc;
    if (btnTextEl) btnTextEl.textContent = cfg.btnText || DEFAULTS.btnText;
    if (btnEl) {
      const valid = isValidUrl(cfg.url);
      btnEl.disabled = !valid;
      btnEl.style.opacity = valid ? "1" : "0.5";
      btnEl.onclick = function(){
        if (!valid) return;
        try { window.open(cfg.url, "_blank", "noopener,noreferrer"); } catch(e){}
      };
    }
  }
  function show(cfg) {
    apply(cfg);
    if (overlay) overlay.classList.add("show");
    document.body.classList.add("locked");
  }
  function hide() {
    if (overlay) overlay.classList.remove("show");
    document.body.classList.remove("locked");
  }
  async function checkAndApply() {
    const cfg = load();
    if (!cfg.enabled) { hide(); return false; }
    const sess = Auth.getSession();
    if (sess && RoleGate.isDeveloper(sess) && isDev(sess.username)) { hide(); return false; }
    show(cfg);
    return true;
  }
  if (ownerLoginBtn) ownerLoginBtn.addEventListener("click", function(){
    hide();
    AuthUI.show({ forced: false });
  });
  return { load, save, apply, show, hide, checkAndApply, isValidUrl, DEFAULTS };
})();

/* BANNER MODULE */
const BannerModule = (function(){
  const MAX_SIZE = 50 * 1024 * 1024;
  const STORE = "banner";
  const wrap = $("#yn-banner-wrap");
  const content = $("#yn-banner-content");
  if (!wrap || !content) return { init: function(){}, refresh: function(){} };

  let state = "IDLE";
  let pendingFile = null;
  let pendingUrl = null;
  let pendingType = null;
  let savedUrl = null;
  let savedType = null;
  let savedBlob = null;

  const ICON_PENCIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const ICON_CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function revokePending() {
    if (pendingUrl) { try { URL.revokeObjectURL(pendingUrl); } catch(e){} pendingUrl = null; }
  }
  function revokeSaved() {
    if (savedUrl && savedUrl.startsWith("blob:")) { try { URL.revokeObjectURL(savedUrl); } catch(e){} }
    savedUrl = null;
  }
  function validateFile(f) {
    if (!f) return "File kosong.";
    if (f.size > MAX_SIZE) return "Ukuran maks 50 MB.";
    const isImg = /^image\/(jpeg|jpg|png|webp|gif|avif)$/i.test(f.type) || /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name);
    const isVid = /^video\/(mp4|webm)$/i.test(f.type) || /\.(mp4|webm)$/i.test(f.name);
    if (!isImg && !isVid) return "Format harus JPG/PNG/WEBP/GIF/AVIF atau MP4/WEBM.";
    return null;
  }
  function mountInput() {
    let inp = content.querySelector("#yn-banner-input");
    if (!inp) {
      inp = document.createElement("input");
      inp.type = "file"; inp.accept = "image/*,video/mp4,video/webm"; inp.style.display = "none"; inp.id = "yn-banner-input";
      inp.addEventListener("change", onFileChosen);
      content.appendChild(inp);
    }
    return inp;
  }
  function renderEmpty() {
    content.innerHTML = `
      <div class="yn-banner-empty" style="position:relative; overflow:hidden;" id="yn-banner-empty-click">
        <div class="yn-banner-empty-icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
        <div class="yn-banner-empty-title">Banner Profil</div>
        <div class="yn-banner-empty-desc">Belum ada banner</div>
        <button class="yn-banner-edit-btn" id="yn-banner-edit">${ICON_PENCIL}</button>
      </div>`;
    mountInput();
    $("#yn-banner-edit").addEventListener("click", pickFile);
    $("#yn-banner-empty-click").addEventListener("click", function(e){
      if (e.target.closest("#yn-banner-edit")) return;
      pickFile();
    });
  }
  function renderPreview() {
    content.innerHTML = `
      <div class="yn-banner-media" style="position:relative;">
        ${pendingType === 'image' ? `<img src="${pendingUrl}" alt="preview" />` : `<video src="${pendingUrl}" muted loop autoplay playsinline></video>`}
        <div class="yn-banner-action-group">
          <button class="yn-banner-act check" id="yn-banner-check">${ICON_CHECK}</button>
          <button class="yn-banner-act cross" id="yn-banner-cross">${ICON_CROSS}</button>
        </div>
      </div>`;
    $("#yn-banner-check").addEventListener("click", savePending);
    $("#yn-banner-cross").addEventListener("click", cancelPending);
  }
  function renderSaved() {
    content.innerHTML = `
      <div class="yn-banner-media" style="position:relative;">
        ${savedType === 'image' ? `<img src="${savedUrl}" alt="banner" />` : `<video src="${savedUrl}" muted loop autoplay playsinline></video>`}
        <button class="yn-banner-edit-btn" id="yn-banner-edit">${ICON_PENCIL}</button>
      </div>`;
    mountInput();
    $("#yn-banner-edit").addEventListener("click", pickFile);
  }
  function pickFile() {
    const inp = mountInput();
    inp.click();
  }
  function onFileChosen(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { toast(err, "error"); e.target.value = ""; return; }
    revokePending();
    pendingFile = f;
    pendingType = /^image\//i.test(f.type) || /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name) ? "image" : "video";
    pendingUrl = URL.createObjectURL(f);
    state = "PREVIEWING";
    renderPreview();
  }
  async function savePending() {
    if (!pendingFile) return;
    const btn = $("#yn-banner-check");
    if (btn) { btn.innerHTML = '<span class="yn-spinner"></span>'; btn.disabled = true; }
    try {
      const blob = pendingFile;
      await IDB.put(STORE, { id: "current", blob: blob, type: pendingType, savedAt: Date.now() });
      revokeSaved();
      savedBlob = blob;
      savedType = pendingType;
      savedUrl = URL.createObjectURL(blob);
      pendingFile = null; pendingUrl = null; pendingType = null;
      state = "IDLE";
      renderSaved();
      toast("Banner tersimpan permanen.", "success");
    } catch (e) {
      toast("Gagal simpan: " + (e.message || "unknown"), "error");
      renderPreview();
    }
  }
  function cancelPending() {
    revokePending();
    pendingFile = null; pendingType = null; pendingUrl = null;
    state = "IDLE";
    if (savedBlob) renderSaved(); else renderEmpty();
  }
  async function init() {
    try {
      const b = await IDB.get(STORE, "current");
      if (b && b.blob) {
        savedBlob = b.blob;
        savedType = b.type || "image";
        savedUrl = URL.createObjectURL(b.blob);
        renderSaved();
        return;
      }
    } catch(e){}
    renderEmpty();
  }
  return { init, refresh: init };
})();

/* ADMIN PANEL (with Owner upgrade mode) */
const AdminPanel = (function(){
  const bd = $("#yn-admin-bd"); const closeBtn = $("#yn-admin-close");
  const usersEl = $("#yn-admin-users"); const searchInput = $("#yn-admin-search");
  const usersView = $("#yn-admin-users-view"); const maintView = $("#yn-admin-maintenance-view");
  const statsEl = $("#yn-admin-stats");
  const titleEl = $("#yn-admin-title");
  const maintTab = document.querySelector('.yn-admin-tab[data-atab="maintenance"]');
  let currentSession = null; let activeTab = "users"; let currentMode = "full";

  const maintToggle = $("#yn-maint-toggle");
  const maintTitle = $("#yn-maint-title-input");
  const maintDesc = $("#yn-maint-desc-input");
  const maintBtnText = $("#yn-maint-btn-text-input");
  const maintUrl = $("#yn-maint-url-input");
  const maintStatus = $("#yn-maint-status");
  const maintToggleSub = $("#yn-maint-toggle-sub");
  const previewTitle = $("#yn-maint-preview-title");
  const previewDesc = $("#yn-maint-preview-desc");
  const previewBtn = $("#yn-maint-preview-btn");
  const saveBtn = $("#yn-maint-save");
  const cancelBtn = $("#yn-maint-cancel");

  function setSession(s) { currentSession = s; }
  function canAccess() { return currentSession && (RoleGate.isDeveloper(currentSession) || currentSession.role === "owner"); }

  function showMaintStatus(type, text) {
    if (!maintStatus) return;
    maintStatus.className = "yn-maint-status show " + type;
    maintStatus.innerHTML = (type === "err" ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>' : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>') + "<span>" + escapeHTML(text) + "</span>";
  }
  function hideMaintStatus() { if (maintStatus) { maintStatus.className = "yn-maint-status"; maintStatus.innerHTML = ""; } }

  function loadMaintForm() {
    const cfg = MaintenanceModule.load();
    if (maintToggle) maintToggle.checked = !!cfg.enabled;
    if (maintTitle) maintTitle.value = cfg.title;
    if (maintDesc) maintDesc.value = cfg.desc;
    if (maintBtnText) maintBtnText.value = cfg.btnText;
    if (maintUrl) maintUrl.value = cfg.url;
    updatePreview();
    updateToggleSub();
  }
  function updatePreview() {
    if (previewTitle) previewTitle.textContent = (maintTitle && maintTitle.value) || MaintenanceModule.DEFAULTS.title;
    if (previewDesc) previewDesc.textContent = (maintDesc && maintDesc.value) || MaintenanceModule.DEFAULTS.desc;
    if (previewBtn) previewBtn.textContent = (maintBtnText && maintBtnText.value) || MaintenanceModule.DEFAULTS.btnText;
  }
  function updateToggleSub() {
    if (maintToggleSub) maintToggleSub.textContent = "Status: " + (maintToggle && maintToggle.checked ? "AKTIF" : "Nonaktif");
  }
  if (maintToggle) maintToggle.addEventListener("change", updateToggleSub);
  [maintTitle, maintDesc, maintBtnText, maintUrl].forEach(function(el){
    if (el) el.addEventListener("input", updatePreview);
  });
  if (saveBtn) saveBtn.addEventListener("click", async function(){
    hideMaintStatus();
    const cfg = {
      enabled: !!(maintToggle && maintToggle.checked),
      title: (maintTitle && maintTitle.value.trim()) || MaintenanceModule.DEFAULTS.title,
      desc: (maintDesc && maintDesc.value.trim()) || MaintenanceModule.DEFAULTS.desc,
      btnText: (maintBtnText && maintBtnText.value.trim()) || MaintenanceModule.DEFAULTS.btnText,
      url: (maintUrl && maintUrl.value.trim()) || ""
    };
    if (cfg.url && !MaintenanceModule.isValidUrl(cfg.url)) {
      showMaintStatus("err", "URL tidak valid. Harus http:// atau https://");
      return;
    }
    if (cfg.enabled && !confirm("Aktifkan Maintenance Mode? User biasa akan diblokir.")) return;
    const ok = MaintenanceModule.save(cfg);
    if (!ok) { showMaintStatus("err", "Gagal menyimpan. Kuota storage penuh?"); return; }
    showMaintStatus("ok", "Tersimpan " + new Date().toLocaleTimeString("id-ID") + (cfg.enabled ? " · MAINTENANCE AKTIF" : " · Nonaktif"));
    toast("Konfigurasi maintenance tersimpan.", "success");
    MaintenanceModule.apply(cfg);
  });
  if (cancelBtn) cancelBtn.addEventListener("click", function(){ loadMaintForm(); hideMaintStatus(); toast("Form direset.", "info"); });

  async function renderUsers(filter) {
    filter = filter || "";
    if (!usersEl) return;
    let all; try { all = await Auth.getUsers(); } catch(e) { all = []; }
    all.sort(function(a, b){ return (a.username || "").localeCompare(b.username || ""); });
    const filtered = filter ? all.filter(function(u){ return norm(u.username).indexOf(norm(filter)) !== -1; }) : all;
    if (statsEl) {
      statsEl.innerHTML = [
        { label: "Owner", value: all.filter(function(u){ return u.role === "owner"; }).length },
        { label: "Total", value: all.length },
        { label: "Basic", value: all.filter(function(u){ return u.role === "basic"; }).length },
        { label: "Premium", value: all.filter(function(u){ return u.role === "vip"; }).length },
        { label: "Dev", value: all.filter(function(u){ return u.role === "developers"; }).length }
      ].map(function(s){ return '<div class="yn-admin-stat"><div class="label">' + s.label + '</div><div class="value">' + s.value + '</div></div>'; }).join("");
    }
    usersEl.innerHTML = "";
    if (!filtered.length) { usersEl.innerHTML = '<div class="yn-admin-empty">Belum ada user.</div>'; return; }
    filtered.forEach(function(u){
      const el = document.createElement("div");
      el.className = "yn-admin-user";
      const isMe = currentSession && norm(u.username) === norm(currentSession.username);
      if (isMe) el.classList.add("me");
      const isDevRow = isDev(u.username);
      const canChange = RoleGate.isDeveloper(currentSession);
      const canDel = canChange && !isDevRow && !isMe;
      const roleLabel = RoleGate.label(u.role);
      const roleOpts = ["basic","vip","owner"]; if (isDevRow) roleOpts.push("developers");
      const isUpgradeMode = currentMode === "upgrade" && currentSession.role === "owner" && !isDev(currentSession.username);
      const applyLabel = isUpgradeMode ? "Upgrade" : "Terapkan";
      const applyClass = isUpgradeMode ? "apply upgrade" : "apply";
      el.innerHTML = '<div class="yn-admin-user-head"><span class="yn-admin-user-name">' + escapeHTML(u.username) + (isMe ? " (Anda)" : "") + '</span><span class="yn-admin-user-role ' + u.role + '">' + roleLabel + '</span></div>' + '<div class="yn-admin-user-meta"><div class="row"><span class="k">UUID</span><span class="v">' + escapeHTML(u.uuid || "(belum ada)") + '</span></div><div class="row"><span class="k">Email</span><span class="v">' + escapeHTML(u.email || "-") + '</span></div><div class="row"><span class="k">Verified</span><span class="v">' + (u.verified ? "Ya" : "Belum") + '</span></div><div class="row"><span class="k">Dibuat</span><span class="v">' + fmtDate(u.createdAt) + '</span></div><div class="row"><span class="k">Login</span><span class="v">' + fmtDate(u.lastLogin) + '</span></div></div><div class="yn-admin-user-actions"><select class="role-select"' + (canChange ? "" : " disabled") + '>' + roleOpts.map(function(r){ return '<option value="' + r + '"' + (r === u.role ? " selected" : "") + '>' + RoleGate.label(r) + '</option>'; }).join("") + '</select><button class="' + applyClass + '"' + (canChange ? "" : " disabled") + '>' + applyLabel + '</button><button class="danger"' + (canDel ? "" : " disabled") + '>Hapus</button></div>';
      const sel = el.querySelector(".role-select");
      const applyBtn = el.querySelector(".apply");
      if (canChange) applyBtn.addEventListener("click", async function(){
        if (isUpgradeMode) {
          TXUI.show(u.username, sel.value);
          return;
        }
        applyBtn.disabled = true; const orig = applyBtn.textContent; applyBtn.textContent = "...";
        try {
          await Auth.setRole(u.username, sel.value, currentSession);
          toast("Update: " + u.username + " -> " + RoleGate.label(sel.value), "success");
          await renderUsers(searchInput ? searchInput.value : "");
          if (isMe) { const s = Auth.getSession(); if (s) { const fresh = await Auth.findUser(s.username); if (fresh) { Auth.saveSession(fresh); applySession(fresh); } } }
        } catch (e) { toast(e.message, "error"); }
        finally { applyBtn.disabled = false; applyBtn.textContent = orig; }
      });
      const delBtn = el.querySelector(".danger");
      if (canDel) {
        let armed = false;
        delBtn.addEventListener("click", async function(){
          if (!armed) { armed = true; delBtn.classList.add("armed"); delBtn.textContent = "Yakin?"; setTimeout(function(){ if (armed) { armed = false; delBtn.classList.remove("armed"); delBtn.textContent = "Hapus"; } }, 3000); return; }
          try { await Auth.deleteUser(u.username, currentSession); toast("Dihapus.", "success"); await renderUsers(searchInput ? searchInput.value : ""); }
          catch (e) { toast(e.message, "error"); }
        });
      }
      usersEl.appendChild(el);
    });
  }
  function switchTab(tab) {
    activeTab = tab;
    $$(".yn-admin-tab").forEach(function(b){ b.classList.toggle("active", b.dataset.atab === tab); });
    if (usersView) usersView.style.display = tab === "users" ? "" : "none";
    if (maintView) maintView.style.display = tab === "maintenance" ? "" : "none";
    if (tab === "users") renderUsers(searchInput ? searchInput.value : "");
    else loadMaintForm();
  }
  $$(".yn-admin-tab").forEach(function(b){ b.addEventListener("click", function(){ switchTab(b.dataset.atab); }); });
  function show(mode) {
    if (!canAccess()) return toast("Akses ditolak.", "error");
    currentMode = mode || (currentSession.role === "owner" && !RoleGate.isDeveloper(currentSession) ? "upgrade" : "full");
    if (maintTab) maintTab.style.display = currentMode === "full" ? "" : "none";
    if (titleEl) titleEl.textContent = currentMode === "upgrade" ? "Upgrade Role Akun" : "Admin Panel";
    if (bd) { bd.classList.add("open"); document.body.classList.add("locked"); switchTab("users"); }
  }
  function hide() { if (!bd) return; bd.classList.remove("open"); document.body.classList.remove("locked"); }
  if (closeBtn) closeBtn.addEventListener("click", hide);
  if (bd) bd.addEventListener("click", function(e){ if (e.target === bd) hide(); });
  if (searchInput) searchInput.addEventListener("input", function(e){ if (activeTab === "users") renderUsers(e.target.value); });
  window.addEventListener('yn:profiles-changed',function(){
    if(currentSession && RoleGate.isDeveloper(currentSession) && bd && bd.classList.contains('open') && activeTab==='users') renderUsers(searchInput ? searchInput.value : '');
  });
  return { show, hide, setSession, renderUsers: function(){ return renderUsers(searchInput ? searchInput.value : ""); } };
})();

/* TRANSACTION UI (Owner upgrade with Telegram ACC) */
const TXUI = (function(){
  const bd = $("#yn-tx-bd");
  const closeBtn = $("#yn-tx-close");
  const summary = $("#yn-tx-summary");
  const status = $("#yn-tx-status");
  const nominal = $("#yn-tx-nominal");
  const method = $("#yn-tx-method");
  const proof = $("#yn-tx-proof");
  const note = $("#yn-tx-note");
  const submitBtn = $("#yn-tx-submit");
  const confirmBtn = $("#yn-tx-confirm");
  let pendingUsername = null;
  let pendingRole = null;

  function setStatus(type, text) {
    if (!status) return;
    status.className = "yn-tx-status show " + type;
    status.innerHTML = (type === "error" ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>' : (type === "pending" ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>')) + "<span>" + escapeHTML(text) + "</span>";
  }
  function clearStatus() { if (status) { status.className = "yn-tx-status"; status.innerHTML = ""; } }

  function show(username, role) {
    pendingUsername = username;
    pendingRole = role;
    if (summary) summary.innerHTML = "User: <b>" + escapeHTML(username) + "</b><br/>Role Tujuan: <b>" + escapeHTML(RoleGate.label(role)) + "</b>";
    if (nominal) nominal.value = "";
    if (note) note.value = "";
    if (proof) proof.value = "";
    if (confirmBtn) confirmBtn.style.display = "none";
    clearStatus();
    if (bd) { bd.classList.add("show"); document.body.classList.add("locked"); }
  }
  function close() {
    if (bd) bd.classList.remove("show");
    document.body.classList.remove("locked");
    pendingUsername = null; pendingRole = null;
  }
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (bd) bd.addEventListener("click", function(e){ if (e.target === bd) close(); });

  if (submitBtn) submitBtn.addEventListener("click", async function(){
    clearStatus();
    const nomVal = nominal ? nominal.value.trim() : "";
    const metVal = method ? method.value : "Transfer Bank";
    const noteVal = note ? note.value.trim() : "";
    const proofFile = proof && proof.files && proof.files[0];
    if (!nomVal) return setStatus("error", "Nominal pembayaran wajib diisi.");
    if (!pendingUsername || !pendingRole) return setStatus("error", "Data tidak valid.");
    if (proofFile && proofFile.size > 5 * 1024 * 1024) return setStatus("error", "Foto bukti maks 5 MB.");
    setBtnLoading(submitBtn, true);
    setStatus("pending", "Mengirim ke bot Telegram...");
    try {
      const text = [
        "🔔 <b>PENGAJUAN UPGRADE ROLE</b>",
        "",
        "👤 Username: <b>" + escapeHTML(pendingUsername) + "</b>",
        "🎯 Role Tujuan: <b>" + escapeHTML(RoleGate.label(pendingRole)) + "</b>",
        "💵 Nominal: <b>Rp " + escapeHTML(Number(nomVal).toLocaleString("id-ID")) + "</b>",
        "💳 Metode: " + escapeHTML(metVal),
        noteVal ? "📝 Catatan: " + escapeHTML(noteVal) : "",
        "",
        "⏰ " + new Date().toLocaleString("id-ID"),
        "",
        "Status: <b>Menunggu ACC dari Developer</b>"
      ].filter(Boolean).join("\n");
      if (proofFile) await tgSendPhoto(proofFile, text);
      else await tgSendMessage(text);
      setStatus("success", "Terkirim ke Telegram. Menunggu ACC dari Developer. Setelah di-ACC, tekan tombol Konfirmasi di bawah.");
      if (confirmBtn) confirmBtn.style.display = "flex";
      toast("Pengajuan terkirim.", "success");
    } catch (e) {
      setStatus("error", e.message || "Gagal mengirim.");
      toast(e.message || "Gagal.", "error");
    } finally {
      setBtnLoading(submitBtn, false);
    }
  });

  if (confirmBtn) confirmBtn.addEventListener("click", async function(){
    if (!pendingUsername || !pendingRole) return toast("Data tidak valid.", "error");
    setBtnLoading(confirmBtn, true);
    try {
      await Auth.setRole(pendingUsername, pendingRole, currentSession);
      toast("Role berhasil diterapkan.", "success");
      close();
      AdminPanel.renderUsers();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBtnLoading(confirmBtn, false);
    }
  });

  return { show, close };
})();

/* REPORT UI */
const ReportUI = (function(){
  const bd = $("#yn-report-bd");
  const closeBtn = $("#yn-report-close");
  const typeEl = $("#yn-report-type");
  const fileEl = $("#yn-report-file");
  const descEl = $("#yn-report-desc");
  const submitBtn = $("#yn-report-submit");
  const msgEl = $("#yn-report-msg");

  function showMsg(type, text) {
    if (!msgEl) return;
    msgEl.className = "yn-report-msg show " + type;
    msgEl.innerHTML = (type === "error" ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>' : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>') + "<span>" + escapeHTML(text) + "</span>";
  }
  function clearMsg() { if (msgEl) { msgEl.className = "yn-report-msg"; msgEl.innerHTML = ""; } }

  function open() {
    clearMsg();
    if (typeEl) typeEl.value = "Bug / Error";
    if (fileEl) fileEl.value = "";
    if (descEl) descEl.value = "";
    if (bd) { bd.classList.add("show"); document.body.classList.add("locked"); }
  }
  function close() {
    if (bd) bd.classList.remove("show");
    document.body.classList.remove("locked");
  }
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (bd) bd.addEventListener("click", function(e){ if (e.target === bd) close(); });

  if (submitBtn) submitBtn.addEventListener("click", async function(){
    clearMsg();
    const type = typeEl ? typeEl.value : "Lainnya";
    const desc = descEl ? descEl.value.trim() : "";
    const file = fileEl && fileEl.files && fileEl.files[0];
    if (!desc || desc.length < 5) return showMsg("error", "Penjelasan minimal 5 karakter.");
    if (!currentSession) return showMsg("error", "Harus login terlebih dahulu.");
    if (file && file.size > 5 * 1024 * 1024) return showMsg("error", "Foto maks 5 MB.");
    setBtnLoading(submitBtn, true);
    try {
      const text = [
        "📢 <b>LAPORAN MASALAH BARU</b>",
        "",
        "👤 Username: <b>" + escapeHTML(currentSession.username) + "</b>",
        "🆔 UUID: <code>" + escapeHTML(currentSession.uuid || "-") + "</code>",
        "🎭 Role: " + escapeHTML(RoleGate.label(currentSession.role)),
        "📧 Email: " + escapeHTML(currentSession.email || "-"),
        "",
        "📌 Jenis: <b>" + escapeHTML(type) + "</b>",
        "📝 Penjelasan:",
        escapeHTML(desc),
        "",
        "⏰ " + new Date().toLocaleString("id-ID")
      ].join("\n");
      if (file) await tgSendPhoto(file, text);
      else await tgSendMessage(text);
      showMsg("success", "Laporan terkirim. Terima kasih!");
      if (fileEl) fileEl.value = "";
      if (descEl) descEl.value = "";
      setTimeout(close, 1800);
    } catch (e) {
      showMsg("error", e.message || "Gagal mengirim laporan.");
    } finally {
      setBtnLoading(submitBtn, false);
    }
  });
  return { open, close };
})();

/* AUTH UI */
const AuthUI = (function(){
  const bd = $("#yn-auth-bd"); const closeBtn = $("#yn-auth-close");
  const tabLogin = $("#yn-tab-login"); const tabRegister = $("#yn-tab-register");
  const formLogin = $("#yn-form-login"); const formRegister = $("#yn-form-register");
  const loginUser = $("#yn-login-user"); const loginPass = $("#yn-login-pass"); const loginMsg = $("#yn-login-msg"); const loginSubmit = $("#yn-login-submit");
  const regUser = $("#yn-reg-user"); const regEmail = $("#yn-reg-email"); const regPass = $("#yn-reg-pass"); const regPass2 = $("#yn-reg-pass2"); const regMsg = $("#yn-reg-msg"); const regSubmit = $("#yn-reg-submit");
  let forced = false;
  function showMsg(el, type, text) { if (!el) return; el.className = "yn-auth-msg show " + type; el.innerHTML = (type === "error" ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>' : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>') + "<span>" + escapeHTML(text) + "</span>"; }
  function clearMsg(el) { if (el) { el.className = "yn-auth-msg"; el.innerHTML = ""; } }
  function showTab(tab) {
    clearMsg(loginMsg); clearMsg(regMsg);
    tabLogin.classList.toggle("active", tab === "login"); tabLogin.setAttribute("aria-selected", tab === "login");
    tabRegister.classList.toggle("active", tab === "register"); tabRegister.setAttribute("aria-selected", tab === "register");
    formLogin.classList.toggle("active", tab === "login"); formRegister.classList.toggle("active", tab === "register");
  }
  tabLogin.addEventListener("click", function(){ showTab("login"); });
  tabRegister.addEventListener("click", function(){ showTab("register"); });
  if (closeBtn) closeBtn.addEventListener("click", function(){ if (!forced) hide(); });
  function setLoading(btn, loading) { if (!btn) return; if (loading) { if (!btn._orig) btn._orig = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="yn-spinner"></span><span>Memproses...</span>'; } else { btn.disabled = false; if (btn._orig) { btn.innerHTML = btn._orig; btn._orig = null; } } }
  loginSubmit.addEventListener("click", async function(){
    clearMsg(loginMsg);
    const u = loginUser.value.trim().toLowerCase(); const p = loginPass.value;
    if (!u) return showMsg(loginMsg, "error", "Email wajib.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u)) return showMsg(loginMsg, "error", "Format email tidak valid.");
    if (!p) return showMsg(loginMsg, "error", "Password wajib.");
    setLoading(loginSubmit, true);
    try {
      const user = await Auth.login(u, p);
      Auth.saveSession(user);
      hide();
      await SuccessAnim.run({ title: "Selamat datang, " + user.username + "!", subtitle: "Role: " + RoleGate.label(user.role) });
      await boot(user);
    } catch (e) {
      showMsg(loginMsg, "error", e.message || "Login gagal. Jika email belum diverifikasi, periksa kotak masuk kamu.");
    }
    finally { setLoading(loginSubmit, false); }
  });
  loginPass.addEventListener("keydown", function(e){ if (e.key === "Enter") loginSubmit.click(); });
  regSubmit.addEventListener("click", async function(){
    clearMsg(regMsg);
    const u = regUser.value.trim();
    const email = regEmail.value.trim();
    const p = regPass.value; const p2 = regPass2.value;
    if (!u || u.length < 3) return showMsg(regMsg, "error", "Username minimal 3 karakter.");
    if (!/^[a-zA-Z0-9_.-]+$/.test(u)) return showMsg(regMsg, "error", "Username tidak valid.");
    if (norm(u) === "zill") return showMsg(regMsg, "error", "Username sudah dipakai.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMsg(regMsg, "error", "Email tidak valid.");
    if (!p || p.length < 8) return showMsg(regMsg, "error", "Password minimal 8 karakter.");
    if (p !== p2) return showMsg(regMsg, "error", "Konfirmasi password tidak cocok.");
    setLoading(regSubmit, true);
    try {
      const result = await Auth.register({ username: u, password: p, email: email });
      hide();
      OTPUI.show(result.user);
    } catch (e) { showMsg(regMsg, "error", e.message); }
    finally { setLoading(regSubmit, false); }
  });
  function show(opts) {
    opts = opts || {};
    forced = !!opts.forced;
    bd.classList.toggle("forced", forced);
    bd.classList.add("show"); document.body.classList.add("locked");
    showTab("login");
  }
  function hide() {
    if (forced) return;
    bd.classList.remove("show", "forced"); document.body.classList.remove("locked");
    clearMsg(loginMsg); clearMsg(regMsg);
    loginUser.value = ""; loginPass.value = ""; regUser.value = ""; regEmail.value = ""; regPass.value = ""; regPass2.value = "";
  }
  function forceHide() { bd.classList.remove("show", "forced"); document.body.classList.remove("locked"); forced = false; }
  return { show, hide, forceHide };
})();
window.AuthUI = AuthUI;

/* OTP UI */
const OTPUI = (function(){
  const bd = $("#yn-otp-bd");
  const boxesHost = $("#yn-otp-boxes");
  const msgEl = $("#yn-otp-msg");
  const submitBtn = $("#yn-otp-submit");
  const resendBtn = $("#yn-otp-resend");
  const cancelBtn = $("#yn-otp-cancel");
  const fallbackEl = $("#yn-otp-fallback");
  let boxes = []; let currentUser = null;
  function init() {
    boxesHost.innerHTML = ""; boxes = [];
    for (let i = 0; i < 6; i++) {
      const inp = document.createElement("input");
      inp.type = "text"; inp.inputMode = "numeric"; inp.maxLength = 1; inp.className = "yn-otp-box";
      inp.addEventListener("input", function(e){
        const v = e.target.value.replace(/\D/g, "");
        e.target.value = v; e.target.classList.toggle("filled", !!v);
        if (v && i < 5) boxes[i + 1].focus();
      });
      inp.addEventListener("keydown", function(e){ if (e.key === "Backspace" && !e.target.value && i > 0) boxes[i - 1].focus(); });
      inp.addEventListener("paste", function(e){
        const data = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
        if (!data) return; e.preventDefault();
        for (let k = 0; k < 6; k++) { boxes[k].value = data[k] || ""; boxes[k].classList.toggle("filled", !!data[k]); }
        boxes[Math.min(5, data.length)].focus();
      });
      boxesHost.appendChild(inp); boxes.push(inp);
    }
  }
  function getOtp() { return boxes.map(function(b){ return b.value; }).join(""); }
  function showMsg(type, text) { if (!msgEl) return; msgEl.className = "yn-otp-msg show " + type; msgEl.innerHTML = (type === "error" ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg>' : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>') + "<span>" + escapeHTML(text) + "</span>"; }
  function clearMsg() { if (msgEl) { msgEl.className = "yn-otp-msg"; msgEl.innerHTML = ""; } }
  function setFallback(user) {
    if (!fallbackEl) return;
    if (fallbackEl) { fallbackEl.style.display = "none"; fallbackEl.innerHTML = ""; }
  }
  function show(user) {
    init(); currentUser = user; clearMsg(); setFallback(user);
    bd.classList.add("show"); document.body.classList.add("locked");
    setTimeout(function(){ if (boxes[0]) boxes[0].focus(); }, 200);
  }
  function hide() { bd.classList.remove("show"); document.body.classList.remove("locked"); currentUser = null; }
  if (cancelBtn) cancelBtn.addEventListener("click", function(){ hide(); AuthUI.show({ forced: false }); });
  if (resendBtn) resendBtn.addEventListener("click", async function(){
    if (!currentUser) return;
    resendBtn.disabled = true;
    try {
      await Auth.resendOtp(currentUser.email);
      showMsg("success", "Kode verifikasi dikirim ulang ke email kamu.");
      boxes.forEach(function(b){ b.value = ""; b.classList.remove("filled"); });
      if (boxes[0]) boxes[0].focus();
    } catch (e) { showMsg("error", e.message || "Gagal kirim ulang."); }
    finally { resendBtn.disabled = false; }
  });
  if (submitBtn) submitBtn.addEventListener("click", async function(){
    clearMsg();
    const otp = getOtp();
    if (otp.length !== 6) return showMsg("error", "Isi 6 digit OTP.");
    if (!currentUser) return showMsg("error", "User tidak valid.");
    submitBtn.disabled = true;
    const orig = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="yn-spinner"></span><span>Memverifikasi...</span>';
    try {
      const user = await Auth.verifyOtp(currentUser.email, otp);
      Auth.saveSession(user);
      hide();
      await SuccessAnim.run({ title: "Verifikasi berhasil!", subtitle: "Selamat datang, " + user.username });
      await boot(user);
    } catch (e) {
      showMsg("error", e.message || "Verifikasi gagal.");
      submitBtn.disabled = false; submitBtn.innerHTML = orig;
    }
  });
  return { show, hide };
})();

/* Success Animation */
const SuccessAnim = (function(){
  let complete = false, callbacks = [];
  function resolveAll(){ const cbs = callbacks.slice(); callbacks = []; cbs.forEach(function(cb){ try { cb(); } catch(e){} }); }
  return {
    run: function(opts){
      opts = opts || {};
      const bd = $("#yn-success-bd"), title = $("#yn-success-title"), sub = $("#yn-success-sub"), fill = $("#yn-success-fill");
      if (title && opts.title) title.textContent = opts.title;
      if (sub && opts.subtitle) sub.textContent = opts.subtitle;
      if (!bd) return Promise.resolve();
      complete = false; bd.classList.add("show");
      const start = performance.now();
      const tick = function(now){
        if (complete) return;
        const p = Math.min(100, ((now - start) / 1400) * 100);
        if (fill) fill.style.width = p + "%";
        if (p < 100) requestAnimationFrame(tick);
        else { complete = true; setTimeout(function(){ bd.classList.remove("show"); resolveAll(); }, 400); }
      };
      requestAnimationFrame(tick);
      return new Promise(function(resolve){ callbacks.push(resolve); });
    }
  };
})();

/* Grid */
let currentSession = null;
function renderToolGrid() {
  const grid = $("#yn-grid"); if (!grid) return;
  const hasSession = !!currentSession;
  const isDevUser = RoleGate.isDeveloper(currentSession);
  const visibleTools = TOOLS.filter(function(t){ return !t.devOnly || isDevUser; });
  grid.innerHTML = visibleTools.map(function(t, i){
    const allowed = hasSession && RoleGate.canAccess(t.id, currentSession);
    const showLock = hasSession && !allowed;
    const lockBadge = showLock ? '<span class="yn-tool-lock"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg></span>' : "";
    const newBadge = (t.isNew && !showLock) ? '<span class="yn-tool-new">NEW</span>' : "";
    const badgeText = showLock ? "Perlu Premium" : t.badge;
    return '<div class="yn-tool' + (showLock ? " locked" : "") + '" data-cat="' + escapeHTML(t.cat) + '" data-id="' + escapeHTML(t.id) + '" style="--i:' + i + '" role="listitem" tabindex="0">' + lockBadge + newBadge + '<span class="yn-tool-kana">' + escapeHTML(t.kana) + '</span><div class="yn-tool-icon">' + t.icon + '</div><div class="yn-tool-name">' + escapeHTML(t.name) + '</div><div class="yn-tool-desc">' + escapeHTML(t.desc) + '</div><div class="yn-tool-badge">' + escapeHTML(badgeText) + '</div></div>';
  }).join("");
  grid.querySelectorAll(".yn-tool").forEach(function(el){
    el.addEventListener("click", function(){ openTool(el.dataset.id); });
    el.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openTool(el.dataset.id); } });
  });
  applyFilter(window.__ynFilter || "all");
}
function applyFilter(f){
  window.__ynFilter = f;
  $$(".yn-tool").forEach(function(el){ el.classList.toggle("hidden", f !== "all" && el.dataset.cat !== f); });
  $$(".yn-chip").forEach(function(c){ const on = c.dataset.filter === f; c.classList.toggle("active", on); c.setAttribute("aria-selected", String(on)); });
}
$$(".yn-chip").forEach(function(c){ c.addEventListener("click", function(){ applyFilter(c.dataset.filter); }); });

function renderGuidePanel(tool) {
  const panel = document.createElement("div");
  panel.id = "yn-guide-active"; panel.className = "yn-guide-panel";
  let html = '<h4>Cara Pakai — ' + escapeHTML(tool.name) + '</h4>';
  if (Array.isArray(tool.guide) && tool.guide.length) {
    html += "<ol>" + tool.guide.map(function(s){ return "<li>" + s + "</li>"; }).join("") + "</ol>";
  } else {
    html += "<div>Isi input yang diperlukan, tekan tombol utama, tunggu proses selesai, lalu salin atau unduh hasil.</div>";
  }
  if (tool.note) html += '<div class="yn-guide-note">' + tool.note + "</div>";
  panel.innerHTML = html;
  return panel;
}

function openTool(id) {
  const tool = TOOLS.find(function(t){ return t.id === id; }); if (!tool) return;
  if (tool.devOnly && !RoleGate.isDeveloper(currentSession)) return toast("Hanya Developers.", "error");
  if (!currentSession) { AuthUI.show({ forced: false }); return toast("Login dulu ya.", "info"); }
  if (!RoleGate.canAccess(id, currentSession)) return toast("Tool butuh Premium.", "error");
  if (modalCloseTimer) { clearTimeout(modalCloseTimer); modalCloseTimer = null; }
  modalLock = false;
  currentTool = tool;
  modalIcon.innerHTML = tool.icon || "";
  modalTitle.textContent = tool.name;
  modalBody.innerHTML = "";
  try { tool.render(modalBody); }
  catch (e) {
    modalBody.innerHTML = "";
    const err = document.createElement("div"); err.className = "yn-error";
    err.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01"/></svg><span>' + escapeHTML("Tool gagal dimuat: " + (e.message || "unknown")) + '</span>';
    modalBody.appendChild(err);
  }
  modalBd.classList.add("open"); document.body.classList.add("locked");
  modalBody.scrollTop = 0;
}
function closeModal() {
  if (!modalBd.classList.contains("open") || modalLock) return;
  modalLock = true;
  modalBd.classList.remove("open"); document.body.classList.remove("locked");
  if (modalCloseTimer) clearTimeout(modalCloseTimer);
  modalCloseTimer = setTimeout(function(){ modalBody.innerHTML = ""; modalLock = false; modalCloseTimer = null; }, 250);
}
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBd) modalBd.addEventListener("click", function(e){ if (e.target === modalBd) closeModal(); });
if (modalGuideBtn) modalGuideBtn.addEventListener("click", function(){
  if (!currentTool) return;
  const existing = $("#yn-guide-active");
  if (existing) { existing.remove(); return; }
  const panel = renderGuidePanel(currentTool);
  modalBody.insertBefore(panel, modalBody.firstChild);
  try { panel.scrollIntoView({ behavior: "smooth", block: "start" }); } catch(e){}
});

/* Boot */
function applySession(session) {
  currentSession = session;
  AdminPanel.setSession(session);
  const user = isDev(session.username) ? "Zill" : session.username;
  const topUser = $("#yn-topbar-user"), topName = $("#yn-topbar-username");
  if (topUser && topName) { topUser.style.display = "flex"; topName.textContent = user; }
  const roleTag = $("#yn-role-tag");
  if (roleTag) { roleTag.textContent = RoleGate.label(session.role); roleTag.className = "yn-tag " + session.role; }
  const nameText = $("#yn-profile-name-text");
  if (nameText) nameText.textContent = session.username;
  const handleText = $("#yn-profile-handle-text");
  if (handleText) handleText.textContent = "@" + session.username.toLowerCase().replace(/\s+/g, "_");
  const savedAvatar = Store.get("avatar");
  const avatarEl = $("#yn-avatar");
  if (savedAvatar && avatarEl) avatarEl.innerHTML = '<img src="' + savedAvatar + '" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
  const topLogin = $("#yn-top-login"), topLogout = $("#yn-top-logout");
  if (topLogin) topLogin.style.display = "none";
  if (topLogout) topLogout.style.display = "";
  const isDevUser = RoleGate.isDeveloper(session);
  const isOwner = session.role === "owner";
  const sideAdmin = $("#yn-side-admin");
  const sideAdminLabel = $("#yn-side-admin-label");
  if (sideAdmin && sideAdminLabel) {
    if (isDevUser) {
      sideAdminLabel.textContent = "Admin Panel";
      sideAdmin.style.display = "";
    } else if (isOwner) {
      sideAdminLabel.textContent = "Upgrade Role Akun";
      sideAdmin.style.display = "";
    } else {
      sideAdmin.style.display = "none";
    }
  }
  const sideReport = $("#yn-side-report");
  if (sideReport) {
    const canReport = session.role === "basic" || session.role === "vip";
    sideReport.style.display = canReport ? "" : "none";
  }
  renderToolGrid();
  const cu = $("#yn-copy-uuid");
  if (cu) cu.onclick = function(){ if (session.uuid) { navigator.clipboard.writeText(session.uuid).then(function(){ toast("UUID disalin.", "success"); }).catch(function(){ toast("Gagal menyalin.", "error"); }); } else { toast("UUID belum tersedia.", "error"); } };
  const cn = $("#yn-copy-username");
  if (cn) cn.onclick = function(){ navigator.clipboard.writeText(session.username).then(function(){ toast("Username disalin.", "success"); }).catch(function(){ toast("Gagal menyalin.", "error"); }); };
}
async function boot(session) {
  AuthUI.forceHide();
  applySession(session);
  try { await MusicPlayer.init(); } catch (e) { console.warn("Music:", e); }
  try { await BannerModule.init(); } catch (e) { console.warn("Banner:", e); }
}
async function initApp() {
  try {
    await Auth.init();
    const blocked = await MaintenanceModule.checkAndApply();
    if (blocked) return;
    const sess = Auth.getSession();
    if (sess) { await boot(sess); return; }
    AuthUI.show({ forced: true });
  } catch (e) {
    console.error("Cloud auth init failed:",e);
    AuthUI.show({ forced: true });
    toast(e.message || "Koneksi database belum siap.", "error");
  }
}

/* UI wiring */
const sidebar = $("#yn-sidebar"), scrim = $("#yn-scrim"), menuBtn = $("#yn-menu-btn");
function setSidebar(open) { if (!sidebar) return; sidebar.classList.toggle("open", open); if (scrim) scrim.classList.toggle("on", open); if (menuBtn) menuBtn.setAttribute("aria-expanded", String(open)); }
if (menuBtn) menuBtn.addEventListener("click", function(){ setSidebar(!sidebar.classList.contains("open")); });
if (scrim) scrim.addEventListener("click", function(){ setSidebar(false); });
$$("[data-go]").forEach(function(btn){
  btn.addEventListener("click", function(){
    const where = btn.dataset.go; setSidebar(false);
    if (where === "music") { const t = $("#yn-music-toggle"); if (t) t.click(); return; }
    if (where === "admin") { 
      if (currentSession && (RoleGate.isDeveloper(currentSession) || currentSession.role === "owner")) {
        const mode = RoleGate.isDeveloper(currentSession) ? "full" : "upgrade";
        AdminPanel.show(mode);
      } else toast("Akses ditolak.", "error");
      return;
    }
    if (where === "command") { openCmd(); return; }
    const target = ({ hero: "#yn-hero", tools: "#yn-grid", profile: "#yn-profile-card" })[where];
    const t = target ? $(target) : null; if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
const sideReportBtn = $("#yn-side-report");
if (sideReportBtn) sideReportBtn.addEventListener("click", function(){ setSidebar(false); ReportUI.open(); });

const topLogin = $("#yn-top-login"); if (topLogin) topLogin.addEventListener("click", function(){ AuthUI.show({ forced: false }); });
const topLogout = $("#yn-top-logout"); if (topLogout) topLogout.addEventListener("click", async function(){
  await SuccessAnim.run({ title: "Sampai jumpa", subtitle: "Logout berhasil" });
  Auth.clearSession(); Store.remove("deviceId");
  currentSession = null; AuthUI.show({ forced: false }); renderToolGrid();
});

/* Command Center */
const cmdBd = $("#yn-cmd-bd"), cmdSearch = $("#yn-cmd-search"), cmdList = $("#yn-cmd-list"), cmdCount = $("#yn-cmd-count");
let cmdItems = [];
function collectTargets() {
  const isDevUser = RoleGate.isDeveloper(currentSession);
  const items = TOOLS.filter(function(t){ return !t.devOnly || isDevUser; }).map(function(t){ return { kind: "TOOL", label: t.name, desc: t.desc, action: function(){ openTool(t.id); } }; });
  items.push({ kind: "NAV", label: "Beranda", desc: "Ke atas", action: function(){ const t = $("#yn-hero"); if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth" }); } });
  items.push({ kind: "NAV", label: "Katalog", desc: "Semua tools", action: function(){ const t = $("#yn-grid"); if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth" }); } });
  items.push({ kind: "ACT", label: "Music Player", desc: "Buka music", action: function(){ const t = $("#yn-music-toggle"); if (t) t.click(); } });
  if (currentSession && (currentSession.role === "basic" || currentSession.role === "vip")) {
    items.push({ kind: "ACT", label: "Laporkan Masalah", desc: "Kirim laporan ke developer", action: function(){ ReportUI.open(); } });
  }
  if (isDevUser) {
    items.push({ kind: "ACT", label: "Admin Panel", desc: "Kelola user & maintenance", action: function(){ AdminPanel.show("full"); } });
    items.push({ kind: "ACT", label: "API Test Center", desc: "Uji endpoint", action: function(){ openTool("apitest"); } });
  } else if (currentSession && currentSession.role === "owner") {
    items.push({ kind: "ACT", label: "Upgrade Role Akun", desc: "Kelola upgrade role", action: function(){ AdminPanel.show("upgrade"); } });
  }
  return items;
}
function renderCmd(q) {
  q = q || "";
  const query = q.toLowerCase().trim();
  cmdItems = collectTargets().filter(function(x){ return !query || (x.label + " " + x.desc).toLowerCase().indexOf(query) !== -1; }).slice(0, 40);
  if (cmdCount) cmdCount.textContent = query ? (cmdItems.length + " HASIL") : "AKSES CEPAT";
  if (!cmdItems.length) { cmdList.innerHTML = '<div class="yn-cmd-empty">Tidak ada hasil.</div>'; return; }
  cmdList.innerHTML = cmdItems.map(function(x, i){
    const initials = (x.label.split(/\s+/).slice(0, 2).map(function(w){ return w[0] || ""; }).join("") || "?").toUpperCase();
    return '<button class="yn-cmd-item" type="button" data-idx="' + i + '"><span class="yn-cmd-item-icon">' + escapeHTML(initials) + '</span><span class="yn-cmd-item-copy"><b>' + escapeHTML(x.label) + '</b><small>' + escapeHTML(x.desc) + '</small></span><span class="yn-cmd-item-arrow">+</span></button>';
  }).join("");
}
function openCmd(){ if (!cmdBd) return; cmdBd.classList.add("open"); document.body.classList.add("locked"); renderCmd(cmdSearch ? cmdSearch.value : ""); setTimeout(function(){ if (cmdSearch) cmdSearch.focus(); }, 40); }
function closeCmd(){ if (!cmdBd) return; cmdBd.classList.remove("open"); document.body.classList.remove("locked"); }
const cmdTrigger = $("#yn-cmd-trigger"); if (cmdTrigger) cmdTrigger.addEventListener("click", openCmd);
if (cmdBd) cmdBd.addEventListener("click", function(e){ if (e.target === cmdBd) closeCmd(); });
if (cmdSearch) cmdSearch.addEventListener("input", function(){ renderCmd(cmdSearch.value); });
if (cmdList) cmdList.addEventListener("click", function(e){ const b = e.target.closest("[data-idx]"); if (b) { const item = cmdItems[Number(b.dataset.idx)]; if (item) { closeCmd(); item.action(); } } });
document.addEventListener("keydown", function(e){
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (cmdBd.classList.contains("open")) closeCmd(); else openCmd(); }
  else if (e.key === "Escape") {
    if (cmdBd && cmdBd.classList.contains("open")) closeCmd();
    if (modalBd && modalBd.classList.contains("open")) closeModal();
    const ab = $("#yn-admin-bd"); if (ab && ab.classList.contains("open")) { ab.classList.remove("open"); document.body.classList.remove("locked"); }
    const rb = $("#yn-report-bd"); if (rb && rb.classList.contains("show")) { rb.classList.remove("show"); document.body.classList.remove("locked"); }
    const tb = $("#yn-tx-bd"); if (tb && tb.classList.contains("show")) { tb.classList.remove("show"); document.body.classList.remove("locked"); }
  }
});

/* Profile avatar */
(function(){
  const avatarWrap = $("#yn-avatar-wrap"), avatarInput = $("#yn-avatar-input"), avatarEl = $("#yn-avatar");
  const saved = Store.get("avatar");
  if (saved && avatarEl) avatarEl.innerHTML = '<img src="' + saved + '" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
  if (avatarWrap) avatarWrap.addEventListener("click", function(){ avatarInput.click(); });
  if (avatarInput) avatarInput.addEventListener("change", function(e){
    const f = e.target.files && e.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) { toast("Format tidak didukung.", "error"); return; }
    if (f.size > 2 * 1024 * 1024) { toast("Maks 2MB.", "error"); return; }
    const r = new FileReader();
    r.onload = function(ev){ avatarEl.innerHTML = '<img src="' + ev.target.result + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>'; Store.set("avatar", ev.target.result); toast("Tersimpan.", "success"); };
    r.readAsDataURL(f);
  });
})();

/* Scroll & meta */
(function(){
  const bar = $("#yn-scroll-bar"); let ticking = false;
  const update = function(){ ticking = false; const h = document.documentElement.scrollHeight - window.innerHeight; const p = h > 0 ? Math.min(100, Math.max(0, window.scrollY / h * 100)) : 0; if (bar) bar.style.width = p + "%"; };
  window.addEventListener("scroll", function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
(function(){
  const el = $("#yn-meta-country");
  (async function(){
    try { const r = await fetch(API_CENTER.services.ipapi.baseURL + "/json/", { cache: "no-store" }); if (r.ok) { const d = await r.json(); if (el) el.textContent = (d.country_name || "?") + " · " + (d.country_code || "").toUpperCase(); return; } } catch(e){}
    if (el) el.textContent = "Tidak diketahui";
  })();
  const ua = navigator.userAgent;
  const dev = /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "Unknown";
  const br = /Edg\//i.test(ua) ? "Edge" : /OPR\//i.test(ua) ? "Opera" : /Chrome\//i.test(ua) ? "Chrome" : /Firefox\//i.test(ua) ? "Firefox" : /Safari\//i.test(ua) ? "Safari" : "Unknown";
  const devEl = $("#yn-meta-device"), brEl = $("#yn-meta-browser");
  if (devEl) devEl.textContent = dev;
  if (brEl) brEl.textContent = br;
  const status = function(){ const el2 = $("#yn-meta-status"); if (!el2) return; const on = navigator.onLine; el2.className = "yn-meta-value " + (on ? "ok" : "warn"); el2.innerHTML = '<span class="yn-status-dot" style="background:' + (on ? "var(--success)" : "var(--danger)") + '"></span>' + (on ? "Online" : "Offline"); };
  status(); window.addEventListener("online", status); window.addEventListener("offline", status);
})();

/* Init */
try { renderToolGrid(); } catch (e) { console.error("Grid render early:", e); }
initApp().catch(function(e){ console.error("initApp failed:", e); try { toast("Init error: " + (e.message || "unknown"), "error"); } catch(err){} });

})();
