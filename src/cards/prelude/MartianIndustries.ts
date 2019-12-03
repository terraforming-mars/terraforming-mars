import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class MartianIndustries extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Martian Industries";
    public play(player: Player, _game: Game) {
        player.energyProduction++ ;
	    player.steelProduction++ ;
	    player.megaCredits +=6 ;
	    return undefined;    
    }
}

