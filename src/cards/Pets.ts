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
    public onTilePlaced(player: Player, space: ISpace) {
        if (Board.isCitySpace(space)) {
            player.addResourceTo(this);
        }
    }
    public play(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}
