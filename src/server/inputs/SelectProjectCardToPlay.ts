import {BasePlayerInput} from '../PlayerInput';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, IPlayer} from '../IPlayer';
import {InputResponse, isSelectProjectCardToPlayResponse} from '../../common/inputs/InputResponse';
import {CardName} from '../../common/cards/CardName';
import {cardsToModel} from '../models/ModelUtils';
import {SelectProjectCardToPlayModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';

export type PlayCardMetadata = {
  reserveUnits: Readonly<Units>;
};

export class SelectProjectCardToPlay extends BasePlayerInput<IProjectCard> {
  public cards: Array<IProjectCard> = [];
  public extras: Map<CardName, PlayCardMetadata>;

  constructor(
    private player: IPlayer,
    cards: Array<IProjectCard> = player.getPlayableCards(),
    public config?: {
      action?: CardAction,
    }) {
    super('projectCard', 'Play project card');
    this.buttonLabel = 'Play card';
    this.cards = cards.map((card) => card);
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

  public toModel(player: IPlayer): SelectProjectCardToPlayModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'projectCard',
      cards: cardsToModel(player, this.cards, {showCalculatedCost: true, extras: this.extras}),
      microbes: player.getSpendable('microbes'),
      floaters: player.getSpendable('floaters'),
      paymentOptions: {
        heat: player.canUseHeatAsMegaCredits,
        lunaTradeFederationTitanium: player.canUseTitaniumAsMegacredits,
        plants: player.canUsePlantsAsMegacredits,
      },
      lunaArchivesScience: player.getSpendable('lunaArchivesScience'),
      seeds: player.getSpendable('seeds'),
      graphene: player.getSpendable('graphene'),
      kuiperAsteroids: player.getSpendable('kuiperAsteroids'),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectProjectCardToPlayResponse(input)) {
      throw new InputError('Not a valid SelectProjectCardToPlayResponse');
    }
    if (!isPayment(input.payment)) {
      throw new InputError('payment is not a valid type');
    }

    const card = this.cards.find((card) => card.name === input.card);
    if (card === undefined) {
      throw new InputError('Unknown card name ' + input.card);
    }
    const details = this.extras.get(input.card);
    if (details === undefined) {
      throw new InputError('Unknown card name ' + input.card);
    }
    // These are not used for safety but do help give a better error message
    // to the user
    const reserveUnits = details.reserveUnits;
    if (reserveUnits.steel + input.payment.steel > this.player.steel) {
      throw new InputError(`${reserveUnits.steel} units of steel must be reserved for ${input.card}`);
    }
    if (reserveUnits.titanium + input.payment.titanium > this.player.titanium) {
      throw new InputError(`${reserveUnits.titanium} units of titanium must be reserved for ${input.card}`);
    }
    if (reserveUnits.plants + input.payment.plants > this.player.plants) {
      throw new InputError(`${reserveUnits.titanium} units of plants must be reserved for ${input.card}`);
    }
    this.payAndPlay(card, input.payment);
    return undefined;
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
}
