import {Terraformer} from '@/server/milestones/Terraformer';
import {Mayor} from '@/server/milestones/Mayor';
import {Gardener} from '@/server/milestones/Gardener';
import {Builder} from '@/server/milestones/Builder';
import {Builder7} from '@/server/milestones/Builder7';
import {Planner} from '@/server/milestones/Planner';
import {Hoverlord} from '@/server/milestones/Hoverlord';
import {IMilestone} from '@/server/milestones/IMilestone';
import {Generalist} from '@/server/milestones/Generalist';
import {Specialist} from '@/server/milestones/Specialist';
import {Ecologist} from '@/server/milestones/Ecologist';
import {Tycoon} from '@/server/milestones/Tycoon';
import {Legend} from '@/server/milestones/Legend';
import {Diversifier} from '@/server/milestones/Diversifier';
import {Tactician} from '@/server/milestones/Tactician';
import {PolarExplorer} from '@/server/milestones/PolarExplorer';
import {Energizer} from '@/server/milestones/Energizer';
import {RimSettler} from '@/server/milestones/RimSettler';
import {Networker} from '@/server/milestones/Networker';
import {OneGiantStep} from '@/server/moon/OneGiantStep';
import {Lunarchitect} from '@/server/moon/Lunarchitect';
import {Economizer} from '@/server/milestones/arabiaTerra/Economizer';
import {Pioneer} from '@/server/milestones/arabiaTerra/Pioneer';
import {LandSpecialist} from '@/server/milestones/arabiaTerra/LandSpecialist';
import {Martian} from '@/server/milestones/arabiaTerra/Martian';
import {Capitalist} from '@/server/milestones/Capitalist';
import {VElectrician} from '@/server/milestones/VElectrician';
import {Coastguard, Irrigator} from '@/server/milestones/Irrigator';
import {Smith} from '@/server/milestones/Smith';
import {Tradesman} from '@/server/milestones/Tradesman';
import {Colonizer} from '@/server/milestones/amazonisPlanitia/Colonizer';
import {Minimalist} from '@/server/milestones/amazonisPlanitia/Minimalist';
import {Terran} from '@/server/milestones/amazonisPlanitia/Terran';
import {Tropicalist} from '@/server/milestones/amazonisPlanitia/Tropicalist';
import {Collector} from '@/server/milestones/terraCimmeria/Collector';
import {Firestarter} from '@/server/milestones/terraCimmeria/Firestarter';
import {Gambler} from '@/server/milestones/terraCimmeria/Gambler';
import {Spacefarer} from '@/server/milestones/terraCimmeria/Spacefarer';
import {TerraPioneer} from '@/server/milestones/terraCimmeria/TerraPioneer';
import {Risktaker} from '@/server/milestones/underworld/Risktaker';
import {Tunneler} from '@/server/milestones/underworld/Tunneler';
import {CForester, Forester} from '@/server/milestones/modular/Forester';
import {Fundraiser} from '@/server/milestones/modular/Fundraiser';
import {Geologist} from '@/server/milestones/modular/Geologist';
import {Landshaper} from '@/server/milestones/modular/Landshaper';
import {Philantropist} from '@/server/milestones/modular/Philantropist';
import {Planetologist} from '@/server/milestones/modular/Planetologist';
import {Producer} from '@/server/milestones/modular/Producer';
import {Researcher} from '@/server/milestones/modular/Researcher';
import {Sponsor} from '@/server/milestones/modular/Sponsor';
import {Lobbyist} from '@/server/milestones/modular/Lobbyist';
import {Farmer} from '@/server/milestones/modular/Farmer';
// import {Briber} from '@/server/milestones/modular/Briber';
import {Engineer} from '@/server/milestones/modular/Engineer';
import {Hydrologist} from '@/server/milestones/modular/Hydrologist';
import {Thawer} from '@/server/milestones/modular/Thawer';
import {Purifier} from '@/server/milestones/Purifier';
import {VSpacefarer} from '@/server/milestones/VSpacefarer';
import {Agronomist} from '@/server/milestones/Agronomist';
// import {Merchant} from '@/server/milestones/modular/Merchant';
import {MAManifest} from '@/server/ma/MAManifest';
import {MilestoneName} from '@/common/ma/MilestoneName';
import {BoardName} from '@/common/boards/BoardName';
import {Architect} from '@/server/milestones/Architect';
import {Legend4} from '@/server/milestones/modular/Legend4';
import {Metallurgist} from '@/server/milestones/Metallurgist';
import {Spacefarer4} from '@/server/milestones/terraCimmeria/Spacefarer4';
import {Terraformer29} from '@/server/milestones/modular/Terraformer29';
import {Terran5} from '@/server/milestones/modular/Terran5';
import {Tycoon10} from '@/server/milestones/modular/Tycoon10';
import {Trader} from '@/server/milestones/modular/Trader';
import {Tactician4} from '@/server/milestones/modular/Tactician4';
import {Briber} from '@/server/milestones/Briber';

