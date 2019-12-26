
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";

export class SecurityFleet implements IActionCard, IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Security Fleet";
    public resourceType: ResourceType = ResourceType.FIGHTER;
    public canPlay(): boolean {
        return true;
    }
    public getVictoryPoints(player: Player) {
        return player.getResourcesOnCard(this);
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.titanium > 0;
    }
    public action(player: Player) {
        player.titanium--;
        player.addResourceTo(this);
        return undefined;
    }
}
