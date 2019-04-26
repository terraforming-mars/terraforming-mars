
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class GHGProducingBacteria implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "GHG Producing Bacteria";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 microbe to this card, or remove 2 microbes to raise temperature 1 step.";
    public microbes: number = 0;
    public text: string = "Requires 4% oxygen";
    public description: string = "Working for the biosphere and the atmosphere at the same time.";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 4;
    }
    public play(_player: Player, game: Game) {
        if (game.getOxygenLevel() < 4) {
            throw "Requires 4% oxygen";
        }
        return undefined;
    }
    public action(player: Player, game: Game) {
        if (this.microbes > 1) {
            return new OrOptions(
                new SelectOption(this.name, "Add 1 microbe", () => {
                    this.microbes++;
                    return undefined;
                }),
                new SelectOption(this.name, "Remove 2 microbes to raise temperature 1 step", () => {
                    this.microbes -= 2;
                    return game.increaseTemperature(player, 1);
                })
            );
        }
        this.microbes++;
        return undefined;
    }
}
