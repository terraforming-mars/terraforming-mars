import {Landlord} from './Landlord';
import {Banker} from './Banker';
import {Scientist} from './Scientist';
import {Thermalist} from './Thermalist';
import {Miner} from './Miner';
import {Venuphile} from './Venuphile';
import {IAward} from './IAward';
import {Industrialist} from './Industrialist';
import {Celebrity} from './Celebrity';
import {DesertSettler} from './DesertSettler';
import {EstateDealer} from './EstateDealer';
import {Benefactor} from './Benefactor';
import {Cultivator} from './Cultivator';
import {Magnate} from './Magnate';
import {SpaceBaron} from './SpaceBaron';
import {Excentric} from './Excentric';
import {Contractor} from './Contractor';
import {Entrepreneur} from './Entrepreneur';
import {FullMoon} from '../moon/FullMoon';
import {LunarMagnate} from '../moon/LunarMagnate';
import {CosmicSettler} from './arabiaTerra/CosmicSettler';
import {Botanist} from './arabiaTerra/Botanist';
import {Promoter} from './arabiaTerra/Promoter';
import {Zoologist} from './arabiaTerra/Zoologist';
import {AManufacturer} from './arabiaTerra/Manufacturer';
import {Forecaster} from './Forecaster';
import {Edgedancer} from './Edgedancer';
import {Visionary} from './Visionary';
import {Naturalist} from './Naturalist';
import {Voyager} from './Voyager';
import {Curator} from './amazonisPlanitia/Curator';
import {AmazonisEngineer} from './amazonisPlanitia/AmazonisEngineer';
import {Tourist} from './amazonisPlanitia/Tourist';
import {Biologist} from './terraCimmeria/Biologist';
import {TPolitician} from './terraCimmeria/TPolitician';
import {Urbanist} from './terraCimmeria/Urbanist';
import {Warmonger} from './terraCimmeria/Warmonger';
import {AZoologist} from './amazonisPlanitia/AZoologist';
import {Kingpin} from './underworld/Kingpin';
import {EdgeLord} from './underworld/EdgeLord';
import {Administrator} from './modular/Administrator';
import {Constructor} from './modular/Constructor';
import {Founder} from './modular/Founder';
import {Highlander} from './modular/Highlander';
import {Investor} from './modular/Investor';
import {Landscaper} from './modular/Landscaper';
import {Metropolist} from './modular/Metropolist';
import {Mogul} from './modular/Mogul';
import {Traveller} from './modular/Traveller';
import {Electrician} from './modular/Electrician';
import {Collector} from './modular/Collector';
import {Politician} from './modular/Politician';
import {Manufacturer} from './modular/Manufacturer';
import {Incorporator} from './modular/Incorporator';
import {Rugged} from './Rugged';
import {BoardName} from '../../common/boards/BoardName';
import {AwardName} from '../../common/ma/AwardName';
import {MAManifest} from '../ma/MAManifest';

