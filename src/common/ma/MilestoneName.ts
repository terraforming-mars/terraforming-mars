export const milestoneNames = [
  // Tharsis
  'Terraformer',
  'Mayor',
  'Gardener',
  'Planner',
  'Builder',

  // Elysium
  'Generalist',
  'Specialist',
  'Ecologist',
  'Tycoon',
  'Legend',

  // Hellas
  'Diversifier',
  'Tactician',
  'Polar Explorer',
  'Energizer',
  'Rim Settler',

  // Venus
  'Hoverlord',

  // Ares
  'Networker',

  // The Moon
  'One Giant Step',
  'Lunarchitect',

  // Amazonis Planitia
  'Colonizer',
  'Farmer',
  'Minimalist',
  'Terran',
  'Tropicalist',

  // Arabia Terra
  'Economizer',
  'Pioneer',
  'Land Specialist',
  'Martian',
  'Businessperson',

  // Terra Cimmeria
  'Collector',
  'Firestarter',
  'Terra Pioneer',
  'Spacefarer',
  'Gambler',

  // Vastitas Borealis
  'Electrician',
  'Smith',
  'Tradesman',
  'Irrigator',
  'Capitalist',

  // Underworld
  'Tunneler',
  'Risktaker',
] as const;

export type MilestoneName = typeof milestoneNames[number];
