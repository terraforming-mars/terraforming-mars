import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class SocietySupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Society Support";
    public text: string = "Decrease your MC production 1 step and increase plant, energy and heat production 1 step.";
    public requirements: undefined;
    public description: string = "Meeting the needs of society is good, because it's your society";
    public play(player: Player, _game: Game) {     
        player.megaCreditProduction--;
        player.plantProduction++;
        player.energyProduction++;
        player.heatProduction++;			
        return undefined;
    }
}

