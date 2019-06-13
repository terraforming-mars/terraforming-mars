
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";

export class Pets implements IProjectCard {
    public cost: number = 10;
    public animals: number = 0;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Pets";
    public text: string = "ANIMALS MAY NOT BE REMOVED FROM THIS CARD. Add 1 animal to this card every time a city tile is placed. Gain 1 victory point for every 2 animals on this card.";
    public description: string = "It wouldn't be the same without them";
    public canPlay(): boolean {
        return true;
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += Math.floor(this.animals / 2);
    }
    public onTilePlaced(_player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.CITY) {
            this.animals++;
        }
    }
    public play() {
        this.animals++;
        return undefined;
    }
}
