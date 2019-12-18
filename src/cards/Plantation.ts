
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
    public canPlay(player: Player, game: Game): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 && game.getAvailableSpacesOnLand(player).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", game.getAvailableSpacesForGreenery(player), (space: ISpace) => {
            return game.addGreenery(player, space.id);
        });
    }
}
