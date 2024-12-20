import {Terraformer} from './Terraformer';
import {Mayor} from './Mayor';
import {Gardener} from './Gardener';
import {Builder} from './Builder';
import {Planner} from './Planner';
import {Hoverlord} from './Hoverlord';
import {IMilestone} from './IMilestone';
import {Generalist} from './Generalist';
import {Specialist} from './Specialist';
import {Ecologist} from './Ecologist';
import {Tycoon} from './Tycoon';
import {Legend} from './Legend';
import {Diversifier} from './Diversifier';
import {Tactician} from './Tactician';
import {PolarExplorer} from './PolarExplorer';
import {Energizer} from './Energizer';
import {RimSettler} from './RimSettler';
import {Networker} from './Networker';
import {OneGiantStep} from '../moon/OneGiantStep';
import {Lunarchitect} from '../moon/Lunarchitect';
import {Economizer} from './arabiaTerra/Economizer';
import {Pioneer} from './arabiaTerra/Pioneer';
import {LandSpecialist} from './arabiaTerra/LandSpecialist';
import {Martian} from './arabiaTerra/Martian';
import {Capitalist} from './Capitalist';
import {VElectrician} from './VElectrician';
import {Irrigator} from './Irrigator';
import {Smith} from './Smith';
import {Tradesman} from './Tradesman';
import {Colonizer} from './amazonisPlanitia/Colonizer';
import {Minimalist} from './amazonisPlanitia/Minimalist';
import {Terran} from './amazonisPlanitia/Terran';
import {Tropicalist} from './amazonisPlanitia/Tropicalist';
import {Collector} from './terraCimmeria/Collector';
import {Firestarter} from './terraCimmeria/Firestarter';
import {Gambler} from './terraCimmeria/Gambler';
import {Spacefarer} from './terraCimmeria/Spacefarer';
import {TerraPioneer} from './terraCimmeria/TerraPioneer';
import {Risktaker} from './underworld/Risktaker';
import {Tunneler} from './underworld/Tunneler';
import {Forester} from './modular/Forester';
import {Fundraiser} from './modular/Fundraiser';
import {Geologist} from './modular/Geologist';
import {Landshaper} from './modular/Landshaper';
import {Philantropist} from './modular/Philantropist';
import {Planetologist} from './modular/Planetologist';
import {Producer} from './modular/Producer';
import {Researcher} from './modular/Researcher';
import {Sponsor} from './modular/Sponsor';
import {Lobbyist} from './modular/Lobbyist';
import {Breeder} from './modular/Breeder';
// import {Briber} from './modular/Briber';
import {ThermoEngineer} from './modular/ThermoEngineer';
import {Hydrologist} from './modular/Hydrologist';
import {Thawer} from './modular/Thawer';
import {Purifier} from './Purifier';
// import {Merchant} from './modular/Merchant';

export const THARSIS_MILESTONES = [
  new Terraformer(),
  new Mayor(),
  new Gardener(),
  new Builder(),
  new Planner(),
];

export const VENUS_MILESTONES = [
  new Hoverlord(),
];

export const ELYSIUM_MILESTONES = [
  new Generalist(),
  new Specialist(),
  new Ecologist(),
  new Tycoon(),
  new Legend(),
];

export const UTOPIA_PLANITIA_MILESTONES = [
  // new Specialist(),
  // new Pioneer(),
  // new Trader(),
  // new Metallurgist(),
  // new Researcher(),
];

export const HELLAS_MILESTONES = [
  new Diversifier(),
  new Tactician(),
  new PolarExplorer(),
  new Energizer(),
  new RimSettler(),
];

export const ARES_MILESTONES = [
  new Networker(),
  new Purifier(),
];

export const MOON_MILESTONES = [
  new OneGiantStep(),
  new Lunarchitect(),
];

export const AMAZONIS_PLANITIA_MILESTONES = [
  new Colonizer(),
  new Forester(),
  new Minimalist(),
  new Terran(),
  new Tropicalist(),
];

export const ARABIA_TERRA_MILESTONES = [
  new Economizer(),
  new Pioneer(),
  new LandSpecialist(),
  new Martian(),
  new Terran(), // Duplicate of Amazonis Planitia
];

export const TERRA_CIMMERIA_MILESTONES = [
  new Collector(),
  new Firestarter(),
  new TerraPioneer(),
  new Spacefarer(),
  new Gambler(),
];

export const VASTITAS_BOREALIS_MILESTONES = [
  new VElectrician(),
  new Smith(),
  new Tradesman(),
  new Irrigator(),
  new Capitalist(),
];

export const UNDERWORLD_MILESTONES = [
  new Risktaker(),
  new Tunneler(),
];

export const MODULAR_MILESTONES = [
  new Breeder(),
  // new Briber(),
  new Fundraiser(),
  new Geologist(),
  new Hydrologist(),
  new Landshaper(),
  new Lobbyist(),
  // new Merchant(),
  new Philantropist(),
  new Planetologist(),
  new Producer(),
  new Researcher(),
  new Sponsor(),
  new Thawer(),
  new ThermoEngineer(),
];

export const ALL_MILESTONES = [
  ...THARSIS_MILESTONES,
  ...ELYSIUM_MILESTONES,
  ...HELLAS_MILESTONES,
  ...UTOPIA_PLANITIA_MILESTONES,
  ...VENUS_MILESTONES,
  ...ARES_MILESTONES,
  ...MOON_MILESTONES,
  ...AMAZONIS_PLANITIA_MILESTONES,
  ...ARABIA_TERRA_MILESTONES,
  ...TERRA_CIMMERIA_MILESTONES,
  ...VASTITAS_BOREALIS_MILESTONES,
  ...UNDERWORLD_MILESTONES,
  ...MODULAR_MILESTONES,
];

// Remove namespace and rename function
export function getMilestoneByName(name: string): IMilestone | undefined {
  return ALL_MILESTONES.find((m) => m.name === name);
}

export function getMilestoneByNameOrThrow(name: string): IMilestone {
  const milestone = getMilestoneByName(name);
  if (milestone) {
    return milestone;
  }
  throw new Error(`Milestone ${name} not found.`);
}
