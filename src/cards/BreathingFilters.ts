
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class BreathingFilters implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Breathing Filters";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 7% oxygen";
    public description: string = "Allowing easy access to the still quite harsh environment";
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 7) {
            throw "Requires 7% oxygen";
        }
        player.victoryPoints += 2;
        return undefined;
    }
}
