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
  'Coordinator', // TODO(kberg): Rename to Promoter
  'A. Manufacturer',
  'Zoologist',

  // Terra Cimmeria
  'Biologist',
  'T. Economizer',
  'T. Politician',
  'Urbanist',
  'Warmonger',

  // Vastitas Borealis
  'Adapter', // TODO(kberg): Rename to Forecaster
  'Edgedancer',
  'Hoarder', // TODO(kberg): Rename to Visionary
  'Naturalist',
  'Voyager',

  // Underworld
  'Kingpin',
  'EdgeLord',

  // Modular
  'Administrator',
  'Collector',
  'Constructor',
  'Electrician',
  'Founder',
  'Highlander',
  // 'Incorporator', // NEW Most cards costing 10MC or less
  'Investor',
  'Landscaper',
  'Manufacturer',
  'Metropolist',
  'Mogul',
  'Politician', // New Most party leaders and influence compbined
  // 'Suburbian', // NEW Most tiles on areas along the edges of the map.
  'Traveller',
  // 'Zoologist', // Most animal and microbe resources. Currently Zoologist2
] as const;

export type AwardName = typeof awardNames[number];

export const AWARD_RENAMES = new Map<string, AwardName>([
  // When renaming an award add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
  // TODO(kberg): remove after 2024-12-15
  ['Engineer', 'A. Engineer'],
]);

export function maybeRenamedAward(name: string): AwardName {
  const renamed = AWARD_RENAMES.get(name);
  return renamed ?? (name as AwardName);
}
