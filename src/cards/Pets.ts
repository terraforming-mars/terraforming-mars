
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";
import { ResourceType } from "../ResourceType";

export class Pets implements IProjectCard {
    public cost: number = 10;
    public nonNegativeVPIcon: boolean = true;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Pets";
    public text: string = "ANIMALS MAY NOT BE REMOVED FROM THIS CARD. Add 1 animal to this card every time a city tile is placed. Gain 1 victory point for every 2 animals on this card.";
    public requirements: undefined;
    public description: string = "It wouldn't be the same without them";
    public canPlay(): boolean {
        return true;
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += Math.floor(player.getResourcesOnCard(this) / 2);
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
