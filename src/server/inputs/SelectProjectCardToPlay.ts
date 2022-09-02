import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {jsonToPayment, Payment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, Player} from '../Player';
import {InputResponse} from '../../common/inputs/InputResponse';

export class SelectProjectCardToPlay implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY;
  public title = 'Play project card';
  public buttonLabel: string = 'Play card';
  public reserveUnits: Array<Units>;

  constructor(
    private player: Player,
    public cards: Array<IProjectCard> = player.getPlayableCards(),
    public config?: {
      action?: CardAction,
      cb?: (cardToPlay: IProjectCard) => void,
    }) {
    this.reserveUnits = this.cards.map((card) => {
      return card.reserveUnits ? MoonExpansion.adjustedReserveCosts(player, card) : Units.EMPTY;
    });
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 2);
    const cardName = input[0][0];
    const cardData = PlayerInput.getCard(this.cards, cardName);
    const card: IProjectCard = cardData.card;
    const payment: Payment = jsonToPayment(input[0][1]);
    const reserveUnits = this.reserveUnits[cardData.idx];
    // These are not used for safety but do help give a better error message
    // to the user
    if (reserveUnits.steel + payment.steel > player.steel) {
      throw new Error(`${reserveUnits.steel} units of steel must be reserved for ${cardName}`);
    }
    if (reserveUnits.titanium + payment.titanium > player.titanium) {
      throw new Error(`${reserveUnits.titanium} units of titanium must be reserved for ${cardName}`);
    }
    this.cb(card, payment);
    return undefined;
  }

  // To fullfil PlayerInput.
  public cb(card: IProjectCard, payment: Payment) {
    this.player.checkPaymentAndPlayCard(card, payment, this.config?.action);
    this.config?.cb?.(card);
    return undefined;
  }
}
