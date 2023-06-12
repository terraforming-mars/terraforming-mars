import {IPlayer} from './IPlayer';
import {isCeoCard} from './cards/ceos/ICeoCard';
import {CardName} from '../common/cards/CardName';

export class CeoExtension {
  public static getBonusWildTags(player: IPlayer) {
    const xavier = player.getCeo(CardName.XAVIER);
    return xavier?.opgActionIsActive === true ? 2 : 0;
  }

  public static ceoActionIsUsable(player: IPlayer): boolean {
    // If _at least_ one CEO has usable actions, return true
    return player.playedCards.some((card) => isCeoCard(card) && card.canAct(player));
  }
}
