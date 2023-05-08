import {Player} from './Player';
import {isCeoCard} from './cards/ceos/ICeoCard';
import {CardName} from '../common/cards/CardName';

export class CeoExtension {
  public static getBonusWildTags(player: Player) {
    const xavier = player.getCeo(CardName.XAVIER);
    return xavier?.opgActionIsActive === true ? 2 : 0;
  }

  public static ceoActionIsUsable(player: Player): boolean {
    for (const card of player.playedCards) {
      if (isCeoCard(card)) {
        return card.canAct(player);
      }
    }
    return false;
  }
}
