import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';

export interface LeaderCard extends IProjectCard {
  isDisabled?: boolean;
  opgActionIsActive?: boolean;
  generationUsed?: number;
  onTRIncrease?: (player: Player) => undefined;
}
