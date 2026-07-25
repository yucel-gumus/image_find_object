import { useAtom } from 'jotai';
import { ShareStream, ToastStateAtom } from '../store/atoms';
import { useResetState } from '../hooks';

export function ScreenshareButton() {
  const [, setStream] = useAtom(ShareStream);
  const [, setToast] = useAtom(ToastStateAtom);
  const resetState = useResetState();

  return (
    <button
      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFEBD3] text-[#3D231C] border-2 border-[#E8C8A3] hover:border-[#9BCEC1] hover:bg-[#FFF6EC] font-bold text-xs transition-all duration-150 active:scale-98"
      onClick={() => {
        resetState();
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          navigator.mediaDevices
            .getDisplayMedia({ video: true })
            .then((stream) => {
              setStream(stream);
              setToast({ message: 'Canlı ekran paylaşımı başlatıldı.', type: 'success' });
            })
            .catch(() => {
              setToast({ message: 'Ekran paylaşımı iptal edildi veya izin verilmedi.', type: 'info' });
            });
        } else {
          setToast({ message: 'Tarayıcınız ekran paylaşımını desteklemiyor.', type: 'error' });
        }
      }}
    >
      <svg className="w-4 h-4 text-[#15382F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span>Ekran Paylaş</span>
    </button>
  );
}
