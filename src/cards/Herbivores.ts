
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { ISpace } from "../ISpace";
import { ResourceType } from "../ResourceType";
import { TileType } from "../TileType";
import { Resources } from '../Resources';

export class Herbivores implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Herbivores";
    public resourceType: ResourceType = ResourceType.ANIMAL;

    private getPlayersWithPlantProduction(currentPlayer: Player, game: Game): Array<Player> {
        var players = game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0);

        if (players.length > 1) {
          players = players.filter((p) => p.id != currentPlayer.id)
        }
        return players
    }

    private doPlay(currentPlayer: Player, targetPlayer: Player, game: Game): void {
        targetPlayer.setProduction(Resources.PLANTS,-1,game,currentPlayer);
        currentPlayer.addResourceTo(this);
    }

    public canPlay(player: Player, game: Game): boolean {
        if ( ! (game.getOxygenLevel() >= 8 - player.getRequirementsBonus(game))) return false;
        if (game.getPlayers().length === 1) return true;
        return this.getPlayersWithPlantProduction(player, game).length > 0;
    }

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }

    public onTilePlaced(cardOwner: Player, space: ISpace) {
        if (space.player === cardOwner && space.tile !== undefined && space.tile.tileType === TileType.GREENERY) {
            cardOwner.addResourceTo(this);
        }
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            player.addResourceTo(this);
            return undefined;
        }

        const players = this.getPlayersWithPlantProduction(player, game);

        if (players.length === 1) {
            this.doPlay(player, players[0],game);
            return undefined;
        }

        return new SelectPlayer(
            players, 
            "Select player to decrease plant production 1 step", 
            (foundPlayer: Player) => {
                this.doPlay(player, foundPlayer,game)
                return undefined;
            }
        );
    }
}
