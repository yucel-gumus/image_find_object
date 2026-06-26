# Nesne Tespiti — Uzamsal Anlama (`image_find_object`)

Gemini vision modelleri ile görüntülerde **segmentasyon maskeleri** ve nesne etiketleri üreten React + Vite uygulaması. Üretimde analiz istekleri **Gemini Gateway** (`/api/analyze-image`) üzerinden gider; Vercel serverless veya dev proxy ile API anahtarı sunucu tarafında kalır.

**GitHub:** [yucel-gumus/image_find_object](https://github.com/yucel-gumus/image_find_object)

---

## Özellikler

- **Metinle hedefleme:** “çoraplar”, “kedi” gibi ifadelerle nesne listesi
- **Girdi kaynakları:** dosya yükleme, örnek görseller, ekran paylaşımı (stream capture)
- **Maske çizimi:** polygon koordinatları ve görsel overlay
- **Zoom / pan:** sonuç canvas üzerinde inceleme
- **State:** Jotai ile hafif global state
- **Çizim:** `perfect-freehand` ile serbest çizim desteği

---

## Mimari

```
React (Vite)
    │ POST /api/analyze-image  { image, prompt }
    ▼
Vercel Function (api/analyze-image.ts)  [prod]
    veya vite proxy → gateway           [dev]
    ▼
https://api.yucelgumus.dev/api/analyze-image
    ▼
Gemini (segmentation / detection JSON)
```

`src/services/gemini.ts` base URL:

- `VITE_API_BASE_URL` set ise: `{base}/api/analyze-image`
- Aksi halde same-origin `/api/analyze-image` (Vercel function)

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/image_find_object.git
cd image_find_object
npm install
cp .env.example .env
```

### Ortam

```env
AI_API_URL=https://api.yucelgumus.dev
GATEWAY_CLIENT_API_KEY=...        # Vercel / server only
VITE_API_BASE_URL=                # boş = same-origin API route
```

Geliştirme:

```bash
npm run dev    # http://localhost:5173 — vite.config proxy → gateway
```

---

## Vercel deploy

- `api/analyze-image.ts` serverless handler gateway’e `X-API-Key` ile proxy eder
- `scripts/vercel_prod_deploy.py` env senkronu için kullanılabilir
- Client bundle’da **GEMINI_API_KEY olmamalı**

---

## API sözleşmesi (özet)

**İstek:** multimodal gövde — base64 görsel + kullanıcı prompt (aranan nesneler)

**Yanıt:** model çıktısından parse edilen maskeler (polygon noktaları), bounding bilgisi, etiketler — UI bunları renkli katmanlar olarak çizer.

Detaylı şema gateway implementasyonuna bağlıdır (`python_backend`).

---

## Teknoloji

| Bileşen | Kütüphane |
|---------|-----------|
| UI | React 19, Tailwind 4 (browser) |
| Build | Vite 6, TypeScript |
| Deploy | Vercel Node runtime |

---

## İlgili repo

- [llm_api](https://github.com/yucel-gumus/llm_api) — Gateway ve `analyze-image` implementasyonu

---

## Kullanım

1. Görsel seçin veya ekran paylaşın
2. Tespit edilecek nesneleri yazın
3. **Analiz Et** — maskeler ve etiketler görünür
4. Oturumu sıfırlayarak yeni analiz başlatın

---

## Lisans

Apache-2.0 veya repo lisansına tabidir.