import {CardRequirement, YesAnd} from './CardRequirement';
import {IPlayer} from '../../IPlayer';

export abstract class InequalityRequirement extends CardRequirement {
  public abstract getScore(player: IPlayer): number;

  public satisfies(player: IPlayer, _thinkTankResources: number): boolean | YesAnd {
    const score = this.getScore(player);
    if (this.max) {
      return score <= this.count;
    }
    return score >= this.count;
  }
}
