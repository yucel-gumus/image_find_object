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
    <div className="flex flex-wrap gap-3 px-5 py-3 items-center justify-between border-t-2 border-[#BCC7D2] bg-[#DCE3EA] shadow-md z-10">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#EC7D55] animate-ping" />
        <span className="text-xs font-extrabold text-[#253341] uppercase tracking-wide">
          Serbest Çizim Modu
        </span>
      </div>

      <div className="grow flex justify-center">
        <Palette />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F9F5] text-[#253341] border border-[#BCC7D2] hover:border-[#AB421C] hover:bg-[#DBE6DD] font-bold text-xs transition-all duration-150 active:scale-95"
          onClick={() => {
            setLines([]);
            setToast({ message: 'Çizimler temizlendi.', type: 'info' });
          }}
        >
          <svg className="w-4 h-4 text-[#253341]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Temizle</span>
        </button>

        <button
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EC7D55] text-[#253341] border border-[#AB421C] hover:bg-[#AB421C] hover:text-[#F5F9F5] font-extrabold text-xs transition-all duration-150 active:scale-95 shadow-xs"
          onClick={() => {
            setDrawMode(false);
            setToast({ message: 'Çizim modu kaydedildi ve kapatıldı.', type: 'success' });
          }}
        >
          <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Tamam</span>
        </button>
      </div>
    </div>
  );
}
