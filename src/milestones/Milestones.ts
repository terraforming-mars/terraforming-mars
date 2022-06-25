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
import {Economizer} from './Economizer';
import {Pioneer} from './Pioneer';
import {LandSpecialist} from './LandSpecialist';
import {Martian} from './Martian';
import {Businessperson} from './Businessperson';
import {Capitalist} from './Capitalist';
import {Electrician} from './Electrician';
import {Irrigator} from './Irrigator';
import {Smith} from './Smith';
import {Tradesman} from './Tradesman';
import {Colonizer} from './amazonisPlanitia/Colonizer';
import {Farmer} from './amazonisPlanitia/Farmer';
import {Minimalist} from './amazonisPlanitia/Minimalist';
import {Terran} from './amazonisPlanitia/Terran';
import {Tropicalist} from './amazonisPlanitia/Tropicalist';
import {Collector} from './terraCimmeria/Collector';
import {Firestarter} from './terraCimmeria/Firestarter';
import {Gambler} from './terraCimmeria/Gambler';
import {Spacefarer} from './terraCimmeria/Spacefarer';
import {TerraPioneer} from './terraCimmeria/TerraPioneer';

export const ORIGINAL_MILESTONES: Array<IMilestone> = [
  new Terraformer(),
  new Mayor(),
  new Gardener(),
  new Builder(),
  new Planner(),
];

export const VENUS_MILESTONES: Array<IMilestone> = [
  new Hoverlord(),
];

export const ELYSIUM_MILESTONES: Array<IMilestone> = [
  new Generalist(),
  new Specialist(),
  new Ecologist(),
  new Tycoon(),
  new Legend(),
];

export const HELLAS_MILESTONES: Array<IMilestone> = [
  new Diversifier(),
  new Tactician(),
  new PolarExplorer(),
  new Energizer(),
  new RimSettler(),
];

export const ARES_MILESTONES: Array<IMilestone> = [
  new Networker(),
];

export const MOON_MILESTONES: Array<IMilestone> = [
  new OneGiantStep(),
  new Lunarchitect(),
];

export const AMAZONIS_PLANITIA_MILESTONES = [
  new Colonizer(),
  new Farmer(),
  new Minimalist(),
  new Terran(),
  new Tropicalist(),
];

export const ARABIA_TERRA_MILESTONES = [
  new Economizer(),
  new Pioneer(),
  new LandSpecialist(),
  new Martian(),
  new Businessperson(),
];

export const TERRA_CIMMERIA_MILESTONES = [
  new Collector(),
  new Firestarter(),
  new TerraPioneer(),
  new Spacefarer(),
  new Gambler(),
];

export const VASTITAS_BOREALIS_MILESTONES: Array<IMilestone> = [
  new Electrician(),
  new Smith(),
  new Tradesman(),
  new Irrigator(),
  new Capitalist(),
];

export const ALL_MILESTONES: Array<IMilestone> = [
  ...ORIGINAL_MILESTONES,
  ...ELYSIUM_MILESTONES,
  ...HELLAS_MILESTONES,
  ...VENUS_MILESTONES,
  ...ARES_MILESTONES,
  ...MOON_MILESTONES,
  ...AMAZONIS_PLANITIA_MILESTONES,
  ...ARABIA_TERRA_MILESTONES,
  ...TERRA_CIMMERIA_MILESTONES,
  ...VASTITAS_BOREALIS_MILESTONES,
];

export namespace Milestones {
  export const ALL = ALL_MILESTONES;

  export function getByName(name: string): IMilestone {
    const milestone = ALL_MILESTONES.find((m) => m.name === name);
    if (milestone) {
      return milestone;
    }
    throw new Error(`Milestone ${name} not found.`);
  }
}
