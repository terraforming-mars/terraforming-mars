
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";
import { ResourceType } from "../ResourceType";
import { CardName} from "../CardName";


export class Pets implements IProjectCard {
    public cost: number = 10;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = CardName.PETS;
    public canPlay(): boolean {
        return true;
    }
    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.CITY) {
            player.addResourceTo(this);
        }
    }
    public play(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}
