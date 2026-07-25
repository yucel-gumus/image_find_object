import { useAtom } from 'jotai';
import { useState } from 'react';
import { generateContent } from '../services/gemini';
import {
  BoundingBoxMasksAtom,
  HoverEnteredAtom,
  ImageSrcAtom,
  LinesAtom,
  ToastStateAtom,
} from '../store/atoms';
import { DEFAULT_TEMPERATURE } from '../utils/consts';
import { prepareCanvasDataURL } from '../utils/canvas';

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
    return `Şunlar için segmentasyon maskelerini ver: ${promptValue}. Yanıt olarak SADECE geçerli bir JSON dizisi (list) çıktısı ver. Hiçbir açıklama, selamlama veya ekstra metin ekleme. Çıktı şu yapıda bir JSON listesi olmalıdır: [{"box_2d": [ymin, xmin, ymax, xmax], "label": "etiket", "mask": "maske"}]`;
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
      const activeDataURL = await prepareCanvasDataURL(imageSrc, lines);
      setHoverEntered(false);

      const config = {
        temperature: DEFAULT_TEMPERATURE,
        thinkingConfig: { thinkingBudget: 0 },
      };

      const promptText = getPromptText();
      const rawResponse = await generateContent(
        activeDataURL.replace('data:image/png;base64,', ''),
        promptText,
        config
      );

      // Robust JSON Extraction
      let jsonString = '';
      const matchArray = rawResponse.match(/\[\s*\{.*\}\s*\]/s);
      
      if (matchArray) {
        jsonString = matchArray[0];
      } else if (rawResponse.includes('```json')) {
        jsonString = rawResponse.split('```json')[1].split('```')[0].trim();
      } else if (rawResponse.includes('```')) {
        jsonString = rawResponse.split('```')[1].split('```')[0].trim();
      } else {
        const start = rawResponse.indexOf('[');
        const end = rawResponse.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
          jsonString = rawResponse.substring(start, end + 1);
        } else {
          jsonString = rawResponse.trim();
        }
      }

      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(jsonString);
      } catch {
        throw new Error('Model yanıtı geçerli bir JSON listesi olarak okunamadı. Lütfen tekrar deneyin.');
      }

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
          className={`w-full theme-accent-btn px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
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
              <span>KENSAI GÖRSELİ ANALİZ EDİLİYOR...</span>
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
