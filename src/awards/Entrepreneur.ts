import {IAward} from './IAward';
import {Player} from '../Player';

export class Entrepreneur implements IAward {
    public name: string = 'Entrepreneur';
    public description: string = 'Most tiles that grant adjacency bonuses'
    public getScore(player: Player): number {
      return player.game.board.spaces
        .filter((space) => (
          space.player !== undefined &&
              space.player === player &&
              space.adjacency &&
              space.adjacency.bonus.length > 0)).length;
    }
}
