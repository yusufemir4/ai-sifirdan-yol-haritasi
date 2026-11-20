# Lintu AI Yol Haritası — Sıfırdan Yapay Zeka Modeli Geliştirme (v2)

Üniversite başındaki ("her şeyin temeli"), bütçesi sıfıra yakın 5 gencin yapay zeka teknolojisini temelden kavraması ve sıfırdan kendi modelini geliştirme sürecini çözmesi için **Lintu marka tasarımıyla** hazırlanmış **%100 kaynaklı, başlangıç destekli, olay örgülü ve etkileşimli** HTML web rehberidir.

- **Canlı GitHub Pages Adresi:** [https://yusufemir4.github.io/ai-sifirdan-yol-haritasi/](https://yusufemir4.github.io/ai-sifirdan-yol-haritasi/)
- **Yerel Kullanım:** Build aracı gerektirmez; `index.html` dosyasını tarayıcıda (`file://` üzerinden bile) doğrudan açabilirsiniz.

## Lintu v2 ile Eklenen Yenilikler

- **Lintu Marka Tasarım Sistemi & Maskot Rehberliği:** `logo-full.png`, `mark.png`, `mascot-head.png` ve `mascot.png` marka görselleri, koyu-öncelikli (`#0e0f11`) Lintu renk tokenları (`#2f97d1 → #65c39f` gradyan ve `#ef3355` maskot vurgusu), 6 adımlı **Lintu Maskot Turu** modalı ve sağ altta bağlamsal **Lintu Rehber** balonu.
- **0. Sıfırdan Başla, Yardım Al & 28 Temel Terim:** Hiç bilmeyenler için 7 günlük başlangıç planı, doğrulanmış ücretsiz yardım kanalları (BTK Akademi, Kaggle Learn, fast.ai, Python Docs, PyTorch Forums, Hugging Face Forums, EleutherAI), 5 kopyalanabilir *"Takıldım"* AI istemi, üniversite danışman hocası için TÜBİTAK 2209-A / TRUBA başvuru e-postası ve günlük benzetmeli 28 terim sözlüğü.
- **Olay Örgüsü (7 Perde) ↔ Kronoloji (82 Makale):** 1943–2026 tarihini sadece yıl listesi değil; her perdede *Sahne → Çarpılan Duvar → Kırılma Anı → Sonraki Perdeye Köprü* nedensellik akışıyla anlatır ve tıklanan makaleye kronolojik listede doğrudan atlar.
- **Gelişmiş Seçim & Bireysel Yerel Kayıt:** Çoklu üye profili (`+ Üye`), profil rol/seviyesine göre **`✨ Önerilen`** kaynak vurgusu, **3 durumlu seçim** (`Başlanmadı` / `Çalışıyorum` / `Tamamlandı`), favori (`★`), kişisel not ve **Yerel Dosya Bağla** (File System Access API ile diskteki gerçek JSON dosyasına otomatik kayıt + JSON / SecondBrain Obsidian `.md` dışa aktarımı).

## Teknik İçerik ve Doğrulama

- **84 Doğrulanmış Akademik Makale** + **30+ Ders, Kitap, Blog & Repo** + **7 Sıfır-Bütçe GPU/Hibe Kaynağı** (`data.js` & `lintu-extras.js`).
- **10 İşlevsel Altyapı Modülü (Modül 0–9)** ve **VRAM / Chinchilla (`C ≈ 6ND`, `16N bayt`) Mühendislik Hesaplayıcıları**.
- **Yazar & Kurum Nitelik Karnesi:** Hakemli dergi dışındaki tüm blog, playbook, kurs ve depoların yazar geçmişi ve dürüst kısıtları denetlenmiştir.
- **Not:** Veri etiği, telif ve KVKK/GDPR süreçleri kullanıcı talebi gereği sonraki faza bırakılmıştır; halka açık model/veri yayını öncesinde ayrıca ele alınmalıdır.

## Dosya Yapısı

- `index.html` — Ana etkileşimli web uygulaması (10 sekme + Lintu Maskot Turu)
- `styles.css` — Lintu marka CSS tokenları, açık/koyu tema, olay örgüsü ve baskı stilleri
- `data.js` — 84 makale, 82 kronolojik dönüm noktası, 10 altyapı modülü ve doğrulanmış bağlantılar
- `lintu-extras.js` — Başlangıç rehberi, 28 terimlik sözlük, 7 perdelik olay örgüsü ve Lintu tur adımları
- `app.js` — Çoklu profil, 3 durumlu seçim, gerçek yerel dosya oto-kaydı, Obsidian `.md` çıktısı ve hesaplayıcılar
- `assets/brand/` — Lintu marka logoları ve maskot görselleri (`logo-full.png`, `mark.png`, `mascot-head.png`, `mascot.png`)
- `.nojekyll` — GitHub Pages statik sunum yapılandırması