export const awardManifest: MAManifest<AwardName, IAward> = {
  all: {
    'Landlord': {Factory: Landlord},
    'Scientist': {Factory: Scientist},
    'Banker': {Factory: Banker},
    'Thermalist': {Factory: Thermalist},
    'Miner': {Factory: Miner},
    'Celebrity': {Factory: Celebrity},
    'Industrialist': {Factory: Industrialist},
    'Desert Settler': {Factory: DesertSettler},
    'Estate Dealer': {Factory: EstateDealer},
    'Benefactor': {Factory: Benefactor},
    'Cultivator': {Factory: Cultivator},
    'Excentric': {Factory: Excentric},
    'Magnate': {Factory: Magnate},
    'Space Baron': {Factory: SpaceBaron},
    'Contractor': {Factory: Contractor},
    'Venuphile': {Factory: Venuphile, compatibility: 'venus'},
    'Entrepreneur': {Factory: Entrepreneur, compatibility: 'ares'},
    'Full Moon': {Factory: FullMoon, compatibility: 'moon'},
    'Lunar Magnate': {Factory: LunarMagnate, compatibility: 'moon'},
    'Curator': {Factory: Curator},
    'A. Engineer': {Factory: AmazonisEngineer},
    'Promoter': {Factory: Promoter},
    'Tourist': {Factory: Tourist},
    'A. Zoologist': {Factory: AZoologist},
    'Cosmic Settler': {Factory: CosmicSettler},
    'Botanist': {Factory: Botanist},
    'Zoologist': {Factory: Zoologist},
    'A. Manufacturer': {Factory: AManufacturer},
    'Biologist': {Factory: Biologist},
    'T. Politician': {Factory: TPolitician, compatibility: 'turmoil'},
    'Urbanist': {Factory: Urbanist},
    'Warmonger': {Factory: Warmonger},
    'Forecaster': {Factory: Forecaster},
    'Edgedancer': {Factory: Edgedancer},
    'Visionary': {Factory: Visionary},
    'Naturalist': {Factory: Naturalist},
    'Voyager': {Factory: Voyager},
    'Kingpin': {Factory: Kingpin, compatibility: 'underworld'},
    'EdgeLord': {Factory: EdgeLord, compatibility: 'underworld'},
    'Administrator': {Factory: Administrator},
    'Constructor': {Factory: Constructor, compatibility: 'colonies'},
    'Founder': {Factory: Founder},
    'Highlander': {Factory: Highlander},
    'Investor': {Factory: Investor},
    'Incorporator': {Factory: Incorporator},
    'Landscaper': {Factory: Landscaper},
    'Metropolist': {Factory: Metropolist},
    'Mogul': {Factory: Mogul},
    'Traveller': {Factory: Traveller},
    'Collector': {Factory: Collector},
    'Electrician': {Factory: Electrician},
    'Manufacturer': {Factory: Manufacturer},
    'Politician': {Factory: Politician, compatibility: 'turmoil'},
    'Rugged': {Factory: Rugged, compatibility: 'ares'},
  },
  boards: {
    [BoardName.THARSIS]: ['Landlord', 'Scientist', 'Banker', 'Thermalist', 'Miner'],
    [BoardName.HELLAS]: ['Cultivator', 'Magnate', 'Space Baron', 'Excentric', 'Contractor'],
    [BoardName.ELYSIUM]: ['Celebrity', 'Industrialist', 'Desert Settler', 'Estate Dealer', 'Benefactor'],
    [BoardName.AMAZONIS]: ['Curator', 'A. Engineer', 'Promoter', 'Tourist', 'A. Zoologist'],
    [BoardName.ARABIA_TERRA]: ['Cosmic Settler', 'Botanist', 'Promoter', 'Zoologist', 'A. Manufacturer'],
    [BoardName.TERRA_CIMMERIA]: ['Biologist', 'Incorporator', 'T. Politician', 'Urbanist', 'Warmonger'],
    [BoardName.VASTITAS_BOREALIS]: ['Forecaster', 'Edgedancer', 'Visionary', 'Naturalist', 'Voyager'],
    [BoardName.UTOPIA_PLANITIA]: [/* 'Suburbian', 'Investor', 'Botanist', 'Incorporator', 'Metropolist' */],
    [BoardName.VASTITAS_BOREALIS_NOVUS]: ['Traveller', 'Landscaper', 'Highlander', 'Promoter', 'Manufacturer'],
    [BoardName.TERRA_CIMMERIA_NOVUS]: [],
  },
  expansions: {
    venus: ['Venuphile'],
    ares: ['Entrepreneur', 'Rugged'],
    moon: ['Full Moon', 'Lunar Magnate'],
    underworld: ['Kingpin', 'EdgeLord'],
  },
  modular: [
    'Administrator',
    'Collector',
    'Constructor',
    'Electrician',
    'Founder',
    'Highlander',
    'Investor',
    // 'Incorporator',
    'Landscaper',
    'Manufacturer',
    'Metropolist',
    'Mogul',
    'Politician',
    'Traveller',
  ],
  create: (name: string) => {
    try {
      return awardManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string) {
    try {
      return new awardManifest.all[name as AwardName].Factory();
    } catch (e) {
      throw new Error(`Award ${name} not found.`);
    }
  },
} as const;
