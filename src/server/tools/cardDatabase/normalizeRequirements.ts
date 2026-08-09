import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';
import {Requirement, RequirementType} from './CardDatabaseTypes';

/**
 * Requirement keys that hold a plain number, mapped to the name used in the
 * exported database.
 */
const SCALAR_REQUIREMENTS = {
  oxygen: 'oxygen',
  temperature: 'temperature',
  oceans: 'oceans',
  greeneries: 'greeneries',
  cities: 'cities',
  venus: 'venus',
  tr: 'tr',
  resourceTypes: 'resource_types',
  colonies: 'colonies',
  floaters: 'floaters',
  partyLeader: 'party_leaders',
  habitatTiles: 'habitat_tiles',
  miningTiles: 'mining_tiles',
  roadTiles: 'road_tiles',
  habitatRate: 'habitat_rate',
  miningRate: 'mining_rate',
  logisticRate: 'logistic_rate',
  undergroundTokens: 'underground_tokens',
  corruption: 'corruption',
} as const satisfies Partial<Record<keyof CardRequirementDescriptor, RequirementType>>;

function bound(value: number, isMax: boolean | undefined): {min: number} | {max: number} {
  return isMax === true ? {max: value} : {min: value};
}

function core(descriptor: CardRequirementDescriptor): Requirement {
  if (descriptor.tag !== undefined) {
    return {type: 'tag', tag: descriptor.tag, ...bound(descriptor.count ?? 1, descriptor.max)};
  }
  if (descriptor.production !== undefined) {
    return {type: 'production', resource: descriptor.production, ...bound(descriptor.count ?? 1, descriptor.max)};
  }
  if (descriptor.plantsRemoved !== undefined) {
    return {type: 'removed_plants', min: 1};
  }
  for (const key of Object.keys(SCALAR_REQUIREMENTS) as Array<keyof typeof SCALAR_REQUIREMENTS>) {
    const value = descriptor[key];
    if (typeof value === 'number') {
      return {type: SCALAR_REQUIREMENTS[key], ...bound(value, descriptor.max)};
    }
  }
  throw new Error('Unsupported requirement: ' + JSON.stringify(descriptor));
}

/** Translates the game's card requirements into the exported database's form. */
export function normalizeRequirements(descriptors: ReadonlyArray<CardRequirementDescriptor>): Array<Requirement> {
  return descriptors.map((descriptor) => {
    const requirement = core(descriptor);
    if (descriptor.all === true) {
      requirement.scope = 'any_player';
    }
    if (descriptor.nextTo === true) {
      requirement.next_to = true;
    }
    if (descriptor.text !== undefined) {
      requirement.text = descriptor.text;
    }
    return requirement;
  });
}
