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
import {Coastguard, Irrigator} from './Irrigator';
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
import {CForester, Forester} from './modular/Forester';
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
import {Architect} from './Architect';

export const milestoneManifest: MAManifest<MilestoneName, IMilestone> = {
  all: {
    'Agronomist': {Factory: Agronomist},
    'Architect': {Factory: Architect},
    // 'Briber': {Factory: Briber, random: 'modular'},
    'Builder': {Factory: Builder},
    'C. Forester': {Factory: CForester},
    'Capitalist': {Factory: Capitalist},
    'Coastguard': {Factory: Coastguard},
    'Colonizer': {Factory: Colonizer, compatibility: 'colonies'},
    'Diversifier': {Factory: Diversifier},
    'Ecologist': {Factory: Ecologist},
    'Economizer': {Factory: Economizer},
    'Energizer': {Factory: Energizer},
    'Engineer': {Factory: Engineer, random: 'modular'},
    'Farmer': {Factory: Farmer, random: 'modular'},
    'Firestarter': {Factory: Firestarter},
    'Forester': {Factory: Forester, deprecated: true},
    'Fundraiser': {Factory: Fundraiser, random: 'modular'},
    'Gambler': {Factory: Gambler},
    'Gardener': {Factory: Gardener},
    'Generalist': {Factory: Generalist},
    'Geologist': {Factory: Geologist, random: 'modular'},
    'Hoverlord': {Factory: Hoverlord, compatibility: 'venus'},
    'Hydrologist': {Factory: Hydrologist, random: 'modular'},
    'Irrigator': {Factory: Irrigator, deprecated: true},
    'Land Specialist': {Factory: LandSpecialist},
    'Landshaper': {Factory: Landshaper, random: 'modular'},
    'Legend': {Factory: Legend},
    'Lobbyist': {Factory: Lobbyist, compatibility: 'turmoil', random: 'modular'},
    'Lunarchitect': {Factory: Lunarchitect, compatibility: 'moon'},
    'Martian': {Factory: Martian, compatibility: 'pathfinders'},
    'Mayor': {Factory: Mayor},
    // 'Merchant': {Factory: Merchant, random: 'modular'},
    'Minimalist': {Factory: Minimalist},
    'Networker': {Factory: Networker, compatibility: 'ares'},
    'One Giant Step': {Factory: OneGiantStep, compatibility: 'moon'},
    'Philantropist': {Factory: Philantropist, random: 'modular'},
    'Pioneer': {Factory: Pioneer, compatibility: 'colonies'},
    'Planetologist': {Factory: Planetologist, compatibility: 'venus', random: 'modular'},
    'Planner': {Factory: Planner},
    'Polar Explorer': {Factory: PolarExplorer},
    'Producer': {Factory: Producer, random: 'modular'},
    'Purifier': {Factory: Purifier, compatibility: 'ares'},
    'Researcher': {Factory: Researcher, random: 'modular'},
    'Rim Settler': {Factory: RimSettler},
    'Risktaker': {Factory: Risktaker, compatibility: 'underworld'},
    'Smith': {Factory: Smith},
    'Spacefarer': {Factory: Spacefarer},
    'Specialist': {Factory: Specialist},
    'Sponsor': {Factory: Sponsor, random: 'modular'},
    'T. Collector': {Factory: Collector},
    'Tactician': {Factory: Tactician},
    'Terra Pioneer': {Factory: TerraPioneer},
    'Terraformer': {Factory: Terraformer},
    'Terran': {Factory: Terran},
    'Thawer': {Factory: Thawer, random: 'modular'},
    'Tradesman': {Factory: Tradesman},
    'Tropicalist': {Factory: Tropicalist},
    'Tunneler': {Factory: Tunneler, compatibility: 'underworld'},
    'Tycoon': {Factory: Tycoon},
    'V. Electrician': {Factory: VElectrician},
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
    [BoardName.UTOPIA_PLANITIA]: ['Land Specialist', 'Pioneer', 'Tradesman', 'Smith', 'Researcher'],
    [BoardName.VASTITAS_BOREALIS_NOVUS]: ['Agronomist', 'V. Spacefarer', 'Geologist', 'Engineer', 'Farmer'],
    [BoardName.TERRA_CIMMERIA_NOVUS]: ['Planetologist', 'Architect', 'Coastguard', 'C. Forester', 'Fundraiser'],
    [BoardName.HOLLANDIA]: [],
  },
  expansions: {
    venus: ['Hoverlord'],
    ares: ['Networker', 'Purifier'],
    moon: ['One Giant Step', 'Lunarchitect'],
    underworld: ['Risktaker', 'Tunneler'],
  },
  create: (name: string): IMilestone | undefined => {
    try {
      return milestoneManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string): IMilestone {
    try {
      return new milestoneManifest.all[name as MilestoneName].Factory();
    } catch (e) {
      throw new Error(`Milestone ${name} not found.`);
    }
  },
} as const;
