import {inplaceRemove} from '../../common/utils/utils';
import {ICeoCard} from '../cards/ceos/ICeoCard';
import {SelectCard} from '../inputs/SelectCard';
import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export class DrawCeoCardFromDeck extends DeferredAction<ICeoCard | undefined> {
  private count: number;
  constructor(player: IPlayer, count: number) {
    super(player, Priority.DEFAULT);
    this.count = count;
  }

  public execute() {
    const game = this.player.game;
    const cards = game.ceoDeck.drawN(game, this.count);
    const playableCards = cards.filter((card) => {
      if (card.canPlay?.(this.player) === true) {
        return true;
      }
      this.player.game.ceoDeck.discard(card);
      // TODO(kberg): rewrite to "Discarding ${1} as you could not play it."
      game.log('${0} was discarded as ${1} could not play it.', (b) => b.card(card).player(this.player), {reservedFor: this.player});
      return false;
    });

    if (playableCards.length === 0) {
      game.log('${0} drew no playable CEO cards', (b) => b.player(this.player));
      this.cb(undefined);
      return;
    }
    return new SelectCard('Choose CEO card', 'Take', playableCards)
      .andThen(([card]) => {
        // Discard unselected CEOs
        inplaceRemove(playableCards, card);
        game.ceoDeck.discard(...playableCards);

        this.cb(card);
        return undefined;
      });
  }
}
