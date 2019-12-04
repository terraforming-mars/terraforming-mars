import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class BiosphereSupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Biosphere Support";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -4;
    }    
    public play(player: Player, _game: Game) {
        player.megaCreditProduction-- ;
        player.plantProduction +=2 ;
	    return undefined;    
    }
}

