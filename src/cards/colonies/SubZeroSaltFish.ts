import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { SelectPlayer } from "../../inputs/SelectPlayer";


export class SubZeroSaltFish implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = CardName.SUBZERO_SALT_FISH;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;

    public canAct(): boolean {
        return true;
    }

    private getPlayersWithPlantProduction(currentPlayer: Player, game: Game): Array<Player> {
        var players = game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0);
        if (players.length > 1) {
          players = players.filter((p) => p.id != currentPlayer.id)
        }
        return players
      }

    public canPlay(player: Player, game: Game): boolean {
        if (game.getPlayers().length > 1 && this.getPlayersWithPlantProduction(player, game).length === 0) return false;
        return game.getTemperature() >= -6 - (player.getRequirementsBonus(game) * 2);
      }

      public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
      }

    public play(player: Player, game: Game) {
        if (game.getPlayers().length === 1) return undefined;
    
        const players = this.getPlayersWithPlantProduction(player, game);
        if (players.length === 1) {
          players[0].setProduction(Resources.PLANTS,-1, game, player);
          return undefined;
        }
    
        return new SelectPlayer(
            players,
            'Select player to decrease plant production 1 step',
            (found: Player) => {
              found.setProduction(Resources.PLANTS,-1, game, player);
              return undefined;
            }
        );
      }

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
}