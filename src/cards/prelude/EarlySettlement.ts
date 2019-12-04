import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";

export class EarlySettlement extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL, Tags.CITY];
    public name: string = "Early Settlement";
    public play(player: Player, game: Game) {  
        player.plantProduction++;  	
        return new SelectSpace("Select space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            return undefined;
        }); 
    }
}

