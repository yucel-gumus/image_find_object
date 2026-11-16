import { useAtom } from 'jotai';
import { useResetState } from '../hooks';
import { ToastStateAtom } from '../store/atoms';

export function TopBar() {
  const resetState = useResetState();
  const [, setToast] = useAtom(ToastStateAtom);

  const handleReset = () => {
    resetState();
    setToast({ message: 'Oturum ve analizler sıfırlandı.', type: 'info' });
  };

  return (
    <header className="w-full bg-[#DCE3EA] border-b-2 border-[#BCC7D2] px-6 py-3.5 shadow-md flex items-center justify-between z-20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F2A488] border-2 border-[#EC7D55] flex items-center justify-center shadow-inner">
          <svg className="w-6 h-6 text-[#253341]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[#253341] leading-none">
            UZAMSAL ANALİZ <span className="text-[#253341] bg-[#F2A488] text-xs px-2 py-0.5 rounded-full font-bold ml-1 border border-[#EC7D55]">AI</span>
          </h1>
          <p className="text-xs font-medium text-[#3E5164] mt-0.5">
            Nesne Tespiti & Akıllı Segmentasyon
          </p>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F9F5] text-[#253341] border-2 border-[#BCC7D2] hover:border-[#EC7D55] hover:bg-[#DBE6DD] font-semibold text-xs transition-all duration-200 shadow-sm active:scale-95"
          title="Oturumu Sıfırla"
        >
          <svg className="w-4 h-4 text-[#253341]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Oturumu Sıfırla</span>
        </button>
      </div>
    </header>
  );
}
