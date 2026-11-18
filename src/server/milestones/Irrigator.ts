import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {BoardName} from '../../common/boards/BoardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotUsesBoardGoals} from '@/server/automa/MarsBotMilestoneAwardEval';

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

// Variant from Terra Cimmeria Nova.
export class Coastguard extends Irrigator {
  public readonly automaDescription = '4+ tiles adjacent to ocean';
  public readonly automaMapDescriptions = {
    [BoardName.TERRA_CIMMERIA_NOVA]: '3+ tiles adjacent to ocean',
  };
  constructor() {
    super('Coastguard', 3);
  }

  /**
   * MarsBot keeps the milestone's own 3 tiles on Terra Cimmeria (rulebook C p.9).
   *
   * The Milestones & Awards expansion asks for 4 tiles adjacent to oceans (rulebook C p.13).
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    if (marsBotUsesBoardGoals(marsBot, BoardName.TERRA_CIMMERIA_NOVA)) {
      return this.canClaim(marsBot.player);
    }
    return this.getScore(marsBot.player) >= 4;
  }
}
