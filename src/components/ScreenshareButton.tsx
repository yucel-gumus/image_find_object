import { useAtom } from 'jotai';
import { ShareStream } from '../store/atoms';
import { useResetState } from '../hooks';

export function ScreenshareButton() {
  const [, setStream] = useAtom(ShareStream);
  const resetState = useResetState();

  return (
    <button
      className="button flex gap-3 justify-center items-center bg-green-600 hover:bg-green-700 text-white border-none rounded-lg px-6 py-3 transition-colors duration-200 shadow-md hover:shadow-lg"
      onClick={() => {
        resetState();
        navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
          setStream(stream);
        });
      }}>
      <div className="text-lg">🖥️</div>
      <div className="font-medium">Ekran Paylaş</div>
    </button>
  );
}
