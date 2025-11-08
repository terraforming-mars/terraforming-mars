import {ICard} from '../cards/ICard';
import {Message} from '../../common/logs/Message';
import {getCardFromPlayerInput} from '../PlayerInput';
import {BasePlayerInput} from '../PlayerInput';
import {CardName} from '../../common/cards/CardName';
import {InputResponse, isSelectCardResponse, SelectCardResponse} from '../../common/inputs/InputResponse';
import {SelectCardModel} from '../../common/models/PlayerInputModel';
import {IPlayer} from '../IPlayer';
import {cardsToModel} from '../models/ModelUtils';
import {InputError} from './InputError';
import { CardModel } from '@/common/models/CardModel';
import { inplaceShuffle } from '../utils/shuffle';
import { Random } from '@/common/utils/Random';

export type Options = {
  max: number,
  min: number,
  /** Default is false. When true, ??? */
  selectBlueCardAction: boolean,
  /** When provided, then the cards with false in `enabled` are not selectable and grayed out */
  enabled: ReadonlyArray<boolean> | undefined,
  /** Default is true. If true, then shows resources on those cards. If false than shows discounted price. */
  played: boolean | CardName.SELF_REPLICATING_ROBOTS
  /** Default is false. If true then show the name of the card owner below. */
  showOwner: boolean,
}
export class SelectCard<T extends ICard> extends BasePlayerInput<ReadonlyArray<T>> {
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
      throw new InputError('Not a valid SelectCardResponse');
    }
    if (input.cards.length < this.config.min) {
      throw new InputError('Not enough cards selected');
    }
    if (input.cards.length > this.config.max) {
      throw new InputError('Too many cards selected');
    }
    const cards = [];
    for (const cardName of input.cards) {
      const {card, idx} = getCardFromPlayerInput(this.cards, cardName);
      cards.push(card);
      if (this.config.enabled?.[idx] === false) {
        throw new InputError(`${cardName} is not available`);
      }
    }
    return this.cb(cards);
  }

  public getActionable(p: IPlayer): CardModel[] {
    return this.toModel(p).cards.filter(c => !c.isDisabled);
  }

  public getActionSpace(p: IPlayer, rand: Random): { label: string, input: SelectCardResponse}[] {
    // This is used for multiple purposes, e.g. selecting a standard project, selecting cards to buy
    // If selling patents, 
    if (this.config.min > 1) {
      // If the configuration has a minimum of more than 1, then just make a random selection
      // Otherwise, we need to combinatorically compute all the possible selection sets
      return [this.getRandomSelection(p, rand)];
    } else if (this.config.max === 0) {
      // Can't pick any cards
      return [{ label: this.title as string, input: { type: 'card', cards: [] }}];
    } else {
      // Otherwise, make each card a distinct choice
      return this.getActionable(p).map(c => {
        return {label: this.title + ' ' + c.name, input: {type: "card", cards: [c.name] }};
      });
    }
  }

  public getRandomSelection(p: IPlayer, rand: Random): { label: string, input: SelectCardResponse} {
    const cards = this.getActionable(p);
    inplaceShuffle(cards, rand);
    // select a random number of cards
    const range = this.config.max - this.config.min;
    const numToPick = rand.nextInt(range + 1) + this.config.min;
    return { label: '', input: {type: 'card', cards: cards.slice(0, numToPick).map(c => c.name)}};
  }
}
