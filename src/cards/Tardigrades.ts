
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";
import { CardName } from '../CardName';

export class Tardigrades implements IProjectCard {
    public cost: number = 4;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.TARDIGRADES;
    public cardType: CardType = CardType.ACTIVE;

    public getVictoryPoints(player: Player): number {
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
