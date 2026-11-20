# Lintu AI Yol Haritası — Sıfırdan Yapay Zeka Modeli Geliştirme (v3)

Üniversite başındaki ("her şeyin temeli"), bütçesi sıfıra yakın 5 gencin yapay zeka teknolojisini temelden kavraması ve sıfırdan kendi dil modelini geliştirme sürecini çözmesi için **Lintu marka tasarımıyla** hazırlanmış **%100 kaynaklı, seviye ve takvim odaklı, etkileşimli** web rehberidir.

- **Canlı GitHub Pages Adresi:** [https://yusufemir4.github.io/ai-sifirdan-yol-haritasi/](https://yusufemir4.github.io/ai-sifirdan-yol-haritasi/)
- **Yerel Kullanım:** Build aracı veya sunucu gerektirmez; `index.html` dosyasını tarayıcıda (`file://` üzerinden bile) doğrudan açabilirsiniz.

## v3 ile Gelen Yenilikler

- **Ferah Aydınlık Varsayılan Lintu Teması:** Göz yormayan sabah gökyüzü ve nane tonlarında (`#f4f9fb`) aydınlık varsayılan tema; tek tıkla koyu temaya (`data-theme="dark"`) geçiş.
- **6 Seviyeli Müfredat (24 Konu):** Seviye 0'dan (algoritma, Python, Linux/Git, Sokratik AI) Seviye 5'e (değerlendirme, kuantizasyon, vLLM sunum, çok modlu ve açık yayın) kadar net ön koşullar, pratik görevler ve **"Nerede İşe Yarar?"** gerçek mühendislik kutuları.
- **12 Aylık Yıllık & Aylık Takvim (48 Hafta):** 4 çeyreklik (`Ç1–Ç4`) kuş bakışı yıllık plan; başlangıç ayı seçicisi (`Kasım 2026`, `Ocak 2027` veya göreceli `Ay 1`) ile gerçek takvim etiketleri, 5 kişilik ekip odakları ve haftalık görev kontrolü.
- **Zahmetsiz İlerleme & Kısa Sync Kodu (`LINTU3-...`):** `localStorage` + arka planda `IndexedDB` ile çift sessiz otomatik kayıt; cihazlar arası taşıma için kısa `LINTU3-...` kodu / `?sync=` bağlantısı, Obsidian `.md` ve JSON dışa aktarım.
- **Sadeleştirilmiş 6 Sekme:** `Başlangıç`, `Seviyeler`, `Takvim`, `Tarih & Olay Örgüsü`, `Araçlar` (VRAM & Chinchilla/FLOPs hesaplayıcıları, ücretsiz GPU merdiveni, bilimsel AI koçluğu, 5 kişilik ekip planı) ve `Kütüphane & Denetim`.

## Teknik İçerik ve Doğrulama

- **84 Doğrulanmış Akademik Makale** + **140+ Ders, Kitap, Blog & Repo** + **7 Sıfır-Bütçe GPU/Hibe Kaynağı** (`data.js`, `lintu-extras.js`, `v3-curriculum.js`).
- **GPU VRAM (`16N bayt`) & Chinchilla (`C ≈ 6ND`) Hesaplayıcıları** (`TinyStories 10M`, `GPT-2 124M`, `Llama 1B`, `Qwen 7B QLoRA` ön ayarlarıyla).
- **Yazar & Kurum Nitelik Karnesi:** Hakemli dergi dışındaki kaynakların yazar geçmişi ve kısıtları denetlenmiştir.
- **Not:** Veri etiği, telif ve KVKK/GDPR süreçleri sonraki faza bırakılmıştır; halka açık model/veri yayını öncesinde ayrıca ele alınmalıdır.

## Dosya Yapısı

- `index.html` — 6 sekmeli ana uygulama, İlerleme & Yedek modalı ve Lintu Maskot Turu
- `styles.css` — Aydınlık varsayılan Lintu CSS tokenları, koyu tema, seviye/takvim ve baskı stilleri
- `data.js` — 84 makale, 82 kronolojik dönüm noktası, 10 altyapı modülü ve doğrulanmış kaynaklar
- `lintu-extras.js` — 7 günlük başlangıç planı, 28 terimlik sözlük, 7 perdelik olay örgüsü
- `v3-curriculum.js` — 6 seviye (24 konu), 12 aylık / 48 haftalık takvim ve "Nerede İşe Yarar?" eşlemeleri
- `app.js` — Durum yönetimi, `localStorage` + `IndexedDB` oto-kayıt, `LINTU3-` Sync kodu ve hesaplayıcılar
- `assets/brand/` — Lintu marka logoları ve maskot görselleri (`logo-full.png`, `mark.png`, `mascot-head.png`, `mascot.png`)
- `.nojekyll` — GitHub Pages statik sunum yapılandırması