export const milestoneManifest: MAManifest<MilestoneName, IMilestone> = {
  all: {
    'Agronomist': {Factory: Agronomist},
    'Architect': {Factory: Architect},
    'Briber': {Factory: Briber, random: 'modular'},
    'Builder': {Factory: Builder},
    'Builder7': {Factory: Builder7, random: 'modular'},
    'C. Forester': {Factory: CForester},
    'Capitalist': {Factory: Capitalist},
    'Coastguard': {Factory: Coastguard, random: 'modular'},
    'Colonizer': {Factory: Colonizer, compatibility: 'colonies'},
    'Diversifier': {Factory: Diversifier, random: 'modular'},
    'Ecologist': {Factory: Ecologist, random: 'both'},
    'Economizer': {Factory: Economizer},
    'Energizer': {Factory: Energizer, random: 'both'},
    'Engineer': {Factory: Engineer, random: 'modular'},
    'Farmer': {Factory: Farmer, random: 'modular'},
    'Firestarter': {Factory: Firestarter},
    'Forester': {Factory: Forester, deprecated: true},
    'Fundraiser': {Factory: Fundraiser, random: 'modular'},
    'Gambler': {Factory: Gambler},
    'Gardener': {Factory: Gardener, random: 'both'},
    'Generalist': {Factory: Generalist, random: 'both'},
    'Geologist': {Factory: Geologist, random: 'modular'},
    'Hoverlord': {Factory: Hoverlord, compatibility: 'venus'},
    'Hydrologist': {Factory: Hydrologist, random: 'modular'},
    'Irrigator': {Factory: Irrigator, deprecated: true},
    'Land Specialist': {Factory: LandSpecialist},
    'Landshaper': {Factory: Landshaper, random: 'modular'},
    'Legend': {Factory: Legend},
    'Legend4': {Factory: Legend4, random: 'modular'},
    'Lobbyist': {Factory: Lobbyist, compatibility: 'turmoil', random: 'modular'},
    'Lunarchitect': {Factory: Lunarchitect, compatibility: 'moon'},
    'Martian': {Factory: Martian, compatibility: 'pathfinders'},
    'Mayor': {Factory: Mayor, random: 'both'},
    // 'Merchant': {Factory: Merchant, random: 'modular'},
    'Metallurgist': {Factory: Metallurgist, random: 'modular'},
    'Minimalist': {Factory: Minimalist},
    'Networker': {Factory: Networker, compatibility: 'ares'},
    'One Giant Step': {Factory: OneGiantStep, compatibility: 'moon'},
    'Philantropist': {Factory: Philantropist, random: 'modular'},
    'Pioneer': {Factory: Pioneer, compatibility: 'colonies'},
    'Pioneer4': {Factory: Pioneer, compatibility: 'colonies', random: 'modular'},
    'Planetologist': {Factory: Planetologist, compatibility: 'venus', random: 'modular'},
    'Planner': {Factory: Planner, random: 'both'},
    'Polar Explorer': {Factory: PolarExplorer},
    'Producer': {Factory: Producer, random: 'modular'},
    'Purifier': {Factory: Purifier, compatibility: 'ares'},
    'Researcher': {Factory: Researcher, random: 'modular'},
    'Rim Settler': {Factory: RimSettler, random: 'both'},
    'Risktaker': {Factory: Risktaker, compatibility: 'underworld'},
    'Smith': {Factory: Smith},
    'Spacefarer': {Factory: Spacefarer},
    'Spacefarer4': {Factory: Spacefarer4, random: 'modular'},
    'Specialist': {Factory: Specialist},
    'Sponsor': {Factory: Sponsor, random: 'modular'},
    'T. Collector': {Factory: Collector},
    'Tactician': {Factory: Tactician},
    'Tactician4': {Factory: Tactician4, random: 'modular'},
    'Terra Pioneer': {Factory: TerraPioneer},
    'Terraformer': {Factory: Terraformer},
    'Terraformer29': {Factory: Terraformer29, random: 'modular'},
    'Terran': {Factory: Terran},
    'Terran5': {Factory: Terran5, random: 'modular'},
    'Thawer': {Factory: Thawer, random: 'modular'},
    'Trader': {Factory: Trader, random: 'modular'},
    'Tradesman': {Factory: Tradesman},
    'Tropicalist': {Factory: Tropicalist},
    'Tunneler': {Factory: Tunneler, compatibility: 'underworld'},
    'Tycoon': {Factory: Tycoon},
    'Tycoon10': {Factory: Tycoon10, random: 'modular'},
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
