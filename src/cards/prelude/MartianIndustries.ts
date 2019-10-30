import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class MartianIndustries extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Martian Industries";
    public text: string = "Increase energy and stell production 1 step. Gain 6 MC.";
    public description: string = "Allowing a steely growth of the Martian society";
    public play(player: Player, _game: Game) {
        player.energyProduction++ ;
	    player.steelProduction++ ;
	    player.megaCredits +=6 ;
	    return undefined;    
    }
}

