import {Payment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, IPlayer} from '../IPlayer';
import {Message} from '../../common/logs/Message';
import {SelectCardToPlay} from './SelectCardToPlay';

export class SelectProjectCardToPlay extends SelectCardToPlay<IProjectCard> {
  constructor(
    player: IPlayer,
    cards: Array<IProjectCard> = player.getPlayableCards(),
    config?: {
      action?: CardAction,
      enabled?: ReadonlyArray<boolean>,
      title?: string | Message,
      buttonLabel?: string,
    }) {
    super(player, cards, config);
    this.extras = new Map(
      cards.map((card) => {
        return [
          card.name,
          {
            reserveUnits: card.reserveUnits ?
              MoonExpansion.adjustedReserveCosts(player, card) :
              Units.EMPTY,
          },
        ];
      }));
  }

  // Public for tests
  public payAndPlay(card: IProjectCard, payment: Payment) {
    this.player.checkPaymentAndPlayCard(card, payment, this.config?.action);
    this.cb(card);
  }

  protected override validate(): void {
    // No additional validation
  }
}
