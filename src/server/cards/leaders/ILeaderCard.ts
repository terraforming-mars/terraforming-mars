import {ICard} from '../ICard';
import {Player} from '../../Player'
import {CardType} from '../../../common/cards/CardType';

export interface ILeaderCard extends ICard {
  canPlay: (player: Player) => boolean;
  cost: number;
  isDisabled?: boolean;
  opgActionIsActive?: boolean;
  generationUsed?: number;
  onTRIncrease?: (player: Player) => undefined;
}

export function isLeaderCard(card: ICard): card is ILeaderCard {
  return card.cardType === CardType.LEADER;
}
