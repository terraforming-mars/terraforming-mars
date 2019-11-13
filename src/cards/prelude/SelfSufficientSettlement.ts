import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";

export class SelfSufficientSettlement extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL, Tags.CITY];
    public name: string = "Self-Sufficient Settlement";
    public text: string = "Place a city tile. Increase your MC production 2 steps.";
    public requirements: undefined;
    public description: string = "The investment was high, but it's paying off now";
    public play(player: Player, game: Game) {     
        return new SelectSpace("Select space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.megaCreditProduction += 2;
            return undefined;
        }); 
    }
}

