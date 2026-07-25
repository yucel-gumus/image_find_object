import { useAtom } from 'jotai';
import { ToastStateAtom } from '../store/atoms';
import { useEffect } from 'react';

export function Toast() {
  const [toast, setToast] = useAtom(ToastStateAtom);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border-2 transition-all duration-300 ${
          isError
            ? 'bg-[#3D231C] text-[#FFB6A6] border-[#FFB6A6]'
            : isSuccess
            ? 'bg-[#15382F] text-[#9BCEC1] border-[#9BCEC1]'
            : 'bg-[#FFB6A6] text-[#3D231C] border-[#D98877]'
        }`}
      >
        {isError ? (
          <svg className="w-5 h-5 shrink-0 text-[#FFB6A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : isSuccess ? (
          <svg className="w-5 h-5 shrink-0 text-[#9BCEC1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 shrink-0 text-[#3D231C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
        <button
          onClick={() => setToast(null)}
          className="ml-2 p-1 hover:opacity-75 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
