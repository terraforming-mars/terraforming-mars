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
import {CosmicSettler} from './CosmicSettler';
import {Botanist} from './Botanist';
import {Coordinator} from './Coordinator';
import {Zoologist} from './Zoologist';
import {Manufacturer} from './Manufacturer';
import {Adapter} from './Adapter';
import {Edgedancer} from './Edgedancer';
import {Hoarder} from './Hoarder';
import {Naturalist} from './Naturalist';
import {Voyager} from './Voyager';
import {Curator} from './amazonisPlanitia/Curator';
import {Engineer} from './amazonisPlanitia/Engineer';
import {Historian} from './amazonisPlanitia/Historian';
import {Tourist} from './amazonisPlanitia/Tourist';
import {Biologist} from './terraCimmeria/Biologist';
import {Economizer2} from './terraCimmeria/Economizer2';
import {Politician} from './terraCimmeria/Politician';
import {Urbanist} from './terraCimmeria/Urbanist';
import {Warmonger} from './terraCimmeria/Warmonger';
import {Zoologist2} from './amazonisPlanitia/Zoologist';
import {Kingpin} from './underworld/Kingpin';
import {EdgeLord} from './underworld/EdgeLord';

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

export const HELLAS_AWARDS = [
  new Cultivator(),
  new Magnate(),
  new SpaceBaron(),
  new Excentric(),
  new Contractor(),
];

export const ARES_AWARDS = [
  new Entrepreneur(),
];

export const MOON_AWARDS = [
  new FullMoon(),
  new LunarMagnate(),
];

export const AMAZONIS_PLANITIA_AWARDS = [
  new Curator(),
  new Engineer(),
  new Historian(),
  new Tourist(),
  new Zoologist2(),
];

export const ARABIA_TERRA_AWARDS = [
  new CosmicSettler(),
  new Botanist(),
  new Coordinator(),
  new Zoologist(),
  new Manufacturer(),
];

export const TERRA_CIMMERIA_AWARDS = [
  new Biologist(),
  new Economizer2(),
  new Politician(),
  new Urbanist(),
  new Warmonger(),
];

export const VASTITAS_BOREALIS_AWARDS = [
  new Adapter(),
  new Edgedancer(),
  new Hoarder(),
  new Naturalist(),
  new Voyager(),
];

export const UNDERWORLD_AWARDS = [
  new Kingpin(),
  new EdgeLord(),
];

export const ALL_AWARDS = [
  ...THARSIS_AWARDS,
  ...ELYSIUM_AWARDS,
  ...HELLAS_AWARDS,
  ...VENUS_AWARDS,
  ...ARES_AWARDS,
  ...MOON_AWARDS,
  ...AMAZONIS_PLANITIA_AWARDS,
  ...ARABIA_TERRA_AWARDS,
  ...TERRA_CIMMERIA_AWARDS,
  ...VASTITAS_BOREALIS_AWARDS,
  ...UNDERWORLD_AWARDS,
];

// Remove namespace and rename function
export namespace Awards {
  export const ALL = ALL_AWARDS;

  export function getByName(name: string): IAward {
    const award = ALL_AWARDS.find((a) => a.name === name);
    if (award) {
      return award;
    }
    throw new Error(`Award ${name} not found.`);
  }
}
