import { useAtom } from 'jotai';
import { ActiveColorAtom } from '../store/atoms';
import { colors } from '../utils/consts';

export function Palette() {
  const [activeColor, setActiveColor] = useAtom(ActiveColorAtom);

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFEBD3] border-2 border-[#E8C8A3] shadow-inner"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span className="text-xs font-bold text-[#3D231C] mr-1">Çizim Rengi:</span>
      {colors.map((color, idx) => {
        const isSelected = color === activeColor;
        return (
          <button
            key={idx}
            className={`w-6 h-6 rounded-full relative transition-transform duration-150 ${
              isSelected ? 'scale-125 ring-2 ring-[#9BCEC1] ring-offset-1 shadow-md' : 'hover:scale-110'
            }`}
            style={{
              backgroundColor: color,
              border: '1.5px solid rgba(61, 35, 28, 0.2)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveColor(color);
            }}
          />
        );
      })}
    </div>
  );
}
