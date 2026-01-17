import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {isSpecialTileSpace, Board} from '@/server/boards/Board';

export class LandSpecialist extends BaseMilestone {
  constructor() {
    super(
      'Land Specialist',
      'Own 3 special (normally, brown) tiles',
      3);
  }
  public getScore(player: IPlayer): number {
    const marsSpaces = player.game.board.spaces;
    const marsCount = marsSpaces.filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace).length;

    const moonSpaces = player.game.moonData?.moon.spaces ?? [];
    const moonCount = moonSpaces
      // TODO(kberg): include co-owner.
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace)
      .length;

    return marsCount + moonCount;
  }
}
