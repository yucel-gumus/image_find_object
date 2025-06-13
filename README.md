# Web Uygulamanızı Çalıştırın ve Dağıtın

Bu, uygulamanızı yerel olarak çalıştırmak için ihtiyacınız olan her şeyi içerir.

## Yerel Olarak Çalıştırma

**Gereksinimler:** Node.js

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. [.env.local](.env.local) dosyasında `GEMINI_API_KEY` değerini Gemini API anahtarınızla ayarlayın

3. Uygulamayı çalıştırın:
   ```bash
   npm run dev
   ```

## Özellikler

- **2D Sınırlayıcı Kutular**: Resimlerdeki nesneleri dikdörtgen kutularla tespit edin
- **3D Sınırlayıcı Kutular**: Nesnelerin 3 boyutlu konumlarını belirleyin
- **Segmentasyon Maskeleri**: Nesnelerin kesin sınırlarını çıkarın
- **Nokta Tespiti**: Belirli noktaları işaretleyin
- **Ekran Paylaşımı**: Canlı ekran görüntülerini analiz edin
- **Örnek Resimler**: Hazır resimlerle hızlıca test edin

## Kullanım

1. Bir resim yükleyin veya örnek resimlerden birini seçin
2. Tespit türünü seçin (2D kutular, 3D kutular, segmentasyon, noktalar)
3. Ne tespit etmek istediğinizi yazın
4. "Gönder" butonuna tıklayın
5. Sonuçları görüntüleyin ve etkileşimde bulunun
