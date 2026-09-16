import {BonusId, PolicyId} from './Types';

export interface IClientAgenda {
  id: BonusId | PolicyId;
  description: string;
}
