
import { IProjectCard } from "./IProjectCard";
import { ISpace } from "../ISpace";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { CardName } from '../CardName';

export class RoverConstruction implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = CardName.ROVER_CONSTRUCTION;
    public cardType: CardType = CardType.ACTIVE;

    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.CITY) {
            player.megaCredits += 2;
        }
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
