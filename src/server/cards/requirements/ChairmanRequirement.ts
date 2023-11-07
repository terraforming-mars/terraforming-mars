import {IPlayer} from '../../IPlayer';
import {Turmoil} from '../../turmoil/Turmoil';
import {CardRequirement} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class ChairmanRequirement extends CardRequirement {
  public readonly type = RequirementType.CHAIRMAN;
  constructor() {
    super({count: 1});
  }
  public satisfies(player: IPlayer) : boolean {
    return Turmoil.getTurmoil(player.game).chairman === player;
  }
}
