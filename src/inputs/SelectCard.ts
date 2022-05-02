import {ICard} from '../cards/ICard';
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {CardName} from '@/common/cards/CardName';

export type Options = {
  max: number,
  min: number,
  selectBlueCardAction: boolean, // Default is false. When true, ???
  enabled: Array<boolean> | undefined, // When provided, then the cards with false in `enabled` are not selectable and grayed out
  played: boolean | CardName.SELF_REPLICATING_ROBOTS // Default is true. If true, then shows resources on those cards. If false than shows discounted price.
  showOwner: boolean, // Default is false. If true then show the name of the card owner below.
}
export class SelectCard<T extends ICard> implements PlayerInput {
  public readonly inputType: PlayerInputTypes = PlayerInputTypes.SELECT_CARD;
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
}
