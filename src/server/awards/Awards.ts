import {Landlord} from '@/server/awards/Landlord';
import {Banker} from '@/server/awards/Banker';
import {Scientist} from '@/server/awards/Scientist';
import {Thermalist} from '@/server/awards/Thermalist';
import {Miner} from '@/server/awards/Miner';
import {Venuphile} from '@/server/awards/Venuphile';
import {IAward} from '@/server/awards/IAward';
import {Industrialist} from '@/server/awards/Industrialist';
import {Celebrity} from '@/server/awards/Celebrity';
import {DesertSettler} from '@/server/awards/DesertSettler';
import {EstateDealer} from '@/server/awards/EstateDealer';
import {Benefactor} from '@/server/awards/Benefactor';
import {Cultivator} from '@/server/awards/Cultivator';
import {Magnate} from '@/server/awards/Magnate';
import {SpaceBaron} from '@/server/awards/SpaceBaron';
import {Excentric} from '@/server/awards/Excentric';
import {Contractor} from '@/server/awards/Contractor';
import {Entrepreneur} from '@/server/awards/Entrepreneur';
import {FullMoon} from '@/server/moon/FullMoon';
import {LunarMagnate} from '@/server/moon/LunarMagnate';
import {CosmicSettler} from '@/server/awards/arabiaTerra/CosmicSettler';
import {Botanist} from '@/server/awards/arabiaTerra/Botanist';
import {Promoter} from '@/server/awards/arabiaTerra/Promoter';
import {Zoologist} from '@/server/awards/arabiaTerra/Zoologist';
import {AManufacturer} from '@/server/awards/arabiaTerra/Manufacturer';
import {Forecaster} from '@/server/awards/Forecaster';
import {Edgedancer} from '@/server/awards/Edgedancer';
import {Visionary} from '@/server/awards/Visionary';
import {Naturalist} from '@/server/awards/Naturalist';
import {Voyager} from '@/server/awards/Voyager';
import {Curator} from '@/server/awards/amazonisPlanitia/Curator';
import {AmazonisEngineer} from '@/server/awards/amazonisPlanitia/AmazonisEngineer';
import {Tourist} from '@/server/awards/amazonisPlanitia/Tourist';
import {Biologist} from '@/server/awards/terraCimmeria/Biologist';
import {TPolitician} from '@/server/awards/terraCimmeria/TPolitician';
import {Urbanist} from '@/server/awards/terraCimmeria/Urbanist';
import {Warmonger} from '@/server/awards/terraCimmeria/Warmonger';
import {AZoologist} from '@/server/awards/amazonisPlanitia/AZoologist';
import {Kingpin} from '@/server/awards/underworld/Kingpin';
import {Excavator} from '@/server/awards/underworld/Excavator';
import {Administrator} from '@/server/awards/modular/Administrator';
import {Constructor} from '@/server/awards/modular/Constructor';
import {Founder} from '@/server/awards/modular/Founder';
import {Highlander} from '@/server/awards/modular/Highlander';
import {Investor} from '@/server/awards/modular/Investor';
import {Landscaper} from '@/server/awards/modular/Landscaper';
import {Metropolist} from '@/server/awards/modular/Metropolist';
import {Mogul} from '@/server/awards/modular/Mogul';
import {Traveller} from '@/server/awards/modular/Traveller';
import {Electrician} from '@/server/awards/modular/Electrician';
import {Collector} from '@/server/awards/modular/Collector';
import {Politician} from '@/server/awards/modular/Politician';
import {Manufacturer} from '@/server/awards/modular/Manufacturer';
import {Incorporator} from '@/server/awards/modular/Incorporator';
import {Rugged} from '@/server/awards/Rugged';
import {BoardName} from '@/common/boards/BoardName';
import {AwardName} from '@/common/ma/AwardName';
import {MAManifest} from '@/server/ma/MAManifest';
import {Suburbian} from '@/server/awards/modular/Suburbian';
import {Blacksmith} from '@/server/awards/Blacksmith';

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
