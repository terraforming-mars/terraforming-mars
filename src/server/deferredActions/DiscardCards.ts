import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from './DeferredAction';

export class DiscardCards extends DeferredAction {
  constructor(
    player: Player,
    public count: number = 1,
    public title: string = 'Select ' + count + ' card' + (count > 1 ? 's' : '') + ' to discard',
  ) {
    super(player, Priority.DISCARD_CARDS);
  }

  public execute() {
    if (this.player.cardsInHand.length <= this.count) {
      const cards = this.player.cardsInHand.splice(0, this.player.cardsInHand.length);
      cards.forEach((card) => this.player.game.projectDeck.discard(card));
      return undefined;
    }
    return new SelectCard(
      this.title,
      'Discard',
      this.player.cardsInHand,
      (cards) => {
        for (const card of cards) {
          this.player.cardsInHand.splice(this.player.cardsInHand.indexOf(card), 1);
          this.player.game.projectDeck.discard(card);
        }
        return undefined;
      },
      {min: this.count, max: this.count},
    );
  }
}
