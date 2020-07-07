import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ISpace } from "../ISpace";
import { ResourceType } from "../ResourceType";
import { CardName} from "../CardName";
import { IResourceCard } from './ICard';
import { Board } from "../Board";


export class Pets implements IProjectCard, IResourceCard {
    public cost: number = 10;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.PETS;

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 2);
    }
    public onTilePlaced(_player: Player, space: ISpace) {
        if (Board.isCitySpace(space)) {
            this.resourceCount++;
        }
    }
    public play() {
        this.resourceCount++;
        return undefined;
    }
}
