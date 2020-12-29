
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class BeginnerCorporation implements CorporationCard {
  public get tags() {
    return [];
  }
  public get startingMegaCredits() {
    return 42;
  }
  public get name() {
    return CardName.BEGINNER_CORPORATION;
  }
  public get cardType() {
    return CardType.CORPORATION;
  }
  public play(player: Player, game: Game) {
    for (let i = 0; i < 10; i++) {
      player.cardsInHand.push(game.dealer.dealCard());
    }
    return undefined;
  }

  public get metadata() {
    return {
      cardNumber: 'R00',
      description: 'You start with 42 MC. Instead of choosing from 10 cards during setup, you get 10 cards for free.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(42).nbsp.cards(10).digit;
      }),
    };
  }
}
