import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {ProxyCard} from '../ProxyCard';

export class SpecialDesignProxy extends ProxyCard {
  constructor() {
    super(CardName.SPECIAL_DESIGN_PROXY);
  }
  public getRequirementBonus(player: IPlayer) {
    // NOTE: normally code looks like 'if player.lastCardPlayed === this.name` but
    // not in this case.
    if (player.lastCardPlayed === CardName.SPECIAL_DESIGN) {
      return 2;
    }
    return 0;
  }
}
