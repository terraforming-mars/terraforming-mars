export const GAME_MODULES = [
  'base',
  'corpera',
  'promo',
  'venus',
  'colonies',
  'prelude',
  'prelude2',
  'turmoil',
  'community',
  'ares',
  'moon',
  'pathfinders',
  'ceo',
] as const;
export type GameModule = typeof GAME_MODULES[number];
