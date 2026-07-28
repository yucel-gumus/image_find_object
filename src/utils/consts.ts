import socksImg from '../assets/examples/socks.jpg';
import catImg from '../assets/examples/cat.jpg';

export const DEFAULT_TEMPERATURE = 0.2;
export const MAX_CANVAS_SIZE = 640;

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

  _imageOptions = [socksImg, catImg];
  return _imageOptions;
}

export const lineOptions = {
  size: 8,
  thinning: 0,
  smoothing: 0,
  streamline: 0,
  simulatePressure: false,
};
