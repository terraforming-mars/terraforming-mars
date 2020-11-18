import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {IActionCard} from './ICard';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class AICentral implements IActionCard, IProjectCard {
  public cost = 21;
  public tags = [Tags.SCIENCE, Tags.STEEL];
  public cardType = CardType.ACTIVE;
  public name = CardName.AI_CENTRAL;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 3 && player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public getVictoryPoints() {
    return 1;
  }
  public action(player: Player, game: Game) {
    player.cardsInHand.push(game.dealer.dealCard(), game.dealer.dealCard());
    return undefined;
  }
}
