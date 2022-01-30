import {IAward} from './IAward';
import {Player} from '../Player';
import {Board} from '../boards/Board';

export class Entrepreneur implements IAward {
    public name: string = 'Entrepreneur';
    public description: string = 'Most tiles that grant adjacency bonuses'
    public getScore(player: Player): number {
      return player.game.board.spaces
        .filter(Board.ownedBy(player))
        .filter((space) => (space.adjacency && space.adjacency.bonus.length > 0)).length;
    }
}
