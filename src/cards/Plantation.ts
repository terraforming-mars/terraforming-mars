
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { IUserData } from "../IUserData";
import { SpaceType } from "../SpaceType";

export class Plantation implements IProjectCard {
    public cost: number = 15;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Plantation";
    public text: string = "Requires 2 science tags. Place a greenery tile and raise oxygen 1 step.";
    public description: string = "By focusing on a limited area, helpful measures can be taken to improve local conditions for plant life";
    public needsUserData: IUserData = {
        spaceId: "Where to place greenery"
    };
    public play(player: Player, game: Game, userData: IUserData): void {
        if (player.getTagCount(Tags.SCIENCE) < 2) {
            throw "Requires 2 science tags to play";
        }
        game.addGreenery(player, userData.spaceId);
    }
}
