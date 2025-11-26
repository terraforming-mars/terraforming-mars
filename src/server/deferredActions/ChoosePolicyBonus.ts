import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {BonusId} from '@/common/turmoil/Types';
import {IBonus} from '@/server/turmoil/Bonus';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';

export class ChoosePolicyBonus extends DeferredAction {
  constructor(
    player: IPlayer,
    public bonuses: Array<IBonus>,
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
