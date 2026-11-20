/* Lintu AI Yol Haritası (v3) — Sade, Modüler & Çift Kayıtlı Uygulama Mantığı
 * Harici kütüphane yoktur; ES module kullanılmaz, file:// ve GitHub Pages uyumludur.
 */
(function () {
  "use strict";

  const HAS_WINDOW = typeof window !== "undefined";
  const HAS_DOC = typeof document !== "undefined";
  const DATA = HAS_WINDOW ? window.ROADMAP_DATA : null;

  const STORAGE_KEY_V3 = "ai_roadmap_v3";
  const STORAGE_KEY_V2 = "ai_roadmap_state_v2";
  const STORAGE_KEY_THEME = "ai_roadmap_theme_v3";
  const STORAGE_KEY_TOUR = "ai_roadmap_tour_seen_v3";

  const IDB_NAME = "lintu_roadmap_db_v3";
  const IDB_STORE = "state";
  const IDB_KEY = "app_state";

  const ROLE_LABELS = {
    ortak: "Ortak Çekirdek",
    mimari: "Mimari & Mat.",
    veri: "Veri & Tokenizer",
    sistem: "GPU & Sistem",
    posttraining: "Post-Training & RL",
    eval: "Eval & Servis"
  };

  const TAB_TITLES = {
    baslangic: "0. Sıfırdan Başla, Yardım & 28 Temel Terim",
    seviyeler: "1. Seviyeler & Müfredat (6 Seviye · 24 Konu)",
    takvim: "2. 12 Aylık Yıllık & Aylık Takvim (48 Hafta)",
    tarih: "3. Olay Örgüsü (7 Perde) & Kronoloji",
    araclar: "4. Hesaplayıcılar, Ücretsiz GPU, AI & Ekip",
    kutuphane: "5. Doğrulanmış Kaynak Kütüphanesi & Denetim"
  };

  const TR_MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const DEFAULT_TOPIC_IDS = [
    "t-0-1", "t-0-2", "t-0-3", "t-0-4",
    "t-1-1", "t-1-2", "t-1-3", "t-1-4",
    "t-2-1", "t-2-2", "t-2-3", "t-2-4",
    "t-3-1", "t-3-2", "t-3-3", "t-3-4",
    "t-4-1", "t-4-2", "t-4-3", "t-4-4",
    "t-5-1", "t-5-2", "t-5-3", "t-5-4"
  ];

  const DEFAULT_WEEK_IDS = Array.from({ length: 12 }, (_, mIdx) => {
    const mStr = String(mIdx + 1).padStart(2, "0");
    return [1, 2, 3, 4].map((w) => `m${mStr}-w${w}`);
  }).flat();

  const VRAM_PRESETS = {
    tinystories10m: { paramsM: 10, mode: "mixed", batch: 8, seq: 512, hidden: 256, layers: 6, gradCkpt: false, unsloth: false },
    "gpt2-124m": { paramsM: 124, mode: "mixed", batch: 4, seq: 512, hidden: 768, layers: 12, gradCkpt: true, unsloth: false },
    llama1b: { paramsM: 1000, mode: "mixed", batch: 2, seq: 1024, hidden: 2048, layers: 16, gradCkpt: true, unsloth: false },
    "qwen7b-qlora": { paramsM: 7000, mode: "qlora", batch: 2, seq: 1024, hidden: 3584, layers: 28, gradCkpt: true, unsloth: true }
  };

  let appState = loadInitialState();
  let currentTabId = "baslangic";
  let activeLevelId = "all";
  let calViewMode = "annual";
  let selectedCalMonth = 1;
  let personalViewYear = new Date().getFullYear();
  let personalViewMonth = new Date().getMonth();
  let selectedPersonalDate = toLocalDateKey(new Date());
  let histViewMode = "story";
  let libBookmarkOnly = false;
  let tourStepIndex = 0;

  /* ---------- Yardımcılar ---------- */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function $(id) {
    return HAS_DOC ? document.getElementById(id) : null;
  }

  function getTopicIds() {
    if (DATA && Array.isArray(DATA.LEVEL_GROUPS) && DATA.LEVEL_GROUPS.length) {
      return DATA.LEVEL_GROUPS.flatMap((lvl) => (lvl.topics || []).map((t) => t.id));
    }
    return DEFAULT_TOPIC_IDS;
  }

  function getWeekIds() {
    if (DATA && Array.isArray(DATA.ANNUAL_CALENDAR) && DATA.ANNUAL_CALENDAR.length) {
      return DATA.ANNUAL_CALENDAR.flatMap((m) => (m.weeks || []).map((w) => w.id));
    }
    return DEFAULT_WEEK_IDS;
  }

  function getResourceMap() {
    const map = {};
    if (DATA && Array.isArray(DATA.ALL_RESOURCES)) {
      DATA.ALL_RESOURCES.forEach((r) => { map[r.id] = r; });
    }
    return map;
  }

  function createEmptyMember(role) {
    return {
      role: ROLE_LABELS[role] ? role : "ortak",
      topics: {},
      weeks: {},
      bookmarks: {},
      activityLog: {}
    };
  }

  function cleanBoolMap(obj) {
    const out = {};
    if (!obj || typeof obj !== "object") return out;
    Object.keys(obj).forEach((k) => {
      if (obj[k]) out[k] = true;
    });
    return out;
  }

  function cleanActivityLog(rawLog) {
    const out = {};
    if (!rawLog || typeof rawLog !== "object") return out;
    Object.entries(rawLog).forEach(([dateKey, entry]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !entry || typeof entry !== "object") return;
      const items = Array.isArray(entry.items)
        ? Array.from(new Set(entry.items.map((x) => String(x || "").trim()).filter(Boolean)))
        : [];
      const checkIns = Math.max(0, Math.floor(Number(entry.checkIns) || 0));
      const note = typeof entry.note === "string" ? entry.note.trim().slice(0, 240) : "";
      if (items.length > 0 || checkIns > 0 || note) {
        out[dateKey] = { items, checkIns, note };
      }
    });
    return out;
  }

  function normalizeState(raw) {
    const base = {
      activeMember: "Yusuf",
      startMonth: "2026-11",
      members: {
        Yusuf: createEmptyMember("ortak")
      }
    };
    if (!raw || typeof raw !== "object") return base;

    if (raw.startMonth === "relative" || /^\d{4}-\d{2}$/.test(String(raw.startMonth || ""))) {
      base.startMonth = String(raw.startMonth);
    }

    if (raw.members && typeof raw.members === "object") {
      const nextMembers = {};
      Object.entries(raw.members).forEach(([name, m]) => {
        const cleanName = String(name).trim() || "Üye";
        nextMembers[cleanName] = {
          role: m && ROLE_LABELS[m.role] ? m.role : "ortak",
          topics: cleanBoolMap(m && m.topics),
          weeks: cleanBoolMap(m && m.weeks),
          bookmarks: cleanBoolMap(m && m.bookmarks),
          activityLog: cleanActivityLog(m && m.activityLog)
        };
      });
      if (Object.keys(nextMembers).length > 0) {
        base.members = nextMembers;
      }
    }

    base.activeMember = raw.activeMember && base.members[raw.activeMember]
      ? raw.activeMember
      : Object.keys(base.members)[0];

    return base;
  }

  function loadInitialState() {
    if (typeof localStorage === "undefined") {
      return normalizeState(null);
    }
    try {
      const rawV3 = localStorage.getItem(STORAGE_KEY_V3);
      if (rawV3) {
        return normalizeState(JSON.parse(rawV3));
      }
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (rawV2) {
        const parsedV2 = JSON.parse(rawV2);
        const migrated = normalizeState(null);
        if (parsedV2 && parsedV2.profiles && typeof parsedV2.profiles === "object") {
          const members = {};
          Object.entries(parsedV2.profiles).forEach(([name, prof]) => {
            const cleanName = String(name).trim() || "Üye";
            members[cleanName] = createEmptyMember(prof && prof.role);
          });
          if (Object.keys(members).length > 0) {
            migrated.members = members;
            migrated.activeMember = parsedV2.activeProfile && members[parsedV2.activeProfile]
              ? parsedV2.activeProfile
              : Object.keys(members)[0];
          }
        }
        localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(migrated));
        return migrated;
      }
    } catch (err) {
      console.warn("Durum okuma hatası:", err);
    }
    return normalizeState(null);
  }

  function getActiveMember() {
    if (!appState.members[appState.activeMember]) {
      appState.members[appState.activeMember] = createEmptyMember("ortak");
    }
    return appState.members[appState.activeMember];
  }

  function getState() {
    return appState;
  }

  /* ---------- Çift Sessiz Otomatik Kayıt (localStorage + IndexedDB) ---------- */
  function openIdb() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("indexedDB yok"));
        return;
      }
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function writeIndexedDb(stateObj) {
    if (typeof indexedDB === "undefined") return;
    openIdb()
      .then((db) => new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(stateObj, IDB_KEY);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error); };
      }))
      .catch(() => {});
  }

  function hydrateFromIndexedDbIfNeeded() {
    if (typeof indexedDB === "undefined" || typeof localStorage === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY_V3)) return;
    openIdb()
      .then((db) => new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readonly");
        const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
        req.onsuccess = () => { db.close(); resolve(req.result); };
        req.onerror = () => { db.close(); reject(req.error); };
      }))
      .then((stored) => {
        if (stored && typeof stored === "object") {
          appState = normalizeState(stored);
          try {
            localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(appState));
          } catch (_) {}
          refreshAllProgressUI();
        }
      })
      .catch(() => {});
  }

  function saveState() {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(appState));
      } catch (err) {
        console.warn("localStorage kaydı başarısız:", err);
      }
    }
    writeIndexedDb(appState);

    const hint = $("sidebarSaveHint");
    if (hint) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      hint.textContent = `Bu tarayıcıya kaydedildi · ${hh}:${mm}`;
    }
  }

  /* ---------- Kısa Sync Kodu (LINTU3-...) ---------- */
  function packBitmaskHex(ids, map) {
    let hex = "";
    for (let i = 0; i < ids.length; i += 4) {
      let nibble = 0;
      for (let b = 0; b < 4; b++) {
        const id = ids[i + b];
        if (id && map && map[id]) {
          nibble |= (1 << b);
        }
      }
      hex += nibble.toString(16);
    }
    return hex;
  }

  function unpackBitmaskHex(hex, ids) {
    const out = {};
    const clean = String(hex || "").toLowerCase();
    for (let i = 0; i < ids.length; i += 4) {
      const nibble = parseInt(clean[i / 4] || "0", 16);
      if (Number.isNaN(nibble)) continue;
      for (let b = 0; b < 4; b++) {
        const id = ids[i + b];
        if (id && (nibble & (1 << b))) {
          out[id] = true;
        }
      }
    }
    return out;
  }

  function utf8ToBase64Url(str) {
    let b64 = "";
    if (typeof TextEncoder !== "undefined" && typeof btoa === "function") {
      const bytes = new TextEncoder().encode(str);
      let bin = "";
      bytes.forEach((b) => { bin += String.fromCharCode(b); });
      b64 = btoa(bin);
    } else if (typeof Buffer !== "undefined") {
      b64 = Buffer.from(str, "utf8").toString("base64");
    } else {
      b64 = btoa(unescape(encodeURIComponent(str)));
    }
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function base64UrlToUtf8(b64Url) {
    let b64 = String(b64Url || "").replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";
    if (typeof TextDecoder !== "undefined" && typeof atob === "function") {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.from(b64, "base64").toString("utf8");
    }
    return decodeURIComponent(escape(atob(b64)));
  }

  function encodeSyncCode(memberNameOverride) {
    const name = memberNameOverride && appState.members[memberNameOverride]
      ? memberNameOverride
      : appState.activeMember;
    const member = appState.members[name] || createEmptyMember("ortak");
    const compactDays = Object.entries(member.activityLog || {})
      .map(([dk, entry]) => [dk, getActivityCount(entry)])
      .filter(([, cnt]) => cnt > 0)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-90)
      .map(([dk, cnt]) => `${dk.replace(/-/g, "").slice(2)}:${cnt}`);
    const payload = {
      v: 3,
      n: name,
      r: member.role,
      s: appState.startMonth,
      t: packBitmaskHex(getTopicIds(), member.topics),
      w: packBitmaskHex(getWeekIds(), member.weeks),
      b: Object.keys(member.bookmarks || {}).filter((k) => member.bookmarks[k])
    };
    if (compactDays.length > 0) payload.a = compactDays;
    return "LINTU3-" + utf8ToBase64Url(JSON.stringify(payload));
  }

  function decodeSyncCode(code) {
    const trimmed = String(code || "").trim();
    if (!trimmed.startsWith("LINTU3-")) return null;
    try {
      const jsonStr = base64UrlToUtf8(trimmed.slice(7));
      const parsed = JSON.parse(jsonStr);
      if (!parsed || parsed.v !== 3 || typeof parsed.n !== "string") return null;
      const bookmarks = {};
      if (Array.isArray(parsed.b)) {
        parsed.b.forEach((id) => {
          if (id) bookmarks[String(id)] = true;
        });
      }
      const activityLog = {};
      if (Array.isArray(parsed.a)) {
        parsed.a.forEach((token) => {
          const m = /^(\d{2})(\d{2})(\d{2}):(\d+)$/.exec(String(token || ""));
          if (!m) return;
          const dk = `20${m[1]}-${m[2]}-${m[3]}`;
          const cnt = Math.max(0, Number(m[4]) || 0);
          if (cnt > 0) activityLog[dk] = { items: [], checkIns: cnt, note: "" };
        });
      }
      return {
        memberName: parsed.n.trim() || "Üye",
        role: ROLE_LABELS[parsed.r] ? parsed.r : "ortak",
        startMonth: parsed.s === "relative" || /^\d{4}-\d{2}$/.test(String(parsed.s || ""))
          ? String(parsed.s)
          : "2026-11",
        topics: unpackBitmaskHex(parsed.t, getTopicIds()),
        weeks: unpackBitmaskHex(parsed.w, getWeekIds()),
        bookmarks,
        activityLog
      };
    } catch (_) {
      return null;
    }
  }

  function applyDecodedSync(decoded) {
    if (!decoded) return false;
    appState.members[decoded.memberName] = {
      role: decoded.role,
      topics: decoded.topics,
      weeks: decoded.weeks,
      bookmarks: decoded.bookmarks,
      activityLog: cleanActivityLog(decoded.activityLog)
    };
    appState.activeMember = decoded.memberName;
    appState.startMonth = decoded.startMonth;
    saveState();
    return true;
  }

  function checkUrlSyncParam() {
    if (!HAS_WINDOW || !window.location || typeof URLSearchParams === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const syncCode = params.get("sync");
      if (!syncCode) return;
      const decoded = decodeSyncCode(syncCode);
      if (decoded && applyDecodedSync(decoded)) {
        showToast(`${decoded.memberName} ilerlemesi Sync bağlantısından yüklendi.`);
      }
      params.delete("sync");
      const qs = params.toString();
      const cleanUrl = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", cleanUrl);
      }
    } catch (_) {}
  }

  /* ---------- Günlük Çalışma Kaydı & Seri Hesaplayıcı ---------- */
  const TR_DAYS_FULL = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  function toLocalDateKey(dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseDateKey(dateKey) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey || ""));
    if (!m) return new Date();
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  function formatFullTurkishDate(dateKey) {
    const d = parseDateKey(dateKey);
    return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS_FULL[d.getDay()]}`;
  }

  function getActivityCount(entry) {
    if (!entry || typeof entry !== "object") return 0;
    const itemCount = Array.isArray(entry.items) ? entry.items.length : 0;
    const checkCount = Math.max(0, Math.floor(Number(entry.checkIns) || 0));
    return itemCount + checkCount;
  }

  function getActivityLevel(count) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  }

  function ensureDayEntry(member, dateKey) {
    if (!member.activityLog || typeof member.activityLog !== "object") {
      member.activityLog = {};
    }
    if (!member.activityLog[dateKey]) {
      member.activityLog[dateKey] = { items: [], checkIns: 0, note: "" };
    }
    return member.activityLog[dateKey];
  }

  function pruneDayEntry(member, dateKey) {
    if (!member.activityLog || !member.activityLog[dateKey]) return;
    const e = member.activityLog[dateKey];
    if ((!e.items || e.items.length === 0) && (!e.checkIns || e.checkIns <= 0) && !e.note) {
      delete member.activityLog[dateKey];
    }
  }

  function logItemCompletion(member, itemId, completed, dateOverride) {
    if (!member || !itemId) return;
    if (!member.activityLog || typeof member.activityLog !== "object") {
      member.activityLog = {};
    }
    const targetKey = dateOverride || toLocalDateKey(new Date());
    if (completed) {
      const entry = ensureDayEntry(member, targetKey);
      if (!entry.items.includes(itemId)) {
        entry.items.push(itemId);
      }
    } else {
      Object.keys(member.activityLog).forEach((dk) => {
        const entry = member.activityLog[dk];
        if (entry && Array.isArray(entry.items) && entry.items.includes(itemId)) {
          entry.items = entry.items.filter((x) => x !== itemId);
          pruneDayEntry(member, dk);
        }
      });
    }
  }

  function addManualStudyCheckIn(member, dateKey) {
    if (!member) return;
    const dk = dateKey || toLocalDateKey(new Date());
    const entry = ensureDayEntry(member, dk);
    entry.checkIns = (Number(entry.checkIns) || 0) + 1;
  }

  function clearDayActivity(member, dateKey) {
    if (!member || !member.activityLog || !dateKey) return;
    const entry = member.activityLog[dateKey];
    if (!entry) return;
    entry.checkIns = 0;
    entry.note = "";
    pruneDayEntry(member, dateKey);
  }

  function setDayNote(member, dateKey, noteText) {
    if (!member || !dateKey) return;
    const clean = String(noteText || "").trim().slice(0, 240);
    if (!clean && (!member.activityLog || !member.activityLog[dateKey])) return;
    const entry = ensureDayEntry(member, dateKey);
    entry.note = clean;
    pruneDayEntry(member, dateKey);
  }

  function resolveActivityLabel(itemId) {
    if (DATA && Array.isArray(DATA.LEVEL_GROUPS)) {
      for (const lvl of DATA.LEVEL_GROUPS) {
        const t = (lvl.topics || []).find((x) => x.id === itemId);
        if (t) return `${lvl.badge} · ${t.title}`;
      }
    }
    if (DATA && Array.isArray(DATA.ANNUAL_CALENDAR)) {
      for (const mo of DATA.ANNUAL_CALENDAR) {
        const w = (mo.weeks || []).find((x) => x.id === itemId);
        if (w) return `Ay ${mo.month} · Hafta ${w.week}: ${w.title}`;
      }
    }
    return itemId;
  }

  function computeStreakStats(activityLog, nowDate) {
    const log = activityLog && typeof activityLog === "object" ? activityLog : {};
    const activeKeys = Object.keys(log)
      .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k) && getActivityCount(log[k]) > 0)
      .sort();
    const activeSet = new Set(activeKeys);

    const today = nowDate instanceof Date ? new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()) : new Date();
    const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayPrefix = `${cleanToday.getFullYear()}-${String(cleanToday.getMonth() + 1).padStart(2, "0")}`;
    const thisMonthDays = activeKeys.filter((k) => k.startsWith(todayPrefix)).length;

    let currentStreak = 0;
    const cursor = new Date(cleanToday);
    if (!activeSet.has(toLocalDateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (activeSet.has(toLocalDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    let longestStreak = 0;
    let run = 0;
    let prevDate = null;
    activeKeys.forEach((dk) => {
      const cur = parseDateKey(dk);
      if (prevDate) {
        const diffDays = Math.round((cur - prevDate) / 86400000);
        run = diffDays === 1 ? run + 1 : 1;
      } else {
        run = 1;
      }
      if (run > longestStreak) longestStreak = run;
      prevDate = cur;
    });

    return {
      totalDays: activeKeys.length,
      thisMonthDays,
      currentStreak,
      longestStreak
    };
  }

  /* ---------- Takvim Ay Etiketi ---------- */
  function formatCalendarMonthLabel(monthIndex1Based, startMonth) {
    const idx = Math.max(1, Number(monthIndex1Based) || 1);
    const sm = startMonth !== undefined ? startMonth : appState.startMonth;
    if (!sm || sm === "relative" || !/^\d{4}-\d{2}$/.test(sm)) {
      return `Ay ${idx}`;
    }
    const [yStr, mStr] = sm.split("-");
    const baseYear = Number(yStr);
    const baseMonth = Number(mStr);
    if (!baseYear || baseMonth < 1 || baseMonth > 12) return `Ay ${idx}`;
    const totalMonths = baseYear * 12 + (baseMonth - 1) + (idx - 1);
    const targetYear = Math.floor(totalMonths / 12);
    const targetMonth = totalMonths % 12;
    return `${TR_MONTHS[targetMonth]} ${targetYear}`;
  }

  /* ---------- Toast & Pano Kopyalama ---------- */
  function showToast(message) {
    const container = $("toastContainer");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3200);
  }

  function copyText(text, successMsg) {
    if (!text) return;
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(successMsg || "Panoya kopyalandı."))
        .catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    if (!HAS_DOC) return;
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(successMsg || "Panoya kopyalandı.");
    } catch (_) {
      showToast("Kopyalama başarısız; metni elle seçebilirsiniz.");
    }
    ta.remove();
  }

  /* ---------- Tema ---------- */
  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    if (HAS_DOC) {
      document.documentElement.setAttribute("data-theme", next);
    }
    if (typeof localStorage !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY_THEME, next); } catch (_) {}
    }
    const btn = $("themeToggle");
    if (btn) {
      btn.textContent = next === "dark" ? "☀️ Aydınlık Tema" : "🌙 Koyu Tema";
    }
  }

  function initTheme() {
    let saved = "light";
    if (typeof localStorage !== "undefined") {
      try {
        saved = localStorage.getItem(STORAGE_KEY_THEME) || "light";
      } catch (_) {}
    }
    applyTheme(saved);
  }

  /* ---------- Sekme & Alt Sekme Navigasyonu ---------- */
  function switchTab(tabId) {
    if (!TAB_TITLES[tabId]) return;
    currentTabId = tabId;

    if (HAS_DOC) {
      document.querySelectorAll(".nav-btn[data-tab]").forEach((btn) => {
        const active = btn.getAttribute("data-tab") === tabId;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === `tab-${tabId}`);
      });

      const titleEl = $("topbarTitle");
      if (titleEl) titleEl.textContent = TAB_TITLES[tabId];

      // Mobil menüyü kapat
      const sidebar = $("sidebar");
      const backdrop = $("sidebarBackdrop");
      if (sidebar) sidebar.classList.remove("open");
      if (backdrop) backdrop.classList.remove("open");
    }

    updateMascotTip(tabId);
  }

  function switchSubtab(group, subtabId) {
    if (!HAS_DOC) return;
    document.querySelectorAll(`[data-subtab-group="${group}"][data-subtab]`).forEach((btn) => {
      const isMatch = btn.getAttribute("data-subtab") === subtabId;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    const container = document.querySelectorAll(`.sub-panel[data-subtab-group="${group}"], #tab-${group} .sub-panel`);
    container.forEach((panel) => {
      const isMatch = panel.id === subtabId;
      panel.classList.toggle("active", isMatch);
      if (isMatch) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  }

  function updateMascotTip(tabId) {
    const tipEl = $("mascotTipText");
    if (!tipEl || !DATA || !DATA.MASCOT_TAB_TIPS) return;
    tipEl.textContent = DATA.MASCOT_TAB_TIPS[tabId] || DATA.MASCOT_TAB_TIPS.baslangic || "";
  }

  /* ---------- İlerleme Özeti & Sayıcılar ---------- */
  function getProgressMetrics() {
    const member = getActiveMember();
    const topicIds = getTopicIds();
    const weekIds = getWeekIds();
    const doneTopics = topicIds.filter((id) => Boolean(member.topics[id])).length;
    const doneWeeks = weekIds.filter((id) => Boolean(member.weeks[id])).length;
    const totalItems = topicIds.length + weekIds.length;
    const doneTotal = doneTopics + doneWeeks;
    const pct = totalItems > 0 ? Math.round((doneTotal / totalItems) * 100) : 0;
    return {
      doneTopics,
      totalTopics: topicIds.length,
      doneWeeks,
      totalWeeks: weekIds.length,
      pct
    };
  }

  function updateHeaderAndSidebarProgress() {
    const m = getProgressMetrics();
    const member = getActiveMember();

    const setTxt = (id, val) => {
      const el = $(id);
      if (el) el.textContent = val;
    };

    setTxt("navCountLevels", `${m.doneTopics}/${m.totalTopics}`);
    setTxt("navCountCalendar", `${m.doneWeeks}/${m.totalWeeks}`);
    setTxt("navCountTimeline", DATA && DATA.TIMELINE_ITEMS ? String(DATA.TIMELINE_ITEMS.length) : "82");
    setTxt("navCountLibrary", DATA && DATA.ALL_RESOURCES ? String(DATA.ALL_RESOURCES.length) : "143");

    setTxt("sidebarMemberLabel", `${appState.activeMember} · ${ROLE_LABELS[member.role] || member.role}`);
    setTxt("sidebarProgressPct", `%${m.pct}`);
    const bar = $("sidebarProgressBar");
    if (bar) bar.style.width = `${m.pct}%`;

    setTxt("heroLevelProgress", `${m.doneTopics}/${m.totalTopics}`);
    setTxt("heroCalendarProgress", `${m.doneWeeks}/${m.totalWeeks}`);
    setTxt("heroResourceCount", DATA && DATA.ALL_RESOURCES ? String(DATA.ALL_RESOURCES.length) : "143");
  }

  /* ---------- 0. Başlangıç Sekmesi ---------- */
  function renderBeginnerSection() {
    if (!DATA || !DATA.BEGINNER_GUIDE) return;
    const bg = DATA.BEGINNER_GUIDE;

    const sevenGrid = $("sevenDayPlanGrid");
    if (sevenGrid) {
      sevenGrid.innerHTML = (bg.sevenDayPlan || []).map((d) => `
        <article class="card">
          <div class="card-head">
            <span class="badge badge-brand">${escapeHtml(d.day)}</span>
          </div>
          <h4 class="card-title">${escapeHtml(d.title)}</h4>
          <p class="small muted">${escapeHtml(d.goal)}</p>
          <ul class="clean-list small">
            ${(d.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
          </ul>
        </article>
      `).join("");
    }

    const helpGrid = $("helpChannelsGrid");
    if (helpGrid) {
      helpGrid.innerHTML = (bg.helpChannels || []).map((h) => `
        <article class="card">
          <div class="card-head">
            <span class="badge">${escapeHtml(h.tag)}</span>
          </div>
          <h4 class="card-title">${escapeHtml(h.name)}</h4>
          <p class="small">${escapeHtml(h.when)}</p>
          <div class="card-foot">
            <span></span>
            <a class="btn btn-primary btn-xs" href="${escapeHtml(h.url)}" target="_blank" rel="noopener noreferrer">Kanala Git ↗</a>
          </div>
        </article>
      `).join("");
    }

    const emailEl = $("advisorEmailText");
    if (emailEl) {
      emailEl.textContent = bg.advisorEmailTemplate || "";
    }

    const realityGrid = $("realityGrid");
    if (realityGrid && Array.isArray(DATA.REALITY_BENCHMARKS)) {
      realityGrid.innerHTML = DATA.REALITY_BENCHMARKS.map((r) => `
        <article class="card">
          <div class="card-head">
            <span class="badge ${r.verdictType === "warn" ? "badge-warn" : "badge-ok"}">${escapeHtml(r.verdict)}</span>
            <span class="small muted">${escapeHtml(r.metric)}</span>
          </div>
          <h4 class="card-title">${escapeHtml(r.title)}</h4>
          <p class="small">${escapeHtml(r.summary)}</p>
          <div class="where-used-box small"><strong>Çıkarım:</strong> ${escapeHtml(r.takeaway)}</div>
          <div class="card-foot">
            <span class="small muted">${escapeHtml(r.sourceLabel)}</span>
            <a class="btn btn-xs" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Kaynak ↗</a>
          </div>
        </article>
      `).join("");
    }

    renderGlossary();
  }

  function renderGlossary() {
    if (!DATA || !DATA.BEGINNER_GUIDE) return;
    const grid = $("glossaryGrid");
    if (!grid) return;
    const q = ($("glossarySearch") ? $("glossarySearch").value : "").trim().toLowerCase();
    const list = (DATA.BEGINNER_GUIDE.glossary || []).filter((g) => {
      if (!q) return true;
      return `${g.term} ${g.plain} ${g.analogy} ${g.module}`.toLowerCase().includes(q);
    });
    const badge = $("glossaryCountBadge");
    if (badge) badge.textContent = `${list.length} terim`;

    grid.innerHTML = list.map((g) => `
      <article class="card">
        <div class="card-head">
          <h4 class="card-title">${escapeHtml(g.term)}</h4>
          <span class="badge">${escapeHtml(g.module)}</span>
        </div>
        <p class="small">${escapeHtml(g.plain)}</p>
        <div class="where-used-box small"><strong>Günlük Benzetme:</strong> ${escapeHtml(g.analogy)}</div>
      </article>
    `).join("");
  }

  /* ---------- 1. Seviyeler & Müfredat ---------- */
  function renderLevelsTab() {
    if (!DATA || !Array.isArray(DATA.LEVEL_GROUPS)) return;
    const member = getActiveMember();
    const resMap = getResourceMap();
    const modUse = DATA.MODULE_USE_CASES || {};
    const roleFilter = $("levelRoleFilter") ? $("levelRoleFilter").value : "all";

    const stepper = $("levelStepper");
    if (stepper) {
      const allBtn = `<button type="button" class="level-pill ${activeLevelId === "all" ? "active" : ""}" data-level-id="all">Tüm Seviyeler</button>`;
      const lvlBtns = DATA.LEVEL_GROUPS.map((lvl) => {
        const done = (lvl.topics || []).filter((t) => member.topics[t.id]).length;
        const total = (lvl.topics || []).length;
        return `
          <button type="button" class="level-pill ${activeLevelId === lvl.id ? "active" : ""}" data-level-id="${escapeHtml(lvl.id)}">
            <span>${escapeHtml(lvl.badge)}</span>
            <strong>${done}/${total}</strong>
          </button>
        `;
      }).join("");
      stepper.innerHTML = allBtn + lvlBtns;
    }

    const m = getProgressMetrics();
    const summaryBar = $("levelSummaryBar");
    if (summaryBar) {
      summaryBar.innerHTML = `
        <span><strong>${m.doneTopics} / ${m.totalTopics}</strong> konu tamamlandı</span>
        <span class="muted">·</span>
        <span>Rol filtresi: <strong>${escapeHtml(roleFilter === "all" ? "Tümü" : (ROLE_LABELS[roleFilter] || roleFilter))}</strong></span>
      `;
    }

    const container = $("levelsContainer");
    if (!container) return;

    const visibleLevels = DATA.LEVEL_GROUPS.filter((lvl) => activeLevelId === "all" || lvl.id === activeLevelId);
    container.innerHTML = visibleLevels.map((lvl) => {
      const topics = (lvl.topics || []).filter((t) => {
        if (roleFilter === "all") return true;
        return Array.isArray(t.roles) && (t.roles.includes(roleFilter) || t.roles.includes("ortak"));
      });
      const doneInLevel = (lvl.topics || []).filter((t) => member.topics[t.id]).length;
      const modCards = (lvl.moduleIds || []).map((mid) => {
        const uc = modUse[mid];
        return uc
          ? `<span class="badge" title="${escapeHtml(uc.whereUsed)}">${escapeHtml(mid.toUpperCase())}: ${escapeHtml((uc.realProducts || []).slice(0, 2).join(", "))}</span>`
          : `<span class="badge">${escapeHtml(mid.toUpperCase())}</span>`;
      }).join(" ");

      return `
        <section class="card level-section" data-level-block="${escapeHtml(lvl.id)}">
          <div class="card-head">
            <div>
              <span class="badge badge-brand">${escapeHtml(lvl.badge)} · ${escapeHtml(lvl.duration)}</span>
              <h3 style="margin:6px 0 4px;">${escapeHtml(lvl.title)}</h3>
              <p class="small muted">${escapeHtml(lvl.subtitle || "")}</p>
            </div>
            <span class="badge badge-ok">${doneInLevel}/${(lvl.topics || []).length} Tamam</span>
          </div>
          <div class="small" style="margin-bottom:10px;">
            <strong>Ön Koşul:</strong> ${escapeHtml(lvl.prerequisites)} ·
            <strong>Bitirme Çıktısı:</strong> ${escapeHtml(lvl.capstone)}
          </div>
          <div class="where-used-box small">
            <strong>Nerede İşe Yarar?</strong> ${escapeHtml(lvl.whereUsedOverall)}
            <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">${modCards}</div>
          </div>
          <div class="topics-grid" style="margin-top:12px;">
            ${topics.map((t) => {
              const isDone = Boolean(member.topics[t.id]);
              const links = (t.resourceIds || []).map((rid) => {
                const r = resMap[rid];
                if (!r) return "";
                return `<a class="btn btn-xs" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)} ↗</a>`;
              }).join("");
              return `
                <article class="topic-card ${isDone ? "done" : ""}">
                  <div class="card-head">
                    <h4 class="card-title">${escapeHtml(t.title)}</h4>
                    <button type="button" class="check-btn ${isDone ? "done" : ""}" data-topic-id="${escapeHtml(t.id)}" aria-pressed="${isDone}">
                      ${isDone ? "✓ Tamamlandı" : "○ İşaretle"}
                    </button>
                  </div>
                  <p class="small">${escapeHtml(t.summary)}</p>
                  <div style="display:flex; flex-wrap:wrap; gap:6px; margin:8px 0;">
                    ${(t.concepts || []).map((c) => `<span class="badge">${escapeHtml(c)}</span>`).join("")}
                  </div>
                  <p class="small"><strong>Pratik Görev:</strong> ${escapeHtml(t.practice)}</p>
                  <div class="where-used-box small"><strong>Nerede İşe Yarar?</strong> ${escapeHtml(t.whereUsed)}</div>
                  <div class="card-foot" style="margin-top:8px; flex-wrap:wrap; gap:6px;">
                    <div style="display:flex; flex-wrap:wrap; gap:4px;">
                      ${(t.roles || []).map((r) => `<span class="badge badge-role">${escapeHtml(ROLE_LABELS[r] || r)}</span>`).join("")}
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">${links}</div>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </section>
      `;
    }).join("");
  }

  /* ---------- 2. 12 Aylık Yıllık, Aylık & Kişisel İlerleyiş Takvimi ---------- */
  function renderCalendarTab() {
    if (!DATA || !Array.isArray(DATA.ANNUAL_CALENDAR)) return;
    const member = getActiveMember();
    const startSelect = $("calStartMonthSelect");
    if (startSelect && startSelect.value !== appState.startMonth) {
      startSelect.value = appState.startMonth;
    }

    const annualView = $("calAnnualView");
    const monthlyView = $("calMonthlyView");
    const personalView = $("calPersonalView");
    const annualBtn = $("calViewAnnualBtn");
    const monthlyBtn = $("calViewMonthlyBtn");
    const personalBtn = $("calViewPersonalBtn");

    if (annualView) {
      if (calViewMode === "annual") annualView.removeAttribute("hidden");
      else annualView.setAttribute("hidden", "");
    }
    if (monthlyView) {
      if (calViewMode === "monthly") monthlyView.removeAttribute("hidden");
      else monthlyView.setAttribute("hidden", "");
    }
    if (personalView) {
      if (calViewMode === "personal") personalView.removeAttribute("hidden");
      else personalView.setAttribute("hidden", "");
    }

    if (annualBtn) annualBtn.classList.toggle("active", calViewMode === "annual");
    if (monthlyBtn) monthlyBtn.classList.toggle("active", calViewMode === "monthly");
    if (personalBtn) personalBtn.classList.toggle("active", calViewMode === "personal");

    const mStats = getProgressMetrics();
    const summaryEl = $("calProgressSummary");
    if (summaryEl) {
      summaryEl.innerHTML = `<strong>${mStats.doneWeeks}/${mStats.totalWeeks}</strong> hafta tamamlandı · Başlangıç: <strong>${escapeHtml(formatCalendarMonthLabel(1, appState.startMonth))}</strong>`;
    }

    renderAnnualCalendarGrid(member);
    renderMonthlyCalendarDetail(member);
    renderPersonalCalendar(member);
  }

  function renderAnnualCalendarGrid(member) {
    const grid = $("annualCalendarGrid");
    if (!grid || !DATA) return;

    const quarters = {};
    DATA.ANNUAL_CALENDAR.forEach((m) => {
      if (!quarters[m.quarter]) {
        quarters[m.quarter] = { title: m.quarterTitle || m.quarter, months: [] };
      }
      quarters[m.quarter].months.push(m);
    });

    grid.innerHTML = Object.entries(quarters).map(([qKey, qData]) => `
      <div class="quarter-section">
        <h3 style="margin-bottom:10px;">${escapeHtml(qKey)} — ${escapeHtml(qData.title)}</h3>
        <div class="annual-grid">
          ${qData.months.map((m) => {
            const doneW = (m.weeks || []).filter((w) => member.weeks[w.id]).length;
            const totalW = (m.weeks || []).length;
            const calLabel = formatCalendarMonthLabel(m.month, appState.startMonth);
            return `
              <article class="card month-card ${doneW === totalW && totalW > 0 ? "done" : ""}" data-cal-month="${m.month}" tabindex="0" role="button">
                <div class="card-head">
                  <span class="badge badge-brand">${escapeHtml(calLabel)}</span>
                  <span class="badge ${doneW === totalW ? "badge-ok" : ""}">${doneW}/${totalW} hafta</span>
                </div>
                <h4 class="card-title">${escapeHtml(m.title)}</h4>
                <p class="small muted">${escapeHtml(m.levelLabel)} · ${escapeHtml(m.hoursPerWeek)} · ${escapeHtml(m.computeStage)}</p>
                <p class="small"><strong>Çıktı:</strong> ${escapeHtml(m.deliverable)}</p>
                <div class="where-used-box small"><strong>Nerede İşe Yarar?</strong> ${escapeHtml(m.whereUsed)}</div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `).join("");
  }

  function renderMonthlyCalendarDetail(member) {
    const pillsEl = $("calMonthPills");
    const detailEl = $("calMonthDetail");
    if (!DATA || !detailEl) return;

    if (pillsEl) {
      pillsEl.innerHTML = DATA.ANNUAL_CALENDAR.map((m) => {
        const doneW = (m.weeks || []).filter((w) => member.weeks[w.id]).length;
        const label = formatCalendarMonthLabel(m.month, appState.startMonth);
        return `
          <button type="button" class="level-pill ${selectedCalMonth === m.month ? "active" : ""}" data-select-month="${m.month}">
            ${escapeHtml(label)} (${doneW}/${(m.weeks || []).length})
          </button>
        `;
      }).join("");
    }

    const monthObj = DATA.ANNUAL_CALENDAR.find((m) => m.month === selectedCalMonth) || DATA.ANNUAL_CALENDAR[0];
    if (!monthObj) return;

    const resMap = getResourceMap();
    const calLabel = formatCalendarMonthLabel(monthObj.month, appState.startMonth);
    const teamFocus = monthObj.teamFocus || {};

    detailEl.innerHTML = `
      <div class="card">
        <div class="card-head">
          <div>
            <span class="badge badge-brand">${escapeHtml(calLabel)} · ${escapeHtml(monthObj.quarter)} · ${escapeHtml(monthObj.levelLabel)}</span>
            <h3 style="margin:6px 0 4px;">${escapeHtml(monthObj.title)}</h3>
            <p class="small">${escapeHtml(monthObj.summary)}</p>
          </div>
          <span class="badge">${escapeHtml(monthObj.hoursPerWeek)} · ${escapeHtml(monthObj.computeStage)}</span>
        </div>
        <p class="small"><strong>Ay Sonu Teslimatı:</strong> ${escapeHtml(monthObj.deliverable)}</p>
        <div class="where-used-box small"><strong>Nerede İşe Yarar?</strong> ${escapeHtml(monthObj.whereUsed)}</div>

        <h4 style="margin:14px 0 8px;">5 Kişilik Ekip Odakları</h4>
        <div class="team-focus-grid">
          ${Object.entries(teamFocus).map(([roleKey, focusText]) => `
            <div class="card" style="padding:10px;">
              <span class="badge badge-role">${escapeHtml(ROLE_LABELS[roleKey] || roleKey)}</span>
              <p class="small" style="margin-top:6px;">${escapeHtml(focusText)}</p>
            </div>
          `).join("")}
        </div>

        <h4 style="margin:16px 0 8px;">Haftalık Plan (4 Hafta)</h4>
        <div class="week-grid">
          ${(monthObj.weeks || []).map((w) => {
            const isDone = Boolean(member.weeks[w.id]);
            const links = (w.resourceIds || []).map((rid) => {
              const r = resMap[rid];
              return r ? `<a class="btn btn-xs" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)} ↗</a>` : "";
            }).join("");
            return `
              <article class="week-card ${isDone ? "done" : ""}">
                <div class="card-head">
                  <span class="badge">Hafta ${w.week}</span>
                  <button type="button" class="check-btn ${isDone ? "done" : ""}" data-week-id="${escapeHtml(w.id)}" aria-pressed="${isDone}">
                    ${isDone ? "✓ Tamamlandı" : "○ İşaretle"}
                  </button>
                </div>
                <h5 style="margin:6px 0;">${escapeHtml(w.title)}</h5>
                <ul class="clean-list small">
                  ${(w.tasks || []).map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
                </ul>
                <div class="where-used-box small"><strong>Nerede İşe Yarar?</strong> ${escapeHtml(w.whereUsed)}</div>
                ${links ? `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">${links}</div>` : ""}
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderPersonalCalendar(member) {
    const todayKey = toLocalDateKey(new Date());
    const stats = computeStreakStats(member.activityLog);

    const statsEl = $("personalCalStats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-pill"><span>Aktif Seri</span><strong>${stats.currentStreak} gün</strong></div>
        <div class="stat-pill"><span>En Uzun Seri</span><strong>${stats.longestStreak} gün</strong></div>
        <div class="stat-pill"><span>Toplam Aktif</span><strong>${stats.totalDays} gün</strong></div>
        <div class="stat-pill"><span>Bu Ay</span><strong>${stats.thisMonthDays} gün</strong></div>
      `;
    }

    renderPersonalMonthGrid(member, todayKey);
    renderPersonalDayDetail(member, todayKey);
    renderHeatmapGrid($("personalHeatmap"), member.activityLog || {}, 52, false, selectedPersonalDate);
  }

  function renderPersonalMonthGrid(member, todayKey) {
    const titleEl = $("personalMonthTitle");
    if (titleEl) {
      titleEl.textContent = `${TR_MONTHS[personalViewMonth]} ${personalViewYear}`;
    }
    const grid = $("personalMonthGrid");
    if (!grid) return;

    const firstDay = new Date(personalViewYear, personalViewMonth, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(personalViewYear, personalViewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    const log = member.activityLog || {};

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      const cellDate = new Date(personalViewYear, personalViewMonth, 1 - offset + i);
      const dk = toLocalDateKey(cellDate);
      const inMonth = cellDate.getMonth() === personalViewMonth;
      const cnt = getActivityCount(log[dk]);
      const lvl = getActivityLevel(cnt);
      const classes = [
        "cal-day-cell",
        `lvl-${lvl}`,
        inMonth ? "" : "other-month",
        dk === todayKey ? "today" : "",
        dk === selectedPersonalDate ? "selected" : ""
      ].filter(Boolean).join(" ");

      cells.push(`
        <button type="button" class="${classes}" data-personal-day="${dk}" aria-label="${escapeHtml(formatFullTurkishDate(dk))}: ${cnt} etkinlik">
          <span class="cal-day-num">${cellDate.getDate()}</span>
          ${cnt > 0 ? `<span class="cal-day-count">${cnt}</span>` : ""}
        </button>
      `);
    }
    grid.innerHTML = cells.join("");
  }

  function renderPersonalDayDetail(member, todayKey) {
    const detailEl = $("personalDayDetail");
    if (!detailEl) return;
    const dk = selectedPersonalDate || todayKey;
    const entry = (member.activityLog && member.activityLog[dk]) || { items: [], checkIns: 0, note: "" };
    const cnt = getActivityCount(entry);
    const items = Array.isArray(entry.items) ? entry.items : [];

    detailEl.innerHTML = `
      <div class="card-head">
        <div>
          <span class="badge ${dk === todayKey ? "badge-brand" : ""}">${dk === todayKey ? "Bugün" : "Seçili Gün"}</span>
          <h4 class="card-title" style="margin:6px 0 2px;">${escapeHtml(formatFullTurkishDate(dk))}</h4>
          <p class="small muted">${cnt > 0 ? `Toplam ${cnt} çalışma etkinliği kayıtlı.` : "Bu gün için henüz çalışma kaydı yok."}</p>
        </div>
      </div>

      <div class="inline-row" style="margin:10px 0 12px;">
        <button type="button" class="btn btn-primary btn-xs" data-day-action="add" data-day-key="${escapeHtml(dk)}">+1 Çalışma Ekle</button>
        <button type="button" class="btn btn-xs" data-day-action="clear" data-day-key="${escapeHtml(dk)}">Manuel Kaydı Temizle</button>
      </div>

      <div style="margin-bottom:12px;">
        <div class="small"><strong>Tamamlanan Konu &amp; Haftalar:</strong></div>
        ${items.length > 0
          ? `<ul class="clean-list small" style="margin-top:4px;">${items.map((id) => `<li>${escapeHtml(resolveActivityLabel(id))}</li>`).join("")}</ul>`
          : `<p class="small muted" style="margin:4px 0 0;">Konu veya hafta işaretlediğinde otomatik buraya eklenir.</p>`}
        ${entry.checkIns > 0
          ? `<p class="small" style="margin:6px 0 0;"><strong>Manuel Çalışma Sayısı:</strong> ${entry.checkIns} oturum</p>`
          : ""}
      </div>

      <div>
        <div class="small"><strong>Günlük Kısa Not:</strong></div>
        <div class="inline-row mt-sm">
          <input data-day-note-input class="input full-width" type="text" maxlength="240" value="${escapeHtml(entry.note || "")}" placeholder="Bugün neye odaklandın? (isteğe bağlı)" aria-label="Günlük kısa not" />
          <button class="btn btn-xs" type="button" data-save-day-note="${escapeHtml(dk)}">Notu Kaydet</button>
        </div>
      </div>
    `;
  }

  function renderHeatmapGrid(containerEl, activityLog, weeksCount, miniMode, selectedDate) {
    if (!containerEl) return;
    const now = new Date();
    const cleanToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayWeekday = (cleanToday.getDay() + 6) % 7;
    const curMonday = new Date(cleanToday);
    curMonday.setDate(curMonday.getDate() - todayWeekday);

    const startDate = new Date(curMonday);
    startDate.setDate(startDate.getDate() - (weeksCount - 1) * 7);
    const totalDays = (weeksCount - 1) * 7 + todayWeekday + 1;

    const monthLabels = [];
    let lastLabelMonth = -1;
    for (let w = 0; w < weeksCount; w++) {
      const colDate = new Date(startDate);
      colDate.setDate(startDate.getDate() + w * 7);
      const m = colDate.getMonth();
      if (m !== lastLabelMonth && w % 4 === 0) {
        monthLabels.push(TR_MONTHS[m].slice(0, 3));
        lastLabelMonth = m;
      }
    }

    const cells = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dk = toLocalDateKey(d);
      const cnt = getActivityCount(activityLog[dk]);
      const lvl = getActivityLevel(cnt);
      const isSelected = selectedDate && dk === selectedDate;
      cells.push(`<button type="button" class="heatmap-cell lvl-${lvl}${isSelected ? " selected" : ""}" data-personal-day="${dk}" title="${escapeHtml(formatFullTurkishDate(dk))}: ${cnt} etkinlik"></button>`);
    }

    const monthsBar = !miniMode
      ? `<div class="heatmap-months-row">${monthLabels.map((lbl) => `<span>${escapeHtml(lbl)}</span>`).join("")}</div>`
      : "";

    containerEl.innerHTML = `${monthsBar}<div class="heatmap-grid${miniMode ? " mini" : ""}">${cells.join("")}</div>`;
  }

  function renderModalMiniHeatmap(member) {
    const wrap = $("modalMiniHeatmap");
    if (!wrap) return;
    renderHeatmapGrid(wrap, (member && member.activityLog) || {}, 12, true, null);
  }

  /* ---------- 3. Tarih & Olay Örgüsü ---------- */
  function renderHistoryTab() {
    if (!DATA) return;
    const storySection = $("storyArcSection");
    const listSection = $("timelineListSection");
    const storyBtn = $("histModeStoryBtn");
    const listBtn = $("histModeListBtn");

    if (storySection && listSection) {
      if (histViewMode === "story") {
        storySection.removeAttribute("hidden");
        listSection.setAttribute("hidden", "");
      } else {
        storySection.setAttribute("hidden", "");
        listSection.removeAttribute("hidden");
      }
    }
    if (storyBtn) storyBtn.classList.toggle("active", histViewMode === "story");
    if (listBtn) listBtn.classList.toggle("active", histViewMode === "list");

    const arcsGrid = $("storyArcsGrid");
    if (arcsGrid && Array.isArray(DATA.STORY_ARCS)) {
      const arcUse = DATA.STORY_ARC_USE_CASES || {};
      arcsGrid.innerHTML = DATA.STORY_ARCS.map((arc) => `
        <article class="card">
          <div class="card-head">
            <span class="badge badge-brand">${escapeHtml(arc.act)}</span>
          </div>
          <h4 class="card-title">${escapeHtml(arc.title)}</h4>
          <p class="small"><strong>Sahne:</strong> ${escapeHtml(arc.scene)}</p>
          <p class="small"><strong>Çarpılan Duvar:</strong> ${escapeHtml(arc.wall)}</p>
          <p class="small"><strong>Kırılma Anı:</strong> ${escapeHtml(arc.breakthrough)}</p>
          <p class="small muted"><strong>Sonraki Köprü:</strong> ${escapeHtml(arc.bridge)}</p>
          ${arcUse[arc.id] ? `<div class="where-used-box small"><strong>Bugün Nerede İşe Yarar?</strong> ${escapeHtml(arcUse[arc.id])}</div>` : ""}
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
            ${(arc.paperIds || []).map((pid) => `<button type="button" class="btn btn-xs" data-jump-paper="${escapeHtml(pid)}">${escapeHtml(pid)} →</button>`).join("")}
          </div>
        </article>
      `).join("");
    }

    const synGrid = $("historySynthesisGrid");
    if (synGrid && Array.isArray(DATA.HISTORY_SYNTHESIS)) {
      synGrid.innerHTML = DATA.HISTORY_SYNTHESIS.map((s) => `
        <article class="card">
          <span class="badge">${escapeHtml(s.credibilityType)}</span>
          <h4 class="card-title" style="margin-top:6px;">${escapeHtml(s.title)}</h4>
          <p class="small muted">${escapeHtml(s.author)} · ${escapeHtml(s.venue)}</p>
          <p class="small">${escapeHtml(s.note)}</p>
          <div class="card-foot">
            <span></span>
            <a class="btn btn-xs btn-primary" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>
          </div>
        </article>
      `).join("");
    }

    renderTimelineList();
  }

  function renderTimelineList() {
    const listEl = $("timelineList");
    if (!listEl || !DATA || !Array.isArray(DATA.TIMELINE_ITEMS)) return;

    const q = ($("timelineSearch") ? $("timelineSearch").value : "").trim().toLowerCase();
    const era = $("timelineEraFilter") ? $("timelineEraFilter").value : "all";
    const role = $("timelineRoleFilter") ? $("timelineRoleFilter").value : "all";

    const filtered = DATA.TIMELINE_ITEMS.filter((item) => {
      if (era !== "all" && item.era !== era) return false;
      if (role !== "all" && !(item.roles || []).includes(role)) return false;
      if (q) {
        const hay = `${item.id} ${item.year} ${item.title} ${item.authors} ${item.whyItMatters} ${item.whatYouLearn}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const badge = $("timelineCountBadge");
    if (badge) badge.textContent = `${filtered.length} makale`;

    listEl.innerHTML = filtered.map((item) => `
      <article class="card" id="timeline-${escapeHtml(item.id)}">
        <div class="card-head">
          <div>
            <span class="badge badge-brand">${escapeHtml(item.year)}</span>
            <span class="badge">${escapeHtml(item.credibilityType)}</span>
          </div>
          <span class="small muted">${escapeHtml(item.venue)}</span>
        </div>
        <h4 class="card-title" style="margin-top:6px;">${escapeHtml(item.title)}</h4>
        <p class="small muted">${escapeHtml(item.authors)}</p>
        <p class="small"><strong>Neden Önemli?</strong> ${escapeHtml(item.whyItMatters)}</p>
        <p class="small"><strong>Ne Öğrenirsin?</strong> ${escapeHtml(item.whatYouLearn)}</p>
        <div class="card-foot">
          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${(item.roles || []).map((r) => `<span class="badge badge-role">${escapeHtml(ROLE_LABELS[r] || r)}</span>`).join("")}
          </div>
          <a class="btn btn-xs btn-primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Makale ↗</a>
        </div>
      </article>
    `).join("");
  }

  /* ---------- 4. Araçlar: VRAM & Chinchilla Hesaplayıcıları (v2 Formülleri Korundu) ---------- */
  function applyVramPreset(presetKey) {
    const preset = VRAM_PRESETS[presetKey];
    if (!preset || !HAS_DOC) return;
    const setVal = (id, val) => { const el = $(id); if (el) el.value = String(val); };
    const setChk = (id, val) => { const el = $(id); if (el) el.checked = Boolean(val); };
    setVal("vramParamsM", preset.paramsM);
    setVal("vramMode", preset.mode);
    setVal("vramBatch", preset.batch);
    setVal("vramSeq", preset.seq);
    setVal("vramHidden", preset.hidden);
    setVal("vramLayers", preset.layers);
    setChk("vramGradCkpt", preset.gradCkpt);
    setChk("vramUnsloth", preset.unsloth);
    updateVramCalc();
  }

  function updateVramCalc() {
    if (!HAS_DOC || !$("vramParamsM")) return;
    const paramsM = Number($("vramParamsM").value) || 124;
    const mode = $("vramMode").value;
    const batch = Math.max(1, Number($("vramBatch").value) || 1);
    const seq = Math.max(64, Number($("vramSeq").value) || 512);
    const hidden = Math.max(64, Number($("vramHidden").value) || 768);
    const layers = Math.max(1, Number($("vramLayers").value) || 12);
    const gradCkpt = $("vramGradCkpt").checked;
    const unsloth = $("vramUnsloth").checked;

    $("vramParamsLabel").textContent = `${paramsM >= 1000 ? (paramsM / 1000).toFixed(2) + " B" : paramsM + " M"}`;

    const N = paramsM * 1e6;
    const GIB = 1024 ** 3;
    let staticBytes = 0;
    let elemBytes = 2;
    let breakdown = "";

    if (mode === "mixed") {
      staticBytes = 16 * N;
      elemBytes = 2;
      breakdown = "Mixed Precision (BF16/FP16) + AdamW: 2N ağırlık + 2N gradyan + 12N FP32 (master + m + v) = 16N bayt.";
    } else if (mode === "fp32") {
      staticBytes = 16 * N;
      elemBytes = 4;
      breakdown = "Tam FP32 + AdamW: 4N ağırlık + 4N gradyan + 8N AdamW (m + v) = 16N bayt + daha büyük FP32 aktivasyonlar.";
    } else {
      staticBytes = 0.5 * N + 0.015 * N * 16;
      elemBytes = 2;
      breakdown = "4-bit QLoRA: ~0.5N (4-bit dondurulmuş taban) + %1.5 eğitilebilir LoRA adaptörü × 16 bayt (AdamW).";
    }

    let actBytes = 12 * batch * seq * hidden * layers * elemBytes;
    if (gradCkpt) actBytes *= 0.30;
    if (mode === "qlora" && unsloth) actBytes *= 0.45;
    const cudaOverheadGb = 0.8;

    const staticGb = staticBytes / GIB;
    const actGb = actBytes / GIB + cudaOverheadGb;
    const totalGb = staticGb + actGb;

    $("vramStaticGb").textContent = `${staticGb.toFixed(2)} GB`;
    $("vramActGb").textContent = `${actGb.toFixed(2)} GB`;
    $("vramTotalGb").textContent = `${totalGb.toFixed(2)} GB`;
    $("vramBreakdownText").textContent = breakdown;

    const gpus = [
      { name: "Colab Free T4 (15 GB)", cap: 15 },
      { name: "Kaggle P100 (16 GB)", cap: 16 },
      { name: "RTX 3090 / 4090 (24 GB)", cap: 24 },
      { name: "Kaggle 2×T4 (32 GB — DDP/Model Split)", cap: 32 },
      { name: "A100 / H100 (80 GB)", cap: 80 }
    ];

    $("vramGpuCompat").innerHTML = gpus.map((g) => {
      const fits = totalGb <= g.cap * 0.92;
      return `<span class="gpu-pill ${fits ? "ok" : "no"}">${fits ? "✓ Sığar" : "✕ Aşar"} • ${escapeHtml(g.name)}</span>`;
    }).join("");
  }

  function updateChinchillaCalc() {
    if (!HAS_DOC || !$("chParamsM")) return;
    const paramsM = Number($("chParamsM").value) || 124;
    const tokensB = Number($("chTokensB").value) || 2.5;
    const hwTflops = Number($("chHardware").value) || 65;
    const mfu = Number($("chMfu").value) || 35;

    $("chParamsLabel").textContent = `${paramsM >= 1000 ? (paramsM / 1000).toFixed(2) + " B" : paramsM + " M"}`;
    $("chTokensLabel").textContent = `${tokensB.toFixed(1)} B`;
    $("chMfuLabel").textContent = `%${mfu}`;

    const N = paramsM * 1e6;
    const D = tokensB * 1e9;
    const optTokensB = (20 * N) / 1e9;
    const totalFlops = 6 * N * D;
    const effFlopsPerSec = hwTflops * 1e12 * (mfu / 100);
    const hours = totalFlops / effFlopsPerSec / 3600;
    const ratio = D / N;

    $("chOptimalTokens").textContent = `${optTokensB.toFixed(2)} B Token`;
    $("chTotalFlops").textContent = `${totalFlops.toExponential(2)} FLOPs`;
    $("chEstHours").textContent = hours < 1 ? `${(hours * 60).toFixed(1)} dk` : `${hours.toFixed(1)} saat`;

    let ratioMsg = `Token / Parametre oranı: ${ratio.toFixed(1)}×. `;
    if (ratio < 15) {
      ratioMsg += "Chinchilla optimali (~20×) altında: Model veri açısından eksik eğitilmiş (undertrained) kalabilir.";
    } else if (ratio <= 25) {
      ratioMsg += "Chinchilla (~20×) hesaplama-optimal bölgesinde: Eğitim bütçesi en verimli dengede.";
    } else {
      ratioMsg += "Chinchilla ötesi aşırı-eğitim (overtraining) bölgesi: TinyLlama/SmolLM2 gibi küçük modeli uzun süre eğiterek çıkarım hızını koruma stratejisi.";
    }
    $("chRatioNote").textContent = ratioMsg;
  }

  function renderToolsTab() {
    if (!DATA) return;

    const computeGrid = $("computeGrid");
    if (computeGrid && DATA.FREE_COMPUTE) {
      computeGrid.innerHTML = (DATA.FREE_COMPUTE.resources || []).map((r) => `
        <article class="card">
          <span class="badge badge-brand">${escapeHtml(r.provider)}</span>
          <h4 class="card-title" style="margin-top:6px;">${escapeHtml(r.name)}</h4>
          <p class="small"><strong>Kota:</strong> ${escapeHtml(r.quota)}</p>
          <p class="small muted"><strong>Sınırlar:</strong> ${escapeHtml(r.limits)}</p>
          <p class="small"><strong>Ekip Kullanımı:</strong> ${escapeHtml(r.bestFor)}</p>
          <div class="card-foot">
            <span></span>
            <div style="display:flex; gap:6px;">
              ${r.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(r.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Kılavuz ↗</a>` : ""}
              <a class="btn btn-xs btn-primary" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>
            </div>
          </div>
        </article>
      `).join("");
    }

    const computeLadder = $("computeLadder");
    if (computeLadder && DATA.FREE_COMPUTE) {
      computeLadder.innerHTML = (DATA.FREE_COMPUTE.ladder || []).map((l) => `
        <article class="card">
          <h4 class="card-title">${escapeHtml(l.step)}</h4>
          <p class="small muted"><strong>Donanım:</strong> ${escapeHtml(l.hardware)}</p>
          <p class="small"><strong>Hedef:</strong> ${escapeHtml(l.goal)}</p>
          <p class="small muted">${escapeHtml(l.why)}</p>
        </article>
      `).join("");
    }

    if (DATA.AI_TUTOR_SCIENCE) {
      const ai = DATA.AI_TUTOR_SCIENCE;
      const introEl = $("aiTutorIntro");
      if (introEl) introEl.textContent = ai.intro || "";

      const studiesEl = $("aiStudiesGrid");
      if (studiesEl) {
        studiesEl.innerHTML = (ai.studies || []).map((s) => `
          <article class="card">
            <span class="badge">${escapeHtml(s.venue)}</span>
            <h4 class="card-title" style="margin-top:6px;">${escapeHtml(s.title)}</h4>
            <p class="small muted">${escapeHtml(s.authors)}</p>
            <p class="small">${escapeHtml(s.finding)}</p>
            <div class="card-foot"><span></span><a class="btn btn-xs" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">Araştırma ↗</a></div>
          </article>
        `).join("");
      }

      const rulesEl = $("aiRulesList");
      if (rulesEl) {
        rulesEl.innerHTML = (ai.rules || []).map((r) => `<li>${escapeHtml(r)}</li>`).join("");
      }

      const promptEl = $("socraticPromptText");
      if (promptEl) promptEl.textContent = ai.socraticPrompt || "";
    }

    const stuckEl = $("stuckPromptsGrid");
    if (stuckEl && DATA.BEGINNER_GUIDE) {
      stuckEl.innerHTML = (DATA.BEGINNER_GUIDE.stuckPrompts || []).map((p) => `
        <article class="card">
          <div class="card-head">
            <h4 class="card-title">${escapeHtml(p.title)}</h4>
            <button type="button" class="btn btn-xs" data-copy-prompt="${escapeHtml(p.prompt)}">Kopyala</button>
          </div>
          <p class="small muted">${escapeHtml(p.prompt)}</p>
        </article>
      `).join("");
    }

    if (DATA.TEAM_PLAN) {
      const rolesEl = $("teamRolesGrid");
      if (rolesEl) {
        rolesEl.innerHTML = (DATA.TEAM_PLAN.roles || []).map((r) => `
          <article class="card">
            <span class="badge badge-role">${escapeHtml(r.id)}</span>
            <h4 class="card-title" style="margin-top:6px;">${escapeHtml(r.name)}</h4>
            <p class="small">${escapeHtml(r.focus)}</p>
            <p class="small muted"><strong>İlk Ay Görevi:</strong> ${escapeHtml(r.firstMonthTask)}</p>
          </article>
        `).join("");
      }

      const phasesEl = $("teamPhasesGrid");
      if (phasesEl) {
        phasesEl.innerHTML = (DATA.TEAM_PLAN.phases || []).map((ph) => `
          <article class="card">
            <h4 class="card-title">${escapeHtml(ph.phase)}</h4>
            <p class="small"><strong>Hedef:</strong> ${escapeHtml(ph.objective)}</p>
            <ul class="clean-list small">
              ${(ph.milestones || []).map((ms) => `<li>${escapeHtml(ms)}</li>`).join("")}
            </ul>
          </article>
        `).join("");
      }
    }

    updateVramCalc();
    updateChinchillaCalc();
  }

  /* ---------- 5. Kütüphane & Denetim ---------- */
  function populateLibraryFilters() {
    if (!DATA || !Array.isArray(DATA.ALL_RESOURCES)) return;
    const catSelect = $("libCategoryFilter");
    if (catSelect && catSelect.options.length <= 1) {
      const cats = Array.from(new Set(DATA.ALL_RESOURCES.map((r) => r.category).filter(Boolean)));
      cats.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
      });
    }
    const lvlSelect = $("libLevelFilter");
    if (lvlSelect && lvlSelect.options.length <= 1) {
      const lvls = Array.from(new Set(DATA.ALL_RESOURCES.map((r) => r.level).filter(Boolean)));
      lvls.forEach((l) => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = l;
        lvlSelect.appendChild(opt);
      });
    }
  }

  function renderLibraryTab() {
    populateLibraryFilters();
    renderLibraryGrid();
    renderAuditTable();
  }

  function renderLibraryGrid() {
    const grid = $("libraryGrid");
    if (!grid || !DATA || !Array.isArray(DATA.ALL_RESOURCES)) return;
    const member = getActiveMember();
    const catUse = DATA.CATEGORY_USE_CASES || {};

    const q = ($("libSearch") ? $("libSearch").value : "").trim().toLowerCase();
    const cat = $("libCategoryFilter") ? $("libCategoryFilter").value : "all";
    const lvl = $("libLevelFilter") ? $("libLevelFilter").value : "all";
    const role = $("libRoleFilter") ? $("libRoleFilter").value : "all";

    const filtered = DATA.ALL_RESOURCES.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (lvl !== "all" && r.level !== lvl) return false;
      if (role !== "all" && !(r.roles || []).includes(role)) return false;
      if (libBookmarkOnly && !member.bookmarks[r.id]) return false;
      if (q) {
        const hay = `${r.title} ${r.authors} ${r.category} ${r.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const badge = $("libCountBadge");
    if (badge) badge.textContent = `${filtered.length} kaynak`;

    grid.innerHTML = filtered.map((r) => {
      const isFav = Boolean(member.bookmarks[r.id]);
      const useText = catUse[r.category];
      return `
        <article class="card">
          <div class="card-head">
            <div>
              <span class="badge">${escapeHtml(r.category)}</span>
              <span class="badge">${escapeHtml(r.level)}</span>
              ${r.year ? `<span class="small muted">${escapeHtml(r.year)}</span>` : ""}
            </div>
            <button type="button" class="btn btn-xs ${isFav ? "btn-primary" : ""}" data-bookmark-id="${escapeHtml(r.id)}" aria-pressed="${isFav}">
              ${isFav ? "★ Kayıtlı" : "☆ Kaydet"}
            </button>
          </div>
          <h4 class="card-title" style="margin-top:6px;">${escapeHtml(r.title)}</h4>
          <p class="small muted">${escapeHtml(r.authors)}</p>
          <p class="small">${escapeHtml(r.summary)}</p>
          ${useText ? `<div class="where-used-box small"><strong>Nerede İşe Yarar?</strong> ${escapeHtml(useText)}</div>` : ""}
          <div class="card-foot">
            <span class="small muted">${escapeHtml(r.access || "")}</span>
            <a class="btn btn-xs btn-primary" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>
          </div>
        </article>
      `;
    }).join("");
  }

  function classifyAuditTier(item) {
    if (item.tier) return item.tier;
    const cat = String(item.category || "");
    if (/kurumsal|enstitü|üniversite|resmî|platform/i.test(cat)) return "institution";
    if (/akademik|kitap|bildiri/i.test(cat)) return "peer-reviewed";
    return "non-peer-reviewed";
  }

  function renderAuditTable() {
    const tbody = $("auditTableBody");
    if (!tbody || !DATA || !Array.isArray(DATA.CREDENTIAL_AUDIT)) return;

    const q = ($("auditSearch") ? $("auditSearch").value : "").trim().toLowerCase();
    const tier = $("auditTierFilter") ? $("auditTierFilter").value : "all";

    const filtered = DATA.CREDENTIAL_AUDIT.filter((a) => {
      if (tier !== "all" && classifyAuditTier(a) !== tier) return false;
      if (q) {
        const hay = `${a.resourceName} ${a.category} ${a.authorCredentials} ${a.caveat}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const badge = $("auditCountBadge");
    if (badge) badge.textContent = `${filtered.length} kayıt`;

    tbody.innerHTML = filtered.map((a) => `
      <tr>
        <td><a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(a.resourceName)}</strong> ↗</a></td>
        <td>${escapeHtml(a.category)}</td>
        <td>${escapeHtml(a.authorCredentials)}</td>
        <td>${escapeHtml(a.caveat)}</td>
      </tr>
    `).join("");
  }

  /* ---------- İlerleme & Yedek Modalı ---------- */
  function openProgressModal() {
    const modal = $("progressModal");
    if (!modal) return;
    renderProgressModal();
    modal.removeAttribute("hidden");
  }

  function closeProgressModal() {
    const modal = $("progressModal");
    if (modal) modal.setAttribute("hidden", "");
  }

  function renderProgressModal() {
    const member = getActiveMember();

    const memberSelect = $("modalMemberSelect");
    if (memberSelect) {
      memberSelect.innerHTML = Object.keys(appState.members).map((name) => `
        <option value="${escapeHtml(name)}" ${name === appState.activeMember ? "selected" : ""}>${escapeHtml(name)}</option>
      `).join("");
    }

    const roleSelect = $("modalRoleSelect");
    if (roleSelect) {
      roleSelect.value = member.role;
    }

    const m = getProgressMetrics();
    const favCount = Object.keys(member.bookmarks || {}).filter((k) => member.bookmarks[k]).length;

    const statsEl = $("modalOverallStats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-pill"><span>Genel İlerleme</span><strong>%${m.pct}</strong></div>
        <div class="stat-pill"><span>Konular</span><strong>${m.doneTopics}/${m.totalTopics}</strong></div>
        <div class="stat-pill"><span>Haftalar</span><strong>${m.doneWeeks}/${m.totalWeeks}</strong></div>
        <div class="stat-pill"><span>Yer İmleri</span><strong>${favCount}</strong></div>
      `;
    }

    const lvlBars = $("modalLevelBars");
    if (lvlBars && DATA && Array.isArray(DATA.LEVEL_GROUPS)) {
      lvlBars.innerHTML = DATA.LEVEL_GROUPS.map((lvl) => {
        const done = (lvl.topics || []).filter((t) => member.topics[t.id]).length;
        const total = (lvl.topics || []).length || 1;
        const pct = Math.round((done / total) * 100);
        return `
          <div class="progress-bar-row">
            <span>${escapeHtml(lvl.badge)}</span>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            <strong>${done}/${total}</strong>
          </div>
        `;
      }).join("");
    }

    const qBars = $("modalQuarterBars");
    if (qBars && DATA && Array.isArray(DATA.ANNUAL_CALENDAR)) {
      const quarters = {};
      DATA.ANNUAL_CALENDAR.forEach((mo) => {
        if (!quarters[mo.quarter]) quarters[mo.quarter] = { done: 0, total: 0 };
        (mo.weeks || []).forEach((w) => {
          quarters[mo.quarter].total += 1;
          if (member.weeks[w.id]) quarters[mo.quarter].done += 1;
        });
      });
      qBars.innerHTML = Object.entries(quarters).map(([q, st]) => {
        const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
        return `
          <div class="progress-bar-row">
            <span>${escapeHtml(q)}</span>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            <strong>${st.done}/${st.total}</strong>
          </div>
        `;
      }).join("");
    }

    const syncOut = $("syncCodeOutput");
    if (syncOut) {
      const code = encodeSyncCode();
      if ("value" in syncOut) syncOut.value = code;
      else syncOut.textContent = code;
    }

    renderModalMiniHeatmap(member);
  }

  function downloadFile(filename, content, mime) {
    if (!HAS_DOC) return;
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportObsidianMarkdown() {
    const member = getActiveMember();
    const m = getProgressMetrics();
    const streaks = computeStreakStats(member.activityLog);
    const resMap = getResourceMap();
    const lines = [
      `# Lintu AI Yol Haritası — ${appState.activeMember}`,
      `- **Rol:** ${ROLE_LABELS[member.role] || member.role}`,
      `- **Başlangıç:** ${formatCalendarMonthLabel(1, appState.startMonth)}`,
      `- **Genel İlerleme:** %${m.pct} (${m.doneTopics}/${m.totalTopics} konu, ${m.doneWeeks}/${m.totalWeeks} hafta)`,
      `- **Çalışma Serisi:** Aktif ${streaks.currentStreak} gün · En uzun ${streaks.longestStreak} gün · Toplam ${streaks.totalDays} aktif gün`,
      "",
      "## Tamamlanan Konular"
    ];
    if (DATA && Array.isArray(DATA.LEVEL_GROUPS)) {
      DATA.LEVEL_GROUPS.forEach((lvl) => {
        (lvl.topics || []).forEach((t) => {
          lines.push(`- [${member.topics[t.id] ? "x" : " "}] ${lvl.badge}: ${t.title}`);
        });
      });
    }
    lines.push("", "## Kaydedilen Kaynaklar");
    Object.keys(member.bookmarks || {}).forEach((rid) => {
      if (member.bookmarks[rid] && resMap[rid]) {
        lines.push(`- [${resMap[rid].title}](${resMap[rid].url})`);
      }
    });
    downloadFile(`lintu-ai-${appState.activeMember.toLowerCase()}.md`, lines.join("\n"), "text/markdown;charset=utf-8");
    showToast("Obsidian .md özeti indirildi.");
  }

  /* ---------- Lintu Maskot Turu ---------- */
  function openTour(stepIdx) {
    const overlay = $("tourOverlay");
    if (!overlay || !DATA || !Array.isArray(DATA.MASCOT_TOUR_STEPS)) return;
    tourStepIndex = Math.max(0, Math.min(stepIdx || 0, DATA.MASCOT_TOUR_STEPS.length - 1));
    renderTourStep();
    overlay.removeAttribute("hidden");
  }

  function closeTour() {
    const overlay = $("tourOverlay");
    if (overlay) overlay.setAttribute("hidden", "");
    if (typeof localStorage !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY_TOUR, "1"); } catch (_) {}
    }
  }

  function renderTourStep() {
    if (!DATA || !Array.isArray(DATA.MASCOT_TOUR_STEPS)) return;
    const steps = DATA.MASCOT_TOUR_STEPS;
    const step = steps[tourStepIndex];
    if (!step) return;

    const lbl = $("tourProgressLabel");
    if (lbl) lbl.textContent = `Adım ${tourStepIndex + 1} / ${steps.length}`;
    const title = $("tourTitle");
    if (title) title.textContent = step.title;
    const body = $("tourBody");
    if (body) {
      body.innerHTML = `
        <p class="small muted">${escapeHtml(step.eyebrow || "")}</p>
        <p>${escapeHtml(step.say || "")}</p>
        ${step.previewTitle ? `<h5 style="margin:10px 0 6px;">${escapeHtml(step.previewTitle)}</h5>` : ""}
        ${Array.isArray(step.previewItems) ? `<ul class="clean-list small">${step.previewItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : ""}
      `;
    }
    const dots = $("tourDots");
    if (dots) {
      dots.innerHTML = steps.map((_, idx) => `<span class="tour-dot ${idx === tourStepIndex ? "active" : ""}"></span>`).join("");
    }
    const prev = $("tourPrevBtn");
    const next = $("tourNextBtn");
    if (prev) prev.disabled = tourStepIndex === 0;
    if (next) next.textContent = tourStepIndex === steps.length - 1 ? "Başlayalım ✓" : "İleri →";
  }

  /* ---------- Toplu Yenileme & Olay Bağlama ---------- */
  function refreshAllProgressUI() {
    updateHeaderAndSidebarProgress();
    renderLevelsTab();
    renderCalendarTab();
    renderLibraryGrid();
    const modal = $("progressModal");
    if (modal && !modal.hasAttribute("hidden")) {
      renderProgressModal();
    }
  }

  function bindEvents() {
    if (!HAS_DOC) return;

    // Navigasyon & Alt Sekmeler
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== "function") return;

      const navBtn = target.closest(".nav-btn[data-tab]");
      if (navBtn) {
        switchTab(navBtn.getAttribute("data-tab"));
        return;
      }

      const subBtn = target.closest("[data-subtab-group][data-subtab]");
      if (subBtn) {
        switchSubtab(subBtn.getAttribute("data-subtab-group"), subBtn.getAttribute("data-subtab"));
        return;
      }

      const lvlPill = target.closest("[data-level-id]");
      if (lvlPill) {
        activeLevelId = lvlPill.getAttribute("data-level-id") || "all";
        renderLevelsTab();
        return;
      }

      const topicBtn = target.closest("[data-topic-id]");
      if (topicBtn) {
        const tid = topicBtn.getAttribute("data-topic-id");
        const member = getActiveMember();
        const isNowDone = !member.topics[tid];
        if (isNowDone) member.topics[tid] = true;
        else delete member.topics[tid];
        logItemCompletion(member, tid, isNowDone);
        saveState();
        refreshAllProgressUI();
        return;
      }

      const weekBtn = target.closest("[data-week-id]");
      if (weekBtn) {
        const wid = weekBtn.getAttribute("data-week-id");
        const member = getActiveMember();
        const isNowDone = !member.weeks[wid];
        if (isNowDone) member.weeks[wid] = true;
        else delete member.weeks[wid];
        logItemCompletion(member, wid, isNowDone);
        saveState();
        refreshAllProgressUI();
        return;
      }

      const personalDayBtn = target.closest("[data-personal-day]");
      if (personalDayBtn) {
        const dk = personalDayBtn.getAttribute("data-personal-day");
        if (dk) {
          selectedPersonalDate = dk;
          const d = parseDateKey(dk);
          personalViewYear = d.getFullYear();
          personalViewMonth = d.getMonth();
          calViewMode = "personal";
          renderCalendarTab();
        }
        return;
      }

      const dayActionBtn = target.closest("[data-day-action]");
      if (dayActionBtn) {
        const action = dayActionBtn.getAttribute("data-day-action");
        const dk = dayActionBtn.getAttribute("data-day-key") || selectedPersonalDate;
        const member = getActiveMember();
        if (action === "add") {
          addManualStudyCheckIn(member, dk);
          showToast(`${formatFullTurkishDate(dk)} için +1 çalışma eklendi.`);
        } else if (action === "clear") {
          clearDayActivity(member, dk);
          showToast("Manuel çalışma kaydı temizlendi.");
        }
        saveState();
        refreshAllProgressUI();
        return;
      }

      const saveNoteBtn = target.closest("[data-save-day-note]");
      if (saveNoteBtn) {
        const dk = saveNoteBtn.getAttribute("data-save-day-note") || selectedPersonalDate;
        const input = HAS_DOC ? document.querySelector("[data-day-note-input]") : null;
        setDayNote(getActiveMember(), dk, input ? input.value : "");
        saveState();
        refreshAllProgressUI();
        showToast("Günlük not kaydedildi.");
        return;
      }

      const calMonthCard = target.closest("[data-cal-month]");
      if (calMonthCard) {
        selectedCalMonth = Number(calMonthCard.getAttribute("data-cal-month")) || 1;
        calViewMode = "monthly";
        renderCalendarTab();
        return;
      }

      const selectMonthBtn = target.closest("[data-select-month]");
      if (selectMonthBtn) {
        selectedCalMonth = Number(selectMonthBtn.getAttribute("data-select-month")) || 1;
        renderCalendarTab();
        return;
      }

      const jumpPaper = target.closest("[data-jump-paper]");
      if (jumpPaper) {
        const pid = jumpPaper.getAttribute("data-jump-paper");
        histViewMode = "list";
        renderHistoryTab();
        const el = $(`timeline-${pid}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const bookmarkBtn = target.closest("[data-bookmark-id]");
      if (bookmarkBtn) {
        const rid = bookmarkBtn.getAttribute("data-bookmark-id");
        const member = getActiveMember();
        if (member.bookmarks[rid]) delete member.bookmarks[rid];
        else member.bookmarks[rid] = true;
        saveState();
        refreshAllProgressUI();
        return;
      }

      const copyPrompt = target.closest("[data-copy-prompt]");
      if (copyPrompt) {
        copyText(copyPrompt.getAttribute("data-copy-prompt"), "İstem panoya kopyalandı.");
      }
    });

    // Mobil menü
    const menuToggle = $("menuToggle");
    const sidebar = $("sidebar");
    const backdrop = $("sidebarBackdrop");
    if (menuToggle && sidebar) {
      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        if (backdrop) backdrop.classList.toggle("open");
      });
    }
    if (backdrop && sidebar) {
      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("open");
        backdrop.classList.remove("open");
      });
    }

    // Tema
    const themeToggle = $("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(cur === "dark" ? "light" : "dark");
      });
    }

    // Hero kısayolları
    if ($("heroGoLevelsBtn")) $("heroGoLevelsBtn").addEventListener("click", () => switchTab("seviyeler"));
    if ($("heroGoCalendarBtn")) $("heroGoCalendarBtn").addEventListener("click", () => switchTab("takvim"));
    if ($("heroStartTourBtn")) $("heroStartTourBtn").addEventListener("click", () => openTour(0));
    if ($("openTourBtn")) $("openTourBtn").addEventListener("click", () => openTour(0));
    if ($("mascotOpenTourBtn")) $("mascotOpenTourBtn").addEventListener("click", () => openTour(0));
    if ($("mascotDockBtn")) $("mascotDockBtn").addEventListener("click", () => openTour(0));

    // Başlangıç kopyalama & sözlük
    if ($("copyAdvisorEmailBtn")) {
      $("copyAdvisorEmailBtn").addEventListener("click", () => {
        const el = $("advisorEmailText");
        if (el) copyText(el.textContent, "Danışman e-posta taslağı kopyalandı.");
      });
    }
    if ($("glossarySearch")) $("glossarySearch").addEventListener("input", renderGlossary);

    // Seviye rol filtresi
    if ($("levelRoleFilter")) $("levelRoleFilter").addEventListener("change", renderLevelsTab);

    // Takvim kontrolleri
    if ($("calViewAnnualBtn")) {
      $("calViewAnnualBtn").addEventListener("click", () => { calViewMode = "annual"; renderCalendarTab(); });
    }
    if ($("calViewMonthlyBtn")) {
      $("calViewMonthlyBtn").addEventListener("click", () => { calViewMode = "monthly"; renderCalendarTab(); });
    }
    if ($("calViewPersonalBtn")) {
      $("calViewPersonalBtn").addEventListener("click", () => { calViewMode = "personal"; renderCalendarTab(); });
    }
    if ($("logTodayBtn")) {
      $("logTodayBtn").addEventListener("click", () => {
        const todayKey = toLocalDateKey(new Date());
        const now = new Date();
        selectedPersonalDate = todayKey;
        personalViewYear = now.getFullYear();
        personalViewMonth = now.getMonth();
        addManualStudyCheckIn(getActiveMember(), todayKey);
        saveState();
        refreshAllProgressUI();
        showToast("Bugünkü çalışman takvime işlendi!");
      });
    }
    if ($("personalPrevMonthBtn")) {
      $("personalPrevMonthBtn").addEventListener("click", () => {
        personalViewMonth -= 1;
        if (personalViewMonth < 0) {
          personalViewMonth = 11;
          personalViewYear -= 1;
        }
        renderPersonalCalendar(getActiveMember());
      });
    }
    if ($("personalNextMonthBtn")) {
      $("personalNextMonthBtn").addEventListener("click", () => {
        personalViewMonth += 1;
        if (personalViewMonth > 11) {
          personalViewMonth = 0;
          personalViewYear += 1;
        }
        renderPersonalCalendar(getActiveMember());
      });
    }
    if ($("personalTodayBtn")) {
      $("personalTodayBtn").addEventListener("click", () => {
        const now = new Date();
        personalViewYear = now.getFullYear();
        personalViewMonth = now.getMonth();
        selectedPersonalDate = toLocalDateKey(now);
        renderPersonalCalendar(getActiveMember());
      });
    }
    if ($("calStartMonthSelect")) {
      $("calStartMonthSelect").addEventListener("change", (e) => {
        appState.startMonth = e.target.value;
        saveState();
        renderCalendarTab();
      });
    }
    if ($("calPrevMonthBtn")) {
      $("calPrevMonthBtn").addEventListener("click", () => {
        selectedCalMonth = selectedCalMonth <= 1 ? 12 : selectedCalMonth - 1;
        renderCalendarTab();
      });
    }
    if ($("calNextMonthBtn")) {
      $("calNextMonthBtn").addEventListener("click", () => {
        selectedCalMonth = selectedCalMonth >= 12 ? 1 : selectedCalMonth + 1;
        renderCalendarTab();
      });
    }

    // Tarih filtreleri
    if ($("histModeStoryBtn")) {
      $("histModeStoryBtn").addEventListener("click", () => { histViewMode = "story"; renderHistoryTab(); });
    }
    if ($("histModeListBtn")) {
      $("histModeListBtn").addEventListener("click", () => { histViewMode = "list"; renderHistoryTab(); });
    }
    ["timelineSearch", "timelineEraFilter", "timelineRoleFilter"].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", renderTimelineList);
        el.addEventListener("change", renderTimelineList);
      }
    });

    // Hesaplayıcılar & Sokratik İstem
    if ($("vramPreset")) {
      $("vramPreset").addEventListener("change", (e) => {
        if (e.target.value !== "custom") applyVramPreset(e.target.value);
      });
    }
    ["vramParamsM", "vramMode", "vramBatch", "vramSeq", "vramHidden", "vramLayers", "vramGradCkpt", "vramUnsloth"].forEach((id) => {
      const el = $(id);
      if (el) {
        const onEdit = () => {
          if ($("vramPreset")) $("vramPreset").value = "custom";
          updateVramCalc();
        };
        el.addEventListener("input", onEdit);
        el.addEventListener("change", onEdit);
      }
    });
    ["chParamsM", "chTokensB", "chHardware", "chMfu"].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", updateChinchillaCalc);
        el.addEventListener("change", updateChinchillaCalc);
      }
    });
    if ($("copyPromptBtn")) {
      $("copyPromptBtn").addEventListener("click", () => {
        const el = $("socraticPromptText");
        if (el) copyText(el.textContent, "Sokratik istem kopyalandı.");
      });
    }

    // Kütüphane & Denetim
    ["libSearch", "libCategoryFilter", "libLevelFilter", "libRoleFilter"].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", renderLibraryGrid);
        el.addEventListener("change", renderLibraryGrid);
      }
    });
    if ($("libBookmarkOnlyBtn")) {
      $("libBookmarkOnlyBtn").addEventListener("click", () => {
        libBookmarkOnly = !libBookmarkOnly;
        $("libBookmarkOnlyBtn").classList.toggle("active", libBookmarkOnly);
        renderLibraryGrid();
      });
    }
    ["auditSearch", "auditTierFilter"].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", renderAuditTable);
        el.addEventListener("change", renderAuditTable);
      }
    });

    // İlerleme & Yedek Modalı
    if ($("openProgressBtn")) $("openProgressBtn").addEventListener("click", openProgressModal);
    if ($("sidebarOpenProgressBtn")) $("sidebarOpenProgressBtn").addEventListener("click", openProgressModal);
    if ($("modalOpenPersonalCalBtn")) {
      $("modalOpenPersonalCalBtn").addEventListener("click", () => {
        closeProgressModal();
        calViewMode = "personal";
        switchTab("takvim");
        renderCalendarTab();
      });
    }
    if ($("closeProgressModalBtn")) $("closeProgressModalBtn").addEventListener("click", closeProgressModal);
    if ($("progressModal")) {
      $("progressModal").addEventListener("click", (e) => {
        if (e.target === $("progressModal")) closeProgressModal();
      });
    }
    if ($("modalMemberSelect")) {
      $("modalMemberSelect").addEventListener("change", (e) => {
        if (appState.members[e.target.value]) {
          appState.activeMember = e.target.value;
          saveState();
          refreshAllProgressUI();
        }
      });
    }
    if ($("modalAddMemberBtn")) {
      $("modalAddMemberBtn").addEventListener("click", () => {
        const name = window.prompt("Yeni ekip üyesinin adı:");
        const clean = name ? name.trim() : "";
        if (!clean) return;
        if (!appState.members[clean]) {
          appState.members[clean] = createEmptyMember("ortak");
        }
        appState.activeMember = clean;
        saveState();
        refreshAllProgressUI();
        showToast(`${clean} profili eklendi.`);
      });
    }
    if ($("modalRoleSelect")) {
      $("modalRoleSelect").addEventListener("change", (e) => {
        const member = getActiveMember();
        member.role = ROLE_LABELS[e.target.value] ? e.target.value : "ortak";
        saveState();
        refreshAllProgressUI();
      });
    }
    if ($("copySyncCodeBtn")) {
      $("copySyncCodeBtn").addEventListener("click", () => {
        const code = encodeSyncCode();
        copyText(code, "Sync kodu kopyalandı.");
        if ($("syncFeedback")) $("syncFeedback").textContent = "Sync kodu panoya kopyalandı.";
      });
    }
    if ($("copySyncLinkBtn")) {
      $("copySyncLinkBtn").addEventListener("click", () => {
        const code = encodeSyncCode();
        const base = HAS_WINDOW && window.location ? `${window.location.origin}${window.location.pathname}` : "";
        copyText(`${base}?sync=${encodeURIComponent(code)}`, "Sync bağlantısı kopyalandı.");
        if ($("syncFeedback")) $("syncFeedback").textContent = "Sync bağlantısı panoya kopyalandı.";
      });
    }
    if ($("applySyncCodeBtn")) {
      $("applySyncCodeBtn").addEventListener("click", () => {
        const input = $("syncCodeInput");
        const feedback = $("syncFeedback");
        const decoded = decodeSyncCode(input ? input.value : "");
        if (!decoded) {
          if (feedback) feedback.textContent = "Geçersiz Sync kodu. Kod LINTU3- ile başlamalıdır.";
          return;
        }
        applyDecodedSync(decoded);
        if (input) input.value = "";
        if (feedback) feedback.textContent = `${decoded.memberName} ilerlemesi uygulandı.`;
        refreshAllProgressUI();
        showToast(`${decoded.memberName} ilerlemesi yüklendi.`);
      });
    }
    if ($("exportObsidianBtn")) $("exportObsidianBtn").addEventListener("click", exportObsidianMarkdown);
    if ($("exportJsonBtn")) {
      $("exportJsonBtn").addEventListener("click", () => {
        downloadFile("lintu-yol-haritasi-yedek.json", JSON.stringify(appState, null, 2), "application/json");
        showToast("JSON yedeği indirildi.");
      });
    }
    if ($("importJsonInput")) {
      $("importJsonInput").addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || "{}"));
            appState = normalizeState(parsed.state || parsed);
            saveState();
            refreshAllProgressUI();
            showToast("JSON yedeği içe aktarıldı.");
          } catch (_) {
            showToast("JSON dosyası okunamadı.");
          }
        };
        reader.readAsText(file);
        e.target.value = "";
      });
    }
    if ($("resetProgressBtn")) {
      $("resetProgressBtn").addEventListener("click", () => {
        if (!window.confirm(`${appState.activeMember} için tüm ilerleme sıfırlansın mı?`)) return;
        const member = getActiveMember();
        member.topics = {};
        member.weeks = {};
        member.bookmarks = {};
        member.activityLog = {};
        saveState();
        refreshAllProgressUI();
        showToast("İlerleme sıfırlandı.");
      });
    }

    // Tur kontrolleri
    if ($("tourSkipBtn")) $("tourSkipBtn").addEventListener("click", closeTour);
    if ($("tourPrevBtn")) {
      $("tourPrevBtn").addEventListener("click", () => {
        if (tourStepIndex > 0) { tourStepIndex -= 1; renderTourStep(); }
      });
    }
    if ($("tourNextBtn")) {
      $("tourNextBtn").addEventListener("click", () => {
        const total = DATA && DATA.MASCOT_TOUR_STEPS ? DATA.MASCOT_TOUR_STEPS.length : 0;
        if (tourStepIndex < total - 1) {
          tourStepIndex += 1;
          renderTourStep();
        } else {
          closeTour();
        }
      });
    }
  }

  /* ---------- Başlatma & Test Kancası ---------- */
  function boot() {
    initTheme();
    checkUrlSyncParam();
    hydrateFromIndexedDbIfNeeded();

    if (!DATA) {
      console.error("ROADMAP_DATA yüklenemedi.");
      return;
    }

    renderBeginnerSection();
    renderLevelsTab();
    renderCalendarTab();
    renderHistoryTab();
    renderToolsTab();
    renderLibraryTab();
    updateHeaderAndSidebarProgress();
    switchTab("baslangic");
    bindEvents();

    if (typeof localStorage !== "undefined") {
      try {
        if (!localStorage.getItem(STORAGE_KEY_TOUR)) {
          openTour(0);
        }
      } catch (_) {}
    }
  }

  if (HAS_WINDOW) {
    window.__LINTU_V3__ = {
      encodeSyncCode,
      decodeSyncCode,
      getState,
      updateVramCalc,
      updateChinchillaCalc,
      computeStreakStats,
      toLocalDateKey,
      logItemCompletion,
      addManualStudyCheckIn
    };
  }

  if (HAS_DOC) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }
})();
