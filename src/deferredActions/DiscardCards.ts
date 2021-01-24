import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction, Priority} from './DeferredAction';

export class DiscardCards implements DeferredAction {
  public priority = Priority.DISCARD_CARDS;
  constructor(
        public player: Player,
        public count: number = 1,
        public title: string = 'Select ' + count + ' card' + (count > 1 ? 's' : '') + ' to discard',
  ) {}

  public execute() {
    if (this.player.cardsInHand.length <= this.count) {
      const cards = this.player.cardsInHand.splice(0, this.player.cardsInHand.length);
      cards.forEach((card) => this.player.game.dealer.discard(card));
      return undefined;
    }
    return new SelectCard(
      this.title,
      'Discard',
      this.player.cardsInHand,
      (foundCards: Array<IProjectCard>) => {
        for (const card of foundCards) {
          this.player.cardsInHand.splice(this.player.cardsInHand.indexOf(card), 1);
          this.player.game.dealer.discard(card);
        }
        return undefined;
      },
      this.count,
      this.count,
    );
  }
}
