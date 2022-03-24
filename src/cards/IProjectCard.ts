import {ICard} from './ICard';
import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {Units} from '../common/Units';

export interface IProjectCard extends ICard {
    canPlay: (player: Player) => boolean;
    cost: number;

    // This field serves two purposes:
    // It's used by Robotic Workforce to track production bonuses that are game-specific
    // (Mining Rights, Mining Area, their Ares equivalents, and Pathfinders' Specialized Settlement all apply.)
    //
    // It's also used when rendering the card to indicate which production bonus it might have received, as
    // a visual cue for someone playing Robotic Workforce.
    bonusResource?: Array<Resources>;

    // Represents resources held in reserve when paying for a card.
    // Cards that require a unit of steel while playing, for instance.
    // Added for the expansion The Moon.
    reserveUnits?: Units;
}
