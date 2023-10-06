import {inplaceRemove} from '../../common/utils/utils';
import {Resource} from '../../common/Resource';
import {CardAction, IPlayer} from '../IPlayer';
import {IPreludeCard} from '../cards/prelude/IPreludeCard';
import {SelectCard} from '../inputs/SelectCard';
import {SimpleDeferredAction} from '../deferredActions/DeferredAction';

export class PreludesExpansion {
  public static fizzle(player: IPlayer, card: IPreludeCard): void {
    player.game.log('${0} fizzled. ${1} gains 15 M€.', (b) => b.card(card).player(player));
    player.stock.add(Resource.MEGACREDITS, 15);
    player.game.defer(new SimpleDeferredAction(player, () => {
      // This is deferred because it is possible for the parent card to
      // be moved from hand to play area. So, wait until this action finishes and
      // then follow up with cleanup.
      inplaceRemove(player.preludeCardsInHand, card);
      inplaceRemove(player.playedCards, card);
      return undefined;
    }));
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
      'Select prelude card to play', 'Play', cards)
      .andThen(([card]) => {
        if (card.canPlay?.(player) === false) {
          PreludesExpansion.fizzle(player, card);
          return undefined;
        } else {
          return player.playCard(card, undefined, cardAction);
        }
      });
  }
}
