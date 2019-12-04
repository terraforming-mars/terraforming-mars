import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class SocietySupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Society Support";
    public play(player: Player, _game: Game) {     
        player.megaCreditProduction--;
        player.plantProduction++;
        player.energyProduction++;
        player.heatProduction++;			
        return undefined;
    }
}

