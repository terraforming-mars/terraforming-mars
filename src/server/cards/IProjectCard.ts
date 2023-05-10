import {ICard} from './ICard';
import {Player} from '../Player';
import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';
import {CardType} from '../../common/cards/CardType';

export interface IProjectCard extends ICard {
    canPlay: (player: Player) => boolean;
    cost: number;

    // This field serves two purposes:
    // It's used by Robotic Workforce to track production bonuses that are game-specific
    // (Mining Rights, Mining Area, their Ares equivalents, and Pathfinders' Specialized Settlement all apply.)
    //
    // It's also used when rendering the card to indicate which production bonus it might have received, as
    // a visual cue for someone playing Robotic Workforce.
    bonusResource?: Array<Resource>;

    // Represents resources held in reserve when paying for a card.
    // Cards that require a unit of steel while playing, for instance.
    // Added for the expansion The Moon.
    reserveUnits?: Units;
}

export function isIProjectCard(card: ICard): card is IProjectCard {
  return card.type === CardType.AUTOMATED ||
    card.type === CardType.ACTIVE ||
    card.type === CardType.EVENT;
}
