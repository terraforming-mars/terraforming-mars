import {IPlayer} from '../IPlayer';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from './DeferredAction';

export class DiscardCards extends DeferredAction {
  constructor(
    player: IPlayer,
    public count: number = 1,
    public title: string = 'Select ' + count + ' card' + (count > 1 ? 's' : '') + ' to discard',
  ) {
    super(player, Priority.DISCARD_CARDS);
  }

  public execute() {
    if (this.player.cardsInHand.length <= this.count) {
      for (const card of [...this.player.cardsInHand]) {
        this.player.discardCardFromHand(card);
      }
      return undefined;
    }
    return new SelectCard(
      this.title,
      'Discard',
      this.player.cardsInHand,
      (cards) => {
        for (const card of cards) {
          this.player.discardCardFromHand(card);
        }
        return undefined;
      },
      {min: this.count, max: this.count},
    );
  }
}
