export const GlobalParameter = {
  OCEANS: 'oceans',
  OXYGEN: 'oxygen',
  TEMPERATURE: 'temperature',
  VENUS: 'venus',
  MOON_HABITAT_RATE: 'moon-habitat',
  MOON_MINING_RATE: 'moon-mining',
  MOON_LOGISTIC_RATE: 'moon-logistic',
} as const;
export type GlobalParameter = typeof GlobalParameter[keyof typeof GlobalParameter];
