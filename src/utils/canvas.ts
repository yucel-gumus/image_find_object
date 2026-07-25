import getStroke from 'perfect-freehand';
import { lineOptions, MAX_CANVAS_SIZE } from './consts';
import { getSvgPathFromStroke, loadImage } from './index';

/**
 * Prepares a scaled Base64 PNG DataURL from an image source and optional freehand stroke lines.
 */
export async function prepareCanvasDataURL(
  imageSrc: string,
  lines: [[number, number][], string][] = [],
  maxSize: number = MAX_CANVAS_SIZE
): Promise<string> {
  const copyCanvas = document.createElement('canvas');
  const ctx = copyCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Tuval (Canvas) oluşturulamadı.');
  }

  const image = await loadImage(imageSrc);
  const scale = Math.min(maxSize / image.width, maxSize / image.height);

  copyCanvas.width = image.width * scale;
  copyCanvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, copyCanvas.width, copyCanvas.height);

  // Draw overlay stroke lines if present
  if (lines.length > 0) {
    for (const line of lines) {
      const p = new Path2D(
        getSvgPathFromStroke(
          getStroke(
            line[0].map(([x, y]) => [
              x * copyCanvas.width,
              y * copyCanvas.height,
              0.5,
            ]),
            lineOptions
          )
        )
      );
      ctx.fillStyle = line[1];
      ctx.fill(p);
    }
  }

  return copyCanvas.toDataURL('image/png');
}
