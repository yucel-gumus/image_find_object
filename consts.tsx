export const colors = [
  'rgb(0, 0, 0)',
  'rgb(255, 255, 255)',
  'rgb(213, 40, 40)',
  'rgb(250, 123, 23)',
  'rgb(240, 186, 17)',
  'rgb(8, 161, 72)',
  'rgb(26, 115, 232)',
  'rgb(161, 66, 244)',
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
}

export const segmentationColors = [
  '#E6194B',
  '#3C89D0',
  '#3CB44B',
  '#FFE119',
  '#911EB4',
  '#42D4F4',
  '#F58231',
  '#F032E6',
  '#BFEF45',
  '#469990',
];
export const segmentationColorsRgb = segmentationColors.map((c) => hexToRgb(c));

// Image options'ı lazy loading ile initialize ediyoruz
let _imageOptions: string[] | null = null;

export async function getImageOptions(): Promise<string[]> {
  if (_imageOptions) {
    return _imageOptions;
  }
  
  _imageOptions = await Promise.all(
    [
      'origami.jpg',
      'pumpkins.jpg',
      'clock.jpg',
      'socks.jpg',
      'breakfast.jpg',
      'cat.jpg',
      'spill.jpg',
      'fruit.jpg',
      'baklava.jpg',
    ].map(async (i) =>
      URL.createObjectURL(
        await (
          await fetch(
            `https://www.gstatic.com/aistudio/starter-apps/bounding-box/${i}`,
          )
        ).blob(),
      ),
    ),
  );
  
  return _imageOptions;
}

// Geçici olarak boş array, gerçek değerler getImageOptions() ile yüklenecek
export const imageOptions: string[] = [];

export const lineOptions = {
  size: 8,
  thinning: 0,
  smoothing: 0,
  streamline: 0,
  simulatePressure: false,
};

export const defaultPromptParts = {
  '2D sınırlayıcı kutular': [
    'Bana şunların konumlarını göster:',
    'öğeler',
    'JSON listesi olarak. Maske döndürme. En fazla 25 öğe ile sınırla.',
  ],
  'Segmentasyon maskeleri': [
    'Şunlar için segmentasyon maskelerini ver:',
    'öğeler',
    '. "box_2d" anahtarında 2D sınırlayıcı kutu, "mask" anahtarında segmentasyon maskesi ve "label" anahtarında metin etiketi bulunan JSON listesi çıktısı ver. Açıklayıcı etiketler kullan.',
  ],
  '3D sınırlayıcı kutular': [
    'JSON formatında çıktı ver. Şunların 3D sınırlayıcı kutularını tespit et:',
    'öğeler',
    ', en fazla 10 öğe çıktısı ver. "label" içinde nesne adı ve "box_3d" içinde 3D sınırlayıcı kutusu bulunan liste döndür.',
  ],
  'Noktalar': [
    'Şunları işaretle:',
    'öğeler',
    ' en fazla 10 öğe ile. Cevap şu JSON formatını takip etmeli: [{"point": <nokta>, "label": <etiket1>}, ...]. Noktalar 0-1000 arasında normalize edilmiş [y, x] formatındadır.',
  ],
};

export const defaultPrompts = {
  '2D sınırlayıcı kutular': defaultPromptParts['2D sınırlayıcı kutular'].join(' '),
  '3D sınırlayıcı kutular': defaultPromptParts['3D sınırlayıcı kutular'].join(' '),
  'Segmentasyon maskeleri': defaultPromptParts['Segmentasyon maskeleri'].join(''),
  'Noktalar': defaultPromptParts['Noktalar'].join(' '),
};

const safetyLevel = 'only_high';

export const safetySettings = new Map();

safetySettings.set('harassment', safetyLevel);
safetySettings.set('hate_speech', safetyLevel);
safetySettings.set('sexually_explicit', safetyLevel);
safetySettings.set('dangerous_content', safetyLevel);
safetySettings.set('civic_integrity', safetyLevel);
