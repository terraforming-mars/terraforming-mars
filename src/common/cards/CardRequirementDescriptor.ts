import {PartyName} from '../turmoil/PartyName';
import {Tag} from './Tag';
import {Resource} from '../Resource';
import {RequirementType} from './RequirementType';

// const TYPES = ['tag', 'oxygen', 'temperature', 'greeneries', 'cities', 'oceans', 'production', 'venus', 'floaters', 'colonies', 'party', 'chairman', 'partyLeader',
//   'habitatTiles', 'miningTiles', 'roadTiles', 'habitatRate', 'miningRate', 'logisticRate', 'plantsRemove', 'resourceTypes', 'tr'];
// type TagRequirement = {tag: Tag, count?: number};
// type GlobalRequirement = {oxygen: number} | {temperature: number};
// type TileRequirement = {greeneries: number} | {cities: number, nextTo?: boolean, text?: string} | {oceans: number};
// type ProductionRequirement = {production: Resource, count: number};
// type VenusRequirement = {venus: number} | {floaters: number};
// type ColoniesRequirement = {colonies: number};
// type TurmoilRequirement = {party: PartyName} | {chairman: {}} | {partyLeader: number};
// type MoonRequirement = {habitatTiles: number} | {miningTiles: number} | {roadTiles: number} | {habitatRate: number} | {miningRate: number} | {logisticRate: number};
// type MiscRequirement = {plantsRemoved: boolean} | {resourceTypes: number} | {tr: number};
// export type CardRequirementDescriptor =
//   (
//     TagRequirement |
//     GlobalRequirement |
//     TileRequirement |
//     ProductionRequirement |
//     VenusRequirement |
//     ColoniesRequirement |
//     TurmoilRequirement |
//     MoonRequirement |
//     MiscRequirement) & {max?: boolean, all?: boolean}

export type CardRequirementDescriptor = {
  tag?: Tag,
  oxygen?: number,
  temperature?: number,
  greeneries?: number,
  cities?: number,
  oceans?: number,
  production?: Resource,
  plantsRemoved?: boolean,
  resourceTypes?: number,
  tr?: number,

  // Venus
  venus?: number,
  floaters?: number,

  // Colonies
  colonies?: number,

  // Turmoil
  party?: PartyName,
  chairman?: {},
  partyLeader?: number,

  // The Moon
  habitatTiles?: number,
  miningTiles?: number,
  roadTiles?: number,
  habitatRate?: number,
  miningRate?: number,
  logisticRate?: number,

  // Underworld
  // excavation?: number,
  corruption?: number,

  // Adjectives
  count?: number,
  max?: boolean,
  all?: boolean,
  nextTo?: boolean,
  text?: string,
};

export function requirementType(descriptor: CardRequirementDescriptor): RequirementType {
  if (descriptor.tag !== undefined) {
    return RequirementType.TAG;
  } else if (descriptor.oceans !== undefined) {
    return RequirementType.OCEANS;
  } else if (descriptor.oxygen !== undefined) {
    return RequirementType.OXYGEN;
  } else if (descriptor.temperature !== undefined) {
    return RequirementType.TEMPERATURE;
  } else if (descriptor.venus !== undefined) {
    return RequirementType.VENUS;
  } else if (descriptor.tr !== undefined) {
    return RequirementType.TR;
  } else if (descriptor.chairman !== undefined) {
    return RequirementType.CHAIRMAN;
  } else if (descriptor.resourceTypes !== undefined) {
    return RequirementType.RESOURCE_TYPES;
  } else if (descriptor.greeneries !== undefined) {
    return RequirementType.GREENERIES;
  } else if (descriptor.cities !== undefined) {
    return RequirementType.CITIES;
  } else if (descriptor.colonies !== undefined) {
    return RequirementType.COLONIES;
  } else if (descriptor.floaters !== undefined) {
    return RequirementType.FLOATERS;
  } else if (descriptor.partyLeader !== undefined) {
    return RequirementType.PARTY_LEADERS;
  } else if (descriptor.production !== undefined) {
    return RequirementType.PRODUCTION;
  } else if (descriptor.party !== undefined) {
    return RequirementType.PARTY;
  } else if (descriptor.plantsRemoved !== undefined) {
    return RequirementType.REMOVED_PLANTS;
  } else if (descriptor.habitatRate !== undefined) {
    return RequirementType.HABITAT_RATE;
  } else if (descriptor.miningRate !== undefined) {
    return RequirementType.MINING_RATE;
  } else if (descriptor.logisticRate !== undefined) {
    return RequirementType.LOGISTIC_RATE;
  } else if (descriptor.habitatTiles !== undefined) {
    return RequirementType.HABITAT_TILES;
  } else if (descriptor.miningTiles !== undefined) {
    return RequirementType.MINING_TILES;
  } else if (descriptor.roadTiles !== undefined) {
    return RequirementType.ROAD_TILES;
  // } else if (descriptor.excavation !== undefined) {
  //   return RequirementType.EXCAVATION;
  } else if (descriptor.corruption !== undefined) {
    return RequirementType.CORRUPTION;
  } else {
    throw new Error('Unknown requirement: ' + JSON.stringify(descriptor));
  }
}
