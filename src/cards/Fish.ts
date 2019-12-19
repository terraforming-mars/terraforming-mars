
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

  private getPlayersWithPlantProduction(currentPlayer: Player, game: Game): Array<Player> {
    var players = game.getPlayers().filter((p) => p.plantProduction > 0);
    if (players.length > 1) {
      players = players.filter((p) => p.id != currentPlayer.id)
    }
    return players
  }

  private doPlantsReduction(player: Player) {
    player.plantProduction = Math.max(0, player.plantProduction - 1);
  }

  public canPlay(player: Player, game: Game): boolean {
    if (game.getPlayers().length > 1 && this.getPlayersWithPlantProduction(player, game).length === 0) return false;
    return game.getTemperature() >= 2 - (player.getRequirementsBonus(game) * 2);
  }
  public onGameEnd(player: Player) {
    player.victoryPoints += player.getResourcesOnCard(this);
  }
  public play(player: Player, game: Game) {
    if (game.getPlayers().length == 1) return undefined;

    const players = this.getPlayersWithPlantProduction(player, game);
    if (players.length === 1) {
      this.doPlantsReduction(players[0]);
      return undefined;
    }

    return new SelectPlayer(
        players,
        'Select player to decrease plant production 1 step',
        (found: Player) => {
          this.doPlantsReduction(found);
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
