
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class Plantation implements IProjectCard {
    public cost: number = 15;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Plantation";
    public text: string = "Requires 2 science tags. Place a greenery tile and raise oxygen 1 step.";
    public description: string = "By focusing on a limited area, helpful measures can be taken to improve local conditions for plant life";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", game.getAvailableSpacesForGreenery(player), (space: ISpace) => {
            return game.addGreenery(player, space.id);
        });
    }
}
