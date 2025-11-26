import {IPlayer} from '@/server/IPlayer';
import {isCeoCard} from '@/server/cards/ceos/ICeoCard';

export class CeoExtension {
  public static ceoActionIsUsable(player: IPlayer): boolean {
    // If _at least_ one CEO has usable actions, return true
    return player.playedCards.some((card) => isCeoCard(card) && card.canAct(player));
  }
}
