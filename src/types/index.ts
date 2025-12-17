export type DetectTypes = 'Segmentasyon maskeleri';

export type BoundingBoxMaskType = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  mask: string | number[][];
};


