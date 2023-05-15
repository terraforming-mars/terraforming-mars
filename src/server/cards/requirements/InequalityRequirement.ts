import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {CardRequirement} from './CardRequirement';
import {Player} from '../../Player';

export abstract class InequalityRequirement extends CardRequirement implements ICardRequirement {
  public satisfies(player: Player): boolean {
    return this.satisfiesInequality(this.getScore(player));
  }

  protected satisfiesInequality(calculated: number) : boolean {
    if (this.isMax) {
      return calculated <= this.amount;
    }
    return calculated >= this.amount;
  }

  public abstract getScore(player: Player): number;
}
