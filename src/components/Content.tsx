
import { useAtom } from 'jotai';
import getStroke from 'perfect-freehand';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import {
  ActiveColorAtom,
  BoundingBoxMasksAtom,
  DetectTypeAtom,
  DrawModeAtom,
  HoverEnteredAtom,
  HoveredBoxAtom,
  ImageSrcAtom,
  LinesAtom,
  ShareStream,
  VideoRefAtom,
} from '../store/atoms';
import { lineOptions } from '../utils/consts';
import { getSvgPathFromStroke } from '../utils';
import { SegmentationMaskOverlay } from './overlays/SegmentationMaskOverlay';

export function Content() {
  const [imageSrc] = useAtom(ImageSrcAtom);
  const [boundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [stream] = useAtom(ShareStream);
  const [detectType] = useAtom(DetectTypeAtom);
  const videoRef = useAtom(VideoRefAtom)[0];
  const [lines, setLines] = useAtom(LinesAtom);
  const [drawMode] = useAtom(DrawModeAtom);
  const [activeColor] = useAtom(ActiveColorAtom);
  const [hoveredBox, setHoveredBox] = useAtom(HoveredBoxAtom);
  const [, setHoverEntered] = useAtom(HoverEnteredAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMediaDimensions, setActiveMediaDimensions] = useState({
    width: 0,
    height: 0,
  });

  const onResize = useCallback(() => {
    // Redraw if needed
  }, []);

  const { ref: resizeRef } = useResizeDetector({
    onResize,
  });

  const [currentLine, setCurrentLine] = useState<[number, number][]>([]);

  const mediaStyle = useMemo(() => {
    if (!activeMediaDimensions.width || !containerRef.current) return {};

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const mediaAspect =
      activeMediaDimensions.width / activeMediaDimensions.height;
    const containerAspect = containerWidth / containerHeight;

    let width, height;
    if (mediaAspect > containerAspect) {
      width = containerWidth;
      height = containerWidth / mediaAspect;
    } else {
      height = containerHeight;
      width = containerHeight * mediaAspect;
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }, [activeMediaDimensions, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  return (
    <div ref={containerRef} className="w-full grow relative bg-black flex items-center justify-center overflow-hidden">
      <div ref={resizeRef} style={mediaStyle} className="relative">
        {stream ? (
          <video
            className="w-full h-full object-contain"
            autoPlay
            onLoadedMetadata={(e) => {
              setActiveMediaDimensions({
                width: e.currentTarget.videoWidth,
                height: e.currentTarget.videoHeight,
              });
            }}
            ref={(video) => {
              videoRef.current = video;
              if (video && !video.srcObject) {
                video.srcObject = stream;
              }
            }}
          />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            className="w-full h-full object-contain"
            alt="Yüklenen resim"
            onLoad={(e) => {
              setActiveMediaDimensions({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Bir resim yükleyin veya ekranınızı paylaşın
          </div>
        )}

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-crosshair"
          onPointerDown={(e) => {
            if (!drawMode) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setCurrentLine([[x, y]]);
          }}
          onPointerMove={(e) => {
            if (!drawMode || currentLine.length === 0) {
              // Hover logic
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;

              let found = -1;
              for (let i = boundingBoxMasks.length - 1; i >= 0; i--) {
                const box = boundingBoxMasks[i];
                if (
                  x >= box.x &&
                  x <= box.x + box.width &&
                  y >= box.y &&
                  y <= box.y + box.height
                ) {
                  found = i;
                  break;
                }
              }
              if (found !== hoveredBox) {
                setHoveredBox(found);
                if (found !== -1) setHoverEntered(true);
              }
              return;
            }
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setCurrentLine([...currentLine, [x, y]]);
          }}
          onPointerUp={() => {
            if (!drawMode || currentLine.length === 0) return;
            setLines([...lines, [currentLine, activeColor]]);
            setCurrentLine([]);
          }}
          onMouseLeave={() => {
            setHoveredBox(-1);
          }}
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {([...lines, [currentLine, activeColor]] as [[number, number][], string][]).map((line, i) => (
              <path
                key={i}
                d={getSvgPathFromStroke(
                  getStroke(
                    line[0].map(([x, y]) => [x * 100, y * 100]),
                    lineOptions
                  )
                )}
                fill={line[1]}
                style={{ transform: 'scale(0.01)' }}
                className="transition-opacity duration-200"
              />
            ))}
          </svg>

          {detectType === 'Segmentasyon maskeleri' && (
            <SegmentationMaskOverlay masks={boundingBoxMasks} hoveredBox={hoveredBox} />
          )}
        </div>
      </div>
    </div>
  );
}
