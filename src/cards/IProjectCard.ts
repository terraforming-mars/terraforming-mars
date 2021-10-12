import {ICard} from './ICard';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {Units} from '../Units';

export interface IProjectCard extends ICard {
    canPlay: (player: Player) => boolean;
    cost: number;

    // A field dedicated to Robotic Workforce which tracks whether a card has an additional production
    // bonus besides the obvious ones printed on the card. Mining Rights and Mining Area are the only
    // two that use this field at the time (though don't expect this comment to be kept up to date if
    // that changes.)
    bonusResource?: Array<Resources>;

    // Represents resources held in reserve when paying for a card.
    // Cards that require a unit of steel while playing, for instance.
    // Added for the expansion The Moon.
    reserveUnits?: Units;
}
