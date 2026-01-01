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
  'Minimalist',
  'Terran',
  'Tropicalist',

  // Arabia Terra
  'Economizer',
  'Pioneer',
  'Land Specialist',
  'Martian',

  // Terra Cimmeria
  'T. Collector',
  'Firestarter',
  'Terra Pioneer',
  'Spacefarer', // TODO(kberg): Rename to T. Spacefarer
  'Gambler',

  // Terra Cimmeria Novus
  'Architect',
  'Coastguard', // Also Modular
  'C. Forester',

  // Vastitas Borealis
  'V. Electrician',
  'Smith',
  'Tradesman',
  'Irrigator',
  'Capitalist',

  // Vastitas Borealis Novus
  'Agronomist',
  'Engineer',
  'V. Spacefarer',
  'Geologist',
  'Farmer', // And modular

  // Underworld
  'Tunneler',
  'Risktaker',

  // Ares Extreme
  'Purifier',

  // Modular
  'Briber',
  'Builder7',
  'Forester',
  'Fundraiser',
  'Hydrologist',
  'Landshaper',
  'Legend4',
  'Lobbyist',
  // 'Merchant',
  'Metallurgist', // Same as Smith
  'Philantropist',
  'Pioneer4',
  'Planetologist',
  'Producer',
  'Researcher',
  'Spacefarer4',
  'Sponsor',
  'Tactician4',
  'Terraformer29',
  'Terran5',
  'Thawer',
  'Trader',
  'Tycoon10',
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
