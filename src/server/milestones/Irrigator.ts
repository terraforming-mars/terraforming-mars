import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {MilestoneName} from '@/common/ma/MilestoneName';

export class Irrigator extends BaseMilestone {
  constructor(
    name: MilestoneName = 'Irrigator',
    threshold: number = 4) {
    super(name, `Own ${threshold} tiles adjacent to oceans`, threshold);
  }

  public getScore(player: IPlayer): number {
    return player.game.board.spaces.filter((space) =>
      space.player === player &&
     Board.hasRealTile(space) &&
      player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
    ).length;
  }
}

// Variant from Terra Cimmeria Novus.
export class Coastguard extends Irrigator {
  constructor() {
    super('Coastguard', 3);
  }
}
