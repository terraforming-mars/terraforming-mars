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
  'Curator',
  'Engineer',
  'Historian',
  'Tourist',
  'A. Zoologist',

  // Arabia Terra
  'Cosmic Settler',
  'Botanist',
  'Coordinator',
  'Manufacturer',
  'Zoologist',

  // Terra Cimmeria
  'Biologist',
  'T. Economizer',
  'Politician',
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
] as const;

export type AwardName = typeof awardNames[number];
