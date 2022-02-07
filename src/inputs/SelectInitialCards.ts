
import {AndOptions} from './AndOptions';
import {CorporationCard} from '../cards/corporation/CorporationCard';
import {IProjectCard} from '../cards/IProjectCard';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {SelectCard} from './SelectCard';

export class SelectInitialCards extends AndOptions implements PlayerInput {
  public override inputType = PlayerInputTypes.SELECT_INITIAL_CARDS;
  constructor(player: Player, cb: (corporation: CorporationCard) => undefined) {
    super(() => {
      cb(corporation);
      return undefined;
    });
    let corporation: CorporationCard;
    this.title = ' ';
    this.buttonLabel = 'Start';

    this.options.push(
      new SelectCard<CorporationCard>(
        'Select corporation', undefined, player.dealtCorporationCards,
        (foundCards: Array<CorporationCard>) => {
          corporation = foundCards[0];
          return undefined;
        },
      ),
    );

    if (player.game.gameOptions.preludeExtension) {
      this.options.push(
        new SelectCard(
          'Select 2 Prelude cards', undefined, player.dealtPreludeCards,
          (preludeCards: Array<IProjectCard>) => {
            player.preludeCardsInHand.push(...preludeCards);
            return undefined;
          }, 2, 2,
        ),
      );
    }

    this.options.push(
      new SelectCard(
        'Select initial cards to buy', undefined, player.dealtProjectCards,
        (foundCards: Array<IProjectCard>) => {
          player.cardsInHand.push(...foundCards);
          return undefined;
        }, 10, 0,
      ),
    );
  }
}
