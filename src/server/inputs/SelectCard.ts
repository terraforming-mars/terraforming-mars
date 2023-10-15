import {ICard} from '../cards/ICard';
import {Message} from '../../common/logs/Message';
import {getCardFromPlayerInput} from '../PlayerInput';
import {BasePlayerInput} from '../PlayerInput';
import {CardName} from '../../common/cards/CardName';
import {InputResponse, isSelectCardResponse} from '../../common/inputs/InputResponse';
import {SelectCardModel} from '../../common/models/PlayerInputModel';
import {IPlayer} from '../IPlayer';
import {cardsToModel} from '../models/ModelUtils';

export type Options = {
  max: number,
  min: number,
  selectBlueCardAction: boolean, // Default is false. When true, ???
  enabled: Array<boolean> | undefined, // When provided, then the cards with false in `enabled` are not selectable and grayed out
  played: boolean | CardName.SELF_REPLICATING_ROBOTS // Default is true. If true, then shows resources on those cards. If false than shows discounted price.
  showOwner: boolean, // Default is false. If true then show the name of the card owner below.
}
export class SelectCard<T extends ICard> extends BasePlayerInput<Array<T>> {
  public config: Options;

  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public cards: ReadonlyArray<T>,
    config?: Partial<Options>,
  ) {
    super('card', title);
    this.config = {
      max: config?.max ?? 1,
      min: config?.min ?? 1,
      selectBlueCardAction: config?.selectBlueCardAction ?? false,
      enabled: config?.enabled,
      played: config?.played ?? true,
      showOwner: config?.showOwner ?? false,
    };
    this.buttonLabel = buttonLabel;
  }

  public toModel(player: IPlayer): SelectCardModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'card',
      cards: cardsToModel(player, this.cards, {
        showCalculatedCost: this.config.played === false || this.config.played === CardName.SELF_REPLICATING_ROBOTS,
        showResources: this.config.played === true || this.config.played === CardName.SELF_REPLICATING_ROBOTS,
        enabled: this.config.enabled,
      }),
      max: this.config.max,
      min: this.config.min,
      showOnlyInLearnerMode: this.config.enabled?.every((p: boolean) => p === false) ?? false,
      selectBlueCardAction: this.config.selectBlueCardAction,
      showOwner: this.config.showOwner === true,
    };
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
      const {card, idx} = getCardFromPlayerInput(this.cards, cardName);
      cards.push(card);
      if (this.config.enabled?.[idx] === false) {
        throw new Error(`${cardName} is not available`);
      }
    }
    return this.cb(cards);
  }
}
