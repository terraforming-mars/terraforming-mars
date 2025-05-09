export const awardNames = [
  // Tharsis
  'Landlord',
  'Scientist',
  'Banker',
  'Thermalist',
  'Miner',

  // Elysium
  'Celebrity',
  'Industrialist',
  'Desert Settler',
  'Estate Dealer',
  'Benefactor',

  // Hellas
  'Contractor',
  'Cultivator',
  'Excentric',
  'Magnate',
  'Space Baron',

  // Venus
  'Venuphile',

  // Ares
  'Entrepreneur',

  // The Moon
  'Full Moon',
  'Lunar Magnate',

  // Amazonis Planitia
  // NB: the fifth award for Amazonis Plantia is Promoter, also part of Arabia Terra.
  'Curator',
  'A. Engineer',
  'Tourist',
  'A. Zoologist',

  // Arabia Terra
  'Cosmic Settler',
  'Botanist',
  'Promoter',
  'A. Manufacturer',
  'Zoologist',

  // Terra Cimmeria
  'Biologist',
  'T. Politician',
  'Urbanist',
  'Warmonger',
  // NB: the fifth award for Terra Cimmeria is Incorporator, a modular award.

  // Vastitas Borealis
  'Forecaster',
  'Edgedancer',
  'Visionary',
  'Naturalist',
  'Voyager',

  // Vastitas Borealis Novus
  'Traveller',
  'Landscaper',
  'Highlander',
  'Manufacturer',

  // Underworld
  'Kingpin',
  'EdgeLord',

  // Ares Extreme
  'Rugged',

  // Modular
  'Administrator',
  'Collector',
  'Constructor',
  'Electrician',
  'Founder',
  'Incorporator',
  'Investor',
  'Metropolist',
  'Mogul',
  'Politician', // New Most party leaders and influence compbined
  // 'Suburbian', // NEW Most tiles on areas along the edges of the map.
  // 'Zoologist', // Most animal and microbe resources. Currently Zoologist2
] as const;

export type AwardName = typeof awardNames[number];

export const AWARD_RENAMES = new Map<string, AwardName>([
  // When renaming an award add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
]);

export function maybeRenamedAward(name: string): AwardName {
  const renamed = AWARD_RENAMES.get(name);
  return renamed ?? (name as AwardName);
}
