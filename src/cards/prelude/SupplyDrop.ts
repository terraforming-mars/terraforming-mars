import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";


export class SupplyDrop extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Supply Drop";
    public text: string = "Gain 3 titanium, 8 steel and 3 plants.";
    public description: string = "Let you speed up the colonization";
    public play(player: Player, _game: Game) {
			player.titanium +=3;
			player.steel +=8;
			player.plants +=3;			
            return undefined;
    }
}

