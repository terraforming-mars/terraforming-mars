
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";

export class GHGProducingBacteria implements IActionCard, IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "GHG Producing Bacteria";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 microbe to this card, or remove 2 microbes to raise temperature 1 step.";
    public resourceType: ResourceType = ResourceType.MICROBE;
    public text: string = "Requires 4% oxygen";
    public description: string = "Working for the biosphere and the atmosphere at the same time.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        if (player.getResourcesOnCard(this) > 1) {
            return new OrOptions(
                new SelectOption("Add 1 microbe to this card", () => {
                    player.addResourceTo(this);
                    return undefined;
                }),
                new SelectOption("Remove 2 microbes to raise temperature 1 step", () => {
                    player.removeResourceFrom(this,2);
                    return game.increaseTemperature(player, 1);
                })
            );
        }
        player.addResourceTo(this);
        return undefined;
    }
}
