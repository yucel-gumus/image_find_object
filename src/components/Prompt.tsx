import { useAtom } from 'jotai';
import getStroke from 'perfect-freehand';
import { useState } from 'react';
import { generateContent } from '../services/gemini';
import {
  BoundingBoxMasksAtom,
  HoverEnteredAtom,
  ImageSrcAtom,
  LinesAtom,
  ToastStateAtom,
} from '../store/atoms';
import { lineOptions } from '../utils/consts';
import { getSvgPathFromStroke, loadImage } from '../utils';

const DEFAULT_TEMPERATURE = 0.2;

export function Prompt() {
  const [, setBoundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [, setHoverEntered] = useAtom(HoverEnteredAtom);
  const [lines] = useAtom(LinesAtom);
  const [imageSrc] = useAtom(ImageSrcAtom);
  const [, setToast] = useAtom(ToastStateAtom);
  const [targetPrompt, setTargetPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPromptText = () => {
    const promptValue = targetPrompt.trim() || 'öğeler';
    return `Şunlar için segmentasyon maskelerini ver: ${promptValue}. "box_2d" anahtarında 2D sınırlayıcı kutu, "mask" anahtarında segmentasyon maskesi ve "label" anahtarında metin etiketi bulunan JSON listesi çıktısı ver. Açıklayıcı etiketler kullan.`;
  };

  async function handleSend() {
    if (isLoading) return;

    if (!imageSrc) {
      setToast({
        message: 'Lütfen önce bir görsel yükleyin veya örnek görsel seçin.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      let activeDataURL = '';
      const maxSize = 640;
      const copyCanvas = document.createElement('canvas');
      const ctx = copyCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Tuval (Canvas) oluşturulamadı.');
      }

      if (imageSrc) {
        const image = await loadImage(imageSrc);
        const scale = Math.min(maxSize / image.width, maxSize / image.height);
        copyCanvas.width = image.width * scale;
        copyCanvas.height = image.height * scale;
        ctx.drawImage(image, 0, 0, copyCanvas.width, copyCanvas.height);
      }

      // Draw overlay stroke lines if present
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
                lineOptions
              )
            )
          );
          ctx.fillStyle = line[1];
          ctx.fill(p);
        }
      }

      activeDataURL = copyCanvas.toDataURL('image/png');
      setHoverEntered(false);

      const config = {
        temperature: DEFAULT_TEMPERATURE,
        thinkingConfig: { thinkingBudget: 0 },
      };

      const promptText = getPromptText();
      let response = await generateContent(
        activeDataURL.replace('data:image/png;base64,', ''),
        promptText,
        config
      );

      // Clean JSON formatting defensively
      if (response.includes('```json')) {
        response = response.split('```json')[1].split('```')[0];
      } else if (response.includes('```')) {
        response = response.split('```')[1].split('```')[0];
      }

      const jsonStart = response.indexOf('[');
      const jsonEnd = response.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        response = response.substring(jsonStart, jsonEnd + 1);
      }

      const parsedResponse = JSON.parse(response);

      if (!Array.isArray(parsedResponse)) {
        throw new Error('Yanıt beklenen dizi (list) biçiminde değil.');
      }

      const formattedBoxes = parsedResponse
        .filter((box) => box && Array.isArray(box.box_2d) && box.box_2d.length === 4)
        .map(
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
              label: box.label || targetPrompt || 'öğe',
              mask: box.mask,
            };
          }
        );

      const sortedBoxes = formattedBoxes.sort(
        (a, b) => b.width * b.height - a.width * a.height
      );

      setBoundingBoxMasks(sortedBoxes);

      if (sortedBoxes.length > 0) {
        setToast({
          message: `${sortedBoxes.length} adet nesne başarıyla tespit edildi!`,
          type: 'success',
        });
      } else {
        setToast({
          message: 'Belirtilen nesne görselde bulunamadı.',
          type: 'info',
        });
      }
    } catch (e: any) {
      console.error('Error generating content:', e);
      setToast({
        message: `Analiz hatası: ${e?.message || 'Bilinmeyen bir hata oluştu'}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Target Prompt Box */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#3D231C]">
            <svg className="w-4 h-4 text-[#15382F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Görsel üzerinde işaretlenmesi gereken nesneyi yazınız
          </label>
        </div>

        {/* Textarea Input */}
        <textarea
          className="w-full bg-[#FFEBD3] rounded-xl p-3 border-2 border-[#E8C8A3] text-[#3D231C] placeholder-[#6E4438]/60 font-medium text-sm focus:border-[#9BCEC1] focus:bg-[#FFF6EC] transition-all duration-200 resize-none shadow-sm"
          placeholder="Neleri tespit etmek istersiniz? (ör: kedi, sandalye, çanta)"
          rows={1}
          value={targetPrompt}
          disabled={isLoading}
          onChange={(e) => setTargetPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
      </div>

      {/* Action Row */}
      <div className="pt-2 border-t border-[#D98877]/40 flex justify-end">
        {/* Primary CTA Button */}
        <button
          className={`w-full theme-accent-btn px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          disabled={isLoading}
          onClick={handleSend}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-[#15382F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>KENSAI GÖRSELİ ANALİZ EDİYOR...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-[#15382F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>GÖRSELİ ANALİZ ET</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
