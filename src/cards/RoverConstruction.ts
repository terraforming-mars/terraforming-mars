
import { IProjectCard } from "./IProjectCard";
import { ISpace } from "../ISpace";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { TileType } from "../TileType";

export class RoverConstruction implements IProjectCard {
    public cost: number = 8;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Rover Construction";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Gain 1 victory point. When any city tile is placed, gain 2 mega credit.";
    public requirements: undefined;
    public description: string = "Providing safe transport vehicles.";
    public canPlay(): boolean {
        return true;
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.CITY) {
            player.megaCredits += 2;
        }
    }
    public play(player: Player) {
        player.victoryPoints++;
        return undefined;
    }
}
