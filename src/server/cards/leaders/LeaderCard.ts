import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {ICard} from '../ICard';

export interface LeaderCard extends IProjectCard {
  isDisabled?: boolean;
  opgActionIsActive?: boolean;
  generationUsed?: number;
  onTRIncrease?: (player: Player) => undefined;
  canAct: (player: Player) => boolean;
}

export function isLeaderCard(card: ICard): card is LeaderCard {
  return card.cardType === CardType.LEADER;
}
