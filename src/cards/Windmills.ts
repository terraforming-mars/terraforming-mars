
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Windmills implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Windmills";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 7% oxygen. Incease your energy production 1 step.";
    public description: string = "At least we have more useful winds";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 7) {
            return Promise.reject("Not enough oxygen");
        }
        player.energyProduction++;
        player.victoryPoints++;
        return Promise.resolve();
    }
}
