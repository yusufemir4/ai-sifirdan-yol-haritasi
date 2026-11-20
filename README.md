# Sıfırdan Yapay Zeka Modeli Geliştirme — 5 Üniversiteli İçin Bilimsel Yol Haritası

Üniversite başındaki ("her şeyin temeli"), bütçesi sıfıra yakın 5 gencin yapay zeka teknolojisini temelden kavraması ve sıfırdan kendi modelini geliştirme sürecini adım adım çözmesi için hazırlanmış **%100 kaynaklı, yazar nitelikleri denetlenmiş ve etkileşimli** HTML rehberidir.

- **Canlı GitHub Pages Adresi (Yayınlandıktan Sonra):** [https://yusufemir4.github.io/ai-sifirdan-yol-haritasi/](https://yusufemir4.github.io/ai-sifirdan-yol-haritasi/)
- **Çevrimdışı / Yerel Kullanım:** Harici CDN veya build aracı gerektirmez; `index.html` dosyasını tarayıcıda doğrudan (`file://` üzerinden bile) açabilirsiniz.

## Neler İçerir?

1. **Genel Bakış & Dürüst Gerçeklik Kontrolü:** `TinyStories` (`arXiv:2305.07759`), `llm.c` (`karpathy/llm.c`), `nanochat` (`karpathy/nanochat`), `Chinchilla` (`arXiv:2203.15556`) ve `DeepSeek-V3` (`arXiv:2412.19437`) verileriyle sıfır bütçeyle nelerin mümkün, nelerin gerçek dışı olduğunun şeffaf özeti.
2. **Kronolojik Yapay Zeka Tarihi (1943–2026):** McCulloch & Pitts (1943), Turing (1950), Dartmouth (1955), Backpropagation (1986), LSTM (1997), AlexNet (2012), Attention (2014), Transformer (2017), GPT-1/2/3, Chinchilla, FlashAttention, DeepSeek-V3/R1, OLMo 2, SmolLM2, FineWeb2, TurkishMMLU ve CETVEL (EACL 2026) dahil kronolojik makale zinciri.
3. **10 İşlevsel Altyapı Modülü (Modül 0 – Modül 9):** Linux/Git & Python'dan başlayarak Matematik, Derin Öğrenme Teorisi, Modern Transformer Kodlaması (Pre-LN, RMSNorm, SwiGLU, RoPE, GQA), Veri/Tokenizasyon, GPU/CUDA/Triton, Dağıtık Eğitim, Post-Training/RL (LoRA/QLoRA/DPO/GRPO), Değerlendirme/Serving ve Çok Modlu genişleme.
4. **İnteraktif Mühendislik Hesaplayıcıları:**
   - **GPU VRAM & Ücretsiz GPU Uygunluk Hesaplayıcısı:** EleutherAI *Transformer Math 101* (`16N` bayt kuralı), Mixed Precision (`arXiv:1710.03740`), Gradient Checkpointing (`arXiv:1604.06174`) ve QLoRA (`arXiv:2305.14314`) esaslı planlama aracı.
   - **Chinchilla Ölçekleme & Eğitim FLOPs (`C ≈ 6ND`) Hesaplayıcısı:** Parametre/token oranı ve MFU varsayımlarıyla yaklaşık eğitim süresi kestirimi.
5. **Sıfır Bütçe & Ücretsiz GPU Kaynakları:** Kaggle (~30s/hafta GPU + ~20s/hafta TPU), Google Colab Free (T4), Lightning AI Studios, GitHub Student Pack + Azure for Students (\$100), Google TPU Research Cloud (TRC), TÜBİTAK ULAKBİM TRUBA (ARF-ACC) ve TÜBİTAK 2209-A.
6. **AI Araçlarını Bilimsel Kullanma Protokolü:** Bastani et al. (PNAS, 2025) ve Kestin et al. (Harvard, *Scientific Reports*, 2025) RCT çalışmalarına dayalı 5 kural ve kopyalanabilir **Sokratik AI Eğitmen** sistem istemi.
7. **5 Kişilik Ekip Rolleri & 12 Aylık Faz Planı:** Mimari/Matematik, Veri/Tokenizasyon, GPU/Sistem, Post-Training/RL ve Eval/Servis rolleri.
8. **Yazar & Kurum Nitelik Karnesi:** Hakemli dergi dışındaki her blog, playbook, açık kurs, kitap ve repo için doğrulanmış yazar geçmişi ve dürüst kısıt notları.
9. **Tam Kütüphane & İlerleme Paylaşımı:** `localStorage` okundu takibi ve 5 arkadaş arasında ilerleme paylaşımı için JSON Dışa/İçe Aktar desteği.

## Doğrulama İlkeleri

- Tüm bağlantılar doğrudan kanonik adreslerdir (hiçbir yönlendirme/izleme URL'si veya tahminî arXiv/DOI içermez).
- Yayıncı ödeme duvarı (paywall) riski bulunan klasik dergi makaleleri açıkça işaretlenmiş ve varsa açık arşiv/Semantic Scholar bağlantıları eklenmiştir.
- Kullanıcı talebi gereği veri etiği/telif/KVKK uyum süreçleri sonraki faza bırakılmıştır; kamuya açık yayın öncesi ayrıca ele alınmalıdır.

## Dosya Yapısı

- `index.html` — Ana etkileşimli web uygulaması
- `styles.css` — Açık/koyu tema, duyarlı düzen ve baskı/PDF stilleri
- `data.js` — Doğrulanmış makale, ders, kitap, blog, GPU ve nitelik veritabanı (`window.ROADMAP_DATA`)
- `app.js` — Filtreleme, ilerleme takibi, JSON dışa/içe aktarım ve VRAM/FLOPs hesaplayıcıları
- `.nojekyll` — GitHub Pages statik sunum yapılandırması
- `README.md` — Proje dokümantasyonu
