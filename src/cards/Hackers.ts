
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class Hackers implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public name: string = "Hackers";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            player.megaCreditProduction += 2;
            player.energyProduction--;
            player.victoryPoints--;
            return undefined;
        }
        return new SelectPlayer(game.getPlayers(), "Select player to decrease mega credit production 2 steps", (foundPlayer: Player) => {
            player.energyProduction--;
            foundPlayer.megaCreditProduction = Math.max(-5, foundPlayer.megaCreditProduction - 2);
            player.megaCreditProduction += 2;
            player.victoryPoints--;
            return undefined;
        });
    }
}

