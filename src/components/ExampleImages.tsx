import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { ImageSrcAtom, IsUploadedImageAtom, ToastStateAtom } from '../store/atoms';
import { getImageOptions } from '../utils/consts';
import { useResetState } from '../hooks';

export function ExampleImages() {
  const [currentSrc, setImageSrc] = useAtom(ImageSrcAtom);
  const [, setIsUploadedImage] = useAtom(IsUploadedImageAtom);
  const [, setToast] = useAtom(ToastStateAtom);
  const [imageOptions, setImageOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resetState = useResetState();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const options = await getImageOptions();
        setImageOptions(options);
        if (options.length > 0 && !currentSrc) {
          setImageSrc(options[0]);
        }
      } catch (error) {
        console.error('Görseller yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [setImageSrc, currentSrc]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 w-full">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D231C] text-center">
          Örnek Görseller
        </span>
        <div className="flex gap-2 justify-center">
          <div className="w-14 h-14 rounded-xl bg-[#FFEBD3] animate-pulse border border-[#E8C8A3]" />
          <div className="w-14 h-14 rounded-xl bg-[#FFEBD3] animate-pulse border border-[#E8C8A3]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D231C]">
          Örnek Görseller
        </span>
        <span className="text-[10px] font-bold text-[#6E4438] bg-[#FFEBD3] px-2 py-0.5 rounded-full border border-[#E8C8A3]">
          {imageOptions.length} Adet
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full">
        {imageOptions.map((image, index) => {
          const isSelected = currentSrc === image;
          return (
            <button
              key={image}
              className={`p-0 aspect-square relative overflow-hidden rounded-xl border-2 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${isSelected
                ? 'border-[#9BCEC1] ring-4 ring-[#9BCEC1]/40 shadow-md'
                : 'border-[#E8C8A3] hover:border-[#9BCEC1]'
                }`}
              onClick={() => {
                setIsUploadedImage(false);
                setImageSrc(image);
                resetState();
                setToast({ message: `Örnek görsel ${index + 1} seçildi.`, type: 'info' });
              }}
            >
              <img
                src={image}
                alt={`Örnek görsel ${index + 1}`}
                className="absolute left-0 top-0 w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9BCEC1] text-[#15382F] border border-[#6DA294] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
