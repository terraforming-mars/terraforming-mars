
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";

export class Windmills implements IProjectCard {
    public cost: number = 6;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Windmills";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 7% oxygen. Incease your energy production 1 step. Gain 1 victory point.";
    public description: string = "At least we have more useful winds";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 7 - player.getRequirementsBonus(game);
    }
    public play(player: Player): PlayerInput | undefined {
        player.energyProduction++;
        player.victoryPoints++;
        return undefined;
    }
}
