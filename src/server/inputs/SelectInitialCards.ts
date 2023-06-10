import {AndOptions} from './AndOptions';
import {ICorporationCard} from '../cards/corporation/ICorporationCard';
import {IProjectCard} from '../cards/IProjectCard';
import {IPlayer} from '../IPlayer';
import {SelectCard} from './SelectCard';
import {Merger} from '../cards/promo/Merger';
import {CardName} from '../../common/cards/CardName';
import {ICeoCard} from '../cards/ceos/ICeoCard';
import * as titles from '../../common/inputs/SelectInitialCards';


export class SelectInitialCards extends AndOptions {
  public override readonly inputType = 'initialCards';
  constructor(private player: IPlayer, cb: (corporation: ICorporationCard) => undefined) {
    super(() => {
      this.completed(corporation);
      cb(corporation);
      return undefined;
    });
    let corporation: ICorporationCard;
    this.title = ' ';
    this.buttonLabel = 'Start';

    this.options.push(
      new SelectCard<ICorporationCard>(
        titles.SELECT_CORPORATION_TITLE, undefined, player.dealtCorporationCards,
        (cards) => {
          if (cards.length !== 1) {
            throw new Error('Only select 1 corporation card');
          }
          corporation = cards[0];
          return undefined;
        }, {min: 1, max: 1},
      ),
    );

    // Give each player Merger in this variant
    if (player.game.gameOptions.twoCorpsVariant) {
      player.dealtPreludeCards.push(new Merger());
    }

    if (player.game.gameOptions.preludeExtension) {
      this.options.push(
        new SelectCard(
          titles.SELECT_PRELUDE_TITLE, undefined, player.dealtPreludeCards,
          (preludeCards: Array<IProjectCard>) => {
            if (preludeCards.length !== 2) {
              throw new Error('Only select 2 preludes');
            }
            player.preludeCardsInHand.push(...preludeCards);
            return undefined;
          }, {min: 2, max: 2},
        ),
      );
    }

    if (player.game.gameOptions.ceoExtension) {
      this.options.push(
        new SelectCard(
          titles.SELECT_CEO_TITLE, undefined, player.dealtCeoCards,
          (ceoCards: Array<ICeoCard>) => {
            if (ceoCards.length !== 1) {
              throw new Error('Only select 1 CEO');
            }
            // Push chosen card to hand
            player.ceoCardsInHand.push(ceoCards[0]);
            // Discard unchosen CEOs
            player.dealtCeoCards.filter((c) => c !== ceoCards[0]).forEach((c) => player.game.ceoDeck.discard(c));
            return undefined;
          }, {min: 1, max: 1},
        ),
      );
    }

    this.options.push(
      new SelectCard(
        titles.SELECT_PROJECTS_TITLE, undefined, player.dealtProjectCards,
        (cards) => {
          player.cardsInHand.push(...cards);
          return undefined;
        }, {min: 0, max: 10},
      ),
    );
  }

  private completed(corporation: ICorporationCard) {
    const player = this.player;
    // Check for negative M€
    const cardCost = corporation.cardCost !== undefined ? corporation.cardCost : player.cardCost;
    if (corporation.name !== CardName.BEGINNER_CORPORATION && player.cardsInHand.length * cardCost > corporation.startingMegaCredits) {
      player.cardsInHand = [];
      player.preludeCardsInHand = [];
      throw new Error('Too many cards selected');
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
}
