import { atom } from 'jotai';
import {
  colors,
} from '../utils/consts';
import {
  BoundingBoxMaskType,
  DetectTypes,
} from '../types';

export const ImageSrcAtom = atom<string | null>(null);

export const ImageSentAtom = atom(false);

export const BoundingBoxMasksAtom = atom<BoundingBoxMaskType[]>([]);

export const TemperatureAtom = atom<number>(0.5);

export const ShareStream = atom<MediaStream | null>(null);

export const DrawModeAtom = atom<boolean>(false);

export const DetectTypeAtom = atom<DetectTypes>('Segmentasyon maskeleri');

export const LinesAtom = atom<[[number, number][], string][]>([]);

export const JsonModeAtom = atom(false);

export const ActiveColorAtom = atom(colors[6]);

export const HoverEnteredAtom = atom(false);

export const HoveredBoxAtom = atom<number | null>(null);

export const VideoRefAtom = atom<{ current: HTMLVideoElement | null }>({
  current: null,
});

export const InitFinishedAtom = atom(true);

export const BumpSessionAtom = atom(0);

export const IsUploadedImageAtom = atom(false);
