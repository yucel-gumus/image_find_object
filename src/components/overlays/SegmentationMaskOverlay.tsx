import { BoundingBoxMaskType } from '../../types';
import { BoxMask } from './BoxMask';

interface SegmentationMaskOverlayProps {
  masks: BoundingBoxMaskType[];
  hoveredBox: number | null;
}

export function SegmentationMaskOverlay({ masks, hoveredBox }: SegmentationMaskOverlayProps) {
  return (
    <>
      {masks.map((box, i) => {
        const isHovered = i === hoveredBox;
        return (
          <div
            key={i}
            className={`absolute bbox border-2 transition-all duration-200 ${
              isHovered
                ? 'border-[#9BCEC1] reveal scale-[1.01] shadow-lg z-30'
                : 'border-[#9BCEC1]/80 hover:border-[#9BCEC1]'
            }`}
            style={{
              transformOrigin: '0 0',
              top: box.y * 100 + '%',
              left: box.x * 100 + '%',
              width: box.width * 100 + '%',
              height: box.height * 100 + '%',
              boxShadow: isHovered ? '0 0 15px rgba(155, 206, 193, 0.6)' : 'none',
            }}
          >
            <BoxMask box={box} index={i} />
            <div className="w-full top-0 h-0 absolute pointer-events-none">
              <div
                className={`absolute -left-[2px] bottom-0 text-xs px-2 py-0.5 rounded-t-md font-extrabold shadow-sm transition-all ${
                  isHovered
                    ? 'bg-[#9BCEC1] text-[#15382F] scale-105'
                    : 'bg-[#9BCEC1]/90 text-[#15382F]'
                }`}
              >
                {box.label}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
