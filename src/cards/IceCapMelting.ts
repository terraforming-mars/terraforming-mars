
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { IUserData } from "../IUserData";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export class IceCapMelting implements IProjectCard {
    public cost: number = 5;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: string = "Ice Cap Melting";
    public text: string = "Requires +2C or warmer. Place 1 ocean tile.";
    public description: string = "Getting the water back from the poles.";
    public needsUserData: IUserData = {
        spaceId: "Where to place ocean tile"
    };
    public play(player: Player, game: Game, userData: IUserData): void {
        if (game.temperature < 2) {
            throw "not warm enough, must be +2C or warmer";
        }
        game.addOceanTile(player, userData.spaceId);
    }
}
