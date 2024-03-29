import {BasePlayerInput} from '../PlayerInput';
import {isPayment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {CardAction, IPlayer} from '../IPlayer';
import {InputResponse, isSelectProjectCardToPlayResponse} from '../../common/inputs/InputResponse';
import {cardsToModel} from '../models/ModelUtils';
import {SelectProjectCardToPlayModel} from '../../common/models/PlayerInputModel';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';

export class SelectProjectCardToPlay extends BasePlayerInput<IProjectCard> {
  constructor(
    private player: IPlayer,
    public cards: Array<IProjectCard> = player.getPlayableCards(),
    public config?: {
      action?: CardAction,
    }) {
    super('projectCard', 'Play project card');
    this.buttonLabel = 'Play card';
  }

  public toModel(player: IPlayer): SelectProjectCardToPlayModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'projectCard',
      cards: cardsToModel(player, this.cards, {showCalculatedCost: true}),
      microbes: player.getSpendable('microbes'),
      floaters: player.getSpendable('floaters'),
      paymentOptions: {
        heat: player.canUseHeatAsMegaCredits,
        lunaTradeFederationTitanium: player.canUseTitaniumAsMegacredits,
        plants: player.canUsePlantsAsMegacredits,
        corruption: player.canUseCorruptionAsMegacredits,
      },
      lunaArchivesScience: player.getSpendable('lunaArchivesScience'),
      seeds: player.getSpendable('seeds'),
      graphene: player.getSpendable('graphene'),
      kuiperAsteroids: player.getSpendable('kuiperAsteroids'),
      corruption: player.underworldData.corruption,
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
    // These are not used for safety but do help give a better error message
    // to the user
    const reserveUnits = card.reserveUnits ? MoonExpansion.adjustedReserveCosts(this.player, card) : Units.EMPTY;
    if (reserveUnits.steel + input.payment.steel > this.player.steel) {
      throw new Error(`${reserveUnits.steel} units of steel must be reserved for ${input.card}`);
    }
    if (reserveUnits.titanium + input.payment.titanium > this.player.titanium) {
      throw new Error(`${reserveUnits.titanium} units of titanium must be reserved for ${input.card}`);
    }
    if (reserveUnits.plants + input.payment.plants > this.player.plants) {
      throw new Error(`${reserveUnits.titanium} units of plants must be reserved for ${input.card}`);
    }
    this.player.checkPaymentAndPlayCard(card, input.payment, this.config?.action);
    this.cb(card);
    return undefined;
  }
}
