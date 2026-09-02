export const BoardType = {
  MARS: 'mars',
  MOON: 'moon',
} as const;
export type BoardType = typeof BoardType[keyof typeof BoardType];
