import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Biofuels extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Biofuels";
    public text: string = "Increase your energy and plant production 1 step. Gain 2 plants.";
    public description: string = "Organic production of fuels and fertilizers";
    public play(player: Player, _game: Game) {     
            player.energyProduction++;
			player.plantProduction++;
			player.plants += 2;
            return undefined;
    }
}

