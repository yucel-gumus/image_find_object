import { useAtom } from 'jotai';
import {
  DrawModeAtom,
  LinesAtom,
  ToastStateAtom,
} from '../store/atoms';
import { Palette } from './Palette';

export function ExtraModeControls() {
  const [drawMode, setDrawMode] = useAtom(DrawModeAtom);
  const [, setLines] = useAtom(LinesAtom);
  const [, setToast] = useAtom(ToastStateAtom);

  if (!drawMode) return null;

  return (
    <div className="flex flex-wrap gap-3 px-5 py-3 items-center justify-between border-t-2 border-[#D98877] bg-[#FFB6A6] shadow-md z-10">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#9BCEC1] animate-ping" />
        <span className="text-xs font-extrabold text-[#3D231C] uppercase tracking-wide">
          Serbest Çizim Modu
        </span>
      </div>

      <div className="grow flex justify-center">
        <Palette />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFEBD3] text-[#3D231C] border border-[#E8C8A3] hover:border-[#D98877] font-bold text-xs transition-all duration-150 active:scale-95"
          onClick={() => {
            setLines([]);
            setToast({ message: 'Çizimler temizlendi.', type: 'info' });
          }}
        >
          <svg className="w-4 h-4 text-[#3D231C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Temizle</span>
        </button>

        <button
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#9BCEC1] text-[#15382F] border border-[#6DA294] hover:bg-[#86BBAE] font-extrabold text-xs transition-all duration-150 active:scale-95 shadow-xs"
          onClick={() => {
            setDrawMode(false);
            setToast({ message: 'Çizim modu kaydedildi ve kapatıldı.', type: 'success' });
          }}
        >
          <svg className="w-4 h-4 text-[#15382F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Tamam</span>
        </button>
      </div>
    </div>
  );
}
