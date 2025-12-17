# Nesne Tespiti (Segmentasyon Maskeleri)

Bu uygulama, Gemini modellerini kullanarak resimlerdeki nesneleri gelişmiş segmentasyon maskeleri ile tespit etmenizi sağlar. Proje, güvenli bir yapı için Python (FastAPI) tabanlı bir backend ile çalışacak şekilde tasarlanmıştır.

## Kurulum ve Çalıştırma

### 1. Frontend (React)
Bağımlılıkları yükleyin:
```bash
npm install
```
`.env` adında bir dosya oluşturun ve API adresinizi tanımlayın:
```text
VITE_API_URL=""
```
Ardından geliştirme sunucusunu başlatın:
```bash
npm run dev
```
Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### 2. Backend (Python/FastAPI)
Bu proje, API çağrılarını yönetmek için bir Python backend'ine ihtiyaç duyar.
- Gerekli paketler: `fastapi`, `uvicorn`, `google-generativeai`, `Pillow`.
- Backend'inizi `http://localhost:8000/api/analyze-image` endpoint'ini sağlayacak şekilde çalıştırın.

## Önemli Özellikler

- **Gelişmiş Segmentasyon**: Nesnelerin tam sınırlarını belirleyen maskeler çıkarın.
- **Gemini 3 Flash Desteği**: En güncel Gemini modelleri ile yüksek hız ve doğruluk.
- **Farklı Giriş Yöntemleri**: Resim yükleme, ekran paylaşımı veya örnek resimler üzerinden analiz yapabilme.
- **Esnek Maske Çizimi**: Hem koordinat bazlı (polygon) hem de görsel bazlı maske desteği.

## Kullanım

1. Bir resim yükleyin, örneklerden birini seçin veya ekranınızı paylaşın.
2. Tespit edilmesini istediğiniz nesneleri yazın (Örn: "çoraplar", "kedi").
3. **Analiz Et** butonuna tıklayın.
4. Sonuçlar ekranda renkli maskeler ve etiketler olarak belirecektir.
   - Maskelerin üzerine gelerek detayları görebilirsiniz.
   - Oturumu sıfırlayarak yeni bir analize başlayabilirsiniz.
