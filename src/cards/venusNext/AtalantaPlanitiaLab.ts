import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';

export class AtalantaPlanitiaLab implements IProjectCard {
  public cost = 10;
  public tags = [Tags.VENUS, Tags.SCIENCE];
  public name = CardName.ATALANTA_PLANITIA_LAB;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 3;
  }
  public play(player: Player, game: Game) {
    player.cardsInHand.push(game.dealer.dealCard());
    player.cardsInHand.push(game.dealer.dealCard());
    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
}
