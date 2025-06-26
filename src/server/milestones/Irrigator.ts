import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';

export class Irrigator extends BaseMilestone {
  constructor() {
    super(
      'Irrigator',
      'Own 4 tiles adjacent to oceans',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.game.board.spaces.filter((space) =>
      space.player === player &&
     Board.hasRealTile(space) &&
      player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
    ).length;
  }
}
