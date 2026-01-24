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
import {Excavator} from './underworld/Excavator';
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
import {Suburbian} from './modular/Suburbian';
import {Blacksmith} from './Blacksmith';

export const awardManifest: MAManifest<AwardName, IAward> = {
  all: {
    'A. Engineer': {Factory: AmazonisEngineer},
    'A. Manufacturer': {Factory: AManufacturer},
    'A. Zoologist': {Factory: AZoologist},
    'Administrator': {Factory: Administrator, random: 'modular'},
    'Banker': {Factory: Banker, random: 'both'},
    'Benefactor': {Factory: Benefactor, random: 'both'},
    'Biologist': {Factory: Biologist, random: 'both'},
    'Blacksmith': {Factory: Blacksmith},
    'Botanist': {Factory: Botanist, random: 'both'},
    'Celebrity': {Factory: Celebrity, random: 'both'},
    'Collector': {Factory: Collector, random: 'modular'},
    'Constructor': {Factory: Constructor, compatibility: 'colonies', random: 'modular'},
    'Contractor': {Factory: Contractor, random: 'both'},
    'Cosmic Settler': {Factory: CosmicSettler},
    'Cultivator': {Factory: Cultivator, random: 'both'},
    'Curator': {Factory: Curator},
    'Desert Settler': {Factory: DesertSettler},
    'Edgedancer': {Factory: Edgedancer},
    'Electrician': {Factory: Electrician, random: 'modular'},
    'Entrepreneur': {Factory: Entrepreneur, compatibility: 'ares'},
    'Estate Dealer': {Factory: EstateDealer, random: 'both'},
    'Excavator': {Factory: Excavator, compatibility: 'underworld'},
    'Excentric': {Factory: Excentric, random: 'both'},
    'Forecaster': {Factory: Forecaster, random: 'both'},
    'Founder': {Factory: Founder, random: 'modular'},
    'Full Moon': {Factory: FullMoon, compatibility: 'moon'},
    'Highlander': {Factory: Highlander, random: 'modular'},
    'Incorporator': {Factory: Incorporator, random: 'both'},
    'Industrialist': {Factory: Industrialist, random: 'both'},
    'Investor': {Factory: Investor, random: 'modular'},
    'Kingpin': {Factory: Kingpin, compatibility: 'underworld'},
    'Landlord': {Factory: Landlord, random: 'both'},
    'Landscaper': {Factory: Landscaper, random: 'modular'},
    'Lunar Magnate': {Factory: LunarMagnate, compatibility: 'moon'},
    'Magnate': {Factory: Magnate, random: 'both'},
    'Manufacturer': {Factory: Manufacturer, random: 'modular'},
    'Metropolist': {Factory: Metropolist, random: 'modular'},
    'Miner': {Factory: Miner, random: 'both'},
    'Mogul': {Factory: Mogul, random: 'modular'},
    'Naturalist': {Factory: Naturalist},
    'Politician': {Factory: Politician, compatibility: 'turmoil', random: 'modular'},
    'Promoter': {Factory: Promoter, random: 'both'},
    'Rugged': {Factory: Rugged, compatibility: 'ares'},
    'Scientist': {Factory: Scientist, random: 'both'},
    'Space Baron': {Factory: SpaceBaron, random: 'both'},
    'Suburbian': {Factory: Suburbian, random: 'modular'},
    'T. Politician': {Factory: TPolitician, compatibility: 'turmoil'},
    'Thermalist': {Factory: Thermalist, random: 'both'},
    'Tourist': {Factory: Tourist},
    'Traveller': {Factory: Traveller, random: 'modular'},
    'Urbanist': {Factory: Urbanist},
    'Venuphile': {Factory: Venuphile, compatibility: 'venus'},
    'Visionary': {Factory: Visionary, random: 'both'},
    'Voyager': {Factory: Voyager},
    'Warmonger': {Factory: Warmonger},
    'Zoologist': {Factory: Zoologist},
  },
  boards: {
    [BoardName.THARSIS]: ['Landlord', 'Scientist', 'Banker', 'Thermalist', 'Miner'],
    [BoardName.HELLAS]: ['Cultivator', 'Magnate', 'Space Baron', 'Excentric', 'Contractor'],
    [BoardName.ELYSIUM]: ['Celebrity', 'Industrialist', 'Desert Settler', 'Estate Dealer', 'Benefactor'],
    [BoardName.AMAZONIS]: ['Curator', 'A. Engineer', 'Promoter', 'Tourist', 'A. Zoologist'],
    [BoardName.ARABIA_TERRA]: ['Cosmic Settler', 'Botanist', 'Promoter', 'Zoologist', 'A. Manufacturer'],
    [BoardName.TERRA_CIMMERIA]: ['Biologist', 'Incorporator', 'T. Politician', 'Urbanist', 'Warmonger'],
    [BoardName.VASTITAS_BOREALIS]: ['Forecaster', 'Edgedancer', 'Visionary', 'Naturalist', 'Voyager'],
    [BoardName.UTOPIA_PLANITIA]: ['Edgedancer', 'Investor', 'Botanist', 'Incorporator', 'Metropolist'],
    [BoardName.VASTITAS_BOREALIS_NOVUS]: ['Traveller', 'Landscaper', 'Highlander', 'Promoter', 'Blacksmith'],
    [BoardName.TERRA_CIMMERIA_NOVUS]: ['Electrician', 'Founder', 'Mogul', 'A. Zoologist', 'Forecaster'],
    [BoardName.HOLLANDIA]: [],
  },
  expansions: {
    venus: ['Venuphile'],
    ares: ['Entrepreneur', 'Rugged'],
    moon: ['Full Moon', 'Lunar Magnate'],
    underworld: ['Kingpin', 'Excavator'],
  },
  create: (name: string): IAward | undefined => {
    try {
      return awardManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string): IAward {
    try {
      return new awardManifest.all[name as AwardName].Factory();
    } catch (e) {
      throw new Error(`Award ${name} not found.`);
    }
  },
} as const;
