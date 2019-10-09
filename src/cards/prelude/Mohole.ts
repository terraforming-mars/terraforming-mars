import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Mohole extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mohole";
    public text: string = "Increase your heat production 3 steps. Gain 3 heat.";
    public description: string = "Getting down to the heat of the mantle";
    public play(player: Player, _game: Game) {     
		    player.heatProduction +=3;
			player.heat += 3;
            return undefined;
    }
}

