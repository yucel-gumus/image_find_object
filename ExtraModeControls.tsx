

import {useAtom} from 'jotai';
import {
  BoundingBoxes2DAtom,
  BoundingBoxes3DAtom,
  BoundingBoxMasksAtom,
  DetectTypeAtom,
  DrawModeAtom,
  FOVAtom,
  HoveredBoxAtom,
  LinesAtom,
  PointsAtom,
  ShareStream,
} from './atoms';
import {Palette} from './Palette';

export function ExtraModeControls() {
  const [, setBoundingBoxes2D] = useAtom(BoundingBoxes2DAtom);
  const [, setBoundingBoxes3D] = useAtom(BoundingBoxes3DAtom);
  const [, setBoundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [stream, setStream] = useAtom(ShareStream);
  const [detectType] = useAtom(DetectTypeAtom);
  const [fov, setFoV] = useAtom(FOVAtom);
  const [, setPoints] = useAtom(PointsAtom);
  const [, _setHoveredBox] = useAtom(HoveredBoxAtom);
  const [drawMode, setDrawMode] = useAtom(DrawModeAtom);
  const [, setLines] = useAtom(LinesAtom);

  const showExtraBar = stream || detectType === '3D sınırlayıcı kutular';

  return (
    <>
      {detectType === '3D sınırlayıcı kutular' ? (
        <div className="flex gap-3 px-4 py-3 items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-center border-t border-yellow-200 dark:border-yellow-800">
          <div className="text-lg">🚧</div> 
          <span className="font-medium">
            3D sınırlayıcı kutular deneysel bir model özelliğidir. Daha yüksek doğruluk için 2D sınırlayıcı kutuları kullanın.
          </span>
        </div>
      ) : null}
      {drawMode ? (
        <div className="flex gap-3 px-4 py-3 items-center justify-between border-t bg-gray-50 dark:bg-gray-800">
          <div style={{width: 200}}></div>
          <div className="grow flex justify-center">
            <Palette />
          </div>
          <div className="flex gap-3">
            <div className="flex gap-3">
              <button
                className="flex gap-2 text-sm secondary bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-md transition-colors duration-200"
                onClick={() => {
                  setLines([]);
                }}>
                <div className="text-xs">🗑️</div>
                <span>Temizle</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button
                className="flex gap-2 secondary bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-2 rounded-md transition-colors duration-200"
                onClick={() => {
                  setDrawMode(false);
                }}>
                <div className="text-sm">✅</div>
                <div>Tamam</div>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showExtraBar ? (
        <div className="flex gap-4 px-4 py-3 border-t items-center justify-center bg-gray-50 dark:bg-gray-800">
          {stream ? (
            <button
              className="flex gap-2 text-sm items-center secondary bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-4 py-2 rounded-md transition-colors duration-200"
              onClick={() => {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
                setBoundingBoxes2D([]);
                setBoundingBoxes3D([]);
                setBoundingBoxMasks([]);
                setPoints([]);
              }}>
              <div className="text-xs">🔴</div>
              <div className="whitespace-nowrap font-medium">Ekran paylaşımını durdur</div>
            </button>
          ) : null}
          {detectType === '3D sınırlayıcı kutular' ? (
            <>
              <div className="font-medium text-gray-700 dark:text-gray-300">Görüş Alanı</div>
              <input
                className="w-32 accent-blue-600"
                type="range"
                min="30"
                max="120"
                value={fov}
                onChange={(e) => setFoV(+e.target.value)}
              />
              <div className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300">
                {fov}°
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
