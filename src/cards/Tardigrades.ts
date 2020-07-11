import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { ResourceType } from "../ResourceType";
import { CardName } from '../CardName';
import { IResourceCard } from './ICard';
import { Player } from "../Player";

export class Tardigrades implements IProjectCard, IResourceCard {
    public cost: number = 4;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.TARDIGRADES;
    public cardType: CardType = CardType.ACTIVE;

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 4);
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
