export const colors = [
  'rgb(155, 206, 193)', // #9BCEC1 Sage Mint
  'rgb(255, 182, 166)', // #FFB6A6 Soft Peach
  'rgb(61, 35, 28)',    // #3D231C Dark Terracotta
  'rgb(217, 136, 119)',  // #D98877 Deep Peach
  'rgb(109, 162, 148)',  // #6DA294 Dark Mint
  'rgb(255, 235, 211)',  // #FFEBD3 Cream
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
}

export const segmentationColors = [
  '#9BCEC1',
  '#FFB6A6',
  '#D98877',
  '#86BBAE',
  '#E89E8E',
  '#6DA294',
  '#FFCBD0',
  '#6EA497',
];

export const segmentationColorsRgb = segmentationColors.map((c) => hexToRgb(c));

let _imageOptions: string[] | null = null;

export async function getImageOptions(): Promise<string[]> {
  if (_imageOptions) {
    return _imageOptions;
  }

  _imageOptions = await Promise.all(
    [
      'socks.jpg',
      'cat.jpg',
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

export const imageOptions: string[] = [];

export const lineOptions = {
  size: 8,
  thinning: 0,
  smoothing: 0,
  streamline: 0,
  simulatePressure: false,
};

export const defaultPromptParts = {
  'Segmentasyon maskeleri': [
    'Şunlar için segmentasyon maskelerini ver:',
    'öğeler',
    '. "box_2d" anahtarında 2D sınırlayıcı kutu, "mask" anahtarında segmentasyon maskesi ve "label" anahtarında metin etiketi bulunan JSON listesi çıktısı ver. Açıklayıcı etiketler kullan.',
  ],
};

export const defaultPrompts = {
  'Segmentasyon maskeleri': defaultPromptParts['Segmentasyon maskeleri'].join(''),
};

const safetyLevel = 'only_high';

export const safetySettings = new Map();

safetySettings.set('harassment', safetyLevel);
safetySettings.set('hate_speech', safetyLevel);
safetySettings.set('sexually_explicit', safetyLevel);
safetySettings.set('dangerous_content', safetyLevel);
safetySettings.set('civic_integrity', safetyLevel);
