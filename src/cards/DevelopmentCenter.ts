
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardName} from '../CardName';

export class DevelopmentCenter implements IActionCard, IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE, Tags.STEEL];
    public name = CardName.DEVELOPMENT_CENTER;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.energy > 0;
    }
    public action(player: Player, game: Game) {
      player.energy--;
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
}
