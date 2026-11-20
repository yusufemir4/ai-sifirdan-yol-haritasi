(function () {
  "use strict";
  const DATA = window.ROADMAP_DATA;
  if (!DATA) return;

  DATA.LEVEL_GROUPS = [
    {
      id: "lvl-0",
      number: 0,
      badge: "Seviye 0",
      title: "Sıfırdan Zemin & Dijital Atölye",
      subtitle: "Kodlama, terminal, Git ve yapay zekâyı doğru öğrenme alışkanlıkları",
      duration: "Ay 1",
      months: [1],
      prerequisites: "Yok — hiç bilmeyenler için başlangıç noktası",
      capstone: "Kurulumsuz Colab/Kaggle üzerinde çalışan ilk Python veri-metin analiz betiği ve GitHub deposu",
      whereUsedOverall: "Yazılım geliştirme, veri bilimi, bulut GPU atölyeleri ve tüm ekip içi kod iş birliğinin ortak tabanıdır.",
      moduleIds: ["mod-0"],
      topics: [
        {
          id: "t-0-1",
          title: "Bilgisayar Bilimi & Algoritma Mantığı",
          summary: "Bellek, döngüler, koşullar, fonksiyonlar, karmaşıklık (Big-O) ve veri yapılarını sıfırdan kavrama.",
          concepts: ["Algoritma", "Değişken & Bellek", "Döngü & Fonksiyon", "Zaman Karmaşıklığı (Big-O)", "Sözlük & Liste"],
          whereUsed: "Model eğitim döngülerindeki darboğazları fark etmek, veri işleme boru hatlarını hızlı yazmak ve teknik mülakatların temelini kurmak için kullanılır.",
          roles: ["ortak"],
          practice: "Bir metindeki kelime frekanslarını sözlük (dict) ile hesaplayıp en sık geçen 10 kelimeyi sıralayan Python fonksiyonu yaz.",
          resourceIds: ["res-c01", "res-b01", "res-c14"]
        },
        {
          id: "t-0-2",
          title: "Python Temelleri & Kurulumsuz Colab/Kaggle",
          summary: "Yerel kurulum stresine girmeden tarayıcıda Python, NumPy dizileri ve Jupyter defterleriyle çalışma.",
          concepts: ["Python 3", "Jupyter Notebook", "NumPy Vektörleri", "Dosya I/O", "Paket Yönetimi (pip)"],
          whereUsed: "Araştırma prototipleri, veri temizleme defterleri ve Hugging Face / PyTorch deneylerinin tamamı bu ortamda başlar.",
          roles: ["ortak", "veri"],
          practice: "Google Colab veya Kaggle Notebook açarak 1000 satırlık bir metin dosyasını okuyup NumPy ile temel istatistiklerini çıkar.",
          resourceIds: ["res-b02", "res-b04", "res-g01", "res-g02"]
        },
        {
          id: "t-0-3",
          title: "Linux Terminal, Git & Ekip İş Akışı",
          summary: "SSH, bash komutları, sanal ortamlar, Git commit/branch/PR akışıyla ekipçe çakışmasız çalışma.",
          concepts: ["Bash Kabuğu", "Git Commit & Branch", "Pull Request", "SSH & Uzak Sunucu", "Sanal Ortam (venv)"],
          whereUsed: "TRUBA, TPU VM veya bulut GPU sunucularında eğitim başlatmak ve 5 kişilik ekipte kodu bozmadan birleştirmek için zorunludur.",
          roles: ["ortak", "sistem"],
          practice: "GitHub üzerinde bir deneme reposu aç; yeni dalda README güncelle, commit at ve Pull Request ile ana dala birleştir.",
          resourceIds: ["res-c02", "res-g03", "res-g04"]
        },
        {
          id: "t-0-4",
          title: "Sokratik AI Kullanımı & Terim Okuryazarlığı",
          summary: "Yapay zekâdan doğrudan kod kopyalamak yerine adım adım soru sorarak öğrenme ve doğrulama disiplini.",
          concepts: ["Sokratik İstem", "Halüsinasyon Kontrolü", "Birim Testi", "Teknik Doküman Okuma", "Aktif Öğrenme"],
          whereUsed: "Araştırmacıların ve mühendislerin yeni kütüphaneleri hızlı öğrenirken temel mühendislik kaslarını köreltmeden üretken kalmasını sağlar.",
          roles: ["ortak"],
          practice: "Anlamadığın bir Python hatasını yapay zekâya 'cevabı verme, sadece ipucu ver' yönergesiyle çözdür ve çözümünü kendi cümlelerinle özetle.",
          resourceIds: ["res-p83", "res-p84", "res-b03"]
        }
      ]
    },
    {
      id: "lvl-1",
      number: 1,
      badge: "Seviye 1",
      title: "Matematik Sezgisi & Klasik ML Çekirdeği",
      subtitle: "Vektör uzayları, türev/geri yayılım, bilgi teorisi ve ilk sinir ağları",
      duration: "Ay 2–3",
      months: [2, 3],
      prerequisites: "Seviye 0",
      capstone: "Sıfırdan yazılmış micrograd benzeri otomatik türev motoru ve PyTorch ile eğitilmiş çok katmanlı sınıflandırıcı",
      whereUsedOverall: "Embedding uzaylarından kayıp fonksiyonlarına, hiperparametre ayarından model hata ayıklamaya kadar tüm derin öğrenmenin dilidir.",
      moduleIds: ["mod-1", "mod-2"],
      topics: [
        {
          id: "t-1-1",
          title: "Lineer Cebir: Vektör, Matris, SVD/Rank",
          summary: "Vektör iç çarpımı, matris çarpımı, özdeğerler, SVD ve düşük rank yaklaşımının geometrik sezgisi.",
          concepts: ["İç Çarpım (Dot Product)", "Matris Çarpımı", "Özdeğer & Özvektör", "SVD", "Düşük Rank (Low-Rank)"],
          whereUsed: "Attention skorları (QK^T), embedding benzerlik araması (RAG) ve LoRA ince ayarındaki düşük ranklı matris ayrıştırmaları doğrudan buna dayanır.",
          roles: ["ortak", "mimari"],
          practice: "NumPy ile iki cümle vektörü arasında kosinüs benzerliği hesapla ve bir matrisin rank-2 yaklaşımını SVD ile üret.",
          resourceIds: ["res-c06", "res-c07", "res-c09"]
        },
        {
          id: "t-1-2",
          title: "Çok Değişkenli Kalkülüs, Zincir Kuralı & Geri Yayılım / micrograd",
          summary: "Kısmi türev, gradyan vektörü, zincir kuralı ve hesaplama grafiği üzerinde otomatik türev (autograd).",
          concepts: ["Kısmi Türev", "Gradyan İnişi", "Zincir Kuralı", "Hesaplama Grafiği", "Backpropagation"],
          whereUsed: "PyTorch autograd motorunun kalbidir; vanishing/exploding gradient sorunlarını teşhis etmek ve özel kayıp fonksiyonu yazmak için şarttır.",
          roles: ["ortak", "mimari", "sistem"],
          practice: "Karpathy'nin micrograd yapısını izleyerek sadece skaler işlemlerle çalışan 100 satırlık bir Value sınıfı ve 2 katmanlı MLP eğit.",
          resourceIds: ["res-c04", "res-p06", "res-c26"]
        },
        {
          id: "t-1-3",
          title: "Olasılık, Bilgi Teorisi / Cross-Entropy / KL & Optimizasyon",
          summary: "Koşullu olasılık, maksimum olabilirlik, entropi, çapraz entropi, KL ıraksaması ve dışbükey optimizasyon.",
          concepts: ["Shannon Entropisi", "Cross-Entropy Loss", "KL Divergence", "Perplexity", "SGD & Momentum"],
          whereUsed: "Dil modellerinin sonraki token tahmin kaybı Cross-Entropy'dir; RLHF/DPO hizalamasında ise modelin sapmasını sınırlamak için KL cezası kullanılır.",
          roles: ["ortak", "posttraining", "eval"],
          practice: "İki olasılık dağılımı arasındaki Cross-Entropy ve KL ıraksamasını NumPy ile hesaplayıp Softmax sıcaklığının (temperature) etkisini çiz.",
          resourceIds: ["res-p02", "res-c08", "res-c10", "res-c11"]
        },
        {
          id: "t-1-4",
          title: "Klasik ML, Genelleme & PyTorch Temel Sinir Ağları",
          summary: "Bias-variance dengesi, düzenlileştirme (L2, Dropout), eğitim/doğrulama ayrımı ve PyTorch nn.Module döngüsü.",
          concepts: ["Overfitting & Genelleme", "Weight Decay", "Dropout", "PyTorch Tensor", "DataLoader"],
          whereUsed: "Her üretim ML sisteminde temel kıyaslama (baseline) kurmak, aşırı öğrenmeyi yakalamak ve PyTorch eğitim döngüsünü hatasız yazmak için kullanılır.",
          roles: ["ortak", "veri", "eval"],
          practice: "PyTorch ile sentetik veya tabular bir veri setinde train/val kayıp eğrilerini izleyen, erken durdurmalı (early stopping) bir MLP eğit.",
          resourceIds: ["res-c12", "res-c20", "res-p12", "res-c45"]
        }
      ]
    },
    {
      id: "lvl-2",
      number: 2,
      badge: "Seviye 2",
      title: "Derin Öğrenme & Sıfırdan Transformer Mimarisi",
      subtitle: "Modern derin ağ stabilitesi, dikkat mekanizması ve ilk küçük dil modelimiz",
      duration: "Ay 4–5",
      months: [4, 5],
      prerequisites: "Seviye 1",
      capstone: "Sıfırdan yazılmış Modern Transformer (RoPE + RMSNorm + SwiGLU + GQA) ve TinyStories üzerinde eğitilmiş 10M–30M parametreli dil modeli",
      whereUsedOverall: "GPT, Llama, Qwen, DeepSeek ve Gemma gibi tüm modern büyük dil modellerinin çekirdek mimarisini oluşturur.",
      moduleIds: ["mod-2", "mod-3"],
      topics: [
        {
          id: "t-2-1",
          title: "Derin Ağ Stabilitesi: Residual, Pre-LN, RMSNorm, AdamW, Cosine",
          summary: "Derin katmanlarda sinyali koruyan artık bağlantılar, ön-normalizasyon, ağırlık başlatma ve öğrenme hızı takvimleri.",
          concepts: ["Residual Connection", "Pre-LayerNorm", "RMSNorm", "AdamW", "Cosine Annealing"],
          whereUsed: "Yüzlerce katmanlı LLM'lerin gradyan patlaması veya çökmesi olmadan günlerce kararlı biçimde eğitilmesini sağlar.",
          roles: ["mimari", "sistem"],
          practice: "Aynı küçük ağı Post-LN ve Pre-LN + RMSNorm ile eğitip gradyan normlarını ve kayıp kararlılığını karşılaştır.",
          resourceIds: ["res-p21", "res-p37", "res-p39"]
        },
        {
          id: "t-2-2",
          title: "Dikkat Mekanizması: Self-Attention, Multi-Head, GQA & RoPE",
          summary: "Sorgu-Anahtar-Değer (QKV) çarpımı, nedensel maske, döner konumsal kodlama (RoPE) ve grup sorgu dikkati (GQA).",
          concepts: ["Scaled Dot-Product Attention", "Causal Mask", "Multi-Head Attention", "RoPE", "Grouped-Query Attention (GQA)"],
          whereUsed: "Uzun bağlam penceresinde (32K–128K+) tutarlılık sağlamak ve çıkarım sırasında KV bellek boyutunu küçültmek için Llama/Qwen serilerinde standarttır.",
          roles: ["mimari"],
          practice: "PyTorch'ta harici kütüphane kullanmadan RoPE ve GQA destekli bir CausalSelfAttention sınıfı yaz ve şekil (shape) testlerinden geçir.",
          resourceIds: ["res-p27", "res-p46", "res-p60", "res-c32"]
        },
        {
          id: "t-2-3",
          title: "Modern LLM Bloğu: SwiGLU, KV-Cache & Sıfırdan nanoGPT",
          summary: "Kapılı doğrusal birimler (SwiGLU), ağırlık paylaşımı (weight tying), KV-Cache ile hızlı üretim ve nanoGPT mimarisi.",
          concepts: ["SwiGLU MLP", "Weight Tying", "KV-Cache", "Autoregressive Decoding", "Top-k / Top-p Sampling"],
          whereUsed: "Sohbet botlarının kelime kelime akıcı yanıt üretirken her adımda tüm geçmişi baştan hesaplamamasını sağlayan KV-Cache üretim sunucularının temelidir.",
          roles: ["mimari", "sistem"],
          practice: "Kendi Transformer bloğunu KV-Cache ile birleştir ve 500 token üretim süresinin önbellekli ve önbelleksiz hız farkını ölç.",
          resourceIds: ["res-p40", "res-p25", "res-c27"]
        },
        {
          id: "t-2-4",
          title: "Küçük Dil Modeli Eğitimi: TinyStories 10M–30M",
          summary: "Küçük ama tutarlı bir dil modelini T4/P100 GPU üzerinde uçtan uca eğitme, doğrulama kaybı ve metin üretimi.",
          concepts: ["Dil Modeli Eğitimi", "Batch & Gradient Accumulation", "Validation Perplexity", "Checkpoint Alma", "Küçük Model Dinamikleri"],
          whereUsed: "Büyük bütçeli eğitime geçmeden önce mimari ve veri boru hattı hatalarını ucuz ve hızlı prototiplerde yakalamak için endüstri standardıdır.",
          roles: ["ortak", "mimari", "veri"],
          practice: "Kaggle/Colab T4 GPU üzerinde TinyStories veri setiyle 15M parametreli bir Transformer eğit ve örnek Türkçe/İngilizce devam metinleri üret.",
          resourceIds: ["res-p59", "res-p69", "res-c16", "res-c22"]
        }
      ]
    },
    {
      id: "lvl-3",
      number: 3,
      badge: "Seviye 3",
      title: "Veri, Türkçe Tokenizasyon & GPU/Sistem Hızlandırma",
      subtitle: "Türkçe dostu tokenizer tasarımı, temiz korpus ve bellek/çekirdek optimizasyonu",
      duration: "Ay 6–7",
      months: [6, 7],
      prerequisites: "Seviye 2",
      capstone: "Türkçe fertilitesi düşük (<1.6 token/kelime) özel BPE tokenizer, tekilleştirilmiş Türkçe mini korpus ve BF16 + FlashAttention ile hızlandırılmış eğitim boru hattı",
      whereUsedOverall: "Türkçe gibi eklemeli dillerde maliyet/hız avantajı sağlar; GPU darboğazlarını kaldırarak aynı donanımda 3–5 kat daha fazla token eğitmeyi mümkün kılar.",
      moduleIds: ["mod-4", "mod-5"],
      topics: [
        {
          id: "t-3-1",
          title: "BPE/SentencePiece Tokenizasyon & Türkçe Fertilite Optimizasyonu",
          summary: "Byte-level BPE ve Unigram algoritmaları, kelime dağarcığı boyutu seçimi ve Türkçe eklemeli yapılarda token verimliliği.",
          concepts: ["Byte-Level BPE", "SentencePiece", "Token Fertilitesi", "Ön-Tokenizasyon (Regex)", "Özel Kontrol Tokenları"],
          whereUsed: "İngilizce odaklı tokenizerlar Türkçe bir kelimeyi 3–4 parçaya böldüğü için bağlam penceresini ve API maliyetini şişirir; yerli modellerde ilk iyileştirme noktasıdır.",
          roles: ["veri", "mimari"],
          practice: "Türkçe haber/edebiyat derlemi üzerinde 32K ve 64K sözlüklü BPE tokenizer eğit; GPT-4/Llama-3 tokenizerları ile Türkçe token/kelime oranını kıyasla.",
          resourceIds: ["res-p20", "res-p32", "res-p62"]
        },
        {
          id: "t-3-2",
          title: "Veri Temizleme, Tekilleştirme & FineWeb2/Sentetik Korpus",
          summary: "Web verisinden gürültü ve PII temizleme, MinHash-LSH ile tekilleştirme (deduplication), kalite filtreleme ve sentetik ders kitapları.",
          concepts: ["MinHash-LSH", "Heuristik Filtreleme", "Dil Tespiti", "Veri Karışım Oranları", "Sentetik Veri"],
          whereUsed: "FineWeb2, Dolma ve SmolLM2 gibi açık modellerin başarısının arkasındaki asıl fark, model mimarisinden çok temiz ve dengeli veri kürasyonudur.",
          roles: ["veri"],
          practice: "Türkçe ham metin kümesi üzerinde tekrar eden paragrafları MinHash/hash ile temizleyen ve token uzunluğuna göre filtreleyen bir veri boru hattı kur.",
          resourceIds: ["res-p73", "res-p81", "res-p65", "res-p80"]
        },
        {
          id: "t-3-3",
          title: "GPU Bellek Hiyerarşisi HBM/SRAM, BF16 Mixed Precision & Activation Checkpointing",
          summary: "GPU bellek bant genişliği sınırları, FP32/BF16 karma hassasiyet, gradyan ve aktivasyon bellek bütçesi hesabı.",
          concepts: ["HBM vs SRAM", "Arithmetic Intensity", "BF16 Mixed Precision", "Activation Checkpointing", "VRAM Bütçeleme"],
          whereUsed: "OOM (Out of Memory) hatalarını çözmek, GPU kullanım oranını (MFU) artırmak ve sınırlı VRAM'e daha büyük bağlam/batch sığdırmak için kritiktir.",
          roles: ["sistem", "mimari"],
          practice: "Eğittiğin modelin parametre, gradyan, AdamW durumu ve aktivasyon VRAM tüketimini teorik olarak hesaplayıp torch.cuda.max_memory_allocated() ile doğrula.",
          resourceIds: ["res-p29", "res-p22", "res-c31", "res-c36"]
        },
        {
          id: "t-3-4",
          title: "FlashAttention, Triton Çekirdekleri & 6ND FLOPs Profilleme",
          summary: "IO-farkında döşemeli dikkat (tiling), Triton ile özel GPU çekirdeği yazımı ve Torch Profiler ile MFU ölçümü.",
          concepts: ["FlashAttention Tiling", "Kernel Fusion", "OpenAI Triton", "6ND FLOPs Formülü", "MFU (Model FLOPs Utilization)"],
          whereUsed: "Uzun bağlam eğitiminde bellek karmaşıklığını O(N^2)'den O(N)'e indirir ve PyTorch kodunun donanım sınırına ne kadar yaklaştığını ölçer.",
          roles: ["sistem"],
          practice: "Triton ile basit bir vektör toplama veya fused RMSNorm çekirdeği yaz; PyTorch Profiler ile eğitim adımındaki en yavaş operatörü bul.",
          resourceIds: ["res-p52", "res-p66", "res-c46", "res-c28"]
        }
      ]
    },
    {
      id: "lvl-4",
      number: 4,
      badge: "Seviye 4",
      title: "Ölçekleme Yasaları, Ön-Eğitim & Post-Training (RL/Hizalama)",
      subtitle: "Compute-optimal planlama, dağıtık eğitim, LoRA/QLoRA ve akıl yürütme odaklı RL",
      duration: "Ay 8–10",
      months: [8, 9, 10],
      prerequisites: "Seviye 3",
      capstone: "Chinchilla yasalarına göre planlanmış dağıtık ön-eğitim koşusu + QLoRA/Unsloth ile talimat (SFT) ve DPO/GRPO ile hizalanmış Türkçe model",
      whereUsedOverall: "Ham metin tamamlayan bir temel modeli (base model), talimatları izleyen, güvenli ve adım adım akıl yürütebilen yardımcı asistana dönüştürür.",
      moduleIds: ["mod-6", "mod-7"],
      topics: [
        {
          id: "t-4-1",
          title: "Kaplan & Chinchilla Ölçekleme Yasalarıyla Sıfır-Bütçe Deney Tasarımı",
          summary: "Hesaplama bütçesine (FLOPs) göre en uygun model boyutu ile token sayısı dengesi ve küçük ölçekten büyük ölçeğe öngörü.",
          concepts: ["Kaplan Yasaları", "Chinchilla (20 Token/Parametre)", "IsoFLOP Eğrileri", "İndirgenemez Kayıp", "Öğrenme Hızı Transferi"],
          whereUsed: "TRUBA veya TRC hibesi almadan önce boşa GPU saati yakmamak için hangi model boyutunun kaç milyar tokenla eğitileceğini bilimsel olarak belirler.",
          roles: ["mimari", "veri", "eval"],
          practice: "3 farklı küçük model boyutunda (ör. 10M, 25M, 50M) eşit FLOPs bütçesiyle deney yapıp IsoFLOP eğrisini çiz ve optimal oranı gözlemle.",
          resourceIds: ["res-p38", "res-p51", "res-c24", "res-c39"]
        },
        {
          id: "t-4-2",
          title: "Dağıtık Eğitim DDP, ZeRO, PyTorch FSDP & TRUBA/TRC Hazırlığı",
          summary: "Veri paralelliği (DDP), optimizer/parametre paylaşımı (ZeRO 1/2/3, FSDP), tensör/boru hattı paralelliği ve küme iş betikleri.",
          concepts: ["DDP & All-Reduce", "ZeRO Aşamaları", "PyTorch FSDP", "Tensor Parallelism", "SLURM İş Betiği"],
          whereUsed: "Tek bir GPU belleğine sığmayan modelleri çoklu GPU veya çoklu düğüm (TRUBA ARF-ACC, TPU Pod) üzerinde ölçeklemek için zorunludur.",
          roles: ["sistem", "mimari"],
          practice: "PyTorch FSDP veya DDP ile çoklu süreç simülasyonu kur ve TRUBA SLURM/TPU TRC başvuru teknik planı taslağını hazırla.",
          resourceIds: ["res-p36", "res-p58", "res-c38", "res-g06"]
        },
        {
          id: "t-4-3",
          title: "Verimli İnce Ayar: SFT, LoRA, QLoRA, Unsloth",
          summary: "Talimat veri formatları (ChatML), kayıp maskeleme (assistant-only loss), düşük rank adaptörleri ve 4-bit kuantize ince ayar.",
          concepts: ["Supervised Fine-Tuning (SFT)", "LoRA (Rank & Alpha)", "QLoRA (NF4)", "Chat Template", "Unsloth Hızlandırma"],
          whereUsed: "Kurumsal veya akademik ekiplerin 16–24 GB VRAM'li tek bir GPU ile 7B–14B modelleri alanına özgü (hukuk, tıp, Türkçe sohbet) uyarlamasının ana yoludur.",
          roles: ["posttraining", "veri"],
          practice: "Unsloth veya Hugging Face PEFT ile açık kaynak bir küçük modeli Türkçe talimat veri seti üzerinde QLoRA ile ince ayar yap.",
          resourceIds: ["res-p47", "res-p61", "res-c40", "res-c41"]
        },
        {
          id: "t-4-4",
          title: "Hizalama & Akıl Yürütme: PPO, DPO, GRPO/RLVR",
          summary: "İnsan tercihinden öğrenme (RLHF/PPO), doğrudan tercih optimizasyonu (DPO) ve doğrulanabilir ödüllerle akıl yürütme (GRPO).",
          concepts: ["RLHF & Ödül Modeli", "PPO Kısıtı", "DPO (Direct Preference Optimization)", "GRPO", "Doğrulanabilir Ödül (RLVR)"],
          whereUsed: "Modelin zararlı/uydurma yanıtları reddetmesi ve DeepSeek-R1 benzeri matematik/kod problemlerinde düşünme zinciri (CoT) geliştirmesi için kullanılır.",
          roles: ["posttraining", "eval"],
          practice: "Seçilmiş/reddedilmiş (chosen/rejected) Türkçe çiftlerle mini bir DPO koşusu veya basit matematik sorularında GRPO ödül fonksiyonu dene.",
          resourceIds: ["res-p28", "res-p50", "res-p63", "res-p79"]
        }
      ]
    },
    {
      id: "lvl-5",
      number: 5,
      badge: "Seviye 5",
      title: "Değerlendirme, Kuantizasyon, Sunum, Çok Modlu & Açık Yayın",
      subtitle: "Bilimsel kıyaslama, hızlı çıkarım sunumu, yorumlanabilirlik ve açık bilim yayını",
      duration: "Ay 11–12",
      months: [11, 12],
      prerequisites: "Seviye 4",
      capstone: "TurkishMMLU & CETVEL ile ölçülmüş, GGUF/AWQ kuantize edilmiş, vLLM ile sunulan ve Hugging Face Model Kartı + teknik raporla yayınlanmış açık Türkçe LLM projesi",
      whereUsedOverall: "Eğitilen modelin laboratuvardan çıkıp gerçek kullanıcılara düşük gecikmeyle ulaşmasını ve bilimsel topluluk tarafından güvenle doğrulanmasını sağlar.",
      moduleIds: ["mod-8", "mod-9"],
      topics: [
        {
          id: "t-5-1",
          title: "Bilimsel Kıyaslama: HELM, lm-eval, TurkishMMLU, CETVEL",
          summary: "Tekrarlanabilir kıyaslama (benchmark) protokolleri, veri sızıntısı (contamination) kontrolü ve Türkçe çok görevli değerlendirme.",
          concepts: ["lm-evaluation-harness", "HELM Boyutları", "TurkishMMLU", "CETVEL", "Veri Sızıntısı Kontrolü"],
          whereUsed: "Model sürümleri arasındaki gerçek ilerlemeyi ölçmek, 'hissiyatla' değil istatistiksel güven aralıklarıyla karar vermek için gereklidir.",
          roles: ["eval", "ortak"],
          practice: "EleutherAI lm-evaluation-harness ile modelini TurkishMMLU alt kümelerinde çalıştır ve sıfır-atış (0-shot) / 5-shot skorlarını raporla.",
          resourceIds: ["res-c37", "res-p75", "res-p82"]
        },
        {
          id: "t-5-2",
          title: "Kuantizasyon GPTQ, AWQ, GGUF & Canlı Sunum vLLM/PagedAttention",
          summary: "Ağırlık/aktivasyon kuantizasyonu (INT4/FP8), yerel GGUF paketleme ve üretimde PagedAttention ile sürekli gruplama (continuous batching).",
          concepts: ["GPTQ & AWQ", "GGUF (llama.cpp)", "PagedAttention", "Continuous Batching", "TTFT & TPS Metrikleri"],
          whereUsed: "Sunucu maliyetlerini %60–75 düşürmek, aynı GPU'da onlarca eşzamanlı kullanıcıya hizmet vermek veya modeli dizüstü bilgisayarda çalıştırmak için kullanılır.",
          roles: ["sistem", "eval"],
          practice: "Modelini 4-bit GGUF veya AWQ formatına dönüştür; FP16 ile kuantize sürüm arasında hız (token/sn) ve doğruluk kaybını karşılaştır.",
          resourceIds: ["res-p54", "res-p64", "res-p67"]
        },
        {
          id: "t-5-3",
          title: "Yorumlanabilirlik & Çok Modlu Genişleme: ViT, CLIP, LLaVA, Whisper",
          summary: "Mekanik yorumlanabilirlik (devreler, logit lens), görsel yama kodlayıcıları (ViT/CLIP), görsel-dil hizalama (LLaVA) ve ses (Whisper).",
          concepts: ["Mekanik Yorumlanabilirlik", "ViT Patch Embedding", "CLIP Kontrastif Öğrenme", "LLaVA Projeksiyonu", "Whisper Ses Kodlama"],
          whereUsed: "Modelin neden hata yaptığını iç katmanlarda teşhis etmek ve metin modelini görüntü/belge/ses anlayan çok modlu asistanlara genişletmek için kullanılır.",
          roles: ["mimari", "posttraining"],
          practice: "Küçük modelinde bir katmanın ara temsillerini logit lens ile incele veya ViT/CLIP gömülerini kullanarak basit bir görsel-metin eşleştirme demosu kur.",
          resourceIds: ["res-c34", "res-p43", "res-p57", "res-p56"]
        },
        {
          id: "t-5-4",
          title: "Açık Bilim Yayını, Hugging Face Model Kartı, TRUBA & TÜBİTAK 2209-A",
          summary: "Tekrarlanabilir kod deposu, şeffaf model kartı, veri/eğitim/değerlendirme raporu ve ulusal araştırma hibesi/yarışma çıktıları.",
          concepts: ["Model Card (Açık Lisans)", "Ablasyon Tablosu", "Tekrarlanabilirlik", "TRUBA Çıktı Raporu", "TÜBİTAK 2209-A"],
          whereUsed: "Akademik makale, TEKNOFEST/TÜBİTAK başvurusu ve açık kaynak topluluğunda güvenilir bir mühendislik portföyü oluşturmanın son adımıdır.",
          roles: ["ortak", "eval"],
          practice: "Tüm yılın eğitim loglarını, ablasyon sonuçlarını ve sınırlılıkları içeren eksiksiz bir Hugging Face Model Kartı ve teknik blog/rapor yayınla.",
          resourceIds: ["res-p76", "res-p78", "res-g06", "res-g07"]
        }
      ]
    }
  ];

  DATA.ANNUAL_CALENDAR = [
    {
      month: 1,
      quarter: "Ç1",
      quarterTitle: "Zemin, Matematik & Klasik ML Çekirdeği",
      phase: "Faz 0 — Dijital Atölye & Temel",
      levelId: "lvl-0",
      levelLabel: "Seviye 0",
      title: "Sıfırdan Kodlama, Terminal, Git & Sokratik Öğrenme",
      summary: "Hiç bilmeyen ekip üyelerinin ortak Python, Linux/Git ve Colab/Kaggle çalışma düzenine geçmesi.",
      whereUsed: "Tüm yıl boyunca kullanılacak bulut GPU defterleri, ekip Git akışı ve hata ayıklama disiplininin temelidir.",
      hoursPerWeek: 10,
      computeStage: "CPU / Ücretsiz Colab & Kaggle Notebook",
      deliverable: "Ekip GitHub reposu, ortak Python stil rehberi ve ilk veri-metin analiz betiği",
      teamFocus: {
        mimari: "Python fonksiyonları ve temel veri yapılarıyla algoritma pratiği.",
        veri: "Dosya okuma, regex ve basit Türkçe metin istatistikleri.",
        sistem: "Linux bash komutları, SSH, venv ve Git branch/PR yönetimi.",
        posttraining: "Sokratik AI istemleriyle hata çözme ve doğrulama günlüğü.",
        eval: "Birim testi (assert/pytest) yazma alışkanlığı kazanma."
      },
      weeks: [
        {
          id: "m01-w1",
          week: 1,
          title: "Bilgisayar Bilimi Mantığı & Kurulumsuz Python",
          tasks: [
            "Colab ve Kaggle hesaplarını açıp ilk Jupyter defterini çalıştır.",
            "Değişkenler, döngüler, koşullar ve fonksiyonlarla 10 küçük alıştırma çöz.",
            "BTK Akademi ve Kaggle Learn Python modüllerini tamamla."
          ],
          whereUsed: "Her deneyin başlangıç ortamı olan defter (notebook) akışını sıfır kurulumla kurar.",
          resourceIds: ["res-c01", "res-b01", "res-b02"]
        },
        {
          id: "m01-w2",
          week: 2,
          title: "Veri Yapıları, NumPy & Dosya İşlemleri",
          tasks: [
            "Liste, sözlük (dict) ve küme (set) yapılarını kelime sayımında uygula.",
            "NumPy dizileriyle vektör toplama, dilimleme ve matris boyutlarını öğren."
          ],
          whereUsed: "Metinleri sayısal tensörlere çevirmeden önceki tüm ön işlemlerde kullanılır.",
          resourceIds: ["res-b04", "res-g01", "res-g02"]
        },
        {
          id: "m01-w3",
          week: 3,
          title: "Linux Terminal, Git & Ekip İş Birliği",
          tasks: [
            "MIT Missing Semester temel kabuk ve Git derslerini uygula.",
            "Ortak GitHub deposunda kendi dalını (branch) açıp ilk Pull Request'i gönder."
          ],
          whereUsed: "5 kişilik ekipte kod çakışmalarını önler ve uzak GPU sunucularını yönetmeyi sağlar.",
          resourceIds: ["res-c02", "res-g04"]
        },
        {
          id: "m01-w4",
          week: 4,
          title: "Sokratik AI Kullanımı & Ay 1 Mini Proje",
          tasks: [
            "Yapay zekâyı kopyala-yapıştır yerine Sokratik rehber olarak kullanma kurallarını ekiple netleştir.",
            "Bir Türkçe metin dosyasını temizleyip kelime frekansı çıkaran betiği testleriyle teslim et."
          ],
          whereUsed: "Öğrenme kalitesini koruyarak ekip hızını artıran bilimsel çalışma kültürünü oturtur.",
          resourceIds: ["res-p83", "res-p84", "res-b03"]
        }
      ]
    },
    {
      month: 2,
      quarter: "Ç1",
      quarterTitle: "Zemin, Matematik & Klasik ML Çekirdeği",
      phase: "Faz 1 — Matematik Çekirdeği",
      levelId: "lvl-1",
      levelLabel: "Seviye 1",
      title: "Lineer Cebir, Çok Değişkenli Kalkülüs & Otomatik Türev",
      summary: "Vektörler, matris dönüşümleri, SVD ve zincir kuralı üzerinden geri yayılımın kodlanması.",
      whereUsed: "Dikkat mekanizmasının matris çarpımları ve sinir ağlarının gradyan güncellemesi bu ayın kavramlarıdır.",
      hoursPerWeek: 12,
      computeStage: "CPU / Colab",
      deliverable: "Sıfırdan yazılmış skaler autograd motoru (micrograd) ve görselleştirilmiş gradyan inişi",
      teamFocus: {
        mimari: "Matris çarpımı, transpoz, SVD ve hesaplama grafiği tasarımı.",
        veri: "Vektör uzayında kelime/cümle benzerliği (kosinüs) deneyleri.",
        sistem: "Vektörize NumPy işlemlerinin döngülere karşı hız ölçümü.",
        posttraining: "Kayıp yüzeyi ve öğrenme hızı adım dinamiklerini inceleme.",
        eval: "Sayısal türev (finite difference) ile analitik gradyanı doğrulama."
      },
      weeks: [
        {
          id: "m02-w1",
          week: 1,
          title: "Vektörler, Matrisler & Geometrik Sezgi",
          tasks: [
            "3Blue1Brown Lineer Cebir serisini izleyip temel dönüşümleri NumPy'da kodla.",
            "İç çarpım ve kosinüs benzerliğini küçük cümle vektörlerinde test et."
          ],
          whereUsed: "Embedding ve Attention skorlarının geometrik anlamını açıklar.",
          resourceIds: ["res-c07", "res-c06"]
        },
        {
          id: "m02-w2",
          week: 2,
          title: "Özdeğerler, SVD & Düşük Rank Yaklaşımı",
          tasks: [
            "MIT 18.06 ve MML kitabından SVD bölümünü çalış.",
            "Bir ağırlık matrisini rank-k yaklaşımıyla sıkıştırıp hata oranını ölç."
          ],
          whereUsed: "İleride kullanacağımız LoRA ince ayar tekniğinin doğrudan matematiksel temelidir.",
          resourceIds: ["res-c06", "res-c09"]
        },
        {
          id: "m02-w3",
          week: 3,
          title: "Kısmi Türev, Zincir Kuralı & Gradyan İnişi",
          tasks: [
            "MIT 18.02'den çok değişkenli türev ve gradyan vektörünü pekiştir.",
            "Basit bir 2 değişkenli fonksiyon üzerinde gradyan inişi animasyonu çiz."
          ],
          whereUsed: "Tüm yapay zekâ eğitimindeki ağırlık güncelleme adımının çekirdeğidir.",
          resourceIds: ["res-c04", "res-c05"]
        },
        {
          id: "m02-w4",
          week: 4,
          title: "Geri Yayılım & Sıfırdan micrograd",
          tasks: [
            "Rumelhart 1986 geri yayılım mantığını ve Karpathy micrograd deposunu incele.",
            "Kendi Value sınıfını yazıp sayısal türev testiyle doğrula."
          ],
          whereUsed: "PyTorch autograd'ın perde arkasında ne yaptığını eksiksiz anlamanızı sağlar.",
          resourceIds: ["res-p06", "res-c26"]
        }
      ]
    },
    {
      month: 3,
      quarter: "Ç1",
      quarterTitle: "Zemin, Matematik & Klasik ML Çekirdeği",
      phase: "Faz 2 — Olasılık, Bilgi Teorisi & Klasik ML",
      levelId: "lvl-1",
      levelLabel: "Seviye 1",
      title: "Olasılık, Cross-Entropy, Genelleme & PyTorch Temeli",
      summary: "Bilgi teorisi metrikleri, aşırı öğrenme kontrolü ve PyTorch ile ilk gerçek sinir ağı eğitim döngüsü.",
      whereUsed: "Dil modellerinin kayıp fonksiyonu (Cross-Entropy), değerlendirme metriği (Perplexity) ve PyTorch eğitim iskeleti kurulur.",
      hoursPerWeek: 12,
      computeStage: "Ücretsiz Colab T4 / Kaggle GPU",
      deliverable: "PyTorch ile eğitilmiş, erken durdurmalı ve loglu çok katmanlı sinir ağı projesi",
      teamFocus: {
        mimari: "Aktivasyon fonksiyonları, Xavier/Kaiming başlatma ve Dropout.",
        veri: "Train/Val/Test ayrımı ve veri sızıntısı önleme.",
        sistem: "PyTorch Tensor cihaz (CPU/GPU) taşıma ve DataLoader.",
        posttraining: "KL ıraksaması ve Softmax sıcaklık dağılımlarını kavrama.",
        eval: "Doğruluk, kayıp eğrisi ve aşırı öğrenme teşhisi."
      },
      weeks: [
        {
          id: "m03-w1",
          week: 1,
          title: "Olasılık, Bayes & Maksimum Olabilirlik",
          tasks: [
            "Stat 110'dan koşullu olasılık ve beklenti kavramlarını tekrar et.",
            "Maksimum olabilirlik (MLE) ile doğrusal/lojistik regresyon ilişkisini kur."
          ],
          whereUsed: "Dil modelinin bir sonraki kelimeye olasılık atamasının istatistiksel temelidir.",
          resourceIds: ["res-c08", "res-c12"]
        },
        {
          id: "m03-w2",
          week: 2,
          title: "Entropi, Cross-Entropy & KL Iraksaması",
          tasks: [
            "Shannon 1948 ve MacKay bilgi teorisi kaynaklarından entropi/KL çalış.",
            "NumPy ile Softmax + Cross-Entropy kayıp fonksiyonunu sıfırdan yaz."
          ],
          whereUsed: "LLM ön-eğitiminde Cross-Entropy, DPO/RLHF hizalamasında KL cezası kullanılır.",
          resourceIds: ["res-p02", "res-c10", "res-c11"]
        },
        {
          id: "m03-w3",
          week: 3,
          title: "Genelleme, Düzenlileştirme & Ağırlık Başlatma",
          tasks: [
            "Bias-variance dengesini, Dropout ve Weight Decay etkilerini deneyle.",
            "Xavier ve Kaiming başlatma ile derin ağlarda sinyal dağılımını ölç."
          ],
          whereUsed: "Modelin ezberlemek yerine yeni veriye genellemesini sağlar.",
          resourceIds: ["res-p09", "res-p17", "res-p12"]
        },
        {
          id: "m03-w4",
          week: 4,
          title: "PyTorch nn.Module & İlk GPU Eğitim Döngüsü",
          tasks: [
            "PyTorch resmî öğreticileriyle Tensor, Autograd ve DataLoader akışını kur.",
            "Colab T4 GPU üzerinde çalışan ilk MLP sınıflandırıcını eğit."
          ],
          whereUsed: "Bundan sonraki tüm Transformer ve LLM kodlarının ortak PyTorch şablonudur.",
          resourceIds: ["res-c45", "res-c20", "res-g02"]
        }
      ]
    },
    {
      month: 4,
      quarter: "Ç2",
      quarterTitle: "Transformer Mimarisi, Veri & GPU Hızlandırma",
      phase: "Faz 3 — Derin Öğrenme & Dikkat Mekanizması",
      levelId: "lvl-2",
      levelLabel: "Seviye 2",
      title: "Derin Ağ Stabilitesi & Sıfırdan Dikkat (Attention)",
      summary: "RNN/LSTM darboğazından Transformer'a geçiş; Residual, Pre-LN, RMSNorm, RoPE ve GQA.",
      whereUsed: "Modern sohbet ve kod modellerinin bağlamı paralel işleyip uzun metinlerde dağılmamasını sağlayan çekirdek yapıdır.",
      hoursPerWeek: 14,
      computeStage: "Colab T4 / Kaggle P100",
      deliverable: "Sıfırdan yazılmış ve birim testli Modern Attention + RoPE + RMSNorm modülleri",
      teamFocus: {
        mimari: "Self-Attention, Multi-Head, GQA ve RoPE matematiği + kodu.",
        veri: "Karakter/alt-kelime dizileri için kayan pencere (sliding window) veri yükleyici.",
        sistem: "Tensör boyut (B, T, C) takibi ve bellek verimli projeksiyonlar.",
        posttraining: "Bağlam içi öğrenme ve dikkat haritalarının incelenmesi.",
        eval: "Nedensel maske (causal mask) sızıntı testleri."
      },
      weeks: [
        {
          id: "m04-w1",
          week: 1,
          title: "Dizilerden Dikkate: LSTM Darboğazı & Seq2Seq",
          tasks: [
            "LSTM, Seq2Seq ve Bahdanau Attention makalelerinin ana fikrini oku.",
            "Sıralı işlemenin neden paralel GPU'larda yavaş kaldığını analiz et."
          ],
          whereUsed: "Transformer'ın neden icat edildiğini ve sıralı darboğazı nasıl aştığını gösterir.",
          resourceIds: ["res-p07", "res-p13", "res-p14"]
        },
        {
          id: "m04-w2",
          week: 2,
          title: "Derin Ağ Stabilitesi: Residual, Pre-LN, RMSNorm & AdamW",
          tasks: [
            "ResNet artık bağlantıları, Pre-LN ve RMSNorm katmanlarını PyTorch'ta yaz.",
            "AdamW ve Cosine Annealing takvimiyle eğitim kararlılığını test et."
          ],
          whereUsed: "Derin Transformer katmanlarının gradyan kaybolmadan eğitilmesini sağlar.",
          resourceIds: ["res-p21", "res-p37", "res-p39"]
        },
        {
          id: "m04-w3",
          week: 3,
          title: "Attention Is All You Need & Scaled Dot-Product",
          tasks: [
            "The Illustrated Transformer ve Annotated Transformer ile Q, K, V akışını çiz.",
            "Nedensel maskeli tek ve çok başlı (Multi-Head) dikkat sınıfını kodla."
          ],
          whereUsed: "Tüm modern LLM mimarilerinin merkezindeki tekil yapı taşıdır.",
          resourceIds: ["res-p27", "res-c32", "res-c25"]
        },
        {
          id: "m04-w4",
          week: 4,
          title: "Modern Yükseltmeler: RoPE & GQA",
          tasks: [
            "RoFormer (RoPE) döner konum kodlamasını ve GQA grup paylaşımını kodla.",
            "Gelecek tokena bakmadığını doğrulayan birim testlerini yaz."
          ],
          whereUsed: "Llama 3, Qwen ve Mistral gibi güncel açık modellerin standart bileşenleridir.",
          resourceIds: ["res-p46", "res-p60"]
        }
      ]
    },
    {
      month: 5,
      quarter: "Ç2",
      quarterTitle: "Transformer Mimarisi, Veri & GPU Hızlandırma",
      phase: "Faz 3 — Sıfırdan LLM & TinyStories",
      levelId: "lvl-2",
      levelLabel: "Seviye 2",
      title: "Modern LLM Bloğu, KV-Cache & İlk Küçük Dil Modelimiz",
      summary: "SwiGLU, ağırlık paylaşımı, KV-Cache ve TinyStories üzerinde 10M–30M parametreli dil modeli eğitimi.",
      whereUsed: "Sıfırdan uçtan uca bir dil modelini eğitip metin üretebilen çalışan bir prototipe ulaşılır.",
      hoursPerWeek: 14,
      computeStage: "Kaggle P100/T4 (Haftalık 30s)",
      deliverable: "TinyStories üzerinde eğitilmiş 15M–30M parametreli çalışan nano-LLM ve KV-Cache çıkarım demosu",
      teamFocus: {
        mimari: "SwiGLU MLP, Weight Tying ve tam TransformerBlock birleştirme.",
        veri: "TinyStories veri setinin hazırlanması ve paketlenmesi.",
        sistem: "Gradient accumulation ve KV-Cache bellek yönetimi.",
        posttraining: "Temperature, Top-k ve Top-p örnekleme stratejileri.",
        eval: "Validation perplexity takibi ve üretilen örneklerin nitelik kontrolü."
      },
      weeks: [
        {
          id: "m05-w1",
          week: 1,
          title: "SwiGLU, Weight Tying & Tam GPT Bloğu",
          tasks: [
            "SwiGLU aktivasyonlu MLP katmanını ve embedding ağırlık paylaşımını ekle.",
            "nanoGPT ve LLMs-from-scratch yapısıyla kendi model sınıfını tamamla."
          ],
          whereUsed: "Parametre verimliliğini artırarak aynı boyutta daha düşük kayıp elde edilmesini sağlar.",
          resourceIds: ["res-p40", "res-p25", "res-c27"]
        },
        {
          id: "m05-w2",
          week: 2,
          title: "KV-Cache & Metin Üretim Stratejileri",
          tasks: [
            "Autoregressive üretim sırasında K ve V tensörlerini önbellekle.",
            "Greedy, Temperature, Top-k ve Top-p örneklemeyi kıyasla."
          ],
          whereUsed: "Gerçek zamanlı sohbet botlarında yanıt gecikmesini dramatik biçimde azaltır.",
          resourceIds: ["res-p34", "res-c22"]
        },
        {
          id: "m05-w3",
          week: 3,
          title: "TinyStories 10M–30M Ön-Eğitim Koşusu",
          tasks: [
            "Kaggle GPU üzerinde TinyStories veri setiyle 15M parametreli modeli eğit.",
            "Checkpoint kaydetme ve eğitimden devam etme (resume) mekanizmasını ekle."
          ],
          whereUsed: "Küçük ölçekte tüm eğitim boru hattının hatasız çalıştığını kanıtlar.",
          resourceIds: ["res-p59", "res-g01"]
        },
        {
          id: "m05-w4",
          week: 4,
          title: "İlk Model Analizi & Ara Değerlendirme",
          tasks: [
            "Model boyutunu 10M vs 30M karşılaştırıp kayıp eğrilerini raporla.",
            "Üretilen metinlerdeki tekrar ve tutarlılık hatalarını belgele."
          ],
          whereUsed: "Bir sonraki çeyrekteki Türkçe veri ve hızlandırma adımlarına temel veri sağlar.",
          resourceIds: ["res-p69", "res-c16"]
        }
      ]
    },
    {
      month: 6,
      quarter: "Ç2",
      quarterTitle: "Transformer Mimarisi, Veri & GPU Hızlandırma",
      phase: "Faz 4 — Türkçe Veri & Tokenizasyon",
      levelId: "lvl-3",
      levelLabel: "Seviye 3",
      title: "Türkçe Tokenizer Optimizasyonu & Kaliteli Korpus Kürasyonu",
      summary: "BPE/SentencePiece ile Türkçe fertilite düşürme, MinHash tekilleştirme ve FineWeb2/sentetik veri boru hattı.",
      whereUsed: "Türkçe modellerde token sayısını %30–40 azaltarak hem eğitim süresini hem çıkarım maliyetini doğrudan düşürür.",
      hoursPerWeek: 14,
      computeStage: "CPU Çok Çekirdek + Kaggle GPU",
      deliverable: "Özel eğitilmiş Türkçe BPE Tokenizer ve temizlenmiş/tekilleştirilmiş Türkçe eğitim korpusu",
      teamFocus: {
        mimari: "Tokenizer kelime dağarcığı boyutunun embedding parametrelerine etkisi.",
        veri: "Türkçe web/akademik metin toplama, PII temizliği ve MinHash tekilleştirme.",
        sistem: "Veriyi uint16/uint32 ikili (binary) shard dosyalarına hızlı paketleme.",
        posttraining: "Özel sohbet/düşünme kontrol tokenlarının (<|im_start|>, <think>) rezervasyonu.",
        eval: "Fertilite (token/kelime), sıkıştırma oranı ve karakter kapsama testleri."
      },
      weeks: [
        {
          id: "m06-w1",
          week: 1,
          title: "BPE, SentencePiece & Diller Arası Adalet",
          tasks: [
            "BPE ve SentencePiece makaleleriyle alt-kelime bölme mantığını incele.",
            "Mevcut açık LLM tokenizerlarının Türkçe cümleleri kaç parçaya böldüğünü ölç."
          ],
          whereUsed: "Türkçede yüksek token maliyetinin ve bağlam kaybının kök nedenini çözer.",
          resourceIds: ["res-p20", "res-p32", "res-p62"]
        },
        {
          id: "m06-w2",
          week: 2,
          title: "Türkçe Özel BPE Tokenizer Eğitimi",
          tasks: [
            "Türkçe haber, Vikipedi ve açık kitap metinlerinden dengeli bir örneklem oluştur.",
            "32K ve 64K sözlüklü byte-level BPE eğitip fertilite (<1.6) hedefini doğrula."
          ],
          whereUsed: "Eklemeli Türkçe kök-ek yapısını verimli temsil eden yerli modellerin temelidir.",
          resourceIds: ["res-p62", "res-p76"]
        },
        {
          id: "m06-w3",
          week: 3,
          title: "Veri Temizleme & MinHash Tekilleştirme",
          tasks: [
            "FineWeb ve FineWeb2 makalelerindeki filtreleme kurallarını uygula.",
            "HTML artıkları, tekrar eden reklam şablonları ve birebir kopya belgeleri temizle."
          ],
          whereUsed: "Modelin ezberlemesini önler ve aynı eğitim adımında öğrenme kalitesini yükseltir.",
          resourceIds: ["res-p73", "res-p81"]
        },
        {
          id: "m06-w4",
          week: 4,
          title: "Sentetik Veri & İkili (Binary) Shard Paketleme",
          tasks: [
            "Phi-1 (Textbooks Are All You Need) ve SmolLM2 veri karışımı ilkelerini incele.",
            "Temiz korpusu memmap uyumlu token shardlarına dönüştür."
          ],
          whereUsed: "Büyük eğitimlerde disk I/O darboğazını sıfırlayarak GPU'yu besler.",
          resourceIds: ["res-p65", "res-p80"]
        }
      ]
    },
    {
      month: 7,
      quarter: "Ç3",
      quarterTitle: "GPU Sistemleri, Ölçekleme & Ön-Eğitim",
      phase: "Faz 5 — Donanım & Performans Mühendisliği",
      levelId: "lvl-3",
      levelLabel: "Seviye 3",
      title: "GPU Bellek Hiyerarşisi, BF16, FlashAttention & Triton",
      summary: "HBM/SRAM darboğazlarını aşma, karma hassasiyet, aktivasyon kontrol noktası ve özel GPU çekirdekleri.",
      whereUsed: "Aynı GPU bütçesinde 2–4 kat daha hızlı eğitim ve uzun bağlam penceresi desteği kazandırır.",
      hoursPerWeek: 15,
      computeStage: "Colab T4 / Kaggle P100 / Lightning AI",
      deliverable: "BF16 + FlashAttention + Checkpointing entegreli, MFU ve VRAM profili çıkarılmış eğitim motoru",
      teamFocus: {
        mimari: "SDPA / FlashAttention entegrasyonu ve bağlam uzunluğu testleri.",
        veri: "Veri yükleyici pin_memory ve asenkron prefetch optimizasyonu.",
        sistem: "BF16 autocast, activation checkpointing ve Triton çekirdek denemeleri.",
        posttraining: "Uzun bağlamlı (2K–4K) örneklerde VRAM taşmasını önleme.",
        eval: "Token/saniye (throughput) ve MFU (%) kıyaslama tablosu."
      },
      weeks: [
        {
          id: "m07-w1",
          week: 1,
          title: "GPU Bellek Hiyerarşisi & Arithmetic Intensity",
          tasks: [
            "Horace He'nin 'Making Deep Learning Go Brrrr' rehberini ve Transformer Math 101'i çalış.",
            "Eğitimdeki bellek-bağlı ve hesaplama-bağlı işlemleri ayır."
          ],
          whereUsed: "Donanımın neden %100 kullanılamadığını anlamak için temel sistem sezgisi verir.",
          resourceIds: ["res-c31", "res-c36"]
        },
        {
          id: "m07-w2",
          week: 2,
          title: "BF16 Mixed Precision & Activation Checkpointing",
          tasks: [
            "BF16 karma hassasiyet ile hız ve VRAM kazancını ölç.",
            "Activation checkpointing ekleyerek maksimum batch boyutunu artır."
          ],
          whereUsed: "Kısıtlı VRAM'li GPU'larda büyük modellerin eğitimini mümkün kılar.",
          resourceIds: ["res-p29", "res-p22"]
        },
        {
          id: "m07-w3",
          week: 3,
          title: "FlashAttention & IO-Farkında Dikkat",
          tasks: [
            "FlashAttention 1/2/3 fikrini (SRAM tiling) kavra ve PyTorch SDPA ile etkinleştir.",
            "512, 1024 ve 2048 bağlam uzunluklarında hız ve bellek farkını ölç."
          ],
          whereUsed: "Tüm modern LLM çerçevelerinde uzun bağlam eğitiminin olmazsa olmazıdır.",
          resourceIds: ["res-p52", "res-p66", "res-p74"]
        },
        {
          id: "m07-w4",
          week: 4,
          title: "OpenAI Triton & 6ND FLOPs Profilleme",
          tasks: [
            "Triton dokümantasyonuyla basit bir fused çekirdek (ör. softmax veya layernorm) dene.",
            "6ND formülüyle kendi eğitim döngünün MFU yüzdesini hesapla."
          ],
          whereUsed: "Özel donanım optimizasyonu gerektiren sistem mühendisliği rollerinin kapısını açar.",
          resourceIds: ["res-c46", "res-c44", "res-c28"]
        }
      ]
    },
    {
      month: 8,
      quarter: "Ç3",
      quarterTitle: "GPU Sistemleri, Ölçekleme & Ön-Eğitim",
      phase: "Faz 6 — Ölçekleme Yasaları & Dağıtık Eğitim",
      levelId: "lvl-4",
      levelLabel: "Seviye 4",
      title: "Chinchilla Ölçekleme Yasaları, DDP/FSDP & Küme Hazırlığı",
      summary: "Sıfır-bütçe IsoFLOP deneyleri, PyTorch FSDP ile çoklu GPU dağıtık eğitim ve TRUBA/TRC başvurusu.",
      whereUsed: "Büyük GPU kümesine geçmeden önce en verimli model-veri oranını bilimsel olarak garantiler.",
      hoursPerWeek: 15,
      computeStage: "Çoklu GPU Simülasyonu + TRUBA / TRC Başvurusu",
      deliverable: "IsoFLOP ölçekleme raporu, FSDP destekli dağıtık eğitim kodu ve TRUBA/TRC teknik planı",
      teamFocus: {
        mimari: "Küçük ölçekten büyük ölçeğe (10M -> 100M+) parametre ölçekleme planı.",
        veri: "Chinchilla hedefine uygun Türkçe + İngilizce + Kod veri karışım oranları.",
        sistem: "DDP, ZeRO, PyTorch FSDP ve SLURM küme betikleri.",
        posttraining: "Ön-eğitim sonrası SFT'ye geçilecek kontrol noktası ölçütleri.",
        eval: "Kayıp tahmin eğrileriyle büyük koşunun hedef kaybını öngörme."
      },
      weeks: [
        {
          id: "m08-w1",
          week: 1,
          title: "Kaplan & Chinchilla Ölçekleme Yasaları",
          tasks: [
            "Kaplan ve Chinchilla makalelerindeki FLOPs-parametre-token dengesini çıkar.",
            "10M, 25M ve 50M modellerle sabit FLOPs IsoFLOP deneyi yap."
          ],
          whereUsed: "Gereğinden büyük ama az eğitilmiş (undertrained) model kurma hatasını engeller.",
          resourceIds: ["res-p38", "res-p51", "res-c24"]
        },
        {
          id: "m08-w2",
          week: 2,
          title: "DDP, ZeRO & PyTorch FSDP Mimarisi",
          tasks: [
            "ZeRO-1/2/3 bellek paylaşımı ve PyTorch FSDP Sharding stratejilerini incele.",
            "Ultra-Scale Playbook'tan iletişim-hesaplama örtüştürme (overlap) tekniklerini oku."
          ],
          whereUsed: "Çoklu GPU kümesinde doğrusal ölçeklenmeye yakın hızlanma sağlar.",
          resourceIds: ["res-p36", "res-p58", "res-c38"]
        },
        {
          id: "m08-w3",
          week: 3,
          title: "TorchTitan, OLMo-core & Dağıtık Kod Tabanı",
          tasks: [
            "PyTorch TorchTitan ve OLMo-core referans yapılarını incele.",
            "Kendi eğitim betiğine FSDP ve deterministik veri devamlılığı (checkpoint) ekle."
          ],
          whereUsed: "Üretim düzeyinde kesintiye dayanıklı (fault-tolerant) küme eğitimi kurar.",
          resourceIds: ["res-c42", "res-c43", "res-p35"]
        },
        {
          id: "m08-w4",
          week: 4,
          title: "TRUBA ARF-ACC & Google TRC Başvuru Paketi",
          tasks: [
            "Smol Training Playbook ve nanochat örneklerinden ön-eğitim reçetesini netleştir.",
            "TRUBA veya Google TRC için kaynak/FLOPs gerekçeli teknik başvuru dosyasını hazırla."
          ],
          whereUsed: "Akademik ve öğrenci ekiplerinin ücretsiz süperbilgisayar/TPU erişimi almasını sağlar.",
          resourceIds: ["res-c39", "res-g05", "res-g06"]
        }
      ]
    },
    {
      month: 9,
      quarter: "Ç3",
      quarterTitle: "GPU Sistemleri, Ölçekleme & Ön-Eğitim",
      phase: "Faz 6 — Türkçe Temel Model Ön-Eğitimi",
      levelId: "lvl-4",
      levelLabel: "Seviye 4",
      title: "Türkçe Temel Model (Base Model) Ön-Eğitim Koşusu",
      summary: "Onaylanan küme veya hibrit bulut GPU üzerinde Türkçe odaklı temel modelin ön-eğitimini yürütme.",
      whereUsed: "Projenin kendi sıfırdan eğitilmiş Türkçe temel ağırlıklarını (weights) üretir.",
      hoursPerWeek: 16,
      computeStage: "TRUBA ARF-ACC / TPU TRC / Bulut GPU",
      deliverable: "Eğitim logları temiz, kayıp eğrisi kararlı Türkçe Temel Dil Modeli (Base Checkpoint)",
      teamFocus: {
        mimari: "Gradyan normu, dikkat entropisi ve loss spike (kayıp sıçraması) izleme.",
        veri: "Eğitim sonu (annealing/cooldown) yüksek kaliteli veri karışımına geçiş.",
        sistem: "Küme nöbeti, otomatik checkpoint yedekleme ve düğüm hatası kurtarma.",
        posttraining: "Ara checkpointler üzerinde temel tamamlama (few-shot) gözlemi.",
        eval: "Eğitim boyunca düzenli aralıklarla validation loss ve temel Türkçe görev takibi."
      },
      weeks: [
        {
          id: "m09-w1",
          week: 1,
          title: "Ön-Eğitim Öncesi Smoke Test & Stabilite Kontrolü",
          tasks: [
            "Tam veri boru hattını ve FSDP kurulumunu 1000 adımlık kısa koşuda test et.",
            "Öğrenme hızı ısınma (warmup) ve gradyan kırpma (clip=1.0) ayarlarını doğrula."
          ],
          whereUsed: "Büyük koşunun ilk saatlerinde yaşanabilecek sessiz hataları önler.",
          resourceIds: ["res-p78", "res-c39"]
        },
        {
          id: "m09-w2",
          week: 2,
          title: "Ana Ön-Eğitim Koşusu & Telemetri İzleme",
          tasks: [
            "Ana eğitimi başlat; eğitim/doğrulama kaybı ve gradyan normlarını günlük izle.",
            "Loss spike görülürse sorunlu veri batch'ini izole et veya öğrenme hızını ayarla."
          ],
          whereUsed: "Llama 3 ve OLMo 2 raporlarında anlatılan gerçek ön-eğitim operasyonudur.",
          resourceIds: ["res-p76", "res-p78"]
        },
        {
          id: "m09-w3",
          week: 3,
          title: "Cooldown (Annealing) & Yüksek Kaliteli Veri Aşaması",
          tasks: [
            "Son %10–15 adımda öğrenme hızını sıfıra indirirken yüksek kaliteli/sentetik veri oranını artır.",
            "Ara checkpointler arasındaki kıyaslama farkını ölç."
          ],
          whereUsed: "SmolLM2 ve OLMo 2'de model zekâsını sıçratan kritik son aşamadır.",
          resourceIds: ["res-p80", "res-p77"]
        },
        {
          id: "m09-w4",
          week: 4,
          title: "Temel Model (Base) Paketleme & İlk Analiz",
          tasks: [
            "Son ağırlıkları safetensors formatında paketle ve temel tamamlama örnekleri al.",
            "Ön-eğitim sürecindeki tüm hiperparametre ve kayıp grafiklerini arşivle."
          ],
          whereUsed: "Bir sonraki ay başlayacak Post-Training aşamasının başlangıç noktasını oluşturur.",
          resourceIds: ["res-p41", "res-b06"]
        }
      ]
    },
    {
      month: 10,
      quarter: "Ç4",
      quarterTitle: "Post-Training, Değerlendirme, Sunum & Açık Yayın",
      phase: "Faz 7 — Post-Training, Hizalama & Akıl Yürütme",
      levelId: "lvl-4",
      levelLabel: "Seviye 4",
      title: "SFT, LoRA/QLoRA, DPO & GRPO ile Akıl Yürütme",
      summary: "Temel modeli talimat izleyen, tercihlerle hizalanmış ve adım adım düşünebilen asistana dönüştürme.",
      whereUsed: "Ham bir tamamlayıcıyı ChatGPT/DeepSeek benzeri yardımcı ve akıl yürüten bir modele çevirir.",
      hoursPerWeek: 15,
      computeStage: "Tek GPU (T4/A10/3090) + Unsloth",
      deliverable: "SFT + DPO/GRPO uygulanmış Türkçe Talimat & Akıl Yürütme Modeli",
      teamFocus: {
        mimari: "LoRA rank/hedef modül seçimi ve tam SFT vs QLoRA kıyaslaması.",
        veri: "Temiz Türkçe talimat (SFT) ve tercih (chosen/rejected) veri seti kürasyonu.",
        sistem: "Unsloth ve 4-bit QLoRA ile düşük VRAM'de hızlı eğitim.",
        posttraining: "SFT kayıp maskeleme, DPO beta ayarı ve GRPO ödül tasarımı.",
        eval: "Talimat uyumu, format doğruluğu ve halüsinasyon oranı kontrolleri."
      },
      weeks: [
        {
          id: "m10-w1",
          week: 1,
          title: "SFT, ChatML Şablonu & LoRA/QLoRA",
          tasks: [
            "LoRA ve QLoRA makalelerindeki düşük rank adaptasyonunu kavra.",
            "Unsloth/PEFT ile sadece asistan yanıtından kayıp hesaplayan SFT koşusu yap."
          ],
          whereUsed: "Kurumsal alan uyarlaması ve sohbet formatı kazandırmanın en verimli yoludur.",
          resourceIds: ["res-p47", "res-p61", "res-c41"]
        },
        {
          id: "m10-w2",
          week: 2,
          title: "RLHF, PPO & Doğrudan Tercih Optimizasyonu (DPO)",
          tasks: [
            "InstructGPT (PPO) ile DPO arasındaki farkı ve referans model KL kısıtını incele.",
            "Türkçe tercih çiftleriyle DPO hizalaması uygula."
          ],
          whereUsed: "Ödül modeli eğitme yükü olmadan modelin üslubunu ve güvenliğini iyileştirir.",
          resourceIds: ["res-p28", "res-p50", "res-p63"]
        },
        {
          id: "m10-w3",
          week: 3,
          title: "Chain-of-Thought & GRPO / Doğrulanabilir Ödüller",
          tasks: [
            "DeepSeekMath (GRPO) ve DeepSeek-R1 akıl yürütme yaklaşımını incele.",
            "Matematik/mantık sorularında <think> adımı üreten küçük bir RLVR deneyi kur."
          ],
          whereUsed: "Kodlama ve matematik gibi doğrulanabilir alanlarda model doğruluğunu artırır.",
          resourceIds: ["res-p49", "res-p71", "res-p79"]
        },
        {
          id: "m10-w4",
          week: 4,
          title: "Post-Training Ablasyon & Aday Model Seçimi",
          tasks: [
            "Base, SFT ve DPO/GRPO modellerini aynı test setinde yan yana kıyasla.",
            "En dengeli kontrol noktasını değerlendirme ve sunum fazına aktar."
          ],
          whereUsed: "Hizalamanın modelin genel bilgisini bozmadığını (alignment tax) doğrular.",
          resourceIds: ["res-c40", "res-c33"]
        }
      ]
    },
    {
      month: 11,
      quarter: "Ç4",
      quarterTitle: "Post-Training, Değerlendirme, Sunum & Açık Yayın",
      phase: "Faz 8 — Değerlendirme, Kuantizasyon & Sunum",
      levelId: "lvl-5",
      levelLabel: "Seviye 5",
      title: "TurkishMMLU/CETVEL Kıyaslaması, GGUF/AWQ & vLLM Sunumu",
      summary: "Standart Türkçe/global kıyaslamalar, 4-bit sıkıştırma ve yüksek verimli API sunumu.",
      whereUsed: "Modelin gerçek kalitesini kanıtlar ve düşük maliyetli üretim sunucusu haline getirir.",
      hoursPerWeek: 14,
      computeStage: "T4 / L4 GPU veya Yerel CPU/GPU",
      deliverable: "TurkishMMLU & CETVEL skor tablosu, GGUF/AWQ dosyaları ve canlı vLLM API demosu",
      teamFocus: {
        mimari: "Kuantizasyon sonrası doğruluk kaybı ve uzun bağlam tutarlılığı analizi.",
        veri: "Kıyaslama setleriyle eğitim verisi arasında sızıntı (n-gram) taraması.",
        sistem: "vLLM PagedAttention kurulumu, TTFT/TPS yük testi ve GGUF dönüşümü.",
        posttraining: "Hata analizi (error analysis) ile zayıf kategorilerin tespiti.",
        eval: "lm-eval, TurkishMMLU, CETVEL ve HELM protokollerinin çalıştırılması."
      },
      weeks: [
        {
          id: "m11-w1",
          week: 1,
          title: "Bilimsel Kıyaslama: lm-eval, HELM, TurkishMMLU & CETVEL",
          tasks: [
            "EleutherAI lm-evaluation-harness kurulumunu yap ve veri sızıntısı kontrolü uygula.",
            "Modelini TurkishMMLU ve CETVEL görevlerinde çalıştırıp güven aralıklarını kaydet."
          ],
          whereUsed: "Modelin Türkçe anlama ve akıl yürütme gücünü tarafsız ölçer.",
          resourceIds: ["res-c37", "res-p75", "res-p82"]
        },
        {
          id: "m11-w2",
          week: 2,
          title: "Kuantizasyon: GPTQ, AWQ & GGUF",
          tasks: [
            "GPTQ ve AWQ makalelerindeki aktivasyon farkındalıklı sıkıştırmayı incele.",
            "Modeli 4-bit AWQ ve Q4_K_M GGUF formatlarına dönüştür."
          ],
          whereUsed: "Model boyutunu ~4 kat küçülterek tüketici donanımlarında çalışmasını sağlar.",
          resourceIds: ["res-p54", "res-p64"]
        },
        {
          id: "m11-w3",
          week: 3,
          title: "vLLM & PagedAttention ile Canlı Sunum",
          tasks: [
            "PagedAttention'ın KV-Cache parçalanmasını nasıl önlediğini incele.",
            "vLLM sunucusu ayağa kaldırıp eşzamanlı isteklerde TTFT ve token/sn ölç."
          ],
          whereUsed: "Üretim API'lerinde yüksek eşzamanlılık ve düşük gecikme sunar.",
          resourceIds: ["res-p67"]
        },
        {
          id: "m11-w4",
          week: 4,
          title: "Çoklu Sürüm Karşılaştırma & Sunum Optimizasyonu",
          tasks: [
            "FP16 vs AWQ vs GGUF hız/kalite tablosunu tamamla.",
            "Basit bir web sohbet arayüzünü vLLM OpenAI-uyumlu uç noktasına bağla."
          ],
          whereUsed: "Uçtan uca çalışan, kullanıcıya sunulabilir bir ürün prototipi ortaya çıkarır.",
          resourceIds: ["res-p67", "res-c37"]
        }
      ]
    },
    {
      month: 12,
      quarter: "Ç4",
      quarterTitle: "Post-Training, Değerlendirme, Sunum & Açık Yayın",
      phase: "Faz 9 — Yorumlanabilirlik, Çok Modlu & Açık Bilim Yayını",
      levelId: "lvl-5",
      levelLabel: "Seviye 5",
      title: "Yorumlanabilirlik, Çok Modlu Genişleme & Açık Yayın",
      summary: "Model iç devrelerini anlama, görsel/ses (ViT, CLIP, LLaVA, Whisper) entegrasyonu ve açık bilim yayını.",
      whereUsed: "Mezuniyet projesi, açık kaynak portföyü, TÜBİTAK 2209-A veya akademik yayın çıktısına dönüşür.",
      hoursPerWeek: 12,
      computeStage: "Colab / Kaggle / Hugging Face Spaces",
      deliverable: "Hugging Face Model Kartı, açık kaynak kod deposu, teknik rapor ve TÜBİTAK/TEKNOFEST sunum paketi",
      teamFocus: {
        mimari: "ViT, CLIP, LLaVA ve yorumlanabilirlik devre analizleri.",
        veri: "Eğitim veri kartı (Data Card) ve lisans uyumluluk dokümantasyonu.",
        sistem: "Tekrarlanabilir eğitim/çıkarım Docker veya tek komutlu kurulum betiği.",
        posttraining: "Çok modlu görsel/ses istemleme veya basit LLaVA adaptörü deneyi.",
        eval: "Kapsamlı teknik rapor, ablasyon tabloları ve sınırlılık analizi."
      },
      weeks: [
        {
          id: "m12-w1",
          week: 1,
          title: "Mekanik Yorumlanabilirlik & Transformer Devreleri",
          tasks: [
            "Transformer Circuits ve Distill Circuits kaynaklarından indüksiyon başlarını (induction heads) incele.",
            "Kendi modelinde bir örnek cümle için dikkat ağırlıklarını görselleştir."
          ],
          whereUsed: "Modelin kara kutu olmaktan çıkıp hata mekanizmalarının anlaşılmasını sağlar.",
          resourceIds: ["res-c34", "res-c35"]
        },
        {
          id: "m12-w2",
          week: 2,
          title: "Çok Modlu Genişleme: ViT, CLIP, LLaVA & Whisper",
          tasks: [
            "ViT yama gömüleri, CLIP kontrastif eğitimi, LLaVA ve Whisper mimarilerini incele.",
            "Metin modelini Whisper ses çıktısı veya CLIP görsel gömüsüyle bağlayan mini demo kur."
          ],
          whereUsed: "Metin dışı dünyayı (görsel, belge OCR, ses) anlayan modern asistanların temelidir.",
          resourceIds: ["res-p43", "res-p45", "res-p57"]
        },
        {
          id: "m12-w3",
          week: 3,
          title: "Hugging Face Model Kartı & Tekrarlanabilirlik",
          tasks: [
            "OLMo 2 ve Llama 3 raporlarını örnek alarak şeffaf Model Kartı ve Teknik Rapor yaz.",
            "Tüm eğitim, değerlendirme ve sunum kodlarını temiz lisansla GitHub'da yayınla."
          ],
          whereUsed: "Açık kaynak topluluğu ve işverenler için doğrulanabilir mühendislik kanıtıdır.",
          resourceIds: ["res-p76", "res-p78", "res-b06"]
        },
        {
          id: "m12-w4",
          week: 4,
          title: "TÜBİTAK 2209-A / TRUBA Raporu & Yıl Sonu Sunumu",
          tasks: [
            "TÜBİTAK 2209-A veya akademik bildiri formatında sonuç özetini tamamla.",
            "Ekip içi yıl sonu demosunu gerçekleştir ve sonraki yılın araştırma hedeflerini belirle."
          ],
          whereUsed: "Elde edilen bilgi birikimini ulusal araştırma desteğine ve yeni projelere taşır.",
          resourceIds: ["res-g06", "res-g07", "res-c15"]
        }
      ]
    }
  ];

  DATA.MODULE_USE_CASES = {
    "mod-0": {
      whereUsed: "Tüm yazılım ve yapay zekâ projelerinin giriş kapısıdır; bulut GPU sunucularını yönetmek, kod paylaşmak ve veriyi işlemek için her gün kullanılır.",
      realProducts: ["Google Colab & Kaggle Notebook", "GitHub Actions / PR İş Akışı", "Linux & Docker Eğitim Ortamları"],
      careerRoles: ["Junior ML Engineer", "Data Engineer", "AI Research Intern"]
    },
    "mod-1": {
      whereUsed: "Kayıp fonksiyonları tasarlamak, gradyan hatalarını teşhis etmek, RAG vektör araması kurmak ve LoRA gibi düşük ranklı uyarlamaları anlamak için kullanılır.",
      realProducts: ["PyTorch Autograd Motoru", "FAISS / Qdrant Vektör Arama", "LoRA Düşük Rank Adaptörleri"],
      careerRoles: ["ML Engineer", "Research Scientist", "Applied AI Engineer"]
    },
    "mod-2": {
      whereUsed: "Aşırı öğrenmeyi engellemek, doğrulama protokolü kurmak ve sıfırdan PyTorch sinir ağı eğitim döngüleri yazmak için her ML projesinde kullanılır.",
      realProducts: ["PyTorch Eğitim Çerçevesi", "Öneri & Sınıflandırma Sistemleri", "Erken Durdurma & Model Seçim Boru Hatları"],
      careerRoles: ["Machine Learning Engineer", "Data Scientist", "Deep Learning Engineer"]
    },
    "mod-3": {
      whereUsed: "Modern sohbet, kod tamamlama ve ajan sistemlerinin kalbi olan Transformer bloklarını (RoPE, GQA, SwiGLU, KV-Cache) kurmak ve optimize etmek için kullanılır.",
      realProducts: ["Llama 3 / Qwen / DeepSeek Mimarileri", "GPT & Claude Çekirdek Decoder Yapısı", "KV-Cache Tabanlı Sohbet Motorları"],
      careerRoles: ["LLM Architect", "Pre-training Engineer", "Foundation Model Researcher"]
    },
    "mod-4": {
      whereUsed: "Türkçe gibi eklemeli dillerde token maliyetini düşürmek, web korpusundan gürültüyü temizlemek ve yüksek kaliteli sentetik eğitim verisi üretmek için kullanılır.",
      realProducts: ["FineWeb2 & Dolma Korpusları", "Türkçe Özel BPE Tokenizerlar", "Phi / SmolLM Sentetik Veri Boru Hatları"],
      careerRoles: ["Data Curation Engineer", "NLP Engineer", "Pre-training Data Lead"]
    },
    "mod-5": {
      whereUsed: "GPU bellek sınırlarını aşmak, BF16 ve FlashAttention ile eğitim hızını katlamak ve Triton ile özel GPU çekirdekleri yazmak için sistem katmanında kullanılır.",
      realProducts: ["FlashAttention-2/3 Çekirdekleri", "OpenAI Triton Derleyicisi", "PyTorch Profiler & CUDA Sistemleri"],
      careerRoles: ["ML Systems Engineer", "GPU Kernel Engineer", "AI Infrastructure Engineer"]
    },
    "mod-6": {
      whereUsed: "Büyük GPU harcaması yapmadan önce en uygun model-token dengesini hesaplamak ve çoklu GPU/düğüm kümelerinde kesintisiz ön-eğitim yürütmek için kullanılır.",
      realProducts: ["Chinchilla Ölçekleme Planlayıcıları", "PyTorch FSDP & DeepSpeed ZeRO", "TRUBA ARF-ACC & Google TRC Kümeleri"],
      careerRoles: ["Distributed Training Engineer", "LLM Pre-training Lead", "HPC AI Engineer"]
    },
    "mod-7": {
      whereUsed: "Temel bir dil modelini talimatları izleyen, güvenli, insan tercihleriyle hizalı ve adım adım akıl yürütebilen bir asistana dönüştürmek için kullanılır.",
      realProducts: ["Unsloth & Hugging Face TRL", "DPO / RLHF Hizalama Boru Hatları", "DeepSeek-R1 Tarzı Akıl Yürütme Modelleri"],
      careerRoles: ["Post-Training Engineer", "RLHF / Alignment Researcher", "LLM Fine-tuning Specialist"]
    },
    "mod-8": {
      whereUsed: "Modelleri bilimsel kıyaslamalarla doğrulamak, 4-bit kuantizasyonla küçültmek, vLLM ile düşük gecikmeli API olarak sunmak ve iç devrelerini yorumlamak için kullanılır.",
      realProducts: ["vLLM & llama.cpp (GGUF)", "EleutherAI lm-eval & TurkishMMLU", "Anthropic/DeepMind Mekanik Yorumlanabilirlik Araçları"],
      careerRoles: ["LLM Inference / Serving Engineer", "AI Evaluation Engineer", "MLOps & Deployment Engineer"]
    },
    "mod-9": {
      whereUsed: "Metin modellerini görsel belge anlama, görsel-metin eşleştirme ve ses tanıma yetenekleriyle birleştirerek çok modlu ürünlere dönüştürmek için kullanılır.",
      realProducts: ["LLaVA & Görsel-Dil Asistanları", "OpenAI Whisper Ses Tanıma", "CLIP Çok Modlu Arama Sistemleri"],
      careerRoles: ["Multimodal AI Engineer", "Computer Vision & VLM Engineer", "Speech & Audio AI Engineer"]
    }
  };

  DATA.STORY_ARC_USE_CASES = {
    "arc-1": "Sembolik mantık ile sinir ağları arasındaki tarihi ayrım, bugünkü Nöro-Sembolik ajanların (kod/araç çağıran LLM'ler) ve geri yayılım motorlarının temelini oluşturur.",
    "arc-2": "Xavier/Kaiming başlatma, ResNet artık bağlantıları ve GPU devrimi sayesinde bugün yüzlerce katmanlı ağları çökmeden eğitebiliyoruz.",
    "arc-3": "RNN'lerin sıralı darboğazını çözen Dikkat (Attention) ve Transformer mimarisi, bugün ChatGPT'den kodlama asistanlarına kadar tüm üretken yapay zekânın ortak motorudur.",
    "arc-4": "Ölçekleme yasaları, ZeRO bellek paylaşımı ve RLHF hizalaması, dev modellerin hem fiziksel kümelere sığmasını hem de insan niyetine uygun yanıt vermesini sağlar.",
    "arc-5": "FlashAttention, RoPE, SwiGLU, GQA ve QLoRA gibi yenilikler sayesinde 2020'de sadece dev şirketlerin yapabildiği ince ayar ve çıkarım bugün tek bir GPU'da yapılabilmektedir.",
    "arc-6": "OLMo 2 ve DeepSeek-R1 ile açık bilim ve doğrulanabilir ödüllü RL (GRPO), kapalı modellere denk akıl yürütme yeteneklerini herkesin erişimine açmıştır.",
    "arc-7": "FineWeb2, Türkçe özel tokenizasyon, TurkishMMLU/CETVEL ve TRUBA/TÜBİTAK destekleri sayesinde Türkçe için sıfırdan yerli ve bilimsel açıdan rekabetçi modeller üretilebilmektedir."
  };

  DATA.CATEGORY_USE_CASES = {
    "Tarih & Temel": "Alanı sıfırdan kuran temel fikirlerin nereden çıktığını ve bugünkü mimari kararların arkasındaki mantığı anlamak için kullanılır.",
    "Matematik & Bilgi Teorisi": "Embedding uzayları, geri yayılım, kayıp fonksiyonları (Cross-Entropy/KL) ve optimizasyon algoritmalarını ezberlemeden türetmek için kullanılır.",
    "Mimari": "Transformer, Attention, RoPE, GQA, RMSNorm ve SwiGLU gibi çekirdek ağ katmanlarını sıfırdan kodlamak için kullanılır.",
    "Mimari & Optimizasyon": "Derin ağlarda gradyan akışını kararlı kılan başlatma, normalizasyon ve düzenlileştirme tekniklerini uygulamak için kullanılır.",
    "Tarih & Derin Öğrenme": "GPU tabanlı derin öğrenme kırılmasının (AlexNet dönemi) donanım ve mimari koşullarını anlamak için kullanılır.",
    "Veri & Temsil": "Kelime ve kavramların sürekli vektör uzaylarında nasıl temsil edildiğini (Word2Vec'ten modern gömülere) kavramak için kullanılır.",
    "Optimizasyon": "Adam, AdamW ve Cosine Annealing gibi eğitim yakınsamasını doğrudan belirleyen optimize edicileri ayarlamak için kullanılır.",
    "Eğitim & Sıkıştırma": "Büyük öğretmen modellerin bilgisini küçük ve hızlı öğrenci modellere aktarmak (Knowledge Distillation) için kullanılır.",
    "Veri & Tokenizasyon": "Türkçe dahil her dilde temiz korpus oluşturmak, tekilleştirme yapmak ve token verimliliğini (fertilite) artırmak için kullanılır.",
    "Donanım & Sistem": "GPU bellek hiyerarşisini (HBM/SRAM), BF16 karma hassasiyeti, FlashAttention ve Triton çekirdeklerini optimize etmek için kullanılır.",
    "Post-Training & RL": "Temel modelleri talimat izleyen (SFT/LoRA), güvenli (DPO/PPO) ve akıl yürüten (GRPO/RLVR) asistanlara dönüştürmek için kullanılır.",
    "Mimari & LLM": "GPT ailesi, BERT ve sıfırdan nanoGPT/LLMs-from-scratch gibi uçtan uca dil modeli tasarımlarını uygulamak için kullanılır.",
    "Dağıtık Sistem": "Tek GPU'ya sığmayan modelleri DDP, ZeRO, FSDP ve TorchTitan ile çoklu GPU kümelerinde eğitmek için kullanılır.",
    "Ölçekleme & Teori": "Kaplan ve Chinchilla ölçekleme yasalarıyla boşa GPU harcamadan en verimli model ve token bütçesini planlamak için kullanılır.",
    "Çok Modlu & Görsel": "Metin modellerini görüntü (ViT, CLIP, LLaVA), difüzyon ve ses (Whisper) yetenekleriyle birleştirmek için kullanılır.",
    "Değerlendirme & Sunum": "Modelleri bilimsel olarak ölçmek (HELM, lm-eval), 4-bit kuantize etmek (GPTQ, AWQ) ve vLLM ile hızlı sunmak için kullanılır.",
    "Ölçekleme & Eğitim": "Llama 3, DeepSeek-V3, OLMo 2 ve SmolLM2 gibi gerçek açık modellerin uçtan uca eğitim tariflerini örnek almak için kullanılır.",
    "Değerlendirme & Türkçe": "Eğitilen modellerin Türkçe anlama, mantık ve kültür bilgisini TurkishMMLU ve CETVEL ile tarafsız ölçmek için kullanılır.",
    "Bilimsel AI Kullanımı": "Yapay zekâyı tembelleştirici bir kopya aracı değil, öğrenmeyi hızlandıran Sokratik bir özel öğretmen olarak kullanmak için kullanılır.",
    "Temel CS": "Algoritma, Linux kabuğu, Git iş akışı ve Python/PyTorch resmî referanslarıyla sağlam yazılım mühendisliği temeli atmak için kullanılır.",
    "Derin Öğrenme & ML": "İstatistiksel öğrenmeden modern derin öğrenme derslerine (CS229, CS224n, d2l.ai) sistematik mühendislik bilgisi edinmek için kullanılır.",
    "Yorumlanabilirlik": "Modelin iç katmanlarındaki devreleri ve dikkat başlarını inceleyerek hataları ve mekanizmaları açıklamak için kullanılır.",
    "Ücretsiz GPU & Hibe": "Sıfır bütçeyle Colab, Kaggle, Google TRC, TRUBA ve TÜBİTAK 2209-A gibi ücretsiz hesaplama kaynaklarına erişmek için kullanılır.",
    "Başlangıç & Yardım": "Hiç kod bilmeyenlerin ilk adımı atması ve takıldıkları yerde resmî topluluk forumlarından destek alması için kullanılır."
  };

  DATA.MASCOT_TOUR_STEPS = [
    {
      id: "tour-1",
      tab: "baslangic",
      title: "1. Hoş Geldin! Lintu Rehberin Burada",
      body: "Başlangıç sekmesinde hiç bilmeyenler için 3 adımlı hızlı başlangıç, Sokratik AI kuralları ve ekip içi 5 uzmanlık rolü seni bekliyor."
    },
    {
      id: "tour-2",
      tab: "seviyeler",
      title: "2. Seviye 0'dan Seviye 5'e Net Müfredat",
      body: "Seviyeler sekmesinde 6 seviyeyi ve 24 konuyu adım adım takip edebilir, her konunun altında pratik görevini ve doğrudan kaynaklarını bulabilirsin."
    },
    {
      id: "tour-3",
      tab: "takvim",
      title: "3. 12 Aylık & 48 Haftalık Takvim",
      body: "Takvim sekmesinde yılı 4 çeyreğe, 12 aya ve 48 haftaya böldük. Her haftanın somut görevlerini işaretleyip ilerlemeni gör."
    },
    {
      id: "tour-4",
      tab: "tarih",
      title: "4. Nerede İşe Yarar & Olay Örgüsü",
      body: "Her seviyede, modülde ve tarih bölümünde 'Bu bilgi bugün gerçek ürünlerde nerede işe yarar?' kutularıyla soyut teoriyi pratiğe bağlıyoruz."
    },
    {
      id: "tour-5",
      tab: "araclar",
      title: "5. Zahmetsiz İlerleme & Sync Kodu",
      body: "İlerlemen tarayıcında otomatik saklanır. Cihaz değiştirdiğinde Sync Kodu ile tüm işaretlerini tek tıkla aktarabilirsin!"
    }
  ];

  DATA.MASCOT_TAB_TIPS = {
    baslangic: "İlk kez mi başlıyorsun? Önce Seviye 0 kartına bak, ekip rolünü seç ve Sokratik AI kuralını unutma!",
    seviyeler: "Her konunun altındaki 'Nerede İşe Yarar?' kutusu, öğrendiğin kavramın gerçek ürünlerdeki karşılığını gösterir.",
    takvim: "Takvimde haftalık kutucukları işaretledikçe yıllık ilerleme çubuğun ve seviye özetin otomatik güncellenir.",
    tarih: "Tarihçe sadece geçmiş değil: 7 olay örgüsü, bugünkü LLM mimarilerinin neden böyle tasarlandığını anlatır.",
    araclar: "İnteraktif VRAM/6ND hesaplayıcıları ve Sync Kodu burada. Başka bilgisayara geçerken kodunu kopyalamayı unutma!",
    kutuphane: "143 doğrulanmış kaynak kategoriye ve seviyeye göre filtrelenir. Her kategorinin ne işe yaradığı da yanında yazar."
  };
})();
