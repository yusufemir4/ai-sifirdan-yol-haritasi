/* Lintu AI Yol Haritası (v2) — Etkileşimli Uygulama Mantığı
 * Harici kütüphane yoktur; ES module kullanılmaz, file:// ve GitHub Pages uyumludur.
 */

(function () {
  "use strict";

  const DATA = window.ROADMAP_DATA;
  if (!DATA) {
    console.error("ROADMAP_DATA yüklenemedi.");
    return;
  }

  const STORAGE_KEY_V2 = "ai_roadmap_state_v2";
  const STORAGE_KEY_V1 = "ai_roadmap_done_v1";
  const STORAGE_KEY_THEME = "ai_roadmap_theme_v1";
  const STORAGE_KEY_TOUR = "ai_roadmap_tour_seen_v2";

  const TAB_TITLES = {
    "baslangic": "0. Sıfırdan Başla, Yardım Al & 28 Temel Terim",
    "genel-bakis": "1. Genel Bakış & Dürüst Gerçeklik Kontrolü",
    "tarih": "2. Olay Örgüsü (7 Perde) & Kronolojik Tarih",
    "altyapi": "3. İşlevsel Teknik Altyapı (10 Modül)",
    "hesaplayicilar": "4. GPU VRAM & Chinchilla / FLOPs Hesaplayıcıları",
    "sifir-butce": "5. Sıfır Bütçe Stratejisi & Ücretsiz GPU Kaynakları",
    "ai-kullanim": "6. AI Araçlarını Bilimsel Kullanma & Sokratik İstem",
    "ekip-plani": "7. 5 Kişilik Ekip Rolleri & 12 Aylık Faz Planı",
    "kaynak-denetimi": "8. Hakemli Olmayan Kaynaklar — Yazar & Nitelik Karnesi",
    "kutuphane": "9. Doğrulanmış Tüm Kaynaklar Kütüphanesi"
  };

  const ROLE_LABELS = {
    ortak: "Ortak Çekirdek",
    mimari: "Mimari & Mat.",
    veri: "Veri & Tokenizer",
    sistem: "GPU & Sistem",
    posttraining: "Post-Training & RL",
    eval: "Eval & Servis"
  };

  const LEVEL_ORDER = {
    "Başlangıç": 0,
    "Temel": 1,
    "Orta": 2,
    "İleri": 3
  };

  let appState = loadAppState();
  let activeTimelineEra = "all";
  let activeInfraRole = "all";
  let activeLibStatus = "all";
  let currentTabId = "genel-bakis";
  let tourStepIndex = 0;

  // File System Access API tutamacı (oturum süresince gerçek yerel dosyaya oto-kayıt)
  let localFileHandle = null;
  let localFileName = "";
  let localSaveTimer = null;

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function createEmptyProfile(role, level) {
    return {
      role: role || "ortak",
      level: level || "Başlangıç",
      statuses: {},
      stars: {},
      notes: {}
    };
  }

  function normalizeState(raw) {
    const base = {
      version: 2,
      activeProfile: "Yusuf",
      profiles: {
        Yusuf: createEmptyProfile("ortak", "Başlangıç")
      }
    };
    if (!raw || typeof raw !== "object") return base;

    // Eğer eski v1 formatı geldiyse dönüştür
    if (Array.isArray(raw)) {
      raw.forEach((k) => { base.profiles.Yusuf.statuses[String(k)] = "done"; });
      return base;
    }
    if (Array.isArray(raw.done) && !raw.profiles) {
      raw.done.forEach((k) => { base.profiles.Yusuf.statuses[String(k)] = "done"; });
      return base;
    }

    if (raw.profiles && typeof raw.profiles === "object") {
      base.profiles = {};
      Object.entries(raw.profiles).forEach(([name, prof]) => {
        const cleanName = String(name).trim() || "Üye";
        base.profiles[cleanName] = {
          role: prof && ROLE_LABELS[prof.role] ? prof.role : "ortak",
          level: prof && prof.level in LEVEL_ORDER ? prof.level : "Başlangıç",
          statuses: prof && prof.statuses && typeof prof.statuses === "object" ? { ...prof.statuses } : {},
          stars: prof && prof.stars && typeof prof.stars === "object" ? { ...prof.stars } : {},
          notes: prof && prof.notes && typeof prof.notes === "object" ? { ...prof.notes } : {}
        };
      });
    }
    if (Object.keys(base.profiles).length === 0) {
      base.profiles.Yusuf = createEmptyProfile("ortak", "Başlangıç");
    }
    base.activeProfile = raw.activeProfile && base.profiles[raw.activeProfile]
      ? raw.activeProfile
      : Object.keys(base.profiles)[0];
    return base;
  }

  function loadAppState() {
    try {
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (rawV2) {
        return normalizeState(JSON.parse(rawV2));
      }
      const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
      if (rawV1) {
        const migrated = normalizeState(JSON.parse(rawV1));
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
        return migrated;
      }
    } catch (err) {
      console.warn("Durum okuma hatası:", err);
    }
    return normalizeState(null);
  }

  function getActiveProfile() {
    if (!appState.profiles[appState.activeProfile]) {
      appState.profiles[appState.activeProfile] = createEmptyProfile("ortak", "Başlangıç");
    }
    return appState.profiles[appState.activeProfile];
  }

  function saveAppState() {
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(appState));
    } catch (err) {
      console.warn("localStorage kaydı başarısız:", err);
    }
    scheduleLocalFileSave();
  }

  function setLocalSaveStatus(linked, message) {
    const dot = document.getElementById("localSaveStatusDot");
    const txt = document.getElementById("localSaveStatusText");
    if (dot) dot.classList.toggle("linked", Boolean(linked));
    if (txt) txt.textContent = message;
  }

  function scheduleLocalFileSave() {
    if (!localFileHandle) return;
    if (localSaveTimer) clearTimeout(localSaveTimer);
    localSaveTimer = setTimeout(() => {
      writeLocalFileNow(false);
    }, 300);
  }

  async function writeLocalFileNow(isManualAction) {
    if (!localFileHandle) return false;
    try {
      const writable = await localFileHandle.createWritable();
      const payload = {
        version: 2,
        updatedAt: new Date().toISOString(),
        app: "Lintu AI Yol Haritası",
        state: appState
      };
      await writable.write(JSON.stringify(payload, null, 2));
      await writable.close();
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setLocalSaveStatus(true, `Yerel dosya: ${localFileName} · ${hh}:${mm}`);
      return true;
    } catch (err) {
      console.warn("Yerel dosyaya yazılamadı:", err);
      localFileHandle = null;
      setLocalSaveStatus(false, "Yerel dosya bağlantısı koptu; tarayıcı belleği aktif.");
      if (isManualAction) {
        downloadJsonBackup();
      }
      return false;
    }
  }

  async function linkLocalSaveFile() {
    if (typeof window.showSaveFilePicker !== "function") {
      setLocalSaveStatus(false, "Tarayıcı doğrudan dosya yazmayı desteklemiyor; JSON indiriliyor.");
      downloadJsonBackup();
      return;
    }
    try {
      const safeName = appState.activeProfile.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || "ekip";
      const handle = await window.showSaveFilePicker({
        suggestedName: `lintu-ai-ilerleme-${safeName}.json`,
        types: [{
          description: "JSON İlerleme Dosyası",
          accept: { "application/json": [".json"] }
        }]
      });
      localFileHandle = handle;
      localFileName = handle.name || "lintu-ai-ilerleme.json";
      await writeLocalFileNow(true);
    } catch (err) {
      if (err && err.name === "AbortError") return;
      setLocalSaveStatus(false, "Doğrudan dosya seçimi kısıtlı (file://); JSON yedeği indirildi.");
      downloadJsonBackup();
    }
  }

  async function openLocalSaveFile() {
    if (typeof window.showOpenFilePicker === "function") {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{
            description: "JSON İlerleme Dosyası",
            accept: { "application/json": [".json"] }
          }]
        });
        const file = await handle.getFile();
        const text = await file.text();
        applyImportedPayload(JSON.parse(text));
        localFileHandle = handle;
        localFileName = handle.name || "lintu-ai-ilerleme.json";
        setLocalSaveStatus(true, `Yerel dosya bağlandı: ${localFileName}`);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
        // Düşerse klasik dosya girişine geç
      }
    }
    const input = document.getElementById("importProgressInput");
    if (input) input.click();
  }

  function downloadJsonBackup() {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      state: appState
    };
    const safeName = appState.activeProfile.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || "ekip";
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lintu-ai-ilerleme-${safeName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function buildObsidianMarkdown() {
    const prof = getActiveProfile();
    const today = new Date().toISOString().slice(0, 10);
    const roleLabel = ROLE_LABELS[prof.role] || prof.role;
    const byKey = new Map();
    DATA.ALL_RESOURCES.forEach((r) => byKey.set(resourceKey(r), r));

    const doneItems = [];
    const doingItems = [];
    const starredItems = [];
    const noteItems = [];

    byKey.forEach((item, key) => {
      const st = prof.statuses[key] || "todo";
      const label = `- [${st === "done" ? "x" : " "}] **${item.title}** (${item.year}) — ${item.url}`;
      if (st === "done") doneItems.push(label);
      if (st === "doing") doingItems.push(label);
      if (prof.stars[key]) starredItems.push(`- ★ **${item.title}** — ${item.url}`);
      if (prof.notes[key] && prof.notes[key].trim()) {
        noteItems.push(`### ${item.title}\n${prof.notes[key].trim()}\nKaynak: ${item.url}`);
      }
    });

    return [
      "---",
      "tur: ilerleme-raporu",
      `tarih: ${today}`,
      `profil: ${appState.activeProfile}`,
      `rol: ${roleLabel}`,
      `seviye: ${prof.level}`,
      "etiketler: [ai, lintu, yol-haritasi]",
      "---",
      "",
      `# Lintu AI Yol Haritası İlerleme Özeti — ${appState.activeProfile}`,
      "",
      `- **Rol:** ${roleLabel}`,
      `- **Seviye:** ${prof.level}`,
      `- **Tamamlanan:** ${doneItems.length} / ${byKey.size}`,
      `- **Şu An Çalışılan:** ${doingItems.length}`,
      "",
      "## Çalışıyorum",
      doingItems.length ? doingItems.join("\n") : "- Henüz işaretlenen yok.",
      "",
      "## Tamamlananlar",
      doneItems.length ? doneItems.join("\n") : "- Henüz tamamlanan yok.",
      "",
      "## Yıldızlı (Favori) Kaynaklar",
      starredItems.length ? starredItems.join("\n") : "- Henüz favori yok.",
      "",
      "## Kişisel Notlar",
      noteItems.length ? noteItems.join("\n\n") : "- Henüz not eklenmedi.",
      ""
    ].join("\n");
  }

  function exportObsidianMarkdown() {
    const md = buildObsidianMarkdown();
    const safeName = appState.activeProfile.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || "ekip";
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lintu-ai-ilerleme-${safeName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function applyImportedPayload(parsed) {
    if (!parsed || typeof parsed !== "object") throw new Error("Geçersiz JSON.");
    const candidate = parsed.state ? parsed.state : parsed;
    appState = normalizeState(candidate);
    saveAppState();
    renderProfileControls();
    updateProgressUI();
    rerenderTrackableViews();
  }

  function resourceKey(item) {
    return item.url || item.id;
  }

  function getItemStatus(key) {
    return getActiveProfile().statuses[key] || "todo";
  }

  function setItemStatus(key, status) {
    const prof = getActiveProfile();
    if (status === "todo") {
      delete prof.statuses[key];
    } else {
      prof.statuses[key] = status;
    }
    saveAppState();
    updateProgressUI();
    syncCardStates();
    if (currentTabId === "kutuphane" && activeLibStatus !== "all") {
      renderLibrary();
    }
  }

  function toggleItemStar(key) {
    const prof = getActiveProfile();
    if (prof.stars[key]) {
      delete prof.stars[key];
    } else {
      prof.stars[key] = true;
    }
    saveAppState();
    syncCardStates();
    if (currentTabId === "kutuphane" && activeLibStatus === "starred") {
      renderLibrary();
    }
  }

  function setItemNote(key, text) {
    const prof = getActiveProfile();
    const val = String(text || "");
    if (!val.trim()) {
      delete prof.notes[key];
    } else {
      prof.notes[key] = val;
    }
    saveAppState();
    syncCardStates();
  }

  function isRecommendedItem(item) {
    const prof = getActiveProfile();
    const roles = Array.isArray(item.roles) ? item.roles : [];
    const roleMatch = roles.includes(prof.role) || (prof.level === "Başlangıç" && roles.includes("ortak"));
    if (!roleMatch) return false;
    if (!item.level || !(item.level in LEVEL_ORDER)) return true;
    const itemLvl = LEVEL_ORDER[item.level];
    const profLvl = LEVEL_ORDER[prof.level] ?? 0;
    return Math.abs(itemLvl - profLvl) <= 1;
  }

  function renderItemControlsHtml(key) {
    const prof = getActiveProfile();
    const st = prof.statuses[key] || "todo";
    const starred = Boolean(prof.stars[key]);
    const noteText = prof.notes[key] || "";
    const hasNote = Boolean(noteText.trim());
    return `
      <div class="item-controls">
        <div class="status-pills" role="group" aria-label="Çalışma durumu">
          <button class="status-pill ${st === "todo" ? "active-todo" : ""}" data-action="status" data-status="todo" type="button">Başlanmadı</button>
          <button class="status-pill ${st === "doing" ? "active-doing" : ""}" data-action="status" data-status="doing" type="button">Çalışıyorum</button>
          <button class="status-pill ${st === "done" ? "active-done" : ""}" data-action="status" data-status="done" type="button">Tamamlandı</button>
        </div>
        <button class="star-btn ${starred ? "active" : ""}" data-action="star" type="button" title="Favorilere ekle">${starred ? "★" : "☆"}</button>
        <button class="note-btn ${hasNote ? "has-note" : ""}" data-action="toggle-note" type="button" title="Kişisel not ekle">Not${hasNote ? " ●" : ""}</button>
      </div>
    `;
  }

  function renderNoteBoxHtml(key) {
    const noteText = getActiveProfile().notes[key] || "";
    return `
      <div class="personal-note-box">
        <textarea class="personal-note-input" placeholder="Bu kaynakla ilgili kendi notunu yaz (otomatik kaydedilir)..." data-note-key="${escapeHtml(key)}">${escapeHtml(noteText)}</textarea>
      </div>
    `;
  }

  function syncCardStates() {
    const prof = getActiveProfile();
    document.querySelectorAll("[data-res-key]").forEach((el) => {
      const key = el.getAttribute("data-res-key");
      const st = prof.statuses[key] || "todo";
      const starred = Boolean(prof.stars[key]);
      const noteText = prof.notes[key] || "";
      const hasNote = Boolean(noteText.trim());

      el.classList.toggle("is-done", st === "done");
      el.classList.toggle("is-doing", st === "doing");

      el.querySelectorAll(".status-pill").forEach((btn) => {
        const bSt = btn.getAttribute("data-status");
        btn.classList.toggle("active-todo", st === "todo" && bSt === "todo");
        btn.classList.toggle("active-doing", st === "doing" && bSt === "doing");
        btn.classList.toggle("active-done", st === "done" && bSt === "done");
      });

      const starBtn = el.querySelector(".star-btn");
      if (starBtn) {
        starBtn.classList.toggle("active", starred);
        starBtn.textContent = starred ? "★" : "☆";
      }

      const noteBtn = el.querySelector(".note-btn");
      if (noteBtn) {
        noteBtn.classList.toggle("has-note", hasNote);
        noteBtn.textContent = hasNote ? "Not ●" : "Not";
      }

      const ta = el.querySelector(".personal-note-input");
      if (ta && document.activeElement !== ta && ta.value !== noteText) {
        ta.value = noteText;
      }
    });
  }

  function updateProgressUI() {
    const prof = getActiveProfile();
    const uniqueKeys = new Set(DATA.ALL_RESOURCES.map(resourceKey));
    const total = uniqueKeys.size;
    let doneCount = 0;
    let doingCount = 0;
    uniqueKeys.forEach((k) => {
      const st = prof.statuses[k];
      if (st === "done") doneCount++;
      else if (st === "doing") doingCount++;
    });
    const donePct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const doingPct = total > 0 ? Math.round((doingCount / total) * 100) : 0;

    const progressText = document.getElementById("progressText");
    const fillDone = document.getElementById("progressBarFillDone");
    const fillDoing = document.getElementById("progressBarFillDoing");
    if (progressText) {
      progressText.textContent = doingCount > 0
        ? `${doneCount}/${total} (%${donePct}) · ${doingCount} sürüyor`
        : `${doneCount}/${total} (%${donePct})`;
    }
    if (fillDone) fillDone.style.width = `${donePct}%`;
    if (fillDoing) fillDoing.style.width = `${Math.min(100 - donePct, doingPct)}%`;
  }

  function renderProfileControls() {
    const sel = document.getElementById("profileSelect");
    const roleSel = document.getElementById("profileRoleSelect");
    const lvlSel = document.getElementById("profileLevelSelect");
    if (sel) {
      sel.innerHTML = Object.keys(appState.profiles).map((name) =>
        `<option value="${escapeHtml(name)}" ${name === appState.activeProfile ? "selected" : ""}>${escapeHtml(name)}</option>`
      ).join("");
    }
    const prof = getActiveProfile();
    if (roleSel) roleSel.value = prof.role;
    if (lvlSel) lvlSel.value = prof.level;
  }

  function rerenderTrackableViews() {
    renderTimeline();
    renderInfraModules();
    renderLibrary();
    syncCardStates();
  }

  function badgeClassForType(typeStr) {
    const t = (typeStr || "").toLowerCase();
    if (t.includes("hakemli") || t.includes("derleme") || t.includes("makale")) return "badge-paper";
    if (t.includes("ders") || t.includes("kitap") || t.includes("notu") || t.includes("tarih") || t.includes("kurucu") || t.includes("türkçe") || t.includes("etkileşimli")) return "badge-course";
    if (t.includes("blog") || t.includes("playbook") || t.includes("rapor") || t.includes("yayın") || t.includes("görsel") || t.includes("forum")) return "badge-blog";
    if (t.includes("kod") || t.includes("repo") || t.includes("çerçeve") || t.includes("doküman") || t.includes("kurs")) return "badge-repo";
    if (t.includes("altyapı") || t.includes("hibe") || t.includes("hpc") || t.includes("paket")) return "badge-compute";
    return "badge-neutral";
  }

  function accessBadge(accessStr) {
    const a = (accessStr || "").toLowerCase();
    if (a.includes("paywall") || a.includes("ücretli")) {
      return `<span class="badge badge-paywall">${escapeHtml(accessStr)}</span>`;
    }
    return `<span class="badge badge-neutral">${escapeHtml(accessStr || "Açık Erişim")}</span>`;
  }

  function roleBadges(roles) {
    if (!Array.isArray(roles)) return "";
    return roles
      .map((r) => `<span class="badge badge-neutral">${escapeHtml(ROLE_LABELS[r] || r)}</span>`)
      .join("");
  }

  /* Navigation & Theme */
  function activateTab(tabId, updateHash) {
    if (!TAB_TITLES[tabId]) tabId = "genel-bakis";
    currentTabId = tabId;
    document.querySelectorAll(".tab-panel").forEach((p) => {
      p.classList.toggle("active", p.id === `tab-${tabId}`);
    });
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-tab") === tabId;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    const topbarTitle = document.getElementById("topbarTitle");
    if (topbarTitle) topbarTitle.textContent = TAB_TITLES[tabId];
    updateMascotTip(tabId);

    if (updateHash) {
      try {
        history.replaceState(null, "", `#${tabId}`);
      } catch (e) {
        window.location.hash = tabId;
      }
    }
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) || "dark";
    applyTheme(saved);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY_THEME, next);
      });
    }
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = theme === "light" ? "Koyu Tema" : "Açık Tema";
  }

  /* 0. Beginner Guide */
  function renderBeginnerGuide() {
    const guide = DATA.BEGINNER_GUIDE;
    if (!guide) return;

    const planGrid = document.getElementById("sevenDayPlanGrid");
    if (planGrid) {
      planGrid.innerHTML = guide.sevenDayPlan.map((d) => `
        <article class="card">
          <div class="badge-row">
            <span class="year-pill">${escapeHtml(d.day)}</span>
            <span class="badge badge-course">Başlangıç</span>
          </div>
          <h4 class="card-title">${escapeHtml(d.title)}</h4>
          <p class="small muted">${escapeHtml(d.goal)}</p>
          <ul style="margin:4px 0 0; padding-left:18px; display:flex; flex-direction:column; gap:5px;">
            ${d.steps.map((s) => `<li class="small">${escapeHtml(s)}</li>`).join("")}
          </ul>
        </article>
      `).join("");
    }

    const helpGrid = document.getElementById("helpChannelsGrid");
    if (helpGrid) {
      helpGrid.innerHTML = guide.helpChannels.map((h) => `
        <article class="card">
          <div class="card-head">
            <h4 class="card-title">${escapeHtml(h.name)}</h4>
            <span class="badge badge-compute">${escapeHtml(h.tag)}</span>
          </div>
          <div class="card-body"><p class="small">${escapeHtml(h.when)}</p></div>
          <div class="card-foot">
            <span></span>
            <div style="display:flex; gap:6px;">
              ${h.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(h.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Ek Link ↗</a>` : ""}
              <a class="btn btn-primary btn-xs" href="${escapeHtml(h.url)}" target="_blank" rel="noopener noreferrer">Siteye Git ↗</a>
            </div>
          </div>
        </article>
      `).join("");
    }

    const stuckGrid = document.getElementById("stuckPromptsGrid");
    if (stuckGrid) {
      stuckGrid.innerHTML = guide.stuckPrompts.map((p, idx) => `
        <article class="card">
          <div class="card-head">
            <h4 class="card-title">${escapeHtml(p.title)}</h4>
            <button class="btn btn-primary btn-xs copy-stuck-btn" data-prompt-idx="${idx}" type="button">Kopyala</button>
          </div>
          <pre class="prompt-box" style="max-height:150px;">${escapeHtml(p.prompt)}</pre>
        </article>
      `).join("");
    }

    const advText = document.getElementById("advisorEmailText");
    if (advText) advText.textContent = guide.advisorEmailTemplate;

    renderGlossary();
  }

  function renderGlossary() {
    const guide = DATA.BEGINNER_GUIDE;
    if (!guide) return;
    const searchEl = document.getElementById("glossarySearch");
    const q = (searchEl ? searchEl.value : "").trim().toLowerCase();
    const grid = document.getElementById("glossaryGrid");
    const badge = document.getElementById("glossaryCountBadge");
    if (!grid) return;

    const filtered = guide.glossary.filter((g) => {
      if (!q) return true;
      return `${g.term} ${g.plain} ${g.analogy} ${g.module}`.toLowerCase().includes(q);
    });

    if (badge) badge.textContent = `${filtered.length} terim`;

    grid.innerHTML = filtered.map((g) => `
      <article class="card">
        <div class="card-head">
          <h4 class="card-title">${escapeHtml(g.term)}</h4>
          <span class="badge badge-neutral">${escapeHtml(g.module)}</span>
        </div>
        <div class="card-body">
          <p class="small">${escapeHtml(g.plain)}</p>
          <p class="small muted" style="margin-top:6px;"><strong>Benzetme:</strong> ${escapeHtml(g.analogy)}</p>
        </div>
      </article>
    `).join("");
  }

  /* 1. Overview */
  function renderOverview() {
    const paperCount = DATA.ALL_RESOURCES.filter((r) => r.id.startsWith("res-p")).length;
    const statsEl = document.getElementById("heroStats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="fact-box"><span class="n grad-text">${paperCount}</span><span class="l">Doğrulanmış Akademik Makale (1943–2026)</span></div>
        <div class="fact-box"><span class="n grad-text">${DATA.STORY_ARCS ? DATA.STORY_ARCS.length : 7} Perde</span><span class="l">Nedensellik Olay Örgüsü + 10 Altyapı Modülü</span></div>
        <div class="fact-box"><span class="n grad-text">${DATA.CREDENTIAL_AUDIT.length}</span><span class="l">Nitelik Denetimli Blog, Kurs &amp; Repo</span></div>
        <div class="fact-box"><span class="n grad-text">${DATA.ALL_RESOURCES.length}</span><span class="l">Toplam Tekilleştirilmiş Kaynak</span></div>
      `;
    }

    const grid = document.getElementById("realityBenchmarksGrid");
    if (grid) {
      grid.innerHTML = DATA.REALITY_BENCHMARKS.map((b) => {
        const badgeCls = b.verdictType === "ok" ? "badge-paper" : b.verdictType === "warn" ? "badge-blog" : "badge-paywall";
        return `
          <article class="card">
            <div class="card-head">
              <h4 class="card-title">${escapeHtml(b.title)}</h4>
              <span class="badge ${badgeCls}">${escapeHtml(b.verdict)}</span>
            </div>
            <div class="card-meta"><strong>${escapeHtml(b.metric)}</strong></div>
            <div class="card-body">
              <p>${escapeHtml(b.summary)}</p>
              <p class="small muted"><strong>Ekibe Çıkarım:</strong> ${escapeHtml(b.takeaway)}</p>
            </div>
            <div class="card-foot">
              <span class="small muted">${escapeHtml(b.sourceLabel)}</span>
              <a class="btn btn-xs" href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer">Kaynağa Git ↗</a>
            </div>
          </article>
        `;
      }).join("");
    }

    const ethicsFootnote = document.getElementById("ethicsFootnote");
    if (ethicsFootnote) ethicsFootnote.textContent = DATA.meta.ethicsFootNote;
  }

  /* 2. Story Arcs & Chronological Timeline */
  function switchHistoryView(mode) {
    const storyBtn = document.getElementById("viewStoryBtn");
    const chronoBtn = document.getElementById("viewChronoBtn");
    const storySec = document.getElementById("storyArcSection");
    const chronoSec = document.getElementById("chronoSection");
    const isStory = mode === "story";
    if (storyBtn) storyBtn.classList.toggle("active", isStory);
    if (chronoBtn) chronoBtn.classList.toggle("active", !isStory);
    if (storySec) storySec.style.display = isStory ? "block" : "none";
    if (chronoSec) chronoSec.style.display = isStory ? "none" : "block";
  }

  function renderStoryArcs() {
    const container = document.getElementById("storyArcContainer");
    if (!container || !Array.isArray(DATA.STORY_ARCS)) return;

    const tlMap = new Map();
    DATA.TIMELINE_ITEMS.forEach((t) => tlMap.set(t.id, t));

    container.innerHTML = DATA.STORY_ARCS.map((arc) => `
      <article class="story-arc-card">
        <div class="eyebrow">${escapeHtml(arc.act)}</div>
        <h3 style="margin:4px 0 8px; font-size:1.25rem;">${escapeHtml(arc.title)}</h3>
        <div class="arc-beats">
          <div class="arc-beat">
            <div class="arc-beat-label">1. Sahne</div>
            <p class="small" style="margin:0;">${escapeHtml(arc.scene)}</p>
          </div>
          <div class="arc-beat wall">
            <div class="arc-beat-label">2. Çarpılan Duvar</div>
            <p class="small" style="margin:0;">${escapeHtml(arc.wall)}</p>
          </div>
          <div class="arc-beat breakthrough">
            <div class="arc-beat-label">3. Kırılma Anı</div>
            <p class="small" style="margin:0;">${escapeHtml(arc.breakthrough)}</p>
          </div>
        </div>
        <div class="arc-bridge"><strong>Sonraki Perdeye Köprü:</strong> ${escapeHtml(arc.bridge)}</div>
        <div class="arc-paper-chips">
          ${arc.paperIds.map((pid) => {
            const p = tlMap.get(pid);
            if (!p) return "";
            const shortTitle = p.title.length > 42 ? p.title.slice(0, 40) + "…" : p.title;
            return `<button class="arc-paper-chip" data-jump-tl="${escapeHtml(p.id)}" type="button"><span class="mono" style="color:var(--brand);">${escapeHtml(p.year)}</span> · ${escapeHtml(shortTitle)}</button>`;
          }).join("")}
        </div>
      </article>
    `).join("");
  }

  function jumpToTimelineItem(tlId) {
    switchHistoryView("chrono");
    activeTimelineEra = "all";
    document.querySelectorAll("#timelineEraChips .chip").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-era") === "all");
    });
    const searchEl = document.getElementById("timelineSearch");
    if (searchEl) searchEl.value = "";
    renderTimeline();

    const target = document.querySelector(`[data-tl-id="${CSS.escape ? CSS.escape(tlId) : tlId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("flash-highlight");
      setTimeout(() => target.classList.remove("flash-highlight"), 2200);
    }
  }

  function renderTimeline() {
    const searchInput = document.getElementById("timelineSearch");
    const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const container = document.getElementById("timelineContainer");
    if (!container) return;

    const filtered = DATA.TIMELINE_ITEMS.filter((item) => {
      if (activeTimelineEra !== "all" && item.era !== activeTimelineEra) return false;
      if (!q) return true;
      const hay = `${item.year} ${item.title} ${item.authors} ${item.venue} ${item.whyItMatters} ${item.whatYouLearn}`.toLowerCase();
      return hay.includes(q);
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="callout">Arama kriterine uyan dönüm noktası bulunamadı.</div>`;
      return;
    }

    container.innerHTML = filtered.map((item) => {
      const key = resourceKey(item);
      const st = getItemStatus(key);
      const rec = isRecommendedItem(item);
      return `
        <article class="card timeline-item ${st === "done" ? "is-done" : st === "doing" ? "is-doing" : ""} ${rec ? "is-recommended" : ""}" data-res-key="${escapeHtml(key)}" data-tl-id="${escapeHtml(item.id)}">
          <div class="card-head">
            <div>
              <div class="badge-row" style="margin-bottom:6px;">
                <span class="year-pill">${escapeHtml(item.year)}</span>
                <span class="badge ${badgeClassForType(item.credibilityType)}">${escapeHtml(item.credibilityType)}</span>
                ${accessBadge(item.accessStatus)}
                ${rec ? `<span class="badge badge-rec">✨ Önerilen</span>` : ""}
              </div>
              <h3 class="card-title">${escapeHtml(item.title)}</h3>
              <div class="card-meta">${escapeHtml(item.authors)} • <em>${escapeHtml(item.venue)}</em></div>
            </div>
            ${renderItemControlsHtml(key)}
          </div>
          <div class="card-body">
            <p><strong>Neden Dönüm Noktası?</strong> ${escapeHtml(item.whyItMatters)}</p>
            <p class="small muted"><strong>Buradan Ne Öğreneceksin?</strong> ${escapeHtml(item.whatYouLearn)}</p>
            ${renderNoteBoxHtml(key)}
          </div>
          <div class="card-foot">
            <div class="badge-row">${roleBadges(item.roles)}</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${item.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(item.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Ek Bağlantı ↗</a>` : ""}
              <a class="btn btn-primary btn-xs" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Makaleyi Aç ↗</a>
            </div>
          </div>
        </article>
      `;
    }).join("");

    const synGrid = document.getElementById("historySynthesisGrid");
    if (synGrid && synGrid.childElementCount === 0) {
      synGrid.innerHTML = DATA.HISTORY_SYNTHESIS.map((h) => `
        <article class="card">
          <div class="card-head">
            <h4 class="card-title">${escapeHtml(h.title)}</h4>
            <span class="badge ${badgeClassForType(h.credibilityType)}">${escapeHtml(h.credibilityType)}</span>
          </div>
          <div class="card-meta">${escapeHtml(h.author)} • ${escapeHtml(h.venue)}</div>
          <div class="card-body"><p>${escapeHtml(h.note)}</p></div>
          <div class="card-foot">
            <span></span>
            <div style="display:flex; gap:6px;">
              ${h.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(h.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Ana Portal ↗</a>` : ""}
              <a class="btn btn-primary btn-xs" href="${escapeHtml(h.url)}" target="_blank" rel="noopener noreferrer">Kaynağı Aç ↗</a>
            </div>
          </div>
        </article>
      `).join("");
    }
  }

  /* 3. Infrastructure Modules */
  function renderInfraModules() {
    const container = document.getElementById("infraModulesContainer");
    if (!container) return;

    const filtered = DATA.INFRA_MODULES.filter((m) => {
      if (activeInfraRole === "all") return true;
      return Array.isArray(m.roles) && m.roles.includes(activeInfraRole);
    });

    container.innerHTML = filtered.map((m, idx) => `
      <div class="module-card ${idx === 0 ? "open" : ""}" id="${escapeHtml(m.id)}">
        <button class="module-header" type="button" aria-expanded="${idx === 0 ? "true" : "false"}">
          <div class="module-title-wrap">
            <div class="badge-row">
              <span class="year-pill">${escapeHtml(m.number)}</span>
              <span class="badge badge-neutral">${escapeHtml(m.level)}</span>
              ${roleBadges(m.roles)}
            </div>
            <div class="module-title">${escapeHtml(m.title)}</div>
            <div class="module-summary">${escapeHtml(m.summary)}</div>
          </div>
          <span class="module-chevron">▾</span>
        </button>
        <div class="module-body">
          <div class="callout callout-ok" style="margin-top:0;">
            <h4>Neden Bu Aşamada?</h4>
            <p>${escapeHtml(m.whyBeforeCoding)}</p>
          </div>
          <div class="grid-2">
            ${m.resources.map((r) => {
              const key = r.url;
              const st = getItemStatus(key);
              return `
                <article class="card ${st === "done" ? "is-done" : st === "doing" ? "is-doing" : ""}" data-res-key="${escapeHtml(key)}">
                  <div class="card-head">
                    <div>
                      <span class="badge ${badgeClassForType(r.type)}">${escapeHtml(r.type)}</span>
                      <h4 class="card-title" style="margin-top:6px;">${escapeHtml(r.title)}</h4>
                    </div>
                    ${renderItemControlsHtml(key)}
                  </div>
                  <div class="card-body">
                    <p class="small">${escapeHtml(r.why)}</p>
                    ${renderNoteBoxHtml(key)}
                  </div>
                  <div class="card-foot">
                    <span></span>
                    <div style="display:flex; gap:6px;">
                      ${r.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(r.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Ek Link ↗</a>` : ""}
                      <a class="btn btn-primary btn-xs" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>
                    </div>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `).join("");
  }

  /* 4. Calculators */
  function updateVramCalc() {
    const paramsM = Number(document.getElementById("vramParamsM").value) || 124;
    const mode = document.getElementById("vramMode").value;
    const batch = Math.max(1, Number(document.getElementById("vramBatch").value) || 1);
    const seq = Math.max(64, Number(document.getElementById("vramSeq").value) || 512);
    const hidden = Math.max(64, Number(document.getElementById("vramHidden").value) || 768);
    const layers = Math.max(1, Number(document.getElementById("vramLayers").value) || 12);
    const gradCkpt = document.getElementById("vramGradCkpt").checked;
    const unsloth = document.getElementById("vramUnsloth").checked;

    document.getElementById("vramParamsLabel").textContent = `${paramsM >= 1000 ? (paramsM / 1000).toFixed(2) + " B" : paramsM + " M"}`;

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

    document.getElementById("vramStaticGb").textContent = `${staticGb.toFixed(2)} GB`;
    document.getElementById("vramActGb").textContent = `${actGb.toFixed(2)} GB`;
    document.getElementById("vramTotalGb").textContent = `${totalGb.toFixed(2)} GB`;
    document.getElementById("vramBreakdownText").textContent = breakdown;

    const gpus = [
      { name: "Colab Free T4 (15 GB)", cap: 15 },
      { name: "Kaggle P100 (16 GB)", cap: 16 },
      { name: "RTX 3090 / 4090 (24 GB)", cap: 24 },
      { name: "Kaggle 2×T4 (32 GB — DDP/Model Split)", cap: 32 },
      { name: "A100 / H100 (80 GB)", cap: 80 }
    ];

    document.getElementById("vramGpuCompat").innerHTML = gpus.map((g) => {
      const fits = totalGb <= g.cap * 0.92;
      return `<span class="gpu-pill ${fits ? "ok" : "no"}">${fits ? "✓ Sığar" : "✕ Aşar"} • ${escapeHtml(g.name)}</span>`;
    }).join("");
  }

  function updateChinchillaCalc() {
    const paramsM = Number(document.getElementById("chParamsM").value) || 124;
    const tokensB = Number(document.getElementById("chTokensB").value) || 2.5;
    const hwTflops = Number(document.getElementById("chHardware").value) || 65;
    const mfu = Number(document.getElementById("chMfu").value) || 35;

    document.getElementById("chParamsLabel").textContent = `${paramsM >= 1000 ? (paramsM / 1000).toFixed(2) + " B" : paramsM + " M"}`;
    document.getElementById("chTokensLabel").textContent = `${tokensB.toFixed(1)} B`;
    document.getElementById("chMfuLabel").textContent = `%${mfu}`;

    const N = paramsM * 1e6;
    const D = tokensB * 1e9;
    const optTokensB = (20 * N) / 1e9;
    const totalFlops = 6 * N * D;
    const effFlopsPerSec = hwTflops * 1e12 * (mfu / 100);
    const hours = totalFlops / effFlopsPerSec / 3600;
    const ratio = D / N;

    document.getElementById("chOptimalTokens").textContent = `${optTokensB.toFixed(2)} B Token`;
    document.getElementById("chTotalFlops").textContent = `${totalFlops.toExponential(2)} FLOPs`;
    document.getElementById("chEstHours").textContent = hours < 1 ? `${(hours * 60).toFixed(1)} dk` : `${hours.toFixed(1)} saat`;

    let ratioMsg = `Token / Parametre oranı: ${ratio.toFixed(1)}×. `;
    if (ratio < 15) {
      ratioMsg += "Chinchilla optimali (~20×) altında: Model veri açısından eksik eğitilmiş (undertrained) kalabilir.";
    } else if (ratio <= 25) {
      ratioMsg += "Chinchilla (~20×) hesaplama-optimal bölgesinde: Eğitim bütçesi en verimli dengede.";
    } else {
      ratioMsg += "Chinchilla ötesi aşırı-eğitim (overtraining) bölgesi: TinyLlama/SmolLM2 gibi küçük modeli uzun süre eğiterek çıkarım hızını koruma stratejisi.";
    }
    document.getElementById("chRatioNote").textContent = ratioMsg;
  }

  /* 5. Zero Budget & Free Compute */
  function renderFreeCompute() {
    const grid = document.getElementById("freeComputeGrid");
    if (grid) {
      grid.innerHTML = DATA.FREE_COMPUTE.resources.map((r) => `
        <article class="card">
          <div class="card-head">
            <div>
              <span class="badge badge-compute">${escapeHtml(r.provider)}</span>
              <h4 class="card-title" style="margin-top:6px;">${escapeHtml(r.name)}</h4>
            </div>
          </div>
          <div class="card-body">
            <p><strong>Doğrulanmış Kota / İmkân:</strong> ${escapeHtml(r.quota)}</p>
            <p class="small muted"><strong>Sınır &amp; Şartlar:</strong> ${escapeHtml(r.limits)}</p>
            <p class="small"><strong>5 Kişilik Ekip İçin Kullanım:</strong> ${escapeHtml(r.bestFor)}</p>
          </div>
          <div class="card-foot">
            <span></span>
            <div style="display:flex; gap:6px;">
              ${r.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(r.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Kılavuz / Portal ↗</a>` : ""}
              <a class="btn btn-primary btn-xs" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Resmî Sayfa ↗</a>
            </div>
          </div>
        </article>
      `).join("");
    }

    const ladder = document.getElementById("zeroBudgetLadder");
    if (ladder) {
      ladder.innerHTML = DATA.FREE_COMPUTE.ladder.map((l) => `
        <article class="card">
          <h4 class="card-title grad-text">${escapeHtml(l.step)}</h4>
          <div class="card-meta"><strong>Donanım:</strong> ${escapeHtml(l.hardware)}</div>
          <div class="card-body">
            <p><strong>Hedef:</strong> ${escapeHtml(l.goal)}</p>
            <p class="small muted"><strong>Neden Bu Sıra?</strong> ${escapeHtml(l.why)}</p>
          </div>
        </article>
      `).join("");
    }
  }

  /* 6. AI Tutor Science */
  function copyTextWithFeedback(text, btn, defaultLabel) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Kopyalandı ✓";
        setTimeout(() => { btn.textContent = defaultLabel; }, 1800);
      });
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btn.textContent = "Kopyalandı ✓";
      setTimeout(() => { btn.textContent = defaultLabel; }, 1800);
    }
  }

  function renderAiTutor() {
    const intro = document.getElementById("aiTutorIntro");
    if (intro) intro.textContent = DATA.AI_TUTOR_SCIENCE.intro;

    const grid = document.getElementById("aiStudiesGrid");
    if (grid) {
      grid.innerHTML = DATA.AI_TUTOR_SCIENCE.studies.map((s) => `
        <article class="card">
          <div class="card-head">
            <h4 class="card-title">${escapeHtml(s.title)}</h4>
            <span class="badge badge-paper">${escapeHtml(s.venue)}</span>
          </div>
          <div class="card-meta">${escapeHtml(s.authors)}</div>
          <div class="card-body"><p>${escapeHtml(s.finding)}</p></div>
          <div class="card-foot">
            <span></span>
            <a class="btn btn-primary btn-xs" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">Makaleyi Aç ↗</a>
          </div>
        </article>
      `).join("");
    }

    const rulesEl = document.getElementById("aiRulesList");
    if (rulesEl) {
      rulesEl.innerHTML = `<ol style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:8px;">
        ${DATA.AI_TUTOR_SCIENCE.rules.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}
      </ol>`;
    }

    const promptEl = document.getElementById("socraticPromptText");
    if (promptEl) promptEl.textContent = DATA.AI_TUTOR_SCIENCE.socraticPrompt;

    const copyBtn = document.getElementById("copyPromptBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyTextWithFeedback(DATA.AI_TUTOR_SCIENCE.socraticPrompt, copyBtn, "İstemi Kopyala");
      });
    }
  }

  /* 7. Team Plan */
  function renderTeamPlan() {
    const rolesGrid = document.getElementById("teamRolesGrid");
    if (rolesGrid) {
      rolesGrid.innerHTML = DATA.TEAM_PLAN.roles.map((r) => `
        <article class="card">
          <h4 class="card-title grad-text">${escapeHtml(r.name)}</h4>
          <div class="card-body">
            <p><strong>Sorumluluk Alanı:</strong> ${escapeHtml(r.focus)}</p>
            <p class="small muted"><strong>İlk Ay Görevi:</strong> ${escapeHtml(r.firstMonthTask)}</p>
          </div>
        </article>
      `).join("");
    }

    const phasesList = document.getElementById("teamPhasesList");
    if (phasesList) {
      phasesList.innerHTML = DATA.TEAM_PLAN.phases.map((p) => `
        <article class="card">
          <h4 class="card-title">${escapeHtml(p.phase)}</h4>
          <div class="card-meta"><strong>Amaç:</strong> ${escapeHtml(p.objective)}</div>
          <div class="card-body">
            <ul style="margin:6px 0 0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
              ${p.milestones.map((m) => `<li class="small">${escapeHtml(m)}</li>`).join("")}
            </ul>
          </div>
        </article>
      `).join("");
    }
  }

  /* 8. Credential Audit */
  function initAuditFilters() {
    const sel = document.getElementById("auditCategorySelect");
    if (!sel) return;
    Array.from(new Set(DATA.CREDENTIAL_AUDIT.map((a) => a.category))).sort().forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  function renderAuditTable() {
    const q = (document.getElementById("auditSearch").value || "").trim().toLowerCase();
    const cat = document.getElementById("auditCategorySelect").value;
    const tbody = document.getElementById("auditTableBody");
    const badge = document.getElementById("auditCountBadge");
    if (!tbody) return;

    const filtered = DATA.CREDENTIAL_AUDIT.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!q) return true;
      return `${a.resourceName} ${a.category} ${a.authorCredentials} ${a.caveat}`.toLowerCase().includes(q);
    });

    if (badge) badge.textContent = `${filtered.length} kaynak`;

    tbody.innerHTML = filtered.map((a) => `
      <tr>
        <td>
          <strong><a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.resourceName)} ↗</a></strong>
          <div style="margin-top:6px;"><span class="badge ${badgeClassForType(a.category)}">${escapeHtml(a.category)}</span></div>
        </td>
        <td>${escapeHtml(a.authorCredentials)}</td>
        <td><div class="caveat-box">${escapeHtml(a.caveat)}</div></td>
      </tr>
    `).join("");
  }

  /* 9. Full Library */
  function initLibraryFilters() {
    const catSel = document.getElementById("libCategorySelect");
    const typeSel = document.getElementById("libTypeSelect");
    if (!catSel || !typeSel) return;

    Array.from(new Set(DATA.ALL_RESOURCES.map((r) => r.category))).sort().forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      catSel.appendChild(opt);
    });

    Array.from(new Set(DATA.ALL_RESOURCES.map((r) => r.type))).sort().forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      typeSel.appendChild(opt);
    });
  }

  function renderLibrary() {
    const q = (document.getElementById("libSearch").value || "").trim().toLowerCase();
    const cat = document.getElementById("libCategorySelect").value;
    const typ = document.getElementById("libTypeSelect").value;
    const lvl = document.getElementById("libLevelSelect").value;
    const role = document.getElementById("libRoleSelect").value;
    const prof = getActiveProfile();

    const grid = document.getElementById("libraryGrid");
    const badge = document.getElementById("libCountBadge");
    if (!grid) return;

    const filtered = DATA.ALL_RESOURCES.filter((r) => {
      const key = resourceKey(r);
      const st = prof.statuses[key] || "todo";
      if (cat !== "all" && r.category !== cat) return false;
      if (typ !== "all" && r.type !== typ) return false;
      if (lvl !== "all" && r.level !== lvl) return false;
      if (role !== "all" && (!Array.isArray(r.roles) || !r.roles.includes(role))) return false;

      if (activeLibStatus === "doing" && st !== "doing") return false;
      if (activeLibStatus === "done" && st !== "done") return false;
      if (activeLibStatus === "todo" && st !== "todo") return false;
      if (activeLibStatus === "starred" && !prof.stars[key]) return false;
      if (activeLibStatus === "recommended" && !isRecommendedItem(r)) return false;

      if (!q) return true;
      return `${r.year} ${r.title} ${r.authors} ${r.category} ${r.summary}`.toLowerCase().includes(q);
    });

    if (badge) badge.textContent = `${filtered.length} kaynak`;

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="callout">Seçili filtrelere uyan kaynak bulunamadı.</div>`;
      return;
    }

    grid.innerHTML = filtered.map((r) => {
      const key = resourceKey(r);
      const st = prof.statuses[key] || "todo";
      const rec = isRecommendedItem(r);
      return `
        <article class="card ${st === "done" ? "is-done" : st === "doing" ? "is-doing" : ""} ${rec ? "is-recommended" : ""}" data-res-key="${escapeHtml(key)}">
          <div class="card-head">
            <div>
              <div class="badge-row" style="margin-bottom:6px;">
                <span class="year-pill">${escapeHtml(r.year)}</span>
                <span class="badge ${badgeClassForType(r.type)}">${escapeHtml(r.type)}</span>
                <span class="badge badge-neutral">${escapeHtml(r.level)}</span>
                ${accessBadge(r.access)}
                ${rec ? `<span class="badge badge-rec">✨ Önerilen</span>` : ""}
              </div>
              <h4 class="card-title">${escapeHtml(r.title)}</h4>
              <div class="card-meta">${escapeHtml(r.authors)} • ${escapeHtml(r.category)}</div>
            </div>
            ${renderItemControlsHtml(key)}
          </div>
          <div class="card-body">
            <p class="small">${escapeHtml(r.summary)}</p>
            ${renderNoteBoxHtml(key)}
          </div>
          <div class="card-foot">
            <div class="badge-row">${roleBadges(r.roles)}</div>
            <div style="display:flex; gap:6px;">
              ${r.secondaryUrl ? `<a class="btn btn-xs" href="${escapeHtml(r.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Ek Link ↗</a>` : ""}
              <a class="btn btn-primary btn-xs" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* Lintu Mascot Tour & Contextual Popover */
  function renderTourStep() {
    const steps = DATA.MASCOT_TOUR_STEPS;
    if (!Array.isArray(steps) || steps.length === 0) return;
    if (tourStepIndex < 0) tourStepIndex = 0;
    if (tourStepIndex >= steps.length) tourStepIndex = steps.length - 1;

    const s = steps[tourStepIndex];
    document.getElementById("tourEyebrow").textContent = s.eyebrow;
    document.getElementById("tourTitle").textContent = s.title;
    document.getElementById("tourSay").textContent = s.say;
    document.getElementById("tourPreviewTitle").textContent = s.previewTitle;
    document.getElementById("tourPreviewList").innerHTML = s.previewItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("");

    const dotsEl = document.getElementById("tourDots");
    if (dotsEl) {
      dotsEl.innerHTML = steps.map((st, idx) =>
        `<button class="tour-dot ${idx === tourStepIndex ? "active" : ""}" data-tour-idx="${idx}" type="button" aria-label="Adım ${idx + 1}: ${escapeHtml(st.title)}"></button>`
      ).join("");
    }

    const prevBtn = document.getElementById("tourPrevBtn");
    const nextBtn = document.getElementById("tourNextBtn");
    if (prevBtn) prevBtn.disabled = tourStepIndex === 0;
    if (nextBtn) nextBtn.textContent = tourStepIndex === steps.length - 1 ? "Hadi Başlayalım ✓" : "İleri →";
  }

  function openTour(startIndex) {
    tourStepIndex = typeof startIndex === "number" ? startIndex : 0;
    renderTourStep();
    const modal = document.getElementById("mascotTourModal");
    if (modal) modal.classList.add("open");
    const pop = document.getElementById("mascotPopover");
    if (pop) pop.classList.remove("open");
  }

  function closeTour() {
    const modal = document.getElementById("mascotTourModal");
    if (modal) modal.classList.remove("open");
    const chk = document.getElementById("tourDontShowCheck");
    try {
      if (chk && chk.checked) {
        localStorage.setItem(STORAGE_KEY_TOUR, "1");
      } else {
        localStorage.setItem(STORAGE_KEY_TOUR, "1");
      }
    } catch (e) {}
  }

  function updateMascotTip(tabId) {
    const tips = DATA.MASCOT_TAB_TIPS || {};
    const txt = document.getElementById("mascotPopoverText");
    if (txt) {
      txt.textContent = tips[tabId] || tips["genel-bakis"] || "";
    }
  }

  /* Event Wiring */
  function bindEvents() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn.getAttribute("data-tab"), true));
    });

    const homeBaslangic = document.getElementById("openBaslangicFromHomeBtn");
    const homeStory = document.getElementById("openStoryFromHomeBtn");
    if (homeBaslangic) homeBaslangic.addEventListener("click", () => activateTab("baslangic", true));
    if (homeStory) {
      homeStory.addEventListener("click", () => {
        activateTab("tarih", true);
        switchHistoryView("story");
      });
    }

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (menuToggle && sidebar && backdrop) {
      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        backdrop.classList.toggle("open");
      });
      backdrop.addEventListener("click", closeMobileSidebar);
    }

    const printBtn = document.getElementById("printBtn");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    // Profile Controls
    const profSel = document.getElementById("profileSelect");
    const newProfBtn = document.getElementById("newProfileBtn");
    const roleSel = document.getElementById("profileRoleSelect");
    const lvlSel = document.getElementById("profileLevelSelect");

    if (profSel) {
      profSel.addEventListener("change", () => {
        appState.activeProfile = profSel.value;
        saveAppState();
        renderProfileControls();
        updateProgressUI();
        rerenderTrackableViews();
      });
    }
    if (newProfBtn) {
      newProfBtn.addEventListener("click", () => {
        const name = prompt("Yeni ekip üyesinin adı (örn. Elif, Mert):");
        if (!name || !name.trim()) return;
        const clean = name.trim();
        if (!appState.profiles[clean]) {
          appState.profiles[clean] = createEmptyProfile("ortak", "Başlangıç");
        }
        appState.activeProfile = clean;
        saveAppState();
        renderProfileControls();
        updateProgressUI();
        rerenderTrackableViews();
      });
    }
    if (roleSel) {
      roleSel.addEventListener("change", () => {
        getActiveProfile().role = roleSel.value;
        saveAppState();
        rerenderTrackableViews();
      });
    }
    if (lvlSel) {
      lvlSel.addEventListener("change", () => {
        getActiveProfile().level = lvlSel.value;
        saveAppState();
        rerenderTrackableViews();
      });
    }

    // Delegated Card Clicks (3-state status, star, toggle-note, jump from story arc, copy stuck prompt)
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;

      const statusBtn = target.closest('[data-action="status"]');
      if (statusBtn) {
        const card = statusBtn.closest("[data-res-key]");
        if (card) setItemStatus(card.getAttribute("data-res-key"), statusBtn.getAttribute("data-status"));
        return;
      }

      const starBtn = target.closest('[data-action="star"]');
      if (starBtn) {
        const card = starBtn.closest("[data-res-key]");
        if (card) toggleItemStar(card.getAttribute("data-res-key"));
        return;
      }

      const noteBtn = target.closest('[data-action="toggle-note"]');
      if (noteBtn) {
        const card = noteBtn.closest("[data-res-key]");
        const box = card ? card.querySelector(".personal-note-box") : null;
        if (box) {
          box.classList.toggle("open");
          const ta = box.querySelector("textarea");
          if (box.classList.contains("open") && ta) ta.focus();
        }
        return;
      }

      const jumpChip = target.closest("[data-jump-tl]");
      if (jumpChip) {
        jumpToTimelineItem(jumpChip.getAttribute("data-jump-tl"));
        return;
      }

      const stuckBtn = target.closest(".copy-stuck-btn");
      if (stuckBtn && DATA.BEGINNER_GUIDE) {
        const idx = Number(stuckBtn.getAttribute("data-prompt-idx"));
        const p = DATA.BEGINNER_GUIDE.stuckPrompts[idx];
        if (p) copyTextWithFeedback(p.prompt, stuckBtn, "Kopyala");
      }
    });

    // Personal Note auto-save on input
    document.addEventListener("input", (e) => {
      const ta = e.target;
      if (ta && ta.classList && ta.classList.contains("personal-note-input")) {
        setItemNote(ta.getAttribute("data-note-key"), ta.value);
      }
    });

    // Local Save / Export / Import / Reset
    const linkBtn = document.getElementById("linkLocalFileBtn");
    const openBtn = document.getElementById("openLocalFileBtn");
    const obsBtn = document.getElementById("exportObsidianBtn");
    const exportBtn = document.getElementById("exportProgressBtn");
    const importInput = document.getElementById("importProgressInput");
    const resetBtn = document.getElementById("resetProgressBtn");

    if (linkBtn) linkBtn.addEventListener("click", linkLocalSaveFile);
    if (openBtn) openBtn.addEventListener("click", openLocalSaveFile);
    if (obsBtn) obsBtn.addEventListener("click", exportObsidianMarkdown);
    if (exportBtn) exportBtn.addEventListener("click", downloadJsonBackup);

    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            applyImportedPayload(JSON.parse(String(reader.result)));
            setLocalSaveStatus(false, `Dosyadan yüklendi: ${file.name}`);
          } catch (err) {
            alert("İçe aktarma başarısız: Geçerli bir ilerleme JSON dosyası seçin.");
          }
          importInput.value = "";
        };
        reader.readAsText(file);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm(`${appState.activeProfile} profilinin tüm ilerleme, favori ve not kayıtları sıfırlansın mı?`)) {
          const prof = getActiveProfile();
          prof.statuses = {};
          prof.stars = {};
          prof.notes = {};
          saveAppState();
          updateProgressUI();
          rerenderTrackableViews();
        }
      });
    }

    // Beginner tab listeners
    const copyAdvBtn = document.getElementById("copyAdvisorEmailBtn");
    if (copyAdvBtn && DATA.BEGINNER_GUIDE) {
      copyAdvBtn.addEventListener("click", () => {
        copyTextWithFeedback(DATA.BEGINNER_GUIDE.advisorEmailTemplate, copyAdvBtn, "E-Postayı Kopyala");
      });
    }
    const glSearch = document.getElementById("glossarySearch");
    if (glSearch) glSearch.addEventListener("input", renderGlossary);

    // History view switch + Timeline filters
    const viewStory = document.getElementById("viewStoryBtn");
    const viewChrono = document.getElementById("viewChronoBtn");
    if (viewStory) viewStory.addEventListener("click", () => switchHistoryView("story"));
    if (viewChrono) viewChrono.addEventListener("click", () => switchHistoryView("chrono"));

    const tlSearch = document.getElementById("timelineSearch");
    if (tlSearch) tlSearch.addEventListener("input", renderTimeline);
    document.querySelectorAll("#timelineEraChips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#timelineEraChips .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeTimelineEra = chip.getAttribute("data-era");
        renderTimeline();
      });
    });

    // Infra Modules
    const infraWrap = document.getElementById("infraModulesContainer");
    if (infraWrap) {
      infraWrap.addEventListener("click", (e) => {
        const header = e.target.closest(".module-header");
        if (header) {
          const card = header.closest(".module-card");
          const open = card.classList.toggle("open");
          header.setAttribute("aria-expanded", open ? "true" : "false");
        }
      });
    }
    document.querySelectorAll("#infraRoleChips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#infraRoleChips .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeInfraRole = chip.getAttribute("data-role");
        renderInfraModules();
      });
    });
    const expAll = document.getElementById("infraExpandAllBtn");
    const colAll = document.getElementById("infraCollapseAllBtn");
    if (expAll) {
      expAll.addEventListener("click", () => {
        document.querySelectorAll(".module-card").forEach((c) => {
          c.classList.add("open");
          const h = c.querySelector(".module-header");
          if (h) h.setAttribute("aria-expanded", "true");
        });
      });
    }
    if (colAll) {
      colAll.addEventListener("click", () => {
        document.querySelectorAll(".module-card").forEach((c) => {
          c.classList.remove("open");
          const h = c.querySelector(".module-header");
          if (h) h.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Calculators
    ["vramParamsM", "vramMode", "vramBatch", "vramSeq", "vramHidden", "vramLayers", "vramGradCkpt", "vramUnsloth"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateVramCalc);
        el.addEventListener("change", updateVramCalc);
      }
    });
    ["chParamsM", "chTokensB", "chHardware", "chMfu"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateChinchillaCalc);
        el.addEventListener("change", updateChinchillaCalc);
      }
    });

    // Audit filters
    const audSearch = document.getElementById("auditSearch");
    const audCat = document.getElementById("auditCategorySelect");
    if (audSearch) audSearch.addEventListener("input", renderAuditTable);
    if (audCat) audCat.addEventListener("change", renderAuditTable);

    // Library filters & status chips
    ["libSearch", "libCategorySelect", "libTypeSelect", "libLevelSelect", "libRoleSelect"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", renderLibrary);
        el.addEventListener("change", renderLibrary);
      }
    });
    document.querySelectorAll("#libStatusChips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#libStatusChips .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeLibStatus = chip.getAttribute("data-status");
        renderLibrary();
      });
    });

    // Mascot Tour & Floating Popover
    const openTourBtn = document.getElementById("openTourBtn");
    const tourCloseBtn = document.getElementById("tourCloseBtn");
    const tourPrevBtn = document.getElementById("tourPrevBtn");
    const tourNextBtn = document.getElementById("tourNextBtn");
    const tourModal = document.getElementById("mascotTourModal");
    const tourDots = document.getElementById("tourDots");

    if (openTourBtn) openTourBtn.addEventListener("click", () => openTour(0));
    if (tourCloseBtn) tourCloseBtn.addEventListener("click", closeTour);
    if (tourPrevBtn) {
      tourPrevBtn.addEventListener("click", () => {
        if (tourStepIndex > 0) { tourStepIndex--; renderTourStep(); }
      });
    }
    if (tourNextBtn) {
      tourNextBtn.addEventListener("click", () => {
        const len = (DATA.MASCOT_TOUR_STEPS || []).length;
        if (tourStepIndex < len - 1) {
          tourStepIndex++;
          renderTourStep();
        } else {
          closeTour();
        }
      });
    }
    if (tourDots) {
      tourDots.addEventListener("click", (e) => {
        const dot = e.target.closest(".tour-dot");
        if (dot) {
          tourStepIndex = Number(dot.getAttribute("data-tour-idx")) || 0;
          renderTourStep();
        }
      });
    }
    if (tourModal) {
      tourModal.addEventListener("click", (e) => {
        if (e.target === tourModal) closeTour();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!tourModal || !tourModal.classList.contains("open")) return;
      if (e.key === "Escape") closeTour();
      else if (e.key === "ArrowRight") {
        const len = (DATA.MASCOT_TOUR_STEPS || []).length;
        if (tourStepIndex < len - 1) { tourStepIndex++; renderTourStep(); }
      } else if (e.key === "ArrowLeft") {
        if (tourStepIndex > 0) { tourStepIndex--; renderTourStep(); }
      }
    });

    const fab = document.getElementById("mascotFab");
    const pop = document.getElementById("mascotPopover");
    const popClose = document.getElementById("mascotPopoverClose");
    const popTourBtn = document.getElementById("mascotPopoverTourBtn");
    if (fab && pop) {
      fab.addEventListener("click", () => pop.classList.toggle("open"));
    }
    if (popClose && pop) {
      popClose.addEventListener("click", () => pop.classList.remove("open"));
    }
    if (popTourBtn) {
      popTourBtn.addEventListener("click", () => openTour(0));
    }
  }

  function updateNavCounts() {
    const tl = document.getElementById("navCountTimeline");
    const inf = document.getElementById("navCountInfra");
    const aud = document.getElementById("navCountAudit");
    const lib = document.getElementById("navCountLibrary");
    if (tl) tl.textContent = String(DATA.TIMELINE_ITEMS.length);
    if (inf) inf.textContent = String(DATA.INFRA_MODULES.length);
    if (aud) aud.textContent = String(DATA.CREDENTIAL_AUDIT.length);
    if (lib) lib.textContent = String(DATA.ALL_RESOURCES.length);
  }

  // Test ve dışa aktarım yardımcıları için salt-okunur kanca
  window.__LINTU_ROADMAP__ = {
    buildObsidianMarkdown,
    getState: () => appState
  };

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderProfileControls();
    updateNavCounts();
    renderBeginnerGuide();
    renderOverview();
    renderStoryArcs();
    renderTimeline();
    renderInfraModules();
    updateVramCalc();
    updateChinchillaCalc();
    renderFreeCompute();
    renderAiTutor();
    renderTeamPlan();
    initAuditFilters();
    renderAuditTable();
    initLibraryFilters();
    renderLibrary();
    updateProgressUI();
    updateMascotTip(currentTabId);
    bindEvents();

    const hash = (window.location.hash || "").replace(/^#/, "");
    if (hash && TAB_TITLES[hash]) {
      activateTab(hash, false);
    }

    try {
      if (!localStorage.getItem(STORAGE_KEY_TOUR)) {
        openTour(0);
      }
    } catch (e) {}
  });
})();
