import {ICard} from '../cards/ICard';
import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {CardName} from '../../common/cards/CardName';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export type Options = {
  max: number,
  min: number,
  selectBlueCardAction: boolean, // Default is false. When true, ???
  enabled: Array<boolean> | undefined, // When provided, then the cards with false in `enabled` are not selectable and grayed out
  played: boolean | CardName.SELF_REPLICATING_ROBOTS // Default is true. If true, then shows resources on those cards. If false than shows discounted price.
  showOwner: boolean, // Default is false. If true then show the name of the card owner below.
}
export class SelectCard<T extends ICard> implements PlayerInput {
  public readonly inputType: PlayerInputType = PlayerInputType.SELECT_CARD;
  public config: Options;

  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public cards: Array<T>,
        public cb: (cards: Array<T>) => PlayerInput | undefined,
        config?: Partial<Options>,
  ) {
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

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1);
    if (input[0].length < this.config.min) {
      throw new Error('Not enough cards selected');
    }
    if (input[0].length > this.config.max) {
      throw new Error('Too many cards selected');
    }
    const cards: Array<T> = [];
    for (const cardName of input[0]) {
      const {card, idx} = PlayerInput.getCard(this.cards, cardName);
      cards.push(card);
      if (this.config.enabled?.[idx] === false) {
        throw new Error(`${cardName} is not available`);
      }
    }
    return this.cb(cards);
  }
}
