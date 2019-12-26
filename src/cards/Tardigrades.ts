
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";

export class Tardigrades implements IProjectCard {
    public cost: number = 4;
    public nonNegativeVPIcon: boolean = true;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Tardigrades";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public getVictoryPoints(player: Player) {
        return Math.floor(player.getResourcesOnCard(this) / 4);
    }
    public play() {
        return undefined;
    }
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }    
}
