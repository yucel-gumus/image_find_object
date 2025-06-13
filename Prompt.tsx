/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {GoogleGenAI} from '@google/genai';
import {useAtom} from 'jotai';
import getStroke from 'perfect-freehand';
import {useState} from 'react';
import {
  BoundingBoxMasksAtom,
  BoundingBoxes2DAtom,
  BoundingBoxes3DAtom,
  CustomPromptsAtom,
  DetectTypeAtom,
  HoverEnteredAtom,
  ImageSrcAtom,
  LinesAtom,
  PointsAtom,
  PromptsAtom,
  ShareStream,
  TemperatureAtom,
  VideoRefAtom,
} from './atoms';
import {lineOptions} from './consts';
import {getSvgPathFromStroke, loadImage} from './utils';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
export function Prompt() {
  const [temperature, setTemperature] = useAtom(TemperatureAtom);
  const [, setBoundingBoxes2D] = useAtom(BoundingBoxes2DAtom);
  const [, setBoundingBoxes3D] = useAtom(BoundingBoxes3DAtom);
  const [, setBoundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [stream] = useAtom(ShareStream);
  const [detectType] = useAtom(DetectTypeAtom);
  const [, setPoints] = useAtom(PointsAtom);
  const [, setHoverEntered] = useAtom(HoverEnteredAtom);
  const [lines] = useAtom(LinesAtom);
  const [videoRef] = useAtom(VideoRefAtom);
  const [imageSrc] = useAtom(ImageSrcAtom);
  const [showCustomPrompt] = useState(false);
  const [targetPrompt, setTargetPrompt] = useState('öğeler');
  const [labelPrompt, setLabelPrompt] = useState('');
  const [showRawPrompt, setShowRawPrompt] = useState(false);

  const [prompts, setPrompts] = useAtom(PromptsAtom);
  const [customPrompts, setCustomPrompts] = useAtom(CustomPromptsAtom);

  const is2d = detectType === '2D sınırlayıcı kutular';

  const get2dPrompt = () =>
    `${targetPrompt} tespit et, en fazla 20 öğe ile. "box_2d" içinde 2D sınırlayıcı kutu ve "label" içinde ${
      labelPrompt || 'metin etiketi'
    } bulunan json listesi çıktısı ver.`;

  async function handleSend() {
    let activeDataURL;
    const maxSize = 640;
    const copyCanvas = document.createElement('canvas');
    const ctx = copyCanvas.getContext('2d')!;

    if (stream) {
      const video = videoRef.current!;
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
      console.log(copyCanvas);
      ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);
    }
    activeDataURL = copyCanvas.toDataURL('image/png');

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
      activeDataURL = copyCanvas.toDataURL('image/png');
    }

    const prompt = prompts[detectType];

    setHoverEntered(false);
    const config: {
      temperature: number;
      thinkingConfig?: {thinkingBudget: number};
    } = {
      temperature,
    };
    let model = 'models/gemini-2.0-flash';
    if (detectType === 'Segmentasyon maskeleri') {
      model = 'models/gemini-2.5-flash-preview-04-17';
      config['thinkingConfig'] = {thinkingBudget: 0};
    }

    let response = (
      await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: activeDataURL.replace('data:image/png;base64,', ''),
                  mimeType: 'image/png',
                },
              },
              {text: is2d ? get2dPrompt() : prompt.join(' ')},
            ],
          },
        ],
        config,
      })
    ).text;

    if (response.includes('```json')) {
      response = response.split('```json')[1].split('```')[0];
    }
    const parsedResponse = JSON.parse(response);
    if (detectType === '2D sınırlayıcı kutular') {
      const formattedBoxes = parsedResponse.map(
        (box: {box_2d: [number, number, number, number]; label: string}) => {
          const [ymin, xmin, ymax, xmax] = box.box_2d;
          return {
            x: xmin / 1000,
            y: ymin / 1000,
            width: (xmax - xmin) / 1000,
            height: (ymax - ymin) / 1000,
            label: box.label,
          };
        },
      );
      setHoverEntered(false);
      setBoundingBoxes2D(formattedBoxes);
    } else if (detectType === 'Noktalar') {
      const formattedPoints = parsedResponse.map(
        (point: {point: [number, number]; label: string}) => {
          return {
            point: {
              x: point.point[1] / 1000,
              y: point.point[0] / 1000,
            },
            label: point.label,
          };
        },
      );
      setPoints(formattedPoints);
    } else if (detectType === 'Segmentasyon maskeleri') {
      const formattedBoxes = parsedResponse.map(
        (box: {
          box_2d: [number, number, number, number];
          label: string;
          mask: ImageData;
        }) => {
          const [ymin, xmin, ymax, xmax] = box.box_2d;
          return {
            x: xmin / 1000,
            y: ymin / 1000,
            width: (xmax - xmin) / 1000,
            height: (ymax - ymin) / 1000,
            label: box.label,
            imageData: box.mask,
          };
        },
      );
      setHoverEntered(false);
      const sortedBoxes = formattedBoxes.sort(
        (a: any, b: any) => b.width * b.height - a.width * a.height,
      );
      setBoundingBoxMasks(sortedBoxes);
    } else {
      const formattedBoxes = parsedResponse.map(
        (box: {
          box_3d: [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ];
          label: string;
        }) => {
          const center = box.box_3d.slice(0, 3);
          const size = box.box_3d.slice(3, 6);
          const rpy = box.box_3d
            .slice(6)
            .map((x: number) => (x * Math.PI) / 180);
          return {
            center,
            size,
            rpy,
            label: box.label,
          };
        },
      );
      setBoundingBoxes3D(formattedBoxes);
    }
  }

  return (
    <div className="flex grow flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          İstem:{' '}
          {detectType === 'Segmentasyon maskeleri'
            ? 'Gemini 2.5 Flash (düşünme yok)'
            : 'Gemini 2.0 Flash'}
        </div>
        <label className="flex gap-2 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={showRawPrompt}
            className="rounded"
            onChange={() => setShowRawPrompt(!showRawPrompt)}
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">ham istemi göster</div>
        </label>
      </div>
      <div className="w-full flex flex-col">
        {showCustomPrompt ? (
          <textarea
            className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg resize-none p-4 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            value={customPrompts[detectType]}
            onChange={(e) => {
              const value = e.target.value;
              const newPrompts = {...customPrompts};
              newPrompts[detectType] = value;
              setCustomPrompts(newPrompts);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        ) : showRawPrompt ? (
          <div className="mb-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
            {is2d
              ? get2dPrompt()
              : detectType === 'Segmentasyon maskeleri'
                ? prompts[detectType].slice(0, 2).join(' ') +
                  prompts[detectType].slice(2).join('')
                : prompts[detectType].join(' ')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="font-medium text-gray-700 dark:text-gray-300">{prompts[detectType][0]}:</div>
            <textarea
              className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg resize-none p-4 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="Ne tür şeyler tespit etmek istiyorsunuz?"
              rows={1}
              value={is2d ? targetPrompt : prompts[detectType][1]}
              onChange={(e) => {
                if (is2d) {
                  setTargetPrompt(e.target.value);
                } else {
                  const value = e.target.value;
                  const newPrompts = {...prompts};
                  newPrompts[detectType][1] = value;
                  setPrompts(newPrompts);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            {is2d && (
              <>
                <div className="font-medium text-gray-700 dark:text-gray-300">Her birini şununla etiketle: (isteğe bağlı)</div>
                <textarea
                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg resize-none p-4 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  rows={1}
                  placeholder="Şeyleri nasıl etiketlemek istiyorsunuz?"
                  value={labelPrompt}
                  onChange={(e) => setLabelPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between gap-4 items-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 !text-white !border-none rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          onClick={handleSend}>
          <div className="flex items-center gap-2">
            <span>🚀</span>
            <span>Gönder</span>
          </div>
        </button>
        <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">sıcaklık:</span>
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
