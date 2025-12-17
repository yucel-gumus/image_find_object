
import { useAtom } from 'jotai';
import {
  BoundingBoxMasksAtom,
  DrawModeAtom,
  LinesAtom,
  ShareStream,
} from '../store/atoms';
import { Palette } from './Palette';

export function ExtraModeControls() {
  const [, setBoundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [stream, setStream] = useAtom(ShareStream);
  const [drawMode, setDrawMode] = useAtom(DrawModeAtom);
  const [, setLines] = useAtom(LinesAtom);

  return (
    <>
      {drawMode ? (
        <div className="flex gap-3 px-4 py-3 items-center justify-between border-t bg-gray-50 dark:bg-gray-800">
          <div style={{ width: 200 }}></div>
          <div className="grow flex justify-center">
            <Palette />
          </div>
          <div className="flex gap-3">
            <button
              className="flex gap-2 text-sm secondary bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-md transition-colors duration-200"
              onClick={() => {
                setLines([]);
              }}>
              <div className="text-xs">🗑️</div>
              <span>Temizle</span>
            </button>
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
      ) : null}
      {stream ? (
        <div className="flex gap-4 px-4 py-3 border-t items-center justify-center bg-gray-50 dark:bg-gray-800">
          <button
            className="flex gap-2 text-sm items-center secondary bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-4 py-2 rounded-md transition-colors duration-200"
            onClick={() => {
              stream.getTracks().forEach((track) => track.stop());
              setStream(null);
              setBoundingBoxMasks([]);
            }}>
            <div className="text-xs">🔴</div>
            <div className="whitespace-nowrap font-medium">Ekran paylaşımını durdur</div>
          </button>
        </div>
      ) : null}
    </>
  );
}
