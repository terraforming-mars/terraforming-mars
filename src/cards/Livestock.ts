
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";

export class Livestock implements IActionCard, IProjectCard {
    public cost: number = 13;
    public nonNegativeVPIcon: boolean = true;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Livestock";
    public actionText: string = "Add an animal to this card";
    public text: string = "Requires 9% oxygen. Decrease your plant production 1 step and increase your mega credit production 2 steps. Gain 1 victory point per animal on this card";
    public description: string = "Providing meat, wool, leather, etc.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 9 - player.getRequirementsBonus(game) && player.plantProduction >= 1;
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += player.getResourcesOnCard(this);
    }
    public play(player: Player) {
        player.plantProduction--;
        player.megaCreditProduction += 2;
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}
    
