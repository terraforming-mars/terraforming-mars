
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class BiomassCombustors implements IProjectCard {
    public cost: number = 4;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Biomass Combustors";
    public text: string = "Requires 6% oxygen. Decrease any plant production 1 step and increse your energy production 2 steps. Lose 1 victory point.";
    public description: string = "Burning wood is easy";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 6 - player.requirementsBonus;
    }
    public play(player: Player, game: Game) {
        return new SelectPlayer(this.name, game.getPlayers(), "Select player to decrease", (otherPlayer: Player) => {
            if (otherPlayer.plantProduction < 1) {
                throw "No plant production to decrease for selected player";
            }
            otherPlayer.plantProduction--;
            player.energyProduction += 2;   
            player.victoryPoints--;
            return undefined;
        });
    }
}
