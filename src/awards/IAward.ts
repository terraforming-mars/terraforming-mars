import {Player} from '../Player';
import {Game} from '../Game';

export interface IAward {
    name: string;
    description: string;
    getScore: (player: Player, game: Game) => number;
}
