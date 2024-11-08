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
  // NB: the fifth award for Amazonis Plantia is Coordinator, also part of Arabia Terra.
  'Curator',
  'Engineer',
  'Tourist',
  'A. Zoologist',

  // Arabia Terra
  'Cosmic Settler',
  'Botanist',
  'Coordinator',
  'A. Manufacturer',
  'Zoologist',

  // Terra Cimmeria
  'Biologist',
  'T. Economizer',
  'T. Politician',
  'Urbanist',
  'Warmonger',

  // Vastitas Borealis
  'Adapter',
  'Edgedancer',
  'Hoarder',
  'Naturalist',
  'Voyager',

  // Underworld
  'Kingpin',
  'EdgeLord',

  // Modular awards
  'Administrator',
  'Constructor',
  'Founder',
  'Investor',
  'Highlander',
  'Landscaper',
  'Metropolist',
  'Mogul',
  'Traveller',

] as const;

export type AwardName = typeof awardNames[number];

export const AWARD_RENAMES = new Map<string, AwardName>([
  // When renaming an award add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
  // TODO(kberg): remove after 2024-11-15
  ['Manufacturer', 'A. Manufacturer'],
  ['Politician', 'T. Politician'],
]);

export function maybeRenamedAward(name: string): AwardName {
  const renamed = AWARD_RENAMES.get(name);
  return renamed ?? (name as AwardName);
}
