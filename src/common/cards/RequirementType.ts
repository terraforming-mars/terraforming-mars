import {match} from 'ts-pattern';
import {GlobalParameter} from '../GlobalParameter';

export enum RequirementType {
    OXYGEN = 'O2',
    TEMPERATURE = 'C',
    OCEANS = 'Ocean',
    TR = 'TR',
    RESOURCE_TYPES = 'Resource type',
    GREENERIES = 'Greenery',
    CITIES = 'City',
    TAG = 'tag',
    PRODUCTION = 'production',
    REMOVED_PLANTS = 'Removed plants',

    // Venus/Colonies
    VENUS = 'Venus',
    COLONIES = 'Colony',
    FLOATERS = 'Floater',

    // Turmoil
    CHAIRMAN = 'Chairman',
    PARTY_LEADERS = 'Party leader',
    PARTY = 'party',

    // The Moon
    HABITAT_RATE = 'Habitat rate',
    MINING_RATE = 'Mining rate',
    LOGISTIC_RATE = 'Logistic rate',
    HABITAT_TILES = 'Habitat tiles',
    MINING_TILES = 'Mine tiles',
    ROAD_TILES = 'Road tiles',

    // Underworld
    EXCAVATION = 'Excavation',
    CORRUPTION = 'Corruption',
}

export function requirementTypeFromGlobalParameter(globalParameter: GlobalParameter): RequirementType {
  return match(globalParameter)
    .with(GlobalParameter.OCEANS, () => RequirementType.OCEANS)
    .with(GlobalParameter.OXYGEN, () => RequirementType.OXYGEN)
    .with(GlobalParameter.TEMPERATURE, () => RequirementType.TEMPERATURE)
    .with(GlobalParameter.VENUS, () => RequirementType.VENUS)
    .with(GlobalParameter.MOON_HABITAT_RATE, () => RequirementType.HABITAT_RATE)
    .with(GlobalParameter.MOON_MINING_RATE, () => RequirementType.MINING_RATE)
    .with(GlobalParameter.MOON_LOGISTICS_RATE, () => RequirementType.LOGISTIC_RATE)
    .exhaustive();
}

export function globalParameterForRequirementType(requirementType: RequirementType): GlobalParameter | null {
  switch (requirementType) {
  case RequirementType.TEMPERATURE:
    return GlobalParameter.TEMPERATURE;
  case RequirementType.OXYGEN:
    return GlobalParameter.OXYGEN;
  case RequirementType.VENUS:
    return GlobalParameter.VENUS;
  case RequirementType.HABITAT_RATE:
    return GlobalParameter.MOON_HABITAT_RATE;
  case RequirementType.MINING_RATE:
    return GlobalParameter.MOON_MINING_RATE;
  case RequirementType.LOGISTIC_RATE:
    return GlobalParameter.MOON_LOGISTICS_RATE;
  default:
    return null;
  }
}
