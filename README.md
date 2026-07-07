# 🔍 Nesne Tespiti & Uzamsal Anlama (Gemini Vision Object Detection & Segmentation)

Nesne Tespiti; kullanıcıların yüklediği görseller, hazır örnekler veya ekran paylaşımları (video/stream capture) üzerinde yapay zeka yardımıyla nesneleri tespit etmesini ve sınırlarını belirlemesini sağlayan, **React 19 & TailwindCSS v4** tabanlı modern bir web uygulamasıdır. 

Uygulama, Google Gemini'ın gelişmiş **Spatial Understanding (Uzamsal Anlama)** yeteneğini kullanarak görseldeki nesnelerin konum koordinatlarını çıkarır ve arayüzde dinamik maskeler halinde çizer.

---

## 🌟 Öne Çıkan Özellikler

* 🎯 **Metin Hedefli Nesne Bulma:** Kullanıcı aramak istediği nesneleri yazar (Örn: *"çoraplar"*, *"bardak"*, *"kedi"*). Yapay zeka sadece bu nesneleri bulup konumlandırır.
* 📐 **Gemini Spatial Bounding Box & Polygon Çizimi:**
  * Yapay zeka, nesneleri `[ymin, xmin, ymax, xmax]` formatında sınırlayıcı kutular (bounding boxes) ve polygon noktaları olarak tespit eder.
  * React istemcisi, bu normalleştirilmiş koordinatları görsel boyutlarına göre haritalandırarak nesnelerin etrafına renkli maskeler (overlay) ve etiketler çizer.
* ✍️ **Serbest Çizim Desteği (`perfect-freehand`):** Kullanıcılar tuval (canvas) üzerinde fareyle veya dokunarak pürüzsüz serbest çizimler yapabilir, nesneleri işaretleyebilir.
* 📹 **Çoklu Girdi Kaynakları:** Cihazdan yerel fotoğraf yükleme, yerleşik örnek görselleri kullanma veya anlık ekran/kamera akışını (stream capture) yakalama desteği.
* ⚡ **Jotai State Yönetimi:** Jotai kütüphanesiyle hafif, atomik ve yüksek performanslı durum yönetimi (State Management).

---

## 🏗️ Mimarî Yapı ve Veri Akışı

API anahtarlarının istemci tarafında sızdırılmasını engellemek için tüm işlemler Vercel Serverless proxy katmanı üzerinden yönlendirilir:

```
[ İstemci (Vite + Jotai) ] ──(POST /api/analyze-image)──► [ Vercel Serverless (api/analyze-image.ts) ]
                                                                       │
                                                             (X-API-Key Yetkilendirme)
                                                                       ▼
[ Gemini Vision API ] ◄──(Bounding Box & Polygons)─── [ Python Gateway (api.yucelgumus.dev) ]
```

---

## 📂 Proje Klasör Yapısı

```
image_find_object/
├── src/
│   ├── components/
│   │   ├── CanvasContainer.tsx   # perfect-freehand çizimlerinin yapıldığı ve görsellerin render edildiği ana tuval
│   │   ├── ImageSelector.tsx     # Örnek ve yüklenen resimlerin seçimi
│   │   └── ControlPanel.tsx      # Arama girdileri ve analiz tetikleyici butonlar
│   ├── services/
│   │   └── gemini.ts             # Gateway bağlantı ve veri dönüştürme servisi
│   ├── App.tsx                   # Ana React bileşeni ve Jotai state tanımları
│   └── main.tsx
├── api/
│   └── analyze-image.ts          # Vercel Serverless Gateway Proxy
├── tsconfig.json
├── vite.config.ts            # Dev proxy yapılandırması
└── package.json
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/image_find_object.git
cd image_find_object
npm install
```

### 2. Ortam Değişkenleri (`.env`)
Proje kök dizininde `.env` oluşturun:

```env
# Sunucu Tarafı (Vercel Serverless / Local API için)
AI_API_URL=https://api.yucelgumus.dev
GATEWAY_CLIENT_API_KEY=your_client_api_key

# İstemci Tarafı (Boş bırakılırsa same-origin /api/analyze-image kullanılır)
VITE_API_BASE_URL=
```

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde başlayacaktır.

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://image-find-object.vercel.app/](https://image-find-object.vercel.app/)
* **Geliştirici LinkedIn:** [https://linkedin.com/in/yucel-gumus](https://linkedin.com/in/yucel-gumus)