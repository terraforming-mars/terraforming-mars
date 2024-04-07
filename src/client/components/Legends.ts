import {BoardName} from '@/common/boards/BoardName';

export type Key = {
  position: [number, number],
  text: [string, string],
  line?: {from: [number, number], to: [number, number]},
  secondRowX?: number,
};

export const LEGENDS: Record<BoardName, Array<Key>> = {
  [BoardName.THARSIS]: [],
  [BoardName.HELLAS]: [],
  [BoardName.ELYSIUM]: [],
  [BoardName.ARABIA_TERRA]: [],
  [BoardName.UTOPIA_PLANITIA]: [],
  [BoardName.VASTITAS_BOREALIS_NOVUS]: [],
  [BoardName.VASTITAS_BOREALIS]: [],
  [BoardName.AMAZONIS]: [],
  [BoardName.TERRA_CIMMERIA]: [],
  [BoardName.TERRA_CIMMERIA_NOVUS]: [
    {text: ['Albor', 'Tholius'], position: [282, 83], line: {from: [28, 18], to: [42, 27]}},
    {text: ['MSL', 'Curiosity'], position: [120, 185], line: {from: [30, 0], to: [148, 10]}, secondRowX: -15},
    {text: ['Tyrrhenus', 'Mons'], position: [85, 225], line: {from: [40, 5], to: [65, 10]}},
    {text: ['Apollinaris', 'Mons'], position: [500, 205], line: {from: [-3, 6], to: [-50, 28]}},
    {text: ['Hadriacus', 'Mons'], position: [90, 365], line: {from: [48, -7], to: [63, -18]}},
  ],
};
