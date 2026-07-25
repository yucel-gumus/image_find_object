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
} from '../store/atoms';
import { lineOptions } from '../utils/consts';
import { getSvgPathFromStroke } from '../utils';
import { SegmentationMaskOverlay } from './overlays/SegmentationMaskOverlay';

export function Content() {
  const [imageSrc] = useAtom(ImageSrcAtom);
  const [boundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [detectType] = useAtom(DetectTypeAtom);
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
    // Canvas reflow callback
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
    <div
      ref={containerRef}
      className="w-full grow relative bg-[#3D231C] rounded-2xl border-2 border-[#D98877] shadow-inner flex items-center justify-center overflow-hidden min-h-[360px]"
    >
      {/* Top Right Draw Mode Indicator */}
      {drawMode && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#9BCEC1] text-[#15382F] text-xs font-extrabold border border-[#6DA294] shadow-md animate-pulse">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Çizim Modu Aktif</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <div ref={resizeRef} style={mediaStyle} className="relative shadow-2xl rounded-lg overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            className="w-full h-full object-contain"
            alt="Yüklenen Görsel"
            onLoad={(e) => {
              setActiveMediaDimensions({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
            }}
          />
        ) : (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center text-[#FFB6A6]">
            <div className="w-16 h-16 rounded-2xl bg-[#FFB6A6]/20 border-2 border-[#FFB6A6]/40 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#FFB6A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-base font-bold text-[#FFEBD3]">Analiz Edilecek Bir Görsel Yükleyin</p>
            <p className="text-xs text-[#FFB6A6]/80 mt-1 max-w-sm">
              Sağ paneli kullanarak bir dosya seçin veya aşağıdaki örnek görsellerden birine tıklayın.
            </p>
          </div>
        )}

        {/* Interactive Overlay Layer */}
        <div
          className={`absolute top-0 left-0 w-full h-full pointer-events-auto ${
            drawMode ? 'cursor-crosshair' : 'cursor-default'
          }`}
          onPointerDown={(e) => {
            if (!drawMode) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setCurrentLine([[x, y]]);
          }}
          onPointerMove={(e) => {
            if (!drawMode || currentLine.length === 0) {
              // Hover logic for segment boxes
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
