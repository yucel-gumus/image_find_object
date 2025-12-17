
import { useAtom } from 'jotai';
import getStroke from 'perfect-freehand';
import { useState } from 'react';
import { generateContent } from '../services/gemini';
import {
  BoundingBoxMasksAtom,
  HoverEnteredAtom,
  ImageSrcAtom,
  LinesAtom,
  ShareStream,
  TemperatureAtom,
  VideoRefAtom,
} from '../store/atoms';
import { lineOptions } from '../utils/consts';
import { getSvgPathFromStroke, loadImage } from '../utils';


export function Prompt() {
  const [temperature, setTemperature] = useAtom(TemperatureAtom);
  const [, setBoundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [stream] = useAtom(ShareStream);
  const [, setHoverEntered] = useAtom(HoverEnteredAtom);
  const [lines] = useAtom(LinesAtom);
  const [videoRef] = useAtom(VideoRefAtom);
  const [imageSrc] = useAtom(ImageSrcAtom);
  const [targetPrompt, setTargetPrompt] = useState('öğeler');
  const [isLoading, setIsLoading] = useState(false);

  const getPromptText = () =>
    `Şunlar için segmentasyon maskelerini ver: ${targetPrompt}. "box_2d" anahtarında 2D sınırlayıcı kutu, "mask" anahtarında segmentasyon maskesi ve "label" anahtarında metin etiketi bulunan JSON listesi çıktısı ver. Açıklayıcı etiketler kullan.`;

  async function handleSend() {
    if (isLoading) return;
    setIsLoading(true);

    let activeDataURL = '';
    const maxSize = 640;
    const copyCanvas = document.createElement('canvas');
    const ctx = copyCanvas.getContext('2d');

    if (!ctx) return;

    if (stream && videoRef.current) {
      const video = videoRef.current;
      const scale = Math.min(
        maxSize / video.videoWidth,
        maxSize / video.videoHeight,
      );
      copyCanvas.width = video.videoWidth * scale;
      copyCanvas.height = video.videoHeight * scale;
      ctx.drawImage(
        video,
        0,
        0,
        video.videoWidth * scale,
        video.videoHeight * scale,
      );
    } else if (imageSrc) {
      const image = await loadImage(imageSrc);
      const scale = Math.min(maxSize / image.width, maxSize / image.height);
      copyCanvas.width = image.width * scale;
      copyCanvas.height = image.height * scale;
      ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);
    }

    // Draw lines if any
    if (lines.length > 0) {
      for (const line of lines) {
        const p = new Path2D(
          getSvgPathFromStroke(
            getStroke(
              line[0].map(([x, y]) => [
                x * copyCanvas.width,
                y * copyCanvas.height,
                0.5,
              ]),
              lineOptions,
            ),
          ),
        );
        ctx.fillStyle = line[1];
        ctx.fill(p);
      }
    }

    activeDataURL = copyCanvas.toDataURL('image/png');

    setHoverEntered(false); // Reset hover state

    const config = {
      temperature,
      thinkingConfig: { thinkingBudget: 0 }
    };

    try {
      const promptText = getPromptText();
      let response = await generateContent(
        activeDataURL.replace('data:image/png;base64,', ''),
        promptText,
        config
      );

      if (response.includes('```json')) {
        response = response.split('```json')[1].split('```')[0];
      } else if (response.includes('```')) {
        response = response.split('```')[1].split('```')[0];
      }

      const parsedResponse = JSON.parse(response);

      const formattedBoxes = parsedResponse.map(
        (box: {
          box_2d: [number, number, number, number];
          label: string;
          mask: string | number[][];
        }) => {
          const [ymin, xmin, ymax, xmax] = box.box_2d;
          return {
            x: xmin / 1000,
            y: ymin / 1000,
            width: (xmax - xmin) / 1000,
            height: (ymax - ymin) / 1000,
            label: box.label,
            mask: box.mask,
          };
        },
      );

      const sortedBoxes = formattedBoxes.sort(
        (a: any, b: any) => b.width * b.height - a.width * a.height,
      );
      setBoundingBoxMasks(sortedBoxes);
    } catch (e) {
      console.error("Error generating content:", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex grow flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">

      <div className="w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hedef Nesneler
          </div>
          <div className="relative group">
            <textarea
              className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl resize-none p-5 pr-12 border-2 border-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all duration-300 shadow-sm focus:shadow-md disabled:opacity-50 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Neleri bulmak istersiniz? (kedi, çanta, masa vb.)"
              rows={1}
              value={targetPrompt}
              disabled={isLoading}
              onChange={(e) => setTargetPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">Enter</kbd>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center">
        <button
          className={`relative min-w-[140px] h-[48px] px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md flex items-center justify-center ${isLoading
            ? 'bg-blue-400 cursor-not-allowed text-white/70'
            : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95 text-white hover:shadow-lg'
            }`}
          disabled={isLoading}
          onClick={handleSend}>
          {isLoading ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>İşleniyor...</span>
            </div>
          ) : (
            <span>Analiz Et</span>
          )}
        </button>
        <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Yaratıcılık seviyesi:</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={temperature}
            className="accent-blue-600"
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
            {temperature.toFixed(2)}
          </span>
        </label>
      </div>
    </div>
  );
}
