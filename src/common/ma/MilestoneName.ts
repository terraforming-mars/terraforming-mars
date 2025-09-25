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
  'Farmer',

  // Underworld
  'Tunneler',
  'Risktaker',

  // Ares Extreme
  'Purifier',

  // Modular
  // 'Briber',
  // 'Builder', // But 7 building tags
  // 'Coastguard', // NEW 3 tiles adjacent to oceans
  // 'Farmer',
  'Forester',
  'Fundraiser',
  'Hydrologist',
  'Landshaper',
  // 'Legend', // But 4 events
  'Lobbyist',
  // 'Merchant',
  // 'Metallurgist', // Smith, but 6
  'Philantropist',
  // 'Pioneer', // But 4 colonies
  'Planetologist',
  'Producer',
  'Researcher',
  // 'Spacefarer', // But 4 space tags
  'Sponsor',
  // 'Tactician', // but 4 cards with requirements
  // 'Terraformer', // but 29 TR
  // 'Terran', // But 5 Earth tags.
  'Thawer',
  // 'Trader', // NEW 3 types of resources on cards.
  // 'Tycoon', // But, 10 Green and Blue cards combined.
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
