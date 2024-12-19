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
import {Economizer2} from './terraCimmeria/Economizer2';
import {TPolitician} from './terraCimmeria/TPolitician';
import {Urbanist} from './terraCimmeria/Urbanist';
import {Warmonger} from './terraCimmeria/Warmonger';
import {Zoologist2} from './amazonisPlanitia/Zoologist';
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

export const THARSIS_AWARDS = [
  new Landlord(),
  new Scientist(),
  new Banker(),
  new Thermalist(),
  new Miner(),
];

export const VENUS_AWARDS = [
  new Venuphile(),
];

export const ELYSIUM_AWARDS = [
  new Celebrity(),
  new Industrialist(),
  new DesertSettler(),
  new EstateDealer(),
  new Benefactor(),
];

export const UTOPIA_PLANITIA_AWARDS = [
  // new Suburbian(),
  // new Investor(),
  // new Botanist(),
  // new Incorporator(),
  // new Metropolist(),
];

export const HELLAS_AWARDS = [
  new Cultivator(),
  new Magnate(),
  new SpaceBaron(),
  new Excentric(),
  new Contractor(),
];

export const ARES_AWARDS = [
  new Entrepreneur(),
  new Rugged(),
];

export const MOON_AWARDS = [
  new FullMoon(),
  new LunarMagnate(),
];

export const AMAZONIS_PLANITIA_AWARDS = [
  new Curator(),
  new AmazonisEngineer(),
  new Promoter(),
  new Tourist(),
  new Zoologist2(),
];

export const ARABIA_TERRA_AWARDS = [
  new CosmicSettler(),
  new Botanist(),
  new Promoter(),
  new Zoologist(),
  new AManufacturer(),
];

export const TERRA_CIMMERIA_AWARDS = [
  new Biologist(),
  new Economizer2(),
  new TPolitician(),
  new Urbanist(),
  new Warmonger(),
];

export const VASTITAS_BOREALIS_AWARDS = [
  new Forecaster(),
  new Edgedancer(),
  new Visionary(),
  new Naturalist(),
  new Voyager(),
];

export const UNDERWORLD_AWARDS = [
  new Kingpin(),
  new EdgeLord(),
];

export const MODULAR_AWARDS = [
  new Administrator(),
  new Collector(),
  new Constructor(),
  new Electrician(),
  new Founder(),
  new Highlander(),
  new Investor(),
  new Incorporator(),
  new Landscaper(),
  new Manufacturer(),
  new Metropolist(),
  new Mogul(),
  new Politician(),
  new Traveller(),
];

export const ALL_AWARDS = [
  ...THARSIS_AWARDS,
  ...ELYSIUM_AWARDS,
  ...HELLAS_AWARDS,
  ...UTOPIA_PLANITIA_AWARDS,
  ...VENUS_AWARDS,
  ...ARES_AWARDS,
  ...MOON_AWARDS,
  ...AMAZONIS_PLANITIA_AWARDS,
  ...ARABIA_TERRA_AWARDS,
  ...TERRA_CIMMERIA_AWARDS,
  ...VASTITAS_BOREALIS_AWARDS,
  ...UNDERWORLD_AWARDS,
  ...MODULAR_AWARDS,
];

// Remove namespace and rename function
export function getAwardByName(name: string): IAward | undefined {
  return ALL_AWARDS.find((a) => a.name === name);
}

export function getAwardByNameOrThrow(name: string): IAward {
  const award = getAwardByName(name);
  if (award) {
    return award;
  }
  throw new Error(`Award ${name} not found.`);
}
