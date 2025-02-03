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
import {TEconomizer} from './terraCimmeria/TEconomizer';
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
import {OneOrArray} from '../../common/utils/types';
import {Expansion} from '../../common/cards/GameModule';
import {BoardName} from '../../common/boards/BoardName';
import {AwardName} from '../../common/ma/AwardName';

type MAManifestSpec<T> = {
  // Creates a new instance of this Milestone or Award.
  Factory: new () => T;
  compatibility?: OneOrArray<Expansion>;
  /* If true, this is a modular MA. */
  modular?: boolean,
}
const manifest: Record<AwardName, MAManifestSpec<IAward>> = {
  'Landlord': {Factory: Landlord, modular: true},
  'Scientist': {Factory: Scientist, modular: true},
  'Banker': {Factory: Banker, modular: true},
  'Thermalist': {Factory: Thermalist, modular: true},
  'Miner': {Factory: Miner, modular: true},
  'Celebrity': {Factory: Celebrity, modular: true},
  'Industrialist': {Factory: Industrialist, modular: true},
  'Desert Settler': {Factory: DesertSettler},
  'Estate Dealer': {Factory: EstateDealer, modular: true},
  'Benefactor': {Factory: Benefactor, modular: true},
  'Cultivator': {Factory: Cultivator},
  'Excentric': {Factory: Excentric, modular: true},
  'Magnate': {Factory: Magnate, modular: true},
  'Space Baron': {Factory: SpaceBaron, modular: true},
  'Contractor': {Factory: Contractor, modular: true},
  'Venuphile': {Factory: Venuphile, compatibility: 'venus'},
  'Entrepreneur': {Factory: Entrepreneur, compatibility: 'ares'},
  'Full Moon': {Factory: FullMoon, compatibility: 'moon'},
  'Lunar Magnate': {Factory: LunarMagnate, compatibility: 'moon'},
  'Curator': {Factory: Curator},
  'A. Engineer': {Factory: AmazonisEngineer},
  'Promoter': {Factory: Promoter, modular: true},
  'Tourist': {Factory: Tourist},
  'A. Zoologist': {Factory: AZoologist, modular: true},
  'Cosmic Settler': {Factory: CosmicSettler},
  'Botanist': {Factory: Botanist, modular: true},
  'Zoologist': {Factory: Zoologist},
  'A. Manufacturer': {Factory: AManufacturer},
  'Biologist': {Factory: Biologist, modular: true},
  'T. Economizer': {Factory: TEconomizer},
  'T. Politician': {Factory: TPolitician, compatibility: 'turmoil'},
  'Urbanist': {Factory: Urbanist},
  'Warmonger': {Factory: Warmonger},
  'Forecaster': {Factory: Forecaster, modular: true},
  'Edgedancer': {Factory: Edgedancer},
  'Visionary': {Factory: Visionary, modular: true},
  'Naturalist': {Factory: Naturalist},
  'Voyager': {Factory: Voyager},
  'Kingpin': {Factory: Kingpin, compatibility: 'underworld'},
  'EdgeLord': {Factory: EdgeLord, compatibility: 'underworld'},
  'Administrator': {Factory: Administrator, modular: true},
  'Constructor': {Factory: Constructor, modular: true},
  'Founder': {Factory: Founder, modular: true},
  'Highlander': {Factory: Highlander, modular: true},
  'Investor': {Factory: Investor, modular: true},
  'Incorporator': {Factory: Incorporator, modular: true},
  'Landscaper': {Factory: Landscaper, modular: true},
  'Metropolist': {Factory: Metropolist, modular: true},
  'Mogul': {Factory: Mogul, modular: true},
  'Traveller': {Factory: Traveller, modular: true},
  'Collector': {Factory: Collector, modular: true},
  'Electrician': {Factory: Electrician, modular: true},
  'Manufacturer': {Factory: Manufacturer, modular: true},
  'Politician': {Factory: Politician, compatibility: 'turmoil', modular: true},
  'Rugged': {Factory: Rugged, compatibility: 'ares'},
} as const;

export const boardAwards: Record<BoardName, ReadonlyArray<AwardName>> = {
  [BoardName.THARSIS]: ['Landlord', 'Scientist', 'Banker', 'Thermalist', 'Miner'],
  [BoardName.HELLAS]: ['Cultivator', 'Magnate', 'Space Baron', 'Excentric', 'Contractor'],
  [BoardName.ELYSIUM]: ['Celebrity', 'Industrialist', 'Desert Settler', 'Estate Dealer', 'Benefactor'],
  [BoardName.AMAZONIS]: ['Curator', 'A. Engineer', 'Promoter', 'Tourist', 'A. Zoologist'],
  [BoardName.ARABIA_TERRA]: ['Cosmic Settler', 'Botanist', 'Promoter', 'Zoologist', 'A. Manufacturer'],
  [BoardName.TERRA_CIMMERIA]: ['Biologist', 'T. Economizer', 'T. Politician', 'Urbanist', 'Warmonger'],
  [BoardName.VASTITAS_BOREALIS]: ['Forecaster', 'Edgedancer', 'Visionary', 'Naturalist', 'Voyager'],
  [BoardName.UTOPIA_PLANITIA]: [/* 'Suburbian', 'Investor', 'Botanist', 'Incorporator', 'Metropolist' */],
  [BoardName.VASTITAS_BOREALIS_NOVUS]: [],
  [BoardName.TERRA_CIMMERIA_NOVUS]: [],
};

export const VENUS_AWARDS = [
  'Venuphile',
];

export const ARES_AWARDS = [
  'Entrepreneur',
  'Rugged',
];

export const UNDERWORLD_AWARDS = [
  'Kingpin',
  'EdgeLord',
];

export const MODULAR_AWARDS = [
  'Administrator',
  'Collector',
  'Constructor',
  'Electrician',
  'Founder',
  'Highlander',
  'Investor',
  'Incorporator',
  'Landscaper',
  'Manufacturer',
  'Metropolist',
  'Mogul',
  'Politician',
  'Traveller',
];

export function getAwardByName(name: string): IAward | undefined {
  try {
    return getAwardByNameOrThrow(name);
  } catch (e) {
    return undefined;
  }
}

export function getAwardByNameOrThrow(name: string): IAward {
  try {
    return new manifest[name as AwardName].Factory();
  } catch (e) {
    throw new Error(`Award ${name} not found.`);
  }
}
