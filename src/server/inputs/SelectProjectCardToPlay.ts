import {Payment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, IPlayer} from '../IPlayer';
import {CardName} from '../../common/cards/CardName';
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
    const additionalProjectCosts = card.additionalProjectCosts;
    if ((additionalProjectCosts?.aeronGenomicsResources ?? 0) > 0) {
      const aeronGenomics = this.player.playedCards.get(CardName.AERON_GENOMICS);
      // TODO(kberg): this processing ought to be done while paying for the card.
      if (aeronGenomics !== undefined) {
        this.player.removeResourceFrom(aeronGenomics, additionalProjectCosts?.aeronGenomicsResources, {log: true});
      }
    }

    if ((additionalProjectCosts?.thinkTankResources ?? 0) > 0) {
      const thinkTank = this.player.playedCards.get(CardName.THINK_TANK);
      // TODO(kberg): this processing ought to be done while paying for the card.
      if (thinkTank !== undefined) {
        this.player.removeResourceFrom(thinkTank, additionalProjectCosts?.thinkTankResources, {log: true});
      }
    }
    this.cb(card);
  }

  protected override validate(): void {
    // No additional validation
  }
}
