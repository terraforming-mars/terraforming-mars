import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace, Board} from '../../boards/Board';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class LandSpecialist extends BaseMilestone {
  public readonly automaDescription = '3+ bonus cards destroyed';
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
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace)
      .length;

    return marsCount + moonCount;
  }

  /** MarsBot needs 3 destroyed bonus cards (rulebook C p.10, which calls it Specialist). */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.destroyedBonusCards >= 3;
  }
}
