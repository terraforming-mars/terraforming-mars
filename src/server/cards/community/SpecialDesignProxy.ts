import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {ProxyCard} from '../ProxyCard';

/**
 * A special use card that stands in when Playwrights reactivates Special Design.
 *
 * Since Special Design can't sit in the game, this proxy card takes care of it.
 */
export class SpecialDesignProxy extends ProxyCard {
  constructor() {
    super(CardName.SPECIAL_DESIGN_PROXY);
  }
  public override getGlobalParameterRequirementBonus(player: IPlayer) {
    // NOTE: normally code looks like 'if player.lastCardPlayed === this.name` but
    // not in this case.
    if (player.lastCardPlayed === CardName.SPECIAL_DESIGN) {
      return 2;
    }
    return 0;
  }
}
