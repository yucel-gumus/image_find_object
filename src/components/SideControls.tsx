import { useAtom } from 'jotai';
import {
  BumpSessionAtom,
  ImageSentAtom,
  ImageSrcAtom,
  IsUploadedImageAtom,
  ToastStateAtom,
} from '../store/atoms';
import { useResetState } from '../hooks';

export function SideControls() {
  const [, setImageSrc] = useAtom(ImageSrcAtom);
  const [, setIsUploadedImage] = useAtom(IsUploadedImageAtom);
  const [, setBumpSession] = useAtom(BumpSessionAtom);
  const [, setImageSent] = useAtom(ImageSentAtom);
  const [, setToast] = useAtom(ToastStateAtom);
  const resetState = useResetState();

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* File Upload Dropzone / Button */}
      <label className="group flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#9BCEC1] text-[#15382F] font-extrabold text-sm border-2 border-[#6DA294] hover:bg-[#86BBAE] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md active:scale-98">
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
                setToast({ message: `${file.name} başarıyla yüklendi.`, type: 'success' });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <svg className="w-5 h-5 text-[#15382F] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>Görsel Yükle</span>
      </label>
    </div>
  );
}
