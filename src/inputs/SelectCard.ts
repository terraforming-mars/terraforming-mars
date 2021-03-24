import {ICard} from '../cards/ICard';
import {Message} from '../Message';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';

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

    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>): void {
      PlayerInput.checkInputLength(input, 1);
      if (input[0].length < this.minCardsToSelect) {
        throw new Error('Not enough cards selected');
      }
      if (input[0].length > this.maxCardsToSelect) {
        throw new Error('Too many cards selected');
      }
      const mappedCards: Array<T> = [];
      for (const cardName of input[0]) {
        mappedCards.push(player.getCard(this.cards, cardName));
        if (this.enabled?.[this.cards.findIndex((card) => card.name === cardName)] === false) {
          throw new Error('Selected unavailable card');
        }
      }
      player.runInputCb(this.cb(mappedCards));
    }
}
