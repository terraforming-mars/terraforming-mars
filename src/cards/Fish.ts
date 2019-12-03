
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {ResourceType} from '../ResourceType';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {Player} from '../Player';
import {Game} from '../Game';

export class Fish implements IActionCard, IProjectCard {
  public cost: number = 9;
  public nonNegativeVPIcon: boolean = true;
  public tags: Array<Tags> = [Tags.ANIMAL];
  public name: string = 'Fish';
  public resourceType: ResourceType = ResourceType.ANIMAL;
  public cardType: CardType = CardType.ACTIVE;
  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() >= 2 - (player.getRequirementsBonus(game) * 2);
  }
  public onGameEnd(player: Player) {
    player.victoryPoints += player.getResourcesOnCard(this);
  }
  public play(_player: Player, game: Game) {
    if (game.getPlayers().length == 1) return undefined;
    return new SelectPlayer(
        game.getPlayers(),
        'Select player to decrease plant production 1 step',
        (found: Player) => {
          found.plantProduction = Math.max(0, found.plantProduction - 1);
          return undefined;
        }
    );
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
