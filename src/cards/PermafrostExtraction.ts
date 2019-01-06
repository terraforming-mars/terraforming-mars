
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { IUserData } from "../IUserData";

export class PermafrostExtraction implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public cost: number = 8;
    public name: string = "Permafrost Extraction";
    public text: string = "Requires -8C or warmer. Place 1 ocean tile.";
    public description: string = "Thawing the subsurface";
    public needsUserData: IUserData = {
        spaceId: "Where to place ocean tile"
    };
    public play(player: Player, game: Game, userData: IUserData): void {
        if (game.temperature < -8) {
            throw "Temperature must be -8C or warmer";
        }
        game.addOceanTile(player, userData.spaceId);
    }
}
