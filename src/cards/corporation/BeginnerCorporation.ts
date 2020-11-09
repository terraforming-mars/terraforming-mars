
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class BeginnerCorporation implements CorporationCard {
    public tags = [];
    public startingMegaCredits: number = 42;
    public name = CardName.BEGINNER_CORPORATION;
    public cardType = CardType.CORPORATION;
    public play(player: Player, game: Game) {
      for (let i = 0; i < 10; i++) {
        player.cardsInHand.push(game.dealer.dealCard());
      }
      return undefined;
    }
}
