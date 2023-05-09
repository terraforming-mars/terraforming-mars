import {Resource} from '../Resource';
import {PartyName} from '../turmoil/PartyName';
import {RequirementType} from './RequirementType';
import {Tag} from './Tag';

export interface ICardRequirement {
  type: RequirementType;
  amount: number;
  isMax: boolean;
  isAny: boolean;
}

export interface IPartyCardRequirement extends ICardRequirement {
  party: PartyName;
}

export interface IProductionCardRequirement extends ICardRequirement {
  resource: Resource;
}

export interface ITagCardRequirement extends ICardRequirement {
  tag: Tag;
}
