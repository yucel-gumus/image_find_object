
import { BoundingBoxMaskType } from '../../types';
import { BoxMask } from './BoxMask';

interface SegmentationMaskOverlayProps {
    masks: BoundingBoxMaskType[];
    hoveredBox: number | null;
}

export function SegmentationMaskOverlay({ masks, hoveredBox }: SegmentationMaskOverlayProps) {
    return (
        <>
            {masks.map((box, i) => (
                <div
                    key={i}
                    className={`absolute bbox border-2 border-[#3B68FF] ${i === hoveredBox ? 'reveal' : ''}`}
                    style={{
                        transformOrigin: '0 0',
                        top: box.y * 100 + '%',
                        left: box.x * 100 + '%',
                        width: box.width * 100 + '%',
                        height: box.height * 100 + '%',
                    }}>
                    <BoxMask box={box} index={i} />
                    <div className="w-full top-0 h-0 absolute">
                        <div className="bg-[#3B68FF] text-white absolute -left-[2px] bottom-0 text-sm px-1">
                            {box.label}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
