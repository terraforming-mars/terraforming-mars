import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {BonusId} from '../../common/turmoil/Types';
import {Bonus} from '../turmoil/Bonus';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';

export class ChoosePolicyBonus extends DeferredAction {
  constructor(
    player: IPlayer,
    public bonuses: Array<Bonus>,
    public bonusCb: (bonusId: BonusId) => void,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute(): PlayerInput {
    const bonusOptions = this.bonuses.map((b) => {
      return new SelectOption(b.description, 'Select')
        .andThen(() => {
          this.bonusCb(b.id);
          return undefined;
        });
    });
    return new OrOptions(...bonusOptions);
  }
}
