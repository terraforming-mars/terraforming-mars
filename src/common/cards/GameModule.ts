export const GAME_MODULES = ['base', 'corpera', 'promo', 'venus', 'colonies', 'prelude', 'turmoil', 'community', 'ares', 'moon', 'pathfinders', 'leader'] as const;
export type GameModule = typeof GAME_MODULES[number];
