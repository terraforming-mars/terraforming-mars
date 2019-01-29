
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class LandClaim implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Land Claim";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Place your marker on a non-reserved area. Only you may place a tile here.";
    public description: string = "Acquiring strategic land areas";
    public play(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space for claim", (foundSpace: ISpace) => {
                if (foundSpace.tile !== undefined) {
                    reject("This tile is already taken");
                    return;
                }
                foundSpace.player = player;
                resolve();
            }));
        });
    }
}
