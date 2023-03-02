import {ICard} from '../cards/ICard';
import {Message} from '../../common/logs/Message';
import {BasePlayerInput, getCardFromPlayerInput, PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {CardName} from '../../common/cards/CardName';
import {InputResponse, isSelectCardResponse} from '../../common/inputs/InputResponse';

export type Options = {
  max: number,
  min: number,
  selectBlueCardAction: boolean, // Default is false. When true, ???
  enabled: Set<CardName>, // When provided, then the cards with false in `enabled` are not selectable and grayed out
  played: boolean | CardName.SELF_REPLICATING_ROBOTS // Default is true. If true, then shows resources on those cards. If false than shows discounted price.
  showOwner: boolean, // Default is false. If true then show the name of the card owner below.
}
export class SelectCard<T extends ICard> extends BasePlayerInput {
  public config: Options;

  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public cards: Array<T>,
    public cb: (cards: Array<T>) => PlayerInput | undefined,
    config?: Partial<Options>,
  ) {
    super(PlayerInputType.SELECT_CARD, title);
    this.config = {
      max: config?.max ?? 1,
      min: config?.min ?? 1,
      selectBlueCardAction: config?.selectBlueCardAction ?? false,
      // if absent, all cards are enabled.
      enabled: config?.enabled ?? new Set(cards.map((c) => c.name)),
      played: config?.played ?? true,
      showOwner: config?.showOwner ?? false,
    };
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse) {
    if (!isSelectCardResponse(input)) {
      throw new Error('Not a valid SelectCardResponse');
    }
    if (input.cards.length < this.config.min) {
      throw new Error('Not enough cards selected');
    }
    if (input.cards.length > this.config.max) {
      throw new Error('Too many cards selected');
    }
    const cards: Array<T> = [];
    for (const cardName of input.cards) {
      const card = getCardFromPlayerInput(this.cards, cardName);
      cards.push(card);
      if (!this.config.enabled.has(cardName)) {
        throw new Error(`${cardName} is not available`);
      }
    }
    return this.cb(cards);
  }
}
