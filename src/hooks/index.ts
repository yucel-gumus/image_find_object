
import { useAtom } from 'jotai';
import {
  BoundingBoxMasksAtom,
  BumpSessionAtom,
  ImageSentAtom,
} from '../store/atoms';

export function useResetState() {
  const [, setImageSent] = useAtom(ImageSentAtom);
  const [, setBoundingBoxMasks] = useAtom(BoundingBoxMasksAtom);
  const [, setBumpSession] = useAtom(BumpSessionAtom);

  return () => {
    setImageSent(false);
    setBoundingBoxMasks([]);
    setBumpSession((prev) => prev + 1);
  };
}
