/**
 * The different types of resources players may excavate using the Underworld expansion.
 *
 * These structure bonuses different from how space bonuses are laid out.
 * Space bonuses show an array of individual bonus items; this groups them as a single
 * token. This is just easier to work with and easier to render.
 */
export type UndergroundResourceToken =
  'nothing' |
  'card1' | 'card2' |
  'corruption1' | 'corruption2' |
  'data1' | 'data2' | 'data3' |
  'steel2' | 'steel1production' |
  'titanium2' | 'titanium1production' |
  'plant1' | 'plant2' | 'plant3' | 'plant1production' |
  'titaniumandplant' |
  'energy1production' | 'heat2production' |
  'microbe1' | 'microbe2' | 'tr' | 'ocean' |
  'data1pertemp' | 'microbe1pertemp' | 'plant2pertemp' | 'steel2pertemp' | 'titanium1pertemp';

/**
 * Text descriptions of each Underground resource token.
 */
export const undergroundResourcerTokenDescription: Record<UndergroundResourceToken, string> = {
  nothing: 'nothing',
  card1: 'draw 1 card',
  card2: 'draw 2 cards',
  corruption1: '1 corruption',
  corruption2: '2 corruption',
  data1: '1 data',
  data2: '2 data',
  data3: '3 data',
  steel2: '2 steel',
  steel1production: '1 steel production',
  titanium2: '2 titanium',
  titanium1production: '1 titanium production',
  plant1: '1 plant',
  plant2: '2 plants',
  plant3: '3 plants',
  plant1production: '1 plant production',
  titaniumandplant: '1 titanium production',
  energy1production: '1 energy production',
  heat2production: '2 heat production',
  microbe1: '1 microbe',
  microbe2: '2 microbes',
  tr: '1 TR',
  ocean: 'place an ocean',
  data1pertemp: '1 data / 2 °C',
  microbe1pertemp: '1 microbe / 2 °C',
  plant2pertemp: '2 plants / 2 °C',
  steel2pertemp: '2 steel / 2 °C',
  titanium1pertemp: '1 titanium / 2 °C',
};
