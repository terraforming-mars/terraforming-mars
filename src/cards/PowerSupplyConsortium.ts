
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { Resources } from '../Resources';

export class PowerSupplyConsortium implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Power Supply Consortium";
    public cardType: CardType = CardType.AUTOMATED;

    private getPlayersWithEnergyProduction(currentPlayer: Player, game: Game): Array<Player> {
        var players = game.getPlayers().filter((p) => p.getProduction(Resources.ENERGY) > 0);
        if (players.length > 1) {
          players = players.filter((p) => p.id != currentPlayer.id)
        }
        return players
    }

    private doPlay(currentPlayer: Player, targetPlayer: Player, game: Game): void {
        targetPlayer.setProduction(Resources.ENERGY,-1,game,currentPlayer);
        currentPlayer.setProduction(Resources.ENERGY);
    }

    public canPlay(player: Player, game: Game): boolean {
        if (player.getTagCount(Tags.ENERGY) < 2) return false;
        if (game.getPlayers().length == 1) return true;
        return this.getPlayersWithEnergyProduction(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            player.setProduction(Resources.ENERGY);
            return undefined;
        }

        const players = this.getPlayersWithEnergyProduction(player, game);

        if (players.length === 1) {
            this.doPlay(player, players[0], game);
            return undefined;
        }

        return new SelectPlayer(
            players, 
            "Select player to decrease energy", 
            (foundPlayer: Player) => {
                if (foundPlayer.getProduction(Resources.ENERGY) < 1) {
                    throw "Player must have energy production to remove";
                }
                foundPlayer.setProduction(Resources.ENERGY,-1,game,player);
                player.setProduction(Resources.ENERGY);
                return undefined;
            }
        );
    }
}
