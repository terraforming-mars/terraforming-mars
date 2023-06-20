import {Resource} from '../../common/Resource';
import {CardAction, IPlayer} from '../IPlayer';
import {IPreludeCard} from '../cards/prelude/IPreludeCard';
import {SelectCard} from '../inputs/SelectCard';

export class PreludesExpansion {
  public static fizzle(player: IPlayer, card: IPreludeCard): void {
    player.game.log('${0} fizzled. ${1} gains 15 M€.', (b) => b.card(card).player(player));
    player.stock.add(Resource.MEGACREDITS, 15);
  }

  public static playPrelude(
    player: IPlayer,
    cards: Array<IPreludeCard>,
    cardAction: CardAction = 'add'): SelectCard<IPreludeCard> {
    // This preps the warning attribute in preludes.
    // All preludes can be presented. Unplayable ones just fizzle.
    for (const card of cards) {
      card.canPlay(player);
    }

    return new SelectCard(
      'Select prelude card to play', 'Play', cards, ([card]) => {
        if (card.canPlay?.(player) === false) {
          PreludesExpansion.fizzle(player, card);
          return undefined;
        } else {
          return player.playCard(card, undefined, cardAction);
        }
      });
  }
}
