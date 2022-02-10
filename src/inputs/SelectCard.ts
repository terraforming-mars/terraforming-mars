
import {ICard} from '../cards/ICard';
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';

export class SelectCard<T extends ICard> implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_CARD;

  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public cards: Array<T>,
        public cb: (cards: Array<T>) => PlayerInput | undefined,
        public maxCardsToSelect: number = 1,
        public minCardsToSelect: number = 1,
        public selectBlueCardAction: boolean = false,
        public enabled?: Array<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
        public played: boolean = true, // If true, then shows resources on those cards. If false than shows discounted price.
        public showOwner?: boolean,
  ) {
    this.buttonLabel = buttonLabel;
  }
}
