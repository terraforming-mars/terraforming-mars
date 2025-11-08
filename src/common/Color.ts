export const PLAYER_COLORS = ['red', 'green', 'yellow', 'blue', 'black', 'purple', 'orange', 'pink'] as const;
const ALL_COLORS = [...PLAYER_COLORS, 'neutral', 'bronze'] as const;
export type Color = typeof ALL_COLORS[number];
export type ColorWithNeutral = Color | 'NEUTRAL';
