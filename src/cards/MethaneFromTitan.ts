
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MethaneFromTitan implements IProjectCard {
    public cost: number = 28;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Methane From Titan";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 2 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.heatProduction += 2;
        player.plantProduction += 2;
        player.victoryPoints += 2;
        return undefined;
    }
}
