
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";

export class PhysicsComplex implements IActionCard, IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public name: string = "Physics Complex";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 6 energy to add a science resource to this card.";
    public text: string = "Gain 2 victory points for each science resource on this card.";
    public requirements: undefined;
    public description: string = "This used to cause blackouts before the invention of supercomputers.";
    public resourceType: ResourceType = ResourceType.SCIENCE;
    public canPlay(): boolean {
        return true;
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += 2 * player.getResourcesOnCard(this);
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy >= 6;
    }
    public action(player: Player) {
        player.energy -= 6;
        player.addResourceTo(this);
        return undefined;
    }
}
