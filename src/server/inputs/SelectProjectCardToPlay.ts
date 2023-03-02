import {BasePlayerInput, getCardFromPlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, Player} from '../Player';
import {InputResponse, isSelectProjectCardToPlayResponse} from '../../common/inputs/InputResponse';
import {CardName} from '../../common/cards/CardName';

export class SelectProjectCardToPlay extends BasePlayerInput {
  public reserveUnits: Map<CardName, Units>;

  constructor(
    private player: Player,
    public cards: Array<IProjectCard> = player.getPlayableCards(),
    public config?: {
      action?: CardAction,
      cb?: (cardToPlay: IProjectCard) => void,
    }) {
    super(PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY, 'Play project card');
    this.buttonLabel = 'Play card';
    this.reserveUnits = new Map();
    this.cards.forEach((card) => {
      this.reserveUnits.set(card.name, card.reserveUnits ? MoonExpansion.adjustedReserveCosts(player, card) : Units.EMPTY);
    });
  }

  public process(input: InputResponse) {
    if (!isSelectProjectCardToPlayResponse(input)) {
      throw new Error('Not a valid SelectProjectCardToPlayResponse');
    }
    if (!isPayment(input.payment)) {
      throw new Error('payment is not a valid type');
    }
    const cardName = input.card;
    const card = getCardFromPlayerInput(this.cards, cardName);
    const reserveUnits = this.reserveUnits.get(cardName);
    if (reserveUnits === undefined) {
      throw new Error(`reserve units not found for ${cardName}`);
    }

    // These are not used for safety but do help give a better error message
    // to the user
    if (reserveUnits.steel + input.payment.steel > this.player.steel) {
      throw new Error(`${reserveUnits.steel} units of steel must be reserved for ${input.card}`);
    }
    if (reserveUnits.titanium + input.payment.titanium > this.player.titanium) {
      throw new Error(`${reserveUnits.titanium} units of titanium must be reserved for ${input.card}`);
    }
    this.cb(card, input.payment);
    return undefined;
  }

  // To fullfil PlayerInput.
  public cb(card: IProjectCard, payment: Payment) {
    this.player.checkPaymentAndPlayCard(card, payment, this.config?.action);
    this.config?.cb?.(card);
    return undefined;
  }
}
