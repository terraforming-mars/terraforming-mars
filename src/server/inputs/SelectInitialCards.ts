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
    if (player.game.gameOptions.twoCorpsVariant) {
      player.dealtPreludeCards.push(new Merger());
    }

    if (player.game.gameOptions.preludeExtension) {
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

    if (player.game.gameOptions.ceoExtension) {
      this.options.push(
        new SelectCard(titles.SELECT_CEO_TITLE, undefined, player.dealtCeoCards, {min: 1, max: 1}).andThen((ceoCards) => {
          if (ceoCards.length !== 1) {
            throw new InputError('Only select 1 CEO');
          }
          // Push chosen card to hand
          player.ceoCardsInHand.push(ceoCards[0]);
          // Discard unchosen CEOs
          player.dealtCeoCards.filter((c) => c !== ceoCards[0]).forEach((c) => player.game.ceoDeck.discard(c));
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
    // Check for negative M€
    const cardCost = corporation.cardCost !== undefined ? corporation.cardCost : player.cardCost;
    if (corporation.name !== CardName.BEGINNER_CORPORATION && player.cardsInHand.length * cardCost > corporation.startingMegaCredits) {
      player.cardsInHand = [];
      player.preludeCardsInHand = [];
      throw new InputError('Too many cards selected');
    }
    // discard all unpurchased cards
    player.dealtProjectCards.forEach((card) => {
      if (player.cardsInHand.includes(card) === false) {
        player.game.projectDeck.discard(card);
      }
    });

    player.dealtCorporationCards.forEach((card) => {
      if (card.name !== corporation.name) {
        player.game.corporationDeck.discard(card);
      }
    });
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
