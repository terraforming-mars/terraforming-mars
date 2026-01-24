import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';

export class PolarExplorer extends BaseMilestone {
  constructor() {
    super(
      'Polar Explorer',
      'Own 3 tiles on the two bottom rows',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.y >= 7 && space.y <= 8).length;
  }
}

