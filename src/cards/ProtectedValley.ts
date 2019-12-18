
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";
import { Tags } from "./Tags";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class ProtectedValley implements IProjectCard {
    public cost: number = 23;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "Protected Valley";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace(
            "Select space reserved for ocean to place greenery tile", 
            game.getAvailableSpacesForOcean(player), 
            (space: ISpace) => {
                player.megaCreditProduction += 2;
                return game.addGreenery(player, space.id, SpaceType.OCEAN);
            }
        );
    }
}
