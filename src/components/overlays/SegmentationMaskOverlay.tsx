import { BoundingBoxMaskType } from '../../types';
import { BoxMask } from './BoxMask';

interface SegmentationMaskOverlayProps {
  masks: BoundingBoxMaskType[];
  hoveredBox: number | null;
}

const OVERLAY_TONES = [
  {
    border: '#EC7D55',
    labelBg: '#EC7D55',
    labelText: '#253341',
    glow: '0 0 15px rgba(236, 125, 85, 0.6)',
  },
  {
    border: '#AB421C',
    labelBg: '#AB421C',
    labelText: '#F5F9F5',
    glow: '0 0 15px rgba(171, 66, 28, 0.6)',
  },
  {
    border: '#253341',
    labelBg: '#253341',
    labelText: '#F5F9F5',
    glow: '0 0 15px rgba(37, 51, 65, 0.6)',
  },
  {
    border: '#3E5164',
    labelBg: '#3E5164',
    labelText: '#F5F9F5',
    glow: '0 0 15px rgba(62, 81, 100, 0.6)',
  },
  {
    border: '#F2A488',
    labelBg: '#F2A488',
    labelText: '#253341',
    glow: '0 0 15px rgba(242, 164, 136, 0.6)',
  },
] as const;

export function SegmentationMaskOverlay({ masks, hoveredBox }: SegmentationMaskOverlayProps) {
  return (
    <>
      {masks.map((box, i) => {
        const isHovered = i === hoveredBox;
        const tone = OVERLAY_TONES[i % OVERLAY_TONES.length];
        return (
          <div
            key={i}
            className={`absolute bbox border-2 transition-all duration-200 ${
              isHovered ? 'reveal scale-[1.01] shadow-lg z-30' : 'opacity-90 hover:opacity-100'
            }`}
            style={{
              transformOrigin: '0 0',
              top: box.y * 100 + '%',
              left: box.x * 100 + '%',
              width: box.width * 100 + '%',
              height: box.height * 100 + '%',
              borderColor: tone.border,
              boxShadow: isHovered ? tone.glow : 'none',
            }}
          >
            <BoxMask box={box} index={i} />
            <div className="w-full top-0 h-0 absolute pointer-events-none">
              <div
                className={`absolute -left-[2px] bottom-0 text-xs px-2 py-0.5 rounded-t-md font-extrabold shadow-sm transition-all ${
                  isHovered ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: tone.labelBg,
                  color: tone.labelText,
                }}
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
