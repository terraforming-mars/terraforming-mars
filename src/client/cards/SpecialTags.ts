export const SpecialTags = {
  NONE: 'none',
  INFLUENCE: 'influence-count',
  CITY_COUNT: 'city-count',
  COLONY_COUNT: 'colony-count',
  UNDERGROUND_TOKEN_COUNT: 'underground-token-count',
  CORRUPTION: 'corruption-count',
  NEGATIVE_VP: 'negative-vp',
} as const;
export type SpecialTags = typeof SpecialTags[keyof typeof SpecialTags];
