
import { useEffect, useRef } from 'react';
import { segmentationColorsRgb } from '../../utils/consts';
import { BoundingBoxMaskType } from '../../types';

interface BoxMaskProps {
    box: BoundingBoxMaskType;
    index: number;
}

export function BoxMask({ box, index }: BoxMaskProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rgb = segmentationColorsRgb[index % segmentationColorsRgb.length];

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (typeof box.mask === 'string') {
            const image = new Image();
            image.src = box.mask;
            image.onload = () => {
                if (!canvasRef.current) return;
                canvasRef.current.width = image.width;
                canvasRef.current.height = image.height;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(image, 0, 0);
                const pixels = ctx.getImageData(0, 0, image.width, image.height);
                const data = pixels.data;
                for (let i = 0; i < data.length; i += 4) {
                    data[i + 3] = data[i];
                    data[i] = rgb[0];
                    data[i + 1] = rgb[1];
                    data[i + 2] = rgb[2];
                }
                ctx.putImageData(pixels, 0, 0);
            };
        } else if (Array.isArray(box.mask)) {
            // Polygon çizimi
            const canvas = canvasRef.current;
            // Yüksek çözünürlük için genişlik/yükseklik ayarı
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;

            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ctx.beginPath();

            box.mask.forEach((point, i) => {
                // Koordinatları normalize et (0-1000 -> 0-1)
                const x_norm = point[0] / 1000;
                const y_norm = point[1] / 1000;

                // Bounding box içindeki yerel koordinatlara çevir (0-1)
                // box.x, box.y, box.width, box.height 0-1 arasındadır
                const local_x = (x_norm - box.x) / box.width;
                const local_y = (y_norm - box.y) / box.height;

                // Canvas boyutuna göre ölçekle
                const final_x = local_x * canvas.clientWidth;
                const final_y = local_y * canvas.clientHeight;

                if (i === 0) ctx.moveTo(final_x, final_y);
                else ctx.lineTo(final_x, final_y);
            });

            ctx.closePath();
            ctx.fill();
        }
    }, [box.mask, rgb, box.x, box.y, box.width, box.height]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ opacity: 0.5 }}
        />
    );
}
