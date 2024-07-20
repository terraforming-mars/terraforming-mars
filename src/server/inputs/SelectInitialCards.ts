import * as titles from '../../common/inputs/SelectInitialCards';
import {ICorporationCard} from '../cards/corporation/ICorporationCard';
import {IPlayer} from '../IPlayer';
import {SelectCard} from './SelectCard';
import {Merger} from '../cards/promo/Merger';
import {CardName} from '../../common/cards/CardName';
import {SelectInitialCardsModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';
import {OptionsInput} from './OptionsPlayerInput';
import {InputResponse, isSelectInitialCardsResponse} from '../../common/inputs/InputResponse';

export class SelectInitialCards extends OptionsInput<undefined> {
  constructor(private player: IPlayer, cb: (corporation: ICorporationCard) => undefined) {
    super('initialCards', '', []);
    const game = player.game;
    let corporation: ICorporationCard;
    this.title = ' ';
    this.buttonLabel = 'Start';

    this.options.push(
      new SelectCard<ICorporationCard>(
        titles.SELECT_CORPORATION_TITLE, undefined, player.dealtCorporationCards, {min: 1, max: 1}).andThen(
        (cards) => {
          if (cards.length !== 1) {
            throw new InputError('Only select 1 corporation card');
          }
          corporation = cards[0];
          return undefined;
        }),
    );

    // Give each player Merger in this variant
    if (game.gameOptions.twoCorpsVariant) {
      player.dealtPreludeCards.push(new Merger());
    }

    if (game.gameOptions.preludeExtension) {
      this.options.push(
        new SelectCard(titles.SELECT_PRELUDE_TITLE, undefined, player.dealtPreludeCards, {min: 2, max: 2})
          .andThen((preludeCards) => {
            if (preludeCards.length !== 2) {
              throw new InputError('Only select 2 preludes');
            }
            player.preludeCardsInHand.push(...preludeCards);
            return undefined;
          }));
    }

    if (game.gameOptions.ceoExtension) {
      this.options.push(
        new SelectCard(titles.SELECT_CEO_TITLE, undefined, player.dealtCeoCards, {min: 1, max: 1}).andThen((ceoCards) => {
          if (ceoCards.length !== 1) {
            throw new InputError('Only select 1 CEO');
          }
          player.ceoCardsInHand.push(ceoCards[0]);
          return undefined;
        }));
    }

    this.options.push(
      new SelectCard(titles.SELECT_PROJECTS_TITLE, undefined, player.dealtProjectCards, {min: 0, max: 10})
        .andThen((cards) => {
          player.cardsInHand.push(...cards);
          return undefined;
        }),
    );
    this.andThen(() => {
      this.completed(corporation);
      // TODO(kberg): This is probably broken. Stop subclassing AndOptions.
      cb(corporation);
      return undefined;
    });
  }

  private completed(corporation: ICorporationCard) {
    const player = this.player;
    const game = player.game;
    // Check for negative M€
    const cardCost = corporation.cardCost !== undefined ? corporation.cardCost : player.cardCost;
    if (corporation.name !== CardName.BEGINNER_CORPORATION && player.cardsInHand.length * cardCost > corporation.startingMegaCredits) {
      player.cardsInHand = [];
      player.preludeCardsInHand = [];
      throw new InputError('Too many cards selected');
    }

    for (const card of player.dealtProjectCards) {
      if (player.cardsInHand.includes(card) === false) {
        game.projectDeck.discard(card);
      }
    }

    for (const card of player.dealtCorporationCards) {
      if (card.name !== corporation.name) {
        game.corporationDeck.discard(card);
      }
    }

    for (const card of player.dealtPreludeCards) {
      if (player.preludeCardsInHand.includes(card) === false) {
        game.preludeDeck.discard(card);
      }
    }

    for (const card of player.dealtCeoCards) {
      if (player.ceoCardsInHand.includes(card) === false) {
        game.ceoDeck.discard(card);
      }
    }
  }

  public toModel(player: IPlayer): SelectInitialCardsModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'initialCards',
      options: this.options.map((option) => option.toModel(player)),
    };
  }

  public process(input: InputResponse, player: IPlayer) {
    if (!isSelectInitialCardsResponse(input)) {
      throw new InputError('Not a valid SelectInitialCardsResponse');
    }
    if (input.responses.length !== this.options.length) {
      throw new InputError('Incorrect options provided');
    }
    for (let i = 0; i < input.responses.length; i++) {
      player.runInput(input.responses[i], this.options[i]);
    }
    return this.cb(undefined);
  }
}
