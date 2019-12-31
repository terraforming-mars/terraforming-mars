
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { Resources } from "../Resources";

export class HeatTrappers implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Heat Trappers";
    public cardType: CardType = CardType.AUTOMATED;

    private getPlayersWithHeatProduction(currentPlayer: Player, game: Game): Array<Player> {
        var players = game.getPlayers().filter((p) => p.getProduction(Resources.HEAT) > 1);

        if (players.length > 1) {
          players = players.filter((p) => p.id != currentPlayer.id)
        }
        return players
    }

    private doPlay(currentPlayer: Player, targetPlayer: Player, game: Game): void {
        targetPlayer.setProduction(Resources.HEAT,-2, game, currentPlayer);
        currentPlayer.energyProduction++;
    }

    public canPlay(player: Player, game: Game): boolean {
        if (game.getPlayers().length == 1) return true;
        return this.getPlayersWithHeatProduction(player, game).length > 0;
    }
    
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            player.energyProduction++;
            return undefined;
        }
        const players = this.getPlayersWithHeatProduction(player, game);

        if (players.length === 1) {
            this.doPlay(player, players[0],game);
            return undefined;
        }
        
        return new SelectPlayer(
            players, 
            "Select player to decrease heat production 2 steps", 
            (otherPlayer: Player) => {
                this.doPlay(player, otherPlayer,game);
                return undefined;
            }
        );
    }
    public getVictoryPoints() {
        return -1;
    }
}
