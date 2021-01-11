import {Game} from '../Game';
import {LogHelper} from '../LogHelper';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction} from './DeferredAction';

export class DrawCards implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public count: number = 1,
        public tag?: Tags,
  ) {}

  public execute() {
    const drawnCards: Array<IProjectCard> = [];

    if (this.tag !== undefined) {
      // Reveal cards from the deck until |this.count| of a specific tag have be drawn
      drawnCards.push(...this.game.drawCardsByTag(this.tag, this.count));
      LogHelper.logDrawnCards(this.player, drawnCards);
    } else {
      // Draw |this.count| cards from the deck
      for (let i = 0; i < this.count; i++) {
        drawnCards.push(this.game.dealer.dealCard());
      }
      this.game.log('${0} drew ${1} card(s)', (b) => b.player(this.player).number(this.count));
    }

    // Add the cards to the player's hand
    this.player.cardsInHand.push(...drawnCards);
    return undefined;
  }
}
