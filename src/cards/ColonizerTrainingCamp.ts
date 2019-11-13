
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ColonizerTrainingCamp implements IProjectCard {
    public cost: number = 8;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.STEEL];
    public name: string = "Colonizer Training Camp";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Oxygen must be 5% or less. Gain 2 victory points.";
    public requirements: string = "5% or less Oxygen";
    public description: string = "Preparing for settlement of the moons of Jupiter.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() <= 5 + player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.victoryPoints += 2;
        return undefined;
    }
}
