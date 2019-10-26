import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class BiosphereSupport extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Biosphere Support";
    public text: string = "Decrease MC production 1 step and increase plant production 2 steps.";
    public description: string = "The greening of the red planet has begun";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -4;
    }    
    public play(player: Player, _game: Game) {
        player.megaCreditProduction-- ;
        player.plantProduction +=2 ;
	    return undefined;    
    }
}

