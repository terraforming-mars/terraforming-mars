export enum Color {
  BLUE = 'blue',
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLACK = 'black',
  PURPLE = 'purple',
  ORANGE = 'orange',
  PINK = 'pink',
  NEUTRAL = 'neutral',
  BRONZE = 'bronze',
}

export const PLAYER_COLORS = [Color.BLUE, Color.RED, Color.YELLOW, Color.GREEN, Color.BLACK, Color.PURPLE, Color.ORANGE, Color.PINK] as const;

export type ColorWithNeutral = Color | 'NEUTRAL';
