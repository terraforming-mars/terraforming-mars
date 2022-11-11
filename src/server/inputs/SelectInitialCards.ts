
import {AndOptions} from './AndOptions';
import {ICorporationCard} from '../cards/corporation/ICorporationCard';
import {IProjectCard} from '../cards/IProjectCard';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {SelectCard} from './SelectCard';
import {Merger} from '../cards/promo/Merger';
import {CardName} from '../CardName';


export class SelectInitialCards extends AndOptions implements PlayerInput {
  public override inputType = PlayerInputType.SELECT_INITIAL_CARDS;
  constructor(player: Player, cb: (corporation: ICorporationCard) => undefined) {
    super(() => {
      cb(corporation);
      return undefined;
    });
    let corporation: ICorporationCard;
    this.title = ' ';
    this.buttonLabel = 'Start';

    this.options.push(
      new SelectCard<ICorporationCard>(
        'Select corporation', undefined, player.dealtCorporationCards,
        (cards) => {
          if (cards.length !== 1) {
            throw new Error('Only select 1 corporation card');
          }
          corporation = cards[0];
          return undefined;
        }, {min: 1, max: 1},
      ),
    );

    // Give each player Merger in this variant, or an extra prelude if they already have Merger
    if (player.game.gameOptions.twoCorpsVariant) {
      if (!player.dealtPreludeCards.some((card) => card.name === CardName.MERGER)) {
        player.dealtPreludeCards.push(new Merger());
      } else {
        // player.dealtPreludeCards.push(player.game.dealer.dealPreludeCard());
        player.dealtPreludeCards.push(player.game.preludeDeck.draw(player.game));
      }
    

    if (player.game.gameOptions.preludeExtension) {
      this.options.push(
        new SelectCard(
          'Select 2 Prelude cards', undefined, player.dealtPreludeCards,
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

    this.options.push(
      new SelectCard(
        'Select initial cards to buy', undefined, player.dealtProjectCards,
        (cards) => {
          player.cardsInHand.push(...cards);
          return undefined;
        }, {min: 0, max: 10},
      ),
    );
  }
}
