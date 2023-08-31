export const GAME_MODULES = [
  'base',
  'corpera',
  'promo',
  'venus',
  'colonies',
  'prelude',
  'turmoil',
  'community',
  'ares',
  'moon',
  'pathfinders',
  'ceo',
  'prelude2',
] as const;
export type GameModule = typeof GAME_MODULES[number];
