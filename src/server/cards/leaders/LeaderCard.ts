import {Player} from '../../Player';
import { IProjectCard} from '../IProjectCard';
// import {ILeaderCard} from './ILeaderCard'
// export abstract class LeaderCard extends Card implements ILeaderCard {
//   isDisabled?: boolean;
//   opgActionIsActive?: boolean;
//   generationUsed?: number;
//   onTRIncrease?: (player: Player) => undefined;
// }

export interface LeaderCard extends IProjectCard {
  isDisabled?: boolean;
  opgActionIsActive?: boolean;
  generationUsed?: number;
  onTRIncrease?: (player: Player) => undefined;
  canAct: (player: Player) => boolean;
}
