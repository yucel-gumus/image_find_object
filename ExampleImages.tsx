import {useAtom} from 'jotai';
import {useEffect, useState} from 'react';
import {ImageSrcAtom, IsUploadedImageAtom} from './atoms';
import {getImageOptions} from './consts';
import {useResetState} from './hooks';

export function ExampleImages() {
  const [, setImageSrc] = useAtom(ImageSrcAtom);
  const [, setIsUploadedImage] = useAtom(IsUploadedImageAtom);
  const [imageOptions, setImageOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resetState = useResetState();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const options = await getImageOptions();
        setImageOptions(options);
        // İlk resmi default olarak seç
        if (options.length > 0) {
          setImageSrc(options[0]);
        }
      } catch (error) {
        console.error('Resimler yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [setImageSrc]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
          Örnek Resimler
        </div>
        <div className="flex flex-wrap items-start gap-3 shrink-0 w-[190px]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
        Örnek Resimler
      </div>
      <div className="flex flex-wrap items-start gap-3 shrink-0 w-[190px]">
        {imageOptions.map((image, index) => (
          <button
            key={image}
            className="p-0 w-[56px] h-[56px] relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md"
            onClick={() => {
              setIsUploadedImage(false);
              setImageSrc(image);
              resetState();
            }}>
            <img
              src={image}
              alt={`Örnek resim ${index + 1}`}
              className="absolute left-0 top-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
