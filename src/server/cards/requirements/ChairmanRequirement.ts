import {Player} from '../../Player';
import {Turmoil} from '../../turmoil/Turmoil';
import {CardRequirement} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class ChairmanRequirement extends CardRequirement {
  public readonly type = RequirementType.CHAIRMAN;
  constructor() {
    super(0);
  }
  public satisfies(player: Player) : boolean {
    return Turmoil.getTurmoil(player.game).chairman === player.id;
  }
}
