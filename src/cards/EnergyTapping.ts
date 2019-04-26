
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class EnergyTapping implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Energy Tapping";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease any energy production 1 step and increase your own 1 step. Lose 1 victory point.";
    public description: string = "They need it. But we need it more.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return new SelectPlayer(this.name, game.getPlayers(), "Select player to decrease energy production", (foundPlayer: Player) => {
            if (foundPlayer.energyProduction < 1) {
                throw "Selected player has no energy production";
            }
            foundPlayer.energyProduction--;
            player.energyProduction++;
            player.victoryPoints--;
            return undefined;
        });
    }
}
