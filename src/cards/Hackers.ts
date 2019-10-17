
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
    public text: string = "Decrease your energy production 1 step and any mega credit production 2 steps. Increase your mega credit production 2 steps. Lose 1 victory point.";
    public description: string = "Very unethical, very illegal, very lucrative.";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public play(player: Player, game: Game) {
        return new SelectPlayer(game.getPlayersOrNeutral(), "Select player to decrease mega credit production 2 steps", (foundPlayer: Player) => {
            player.energyProduction--;
            foundPlayer.megaCreditProduction = Math.max(-5, foundPlayer.megaCreditProduction - 2);
            player.megaCreditProduction += 2;
            player.victoryPoints--;
            return undefined;
        });
    }
}

