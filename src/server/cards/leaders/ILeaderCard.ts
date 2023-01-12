import {ICard} from '../ICard';
import {Player} from '../../Player';

export interface ILeaderCard extends ICard {
  canPlay(player: Player): boolean;
  cost: number;
  isDisabled?: boolean;
  opgActionIsActive?: boolean;
  generationUsed?: number;
}
