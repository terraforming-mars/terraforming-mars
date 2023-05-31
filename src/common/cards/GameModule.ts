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
  'starwars',
] as const;
export type GameModule = typeof GAME_MODULES[number];

export const MODULE_NAMES: Readonly<Record<GameModule, string>> = {
  'base': 'Base',
  'corpera': 'Corporate Era',
  'promo': 'Promo',
  'venus': 'Venus Next',
  'colonies': 'Colonies',
  'prelude': 'Prelude',
  'turmoil': 'Turmoil',
  'community': 'Community',
  'ares': 'Ares',
  'moon': 'The Moon',
  'pathfinders': 'Pathfinders',
  'ceo': 'CEOs',
  'starwars': 'Star Wars',
};
