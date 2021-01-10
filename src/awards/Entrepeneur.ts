import {IAward} from './IAward';
import {Player} from '../Player';

// TODO(kberg): write a test.
export class Entrepeneur implements IAward {
    public name: string = 'Entrepeneur';
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
