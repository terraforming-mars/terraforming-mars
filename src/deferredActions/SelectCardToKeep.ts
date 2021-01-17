import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction} from './DeferredAction';

export class SelectCardToKeep implements DeferredAction {
  constructor(
        public player: Player,
        public title: string,
        public cards: Array<IProjectCard>,
        public count: number = 1,
  ) {}

  public execute() {
    return new SelectCard(
      this.title,
      'Select',
      this.cards,
      (foundCards: Array<IProjectCard>) => {
        this.player.cardsInHand.push(foundCards[0]);
        this.cards.filter((c) => c !== foundCards[0]).forEach((c) => this.player.game.dealer.discard(c));
        return undefined;
      },
      this.count,
      this.count,
    );
  }
}
