import {BasePlayerInput} from '../PlayerInput';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {IProjectCard, PlayableCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, IPlayer} from '../IPlayer';
import {InputResponse, isSelectProjectCardToPlayResponse} from '../../common/inputs/InputResponse';
import {CardName} from '../../common/cards/CardName';
import {CanPlayResponse} from '../cards/IProjectCard';
import {YesAnd} from '../cards/requirements/CardRequirement';
import {cardsToModel} from '../models/ModelUtils';
import {SelectProjectCardToPlayModel} from '../../common/models/PlayerInputModel';

export type PlayCardMetadata = {
  reserveUnits: Readonly<Units>;
  details: CanPlayResponse | undefined;
};

export class SelectProjectCardToPlay extends BasePlayerInput<IProjectCard> {
  public cards: Array<IProjectCard> = [];
  public extras: Map<CardName, PlayCardMetadata>;

  constructor(
    private player: IPlayer,
    cards: Array<PlayableCard> = player.getPlayableCards(),
    public config?: {
      action?: CardAction,
    }) {
    super('projectCard', 'Play project card');
    this.buttonLabel = 'Play card';
    this.cards = cards.map((card) => card.card);
    this.extras = new Map(
      cards.map((card) => {
        return [
          card.card.name,
          {
            reserveUnits: card.card.reserveUnits ?
              MoonExpansion.adjustedReserveCosts(player, card.card) :
              Units.EMPTY,
            details: card.details,
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
      microbes: player.getSpendableMicrobes(),
      floaters: player.getSpendableFloaters(),
      paymentOptions: {
        heat: player.canUseHeatAsMegaCredits,
        lunaTradeFederationTitanium: player.canUseTitaniumAsMegacredits,
        plants: player.canUsePlantsAsMegacredits,
      },
      lunaArchivesScience: player.getSpendableLunaArchiveScienceResources(),
      seeds: player.getSpendableSeedResources(),
      graphene: player.getSpendableGraphene(),
      kuiperAsteroids: player.getSpendableKuiperAsteroids(),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectProjectCardToPlayResponse(input)) {
      throw new Error('Not a valid SelectProjectCardToPlayResponse');
    }
    if (!isPayment(input.payment)) {
      throw new Error('payment is not a valid type');
    }

    const card = this.cards.find((card) => card.name === input.card);
    if (card === undefined) {
      throw new Error('Unknown card name ' + input.card);
    }
    const details = this.extras.get(input.card);
    if (details === undefined) {
      throw new Error('Unknown card name ' + input.card);
    }
    // These are not used for safety but do help give a better error message
    // to the user
    const reserveUnits = details.reserveUnits;
    if (reserveUnits.steel + input.payment.steel > this.player.steel) {
      throw new Error(`${reserveUnits.steel} units of steel must be reserved for ${input.card}`);
    }
    if (reserveUnits.titanium + input.payment.titanium > this.player.titanium) {
      throw new Error(`${reserveUnits.titanium} units of titanium must be reserved for ${input.card}`);
    }
    if (reserveUnits.plants + input.payment.plants > this.player.plants) {
      throw new Error(`${reserveUnits.titanium} units of plants must be reserved for ${input.card}`);
    }
    const yesAnd = typeof(details.details) === 'boolean' ? undefined : details.details;
    this.payAndPlay(card, input.payment, yesAnd);
    return undefined;
  }

  public payAndPlay(card: IProjectCard, payment: Payment, yesAnd?: YesAnd) {
    this.player.checkPaymentAndPlayCard(card, payment, this.config?.action);
    if ((yesAnd?.thinkTankResources ?? 0) > 0) {
      const thinkTank = this.player.tableau.find((card) => card.name === CardName.THINK_TANK);
      // TODO(kberg): this processing ought to be done while paying for the card.
      if (thinkTank !== undefined) {
        this.player.removeResourceFrom(thinkTank, yesAnd?.thinkTankResources, {log: true});
      }
    }
    this.cb(card);
  }
}
