import { atom } from 'jotai';
import { colors } from '../utils/consts';
import { BoundingBoxMaskType, DetectTypes } from '../types';

// Active Application State Atoms
export const ImageSrcAtom = atom<string | null>(null);

export const ImageSentAtom = atom<boolean>(false);

export const BoundingBoxMasksAtom = atom<BoundingBoxMaskType[]>([]);

export const DrawModeAtom = atom<boolean>(false);

export const DetectTypeAtom = atom<DetectTypes>('Segmentasyon maskeleri');

export const LinesAtom = atom<[[number, number][], string][]>([]);

export const ActiveColorAtom = atom<string>(colors[0]);

export const HoverEnteredAtom = atom<boolean>(false);

export const HoveredBoxAtom = atom<number | null>(null);

export const InitFinishedAtom = atom<boolean>(true);

export const BumpSessionAtom = atom<number>(0);

export const IsUploadedImageAtom = atom<boolean>(false);

export const ToastStateAtom = atom<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
