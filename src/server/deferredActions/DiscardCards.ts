import {IPlayer} from '../IPlayer';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from './DeferredAction';
import {Message} from '../../common/logs/Message';
import {newMessage} from '../logs/MessageBuilder';
import {IProjectCard} from '../cards/IProjectCard';

export class DiscardCards extends DeferredAction<Array<IProjectCard>> {
  constructor(
    player: IPlayer,
    public min: number = 1,
    public max: number = 1,
    public title?: string | Message,
  ) {
    super(player, Priority.DISCARD_CARDS);
  }

  public execute() {
    if (this.player.cardsInHand.length <= this.min) {
      const discards = [...this.player.cardsInHand];
      for (const card of discards) {
        this.player.discardCardFromHand(card);
      }
      this.cb(discards);
      return undefined;
    }

    let title: string | Message | undefined = this.title;
    if (title === undefined) {
      if (this.min === this.max) {
        title = 'Select ' + this.min + ' card' + (this.min > 1 ? 's' : '') + ' to discard';
      } else {
        title = newMessage('Select between ${0} and ${1} cards to discard', (b) => b.number(this.min).number(this.max));
      }
    }
    return new SelectCard(
      title,
      'Discard',
      this.player.cardsInHand,
      (discards) => {
        for (const card of discards) {
          this.player.discardCardFromHand(card);
        }
        this.cb(discards);
        return undefined;
      },
      {min: this.min, max: this.max},
    );
  }
}
