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
