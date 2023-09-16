import {RequirementType} from './RequirementType';

export interface ICardRequirement {
  type: RequirementType;
  count: number;
  max: boolean;
  all: boolean;
  nextTo: boolean;
}
