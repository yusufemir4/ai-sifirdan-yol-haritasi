/* Sıfırdan Yapay Zeka Modeli Geliştirme — Etkileşimli Uygulama Mantığı
 * Harici kütüphane yoktur; ES module kullanılmaz, file:// üzerinde doğrudan çalışır.
 */

(function () {
  "use strict";

  const DATA = window.ROADMAP_DATA;
  if (!DATA) {
    console.error("ROADMAP_DATA yüklenemedi.");
    return;
  }

  const STORAGE_KEY_DONE = "ai_roadmap_done_v1";
  const STORAGE_KEY_THEME = "ai_roadmap_theme_v1";

  const TAB_TITLES = {
    "genel-bakis": "1. Genel Bakış & Dürüst Gerçeklik Kontrolü",
    "tarih": "2. Kronolojik Yapay Zeka Tarihi (1943–2026)",
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

  let doneSet = loadDoneSet();
  let activeTimelineEra = "all";
  let activeInfraRole = "all";

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function loadDoneSet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DONE);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch (err) {
      return new Set();
    }
  }

  function saveDoneSet() {
    try {
      localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(Array.from(doneSet)));
    } catch (err) {
      console.warn("localStorage kaydı başarısız:", err);
    }
  }

  function resourceKey(item) {
    return item.url || item.id;
  }

  function isDone(item) {
    return doneSet.has(resourceKey(item));
  }

  function toggleDone(key, checked) {
    if (checked) {
      doneSet.add(key);
    } else {
      doneSet.delete(key);
    }
    saveDoneSet();
    updateProgressUI();
    syncCardStates();
  }

  function syncCardStates() {
    document.querySelectorAll("[data-res-key]").forEach((el) => {
      const key = el.getAttribute("data-res-key");
      const done = doneSet.has(key);
      el.classList.toggle("is-done", done);
      const cb = el.querySelector('input[type="checkbox"].res-done-cb');
      if (cb) cb.checked = done;
    });
  }

  function updateProgressUI() {
    const uniqueKeys = new Set(DATA.ALL_RESOURCES.map(resourceKey));
    const total = uniqueKeys.size;
    let doneCount = 0;
    uniqueKeys.forEach((k) => {
      if (doneSet.has(k)) doneCount++;
    });
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const progressText = document.getElementById("progressText");
    const progressBarFill = document.getElementById("progressBarFill");
    if (progressText) progressText.textContent = `${doneCount} / ${total} (%${pct})`;
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;
  }

  function badgeClassForType(typeStr) {
    const t = (typeStr || "").toLowerCase();
    if (t.includes("hakemli") || t.includes("derleme") || t.includes("makale")) return "badge-paper";
    if (t.includes("ders") || t.includes("kitap") || t.includes("notu") || t.includes("tarih") || t.includes("kurucu")) return "badge-course";
    if (t.includes("blog") || t.includes("playbook") || t.includes("rapor") || t.includes("yayın") || t.includes("görsel")) return "badge-blog";
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

  /* 1. Overview */
  function renderOverview() {
    const paperCount = DATA.ALL_RESOURCES.filter((r) => r.id.startsWith("res-p")).length;
    const statsEl = document.getElementById("heroStats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-box"><div class="stat-value">${paperCount}</div><div class="stat-label">Doğrulanmış Akademik Makale (1943–2026)</div></div>
        <div class="stat-box"><div class="stat-value">${DATA.INFRA_MODULES.length}</div><div class="stat-label">İşlevsel Altyapı Modülü (Sıfırdan İleriye)</div></div>
        <div class="stat-box"><div class="stat-value">${DATA.CREDENTIAL_AUDIT.length}</div><div class="stat-label">Nitelik Denetimi Yapılmış Dış Kaynak</div></div>
        <div class="stat-box"><div class="stat-value">${DATA.ALL_RESOURCES.length}</div><div class="stat-label">Toplam Tekilleştirilmiş Kaynak</div></div>
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

  /* 2. Timeline */
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
      const done = doneSet.has(key);
      return `
        <article class="card timeline-item ${done ? "is-done" : ""}" data-res-key="${escapeHtml(key)}">
          <div class="card-head">
            <div>
              <div class="badge-row" style="margin-bottom:6px;">
                <span class="year-pill">${escapeHtml(item.year)}</span>
                <span class="badge ${badgeClassForType(item.credibilityType)}">${escapeHtml(item.credibilityType)}</span>
                ${accessBadge(item.accessStatus)}
              </div>
              <h3 class="card-title">${escapeHtml(item.title)}</h3>
              <div class="card-meta">${escapeHtml(item.authors)} • <em>${escapeHtml(item.venue)}</em></div>
            </div>
            <label class="done-check">
              <input class="res-done-cb" type="checkbox" ${done ? "checked" : ""} /> Okundu
            </label>
          </div>
          <div class="card-body">
            <p><strong>Neden Dönüm Noktası?</strong> ${escapeHtml(item.whyItMatters)}</p>
            <p class="small muted"><strong>Buradan Ne Öğreneceksin?</strong> ${escapeHtml(item.whatYouLearn)}</p>
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
              const done = doneSet.has(key);
              return `
                <article class="card ${done ? "is-done" : ""}" data-res-key="${escapeHtml(key)}">
                  <div class="card-head">
                    <div>
                      <span class="badge ${badgeClassForType(r.type)}">${escapeHtml(r.type)}</span>
                      <h4 class="card-title" style="margin-top:6px;">${escapeHtml(r.title)}</h4>
                    </div>
                    <label class="done-check"><input class="res-done-cb" type="checkbox" ${done ? "checked" : ""} /> Bitti</label>
                  </div>
                  <div class="card-body"><p class="small">${escapeHtml(r.why)}</p></div>
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
      // 2N weights + 2N grads + 12N FP32 master+m+v = 16N (EleutherAI Transformer Math 101)
      staticBytes = 16 * N;
      elemBytes = 2;
      breakdown = "Mixed Precision (BF16/FP16) + AdamW: 2N ağırlık + 2N gradyan + 12N FP32 (master + m + v) = 16N bayt.";
    } else if (mode === "fp32") {
      staticBytes = 16 * N;
      elemBytes = 4;
      breakdown = "Tam FP32 + AdamW: 4N ağırlık + 4N gradyan + 8N AdamW (m + v) = 16N bayt + daha büyük FP32 aktivasyonlar.";
    } else {
      // 4-bit QLoRA: ~0.5N taban + ~%1.5 LoRA adaptör × 16 bayt
      staticBytes = 0.5 * N + 0.015 * N * 16;
      elemBytes = 2;
      breakdown = "4-bit QLoRA: ~0.5N (4-bit dondurulmuş taban) + %1.5 eğitilebilir LoRA adaptörü × 16 bayt (AdamW).";
    }

    // Planlama amaçlı şeffaf aktivasyon kestirimi
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
      const fits = totalGb <= g.cap * 0.92; // %8 güvenli pay
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
          <h4 class="card-title" style="color:var(--accent);">${escapeHtml(l.step)}</h4>
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
        const text = DATA.AI_TUTOR_SCIENCE.socraticPrompt;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = "Kopyalandı ✓";
            setTimeout(() => { copyBtn.textContent = "İstemi Kopyala"; }, 1800);
          });
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          copyBtn.textContent = "Kopyalandı ✓";
          setTimeout(() => { copyBtn.textContent = "İstemi Kopyala"; }, 1800);
        }
      });
    }
  }

  /* 7. Team Plan */
  function renderTeamPlan() {
    const rolesGrid = document.getElementById("teamRolesGrid");
    if (rolesGrid) {
      rolesGrid.innerHTML = DATA.TEAM_PLAN.roles.map((r) => `
        <article class="card">
          <h4 class="card-title" style="color:var(--accent);">${escapeHtml(r.name)}</h4>
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
    const cats = Array.from(new Set(DATA.CREDENTIAL_AUDIT.map((a) => a.category))).sort();
    cats.forEach((c) => {
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
    const onlyUnread = document.getElementById("libOnlyUnread").checked;

    const grid = document.getElementById("libraryGrid");
    const badge = document.getElementById("libCountBadge");
    if (!grid) return;

    const filtered = DATA.ALL_RESOURCES.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (typ !== "all" && r.type !== typ) return false;
      if (lvl !== "all" && r.level !== lvl) return false;
      if (role !== "all" && (!Array.isArray(r.roles) || !r.roles.includes(role))) return false;
      if (onlyUnread && isDone(r)) return false;
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
      const done = doneSet.has(key);
      return `
        <article class="card ${done ? "is-done" : ""}" data-res-key="${escapeHtml(key)}">
          <div class="card-head">
            <div>
              <div class="badge-row" style="margin-bottom:6px;">
                <span class="year-pill">${escapeHtml(r.year)}</span>
                <span class="badge ${badgeClassForType(r.type)}">${escapeHtml(r.type)}</span>
                <span class="badge badge-neutral">${escapeHtml(r.level)}</span>
                ${accessBadge(r.access)}
              </div>
              <h4 class="card-title">${escapeHtml(r.title)}</h4>
              <div class="card-meta">${escapeHtml(r.authors)} • ${escapeHtml(r.category)}</div>
            </div>
            <label class="done-check"><input class="res-done-cb" type="checkbox" ${done ? "checked" : ""} /> Okundu</label>
          </div>
          <div class="card-body"><p class="small">${escapeHtml(r.summary)}</p></div>
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

  /* Event Wiring */
  function bindEvents() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn.getAttribute("data-tab"), true));
    });

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

    // Checkbox delegation for all cards
    document.addEventListener("change", (e) => {
      if (e.target && e.target.classList.contains("res-done-cb")) {
        const card = e.target.closest("[data-res-key]");
        if (card) {
          toggleDone(card.getAttribute("data-res-key"), e.target.checked);
        }
      }
    });

    // Progress Export / Import / Reset
    const exportBtn = document.getElementById("exportProgressBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const payload = {
          exportedAt: new Date().toISOString(),
          done: Array.from(doneSet)
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ai-yol-haritasi-ilerleme.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    const importInput = document.getElementById("importProgressInput");
    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result));
            const list = Array.isArray(parsed) ? parsed : parsed.done;
            if (!Array.isArray(list)) throw new Error("Geçersiz JSON biçimi.");
            doneSet = new Set(list.map(String));
            saveDoneSet();
            updateProgressUI();
            syncCardStates();
            renderLibrary();
          } catch (err) {
            alert("İçe aktarma başarısız: Geçerli bir ilerleme JSON dosyası seçin.");
          }
          importInput.value = "";
        };
        reader.readAsText(file);
      });
    }

    const resetBtn = document.getElementById("resetProgressBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Tüm okundu/tamamlandı işaretleri sıfırlansın mı?")) {
          doneSet = new Set();
          saveDoneSet();
          updateProgressUI();
          syncCardStates();
          renderLibrary();
        }
      });
    }

    // Timeline events
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

    // Infra module accordion + filter events
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
      if (el) el.addEventListener("input", updateVramCalc);
      if (el) el.addEventListener("change", updateVramCalc);
    });
    ["chParamsM", "chTokensB", "chHardware", "chMfu"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updateChinchillaCalc);
      if (el) el.addEventListener("change", updateChinchillaCalc);
    });

    // Audit filters
    const audSearch = document.getElementById("auditSearch");
    const audCat = document.getElementById("auditCategorySelect");
    if (audSearch) audSearch.addEventListener("input", renderAuditTable);
    if (audCat) audCat.addEventListener("change", renderAuditTable);

    // Library filters
    ["libSearch", "libCategorySelect", "libTypeSelect", "libLevelSelect", "libRoleSelect", "libOnlyUnread"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", renderLibrary);
        el.addEventListener("change", renderLibrary);
      }
    });
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

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    updateNavCounts();
    renderOverview();
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
    bindEvents();

    const hash = (window.location.hash || "").replace(/^#/, "");
    if (hash && TAB_TITLES[hash]) {
      activateTab(hash, false);
    }
  });
})();
