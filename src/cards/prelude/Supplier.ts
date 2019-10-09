import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";


export class Supplier extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Supplier";
    public text: string = "Increase energy production 2 steps. Gain 4 steel.";
    public description: string = "A subcontractor provides power and material for your project";
    public play(player: Player, _game: Game) {
            player.energyProduction +=2;
			player.steel +=4;
            return undefined;
    }
}

