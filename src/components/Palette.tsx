import { useAtom } from 'jotai';
import { ActiveColorAtom } from '../store/atoms';
import { colors } from '../utils/consts';

export function Palette() {
  const [activeColor, setActiveColor] = useAtom(ActiveColorAtom);

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F5F9F5] border-2 border-[#BCC7D2] shadow-inner"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span className="text-xs font-bold text-[#253341] mr-1">Çizim Rengi:</span>
      {colors.map((color, idx) => {
        const isSelected = color === activeColor;
        return (
          <button
            key={idx}
            className={`w-6 h-6 rounded-full relative transition-transform duration-150 ${
              isSelected ? 'scale-125 ring-2 ring-[#EC7D55] ring-offset-2 ring-offset-[#F5F9F5] shadow-md' : 'hover:scale-110'
            }`}
            style={{
              backgroundColor: color,
              border: '1.5px solid rgba(37, 51, 65, 0.25)',
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
