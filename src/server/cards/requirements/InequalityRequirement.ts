import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {CardRequirement, YesAnd} from './CardRequirement';
import {IPlayer} from '../../IPlayer';

export abstract class InequalityRequirement extends CardRequirement implements ICardRequirement {
  public abstract getScore(player: IPlayer): number;

  public satisfies(player: IPlayer, _thinkTankResources: number): boolean | YesAnd {
    const score = this.getScore(player);
    if (this.isMax) {
      return score <= this.amount;
    }
    return score >= this.amount;
  }
}
