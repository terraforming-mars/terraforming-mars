import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {CardRequirement, YesAnd} from './CardRequirement';
import {Player} from '../../Player';

export abstract class InequalityRequirement extends CardRequirement implements ICardRequirement {
  public abstract getScore(player: Player): number;

  public satisfies(player: Player, _thinkTankResources: number): boolean | YesAnd {
    const score = this.getScore(player);
    if (this.isMax) {
      return score <= this.amount;
    }
    return score >= this.amount;
  }
}
