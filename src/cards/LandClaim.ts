
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";

export class LandClaim implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Land Claim";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Place your marker on a non-reserved area. Only you may place a tile here.";
    public description: string = "Acquiring strategic land areas";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                const foundSpace = game.getSpace(spaceId);
                if (foundSpace.tile !== undefined) {
                    reject("This tile is already taken");
                    return;
                }
                foundSpace.player = player;
                resolve();
            });
        });
    }
}
