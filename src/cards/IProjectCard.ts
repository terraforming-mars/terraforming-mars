import {ICard} from './ICard';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';

export interface IProjectCard extends ICard {
    canPlay?: (player: Player, game: Game) => boolean;
    cost: number;
    hasRequirements?: boolean;
    bonusResource?: Resources | undefined;
}
