/* Lintu v2 Ek Veri Katmanı: Başlangıç Rehberi, 7 Perdelik Olay Örgüsü,
 * Lintu Maskot Turu ve Yeni Doğrulanmış Başlangıç Kaynakları.
 * data.js içindeki doğrulanmış makale ve ders verilerini bozmadan genişletir.
 */

(function () {
  "use strict";

  const DATA = window.ROADMAP_DATA;
  if (!DATA) return;

  DATA.BEGINNER_GUIDE = {
    sevenDayPlan: [
      {
        day: "1. Gün",
        title: "Büyük Resmi & Olay Örgüsünü Oku",
        goal: "Önce teknik detaya boğulmadan yapay zekanın neden bu noktaya geldiğini kavra.",
        steps: [
          "Sol menüden '2. Olay Örgüsü & Tarih' sekmesine girip 7 perdelik hikâyeyi baştan sona oku.",
          "Bu sekmedeki '28 Temel Terim Sözlüğü'nden bilmediğin ilk 10 kavramı işaretle.",
          "Profil kutusundan adını yaz, seviyeni 'Başlangıç' seç."
        ]
      },
      {
        day: "2. Gün",
        title: "Kurulumsuz İlk Kod: Tarayıcıda Python & GPU",
        goal: "Bilgisayarına ağır kurulum yapmadan tarayıcıda çalışan kod ortamını tanı.",
        steps: [
          "Google Colab veya Kaggle Learn'e ücretsiz Google hesabınla gir.",
          "Kaggle Learn Python dersinin ilk 2 modülünü çalıştır.",
          "Python Resmî Dokümantasyonundaki temel veri tiplerini (liste, sözlük, döngü) test et."
        ]
      },
      {
        day: "3. Gün",
        title: "Sokratik AI Eğitmenini Kur (Koltuk Değneksiz)",
        goal: "Elindeki premium AI aracını tembelleştiren değil öğreten özel hocaya çevir.",
        steps: [
          "'6. AI Araçları & Sokrat' sekmesindeki sistem istemini kopyala.",
          "Aşağıdaki 5 'Takıldım' isteminden birini dene: AI'dan kodu değil, ipucunu iste.",
          "Bastani et al. (PNAS 2025) bulgusunu ekiple 5 dakika konuş."
        ]
      },
      {
        day: "4. Gün",
        title: "Sinir Ağı Nasıl Öğrenir? (Görsel Sezgi + 150 Satır Kod)",
        goal: "Matris çarpımı ve geri yayılımın (backprop) korkulacak bir şey olmadığını gör.",
        steps: [
          "3Blue1Brown sinir ağları serisinin ilk 2 videosunu izle.",
          "Karpathy/micrograd deposunu incele; bir sayının türevinin kodla nasıl alındığını gör.",
          "Anlamadığın satırları Sokratik AI Eğitmenine 'adım adım sayısal örnekle aç' diye sor."
        ]
      },
      {
        day: "5. Gün",
        title: "Ekip Altyapısı: Git & GitHub Düzeni",
        goal: "5 arkadaş aynı proje üstünde birbirinin kodunu silmeden çalışmayı öğren.",
        steps: [
          "MIT Missing Semester'ın Git ve Terminal (Shell) dersini izle.",
          "Ekip için tek GitHub organizasyonu/deposu açıp herkesin kendi dalında (branch) commit atmasını dene.",
          "Bu rehberdeki 'Yerel Dosya Bağla' veya JSON Dışa Aktar ile ilk ilerleme kaydını sakla."
        ]
      },
      {
        day: "6. Gün",
        title: "5 Kişilik Rol Seçimi & İlk Küçük Hedef",
        goal: "Herkesin aynı şeye dağılmasını önleyip kendi odak alanını seç.",
        steps: [
          "'7. 5 Kişilik Ekip Planı'ndaki 5 rolden sana en yakın olanı üst profil kutusundan seç.",
          "'9. Tam Kütüphane'de 'Senin İçin Önerilen' filtresine tıkla.",
          "Kendi rolündeki 'Başlangıç/Temel' etiketli ilk 2 kaynağa 'Çalışıyorum' etiketi ver."
        ]
      },
      {
        day: "7. Gün",
        title: "İlk Haftalık 45 Dakikalık Ekip Feynman Toplantısı",
        goal: "Öğrendiğini sade dille anlatarak gerçek anlama testi yap.",
        steps: [
          "Her üye 5 dakika boyunca o hafta anladığı 1 kavramı hiç terim boğmacası olmadan anlatır.",
          "VRAM Hesaplayıcıda '124M Mixed Precision' vs '10M TinyStories' farkını birlikte test edin.",
          "İlerlemelerinizi JSON veya Obsidian .md olarak kaydedin; 2. haftaya Faz 0 ile başlayın."
        ]
      }
    ],

    helpChannels: [
      {
        id: "help-btk",
        name: "BTK Akademi (Ücretsiz Türkçe Temel)",
        url: "https://www.btkakademi.gov.tr",
        tag: "Türkçe Başlangıç",
        when: "İngilizce teknik doküman okumadan önce sıfırdan Türkçe Python, algoritma ve temel yazılım mantığı kurmak istediğinizde."
      },
      {
        id: "help-kaggle",
        name: "Kaggle Learn (Kurulumsuz Mikro-Kurslar)",
        url: "https://www.kaggle.com/learn",
        tag: "Uygulamalı Başlangıç",
        when: "Bilgisayarına hiçbir ortam kurmadan tarayıcı içinde Python, Pandas ve makine öğrenmesi temellerini deneyerek öğrenmek için."
      },
      {
        id: "help-fastai",
        name: "fast.ai — Practical Deep Learning for Coders",
        url: "https://course.fast.ai",
        tag: "Kod-Öncelikli DL",
        when: "Ağır matematikle başlamak yerine önce çalışan bir derin öğrenme modeli kurup sonra teoriyi aşağı doğru açmak istediğinizde."
      },
      {
        id: "help-python",
        name: "Python Resmî Dokümantasyonu & Öğreticisi",
        url: "https://docs.python.org",
        tag: "Birincil Referans",
        when: "Sözlükler, üreteçler (generators), sınıflar veya dosya işlemleri gibi temel Python sözdiziminde takıldığınızda."
      },
      {
        id: "help-pytorch-forum",
        name: "PyTorch Forums (Resmî Geliştirici Topluluğu)",
        url: "https://discuss.pytorch.org",
        tag: "Hata & Tensör Yardımı",
        when: "CUDA out-of-memory, boyut uyuşmazlığı veya DataLoader performans hatası aldığınızda gerçek mühendis çözümleri aramak için."
      },
      {
        id: "help-hf-forum",
        name: "Hugging Face Forums (LLM & Veri Topluluğu)",
        url: "https://discuss.huggingface.co",
        tag: "Tokenizer & Fine-Tuning",
        when: "Tokenizer eğitimi, FineWeb2 veri akışı, QLoRA veya `transformers` / `trl` hatalarında soru sormak için."
      },
      {
        id: "help-eleuther",
        name: "EleutherAI Açık Araştırma Topluluğu",
        url: "https://eleuther.ai",
        tag: "Açık LLM Bilimi",
        when: "Ölçekleme matematiği, açık değerlendirme (lm-evaluation-harness) ve bilimsel LLM tartışmalarını takip etmek için."
      },
      {
        id: "help-cs50",
        name: "Harvard CS50x & MIT Missing Semester",
        url: "https://cs50.harvard.edu/x/",
        secondaryUrl: "https://missing.csail.mit.edu/",
        tag: "Üniversite Temeli",
        when: "Terminal, Git, SSH ve bilgisayar bilimi mantığını üniversite 1. sınıf seviyesinde kalıcı oturtmak istediğinizde."
      }
    ],

    advisorEmailTemplate: `Konu: TÜBİTAK 2209-A / TRUBA GPU Altyapısı Danışmanlık Talebi — Küçük Ölçekli Türkçe Dil Modeli Araştırması

Sayın [Hocamın Unvanı ve Adı],

Ben [Üniversite / Bölüm] [Sınıf] sınıf öğrencisi [Adınız Soyadınız]. Beş kişilik lisans öğrenci ekibimizle birlikte sıfırdan küçük/orta ölçekli bir yapay zeka dil modeli mimarisi kurma, Türkçe tokenizasyon verimliliği (fertility) ve yerel değerlendirme (TurkishMMLU / CETVEL) konularında sistematik bir çalışma yürütüyoruz.

Şu ana kadar ücretsiz Google Colab / Kaggle kotalarıyla temel Transformer mimarisi ve mikro ölçekli deneylerimizi tamamlamayı hedefliyoruz. Çalışmamızı bir sonraki bilimsel aşamaya taşıyabilmek için:
1. TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı'na akademik danışmanlığınızda başvurmak,
2. Uygun görmeniz halinde TÜBİTAK ULAKBİM TRUBA (ARF-ACC) GPU kümelerine proje kapsamında öğrenci araştırmacı erişimi sağlayabilmek

konusunda görüş ve desteklerinizi rica ediyoruz. Uygun olduğunuz bir saatte 10 dakikalık kısa bir görüşme yapabilirsek çalışma planımızı sunmak isteriz.

Saygılarımla,
[Adınız Soyadınız] — [Öğrenci No / İletişim]`,

    stuckPrompts: [
      {
        id: "sp-paper",
        title: "1. Zor Makaleyi Sadeleştir",
        prompt: "Şu makalenin özetini ve temel fikrini üniversite 1. sınıf seviyesinde, önce günlük hayattan bir benzetmeyle sonra 3 maddelik teknik özetle anlat. Denklemleri korkutmadan sembollerin ne anlama geldiğini tek tek açıkla: [MAKALE BAŞLIĞI]"
      },
      {
        id: "sp-shape",
        title: "2. PyTorch Şekil (Shape) Hatası İpucu",
        prompt: "Aşağıdaki PyTorch kodumda tensör boyut (shape) hatası alıyorum. Bana çalışan düzeltilmiş kodu DOĞRUDAN YAZMA. Sadece hangi satırda matris boyutlarının neden uyuşmadığını göster ve düzeltmem için ipucu ver: [KOD + HATA]"
      },
      {
        id: "sp-jargon",
        title: "3. İngilizce Terimleri Türkçe Mantığa Çevir",
        prompt: "Şu paragraftaki teknik İngilizce terimleri (ör. residual, logit, kv-cache, perplexity) hem orijinal İngilizce adıyla koruyarak hem de Türkçe ne iş yaptığını tek cümlede açıklayarak paragrafı yeniden yaz: [METİN]"
      },
      {
        id: "sp-math",
        title: "4. Denklemi Küçük Sayılarla Elle Çöz",
        prompt: "Şu formülü (örneğin Scaled Dot-Product Attention veya Cross-Entropy) soyut harflerle değil, 2x2 boyutunda çok basit sayılarla adım adım elle hesaplamış gibi göster: [FORMÜL]"
      },
      {
        id: "sp-quiz",
        title: "5. Gerçekten Anladım mı? (5 Soruluk Test)",
        prompt: "Az önce [KONU / MAKALE] konusunu çalıştım. Benim gerçekten anlayıp anlamadığımı ölçmek için 2 kavram, 2 pratik hata senaryosu ve 1 küçük hesap sorusu olmak üzere toplam 5 soru sor. Cevapları ben yazmadan doğru cevabı söyleme."
      }
    ],

    glossary: [
      { term: "Parametre & Ağırlık (Parameter / Weight)", plain: "Modelin eğitim sırasında veriden öğrenip hafızasında sakladığı sayılardır. '124M model' demek içinde 124 milyon ayarlanabilir sayı var demektir.", analogy: "Dev bir ses mikserindeki milyonlarca ince ayar düğmesi.", module: "Modül 1–2" },
      { term: "Tensör (Tensor)", plain: "GPU üzerinde hızlı çarpılabilen çok boyutlu sayı dizisi (skaler → vektör → matris → 3B/4B tensör).", analogy: "İç içe geçmiş Excel tabloları.", module: "Modül 0–1" },
      { term: "Token", plain: "Modelin metni işlerken kullandığı en küçük metin parçasıdır; bazen tam bir kelime, bazen bir ek veya hecedir.", analogy: "Kelimeleri oluşturan Lego parçaları.", module: "Modül 4" },
      { term: "Tokenizer (BPE / SentencePiece)", plain: "İnsan metnini sayısal token kimliklerine, modelin ürettiği sayıları tekrar okunabilir metne çeviren sözlük sistemi.", analogy: "İnsan dili ile modelin sayısal alfabesi arasındaki tercüman.", module: "Modül 4" },
      { term: "Fertility (Token / Kelime Oranı)", plain: "Bir kelimenin ortalama kaç token'a bölündüğü. Türkçe'de İngilizce odaklı tokenizer'lar kelimeyi fazla parçaladığı için yüksek çıkar ve bağlamı tüketir.", analogy: "Aynı cümleyi kısa kelimelerle değil heceleyerek söylemenin zaman kaybı.", module: "Modül 4" },
      { term: "Embedding (Gömme Vektörü)", plain: "Her token kimliğinin anlam ilişkilerini taşıyan yoğun bir sayı vektörüne dönüştürülmesi.", analogy: "Her kavramın anlamsal bir haritadaki GPS koordinatı.", module: "Modül 2–3" },
      { term: "Gradyan (Gradient)", plain: "Hata (loss) değerini azaltmak için her ağırlığı hangi yönde ve ne kadar değiştirmemiz gerektiğini gösteren türev vektörü.", analogy: "Sisli bir dağdan aşağı inerken ayağının altındaki en dik eğim yönü.", module: "Modül 1" },
      { term: "Geri Yayılım (Backpropagation)", plain: "Çıkıştaki hatayı zincir kuralıyla sondan başa doğru tüm katmanlara dağıtarak her ağırlığın payını hesaplama algoritması.", analogy: "Bir takım gol yediğinde hatanın savunma-orta saha-forvete oranlanması.", module: "Modül 2" },
      { term: "Loss / Çapraz Entropi (Cross-Entropy)", plain: "Modelin bir sonraki token tahminiyle gerçek token arasındaki hata puanı. Eğitim bu sayıyı düşürmeye çalışır.", analogy: "Sınavdaki yanlışlık skoru; 0'a yaklaştıkça model daha doğru tahmin eder.", module: "Modül 1–2" },
      { term: "Perplexity", plain: "Dil modelinin bir sonraki token'ı seçerken ne kadar şaşkın/kararsız olduğunu gösteren ölçüt (`e^loss`). Düşük olması iyidir.", analogy: "Boşluk doldurma sorusunda kaç seçenek arasında kararsız kaldığın.", module: "Modül 4 & 8" },
      { term: "Batch & Epoch", plain: "Batch: Tek adımda GPU'ya aynı anda verilen örnek sayısı. Epoch: Tüm eğitim verisinin baştan sona 1 kez geçilmesi.", analogy: "Bir seferde okunan sayfa sayısı (batch) vs kitabın tamamını 1 kez bitirmek (epoch).", module: "Modül 2" },
      { term: "Overfitting (Aşırı Öğrenme)", plain: "Modelin genel kuralları öğrenmek yerine eğitim verisini ezberleyip yeni sorularda çuvallaması.", analogy: "Soru bankasını şık sırasıyla ezberleyip deneme sınavında farklı soruyu yapamamak.", module: "Modül 2" },
      { term: "VRAM (Video RAM)", plain: "Ekran kartının kendi içindeki ultra hızlı bellek (ör. Colab T4'te 15 GB). Model, gradyan, optimizer ve ara değerler buraya sığmalıdır.", analogy: "Mutfak tezgâhının büyüklüğü; malzeme depoda değil tezgahta sığmazsa yemek durur (OOM).", module: "Modül 5" },
      { term: "FP32 / FP16 / BF16 (Karma Duyarlılık)", plain: "Sayıların bellekte kaç bit yer kapladığı. FP32 = 4 bayt, FP16/BF16 = 2 bayt. Mixed precision ikisini akıllıca birleştirir.", analogy: "Kaba ölçümde metre, hassas terazide miligram kullanmak.", module: "Modül 5" },
      { term: "Gradient Checkpointing", plain: "Ara hesaplamaları VRAM'de tutmak yerine geri yayılımda gerektiğinde yeniden hesaplayarak bellekten ~%70 tasarruf etme tekniği.", analogy: "Her adımı deftere yazmak yerine ara başlıkları not alıp gerektiğinde tekrar hesaplamak.", module: "Modül 5" },
      { term: "Attention (Öz-Dikkat)", plain: "Cümledeki her token'ın, anlamı çözmek için diğer tüm token'lara dinamik olarak ne kadar önem vereceğini hesaplayan mekanizma.", analogy: "Bir zamirin ('o') cümlede hangi isme gittiğini okurken geri dönüp bağlamak.", module: "Modül 3" },
      { term: "Transformer (Pre-LN / RoPE / RMSNorm / SwiGLU / GQA)", plain: "Öz-dikkat ve ileri beslemeli blokların paralel çalıştığı modern yapay zeka omurgası. Parantez içindekiler bugünkü güncel bileşenlerdir.", analogy: "Aynı anda tüm sayfayı okuyabilen modern motor bloğu.", module: "Modül 3" },
      { term: "Pre-training (Ön-Eğitim)", plain: "Modeli dev metin yığını üzerinde 'bir sonraki kelimeyi tahmin et' hedefiyle sıfırdan eğitme aşaması. Çok GPU ve veri ister.", analogy: "Bir çocuğun konuşmayı, dünyayı ve dili okumayı öğrenmesi (ilkokul–lise).", module: "Modül 6" },
      { term: "SFT (Supervised Fine-Tuning / İnce Ayar)", plain: "Ön-eğitimli temel modele soru-cevap veya talimat örnekleriyle 'yardımcı asistan gibi yanıt ver' öğretme aşaması.", analogy: "Genel kültürlü birine özel mesleki üslup eğitimi vermek.", module: "Modül 7" },
      { term: "LoRA & QLoRA", plain: "Ana modelin milyonlarca ağırlığını dondurup yanına çok küçük ek matrisler takarak (QLoRA'da 4-bit sıkıştırarak) tek GPU'da ince ayar yapma.", analogy: "Kalın bir ansiklopediyi baştan basmak yerine kenarlarına ince ek not yaprakları yapıştırmak.", module: "Modül 7" },
      { term: "RLHF / DPO / GRPO", plain: "Modeli doğru/yanlış veya insan tercihlerine göre hizalama yöntemleri. DPO ödül modelsiz, GRPO ise grup içi karşılaştırmayla çok az bellekle çalışır.", analogy: "Sınavdan sonra öğretmenin 'şu çözüm yolu daha temiz' diye geri bildirim vermesi.", module: "Modül 7" },
      { term: "Inference & KV-Cache", plain: "Eğitilmiş modelden cevap üretme (çıkarım). KV-Cache önceki token'ların anahtar/değerlerini saklayarak tekrar hesaplamayı önler.", analogy: "Kitabı yazmak (eğitim) vs okura cevap vermek (çıkarım); KV-cache açık not defteridir.", module: "Modül 8" },
      { term: "Quantization (GPTQ / AWQ)", plain: "Eğitilmiş model ağırlıklarını 16-bitten 4-bite sıkıştırarak düşük donanımda hızlı çalıştırma.", analogy: "Yüksek boyutlu ham fotoğrafı kaliteyi koruyarak WebP/JPEG'e sıkıştırmak.", module: "Modül 8" },
      { term: "FLOPs & C ≈ 6ND", plain: "Eğitimin toplam işlem sayısı. N parametre ve D token için ileri+geri geçiş kabaca 6 × N × D kayan noktalı işlem tutar.", analogy: "Bir inşaatın toplam tuğla-işçilik maliyeti hesabı.", module: "Modül 4–6" },
      { term: "Chinchilla Ölçekleme Kuralı", plain: "Sabit bütçede model boyutu N ile token sayısı D'nin dengeli (kabaca 1 parametreye ~20 token) büyümesi gerektiğini gösteren yasa.", analogy: "Motoru büyütüp yakıtı az koymamak; ikisini dengeli artırmak.", module: "Modül 6" },
      { term: "MFU (Model FLOPs Utilization)", plain: "GPU'nun kağıt üzerindeki teorik hızının yüzde kaçını gerçek eğitimde kullanabildiğin (pratikte genelde %25–%50).", analogy: "Arabanın kadranındaki 260 km/s yerine şehirlerarası ortalama hızın.", module: "Modül 5–6" },
      { term: "Git / Branch / Commit", plain: "Ekipçe kod yazarken her değişikliği geri alınabilir kayıt noktalarıyla (commit) ve ayrı çalışma dallarıyla (branch) yönetme sistemi.", analogy: "Google Docs sürüm geçmişi + herkesin kendi kopyasında çalışıp temizleyince birleştirmesi.", module: "Modül 0" },
      { term: "Eval & Benchmark (TurkishMMLU / CETVEL)", plain: "Modelin ezber değil gerçek başarımını standart sınavlarla ölçme. Türkçe için çeviri değil özgün Türkçe testler şarttır.", analogy: "Kendi kendini değil, bağımsız merkezi sınava girip karne almak.", module: "Modül 8" }
    ]
  };

  DATA.STORY_ARCS = [
    {
      id: "arc-1",
      act: "1. Perde (1943–1969)",
      title: "Makineler Düşünebilir mi? — İki Rakip Fikir ve İlk Duvar",
      scene: "Bilgisayarlar henüz oda büyüklüğündeyken iki soru doğdu: Zekâyı mantık kurallarıyla mı yazacağız (Sembolik YZ), yoksa beynin nöronlarını mı taklit edeceğiz (Bağlantıcılık)?",
      wall: "Tek katmanlı Perceptron (1958) doğrusal olmayan basit XOR kapısını bile çözemedi; hesaplama gücü de yoktu. İlk 'Yapay Zeka Kışı' başladı.",
      breakthrough: "McCulloch-Pitts nöronu, Shannon'ın bilgi entropisi, Turing Testi ve Dartmouth konferansı bugünkü tüm kavramların adını koydu.",
      bridge: "Çıkış sorusu: Tek katman yetmiyorsa, birden fazla katmanı nasıl eğiteceğiz?",
      paperIds: ["tl-1943-mcculloch", "tl-1948-shannon", "tl-1950-turing", "tl-1955-dartmouth", "tl-1958-rosenblatt"]
    },
    {
      id: "arc-2",
      act: "2. Perde (1986–2015)",
      title: "Derinlik Duvarının Yıkılışı & GPU Devrimi",
      scene: "1986'da Backpropagation çok katmanlı ağları eğitmenin kapısını açtı; 1997'de LSTM ve 1998'de LeNet-5 geldi. Ama ağlar derinleştikçe gradyanlar sıfıra eriyordu.",
      wall: "CPU'lar devasa matris çarpımlarında aşırı yavaştı ve derin ağlarda ağırlıklar ya patlıyor ya da hiç öğrenemiyordu.",
      breakthrough: "2012'de AlexNet GPU (CUDA) gücünü keşfetti; ardından Xavier/Kaiming init, Adam ve 2015'te ResNet (skip connections) derinlik engelini tamamen yıktı.",
      bridge: "Çıkış sorusu: Görüntüde devrim oldu, peki kelimeleri ve uzun metinleri sırayla okumadan nasıl anlayacağız?",
      paperIds: ["tl-1986-backprop", "tl-1997-lstm", "tl-1998-lenet", "tl-2010-xavier", "tl-2012-alexnet", "tl-2014-adam", "tl-2015-resnet"]
    },
    {
      id: "arc-3",
      act: "3. Perde (2013–2017)",
      title: "Sıralı Okuma Darboğazı & Transformer Patlaması",
      scene: "Word2Vec kelimeleri vektöre çevirdi; BPE bilinmeyen kelime sorununu çözdü; Seq2Seq cümleyi tek bir vektöre sıkıştırıp çevirmeye çalıştı.",
      wall: "LSTM/RNN tabanlı modeller metni kelime kelime sırayla işlemek zorundaydı; hem uzun cümleleri unutuyor hem de GPU'larda paralel eğitilemiyordu.",
      breakthrough: "2014 Bahdanau Attention ile 'geri dönüp bakma' fikri doğdu; 2017'de 'Attention Is All You Need' tekrarlamayı tamamen atıp tüm cümleyi paralel gören Transformer'ı kurdu.",
      bridge: "Çıkış sorusu: Her şeyi paralel gören bu mimariyi dev metinlerle büyütürsek neler ortaya çıkar?",
      paperIds: ["tl-2013-word2vec", "tl-2014-seq2seq", "tl-2014-bahdanau-attention", "tl-2015-bpe", "tl-2017-transformer"]
    },
    {
      id: "arc-4",
      act: "4. Perde (2018–2022)",
      title: "Ölçek, İnsan Hizalaması ve Bellek Duvarı",
      scene: "GPT-1/2 ve BERT gösterdi ki etiketlenmemiş ham metni tahmin ederek eğitilen Transformer inanılmaz genel dil bilgisi biriktiriyor.",
      wall: "Üç büyük duvar çıktı: (1) Ham temel modeller sohbet emrine uymuyordu, (2) Rastgele büyütmek GPU parasını yakıyordu, (3) Attention belleği O(N²) patlıyordu.",
      breakthrough: "InstructGPT (RLHF) modelleri asistana çevirdi; Chinchilla N ∝ D optimal ölçekleme kuralını buldu; FlashAttention SRAM/HBM bellek darboğazını çözdü.",
      bridge: "Çıkış sorusu: Dev şirketlerin milyar dolar harcadığı bu teknolojiyi küçük ekipler ve tek GPU'lar nasıl kullanabilir?",
      paperIds: ["tl-2018-gpt1", "tl-2018-bert", "tl-2019-gpt2", "tl-2020-kaplan-scaling", "tl-2020-gpt3", "tl-2022-chinchilla", "tl-2022-instructgpt", "tl-2022-flashattention"]
    },
    {
      id: "arc-5",
      act: "5. Perde (2020–2024)",
      title: "Modern Mimari & Sıfır-Bütçe Demokratikleşmesi",
      scene: "2017 Transformer bloğu adım adım cilalandı (Pre-LN, RMSNorm, SwiGLU, RoPE, GQA). Aynı anda tek GPU'lu geliştiriciler için çıkış yolları arandı.",
      wall: "Tam ağırlık güncellemesi ve PPO tabanlı RLHF onlarca GB VRAM istiyordu; öğrenci ve küçük ekipler donanım duvarına çarpıyordu.",
      breakthrough: "LoRA ve 4-bit QLoRA tek GPU'da ince ayarı açtı; DPO ödül modelini kaldırdı; TinyStories ve Phi-1 küçük model + temiz verinin gücünü kanıtladı; vLLM sunumu hızlandırdı.",
      bridge: "Çıkış sorusu: Küçük ve açık ağırlıklı modeller kendi başına düşünmeyi (reasoning) ve devlerle yarışmayı başarabilir mi?",
      paperIds: ["tl-2020-preln", "tl-2019-rmsnorm", "tl-2020-swiglu", "tl-2021-rope", "tl-2023-gqa", "tl-2021-lora", "tl-2023-qlora", "tl-2023-dpo", "tl-2023-tinystories", "tl-2023-phi1", "tl-2023-vllm"]
    },
    {
      id: "arc-6",
      act: "6. Perde (2024–2026)",
      title: "Açık Bilim, MoE Verimliliği ve Akıl Yürütme Çağı",
      scene: "Kapalı modellerin sırrı perdelenmişken açık ağırlıklı ve tam açık kaynaklı ekosistem (Llama 3, OLMo 2, SmolLM2, FineWeb, Mixtral, DeepSeek) öne çıktı.",
      wall: "Yoğun modellerde her token tüm parametreleri çalıştırdığı için maliyet katlanıyordu; ayrıca modeller zor matematikte hemen cevap verip hata yapıyordu.",
      breakthrough: "DeepSeek-V3 MoE + MLA ile maliyeti kırdı; OLMo 2 veri+kod dahil her şeyi açtı; DeepSeek-R1 GRPO pekiştirmeli öğrenmesiyle uzun düşünce zincirlerini doğurdu ve 1.5B modellere damıttı.",
      bridge: "Çıkış sorusu: Peki İngilizce dışındaki diller — özellikle Türkçe — bu yarışta nerede duruyor?",
      paperIds: ["tl-2024-mixtral", "tl-2024-grpo", "tl-2024-fineweb", "tl-2024-llama3", "tl-2025-deepseek-v3", "tl-2025-olmo2", "tl-2025-deepseek-r1", "tl-2025-smollm2"]
    },
    {
      id: "arc-7",
      act: "7. Perde (2023–2026+)",
      title: "Türkçe'nin Kendi Hikâyesi & Sıra Sizde!",
      scene: "İngilizce odaklı modeller eklemeli Türkçe kelimeleri aşırı parçalıyor (yüksek fertility) ve çeviri testler kültürel/dilbilgisi nüanslarını kaçırıyordu.",
      wall: "Temiz Türkçe ön-eğitim derlemi ve standart Türkçe bilimsel değerlendirme paketleri olmadan ilerlemek karanlıkta yürümek demekti.",
      breakthrough: "Tokenizer eşitsizliği (Petrov et al.) bilimsel olarak kanıtlandı; FineWeb2 (`tur_Latn`) açık Türkçe temiz veri hattını verdi; TurkishMMLU ve CETVEL (EACL 2026) özgün Türkçe kıyaslamaları kurdu.",
      bridge: "Bundan sonraki perdeyi sizin 5 kişilik ekip yazıyor: Modül 0'dan başlayıp kendi küçük modelinizi ve Türkçe deneylerinizi inşa edin.",
      paperIds: ["tl-2023-tokenizer-unfairness", "tl-2024-turkishmmlu", "tl-2025-fineweb2", "tl-2026-cetvel"]
    }
  ];

  DATA.MASCOT_TOUR_STEPS = [
    {
      title: "Merhaba, ben Lintu!",
      eyebrow: "Adım 1 / 6 · Hoş Geldin",
      say: "Üniversite başındasınız, bütçeniz sıfıra yakın ama hedefiniz büyük: yapay zeka modelini siyah kutu gibi kullanmak yerine sıfırdan mantığını çözmek. Bu rehberi tam sizin 5 kişilik ekip için hazırladık.",
      previewTitle: "Buradaki her bilgi kaynaklıdır",
      previewItems: [
        "84 doğrulanmış akademik makale ve tüm linkler kanoniktir; tahmin veya uydurma yok.",
        "Blog/kurs gibi hakemli olmayan her kaynağın yazar nitelik karnesi açıkça yazılıdır.",
        "Hiç bilmeyenler için '0. Sıfırdan Başla & Yardım' sekmesi eklendi."
      ]
    },
    {
      title: "Hiç Bilmiyorsan 0. Sekmeden Başla",
      eyebrow: "Adım 2 / 6 · Yeni Başlayan Desteği",
      say: "Matematik veya PyTorch bilmiyor olman sorun değil! 0. sekmede ilk 7 gün planı, ücretsiz kurulumsuz yardım kanalları (BTK Akademi, Kaggle Learn, fast.ai), 28 terimlik benzetmeli sözlük ve 5 'Takıldım' AI istemi seni bekliyor.",
      previewTitle: "Önce güven kazan, sonra derine in",
      previewItems: [
        "7 Günlük Başlangıç Planı ile ilk hafta hiç kaybolmadan ilk kodunu çalıştır.",
        "Takıldığında Sokratik AI istemini kullan; cevabı ezberleme, mantığı kap.",
        "Bölüm hocana göndermek için hazır TÜBİTAK 2209-A / TRUBA e-posta taslağı bile hazır."
      ]
    },
    {
      title: "Tarihi Olay Örgüsüyle Anla",
      eyebrow: "Adım 3 / 6 · Neden Bu İcat Edildi?",
      say: "82 makaleyi sadece yıl sırasıyla ezberlemek zor olurdu. '2. Olay Örgüsü & Tarih' sekmesinde her dönemin hangi duvara çarptığını ve bir sonraki icadın neden doğduğunu 7 perdelik bir hikâye gibi okuyabilirsin.",
      previewTitle: "Olay Örgüsü ↔ Kronoloji Köprüsü",
      previewItems: [
        "Her perdede: Sahne → Çarpılan Duvar → Kırılma → Sonraki Perdeye Köprü.",
        "Perde içindeki makale çipine tıklayınca doğrudan ilgili bilimsel makale kartına atlarsın."
      ]
    },
    {
      title: "Teknik Derinlikten Taviz Yok",
      eyebrow: "Adım 4 / 6 · 10 Modül & Hesaplayıcılar",
      say: "Başlangıç dostu olmak tekniği sulandırmak değil! 3. sekmede 10 işlevsel altyapı modülü, 4. sekmede ise EleutherAI 6ND & 16N formülleriyle canlı GPU VRAM ve Chinchilla süre hesaplayıcıları var.",
      previewTitle: "Dürüst Gerçeklik Kuralı",
      previewItems: [
        "Sıfırdan 10M–124M model eğiterek altyapıyı tamamen öğrenebilirsiniz (TinyStories / llm.c).",
        "Sonra QLoRA + Unsloth + GRPO ile 16 GB ücretsiz GPU'da gerçekçi modeller uyarlarsınız."
      ]
    },
    {
      title: "Akıllı Seçim & Yerel Dosyaya Kayıt",
      eyebrow: "Adım 5 / 6 · Kişisel İlerleme",
      say: "Artık sadece 'Okundu' tiki değil; her kartta Başlanmadı / Çalışıyorum / Tamamlandı seçimi, Yıldız (★), kişisel not kutusu ve seçtiğin role göre 'Senin İçin Önerilen' vurgusu var!",
      previewTitle: "Bilgisayarındaki Gerçek Dosyaya Kaydet",
      previewItems: [
        "Sol alttan adını/rolünü seç; ilerlemeni 'Yerel Dosya Bağla' ile doğrudan diskindeki JSON dosyasına kaydet.",
        "İstersen tek tıkla SecondBrain / Obsidian uyumlu .md ilerleme raporu indir."
      ]
    },
    {
      title: "Şimdi Top Sizin 5 Kişilik Ekipte!",
      eyebrow: "Adım 6 / 6 · Haydi Başlayalım",
      say: "Sağ alttaki kırmızı Lintu kafasına ne zaman tıklarsan bulunduğun sekme için kısa bir rehberlik açarım. Önce sol alttan profil adını ve rolünü seçerek başlayabilirsin!",
      previewTitle: "İlk Adım Önerisi",
      previewItems: [
        "1) Sol alttan adını & rolünü seç.",
        "2) '0. Sıfırdan Başla & Yardım' sekmesinde 1. Günü aç.",
        "3) Bu pencereyi kapatıp hemen keşfe başla!"
      ]
    }
  ];

  DATA.MASCOT_TAB_TIPS = {
    "baslangic": "Burası sıfırdan başlangıç üssün! İlk 7 gün planını aç, sözlükten temel kavramlara bak ve takıldığında 'Takıldım' istemlerini kullan.",
    "genel-bakis": "Burada sıfır bütçeyle nelerin bilimsel olarak mümkün (TinyStories, llm.c, QLoRA) ve nelerin hayal (DeepSeek-V3 sıfırdan) olduğunu net rakamlarla görürsün.",
    "tarih": "Üstteki anahtarla 'Olay Örgüsü (7 Perde)' ve 'Kronolojik Liste (82 Makale)' arasında geçiş yap. Perdedeki bir makaleye tıklarsan listede seni oraya götürürüm.",
    "altyapi": "Sırayı bozma: Modül 0 (Linux/Git/Python) → Modül 1 (Matematik) → Modül 3 (CS336 + nanoGPT). Rol filtresiyle kendi görevine odaklanabilirsin.",
    "hesaplayicilar": "Ücretsiz Colab T4 (15 GB) veya Kaggle (16 GB) açmadan önce mutlaka burada modelin sığıp sığmayacağını kontrol et; yoksa OOM alırsın.",
    "sifir-butce": "5 kişi Kaggle hesabını birleştirirse haftalık ~150 saat ücretsiz GPU eder! Üniversiteden hoca bulduğunuzda da TRUBA + TÜBİTAK 2209-A kapısı açılır.",
    "ai-kullanim": "Kısıtsız AI sohbetin öğrenmeyi %17 düşürebildiğini (PNAS 2025) unutma. Sistem istemini kopyalayıp AI'ı Sokratik hocaya çevir.",
    "ekip-plani": "5 kişi aynı şeyi okuyup dağılmasın: Ortak Faz 0'dan sonra herkes 5 rolden birinin liderliğini alsın ve haftalık 45 dk birbirine anlatsın.",
    "kaynak-denetimi": "Her blog veya kurs hakemli dergi değildir. Bu tabloda yazarların gerçek akademik/sektör geçmişini ve kaynağın dürüst sınırını görürsün.",
    "kutuphane": "Profilinden rol ve seviye seçtiysen burada 'Senin İçin Önerilen' filtresine bas! Her kaynağa 'Çalışıyorum/Tamamlandı', yıldız ve not ekleyebilirsin."
  };

  // Yeni başlangıç & yardım kaynaklarını ALL_RESOURCES içine güvenli ekle
  const extraResources = [
    { id: "res-b01", year: 2026, title: "BTK Akademi — Ücretsiz Türkçe Yazılım & Python Eğitimleri", authors: "T.C. Bilgi Teknolojileri ve İletişim Kurumu", category: "Başlangıç & Yardım", type: "Türkçe Açık Eğitim", level: "Başlangıç", roles: ["ortak"], access: "Açık Erişim (Ücretsiz)", url: "https://www.btkakademi.gov.tr", summary: "Türkçe sıfırdan Python, algoritma ve temel programlama başlangıcı." },
    { id: "res-b02", year: 2026, title: "Kaggle Learn — Kurulumsuz Python & ML Mikro-Kursları", authors: "Kaggle", category: "Başlangıç & Yardım", type: "Etkileşimli Kurs", level: "Başlangıç", roles: ["ortak", "veri"], access: "Açık Erişim", url: "https://www.kaggle.com/learn", summary: "Tarayıcıda kurulumsuz Python, Pandas ve makine öğrenmesi pratiği." },
    { id: "res-b03", year: 2024, title: "fast.ai — Practical Deep Learning for Coders", authors: "Jeremy Howard, Sylvain Gugger", category: "Başlangıç & Yardım", type: "Açık Kurs", level: "Başlangıç", roles: ["ortak", "mimari"], access: "Açık Erişim", url: "https://course.fast.ai", secondaryUrl: "https://docs.fast.ai", summary: "Yukarıdan aşağıya, kod-öncelikli pratik derin öğrenme kursu." },
    { id: "res-b04", year: 2026, title: "Python Resmî Dokümantasyonu & Öğreticisi", authors: "Python Software Foundation", category: "Temel CS", type: "Resmî Dokümantasyon", level: "Başlangıç", roles: ["ortak"], access: "Açık Erişim", url: "https://docs.python.org", summary: "Dil sözdizimi ve standart kütüphaneler için birincil kaynak." },
    { id: "res-b05", year: 2026, title: "PyTorch Resmî Tartışma Forumu", authors: "PyTorch Topluluğu & Mühendisleri", category: "Başlangıç & Yardım", type: "Geliştirici Forumu", level: "Temel", roles: ["ortak", "sistem", "mimari"], access: "Açık Erişim", url: "https://discuss.pytorch.org", summary: "Tensör hataları, CUDA OOM ve DataLoader sorunlarında topluluk desteği." },
    { id: "res-b06", year: 2026, title: "Hugging Face Resmî Forumu", authors: "Hugging Face Topluluğu", category: "Başlangıç & Yardım", type: "Geliştirici Forumu", level: "Temel", roles: ["veri", "posttraining"], access: "Açık Erişim", url: "https://discuss.huggingface.co", summary: "Tokenizer, FineWeb2, QLoRA ve TRL sorularında doğrudan yardım alanı." }
  ];

  const existingResIds = new Set(DATA.ALL_RESOURCES.map((r) => r.id));
  extraResources.forEach((r) => {
    if (!existingResIds.has(r.id)) {
      DATA.ALL_RESOURCES.push(r);
      existingResIds.add(r.id);
    }
  });

  // Yeni kaynakların yazar/kurum nitelik denetimlerini CREDENTIAL_AUDIT'e ekle
  const extraAudits = [
    {
      id: "aud-fastai",
      resourceName: "fast.ai — Practical Deep Learning for Coders",
      category: "Açık Uygulamalı Kurs",
      url: "https://course.fast.ai",
      authorCredentials: "Jeremy Howard (eski Kaggle Başkanı ve #1 dereceli yarışmacısı, USF Data Institute öğretim üyesi, Answer.AI kurucu araştırmacısı) ve Sylvain Gugger (Hugging Face ve fast.ai çekirdek araştırmacısı).",
      caveat: "Yukarıdan-aşağıya (top-down) hızlı prototipleme yaklaşımıdır; matematiksel ispat ve düşük seviye GPU sistemleri için Stanford CS336 ve MML Book ile tamamlanmalıdır."
    },
    {
      id: "aud-btk",
      resourceName: "BTK Akademi",
      category: "Resmî Türkçe Eğitim Platformu",
      url: "https://www.btkakademi.gov.tr",
      authorCredentials: "T.C. Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından kamu yararına sunulan ulusal ücretsiz çevrimiçi eğitim portalı.",
      caveat: "Sıfırdan Türkçe Python ve yazılım temeli edinmek için idealdir; ileri LLM mimarisi ve güncel araştırma makaleleri için buradaki uluslararası İngilizce kaynaklara geçilmelidir."
    },
    {
      id: "aud-kaggle-learn",
      resourceName: "Kaggle Learn",
      category: "Etkileşimli Mikro-Kurs Platformu",
      url: "https://www.kaggle.com/learn",
      authorCredentials: "Google bünyesindeki Kaggle veri bilimi platformu mühendisleri ve yarışma topluluğu tarafından hazırlanmış uygulamalı defterler.",
      caveat: "Çok kısa ve yüzeysel başlangıç egzersizleridir; yalnızca ilk haftada kurulumsuz kod pratiği kazanmak için kullanılmalıdır."
    },
    {
      id: "aud-forums",
      resourceName: "PyTorch Forums, Hugging Face Forums & Python Docs",
      category: "Resmî Dokümantasyon & Topluluk Forumu",
      url: "https://discuss.pytorch.org",
      authorCredentials: "PyTorch Foundation, Hugging Face mühendisleri, Python Software Foundation ve açık kaynak topluluk sürdürücüleri.",
      caveat: "Forum yanıtları topluluk üyeleri tarafından yazıldığından eski tarihli cevaplardaki API sürümleri güncel resmî dokümantasyonla (pytorch.org/docs) teyit edilmelidir."
    }
  ];

  const existingAudIds = new Set(DATA.CREDENTIAL_AUDIT.map((a) => a.id));
  extraAudits.forEach((a) => {
    if (!existingAudIds.has(a.id)) {
      DATA.CREDENTIAL_AUDIT.push(a);
      existingAudIds.add(a.id);
    }
  });
})();
