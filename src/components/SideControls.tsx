import { useAtom } from 'jotai';
import {
  BumpSessionAtom,
  DrawModeAtom,
  ImageSentAtom,
  ImageSrcAtom,
  IsUploadedImageAtom,
} from '../store/atoms';
import { useResetState } from '../hooks';
import { ScreenshareButton } from './ScreenshareButton';

export function SideControls() {
  const [, setImageSrc] = useAtom(ImageSrcAtom);
  const [drawMode, setDrawMode] = useAtom(DrawModeAtom);
  const [, setIsUploadedImage] = useAtom(IsUploadedImageAtom);
  const [, setBumpSession] = useAtom(BumpSessionAtom);
  const [, setImageSent] = useAtom(ImageSentAtom);
  const resetState = useResetState();

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center justify-center button bg-blue-600 hover:bg-blue-700 px-6 py-3 !text-white !border-none rounded-lg cursor-pointer transition-colors duration-200 shadow-md hover:shadow-lg">
        <input
          className="hidden"
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                resetState();
                setImageSrc(e.target?.result as string);
                setIsUploadedImage(true);
                setImageSent(false);
                setBumpSession((prev) => prev + 1);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-lg">📁</span>
          <span className="font-medium">Resim Yükle</span>
        </div>
      </label>
      <div className="hidden">
        <button
          className="button flex gap-3 justify-center items-center"
          onClick={() => {
            setDrawMode(!drawMode);
          }}>
          <div className="text-lg">🎨</div>
          <div>Resim üzerine çiz</div>
        </button>
        <ScreenshareButton />
      </div>
    </div>
  );
}
