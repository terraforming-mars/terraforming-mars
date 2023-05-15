import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {CardRequirement} from './CardRequirement';
import {Player} from '../../Player';

export abstract class InequalityRequirement extends CardRequirement implements ICardRequirement {
  public abstract getScore(player: Player): number;

  public satisfies(player: Player): boolean {
    const score = this.getScore(player);
    if (this.isMax) {
      return score <= this.amount;
    }
    return score >= this.amount;
  }
}
