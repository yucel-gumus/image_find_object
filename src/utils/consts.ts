import socksImg from '../assets/examples/socks.jpg';
import catImg from '../assets/examples/cat.jpg';

export const DEFAULT_TEMPERATURE = 0.2;
export const MAX_CANVAS_SIZE = 640;

export const colors = [
  'rgb(236, 125, 85)',  // #EC7D55
  'rgb(171, 66, 28)',   // #AB421C
  'rgb(37, 51, 65)',    // #253341
  'rgb(62, 81, 100)',   // #3E5164
  'rgb(242, 164, 136)', // #F2A488
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
}

export const segmentationColors = [
  '#EC7D55',
  '#AB421C',
  '#253341',
  '#3E5164',
  '#F2A488',
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
