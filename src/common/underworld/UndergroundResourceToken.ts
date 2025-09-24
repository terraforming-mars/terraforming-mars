export type TemporaryBonusToken =
  'data1pertemp' |
  'mcprod1pertemp' |
  'microbe1pertemp' |
  'microbe2pertemp' |
  'plant2pertemp' |
  'steel2pertemp' |
  'titanium1pertemp' |
  'oceanrequirementmod' |
  'oxygenrequirementmod' |
  'temprequirementmod';

/**
 * The different types of resources players may excavate using the Underworld expansion.
 *
 * These structure bonuses different from how space bonuses are laid out.
 * Space bonuses show an array of individual bonus items; this groups them as a single
 * token. This is just easier to work with and easier to render.
 */
export type UndergroundResourceToken = TemporaryBonusToken |
  'nothing' |
  'card1' | 'card2' |
  'corruption1' | 'corruption2' |
  'data1' | 'data2' | 'data3' |
  'steel2plant' | 'steel2' | 'steel1production' |
  'titanium2' | 'titanium1production' |
  'plant2' | 'plant3' | 'plant1production' |
  'titaniumandplant' |
  'energy2' | 'energy1production' | 'heat2production' |
  'microbe1' | 'microbe2' | 'tr' | 'ocean' |
  'sciencetag' | 'planttag' | 'place6mc' |
  'anyresource1';

/**
 * Text descriptions of each Underground resource token.
 */
export const undergroundResourceTokenDescription: Record<UndergroundResourceToken, string> = {
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
  plant2: '2 plants',
  plant3: '3 plants',
  plant1production: '1 plant production',
  titaniumandplant: '1 titanium and 1 plant',
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
  microbe2pertemp: '2 microbes / 2 °C',
  steel2plant: '2 steel and 1 plant',
  energy2: '2 energy',
  mcprod1pertemp: '1 M€ production / 2 °C',
  sciencetag: '1 science tag',
  planttag: '1 plant tag',
  place6mc: 'Gain 6 M€ when placing a tile here',
  oceanrequirementmod: 'Ocean requirements are ±3',
  oxygenrequirementmod: 'Oxygen requirements are ±3',
  temprequirementmod: 'Temperature requirements are ±6 °C',
  anyresource1: 'Any resource except science',
};
