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
import {Farmer} from './modular/Farmer';
// import {Briber} from './modular/Briber';
import {Engineer} from './modular/Engineer';
import {Hydrologist} from './modular/Hydrologist';
import {Thawer} from './modular/Thawer';
import {Purifier} from './Purifier';
import {VSpacefarer} from './VSpacefarer';
import {Agronomist} from './Agronomist';
// import {Merchant} from './modular/Merchant';
import {MAManifest} from '../ma/MAManifest';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {BoardName} from '../../common/boards/BoardName';

export const milestoneManifest: MAManifest<MilestoneName, IMilestone> = {
  all: {
    'Terraformer': {Factory: Terraformer},
    'Mayor': {Factory: Mayor},
    'Gardener': {Factory: Gardener},
    'Planner': {Factory: Planner},
    'Builder': {Factory: Builder},
    'Generalist': {Factory: Generalist},
    'Specialist': {Factory: Specialist},
    'Ecologist': {Factory: Ecologist},
    'Tycoon': {Factory: Tycoon},
    'Legend': {Factory: Legend},
    'Diversifier': {Factory: Diversifier},
    'Tactician': {Factory: Tactician},
    'Polar Explorer': {Factory: PolarExplorer},
    'Energizer': {Factory: Energizer},
    'Rim Settler': {Factory: RimSettler},
    'Hoverlord': {Factory: Hoverlord, compatibility: 'venus'},
    'Networker': {Factory: Networker, compatibility: 'ares'},
    'One Giant Step': {Factory: OneGiantStep, compatibility: 'moon'},
    'Lunarchitect': {Factory: Lunarchitect, compatibility: 'moon'},
    'Colonizer': {Factory: Colonizer, compatibility: 'colonies'},
    'Forester': {Factory: Forester},
    'Minimalist': {Factory: Minimalist},
    'Terran': {Factory: Terran},
    'Tropicalist': {Factory: Tropicalist},
    'Economizer': {Factory: Economizer},
    'Pioneer': {Factory: Pioneer, compatibility: 'colonies'},
    'Land Specialist': {Factory: LandSpecialist},
    'Martian': {Factory: Martian, compatibility: 'pathfinders'},
    'T. Collector': {Factory: Collector},
    'Firestarter': {Factory: Firestarter},
    'Terra Pioneer': {Factory: TerraPioneer},
    'Spacefarer': {Factory: Spacefarer},
    'Gambler': {Factory: Gambler},
    'V. Electrician': {Factory: VElectrician},
    'Smith': {Factory: Smith},
    'Tradesman': {Factory: Tradesman},
    'Irrigator': {Factory: Irrigator},
    'Capitalist': {Factory: Capitalist},
    'Tunneler': {Factory: Tunneler, compatibility: 'underworld'},
    'Risktaker': {Factory: Risktaker, compatibility: 'underworld'},
    'Engineer': {Factory: Engineer},
    'Fundraiser': {Factory: Fundraiser},
    'Geologist': {Factory: Geologist},
    'Landshaper': {Factory: Landshaper},
    'Lobbyist': {Factory: Lobbyist, compatibility: 'turmoil'},
    'Philantropist': {Factory: Philantropist},
    // TODO(kberg): Replace with compatibility based on, uh, tags?
    'Planetologist': {Factory: Planetologist, compatibility: 'venus'},
    'Producer': {Factory: Producer},
    'Researcher': {Factory: Researcher},
    'Sponsor': {Factory: Sponsor},
    'Farmer': {Factory: Farmer},
    // 'Briber': {Factory: Briber},
    // 'Merchant': {Factory: Merchant},
    'Thawer': {Factory: Thawer},
    'Hydrologist': {Factory: Hydrologist},
    'Purifier': {Factory: Purifier, compatibility: 'ares'},
    'Agronomist': {Factory: Agronomist},
    'V. Spacefarer': {Factory: VSpacefarer},
  },
  boards: {
    [BoardName.THARSIS]: ['Terraformer', 'Mayor', 'Gardener', 'Builder', 'Planner'],
    [BoardName.HELLAS]: ['Diversifier', 'Tactician', 'Polar Explorer', 'Energizer', 'Rim Settler'],
    [BoardName.ELYSIUM]: ['Generalist', 'Specialist', 'Ecologist', 'Tycoon', 'Legend'],
    [BoardName.AMAZONIS]: ['Colonizer', 'Forester', 'Minimalist', 'Terran', 'Tropicalist'],
    [BoardName.ARABIA_TERRA]: ['Economizer', 'Pioneer', 'Land Specialist', 'Martian', 'Terran'],
    [BoardName.TERRA_CIMMERIA]: ['T. Collector', 'Firestarter', 'Terra Pioneer', 'Spacefarer', 'Gambler'],
    [BoardName.VASTITAS_BOREALIS]: ['V. Electrician', 'Smith', 'Tradesman', 'Irrigator', 'Capitalist'],
    [BoardName.UTOPIA_PLANITIA]: [/* 'Suburbian', 'Investor', 'Botanist', 'Incorporator', 'Metropolist' */],
    [BoardName.VASTITAS_BOREALIS_NOVUS]: ['Agronomist', 'Spacefarer', 'Geologist', 'Engineer', 'Farmer'],
    [BoardName.TERRA_CIMMERIA_NOVUS]: [],
  },
  expansions: {
    venus: ['Hoverlord'],
    ares: ['Networker', 'Purifier'],
    moon: ['One Giant Step', 'Lunarchitect'],
    underworld: ['Risktaker', 'Tunneler'],
  },
  modular: [
    // 'Briber',
    'Engineer',
    'Farmer',
    'Fundraiser',
    'Geologist',
    'Hydrologist',
    'Landshaper',
    'Lobbyist',
    // 'Merchant',
    'Philantropist',
    'Planetologist',
    'Producer',
    'Researcher',
    'Sponsor',
    'Thawer',
  ],
  create: (name: string) => {
    try {
      return milestoneManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string) {
    try {
      return new milestoneManifest.all[name as MilestoneName].Factory();
    } catch (e) {
      throw new Error(`Milestone ${name} not found.`);
    }
  },
} as const;
