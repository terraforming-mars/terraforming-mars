import {IPlayer} from '@/server/IPlayer';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {CardRequirement} from '@/server/cards/requirements/CardRequirement';
import {RequirementType} from '@/common/cards/RequirementType';

/**
 * Evaluates whether a player is the chairman.
 */
export class ChairmanRequirement extends CardRequirement {
  public readonly type = RequirementType.CHAIRMAN;
  constructor() {
    super({count: 1});
  }
  public satisfies(player: IPlayer) : boolean {
    return Turmoil.getTurmoil(player.game).chairman === player;
  }
}
