
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ResourceType} from '../ResourceType';
import {SelectPlayer} from '../inputs/SelectPlayer';
import { Resources } from '../Resources';

export class Birds implements IActionCard, IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = 'Birds';
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public cardType: CardType = CardType.ACTIVE;

    private getPlayersWithPlantProduction(currentPlayer: Player, game: Game): Array<Player> {
      var players = game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 1);
      if (players.length > 1) {
        players = players.filter((p) => p.id != currentPlayer.id)
      }
      return players
    }

    public canPlay(player: Player, game: Game): boolean {
      if (game.getPlayers().length > 1 && this.getPlayersWithPlantProduction(player, game).length < 1) {
        return false;
      }
      return game.getOxygenLevel() >= 13 - player.getRequirementsBonus(game);
    }
    public getVictoryPoints(player: Player) {
      return player.getResourcesOnCard(this);
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length == 1) return undefined;

      const players = this.getPlayersWithPlantProduction(player, game);

      if (players.length === 1) {
        players[0].setProduction(Resources.PLANTS,-2,game,player);
        return undefined;
      }

      return new SelectPlayer(
        players,
        'Select player to decrease plant production 2 steps',
        (foundPlayer: Player) => {
          if (foundPlayer.getProduction(Resources.PLANTS) < 2) {
            throw new Error('Player needs at least 2 plant production');
          }
          foundPlayer.setProduction(Resources.PLANTS,-2,game,player);
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
