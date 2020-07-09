import { IProjectCard } from "./IProjectCard";
import { ISpace } from "../ISpace";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { CardName } from '../CardName';
import { Board } from "../Board";

export class RoverConstruction implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.ROVER_CONSTRUCTION;
    public cardType: CardType = CardType.ACTIVE;

    public onTilePlaced(player: Player, space: ISpace) {
        if (Board.isCitySpace(space)) {
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
