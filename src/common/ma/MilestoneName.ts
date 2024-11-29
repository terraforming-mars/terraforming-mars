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
  'T. Collector',
  'Firestarter',
  'Terra Pioneer',
  'Spacefarer',
  'Gambler',

  // Vastitas Borealis
  'V. Electrician',
  'Smith',
  'Tradesman',
  'Irrigator',
  'Capitalist',

  // Underworld
  'Tunneler',
  'Risktaker',

  // Modular Milestones
  'Breeder',
  'Briber',
  'Fundraiser',
  'Geologist',
  'Hydrologist', // Not implemented Place 4 oceans
  'Landshaper',
  'Lobbyist',
  'Merchant',
  'Philantropist', // Name - 'Philantropist' on tile, but 'Filantrope' in rulebook
  'Planetologist',
  'Producer',
  'Researcher',
  'Sponsor',
  'Thawer', // Not implemented Raise the temperature 5 times
  'ThermoEngineer',
] as const;

export type MilestoneName = typeof milestoneNames[number];

const MILESTONE_RENAMES = new Map<string, MilestoneName>([
  // When renaming an award add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
  // ['Electrician', 'V. Electrician'],
]);

export function maybeRenamedMilestone(name: string): MilestoneName {
  const renamed = MILESTONE_RENAMES.get(name);
  return renamed ?? (name as MilestoneName);
}
