import {IPlayer} from './IPlayer';
import {IActionCard, isIActionCard} from './cards/ICard';
import {ICeoCard, isCeoCard} from './cards/ceos/ICeoCard';

export class CeoExtension {
  public static  getUsableOPGCeoCards(player: IPlayer): Array<ICeoCard & IActionCard> {
    const result: Array<ICeoCard & IActionCard> = [];
    for (const card of player.tableau) {
      if (isCeoCard(card) && isIActionCard(card) && card.canAct(player) ) {
        result.push(card);
      }
    }
    return result;
  }
}
